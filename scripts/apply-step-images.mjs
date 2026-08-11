/**
 * Wire the Guide Studio frames into the case studies: reads /tmp/step-manifest.json
 * (written by guide-studio.mjs) and sets `img:` on the matching step in every
 * language's .md file. Idempotent — safe to re-run after re-rendering frames.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync('/tmp/step-manifest.json', 'utf8'));

let touched = 0;
for (const lang of ['en', 'vi']) {
  const dir = resolve(root, 'src/content/work', lang);
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    // Process EVERY case, not just ones in the manifest — otherwise a project
    // whose frames were withdrawn keeps a stale img: pointing at a deleted file.
    const steps = manifest[slug] ?? {};
    const path = resolve(dir, file);
    const lines = readFileSync(path, 'utf8').split('\n');

    // Walk the `steps:` block, tracking which step we're inside.
    let inSteps = false;
    let idx = 0;
    const out = [];
    for (const line of lines) {
      if (/^steps:/.test(line)) { inSteps = true; out.push(line); continue; }
      if (inSteps && /^[a-z]/.test(line)) inSteps = false;      // next top-level key
      if (inSteps && /^  - h: /.test(line)) idx++;
      if (inSteps && /^    img: /.test(line)) continue;          // drop stale entries
      out.push(line);
      if (inSteps && /^    p: /.test(line) && steps[idx]) {
        out.push(`    img: '${steps[idx]}'`);
      }
    }
    const next = out.join('\n');
    if (next !== lines.join('\n')) { writeFileSync(path, next, 'utf8'); touched++; }
  }
}
console.log(`updated ${touched} case files`);
