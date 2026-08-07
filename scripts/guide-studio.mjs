/**
 * QDN Guide Studio — the case-study step visuals.
 *
 * Same idea as ~/qdn/tools/user-guide (userGuideSnap): capture a real screen,
 * then compose it inside an HTML "slide" and render that with Playwright, so the
 * annotation is styled by CSS rather than drawn by hand. The tokens here are
 * QDN's own — paper, ink, orange accent, JetBrains Mono — not QSortby's green
 * Editorial Glass.
 *
 * Each entry in TARGETS points at the part of a live site that demonstrates one
 * step of that project's approach. The script scrolls that thing into view,
 * shoots the viewport, then frames it in browser chrome with a numbered callout.
 *
 *   node scripts/guide-studio.mjs              # everything missing
 *   node scripts/guide-studio.mjs --force      # rebuild all
 *   node scripts/guide-studio.mjs online-carpets
 *
 * Output: public/assets/work/steps/<slug>-<step>.webp
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(homedir(), 'qdn/tools/app-listing/package.json'));
const { chromium } = require('playwright');
const sharp = require('sharp');

const outDir = resolve(root, 'public/assets/work/steps');
mkdirSync(outDir, { recursive: true });

/**
 * slug → the steps worth showing. `step` is the 1-based index of the step in the
 * case study. `find` is a CSS selector or {text} to scroll to; `y` is a fallback
 * scroll offset. `label` is the mono caption burned into the frame.
 */
const TARGETS = {
  'online-carpets': [
    { step: 2, path: '/', y: 900, label: 'Faceted filtering — colour, material, width' },
    { step: 5, path: '/', y: 300, label: 'Clearance, delivery and the phone line kept in place' },
  ],
  'herman-miller-uk': [
    { step: 2, path: '/', y: 1100, label: 'Popular categories — shopping by problem, not alphabet' },
    { step: 4, path: '/', y: 0, label: 'One storefront, fourteen markets in local currency' },
  ],
  'mai-anh-home': [
    { step: 3, path: '/collections/all', y: 300, label: '2,965 products — filterable and sortable' },
    { step: 4, path: '/collections/all', y: 0, label: 'Search as primary navigation at this catalogue size' },
  ],
  'drink-tavlin': [
    { step: 1, path: '/', y: 0, label: 'The age gate every visitor clears first' , preGate: false },
    { step: 4, path: '/', y: 0, label: 'Six currencies for a local brand with global buyers' },
  ],
  'pottery-and-decor': [
    { step: 3, path: '/collections/all', y: 200, label: '277 products, kept walkable' },
    { step: 5, path: '/', y: 0, label: 'Accessibility mode with keyboard shortcuts' },
  ],
  'meaningful-mantras': [
    { step: 2, path: '/collections/all', y: 250, label: 'Collections by size and by named range' },
    { step: 4, path: '/collections/all', y: 1500, label: 'Build-a-box — bundling as a first-class product' },
  ],
  'modest-resell': [
    { step: 3, path: '/', y: 1400, label: 'List it · Share it · Earn cash — the seller journey' },
    { step: 5, path: '/collections/all', y: 200, label: 'One merged catalogue for buyers' },
  ],
  'lilac-and-creme': [
    { step: 4, path: '/collections/all', y: 200, label: 'Sizes, flavours and box configurations as variants' },
    { step: 5, path: '/', y: 900, label: 'Retail, custom logo boxes and corporate gifting in one store' },
  ],
  'mads-digital-sat': [
    { step: 2, path: '/', y: 1200, label: 'Mentors and results treated as primary content' },
    { step: 4, path: '/', y: 2600, label: 'Free practice material as the top of the funnel' },
  ],
  'alpine-initiatives': [
    { step: 1, path: '/', y: 800, label: 'Programmes and journal at the centre' },
    { step: 3, path: '/', y: 0, label: 'Donate and shop in reach, never shouting' },
  ],
  'fours-tower-danang': [
    { step: 1, path: '/', y: 1200, label: "The buyer's question list, in order" },
    { step: 3, path: '/', y: 3200, label: 'Floor plans, where interest becomes an enquiry' },
  ],
  'qone': [
    { step: 3, path: '/', y: 900, label: 'Ranked by what matters, not a wall of charts' },
    { step: 2, path: '/', y: 1900, label: 'One system across the whole cycle' },
  ],
  'qsortby': [
    { step: 1, path: '', y: 700, label: 'Sorting on behaviour, sales, CTR and top sellers' },
    { step: 5, path: '', y: 1500, label: 'Free tier plus paid plans, live on the App Store' },
  ],
};

