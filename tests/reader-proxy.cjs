const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('app/api/readers/[action]/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
async function run(action,origin='https://dmrkinsights.com', options={}){
 let called=false,sent;const cookieChanges=[];
 const NextResponse={json:(data,init={})=>({data,status:init.status||200,cookies:{set:(...args)=>cookieChanges.push(['set',...args]),delete:(...args)=>cookieChanges.push(['delete',...args])}})};
 const context={exports:{},require:()=>({NextResponse}),process:{env:{DMRK_API_URL:'http://api/api/v1',DMRK_PUBLIC_SITE:'true'}},AbortSignal,fetch:async(url,config)=>{called=true;sent=config;if(options.fail)throw Error();return {ok:!options.reject,status:options.reject?422:200,json:async()=>options.reject?{message:'Invalid'}:{token:'a'.repeat(64),reader:{name:'Test'}}};}};
 vm.runInNewContext(code,context);
 const request={headers:new Headers({...origin?{origin}:{},host:'localhost:3000'}),cookies:{get:()=>({value:'b'.repeat(64)})},text:async()=>options.large?'x'.repeat(8193):'{}'};
 return {response:await context.exports.POST(request,{params:Promise.resolve({action})}),cookieChanges,called,sent};
}
(async()=>{
 let r=await run('login');assert.equal(r.response.status,200);assert.equal(r.response.data.token,undefined);assert.equal(r.cookieChanges[0][3].httpOnly,true);assert.equal(r.cookieChanges[0][3].secure,true);assert.equal(r.cookieChanges[0][3].sameSite,'lax');assert.equal(r.sent.cache,'no-store');
 for(const origin of [undefined,'https://evil.example']){r=await run('login',origin===undefined?null:origin);assert.equal(r.response.status,403);assert.equal(r.called,false);}
 r=await run('unknown');assert.equal(r.response.status,404);assert.equal(r.called,false);
 r=await run('login',undefined,{large:true});assert.equal(r.response.status,413);assert.equal(r.called,false);
 r=await run('login',undefined,{reject:true});assert.equal(r.cookieChanges.length,0);
 r=await run('logout');assert.equal(r.cookieChanges.at(-1)[0],'delete');
 r=await run('login',undefined,{fail:true});assert.equal(r.response.status,503);
 console.log('PASS: reader proxy origin, action allowlist, request size, secret stripping, secure cookies, logout and upstream failure');
})().catch(e=>{console.error(e);process.exitCode=1;});
