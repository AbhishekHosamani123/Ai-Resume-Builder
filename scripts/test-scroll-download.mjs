import { chromium } from 'playwright-core'
import fs from 'fs'
import path from 'path'

const OUT = path.resolve(import.meta.dirname, 'diag_out')
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
})

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

page.on('console', msg => console.log('PAGE:', msg.text()))
page.on('pageerror', err => console.log('PAGE ERROR:', err.message))

const userResume = {
  _id: 'test-resume-scroll',
  title: 'Scroll Test Resume',
  template: { theme: '04', colorPalette: [] },
  profileInfo: {
    fullName: 'ABHISHEK HOSAMANI',
    designation: 'Software Engineer',
    summary: 'Experienced Software Engineer building cloud services.',
  },
  contactInfo: {
    email: 'abhishekhosamani522@gmail.com',
    phone: '8431406956',
    location: 'Bengaluru, India',
    linkedin: 'https://linkedin.com/in/abhishekhosamani',
    github: 'https://github.com/abhishekhosamani',
    website: 'https://abhishek.dev',
  },
  workExperience: [
    {
      company: 'Inera Software',
      role: 'Ai Engineer Intern',
      startDate: '2026-02',
      endDate: '2026-09',
      description: '• Developed scalable, secure cloud-based backend services using ASP.NET Core.\n• Implemented automated CI/CD pipelines.',
    },
  ],
  education: [
    { degree: 'BCA', institution: 'Gogte College', startDate: '2023-06', endDate: '2026-05' },
  ],
  skills: [
    { name: 'Python', progress: 90 },
    { name: 'React', progress: 85 },
  ],
  projects: [
    {
      title: 'Shopi Platform',
      description: '• Full-stack e-commerce.\n• AI recommendation system.',
      github: 'https://github.com/abhishekhosamani/shopi',
      liveDemo: 'https://shopi.vercel.app',
    },
  ],
  certifications: [{ title: 'Data Science', issuer: 'Google', year: '2026' }],
  languages: [{ name: 'English', progress: 100 }],
  interests: ['Coding'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

await page.goto('http://localhost:5173/')
await page.waitForTimeout(1000)

// Seed into IndexedDB
await page.evaluate(async (r) => {
  const open = () => new Promise((res, rej) => {
    const req = indexedDB.open('resumexpert', 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('resumes')) {
        const s = db.createObjectStore('resumes', { keyPath: '_id' })
        s.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
    }
    req.onsuccess = () => res(req.result)
    req.onerror = rej
  })
  const db = await open()
  return new Promise((res, rej) => {
    const tx = db.transaction('resumes', 'readwrite')
    tx.objectStore('resumes').put(r)
    tx.oncomplete = () => res(true)
    tx.onerror = rej
  })
}, userResume)

await page.goto('http://localhost:5173/resume/test-resume-scroll')
await page.waitForTimeout(2000)

// Scroll down the page significantly
await page.evaluate(() => {
  window.scrollTo(0, 500)
  const main = document.querySelector('main')
  if (main) main.scrollTop = 500
})
await page.waitForTimeout(500)

const scrollState = await page.evaluate(() => ({
  windowY: window.scrollY,
  docScroll: document.documentElement.scrollTop,
}))
console.log('Scroll state before download:', scrollState)

// Trigger download PDF
const result = await page.evaluate(async () => {
  window.__lastResumePdf = null
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PDF'))
  if (!btn) return { status: 'no_button' }

  btn.click()

  // Wait a brief moment to see if oversize dialog appears
  await new Promise(r => setTimeout(r, 400))
  const oversizeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download anyway'))
  if (oversizeBtn) oversizeBtn.click()

  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 200))
    if (window.__lastResumePdf) break
  }

  if (!window.__lastResumePdf) return { status: 'timeout' }

  const reader = new FileReader()
  const b64 = await new Promise(res => {
    reader.onloadend = () => res(reader.result)
    reader.readAsDataURL(window.__lastResumePdf)
  })
  return { status: 'success', b64 }
})

if (result.status === 'success' && result.b64) {
  const buf = Buffer.from(result.b64.split(',')[1], 'base64')
  fs.writeFileSync(path.join(OUT, 'scrolled_download.pdf'), buf)
  console.log(`SUCCESS! Generated scrolled_download.pdf with size: ${buf.length} bytes while window was scrolled!`)
} else {
  console.log('FAILED:', result.status)
}

await browser.close()
