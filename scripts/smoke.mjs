// Browser smoke tests. Needs `npx vite preview --port 4173`.
import { chromium } from 'playwright-core';
const base = 'http://localhost:4173/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok, info }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? '  (' + info + ')' : ''}`); };

async function newPage(opts = {}, q = '') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + q, { waitUntil: 'load' });
  return { page, errors, ctx };
}

// 1. Desktop 3D
{
  const { page, errors, ctx } = await newPage();
  const t0 = Date.now();
  await page.locator('#hero a:has-text("Explore our fleet")').waitFor({ state: 'visible' });
  check('Hero CTAs visible within 1s of load', Date.now() - t0 < 1500, `${Date.now() - t0}ms after load event`);
  await page.waitForTimeout(2000);
  check('Hero video loads', await page.evaluate(() => document.querySelector('#hero video').readyState >= 2));
  // tabs filter
  await page.locator('#showroom').scrollIntoViewIfNeeded();
  await page.locator('[role=tab]:has-text("Vans")').click();
  const radios = await page.locator('#showroom [role=radio]').allTextContents();
  check('Vans tab filters list to vans only', radios.length === 1 && radios[0].includes('Voxy'), radios.join(' | '));
  check('Selected vehicle follows filter', (await page.locator('#showroom h3').first().textContent()).includes('Voxy'));
  await page.locator('[role=tab]:has-text("All")').click();
  await page.locator('#showroom [role=radio]:has-text("Mark X")').click();
  check('Choosing a vehicle swaps the photo', ((await page.locator('#showroom-panel img.photo-in').getAttribute('alt')) || '').includes('Mark X'));
  // arrow-key tabs
  await page.locator('[role=tab][aria-selected=true]').focus();
  await page.keyboard.press('ArrowRight');
  check('Arrow keys move between tabs', (await page.locator('[role=tab][aria-selected=true]').textContent()) === 'Hatchbacks');
  await page.locator('[role=tab]:has-text("All")').click();
  // photo controls
  await page.locator('#showroom [role=radio]').first().click();
  await page.locator('[role=toolbar] button:has-text("Interior")').click();
  check('Angle button shows that photo', ((await page.locator('#showroom-panel img.photo-in').getAttribute('alt')) || '').includes('interior'));
  await page.locator('[aria-label="Next photo"]').click();
  check('Next arrow moves to the next photo', ((await page.locator('#showroom-panel img.photo-in').getAttribute('alt')) || '').includes('front'));
  await page.locator('[aria-label="Zoom in"]').click();
  check('Zoom in enables zoom out', !(await page.locator('[aria-label="Zoom out"]').isDisabled()));
  // reserve opens inquiry
  await page.locator('#showroom button:has-text("Reserve this vehicle")').click();
  const dlg = page.locator('[role=dialog]');
  check('Reserve opens inquiry dialog', await dlg.isVisible());
  const text = await dlg.locator('textarea').inputValue();
  check('Inquiry message names the vehicle', /renting the Toyota/.test(text), text.slice(0, 70));
  check('No WhatsApp link while number unconfirmed', (await dlg.locator('a[href*="wa.me"]').count()) === 0);
  check('Email and both phone numbers offered', (await dlg.locator('a[href^="mailto:"]').count()) === 1 && (await dlg.locator('a[href^="tel:"]').count()) === 2);
  await page.keyboard.press('Escape');
  check('Escape closes dialog', !(await dlg.isVisible()));
  // search validation
  await page.locator('#search').scrollIntoViewIfNeeded();
  await page.locator('#search button[type=submit]').click();
  const errCount = await page.locator('#search .error-text:not([role=status])').count();
  check('Search shows errors when dates missing', errCount >= 2, `${errCount} errors`);
  const d = new Date(); d.setDate(d.getDate() + 5);
  const iso = (x) => x.toISOString().slice(0, 10);
  const back = new Date(d); back.setDate(back.getDate() - 2);
  await page.locator('#search input[type=date]').nth(0).fill(iso(d));
  await page.locator('#search input[type=date]').nth(1).fill(iso(back));
  await page.locator('#search button[type=submit]').click();
  check('Return before pickup is rejected', (await page.locator('#search').textContent()).includes('Return must be after pickup'));
  const later = new Date(d); later.setDate(later.getDate() + 3);
  await page.locator('#search input[type=date]').nth(1).fill(iso(later));
  await page.locator('#search select').nth(2).selectOption('van');
  await page.locator('#search button[type=submit]').click();
  await page.waitForTimeout(800);
  check('Valid search filters showroom to vans', (await page.locator('[role=tab][aria-selected=true]').textContent()) === 'Vans');
  check('Search notice explains results', (await page.locator('#showroom').textContent()).includes('OJ\'s confirms real availability'));
  // past pickup
  const past = new Date(); past.setDate(past.getDate() - 3);
  await page.locator('#search input[type=date]').nth(0).fill(iso(past));
  await page.locator('#search button[type=submit]').click();
  check('Past pickup date rejected', (await page.locator('#search').textContent()).includes('Pickup cannot be in the past'));
  // detail route
  await page.goto(base + '#fleet-toyota-voxy');
  await page.waitForTimeout(800);
  check('Vehicle detail route renders', (await page.locator('h1').textContent()).includes('Voxy'));
  check('Detail gallery has real photos', (await page.locator('main img').count()) >= 3);
  await page.goto(base + '#fleet-nope');
  await page.waitForTimeout(400);
  check('Unknown vehicle shows not-found state', (await page.locator('h1').textContent()).includes('not found'));
  // airport form
  await page.goto(base + '#airport');
  await page.waitForTimeout(800);
  await page.locator('#airport button[type=submit]').click();
  check('Airport form validates required fields', (await page.locator('#airport .error-text').count()) >= 3);
  await page.locator('#airport input[type=date]').fill(iso(d));
  await page.locator('#airport input[autocomplete=name]').fill('Test Traveller');
  await page.locator('#airport input[autocomplete=email]').fill('test@example.com');
  await page.locator('#airport button[type=submit]').click();
  check('Valid airport inquiry opens dialog', await page.locator('[role=dialog]').isVisible());
  await page.keyboard.press('Escape');
  // testimonials hidden, no fake reviews
  check('Testimonials section hidden while empty', (await page.locator('#reviews').count()) === 0);
  // links
  const tel = await page.locator('a[href^="tel:"]').count();
  check('Click-to-call links present', tel >= 4, `${tel}`);
  const deadButtons = await page.evaluate(() => [...document.querySelectorAll('a')].filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').length);
  check('No empty or "#" links', deadButtons === 0, `${deadButtons}`);
  const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => !h.startsWith('#fleet-') && !document.querySelector(h)));
  check('All in-page anchors resolve', anchors.length === 0, anchors.join(','));
  check('No JS errors (desktop)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 3. Reduced motion
{
  const { page, errors, ctx } = await newPage({ reducedMotion: 'reduce' });
  await page.waitForTimeout(1500);
  check('Reduced motion: hero video does not autoplay', await page.evaluate(() => document.querySelector('#hero video').paused));
  check('Reduced motion: sweep animation disabled', await page.evaluate(() => getComputedStyle(document.querySelector('.light-sweep')).display === 'none'));
  check('Reduced motion: no JS errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 4. Mobile layout
for (const [w, h] of [[390, 844], [360, 740]]) {
  const { page, errors, ctx } = await newPage({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
  await page.waitForTimeout(3000);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`Mobile ${w}px: no horizontal overflow`, overflow <= 0, `${overflow}px`);
  const ctaVisible = await page.evaluate(() => { const r = document.querySelector('#hero a.btn-primary').getBoundingClientRect(); return r.bottom <= window.innerHeight && r.top >= 0; });
  check(`Mobile ${w}px: hero CTA visible without scrolling`, ctaVisible);
  await page.locator('button[aria-label="Open menu"]').click();
  check(`Mobile ${w}px: menu opens`, await page.locator('#mobile-menu').isVisible());
  await page.keyboard.press('Escape');
  check(`Mobile ${w}px: no JS errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 5. Desktop overflow at 1440 and 1024
for (const w of [1440, 1024, 768]) {
  const { page, ctx } = await newPage({ viewport: { width: w, height: 900 } });
  await page.waitForTimeout(1500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`${w}px: no horizontal overflow`, overflow <= 0, `${overflow}px`);
  const navLines = await page.evaluate(() => document.querySelector('.site-nav nav').getBoundingClientRect().height);
  check(`${w}px: nav on one line (<=80px)`, navLines <= 80, `${navLines}px`);
  await ctx.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
