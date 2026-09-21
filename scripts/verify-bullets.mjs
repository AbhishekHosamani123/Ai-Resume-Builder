import { chromium } from 'playwright-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/GEETA HOSMANI/.gemini/antigravity-ide/brain/de48bec8-fe62-4b1a-a4c2-1086289d2679/.tempmediaStorage';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:5173/dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Get or create resume
  const resumeId = await page.evaluate(async () => {
    const { createResume, listResumes } = await import('/src/lib/resumeStore.js');
    let list = await listResumes();
    if (!list || list.length === 0) {
      const created = await createResume({ title: 'Senior Software Engineer Resume' });
      return created._id;
    }
    return list[0]._id;
  });

  console.log('Using resumeId:', resumeId);
  await page.goto(`http://localhost:5173/resume/${resumeId}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Jump to Work Experience
  console.log('Clicking Work Experience in Quick Section Jump...');
  const expBtn = page.locator('button:has-text("Experience")').first();
  await expBtn.click();
  await page.waitForTimeout(800);

  // Fill company and role
  const companyInput = page.locator('input[placeholder="ABC Corp"]').first();
  await companyInput.fill('Google Inc.');
  const roleInput = page.locator('input[placeholder="Frontend Developer"]').first();
  await roleInput.fill('Senior Frontend Engineer');

  // Click AI Enhance on Work Experience
  const enhanceBtn = page.locator('button:has-text("AI Enhance")').first();
  if (await enhanceBtn.isVisible()) {
    await enhanceBtn.click();
    await page.waitForTimeout(1000);
  }

  // Screenshot 1: Work Experience with polished header and live preview
  const shot1 = path.join(ARTIFACTS_DIR, 'bullet_points_work_with_preview.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved screenshot 1:', shot1);

  // Jump to Projects
  console.log('Clicking Projects in Quick Section Jump...');
  const projBtn = page.locator('button:has-text("Projects")').first();
  await projBtn.click();
  await page.waitForTimeout(800);

  // Fill Project Title
  const projTitleInput = page.locator('input[placeholder="Portfolio Website"]').first();
  await projTitleInput.fill('Cloud AI Resume Builder');

  // Click AI Enhance on Projects
  const enhanceProjBtn = page.locator('button:has-text("AI Enhance")').first();
  if (await enhanceProjBtn.isVisible()) {
    await enhanceProjBtn.click();
    await page.waitForTimeout(1000);
  }

  // Screenshot 2: Projects with polished header and live preview
  const shot2 = path.join(ARTIFACTS_DIR, 'bullet_points_projects_with_preview.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved screenshot 2:', shot2);

  console.log('Verification completed successfully!');
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  await browser.close();
}
