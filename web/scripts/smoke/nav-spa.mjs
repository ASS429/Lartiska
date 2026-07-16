// Reproduit la navigation SPA : Home → clic "Portfolio" → la page est-elle visible ?
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text().slice(0, 300)); });

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

// Scroller un peu (comme un vrai utilisateur) puis cliquer sur Portfolio
await page.evaluate(() => window.scrollTo(0, 800));
await new Promise((r) => setTimeout(r, 600));
await page.click('a[href="/portfolio"]');
await new Promise((r) => setTimeout(r, 2500)); // laisser le temps aux données + reveals

const report = await page.evaluate(() => {
  const h1 = document.querySelector('main h1');
  const cards = [...document.querySelectorAll('main .project-card, main .surface-card')];
  const style = h1 ? getComputedStyle(h1) : null;
  return {
    url: location.pathname,
    h1Text: h1?.textContent?.slice(0, 40) || null,
    h1Opacity: style?.opacity,
    h1Clip: style?.clipPath,
    cardCount: cards.length,
    hiddenCards: cards.filter((c) => parseFloat(getComputedStyle(c).opacity) < 0.5).length,
    scrollY: window.scrollY,
  };
});
console.log(JSON.stringify(report, null, 2));

await page.screenshot({ path: process.argv[2] || 'nav-result.png' });
await browser.close();
