// ATS (Applicant Tracking System) scoring engine — 100% client-side.
//
// Two modes:
//  - Without a job description: scores resume quality/structure the way ATS
//    parsers see it (contact info, sections, depth, action verbs, ...).
//  - With a job description: extracts keywords from the JD and measures how
//    well the resume covers them, blended with the quality score.

import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

// ---------------------------------------------------------------- text utils

const STOPWORDS = new Set(
  `a an and are as at be by for from has have how in is it its of on or that the to was were will with you your our we they their this these those what which who whom
  about above after again all also am any because been before being below between both but can cannot could did do does doing down during each few further had having he her here hers herself him himself his if into itself just me more most my myself no nor not now off once only other ought ours ourselves out over own same she should so some such than then there theirs them themselves through too under until up very via want wanting need needed able ability using use used work working works role roles job jobs position positions company companies candidate candidates applicant applicants must may might shall would like etc including include includes preferred required requirement requirements responsibilities responsibility qualification qualifications strong excellent good great plus year years experience experiences new
  familiarity familiar knowledge hiring improve improved improving ensure ensuring ideal ideally join joining seeking seek looking look`
    .split(/\s+/)
)

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  return normalize(text)
    .split(/[\s/]+/)
    .map((w) => w.replace(/^[-.]+|[-.]+$/g, ''))
    .filter(Boolean)
}

// ---------------------------------------------------------------- resume text

export function resumeToText(resume) {
  if (!resume) return ''
  const parts = []
  const push = (v) => v && String(v).trim() && parts.push(String(v).trim())

  push(resume.title)
  const p = resume.profileInfo || {}
  push(p.fullName); push(p.designation); push(p.summary); push(p.profilePreviewUrl === '' ? '' : '')
  const c = resume.contactInfo || {}
  push(c.email); push(c.phone); push(c.location); push(c.linkedin); push(c.github); push(c.website)

  ;(resume.workExperience || []).forEach((w) => {
    push(w.company); push(w.role); push(w.startDate); push(w.endDate); push(w.description)
  })
  ;(resume.education || []).forEach((e) => {
    push(e.degree); push(e.institution); push(e.startDate); push(e.endDate)
  })
  ;(resume.skills || []).forEach((s) => push(s.name))
  ;(resume.projects || []).forEach((pr) => {
    push(pr.title); push(pr.description); push(pr.github); push(pr.liveDemo)
  })
  ;(resume.certifications || []).forEach((cert) => {
    push(cert.title); push(cert.issuer); push(cert.year)
  })
  ;(resume.languages || []).forEach((l) => push(l.name))
  ;(resume.interests || []).forEach((i) => push(i))

  return normalize(parts.join(' . '))
}

// ---------------------------------------------------------------- JD keywords

export function extractKeywords(jdText, limit = 24) {
  const words = tokenize(jdText)
  const unigrams = new Map()
  words.forEach((w, i) => {
    if (w.length < 3 || STOPWORDS.has(w) || /^\d+$/.test(w)) return
    const entry = unigrams.get(w) || { term: w, count: 0, isBigram: false }
    entry.count++
    unigrams.set(w, entry)
  })

  const bigrams = new Map()
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i]
    const b = words[i + 1]
    if (a.length < 3 || b.length < 3 || STOPWORDS.has(a) || STOPWORDS.has(b)) continue
    const term = `${a} ${b}`
    const entry = bigrams.get(term) || { term, count: 0, isBigram: true }
    entry.count++
    bigrams.set(term, entry)
  }

  const all = [...unigrams.values(), ...bigrams.values().filter((b) => b.count >= 2)]
  all.sort((x, y) => y.count - x.count || y.term.length - x.term.length)

  // prefer longer terms: drop a unigram if a bigram containing it made the cut
  const picked = []
  const seen = new Set()
  for (const entry of all) {
    if (picked.length >= limit) break
    if (entry.isBigram) {
      const overlap = entry.term.split(' ').every((w) => picked.some((p) => p.term === w))
      if (overlap) continue
      picked.push(entry)
      entry.term.split(' ').forEach((w) => seen.add(w))
    } else {
      if (seen.has(entry.term)) continue
      picked.push(entry)
    }
  }
  return picked
}

function findMatches(resumeText, keywords) {
  const matched = []
  const missing = []
  keywords.forEach((k) => {
    const needle = k.isBigram ? k.term : `\\b${k.term.replace(/[.+*]/g, (m) => '\\' + m)}\\b`
    const re = k.isBigram ? new RegExp(needle) : new RegExp(needle)
    if (re.test(resumeText)) matched.push(k)
    else missing.push(k)
  })
  return { matched, missing }
}

// ------------------------------------------------------------ quality scoring

