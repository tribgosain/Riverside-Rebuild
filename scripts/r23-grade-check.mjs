import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#manager-name', 'GradeCheck');
  await page.click('button:has-text("Continue as GradeCheck")');
  await page.waitForTimeout(150);
  await page.click('.mandate-grid .pick-card:first-child'); // Backed
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click('button:has-text("Take charge, GradeCheck")');
  await page.waitForTimeout(200);

  await page.click('.task-tile:has-text("Sell")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Done selling")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Auto-fill needs")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Done signing")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Auto-pick XI")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Close window & grade me")');
  await page.waitForSelector('.wrapped-card, h1:has-text("You made the playoffs")', { timeout: 8000 });
  if (await page.locator('h1:has-text("You made the playoffs")').count()) {
    await page.click('button:has-text("Auto-pick XI")');
    await page.waitForTimeout(150);
    await page.click('button:has-text("Confirm XI")');
    await page.waitForSelector('.wrapped-card', { timeout: 8000 });
  }
  await page.waitForTimeout(300);

  const grade = await page.locator('.wrapped-card__grade').textContent();
  const position = await page.locator('.wrapped-card__position').textContent();
  const note = await page.locator('.wrapped-card__grade-note').textContent();
  console.log('Grade:', grade.trim());
  console.log('Position:', position.trim());
  console.log('Note:', note.trim());

  await page.screenshot({ path: '/tmp/r23-grade-live.png', fullPage: true });

  // Also verify Web Share related UI renders sanely (buttons/hints present).
  const shareBtnText = await page.locator('.share-row__share-btn').textContent();
  const hints = await page.locator('.share-row__hint').allTextContents();
  console.log('Share button:', shareBtnText.trim());
  console.log('Hints:', hints);

  await browser.close();
}

run();

async function runWeak() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#manager-name', 'Weak');
  await page.click('button:has-text("Continue as Weak")');
  await page.waitForTimeout(150);
  await page.click('.mandate-grid .pick-card:first-child');
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click('button:has-text("Take charge, Weak")');
  await page.waitForTimeout(200);

  await page.click('.task-tile:has-text("Sell")');
  await page.waitForTimeout(150);
  for (const name of ['Morgan Whittaker', 'Tommy Conway', 'Aidan Morris', 'Sol Brynn', 'David Strelec', 'Adilson Malanda', 'Callum Brittain', 'Riley McGree', 'Alfie Jones']) {
    const card = page.locator('.player-card', { hasText: name });
    if (await card.count()) {
      await card.locator('.action-btn--sell').click();
      await page.waitForTimeout(40);
    }
  }
  await page.click('button:has-text("Done selling")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Done signing")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Auto-pick XI")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Close window & grade me")');
  await page.waitForSelector('.wrapped-card, h1:has-text("You made the playoffs")', { timeout: 8000 });
  await page.waitForTimeout(300);

  const grade = await page.locator('.wrapped-card__grade').textContent();
  const position = await page.locator('.wrapped-card__position').textContent();
  const note = await page.locator('.wrapped-card__grade-note').textContent();
  console.log('\n--- Weak squad result ---');
  console.log('Grade:', grade.trim());
  console.log('Position:', position.trim());
  console.log('Note:', note.trim());
  await page.screenshot({ path: '/tmp/r23-grade-weak.png', fullPage: true });
  await browser.close();
}

runWeak();
