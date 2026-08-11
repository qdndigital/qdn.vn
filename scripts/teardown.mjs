/**
 * QDN Teardown Studio — the case-study visuals.
 *
 * A teardown is a real screen, marked up hard enough that it becomes the
 * explanation. Annotation IS the diagram: numbered pins on the elements, callout
 * cards parked in a gutter and joined by elbow connectors, region brackets for a
 * whole zone, and flow arrows for a journey. Method borrowed from ~/qdn/tools/user-guide; tokens are QDN's.
 *
 * Playbook rules this obeys (annotate/CONTENT_PLAYBOOK.md):
 *  - show the DECISION, not the screen
 *  - highlight the exact element or the whole relevant card
 *  - one idea per callout, parked in open space, joined with a clean elbow
 *  - build up across several frames; one dense image is lazy
 *
 * Callout copy is always "problem → what we did", written for a non-technical
 * founder. Never describe the element; name the difficulty and the judgement.
 *
 *   node scripts/teardown.mjs online-carpets
 *   node scripts/teardown.mjs --force
 *
 * Output: public/assets/work/steps/<slug>-t<n>.webp
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
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
 * Each teardown: which page, which step of the case it illustrates, and the
 * anchors. `text`/`find` locate the element; `say` is the callout (problem → what
 * we did); `bracket` outlines the whole zone instead
 * of a tight ring.
 */
/**
 * Anchors are STRUCTURAL — a nav, a category grid, a filter panel, a pricing
 * table — because a ring around a block reads as a decision and a ring around a
 * stray phrase reads as a highlighter accident. Labels name delivered work.
 */
const NAV = 'header nav ul, nav ul, header nav, nav';
const GRID = '[class*="collection-list"], [class*="category"] ul, ul[class*="product"], [class*="grid"]';
const MAIN = 'main, [role="main"], #MainContent, .main-content';
const inMain = (sel) => MAIN.split(',').flatMap((m) =>
  sel.split(',').filter((x) => x.trim()).map((x) => `${m.trim()} ${x.trim()}`)).join(', ');
const FILTER = 'aside, [class*="facet"], [class*="filter"], form[class*="filter"]';