const ACTION_VERBS = new Set(
  `led built created designed developed implemented improved increased reduced managed launched built architected
  automated optimized streamlined delivered drove owned spearheaded established mentored trained analyzed researched
  scaled migrated integrated shipped negotiated coordinated executed achieved delivered grew saved generated`
    .split(/\s+/)
)

function hasQuantified(text) {
  return /\d+\s*(%|percent|x|k\b|\+)|\$\s?\d|\b\d{2,}\b/i.test(text)
}

export function analyzeQuality(resume) {
  const categories = []
  const suggestions = []
  const stats = { words: 0, sections: 0 }

  const text = resumeToText(resume)
  stats.words = text ? text.split(' ').length : 0

  const add = (key, label, score, max, issues) => {
    categories.push({ key, label, score, max, issues })
  }

  // Contact information — 15
  const c = resume.contactInfo || {}
  const contactScore = (c.email ? 5 : 0) + (c.phone ? 5 : 0) + ((c.location || c.linkedin || c.github || c.website) ? 5 : 0)
  const contactIssues = []
  if (!c.email) contactIssues.push('Add a professional email address')
  if (!c.phone) contactIssues.push('Add a phone number')
  if (!c.location && !c.linkedin && !c.github && !c.website) contactIssues.push('Add at least one of: location, LinkedIn, GitHub or website')
  add('contact', 'Contact details', contactScore, 15, contactIssues)
  contactIssues.forEach((i) => suggestions.push(i))

  // Professional summary — 10
  const summary = (resume.profileInfo?.summary || '').trim()
  const summaryWords = summary ? summary.split(/\s+/).length : 0
  const summaryScore = (summaryWords > 0 ? 6 : 0) + (summaryWords >= 30 ? 4 : 0)
  const summaryIssues = []
  if (!summaryWords) summaryIssues.push('Write a professional summary (2–4 sentences)')
  else if (summaryWords < 30) summaryIssues.push(`Expand your summary — currently ${summaryWords} words, aim for 30–80`)
  add('summary', 'Professional summary', summaryScore, 10, summaryIssues)
  summaryIssues.forEach((i) => suggestions.push(i))

  // Work experience — 25
  const jobs = (resume.workExperience || []).filter((w) => (w.company || '').trim() && (w.role || '').trim())
  const descText = jobs.map((w) => w.description || '').join(' ')
  let expScore = 0
  const expIssues = []
  if (jobs.length >= 1) expScore += 10
  if (jobs.some((w) => (w.description || '').trim().length > 40)) expScore += 5
  if (tokenize(descText).some((w) => ACTION_VERBS.has(w))) expScore += 5
  if (hasQuantified(descText)) expScore += 3
  if (jobs.every((w) => w.startDate && w.endDate)) expScore += 2
  if (!jobs.length) {
    expIssues.push('Add at least one work experience entry (company and role)')
  } else {
    if (!tokenize(descText).some((w) => ACTION_VERBS.has(w))) expIssues.push('Start bullet points with strong action verbs (led, built, improved…)')
    if (!hasQuantified(descText)) expIssues.push('Quantify achievements with numbers (e.g. “reduced latency by 40%”)')
    if (!jobs.every((w) => w.startDate && w.endDate)) expIssues.push('Add start and end dates for every role')
  }
  add('experience', 'Work experience', Math.min(expScore, 25), 25, expIssues)
  expIssues.forEach((i) => suggestions.push(i))

  // Education — 10
  const edus = (resume.education || []).filter((e) => (e.degree || '').trim() || (e.institution || '').trim())
  const eduScore = edus.length ? (edus.every((e) => e.degree && e.institution) ? 10 : 7) : 0
  const eduIssues = edus.length ? (edus.every((e) => e.degree && e.institution) ? [] : ['Add both the degree and institution for each education entry']) : ['Add your education (degree + institution)']
  add('education', 'Education', eduScore, 10, eduIssues)
  eduIssues.forEach((i) => suggestions.push(i))

  // Skills — 15
  const skills = (resume.skills || []).filter((s) => (s.name || '').trim())
  const skillScore = skills.length >= 8 ? 15 : skills.length >= 5 ? 12 : skills.length >= 3 ? 8 : skills.length >= 1 ? 5 : 0
  const skillIssues = skills.length >= 5 ? [] : skills.length ? `List at least 5 skills — you have ${skills.length}` : 'Add a skills section with your top 5–10 skills'
  const skillIssuesArr = Array.isArray(skillIssues) ? skillIssues : [skillIssues]
  add('skills', 'Skills', skillScore, 15, skillIssuesArr)
  skillIssuesArr.forEach((i) => suggestions.push(i))

  // Content depth — 15
  let depthScore = 0
  const depthIssues = []
  if (stats.words >= 220) depthScore += 8
  else if (stats.words >= 120) depthScore += 5
  else if (stats.words >= 60) depthScore += 3
  if (stats.words >= 220 && stats.words <= 900) depthScore += 7
  else if (stats.words > 900) depthScore += 4
  if (stats.words < 120) depthIssues.push(`Your resume is very short (${stats.words} words) — aim for 250–600 words of real content`)
  else if (stats.words < 220) depthIssues.push(`Add more detail — ${stats.words} words so far, aim for 250–600`)
  add('depth', 'Content depth', Math.min(depthScore, 15), 15, depthIssues)
  depthIssues.forEach((i) => suggestions.push(i))

  // Extras — 10
  const extras = [
    (resume.projects || []).some((p) => (p.title || '').trim()),
    (resume.certifications || []).some((cert) => (cert.title || '').trim()),
    (resume.languages || []).some((l) => (l.name || '').trim()),
    (resume.interests || []).some((i) => (i || '').trim()),
  ]
  const extrasCount = [extras[0], extras[2], extras[3]].filter(Boolean).length + (extras[1] ? 1 : 0)
  const extrasScore = Math.min(extrasCount * 3 + (extrasCount >= 3 ? 1 : 0), 10)
  const extrasIssues = extrasCount >= 2 ? [] : ['Round out your resume with projects, certifications or languages']
  add('extras', 'Extras (projects, certifications…)', extrasScore, 10, extrasIssues)
  if (extrasCount < 2) suggestions.push(extrasIssues[0])

  const score = Math.max(0, Math.min(100, categories.reduce((sum, cat) => sum + cat.score, 0)))
  return { score, categories, suggestions, stats }
}

