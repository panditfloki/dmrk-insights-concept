import { getPublishedContent } from '@/lib/published-content';
import { getWebsite } from '@/lib/website';
export const dynamic='force-dynamic';
export async function GET() {
 const [items,site]=await Promise.all([getPublishedContent(),getWebsite()]);
 const paths=[...site.pages.flatMap(p=>p.path?[p.path]:[]),...site.categories.map(c=>`/categories/${c.slug}`),...items.map(i=>`/insights/${i.slug}`)];
 const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(paths)].map(p=>`<url><loc>https://dmrkinsights.com${p.replaceAll('&','&amp;').replaceAll('<','&lt;')}</loc></url>`).join('')+'</urlset>';
 return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'no-store'}});
}