const TEARDOWNS = {
  'online-carpets': [
    { t: 1, step: 4, path: '/', title: 'A Magento store, re-implemented on Shopify',
      anchors: [
        { find: 'a[href*="/collections/accessories"]', up: 2, bracket: true, lab: 'A route in per range',
          sub: 'Carpets, vinyl, laminate, LVT, wood and underlay each get their own entry point' },
        { text: ['Lowest Price Guaranteed'], up: 2, bracket: true, lab: 'Content carried across',
          sub: 'Price promise, free samples and 40,000 reviews, kept in place' },
        { find: 'a[href^="tel:"]', lab: 'Support kept visible',
          sub: 'The sales line stays in the header on every page' },
      ] },
    { t: 3, step: 3, path: '/collections/grey-carpets', title: 'The catalogue that had to survive the move',
      anchors: [
        { find: FILTER, bracket: true, lab: 'Faceted browsing',
          sub: 'Filtering on the attributes that decide a flooring purchase' },
        { text: ['m²'], lab: 'Priced by area',
          sub: 'Flooring sells per square metre — the product data was reshaped, not copied' },
      ] },
  ],
  'herman-miller-uk': [
    { t: 1, step: 2, path: '/', title: 'A design institution, on Shopify', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Category structure rebuilt',
          sub: 'Seating, desks, lighting and accessories — shopping by problem, not alphabet' },
        { text: ['Popular Categories'], up: 1, bracket: true, lab: 'Brand identity held',
          sub: 'Storefront designed to Herman Miller\u2019s own published standards' },
      ] },
  ],
  'mai-anh-home': [
    { t: 1, step: 4, path: '/', title: '2,965 products, made navigable', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Navigation by room',
          sub: 'Bathroom, tiles, kitchen and appliances — the way a renovation is planned' },
        { find: inMain('[class*="collection"], img'), lab: 'Brand routes kept',
          sub: 'GROHE, American Standard and INAX get their own way in' },
      ] },
  ],
  'pottery-and-decor': [
    { t: 1, step: 3, path: '/collections/all', title: 'A wide craft catalogue, kept walkable',
      anchors: [
        { find: GRID, bracket: true, lab: '277 products structured',
          sub: 'Grouped by object — vessels, fountains, lanterns, furniture' },
        { text: ['277 products'], lab: 'Catalogue built from scratch',
          sub: 'Custom Shopify theme, accounts and content pages' },
      ] },
  ],
  'meaningful-mantras': [
    { t: 1, step: 2, path: '/', title: 'A catalogue with two axes', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Collections by size and range',
          sub: '4oz to 16oz across named collections — both routes lead somewhere' },
        { find: inMain('[class*="collection"], [class*="grid"]'), bracket: true, lab: 'Merchandised, not listed',
          sub: 'Popular collections surfaced on the storefront' },
      ] },
  ],
  'modest-resell': [
    { t: 1, step: 3, path: '/', title: 'Two-sided, from the idea up', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Two journeys, one shop',
          sub: 'Selling and buying separated in the navigation from the start' },
        { find: inMain('[class*="section"], img'), lab: 'The seller journey',
          sub: 'List it, share it, earn — the supply side designed as its own product' },
      ] },
  ],
  'lilac-and-creme': [
    { t: 1, step: 5, path: '/', title: 'Retail and corporate in one store', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Ranges and gifting together',
          sub: 'Cakes, babkas and minis beside the corporate gifting portal' },
        { find: inMain('[class*="collection"], img'), lab: 'Ranges built out',
          sub: 'Batch orders handled beside the retail range' },
      ] },
  ],
  'mads-digital-sat': [
    { t: 1, step: 2, path: '/', title: 'Restructured around the evidence', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Structure before styling',
          sub: 'Programmes, mentors, results and materials each given a clear place' },
        { find: inMain('section, [class*="section"]'), lab: 'Rebuilt on WordPress',
          sub: 'Custom theme plus a CMS the school runs itself' },
      ] },
  ],
  'alpine-initiatives': [
    { t: 1, step: 1, path: '/', title: 'The work does the fundraising', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'Programmes at the centre',
          sub: 'Content and navigation reorganised around the work itself' },
        { find: inMain('section, article'), lab: 'Programmes given the room',
          sub: 'Reachable on every page without shouting over the programmes' },
      ] },
  ],
  'fours-tower-danang': [
    { t: 1, step: 1, path: '/', title: 'One page, in the buyer\u2019s order', auto: true,
      anchors: [
        { find: '[class*="menu"] ul, ul[class*="menu"], header ul', bracket: true, lab: 'The question list, in order',
          sub: 'Overview, location, floor plans, amenities, developer' },
        { find: 'a[href^="tel:"]', lab: 'Lead capture always in reach',
          sub: 'Hotline and registration form never more than a scroll away' },
      ] },
  ],
  'drink-tavlin': [
    { t: 1, step: 4, path: '/', title: 'Built for the market it sells in', auto: true,
      click: ['localization-form button, .currency-selector, [aria-label*="currency" i]'],
      anchors: [
        { find: NAV, bracket: true, lab: 'A seasonal range, merchandised',
          sub: 'A new gin every season, treated as an event rather than a thin shelf' },
        { text: ['ILS'], up: 1, lab: 'Six currencies',
          sub: 'ILS for home, EUR, GBP, AUD, JPY and CAD for everyone else' },
      ] },
  ],
  'qone': [
    { t: 1, step: 3, path: '/', title: 'Software that makes the call', auto: true,
      anchors: [
        { find: NAV, bracket: true, lab: 'One system, many chapters',
          sub: 'Projects, people, time and money reading the same records' },
        { text: ['Ranked by money'], lab: 'Ranked, not displayed',
          sub: 'Risk and money first, so the system proposes and you correct it' },
      ] },
  ],
  'qsortby': [
    { t: 1, step: 5, path: '', title: 'Published, reviewed, maintained', auto: true,
      anchors: [
        { text: ['$29'], up: 1, bracket: true, lab: 'Live on the App Store',
          sub: 'Free tier plus paid plans, through Shopify review' },
        { text: ['Auto sort your collection'], lab: 'Sorting on real signals',
          sub: 'Behaviour, sales, CTR and top sellers, continuously' },
      ] },
  ],
};

