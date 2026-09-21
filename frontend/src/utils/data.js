import Resume1 from "../assets/Resume1.png"
import Resume2 from "../assets/Resume2.png"
import Resume3 from "../assets/Resume3.png"

// Helper to encode SVG data URLs
const createSvgThumbnail = (svgContent) => "data:image/svg+xml," + encodeURIComponent(svgContent);

// SVG thumbnail mimicking the ATS template's layout
const ATS_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <text x='150' y='32' text-anchor='middle' font-family='Arial' font-size='16' font-weight='700' fill='#1f1f1f'>ALEX JOHNSON</text>
  <text x='150' y='48' text-anchor='middle' font-family='Arial' font-size='9' font-style='italic' fill='#333333'>Senior Software Developer</text>
  <text x='150' y='62' text-anchor='middle' font-family='Arial' font-size='7.5' fill='#555555'>alex@example.com • +1 555 123 4567 • San Francisco, CA</text>
  ${[
    ['PROFESSIONAL SUMMARY', 88], ['TECHNICAL SKILLS', 134], ['EXPERIENCE', 180], ['PROJECTS', 260], ['EDUCATION', 338],
  ].map(([label, y]) => `
    <text x='20' y='${y}' font-family='Arial' font-size='9' font-weight='700' fill='#1f1f1f'>${label}</text>
    <line x1='20' y1='${y + 4}' x2='280' y2='${y + 4}' stroke='#444444' stroke-width='1.2'/>
    ${[y + 16, y + 27, y + 38].map((ly, i) => `<rect x='20' y='${ly}' width='${i === 2 ? 160 : 250}' height='4.5' rx='2' fill='#e5e7eb'/>`).join('')}
  `).join('')}
</svg>`);

// 1. Azurill: Left sidebar (33%) with avatar, right timeline
const AZURILL_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <rect x='0' y='0' width='98' height='400' fill='#f0f7ff'/>
  <line x1='98' y1='0' x2='98' y2='400' stroke='#dbeafe' stroke-width='1'/>
  <!-- Sidebar avatar & contacts -->
  <circle cx='49' cy='42' r='24' fill='#2563eb'/>
  <text x='49' y='47' text-anchor='middle' font-family='Arial' font-size='13' font-weight='bold' fill='#ffffff'>AJ</text>
  <rect x='16' y='76' width='66' height='5' rx='2' fill='#93c5fd'/>
  <text x='15' y='104' font-family='Arial' font-size='8' font-weight='bold' fill='#1e40af'>CONTACT</text>
  <line x1='15' y1='108' x2='83' y2='108' stroke='#bfdbfe' stroke-width='1'/>
  ${[118, 130, 142, 154].map((y) => `<rect x='15' y='${y}' width='62' height='4' rx='2' fill='#cbd5e1'/>`).join('')}
  <text x='15' y='180' font-family='Arial' font-size='8' font-weight='bold' fill='#1e40af'>SKILLS</text>
  <line x1='15' y1='184' x2='83' y2='184' stroke='#bfdbfe' stroke-width='1'/>
  ${[194, 208, 222, 236].map((y) => `<rect x='15' y='${y}' width='60' height='9' rx='4.5' fill='#dbeafe'/>`).join('')}
  <!-- Right content -->
  <text x='114' y='36' font-family='Arial' font-size='15' font-weight='bold' fill='#0f172a'>Alex Johnson</text>
  <text x='114' y='50' font-family='Arial' font-size='9' font-weight='600' fill='#2563eb'>Senior Software Developer</text>
  <rect x='114' y='60' width='165' height='4' rx='2' fill='#cbd5e1'/>
  <rect x='114' y='68' width='140' height='4' rx='2' fill='#e2e8f0'/>
  <!-- Timeline Experience -->
  <text x='114' y='96' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>EXPERIENCE</text>
  <line x1='120' y1='108' x2='120' y2='250' stroke='#bfdbfe' stroke-width='1.5'/>
  ${[114, 164, 214].map((y) => `
    <circle cx='120' cy='${y + 4}' r='3.5' fill='#2563eb'/>
    <rect x='130' y='${y}' width='75' height='5.5' rx='2' fill='#1e293b'/>
    <rect x='230' y='${y}' width='45' height='4.5' rx='2' fill='#94a3b8'/>
    <rect x='130' y='${y + 9}' width='50' height='4' rx='2' fill='#2563eb'/>
    <rect x='130' y='${y + 17}' width='145' height='4' rx='2' fill='#64748b'/>
    <rect x='130' y='${y + 25}' width='130' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <text x='114' y='278' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>PROJECTS</text>
  ${[290, 340].map((y) => `
    <rect x='114' y='${y}' width='165' height='38' rx='4' fill='#f8fafc' stroke='#e2e8f0'/>
    <rect x='122' y='${y + 8}' width='70' height='5' rx='2' fill='#0f172a'/>
    <rect x='122' y='${y + 18}' width='145' height='4' rx='2' fill='#64748b'/>
  `).join('')}
</svg>`);

// 2. Bronzor: Bronze Header Banner + Asymmetric 2 Columns
const BRONZOR_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Header -->
  <text x='20' y='34' font-family='Arial' font-size='16' font-weight='bold' fill='#0f172a'>Alex Johnson</text>
  <text x='20' y='48' font-family='Arial' font-size='9' font-weight='600' fill='#b45309'>SENIOR SOFTWARE DEVELOPER</text>
  <circle cx='260' cy='36' r='20' fill='#b45309'/>
  <line x1='20' y1='62' x2='280' y2='62' stroke='#b45309' stroke-width='2'/>
  <!-- Contact strip -->
  <rect x='20' y='68' width='260' height='16' rx='3' fill='#fffbeb' stroke='#fed7aa'/>
  <rect x='28' y='74' width='240' height='4' rx='2' fill='#78350f'/>
  <!-- Two columns: Left (62%), Right (38%) -->
  <line x1='188' y1='98' x2='188' y2='385' stroke='#f1f5f9' stroke-width='1'/>
  <!-- Left column -->
  <text x='20' y='108' font-family='Arial' font-size='8.5' font-weight='bold' fill='#b45309'>WORK EXPERIENCE</text>
  <line x1='20' y1='112' x2='175' y2='112' stroke='#fed7aa' stroke-width='1'/>
  ${[122, 178, 234].map((y) => `
    <rect x='20' y='${y}' width='70' height='5' rx='2' fill='#1e293b'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='2' fill='#b45309'/>
    <rect x='20' y='${y + 16}' width='150' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 24}' width='135' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <text x='20' y='298' font-family='Arial' font-size='8.5' font-weight='bold' fill='#b45309'>PROJECTS</text>
  <line x1='20' y1='302' x2='175' y2='302' stroke='#fed7aa' stroke-width='1'/>
  <rect x='20' y='312' width='155' height='32' rx='3' fill='#f8fafc' stroke='#e2e8f0'/>
  <!-- Right column -->
  <text x='198' y='108' font-family='Arial' font-size='8.5' font-weight='bold' fill='#b45309'>EDUCATION</text>
  <line x1='198' y1='112' x2='280' y2='112' stroke='#fed7aa' stroke-width='1'/>
  <rect x='198' y='122' width='65' height='5' rx='2' fill='#1e293b'/>
  <rect x='198' y='130' width='50' height='4' rx='2' fill='#64748b'/>
  <text x='198' y='178' font-family='Arial' font-size='8.5' font-weight='bold' fill='#b45309'>SKILLS</text>
  <line x1='198' y1='182' x2='280' y2='182' stroke='#fed7aa' stroke-width='1'/>
  ${[192, 206, 220, 234].map((y) => `<rect x='198' y='${y}' width='75' height='9' rx='3' fill='#fef3c7'/>`).join('')}
