import type { CollectionEntry } from 'astro:content';
import type { Lang } from './ui';

/** The bare slug of a work entry ('en/online-carpets' → 'online-carpets'). */
export const workSlug = (entry: CollectionEntry<'work'>) => entry.slug.replace(/^[a-z]{2}\//, '');

/** Work entries for one language, newest record first. */
export function workEntries(all: CollectionEntry<'work'>[], lang: Lang) {
  return all.filter((e) => e.id.startsWith(`${lang}/`)).sort((a, b) => a.data.order - b.data.order);
}

/**
 * getStaticPaths for a locale's case pages — each record carries its neighbours
 * so the page can offer prev/next without re-reading the collection.
 */
export function workPaths(all: CollectionEntry<'work'>[], lang: Lang) {
  const entries = workEntries(all, lang);
  const stub = (i: number) =>
    entries[i] ? { slug: workSlug(entries[i]), brand: entries[i].data.brand } : null;
  return entries.map((entry, i) => ({
    params: { slug: workSlug(entry) },
    props: { entry, prev: stub(i - 1), next: stub(i + 1) },
  }));
}
