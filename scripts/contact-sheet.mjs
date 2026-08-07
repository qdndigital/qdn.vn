/**
 * Compose every teardown frame into one contact sheet, so the whole set can be
 * reviewed in a single look before any of it is wired into the site. Rendering
 * blind and letting the reviewer find the misalignment is what went wrong
 * repeatedly; this is the step that was missing.
 *
 *   node scripts/contact-sheet.mjs   →  /tmp/teardown-contact-sheet.png
 */
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(homedir(), 'qdn/tools/app-listing/package.json'));
const sharp = require('sharp');

const dir = resolve(root, 'public/assets/work/steps');
const files = readdirSync(dir).filter((f) => f.endsWith('.webp')).sort();
const W = 900;
const tiles = [];
for (const f of files) {
  const buf = await sharp(resolve(dir, f)).resize({ width: W }).toBuffer();
  const { height } = await sharp(buf).metadata();
  tiles.push({ f, buf, height });
}
const total = tiles.reduce((a, t) => a + t.height + 26, 20);
let y = 20;
const composite = tiles.map((t) => { const top = y; y += t.height + 26; return { input: t.buf, left: 20, top }; });
await sharp({ create: { width: W + 40, height: total, channels: 3, background: '#c9c6bf' } })
  .composite(composite).png().toFile('/tmp/teardown-contact-sheet.png');
console.log(`contact sheet: ${tiles.length} frames → /tmp/teardown-contact-sheet.png`);
tiles.forEach((t, i) => console.log(`  ${i + 1}. ${t.f}`));
