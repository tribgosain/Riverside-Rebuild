import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#manager-name', 'FullRun');
  await page.click('button:has-text("Continue as FullRun")');
  await page.click('.mandate-grid .pick-card:first-child');
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click('button:has-text("Take charge, FullRun")');
  await page.waitForTimeout(200);

  // New linear flow: Sell -> Sign -> XI, each "Done ___" auto-advances.
  await page.click('.task-tile:has-text("Sell")');
  await page.waitForTimeout(150);
  const sellBtn = page.locator('.action-btn--sell:not([disabled])').first();
  if (await sellBtn.count()) await sellBtn.click();
  await page.click('button:has-text("Done selling")');
  await page.waitForTimeout(150);

  await page.click('button:has-text("Auto-fill needs")');
  await page.waitForTimeout(150);
  await page.click('button:has-text("Done signing")');
  await page.waitForTimeout(150);

  await page.click('button:has-text("Auto-pick XI")');
  await page.waitForTimeout(150);
  const confirmBtn = page.locator('button:has-text("Close window & grade me")');
  console.log('XI confirm blocked?', (await confirmBtn.getAttribute('class')).includes('blocked'));
  await confirmBtn.click();
  await page.waitForTimeout(150);

  // No click needed — auto-advances once the counter finishes.
  await page.waitForSelector('.wrapped-card, h1:has-text("You made the playoffs")', { timeout: 8000 });

  const playoffTitle = await page.locator('h1:has-text("You made the playoffs")').count();
  if (playoffTitle > 0) {
    console.log('Playoff triggered');
    await page.click('button:has-text("Auto-pick XI")');
    await page.waitForTimeout(150);
    await page.click('button:has-text("Confirm XI")');
    await page.waitForTimeout(300);
    await page.waitForSelector('.wrapped-card', { timeout: 8000 });
  }

  await page.screenshot({ path: '/tmp/final-results.png' });
  console.log('JS ERRORS:', JSON.stringify(errors, null, 2));
  await browser.close();
}

run().catch((e) => {
  console.error('FULL E2E FAILED:', e);
  process.exit(1);
});
