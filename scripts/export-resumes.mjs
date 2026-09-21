// Automated resume export harness.
// - Seeds realistic test resumes into the app's IndexedDB (all 4 templates)
// - Downloads the PDF of every template through the real UI flow
// - Saves PDFs into "output resume/" and preview screenshots into scripts/shots/
// - Also exports an oversized resume to verify the 1-page guarantee
import { chromium } from 'playwright-core'
import fs from 'fs'
import path from 'path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'output resume')
const SHOTS = path.join(import.meta.dirname, 'shots')
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(SHOTS, { recursive: true })

const SUMMARY =
  'Frontend developer with 5+ years of experience building accessible, high-performance web applications with React, TypeScript and modern tooling. Led the migration of a design system used by 40+ engineers, cut bundle size by 35% and improved Lighthouse performance from 62 to 94 across the flagship product.'

const job = (role, company, start, end, desc) => ({ company, role, startDate: start, endDate: end, description: desc })

const baseContent = {
  profileInfo: {
    profilePreviewUrl: '',
    fullName: 'Ananya Sharma',
    designation: 'Frontend Developer',
    summary: SUMMARY,
  },
  contactInfo: {
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'https://linkedin.com/in/ananyasharma',
    github: 'https://github.com/ananyasharma',
    website: 'https://ananya.dev',
  },
  workExperience: [
    job('Senior Frontend Engineer', 'Finlytics', '2023-04', '', 'Owned the customer dashboard used by 12k daily users. Introduced React Query and code-splitting, reducing time-to-interactive by 48%. Mentored 3 junior engineers and ran the weekly frontend guild.'),
    job('Frontend Engineer', 'ShopKart', '2021-01', '2023-03', 'Built the checkout flow in React + TypeScript, lifting conversion by 9%. Wrote over 200 Jest and Playwright tests and kept flake rate below 1%. Migrated the component library to Tailwind CSS.'),
    job('Web Developer Intern', 'PixelForge Studio', '2020-05', '2020-12', 'Shipped marketing sites for 6 clients using Next.js. Automated image pipelines, cutting page weight by 40%.'),
  ],
  education: [
    { degree: 'B.Tech, Computer Science', institution: 'VTU, Bengaluru', startDate: '2016-08', endDate: '2020-06' },
    { degree: 'Pre-University (PCMC)', institution: 'Kumarans PU College', startDate: '2014-06', endDate: '2016-04' },
  ],
  skills: [
    { name: 'React', progress: 95 }, { name: 'TypeScript', progress: 90 }, { name: 'JavaScript', progress: 92 },
    { name: 'Tailwind CSS', progress: 88 }, { name: 'Next.js', progress: 82 }, { name: 'Playwright', progress: 80 },
    { name: 'Redux', progress: 78 }, { name: 'Accessibility (WCAG)', progress: 75 }, { name: 'Webpack/Vite', progress: 76 }, { name: 'Node.js', progress: 70 },
  ],
  projects: [
    { title: 'ChartWiz', description: 'Open-source React charting library with 2.1k GitHub stars. Tree-shakable, 8kb gzipped.', github: 'https://github.com/ananyasharma/chartwiz', liveDemo: 'https://chartwiz.dev' },
    { title: 'Recall', description: 'Offline-first PWA flashcard app with spaced repetition. 4.8★ on Play Store.', github: 'https://github.com/ananyasharma/recall', liveDemo: '' },
  ],
  certifications: [
    { title: 'Meta Front-End Developer Professional Certificate', issuer: 'Coursera', year: '2023' },
    { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon', year: '2022' },
  ],
  languages: [{ name: 'English', progress: 95 }, { name: 'Hindi', progress: 90 }, { name: 'Kannada', progress: 85 }],
  interests: ['Long-distance running', 'UI side projects', 'Chess', 'Blogging'],
}

const oversizeContent = {
  ...baseContent,
  profileInfo: {
    ...baseContent.profileInfo,
    summary: SUMMARY + ' ' + SUMMARY + ' ' + 'I also write a widely-read newsletter on frontend architecture, and I have spoken at three conferences about rendering performance and design-system governance. '.repeat(3),
  },
  workExperience: [
    ...baseContent.workExperience,
    job('Freelance Web Developer', 'Self-employed', '2019-06', '2020-04', 'Delivered 11 freelance projects end to end, from discovery to deployment. Built a reusable starter kit that cut setup time from days to hours.'),
    job('Teaching Assistant', 'Coding Ninjas', '2019-01', '2019-05', 'Reviewed 500+ student submissions for the React course and ran weekly doubt-clearing sessions for batches of 60 students.'),
  ],
  projects: [
    ...baseContent.projects,
    { title: 'LintParty', description: 'Shared ESLint config presets downloaded 30k times/month. Maintains 14 plugins.', github: 'https://github.com/ananyasharma/lintparty', liveDemo: '' },
    { title: 'StateSmith', description: 'Visual state-machine editor that exports XState JSON. Used in 3 production apps.', github: 'https://github.com/ananyasharma/statesmith', liveDemo: 'https://statesmith.app' },
  ],
  certifications: [
    ...baseContent.certifications,
    { title: 'Google UX Design Certificate', issuer: 'Coursera', year: '2021' },
    { title: 'Scrum Master I (PSM I)', issuer: 'Scrum.org', year: '2020' },
  ],
}

const plan = [
  { theme: '01', file: 'Resume-Template-One.pdf', content: baseContent },
  { theme: '02', file: 'Resume-Template-Two.pdf', content: baseContent },
  { theme: '03', file: 'Resume-Template-Three.pdf', content: baseContent },
  { theme: '04', file: 'Resume-ATS-Template.pdf', content: baseContent },
  { theme: '01', file: 'Resume-Template-One-OVERSIZE.pdf', content: oversizeContent, oversize: true },
]

const seedScript = (resumes) => {
  return async () => {
    const data = JSON.parse(document.currentScript.dataset.json)
    const open = () => new Promise((res, rej) => {
      const r = indexedDB.open('resumexpert', 1)
      r.onupgradeneeded = () => {
        const db = r.result
        if (!db.objectStoreNames.contains('resumes')) {
          const s = db.createObjectStore('resumes', { keyPath: '_id' })
          s.createIndex('updatedAt', 'updatedAt')
        }
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
      }
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    const db = await open()
    await Promise.all(data.map((resume) => new Promise((res, rej) => {
      const tx = db.transaction('resumes', 'readwrite')
      tx.objectStore('resumes').put(resume)
      tx.oncomplete = res
      tx.onerror = () => rej(tx.error)
    })))
    return 'seeded'
  }
}

const run = async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  })
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 950 }, acceptDownloads: true })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 300)))
  page.on('console', (m) => { if (m.type() === 'error') console.log('  [console.error]', m.text().slice(0, 300)) })

  // ---- seed ----
  const now = Date.now()
  const resumes = plan.map((p, i) => ({
    _id: `test-${p.theme}-${i}`,
    title: p.oversize ? 'Oversize Resume' : `Resume ${p.theme}`,
    thumbnailLink: '',
    template: { theme: p.theme, colorPalette: [] },
    ...p.content,
    workExperience: p.content.workExperience.map((w) => ({ ...w })),
    createdAt: new Date(now - 10000).toISOString(),
    updatedAt: new Date(now - i * 1000).toISOString(),
  }))
  await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' })
  const json = JSON.stringify(resumes)
  await page.evaluate(`(async () => {
    const data = ${json};
    const open = () => new Promise((res, rej) => {
      const r = indexedDB.open('resumexpert', 1)
      r.onupgradeneeded = () => {
        const db = r.result
        if (!db.objectStoreNames.contains('resumes')) {
          const s = db.createObjectStore('resumes', { keyPath: '_id' })
          s.createIndex('updatedAt', 'updatedAt')
        }
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
      }
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    const db = await open()
    await Promise.all(data.map((resume) => new Promise((res, rej) => {
      const tx = db.transaction('resumes', 'readwrite')
      tx.objectStore('resumes').put(resume)
      tx.oncomplete = res
      tx.onerror = () => rej(tx.error)
    })))
    return 'seeded'
  })()`)

  // ---- export each template via the real UI flow ----
  const results = []
  for (let idx = 0; idx < plan.length; idx++) {
    const p = plan[idx]
    const id = `test-${p.theme}-${idx}`
    console.log(`\n=== theme ${p.theme} -> ${p.file}`)
    try {
      await page.goto(`${BASE}/resume/${id}`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('button:has-text("Preview")', { timeout: 20000 })
      await page.waitForTimeout(1500) // let capture section render + page-count measure

      if (p.oversize) {
        const badge = await page.locator('text=Exceeds 1 page').count()
        console.log(`  overflow warning badge visible: ${badge > 0}`)
      }

      // screenshot of the on-screen preview for design comparison
      const preview = page.locator('.preview-container > div').first()
      try {
        await preview.screenshot({ path: path.join(SHOTS, `preview-${p.theme}${p.oversize ? '-big' : ''}.png`) })
      } catch { /* preview may not exist */ }

      // open Preview modal and click Download PDF
      await page.locator('button:has(span:text-is("Preview"))').first().click()
      const dlBtn = page.locator('button:has-text("Download PDF")').last()
      await dlBtn.waitFor({ timeout: 10000 })
      await page.waitForTimeout(800)
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 45000 }),
        dlBtn.click().then(async () => {
          // the 1-page guard may open the oversize suggestion dialog —
          // proceed with "Download anyway (auto-fit 1 page)"
          await page.waitForTimeout(700)
          const over = page.locator('button:has-text("Download anyway")')
          if (await over.count()) {
            console.log('  oversize dialog shown -> clicking "Download anyway"')
            await over.click()
          }
        }),
      ])
      const dest = path.join(OUT_DIR, p.file)
      await download.saveAs(dest)
      console.log(`  downloaded -> ${dest}`)
      results.push({ theme: p.theme, file: p.file, ok: true })
    } catch (e) {
      console.log(`  FAILED: ${String(e).slice(0, 300)}`)
      await page.screenshot({ path: path.join(SHOTS, `fail-${p.theme}${p.oversize ? '-big' : ''}.png`) })
      console.log(`  url: ${page.url()}  screenshot: fail-${p.theme}${p.oversize ? '-big' : ''}.png`)
      results.push({ theme: p.theme, file: p.file, ok: false, error: String(e) })
    }
  }

  await browser.close()
  console.log('\nSUMMARY:', JSON.stringify(results, null, 2))
  console.log('DONE')
}

run().catch((e) => { console.error(e); process.exit(1) })
