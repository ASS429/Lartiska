// Vérifie que le scrollytelling CraftStory anime bien au scroll (sticky CSS + scrub).
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

const top = await page.evaluate(() => {
  const el = document.querySelector('.craft-story');
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
console.log('craft-story top:', top);

const probe = async (offset, label) => {
  await page.evaluate((y) => window.scrollTo(0, y), top + offset);
  await new Promise((r) => setTimeout(r, 1200));
  const state = await page.evaluate(() => ({
    enduit: getComputedStyle(document.querySelector('.craft-layer--enduit')).opacity,
    couleur: getComputedStyle(document.querySelector('.craft-layer--couleur')).opacity,
    or: getComputedStyle(document.querySelector('.craft-layer--or')).opacity,
    stickyTop: document.querySelector('.craft-story__sticky').getBoundingClientRect().top,
  }));
  console.log(label, JSON.stringify(state));
};

await probe(0, 'début   :');
await probe(1200, 'milieu 1:');
await probe(2200, 'milieu 2:');
await probe(3200, 'fin     :');

await browser.close();
