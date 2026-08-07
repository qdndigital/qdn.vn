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
 * slug → the steps worth showing. Each target must name the element that PROVES
 * the claim: `find` is a CSS selector, `text` is visible copy to locate. We scroll
 * that element into view and clip a band around it. If the anchor is not found the
 * frame is skipped — a missing image is honest, a wrong one is not.
 */
const TARGETS = {
  'online-carpets': [
    { step: 2, path: '/', text: 'Underlay & Accessories', band: 260, label: 'Catalogue organised by material, not by brand' },
    { step: 2, path: '/collections/carpets', text: 'Colour', band: 620, label: 'Faceted filtering — colour, material, width' },
    { step: 5, path: '/', text: 'FREE Flooring Samples', band: 220, label: 'Samples, delivery and the phone line kept where regulars expect them' },
  ],
  'herman-miller-uk': [
    { step: 2, path: '/', text: 'Popular Categories', band: 700, label: 'Shopping by problem — seating, desks, lighting' },
    { step: 4, path: '/', text: ['United Kingdom (£)', 'Deutschland', 'France (€)'], band: 460, label: 'One storefront, fourteen markets in local currency' },
  ],
  'mai-anh-home': [
    { step: 3, path: '/collections/all', text: ['2965 sản phẩm', 'sản phẩm', 'Bộ lọc'], band: 520, label: '2,965 products — filterable and sortable' },
    { step: 4, path: '/', text: 'Thiết Bị Phòng Tắm', band: 300, label: 'Navigation by room, function and brand' },
  ],
  'drink-tavlin': [
    { step: 1, path: '/', find: '.js-confirm-enter, [class*="age"]', band: 620, label: 'The age gate every visitor clears before a bottle appears', preGate: false },
    { step: 4, path: '/', text: ['Currency', 'ILS', 'EUR'], band: 420, label: 'Priced in six currencies for a local brand with global buyers' },
  ],
  'pottery-and-decor': [
    { step: 3, path: '/collections/all', text: '277 products', band: 560, label: '277 products, kept walkable' },
    { step: 5, path: '/', text: 'Toggle accessibility mode', band: 300, label: 'Accessibility mode with keyboard shortcuts' },
  ],
  'meaningful-mantras': [
    { step: 2, path: '/', text: 'Browse Popular Collections', band: 640, label: 'Collections by size and by named range' },
    { step: 4, path: '/collections/all', text: ['Build-a-Box', 'Build a Box', 'Shop All Non-Toxic'], band: 480, label: 'Build-a-box — bundling as a first-class product' },
  ],
  'modest-resell': [
    { step: 3, path: '/', text: 'Turn Your Closet into Cash', band: 620, label: 'List it · Share it · Earn cash — the seller journey' },
    { step: 5, path: '/collections/all', text: ['Filter by', 'Sort by', 'All'], band: 560, label: 'One merged catalogue for buyers' },
  ],
  'lilac-and-creme': [
    { step: 4, path: '/collections/all', text: ['28 products', 'Filter and sort', 'Sort by'], band: 560, label: 'Sizes, flavours and box configurations as variants' },
    { step: 5, path: '/', text: ['Corporate Gifting Portal', 'Custom Logo Box', 'Dessert Minis'], band: 380, label: 'Retail, custom logo boxes and corporate gifting in one store' },
  ],
  'mads-digital-sat': [
    { step: 2, path: '/', text: ['MENTORS TẠI MADS', 'Mentors', 'Giáo viên'], band: 640, label: 'Mentors treated as primary content' },
    { step: 4, path: '/', text: ['BỘ SƯU TẬP ĐIỂM CAO', 'Thành tích HV', 'Tài liệu'], band: 640, label: 'Results, and free practice material, as the front door' },
  ],
  'alpine-initiatives': [
    { step: 1, path: '/', text: ['Programs and Projects', 'Programs & Projects', 'Journal'], band: 380, label: 'Programmes and journal at the centre' },
    { step: 3, path: '/', text: 'Donate', band: 260, label: 'Donate and shop in reach, never shouting' },
  ],
  'fours-tower-danang': [
    { step: 1, path: '/', text: 'Tiện ích', band: 260, label: "The buyer's question list, in navigation order" },
    { step: 3, path: '/', text: 'Mặt bằng', band: 620, label: 'Floor plans, where interest becomes an enquiry' },
  ],
  'qone': [
    { step: 3, path: '/', text: 'Ranked by money', band: 620, label: 'Ranked by what matters, not a wall of charts' },
    { step: 2, path: '/', text: 'Six health chapters', band: 620, label: 'One system across the whole cycle' },
  ],
  'qsortby': [
    { step: 1, path: '', text: 'Auto sort your collection', band: 420, label: 'Sorting on behaviour, sales, CTR and top sellers' },
    { step: 5, path: '', text: '$29', band: 520, label: 'Free tier plus paid plans, live on the App Store' },
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

/**
 * The slide. Borrows the guide-studio annotation vocabulary — spotlight, pin,
 * zoom inset (magnifier), callout — in QDN tokens. `box` is the proving element's
 * rectangle in captured-image pixels; everything is positioned from it.
 */
const slide = (dataUri, host, n, label, shot, box) => {
  const FRAME_W = 1312;                       // window inner width on the slide
  const k = FRAME_W / shot.w;                 // capture px → slide px
  const b = { x: box.x * k, y: box.y * k, w: Math.max(box.w * k, 40), h: Math.max(box.h * k, 26) };
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;

  // Put the magnifier in the corner furthest from the thing it magnifies, and
  // only when the band is tall enough to hold it without covering the evidence.
  const shotH = shot.h * k;
  const insetW = 430;
  const insetH = Math.min(250, shotH - 56);
  const showInset = shotH >= 300 && insetH >= 130;
  const insetLeft = cx < FRAME_W / 2 ? FRAME_W - insetW - 26 : 26;
  const insetTop = cy < shotH / 2 ? shotH - insetH - 26 : 26;

  // Magnifier: same bitmap, scaled up, positioned so the element sits in the middle.
  const Z = 2.3;
  const bgW = shot.w * k * Z, bgH = shot.h * k * Z;
  const bgX = -(cx * Z - insetW / 2), bgY = -(cy * Z - insetH / 2);

  return `<!doctype html><html><head><meta charset="utf-8">
<style>
  :root{ --paper:#e9e7e2; --surface:#f5f4f0; --ink:#1c1b18; --muted:#6b675e;
         --line:#d3cfc6; --line-2:#bdb8ac; --accent:#e2622a;
         --mono:'JetBrains Mono','SF Mono',Menlo,ui-monospace,monospace; }
  *{ box-sizing:border-box; margin:0; }
  body{ width:1440px; background:var(--paper); position:relative; overflow:hidden;
        font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  body::before{ content:""; position:absolute; inset:0;
    background-image:linear-gradient(rgba(28,27,24,.045) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(28,27,24,.045) 1px,transparent 1px);
    background-size:34px 34px; }
  .stage{ position:relative; padding:56px 64px 104px; }
  .win{ position:relative; border-radius:14px; overflow:hidden; background:var(--surface);
        border:1px solid var(--line);
        box-shadow:0 1px 2px rgba(28,27,24,.04), 0 40px 80px -36px rgba(28,27,24,.42); }
  .bar{ display:flex; align-items:center; gap:7px; padding:11px 14px; border-bottom:1px solid var(--line); }
  .bar i{ width:9px; height:9px; border-radius:50%; background:#dedbd2; display:block; }
  .bar b{ margin-left:8px; font-family:var(--mono); font-size:11px; font-weight:400; color:var(--muted); }
  .shot{ position:relative; display:block; }
  .shot img{ display:block; width:${FRAME_W}px; height:auto; }

  /* spotlight — dim everything except the proving element */
  .ring{ position:absolute; left:${b.x - 8}px; top:${b.y - 8}px; width:${b.w + 16}px; height:${b.h + 16}px;
         border:2.5px solid var(--accent); border-radius:10px; z-index:3;
         box-shadow:0 0 0 9999px rgba(28,27,24,.42), 0 0 22px rgba(226,98,42,.45); }
  /* pin — the numbered badge on the ring's corner */
  .pin{ position:absolute; left:${b.x - 8 - 17}px; top:${b.y - 8 - 17}px; z-index:5;
        width:34px; height:34px; border-radius:9px; background:var(--accent); color:#fff;
        display:grid; place-items:center; font-family:var(--mono); font-size:14px; font-weight:600;
        box-shadow:0 6px 16px rgba(28,27,24,.4); }
  /* zoom inset — the magnifier */
  .inset{ position:absolute; left:${insetLeft}px; top:${insetTop}px; width:${insetW}px; height:${insetH}px;
          z-index:6; border-radius:12px; overflow:hidden; border:2px solid var(--ink);
          box-shadow:0 22px 44px -18px rgba(28,27,24,.6);
          background-image:url("${dataUri}"); background-repeat:no-repeat;
          background-size:${bgW}px ${bgH}px; background-position:${bgX}px ${bgY}px; }
  .inset::after{ content:"ZOOM ${Z}\\00d7"; position:absolute; right:8px; bottom:7px;
          font-family:var(--mono); font-size:9px; letter-spacing:.12em; color:#fff;
          background:rgba(28,27,24,.82); padding:3px 7px; border-radius:5px; }

  .callout{ position:absolute; left:64px; bottom:34px; display:inline-flex; align-items:center; gap:14px;
            background:var(--ink); color:var(--paper); border-radius:12px; padding:14px 20px 14px 14px;
            box-shadow:0 20px 40px -20px rgba(28,27,24,.55); max-width:calc(100% - 220px); z-index:8; }
  .callout .n{ display:grid; place-items:center; width:30px; height:30px; flex:none; border-radius:8px;
               background:var(--accent); color:#fff; font-family:var(--mono); font-size:13px; font-weight:600; }
  .callout .t{ font-size:17px; letter-spacing:-.01em; line-height:1.3; }
  .tagline{ position:absolute; right:64px; bottom:44px; font-family:var(--mono); font-size:11px;
            letter-spacing:.12em; text-transform:uppercase; color:var(--muted); z-index:8; }
</style></head><body>
  <div class="stage"><div class="win">
    <div class="bar"><i></i><i></i><i></i><b>${host}</b></div>
    <div class="shot">
      <img src="${dataUri}" />
      <div class="ring"></div>
      <div class="pin">${String(n).padStart(2, '0')}</div>
      ${showInset ? '<div class="inset"></div>' : ''}
    </div>
  </div></div>
  <div class="callout"><span class="n">${String(n).padStart(2, '0')}</span><span class="t">${label}</span></div>
  <div class="tagline">qdn.vn</div>
</body></html>`;
};

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const builds = (await import('node:fs')).readdirSync(resolve(homedir(), 'Library/Caches/ms-playwright'))
  .filter((d) => d.startsWith('chromium-')).sort();
const executablePath = resolve(homedir(), 'Library/Caches/ms-playwright', builds.at(-1),
  'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');

// On --force, bin the existing frames for the slugs in scope: if an anchor is not
// found we must ship no image rather than yesterday's wrong one.
if (force) {
  for (const [slug, steps] of Object.entries(TARGETS)) {
    if (only.length && !only.includes(slug)) continue;
    for (const t of steps) {
      const f = resolve(outDir, `${slug}-${t.step}.webp`);
      if (existsSync(f)) rmSync(f);
    }
  }
}

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

      // Locate the element that proves the claim. Try the CSS selector, then every
      // text candidate case-insensitively, then a DOM sweep for the smallest
      // rendered node containing the phrase. No anchor → no frame, ever.
      let el = null;
      if (target.find) {
        const cand = page.locator(target.find).first();
        if (await cand.isVisible().catch(() => false)) el = cand;
      }
      const phrases = target.text ? (Array.isArray(target.text) ? target.text : [target.text]) : [];
      for (const phrase of phrases) {
        if (el) break;
        const rx = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const cand = page.getByText(rx).first();
        if (await cand.isVisible().catch(() => false)) { el = cand; break; }
      }
      for (const phrase of phrases) {
        if (el) break;
        const handle = await page.evaluateHandle((needle) => {
          const want = needle.toLowerCase();
          let best = null;
          for (const node of document.querySelectorAll('body *')) {
            const t = (node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
            if (!t.includes(want)) continue;
            const r = node.getBoundingClientRect();
            if (r.width < 12 || r.height < 10) continue;
            if (!best || (r.width * r.height) < best.area) best = { node, area: r.width * r.height };
          }
          if (best) best.node.scrollIntoView({ block: 'center' });
          return best ? best.node : null;
        }, phrase);
        const asEl = handle.asElement();
        if (asEl) { el = asEl; await page.waitForTimeout(700); break; }
      }
      if (!el) { console.log(`· ${name} — anchor not found, skipped`); await page.close(); continue; }

      await el.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(900);

      // Clip a full-width band around the element, and remember where the element
      // sits inside that band so the slide can spotlight and magnify it.
      const vp = page.viewportSize();
      const box = await el.boundingBox();
      if (!box || box.width < 8 || box.height < 8) { console.log(`· ${name} — element has no box, skipped`); await page.close(); continue; }
      const band = Math.min(Math.max(target.band ?? 460, 360), vp.height);
      let top = Math.round(box.y + box.height / 2 - band / 2);
      top = Math.max(0, Math.min(top, vp.height - band));

      const raw = resolve(outDir, `${name}.raw.png`);
      await page.screenshot({ path: raw, clip: { x: 0, y: top, width: vp.width, height: band } });
      const shot = { w: vp.width, h: band };
      const relBox = { x: box.x, y: box.y - top, w: box.width, h: box.height };

      // Compose the slide and render it.
      const b64 = (await import('node:fs')).readFileSync(raw).toString('base64');
      const html = slide(`data:image/png;base64,${b64}`, base.replace(/^https?:\/\//, ''), target.step, target.label, shot, relBox);
      const tmpHtml = resolve(outDir, `${name}.html`);
      writeFileSync(tmpHtml, html, 'utf8');

      const sp = await studio.newPage();
      await sp.goto(`file://${tmpHtml}`, { waitUntil: 'load' });
      await sp.waitForTimeout(400);
      // Size the canvas to the slide so there is no dead paper under it.
      const slideH = await sp.evaluate(() => Math.ceil(document.querySelector('.stage').getBoundingClientRect().height) + 8);
      await sp.setViewportSize({ width: 1440, height: Math.max(slideH, 360) });
      await sp.waitForTimeout(350);
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
