import fs from 'fs'

const p1 = 'C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/b4175969-eb62-46ae-89e5-3982e1461b5e/.user_uploaded/media_1789916711751.pdf'
const p2 = 'D:/Ai-Resume-Builder/scripts/diag_out/downloaded.pdf'

for (const p of [p1, p2]) {
  if (!fs.existsSync(p)) continue
  const buf = fs.readFileSync(p)
  console.log('=== FILE:', p, 'Size:', buf.length, '===')
  const str = buf.toString('latin1')
  // Find fonts mentioned
  const fonts = str.match(/\/BaseFont\s*\/([^\s\/>]+)/g)
  console.log('BaseFonts:', fonts)
  // Check if image XObject exists
  const images = str.match(/\/Subtype\s*\/Image/g)
  console.log('Images count:', images?.length || 0)
  // Check if text exists
  const texts = str.match(/\(([^)]+)\)\s*Tj/g)
  console.log('Tj text samples:', texts?.slice(0, 10))
}
