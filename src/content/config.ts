import { defineCollection, z } from 'astro:content';

/**
 * The work archive — one entry per project per language, at
 * `src/content/work/<lang>/<slug>.md`. The body is the short "challenge"
 * paragraph; everything structural lives in frontmatter so the archive rows,
 * the filter chips and the case pages can all read the same record.
 *
 * Source of truth for the facts: qone task `internal-32` and its subtasks
 * (`internal-33` … `internal-47`).
 */
const work = defineCollection({
  type: 'content',
  schema: z.object({
    rec: z.string(),                    // archive record id, e.g. 'QDN-01'
    order: z.number(),                  // sort position, newest first
    brand: z.string(),                  // display name
    client: z.string(),                 // legal / brand owner
    url: z.string().url().nullable(),   // live site, null for internal systems
    country: z.string(),
    year: z.string(),
    live: z.boolean(),                  // still running vs delivered
    statusLabel: z.string(),
    industry: z.string(),
    platform: z.enum(['shopify', 'wordpress', 'webapp', 'shopify-app']),
    platformLabel: z.string(),
    kind: z.string(),                   // project type
    role: z.string(),                   // what QDN actually did — build / migration / consulting
    summary: z.string(),                // one line for the archive row
    headline: z.string(),               // the case-study H1 — what actually happened
    challenge: z.string(),              // the tension, 2–3 sentences
    // How we did it. `img` is an optional Guide Studio frame (scripts/guide-studio.mjs)
    // showing the part of the shipped site that demonstrates the step.
    steps: z.array(z.object({ h: z.string(), p: z.string(), img: z.string().nullable().default(null) })),
    outcome: z.string(),                // what runs today
    lesson: z.string(),                 // the expertise takeaway
    deliverables: z.array(z.string()),
    shot: z.string().nullable(),        // /assets/work/<slug>.webp — the hero frame
    shotInner: z.string().nullable(),   // an inner page (collection / product / about)
    shotMobile: z.string().nullable(),  // the same storefront on a phone
    capInner: z.string().default(''),   // captions for the two secondary frames
    capMobile: z.string().default(''),
    featured: z.boolean().default(false),
    ownProduct: z.boolean().default(false),
  }),
});

export const collections = { work };
