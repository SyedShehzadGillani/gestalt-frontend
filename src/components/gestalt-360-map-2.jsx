import { useState, useRef, useCallback } from "react";

// ─── SVG GEOMETRY ─────────────────────────────────────────────────────────────
const CX = 440, CY = 440;
const RC = 74, R1 = 81, R2 = 180, R3 = 187, R4 = 305, R5 = 312, R6 = 358;
const toRad = d => (d - 90) * Math.PI / 180;

function arcPath(r1, r2, s, e, gap = 1.4) {
  const a = toRad(s + gap / 2), b = toRad(e - gap / 2);
  const lg = e - s > 180 ? 1 : 0;
  const x1=CX+r2*Math.cos(a),y1=CY+r2*Math.sin(a);
  const x2=CX+r2*Math.cos(b),y2=CY+r2*Math.sin(b);
  const x3=CX+r1*Math.cos(b),y3=CY+r1*Math.sin(b);
  const x4=CX+r1*Math.cos(a),y4=CY+r1*Math.sin(a);
  return `M${x1},${y1} A${r2},${r2} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 ${lg} 0 ${x4},${y4}Z`;
}
function centroid(r, s, e) {
  const m = toRad((s+e)/2);
  return [CX+r*Math.cos(m), CY+r*Math.sin(m)];
}
function innerRot(mid) { return mid < 180 ? mid : mid - 180; }
function arcText(r, s, e, flip=false) {
  const mid=(s+e)/2, norm=mid<0?mid+360:mid;
  const bot = flip ? !(norm>90&&norm<=270) : (norm>90&&norm<=270);
  if (bot) {
    const a=toRad(e-0.5),b=toRad(s+0.5);
    return `M${CX+r*Math.cos(a)},${CY+r*Math.sin(a)} A${r},${r} 0 0 0 ${CX+r*Math.cos(b)},${CY+r*Math.sin(b)}`;
  }
  const a=toRad(s+0.5),b=toRad(e-0.5);
  return `M${CX+r*Math.cos(a)},${CY+r*Math.sin(a)} A${r},${r} 0 0 1 ${CX+r*Math.cos(b)},${CY+r*Math.sin(b)}`;
}

// ─── SPECTRUM ─────────────────────────────────────────────────────────────────
const SPECTRUM = [
  {pct:0,   color:"#4f0200"},
  {pct:10,  color:"#6e231f"},
  {pct:20,  color:"#873025"},
  {pct:30,  color:"#a44f24"},
  {pct:40,  color:"#ba702a"},
  {pct:50,  color:"#c0933b"},
  {pct:60,  color:"#e2e200"},
  {pct:70,  color:"#cff200"},
  {pct:80,  color:"#8ccc00"},
  {pct:90,  color:"#5fcc00"},
  {pct:100, color:"#5fcc00"},
];
const SPECTRUM_LABELS = [
  {pct:0,   label:"LIQUIDATION",         align:"left"},
  {pct:20,  label:"EXIT UNLIKELY",        align:"center"},
  {pct:40,  label:"DISRUPTION IMMINENT",  align:"center"},
  {pct:62,  label:"MARKET VULNERABLE",    align:"center"},
  {pct:80,  label:"EXIT POSSIBLE",        align:"center"},
  {pct:100, label:"EXIT READY",           align:"right"},
];
function specGradient() {
  return SPECTRUM.map(s=>`${s.color} ${s.pct}%`).join(", ");
}
function specColorAt(score) {
  for (let i=0;i<SPECTRUM.length-1;i++) {
    const a=SPECTRUM[i],b=SPECTRUM[i+1];
    if (score>=a.pct&&score<=b.pct) {
      const t=(score-a.pct)/(b.pct-a.pct);
      const lerp=(x,y)=>Math.round(x+(y-x)*t);
      const hr=parseInt(a.color.slice(1,3),16),hg=parseInt(a.color.slice(3,5),16),hb=parseInt(a.color.slice(5,7),16);
      const tr=parseInt(b.color.slice(1,3),16),tg=parseInt(b.color.slice(3,5),16),tb=parseInt(b.color.slice(5,7),16);
      return `rgb(${lerp(hr,tr)},${lerp(hg,tg)},${lerp(hb,tb)})`;
    }
  }
  return "#78b956";
}
function specLabelAt(score) {
  if (score<=16) return "LIQUIDATION";
  if (score<=33) return "EXIT UNLIKELY";
  if (score<=49) return "DISRUPTION IMMINENT";
  if (score<=65) return "MARKET VULNERABLE";
  if (score<=82) return "EXIT POSSIBLE";
  return "EXIT READY";
}

const OVERALL = 65;
const OVERALL_COLOR = specColorAt(OVERALL);
const OVERALL_LABEL = specLabelAt(OVERALL);
const OVERALL_COLOR_DARK = OVERALL_COLOR.replace(/rgb\((\d+),(\d+),(\d+)\)/,
  (_,r,g,b) => `rgb(${Math.round(r*.75)},${Math.round(g*.75)},${Math.round(b*.75)})`);

