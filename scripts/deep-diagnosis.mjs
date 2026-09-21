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

await page.goto('http://localhost:5173/')
await page.waitForTimeout(1000)

// Seed the user's exact resume from the uploaded PDF
const userResume = {
  _id: 'abhishek-resume',
  title: 'Abhishek Hosamani Resume',
  template: { theme: '04', colorPalette: [] },
  profileInfo: {
    fullName: 'ABHISHEK HOSAMANI',
    designation: 'Software engineer',
    summary: 'Software Engineer with 9 months of hands-on experience building scalable cloud-based backend services, RESTful APIs, and database-driven applications using ASP.NET Core, C#, Python, FastAPI, SQL Server, and PostgreSQL. Strong foundation in object-oriented programming (OOP), client-server architecture, software development lifecycle (SDLC), Agile methodologies, authentication, authorization, and database design. Experienced in developing secure, reliable, maintainable, and high-performance applications while following modern software engineering best practices.',
  },
  contactInfo: {
    email: 'abhishekhosamani522@gmail.com',
    phone: '8431406956',
    location: 'Bengaluru, Karnataka, India',
    linkedin: 'https://linkedin.com/in/abhishekhosamani',
    github: 'https://github.com/abhishekhosamani',
    website: '',
  },
  workExperience: [
    {
      company: 'Inera Software',
      role: 'Ai Engineer Intern',
      startDate: '2026-02',
      endDate: '2026-09',
      description: '• Developed scalable, secure cloud-based backend services and RESTful APIs using ASP.NET Core, following client-server architecture, OOP, and Agile software development practices.\n• Designed and optimized PostgreSQL and Supabase database schemas supporting secure CRUD operations, efficient data retrieval, and scalable backend applications.\n• Implemented AI-powered backend workflows and automation solutions to streamline business processes and improve operational efficiency',
    },
  ],
  education: [
    {
      institution: 'Gogte College of commerce',
      degree: 'BCA',
      startDate: '2026-01',
      endDate: '2026-01',
    },
  ],
  skills: [
    { name: 'Python', progress: 90 },
  ],
  projects: [
    {
      title: 'Shopi – AI-Powered E-Commerce & Merchant Intelligence Platform',
      description: '• Developed a full-stack AI-powered e-commerce platform enabling customers to discover products, search and compare offerings, receive personalized recommendations, manage carts, complete checkout, and track orders.\n• Built merchant intelligence capabilities analyzing customer behavior, conversion, CLV, retention, product performance, and cart abandonment to support data-driven business decisions',
      github: '',
      liveDemo: 'http://portfolio-website-nu-five-23.vercel.app/',
    },
  ],
  certifications: [
    {
      title: 'Data Science',
      issuer: 'Google',
      year: '2026-02',
    },
  ],
  languages: [
    { name: 'English', progress: 100 },
  ],
  interests: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

await page.evaluate(async (r) => {
  const open = () => new Promise((res, rej) => {
    const req = indexedDB.open('resumexpert', 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('resumes')) {
        const store = db.createObjectStore('resumes', { keyPath: '_id' })
        store.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('kv')) {
        db.createObjectStore('kv')
      }
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

console.log('Seeded Abhishek Hosamani resume into IndexedDB.')

// Navigate to the edit page for this resume
await page.goto('http://localhost:5173/resume/abhishek-resume')
await page.waitForTimeout(2000)

// 1. Take a screenshot of the live preview container
const previewEl = await page.$('.preview-container')
if (previewEl) {
  await previewEl.screenshot({ path: path.join(OUT, 'live_preview.png') })
  console.log('Captured live_preview.png')
}

// 2. Click "Preview" modal button to see modal preview
const previewBtn = await page.$('button:has-text("Preview")')
if (previewBtn) {
  await previewBtn.click()
  await page.waitForTimeout(1000)
  const modalEl = await page.$('.a4-wrapper')
  if (modalEl) {
    await modalEl.screenshot({ path: path.join(OUT, 'modal_preview.png') })
    console.log('Captured modal_preview.png')
  }
}

// 3. Trigger Download PDF
const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
  page.evaluate(async () => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PDF'))
    if (btn) btn.click()
  }),
])

if (download) {
  const downloadPath = path.join(OUT, 'downloaded.pdf')
  await download.saveAs(downloadPath)
  console.log('Saved downloaded.pdf to:', downloadPath)
} else {
  console.log('Checking window.__lastResumePdf...')
  const pdfBase64 = await page.evaluate(async () => {
    if (window.__lastResumePdf) {
      const blob = window.__lastResumePdf
      const reader = new FileReader()
      return new Promise((res) => {
        reader.onloadend = () => res(reader.result)
        reader.readAsDataURL(blob)
      })
    }
    return null
  })
  if (pdfBase64) {
    const buf = Buffer.from(pdfBase64.split(',')[1], 'base64')
    fs.writeFileSync(path.join(OUT, 'downloaded.pdf'), buf)
    console.log('Saved downloaded.pdf from window.__lastResumePdf, size:', buf.length)
  } else {
    console.log('Could not get downloaded PDF.')
  }
}

// 4. Capture computed styles of the resume in both preview and download containers
const styleComparison = await page.evaluate(() => {
  const preview = document.querySelector('.preview-container [data-section="profile-info"]')
  const hidden = document.querySelector('.print-resume-target [data-section="profile-info"]')
  const getStyles = (el) => {
    if (!el) return null
    const cs = window.getComputedStyle(el)
    const h1 = el.querySelector('h1, div')
    const h1Cs = h1 ? window.getComputedStyle(h1) : null
    return {
      width: el.offsetWidth,
      height: el.offsetHeight,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      color: cs.color,
      h1FontFamily: h1Cs?.fontFamily,
      h1FontSize: h1Cs?.fontSize,
      h1Color: h1Cs?.color,
      h1LetterSpacing: h1Cs?.letterSpacing,
    }
  }
  return {
    preview: getStyles(preview),
    hidden: getStyles(hidden),
  }
})

console.log('Style comparison:', JSON.stringify(styleComparison, null, 2))

await browser.close()
