import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));
const el = await page.$('.epoxy-grid');
if (!el) { console.log('EPOXY GRID INTROUVABLE'); process.exit(1); }
await el.scrollIntoView();
await new Promise((r) => setTimeout(r, 1200));
// clic sur la 3e tuile (marbre) pour vérifier la sélection
const tiles = await page.$$('.epoxy-tile');
console.log('tuiles:', tiles.length);
await tiles[2].click();
await new Promise((r) => setTimeout(r, 600));
const section = await page.evaluateHandle(() => document.querySelector('.epoxy-grid').closest('section'));
await section.screenshot({ path: process.argv[2] });
console.log('screenshot ok');
await browser.close();
