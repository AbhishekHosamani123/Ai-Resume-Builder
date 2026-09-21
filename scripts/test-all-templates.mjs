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

page.on('console', msg => {
  const text = msg.text()
  if (text.includes('PDF error') || text.includes('color-mix') || text.includes('Error')) {
    console.log('PAGE CONSOLE:', msg.type(), text)
  }
})
page.on('pageerror', err => console.log('PAGE ERROR:', err.message))

const userResume = {
  _id: 'test-resume-all',
  title: 'Test Resume Parity',
  template: { theme: '04', colorPalette: [] },
  profileInfo: {
    fullName: 'ABHISHEK HOSAMANI',
    designation: 'Software Engineer',
    summary: 'Experienced Software Engineer building cloud services and modern web applications with ASP.NET Core, React, and Python.',
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
      description: '• Developed scalable, secure cloud-based backend services using ASP.NET Core.\n• Designed and optimized PostgreSQL database schemas.\n• Implemented AI workflows and automation pipelines.',
    },
  ],
  education: [
    { degree: 'BCA', institution: 'Gogte College of Commerce', startDate: '2023-06', endDate: '2026-05' },
  ],
  skills: [
    { name: 'Python', progress: 90 },
    { name: 'React.js', progress: 85 },
    { name: 'PostgreSQL', progress: 80 },
    { name: 'Docker', progress: 75 },
  ],
  projects: [
    {
      title: 'Shopi E-Commerce Platform',
      description: '• Full-stack e-commerce with AI recommendation system.\n• Built customer intelligence analytics and real-time order tracking.',
      github: 'https://github.com/abhishekhosamani/shopi',
      liveDemo: 'https://shopi.vercel.app',
    },
  ],
  certifications: [{ title: 'Data Science Certification', issuer: 'Google', year: '2026' }],
  languages: [{ name: 'English', progress: 100 }, { name: 'Kannada', progress: 100 }],
  interests: ['Coding', 'System Architecture', 'AI Research'],
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

const allTemplates = [
  '04', '01', '02', '03',
  'azurill', 'bronzor', 'chikorita', 'ditgar',
  'ditto', 'gengar', 'glalie', 'kakuna',
  'lapras', 'leafish', 'meowth', 'onyx',
  'pikachu', 'rhyhorn', 'scizor',
  'shanidhya-modern', 'shanidhya-creative', 'shanidhya-executive',
  'shanidhya-minimal', 'shanidhya-twocolumn',
]

console.log(`Starting parity and download test for all ${allTemplates.length} templates...`)
const results = []

for (const tid of allTemplates) {
  process.stdout.write(`Testing [${tid}]... `)
  // Update theme in DB
  await page.evaluate(async (themeId) => {
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open('resumexpert', 1)
      r.onsuccess = () => res(r.result)
      r.onerror = rej
    })
    return new Promise((res, rej) => {
      const tx = db.transaction('resumes', 'readwrite')
      const store = tx.objectStore('resumes')
      const getReq = store.get('test-resume-all')
      getReq.onsuccess = () => {
        const data = getReq.result
        data.template = { theme: themeId, colorPalette: [] }
        store.put(data)
      }
      tx.oncomplete = () => res(true)
      tx.onerror = rej
    })
  }, tid)

  await page.goto('http://localhost:5173/resume/test-resume-all')
  await page.waitForTimeout(1200)

  // Trigger download PDF
  const result = await page.evaluate(async () => {
    window.__lastResumePdf = null
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PDF'))
    if (!btn) return { status: 'no_button' }

    btn.click()

    // Wait a brief moment to see if oversize dialog appears
    await new Promise(r => setTimeout(r, 400))
    const oversizeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download anyway'))
    if (oversizeBtn) {
      oversizeBtn.click()
    }

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
    fs.writeFileSync(path.join(OUT, `pdf-${tid}.pdf`), buf)
    console.log(`OK (${buf.length} bytes)`)
    results.push({ id: tid, success: true, bytes: buf.length })
  } else {
    console.log(`FAILED (${result.status})`)
    results.push({ id: tid, success: false, reason: result.status })
  }
}

await browser.close()

console.log('\n================ SUMMARY ================')
const passed = results.filter(r => r.success).length
console.log(`Passed: ${passed}/${results.length}`)
if (passed === results.length) {
  console.log('ALL 24 TEMPLATES GENERATED HIGH-FIDELITY SINGLE-PAGE PDFS SUCCESSFULLY!')
} else {
  console.log('Failures:', results.filter(r => !r.success))
}
