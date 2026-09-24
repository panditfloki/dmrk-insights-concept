import { cache } from 'react';
import { notFound } from 'next/navigation';
import defaults from './cms-defaults.json';
import { pageCopy, type Website } from './website-shared';
export const getWebsite = cache(async (): Promise<Website> => {
  const base = process.env.DMRK_API_URL;
  if (!base) {
    if (process.env.DMRK_REQUIRE_API === 'true') throw new Error('Website API is required');
    return {version:1,menus:[],categories:[],pages:Object.entries(defaults).filter(([k])=>k!=='custom').map(([key,p],i)=>({id:i,key,title:p.title,path:p.path,template:p.template,content:Object.fromEntries(p.fields.map(f=>[f.key,f.default]))}))};
  }
  const response = await fetch(`${base.replace(/\/$/,'')}/website`, {
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(25000),
  });
  if(!response.ok) throw new Error(`Website API returned ${response.status}`);
  const data = await response.json();
  if(data.version!==1 || !Array.isArray(data.pages)||!Array.isArray(data.menus)||!Array.isArray(data.categories)) throw new Error('Invalid website configuration');
  return data;
});
export async function getWebsitePage(key: string) {
  const site = await getWebsite();
  const page = site.pages.find(p=>p.key===key);
  if(!page) notFound();
  return {site,page,copy:pageCopy(page)};
}
export async function pageMetadata(key: string) {
  const {page,copy}=await getWebsitePage(key);
  return {title:copy('seo_title',page.title),description:copy('seo_description'),openGraph:{title:copy('seo_title',page.title),description:copy('seo_description')}};
}
