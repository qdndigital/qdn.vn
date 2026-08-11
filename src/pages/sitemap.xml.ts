import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { workEntries, workSlug } from '../i18n/work';

/**
 * The sitemap is generated rather than hand-kept: every page ships an EN and a VI
 * URL that cross-reference each other with hreflang, and the work archive adds a
 * pair per record. /journal is deliberately absent — it is noindexed until it has
 * real posts.
 */
const SITE = 'https://qdn.vn';

const pages: [string, string][] = [
  ['/', '1.0'],
  ['/services', '0.9'],
  ['/shopify', '0.9'],
  ['/products', '0.9'],
  ['/work', '0.8'],
  ['/about', '0.7'],
  ['/contact', '0.8'],
];

const enUrl = (p: string) => `${SITE}${p === '/' ? '/' : p}`;
const viUrl = (p: string) => `${SITE}${p === '/' ? '/vi' : `/vi${p}`}`;

function entry(path: string, priority: string, lastmod: string) {
  const alt =
    `<xhtml:link rel="alternate" hreflang="en" href="${enUrl(path)}"/>` +
    `<xhtml:link rel="alternate" hreflang="vi" href="${viUrl(path)}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${enUrl(path)}"/>`;
  return [enUrl(path), viUrl(path)]
    .map((loc) => `  <url><loc>${loc}</loc>${alt}<lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`)
    .join('\n');
}

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const cases = workEntries(await getCollection('work'), 'en').map((e) =>
    entry(`/work/${workSlug(e)}`, '0.7', lastmod),
  );
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pages.map(([p, prio]) => entry(p, prio, lastmod)),
    ...cases,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
