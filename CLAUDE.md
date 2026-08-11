# Identity: qdn · WEBSITE (the agency site)

**This folder = `qdndigital/qdn.vn` @ `toan-rebranding` — QDN's own studio website (qdn.vn),
not a product site.**

- **What:** Astro 4 + Tailwind, bilingual EN/VI. Deployed on **Netlify** (`netlify.toml`,
  publish `dist`). Run: `npm install && npm run dev` → http://localhost:4321.
- **Content model:** almost all copy lives in **`src/i18n/ui.ts`** (one `en` object + one `vi`
  object). Pages in `src/pages/*.astro` (EN) and `src/pages/vi/*.astro` (VI) are thin wrappers
  around shared components in `src/components/pages/`. **Add a string to both `en` and `vi`.**
- **Brand:** `brand/brand-guide.html` + the Q-family marks (`brand/*.svg`). Styling tokens live
  in `src/styles/global.css`.
- **Source of truth for portfolio/work:** the qone task **`internal-32`** and its 15 subtasks
  (`internal-33` … `internal-47`) hold the real project history (brand, live URL, country, year,
  industry, platform, deliverables). Read them before editing the work archive.
- **Scope:** only edit this repo. Product repos live under `../../qsortby/`; never edit them
  from here. Workspace map → [`../../../CLAUDE.md`](../../../CLAUDE.md).
