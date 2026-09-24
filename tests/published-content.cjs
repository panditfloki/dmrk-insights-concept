const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('lib/published-content.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const item = {id:'a',slug:'a',type:'article',title:'Title',industry:'Sector',category:'Category',publishDate:'2026-01-01',image:'https://example.com/a.jpg',summary:'Summary',body:'Body'};
function run(pages, env = {DMRK_API_URL:'http://backend/api/v1'}) {
  let calls = [];
  const context = {exports:{}, require: name => name === 'react' ? {cache: f => f} : {allItems:[item]}, process:{env}, URL, AbortSignal,
    fetch:async (url, options) => {calls.push([String(url),options.next?.revalidate]); const page = pages.shift(); if (!page) throw Error('unexpected fetch'); return {ok:page.ok !== false,status:page.status ?? 200,json:async()=>page};}};
  vm.runInNewContext(code, context);
  return {result:context.exports.getPublishedContent(),calls};
}
(async () => {
  let test = run([{items:[item],errors:[],nextCursor:'1'},{items:[{...item,id:'b',slug:'b'}],errors:[],nextCursor:null}]);
  assert.equal((await test.result).length,2);
  assert.match(test.calls[1][0],/cursor=1/); assert.equal(test.calls[0][1],30);
  for (const bad of [
    {items:[item],errors:['bad row'],nextCursor:null},
    {items:[item],nextCursor:null},
    {items:[item],errors:{},nextCursor:null},
    {items:[item],errors:[]},
    {items:[{}],errors:[],nextCursor:null},
    {ok:false,status:503},
  ]) await assert.rejects(run([bad]).result);
  await assert.rejects(run([{items:[],errors:[],nextCursor:'1'},{items:[],errors:[],nextCursor:'1'}]).result);
  await assert.rejects(run([{items:[item],errors:[],nextCursor:'1'},{items:[item],errors:[],nextCursor:null}]).result);
  await assert.rejects(run([], {DMRK_REQUIRE_API:'true'}).result);
  assert.equal((await run([], {}).result).length,1);
  assert.equal((await run([{items:[],errors:[],nextCursor:null}]).result).length,0);
  console.log('PASS: CMS pagination, malformed/error responses, duplicates, outage, required configuration and concept fallback');
})().catch(e=>{console.error(e); process.exitCode=1;});
