import { notFound } from 'next/navigation';
import Link from '@/components/WebsiteLink';
import Image from 'next/image';
import { pageCopy } from '@/lib/website-shared';
import { getWebsite } from '@/lib/website';
import { getPublishedContent } from '@/lib/published-content';
import Card from '@/components/Card';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;const category=(await getWebsite()).categories.find(c=>c.slug===slug);
 return category?{title:category.seoTitle||category.name,description:category.seoDescription||category.description}:{};
}
export default async function CategoryPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{page?:string}>}) {
 const {slug}=await params;const site=await getWebsite(), category=site.categories.find(c=>c.slug===slug);if(!category)notFound();
 const children=site.categories.filter(c=>c.parentId===category.id);
 const slugs=[category.slug,...children.map(c=>c.slug)];
 const insights=(await getPublishedContent()).filter(i=>slugs.includes(i.categorySlug||''));
 const pages=site.pages.filter(p=>p.path&&slugs.includes(p.categorySlug||''));
 const items=[...insights.map(item=>({kind:'insight' as const,item})),...pages.map(item=>({kind:'page' as const,item}))];
 const requested=(await searchParams).page||'1';if(!/^[1-9][0-9]*$/.test(requested))notFound();
 const current=Number(requested),size=Math.max(1,Math.min(100,category.displayCount||12)),total=Math.max(1,Math.ceil(items.length/size));if(current>total)notFound();
 return <><section className="page-head"><div className="wrap"><nav className="crumbs"><Link href="/insights">Insights</Link><span>/</span><span>{category.name}</span></nav><h1>{category.name}</h1>{category.description&&<p className="lede">{category.description}</p>}{category.image&&<Image src={category.image} alt={category.name} width={1200} height={500} style={{objectFit:'cover',marginTop:24}}/>}</div></section><section className="section"><div className="wrap">
 {children.length>0&&<div className="filters">{children.map(c=><Link className="chip" href={`/categories/${c.slug}`} key={c.id}>{c.name}</Link>)}</div>}
 <div className="grid grid--3">{items.slice((current-1)*size,current*size).map(entry=>entry.kind==='insight'?<Card key={'insight-'+entry.item.id} item={entry.item}/>:<article className="card card--flat" key={'page-'+entry.item.id}><div className="card-body"><h3><Link className="stretched" href={entry.item.path!}>{entry.item.title}</Link></h3><p>{pageCopy(entry.item)('intro',pageCopy(entry.item)('blurb'))}</p></div></article>)}</div>{items.length===0&&<p>No published content in this category yet.</p>}
 {total>1&&<nav className="filters" aria-label="Content pages">{Array.from({length:total},(_,i)=><Link className="chip" aria-current={current===i+1?'page':undefined} key={i} href={`/categories/${slug}?page=${i+1}`}>{i+1}</Link>)}</nav>}
 </div></section></>;
}