// ─── SEGMENT DATA ─────────────────────────────────────────────────────────────
const INNER = [
  {
    id:"strategy",label:"STRATEGY",module:"FORMULA",start:-45,end:45,color:"#c9a227",dim:"30",
    axisLabel:"Defines where the company is going, what it will sacrifice to get there, and why.",
    tag:"STRATEGY",
    headline:"Strategy: Knowing Where You're Going — and What You're Refusing to Do",
    summary:"Strategy is the deliberate choice of where your company is going — and equally important, what you're saying no to in order to get there. Most business owners are busy. Busy is not the same as strategic. Every decision made without a clear strategy costs you at exit.",
    insight:"A company without a clear strategy drifts. It chases every opportunity, reacts to every competitor, and ends up being average at many things instead of dominant at one. When a potential buyer evaluates your business, the first question they ask is: does this company know who it is? If the answer isn't immediate and obvious, they start reducing what they're willing to pay.",
    gestalt:"GESTALT's FORMULA system guides business owners through a structured strategy process — from understanding your market position today, to building the exact roadmap needed to reach the exit valuation you want. Every decision, every hire, every campaign is measured against a single strategic direction.",
    metric:"Companies with a clearly defined strategy outperform peers by 304% in total shareholder return. Firms with formal strategic planning processes achieve 12.9% higher revenue growth. (MIT Sloan Management Review, 2017; McKinsey Strategic Planning Survey, 2018)",
  },
  {
    id:"leadership",label:"LEADERSHIP",module:"H.I.V.E.",start:45,end:135,color:"#cc4444",dim:"38",
    axisLabel:"The system that runs the business without the founder — distributed, measured, scalable.",
    tag:"LEADERSHIP",
    headline:"Leadership: The Most Valuable Business You Can Build Is One That Runs Without You.",
    summary:"Every buyer asks one question before any other: if the founder left on Day 1, what breaks? The answer determines your multiple more than revenue, more than growth rate, more than market position. Leadership is not a personality trait. It is a system — deliberately built, continuously measured, and distributed across every role.",
    insight:"H.I.V.E. identifies your culture carriers and your flight risks simultaneously. It spots the employee scoring 0.9 across all four quadrants — exceeding every expectation, elevating everyone around them. It also spots the employee whose PERSONAL score is declining while KNOWLEDGE is stagnant — the early signal that disengagement has begun, months before a resignation letter arrives.",
    gestalt:"GESTALT's H.I.V.E. system transforms leadership from a gut-feel judgment into a data-driven discipline. Position Builder defines what exceptional performance looks like for every role. Growth Opportunity scores identify who is ready for promotion, who needs intervention, and who is carrying the culture forward.",
    metric:"Companies with strong leadership bench strength are 1.9× more likely to achieve above-median financial performance. Organizations with distributed leadership practices generate 25% more revenue per employee. (Deloitte Human Capital Trends, 2019; Harvard Business Review Leadership Study, 2015)",
  },
  {
    id:"culture",label:"CULTURE",module:"H.I.V.E.",start:135,end:225,color:"#e07800",dim:"2c",
    axisLabel:"The behaviors your organization produces when no one is watching, scored every quarter.",
    tag:"CULTURE",
    headline:"Culture: The Root of Every Problem and Every Advantage",
    summary:"Culture is the set of behaviors your organization produces when no one is watching. It is where complacency is born — and where it is killed. GESTALT doesn't ask your employees how they feel about your culture. H.I.V.E. measures what they actually do, every quarter, across every role.",
    insight:"H.I.V.E. scores every employee across four quadrants: PERSONAL (the whole human — life, wellbeing, what's happening outside work), CUSTOMER (how they serve), STAFF (how they collaborate), and KNOWLEDGE (what they know and whether they share it). The Growth Opportunity is the gap between where that person is and where they could be. When large across your organization, complacency has taken root.",
    gestalt:"A 0.5 means the employee meets job requirements. A 1.0 means Michael Jordan — exceeding every expectation, closing their Growth Opportunity completely, and raising the standard for everyone around them. That is the culture GESTALT builds.",
    metric:"Companies in the top quartile of organizational health deliver 3× total shareholder return versus bottom quartile peers. Culture-driven companies achieve 4× revenue growth and 72% higher employee engagement scores. (McKinsey Organizational Health Index, 2017; Deloitte Culture Study, 2016)",
  },
  {
    id:"brand",label:"BRAND",module:"FORMULA",rotOverride:-90,start:225,end:315,color:"#6baa44",dim:"30",
    axisLabel:"The governing identity that no competitor can replicate and no acquisition can acquire.",
    tag:"BRAND",
    headline:"Brand: The Only Asset Your Competitors Cannot Copy",
    summary:"Brand is the governing agent of every decision in your business. It determines who you hire, how you serve, what you build, and what story the market tells about you when you're not in the room. Businesses with strong brands attract customers who wouldn't consider switching, employees who believe in the mission, and buyers who pay a premium to own the identity.",
    insight:"Apple didn't become the most valuable company in history because of superior technology. Apple won because their brand created a belief system — values so clearly expressed in every product, every store, and every interaction that customers don't just buy Apple, they identify with it. OVO LASIK didn't win by offering better surgery. They won by building a brand that made patients feel like they were joining something.",
    gestalt:"GESTALT's FORMULA system builds your brand from the inside out — starting with the VISION CORE that defines who you are, through the BRAND CORE that governs every external expression of that identity. Every CAMPAIGN CORE must align to the BRAND CORE before execution begins.",
    metric:"The top 40 most valuable global brands generate 76% higher shareholder returns than the S&P 500. Strong B2B brands generate 3× higher revenue growth than weak brands. (Interbrand Best Global Brands, 2023; McKinsey B2B Branding Study, 2022)",
  },
];

