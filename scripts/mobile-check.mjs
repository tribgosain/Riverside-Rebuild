import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } }); // iPhone SE

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('#manager-name', 'SE Test');
  await page.click('button:has-text("Continue as SE Test")');
  await page.click('button:has-text("Sensible")');
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click('button:has-text("Take charge, SE Test")');
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
  await page.screenshot({ path: '/tmp/mobile-375-hub.png' });
  await page.click('button:has-text("Close window & grade me")');
  await page.waitForTimeout(150);

  await page.waitForSelector('.wrapped-card, h1:has-text("You made the playoffs")', { timeout: 8000 });

  const playoffTitle = await page.locator('h1:has-text("You made the playoffs")').count();
  if (playoffTitle > 0) {
    await page.click('button:has-text("Auto-pick XI")');
    await page.waitForTimeout(150);
    await page.click('button:has-text("Confirm XI")');
    await page.waitForSelector('.wrapped-card', { timeout: 8000 });
  }

  await page.screenshot({ path: '/tmp/mobile-375-results.png' });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('[375px results] horizontal overflow?', overflow);

  const cardBox = await page.locator('.wrapped-card').boundingBox();
  console.log('[375px results] card box:', cardBox, 'viewport height 667');

  await browser.close();
}

run().catch((e) => {
  console.error('MOBILE CHECK FAILED:', e);
  process.exit(1);
});
