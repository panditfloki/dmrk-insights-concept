'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {useWebsite} from './WebsiteProvider';
import {settingsCopy} from '@/lib/website-shared';
const defaults='ETERNAL|Eternal (Zomato)\nPAYTM|Paytm\nNYKAA|Nykaa\nSWIGGY|Swiggy\nOLAELEC|Ola Electric';
export default function StockTicker(){
  const site=useWebsite(), copy=settingsCopy(site), pathname=usePathname();
  const [hidden,setHidden]=useState(false);
  useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)setHidden(true);},[]);
  const symbols=copy('tickerSymbols',defaults).split('\n').map(line=>line.split('|')).filter(([s])=>/^[A-Z0-9]{1,20}$/.test(s.trim())).slice(0,20).map(([s,label])=>({proName:`BSE:${s.trim()}`,description:label?.trim()||s.trim()}));
  if(copy('tickerEnabled','1')==='0'||pathname.startsWith('/reader/')||symbols.length===0)return null;
  const config=JSON.stringify({symbols,showSymbolLogo:false,isTransparent:false,displayMode:'compact',colorTheme:'light',locale:'en',width:'100%',height:74,utm_source:'dmrkinsights.com',utm_medium:'widget',utm_campaign:'ticker-tape'});
  const source=`https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=en#${encodeURIComponent(config)}`;
  return <section className="market-ticker" aria-label="Listed Indian unicorn stocks"><div className="wrap market-ticker-label"><span><strong>Listed unicorns</strong> · BSE end-of-day prices</span><button type="button" onClick={()=>setHidden(v=>!v)} aria-expanded={!hidden}>{hidden?'Show prices':'Hide prices'}</button></div>{!hidden&&<><iframe title="BSE end-of-day stock prices from TradingView" src={source} sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" className="market-ticker-frame"/><div className="wrap market-ticker-credit"><a href="https://www.tradingview.com/markets/stocks-india/" target="_blank" rel="noopener noreferrer">Market data by TradingView</a><span> · If prices do not load, open market data.</span></div></>}</section>;
}
