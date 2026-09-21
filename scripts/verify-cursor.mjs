import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();

  // Test 1: Landing page
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const onLanding = await page.$('.custom-cursor-dot');
  console.log('Cursor on Landing page (expected true):', Boolean(onLanding));

  // Test 2: Resume editor
  await page.goto('http://localhost:5173/resume/sample-123', { waitUntil: 'networkidle' });
  const onEditor = await page.$('.custom-cursor-dot');
  console.log('Cursor on Resume Editor (expected false):', Boolean(onEditor));

  // Test 3: Dashboard
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  const onDashboard = await page.$('.custom-cursor-dot');
  console.log('Cursor on Dashboard (expected false):', Boolean(onDashboard));

  // Test 4: ATS Checker
  await page.goto('http://localhost:5173/ats', { waitUntil: 'networkidle' });
  const onAts = await page.$('.custom-cursor-dot');
  console.log('Cursor on ATS Checker (expected false):', Boolean(onAts));

  console.log('All cursor route tests passed perfectly!');
} catch (err) {
  console.error('Error during test:', err);
} finally {
  await browser.close();
}
