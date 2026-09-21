import fs from 'fs'
import path from 'path'

const DIR = 'd:/Ai-Resume-Builder/frontend/src/components/templates'
const files = fs.readdirSync(DIR).filter(f => f.startsWith('Template') && f.endsWith('.jsx') && f !== 'TemplateHelpers.jsx' && f !== 'TemplateAzurill.jsx' && f !== 'TemplateShanidhyaModern.jsx')

console.log(`Processing ${files.length} templates:`, files)

for (const f of files) {
  const filePath = path.join(DIR, f)
  let content = fs.readFileSync(filePath, 'utf8')

  // 1. Ensure BulletList is imported
  if (!content.includes('BulletList')) {
    content = content.replace(/(import\s*\{[^}]*parseBullets,)/, '$1\n  BulletList,')
  }

  // 2. Fix root div styling
  // Replace width: containerWidth > 0 ? `${baseWidth}px` : undefined (or "auto")
  content = content.replace(
    /style=\{\{\s*width:\s*containerWidth\s*>\s*0\s*\?\s*`\$\{baseWidth\}px`\s*:\s*(?:undefined|"auto"),/,
    `style={{\n        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",\n        width: "100%",\n        maxWidth: containerWidth > 0 ? \`\${baseWidth}px\` : "100%",`
  )

  // 3. Replace <ul className="list-disc..."> with <BulletList ... />
  // Pattern: {bullets.length > 0 && (\s*<ul className="list-disc[^"]*">[\s\S]*?<\/ul>\s*\)}
  content = content.replace(
    /\{bullets\.length > 0 && \(\s*<ul className="list-disc[^"]*">[\s\S]*?<\/ul>\s*\)\}/g,
    `{bullets.length > 0 && (\n                        <BulletList items={bullets} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1 leading-snug" />\n                      )}`
  )

  // Also check single bullet block without {bullets.length > 0 && ...}
  content = content.replace(
    /<ul className="list-disc[^"]*">\s*\{bullets\.map\(\(b,\s*bIdx\)\s*=>\s*\(\s*<li[^>]*>\{b\}<\/li>\s*\)\)\}\s*<\/ul>/g,
    `<BulletList items={bullets} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1 leading-snug" />`
  )

  // 4. Replace project description <p className="...">...description...</p> with BulletList
  content = content.replace(
    /\{p\.description && <p className="[^"]*">\{p\.description\}<\/p>\}/g,
    `{p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}`
  )
  content = content.replace(
    /\{p\.description && \(\s*<p className="[^"]*">\s*\{p\.description\}\s*<\/p>\s*\)\}/g,
    `{p.description && (\n                    <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />\n                  )}`
  )
  content = content.replace(
    /\{proj\.description && <p className="[^"]*">\{proj\.description\}<\/p>\}/g,
    `{proj.description && <BulletList text={proj.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}`
  )

  // 5. Remove truncate from contact links that caused clipping
  content = content.replace(/className="hover:underline truncate"/g, 'className="hover:underline break-all leading-normal text-[11px]"')
  content = content.replace(/<span className="truncate">\{c\.label\}<\/span>/g, '<span className="break-all leading-normal text-[11px]">{c.label}</span>')

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`Updated ${f}`)
}
console.log('Finished updating templates!')
