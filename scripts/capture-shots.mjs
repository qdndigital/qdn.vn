/**
 * Capture the case-study imagery for every live project in the work archive and
 * write optimised .webp files into public/assets/work/.
 *
 * Per project it shoots up to three frames:
 *   <slug>.webp    — the storefront hero (desktop)
 *   <slug>-2.webp  — an inner page (collection / product / about), desktop
 *   <slug>-m.webp  — the hero on a phone viewport
 *
 * It also dumps observed facts about each site to /tmp/site-facts.json — nav
 * labels, headings, currency, language — which is the raw material for the case
 * narrative. We describe what shipped, so we look at what shipped.
 *
 * Playwright and sharp are not dependencies of this site — they are borrowed from
 * the shared workspace tool at ~/qdn/tools/app-listing. Run from the repo root:
 *
 *   node scripts/capture-shots.mjs            # all projects missing a shot
 *   node scripts/capture-shots.mjs --force    # re-capture everything
 *   node scripts/capture-shots.mjs herman-miller-uk   # just one
 */
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
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

/** Preferred inner page per site, when the generic link hunt picks something dull. */
const SITE_INNER = {
  'online-carpets': '/collections/vinyl-flooring',
  'herman-miller-uk': '/collections/seating',
  'modest-resell': '/collections/all',
  'pottery-and-decor': '/collections/all',
  'meaningful-mantras': '/collections/all',
  'mai-anh-home': '/collections/all',
  'lilac-and-creme': '/collections/all',
  'drink-tavlin': '/collections/all',
};

const outDir = resolve(root, 'public/assets/work');
mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

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
const builds = readdirSync(resolve(homedir(), 'Library/Caches/ms-playwright'))
  .filter((d) => d.startsWith('chromium-'))
  .sort();
const executablePath = builds.length
  ? resolve(homedir(), 'Library/Caches/ms-playwright', builds.at(-1), 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')
  : undefined;

const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, userAgent: UA });
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

/** Clear age gates, cookie banners and newsletter pop-ups. */
async function clearInterstitials(page, slug) {
  for (const sel of SITE_GATES[slug] ?? []) {
    await page.locator(sel).first().click({ timeout: 4000, force: true }).catch(() => {});
    await page.waitForTimeout(1500);
  }
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
}

async function shoot(page, name, opts = {}) {
  const tmp = resolve(outDir, `${name}.tmp.png`);
  await page.screenshot({ path: tmp });
  await sharp(tmp).resize({ width: opts.width ?? 1280 }).webp({ quality: 74 }).toFile(resolve(outDir, `${name}.webp`));
  rmSync(tmp);
}

const facts = {};

for (const { slug, url } of targets) {
  const page = await desktop.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    await clearInterstitials(page, slug);
    await shoot(page, slug);

    // Observed facts — what the shipped site actually is.
    facts[slug] = await page.evaluate(() => {
      const txt = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
      const nav = [...document.querySelectorAll('nav a, header a')].map((a) => txt(a)).filter((t) => t && t.length < 30);
      return {
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content ?? '',
        lang: document.documentElement.lang || '',
        dir: document.documentElement.dir || 'ltr',
        nav: [...new Set(nav)].slice(0, 24),
        headings: [...document.querySelectorAll('h1,h2,h3')].map((h) => txt(h)).filter(Boolean).slice(0, 24),
        currencies: [...new Set((document.body.innerText.match(/[£$€₪₫]|VND|ILS|GBP|USD/g) ?? []))].slice(0, 6),
        shopify: !!document.querySelector('script[src*="cdn.shopify"], link[href*="cdn.shopify"]') || /Shopify/.test(document.documentElement.innerHTML.slice(0, 60000)),
        wordpress: /wp-content|wp-includes/.test(document.documentElement.innerHTML.slice(0, 60000)),
      };
    });

    // Inner page — a collection, a product, or whatever the nav offers.
    const base = new URL(url);
    let inner = SITE_INNER[slug] ? new URL(SITE_INNER[slug], base).href : null;
    if (!inner) {
      inner = await page.evaluate(() => {
        const a = [...document.querySelectorAll('a')].map((x) => x.href)
          .find((h) => /\/(collections|products|shop|category|san-pham|du-an|about|gioi-thieu)\//i.test(h));
        return a ?? null;
      });
    }
    if (inner) {
      await page.goto(inner, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(3000);
      await clearInterstitials(page, slug);
      await shoot(page, `${slug}-2`);
      facts[slug].innerUrl = inner;
      facts[slug].innerHeadings = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2')].map((h) => (h.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10));
    }
    console.log(`✓ ${slug}`);
  } catch (err) {
    console.log(`✗ ${slug} — ${err.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }

  // Phone frame of the storefront.
  const mob = await phone.newPage();
  try {
    await mob.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await mob.waitForTimeout(3000);
    await clearInterstitials(mob, slug);
    await shoot(mob, `${slug}-m`, { width: 640 });
    console.log(`  ↳ ${slug} mobile`);
  } catch (err) {
    console.log(`  ✗ ${slug} mobile — ${err.message.split('\n')[0]}`);
  } finally {
    await mob.close();
  }
}

writeFileSync('/tmp/site-facts.json', JSON.stringify(facts, null, 1), 'utf8');
console.log('facts → /tmp/site-facts.json');
await browser.close();