</svg>`);

// 3. Chikorita: Emerald Green Left Border Accents & Pill Chips
const CHIKORITA_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Header -->
  <rect x='20' y='18' width='60' height='9' rx='4.5' fill='#d1fae5'/>
  <text x='20' y='42' font-family='Arial' font-size='16' font-weight='bold' fill='#064e3b'>Alex Johnson</text>
  <text x='20' y='54' font-family='Arial' font-size='9' font-weight='600' fill='#059669'>Senior Software Developer</text>
  <circle cx='258' cy='38' r='22' fill='#059669'/>
  <!-- Contact pills -->
  ${[68, 79].map((y) => `
    <rect x='20' y='${y}' width='80' height='8' rx='4' fill='#f0fdf4' stroke='#a7f3d0'/>
    <rect x='108' y='${y}' width='80' height='8' rx='4' fill='#f0fdf4' stroke='#a7f3d0'/>
    <rect x='196' y='${y}' width='80' height='8' rx='4' fill='#f0fdf4' stroke='#a7f3d0'/>
  `).join('')}
  <!-- Two columns -->
  <!-- Left column (65%) -->
  <rect x='20' y='102' width='3' height='12' fill='#059669'/>
  <text x='28' y='112' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>WORK EXPERIENCE</text>
  ${[124, 180, 236].map((y) => `
    <rect x='20' y='${y}' width='75' height='5' rx='2' fill='#064e3b'/>
    <rect x='130' y='${y}' width='45' height='6' rx='3' fill='#d1fae5'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='2' fill='#059669'/>
    <rect x='20' y='${y + 16}' width='155' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 24}' width='140' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <!-- Right column (35%) -->
  <rect x='195' y='102' width='3' height='12' fill='#059669'/>
  <text x='203' y='112' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>SKILLS</text>
  ${[124, 137, 150, 163, 176].map((y) => `
    <rect x='195' y='${y}' width='82' height='9' rx='4.5' fill='#ecfdf5' stroke='#a7f3d0'/>
  `).join('')}
  <rect x='195' y='200' width='3' height='12' fill='#059669'/>
  <text x='203' y='210' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>EDUCATION</text>
  <rect x='195' y='220' width='70' height='5' rx='2' fill='#064e3b'/>
  <rect x='195' y='228' width='55' height='4' rx='2' fill='#64748b'/>
</svg>`);

// 4. Ditgar: Dark Hero Banner + Modular Cards
const DITGAR_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#f8fafc'/>
  <!-- Dark Hero Header -->
  <rect x='0' y='0' width='300' height='85' fill='#0f172a'/>
  <circle cx='38' cy='42' r='22' fill='#6366f1'/>
  <text x='38' y='47' text-anchor='middle' font-family='Arial' font-size='12' font-weight='bold' fill='#ffffff'>AJ</text>
  <text x='70' y='36' font-family='Arial' font-size='14' font-weight='bold' fill='#ffffff'>Alex Johnson</text>
  <text x='70' y='48' font-family='Arial' font-size='8' font-weight='bold' fill='#818cf8'>SENIOR SOFTWARE DEVELOPER</text>
  <rect x='70' y='56' width='60' height='8' rx='4' fill='#1e293b'/>
  <rect x='136' y='56' width='60' height='8' rx='4' fill='#1e293b'/>
  <rect x='202' y='56' width='60' height='8' rx='4' fill='#1e293b'/>
  <!-- Modular Cards -->
  <rect x='16' y='98' width='175' height='85' rx='6' fill='#ffffff' stroke='#e2e8f0'/>
  <text x='26' y='114' font-family='Arial' font-size='8' font-weight='bold' fill='#4f46e5'>EXPERIENCE</text>
  <rect x='26' y='124' width='65' height='5' rx='2' fill='#1e293b'/>
  <rect x='26' y='133' width='150' height='4' rx='2' fill='#64748b'/>
  <rect x='26' y='141' width='140' height='4' rx='2' fill='#94a3b8'/>
  <rect x='16' y='193' width='175' height='85' rx='6' fill='#ffffff' stroke='#e2e8f0'/>
  <text x='26' y='209' font-family='Arial' font-size='8' font-weight='bold' fill='#4f46e5'>PROJECTS</text>
  <rect x='26' y='219' width='70' height='5' rx='2' fill='#1e293b'/>
  <rect x='26' y='228' width='150' height='4' rx='2' fill='#64748b'/>
  <!-- Right Column Cards -->
  <rect x='201' y='98' width='83' height='100' rx='6' fill='#ffffff' stroke='#e2e8f0'/>
  <text x='211' y='114' font-family='Arial' font-size='8' font-weight='bold' fill='#4f46e5'>SKILLS</text>
  ${[124, 137, 150, 163, 176].map((y) => `<rect x='211' y='${y}' width='63' height='9' rx='4.5' fill='#e0e7ff'/>`).join('')}
  <rect x='201' y='208' width='83' height='70' rx='6' fill='#ffffff' stroke='#e2e8f0'/>
  <text x='211' y='224' font-family='Arial' font-size='8' font-weight='bold' fill='#4f46e5'>EDUCATION</text>
  <rect x='211' y='234' width='55' height='5' rx='2' fill='#1e293b'/>
  <rect x='211' y='242' width='45' height='4' rx='2' fill='#64748b'/>
</svg>`);

// 5. Ditto: Minimalist Clean Single-Column ATS
const DITTO_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <text x='150' y='32' text-anchor='middle' font-family='Arial' font-size='15' font-weight='bold' fill='#0f172a'>ALEX JOHNSON</text>
  <text x='150' y='46' text-anchor='middle' font-family='Arial' font-size='8.5' font-weight='500' fill='#475569'>Senior Software Developer</text>
  <text x='150' y='58' text-anchor='middle' font-family='Arial' font-size='7' fill='#64748b'>alex@example.com • (555) 123-4567 • San Francisco, CA • linkedin/alexjohnson</text>
  <line x1='24' y1='66' x2='276' y2='66' stroke='#cbd5e1' stroke-width='1'/>
  ${[
    ['PROFESSIONAL SUMMARY', 84], ['EXPERIENCE', 134], ['EDUCATION', 244], ['SKILLS &amp; TOOLS', 312],
  ].map(([label, y]) => `
    <text x='24' y='${y}' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>${label}</text>
    <line x1='24' y1='${y + 4}' x2='276' y2='${y + 4}' stroke='#cbd5e1' stroke-width='0.8'/>
    ${[y + 14, y + 23, y + 32].map((ly, i) => `<rect x='24' y='${ly}' width='${i === 2 ? 150 : 252}' height='4' rx='1.5' fill='#e2e8f0'/>`).join('')}
  `).join('')}
</svg>`);

// 6. Gengar: Bold Tech Purple Header
const GENGAR_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Top purple band -->
  <rect x='20' y='18' width='60' height='8' rx='4' fill='#ede9fe'/>
  <text x='20' y='42' font-family='Arial' font-size='16' font-weight='black' fill='#4c1d95'>Alex Johnson</text>
  <text x='20' y='54' font-family='Arial' font-size='9' font-weight='bold' fill='#7c3aed'>SENIOR SOFTWARE DEVELOPER</text>
  <circle cx='258' cy='38' r='20' fill='#7c3aed'/>
  <line x1='20' y1='66' x2='280' y2='66' stroke='#7c3aed' stroke-width='2'/>
  <!-- Contact row -->
  <rect x='20' y='72' width='260' height='14' rx='3' fill='#f5f3ff'/>
  <!-- Sections with purple badges -->
  <rect x='20' y='96' width='70' height='12' rx='3' fill='#4c1d95'/>
  <text x='26' y='105' font-family='Arial' font-size='7' font-weight='bold' fill='#ffffff'>EXPERIENCE</text>
  ${[118, 168, 218].map((y) => `
    <rect x='20' y='${y}' width='2' height='40' fill='#c4b5fd'/>
    <rect x='28' y='${y}' width='75' height='5' rx='2' fill='#0f172a'/>
    <rect x='130' y='${y}' width='45' height='5' rx='2' fill='#ede9fe'/>
    <rect x='28' y='${y + 8}' width='50' height='4' rx='2' fill='#7c3aed'/>
    <rect x='28' y='${y + 16}' width='150' height='4' rx='2' fill='#64748b'/>
    <rect x='28' y='${y + 24}' width='130' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <!-- Right column -->
  <rect x='195' y='96' width='60' height='12' rx='3' fill='#4c1d95'/>
  <text x='201' y='105' font-family='Arial' font-size='7' font-weight='bold' fill='#ffffff'>SKILLS</text>
  ${[118, 131, 144, 157, 170].map((y) => `
    <rect x='195' y='${y}' width='82' height='9' rx='3' fill='#ede9fe' stroke='#c4b5fd'/>
  `).join('')}
