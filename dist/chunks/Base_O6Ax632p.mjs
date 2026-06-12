import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate, r as renderComponent, e as renderSlot, f as renderHead, u as unescapeHTML } from './astro/server_D4avlH1o.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro$1 = createAstro("https://qdn.vn");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const path = Astro2.url.pathname.replace(/\/+$/, "") || "/";
  const items = [
    ["/", "home"],
    ["/services", "services"],
    ["/products", "products"],
    ["/work", "work"],
    ["/about", "studio"],
    ["/journal", "journal"],
    ["/contact", "contact"]
  ];
  return renderTemplate`${maybeRenderHead()}<header class="site"> <div class="wrap nav"> <a href="/" class="logo"> <svg class="logomark" viewBox="0 0 32 32" aria-hidden="true"><rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="none" stroke="#1c1b18" stroke-width="2"></rect><rect x="11" y="11" width="10" height="10" rx="2.5" fill="#e2622a"></rect></svg> <span>QDN</span> </a> <nav class="nav-links"> ${items.map(([href, label]) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(path === href ? "active" : "", "class")}>${label}</a>`)} </nav> <div class="nav-cta"> <a href="/contact" class="btn btn-line hidden lg:inline-flex">Sign in</a> <a href="/contact" class="btn btn-ink">Commission work</a> <button class="menu-btn" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button> </div> </div> </header>`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="site"> <div class="wrap"> <div class="foot"> <div> <a href="/" class="logo"> <svg class="logomark" viewBox="0 0 32 32" aria-hidden="true"><rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="none" stroke="#1c1b18" stroke-width="2"></rect><rect x="11" y="11" width="10" height="10" rx="2.5" fill="#e2622a"></rect></svg> <span>QDN</span> </a> <p class="fd">A product &amp; AI studio — premium apps and SaaS, mocked up in a day and shipped fast. qdn.vn · Vietnam.</p> </div> <div><h5>build</h5><a href="/services">web &amp; saas</a><a href="/services">mobile</a><a href="/services">ai</a><a href="/services">e-commerce</a></div> <div><h5>products</h5><a href="/products">qone</a><a href="/products">sat-ai</a><a href="/products">propmanage</a></div> <div><h5>studio</h5><a href="/about">about</a><a href="/journal">journal</a><a href="/contact">commission</a></div> </div> <div class="fbar"><span>© 2026 QDN · qdn.vn</span><span>Mockup in a day · shipped fast</span></div> </div> </footer>`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://qdn.vn");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title, description, noindex = false } = Astro2.props;
  const canonical = new URL(Astro2.url.pathname, Astro2.site).href;
  const ogImage = new URL("/assets/og.png", Astro2.site).href;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://qdn.vn/#org",
        name: "QDN",
        url: "https://qdn.vn/",
        email: "quang.dinh@scentiment.com",
        description: "A product & AI studio building premium web, mobile and SaaS products. We use AI to turn an idea into a clickable mockup fast, then ship to market quickly.",
        logo: "https://qdn.vn/favicon.svg",
        areaServed: "Worldwide",
        knowsAbout: ["Web development", "Mobile apps", "AI solutions", "SaaS", "Automation", "E-commerce"]
      },
      {
        "@type": "WebSite",
        "@id": "https://qdn.vn/#website",
        url: "https://qdn.vn/",
        name: "QDN",
        publisher: { "@id": "https://qdn.vn/#org" }
      }
    ]
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><title>', '</title><meta name="description"', ">", '<link rel="canonical"', '><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#e9e7e2"><meta property="og:type" content="website"><meta property="og:site_name" content="QDN"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:image"', '><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><link rel="sitemap" href="/sitemap-index.xml"><script type="application/ld+json">', "<\/script>", "</head> <body> ", " ", " ", ' <script src="/assets/app.js"><\/script> </body> </html>'])), title, addAttribute(description, "content"), noindex && renderTemplate`<meta name="robots" content="noindex,follow">`, addAttribute(canonical, "href"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonical, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), unescapeHTML(JSON.stringify(jsonld)), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/layouts/Base.astro", void 0);

export { $$Base as $ };
