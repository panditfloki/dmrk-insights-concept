// One-time migration of approved existing copy into labelled, layout-independent CMS fields.
const fs = require('fs');
const ts = require('typescript');
const vm = require('vm');
if(fs.readFileSync('app/page.tsx','utf8').includes('getWebsitePage')) throw new Error('One-time migration already applied. Edit the CMS schema directly.');
const schema = {};
const files = {
 'app/page.tsx':'home','app/about/page.tsx':'about','app/services/page.tsx':'services',
 'app/industries/page.tsx':'industries','app/contact/page.tsx':'contact','app/insights/page.tsx':'insights',
 'app/services/[slug]/page.tsx':'service-labels','app/insights/[slug]/page.tsx':'insight-labels',
 'components/ContactForm.tsx':'contact-form','components/Library.tsx':'library-labels',
};
function decode(v){ return v.replace(/&amp;/g,'&').replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>'); }
for(const [file,key] of Object.entries(files)){
 let src=fs.readFileSync(file,'utf8'); const ast=ts.createSourceFile(file,src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const fields=[]; const replacements=[];
 function field(value,type,label){const k=`${type}_${fields.length+1}`;fields.push({key:k,label:label||value.trim().slice(0,85),type,default:value});return k;}
 function visit(n){
  if(ts.isJsxText(n)&&n.text.trim()&&/[a-zA-Z]/.test(n.text)){
   const lines=n.text.split(/\r?\n/); const value=decode(lines.map((l,i)=>i===0?l.trimStart():l.trim()).filter(Boolean).join(' '));
   const k=field(value,'text'); replacements.push([n.pos,n.end,`{copy(${JSON.stringify(k)}, ${JSON.stringify(value)})}`]);return;
  }
  if(ts.isJsxAttribute(n)&&n.initializer&&ts.isStringLiteral(n.initializer)&&['alt','placeholder','src'].includes(n.name.text)&&n.initializer.text){
    const val=decode(n.initializer.text),k=field(val,n.name.text==='src'?'image':'text',n.name.text==='src'?'Image':`${n.name.text}: ${val.slice(0,65)}`);
    replacements.push([n.initializer.getStart(ast),n.initializer.end,`{copy(${JSON.stringify(k)}, ${JSON.stringify(val)})}`]);return;
  }
  ts.forEachChild(n,visit);
 }
 visit(ast);
 replacements.sort((a,b)=>b[0]-a[0]).forEach(([a,b,v])=>src=src.slice(0,a)+v+src.slice(b));
 const title=key.replaceAll('-',' ').replace(/^./,c=>c.toUpperCase());
 schema[key]={title,path:key==='home'?'/':key.includes('-')?null:'/'+key,template:key.includes('-')?'global':'fixed',fields};
 // These declarations are inserted into the component in the integration step.
 fs.writeFileSync(file,src);
}
const siteSrc=ts.transpileModule(fs.readFileSync('lib/site.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const ctx={exports:{}};vm.runInNewContext(siteSrc,ctx);const {services,sectors,method,REGIONS}=ctx.exports;
const fields=(obj,prefix='')=>Object.entries(obj).flatMap(([key,value])=>typeof value==='object'&&value!==null?fields(value,prefix+key+'_'):[{key:prefix+key,label:(prefix+key).replaceAll('_',' '),type:'text',default:String(value)}]);
for(const service of services) schema['service-'+service.slug]={title:service.name,path:'/services/'+service.slug,template:'service',fields:fields(service).filter(f=>f.key!=='slug')};
for(const [i,sector] of sectors.entries()) schema['industry-'+i]={title:sector.name,path:'/industries/'+sector.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''),template:'industry',fields:fields(sector)};
schema.settings={title:'Shared website settings',path:null,template:'global',fields:[
 ...fields({regions:REGIONS,method,brand:'DMRK',brandSubtitle:'Insights',topbar:'Market intelligence, customer research and strategy support in India and beyond.',requestLabel:'Request research',analystLabel:'Talk to an analyst',footerDescription:'Market intelligence, customer research, competitor analysis, surveys and strategic consulting for confident growth decisions.',copyright:'DMRK Insights. All rights reserved.',companyLabel:'Company',resourcesLabel:'Resources',legalLabel:'Legal'}),
 {key:'logo',label:'Brand logo (optional)',type:'image',default:''},
 {key:'featuredCaseId',label:'Homepage featured case study',type:'content',default:'case-logistics-market-entry'},
 ...['articles','reports','industries','services','related'].map((v,i)=>({key:v+'Count',label:v+' to show',type:'number',default:[3,4,12,12,3][i]})),
 {key:'email',label:'Public contact email',type:'text',default:''},{key:'phone',label:'Public contact phone',type:'text',default:''},
 {key:'address',label:'Public office address',type:'text',default:''},
]};
// Home repeated copy is also editable; the layout and number of method stages remain owner-controlled.
const homeSrc=fs.readFileSync('/tmp/dmrk-cms-before/app/page.tsx','utf8');
for(const name of ['PILLARS','METHOD']){
 const raw=homeSrc.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n\\]);`))[1];
 const value=vm.runInNewContext('('+raw+')'); schema.home.fields.push(...fields({[name.toLowerCase()]:value}));
}
schema.home.fields.push(...fields({caseStats:[{value:'50+',label:'Competitors benchmarked'},{value:'200+',label:'KPIs reviewed'},{value:'6',label:'Markets prioritised'}]}));
schema.custom={title:'New information page',path:null,template:'page',fields:[
 {key:'eyebrow',label:'Small heading',type:'text',default:''},{key:'heading',label:'Main heading',type:'text',default:''},{key:'intro',label:'Introduction',type:'text',default:''},
 {key:'image',label:'Page image',type:'image',default:''},{key:'body',label:'Page content (separate paragraphs with a blank line)',type:'text',default:''},
]};
for(const entry of Object.values(schema)) entry.fields.push({key:'seo_title',label:'Search engine title',type:'text',default:entry.title},{key:'seo_description',label:'Search engine description',type:'text',default:''});
fs.writeFileSync('../BACKEND-LARAVEL/resources/cms/schema.json',JSON.stringify(schema,null,2)+'\n');
fs.writeFileSync('lib/cms-defaults.json',JSON.stringify(schema,null,2)+'\n');
console.log(Object.keys(schema).length+' page schemas, '+Object.values(schema).reduce((n,p)=>n+p.fields.length,0)+' editable fields');