</svg>`);

// 7. Glalie: Cool Ice Cyan Nordic Layout
const GLALIE_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <rect x='0' y='0' width='96' height='400' fill='#f0f9ff'/>
  <line x1='96' y1='0' x2='96' y2='400' stroke='#e0f2fe' stroke-width='1'/>
  <circle cx='48' cy='42' r='22' fill='#0284c7'/>
  <text x='48' y='47' text-anchor='middle' font-family='Arial' font-size='12' font-weight='bold' fill='#ffffff'>AJ</text>
  <rect x='16' y='76' width='64' height='5' rx='2' fill='#0369a1'/>
  <text x='16' y='104' font-family='Arial' font-size='8' font-weight='bold' fill='#0284c7'>CONTACT</text>
  ${[116, 128, 140].map((y) => `<rect x='16' y='${y}' width='62' height='4' rx='2' fill='#94a3b8'/>`).join('')}
  <text x='16' y='166' font-family='Arial' font-size='8' font-weight='bold' fill='#0284c7'>SKILLS</text>
  ${[178, 192, 206, 220].map((y) => `<rect x='16' y='${y}' width='64' height='9' rx='2' fill='#ffffff' stroke='#bae6fd'/>`).join('')}
  <!-- Main -->
  <text x='112' y='36' font-family='Arial' font-size='15' font-weight='bold' fill='#0f172a'>Alex Johnson</text>
  <text x='112' y='50' font-family='Arial' font-size='8.5' font-weight='600' fill='#0284c7'>Senior Software Developer</text>
  <line x1='112' y1='62' x2='282' y2='62' stroke='#bae6fd' stroke-width='1'/>
  <rect x='112' y='80' width='6' height='6' rx='1' fill='#0284c7' transform='rotate(45 115 83)'/>
  <text x='124' y='86' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>EXPERIENCE</text>
  ${[100, 156, 212].map((y) => `
    <rect x='112' y='${y}' width='80' height='5' rx='2' fill='#0f172a'/>
    <rect x='112' y='${y + 8}' width='50' height='4' rx='2' fill='#0284c7'/>
    <rect x='112' y='${y + 16}' width='165' height='4' rx='2' fill='#64748b'/>
    <rect x='112' y='${y + 24}' width='145' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
</svg>`);

// 8. Kakuna: Modular Amber Card Grid
const KAKUNA_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#fffbeb'/>
  <!-- Header card -->
  <rect x='14' y='14' width='272' height='66' rx='8' fill='#ffffff' stroke='#fde68a'/>
  <text x='26' y='36' font-family='Arial' font-size='14' font-weight='black' fill='#0f172a'>Alex Johnson</text>
  <text x='26' y='48' font-family='Arial' font-size='8' font-weight='bold' fill='#d97706'>SENIOR SOFTWARE DEVELOPER</text>
  <circle cx='255' cy='46' r='18' fill='#d97706'/>
  <!-- 2 Col Cards -->
  <rect x='14' y='88' width='172' height='90' rx='8' fill='#ffffff' stroke='#fde68a'/>
  <text x='24' y='104' font-family='Arial' font-size='8' font-weight='bold' fill='#92400e'>EXPERIENCE</text>
  <rect x='24' y='114' width='65' height='5' rx='2' fill='#1e293b'/>
  <rect x='24' y='123' width='150' height='4' rx='2' fill='#64748b'/>
  <rect x='24' y='131' width='135' height='4' rx='2' fill='#94a3b8'/>
  <rect x='14' y='186' width='172' height='90' rx='8' fill='#ffffff' stroke='#fde68a'/>
  <text x='24' y='202' font-family='Arial' font-size='8' font-weight='bold' fill='#92400e'>PROJECTS</text>
  <rect x='24' y='212' width='70' height='5' rx='2' fill='#1e293b'/>
  <rect x='24' y='221' width='145' height='4' rx='2' fill='#64748b'/>
  <!-- Right Cards -->
  <rect x='194' y='88' width='92' height='110' rx='8' fill='#ffffff' stroke='#fde68a'/>
  <text x='204' y='104' font-family='Arial' font-size='8' font-weight='bold' fill='#92400e'>SKILLS</text>
  ${[114, 127, 140, 153, 166].map((y) => `<rect x='204' y='${y}' width='72' height='9' rx='4.5' fill='#fef3c7'/>`).join('')}
  <rect x='194' y='206' width='92' height='70' rx='8' fill='#ffffff' stroke='#fde68a'/>
  <text x='204' y='222' font-family='Arial' font-size='8' font-weight='bold' fill='#92400e'>EDUCATION</text>
  <rect x='204' y='232' width='60' height='5' rx='2' fill='#1e293b'/>
</svg>`);