// ------------------------------------------------------------------- report

export function bandFor(score) {
  if (score >= 80) return { label: 'Excellent', color: '#12B76A', tone: 'great' }
  if (score >= 60) return { label: 'Good', color: '#F59E0B', tone: 'ok' }
  if (score >= 40) return { label: 'Fair', color: '#FB7185', tone: 'meh' }
  return { label: 'Needs work', color: '#EF4444', tone: 'bad' }
}

// Quality analysis for plain text (e.g. an uploaded PDF resume). Uses the same
// category structure as analyzeQuality so both feed the same report UI.
export function analyzePlainText(text) {
  const raw = String(text || '')
  const lower = normalize(raw)
  const words = lower ? lower.split(' ').length : 0
  const categories = []
  const suggestions = []
  const has = (re) => re.test(lower)

  const add = (key, label, score, max, issues) => {
    categories.push({ key, label, score, max, issues })
  }

  // Contact — 15
  const email = /[\w.+-]+@[\w-]+\.[\w.]+/.test(lower)
  const phone = /(\+?\d[\d\s().-]{7,}\d)/.test(lower)
  const linked = has(/linkedin|github|portfolio/)
  const contactScore = (email ? 5 : 0) + (phone ? 5 : 0) + (linked ? 5 : 0)
  const contactIssues = [
    !email && 'No email address detected',
    !phone && 'No phone number detected',
    !linked && 'No LinkedIn / GitHub / portfolio link detected',
  ].filter(Boolean)
  add('contact', 'Contact details', contactScore, 15, contactIssues)
  suggestions.push(...contactIssues)

  // Section headers — 10
  const sectionHeaders = ['summary', 'objective', 'experience', 'employment', 'education', 'skills', 'projects', 'certifications']
  const foundHeaders = sectionHeaders.filter((h) => has(new RegExp(`(^|\\s)${h}`, 'i')))
  const headerScore = Math.min((foundHeaders.length >= 4 ? 7 : foundHeaders.length >= 2 ? 4 : 0) + (foundHeaders.length >= 6 ? 3 : 0), 10)
  const headerIssues = foundHeaders.length >= 4 ? [] : 'Use standard section headings (Summary, Experience, Education, Skills) so ATS parsers can find them'
  const headerIssuesArr = Array.isArray(headerIssues) ? headerIssues : [headerIssues]
  add('headers', 'Section headings', headerScore, 10, headerIssuesArr)
  suggestions.push(...headerIssuesArr)

  // Experience signals — 25
  let expScore = 0
  const expIssues = []
  if (has(/experience|employment|work history/)) expScore += 8
  const actionHits = tokenize(raw).filter((w) => ACTION_VERBS.has(w)).length
  if (actionHits >= 3) expScore += 7
  else if (actionHits >= 1) expScore += 4
  else expIssues.push('Start bullet points with strong action verbs (led, built, improved…)')
  if (hasQuantified(raw)) expScore += 6
  else expIssues.push('Quantify achievements with numbers (e.g. "reduced latency by 40%")')
  if (has(/\b(19|20)\d{2}\b/)) expScore += 4
  else expIssues.push('Add dates (years) for your experience and education')
  add('experience', 'Experience signals', expScore, 25, expIssues)
  suggestions.push(...expIssues)

  // Skills — 15
  let skillScore = 0
  const skillIssues = []
  if (has(/skills|technologies|tech stack/)) skillScore += 7
  const commas = (raw.match(/,/g) || []).length
  if (commas >= 8) skillScore += 8
  else if (commas >= 3) skillScore += 5
  else skillIssues.push('List your skills explicitly (e.g. a "Skills" section with 5-10 items)')
  add('skills', 'Skills', skillScore, 15, skillIssues)
  suggestions.push(...skillIssues)

  // Depth — 20
  let depthScore = 0
  const depthIssues = []
  if (words >= 250) depthScore += 12
  else if (words >= 120) depthScore += 7
  else depthIssues.push(`Resume looks very short (${words} words) — aim for 250-600`)
  if (words >= 250 && words <= 1000) depthScore += 8
  else if (words > 1000) depthScore += 5
  add('depth', 'Content depth', Math.min(depthScore, 20), 20, depthIssues)
  suggestions.push(...depthIssues)

  // Extras — 15
  const extras = ['projects', 'certifications', 'certificates', 'languages', 'awards', 'volunteer']
  const foundExtras = extras.filter((h) => has(new RegExp(h, 'i'))).length
  const extrasScore = Math.min(foundExtras * 5 + (foundExtras >= 2 ? 5 : 0), 15)
  const extrasIssues = foundExtras >= 1 ? [] : 'Round out your resume with projects, certifications or languages'
  const extrasIssuesArr = Array.isArray(extrasIssues) ? extrasIssues : [extrasIssues]
  add('extras', 'Extras (projects, certifications…)', extrasScore, 15, extrasIssuesArr)
  suggestions.push(...extrasIssuesArr)

  const score = Math.max(0, Math.min(100, categories.reduce((sum, cat) => sum + cat.score, 0)))
  return { score, categories, suggestions, stats: { words } }
}

