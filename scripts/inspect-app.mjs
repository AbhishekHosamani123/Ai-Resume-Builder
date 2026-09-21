import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
})

const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
const page = await context.newPage()

// Listen to console
page.on('console', msg => console.log('PAGE LOG:', msg.text()))
page.on('pageerror', err => console.log('PAGE ERROR:', err.message))

await page.goto('http://localhost:5173/dashboard')
await page.waitForTimeout(1500)

// Check what is on the dashboard
const cards = await page.$$eval('[data-resume-id], .card, div', els => els.map(e => e.className + ' | ' + e.innerText).filter(t => t.includes('Resume') || t.includes('Abhishek') || t.includes('Sharma')).slice(0, 10))
console.log('Dashboard text snippets:', cards)

// List resumes from IndexedDB
const resumesInDb = await page.evaluate(async () => {
  const open = () => new Promise((res, rej) => {
    const r = indexedDB.open('resumexpert', 1)
    r.onsuccess = () => res(r.result)
    r.onerror = rej
  })
  const db = await open()
  return new Promise((res, rej) => {
    const tx = db.transaction('resumes', 'readonly')
    const req = tx.objectStore('resumes').getAll()
    req.onsuccess = () => res(req.result)
    req.onerror = rej
  })
})

console.log('Resumes in IndexedDB:', resumesInDb.map(r => ({ id: r._id, title: r.title, theme: r.template?.theme, name: r.profileInfo?.fullName })))

await browser.close()