// 9. Lapras: Executive Navy Serif Two-Column
const LAPRAS_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Header -->
  <text x='20' y='36' font-family='Georgia, serif' font-size='16' font-weight='bold' fill='#0f172a'>ALEX JOHNSON</text>
  <text x='20' y='50' font-family='Arial' font-size='8' font-weight='bold' fill='#1e3a8a'>SENIOR SOFTWARE DEVELOPER</text>
  <circle cx='258' cy='36' r='18' fill='#1e3a8a'/>
  <line x1='20' y1='62' x2='280' y2='62' stroke='#0f172a' stroke-width='2'/>
  <!-- Contacts -->
  <rect x='20' y='68' width='260' height='10' rx='2' fill='#f8fafc'/>
  <!-- Two columns -->
  <text x='20' y='102' font-family='Arial' font-size='8.5' font-weight='bold' fill='#1e3a8a'>PROFESSIONAL EXPERIENCE</text>
  <line x1='20' y1='106' x2='175' y2='106' stroke='#1e3a8a' stroke-width='1.5'/>
  ${[118, 172, 226].map((y) => `
    <rect x='20' y='${y}' width='75' height='5' rx='2' fill='#0f172a'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='2' fill='#1e3a8a'/>
    <rect x='20' y='${y + 16}' width='155' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 24}' width='140' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <!-- Right -->
  <text x='195' y='102' font-family='Arial' font-size='8.5' font-weight='bold' fill='#1e3a8a'>EDUCATION</text>
  <line x1='195' y1='106' x2='280' y2='106' stroke='#1e3a8a' stroke-width='1.5'/>
  <rect x='195' y='118' width='60' height='5' rx='2' fill='#0f172a'/>
  <text x='195' y='160' font-family='Arial' font-size='8.5' font-weight='bold' fill='#1e3a8a'>COMPETENCIES</text>
  <line x1='195' y1='164' x2='280' y2='164' stroke='#1e3a8a' stroke-width='1.5'/>
  ${[176, 190, 204, 218].map((y) => `<rect x='195' y='${y}' width='75' height='9' rx='2' fill='#eff6ff'/>`).join('')}
</svg>`);

// 10. Leafish: Forest Sage Green Organic
const LEAFISH_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <text x='20' y='36' font-family='Arial' font-size='16' font-weight='black' fill='#14532d'>Alex Johnson</text>
  <text x='20' y='50' font-family='Arial' font-size='9' font-weight='bold' fill='#16a34a'>Senior Software Developer</text>
  <circle cx='258' cy='38' r='20' fill='#16a34a'/>
  <line x1='20' y1='62' x2='280' y2='62' stroke='#bbf7d0' stroke-width='1.5'/>
  <!-- Contact bar -->
  <rect x='20' y='68' width='260' height='12' rx='6' fill='#f0fdf4'/>
  <!-- Experience -->
  <text x='20' y='104' font-family='Arial' font-size='8.5' font-weight='bold' fill='#15803d'>EXPERIENCE</text>
  <line x1='20' y1='108' x2='175' y2='108' stroke='#16a34a' stroke-width='2'/>
  ${[120, 174, 228].map((y) => `
    <circle cx='24' cy='${y + 2}' r='2.5' fill='#16a34a'/>
    <rect x='32' y='${y}' width='75' height='5' rx='2' fill='#14532d'/>
    <rect x='32' y='${y + 8}' width='50' height='4' rx='2' fill='#16a34a'/>
    <rect x='32' y='${y + 16}' width='140' height='4' rx='2' fill='#64748b'/>
  `).join('')}
  <!-- Right -->
  <text x='195' y='104' font-family='Arial' font-size='8.5' font-weight='bold' fill='#15803d'>SKILLS</text>
  <line x1='195' y1='108' x2='280' y2='108' stroke='#16a34a' stroke-width='2'/>
  ${[120, 133, 146, 159, 172].map((y) => `<rect x='195' y='${y}' width='80' height='9' rx='4.5' fill='#dcfce7'/>`).join('')}
</svg>`);

// 11. Meowth: Warm Gold Executive
const MEOWTH_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <rect x='0' y='0' width='300' height='5' fill='#d97706'/>
  <text x='20' y='36' font-family='Arial' font-size='16' font-weight='bold' fill='#1c1917'>Alex Johnson</text>
  <text x='20' y='50' font-family='Arial' font-size='8.5' font-weight='bold' fill='#d97706'>SENIOR SOFTWARE DEVELOPER</text>
  <circle cx='258' cy='38' r='18' fill='#d97706'/>
  <line x1='20' y1='62' x2='280' y2='62' stroke='#fde68a' stroke-width='1'/>
  <text x='20' y='96' font-family='Arial' font-size='8.5' font-weight='bold' fill='#78350f'>EXPERIENCE</text>
  <line x1='20' y1='100' x2='175' y2='100' stroke='#d97706' stroke-width='1.5'/>
  ${[112, 166, 220].map((y) => `
    <rect x='20' y='${y}' width='75' height='5' rx='2' fill='#1c1917'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='2' fill='#d97706'/>
    <rect x='20' y='${y + 16}' width='150' height='4' rx='2' fill='#78716c'/>
  `).join('')}
  <text x='195' y='96' font-family='Arial' font-size='8.5' font-weight='bold' fill='#78350f'>EXPERTISE</text>
  <line x1='195' y1='100' x2='280' y2='100' stroke='#d97706' stroke-width='1.5'/>
  ${[112, 125, 138, 151, 164].map((y) => `<rect x='195' y='${y}' width='75' height='9' rx='2' fill='#fef3c7'/>`).join('')}
</svg>`);

// 12. Onyx: Monochromatic High-Contrast Slate
const ONYX_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <text x='20' y='36' font-family='Arial' font-size='16' font-weight='black' fill='#0f172a'>ALEX JOHNSON</text>
  <text x='20' y='50' font-family='Arial' font-size='8.5' font-weight='bold' fill='#475569'>SENIOR SOFTWARE DEVELOPER</text>
  <circle cx='258' cy='36' r='18' fill='#0f172a'/>
  <line x1='20' y1='60' x2='280' y2='60' stroke='#0f172a' stroke-width='2.5'/>
  ${[
    ['EXECUTIVE SUMMARY', 84], ['WORK EXPERIENCE', 134], ['EDUCATION &amp; CREDENTIALS', 260],
  ].map(([label, y]) => `
    <text x='20' y='${y}' font-family='Arial' font-size='8.5' font-weight='black' fill='#0f172a'>${label}</text>
    <line x1='20' y1='${y + 4}' x2='280' y2='${y + 4}' stroke='#0f172a' stroke-width='1'/>
    ${[y + 14, y + 24, y + 34].map((ly, i) => `<rect x='20' y='${ly}' width='${i === 2 ? 160 : 255}' height='4.5' rx='1' fill='#334155'/>`).join('')}
  `).join('')}
</svg>`);

// 13. Pikachu: Electric Amber Modern Tech
const PIKACHU_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <rect x='20' y='18' width='55' height='8' rx='4' fill='#fef08a'/>
  <text x='20' y='42' font-family='Arial' font-size='16' font-weight='black' fill='#0f172a'>Alex Johnson</text>
  <text x='20' y='54' font-family='Arial' font-size='9' font-weight='bold' fill='#ca8a04'>DEVELOPER PORTFOLIO</text>
  <circle cx='258' cy='38' r='20' fill='#eab308' stroke='#ca8a04' stroke-width='2'/>
  <line x1='20' y1='64' x2='280' y2='64' stroke='#eab308' stroke-width='2.5'/>
  <text x='20' y='96' font-family='Arial' font-size='8.5' font-weight='black' fill='#0f172a'>EXPERIENCE</text>
  ${[112, 166, 220].map((y) => `
    <rect x='20' y='${y}' width='75' height='5' rx='2' fill='#0f172a'/>
    <rect x='125' y='${y}' width='45' height='5' rx='2' fill='#fef08a'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='2' fill='#ca8a04'/>
    <rect x='20' y='${y + 16}' width='150' height='4' rx='2' fill='#64748b'/>
  `).join('')}
  <text x='195' y='96' font-family='Arial' font-size='8.5' font-weight='black' fill='#0f172a'>SKILLS &amp; TOOLS</text>
  ${[112, 125, 138, 151, 164].map((y) => `<rect x='195' y='${y}' width='75' height='9' rx='2' fill='#fef9c3' stroke='#fde047'/>`).join('')}
</svg>`);

// 14. Rhyhorn: Rugged Engineering Blocks
const RHYHORN_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <text x='20' y='36' font-family='Arial' font-size='16' font-weight='black' fill='#1e293b'>ALEX JOHNSON</text>
  <text x='20' y='50' font-family='Arial' font-size='8.5' font-weight='black' fill='#475569'>INFRASTRUCTURE &amp; DEVOPS</text>
  <rect x='240' y='20' width='36' height='36' rx='4' fill='#334155'/>
  <line x1='20' y1='62' x2='280' y2='62' stroke='#334155' stroke-width='3'/>
  <!-- Solid gray block headers -->
  <rect x='20' y='80' width='165' height='14' fill='#f1f5f9'/>
  <rect x='20' y='80' width='4' height='14' fill='#334155'/>
  <text x='28' y='90' font-family='Arial' font-size='7.5' font-weight='black' fill='#1e293b'>EXPERIENCE</text>
  ${[104, 158, 212].map((y) => `
    <rect x='20' y='${y}' width='75' height='5' rx='1' fill='#0f172a'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='1' fill='#475569'/>
    <rect x='20' y='${y + 16}' width='155' height='4' rx='1' fill='#64748b'/>
  `).join('')}
  <rect x='195' y='80' width='85' height='14' fill='#f1f5f9'/>
  <rect x='195' y='80' width='4' height='14' fill='#334155'/>
  <text x='203' y='90' font-family='Arial' font-size='7.5' font-weight='black' fill='#1e293b'>SKILLS</text>
  ${[104, 117, 130, 143, 156].map((y) => `<rect x='195' y='${y}' width='75' height='9' rx='1' fill='#f1f5f9' stroke='#cbd5e1'/>`).join('')}