const URLS = {
  'drink-tavlin': 'https://www.drinktavlin.com',
  'online-carpets': 'https://www.onlinecarpets.co.uk',
  'herman-miller-uk': 'https://ukstore.hermanmiller.com',
  'mai-anh-home': 'https://maianhhome.com',
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
const SITE_GATES = { 'drink-tavlin': ['a.js-confirm-enter'] };

/* ------------------------------------------------------------------ the slide */
const slide = (dataUri, host, title, shot, marks) => {
  const SHOT_W = 1080;                 // screenshot column
  const GUTTER = 470;                  // callout column
  const PAD = 56;
  const k = SHOT_W / shot.w;
  const shotH = shot.h * k;
  const W = PAD * 2 + SHOT_W + GUTTER;
  const H = Math.max(shotH + PAD * 2 + 96, 560);

  // Cards stack in the gutter, ordered by the vertical position of their element.
  const sorted = marks.map((m, i) => ({ ...m, n: i + 1, cy: (m.box.y + m.box.h / 2) * k }))
    .sort((a, b) => a.cy - b.cy);
  const CARD_H = 124, GAP = 20;
  let cursor = PAD;
  const cards = sorted.map((m) => {
    const top = Math.max(cursor, Math.min(m.cy + PAD - CARD_H / 2, H - PAD - CARD_H - 96));
    cursor = top + CARD_H + GAP;
    return { ...m, top };
  });

  const gx = PAD + SHOT_W;             // gutter left edge
  const shapes = cards.map((m) => {
    const b = { x: PAD + m.box.x * k, y: PAD + m.box.y * k, w: m.box.w * k, h: m.box.h * k };
    const pad = m.bracket ? 10 : 6;
    // Clamp to the captured frame — a ring that runs off the screenshot reads as a bug.
    const rx0 = Math.max(PAD + 3, b.x - pad);
    const ry0 = Math.max(PAD + 3, b.y - pad);
    const rx1 = Math.min(PAD + SHOT_W - 3, b.x + b.w + pad);
    const ry1 = Math.min(PAD + shotH - 3, b.y + b.h + pad);
    const ring = `<rect x="${rx0}" y="${ry0}" width="${Math.max(rx1 - rx0, 24)}" height="${Math.max(ry1 - ry0, 18)}"
        rx="${m.bracket ? 12 : 8}" fill="none" stroke="#e2622a" stroke-width="2.5"
        ${m.bracket ? 'stroke-dasharray="10 7"' : ''} />`;
    // elbow: out of the element's right edge, across, into the card
    const sx = rx1, sy = (ry0 + ry1) / 2;
    const ty = m.top + CARD_H / 2, tx = gx + 26;
    const midX = Math.max(Math.min(sx + 34, gx - 20), PAD + 12);
    const elbow = `<path d="M ${Math.min(sx, midX)} ${sy} H ${midX} V ${ty} H ${tx}" fill="none" stroke="#e2622a"
        stroke-width="2" stroke-linecap="round" opacity=".85" />
      <circle cx="${sx}" cy="${sy}" r="4.5" fill="#e2622a" />`;
    return ring + elbow;
  }).join('');

  const cardHtml = cards.map((m) => `
    <div class="card" style="top:${m.top}px">
      <span class="n">${String(m.n).padStart(2, '0')}</span>
      <div><h3>${m.lab}</h3><p>${m.sub}</p></div>
    </div>`).join('');

  const pins = cards.map((m) => {
    const bx = Math.max(PAD + 3, PAD + m.box.x * k);
    const by = Math.max(PAD + 3, PAD + m.box.y * k);
    // Park the pin in the margin left of the ring when there is room, else above it,
    // so it never lands on the evidence it is pointing at.
    const left = bx - PAD >= 44 ? bx - 42 : bx - 6;
    const top = by - PAD >= 40 ? by - 40 : by + 4;
    return { left: Math.max(6, left), top: Math.max(6, top), n: m.n };
  });
  const placed = [];
  const pinHtml = pins.map((p) => {
    // Nudge downward until this pin clears the ones already placed.
    while (placed.some((q) => Math.abs(q.left - p.left) < 40 && Math.abs(q.top - p.top) < 40)) p.top += 40;
    placed.push(p);
    return `<span class="pin" style="left:${p.left}px; top:${p.top}px">${String(p.n).padStart(2, '0')}</span>`;
  }).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  :root{ --paper:#e9e7e2; --surface:#f5f4f0; --ink:#1c1b18; --ink-2:#585550; --muted:#6b675e;
         --line:#d3cfc6; --accent:#e2622a; --mono:'JetBrains Mono','SF Mono',Menlo,ui-monospace,monospace; }
  *{ box-sizing:border-box; margin:0; }
  body{ width:${W}px; height:${H}px; background:var(--paper); position:relative; overflow:hidden;
        font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  body::before{ content:""; position:absolute; inset:0;
    background-image:linear-gradient(rgba(28,27,24,.045) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(28,27,24,.045) 1px,transparent 1px);
    background-size:34px 34px; }
  .win{ position:absolute; left:${PAD}px; top:${PAD}px; width:${SHOT_W}px; border-radius:12px;
        overflow:hidden; border:1px solid var(--line); background:var(--surface);
        box-shadow:0 1px 2px rgba(28,27,24,.04), 0 40px 80px -36px rgba(28,27,24,.4); }
  .win img{ display:block; width:100%; }
  svg.ov{ position:absolute; inset:0; width:${W}px; height:${H}px; z-index:4; pointer-events:none; }
  .pin{ position:absolute; z-index:6; width:34px; height:34px; border-radius:9px; background:var(--accent);
        color:#fff; display:grid; place-items:center; font-family:var(--mono); font-size:14px; font-weight:600;
        box-shadow:0 6px 16px rgba(28,27,24,.42); }
  .inset{ position:absolute; z-index:5; border-radius:10px; border:2px solid var(--ink); overflow:hidden;
          background-image:url("${dataUri}"); background-repeat:no-repeat;
          box-shadow:0 20px 40px -16px rgba(28,27,24,.55); }
  .card{ position:absolute; left:${gx + 26}px; width:${GUTTER - 40}px; height:${CARD_H}px; z-index:7;
         background:var(--ink); color:var(--paper); border-radius:12px; padding:16px 18px;
         display:flex; gap:13px; box-shadow:0 18px 36px -18px rgba(28,27,24,.5); }
  .card .n{ flex:none; width:28px; height:28px; border-radius:7px; background:var(--accent); color:#fff;
            display:grid; place-items:center; font-family:var(--mono); font-size:12px; font-weight:600; }
  .card h3{ font-size:21px; letter-spacing:-.022em; line-height:1.15; color:#fff; }
  .card p{ font-size:14.5px; line-height:1.4; margin-top:7px; color:rgba(233,231,226,.72); }
  .head{ position:absolute; left:${PAD}px; bottom:34px; z-index:8; }
  .head .lab{ font-family:var(--mono); font-size:11px; letter-spacing:.13em; text-transform:uppercase; color:var(--muted); }
  .head h2{ font-size:26px; letter-spacing:-.025em; margin-top:7px; color:var(--ink); }
  .host{ position:absolute; right:${PAD}px; bottom:40px; z-index:8; font-family:var(--mono);
         font-size:11px; letter-spacing:.1em; color:var(--muted); }
</style></head><body>
  <div class="win"><img src="${dataUri}" /></div>
  ${pinHtml}
  <svg class="ov">${shapes}</svg>
  ${cardHtml}
  <div class="head"><div class="lab">// teardown</div><h2>${title}</h2></div>
  <div class="host">${host} · qdn.vn</div>
</body></html>`;
};

/* ------------------------------------------------------------- locate helper */
/**
 * Discover the page's real structural blocks: visible, in-viewport, carrying
 * either several links or a heading plus text, big enough to read and small
 * enough to be a component rather than the page. Writing selectors from memory
 * is what kept producing rings on nothing; this asks the DOM instead.
 */
async function discoverBlocks(page, want) {
  return page.evaluate((want) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const out = [];
    for (const n of document.querySelectorAll('nav, header, section, ul, ol, form, aside, div')) {
      const r = n.getBoundingClientRect();
      if (r.top < -20 || r.top > vh * 0.55) continue;   // keep blocks close enough to share one frame
      if (r.width < vw * 0.25 || r.height < 46) continue;
      const area = r.width * r.height;
      if (area > vw * vh * 0.35 || area < vw * vh * 0.025) continue;
      const links = n.querySelectorAll('a').length;
      const text = (n.innerText || '').replace(/\s+/g, ' ').trim();
      if (text.length < 12) continue;
      if (links < 3 && !n.querySelector('h1,h2,h3')) continue;
      out.push({ x: r.x, y: r.y, width: r.width, height: r.height, area, links,
                 text: text.slice(0, 70), tag: n.tagName.toLowerCase() });
    }
    // Biggest first, then drop anything overlapping something already chosen.
    out.sort((a, b) => b.area - a.area);
    const picked = [];
    for (const c of out) {
      const clash = picked.some((q) => {
        const ox = Math.max(0, Math.min(q.x + q.width, c.x + c.width) - Math.max(q.x, c.x));
        const oy = Math.max(0, Math.min(q.y + q.height, c.y + c.height) - Math.max(q.y, c.y));
        return ox * oy > 0.25 * Math.min(q.area, c.area);
      });
      if (!clash) picked.push(c);
      if (picked.length >= want) break;
    }
    return picked;
  }, want);
}

async function locate(page, spec) {
  if (spec.find) {
    // .first() often resolves to a hidden mega-menu copy sitting at the top-left.
    // Take the largest match that is actually visible in the viewport, and apply
    // `up` here too — CSS anchors used to bypass it entirely.
    const h = await page.evaluateHandle(({ sel, up }) => {
      let best = null;
      for (const n of document.querySelectorAll(sel)) {
        const r = n.getBoundingClientRect();
        if (r.width < 12 || r.height < 8) continue;
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const area = r.width * r.height;
        if (!best || area > best.area) best = { node: n, area };
      }
      if (!best) return null;
      let n = best.node;
      for (let i = 0; i < (up || 0) && n.parentElement; i++) n = n.parentElement;
      const rect = n.getBoundingClientRect();
      if (rect.width * rect.height > window.innerWidth * window.innerHeight * 0.55) return null;
      window.__qdnRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      n.scrollIntoView({ block: 'center' });
      return n;
    }, { sel: spec.find, up: spec.up || 0 });
    const el = h.asElement();
    if (el) {
      await page.waitForTimeout(600);
      el.__qdnRect = await page.evaluate(() => window.__qdnRect ?? null);
      return el;
    }
  }
  // getByText resolves to the OUTERMOST match, which rings whole containers — so we
  // sweep the DOM for the smallest rendered node carrying the phrase, then climb
  // `up` levels when we want the surrounding zone instead of the element.
  const phrases = spec.text ? (Array.isArray(spec.text) ? spec.text : [spec.text]) : [];
  for (const phrase of phrases) {
    const h = await page.evaluateHandle(({ needle, up }) => {
      const want = needle.toLowerCase();
      let best = null;
      for (const node of document.querySelectorAll('body *')) {
        if (node.children.length > 6) continue;
        const t = (node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (!t.includes(want)) continue;
        const r = node.getBoundingClientRect();
        if (r.width < 14 || r.height < 10 || r.top > window.innerHeight) continue;
        const area = r.width * r.height;
        if (!best || area < best.area) best = { node, area };
      }
      if (!best) return null;
      let n = best.node;
      for (let i = 0; i < (up || 0) && n.parentElement; i++) n = n.parentElement;
      // An inline element that wraps returns a line-box rect covering empty space to
      // the right of its text — that is why rings kept landing on blank paragraph.
      // Use the densest client rect instead of the bounding box.
      const rects = [...n.getClientRects()].filter((r) => r.width > 12 && r.height > 8);
      window.__qdnRect = rects.length > 1
        ? rects.reduce((a, b) => (a.width * a.height >= b.width * b.height ? a : b))
        : (rects[0] || n.getBoundingClientRect());
      // Guard: never ring an element that renders no text, or one so large it is
      // really the whole page — both read as a mistake rather than a highlight.
      const rect = n.getBoundingClientRect();
      const vis = (n.innerText || '').trim();
      const area = rect.width * rect.height;
      if (!vis || area > window.innerWidth * window.innerHeight * 0.55) {
        n = best.node;
        const r2 = n.getBoundingClientRect();
        if (!(n.innerText || '').trim() || r2.width * r2.height > window.innerWidth * window.innerHeight * 0.55) return null;
      }
      n.scrollIntoView({ block: 'center' });
      return n;
    }, { needle: phrase, up: spec.up || 0 });
    const el = h.asElement();
    if (el) {
      await page.waitForTimeout(600);
      el.__qdnRect = await page.evaluate(() => {
        const r = window.__qdnRect; return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
      });
      return el;
    }
  }
  return null;
}

async function clearInterstitials(page, slug) {
  for (const sel of SITE_GATES[slug] ?? []) {
    await page.locator(sel).first().click({ timeout: 4000, force: true }).catch(() => {});
    await page.waitForTimeout(1400);
  }
  for (const label of [/accept all/i, /accept/i, /agree/i, /got it/i, /^close$/i, /no thanks/i]) {
    const el = page.locator('button, a, [role="button"], .btn').filter({ hasText: label }).first();
    if (await el.isVisible().catch(() => false)) { await el.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(600); }
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(400);
}

/* --------------------------------------------------------------------- run */
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const builds = (await import('node:fs')).readdirSync(resolve(homedir(), 'Library/Caches/ms-playwright'))
  .filter((d) => d.startsWith('chromium-')).sort();
const executablePath = resolve(homedir(), 'Library/Caches/ms-playwright', builds.at(-1),
  'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');

const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});
const web = await browser.newContext({
  viewport: { width: 1440, height: 1150 }, deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
});
const studio = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });

const manifest = {};
for (const [slug, sheets] of Object.entries(TEARDOWNS)) {
  if (only.length && !only.includes(slug)) continue;
  manifest[slug] = manifest[slug] ?? {};

  for (const sheet of sheets) {
    const name = `${slug}-t${sheet.t}`;
    const finalPath = resolve(outDir, `${name}.webp`);
    if (!force && existsSync(finalPath)) { manifest[slug][sheet.step] = `/assets/work/steps/${name}.webp`; continue; }

    const page = await web.newPage();
    try {
      await page.goto(URLS[slug] + sheet.path, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3400);
      await clearInterstitials(page, slug);

      // Some evidence only exists after interaction — a currency menu, an
      // accordion, a mega-nav. Open it before we look for the anchors.
      for (const c of sheet.click ?? []) {
        const t = c.startsWith('.') || c.startsWith('#') || c.startsWith('[') || c.includes('(')
          ? page.locator(c).first()
          : page.getByText(new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).first();
        await t.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1200);
      }

      // Resolve every anchor first; the frame must cover all of them.
      const found = [];
      if (sheet.auto) {
        const blocks = await discoverBlocks(page, sheet.anchors.length);
        blocks.forEach((b, i) => {
          const a = sheet.anchors[i];
          if (a) found.push({ ...a, box: { x: b.x, y: b.y, width: b.width, height: b.height } });
        });
        if (blocks.length) console.log(`  ${name}: discovered ${blocks.map((b) => `${b.tag}(${b.links} links)`).join(', ')}`);
      }
      if (!sheet.auto) for (const a of sheet.anchors) {
        const el = await locate(page, a);
        if (!el) { console.log(`  · ${name}: anchor not found — ${JSON.stringify(a.text ?? a.find)}`); continue; }
        const box = el.__qdnRect ?? (await el.boundingBox());
        if (box && box.width > 10 && box.height > 8) found.push({ ...a, box });
      }
      if (found.length < 2) { console.log(`✗ ${name} — only ${found.length} anchor(s), skipped`); await page.close(); continue; }

      // Pre-flight. Every one of these was a defect shipped in an earlier pass, so
      // each is now an assertion rather than something to notice later.
      const vpNow = page.viewportSize();
      const problems = [];
      for (const f of found) {
        const a = f.box.width * f.box.height;
        const frameA = vpNow.width * vpNow.height;
        if (a / frameA > 0.42) problems.push(`${f.lab}: ring covers ${Math.round(a / frameA * 100)}% of the frame`);
        if (a / frameA < 0.0006) problems.push(`${f.lab}: ring is too small to read`);
        if (f.box.x < -2 || f.box.x + f.box.width > vpNow.width + 2) problems.push(`${f.lab}: ring runs off the frame horizontally`);
      }
      for (let i = 0; i < found.length; i++) {
        for (let j = i + 1; j < found.length; j++) {
          const A = found[i].box, B = found[j].box;
          const ox = Math.max(0, Math.min(A.x + A.width, B.x + B.width) - Math.max(A.x, B.x));
          const oy = Math.max(0, Math.min(A.y + A.height, B.y + B.height) - Math.max(A.y, B.y));
          const inter = ox * oy;
          if (inter > 0.5 * Math.min(A.width * A.height, B.width * B.height)) {
            problems.push(`${found[i].lab} and ${found[j].lab} ring the same thing`);
          }
        }
      }
      if (problems.length) {
        console.log(`✗ ${name} — FAILED PRE-FLIGHT:`);
        problems.forEach((x) => console.log(`    · ${x}`));
        await page.close(); continue;
      }

      // Clip a band that contains every anchor, with breathing room.
      const vp = page.viewportSize();
      const MIN_BAND = 620;   // below this a frame reads as a random crop of a photo
      const minY = Math.max(0, Math.min(...found.map((f) => f.box.y)) - 40);
      const maxY = Math.min(vp.height, Math.max(...found.map((f) => f.box.y + f.box.height)) + 40);
      // If the evidence sits near the top, start at the page top so the header and
      // nav give the frame its identity instead of a floating slice of hero imagery.
      let top = minY < 260 ? 0 : Math.max(0, Math.min(minY, vp.height - MIN_BAND));
      let height = Math.max(MIN_BAND, maxY - top);
      if (top + height > vp.height) { height = vp.height - top; }
      if (height < MIN_BAND) { top = Math.max(0, vp.height - MIN_BAND); height = Math.min(MIN_BAND, vp.height); }
      // Drop any anchor the band cannot fully contain — a half-cropped ring reads as a bug.
      const fits = found.filter((f) => f.box.y >= top - 2 && f.box.y + f.box.height <= top + height + 2);
      if (fits.length < 2) { console.log(`✗ ${name} — anchors do not share a frame, skipped`); await page.close(); continue; }
      found.length = 0; found.push(...fits);

      const raw = resolve(outDir, `${name}.raw.png`);
      await page.screenshot({ path: raw, clip: { x: 0, y: top, width: vp.width, height } });
      const shot = { w: vp.width, h: height };
      const marks = found.map((f) => ({ ...f, box: { x: f.box.x, y: f.box.y - top, w: f.box.width, h: f.box.height } }));

      const b64 = readFileSync(raw).toString('base64');
      const html = slide(`data:image/png;base64,${b64}`, URLS[slug].replace(/^https?:\/\//, ''), sheet.title, shot, marks);
      const tmpHtml = resolve(outDir, `${name}.html`);
      writeFileSync(tmpHtml, html, 'utf8');

      const sp = await studio.newPage();
      await sp.goto(`file://${tmpHtml}`, { waitUntil: 'load' });
      await sp.waitForTimeout(400);
      const dims = await sp.evaluate(() => ({ w: document.body.offsetWidth, h: document.body.offsetHeight }));
      await sp.setViewportSize({ width: dims.w, height: dims.h });
      await sp.waitForTimeout(300);
      const composed = resolve(outDir, `${name}.png`);
      await sp.screenshot({ path: composed });
      await sp.close();

      await sharp(composed).resize({ width: 1600 }).webp({ quality: 78 }).toFile(finalPath);
      rmSync(raw); rmSync(composed); rmSync(tmpHtml);
      manifest[slug][sheet.step] = `/assets/work/steps/${name}.webp`;
      console.log(`✓ ${name} — ${marks.length} callouts`);
    } catch (err) {
      console.log(`✗ ${name} — ${err.message.split('\n')[0]}`);
    } finally {
      await page.close();
    }
  }
}

writeFileSync('/tmp/teardown-manifest.json', JSON.stringify(manifest, null, 1), 'utf8');
console.log('manifest → /tmp/teardown-manifest.json');
await browser.close();
