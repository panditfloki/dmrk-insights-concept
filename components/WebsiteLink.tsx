'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useWebsite } from './WebsiteProvider';
export default function WebsiteLink(props:ComponentProps<typeof NextLink>) {
 const site=useWebsite();
 if(typeof props.href==='string'&&props.href.startsWith('/')) {
  const path=props.href.split(/[?#]/)[0];
  const managed=['/','/about','/contact','/services','/industries','/insights','/privacy-policy','/terms-of-use','/newsletter'].includes(path)||/^\/(pages|services|industries)\//.test(path);
  if(managed&&!site.pages.some(p=>p.path===path))return null;
  if(path.startsWith('/categories/')&&!site.categories.some(c=>'/categories/'+c.slug===path))return null;
 }
 return <NextLink {...props}/>;
}
