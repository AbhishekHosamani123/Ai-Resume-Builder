// Visual verification: compare each downloaded PDF against the on-screen
// preview screenshot captured during export.
// - extracts the JPEG page image embedded in the (jsPDF raster) PDF
// - renders PDF image + preview PNG in headless Chrome
// - downsamples both to a shared grid and reports similarity + ink layout
import { chromium } from 'playwright-core'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'output resume')
const SHOTS = path.join(import.meta.dirname, 'shots')

// jsPDF embeds the html2canvas page raster as a raw JPEG (DCTDecode) stream.
// Pull it straight out of the PDF bytes.
function extractJpeg(pdfPath) {
  const buf = fs.readFileSync(pdfPath)
  const start = buf.indexOf(Buffer.from([0xff, 0xd8, 0xff]))
  if (start < 0) throw new Error('no JPEG found (PDF is not raster?)')
  // scan forward for the EOI marker
  for (let i = start + 3; i < buf.length - 1; i++) {
    if (buf[i] === 0xff && buf[i + 1] === 0xd9) {
      return buf.subarray(start, i + 2)
    }
  }
  throw new Error('JPEG end marker not found')
}

// Downsample an image to GW x GH luminance grid via canvas in the browser
const analyzeInPage = async (dataUrl) => {
  return await window.__analyze(dataUrl)
}

const pairs = [
  ['Resume-Template-One.pdf', 'preview-01.png', 'Template One'],
  ['Resume-Template-Two.pdf', 'preview-02.png', 'Template Two'],
  ['Resume-Template-Three.pdf', 'preview-03.png', 'Template Three'],
  ['Resume-ATS-Template.pdf', 'preview-04.png', 'Template ATS'],
  ['Resume-Template-One-OVERSIZE.pdf', 'preview-01-big.png', 'Template One (oversize)'],
]

const run = async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await (await browser.newContext({ viewport: { width: 1200, height: 800 } })).newPage()
  await page.goto('about:blank')

  // helper that runs in the page: draw image, downsample, compute ink metrics
  await page.evaluate(`
    window.__analyze = async (dataUrl) => {
      const img = new Image()
      await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('img load fail')); img.src = dataUrl })
      const GW = 60, GH = 84
      const c = document.createElement('canvas')
      c.width = GW; c.height = GH
      const ctx = c.getContext('2d', { willReadFrequently: true })
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, GW, GH)
      // preserve aspect: fit into the grid
      const ar = img.width / img.height
      let dw = GW, dh = GH
      if (ar > GW / GH) dh = Math.round(GW / ar); else dw = Math.round(GH * ar)
      ctx.drawImage(img, Math.floor((GW - dw) / 2), Math.floor((GH - dh) / 2), dw, dh)
      const d = ctx.getImageData(0, 0, GW, GH).data
      const lum = new Float32Array(GW * GH)
      for (let i = 0; i < GW * GH; i++) {
        lum[i] = (d[i*4] * 0.299 + d[i*4+1] * 0.587 + d[i*4+2] * 0.114)
      }
      // ink metrics (ink = dark pixels)
      let inkCount = 0, minX = GW, maxX = -1, minY = GH, maxY = -1
      const colInk = [0, 0, 0]
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        if (lum[y * GW + x] < 170) {
          inkCount++
          if (x < minX) minX = x; if (x > maxX) maxX = x
          if (y < minY) minY = y; if (y > maxY) maxY = y
          colInk[Math.min(2, Math.floor(x / (GW / 3)))]++
        }
      }
      return { lum: Array.from(lum), w: GW, h: GH,
        inkFraction: inkCount / (GW * GH),
        bbox: { x0: minX / GW, x1: (maxX + 1) / GW, y0: minY / GH, y1: (maxY + 1) / GH },
        thirds: colInk.map(v => v / (inkCount || 1)) }
    }
  `)

  console.log(`Template                   | PDF vs preview similarity | verdict`)
  console.log('-'.repeat(70))
  for (const [pdfName, shotName, label] of pairs) {
    try {
      const jpeg = extractJpeg(path.join(OUT_DIR, pdfName))
      const pdfB64 = jpeg.toString('base64')
      const shotPath = path.join(SHOTS, shotName)
      if (!fs.existsSync(shotPath)) { console.log(`${label.padEnd(26)} | preview shot missing`); continue }
      const shotB64 = fs.readFileSync(shotPath).toString('base64')

      const pdfM = await page.evaluate(analyzeInPage, `data:image/jpeg;base64,${pdfB64}`)
      const prevM = await page.evaluate(analyzeInPage, `data:image/png;base64,${shotB64}`)

      let sum = 0
      for (let i = 0; i < pdfM.lum.length; i++) sum += Math.abs(pdfM.lum[i] - prevM.lum[i])
      const meanDiff = sum / pdfM.lum.length
      // how much "ink" (dark structure) do they share?
      const verdict = meanDiff < 14 ? 'MATCH' : meanDiff < 25 ? 'CLOSE' : 'DIFFERENT'
      console.log(
        `${label.padEnd(26)} | meanAbsDiff=${meanDiff.toFixed(1).padStart(6)}      | ${verdict}`
      )
      console.log(
        `   pdf ink=${(pdfM.inkFraction * 100).toFixed(1)}% thirds=${pdfM.thirds.map(t => t.toFixed(2)).join('/')} bbox=x${pdfM.bbox.x0.toFixed(2)}-${pdfM.bbox.x1.toFixed(2)},y${pdfM.bbox.y0.toFixed(2)}-${pdfM.bbox.y1.toFixed(2)}`
      )
      console.log(
        `   web ink=${(prevM.inkFraction * 100).toFixed(1)}% thirds=${prevM.thirds.map(t => t.toFixed(2)).join('/')} bbox=x${prevM.bbox.x0.toFixed(2)}-${prevM.bbox.x1.toFixed(2)},y${prevM.bbox.y0.toFixed(2)}-${prevM.bbox.y1.toFixed(2)}`
      )
    } catch (e) {
      console.log(`${label.padEnd(26)} | ERROR: ${String(e).slice(0, 120)}`)
    }
  }
  await browser.close()
}

run().catch((e) => { console.error(e); process.exit(1) })
