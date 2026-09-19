// Word export: generates a clean, ATS-friendly Word document (.doc) from the
// structured resume data. Word-compatible HTML with Office XML header opens
// directly in Microsoft Word / Google Docs / LibreOffice with real, editable
// text (unlike the PDF which is a rendered snapshot).
import moment from 'moment'

const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const fmtMonth = (ym) => (ym ? moment(ym, 'YYYY-MM').format('MMM YYYY') : '')
const dateRange = (start, end) => {
  const s = fmtMonth(start)
  const e = fmtMonth(end)
  if (!s && !e) return ''
  return [s, e].filter(Boolean).join(' – ')
}

const STYLE = `
  body { font-family: Calibri, Arial, sans-serif; color: #1a1a1a; font-size: 11pt; line-height: 1.35; }
  h1 { font-size: 22pt; margin: 0 0 2pt 0; color: #0b282e; }
  .role { font-size: 12pt; color: #1e7280; font-weight: bold; margin: 0 0 6pt 0; }
  .contact { font-size: 10pt; color: #444444; margin: 0 0 4pt 0; }
  h2 { font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: #0b282e;
       border-bottom: 1.5px solid #1e7280; padding-bottom: 2pt; margin: 16pt 0 6pt 0; }
  .item { margin: 0 0 8pt 0; }
  .item-head { margin: 0; font-size: 11pt; }
  .item-sub { margin: 0; font-size: 10.5pt; color: #333333; }
  .dates { float: right; font-size: 10pt; color: #666666; font-style: italic; }
  p { margin: 3pt 0 0 0; }
  ul { margin: 3pt 0 0 18pt; padding: 0; }
  li { margin-bottom: 2pt; }
  .skills { margin: 3pt 0 0 0; }
`

function contactLine(c) {
  return [c.email, c.phone, c.location, c.linkedin, c.github, c.website]
    .map((v) => (v || '').trim())
    .filter(Boolean)
    .map(esc)
    .join(' &nbsp;•&nbsp; ')
}

function section(title, inner) {
  if (!inner || !inner.trim()) return ''
  return `<h2>${esc(title)}</h2>${inner}`
}

export function buildResumeWordHtml(resume) {
  const p = resume.profileInfo || {}
  const c = resume.contactInfo || {}
  const skills = (resume.skills || []).map((s) => (s.name || '').trim()).filter(Boolean)

  const work = (resume.workExperience || [])
    .filter((w) => (w.company || '').trim() || (w.role || '').trim())
    .map((w) => {
      const bullets = (w.description || '')
        .split(/(?:\. |;\s*)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 3)
      const desc = bullets.length > 1
        ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
        : `<p>${esc(w.description || '')}</p>`
      return `<div class="item">
        <p class="item-head"><strong>${esc(w.role)}</strong>${w.company ? ` — ${esc(w.company)}` : ''}<span class="dates">${esc(dateRange(w.startDate, w.endDate))}</span></p>
        ${desc}
      </div>`
    })
    .join('')

  const education = (resume.education || [])
    .filter((e) => (e.degree || '').trim() || (e.institution || '').trim())
    .map((e) => `<div class="item">
        <p class="item-head"><strong>${esc(e.degree)}</strong><span class="dates">${esc(dateRange(e.startDate, e.endDate))}</span></p>
        ${e.institution ? `<p class="item-sub">${esc(e.institution)}</p>` : ''}
      </div>`)
    .join('')

  const projects = (resume.projects || [])
    .filter((pr) => (pr.title || '').trim())
    .map((pr) => `<div class="item">
        <p class="item-head"><strong>${esc(pr.title)}</strong></p>
        ${pr.description ? `<p>${esc(pr.description)}</p>` : ''}
        ${pr.github ? `<p>${esc(pr.github)}</p>` : ''}
        ${pr.liveDemo ? `<p>${esc(pr.liveDemo)}</p>` : ''}
      </div>`)
    .join('')

  const certs = (resume.certifications || [])
    .filter((cert) => (cert.title || '').trim())
    .map((cert) => `<div class="item">
        <p class="item-head"><strong>${esc(cert.title)}</strong>${cert.year ? `<span class="dates">${esc(cert.year)}</span>` : ''}</p>
        ${cert.issuer ? `<p class="item-sub">${esc(cert.issuer)}</p>` : ''}
      </div>`)
    .join('')

  const languages = (resume.languages || [])
    .map((l) => (l.name || '').trim())
    .filter(Boolean)
  const interests = (resume.interests || []).map((i) => (i || '').trim()).filter(Boolean)

  const extras = [
    languages.length ? `<p class="skills"><strong>Languages:</strong> ${esc(languages.join(', '))}</p>` : '',
    interests.length ? `<p class="skills"><strong>Interests:</strong> ${esc(interests.join(', '))}</p>` : '',
  ].join('')

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${esc(resume.title || 'Resume')}</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
  <style>${STYLE}</style>
</head>
<body>
  <h1>${esc(p.fullName || resume.title || 'Resume')}</h1>
  ${p.designation ? `<p class="role">${esc(p.designation)}</p>` : ''}
  <p class="contact">${contactLine(c)}</p>

  ${section('Professional Summary', p.summary ? `<p>${esc(p.summary)}</p>` : '')}
  ${section('Work Experience', work)}
  ${section('Education', education)}
  ${section('Skills', skills.length ? `<p class="skills">${esc(skills.join(' • '))}</p>` : '')}
  ${section('Projects', projects)}
  ${section('Certifications', certs)}
  ${extras}
</body>
</html>`
}

export function downloadResumeWord(resume, filenameBase) {
  const html = buildResumeWordHtml(resume)
  const safeName = (filenameBase || 'Resume').replace(/[^a-z0-9]/gi, '_')
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