const MIDDLE = [
  {
    id:"operations",label:"OPERATIONS",axis:"STRATEGY",impact:"EFFICIENCY",start:-45,end:-15,color:"#d4a82a",tag:"STRATEGY / OPERATIONS",dimMid:"4a",dimOut:"62",
    headline:"Operations: The Invisible Engine That Determines What Your Business Is Worth",
    summary:"Operations is the system that turns your strategy into reality. It is the difference between a business that performs consistently and one that depends on heroic individual effort every day. When operations are systematized and documented, the business becomes an asset. When they aren't, the business is a job.",
    insight:"Every PE firm runs an operations audit before they close. They're not looking for perfection — they're looking for repeatability. Can this business produce the same result next quarter without the founder in the room? 'That's how we've always done it' is the most expensive sentence in business.",
    gestalt:"GESTALT maps your operational systems against your exit goals — identifying the processes that are founder-dependent, undocumented, or inconsistently executed. The AI prioritizes which gaps create the most valuation risk and sequences fixes against your exit timeline.",
    metric:"Companies with formally documented operational processes are 3× more likely to achieve above-average profitability. Operational excellence leaders achieve 5× higher revenue growth than industry average. (APQC Process Performance Management Study, 2019; McKinsey Operations Survey, 2020)",
    outerHeadline:"Efficiency Is Not Cutting Costs. It's Eliminating the Work That Shouldn't Exist.",
    outerSummary:"Every inefficient process is a hidden tax — on margins, on morale, and on the time your best people spend managing workarounds instead of creating value.",
    outerInsight:"The businesses that scale profitably aren't the ones that work hardest — they're the ones that have systematically eliminated every redundant process, every approval chain nobody questions, and every tool people use because it's familiar rather than effective.",
    outerMetric:"A 1% improvement in operational efficiency translates directly to 1.1–1.5× improvement in EBITDA margin, compounding into the exit multiple. Companies ranking in the top quartile of operational efficiency achieve 25% higher profit margins. (McKinsey Global Operations Survey, 2021)",
  },
  {
    id:"marketing",label:"MARKETING",axis:"STRATEGY",impact:"MARKET SHARE",start:-15,end:15,color:"#c9a227",tag:"STRATEGY / MARKETING",dimMid:"39",dimOut:"52",
    headline:"Marketing: Market Leaders Sell Transformation. Everyone Else Sells Features.",
    summary:"Marketing is not advertising. It is the story your company tells about the future a customer gets when they choose you. Companies that lead markets make their customer the hero of that story — and position their product as the tool that gets them there.",
    insight:"Geek Squad did not sell computer repair. They sold the elimination of helplessness. OVO LASIK did not sell eye surgery. They sold the experience of waking up every morning seeing the world without glasses. When you understand the exact fear your customer is carrying and eliminate it better than anyone else, marketing stops being an expense and becomes a growth engine.",
    gestalt:"GESTALT's BRAND CORE and CAMPAIGN CORE systems build every campaign starting with a single question: what is the customer afraid of? Every campaign moves from the customer's current fear, through the experience of choosing you, to the moment of surprise and delight that makes them tell everyone they know.",
    metric:"Consistently presented brands are 3.5× more likely to have excellent brand visibility. Companies with strong brand differentiation achieve 31% higher revenue than competitors. (Lucidpress Brand Consistency Study, 2019; McKinsey Consumer Survey, 2020)",
    outerHeadline:"Market Share Is Not Won in the Market. It's Won in the Mind.",
    outerSummary:"The company with the largest market share is not always the best product. It is the best story — the brand that most clearly occupies a specific position in the customer's mind and defends it relentlessly.",
    outerInsight:"Market share is the scoreboard of positioning. It tells you whether your marketing is working — not in impressions or clicks, but in the only metric that matters: did the customer choose you?",
    outerMetric:"Market leaders — companies ranked #1 or #2 in their category — generate 30–40% higher profit margins than #3 or lower competitors. The #1 brand in a category captures on average 3× the profit of the #2 brand. (Harvard Business Review Profit Impact of Market Strategy, 2018)",
  },
  {
    id:"sales",label:"SALES",axis:"STRATEGY",impact:"REVENUE GROWTH",start:15,end:45,color:"#b08818",tag:"STRATEGY / SALES",dimMid:"28",dimOut:"4e",
    headline:"Sales: Are Your People Selling Outcomes — or Just Describing Products?",
    summary:"Sales is the only business function that directly produces revenue. But most sales teams are trained to describe what their product does rather than what changes in the customer's life when they choose it. That difference determines whether you compete on price or on value.",
    insight:"Customers do not buy products. They buy the outcome a product promises. When your sales team understands the exact outcome your product delivers — and the exact fear it eliminates — they stop being salespeople and become advisors. Advisors close at higher prices and with higher loyalty.",
    gestalt:"GESTALT's FORMULA system ensures every customer interaction is grounded in a consistent strategy. The Desire Axis framework trains your team to open with the customer's fear and close with the specific transformation your product delivers.",
    metric:"Companies with a formal, documented sales process achieve 18% more revenue than those without. Sales organizations with consistent methodology in place win 48% of forecasted deals vs. 40% without. (Sales Management Association, 2019; CSO Insights World-Class Sales Practices Report, 2019)",
    outerHeadline:"Sustainable Revenue Growth Is a System, Not a Personality.",
    outerSummary:"Revenue built on the founder's relationships, the top salesperson's hustle, or a single channel is not an asset — it's a dependency. Buyers pay a premium for revenue that is repeatable, documented, and transferable.",
    outerInsight:"The difference between a business that sells for 3× and one that sells for 8× is rarely the total revenue number. It is the quality of the revenue — how predictable, how diversified, and how clearly it can continue growing after the founder leaves.",
    outerMetric:"Businesses with recurring revenue streams are valued at 2–3× higher EBITDA multiples than equivalent transactional revenue businesses. Subscription and contract-based revenue reduces valuation risk and increases buyer competition at exit. (SaaS Capital Annual Survey, 2023; Bain Capital PE Valuation Study, 2021)",
  },
  {
    id:"finance",label:"FINANCE",axis:"LEADERSHIP",impact:"PROFITABILITY",start:45,end:75,color:"#dd5555",tag:"LEADERSHIP / FINANCE",dimMid:"4a",dimOut:"62",
    headline:"PE Firms Don't Buy Revenue. They Buy Clean, Transferable Cash Flow.",
    summary:"Financial governance is the single most scrutinized variable in any acquisition. Clean books, documented cash flow, and PE-ready reporting don't just make due diligence faster — they signal to every buyer that this is a professionally run business.",
    insight:"Most businesses have financials that tell a complicated story — owner compensation structured for tax efficiency, personal expenses run through the business. These are rational choices that become expensive at exit. Buyers discount for complexity. They pay a premium for clarity.",
    gestalt:"GESTALT's ANALYTICS module translates your operational and behavioral data into PE/M&A language — surfacing your Valuation Bridge, quantifying your Complacency Tax, and showing exactly which financial gaps are creating the most exit risk.",
    metric:"Companies with audited financial statements and clean books reduce due diligence time by 35–50% and achieve higher final valuations due to reduced buyer risk premium. EBITDA quality — clean, recurring, non-owner-adjusted — is the single most scrutinized variable in PE acquisitions. (PwC M&A Integration Survey, 2022; Deloitte Private Equity Outlook, 2023)",
    outerHeadline:"Revenue Is What You Make. Profit Quality Is What You're Worth.",
    outerSummary:"Buyers don't value revenue — they value clean, recurring, growing profit. A business with $500K in predictable EBITDA often commands a higher multiple than one with $1M in messy, founder-adjusted earnings.",
    outerInsight:"A company doing $5M in revenue with $500K in clean EBITDA will often sell for more than one doing $8M with $1M in lumpy, unpredictable EBITDA. Buyers pay for certainty and trajectory — not just size.",
    outerMetric:"A 1-point improvement in EBITDA margin is worth 6–10× that improvement in enterprise value at a typical acquisition multiple. Profit quality — recurring, predictable, growing — is worth more than equivalent revenue with variability. (EY Deal Valuation Study, 2022; Kroll Valuation Advisory, 2023)",
  },
  {
    id:"technology",label:"TECHNOLOGY",axis:"LEADERSHIP",impact:"SCALABILITY",start:75,end:105,color:"#cc4444",tag:"LEADERSHIP / TECHNOLOGY",dimMid:"39",dimOut:"52",
    headline:"A Business That Needs You to Operate It Is Worth Far Less Than One That Doesn't",
    summary:"Technology means: has your company systematized how it operates well enough that it could grow without hiring proportionally more people — and without requiring you personally to make every important decision?",
    insight:"When a buyer evaluates your business, they are asking whether they are buying an asset or a job. Businesses that use technology to document processes, automate repeatable work, and systematize decision-making are easier to run, easier to scale, and dramatically more attractive to acquire.",
    gestalt:"GESTALT is itself the technology infrastructure that makes your business systematized and acquirable. It captures performance data automatically, surfaces strategic priorities through AI, and creates a living record of how your business operates — so when you exit, the buyer is acquiring a machine, not a dependency.",
    metric:"Technology-enabled companies achieve 1.7× higher revenue per employee than industry average. Digitally advanced companies are 26% more profitable and grow 9% faster than their lower-maturity peers. (McKinsey Digital Quotient Study, 2020; Deloitte Digital Transformation Survey, 2021)",
    outerHeadline:"A Business That Grows by Adding Headcount Is Not Scalable. It's Just Bigger.",
    outerSummary:"Scalability means your revenue can grow faster than your costs. It means doubling your customer base without doubling your team. Technology is what makes that possible — and what makes your business exponentially more attractive to a buyer.",
    outerInsight:"When a PE firm evaluates your business, one of the first questions is: what happens if we inject capital and try to grow this 3×? If the answer is 'we'd need to hire proportionally,' the valuation goes down. If the answer is 'the systems are built for it,' the valuation goes up.",
    outerMetric:"Companies with high scalability scores — revenue growing faster than headcount — achieve 2.2× higher EBITDA multiples at exit. Software and platform businesses with proven scalability command 8–15× revenue multiples vs. 4–6× for service businesses. (Bessemer Venture Partners Cloud Index, 2023; GP Bullhound Technology M&A Report, 2022)",
  },
  {
    id:"knowledge",label:"KNOWLEDGE",axis:"LEADERSHIP",impact:"EXIT READINESS",midRot:300,start:105,end:135,color:"#aa3333",tag:"LEADERSHIP / KNOWLEDGE",dimMid:"28",dimOut:"4e",
    headline:"When Your Best People Leave, What Stays Behind?",
    summary:"In most businesses, the most valuable asset walks out the door every night. It lives in the founder's head, in the senior manager's relationships, in the institutional memory of the person who has been there longest. When they leave, that knowledge disappears with them.",
    insight:"H.I.V.E.'s KNOWLEDGE quadrant scores every employee's depth of expertise and — critically — their knowledge-sharing behavior. Not what they know. What they do with what they know. An employee scoring high on technical skill but low on sharing is a knowledge hoarder — a single point of failure and a direct threat to your exit valuation.",
    gestalt:"GESTALT AI reads knowledge-sharing patterns across the entire organization simultaneously — identifying silos, flagging hoarders, and surfacing the employees whose knowledge depth represents both your greatest asset and your greatest key-man risk.",
    metric:"Knowledge management systems increase employee productivity by 35% and reduce time spent searching for information by 35%. Companies with systematized knowledge transfer reduce key-man risk — a factor that can reduce acquisition valuation by 15–25% when concentrated in one individual. (McKinsey Global Institute, 2012; PwC People & Organization Survey, 2021)",
    outerHeadline:"Exit Readiness Is Not a Destination. It's an Operating Standard You Build Toward Every Day.",
    outerSummary:"Most businesses are not ready to be sold the day the founder decides to sell. Exit readiness means building the business every day as if a buyer is doing due diligence tomorrow.",
    outerInsight:"When institutional memory lives in systems rather than individuals, when processes are documented rather than assumed, and when the leadership team can answer every due diligence question without the founder — the business is exit-ready. That state is built over years, not 90 days.",
    outerMetric:"Businesses where the founder is not required for daily operations sell in 40% less time and with significantly fewer post-closing escrow holdbacks and earn-out structures. Exit-ready companies maintain documentation sufficient for a buyer to operate independently within 90 days. (IBBA Market Pulse Survey, 2022; BizBuySell Transaction Report, 2023)",
  },
  {
    id:"talent",label:"TALENT",axis:"CULTURE",impact:"TALENT RETENTION",midRot:330,start:135,end:165,color:"#e88800",tag:"CULTURE / TALENT",dimMid:"4a",dimOut:"62",
    headline:"Your Best People Are Always Being Recruited. The Question Is Whether You See It Coming.",
    summary:"High performers don't leave suddenly. They leave slowly — disengaging over months while still collecting a paycheck, still showing up, still going through the motions. By the time a resignation letter arrives, the real departure happened long ago.",
    insight:"A declining PERSONAL score next to a stagnant KNOWLEDGE score next to a dropping STAFF score is not a coincidence — it is a pattern. Replacing that person will cost 213% of their annual salary — not including the institutional knowledge they take, the client relationships that may follow, or the signal their departure sends to every high performer watching.",
    gestalt:"H.I.V.E.'s Growth Opportunity score is the retention signal. A large, growing gap means this employee has significant uncaptured potential — and if the organization isn't closing it, a competitor will. GESTALT AI surfaces these patterns in real time.",
    metric:"Replacing an employee costs 213% of their annual salary for highly trained positions. Organizations in the top quartile for employee engagement experience 59% less turnover and 23% higher profitability. (Center for American Progress, 2012; Gallup State of the American Workplace, 2023)",
    outerHeadline:"Retention Is Not a Benefits Problem. It's a Visibility Problem.",
    outerSummary:"High performers leave when they feel invisible — when their contribution isn't measured, their growth isn't invested in, and their potential isn't acknowledged.",
    outerInsight:"The cost of losing a top performer isn't just the 213% of annual salary to replace them. It's the clients who trusted them, the team that watched them leave, and the institutional knowledge that walked out the door.",
    outerMetric:"Companies with high employee retention in the 24 months prior to sale demonstrate workforce stability — a key due diligence factor for PE buyers assessing post-acquisition risk. High voluntary turnover can reduce acquisition valuations by 15–30% through risk adjustments. (Mercer M&A Readiness Study, 2022; Aon HR M&A Survey, 2021)",
  },
  {
    id:"alignment",label:"ALIGNMENT",axis:"CULTURE",impact:"TEAM UNITY",start:165,end:195,color:"#e07800",tag:"CULTURE / ALIGNMENT",dimMid:"39",dimOut:"52",
    headline:"Misalignment Is the Silent Tax on Every Dollar Your Business Generates",
    summary:"Alignment is the organizational discipline of moving in the same direction at the same time with shared intelligence. When alignment breaks down, execution slows, decisions conflict, and the best employees start wondering why they're working this hard.",
    insight:"The most dangerous form of complacency builds quietly in the space between departments — managers who protect information rather than sharing it, decisions made in isolation that contradict decisions made elsewhere. This is not a personality problem. It is a structural problem. And structure can be fixed.",
    gestalt:"S.U.M. (Strategic Unified Messaging) is the alignment engine. It captures whether knowledge is being shared or hoarded, whether teams are communicating or siloing, and whether the company's stated vision is reflected in its daily decisions.",
    metric:"Organizations with high alignment achieve 2.3× higher revenue growth and 3.5× higher total shareholder return than lower-alignment peers. Aligned companies are 72% more profitable. (Korn Ferry Organizational Alignment Study, 2019; Institute for Corporate Productivity, 2018)",
    outerHeadline:"A Team That Pulls in Different Directions Isn't a Team. It's an Overhead Cost.",
    outerSummary:"Team unity is the measurable state where every person understands the direction, trusts the people around them, and contributes their best without needing to protect their position.",
    outerInsight:"Misalignment is the most expensive organizational problem that never appears on a financial statement. It shows up as duplicated work, conflicting decisions, slowed execution, and the quiet exodus of high performers who got tired of working in a company that couldn't get out of its own way.",
    outerMetric:"Teams with high cohesion are 5× more likely to perform at a high level. Companies with strong cross-functional collaboration are 5× more likely to be high performing. Poor collaboration costs companies $37 billion annually in lost productivity. (Salesforce State of the Connected Customer, 2022; Korn Ferry, 2019)",
  },
  {
    id:"support",label:"SUPPORT",axis:"CULTURE",impact:"CUSTOMER LOYALTY",start:195,end:225,color:"#c06600",tag:"CULTURE / SUPPORT",dimMid:"28",dimOut:"4e",
    headline:"The Customer Who Had a Problem — and Got It Solved — Is Your Most Loyal Customer",
    summary:"Customer support is not a cost center to minimize. It is your highest-leverage moment to build lasting loyalty. The way your company responds when something goes wrong tells a customer more about who you are than any advertisement ever will.",
    insight:"Cult brands are not built on perfection. They are built on recovery. Chewy writes handwritten condolence notes when a customer's pet dies. The Ritz-Carlton empowers any employee to spend $2,000 to resolve a guest complaint without manager approval. Your support team either builds loyalty or erodes it, one interaction at a time.",
    gestalt:"GESTALT's H.I.V.E. system scores every customer-facing employee across binary behavioral questions about how they actually behave — not how they're trained, but what they do. The patterns reveal whether your team is building customer advocacy or quietly losing it.",
    metric:"A 5% increase in customer retention produces 25–95% increase in profits. Customer acquisition costs 5–25× more than retention. Companies with NPS scores in the top quartile grow at more than 2× the rate of competitors. (Harvard Business School — Reichheld & Sasser, 1990; Bain & Company Net Promoter System Research, 2021)",
    outerHeadline:"Loyalty Is Not Satisfaction. It's the Decision to Never Consider Anyone Else.",
    outerSummary:"A satisfied customer will leave for a 10% discount. A loyal customer will pay a premium to stay and tell everyone they know why they should join them.",
    outerInsight:"Customer loyalty is the ultimate expression of your culture working correctly. It means your front-line employees are delivering your brand promise consistently and your customer doesn't just buy what you sell — they believe in what you stand for.",
    outerMetric:"Loyal customers are worth 10× their first purchase on average. The top 10% most loyal customers spend 3× more per order than the bottom 90%. A customer who refers others has a 16–25% higher lifetime value than one who doesn't. (Adobe Digital Index, 2021; Harvard Business Review Customer Loyalty Economics, 2020)",
  },
  {
    id:"innovation",label:"INNOVATION",axis:"BRAND",impact:"DISRUPTION",start:225,end:255,color:"#7bba54",tag:"BRAND / INNOVATION",dimMid:"4a",dimOut:"62",
    headline:"Every Company Ever Disrupted Saw It Coming. They Just Moved Too Slowly.",
    summary:"Innovation is not a department or an annual offsite exercise. It is the organizational practice of continuously questioning how things are done and acting on the answers before a competitor does. Companies that institutionalize this practice are nearly impossible to disrupt.",
    insight:"Speed of innovation is not primarily a technology challenge — it is an organizational permission challenge. The question is not whether your team has good ideas. They do. The question is whether the culture gives them permission to surface those ideas and the leadership gives them the authority to act.",
    gestalt:"GESTALT's Story Engine — built into S.U.M. — gives every employee a structured channel to submit ideas, have them validated through peer review, and see the best ones elevated to the FORMULA strategy system. Innovation becomes an operating model, not an occasional event.",
    metric:"Top innovators generate 2.4× higher total shareholder returns over a decade. Companies that invest in innovation in downturns outperform peers by 30% when recovery begins. The top 20% most innovative companies generate 80% of total innovation-driven economic value. (BCG Most Innovative Companies Report, 2023; McKinsey Innovation Survey, 2021)",
    outerHeadline:"Disruption Is Not a Threat to Manage. It's a Standard to Maintain.",
    outerSummary:"The companies that disrupt markets see disruption as an internal practice — institutionalizing the questioning of every assumption and empowering every employee to propose a better way.",
    outerInsight:"Every company that was disrupted had smart people who saw it coming. What they lacked was the organizational permission to act. GESTALT's Story Engine exists specifically to close that gap.",
    outerMetric:"Strategic acquirers pay a 15–35% premium above financial buyers for companies with defensible innovation pipelines. Innovation-active companies are 2.4× more likely to achieve above-median revenue growth. (BCG Innovation Value Creation Study, 2022; Deloitte M&A Trends Report, 2023)",
  },
  {
    id:"research",label:"RESEARCH",axis:"BRAND",impact:"COMPETITIVE INTEL",midFlip:true,textFlip:true,start:255,end:285,color:"#6baa44",tag:"BRAND / RESEARCH",dimMid:"39",dimOut:"52",
    headline:"The Most Dangerous Words in Business Are 'I Think Our Customers Want'",
    summary:"Most companies make strategic decisions based on the assumptions of the people in the room. Research replaces assumption with evidence. It tells you what your best customers actually value, what your lost customers actually decided, and what your market will actually support.",
    insight:"The companies that consistently win are the most accurately informed. They know their customer's decision process better than the customer knows it themselves. Companies that guess at what customers want compete on price. Companies that know compete on value.",
    gestalt:"GESTALT's INSIGHT phase is the structured intelligence-gathering engine that precedes all strategy work. It extracts what your best customers believe, identifies barriers your team encounters daily, and surfaces the gaps between what leadership thinks is true and what the organization is actually experiencing.",
    metric:"Data-driven organizations are 23× more likely to acquire customers and 6× more likely to retain them. Companies that use customer analytics comprehensively report 126% profit improvement over competitors that don't. (McKinsey Analytics Study, 2013; McKinsey Global Institute Big Data Report, 2011)",
    outerHeadline:"The Companies That Win Know What Their Competitors Don't Know They Know.",
    outerSummary:"Competitive intelligence is the discipline of understanding your market more deeply than anyone else — what your best customers actually value, what your lost customers actually decided.",
    outerInsight:"Most businesses operate on assumptions about their competitive position that haven't been validated in years. Research that is systematic, continuous, and connected to strategy is one of the rarest and most valuable capabilities a company can build.",
    outerMetric:"Companies with active competitive intelligence programs are 2× as likely to respond effectively to competitive threats. Organizations that use CI systematically achieve 15% faster revenue growth than those that don't. 69% of enterprises that upgraded their CI programs reported better decision-making outcomes. (SCIP Competitive Intelligence Benchmark Report, 2021; Crayon State of Competitive Intelligence, 2023)",
  },
  {
    id:"product",label:"PRODUCT",axis:"BRAND",impact:"MARKET POSITION",midRot:300,start:285,end:315,color:"#5a9a34",tag:"BRAND / PRODUCT",dimMid:"28",dimOut:"4e",
    headline:"The Market Doesn't Need Another Version of What Already Exists",
    summary:"Your product is your argument in the marketplace. Every day it exists, it is either making a compelling case that customers should choose you — or it is making a quiet case for why they shouldn't bother. There is no neutral position.",
    insight:"The most transformative products were built by founders who refused to accept that the current solution was adequate. They didn't ask customers what features they wanted — they observed what problems customers were tolerating. Design thinking means starting with what your customer is afraid of, frustrated by, or resigned to.",
    gestalt:"GESTALT's BRAND CORE system audits your product through the lens of unresolved customer fear and friction — surfacing the gaps your current product doesn't address and the positioning opportunities your competitors have overlooked.",
    metric:"Product-led growth companies achieve 2× faster revenue growth than sales-led companies. Companies with a clear, differentiated product position achieve net revenue retention above 120% — a primary valuation driver for acquirers. (OpenView Product Benchmarks Report, 2023; Bessemer Atlas Cloud Report, 2023)",
    outerHeadline:"Market Position Is Not Where You Think You Are. It's Where Your Customer Puts You.",
    outerSummary:"Your market position is the answer to one question: when customers need what you sell, do they think of you first? If the answer is no — or 'maybe' — you are competing on price.",
    outerInsight:"The businesses that dominate their categories didn't get there by being everything to everyone. They got there by being the only answer to one specific question. Geek Squad owned 'who do I call when my computer breaks.' OVO LASIK owned 'who gives me back my life without glasses.'",
    outerMetric:"Category leaders — companies that own a clear, primary position in their market — achieve 60–70% gross margins vs. 40–50% for undifferentiated competitors. The #1 brand in a category is worth 3× the #2 brand in acquisition valuation. (BCG Value Creation Study, 2022; Millward Brown BrandZ, 2023)",
  },
];

