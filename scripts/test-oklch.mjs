import { chromium } from 'playwright-core';

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/resume/test-04-3');
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    const resumeEl = document.querySelector('.preview-container .a4-wrapper');
    if (!resumeEl) return { found: false, url: window.location.href };

    const elements = [resumeEl, ...resumeEl.querySelectorAll('*')];
    const styles = [];

    for (const el of elements) {
      const cs = window.getComputedStyle(el);
      const text = (el.textContent || '').trim().slice(0, 30);
      if (['H1', 'H2', 'H3', 'DIV', 'P', 'SPAN'].includes(el.tagName)) {
        styles.push({
          tag: el.tagName,
          text,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          color: cs.color,
          bg: cs.backgroundColor,
        });
      }
    }

    return {
      found: true,
      count: elements.length,
      sampleStyles: styles.slice(0, 15),
    };
  });

  console.log('Result:', JSON.stringify(result, null, 2));
  await browser.close();
}

test().catch(console.error);
