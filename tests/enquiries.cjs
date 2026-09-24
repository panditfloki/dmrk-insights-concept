const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('app/api/enquiries/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
async function run(origin,options={}) {
 let forwarded=false;const context={exports:{},process:{env:{DMRK_PUBLIC_SITE:'true',DMRK_API_URL:'http://api/api/v1',...options.env}},Response,AbortSignal,fetch:async()=>{forwarded=true;if(options.fail)throw new Error('upstream unavailable');return Response.json({saved:true},{status:201});}};
 vm.runInNewContext(source,context);
 const request={headers:new Headers({...origin?{origin}:{},host:'localhost:3000'}),nextUrl:new URL('http://localhost:3000/api/enquiries'),text:async()=>options.body||JSON.stringify({name:'Test',email:'test@example.invalid',brief:'A test enquiry'})};
 return {response:await context.exports.POST(request),forwarded};
}
(async()=>{
 let r=await run('https://dmrkinsights.com');assert.equal(r.response.status,201);assert.equal(r.forwarded,true);
 for(const origin of ['https://untrusted.example',undefined]){r=await run(origin);assert.equal(r.response.status,403);assert.equal(r.forwarded,false);}
 r=await run('https://dmrkinsights.com',{fail:true});assert.equal(r.response.status,503);
 r=await run('https://dmrkinsights.com',{body:'x'.repeat(16001)});assert.equal(r.response.status,413);assert.equal(r.forwarded,false);
 console.log('PASS: reverse-proxy origin, foreign/missing origins, upstream failure and body-size limit.');
})().catch(error=>{console.error(error);process.exitCode=1;});
