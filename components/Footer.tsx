import Link from '@/components/WebsiteLink';
import Image from 'next/image';
import { Logo } from './Icons';
import { getWebsite } from '@/lib/website';
import { settingsCopy } from '@/lib/website-shared';
export default async function Footer() {
  const site=await getWebsite(), copy=settingsCopy(site);
  return <footer className="site-footer" id="contact"><div className="wrap">
    <div><Link href="/" className="brand" style={{marginBottom:12}}>{copy('logo')?<Image src={copy('logo')} alt={copy('brand')} width={160} height={48} style={{objectFit:'contain'}}/>:<><Logo size={32}/><span>{copy('brand')}<small>{copy('brandSubtitle')}</small></span></>}</Link><p style={{maxWidth:'34ch',fontSize:'0.92rem'}}>{copy('footerDescription')}</p>{copy('email')&&<p><a href={`mailto:${copy('email')}`}>{copy('email')}</a></p>}{copy('phone')&&<p>{copy('phone')}</p>}{copy('address')&&<p>{copy('address')}</p>}</div>
    {['company','resources','legal'].map(group=><div key={group}><h3>{copy(group+'Label')}</h3><ul>{site.menus.filter(m=>m.location==='footer_'+group).map(m=><li key={m.id}><Link href={m.href}>{m.label}</Link></li>)}</ul></div>)}
  </div><div className="footer-base"><div className="wrap"><span>© {new Date().getFullYear()} {copy('copyright')}</span>{process.env.DMRK_PUBLIC_SITE!=='true'&&<span>Local review build.</span>}</div></div></footer>;
}