export function computeTextAtsReport({ text, jdText }) {
  const quality = analyzePlainText(text)
  const resumeText = normalize(text)
  const jd = (jdText || '').trim()

  if (!jd) {
    return {
      mode: 'quality',
      score: quality.score,
      band: bandFor(quality.score),
      categories: quality.categories,
      suggestions: quality.suggestions.slice(0, 8),
      stats: quality.stats,
      keywords: null,
    }
  }

  const keywords = extractKeywords(jd)
  const { matched, missing } = findMatches(resumeText, keywords)
  const totalWeight = keywords.reduce((s, k) => s + k.count, 0) || 1
  const coveredWeight = matched.reduce((s, k) => s + k.count, 0)
  const coverage = keywords.length ? coveredWeight / totalWeight : 0

  const score = Math.round(100 * (0.65 * coverage + 0.35 * (quality.score / 100)))

  return {
    mode: 'jd',
    score,
    band: bandFor(score),
    categories: quality.categories,
    suggestions: quality.suggestions.slice(0, 8),
    stats: quality.stats,
    keywords: {
      analyzed: keywords.length,
      matched: matched.map((k) => k.term),
      missing: missing.map((k) => k.term),
      coverage: Math.round(coverage * 100),
    },
  }
}

export function computeAtsReport({ resume, jdText }) {
  const quality = analyzeQuality(resume)
  const resumeText = resumeToText(resume)
  const jd = (jdText || '').trim()

  if (!jd) {
    return {
      mode: 'quality',
      score: quality.score,
      band: bandFor(quality.score),
      categories: quality.categories,
      suggestions: quality.suggestions.slice(0, 8),
      stats: quality.stats,
      keywords: null,
    }
  }

  const keywords = extractKeywords(jd)
  const { matched, missing } = findMatches(resumeText, keywords)
  const totalWeight = keywords.reduce((s, k) => s + k.count, 0) || 1
  const coveredWeight = matched.reduce((s, k) => s + k.count, 0)
  const coverage = keywords.length ? coveredWeight / totalWeight : 0

  const score = Math.round(100 * (0.65 * coverage + 0.35 * (quality.score / 100)))

  return {
    mode: 'jd',
    score,
    band: bandFor(score),
    categories: quality.categories,
    suggestions: quality.suggestions.slice(0, 8),
    stats: quality.stats,
    keywords: {
      analyzed: keywords.length,
      matched: matched.map((k) => k.term),
      missing: missing.map((k) => k.term),
      coverage: Math.round(coverage * 100),
    },
  }
}

// ------------------------------------------------------------ PDF extraction

export async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  return pages.join('\n')
}
