// Screenshots at several scroll positions. node scripts/tour.mjs <url> <outPrefix> <w> <h>
import { chromium } from 'playwright-core';
const [url, prefix, w = '1440', h = '900'] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${prefix}-hero.png` });
const stops = [['showroom','#showroom',0],['storyA','#story',0.05],['storyB','#story',0.5],['categories','#categories',0],['airport','#airport',0],['sale','#for-sale',0],['visit','#visit',0]];
for (const [name, sel, frac] of stops) {
  await page.evaluate(([sel, frac]) => { const el = document.querySelector(sel); const r = el.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + (r.height - window.innerHeight) * frac); }, [sel, frac]);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${prefix}-${name}.png` });
}
console.log(errs.join('\n') || 'no errors');
await browser.close();
