// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";


const SP=["#4f0200","#6e231f","#873025","#a44f24","#ba702a","#c0933b","#e2e200","#cff200","#8ccc00","#5fcc00"];
const GR=`linear-gradient(to right,${SP.join(",")})`;
const fmt=n=>n>=1e6?`$${(n/1e6).toFixed(1)}M`:n>=1e3?`$${(n/1e3).toFixed(0)}K`:`$${n}`;
const G="#5fcc00",R="#ef4444",W="#f59e0b",Au="var(--gold)";
function sC(s){return s<=10?SP[0]:s<=20?SP[1]:s<=30?SP[2]:s<=40?SP[3]:s<=50?SP[4]:s<=60?SP[5]:s<=70?SP[6]:s<=80?SP[7]:s<=90?SP[8]:SP[9]}
function hexA(h,a){const m=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);if(!m)return h;return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${a})`}
function sB(s,d){const k=Math.min(9,Math.floor(s/11));const D=["#1a0800","#1f0a08","#221008","#2a1808","#2d2008","#2d280d","#2d2d08","#283008","#1d2d08","#182d08"];const L=["#fde8e8","#fde8e8","#fdeae0","#fff0e0","#fff3e0","#fdf6e3","#fdfde3","#f5fde3","#eafde3","#e3fde3"];return d?D[k]:L[k]}
function sH(s,d){const k=Math.min(9,Math.floor(s/11));const D=["#250c00","#2a1010","#2d1510","#351d10","#382810","#383012","#38380c","#30380c","#25380c","#20380c"];const L=["#f5d0d0","#f5d0d0","#f5d8c8","#ffe8c0","#ffecc0","#f5ecd0","#f5f5c8","#eaf5c8","#ddf5c8","#d0f5c8"];return d?D[k]:L[k]}
function tL(s){return s<=20?"LIQUIDATION":s<=40?"EXIT UNLIKELY":s<=60?"DISRUPTION IMMINENT":s<=75?"MARKET VULNERABLE":s<=90?"EXIT POSSIBLE":"EXIT READY"}
function dL(s){return s<=20?"FEAR DOMINANT":s<=40?"FRICTION LOCKED":s<=60?"COMPLACENCY ZONE":s<=75?"AWAKENING":s<=90?"DESIRE BUILDING":"CULT ECONOMICS"}

// Surfaces follow the app's global theme via --content-* tokens (auto-switch with .light).
const T_TOKENS={bg:"var(--content-bg)",ba:"var(--content-elevated-bg)",bc:"var(--content-card-bg)",bd:"var(--content-border)",bl:"var(--content-hover-bg)",tx:"var(--content-text1)",md:"var(--content-text2)",dm:"var(--content-text3)",ft:"var(--content-text3)",gh:"var(--content-border)"};

const D=[
  {id:"d1",q:"Critical decisions documented as SOPs",v:"4 of 23",s:22,sr:"FOCUS Q83+ANALYTICS",e:"m",f:1,ci:0,si:0},
  {id:"d2",q:"Decision authority matrix exists",v:"Partial",s:40,sr:"FOCUS Q87",e:"m",f:1,ci:0,si:0},
  {id:"d3",q:"Escalation thresholds defined",v:"No",s:0,sr:"FOCUS Q89",e:"m",f:1,ci:0,si:0},
  {id:"d4",q:"Decision log maintained weekly",v:"Inconsistent",s:35,sr:"FORMULA tracking",e:"a",f:1,ci:0,si:0},
  {id:"d5",q:"Board meeting minutes documented",v:"Yes",s:80,sr:"ANALYTICS audit",e:"c",f:1,ci:0,si:0},
  {id:"d6",q:"Strategic plan written & shared",v:"Outdated",s:20,sr:"FOCUS Q85+VAULT",e:"m",f:1,ci:0,si:0},
  {id:"d7",q:"Named successor for CEO",v:"No",s:0,sr:"FOCUS Q94+H.I.V.E.",e:"m",f:1,ci:0,si:1},
  {id:"d8",q:"Key person insurance",v:"Yes",s:100,sr:"ANALYTICS financial",e:"c",f:1,ci:0,si:1},
  {id:"d9",q:"Management tenure avg",v:"2.1 yrs",s:45,sr:"H.I.V.E. data",e:"a",f:1,ci:0,si:1},
  {id:"d10",q:"Cross-training completion",v:"34%",s:34,sr:"H.I.V.E. skills",e:"a",f:1,ci:0,si:1},
  {id:"d11",q:"Emergency operations plan",v:"None",s:0,sr:"FOCUS Q90",e:"m",f:1,ci:0,si:1},
  {id:"d12",q:"Founder vacation test",v:"Never",s:0,sr:"FOCUS Q91",e:"m",f:1,ci:0,si:1},
  {id:"d13",q:"Top 3 clients know other staff",v:"1 of 3",s:33,sr:"FOCUS Q47",e:"m",f:1,ci:0,si:2},
  {id:"d14",q:"Vendor relationships documented",v:"Partial",s:50,sr:"FOCUS Q52",e:"m",f:1,ci:0,si:2},
  {id:"d15",q:"Key partnerships have contracts",v:"2 of 5",s:40,sr:"ANALYTICS legal",e:"m",f:1,ci:0,si:2},
  {id:"d16",q:"Referral sources diversified",v:"Moderate",s:60,sr:"ANALYTICS revenue",e:"c",f:1,ci:0,si:2},
  {id:"d17",q:"Community involvement documented",v:"",s:0,sr:"FOCUS Q55",e:"m",f:0,ci:0,si:2},
  {id:"d18",q:"Process documentation coverage",v:"28%",s:28,sr:"FOCUS Q60",e:"m",f:1,ci:0,si:3},
  {id:"d19",q:"Training materials current",v:"No",s:0,sr:"H.I.V.E. skills",e:"a",f:1,ci:0,si:3},
  {id:"d20",q:"Knowledge base exists",v:"Informal",s:30,sr:"FOCUS Q62",e:"m",f:1,ci:0,si:3},
  {id:"d21",q:"Documented workflows",v:"40%",s:40,sr:"FOCUS Q30",e:"m",f:1,ci:1,si:0},
  {id:"d22",q:"Automation coverage",v:"15%",s:15,sr:"ANALYTICS ops",e:"m",f:1,ci:1,si:0},
  {id:"d23",q:"Error/rework rate",v:"8%",s:55,sr:"ANALYTICS quality",e:"c",f:1,ci:1,si:0},
  {id:"d24",q:"Capacity utilization",v:"72%",s:72,sr:"ANALYTICS ops",e:"c",f:1,ci:1,si:0},
  {id:"d25",q:"IT disaster recovery plan",v:"",s:0,sr:"FOCUS Q35",e:"m",f:0,ci:1,si:0},
  {id:"d26",q:"Revenue per employee trend",v:"Growing",s:65,sr:"ANALYTICS",e:"c",f:1,ci:1,si:1},
  {id:"d27",q:"Marginal cost of next unit",v:"",s:0,sr:"ANALYTICS",e:"m",f:0,ci:1,si:1},
  {id:"d28",q:"Bottleneck analysis completed",v:"",s:0,sr:"FOCUS Q38",e:"m",f:0,ci:1,si:1},
  {id:"d29",q:"Top client revenue %",v:"22%",s:30,sr:"ANALYTICS",e:"c",f:1,ci:2,si:0},
  {id:"d30",q:"Contract coverage",v:"35%",s:35,sr:"ANALYTICS legal",e:"m",f:1,ci:2,si:0},
  {id:"d31",q:"Recurring revenue %",v:"42%",s:42,sr:"ANALYTICS",e:"c",f:1,ci:2,si:1},
  {id:"d32",q:"Revenue growth rate",v:"18%",s:75,sr:"ANALYTICS",e:"c",f:1,ci:2,si:1},
  {id:"d33",q:"Pipeline documented",v:"Informal",s:30,sr:"FOCUS Q51",e:"m",f:1,ci:2,si:1},
  {id:"d34",q:"Market share estimate",v:"12%",s:60,sr:"FOCUS Q53",e:"m",f:1,ci:2,si:2},
  {id:"d35",q:"Online reputation score",v:"4.6/5",s:82,sr:"ANALYTICS",e:"a",f:1,ci:2,si:2},
  {id:"d36",q:"Industry awards",v:"",s:0,sr:"FOCUS Q56",e:"m",f:0,ci:2,si:2},
];
const FILL=D.filter(d=>d.f).length,MISS=D.filter(d=>!d.f).length,MAN=D.filter(d=>d.e==="m").length,COD=D.filter(d=>d.e==="c").length,AUT=D.filter(d=>d.e==="a").length;

const C=[
  {n:"LEADERSHIP\nTRANSFERABILITY",s:45,tr:480000,w:18,p:22,subs:[{n:"DECISION DOCUMENTATION",s:32,p:6},{n:"SUCCESSION READINESS",s:38,p:6},{n:"RELATIONSHIP DEPENDENCY",s:51,p:5},{n:"INSTITUTIONAL KNOWLEDGE",s:42,p:5}]},
  {n:"OPERATIONAL\nLEVERAGE",s:55,tr:320000,w:15,p:18,subs:[{n:"PROCESS EFFICIENCY",s:52,p:6},{n:"SCALABILITY",s:48,p:6}]},
  {n:"REVENUE\nDURABILITY",s:58,tr:280000,w:14,p:16,subs:[{n:"CLIENT CONCENTRATION",s:42,p:5},{n:"REVENUE QUALITY",s:62,p:6},{n:"MARKET POSITION",s:68,p:5}]},
  {n:"EXPERIENCE\nCAPITAL",s:67,tr:195000,w:12,p:19},
  {n:"EARNINGS\nQUALITY",s:72,tr:145000,w:10,p:14},
  {n:"MARKET\nCONTEXT",s:63,tr:210000,w:10,p:15},
  {n:"GROWTH\nTRAJECTORY",s:74,tr:120000,w:8,p:14},
  {n:"HUMAN\nCAPITAL",s:81,tr:85000,w:7,p:17},
  {n:"INFORMATION\nASYMMETRY",s:88,tr:52000,w:6,p:12},
];
const EX=Math.round(C.reduce((a,c)=>a+c.s*c.w,0)/100);
const DC=[{n:"Net Promoter Score",r:"42",nm:42,w:25},{n:"Customer Satisfaction",r:"87%",nm:74,w:20},{n:"Referral Rate",r:"28%",nm:47,w:15},{n:"Brand Awareness",r:"34%",nm:34,w:15},{n:"Google Reviews",r:"4.6/5",nm:82,w:15},{n:"First Response Time",r:"3.4 hrs",nm:55,w:10}];
const DS=Math.round(DC.reduce((a,c)=>a+c.nm*c.w,0)/100);
const TP=C.reduce((a,c)=>a+c.p,0);

const AI=[
  {id:"a1",pr:"P1",sv:"CRITICAL",ow:"CEO",ti:"Start SOP Documentation Sprint",de:"Document the 10 most frequently made founder-only decisions into SOPs. Begin with pricing, vendor selection, hiring approvals.",so:"FOCUS Q83 + H.I.V.E. cross-training 34% + ANALYTICS 23 undocumented.",im:"$14,400/mo",tl:"Wk 1-2 of 6",ls:45,lc:"LEADERSHIP TRANSFERABILITY",to:"Sarah Chen (Ops Director)",link:"leadership"},
  {id:"a2",pr:"P2",sv:"HIGH",ow:"CFO",ti:"Initiate Full Financial Audit",de:"Engage Big 4 or regional CPA for GAAP audit. Reviewed financials = 0.5-1.0× discount. $1.0-2.0M trapped for $25-40K.",so:"ANALYTICS financial + Pepperdine 2023.",im:"$1.0-2.0M",tl:"Wk 1 of 12",ls:72,lc:"EARNINGS QUALITY",to:"Michael Torres (CFO)",link:"financials"},
  {id:"a3",pr:"P3",sv:"HIGH",ow:"COO",ti:"Reduce Top Client Concentration",de:"Ajax Corp = 22% revenue ($1.47M). Expand 3 next-largest by 15% each, add 2 new verticals. Secure Ajax 24mo contract.",so:"ANALYTICS client revenue (Codat) + FOCUS Q47.",im:"$8,200/mo",tl:"Wk 1-4 of 16",ls:58,lc:"REVENUE DURABILITY",to:"James Park (VP Sales)",link:"revenue"},
  {id:"a4",pr:"P4",sv:"MEDIUM",ow:"CEO",ti:"Execute Founder Vacation Test",de:"2-week absence. Brief leadership, delegate authority, measure continuity. Track every escalated decision.",so:"FOCUS Q91 + H.I.V.E. delegation + ANALYTICS bottleneck.",im:"$6,800/mo",tl:"Wk 3-5 of 6",ls:45,lc:"LEADERSHIP TRANSFERABILITY",to:"Sarah Chen (Ops Director)",link:"leadership"},
];

const MO=["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
const RV=[520,535,548,562,571,580,595,610,628,645,660,678],CG=[198,201,210,213,220,218,225,230,238,242,248,258],OX=[165,168,170,172,175,178,180,182,185,188,190,192];
const EB=RV.map((r,i)=>r-CG[i]-OX[i]);
const AB=[{i:"Owner salary above market",a:120000,n:"$320K vs market $200K",f:"amber"},{i:"Personal vehicle lease",a:18000,n:"BMW X5 — 60% personal",f:"amber"},{i:"Club memberships",a:12000,n:"Not documented",f:"red"},{i:"Family employment",a:48000,n:"Hours unverified",f:"red"},{i:"Personal travel",a:8500,n:"Partial justification",f:"amber"},{i:"Life insurance",a:6200,n:"Personal whole life",f:"amber"}];
const TA=AB.reduce((s,a)=>s+a.a,0);
const FL=[{sv:"critical",ti:"Line C Margin Declining 6pts/12mo",de:"48%→42%. Structural, not seasonal.",sr:"ANALYTICS P&L trend"},{sv:"critical",ti:"Owner Comp Exceeds Market 60%",de:"$532K vs $200K. Family employment scrutiny.",sr:"ANALYTICS comp benchmark"},{sv:"warning",ti:"Revenue Concentration: Top Client 22%",de:"Ajax=$1.47M. No contract protection.",sr:"ANALYTICS client (Codat)"},{sv:"warning",ti:"DSO Above Benchmark",de:"38 days vs 30-35. $142K 60+ past due.",sr:"ANALYTICS AR (Codat)"},{sv:"info",ti:"Audit vs Review: 0.5-1.0× Risk",de:"$1.0-2.0M value for $25-40K cost.",sr:"Pepperdine 2023"},{sv:"info",ti:"One-Time Costs Normalized",de:"$155K over 3 years. Documented.",sr:"ANALYTICS historical"}];

// ─── EXIT SCORE explanations ──────────────────────────────────────────────────
const EXIT_INSIGHT = {
  what: "Exit Readiness measures how prepared Northgate Solutions is to be acquired — today, not someday. It is the weighted composite of all 9 PE due diligence categories a buyer's team investigates during M&A. A score of 63 places you in MARKET VULNERABLE: financially solid, but with structural gaps that a sophisticated buyer will use to discount your multiple.",
  why: [
    {label:"Leadership Transferability",score:45,impact:"$480K trapped",owner:"CEO",link:"leadership",note:"Business runs through you. Buyers price this as key-man risk — the single largest multiple suppressor."},
    {label:"Operational Leverage",score:55,impact:"$320K trapped",owner:"Sarah Chen (COO)",link:"operational",note:"Only 40% of core workflows are documented. A buyer cannot scale what isn't written down."},
    {label:"Revenue Durability",score:58,impact:"$280K trapped",owner:"James Park (VP Sales)",link:"revenue",note:"Top client at 22% of revenue with no contract. One departure changes your story."},
  ],
  sowhat: "Your path from 63 to 75+ runs through three moves, in order: (1) Document founder decisions into SOPs — this week. (2) Secure the Ajax contract with a 24-month term. (3) Initiate a GAAP audit — it unlocks $1–2M in multiple premium for $25-40K.",
  nextTier: "EXIT POSSIBLE",
  nextScore: 75,
  multiple: {current:"6.05×", potential:"7.8×", delta:"+1.75×", value:"$3.5M additional enterprise value"}
};

const DESIRE_INSIGHT = {
  what: "The Desire Axis measures how much customers want you versus merely tolerate you. At 55, Northgate sits in the COMPLACENCY ZONE — the most dangerous tier because it feels stable. Revenue is holding. But no surprise is entering the system. A competitor with more desire will take your customers before you notice.",
  why: [
    {label:"Net Promoter Score",score:42,weight:"25%",note:"Customers are satisfied but not evangelizing. They won't leave — but they won't refer either."},
    {label:"Referral Rate",score:47,weight:"15%",note:"28% referral rate. Industry leaders see 45–60%. This is $840K/yr in unearned acquisition."},
    {label:"Brand Awareness",score:34,weight:"15%",note:"Only 34% local awareness. Market share is limited by visibility, not product quality."},
  ],
  sowhat: "Move from COMPLACENCY ZONE to AWAKENING by introducing one surprise into the customer experience this quarter. Activate the Story Engine — have employees submit 10 friction and delight moments. Start measuring. That's the mechanism.",
  desireStage: "D.E.S.I.R.E. Current stage: between DELIGHT and SURPRISE. The system has not yet produced self-generating desire.",
  nextTier: "AWAKENING",
  nextScore: 61,
  framework: ["DELIGHT","EXPERIENCE","SURPRISE","INSPIRE","RESONATE","EVANGELIZE"],
  currentStage: 1
};

function treemap(cats,w,h){
  const sorted=[...cats].sort((a,b)=>b.w-a.w);const R=[];let rem=[...sorted],x=0,y=0,rw=w,rh=h;
  while(rem.length>0){const rt=rem.reduce((s,c)=>s+c.w,0);const hz=rw>=rh;let best=null,bst=Infinity;
    for(let i=1;i<=rem.length;i++){const row=rem.slice(0,i),rT=row.reduce((s,c)=>s+c.w,0),rF=rT/rt,sd=hz?rh:rw,rs=(hz?rw:rh)*rF;
      const wr=Math.max(...row.map(c=>{const iS=sd*(c.w/rT);return Math.max(rs/iS,iS/rs)}));if(wr<bst){bst=wr;best=i}else break}
    const row=rem.slice(0,best);rem=rem.slice(best);const rT=row.reduce((s,c)=>s+c.w,0),rF=rT/(rT+rem.reduce((s,c)=>s+c.w,0));
    if(hz){const rW=rw*rF;let cy=y;row.forEach(c=>{const iH=rh*(c.w/rT);R.push({...c,x,y:cy,w2:rW,h2:iH});cy+=iH});x+=rW;rw-=rW}
    else{const rH=rh*rF;let cx=x;row.forEach(c=>{const iW=rw*(c.w/rT);R.push({...c,x:cx,y,w2:iW,h2:rH});cx+=iW});y+=rH;rh-=rH}}
  return R;
}

function EB_({type}){
  const c=type==="c"?G:type==="a"?"#6e8cff":W;
  const l=type==="c"?"CODAT":type==="a"?"AUTO":"MANUAL";
  return <span style={{fontSize:"8px",fontWeight:700,padding:"2px 6px",background:c+"18",color:c,border:`1px solid ${c}33`,letterSpacing:"0.5px"}}>{l}</span>;
}

function Bar({data,labels,color=Au}){
  const t=T_TOKENS,mx=Math.max(...data),w=540,h=120,bw=Math.floor((w-36)/data.length)-3;
  return <svg viewBox={`0 0 ${w} ${h+20}`} style={{width:"100%",height:"auto"}}>
    {[0,.5,1].map((p,i)=><g key={i}><line x1={36} y1={h*(1-p)} x2={w} y2={h*(1-p)} stroke={t.bd}/><text x={32} y={h*(1-p)+4} textAnchor="end" fill={t.gh} fontSize="8" fontFamily="Montserrat">{Math.round(mx*p)}</text></g>)}
    {data.map((v,i)=><g key={i}><rect x={36+i*(bw+3)} y={h-(v/mx)*h} width={bw} height={(v/mx)*h} fill={color} opacity={.8}/><text x={36+i*(bw+3)+bw/2} y={h+14} textAnchor="middle" fill={t.dm} fontSize="8" fontFamily="Montserrat">{labels[i]}</text></g>)}
  </svg>;
}

// ─── SPECTRUM EXPAND PANEL ────────────────────────────────────────────────────
function SpectrumPanel({type, score, insight, dk, t, onClose}){
  const isExit = type==="exit";
  const accentColor = sC(score);
  const F = "'Montserrat',sans-serif";

  return <div style={{background:dk?"#0d0d0d":"#fafaf8",border:`1px solid ${accentColor}30`,borderTop:`2px solid ${accentColor}`,padding:"24px 28px",marginTop:0}}>

    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div>
        <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1.5px",color:accentColor,marginBottom:4}}>
          GESTALT INTELLIGENCE — {isExit ? "EXIT READINESS ANALYSIS" : "DESIRE AXIS ANALYSIS"}
        </div>
        <div style={{fontSize:"13px",fontWeight:800,color:t.tx,marginBottom:2}}>
          {isExit ? `Score ${score} — ${tL(score)}` : `Score ${score} — ${dL(score)}`}
        </div>
        {isExit && <div style={{fontSize:"11px",color:t.dm}}>
          {insight.multiple.current} multiple → potential {insight.multiple.potential} &nbsp;
          <span style={{color:G,fontWeight:700}}>{insight.multiple.delta}</span> &nbsp;=&nbsp;
          <span style={{color:Au,fontWeight:700}}>{insight.multiple.value}</span>
        </div>}
      </div>
      <button onClick={onClose} style={{padding:"6px 14px",background:"transparent",border:`1px solid ${t.bd}`,color:t.ft,cursor:"pointer",fontFamily:F,fontSize:"10px",fontWeight:700,letterSpacing:"0.5px"}}>× CLOSE</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

      {/* LEFT: WHAT + WHY */}
      <div>
        {/* WHAT */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1.5px",color:Au,marginBottom:8}}>WHAT DOES THIS MEAN?</div>
          <div style={{fontSize:"12px",color:t.md,lineHeight:1.7,padding:"14px 16px",background:dk?"#141414":"#f0ede6",borderLeft:`3px solid ${accentColor}`}}>
            {insight.what}
          </div>
        </div>

        {/* WHY */}
        <div>
          <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1.5px",color:Au,marginBottom:8}}>WHY IS YOUR SCORE HERE?</div>
          <div style={{fontSize:"10px",color:t.ft,marginBottom:10,lineHeight:1.5}}>The following areas are your biggest drag. Each is a link to the full analysis.</div>
          {insight.why.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",background:dk?"#141414":"#fff",border:`1px solid ${t.bd}`,borderLeft:`3px solid ${sC(item.score)}`,marginBottom:6,cursor:"pointer"}}
              onClick={()=>{}}>
              <div style={{minWidth:32,textAlign:"center"}}>
                <div style={{fontSize:"18px",fontWeight:900,color:sC(item.score),lineHeight:1}}>{item.score}</div>
                <div style={{fontSize:"7px",color:t.ft,lineHeight:1.3}}>score</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:"11px",fontWeight:800,color:t.tx,letterSpacing:"0.5px"}}>{item.label}</div>
                  <span style={{fontSize:"9px",fontWeight:700,color:R,background:R+"15",padding:"2px 8px",border:`1px solid ${R}30`}}>{item.impact}</span>
                </div>
                <div style={{fontSize:"11px",color:t.dm,lineHeight:1.5,marginBottom:6}}>{item.note}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:"9px",color:t.ft}}>Owner:</span>
                  <span style={{fontSize:"9px",fontWeight:700,color:Au,background:Au+"12",padding:"2px 8px",border:`1px solid ${Au}25`,cursor:"pointer"}}>
                    → {item.owner || item.weight}
                  </span>
                  <span style={{fontSize:"9px",color:accentColor,marginLeft:"auto",cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>
                    VIEW IN ANALYTICS ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: SO WHAT + FRAMEWORK */}
      <div>
        {/* SO WHAT */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1.5px",color:Au,marginBottom:8}}>SO WHAT DO WE DO ABOUT IT?</div>
          <div style={{padding:"16px 18px",background:dk?"#1a1208":"#f5f0e0",border:`1px solid ${Au}30`,borderLeft:`3px solid ${Au}`,marginBottom:12}}>
            <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1px",color:Au,marginBottom:6}}>GESTALT INTELLIGENCE — RECOMMENDED SEQUENCE</div>
            <div style={{fontSize:"12px",color:t.tx,lineHeight:1.7}}>{insight.sowhat}</div>
          </div>

          {/* Next tier target */}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:dk?"#141414":"#fff",border:`1px solid ${t.bd}`}}>
            <div style={{textAlign:"center",minWidth:60}}>
              <div style={{fontSize:"24px",fontWeight:900,color:sC(insight.nextScore),lineHeight:1}}>{insight.nextScore}</div>
              <div style={{fontSize:"8px",color:t.ft,marginTop:2}}>TARGET</div>
            </div>
            <div>
              <div style={{fontSize:"10px",fontWeight:800,color:t.tx,marginBottom:2}}>NEXT TIER: {insight.nextTier}</div>
              <div style={{fontSize:"10px",color:t.dm,lineHeight:1.5}}>
                {isExit
                  ? `Reaching ${insight.nextScore} unlocks ${insight.multiple.potential} multiple — an estimated ${insight.multiple.value}.`
                  : `Reaching ${insight.nextScore} moves you from COMPLACENCY ZONE to AWAKENING — where surprise begins to enter the system.`
                }
              </div>
            </div>
          </div>
        </div>

        {/* Desire framework stages OR Exit category breakdown */}
        {!isExit && (
          <div>
            <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1.5px",color:Au,marginBottom:8}}>D.E.S.I.R.E.™ — YOUR CURRENT STAGE</div>
            <div style={{fontSize:"10px",color:t.ft,marginBottom:10,lineHeight:1.5}}>{insight.desireStage}</div>
            <div style={{display:"flex",gap:4}}>
              {insight.framework.map((stage,i)=>(
                <div key={i} style={{
                  flex:1,textAlign:"center",padding:"8px 4px",
                  background:i<=insight.currentStage?(sC(30+i*12)+"22"):(dk?"#141414":"#f5f3ef"),
                  border:`1px solid ${i<=insight.currentStage?sC(30+i*12)+"44":t.bd}`,
                  borderBottom:i===insight.currentStage?`2px solid ${Au}`:`1px solid ${t.bd}`
                }}>
                  <div style={{fontSize:"7px",fontWeight:800,letterSpacing:"0.08em",color:i<=insight.currentStage?Au:t.ft}}>{stage[0]}</div>
                  <div style={{fontSize:"6px",color:t.ft,marginTop:1}}>{stage.slice(1,4)}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:"9px",color:t.ft,marginTop:8}}>
              You are building between <span style={{color:Au,fontWeight:700}}>DELIGHT</span> and <span style={{color:Au,fontWeight:700}}>SURPRISE</span>. Activate Story Engine to advance.
            </div>
          </div>
        )}

        {isExit && (
          <div>
            <div style={{fontSize:"9px",fontWeight:800,letterSpacing:"1.5px",color:Au,marginBottom:8}}>ALL 9 PE CATEGORIES — QUICK VIEW</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
              {C.map((cat,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:sB(cat.s,dk),border:`1px solid ${dk?"rgba(255,255,255,.04)":"rgba(0,0,0,.06)"}`,cursor:"pointer"}}
                  onClick={()=>{}}>
                  <span style={{fontSize:"16px",fontWeight:900,color:sC(cat.s),minWidth:24}}>{cat.s}</span>
                  <span style={{fontSize:"9px",color:t.tx,flex:1,lineHeight:1.3}}>{cat.n.replace("\n"," ")}</span>
                  <span style={{fontSize:"8px",color:t.ft}}>{cat.w}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function AnalyticsContent(){
  const{theme}=useTheme();
  const[vw,setVw]=useState("cmd");
  const[ft,setFt]=useState("rev");
  const[sc,setSc]=useState(0);
  const[openSubs,setOpenSubs]=useState({});
  const[dt,setDt]=useState("pts");
  const[hc,setHc]=useState(null);
  const[done,setDone]=useState({});
  const[tray,setTray]=useState([]);
  const[sTo,setSTo]=useState("");
  const[sMsg,setSMsg]=useState("");
  const[sent,setSent]=useState(false);
  const[ept,setEpt]=useState(null);
  const[ev,setEv]=useState("");
  const[df,setDf]=useState("all");
  const[dpW,setDpW]=useState(400);
  const[aiH,setAiH]=useState(260);
  const[exitOpen,setExitOpen]=useState(false);
  const[desireOpen,setDesireOpen]=useState(false);
  const tmRef=useRef(null);
  const[sz,setSz]=useState({w:680,h:420});
  const t=T_TOKENS,dk=theme==="dark";
  const F="'Montserrat',sans-serif";

  useEffect(()=>{
    if(!tmRef.current)return;
    const ro=new ResizeObserver(e=>{for(const en of e)setSz({w:en.contentRect.width,h:en.contentRect.height})});
    ro.observe(tmRef.current);
    return()=>ro.disconnect();
  },[]);

  const startDpDrag=useCallback((e)=>{
    e.preventDefault();const x0=e.clientX,w0=dpW;
    const mv=(ev)=>setDpW(Math.max(320,Math.min(640,w0+(x0-ev.clientX))));
    const up=()=>{document.removeEventListener("mousemove",mv);document.removeEventListener("mouseup",up)};
    document.addEventListener("mousemove",mv);document.addEventListener("mouseup",up);
  },[dpW]);

  const startAiDrag=useCallback((e)=>{
    e.preventDefault();const y0=e.clientY,h0=aiH;
    const mv=(ev)=>setAiH(Math.max(160,Math.min(520,h0+(y0-ev.clientY))));
    const up=()=>{document.removeEventListener("mousemove",mv);document.removeEventListener("mouseup",up)};
    document.addEventListener("mousemove",mv);document.addEventListener("mouseup",up);
  },[aiH]);

  const cat=C[sc],rects=treemap(C,sz.w,sz.h);
  const addT=(id,label,type)=>{if(!tray.find(x=>x.id===id))setTray(p=>[...p,{id,label,type}])};
  const remT=id=>setTray(p=>p.filter(x=>x.id!==id));
  const clrT=()=>{setTray([]);setSTo("");setSMsg("")};
  const doSend=()=>{setSent(true);setTimeout(()=>{setSent(false);clrT()},1500)};
  const togSub=si=>setOpenSubs(p=>({...p,[si]:!p[si]}));
  const cp=Math.round((FILL/D.length)*100);
  const mcC=cp>=90?G:cp>=70?W:R;
  const mcL=cp>=90?"HIGH CONFIDENCE":cp>=70?"MODERATE":cp>=50?"LOW":"INSUFFICIENT";

  const hdr={fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",color:t.ft};
  const tbtn=(a)=>({padding:"8px 16px",background:a?(dk?"#1a1a1a":"#fff"):"transparent",border:`1px solid ${t.bd}`,borderBottom:a?`2px solid ${Au}`:`1px solid ${t.bd}`,color:a?Au:t.ft,cursor:"pointer",fontFamily:F,fontSize:"10px",fontWeight:700,letterSpacing:"1.5px"});

  const scrollCSS=`
    .analytics-scope, .analytics-scope *{box-sizing:border-box}
    .analytics-scope *::-webkit-scrollbar{width:5px;height:5px}
    .analytics-scope *::-webkit-scrollbar-track{background:var(--content-bar-track)}
    .analytics-scope *::-webkit-scrollbar-thumb{background:var(--content-border);border:1px solid var(--content-bar-track)}
    .analytics-scope *::-webkit-scrollbar-thumb:hover{background:var(--gold)}
    .analytics-scope *::-webkit-scrollbar-thumb:active{background:var(--gold)}
    .analytics-scope{scrollbar-width:thin;scrollbar-color:var(--content-border) var(--content-bar-track)}
    .analytics-scope input[type="text"]{font-family:${F}}
  `;

  const hGrip={width:"2px",height:"32px",background:dk?"#333":"#bbb",borderRadius:"1px"};
  const vGrip={width:"32px",height:"2px",background:dk?"#333":"#bbb",borderRadius:"1px"};

  // Shared spectrum bar renderer with expand button
  function SpectrumBar({label, score, prev, isExit, open, onToggle}){
    const color = sC(score);
    const desireLabel = !isExit ? dL(score) : null;
    const exitLabel = isExit ? tL(score) : null;

    return <div style={{padding:"10px 16px",background:t.ba,borderBottom:open?`1px solid ${color}30`:`1px solid ${t.bd}`}}>
      {/* Top row */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <span style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",color:t.dm}}>{label}</span>
        <span style={{fontSize:"22px",fontWeight:900,color:color,lineHeight:1}}>{score}</span>
        {isExit && <span style={{fontSize:"10px",fontWeight:700,color:sC(score),background:sC(score)+"18",padding:"2px 8px",border:`1px solid ${sC(score)}33`}}>{exitLabel}</span>}
        {!isExit && <span style={{fontSize:"10px",fontWeight:700,color:sC(score),background:sC(score)+"18",padding:"2px 8px",border:`1px solid ${sC(score)}33`}}>{desireLabel}</span>}
        <span style={{fontSize:"10px",color:G,marginLeft:"auto"}}>{isExit ? "+6 this quarter" : `was ${prev} → ${score}`}</span>
        {/* Expand button */}
        <button onClick={onToggle} style={{
          display:"flex",alignItems:"center",gap:6,
          padding:"5px 12px",background:open?(Au+"18"):"transparent",
          border:`1px solid ${open?Au:t.bl}`,color:open?Au:t.ft,
          cursor:"pointer",fontFamily:F,fontSize:"9px",fontWeight:800,letterSpacing:"1px",
          transition:"all 0.15s",
        }}>
          {open?"▲ CLOSE":"▼ WHAT · WHY · SO WHAT"}
        </button>
      </div>
      {/* Description */}
      <div style={{fontSize:"10px",color:t.ft,marginBottom:6,lineHeight:1.5}}>
        {isExit ? "How prepared your company is to be acquired. Composite of all 9 PE due diligence categories." : "How much customers want you vs. tolerate you. Friction drives churn. Desire drives loyalty."}
      </div>
      {/* Spectrum gradient bar */}
      <div style={{position:"relative"}}>
        <div style={{height:"8px",background:GR,borderRadius:"999px"}}>
          <div style={{position:"absolute",left:`${score}%`,top:"-3px",width:"3px",height:"14px",background:dk?"#fff":"#1a1a1a"}}/>
        </div>
        {/* Exit tier labels */}
        {isExit && <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
          {["LIQUIDATION","EXIT UNLIKELY","DISRUPTION IMMINENT","MARKET VULNERABLE","EXIT POSSIBLE","EXIT READY"].map((l,i)=>
            <span key={i} style={{fontSize:"7px",color:SP[i===0?1:i===1?3:i===2?5:i===3?6:i===4?8:9],fontWeight:700}}>{l}</span>
          )}
        </div>}
        {/* Desire tier labels */}
        {!isExit && <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
          {["FEAR DOMINANT","FRICTION LOCKED","COMPLACENCY ZONE","AWAKENING","DESIRE BUILDING","CULT ECONOMICS"].map((l,i)=>
            <span key={i} style={{fontSize:"7px",color:SP[i===0?1:i===1?3:i===2?5:i===3?6:i===4?8:9],fontWeight:700}}>{l}</span>
          )}
        </div>}
      </div>
    </div>;
  }

  return <div className="analytics-scope" style={{fontFamily:F,background:t.bg,color:t.tx,height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",fontSize:"13px",lineHeight:1.6}}>
    <style>{scrollCSS}</style>

    {/* ══ HEADER ══ */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 28px",borderBottom:`1px solid ${t.bd}`,flexShrink:0}}>
      <div style={{display:"flex"}}>
        {[{k:"cmd",l:"COMMAND CENTER"},{k:"fin",l:"FINANCIAL FORENSICS"},{k:"data",l:"DATA ENTRY"}].map(v=>
          <button key={v.k} onClick={()=>setVw(v.k)} style={tbtn(vw===v.k)}>{v.l}</button>
        )}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:"11px",fontWeight:700,letterSpacing:"1.5px",color:t.dm}}>EXIT READINESS</span>
        <span style={{fontSize:"22px",fontWeight:900,color:sC(EX)}}>{EX}</span>
        <span style={{fontSize:"11px",color:G}}>+6</span>
      </div>
    </div>

    {/* ════ COMMAND CENTER ════ */}
    {vw==="cmd"&&<>
      {/* Valuation Bridge */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 28px",borderBottom:`1px solid ${t.bd}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={hdr}>VALUATION BRIDGE™</span>
          <span style={{fontSize:"11px",color:t.dm}}>Earnings</span>
          <span style={{fontSize:"16px",fontWeight:900}}>$2.0M</span>
          <span style={{fontSize:"16px",fontWeight:900,color:Au}}>6.05×</span>
          <span style={{fontSize:"16px",fontWeight:900}}>$12.1M</span>
          <span style={{fontSize:"11px",color:t.dm,marginLeft:8}}>Potential</span>
          <span style={{fontSize:"13px",fontWeight:700,color:G,textDecoration:"underline"}}>$13.7M</span>
          <span style={{fontSize:"11px",color:t.dm}}>Gap</span>
          <span style={{fontSize:"13px",fontWeight:700,color:R}}>$1.6M</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",background:dk?"#1a0800":"#fff3e0",border:`1px solid ${t.bd}`}}>
          <span style={hdr}>COST OF STANDING STILL</span>
          <span style={{fontSize:"20px",fontWeight:900,color:Au}}>$4,384</span>
          <span style={{fontSize:"10px",color:t.ft}}>/day</span>
          <span style={{fontSize:"9px",color:t.gh,marginLeft:6}}>WK $31K | MO $133K</span>
        </div>
      </div>

      {/* DUAL SPECTRUM BARS — NOW EXPANDABLE */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:t.bd,flexShrink:0}}>
        <SpectrumBar label="EXIT READINESS" score={EX} prev={57} leftLabel="LIQUIDATION" rightLabel="EXIT READY" isExit={true} open={exitOpen} onToggle={()=>{setExitOpen(!exitOpen);setDesireOpen(false)}}/>
        <SpectrumBar label="DESIRE AXIS™" score={DS} prev={61} leftLabel="FEAR = FRICTION" rightLabel="SURPRISE = DESIRE" isExit={false} open={desireOpen} onToggle={()=>{setDesireOpen(!desireOpen);setExitOpen(false)}}/>
      </div>

      {/* EXPAND PANELS */}
      {exitOpen && <div style={{flexShrink:0,overflow:"auto",maxHeight:"55vh"}}>
        <SpectrumPanel type="exit" score={EX} insight={EXIT_INSIGHT} dk={dk} t={t} onClose={()=>setExitOpen(false)}/>
      </div>}
      {desireOpen && <div style={{flexShrink:0,overflow:"auto",maxHeight:"55vh"}}>
        <SpectrumPanel type="desire" score={DS} insight={DESIRE_INSIGHT} dk={dk} t={t} onClose={()=>setDesireOpen(false)}/>
      </div>}

      {/* MAIN CONTENT — only shows when panels are closed */}
      {!exitOpen&&!desireOpen&&<div style={{flex:1,display:"flex",flexDirection:"column",padding:"10px 28px 0",minHeight:0,overflow:"hidden"}}>
        <div style={{fontSize:"12px",fontWeight:700,letterSpacing:"2.5px",color:t.dm,marginBottom:8,flexShrink:0}}>9 PE DUE DILIGENCE CATEGORIES — {TP} DATA POINTS</div>

        <div style={{display:"flex",flex:1,minHeight:0,overflow:"hidden"}}>
          {/* Treemap */}
          <div ref={tmRef} style={{flex:1,position:"relative",background:t.ba,overflow:"hidden",minHeight:200}}>
            {rects.map((r,i)=>{
              const idx=C.findIndex(c=>c.n===r.n);const sel=idx===sc,hov=idx===hc,ln=r.n.split("\n");
              const ar=(r.w2*r.h2)/(sz.w*sz.h||1),ts=Math.max(11,Math.min(16,ar*100));
              const isTop=idx===0;
              return <div key={i}
                onClick={()=>{setSc(idx);setDt("pts")}}
                onMouseEnter={()=>setHc(idx)}
                onMouseLeave={()=>setHc(null)}
                 style={{position:"absolute",left:r.x+1,top:r.y+1,width:r.w2-2,height:r.h2-2,
                   background:hexA(sC(r.s),hov||sel?0.5:0.2),
                   border:sel?`2px solid ${sC(r.s)}`:isTop?`2px solid ${Au}50`:`1px solid ${hexA(sC(r.s),hov?1:0.5)}`,
                   cursor:"pointer",padding:"10px 12px",display:"flex",flexDirection:"column",justifyContent:"space-between",transition:"background .15s, border-color .15s",overflow:"hidden"}}>

                {/* P1 badge for highest priority */}
                {isTop && <div style={{position:"absolute",top:8,right:8,fontSize:"8px",fontWeight:900,padding:"2px 6px",background:R+"20",color:R,border:`1px solid ${R}40`,letterSpacing:"1px"}}>P1</div>}
                <div>
                  <div style={{fontSize:`${ts}px`,fontWeight:800,letterSpacing:"1.5px",color:t.dm,lineHeight:1.2,textTransform:"uppercase",marginBottom:4}}>
                    {ln.map((l,j)=><div key={j}>{l}</div>)}
                  </div>
                  <div style={{fontSize:Math.max(22,ar*180)+"px",fontWeight:900,color:sC(r.s),lineHeight:1}}>
                    {r.s}<span style={{fontSize:"10px",color:r.s>50?G:R,marginLeft:"4px"}}>↕</span>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                  <span style={{fontSize:"9px",fontWeight:700,letterSpacing:"1px",color:sC(r.s),opacity:.7}}>{tL(r.s)}</span>
                  <span style={{fontSize:"10px",fontWeight:700,color:t.ft}}>{fmt(r.tr)}</span>
                </div>
              </div>;
            })}
          </div>

          {/* Drag handle */}
          <div onMouseDown={startDpDrag} style={{width:"8px",cursor:"col-resize",background:t.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,userSelect:"none"}}>
            <div style={hGrip}/>
          </div>

          {/* Detail panel */}
          <div style={{width:dpW,minWidth:320,maxWidth:640,flexShrink:0,background:t.ba,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.bd}`,flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"2px",lineHeight:1.3}}>{cat.n.replace("\n"," ")}</div>
                  <div style={{fontSize:"34px",fontWeight:900,color:sC(cat.s),lineHeight:1,marginTop:4}}>{cat.s}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"1px",color:t.ft,marginBottom:2}}>TRAPPED VALUE</div>
                  <div style={{fontSize:"20px",fontWeight:900,color:Au}}>{fmt(cat.tr)}</div>
                  <div style={{fontSize:"9px",color:G}}>+0.4× if fixed</div>
                </div>
              </div>
            </div>

            {/* S.U.M. Send Tray */}
            {tray.length>0&&<div style={{padding:"10px 16px",borderBottom:`1px solid ${t.bd}`,background:dk?"#111508":"#f5fde8",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  <span style={{fontSize:"11px",fontWeight:800}}>SEND VIA S.U.M.</span>
                  <span style={{fontSize:"10px",color:t.ft}}>{tray.length} selected</span>
                </div>
                <span onClick={clrT} style={{fontSize:"9px",color:t.ft,cursor:"pointer",textDecoration:"underline"}}>Clear all</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                {tray.map(x=><div key={x.id} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:x.type==="action"?Au+"15":t.ba,border:`1px solid ${x.type==="action"?Au+"40":t.bd}`,fontSize:"9px"}}>
                  <span style={{width:"6px",height:"6px",background:x.type==="action"?Au:sC(30)}}/>
                  <span style={{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.label}</span>
                  <span onClick={()=>remT(x.id)} style={{cursor:"pointer",color:t.ft}}>×</span>
                </div>)}
              </div>
              <div style={{display:"flex",gap:6}}>
                <div style={{flex:"0 0 90px"}}>
                  <div style={{fontSize:"8px",fontWeight:700,color:t.ft,marginBottom:2,letterSpacing:"1px"}}>SEND TO</div>
                  <input type="text" value={sTo} onChange={e=>setSTo(e.target.value)} placeholder="Name..." style={{width:"100%",padding:"6px 8px",background:t.bg,border:`1px solid ${t.bd}`,color:t.tx,fontSize:"10px",outline:"none"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"8px",fontWeight:700,color:t.ft,marginBottom:2,letterSpacing:"1px"}}>MESSAGE</div>
                  <div style={{display:"flex",gap:4}}>
                    <input type="text" value={sMsg} onChange={e=>setSMsg(e.target.value)} placeholder="Add context..." style={{flex:1,padding:"6px 8px",background:t.bg,border:`1px solid ${t.bd}`,color:t.tx,fontSize:"10px",outline:"none"}}/>
                    <button onClick={doSend} style={{padding:"6px 14px",background:sent?G:Au,border:"none",color:"#000",cursor:"pointer",fontFamily:F,fontSize:"10px",fontWeight:800,letterSpacing:"1px"}}>{sent?"SENT ✓":"SEND"}</button>
                  </div>
                </div>
              </div>
            </div>}

            {/* Linked AI action */}
            {(()=>{
              const a=AI.find(x=>x.lc===cat.n.replace("\n"," "));
              if(!a)return null;
              return <div style={{padding:"12px 16px",borderBottom:`1px solid ${t.bd}`,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <span style={{fontSize:"10px",fontWeight:700,letterSpacing:"1px",color:Au}}>GESTALT AI</span>
                  <span style={{fontSize:"9px",color:t.ft}}>— TOP PRIORITY</span>
                  <span style={{fontSize:"9px",fontWeight:900,padding:"2px 6px",background:R+"20",color:R,border:`1px solid ${R}30`}}>{a.pr}</span>
                </div>
                <div style={{fontSize:"13px",fontWeight:800,marginBottom:6,lineHeight:1.4}}>{a.ti}</div>
                <div style={{fontSize:"11px",color:t.md,lineHeight:1.6,marginBottom:8}}>{a.de}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:"12px",fontWeight:900,color:G}}>{a.im}</span>
                  <span style={{fontSize:"10px",color:t.ft}}>{a.tl}</span>
                  <span style={{fontSize:"10px",color:Au,fontWeight:700}}>→ {a.to}</span>
                  <button onClick={()=>addT(a.id,a.ti,"action")} style={{marginLeft:"auto",padding:"5px 12px",background:"transparent",border:`1px solid ${Au}40`,color:Au,cursor:"pointer",fontFamily:F,fontSize:"9px",fontWeight:700}}>↗ SEND VIA S.U.M.</button>
                </div>
              </div>;
            })()}

            {/* Tabs */}
            <div style={{display:"flex",borderBottom:`1px solid ${t.bd}`,flexShrink:0}}>
              {[{k:"summary",l:"SUMMARY"},{k:"pts",l:`${cat.p} DATA POINTS`},{k:"fix",l:"HOW TO FIX"}].map(tb=>
                <button key={tb.k} onClick={()=>setDt(tb.k)} style={{flex:1,padding:"10px 4px",background:dt===tb.k?(dk?"#1a1a1a":"#fff"):t.ba,border:"none",borderBottom:dt===tb.k?`2px solid ${Au}`:"2px solid transparent",color:dt===tb.k?t.tx:t.ft,cursor:"pointer",fontFamily:F,fontSize:"9px",fontWeight:700,letterSpacing:"1px"}}>{tb.l}</button>
              )}
            </div>

            <div style={{flex:1,overflow:"auto",padding:"14px 16px"}}>
              {dt==="summary"&&<div style={{fontSize:"12px",color:t.md,lineHeight:1.8}}>This category measures how dependent the business is on the current owner for daily operations, decisions, and relationships. Buyers need confidence the business runs without the seller.</div>}

              {dt==="pts"&&<div>
                <div style={{fontSize:"10px",color:t.ft,marginBottom:10,lineHeight:1.6}}>Click checkboxes to add to S.U.M. send tray. Multiple subcategories can stay open.</div>
                {cat.subs?cat.subs.map((sub,si)=>{
                  const pts=D.filter(d=>d.ci===sc&&d.si===si);const isOpen=!!openSubs[si];
                  return <div key={si} style={{marginBottom:3}}>
                    <div onClick={()=>togSub(si)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",cursor:"pointer",background:sB(sub.s,dk),border:`1px solid ${dk?"rgba(255,255,255,.04)":"rgba(0,0,0,.06)"}`}}>
                      <span style={{fontSize:"16px",fontWeight:900,color:sC(sub.s),minWidth:28}}>{sub.s}</span>
                      <span style={{fontSize:"11px",fontWeight:700,flex:1}}>{sub.n}</span>
                      <span style={{fontSize:"10px",color:t.ft}}>{sub.p} pts</span>
                      {pts.filter(p=>!p.f).length>0&&<span style={{fontSize:"9px",color:R}}>{pts.filter(p=>!p.f).length} missing</span>}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.ft} strokeWidth="2" style={{transform:isOpen?"rotate(90deg)":"",transition:"transform .15s"}}><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                    {isOpen&&pts.map((d,di)=><div key={di} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px 10px 22px",borderBottom:`1px solid ${t.bd}`,background:!d.f?(dk?"#1a0a0a":"#fde8e8"):t.ba}}>
                      <div onClick={()=>{if(tray.find(x=>x.id===d.id)){remT(d.id)}else{addT(d.id,d.q,"point")}}} style={{width:"15px",height:"15px",border:`1.5px solid ${tray.find(x=>x.id===d.id)?G:t.gh}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,background:tray.find(x=>x.id===d.id)?G+"15":"transparent"}}>
                        {tray.find(x=>x.id===d.id)&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <div style={{width:"8px",height:"8px",background:sC(d.s),flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"11px",color:d.f?t.tx:R,lineHeight:1.4}}>{d.q}</div>
                        <div style={{display:"flex",gap:6,marginTop:3}}>
                          <span style={{fontSize:"9px",color:t.ft}}>{d.sr}</span>
                          <EB_ type={d.e}/>
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        {ept===d.id
                          ?<div style={{display:"flex",alignItems:"center",gap:3}}><input type="text" value={ev} onChange={e=>setEv(e.target.value)} autoFocus style={{width:"52px",padding:"3px 6px",background:t.bg,border:`1px solid ${Au}`,color:t.tx,fontSize:"10px",textAlign:"center",outline:"none"}}/><span onClick={()=>setEpt(null)} style={{color:G,cursor:"pointer",fontWeight:900,fontSize:"11px"}}>✓</span></div>
                          :<div onClick={()=>{if(d.e==="m"){setEpt(d.id);setEv(d.v||"")}}} style={{cursor:d.e==="m"?"pointer":"default"}}>
                            <div style={{fontSize:"12px",fontWeight:800,color:d.f?t.tx:R}}>{d.f?d.v:"—"}</div>
                            <div style={{fontSize:"10px",color:sC(d.s)}}>{d.s}</div>
                            {d.e==="m"&&<div style={{fontSize:"8px",color:Au}}>click to edit</div>}
                          </div>
                        }
                      </div>
                    </div>)}
                  </div>;
                }):<div style={{fontSize:"11px",color:t.ft,padding:"20px 0"}}>Subcategory detail available after data integration.</div>}
              </div>}

              {dt==="fix"&&<div>
                <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",color:Au,marginBottom:10}}>RECOMMENDED ACTIONS</div>
                {["Document all founder-only decisions into SOPs|+8 pts → +0.2×","Name and develop a successor candidate|+12 pts → +0.3×","Execute 2-week founder vacation test|Validates all improvements"].map((a,i)=>{
                  const[t2,im]=a.split("|");
                  return <div key={i} style={{padding:"12px 14px",background:sB(cat.s,dk),border:`1px solid ${t.bd}`,marginBottom:6}}>
                    <div style={{fontSize:"12px",fontWeight:700,marginBottom:4}}>{i+1}. {t2}</div>
                    <div style={{fontSize:"10px",color:t.ft}}>Impact: {im}</div>
                  </div>;
                })}
              </div>}
            </div>
          </div>
        </div>

        {/* Vertical drag handle */}
        <div onMouseDown={startAiDrag} style={{height:"8px",cursor:"row-resize",background:t.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,userSelect:"none"}}>
          <div style={vGrip}/>
        </div>

        {/* AI Action List */}
        <div style={{height:aiH,minHeight:160,maxHeight:520,flexShrink:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"8px 0 6px",flexShrink:0}}>
            <div style={{fontSize:"13px",fontWeight:700,letterSpacing:"2px",color:Au}}>GESTALT AI</div>
            <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"1.5px"}}>PRIORITIZED ACTION LIST</div>
            <div style={{fontSize:"10px",color:t.ft,lineHeight:1.5}}>Ranked by valuation impact. Validated by 3+ sources. Check off or send via S.U.M.</div>
          </div>
          <div style={{flex:1,overflow:"auto"}}>
            {AI.map((a,i)=><div key={i} style={{display:"flex",gap:12,padding:"12px 14px",background:done[i]?(dk?"#0d1a0d":"#e8f5e8"):t.ba,borderBottom:`1px solid ${t.bd}`,opacity:done[i] ? 0.5 : 1,alignItems:"flex-start"}}>
              <div onClick={()=>setDone(p=>({...p,[i]:!p[i]}))} style={{width:"16px",height:"16px",border:`2px solid ${done[i]?G:t.gh}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:2,background:done[i]?G+"20":"transparent"}}>
                {done[i]&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:"9px",fontWeight:900,padding:"2px 7px",background:a.sv==="CRITICAL"?R+"20":a.sv==="HIGH"?W+"20":t.gh+"20",border:`1px solid ${a.sv==="CRITICAL"?R+"40":a.sv==="HIGH"?W+"40":t.gh+"40"}`,color:dk?"#fff":"#000"}}>{a.pr}</span>
                  <span style={{fontSize:"9px",fontWeight:700,color:a.sv==="CRITICAL"?R:a.sv==="HIGH"?W:t.dm}}>{a.sv}</span>
                  <span style={{fontSize:"10px",color:t.ft}}>Owner: {a.ow}</span>
                  <span style={{fontSize:"10px",fontWeight:700,color:Au,marginLeft:4}}>→ {a.to}</span>
                </div>
                <div style={{fontSize:"13px",fontWeight:800,marginBottom:4,lineHeight:1.4}}>{a.ti}</div>
                <div style={{fontSize:"11px",color:t.md,lineHeight:1.6,marginBottom:5}}>{a.de}</div>
                <div style={{fontSize:"9px",color:t.ft,fontStyle:"italic",marginBottom:6}}>SOURCES: {a.so}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:t.bg,border:`1px solid ${t.bd}`}}><span style={{fontSize:"8px",fontWeight:700,color:t.ft}}>IMPACT</span><span style={{fontSize:"11px",fontWeight:900,color:G}}>{a.im}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:t.bg,border:`1px solid ${t.bd}`}}><span style={{fontSize:"8px",fontWeight:700,color:t.ft}}>TIMELINE</span><span style={{fontSize:"10px",fontWeight:700}}>{a.tl}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:sB(a.ls,dk),border:`1px solid ${sC(a.ls)}30`}}><span style={{fontSize:"13px",fontWeight:900,color:sC(a.ls)}}>{a.ls}</span><span style={{fontSize:"8px",fontWeight:700,color:t.ft}}>{a.lc}</span></div>
                  <button onClick={()=>addT(a.id,a.ti,"action")} style={{padding:"5px 12px",background:"transparent",border:`1px solid ${t.bd}`,color:t.dm,cursor:"pointer",fontFamily:F,fontSize:"9px",fontWeight:700,marginLeft:"auto"}}>SEND VIA S.U.M.</button>
                  <button onClick={()=>setDone(p=>({...p,[i]:true}))} style={{padding:"5px 12px",background:"transparent",border:`1px solid ${t.bd}`,color:t.dm,cursor:"pointer",fontFamily:F,fontSize:"9px",fontWeight:700}}>MARK DONE</button>
                </div>
              </div>
            </div>)}
          </div>
        </div>
      </div>}
    </>}

    {/* ════ DATA ENTRY ════ */}
    {vw==="data"&&<div style={{flex:1,overflow:"auto",padding:"20px 28px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1px",background:t.bd,marginBottom:24}}>
        <div style={{padding:"18px 22px",background:t.ba}}>
          <div style={hdr}>DATA COMPLETENESS</div>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:6}}>
            <span style={{fontSize:"40px",fontWeight:900,color:Au,lineHeight:1}}>{cp}%</span>
            <span style={{fontSize:"11px",color:t.ft}}>{FILL} of {D.length} filled</span>
          </div>
          <div style={{height:"6px",background:t.bd,marginTop:10,borderRadius:"999px"}}><div style={{height:"100%",width:`${cp}%`,background:Au,borderRadius:"999px"}}/></div>
          <div style={{fontSize:"10px",color:t.ft,marginTop:6,lineHeight:1.6}}>{MISS} empty — each reduces buyer confidence</div>
        </div>
        <div style={{padding:"18px 22px",background:t.ba}}>
          <div style={hdr}>MULTIPLE CONFIDENCE</div>
          <div style={{fontSize:"26px",fontWeight:900,color:mcC,lineHeight:1,marginTop:6}}>{mcL}</div>
          <div style={{fontSize:"11px",color:t.md,lineHeight:1.6,marginTop:8}}>Buyers discount when data is incomplete. Every empty field is a question mark.</div>
          <div style={{fontSize:"10px",fontWeight:700,color:Au,marginTop:8}}>Fill {MISS} remaining → up to +0.5× multiple</div>
        </div>
        <div style={{padding:"18px 22px",background:t.ba}}>
          <div style={hdr}>DATA SOURCES</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
            {[[G,"Codat (QuickBooks)",COD],["#6e8cff","Auto (H.I.V.E.+FORMULA)",AUT],[W,"Manual entry",MAN],[R,"Missing",MISS]].map(([c,l,n],i)=>
              <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:"10px",height:"10px",background:c,flexShrink:0}}/>
                <span style={{fontSize:"11px",flex:1}}>{l}</span>
                <span style={{fontSize:"14px",fontWeight:900,color:c}}>{n}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:14}}>
        {[["all",`ALL (${D.length})`],["miss",`MISSING (${MISS})`],["m",`MANUAL (${MAN})`],["c",`CODAT (${COD})`],["a",`AUTO (${AUT})`]].map(([k,l])=>
          <button key={k} onClick={()=>setDf(k)} style={tbtn(df===k)}>{l}</button>
        )}
      </div>
      <div style={{fontSize:"10px",color:t.ft,marginBottom:12,lineHeight:1.6}}>More data = more transparency = higher multiples. Empty fields represent uncertainty buyers will discount.</div>
      {C.filter(c=>c.subs).map((pc,ci)=>{
        const pts=D.filter(d=>d.ci===ci);
        const flt=df==="all"?pts:df==="miss"?pts.filter(p=>!p.f):pts.filter(p=>p.e===df);
        if(!flt.length)return null;
        return <div key={ci} style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:sB(pc.s,dk),border:`1px solid ${dk?"rgba(255,255,255,.04)":"rgba(0,0,0,.06)"}`,marginBottom:2}}>
            <span style={{fontSize:"18px",fontWeight:900,color:sC(pc.s)}}>{pc.s}</span>
            <span style={{fontSize:"12px",fontWeight:800,letterSpacing:"1.5px"}}>{pc.n.replace("\n"," ")}</span>
            <span style={{fontSize:"10px",color:t.ft,marginLeft:"auto"}}>{flt.length}/{pts.length}</span>
            <span style={{fontSize:"10px",color:t.ft}}>Trapped: {fmt(pc.tr)}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 56px 60px 90px",padding:"6px 14px",background:t.bg,borderBottom:`1px solid ${t.bd}`}}>
            {["DATA POINT","VALUE","SCORE","SOURCE","ACTION"].map((h,i)=>
              <span key={i} style={{fontSize:"8px",fontWeight:700,letterSpacing:"1px",color:t.gh,textAlign:i>0?"center":"left"}}>{h}</span>
            )}
          </div>
          {flt.map((d,di)=><div key={di} style={{display:"grid",gridTemplateColumns:"1fr 80px 56px 60px 90px",padding:"8px 14px",borderBottom:`1px solid ${t.bd}`,background:!d.f?(dk?"#1a0a0a":"#fde8e8"):t.ba,alignItems:"center"}}>
            <div>
              <div style={{fontSize:"11px",color:d.f?t.tx:R,fontWeight:d.f?500:700,lineHeight:1.4}}>{d.q}</div>
              <div style={{fontSize:"8px",color:t.ft,marginTop:2}}>{d.sr}</div>
            </div>
            <div style={{textAlign:"center"}}>
              {ept===d.id
                ?<div style={{display:"flex",alignItems:"center",gap:2,justifyContent:"center"}}><input type="text" value={ev} onChange={e=>setEv(e.target.value)} autoFocus style={{width:"50px",padding:"3px 5px",background:t.bg,border:`1px solid ${Au}`,color:t.tx,fontSize:"10px",textAlign:"center",outline:"none"}}/><span onClick={()=>setEpt(null)} style={{color:G,cursor:"pointer",fontWeight:900}}>✓</span></div>
                :<span style={{fontSize:"11px",fontWeight:800,color:d.f?t.tx:R}}>{d.f?d.v:"—"}</span>
              }
            </div>
            <div style={{textAlign:"center"}}><span style={{fontSize:"13px",fontWeight:900,color:sC(d.s)}}>{d.s}</span></div>
            <div style={{textAlign:"center"}}><EB_ type={d.e}/></div>
            <div style={{textAlign:"center"}}>
              {d.e==="m"
                ?<button onClick={()=>{setEpt(d.id);setEv(d.v||"")}} style={{padding:"4px 10px",background:"transparent",border:`1px solid ${Au}40`,color:Au,cursor:"pointer",fontFamily:F,fontSize:"8px",fontWeight:700}}>{d.f?"EDIT":"ENTER"}</button>
                :d.e==="c"?<span style={{fontSize:"9px",color:G}}>Auto-synced</span>:<span style={{fontSize:"9px",color:"#6e8cff"}}>System</span>
              }
            </div>
          </div>)}
        </div>;
      })}
      <div style={{padding:"18px 22px",background:dk?"#0d1a0d":"#e8f5e8",border:`1px solid ${G}30`,marginTop:14}}>
        <div style={{fontSize:"12px",fontWeight:800,marginBottom:6}}>Want to automate this?</div>
        <div style={{fontSize:"11px",color:t.md,lineHeight:1.7,marginBottom:12}}>Connect QuickBooks via Codat to auto-fill financial data. Codat-verified entries are trusted more by buyers.</div>
        <button style={{padding:"8px 20px",background:G,border:"none",color:"#000",cursor:"pointer",fontFamily:F,fontSize:"10px",fontWeight:800,letterSpacing:"1px"}}>CONNECT QUICKBOOKS VIA CODAT</button>
      </div>
    </div>}

    {/* ════ FINANCIAL FORENSICS ════ */}
    {vw==="fin"&&<div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",margin:"18px 28px",background:t.bd}}>
        <div style={{background:t.ba,padding:"18px 22px"}}>
          <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",color:t.dm,marginBottom:6}}>EXIT READINESS</div>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:4}}>
            <span style={{fontSize:"40px",fontWeight:900,color:sC(EX),lineHeight:1}}>{EX}</span>
            <span style={{fontSize:"12px",fontWeight:700,color:G}}>+6 this quarter</span>
          </div>
          <div style={{fontSize:"12px",fontWeight:700,color:sC(EX),marginTop:4,letterSpacing:"1px"}}>{tL(EX)}</div>
          <div style={{fontSize:"11px",color:t.dm,margin:"10px 0",lineHeight:1.6}}>Weighted composite of all 9 PE categories.</div>
          <div style={{position:"relative",marginBottom:6}}>
            <div style={{height:"8px",background:GR,borderRadius:"999px"}}>
              <div style={{position:"absolute",left:`${EX}%`,top:"-2px",width:"3px",height:"12px",background:dk?"#fff":"#1a1a1a"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              {["LIQUIDATION","EXIT UNLIKELY","DISRUPTION IMMINENT","MARKET VULNERABLE","EXIT POSSIBLE","EXIT READY"].map((l,i)=>
                <span key={i} style={{fontSize:"7px",color:SP[i===0?1:i===1?3:i===2?5:i===3?6:i===4?8:9],fontWeight:700}}>{l}</span>
              )}
            </div>
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
            {C.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:sB(c.s,dk)}}>
              <span style={{fontSize:"14px",fontWeight:900,color:sC(c.s),minWidth:22}}>{c.s}</span>
              <span style={{fontSize:"8px",color:t.md,lineHeight:1.3}}>{c.n.replace("\n"," ")}</span>
              <span style={{fontSize:"7px",color:t.gh,marginLeft:"auto"}}>{c.w}%</span>
            </div>)}
          </div>
        </div>
        <div style={{background:t.ba,padding:"18px 22px"}}>
          <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",color:t.dm,marginBottom:6}}>DESIRE AXIS™</div>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:4}}>
            <span style={{fontSize:"40px",fontWeight:900,color:sC(DS),lineHeight:1}}>{DS}</span>
            <span style={{fontSize:"12px",fontWeight:700,color:G}}>was 61 → {DS}</span>
          </div>
          <div style={{fontSize:"11px",color:t.dm,margin:"10px 0",lineHeight:1.6}}>Customer desire vs tolerance.</div>
          <div style={{position:"relative",marginBottom:6}}>
            <div style={{height:"8px",background:GR,borderRadius:"999px"}}>
              <div style={{position:"absolute",left:`${DS}%`,top:"-2px",width:"3px",height:"12px",background:dk?"#fff":"#1a1a1a"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{fontSize:"7px",color:"#4f0200",fontWeight:700}}>FEAR = FRICTION</span>
              <span style={{fontSize:"7px",color:"#5fcc00",fontWeight:700}}>SURPRISE = DESIRE</span>
            </div>
          </div>
          <div style={{marginTop:12}}>
            {DC.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px",borderBottom:`1px solid ${t.bd}`}}>
              <span style={{fontSize:"14px",fontWeight:900,color:sC(c.nm),minWidth:26}}>{c.nm}</span>
              <span style={{fontSize:"10px",color:t.md,flex:1}}>{c.n}</span>
              <span style={{fontSize:"10px",fontWeight:700}}>{c.r}</span>
              <span style={{fontSize:"8px",color:t.gh}}>{c.w}%</span>
            </div>)}
          </div>
        </div>
      </div>
      <div style={{margin:"0 28px 18px"}}>
        <div style={{fontSize:"13px",fontWeight:700,letterSpacing:"2px",color:t.dm,marginBottom:6}}>FINANCIAL PERFORMANCE</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"1px",background:t.bd}}>
          {[["Trailing Revenue","$6.7M","18% YoY","#fff"],["Adjusted Earnings","$2.0M",`+${fmt(TA)} addbacks`,Au],["Earnings Margin","18.2%","Target: 22%+",sC(72)],["Multiple","6.05×","Industry: 5.2×",Au],["Enterprise Value","$12.1M","Potential $13.7M",G]].map(([l,v,s2,c],i)=>
            <div key={i} style={{padding:"14px 18px",background:t.ba}}>
              <div style={{fontSize:"9px",fontWeight:700,letterSpacing:"1.5px",color:t.dm,marginBottom:4}}>{l}</div>
              <div style={{fontSize:"24px",fontWeight:900,color:c,lineHeight:1}}>{v}</div>
              <div style={{fontSize:"10px",color:t.ft,marginTop:4}}>{s2}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{margin:"0 28px 18px"}}>
        <div style={{display:"flex",marginBottom:18}}>
          {[["rev","REVENUE & EARNINGS"],["adj","OWNER ADJUSTMENTS"],["flags","FORENSIC FLAGS"]].map(([k,l])=>
            <button key={k} onClick={()=>setFt(k)} style={{...tbtn(ft===k),flex:1}}>{l}</button>
          )}
        </div>
        {ft==="rev"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div><div style={{fontSize:"11px",fontWeight:700,letterSpacing:"1.5px",color:t.dm,marginBottom:12}}>MONTHLY REVENUE (12MO)</div><Bar data={RV} labels={MO} color={Au}/></div>
          <div><div style={{fontSize:"11px",fontWeight:700,letterSpacing:"1.5px",color:t.dm,marginBottom:12}}>MONTHLY EARNINGS</div><Bar data={EB} labels={MO} color="#8ccc00"/></div>
        </div>}
        {ft==="adj"&&<div>
          <div style={{padding:"16px 20px",background:t.ba,border:`1px solid ${t.bd}`,borderLeft:`4px solid ${Au}`,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",color:Au,marginBottom:2}}>TOTAL ADDBACKS</div><div style={{fontSize:"30px",fontWeight:900,color:Au}}>{fmt(TA)}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:"11px",color:t.dm}}>Reported: $1.79M</div><div style={{fontSize:"11px",color:t.dm}}>+ Addbacks: {fmt(TA)}</div><div style={{fontSize:"13px",fontWeight:700,color:G,marginTop:4}}>= Adjusted: $2.0M</div></div>
            </div>
          </div>
          {AB.map((a,i)=><div key={i} style={{display:"flex",gap:16,padding:"14px 20px",borderBottom:`1px solid ${t.bd}`,borderLeft:`4px solid ${a.f==="red"?R:W}`,background:t.ba,marginBottom:2}}>
            <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:700,marginBottom:4}}>{a.i}</div><div style={{fontSize:"10px",color:t.dm,lineHeight:1.5}}>{a.n}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:"20px",fontWeight:900,color:a.f==="red"?R:W}}>{fmt(a.a)}</div><div style={{fontSize:"8px",color:t.ft}}>ANNUAL</div></div>
          </div>)}
        </div>}
        {ft==="flags"&&<div>
          {FL.map((f,i)=><div key={i} style={{padding:"16px 20px",background:t.ba,border:`1px solid ${t.bd}`,borderLeft:`4px solid ${f.sv==="critical"?R:f.sv==="warning"?W:G}`,marginBottom:10}}>
            <span style={{fontSize:"10px",fontWeight:700,letterSpacing:"1px",padding:"3px 10px",background:`${f.sv==="critical"?R:f.sv==="warning"?W:G}18`,color:f.sv==="critical"?R:f.sv==="warning"?W:G,border:`1px solid ${f.sv==="critical"?R:f.sv==="warning"?W:G}33`}}>{f.sv.toUpperCase()}</span>
            <div style={{fontSize:"14px",fontWeight:800,lineHeight:1.4,margin:"8px 0"}}>{f.ti}</div>
            <div style={{fontSize:"12px",color:t.md,lineHeight:1.7,marginBottom:8}}>{f.de}</div>
            <div style={{fontSize:"10px",color:t.ft,paddingLeft:14,borderLeft:`2px solid ${t.bd}`}}>SOURCE: {f.sr}</div>
          </div>)}
        </div>}
      </div>
      <div style={{padding:"16px 28px",background:dk?"#0d0d0d":"#f0ede6",border:`1px solid ${t.bd}`,margin:"0 28px 28px"}}>
        <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",color:t.ft,marginBottom:6}}>DATA VERIFICATION</div>
        <div style={{fontSize:"11px",color:t.ft,lineHeight:1.6}}>Financials from Codat (QuickBooks). Forensic flags cross-reference ANALYTICS, FOCUS, H.I.V.E. Trailing 12 months.</div>
      </div>
    </div>}
  </div>;
}

