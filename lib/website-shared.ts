import type { Service } from './site';
export type CmsPage = { categorySlug?: string | null; id: number; key: string; title: string; path: string | null; template: string; content: Record<string, string | number | null> };
export type MenuItem = { id: number; parentId: number | null; location: string; label: string; description: string | null; href: string };
export type Category = { id: number; parentId: number | null; name: string; slug: string; description: string | null; image: string | null; allowedTypes: string[]; displayCount: number; seoTitle?: string; seoDescription?: string };
export type Website = { version: number; pages: CmsPage[]; menus: MenuItem[]; categories: Category[] };
export function pageCopy(page: CmsPage | undefined) {
  return (key: string, fallback = ''): string => page && Object.hasOwn(page.content, key) ? String(page.content[key] ?? '').trim() : fallback.trim();
}
export const settingsCopy = (site: Website) => pageCopy(site.pages.find(p => p.key === 'settings'));
export function pageCount(site: Website, key: string, fallback: number) {
  const value = Number(settingsCopy(site)(key, String(fallback)));
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : fallback;
}
export function siteServices(site: Website): Service[] {
  return site.pages.filter(p => p.template === 'service').map(p => {
    const c = pageCopy(p);
    return {slug: p.path!.split('/').pop()!, name: c('name',p.title),menuBlurb:c('menuBlurb'),h1:c('h1'),intro:c('intro'),sectionTitle:c('sectionTitle'),sectionIntro:c('sectionIntro'),capabilities:[0,1,2,3].map(i=>({title:c(`capabilities_${i}_title`),body:c(`capabilities_${i}_body`)})).filter(x=>x.title)};
  });
}
export const siteIndustries = (site: Website) => site.pages.filter(p=>p.template==='industry').map(p=>({name:pageCopy(p)('name',p.title),blurb:pageCopy(p)('blurb'),path:p.path!}));
export const siteMethod = (site: Website) => [0,1,2,3].map(i=>({step:settingsCopy(site)(`method_${i}_step`),body:settingsCopy(site)(`method_${i}_body`)}));
