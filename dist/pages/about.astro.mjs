import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D4avlH1o.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_O6Ax632p.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "About \u2014 QDN", "description": "QDN is a senior product & AI studio from Vietnam, built for the new era." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="phero"><div class="wrap"><div class="crumb"><a href="/">~</a> / studio</div><h1>Who is <span class="it">QDN</span></h1><p>A product &amp; AI studio in Vietnam. We build premium apps and SaaS for clients — and our own products — using AI to deliver faster, without dropping quality.</p></div></section> <section class="sec"><div class="wrap"><div class="shead rv"><div class="spec-lab"><span class="b">—</span> what we believe</div><h2 class="max-w-md">Premium quality, delivered <span class="it">early</span>.</h2><p>We use AI across research, design, code and QA — so timelines shrink and your product reaches users sooner. Then we finish by hand, to a premium standard. That is how we earn trust: quality you can see, shipped on time.</p></div><div class="princ"><div class="pr rv"><div class="num">01</div><h4>Speed</h4><p>AI compresses the timeline — a mockup in a day, MVP in weeks.</p></div><div class="pr rv"><div class="num">02</div><h4>Quality</h4><p>We finish by hand, to a premium standard. No shortcuts on the last 10%.</p></div><div class="pr rv"><div class="num">03</div><h4>Systems</h4><p>Consistent foundations and a design standard, so quality scales.</p></div><div class="pr rv"><div class="num">04</div><h4>Care</h4><p>Built by a small senior team that signs its work.</p></div></div></div></section> <section class="sec pt-0"><div class="wrap"><div class="shead rv"><div class="spec-lab"><span class="b">—</span> the team</div><h2>The hands behind the <span class="it">work</span></h2><p>Swap these placeholders with your real team.</p></div><div class="team"><div class="tm rv"><div class="av">QD</div><h4>Team Member</h4><span>Founder · Eng</span></div><div class="tm rv"><div class="av">PD</div><h4>Team Member</h4><span>Design</span></div><div class="tm rv"><div class="av">FE</div><h4>Team Member</h4><span>Full-Stack</span></div><div class="tm rv"><div class="av">AI</div><h4>Team Member</h4><span>AI Engineer</span></div></div></div></section> <section class="sec pt-0"><div class="wrap"><div class="shead rv"><div class="spec-lab"><span class="b">—</span> fields</div><h2>Where we <span class="it">work</span></h2></div><div class="ind"><span>Education</span><span>Real Estate</span><span>E-Commerce</span><span>Healthcare</span><span>Hospitality</span><span>Logistics</span><span>Professional Services</span></div></div></section> <section class="sec"><div class="wrap"><div class="cta rv"><div class="spec-lab"><span class="b">→</span> make your move</div><h2>Build with the <span class="it">studio</span>.</h2><p>We would love to hear what you are working on.</p><div class="flex gap-3 justify-center flex-wrap"><a href="/contact" class="btn btn-paper">Commission work <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a><a href="/services" class="btn btn-ghost">See how we work</a></div></div></div></section> ` })}`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/about.astro", void 0);

const $$file = "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$About,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
