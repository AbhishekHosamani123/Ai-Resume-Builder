import fs from 'fs';
import path from 'path';

const ROOT = 'D:/Ai-Resume-Builder';
const OUT_DIR = path.join(ROOT, 'output resume');

// Check what streams and fonts exist inside the PDF
for (const file of fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.pdf'))) {
  const buf = fs.readFileSync(path.join(OUT_DIR, file));
  const str = buf.toString('latin1');
  
  const hasPng = str.includes('/Filter /FlateDecode') && str.includes('/Subtype /Image');
  const hasJpeg = str.includes('/Filter /DCTDecode');
  const imageMatches = [...str.matchAll(/\/Width (\d+)\s*\/Height (\d+)/g)];
  
  console.log(`=== ${file} ===`);
  console.log(`  Size: ${buf.length} bytes`);
  console.log(`  Raster: PNG=${hasPng}, JPEG=${hasJpeg}`);
  if (imageMatches.length) {
    imageMatches.forEach((m, idx) => console.log(`  Image ${idx + 1}: ${m[1]} x ${m[2]} px`));
  }
}
