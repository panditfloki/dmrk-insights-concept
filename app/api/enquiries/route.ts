import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
 const origin=request.headers.get('origin');
 const expectedOrigin=process.env.DMRK_PUBLIC_SITE==='true'?'https://dmrkinsights.com':`${request.headers.get('x-forwarded-proto')||'http'}://${request.headers.get('host')}`;
 if(!origin || origin!==expectedOrigin) return Response.json({error:'Invalid origin'},{status:403});
 const base=process.env.DMRK_API_URL;if(!base)return Response.json({error:'Enquiries are unavailable'},{status:503});
 try {
  const body=await request.text();if(body.length>16000)return Response.json({error:'Message too long'},{status:413});
  const result=await fetch(`${base.replace(/\/$/,'')}/enquiries`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body,signal:AbortSignal.timeout(15000),cache:'no-store'});
  return Response.json(await result.json(),{status:result.status});
 }catch{return Response.json({error:'Unable to save enquiry. Please try again.'},{status:503});}
}
