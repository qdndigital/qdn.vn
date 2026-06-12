import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D4avlH1o.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_O6Ax632p.mjs';
export { renderers } from '../renderers.mjs';

const $$ThankYou = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Thank you \u2014 QDN", "description": "Your brief has been sent to QDN.", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="sec"><div class="wrap"><div class="cta rv"><div class="spec-lab"><span class="b">&#10003;</span> brief received</div><h2>Thanks — your brief is <span class="it">in</span>.</h2><p>We read every message and reply within one business day. Talk soon.</p><div class="flex gap-3 justify-center flex-wrap"><a href="/" class="btn btn-paper">Back to home <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a><a href="/work" class="btn btn-ghost">See our work</a></div></div></div></section> ` })}`;
}, "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/thank-you.astro", void 0);

const $$file = "/sessions/beautiful-determined-gates/mnt/QDN/QDN_Astro/src/pages/thank-you.astro";
const $$url = "/thank-you";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$ThankYou,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