</svg>`);

// 15. Scizor: Crimson Ruby Right Sidebar
const SCIZOR_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Right sidebar (33%) -->
  <rect x='202' y='0' width='98' height='400' fill='#fef2f2'/>
  <line x1='202' y1='0' x2='202' y2='400' stroke='#fee2e2' stroke-width='1'/>
  <circle cx='251' cy='42' r='20' fill='#dc2626'/>
  <text x='251' y='47' text-anchor='middle' font-family='Arial' font-size='12' font-weight='bold' fill='#ffffff'>AJ</text>
  <text x='214' y='84' font-family='Arial' font-size='8' font-weight='bold' fill='#991b1b'>CONTACT</text>
  ${[96, 108, 120].map((y) => `<rect x='214' y='${y}' width='68' height='4' rx='2' fill='#fca5a5'/>`).join('')}
  <text x='214' y='146' font-family='Arial' font-size='8' font-weight='bold' fill='#991b1b'>SKILLS</text>
  ${[158, 172, 186, 200].map((y) => `<rect x='214' y='${y}' width='70' height='9' rx='2' fill='#ffffff' stroke='#fca5a5'/>`).join('')}
  <!-- Main Left (67%) -->
  <text x='20' y='36' font-family='Arial' font-size='15' font-weight='black' fill='#0f172a'>Alex Johnson</text>
  <text x='20' y='50' font-family='Arial' font-size='8.5' font-weight='bold' fill='#dc2626'>SENIOR SOFTWARE DEVELOPER</text>
  <line x1='20' y1='62' x2='185' y2='62' stroke='#dc2626' stroke-width='2'/>
  <rect x='20' y='80' width='6' height='6' fill='#dc2626'/>
  <text x='30' y='86' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>EXPERIENCE</text>
  ${[100, 156, 212].map((y) => `
    <rect x='20' y='${y}' width='75' height='5' rx='2' fill='#0f172a'/>
    <rect x='20' y='${y + 8}' width='50' height='4' rx='2' fill='#dc2626'/>
    <rect x='20' y='${y + 16}' width='155' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 24}' width='135' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
</svg>`);

// Shanidhya Templates Thumbnails
// 1. Shanidhya Modern: Centered Hero Header with Teal/Cyan Accents & Summary Card
const SHANIDHYA_MODERN_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Header -->
  <text x='150' y='32' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold' fill='#0f172a'>Alex Johnson</text>
  <text x='150' y='46' text-anchor='middle' font-family='Arial' font-size='9' font-weight='600' fill='#0d9488'>Senior Software Developer</text>
  <rect x='110' y='52' width='80' height='2' rx='1' fill='#14b8a6'/>
  <!-- Contact pill row -->
  <rect x='30' y='62' width='240' height='16' rx='8' fill='#f0fdfa' stroke='#ccfbf1'/>
  <rect x='42' y='68' width='216' height='4' rx='2' fill='#0d9488'/>
  <!-- Summary Box -->
  <rect x='20' y='88' width='260' height='36' rx='4' fill='#f8fafc' stroke='#e2e8f0'/>
  <rect x='20' y='88' width='4' height='36' rx='1' fill='#0d9488'/>
  <rect x='32' y='96' width='238' height='4' rx='2' fill='#64748b'/>
  <rect x='32' y='106' width='220' height='4' rx='2' fill='#94a3b8'/>
  <rect x='32' y='114' width='180' height='4' rx='2' fill='#cbd5e1'/>
  <!-- Experience -->
  <text x='20' y='142' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>EXPERIENCE</text>
  <line x1='20' y1='146' x2='280' y2='146' stroke='#14b8a6' stroke-width='1.5'/>
  ${[156, 210, 264].map((y) => `
    <circle cx='24' cy='${y + 3}' r='3' fill='#0d9488'/>
    <rect x='34' y='${y}' width='80' height='5' rx='2' fill='#0f172a'/>
    <rect x='215' y='${y}' width='65' height='4.5' rx='2' fill='#94a3b8'/>
    <rect x='34' y='${y + 9}' width='55' height='4' rx='2' fill='#0d9488'/>
    <rect x='34' y='${y + 17}' width='246' height='4' rx='2' fill='#64748b'/>
    <rect x='34' y='${y + 25}' width='220' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <!-- Skills -->
  <text x='20' y='320' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>SKILLS</text>
  <line x1='20' y1='324' x2='280' y2='324' stroke='#14b8a6' stroke-width='1.5'/>
  ${[
    [20, 334, 45], [70, 334, 52], [127, 334, 40], [172, 334, 48], [225, 334, 55],
    [20, 350, 52], [77, 350, 48], [130, 350, 46], [181, 350, 55], [241, 350, 39],
  ].map(([x, y, w]) => `<rect x='${x}' y='${y}' width='${w}' height='11' rx='5.5' fill='#f0fdfa' stroke='#99f6e4'/>`).join('')}
</svg>`);

// 2. Shanidhya Creative: Dark Slate Sidebar + Cyan Highlights
const SHANIDHYA_CREATIVE_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Dark Slate Left Sidebar (33%) -->
  <rect x='0' y='0' width='98' height='400' fill='#0f172a'/>
  <!-- Avatar with cyan ring -->
  <circle cx='49' cy='42' r='23' fill='#0891b2' stroke='#38bdf8' stroke-width='2'/>
  <text x='49' y='47' text-anchor='middle' font-family='Arial' font-size='13' font-weight='bold' fill='#ffffff'>AJ</text>
  <rect x='16' y='76' width='66' height='5' rx='2' fill='#38bdf8'/>
  <!-- Contact section in sidebar -->
  <text x='15' y='104' font-family='Arial' font-size='8' font-weight='bold' fill='#38bdf8'>CONTACT</text>
  <line x1='15' y1='108' x2='83' y2='108' stroke='#1e293b' stroke-width='1'/>
  ${[118, 130, 142, 154].map((y) => `<rect x='15' y='${y}' width='62' height='4' rx='2' fill='#94a3b8'/>`).join('')}
  <!-- Skills in sidebar with cyan pills -->
  <text x='15' y='180' font-family='Arial' font-size='8' font-weight='bold' fill='#38bdf8'>SKILLS</text>
  <line x1='15' y1='184' x2='83' y2='184' stroke='#1e293b' stroke-width='1'/>
  ${[194, 208, 222, 236, 250, 264].map((y) => `<rect x='15' y='${y}' width='68' height='9' rx='4.5' fill='#1e293b' stroke='#0e7490'/>`).join('')}
  <!-- Right White Area -->
  <text x='114' y='36' font-family='Arial' font-size='16' font-weight='900' fill='#0f172a'>Alex Johnson</text>
  <text x='114' y='50' font-family='Arial' font-size='9' font-weight='700' fill='#0891b2'>SENIOR SOFTWARE DEVELOPER</text>
  <line x1='114' y1='58' x2='280' y2='58' stroke='#0891b2' stroke-width='1.5'/>
  <rect x='114' y='68' width='165' height='4' rx='2' fill='#64748b'/>
  <rect x='114' y='76' width='140' height='4' rx='2' fill='#94a3b8'/>
  <!-- Experience -->
  <text x='114' y='104' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>WORK EXPERIENCE</text>
  <line x1='114' y1='108' x2='280' y2='108' stroke='#e2e8f0' stroke-width='1'/>
  ${[118, 172, 226].map((y) => `
    <rect x='114' y='${y}' width='80' height='5' rx='2' fill='#0f172a'/>
    <rect x='225' y='${y}' width='55' height='4.5' rx='2' fill='#94a3b8'/>
    <rect x='114' y='${y + 8}' width='60' height='4' rx='2' fill='#0891b2'/>
    <rect x='114' y='${y + 16}' width='166' height='4' rx='2' fill='#64748b'/>
    <rect x='114' y='${y + 24}' width='150' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <!-- Projects -->
  <text x='114' y='282' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>FEATURED PROJECTS</text>
  <line x1='114' y1='286' x2='280' y2='286' stroke='#e2e8f0' stroke-width='1'/>
  ${[294, 344].map((y) => `
    <rect x='114' y='${y}' width='166' height='38' rx='4' fill='#f8fafc' stroke='#e2e8f0'/>
    <rect x='122' y='${y + 8}' width='75' height='5' rx='2' fill='#0f172a'/>
    <rect x='122' y='${y + 18}' width='145' height='4' rx='2' fill='#64748b'/>
  `).join('')}
