// Adds an invisible, searchable/selectable text layer on top of the
// rasterized resume page inside a jsPDF document.
//
// Why: html2canvas produces a flat image — real ATS software (and recruiters
// with Ctrl+F) cannot read a single word from an image-only PDF. Many ATS
// silently score such resumes as empty. This overlay draws each word from the
// live DOM at its exact position with renderingMode "invisible": the page
// looks identical, but the text becomes real, machine-readable content.

const MM_PER_PX = 25.4 / 96
const PT_PER_MM = 72 / 25.4

// Collect [word, clientRect] pairs for every word inside `rootEl`.
function collectWords(rootEl) {
  const words = []
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      const cs = getComputedStyle(parent)
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let textNode
  while ((textNode = walker.nextNode())) {
    const value = textNode.nodeValue
    const wordRe = /\S+/g
    let m
    while ((m = wordRe.exec(value)) !== null) {
      const range = document.createRange()
      range.setStart(textNode, m.index)
      range.setEnd(textNode, m.index + m[0].length)
      const rect = range.getBoundingClientRect()
      if (rect.width > 0.5 && rect.height > 0.5) {
        words.push({ text: m[0], rect })
      }
      range.detach?.()
    }
  }
  return words
}

// Sanitize text for standard PDF PostScript font encoding (WinAnsi).
// Strips bullet characters and normalizes Unicode dashes and quotes so
// ATS parsers get clean text and jsPDF never outputs corrupted "%Ï" bytes.
function sanitizeForPdf(str) {
  return String(str || "")
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "") // remove bullet glyphs
    .replace(/[\u2013\u2014]/g, "-") // en-dash, em-dash -> ASCII hyphen
    .replace(/[\u201C\u201D]/g, '"') // smart quotes -> ASCII quote
    .replace(/[\u2018\u2019]/g, "'") // curly apostrophes -> ASCII apostrophe
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "") // restrict to Latin-1
    .trim();
}

/**
 * Overlay the invisible text layer.
 *
 * @param {jsPDF} pdf       jsPDF instance (unit: mm, portrait A4)
 * @param {Element} rootEl  the DOM element that was rasterized
 * @param {Object} geo      geometry of the rasterized image on the page (mm)
 *   geo.imgX, geo.imgY  — top-left of the image on the page
 *   geo.imgW, geo.imgH  — rendered size of the image on the page
 * @returns {number} words written
 */
export function addSearchableTextLayer(pdf, rootEl, geo) {
  if (!pdf || !rootEl || !geo) return 0
  try {
    const rootRect = rootEl.getBoundingClientRect()
    if (!rootRect.width || !rootRect.height) return 0

    const kx = geo.imgW / rootRect.width  // css px → mm
    const ky = geo.imgH / rootRect.height

    const words = collectWords(rootEl)
    let written = 0

    pdf.setFont('helvetica', 'normal')

    for (const { text, rect } of words) {
      const cleanText = sanitizeForPdf(text)
      if (!cleanText) continue

      const x = geo.imgX + (rect.left - rootRect.left) * kx
      const w = rect.width * kx
      const hCss = rect.height * ky // mm
      // Baseline: ~80% down the glyph box, nudged for jsPDF baseline handling
      const y = geo.imgY + (rect.top - rootRect.top) * ky + hCss * 0.8

      let fontSize = Math.max(1, hCss * PT_PER_MM * 0.78)
      pdf.setFontSize(fontSize)
      const natural = pdf.getTextWidth(cleanText)
      if (natural > 0) {
        fontSize = Math.max(0.5, Math.min(24, fontSize * (w / natural)))
        pdf.setFontSize(fontSize)
      }

      try {
        pdf.text(cleanText, x, y, { renderingMode: 'invisible' })
        written++
      } catch {
        // If an individual token cannot be rendered invisibly, skip it
        // rather than drawing visible text that might obscure the resume image.
      }
    }
    return written
  } catch (err) {
    // The text layer is an enhancement — never break the download over it.
    console.error('Searchable text layer failed (PDF still exported):', err)
    return 0
  }
}
