import { ui, type Lang } from './ui';

export const defaultLang: Lang = 'en';
export const locales: Lang[] = ['en', 'vi'];
export type { Lang };

/** Detect locale from the URL: anything under /vi is Vietnamese, else English. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'vi' ? 'vi' : 'en';
}

/** The translation dictionary for a locale. */
export function useTranslations(lang: Lang) {
  return ui[lang];
}

/** A page path with its locale prefix stripped, always starting with '/'. */
export function stripLang(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/vi') return '/';
  if (clean.startsWith('/vi/')) return clean.slice(3);
  return clean;
}

/** Turn an unprefixed path ('/services') into a localized one ('/services' or '/vi/services'). */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '' ? '/' : path;
  if (lang === 'en') return clean;
  return clean === '/' ? '/vi' : '/vi' + clean;
}

/** Both localized variants of the current page — for hreflang + the language switcher. */
export function alternates(pathname: string) {
  const base = stripLang(pathname);
  return { base, en: localizePath(base, 'en'), vi: localizePath(base, 'vi') };
}