const ALL = [...INNER, ...MIDDLE];

// ─── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg:"#0a0a0a",bg2:"#111111",
  border:"#1e1e1e",border2:"#181818",
  text1:"#ffffff",text2:"#c0c0c0",text3:"#909090",text4:"#606060",text5:"#404040",
  gold:"#c9a227",goldDim:"rgba(201,162,39,0.06)",goldBorder:"rgba(201,162,39,0.12)",
  svgBg1:"#141414",svgBg2:"#0a0a0a",svgRing:"#1c1c1c",
  centerBg:"#0c0c0c",centerHov:"#111111",
};
const LIGHT = {
  bg:"#f4f3ef",bg2:"#eeede9",
  border:"#d8d7d3",border2:"#dddcd8",
  text1:"#0a0a0a",text2:"#151515",text3:"#3a3a3a",text4:"#606060",text5:"#909090",
  gold:"#b08818",goldDim:"rgba(176,136,24,0.06)",goldBorder:"rgba(176,136,24,0.15)",
  svgBg1:"#e8e7e3",svgBg2:"#f4f3ef",svgRing:"#d0cfc9",
  centerBg:"#eeede9",centerHov:"#e4e3df",
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function GESTALT360() {
  const [dark,        setDark]       = useState(true);
  const [wheelActive, setWheelActive]= useState(null);
  const [wheelHover,  setWheelHover] = useState(null);
  const [outerActive, setOuterActive]= useState(null);
  const [outerHover,  setOuterHover] = useState(null);

  const T          = dark ? DARK : LIGHT;
  const detailRef  = useRef(null);
  const secRefs    = useRef({});

  // ── Viewport-math scroll: section lands exactly at top of container ──────
  const scrollTo = useCallback((key) => {
    const el        = secRefs.current[key];
    const container = detailRef.current;
    if (!el || !container) return;
    const cRect  = container.getBoundingClientRect();
    const eRect  = el.getBoundingClientRect();
    const target = container.scrollTop + (eRect.top - cRect.top);
    container.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const onWheelEnter = id  => setWheelHover(id);
  const onWheelLeave = ()  => setWheelHover(null);
  const onWheelClick = id  => {
    const next = wheelActive === id ? null : id;
    setWheelActive(next);
    setOuterActive(null);
    scrollTo(next || "center");
  };
  const onOuterEnter = id  => setOuterHover(id);
  const onOuterLeave = ()  => setOuterHover(null);
  const onOuterClick = id  => {
    const next = outerActive === id ? null : id;
    setOuterActive(next);
    setWheelActive(null);
    scrollTo(next ? id + "_outer" : "center");
  };

  const isCenterActive = (wheelActive || wheelHover) === "center";
  const noSelection    = !wheelActive && !outerActive && !wheelHover && !outerHover;

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"24px 16px 40px", boxSizing:"border-box", transition:"background 0.3s"
    }}>

      {/* ── HEADER ── */}
      <div style={{ textAlign:"center", marginBottom:16, position:"relative", width:"100%", maxWidth:1360 }}>
        <button onClick={()=>setDark(d=>!d)} style={{
          position:"absolute", right:0, top:0,
          background:"transparent", border:`1px solid ${T.border}`,
          color:T.text3, fontSize:9, letterSpacing:2, fontWeight:700,
          padding:"6px 12px", cursor:"pointer", fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",
          textTransform:"uppercase", transition:"all 0.2s"
        }}>
          {dark?"LIGHT MODE":"DARK MODE"}
        </button>
        <div style={{ fontSize:9, letterSpacing:5, color:T.gold, fontWeight:800, textTransform:"uppercase", marginBottom:5 }}>
          GESTALT PARTNERS
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.text1, letterSpacing:4, textTransform:"uppercase" }}>
          360° Organizational Intelligence Map
        </div>
        <div style={{ width:28, height:1, background:T.gold, margin:"8px auto" }}/>
        <div style={{ fontSize:9, color:T.text4, letterSpacing:2, textTransform:"uppercase" }}>
          Complacency Kills — There Is No Competition, Complacency Is The Competition
        </div>
      </div>

      {/* ── TWO PANELS ── */}
      <div style={{ display:"flex", width:"100%", maxWidth:1360, alignItems:"flex-start" }}>

        {/* ── WHEEL ── */}
        <div style={{ flex:"0 0 auto" }}>

          {/* EXIT READINESS BAR — lives above the wheel, same width */}
          <div style={{ width:940, maxWidth:"100%", marginBottom:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:10, letterSpacing:3, color:T.text3, fontWeight:700, textTransform:"uppercase" }}>
                  Exit Readiness
                </span>
                <span style={{ fontSize:26, fontWeight:900, color:dark?OVERALL_COLOR:OVERALL_COLOR_DARK, letterSpacing:0.5 }}>
                  {OVERALL}
                </span>
                <span style={{ fontSize:9, color:dark?OVERALL_COLOR:OVERALL_COLOR_DARK, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase" }}>
                  {OVERALL_LABEL}
                </span>
              </div>
              <span style={{ fontSize:10, color:specColorAt(90), fontWeight:700, letterSpacing:1 }}>+6 this quarter</span>
            </div>
            <div style={{ fontSize:9, color:T.text4, marginBottom:8 }}>
              How prepared your company is to be acquired. Composite of all 16 systems.
            </div>
            <div style={{ position:"relative", height:7, borderRadius:4, overflow:"visible",
              background:`linear-gradient(to right, ${specGradient()})` }}>
              <div style={{
                position:"absolute", top:-6, bottom:-6, width:3, borderRadius:2,
                background:"#fff", left:`calc(${OVERALL}% - 1.5px)`,
              }}/>
            </div>
            <div style={{ position:"relative", height:16, marginTop:5 }}>
              {SPECTRUM_LABELS.map((s,i) => {
                const isFirst = i === 0;
                const isLast  = i === SPECTRUM_LABELS.length - 1;
                return (
                  <div key={i} style={{
                    position:"absolute",
                    left:  isFirst ? 0 : isLast ? "auto" : `${s.pct}%`,
                    right: isLast  ? 0 : "auto",
                    transform: (!isFirst && !isLast) ? "translateX(-50%)" : "none",
                    fontSize:7.5, color:specColorAt(s.pct), fontWeight:700,
                    letterSpacing:0.3, whiteSpace:"nowrap"
                  }}>
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>
          <svg width={940} height={940} viewBox="-20 -20 920 920"
            style={{ display:"block", maxWidth:"100%", height:"auto" }}>
            <defs>
              <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={T.gold} stopOpacity="0.18"/>
                <stop offset="100%" stopColor={T.gold} stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="bgg" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={T.svgBg1}/>
                <stop offset="100%" stopColor={T.svgBg2}/>
              </radialGradient>
              {MIDDLE.map((s,i)=>(
                <path key={`tp-${i}`}  id={`tp-${i}`}
                  d={arcText((R5+R6)/2,s.start,s.end,!!s.textFlip)} fill="none"/>
              ))}
              {MIDDLE.map((s,i)=>(
                <path key={`tpm-${i}`} id={`tpm-${i}`}
                  d={arcText((R3+R4)/2,s.start,s.end,!!s.midFlip)} fill="none"/>
              ))}
            </defs>

            <circle cx={CX} cy={CY} r={R6+4} fill="url(#bgg)"/>
            {/* Ring borders — NO hairline cross dividers */}
            {[RC,R2,R4,R6].map((r,i)=>(
              <circle key={i} cx={CX} cy={CY} r={r}
                fill="none" stroke={T.svgRing} strokeWidth="1"/>
            ))}

            {/* INNER RING */}
            {INNER.map((seg,i)=>{
              const mid=(seg.start+seg.end)/2;
              const rot=seg.rotOverride??innerRot(mid);
              const isAct=wheelActive===seg.id||(!wheelActive&&wheelHover===seg.id);
              const [tx,ty]=centroid((R1+R2)/2,seg.start,seg.end);
              const rd=toRad(mid),px=Math.cos(rd),py=Math.sin(rd);
              const lx=tx-px*9,ly=ty-py*9,mx=tx+px*10,my=ty+py*10;
              return (
                <g key={i} onMouseEnter={()=>onWheelEnter(seg.id)} onMouseLeave={onWheelLeave}
                  onClick={()=>onWheelClick(seg.id)} style={{cursor:"pointer"}}>
                  <path d={arcPath(R1,R2,seg.start,seg.end,2)}
                    fill={`${seg.color}${isAct?"55":seg.dim}`}
                    stroke={seg.color} strokeWidth={isAct?"2.5":"1.2"}
                    style={{transition:"all 0.2s"}}/>
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${rot},${lx},${ly})`}
                    fill={isAct?"#fff":seg.color}
                    fontSize="11" fontWeight="800" letterSpacing="2.5"
                    style={{fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",pointerEvents:"none",transition:"fill 0.2s"}}>
                    {seg.label}
                  </text>
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${rot},${mx},${my})`}
                    fill={seg.color} fontSize="7" fontWeight="700" letterSpacing="1.5"
                    opacity={isAct?"0.9":"0.45"}
                    style={{fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",pointerEvents:"none"}}>
                    {seg.module}
                  </text>
                </g>
              );
            })}

            {/* MIDDLE RING */}
            {MIDDLE.map((seg,i)=>{
              const isAct=wheelActive===seg.id||(!wheelActive&&wheelHover===seg.id);
              return (
                <g key={i} onMouseEnter={()=>onWheelEnter(seg.id)} onMouseLeave={onWheelLeave}
                  onClick={()=>onWheelClick(seg.id)} style={{cursor:"pointer"}}>
                  <path d={arcPath(R3,R4,seg.start,seg.end,1.1)}
                    fill={`${seg.color}${isAct?"50":seg.dimMid}`}
                    stroke={seg.color} strokeWidth={isAct?"2":"0.6"}
                    strokeOpacity={isAct?"1":"0.55"}
                    style={{transition:"all 0.2s"}}/>
                  <text fill={isAct?(dark?"#fff":T.text1):seg.color}
                    fontSize="9" fontWeight="700" letterSpacing="1.2"
                    style={{fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",pointerEvents:"none",transition:"fill 0.2s"}}>
                    <textPath href={`#tpm-${i}`} startOffset="50%" textAnchor="middle">
                      {seg.label}
                    </textPath>
                  </text>
                </g>
              );
            })}

            {/* OUTER BAND */}
            {MIDDLE.map((seg,i)=>{
              const isAct=outerActive===seg.id||(!outerActive&&outerHover===seg.id);
              return (
                <g key={i} onMouseEnter={()=>onOuterEnter(seg.id)} onMouseLeave={onOuterLeave}
                  onClick={()=>onOuterClick(seg.id)} style={{cursor:"pointer"}}>
                  <path d={arcPath(R5,R6,seg.start,seg.end,1.1)}
                    fill={`${seg.color}${isAct?"60":seg.dimOut}`}
                    stroke={seg.color} strokeWidth={isAct?"1.2":"0.5"}
                    strokeOpacity="0.85" style={{transition:"all 0.2s"}}/>
                  <text fill={isAct?(dark?"#fff":T.text1):seg.color}
                    fontSize="8" fontWeight="700" letterSpacing="0.8"
                    style={{fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",pointerEvents:"none",transition:"fill 0.2s"}}>
                    <textPath href={`#tp-${i}`} startOffset="50%" textAnchor="middle">
                      {seg.impact}
                    </textPath>
                  </text>
                </g>
              );
            })}

            {/* CENTER — score only, no TAP text */}
            <g onMouseEnter={()=>onWheelEnter("center")} onMouseLeave={onWheelLeave}
              onClick={()=>onWheelClick("center")} style={{cursor:"pointer"}}>
              <circle cx={CX} cy={CY} r={RC} fill="url(#cg)"
                stroke={isCenterActive?"#e2b53f":T.gold}
                strokeWidth={wheelActive==="center"?"2.5":isCenterActive?"2":"1.5"}
                style={{transition:"all 0.2s"}}/>
              <circle cx={CX} cy={CY} r={RC-4}
                fill={isCenterActive?T.centerHov:T.centerBg}
                style={{transition:"all 0.2s"}}/>
              <text x={CX} y={CY+4} textAnchor="middle"
                fill={dark?OVERALL_COLOR:OVERALL_COLOR_DARK} fontSize="58" fontWeight="900" opacity="0.75"
                style={{fontFamily:"'Gotham','Montserrat',system-ui,sans-serif",pointerEvents:"none",dominantBaseline:"middle"}}>
                {OVERALL}
              </text>
            </g>
          </svg>
        </div>

        {/* ── RIGHT: DETAIL SCROLL ── */}
        <div
          ref={detailRef}
          style={{
            flex:1, minWidth:0,
            height:940, overflowY:"scroll",
            paddingLeft:28, paddingRight:10,
            paddingTop:0, paddingBottom:80,
            boxSizing:"border-box",
            scrollbarWidth:"thin",
            scrollbarColor:`${T.border} ${T.bg}`,
          }}
        >
          {/* ── DEFAULT (center) section — renders at scroll position 0 ── */}
          <div ref={el=>{ secRefs.current["center"]=el; }} style={{marginBottom:44}}>
            <DetailBlock T={T} dark={dark}
              tag="GESTALT 360° INTELLIGENCE MAP"
              headline="16 Systems. One Number. Your Exit Valuation."
              summary="This map shows the 16 interconnected systems that determine what your business is worth — and what it will be worth the day you sell it. Most business owners actively manage 3 or 4 of these. GESTALT measures all 16 simultaneously, scores each one, and shows you exactly where value is being lost."
              insight="Complacency is a cultural disease. It starts with a team that stops questioning, a leader who stops challenging, and a process nobody has reviewed in years. But it doesn't stay in culture — it migrates directly to your balance sheet. It is the primary reason most businesses sell for 3–4× EBITDA when they could command 8–10×."
              gestalt="GESTALT Partners was founded on a single observation: the most valuable businesses in the world — the ones that dominate markets, build fierce customer loyalty, and exit at premium multiples — all share a common operating model. GESTALT is the platform that makes that operating model accessible to every business owner, regardless of size."
              metric="GESTALT clients systematically move from 3–4× EBITDA to 8–10× EBITDA multiples by closing the gaps revealed across the 16 systems on this map."
              accentColor={T.gold}
              isActive={wheelActive==="center"||noSelection}
            />
          </div>

          {/* ── ALL 16 SEGMENTS ── */}
          {ALL.map(seg=>{
            const isWheelAct = wheelActive===seg.id||(!wheelActive&&wheelHover===seg.id);
            const isOuterAct = outerActive===seg.id||(!outerActive&&outerHover===seg.id);
            return (
              <div key={seg.id}>
                {/* Main segment section */}
                <div
                  ref={el=>{ secRefs.current[seg.id]=el; }}
                  style={{marginBottom: seg.outerHeadline ? 6 : 44}}
                >
                  <DetailBlock T={T} dark={dark}
                    tag={seg.tag} headline={seg.headline}
                    summary={seg.summary} insight={seg.insight}
                    gestalt={seg.gestalt} metric={seg.metric}
                    accentColor={seg.color} isActive={isWheelAct}
                  />
                </div>
                {/* Outer band sub-section */}
                {seg.outerHeadline && (
                  <div
                    ref={el=>{ secRefs.current[seg.id+"_outer"]=el; }}
                    style={{
                      marginBottom:44,
                      paddingLeft:14,
                      borderLeft:`2px solid ${T.border2}`,
                    }}
                  >
                    <DetailBlock T={T} dark={dark}
                      tag={`${seg.axis} / ${seg.label} / ${seg.impact}`}
                      headline={seg.outerHeadline}
                      summary={seg.outerSummary}
                      insight={seg.outerInsight}
                      metric={seg.outerMetric}
                      accentColor={seg.color} isActive={isOuterAct} compact
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div style={{
        display:"flex", marginTop:20,
        justifyContent:"space-evenly", alignItems:"flex-start",
        borderTop:`1px solid ${T.border2}`, paddingTop:18,
        maxWidth:1360, width:"100%"
      }}>
        {INNER.map((seg,i)=>{
          const isAct=wheelActive===seg.id||wheelHover===seg.id;
          return (
            <div key={i}
              onMouseEnter={()=>onWheelEnter(seg.id)}
              onMouseLeave={onWheelLeave}
              onClick={()=>onWheelClick(seg.id)}
              style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer",maxWidth:280}}>
              <div style={{
                width:2, height:24, background:seg.color, flexShrink:0, marginTop:2,
                boxShadow:isAct?`0 0 6px ${seg.color}`:"none", transition:"box-shadow 0.2s"
              }}/>
              <div>
                <div style={{
                  fontSize:10, fontWeight:800, color:isAct?T.text1:seg.color,
                  letterSpacing:1.5, transition:"color 0.2s", marginBottom:4
                }}>
                  {seg.label}
                </div>
                <div style={{fontSize:11,color:T.text3,lineHeight:1.65,maxWidth:240}}>
                  {seg.axisLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:16,fontSize:10,color:T.text5,letterSpacing:2.5,textAlign:"center"}}>
        GESTALT PARTNERS — VISIBLE. VERIFIED. MULTIPLE.
      </div>
    </div>
  );
}

// ─── DETAIL BLOCK ─────────────────────────────────────────────────────────────
function DetailBlock({
  T, dark, tag, headline, summary, insight,
  gestalt, metric, accentColor, isActive, compact
}) {
  // Split headline on ":" — prefix renders ALLCAPS in accentColor bold, rest renders light weight
  const colonIdx = headline.indexOf(":");
  const hasPrefix = colonIdx > 0;
  const headlinePrefix = hasPrefix ? headline.slice(0, colonIdx).toUpperCase() : null;
  const headlineRest   = hasPrefix ? headline.slice(colonIdx + 1).trim() : headline;

  return (
    <div style={{opacity:isActive?1:0.4, transition:"opacity 0.3s"}}>
      <div style={{
        fontSize:11, letterSpacing:2.5, color:accentColor,
        fontWeight:800, textTransform:"uppercase", marginBottom:9
      }}>
        {tag}
      </div>
      <div style={{
        fontSize:compact?12:14, lineHeight:1.35,
        marginBottom:11, borderLeft:`2px solid ${accentColor}`, paddingLeft:10,
      }}>
        {hasPrefix ? (
          <>
            <span style={{
              fontWeight:900, color:accentColor,
              letterSpacing:1.5, marginRight:10
            }}>
              {headlinePrefix}
            </span>
            <span style={{fontWeight:400, color:T.text1}}>
              {headlineRest}
            </span>
          </>
        ) : (
          <span style={{fontWeight:900, color:T.text1}}>{headline}</span>
        )}
      </div>
      <div style={{fontSize:11,color:T.text2,lineHeight:1.9,marginBottom:11,fontWeight:500}}>
        {summary}
      </div>
      <div style={{height:1,background:T.border2,marginBottom:11}}/>
      <div style={{fontSize:11,color:T.text3,lineHeight:1.9,marginBottom:11}}>
        {insight}
      </div>
      {gestalt && (
        <div style={{
          background:T.goldDim, border:`1px solid ${T.goldBorder}`,
          padding:"10px 14px", marginBottom:10
        }}>
          <div style={{
            fontSize:11, color:T.gold, letterSpacing:2.5,
            fontWeight:800, textTransform:"uppercase", marginBottom:5
          }}>
            How GESTALT Solves This
          </div>
          <div style={{fontSize:11,color:T.text3,lineHeight:1.9}}>{gestalt}</div>
        </div>
      )}
      <div style={{
        border:`1px solid ${T.border2}`,
        borderLeft:`2px solid ${accentColor}`,
        padding:"8px 14px"
      }}>
        <div style={{
          fontSize:11, color:T.text4, letterSpacing:2.5,
          fontWeight:700, textTransform:"uppercase", marginBottom:5
        }}>
          Exit Impact
        </div>
        <div style={{fontSize:11,color:T.text2,lineHeight:1.75,fontWeight:600}}>{metric}</div>
      </div>
    </div>
  );
}

// ─── NAMED EXPORTS for embedding ──────────────────────────────────────────────
export { CX, CY, RC, R1, R2, R3, R4, R5, R6, toRad, arcPath, centroid, innerRot, arcText };
export { INNER, MIDDLE, ALL, DARK, LIGHT, specColorAt as wheelSpecColorAt };
