"use client";
import ReaderAccountLink from "./ReaderAccountLink";
import Link from '@/components/WebsiteLink';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Arrow, Logo } from './Icons';
import { useMegaMenu, Caret } from './MegaMenu';
import { useWebsite } from './WebsiteProvider';
import { settingsCopy } from '@/lib/website-shared';

export default function Nav() {
  const site=useWebsite(), copy=settingsCopy(site);
  const menu=site.menus.filter(m=>m.location==='header');
  const roots=menu.filter(m=>m.parentId===null);
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const panelNames=useMemo(()=>site.menus.filter(m=>m.location==='header'&&m.parentId===null).map(m=>String(m.id)),[site.menus]);
  const mega=useMegaMenu(panelNames);
  useEffect(()=>{setOpen(false);mega.close();},[pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return ()=>{document.body.style.overflow='';};},[open]);
  const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href.split('?')[0]);
  const brand=<><Logo /><span>{copy('brand')}<small>{copy('brandSubtitle')}</small></span></>;
  return <>
    <div className="topbar"><div className="wrap"><span className="topbar-note">{copy('topbar')}</span><Link href="/contact">{copy('requestLabel')} <Arrow /></Link></div></div>
    <header className="site-header"><nav className="navbar has-mega" data-navbar aria-label="Primary" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);event.currentTarget.querySelector<HTMLButtonElement>('.nav-toggle')?.focus();}}} onMouseLeave={mega.closeSoon} onMouseEnter={mega.cancelClose}><div className="wrap">
      <Link href="/" className="brand">{copy('logo')?<Image src={copy('logo')} alt={copy('brand')} width={160} height={48} style={{objectFit:'contain'}}/>:brand}</Link>
      <ul className="nav-links">{roots.map(root=>{
        const id=String(root.id),children=menu.filter(m=>m.parentId===root.id);
        return <li key={root.id}>{children.length?<button className="megatab" aria-expanded={mega.active===id} aria-haspopup="true" aria-controls={`mega-${id}`} onMouseEnter={()=>mega.open(id)}  onClick={()=>mega.active===id?mega.close():mega.open(id)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();mega.open(id);}}}>{root.label} <Caret /></button>:<Link href={root.href} aria-current={active(root.href)?'page':undefined} onMouseEnter={mega.close}>{root.label}</Link>}</li>;
      })}</ul>
      <div className="nav-actions"><ReaderAccountLink/><Link className="button button--ghost" href="/contact">{copy('analystLabel')}</Link><Link className="button nav-cta" href="/contact">{copy('requestLabel')} <Arrow /></Link><button className="nav-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(v=>!v)}><span className={open?'bars is-open':'bars'} aria-hidden="true"><i/><i/><i/></span></button></div>
    </div>
    <div className="mega-container" ref={mega.containerRef}>{roots.map(root=><div className="mega-panel" id={`mega-${root.id}`} ref={mega.setPanel(String(root.id))} key={root.id}><div className="wrap mega-grid-2">
      <div className="mega-col"><h4 data-fade-stagger><Link href={root.href}>{root.label}</Link></h4><ul className="mega-list">{menu.filter(m=>m.parentId===root.id).map(child=><li key={child.id} data-fade-stagger><Link href={child.href} onClick={mega.close}><strong>{child.label}</strong>{child.description&&<span>{child.description}</span>}</Link></li>)}</ul></div>


    </div></div>)}</div>
    <div id="mobile-menu" className="mobile-menu" data-open={open} hidden={!open}><ul>{roots.map(root=><li key={root.id}><Link href={root.href} onClick={()=>setOpen(false)}>{root.label}<Arrow/></Link>{menu.some(m=>m.parentId===root.id)&&<ul>{menu.filter(m=>m.parentId===root.id).map(child=><li key={child.id}><Link href={child.href} onClick={()=>setOpen(false)}>{child.label}</Link></li>)}</ul>}</li>)}</ul><div className="mobile-menu-actions"><Link className="button" href="/contact" onClick={()=>setOpen(false)}>{copy('requestLabel')} <Arrow/></Link></div></div>
    </nav></header>
  </>;
}
