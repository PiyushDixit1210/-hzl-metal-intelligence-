'use strict';
/* Conditional planning arithmetic. Event evidence does not estimate these sensitivities. */
(function(root){
const defaults=()=>({demandShock:0,priceShock:0,premiumShift:0,freightShift:0,fxShock:0,dutyDelta:0,delay:0});
function number(v,name,min,max){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error(name+' must be between '+min+' and '+max);return v;}
function validDate(v){return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;}
function text(v,name,max=500){if(typeof v!=='string'||!v.trim()||v.length>max)throw Error('Enter '+name+' (maximum '+max+' characters).');return v.trim();}
function validate(raw,ctx){
 if(!raw||typeof raw!=='object')throw Error('A scenario object is required.');
 const s={title:text(raw.title,'scenario title',160),source:text(raw.source,'source',160),url:text(raw.url,'source URL',2000),published:raw.published,geography:text(raw.geography,'geography / exposure rationale',500),rationale:text(raw.rationale,'assumption rationale',1000),metal:raw.metal,months:raw.months,exposure:raw.exposure,profile:raw.profile,cargoOrigin:raw.cargoOrigin,changes:{...defaults(),...raw.changes}};
 const url=new URL(s.url);if(url.protocol!=='https:'||url.username||url.password)throw Error('Use an HTTPS source URL without credentials.');
 if(!validDate(s.published)||s.published>ctx.asOf)throw Error('Source publication must be a valid date available by '+ctx.asOf+'.');
 if(s.metal!==ctx.metal)throw Error('Scenario metal does not match the planning baseline.');
 if(!Array.isArray(s.months)||JSON.stringify(s.months)!==JSON.stringify(ctx.rows.map(r=>r.month)))throw Error('Scenario months must match the selected planning horizon.');
 number(s.exposure,'Demand exposure (%)',0,100);
 if(!Array.isArray(s.profile)||s.profile.length!==3)throw Error('Enter three monthly transmission weights.');
 s.profile.forEach(v=>number(v,'Monthly weight',0,1));
 const ranges={demandShock:[-50,50],priceShock:[-50,100],premiumShift:[-1000,1000],freightShift:[-1000,1000],fxShock:[-50,50],dutyDelta:[-100,100],delay:[0,90]};
 for(const k of Object.keys(s.changes))if(!Object.hasOwn(ranges,k))throw Error('Unsupported scenario field: '+k);
 for(const [k,[min,max]] of Object.entries(ranges))number(s.changes[k],k,min,max);
 if(!Number.isInteger(s.changes.delay))throw Error('Delay must be a whole number of days.');
 if(!['All',...ctx.cargo.map(c=>c.origin)].includes(s.cargoOrigin))throw Error('Choose an origin present in the cargo register, or All.');
 ctx.rows.forEach((r,i)=>{const w=s.profile[i];if(r.premium+s.changes.premiumShift*w<0||ctx.pricing.freight+s.changes.freightShift*w<0)throw Error('Scenario premium and freight cannot be negative.');const duty=ctx.pricing.duty+s.changes.dutyDelta*w;if(duty<0||duty>100)throw Error('Resulting duty must be between 0% and 100%.');});
 return s;
}
function baseline(ctx){
 if(!ctx||!['Zinc','Lead','Silver'].includes(ctx.metal)||!validDate(ctx.asOf))throw Error('Invalid planning context.');
 if(ctx.unit!==(ctx.metal==='Silver'?'kg':'t'))throw Error('Metal quantity unit mismatch.');
 if(!Array.isArray(ctx.rows)||ctx.rows.length!==3)throw Error('Exactly three planning months are required.');
 let previous='';ctx.rows.forEach(r=>{if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(r.month)||r.month<=previous)throw Error('Planning months must be ordered and unique.');previous=r.month;['point','booked','premium'].forEach(k=>number(r[k],k,0,1e12));});
 number(ctx.capacity,'Capacity',0,1e12);number(ctx.buffer,'Buffer',0,1e12);
 ['reference','freight','depot','auction'].forEach(k=>number(ctx.pricing[k],k,0,1e12));number(ctx.pricing.fx,'FX',.001,1e6);number(ctx.pricing.duty,'Duty',0,100);
 const ids=new Set();ctx.cargo.forEach(c=>{if(ids.has(c.id)||!validDate(c.eta)||typeof c.origin!=='string')throw Error('Invalid or duplicate cargo record.');ids.add(c.id);number(c.quantity,'Cargo quantity',0,1e12);});
 return ctx;
}
function calculate(context,raw){
 const ctx=baseline(context),s=raw?validate(raw,ctx):null,a=s?s.changes:defaults();
 const shipments=ctx.cargo.map(c=>{const affected=!!s&&(s.cargoOrigin==='All'||s.cargoOrigin===c.origin),d=new Date(c.eta+'T00:00:00Z');if(affected)d.setUTCDate(d.getUTCDate()+a.delay);return {...c,baselineEta:c.eta,scenarioEta:d.toISOString().slice(0,10),affected};});
 const rows=ctx.rows.map((r,i)=>{const w=s?s.profile[i]:0,point=Math.round(r.point*(1+a.demandShock/100*(s?s.exposure/100:0)*w)),premium=r.premium+a.premiumShift*w,reference=ctx.pricing.reference*(1+a.priceShock/100*w),freight=ctx.pricing.freight+a.freightShift*w,fx=ctx.pricing.fx*(1+a.fxShock/100*w),duty=ctx.pricing.duty+a.dutyDelta*w;
 const baseParity=(ctx.pricing.reference+r.premium+ctx.pricing.freight)*ctx.pricing.fx*(1+ctx.pricing.duty/100)+ctx.pricing.depot,parity=(reference+premium+freight)*fx*(1+duty/100)+ctx.pricing.depot;
 const baseDomestic=Math.min(ctx.capacity,Math.max(r.point,r.booked)+ctx.buffer),domestic=Math.min(ctx.capacity,Math.max(point,r.booked)+ctx.buffer);
 return {...r,baselinePoint:r.point,point,baselinePremium:r.premium,premium,delta:point-r.point,baseParity,parity,parityDelta:parity-baseParity,reference,freight,fx,duty,baseDomestic,domestic,export:ctx.capacity-domestic,baseExport:ctx.capacity-baseDomestic,unserved:Math.max(0,Math.max(point,r.booked)-ctx.capacity),bookingException:point<r.booked,open:Math.max(0,point-r.booked),baseArrivals:shipments.filter(c=>c.baselineEta.slice(0,7)===r.month).reduce((a,c)=>a+c.quantity,0),arrivals:shipments.filter(c=>c.scenarioEta.slice(0,7)===r.month).reduce((a,c)=>a+c.quantity,0),auctionReference:ctx.pricing.auction+(premium-r.premium)};});
 return {metal:ctx.metal,unit:ctx.unit,asOf:ctx.asOf,classification:'Conditional sensitivity; not a geopolitical event prediction',baselineClassification:ctx.classification,scenario:s,rows,shipments,totalBaseline:rows.reduce((a,r)=>a+r.baselinePoint,0),totalOrders:rows.reduce((a,r)=>a+r.point,0),arrivalsOutsideHorizon:shipments.filter(c=>!rows.some(r=>r.month===c.scenarioEta.slice(0,7))).reduce((a,c)=>a+c.quantity,0)};
}
const api={defaults,validate,calculate,baseline,fingerprint:ctx=>JSON.stringify(ctx)};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(root)root.HZLPlanningEngine=api;
})(typeof window!=='undefined'?window:null);
