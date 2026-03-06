import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'public', 'og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
await page.goto('https://fitcalendr.com', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

await page.screenshot({
  path: outputPath,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await browser.close();
console.log(`Saved to ${outputPath}`);