const SITE_GATES = { 'drink-tavlin': ['a.js-confirm-enter'] };

const URLS = {
  'online-carpets': 'https://www.onlinecarpets.co.uk',
  'herman-miller-uk': 'https://ukstore.hermanmiller.com',
  'mai-anh-home': 'https://maianhhome.com',
  'drink-tavlin': 'https://www.drinktavlin.com',
  'pottery-and-decor': 'https://potteryanddecor.com',
  'meaningful-mantras': 'https://meaningfulmantras.com',
  'modest-resell': 'https://modestresell.com',
  'lilac-and-creme': 'https://lilacandcreme.com',
  'mads-digital-sat': 'https://mads.edu.vn',
  'alpine-initiatives': 'https://www.alpineinitiatives.org',
  'fours-tower-danang': 'https://fours-towerdanang.com.vn',
  'qone': 'https://qone.work',
  'qsortby': 'https://apps.shopify.com/qsortby',
};

/** The slide: QDN ground, browser chrome, numbered callout. Styled, not drawn. */
const slide = (dataUri, host, n, label) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face { font-family:'JetBrains Mono'; src:local('JetBrains Mono'),local('SF Mono'),local('Menlo'); }
  :root{ --paper:#e9e7e2; --surface:#f5f4f0; --ink:#1c1b18; --ink-2:#585550; --muted:#6b675e;
         --line:#d3cfc6; --line-2:#bdb8ac; --accent:#e2622a; --accent-ink:#ab4715; --accent-soft:#f7e4d8;
         --mono:'JetBrains Mono','SF Mono',Menlo,ui-monospace,monospace; }
  *{ box-sizing:border-box; margin:0; }
  body{ width:1440px; height:1000px; background:var(--paper); position:relative; overflow:hidden;
        font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  /* the QDN grid ground */
  body::before{ content:""; position:absolute; inset:0;
    background-image:linear-gradient(rgba(28,27,24,.045) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(28,27,24,.045) 1px,transparent 1px);
    background-size:34px 34px; }
  .stage{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:56px 64px 96px; }
  .win{ position:relative; width:100%; border-radius:14px; overflow:hidden; background:var(--surface);
        border:1px solid var(--line);
        box-shadow:0 1px 2px rgba(28,27,24,.04), 0 40px 80px -36px rgba(28,27,24,.42); }
  .bar{ display:flex; align-items:center; gap:7px; padding:11px 14px; border-bottom:1px solid var(--line); background:var(--surface); }
  .bar i{ width:9px; height:9px; border-radius:50%; background:#dedbd2; display:block; }
  .bar b{ margin-left:8px; font-family:var(--mono); font-size:11px; font-weight:400; color:var(--muted); }
  .win img{ display:block; width:100%; height:auto; }
  /* the callout — mono number + label, in the accent */
  .callout{ position:absolute; left:64px; bottom:34px; display:inline-flex; align-items:center; gap:14px;
            background:var(--ink); color:var(--paper); border-radius:12px; padding:14px 20px 14px 14px;
            box-shadow:0 20px 40px -20px rgba(28,27,24,.55); max-width:calc(100% - 128px); }
  .callout .n{ display:grid; place-items:center; width:30px; height:30px; flex:none; border-radius:8px;
               background:var(--accent); color:#fff; font-family:var(--mono); font-size:13px; font-weight:600; }
  .callout .t{ font-size:17px; letter-spacing:-.01em; line-height:1.3; }
  .tagline{ position:absolute; right:64px; bottom:44px; font-family:var(--mono); font-size:11px;
            letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
</style></head><body>
  <div class="stage"><div class="win">
    <div class="bar"><i></i><i></i><i></i><b>${host}</b></div>
    <img src="${dataUri}" />
  </div></div>
  <div class="callout"><span class="n">${String(n).padStart(2, '0')}</span><span class="t">${label}</span></div>
  <div class="tagline">qdn.vn</div>
</body></html>`;

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const builds = (await import('node:fs')).readdirSync(resolve(homedir(), 'Library/Caches/ms-playwright'))
  .filter((d) => d.startsWith('chromium-')).sort();
const executablePath = resolve(homedir(), 'Library/Caches/ms-playwright', builds.at(-1),
  'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');

const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 860 }, deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
});
const studio = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });

async function clearInterstitials(page, slug) {
  for (const sel of SITE_GATES[slug] ?? []) {
    await page.locator(sel).first().click({ timeout: 4000, force: true }).catch(() => {});
    await page.waitForTimeout(1500);
  }
  for (const label of [/accept all/i, /accept/i, /agree/i, /got it/i, /^close$/i, /dismiss/i, /no thanks/i]) {
    const el = page.locator('button, a, [role="button"], .btn').filter({ hasText: label }).first();
    if (await el.isVisible().catch(() => false)) { await el.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(700); }
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(400);
}

const manifest = {};

for (const [slug, steps] of Object.entries(TARGETS)) {
  if (only.length && !only.includes(slug)) continue;
  const base = URLS[slug];
  if (!base) continue;
  manifest[slug] = manifest[slug] ?? {};

  for (const target of steps) {
    const name = `${slug}-${target.step}`;
    const finalPath = resolve(outDir, `${name}.webp`);
    if (!force && existsSync(finalPath)) { manifest[slug][target.step] = `/assets/work/steps/${name}.webp`; continue; }

    const page = await ctx.newPage();
    try {
      await page.goto(base + (target.path ?? ''), { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3200);
      if (target.preGate !== false) await clearInterstitials(page, slug);

      if (target.find) {
        const el = page.locator(target.find).first();
        if (await el.isVisible().catch(() => false)) {
          await el.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(800);
        } else if (target.y) {
          await page.evaluate((y) => window.scrollTo(0, y), target.y);
          await page.waitForTimeout(900);
        }
      } else if (target.y) {
        await page.evaluate((y) => window.scrollTo(0, y), target.y);
        await page.waitForTimeout(1100);
      }

      const raw = resolve(outDir, `${name}.raw.png`);
      await page.screenshot({ path: raw });

      // Compose the slide and render it.
      const b64 = (await import('node:fs')).readFileSync(raw).toString('base64');
      const html = slide(`data:image/png;base64,${b64}`, base.replace(/^https?:\/\//, ''), target.step, target.label);
      const tmpHtml = resolve(outDir, `${name}.html`);
      writeFileSync(tmpHtml, html, 'utf8');

      const sp = await studio.newPage();
      await sp.goto(`file://${tmpHtml}`, { waitUntil: 'load' });
      await sp.waitForTimeout(500);
      const composed = resolve(outDir, `${name}.png`);
      await sp.screenshot({ path: composed });
      await sp.close();

      await sharp(composed).resize({ width: 1440 }).webp({ quality: 76 }).toFile(finalPath);
      rmSync(raw); rmSync(composed); rmSync(tmpHtml);
      manifest[slug][target.step] = `/assets/work/steps/${name}.webp`;
      console.log(`✓ ${name}`);
    } catch (err) {
      console.log(`✗ ${name} — ${err.message.split('\n')[0]}`);
    } finally {
      await page.close();
    }
  }
}

writeFileSync('/tmp/step-manifest.json', JSON.stringify(manifest, null, 1), 'utf8');
console.log('manifest → /tmp/step-manifest.json');
await browser.close();
