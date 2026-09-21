import { chromium } from 'playwright-core';
import path from 'path';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });

  // Get or create a resume with a custom title
  const resumeId = await page.evaluate(async () => {
    const { createResume, listResumes } = await import('/src/lib/resumeStore.js');
    let list = await listResumes();
    if (!list || list.length === 0) {
      const created = await createResume({ title: 'My Custom Dream Resume' });
      return created._id;
    }
    return list[0]._id;
  });

  console.log('Using resumeId:', resumeId);
  await page.goto(`http://localhost:5173/resume/${resumeId}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Set title
  await page.evaluate(() => {
    const titleInput = document.querySelector('input[placeholder="Resume title"]');
    if (titleInput) {
      titleInput.value = 'Abhishek Fullstack Developer Resume';
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // Setup download listener
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 });

  // Click Download PDF button
  console.log('Clicking Download PDF button...');
  const downloadBtn = page.locator('button:has-text("Download PDF")').first();
  await downloadBtn.click();

  const download = await downloadPromise;
  const suggestedFilename = download.suggestedFilename();
  console.log('Downloaded file name:', suggestedFilename);

  if (suggestedFilename.includes('.pdf')) {
    console.log('SUCCESS: Direct PDF download triggered with suggested filename:', suggestedFilename);
  } else {
    throw new Error('Unexpected filename: ' + suggestedFilename);
  }
} catch (err) {
  console.error('Error during download verification:', err);
} finally {
  await browser.close();
}
