import { chromium } from 'playwright-core';

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForTimeout(500);

  // Seed sample resume in IndexedDB
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('resumexpert', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('resumes')) {
          db.createObjectStore('resumes', { keyPath: '_id' });
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('resumes', 'readwrite');
        tx.objectStore('resumes').put({
          _id: 'test-resume-1',
          title: 'My ATS Resume',
          template: { theme: '04', colorPalette: [] },
          profileInfo: {
            fullName: 'Abhishek Hosamani',
            designation: 'Software Engineer',
            summary: 'Experienced developer building scalable cloud services.',
          },
          contactInfo: {
            email: 'abhishek@example.com',
            phone: '+91 98765 43210',
            location: 'Bengaluru, India',
            linkedin: 'https://linkedin.com/in/abhishekhosamani',
            github: 'https://github.com/abhishekhosamani',
          },
          workExperience: [
            {
              role: 'AI Engineer Intern',
              company: 'Inera Software',
              startDate: '2026-02',
              endDate: '2026-09',
              description: '• Developed scalable backend services.\n• Designed and optimized schemas.\n• Implemented AI-powered workflows.',
            },
          ],
          education: [{ degree: 'BCA', institution: 'Gogte College', startDate: '2023', endDate: '2026' }],
          skills: [{ name: 'Python' }, { name: 'ASP.NET Core' }, { name: 'PostgreSQL' }],
          projects: [{ title: 'Shopi', description: '• Built full stack e-commerce app.' }],
          certifications: [{ title: 'Data Science', issuer: 'Google', year: '2026' }],
          languages: [{ name: 'English' }],
          interests: ['AI', 'Open Source'],
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      };
    });
  });

  await page.goto('http://localhost:5173/resume/test-resume-1');
  await page.waitForTimeout(2000);

  // Now inspect live preview vs download ref
  const comparison = await page.evaluate(() => {
    const previewEl = document.querySelector('.preview-container .a4-wrapper');
    const downloadEl = document.querySelector('.print-resume-target');

    const getProps = (el) => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const titleEl = el.querySelector('[data-section="profile-info"] div');
      const titleCs = titleEl ? window.getComputedStyle(titleEl) : null;
      const secTitleEl = el.querySelector('[data-section="work-experience"] [style*="uppercase"]');
      const secTitleCs = secTitleEl ? window.getComputedStyle(secTitleEl) : null;

      return {
        width: el.offsetWidth,
        height: el.offsetHeight,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        color: cs.color,
        titleFont: titleCs?.fontFamily,
        titleSize: titleCs?.fontSize,
        titleColor: titleCs?.color,
        secTitleFont: secTitleCs?.fontFamily,
        secTitleColor: secTitleCs?.color,
      };
    };

    return {
      preview: getProps(previewEl),
      download: getProps(downloadEl),
    };
  });

  console.log('Comparison:', JSON.stringify(comparison, null, 2));
  await browser.close();
}

test().catch(console.error);
