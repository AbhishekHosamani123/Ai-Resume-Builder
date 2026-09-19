// ATS (Applicant Tracking System) scoring engine — 100% client-side.
//
// Two modes:
//  - Without a job description: scores resume quality/structure the way ATS
//    parsers see it (contact info, sections, depth, action verbs, ...).
//  - With a job description: extracts keywords (dictionary skills first,
//    then free-form terms) and measures resume coverage, blended with the
//    quality score. Missing keywords are addable straight into the resume.

import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

// ---------------------------------------------------------------- text utils

const STOPWORDS = new Set(
  `a an and are as at be by for from has have how in is it its of on or that the to was were will with you your our we they their this these those what which who whom
  about above after again all also am any because been before being below between both but can cannot could did do does doing down during each few further had having he her here hers herself him himself his if into itself just me more most my myself no nor not now off once only other ought ours ourselves out over own same she should so some such than then there theirs them themselves through too under until up very via want wanting need needed able ability using use used work working works role roles job jobs position positions company companies candidate candidates applicant applicants must may might shall would like etc including include includes preferred required requirement requirements responsibilities responsibility qualification qualifications strong excellent good great plus year years experience experiences new
  familiarity familiar knowledge hiring improve improved improving ensure ensuring ideal ideally join joining seeking seek looking look join us team teams helping help helpus`
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

// ---------------------------------------------------------------- skill dictionary
// canonical term -> aliases. Skills found in the JD via the dictionary are
// high-confidence, actionable keywords a user can add to their resume.

const SKILL_DICTIONARY = [
  // languages & frameworks
  { c: 'JavaScript', a: ['javascript', 'js', 'es6', 'ecmascript'] },
  { c: 'TypeScript', a: ['typescript', 'ts'] },
  { c: 'Python', a: ['python3'] },
  { c: 'Java', a: ['core java', 'java 8'] },
  { c: 'C++', a: ['cpp'] },
  { c: 'C#', a: ['csharp', 'c sharp'] },
  { c: '.NET', a: ['dotnet', 'asp.net', 'aspnet'] },
  { c: 'PHP', a: ['php8'] },
  { c: 'Go', a: ['golang'] },
  { c: 'Rust', a: [] },
  { c: 'Swift', a: [] },
  { c: 'Kotlin', a: [] },
  { c: 'Ruby', a: ['ruby on rails', 'rails'] },
  { c: 'HTML', a: ['html5'] },
  { c: 'CSS', a: ['css3'] },
  // frontend
  { c: 'React', a: ['reactjs', 'react.js'] },
  { c: 'Next.js', a: ['nextjs', 'next js'] },
  { c: 'Vue.js', a: ['vue', 'vuejs'] },
  { c: 'Angular', a: ['angularjs'] },
  { c: 'Tailwind CSS', a: ['tailwind', 'tailwindcss'] },
  { c: 'Redux', a: [] },
  { c: 'Flutter', a: [] },
  // backend & data
  { c: 'Node.js', a: ['nodejs', 'node js', 'node'] },
  { c: 'Express.js', a: ['expressjs', 'express'] },
  { c: 'Django', a: [] },
  { c: 'Flask', a: [] },
  { c: 'Spring Boot', a: ['spring', 'springboot'] },
  { c: 'REST APIs', a: ['rest api', 'rest apis', 'restful', 'restful api', 'rest'] },
  { c: 'GraphQL', a: ['apollo'] },
  { c: 'MongoDB', a: ['mongo'] },
  { c: 'PostgreSQL', a: ['postgres'] },
  { c: 'MySQL', a: [] },
  { c: 'SQL', a: [] },
  { c: 'Redis', a: [] },
  { c: 'Firebase', a: [] },
  { c: 'Kafka', a: ['apache kafka'] },
  { c: 'RabbitMQ', a: ['rabbit mq'] },
  { c: 'Elasticsearch', a: ['elastic search'] },
  // devops & cloud
  { c: 'Docker', a: ['containerization', 'containers'] },
  { c: 'Kubernetes', a: ['k8s'] },
  { c: 'AWS', a: ['amazon web services', 'ec2', 's3', 'aws lambda'] },
  { c: 'Azure', a: ['microsoft azure'] },
  { c: 'GCP', a: ['google cloud'] },
  { c: 'CI/CD', a: ['ci cd', 'cicd', 'continuous integration', 'continuous delivery', 'jenkins', 'github actions', 'gitlab ci'] },
  { c: 'Terraform', a: [] },
  { c: 'Git', a: ['github', 'gitlab', 'version control'] },
  { c: 'Linux', a: ['unix'] },
  { c: 'Nginx', a: [] },
  // practices & soft
  { c: 'Agile', a: ['scrum', 'kanban'] },
  { c: 'System Design', a: ['system architecture', 'architecture design', 'distributed systems'] },
  { c: 'JWT', a: ['json web token', 'oauth', 'authentication'] },
  { c: 'Unit Testing', a: ['unit tests', 'jest', 'mocha', 'pytest'] },
  { c: 'Machine Learning', a: ['ml', 'deep learning'] },
  { c: 'Figma', a: [] },
  { c: 'Jira', a: [] },
  { c: 'Leadership', a: ['team lead', 'led teams'] },
  { c: 'Mentoring', a: ['mentor', 'mentored', 'mentoring'] },
  { c: 'Communication', a: ['communication skills'] },
  { c: 'Problem Solving', a: ['problem-solving', 'analytical thinking'] },
  { c: 'Scalability', a: ['scalable', 'scaling'] },
  { c: 'Performance Optimization', a: ['performance optimization', 'latency', 'optimization'] },
  { c: 'Reliability', a: ['reliable', 'high availability'] },
  { c: 'Microservices', a: ['micro services', 'micro-services'] },
]

// normalized lookup: alias/canonical -> canonical
const SKILL_LOOKUP = new Map()
for (const skill of SKILL_DICTIONARY) {
  SKILL_LOOKUP.set(normalize(skill.c), skill.c)
  for (const alias of skill.a) SKILL_LOOKUP.set(normalize(alias), skill.c)
}

// ---------------------------------------------------------------- resume text

export function resumeToText(resume) {
  if (!resume) return ''
  const parts = []
  const push = (v) => v && String(v).trim() && parts.push(String(v).trim())

  push(resume.title)
  const p = resume.profileInfo || {}
  push(p.fullName); push(p.designation); push(p.summary)
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

function countOccurrences(haystack, needle) {
  if (!needle) return 0
  let count = 0
  let idx = haystack.indexOf(needle)
  while (idx !== -1) {
    count++
    idx = haystack.indexOf(needle, idx + needle.length)
  }
  return count
}

// word-boundary match that tolerates plural/verb morphs on longer words
function termRegex(term) {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${esc}(s|es|ing|ed)?\\b`, 'i')
}

export function extractKeywords(jdText, limit = 20) {
  const norm = normalize(jdText)
  const words = tokenize(jdText)
  const keywords = []
  const covered = new Set()

  // 1) dictionary skills — high confidence, addable
  for (const [aliasNorm, canonical] of SKILL_LOOKUP) {
    if (covered.has(canonical)) continue
    const count = countOccurrences(norm, aliasNorm)
    if (count > 0) {
      covered.add(canonical)
      keywords.push({ term: canonical, count, isSkill: true })
    }
  }

  // 2) free-form bigrams (multi-word requirements like "system design")
  const bigrams = new Map()
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i]
    const b = words[i + 1]
    if (a.length < 3 || b.length < 3 || STOPWORDS.has(a) || STOPWORDS.has(b)) continue
    const term = `${a} ${b}`
    if (termRegex(term).test(norm) === false) continue
    const entry = bigrams.get(term) || { term, count: 0, isSkill: false }
    entry.count++
    bigrams.set(term, entry)
  }
  const topBigrams = [...bigrams.values()].filter((b) => b.count >= 2)
  for (const b of topBigrams) {
    covered.add(b.term)
    for (const w of b.term.split(' ')) covered.add(w)
    keywords.push(b)
  }

  // 3) free-form unigrams not already covered
  const unigrams = new Map()
  for (const w of words) {
    if (w.length < 3 || w.length > 24 || /^\d+$/.test(w)) continue
    if (STOPWORDS.has(w) || covered.has(w)) continue
    const entry = unigrams.get(w) || { term: w, count: 0, isSkill: false }
    entry.count++
    unigrams.set(w, entry)
  }

  keywords.push(...unigrams.values())
  keywords.sort((x, y) => y.count - x.count || (y.isSkill ? 1 : 0) - (x.isSkill ? 1 : 0) || y.term.length - x.term.length)

  // prefer a balanced list: keep all skills, then strongest terms, cap total
  const skills = keywords.filter((k) => k.isSkill)
  const rest = keywords.filter((k) => !k.isSkill)
  const picked = [...skills, ...rest].slice(0, limit)
  return picked.sort((x, y) => y.count - x.count)
}

function findMatches(resumeText, keywords) {
  const matched = []
  const missing = []
  for (const k of keywords) {
    let hit
    if (k.isSkill && SKILL_LOOKUP.has(normalize(k.term))) {
      hit = matchSkill(resumeText, k.term) // canonical skills: match via any alias
    } else {
      hit = termRegex(k.term).test(resumeText) || resumeText.includes(k.term)
    }
    if (hit) matched.push(k)
    else missing.push(k)
  }
  return { matched, missing }
}

function matchSkill(resumeText, canonical) {
  // canonical itself or any alias present in the resume counts as a match
  for (const [aliasNorm, can] of SKILL_LOOKUP) {
    if (can !== canonical) continue
    if (resumeText.includes(aliasNorm)) return true
  }
  return false
}

// ------------------------------------------------------------ quality scoring

const ACTION_VERBS = new Set(
  `led built created designed developed implemented improved increased reduced managed launched architected
  automated optimized streamlined delivered drove owned spearheaded established mentored trained analyzed researched
  scaled migrated integrated shipped negotiated coordinated executed achieved grew saved generated`
    .split(/\s+/)
)

function hasQuantified(text) {
  return /\d+\s*(%|percent|x|k\b|\+)|\$\s?\d|\b\d{2,}\b/i.test(text)
}

export function analyzeQuality(resume) {
  const categories = []
  const suggestions = []
  const stats = { words: 0 }

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
  const skillIssue = skills.length >= 5 ? [] : skills.length ? `List at least 5 skills — you have ${skills.length}` : 'Add a skills section with your top 5–10 skills'
  const skillIssuesArr = Array.isArray(skillIssue) ? skillIssue : [skillIssue]
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
  const extrasCount = extras.filter(Boolean).length
  const extrasScore = Math.min(extrasCount * 3 + (extrasCount >= 3 ? 1 : 0), 10)
  const extrasIssues = extrasCount >= 2 ? [] : ['Round out your resume with projects, certifications or languages']
  add('extras', 'Extras (projects, certifications…)', extrasScore, 10, extrasIssues)
  if (extrasCount < 2) suggestions.push(extrasIssues[0])

  const score = Math.max(0, Math.min(100, categories.reduce((sum, cat) => sum + cat.score, 0)))
  return { score, categories, suggestions, stats }
}

// quality analysis for plain text (uploaded PDF resumes)
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

// ------------------------------------------------------------------- report

export function bandFor(score) {
  if (score >= 80) return { label: 'Excellent', color: '#12B76A', tone: 'great' }
  if (score >= 60) return { label: 'Good', color: '#F59E0B', tone: 'ok' }
  if (score >= 40) return { label: 'Fair', color: '#FB7185', tone: 'meh' }
  return { label: 'Needs work', color: '#EF4444', tone: 'bad' }
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
      missingSkills: missing.filter((k) => k.isSkill).map((k) => k.term),
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
      missingSkills: missing.filter((k) => k.isSkill).map((k) => k.term),
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
