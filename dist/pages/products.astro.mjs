import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D4avlH1o.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_O6Ax632p.mjs';
export { renderers } from '../renderers.mjs';

const $$Products = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Products \u2014 QDN", "description": "QOne, SAT AI and PropManage \u2014 products built and run by QDN." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="phero"><div class="wrap"><div class="crumb"><a href="/">~</a> / products</div><h1>Our <span class="it">products</span></h1><p>Software we designed, built and run ourselves — proof we build premium SaaS, and how fast we can ship it.</p></div></section> <section class="sec"><div class="wrap"><div class="pd rv"><div class="pd-spec"><div class="id">QDN-001</div><h3>QOne</h3><div class="pt">Project · HR · Expense platform</div><p>One finished system for projects, teams, expenses and operations — built fast, built to last.</p></div><div class="pd-feat"><span class="f">Project &amp; task tracking</span><span class="f">Human resources</span><span class="f">Expense tracking</span><span class="f">Reporting</span></div></div><div class="pd rev rv"><div class="pd-feat"><span class="f">AI-generated questions</span><span class="f">Adaptive paths</span><span class="f">Practice tests</span><span class="f">Performance tracking</span></div><div class="pd-spec"><div class="id">QDN-002</div><h3>SAT AI</h3><div class="pt">AI-native learning platform</div><p>Personalised SAT prep generated and adapted by AI — a product only possible in this new era.</p></div></div><div class="pd rv"><div class="pd-spec"><div class="id">QDN-003</div><h3>PropManage</h3><div class="pt">Property management platform</div><p>Property operations and finance, end to end, in a single tidy system.</p></div><div class="pd-feat"><span class="f">Property &amp; tenants</span><span class="f">Financial tracking</span><span class="f">Maintenance flows</span><span class="f">Reporting</span></div></div></div></section> <section class="sec"><div class="wrap"><div class="cta rv"><div class="spec-lab"><span class="b">→</span> make your move</div><h2>Want a product like <span class="it">these</span>?</h2><p>We can build yours with the same hands — and the same speed.</p><div class="flex gap-3 justify-center flex-wrap"><a href="/contact" class="btn btn-paper">Commission work <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a><a href="/services" class="btn btn-ghost">See how we work</a></div></div></div></section> ` })}`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/products.astro", void 0);

const $$file = "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/products.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Products,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
