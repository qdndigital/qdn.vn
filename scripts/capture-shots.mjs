/**
 * Capture a hero screenshot of every live project in the work archive and write
 * optimised .webp files into public/assets/work/.
 *
 * Playwright and sharp are not dependencies of this site — they are borrowed from
 * the shared workspace tool at ~/qdn/tools/app-listing. Run from the repo root:
 *
 *   node scripts/capture-shots.mjs            # all projects missing a shot
 *   node scripts/capture-shots.mjs --force    # re-capture everything
 *   node scripts/capture-shots.mjs herman-miller-uk   # just one
 */
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = resolve(homedir(), 'qdn/tools/app-listing');
const require = createRequire(resolve(toolDir, 'package.json'));
const { chromium } = require('playwright');
const sharp = require('sharp');

/** Per-site selectors for interstitials the generic pass can't clear (age gates etc). */
const SITE_GATES = {
  'drink-tavlin': ['a.js-confirm-enter'],
};

const outDir = resolve(root, 'public/assets/work');
mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

// Read the EN content entries for slug + url (frontmatter is simple enough to scan).
const srcDir = resolve(root, 'src/content/work/en');
const targets = readdirSync(srcDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(resolve(srcDir, f), 'utf8');
    const url = raw.match(/^url: '(.+)'$/m)?.[1] ?? null;
    return { slug: f.replace(/\.md$/, ''), url };
  })
  .filter((t) => t.url)
  .filter((t) => (only.length ? only.includes(t.slug) : true))
  .filter((t) => force || !existsSync(resolve(outDir, `${t.slug}.webp`)));

if (!targets.length) {
  console.log('nothing to capture');
  process.exit(0);
}

// The borrowed playwright build pins an older revision than the browsers actually
// installed on this machine — point it at the newest chromium we have.
const shells = readdirSync(resolve(homedir(), 'Library/Caches/ms-playwright'))
  .filter((d) => d.startsWith('chromium-'))
  .sort();
const executablePath = shells.length
  ? resolve(homedir(), 'Library/Caches/ms-playwright', shells.at(-1), 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
  : undefined;

const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
});

for (const { slug, url } of targets) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    for (const sel of SITE_GATES[slug] ?? []) {
      await page.locator(sel).first().click({ timeout: 4000, force: true }).catch(() => {});
      await page.waitForTimeout(1500);
    }
    // Clear the usual interruptions: age gates first (they block everything else),
    // then cookie banners and newsletter pop-ups.
    const gates = [/^enter$/i, /^yes$/i, /i am 1[89]/i, /over 1[89]/i, /^confirm$/i];
    const banners = [/accept all/i, /accept/i, /agree/i, /got it/i, /^close$/i, /continue/i, /dismiss/i];
    for (const label of [...gates, ...banners]) {
      const clickable = page.locator('button, a, [role="button"], input[type="submit"], .btn').filter({ hasText: label }).first();
      for (const el of [page.getByRole('button', { name: label }).first(), page.getByRole('link', { name: label }).first(), clickable]) {
        if (await el.isVisible().catch(() => false)) {
          await el.click({ timeout: 2000 }).catch(() => {});
          await page.waitForTimeout(900);
        }
      }
    }
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(400);
    const tmp = resolve(outDir, `${slug}.tmp.png`);
    await page.screenshot({ path: tmp });
    await sharp(tmp)
      .resize({ width: 1280 })
      .webp({ quality: 76 })
      .toFile(resolve(outDir, `${slug}.webp`));
    rmSync(tmp);
    console.log(`✓ ${slug}`);
  } catch (err) {
    console.log(`✗ ${slug} — ${err.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
