// Analyze resume PDFs: page count + per-page text geometry.
// Usage: node scripts/analyze-pdf.mjs <file.pdf> [file2.pdf ...]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdfjs = require(process.env.PDFJS_PATH || '../frontend/node_modules/pdfjs-dist/legacy/build/pdf.mjs')

async function analyze(file) {
  const fs = await import('fs')
  const data = new Uint8Array(fs.readFileSync(file))
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise
  const meta = await doc.getMetadata().catch(() => null)
  console.log(`\n=== ${file} ===`)
  console.log(`pages: ${doc.numPages}  producer: ${meta?.info?.Producer || '?'}  creator: ${meta?.info?.Creator || '?'}`)
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const vp = page.getViewport({ scale: 1 })
    const tc = await page.getTextContent()
    const items = tc.items.filter(i => i.str && i.str.trim())
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    let centered = 0, leftish = 0
    for (const it of items) {
      const x = it.transform[4], y = it.transform[5]
      minX = Math.min(minX, x); maxX = Math.max(maxX, x + it.width)
      minY = Math.min(minY, y); maxY = Math.max(maxY, y + it.height)
      const mid = x + it.width / 2
      const off = Math.abs(mid - vp.width / 2)
      if (off < vp.width * 0.06) centered++; else leftish++
    }
    console.log(`  page ${p}: ${vp.width.toFixed(0)}x${vp.height.toFixed(0)}pt, text items: ${items.length}`)
    console.log(`    text bbox: x ${minX?.toFixed(0)}..${maxX?.toFixed(0)}, y ${minY?.toFixed(0)}..${maxY?.toFixed(0)}`)
    console.log(`    centered-mid items: ${centered}, off-center: ${leftish}`)
    // first 12 text runs to see order/positioning
    const head = items.slice(0, 12).map(i => `"${i.str.trim().slice(0, 40)}"@x${i.transform[4].toFixed(0)},y${i.transform[5].toFixed(0)}`)
    console.log(`    first items: ${head.join(' | ')}`)
  }
}

const files = process.argv.slice(2)
for (const f of files) {
  try { await analyze(f) } catch (e) { console.log(`\n=== ${f} === ERROR: ${e.message}`) }
}