</svg>`);

// 3. Shanidhya Executive: Royal Navy Banner & Senior Leadership Layout
const SHANIDHYA_EXECUTIVE_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Top Executive Navy Banner -->
  <rect x='0' y='0' width='300' height='62' fill='#1e3a8a'/>
  <text x='24' y='32' font-family='Georgia, serif' font-size='16' font-weight='bold' fill='#ffffff'>Alex Johnson</text>
  <text x='24' y='48' font-family='Arial' font-size='8.5' font-weight='600' letter-spacing='1' fill='#fbbf24'>SENIOR SOFTWARE DEVELOPER &amp; ARCHITECT</text>
  <!-- Contact row -->
  <rect x='0' y='62' width='300' height='18' fill='#f8fafc'/>
  <line x1='0' y1='80' x2='300' y2='80' stroke='#e2e8f0' stroke-width='1'/>
  <rect x='24' y='68' width='252' height='4.5' rx='2' fill='#64748b'/>
  <!-- Executive Statement -->
  <rect x='20' y='90' width='260' height='32' rx='3' fill='#eff6ff' stroke='#bfdbfe'/>
  <rect x='20' y='90' width='4' height='32' rx='1' fill='#1e3a8a'/>
  <rect x='32' y='98' width='235' height='4' rx='2' fill='#1e3a8a'/>
  <rect x='32' y='108' width='210' height='4' rx='2' fill='#475569'/>
  <!-- Two columns: Left (65%), Right (35%) -->
  <line x1='195' y1='132' x2='195' y2='385' stroke='#e2e8f0' stroke-width='1'/>
  <!-- Left column: Experience -->
  <text x='20' y='142' font-family='Georgia, serif' font-size='9' font-weight='bold' fill='#1e3a8a'>EXECUTIVE EXPERIENCE</text>
  <line x1='20' y1='146' x2='182' y2='146' stroke='#1e3a8a' stroke-width='1.2'/>
  ${[156, 218, 280].map((y) => `
    <rect x='20' y='${y}' width='85' height='5.5' rx='2' fill='#0f172a'/>
    <rect x='20' y='${y + 8}' width='60' height='4' rx='2' fill='#d97706'/>
    <rect x='20' y='${y + 17}' width='158' height='4' rx='2' fill='#475569'/>
    <rect x='20' y='${y + 26}' width='145' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 35}' width='130' height='4' rx='2' fill='#94a3b8'/>
  `).join('')}
  <!-- Right column: Competencies & Education -->
  <text x='205' y='142' font-family='Georgia, serif' font-size='9' font-weight='bold' fill='#1e3a8a'>CREDENTIALS</text>
  <line x1='205' y1='146' x2='280' y2='146' stroke='#1e3a8a' stroke-width='1.2'/>
  <rect x='205' y='156' width='70' height='5' rx='2' fill='#0f172a'/>
  <rect x='205' y='164' width='55' height='4' rx='2' fill='#64748b'/>
  <rect x='205' y='184' width='70' height='5' rx='2' fill='#0f172a'/>
  <rect x='205' y='192' width='55' height='4' rx='2' fill='#64748b'/>
  <text x='205' y='224' font-family='Georgia, serif' font-size='9' font-weight='bold' fill='#1e3a8a'>COMPETENCIES</text>
  <line x1='205' y1='228' x2='280' y2='228' stroke='#1e3a8a' stroke-width='1.2'/>
  ${[238, 252, 266, 280, 294, 308].map((y) => `<rect x='205' y='${y}' width='72' height='9' rx='2' fill='#f1f5f9' stroke='#cbd5e1'/>`).join('')}
</svg>`);

// 4. Shanidhya Minimal: Ultra-Lean Left-Aligned ATS Master
const SHANIDHYA_MINIMAL_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Header -->
  <text x='20' y='36' font-family='Arial' font-size='16' font-weight='800' fill='#0f172a'>ALEX JOHNSON</text>
  <text x='20' y='50' font-family='Arial' font-size='9' font-weight='500' fill='#64748b'>Senior Software Developer</text>
  <text x='20' y='64' font-family='Arial' font-size='7.5' fill='#94a3b8'>alex@example.com • +1 555 123 4567 • San Francisco, CA</text>
  <line x1='20' y1='74' x2='280' y2='74' stroke='#0f172a' stroke-width='1.5'/>
  <!-- Linear ATS Sections -->
  ${[
    ['PROFESSIONAL SUMMARY', 92],
    ['EXPERIENCE', 142],
    ['TECHNICAL SKILLS', 246],
    ['PROJECTS', 298],
    ['EDUCATION', 362]
  ].map(([label, y]) => `
    <text x='20' y='${y}' font-family='Arial' font-size='8.5' font-weight='bold' fill='#0f172a'>${label}</text>
    <line x1='20' y1='${y + 4}' x2='280' y2='${y + 4}' stroke='#e2e8f0' stroke-width='1'/>
  `).join('')}
  <!-- Summary text -->
  <rect x='20' y='104' width='260' height='4' rx='2' fill='#64748b'/>
  <rect x='20' y='112' width='240' height='4' rx='2' fill='#94a3b8'/>
  <rect x='20' y='120' width='200' height='4' rx='2' fill='#cbd5e1'/>
  <!-- Experience items -->
  ${[154, 200].map((y) => `
    <rect x='20' y='${y}' width='85' height='5' rx='2' fill='#0f172a'/>
    <rect x='230' y='${y}' width='50' height='4.5' rx='2' fill='#94a3b8'/>
    <rect x='20' y='${y + 8}' width='60' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 16}' width='255' height='4' rx='2' fill='#94a3b8'/>
    <rect x='20' y='${y + 24}' width='230' height='4' rx='2' fill='#cbd5e1'/>
  `).join('')}
  <!-- Skills chips -->
  ${[
    [20, 258, 48], [74, 258, 52], [132, 258, 42], [180, 258, 46], [232, 258, 48],
    [20, 274, 52], [78, 274, 46], [130, 274, 50], [186, 274, 45], [237, 274, 43],
  ].map(([x, y, w]) => `<rect x='${x}' y='${y}' width='${w}' height='10' rx='5' fill='#f1f5f9' stroke='#e2e8f0'/>`).join('')}
  <!-- Projects -->
  <rect x='20' y='310' width='90' height='5' rx='2' fill='#0f172a'/>
  <rect x='20' y='318' width='250' height='4' rx='2' fill='#64748b'/>
  <rect x='20' y='326' width='220' height='4' rx='2' fill='#94a3b8'/>
  <rect x='20' y='338' width='85' height='5' rx='2' fill='#0f172a'/>
  <rect x='20' y='346' width='240' height='4' rx='2' fill='#64748b'/>
