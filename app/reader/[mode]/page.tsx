import { notFound } from 'next/navigation';
import ReaderForm, { type ReaderMode } from '@/components/ReaderForm';
export const metadata = {title:'Reader account', robots:{index:false,follow:false}, referrer:'no-referrer' as const};
const titles = {login:'Welcome back', register:'Read the complete story', forgot:'Reset your password', reset:'Choose a new password'};
export default async function ReaderPage({params,searchParams}:{params:Promise<{mode:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const {mode}=await params; if (!Object.hasOwn(titles,mode)) notFound();
  const query=await searchParams;
  const next=typeof query.next==='string'&&/^\/insights\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(query.next)?query.next:'/insights';
  return <section className="section"><div className="wrap reader-shell"><p className="eyebrow">DMRK Insights · Reader account</p><h1>{titles[mode as ReaderMode]}</h1><p className="reader-intro">{mode==='register'?'Create a free account to continue reading DMRK articles.':mode==='login'?'Sign in to unlock full articles.':'Use the email address for your reader account.'}</p><ReaderForm mode={mode as ReaderMode} next={next} token={typeof query.token==='string'?query.token:undefined} email={typeof query.email==='string'?query.email:undefined}/><p className="reader-admin">Managing the website? <a href="/admin/login">Admin login</a></p></div></section>;
}
