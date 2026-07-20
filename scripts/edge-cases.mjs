import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';

async function completeSetup(page, name) {
  await page.fill('#manager-name', name);
  await page.click(`button:has-text("Continue as ${name}")`);
  await page.click('.mandate-grid .pick-card:first-child');
  await page.click('.sponsor-card:not(.sponsor-card--disabled)');
  await page.locator('.setup-section', { hasText: 'Home kit' }).locator('.kit-grid .pick-card').first().click();
  await page.locator('.setup-section', { hasText: 'Away kit' }).locator('.kit-grid .pick-card').first().click();
  await page.click('.philosophy-grid .philosophy-card:first-child');
  await page.click(`button:has-text("Take charge, ${name}")`);
}

async function run() {
  const browser = await chromium.launch();

  // 1. Corrupted localStorage save -> falls back to fresh Setup, no white screen.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('boro-window-save-v1', '{not valid json'));
    await page.reload({ waitUntil: 'networkidle' });
    const hasSetup = await page.locator('.pull-quote__text').count();
    console.log('[corrupted save] setup screen shown?', hasSetup > 0, 'errors:', errors);
    await page.screenshot({ path: '/tmp/edge-01-corrupted-save.png' });
    await page.close();
  }

  // 2. localStorage unavailable (throws on access) -> app still runs, in-memory fallback.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('SecurityError: localStorage disabled');
        },
      });
    });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const hasSetup = await page.locator('.pull-quote__text').count();
    await completeSetup(page, 'NoStorage');
    await page.waitForTimeout(300);
    const hasHub = await page.locator('.scorecard').count();
    console.log('[localStorage disabled] setup rendered?', hasSetup > 0, 'reached hub?', hasHub > 0, 'errors:', errors);
    await page.screenshot({ path: '/tmp/edge-02-no-localstorage.png' });
    await page.close();
  }

  // 3. Invalid share link -> falls through to fresh Setup, no crash.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`${BASE}/?w=not-valid-base64!!!`, { waitUntil: 'networkidle' });
    const hasSetup = await page.locator('.pull-quote__text').count();
    console.log('[invalid share link] setup shown?', hasSetup > 0, 'errors:', errors);
    await page.screenshot({ path: '/tmp/edge-03-bad-share-link.png' });
    await page.close();
  }

  // 4. Valid share link -> challenge banner shown, prefilled picks.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const payload = { n: 'Ada', m: 'backed', sp: 'bet366', kit: { id: 'alt_black' }, ph: 'high_press', grade: 'B', pos: 5, pts: 70 };
    const b64 = Buffer.from(encodeURIComponent(JSON.stringify(payload))).toString('base64');
    await page.goto(`${BASE}/?w=${b64}`, { waitUntil: 'networkidle' });
    const banner = await page.locator('.challenge-banner').innerText().catch(() => null);
    console.log('[valid share link] banner:', banner, 'errors:', errors);
    await page.screenshot({ path: '/tmp/edge-04-valid-share-link.png' });
    await page.close();
  }

  // 5. XI illegality message ("need 4 DF, have 2") is specific, not generic.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await completeSetup(page, 'Edge');
    await page.waitForTimeout(200);
    await page.click('.task-tile:has-text("XI")');
    await page.waitForTimeout(200);
    // Add only 2 DF via the pitch slots — default 4-3-3 DF slots are
    // labelled LB/CB/CB/RB (real role labels now, not a generic "DF").
    for (const role of ['LB', 'CB']) {
      await page.locator(`.pitch-slot--empty:has-text("${role}")`).first().click();
      await page.waitForTimeout(80);
      await page.locator('.sheet .action-btn--add').first().click();
      await page.waitForTimeout(80);
    }
    const nudgeText = await page.locator('.nudge--warn').innerText().catch(() => null);
    console.log('[XI illegality] message:', nudgeText, 'errors:', errors);
    await page.screenshot({ path: '/tmp/edge-05-xi-illegal.png' });
    await page.close();
  }

  // 6. Sell floor (16) — Sell buttons disable at floor.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await completeSetup(page, 'FloorTest');
    await page.waitForTimeout(200);
    await page.click('.task-tile:has-text("Sell")');
    await page.waitForTimeout(200);
    // Squad starts at 25 -> sell down to floor (9 sales)
    for (let i = 0; i < 12; i += 1) {
      const btn = page.locator('.action-btn--sell:not([disabled])').first();
      if ((await btn.count()) === 0) break;
      await btn.click();
      await page.waitForTimeout(20);
    }
    const subtitle = await page.locator('.task-subtitle').innerText();
    const remainingEnabled = await page.locator('.action-btn--sell:not([disabled])').count();
    console.log('[sell floor] subtitle:', subtitle, 'sell buttons still enabled?', remainingEnabled, 'errors:', errors);
    await page.screenshot({ path: '/tmp/edge-06-sell-floor.png' });
    await page.close();
  }

  await browser.close();
}

run().catch((e) => {
  console.error('EDGE CASE SCRIPT FAILED:', e);
  process.exit(1);
});
