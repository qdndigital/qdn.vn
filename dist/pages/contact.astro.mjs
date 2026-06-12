import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D4avlH1o.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_O6Ax632p.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Contact \u2014 QDN", "description": "Commission QDN to design and build your software product." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="phero"><div class="wrap"><div class="crumb"><a href="/">~</a> / contact</div><h1>Make your <span class="it">move</span></h1><p>Tell us what you are building — we will get you a mockup fast, and a premium product to market, early.</p></div></section> <section class="sec"><div class="wrap"><div class="contact-grid"><div class="cinfo rv"><div class="r"><div class="k">Email</div><div class="v"><a href="mailto:quang.dinh@scentiment.com">quang.dinh@scentiment.com</a></div></div><div class="r"><div class="k">Studio</div><div class="v">qdn.vn — Vietnam</div></div><div class="r"><div class="k">Response</div><div class="v">Within one business day</div></div><div class="r"><div class="k">Disciplines</div><div class="v font-mono text-sm">web · mobile · ai · automation</div></div></div><form name="brief" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you" class="cform rv"><input type="hidden" name="form-name" value="brief"><p class="hidden"><label>Leave this empty: <input name="bot-field"></label></p><div class="fr"><label>Your name</label><input type="text" name="name" placeholder="Jane Doe" required></div><div class="fr"><label>Email</label><input type="email" name="email" placeholder="jane@company.com" required></div><div class="fr"><label>Discipline</label><select name="discipline"><option>Web &amp; SaaS</option><option>Mobile</option><option>AI Solutions</option><option>E-Commerce</option><option>Automation</option><option>Product Strategy</option></select></div><div class="fr"><label>Tell us about the work</label><textarea name="message" placeholder="What are you building, and what should it become?"></textarea></div><button type="submit" class="btn btn-ink w-full justify-center">Send the brief <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button><p class="note">Goes straight to our inbox via Netlify — we reply within one business day.</p></form></div></div></section> ` })}`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/contact.astro", void 0);

const $$file = "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Contact,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
