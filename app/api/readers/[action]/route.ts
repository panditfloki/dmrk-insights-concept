import { NextRequest, NextResponse } from 'next/server';
const cookieName = 'dmrk_reader';
const allowed = ['register', 'login', 'logout', 'forgot', 'reset'];
export async function POST(request: NextRequest, { params }: { params: Promise<{action:string}> }) {
  const { action } = await params;
  if (!allowed.includes(action)) return NextResponse.json({message:'Not found'}, {status:404});
  const expectedOrigin = process.env.DMRK_PUBLIC_SITE === 'true' ? 'https://dmrkinsights.com' : `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`;
  if (request.headers.get('origin') !== expectedOrigin) return NextResponse.json({message:'Invalid origin'}, {status:403});
  const base = process.env.DMRK_API_URL;
  if (!base) return NextResponse.json({message:'Reader accounts are unavailable.'}, {status:503});
  try {
    const body = await request.text();
    if (body.length > 8192) return NextResponse.json({message:'Request too large'}, {status:413});
    const token = request.cookies.get(cookieName)?.value;
    const result = await fetch(`${base.replace(/\/$/,'')}/readers/${action}`, {
      method:'POST', body, cache:'no-store', signal:AbortSignal.timeout(15000),
      headers:{'Content-Type':'application/json', Accept:'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {})},
    });
    const data = await result.json();
    const session = data.token;
    delete data.token;
    const response = NextResponse.json(data, {status:result.status, headers:{'Cache-Control':'private, no-store'}});
    if (result.ok && typeof session === 'string' && /^[a-f0-9]{64}$/.test(session)) {
      response.cookies.set(cookieName, session, {httpOnly:true, secure:process.env.DMRK_PUBLIC_SITE === 'true', sameSite:'lax', path:'/', maxAge:14*86400});
    }
    if (result.ok && (action === 'logout' || action === 'reset')) response.cookies.delete(cookieName);
    return response;
  } catch {
    return NextResponse.json({message:'Unable to connect. Please try again.'}, {status:503});
  }
}

export async function GET(request: NextRequest, {params}:{params:Promise<{action:string}>}) {
  if ((await params).action !== 'me') return NextResponse.json({message:'Not found'}, {status:404});
  const base=process.env.DMRK_API_URL, token=request.cookies.get(cookieName)?.value;
  if (!base || !token) return NextResponse.json({reader:null}, {headers:{'Cache-Control':'private, no-store'}});
  try {
    const response=await fetch(`${base.replace(/\/$/,'')}/readers/me`, {headers:{Authorization:`Bearer ${token}`,Accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error();
    return NextResponse.json(await response.json(), {headers:{'Cache-Control':'private, no-store'}});
  } catch {return NextResponse.json({reader:null}, {status:503,headers:{'Cache-Control':'private, no-store'}});}
}
