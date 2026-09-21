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

page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()))
page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack))

await page.goto('http://localhost:5173/')
await page.waitForTimeout(1000)

// Set theme 03 in DB
await page.evaluate(async () => {
  const userResume = {
    _id: 'test-resume-all',
    title: 'Test Resume',
    template: { theme: '03', colorPalette: [] },
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
      { company: 'Inera', role: 'Intern', startDate: '2026-02', endDate: '2026-09', description: '• AI workflows.' },
    ],
    education: [{ degree: 'BCA', institution: 'Gogte College', startDate: '2026-01', endDate: '2026-01' }],
    skills: [{ name: 'Python', progress: 90 }],
    projects: [{ title: 'Shopi', description: '• E-Commerce.', github: 'https://github.com/shopi', liveDemo: '' }],
    certifications: [{ title: 'Data Science', issuer: 'Google', year: '2026' }],
    languages: [{ name: 'English', progress: 100 }],
    interests: ['Coding'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

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
    tx.objectStore('resumes').put(userResume)
    tx.oncomplete = () => res(true)
    tx.onerror = rej
  })
})

await page.goto('http://localhost:5173/resume/test-resume-all')
await page.waitForTimeout(2000)

// Diagnose state and click download
const diag = await page.evaluate(async () => {
  const hiddenTarget = document.querySelector('.print-resume-target')
  const targetH = hiddenTarget ? hiddenTarget.scrollHeight : -1
  const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim())
  
  // Try to find download button
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PDF'))
  if (!btn) return { status: 'no button', buttons, targetH }

  btn.click()

  // Wait a bit
  await new Promise(r => setTimeout(r, 500))

  // Check if oversize dialog appeared
  const oversizeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download anyway'))
  if (oversizeBtn) {
    oversizeBtn.click()
  }

  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 200))
    if (window.__lastResumePdf) {
      const reader = new FileReader()
      const b64 = await new Promise(res => {
        reader.onloadend = () => res(reader.result)
        reader.readAsDataURL(window.__lastResumePdf)
      })
      return { status: 'success', hadOversize: !!oversizeBtn, targetH, b64 }
    }
  }
  return { status: 'timed out', hadOversize: !!oversizeBtn, targetH }
})

console.log('Diag result:', diag.status, 'hadOversize:', diag.hadOversize, 'targetH:', diag.targetH)

if (diag.b64) {
  const buf = Buffer.from(diag.b64.split(',')[1], 'base64')
  fs.writeFileSync(path.join(OUT, 'pdf-03.pdf'), buf)
  console.log('Saved pdf-03.pdf! Size:', buf.length)
}

await browser.close()
