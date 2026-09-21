// Debug why Template 02's PDF download fails
import { chromium } from 'playwright-core'
import path from 'path'

const BASE = 'http://localhost:5173'
const run = async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await (await browser.newContext({ viewport: { width: 1500, height: 950 } })).newPage()
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.type(), m.text().slice(0, 300)) })
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 500)))

  await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' })
  await page.evaluate(`(async () => {
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
    await new Promise((res, rej) => {
      const tx = db.transaction('resumes', 'readwrite')
      tx.objectStore('resumes').put(${JSON.stringify(testResume)})
      tx.oncomplete = res
      tx.onerror = () => rej(tx.error)
    })
    return 'ok'
  })`.replace('testResume', JSON.stringify(testResume)))

  await page.goto(BASE + '/resume/test-02', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('button:has-text("Preview")', { timeout: 20000 })
  await page.waitForTimeout(1200)
  await page.locator('button:has(span:text-is("Preview"))').first().click()
  await page.waitForTimeout(1000)
  const btn = page.locator('button:has-text("Download PDF")').last()
  console.log('clicking download...')
  await btn.click()
  const result = await Promise.race([
    page.waitForEvent('download', { timeout: 30000 }).then(() => 'download event fired'),
    new Promise((r) => setTimeout(() => r('TIMEOUT — no download event in 30s'), 30000)),
  ])
  console.log('RESULT:', result)
  await browser.close()
}

const testResume = {
  _id: 'test-02',
  title: 'Resume 02',
  thumbnailLink: '',
  template: { theme: '02', colorPalette: [] },
  profileInfo: { profilePreviewUrl: '', fullName: 'Ananya Sharma', designation: 'Frontend Developer', summary: 'Experienced frontend developer focused on React and TypeScript.' },
  contactInfo: { email: 'a@b.com', phone: '123', location: 'BLR', linkedin: '', github: '', website: '' },
  workExperience: [{ company: 'Finlytics', role: 'Senior Frontend Engineer', startDate: '2023-04', endDate: '', description: 'Owned the customer dashboard used by 12k daily users.' }],
  education: [{ degree: 'B.Tech', institution: 'VTU', startDate: '2016-08', endDate: '2020-06' }],
  skills: [{ name: 'React', progress: 90 }, { name: 'TypeScript', progress: 85 }],
  projects: [{ title: 'ChartWiz', description: 'Charting library.', github: '', liveDemo: '' }],
  certifications: [{ title: 'AWS CP', issuer: 'Amazon', year: '2022' }],
  languages: [{ name: 'English', progress: 90 }],
  interests: ['Chess'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

run().catch((e) => { console.error(e); process.exit(1) })
