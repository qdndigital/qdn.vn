import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D4avlH1o.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_O6Ax632p.mjs';
export { renderers } from '../renderers.mjs';

const $$Journal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Journal \u2014 QDN", "description": "Notes from QDN on AI, speed, craft and shipping software." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="phero"><div class="wrap"><div class="crumb"><a href="/">~</a> / journal</div><h1>The <span class="it">journal</span></h1><p>Notes from the studio on AI, speed, craft and shipping software in a new era.</p></div></section> <section class="sec"><div class="wrap"><div class="posts"><article class="post rv"><div class="meta"><span class="cat"># Process</span><span>Jun 2026</span></div><h3>From idea to a clickable mockup in a day</h3><p>Our compressed path from a brief to a finished, shippable interface.</p><span class="more">read --more &#8594;</span></article><article class="post rv"><div class="meta"><span class="cat"># AI</span><span>May 2026</span></div><h3>How we use AI without losing quality</h3><p>Speed where it helps, human judgment where it matters.</p><span class="more">read --more &#8594;</span></article><article class="post rv"><div class="meta"><span class="cat"># Speed</span><span>May 2026</span></div><h3>Why we deploy on day one</h3><p>Getting a product in front of real users as early as possible.</p><span class="more">read --more &#8594;</span></article><article class="post rv"><div class="meta"><span class="cat"># Engineering</span><span>Apr 2026</span></div><h3>Architecture choices that age well</h3><p>The early decisions that make scaling painless — or painful.</p><span class="more">read --more &#8594;</span></article><article class="post rv"><div class="meta"><span class="cat"># Product</span><span>Mar 2026</span></div><h3>Validate before you build the whole thing</h3><p>Test the idea fast, then invest in what works.</p><span class="more">read --more &#8594;</span></article><article class="post rv"><div class="meta"><span class="cat"># Craft</span><span>Feb 2026</span></div><h3>The last 10% is still the work</h3><p>Why finishing by hand matters more in an AI world.</p><span class="more">read --more &#8594;</span></article></div></div></section> <section class="sec"><div class="wrap"><div class="cta rv"><div class="spec-lab"><span class="b">→</span> make your move</div><h2>Have a project in mind?</h2><p>We are always happy to talk through ideas.</p><div class="flex gap-3 justify-center flex-wrap"><a href="/contact" class="btn btn-paper">Commission work <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a><a href="/services" class="btn btn-ghost">See how we work</a></div></div></div></section> ` })}`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/journal.astro", void 0);

const $$file = "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/journal.astro";
const $$url = "/journal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Journal,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
