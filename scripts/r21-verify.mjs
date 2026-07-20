import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

async function completeSetup(page, name) {
  await page.fill('#manager-name', name);
  await page.click(`button:has-text("Continue as ${name}")`);
  await page.waitForTimeout(150);
  await page.click('.mandate-grid .pick-card:first-child');
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click(`button:has-text("Take charge, ${name}")`);
}

async function run() {
  const browser = await chromium.launch();

  // --- Stars and Project tabs, with the new targets ---
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 1400 } });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await completeSetup(page, 'Scout');
    await page.waitForTimeout(200);
    await page.click('.task-tile:has-text("Sell")');
    await page.waitForTimeout(150);
    await page.click('button:has-text("Done selling")');
    await page.waitForTimeout(200);
    const scoutBtn = page.locator('button:has-text("Ask the scout for more")');
    if (await scoutBtn.count()) await scoutBtn.click();
    await page.waitForTimeout(200);

    const starNames = await page.locator('.player-card__name').allTextContents();
    console.log('STARS tab:', starNames);
    await page.screenshot({ path: '/tmp/r21-tab-stars.png', fullPage: true });

    await page.click('.scout-tabs__tab:has-text("Project")');
    await page.waitForTimeout(150);
    const projectNames = await page.locator('.player-card__name').allTextContents();
    console.log('PROJECT tab:', projectNames);
    await page.screenshot({ path: '/tmp/r21-tab-project.png', fullPage: true });
    await page.close();
  }

  // --- Item 3: verify NO quote on a live result ---
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await completeSetup(page, 'QuoteCheck');
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

    const recapEl = await page.locator('.wrapped-card__recap').count();
    const recapAnyText = await page.locator('.wrapped-card').innerText();
    console.log('\n.wrapped-card__recap element count (should be 0):', recapEl);
    console.log('Full wrapped-card text content (manual scan for any leftover quote):\n---\n' + recapAnyText + '\n---');
    console.log('Page errors:', JSON.stringify(errors));
    await page.screenshot({ path: '/tmp/r21-results-noquote.png' });

    // --- Item 4: real Share button test with actual clipboard readback ---
    const context = page.context();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const shareBtn = page.locator('.share-row button');
    console.log('\nShare row button count (should be exactly 1):', await shareBtn.count());
    console.log('Share button text:', await shareBtn.first().textContent());

    const popupPromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
    await shareBtn.first().click();
    await page.waitForTimeout(1200);

    // Real clipboard readback — not just "did it throw."
    const clipboardCheck = await page.evaluate(async () => {
      try {
        const items = await navigator.clipboard.read();
        if (!items.length) return { ok: false, reason: 'clipboard empty' };
        const types = items[0].types;
        if (!types.includes('image/png')) return { ok: false, reason: `no image/png, got: ${types.join(',')}` };
        const blob = await items[0].getType('image/png');
        return { ok: true, size: blob.size, type: blob.type };
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    });
    console.log('\nClipboard readback after clicking Share:', JSON.stringify(clipboardCheck));

    const popup = await popupPromise;
    console.log('X compose tab opened?', !!popup);
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => {});
      console.log('X popup URL:', popup.url());
    }

    await page.waitForTimeout(500);
    const finalLabel = await shareBtn.first().textContent();
    console.log('Share button label after click:', finalLabel);

    await page.close();
  }

  await browser.close();
}

run();