</svg>`);

// 5. Shanidhya Two Column: Symmetrical 50/50 Dual Column
const SHANIDHYA_TWOCOLUMN_THUMBNAIL = createSvgThumbnail(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <!-- Top dark accent band -->
  <rect x='0' y='0' width='300' height='5' fill='#334155'/>
  <!-- Header -->
  <text x='150' y='30' text-anchor='middle' font-family='Arial' font-size='15' font-weight='bold' fill='#0f172a'>Alex Johnson</text>
  <text x='150' y='44' text-anchor='middle' font-family='Arial' font-size='9' font-weight='600' fill='#475569'>Senior Software Developer</text>
  <rect x='20' y='52' width='260' height='14' rx='3' fill='#f8fafc' stroke='#e2e8f0'/>
  <rect x='30' y='57' width='240' height='4' rx='2' fill='#64748b'/>
  <!-- Center dividing line -->
  <line x1='150' y1='78' x2='150' y2='385' stroke='#e2e8f0' stroke-width='1'/>
  <!-- Left Column (50%): Experience -->
  <text x='20' y='88' font-family='Arial' font-size='8' font-weight='bold' fill='#0f172a'>EXPERIENCE</text>
  <line x1='20' y1='92' x2='140' y2='92' stroke='#475569' stroke-width='1.2'/>
  ${[102, 168, 234].map((y) => `
    <rect x='20' y='${y}' width='65' height='5' rx='2' fill='#0f172a'/>
    <rect x='20' y='${y + 8}' width='45' height='4' rx='2' fill='#475569'/>
    <rect x='20' y='${y + 16}' width='118' height='4' rx='2' fill='#64748b'/>
    <rect x='20' y='${y + 24}' width='105' height='4' rx='2' fill='#94a3b8'/>
    <rect x='20' y='${y + 32}' width='95' height='4' rx='2' fill='#cbd5e1'/>
  `).join('')}
  <!-- Right Column (50%): Education, Skills, Projects -->
  <text x='160' y='88' font-family='Arial' font-size='8' font-weight='bold' fill='#0f172a'>EDUCATION</text>
  <line x1='160' y1='92' x2='280' y2='92' stroke='#475569' stroke-width='1.2'/>
  <rect x='160' y='102' width='60' height='5' rx='2' fill='#0f172a'/>
  <rect x='160' y='110' width='45' height='4' rx='2' fill='#64748b'/>
  <text x='160' y='142' font-family='Arial' font-size='8' font-weight='bold' fill='#0f172a'>TECHNICAL SKILLS</text>
  <line x1='160' y1='146' x2='280' y2='146' stroke='#475569' stroke-width='1.2'/>
  ${[156, 172, 188, 204, 220].map((y) => `<rect x='160' y='${y}' width='115' height='10' rx='2' fill='#f1f5f9' stroke='#e2e8f0'/>`).join('')}
  <text x='160' y='254' font-family='Arial' font-size='8' font-weight='bold' fill='#0f172a'>PROJECTS</text>
  <line x1='160' y1='258' x2='280' y2='258' stroke='#475569' stroke-width='1.2'/>
  <rect x='160' y='268' width='70' height='5' rx='2' fill='#0f172a'/>
  <rect x='160' y='276' width='115' height='4' rx='2' fill='#64748b'/>
  <rect x='160' y='284' width='100' height='4' rx='2' fill='#94a3b8'/>
</svg>`);

export const resumeTemplates = [
  // Original Templates
  {
    id: "04",
    name: "ATS Classic",
    category: "ATS & Clean",
    description: "Classic single-column LaTeX-inspired ATS resume layout",
    thumbnailImg: ATS_THUMBNAIL,
    colorPaletteCode: "themeATS",
    atsScore: "99%",
    layoutType: "Single Column",
    recommendedRoles: ["Software Engineer", "Finance", "Legal", "General ATS"],
  },
  {
    id: "01",
    name: "Modern Clean",
    category: "Modern & Creative",
    description: "Balanced dual-column layout with clean blue highlights",
    thumbnailImg: Resume1,
    colorPaletteCode: "themeOne",
    atsScore: "92%",
    layoutType: "Two Column",
    recommendedRoles: ["Frontend Developer", "Full Stack", "Product Design"],
  },
  {
    id: "02",
    name: "Minimalist Grid",
    category: "Modern & Creative",
    description: "Compact modern grid with teal borders and centered header",
    thumbnailImg: Resume2,
    colorPaletteCode: "themeTwo",
    atsScore: "94%",
    layoutType: "Grid Header",
    recommendedRoles: ["Software Engineer", "QA Engineer", "Product Manager"],
  },
  {
    id: "03",
    name: "Vibrant Accent",
    category: "Modern & Creative",
    description: "Creative layout with vibrant color accents and timeline",
    thumbnailImg: Resume3,
    colorPaletteCode: "themeThree",
    atsScore: "88%",
    layoutType: "Accent Timeline",
    recommendedRoles: ["Creative Technologist", "Marketing", "UI/UX Designer"],
  },

  // Reactive Resume Templates
  {
    id: "azurill",
    name: "Azurill",
    category: "Reactive Resume",
    description: "Azure blue left sidebar with timeline nodes and avatar",
    thumbnailImg: AZURILL_THUMBNAIL,
    colorPaletteCode: "themeAzurill",
    atsScore: "91%",
    layoutType: "Left Sidebar",
    recommendedRoles: ["Full Stack Developer", "DevOps Engineer", "Software Architect"],
  },
  {
    id: "bronzor",
    name: "Bronzor",
    category: "Reactive Resume",
    description: "Warm bronze corporate header banner with 2-column body",
    thumbnailImg: BRONZOR_THUMBNAIL,
    colorPaletteCode: "themeBronzor",
    atsScore: "93%",
    layoutType: "Banner & 2-Col",
    recommendedRoles: ["Senior Lead", "System Architect", "Technical Consultant"],
  },
  {
    id: "chikorita",
    name: "Chikorita",
    category: "Reactive Resume",
    description: "Fresh emerald green with pill badges and left-accent bars",
    thumbnailImg: CHIKORITA_THUMBNAIL,
    colorPaletteCode: "themeChikorita",
    atsScore: "95%",
    layoutType: "Accent Border",
    recommendedRoles: ["Frontend Engineer", "Mobile Developer", "Agile Coach"],
  },
  {
    id: "ditgar",
    name: "Ditgar",
    category: "Reactive Resume",
    description: "Dark hero header band with modular rounded section cards",
    thumbnailImg: DITGAR_THUMBNAIL,
    colorPaletteCode: "themeDitgar",
    atsScore: "90%",
    layoutType: "Header Banner",
    recommendedRoles: ["Backend Engineer", "Cloud Engineer", "System Admin"],
  },
  {
    id: "ditto",
    name: "Ditto",
    category: "Reactive Resume",
    description: "Minimalist ATS master with clean rules and compact dates",
    thumbnailImg: DITTO_THUMBNAIL,
    colorPaletteCode: "themeDitto",
    atsScore: "99%",
    layoutType: "Clean Minimal",
    recommendedRoles: ["Software Engineer", "Data Scientist", "ATS High Pass"],
  },
  {
    id: "gengar",
    name: "Gengar",
    category: "Reactive Resume",
    description: "Bold developer tech theme with deep purple accent pills",
    thumbnailImg: GENGAR_THUMBNAIL,
    colorPaletteCode: "themeGengar",
    atsScore: "94%",
    layoutType: "Accent Header",
    recommendedRoles: ["Full Stack", "TypeScript Developer", "Tech Lead"],
  },
  {
    id: "glalie",
    name: "Glalie",
    category: "Reactive Resume",
    description: "Nordic ice cyan sidebar with geometric clean dividers",
    thumbnailImg: GLALIE_THUMBNAIL,
    colorPaletteCode: "themeGlalie",
    atsScore: "90%",
    layoutType: "Left Sidebar",
    recommendedRoles: ["Cloud Architect", "Product Designer", "Data Analyst"],
  },
  {
    id: "kakuna",
    name: "Kakuna",
    category: "Reactive Resume",
    description: "Cocoon modular card grid with warm amber borders",
    thumbnailImg: KAKUNA_THUMBNAIL,
    colorPaletteCode: "themeKakuna",
    atsScore: "92%",
    layoutType: "Card Grid",
    recommendedRoles: ["Product Manager", "Scrum Master", "Developer"],
  },
  {
    id: "lapras",
    name: "Lapras",
    category: "Reactive Resume",
    description: "Executive oceanic navy with refined serif headings",
    thumbnailImg: LAPRAS_THUMBNAIL,
    colorPaletteCode: "themeLapras",
    atsScore: "96%",
    layoutType: "Classic Serif",
    recommendedRoles: ["Executive", "Senior Manager", "Research Scientist"],
  },
  {
    id: "leafish",
    name: "Leafish",
    category: "Reactive Resume",
    description: "Organic forest green with timeline dots and pill chips",
    thumbnailImg: LEAFISH_THUMBNAIL,
    colorPaletteCode: "themeLeafish",
    atsScore: "93%",
    layoutType: "Green Accent",
    recommendedRoles: ["Environmental Tech", "BioTech Engineer", "Frontend"],
  },
  {
    id: "meowth",
    name: "Meowth",
    category: "Reactive Resume",
    description: "Warm gold executive layout with refined project links",
    thumbnailImg: MEOWTH_THUMBNAIL,
    colorPaletteCode: "themeMeowth",
    atsScore: "95%",
    layoutType: "Gold Executive",
    recommendedRoles: ["Business Analyst", "FinTech Developer", "Engineering Lead"],
  },
  {
    id: "onyx",
    name: "Onyx",
    category: "Reactive Resume",
    description: "Monochromatic high-contrast slate black corporate layout",
    thumbnailImg: ONYX_THUMBNAIL,
    colorPaletteCode: "themeOnyx",
    atsScore: "98%",
    layoutType: "High Contrast",
    recommendedRoles: ["Senior Engineer", "DevOps", "Cybersecurity Analyst"],
  },
  {
    id: "pikachu",
    name: "Pikachu",
    category: "Reactive Resume",
    description: "Electric amber tech layout with dynamic skill tags",
    thumbnailImg: PIKACHU_THUMBNAIL,
    colorPaletteCode: "themePikachu",
    atsScore: "93%",
    layoutType: "Electric Tech",
    recommendedRoles: ["Mobile Developer", "Web Developer", "Creative Tech"],
  },
  {
    id: "rhyhorn",
    name: "Rhyhorn",
    category: "Reactive Resume",
    description: "Rugged engineering layout with solid block section bars",
    thumbnailImg: RHYHORN_THUMBNAIL,
    colorPaletteCode: "themeRhyhorn",
    atsScore: "97%",
    layoutType: "Solid Blocks",
    recommendedRoles: ["Infrastructure", "Data Engineer", "SRE"],
  },
  {
    id: "scizor",
    name: "Scizor",
    category: "Reactive Resume",
    description: "Crimson ruby high-impact theme with right-side sidebar",
    thumbnailImg: SCIZOR_THUMBNAIL,
    colorPaletteCode: "themeScizor",
    atsScore: "89%",
    layoutType: "Right Sidebar",
    recommendedRoles: ["Creative Technologist", "UI Engineer", "Graphics"],
  },

  // Shanidhya Resume Builder Templates
  {
    id: "shanidhya-modern",
    name: "Shanidhya Modern",
    category: "Shanidhya",
    description: "Centered hero header with teal/cyan accents and summary card",
    thumbnailImg: SHANIDHYA_MODERN_THUMBNAIL,
    colorPaletteCode: "themeShanidhyaModern",
    atsScore: "97%",
    layoutType: "Teal Modern",
    recommendedRoles: ["Full Stack Developer", "Software Engineer", "Web Developer"],
  },
  {
    id: "shanidhya-creative",
    name: "Shanidhya Creative",
    category: "Shanidhya",
    description: "Dark slate sidebar with avatar, cyan badges, and clean narrative",
    thumbnailImg: SHANIDHYA_CREATIVE_THUMBNAIL,
    colorPaletteCode: "themeShanidhyaCreative",
    atsScore: "91%",
    layoutType: "Dark Sidebar",
    recommendedRoles: ["Frontend Developer", "UI/UX Designer", "Product Designer"],
  },
  {
    id: "shanidhya-executive",
    name: "Shanidhya Executive",
    category: "Shanidhya",
    description: "Royal navy header banner with leadership track record layout",
    thumbnailImg: SHANIDHYA_EXECUTIVE_THUMBNAIL,
    colorPaletteCode: "themeShanidhyaExecutive",
    atsScore: "96%",
    layoutType: "Executive Navy",
    recommendedRoles: ["Engineering Manager", "Tech Lead", "CTO / Director"],
  },
  {
    id: "shanidhya-minimal",
    name: "Shanidhya Minimal",
    category: "Shanidhya",
    description: "Ultra-lean left-aligned ATS layout with generous whitespace",
    thumbnailImg: SHANIDHYA_MINIMAL_THUMBNAIL,
    colorPaletteCode: "themeShanidhyaMinimal",
    atsScore: "98%",
    layoutType: "Lean Minimal",
    recommendedRoles: ["Senior Software Engineer", "Backend Developer", "ATS High Pass"],
  },
  {
    id: "shanidhya-twocolumn",
    name: "Shanidhya Two Column",
    category: "Shanidhya",
    description: "Symmetrical 50/50 dual column layout with slate accent bar",
    thumbnailImg: SHANIDHYA_TWOCOLUMN_THUMBNAIL,
    colorPaletteCode: "themeShanidhyaTwoColumn",
    atsScore: "95%",
    layoutType: "Dual Column",
    recommendedRoles: ["Full Stack", "Data Analyst", "Technical Consultant"],
  },
];

