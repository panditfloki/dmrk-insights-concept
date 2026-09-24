import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from '@/components/WebsiteLink';
import { getWebsite } from '@/lib/website';
import { getPublishedContent } from '@/lib/published-content';
import { pageCopy } from '@/lib/website-shared';
import Card from '@/components/Card';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}) {
 const path='/'+(await params).path.join('/');const p=(await getWebsite()).pages.find(p=>p.path===path);if(!p)return{};const c=pageCopy(p);
 return {title:c('seo_title',p.title),description:c('seo_description',c('intro',c('blurb')))};
}
export default async function InformationPage({params}:{params:Promise<{path:string[]}>}) {
 const path='/'+(await params).path.join('/');const site=await getWebsite(); const p=site.pages.find(p=>p.path===path);if(!p||!['page','industry'].includes(p.template))notFound();const c=pageCopy(p);
 const items=p.template==='industry'?(await getPublishedContent()).filter(i=>i.industry===c('name',p.title)):[];
 return <><section className="page-head"><div className="wrap">{c('eyebrow')&&<p className="eyebrow">{c('eyebrow')}</p>}<h1>{c('heading',c('name',p.title))}</h1><p className="lede">{c('intro',c('blurb'))}</p></div></section><section className="section"><div className="wrap">
 {c('image')&&<Image src={c('image')} alt={p.title} width={1200} height={500} style={{objectFit:'cover',marginBottom:32}}/>}
 {site.pages.some(child=>child.path?.startsWith(path+"/"))&&<div className="grid grid--3">{site.pages.filter(child=>child.path?.startsWith(path+"/")).map(child=><Link className="tile" key={child.id} href={child.path!}>{child.title}</Link>)}</div>}
 <div className="article-body">{c('body').split(/\n\n+/).filter(Boolean).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>
 {p.template==='industry'&&<><div className="grid grid--3">{items.map(item=><Card item={item} key={item.id}/>)}</div>{items.length===0&&<Link className="button" href="/contact">Discuss research in this sector</Link>}</>}
 </div></section></>;
}
