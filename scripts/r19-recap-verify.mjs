import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

async function playOnce(browser, name, sellFirst) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#manager-name', name);
  await page.click(`button:has-text("Continue as ${name}")`);
  await page.waitForTimeout(150);
  await page.click('.mandate-grid .pick-card:first-child');
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click(`button:has-text("Take charge, ${name}")`);
  await page.waitForTimeout(200);

  await page.click('.task-tile:has-text("Sell")');
  await page.waitForTimeout(150);
  if (sellFirst) {
    const btn = page.locator('.action-btn--sell:not([disabled])').first();
    if (await btn.count()) await btn.click();
  }
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

  let playoffHappened = false;
  if (await page.locator('h1:has-text("You made the playoffs")').count()) {
    playoffHappened = true;
    await page.click('button:has-text("Auto-pick XI")');
    await page.waitForTimeout(150);
    await page.click('button:has-text("Confirm XI")');
    await page.waitForSelector('.wrapped-card', { timeout: 8000 });
  }
  await page.waitForTimeout(300);

  const position = await page.locator('.wrapped-card__position').textContent();
  const recap = await page.locator('.wrapped-card__recap').textContent();
  const grade = await page.locator('.wrapped-card__grade').textContent();

  console.log(`\n[${name}] playoff? ${playoffHappened} | grade: ${grade.trim()} | position/outcome: ${position.trim()}`);
  console.log(`[${name}] recap: "${recap.trim()}"`);
  console.log(`[${name}] errors: ${JSON.stringify(errors)}`);

  await page.close();
  return recap.trim();
}

async function run() {
  const browser = await chromium.launch();
  const recaps = [];
  for (let i = 0; i < 5; i += 1) {
    const recap = await playOnce(browser, `Run${i}`, i % 2 === 0);
    recaps.push(recap);
  }
  await browser.close();

  const uniqueRecaps = new Set(recaps);
  console.log(`\n\n${uniqueRecaps.size}/${recaps.length} recaps are textually distinct from each other.`);
}

run();