export const DUMMY_RESUME_DATA = {
    profileInfo: {
        previewUrl: "",
        fullName: "Alex Johnson",
        designation: "Senior Software Developer",
        summary: "Full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks. Specialized in React, Node.js, and cloud technologies with a strong focus on clean code architecture and performance optimization. Passionate about mentoring junior developers and implementing agile best practices.",
    },
    contactInfo: {
        email: "alex.johnson.dev@gmail.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/alexjohnson-dev",
        github: "https://github.com/alexjohnson-code",
        website: "https://alexjohnson.dev",
    },
    education: [
        {
            institution: "Stanford University",
            degree: "Master of Science",
            major: "Computer Science",
            minors: "Data Science",
            location: "Stanford, CA",
            graduationYear: "2018"
        },
        {
            institution: "University of California",
            degree: "Bachelor of Science",
            major: "Software Engineering",
            minors: "Mathematics",
            location: "Berkeley, CA",
            graduationYear: "2016"
        }
    ],
    workExperience: [
        {
            role: "Senior Software Engineer",
            company: "TechSolutions Inc.",
            location: "San Francisco, CA",
            startDate: "2020-06-01",
            endDate: "2023-12-31",
            description: "Led a team of 5 developers in building a SaaS platform serving 50,000+ users.\nArchitected microservices using Node.js and React that improved system performance by 40%.\nImplemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes.\nMentored junior developers through code reviews and pair programming sessions."
        },
        {
            role: "Software Developer",
            company: "InnovateSoft",
            location: "San Jose, CA",
            startDate: "2018-07-01",
            endDate: "2020-05-31",
            description: "Developed RESTful APIs handling 10,000+ requests per minute with 99.9% uptime.\nRedesigned legacy frontend using React, improving page load speed by 60%.\nCollaborated with UX team to implement responsive designs for mobile users.\nAutomated testing processes increasing test coverage from 65% to 95%."
        }
    ],
    projects: [
        {
            title: "E-commerce Analytics Dashboard",
            startDate: "2022-03-01",
            endDate: "2022-08-31",
            description: "Built a real-time analytics dashboard for e-commerce clients to track sales, inventory, and customer behavior.",
            technologies: ["React", "D3.js", "Node.js", "MongoDB"],
            github: "https://github.com/alexjohnson-code/ecommerce-analytics",
            liveDemo: "https://demo.alexjohnson.dev/analytics"
        },
        {
            title: "AI-Powered Code Review Tool",
            startDate: "2021-01-01",
            endDate: "2021-06-30",
            description: "Developed a machine learning tool that analyzes pull requests and suggests code improvements.",
            technologies: ["Python", "TensorFlow", "Flask", "GitHub API"],
            github: "https://github.com/alexjohnson-code/ai-code-review"
        }
    ],
    skills: [
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "React" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "AWS" },
        { name: "Docker" },
        { name: "Kubernetes" },
        { name: "GraphQL" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
        { name: "Git" },
        { name: "Agile" },
        { name: "Scrum" },
        { name: "JIRA" }
    ],
    certifications: [
        {
            title: "AWS Certified Solutions Architect",
            year: "2022"
        },
        {
            title: "Google Professional Cloud Architect",
            year: "2021"
        },
        {
            title: "Certified Scrum Master",
            year: "2020"
        }
    ],
    interests: [
        "Open Source Contributions",
        "Machine Learning",
        "Blockchain Technology",
        "Hiking",
        "Photography"
    ]
};