/* Local supervised forecasting engine. No data is transmitted by this engine. */
(function(root){
  'use strict';
  const columns=['month','metal','order_tonnes','premium_usd_t','imports_tonnes','lme_usd_t','fx_inr_usd','sector_index','domestic_risk','global_risk','known_at'];
  const labels=['Latest orders','Prior orders','Third prior orders','Three-month mean','Latest premium','Imports available at origin','LME at origin','FX at origin','Sector index','Domestic risk','Global risk','Target month sine','Target month cosine'];
  const monthIndex=s=>{const [y,m]=s.split('-').map(Number);return y*12+m-1};
  const monthString=n=>`${Math.floor(n/12)}-${String(n%12+1).padStart(2,'0')}`;
  function parseCSV(text){
    if(text.length>2000000)throw Error('CSV exceeds the 2 MB session limit.');
    const rows=[];let row=[],cell='',quoted=false;
    for(let i=0;i<=text.length;i++){
      const c=text[i]??'\n';
      if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else if(!quoted&&cell.trim()!=='')throw Error('Unexpected quote in CSV.');else quoted=!quoted}
      else if(c===','&&!quoted){row.push(cell.trim());cell=''}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(v=>v!==''))rows.push(row);row=[];cell=''}
      else cell+=c;
    }
    if(quoted)throw Error('CSV contains an unclosed quoted cell.');
    if(rows.length<2)throw Error('CSV has no observation rows.');
    const header=rows.shift().map(x=>x.replace(/^\uFEFF/,'').toLowerCase());
    if(new Set(header).size!==header.length)throw Error('Duplicate CSV headers.');
    for(const name of columns)if(!header.includes(name))throw Error('Missing column: '+name);
    return rows.map((r,i)=>{if(r.length!==header.length)throw Error('Column count differs on row '+(i+2));return Object.fromEntries(header.map((h,j)=>[h,r[j]]))});
  }
  function validate(input,cutoff='2026-10-23'){
    if(!Array.isArray(input)||input.length>2400)throw Error('Supply at most 2,400 monthly observations.');
    const seen=new Set(),clean=[];
    for(let i=0;i<input.length;i++){
      const r=input[i],prefix='Row '+(i+2)+': ';
      if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(r.month))throw Error(prefix+'month must use YYYY-MM.');
      if(!['Zinc','Lead'].includes(r.metal))throw Error(prefix+'metal must be Zinc or Lead.');
      const key=r.metal+'|'+r.month;if(seen.has(key))throw Error(prefix+'duplicate metal/month.');seen.add(key);
      const o={month:r.month,metal:r.metal,known_at:r.known_at};
      for(const key of columns.slice(2,-1)){
        if(r[key]===null||r[key]===undefined||String(r[key]).trim()==='')throw Error(prefix+'missing '+key);
        o[key]=Number(r[key]);if(!Number.isFinite(o[key])||o[key]<0)throw Error(prefix+key+' must be a nonnegative number.');
      }
      if(o.domestic_risk>10||o.global_risk>10)throw Error(prefix+'risk scores must be between 0 and 10.');
      if(o.fx_inr_usd<=0||o.lme_usd_t<=0||o.sector_index<=0)throw Error(prefix+'FX, LME and sector index must be positive.');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(o.known_at)||!Number.isFinite(Date.parse(o.known_at))||new Date(o.known_at).toISOString().slice(0,10)!==o.known_at)throw Error(prefix+'known_at must be a valid YYYY-MM-DD date.');
      const mi=monthIndex(o.month),end=new Date(Date.UTC(Math.floor(mi/12),mi%12+1,0)).toISOString().slice(0,10);
      if(o.known_at>end)throw Error(prefix+'a predictor snapshot was published after its origin month. Align lagged indicators to the month when available.');
      if(o.known_at>cutoff||o.month>=cutoff.slice(0,7))throw Error(prefix+'only closed months known by '+cutoff+' are allowed.');
      if(o.known_at<o.month+'-01')throw Error(prefix+'known_at predates the monthly observation.');
      clean.push(o);
    }
    clean.sort((a,b)=>a.metal.localeCompare(b.metal)||a.month.localeCompare(b.month));
    for(const metal of ['Zinc','Lead']){
      const group=clean.filter(r=>r.metal===metal);if(!group.length)continue;
      if(group.length<36)throw Error(metal+' needs at least 36 consecutive closed months for this model.');
      for(let i=1;i<group.length;i++)if(monthIndex(group[i].month)!==monthIndex(group[i-1].month)+1)throw Error(metal+' has a missing month before '+group[i].month+'.');
    }
    if(!clean.length)throw Error('No valid observations.');
    return clean;
  }
  function features(rows,i,h){
    const r=rows[i],angle=2*Math.PI*((monthIndex(r.month)+h)%12)/12;
    return [r.order_tonnes,rows[i-1].order_tonnes,rows[i-2].order_tonnes,(r.order_tonnes+rows[i-1].order_tonnes+rows[i-2].order_tonnes)/3,r.premium_usd_t,r.imports_tonnes,r.lme_usd_t,r.fx_inr_usd,r.sector_index,r.domestic_risk,r.global_risk,Math.sin(angle),Math.cos(angle)];
  }
  function solve(A,b){
    const M=A.map((r,i)=>[...r,b[i]]),n=b.length;
    for(let k=0;k<n;k++){
      let pivot=k;for(let i=k+1;i<n;i++)if(Math.abs(M[i][k])>Math.abs(M[pivot][k]))pivot=i;
      [M[k],M[pivot]]=[M[pivot],M[k]];
      if(Math.abs(M[k][k])<1e-10)throw Error('Singular training matrix.');
      const d=M[k][k];for(let j=k;j<=n;j++)M[k][j]/=d;
      for(let i=0;i<n;i++)if(i!==k){const f=M[i][k];for(let j=k;j<=n;j++)M[i][j]-=f*M[k][j]}
    }return M.map(r=>r[n]);
  }
  function fit(rows,h,target,alpha=10){
    const X=[],Y=[];for(let i=2;i+h<rows.length;i++){X.push(features(rows,i,h));Y.push(rows[i+h][target])}
    if(X.length<18)throw Error('Insufficient origin/target pairs for horizon '+h);
    const p=X[0].length,n=X.length;
    const means=Array.from({length:p},(_,j)=>X.reduce((a,r)=>a+r[j],0)/n);
    const scales=means.map((m,j)=>Math.sqrt(X.reduce((a,r)=>a+(r[j]-m)**2,0)/n)||1);
    const z=X.map(r=>[1,...r.map((v,j)=>(v-means[j])/scales[j])]);
    const A=Array.from({length:p+1},()=>Array(p+1).fill(0)),b=Array(p+1).fill(0);
    for(let i=0;i<n;i++)for(let j=0;j<=p;j++){b[j]+=z[i][j]*Y[i];for(let k=0;k<=p;k++)A[j][k]+=z[i][j]*z[i][k]}
    for(let j=1;j<=p;j++)A[j][j]+=alpha;
    const weights=solve(A,b);
    return {weights,means,scales,pairs:n,horizon:h,target,alpha};
  }
  function predict(f,x){return Math.max(0,f.weights[0]+x.reduce((a,v,j)=>a+f.weights[j+1]*(v-f.means[j])/f.scales[j],0))}
  const direction=(a,b)=>a-b>5?'Up':a-b< -5?'Down':'Flat';
  function summarize(tests){
    const denom=tests.reduce((a,r)=>a+Math.abs(r.actual),0),n=tests.length;
    return {n,wape:denom?100*tests.reduce((a,r)=>a+Math.abs(r.actual-r.predicted),0)/denom:null,baselineWape:denom?100*tests.reduce((a,r)=>a+Math.abs(r.actual-r.baseline),0)/denom:null,mae:tests.reduce((a,r)=>a+Math.abs(r.actual-r.predicted),0)/n,bias:denom?100*tests.reduce((a,r)=>a+r.predicted-r.actual,0)/denom:null,within10:100*tests.filter(r=>r.actual===0?Math.abs(r.predicted)<1:Math.abs(r.predicted-r.actual)/Math.abs(r.actual)<=.1).length/n,directionAccuracy:100*tests.filter(r=>direction(r.predicted,r.originValue)===direction(r.actual,r.originValue)).length/n};
  }
  function train(input,{classification='Uploaded / unverified',cutoff='2026-10-23'}={}){
    const data=validate(input,cutoff),groups={};
    for(const metal of ['Zinc','Lead']){
      const rows=data.filter(r=>r.metal===metal);if(!rows.length)continue;
      const group={metal,rows,lastMonth:rows.at(-1).month,forecasts:[],metrics:[],modelCards:[]};
      for(let h=1;h<=6;h++){
        const result={month:monthString(monthIndex(group.lastMonth)+h),horizon:h};
        for(const target of ['order_tonnes','premium_usd_t']){
          const tests=[];
          for(let origin=Math.max(26,rows.length-h-12);origin+h<rows.length;origin++){
            const historical=rows.slice(0,origin+1),f=fit(historical,h,target);
            tests.push({origin:rows[origin].month,targetMonth:rows[origin+h].month,actual:rows[origin+h][target],predicted:predict(f,features(historical,origin,h)),baseline:rows[origin+h-12][target],originValue:rows[origin][target]});
          }
          const f=fit(rows,h,target),x=features(rows,rows.length-1,h);result[target]=predict(f,x);
          group.metrics.push({horizon:h,target,...summarize(tests),tests});
          group.modelCards.push({...f,featureNames:labels,contributions:x.map((v,j)=>({feature:labels[j],value:f.weights[j+1]*(v-f.means[j])/f.scales[j]})).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value))});
        }
        result.premiumDirection=direction(result.premium_usd_t,rows.at(-1).premium_usd_t);group.forecasts.push(result);
      }
      groups[metal]=group;
    }
    return {version:'hzl-ridge-pilot-1',trainedAt:new Date().toISOString(),cutoff,classification,groups,intervalStatus:'Not calibrated',acceptance:'Candidate only; operating acceptance definition and independent validation pending'};
  }
  function synthetic(){
    const output=[];let seed=1927;const noise=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296-.5};
    for(const metal of ['Zinc','Lead'])for(let i=0;i<84;i++){
      const month=monthString(monthIndex('2019-10')+i),season=Math.sin(2*Math.PI*i/12),factor=metal==='Zinc'?1:.24;
      const dr=i%19===0?6:1,gr=i%23===0?5:1,sector=97+i*.25+4*season;
      const imports=14000+1200*Math.cos(i*.5)+1000*noise(),lme=2400+i*5+80*season+100*noise(),fx=72+i*.15+.6*noise();
      const orders=(29000+140*i+2200*season+80*(sector-100)-200*dr-130*gr+700*noise())*factor;
      const premium=90+i*.6+12*season-.001*(imports-14000)+2*gr+4*noise();
      const mi=monthIndex(month),known=new Date(Date.UTC(Math.floor(mi/12),mi%12+1,0)).toISOString().slice(0,10);
      output.push({month,metal,order_tonnes:+orders.toFixed(2),premium_usd_t:+premium.toFixed(2),imports_tonnes:+imports.toFixed(2),lme_usd_t:+lme.toFixed(2),fx_inr_usd:+fx.toFixed(2),sector_index:+sector.toFixed(2),domestic_risk:dr,global_risk:gr,known_at:known});
    }return output;
  }
  const csv=rows=>columns.join(',')+'\n'+rows.map(r=>columns.map(k=>r[k]).join(',')).join('\n');
  const API={columns,labels,monthIndex,monthString,parseCSV,validate,train,synthetic,csv,fit,predict,features,direction};
  if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.HZLML=API;
})(typeof globalThis!=='undefined'?globalThis:this);
