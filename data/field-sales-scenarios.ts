export interface FieldObjectionScenario {
  id: string;
  icon: string;
  category: 'rate' | 'process' | 'trust' | 'competitor' | 'product' | 'timing';
  product: string;
  objection: string;
  customerContext: string;
  competitorMentioned: string;
  suggestedApproach: string;
}

export interface ProspectResearchScenario {
  id: string;
  icon: string;
  category: 'corporate' | 'individual' | 'merchant';
  title: string;
  description: string;
  customerProfile: string;
  productFocus: string;
  meetingContext: string;
  researchPrompt: string;
}

export interface ClosingScenario {
  id: string;
  icon: string;
  title: string;
  situation: string;
  products: string[];
  challenge: string;
  prompt: string;
}

export const FIELD_OBJECTION_SCENARIOS: FieldObjectionScenario[] = [
  {
    id: 'obj-rate-hl',
    icon: '🏠',
    category: 'rate',
    product: 'Home Loan',
    objection: 'SBI is giving me 8.25% and you are asking 8.50%. Over 20 years that is almost 4 lakhs extra. Why would I pay more?',
    customerContext: 'IT couple, first-time buyers, combined 30 LPA, buying 1.2 Cr apartment in Pune. Data-driven decision makers.',
    competitorMentioned: 'SBI (8.25%), Kotak (8.45%)',
    suggestedApproach: 'Total cost of ownership argument + speed/service differentiator + prepayment flexibility math'
  },
  {
    id: 'obj-rate-pl',
    icon: '💰',
    category: 'rate',
    product: 'Personal Loan',
    objection: 'Bajaj is giving me personal loan at 12% in 2 hours. Your rate is 14% and it takes 3 days. Why should I wait?',
    customerContext: 'Salaried professional, 15 LPA, needs 5L urgently for wedding expenses. Has good CIBIL (750+).',
    competitorMentioned: 'Bajaj Finance (12%, instant)',
    suggestedApproach: 'Compare total cost (Bajaj has higher processing + insurance bundling) + our pre-approved faster + no prepayment penalty'
  },
  {
    id: 'obj-process-bl',
    icon: '📋',
    category: 'process',
    product: 'Business Loan',
    objection: 'Your documentation requirement is too much. I need to submit ITR, GST returns, bank statements, trade references... Bajaj just asks for my Aadhaar and PAN.',
    customerContext: 'SME owner, textile business in Surat, 5 years vintage, needs 30L working capital, turnover 2 Cr.',
    competitorMentioned: 'Bajaj Finance (minimal docs)',
    suggestedApproach: 'More docs = better rate for you (12% vs 18%) + higher amount (30L vs 10L) + longer tenure + relationship banking access'
  },
  {
    id: 'obj-trust-switch',
    icon: '🏦',
    category: 'trust',
    product: 'Current Account + Merchant Acquiring',
    objection: 'I have been with SBI for 20 years. My father had account there. Why should I switch to HDFC? Everything is working fine.',
    customerContext: 'Retail shop owner, grocery chain (3 outlets), monthly turnover 65L, wants better POS rates but resistant to change.',
    competitorMentioned: 'SBI (20-year relationship)',
    suggestedApproach: 'Don\'t ask to switch — propose "add HDFC for business banking" alongside SBI + show POS savings + future lending access'
  },
  {
    id: 'obj-competitor-cv',
    icon: '🚛',
    category: 'competitor',
    product: 'Commercial Vehicle Loan',
    objection: 'Tata Motors Finance gives me captive rate of 8.5% for Tata trucks. Plus they have a tie-up with the dealer for instant approval. Can you match that?',
    customerContext: 'Fleet owner with 50 vehicles, needs 10 more Tata Ace trucks for Amazon contract. Existing HDFC customer.',
    competitorMentioned: 'Tata Motors Finance (captive rate 8.5%)',
    suggestedApproach: 'Captive lenders have hidden costs (compulsory insurance, limited refinance) + we offer multi-brand flexibility + existing customer fast-track + cross-sell value'
  },
  {
    id: 'obj-product-tractor',
    icon: '🚜',
    category: 'product',
    product: 'Tractor Finance',
    objection: 'Mahindra Finance gives loan without any CIBIL or documents. They just visit my farm and approve. You are asking too many questions.',
    customerContext: 'Farmer, 15 acres in MP, wants Mahindra 575 tractor, no formal credit history, has good UPI transaction history.',
    competitorMentioned: 'Mahindra Finance (no documentation, village assessment)',
    suggestedApproach: 'Acknowledge simplicity + show rate difference (13.5% vs 9.5% = 1.5L extra) + offer harvest EMI flexibility + UPI as alternative proof'
  },
  {
    id: 'obj-timing-lap',
    icon: '⏰',
    category: 'timing',
    product: 'Loan Against Property',
    objection: 'ICICI promised me LAP disbursement in 10 days. You are saying 15-20 days. I have a business opportunity that cannot wait.',
    customerContext: 'CA with private practice, wants LAP of 80L on Dwarka property for new office purchase, time-sensitive deal.',
    competitorMentioned: 'ICICI Bank (10-day LAP)',
    suggestedApproach: 'Explore express processing option + higher LTV (70% vs 65%) means he gets more money + better interest rate trade-off for few extra days'
  },
  {
    id: 'obj-competitor-pg',
    icon: '💻',
    category: 'competitor',
    product: 'Payment Gateway',
    objection: 'We are using Razorpay and it works perfectly. Their API is better, documentation is cleaner, and integration took 2 days. Why should we even consider HDFC PG?',
    customerContext: 'SaaS company, 500 Cr revenue, processing 200 Cr annually through Razorpay. Growing fast.',
    competitorMentioned: 'Razorpay (API quality, developer experience)',
    suggestedApproach: 'Don\'t compete on API alone — pitch banking relationship: instant settlement (vs T+2), relationship pricing at volume, bundled business loan access using transaction data'
  },
  {
    id: 'obj-rate-auto',
    icon: '🚗',
    category: 'rate',
    product: 'Auto Loan',
    objection: 'The Hyundai showroom has Axis Bank desk giving same-day approval at 8.75%. I don\'t want to visit a bank branch for auto loan.',
    customerContext: 'Young professional, 28, buying Hyundai Creta, wants convenience over rate. Does not want to visit branch.',
    competitorMentioned: 'Axis Bank (dealership desk, same-day)',
    suggestedApproach: 'Offer pre-approved at dealership (we also have tie-ups) + lower rate for existing customers + doorstep delivery of documents + instant digital sanction'
  },
  {
    id: 'obj-trust-digital',
    icon: '📱',
    category: 'trust',
    product: 'Credit Card',
    objection: 'I already have AMEX Platinum. It has the best rewards and concierge service. What does your Infinia have that AMEX doesn\'t?',
    customerContext: 'HNI, 80 LPA income, frequent international traveler, currently spends 3L/month on AMEX. Does not have HDFC card.',
    competitorMentioned: 'American Express Platinum',
    suggestedApproach: 'Acceptance width in India (AMEX rejected at many places) + domestic benefits (fuel, grocery, movie) + companion card features + SmartBuy portal value'
  },
  {
    id: 'obj-cc-corporate-rebate',
    icon: '💳',
    category: 'rate',
    product: 'Corporate Credit Cards',
    objection: 'Axis gives us 1.2% rebate on annual spend of ₹15 Cr. Your proposal shows 0.9%. That is a difference of ₹4.5 lakh per year. Our CFO will never approve a downgrade in rebates.',
    customerContext: 'IT company, 4,000 employees, annual T&E spend ₹15 Cr, Axis corporate cards for 5 years, renewing in 60 days.',
    competitorMentioned: 'Axis Bank (1.2% rebate, established program)',
    suggestedApproach: 'Rebate is only one part of total value — show: (a) spend control savings (unauthorized spend blocked = 8-10% saving), (b) API integration reducing reconciliation cost, (c) higher per-card limits reducing number of cards needed, (d) fleet/fuel card bundled savings, (e) path to 1.2% at higher volume tier within 12 months'
  },
  {
    id: 'obj-ecom-api',
    icon: '🛒',
    category: 'competitor',
    product: 'Payment Gateway (E-Commerce)',
    objection: 'Our dev team says HDFC PG documentation is outdated and integration takes 3 weeks versus 2 days with Razorpay. We cannot afford that developer time.',
    customerContext: 'D2C fashion brand, 120 Cr revenue, 50-person tech team, CTO is the decision blocker. Currently on Razorpay, considering HDFC for cheaper rates.',
    competitorMentioned: 'Razorpay (2-day integration, superior developer docs)',
    suggestedApproach: 'Acknowledge developer experience gap honestly + counter with: (a) dedicated integration engineer provided by HDFC, (b) new SmartHub PG with modern REST APIs, (c) sandbox environment for testing, (d) 30 bps cheaper on MDR = ₹36L annual savings that justifies developer time, (e) instant settlement vs T+2 = better cash flow'
  },
  {
    id: 'obj-ecom-settlement',
    icon: '⏱️',
    category: 'timing',
    product: 'ECOM Settlement / Nodal Account',
    objection: 'Cashfree gives us real-time settlement to sellers. If you take T+1 or T+2, my sellers will leave the platform. They are small businesses who need cash daily.',
    customerContext: 'Online marketplace, 8,000 sellers, mostly small retailers, platform retains 15% commission, processing 200 Cr/year.',
    competitorMentioned: 'Cashfree (real-time seller settlement)',
    suggestedApproach: 'Offer same-day/T+0 settlement for eligible sellers + show: (a) RBI-compliant nodal account is mandatory — we handle compliance, (b) auto-split (commission retention + seller payout) reduces manual reconciliation, (c) seller lending program based on transaction data = higher seller retention, (d) phased migration with parallel run'
  },
  {
    id: 'obj-las-margin',
    icon: '📉',
    category: 'product',
    product: 'Loan Against Securities',
    objection: 'ICICI LAS allows 60% LTV on mutual funds and gives me a 3-day grace period on margin calls. Your LTV is only 50% and you sell my units on the same day if margin is breached. That is unacceptable.',
    customerContext: 'HNI, ₹5 Cr in MF, needs ₹2.5 Cr overdraft, has LAS with ICICI but exploring HDFC for better rates.',
    competitorMentioned: 'ICICI Bank (60% LTV, 3-day margin call grace)',
    suggestedApproach: 'Correct the misconception (HDFC does offer 65% LTV on approved MFs) + show: (a) grace period of 2 business days for margin shortfall, (b) proactive alerts before margin breach (SMS + RM call), (c) OD interest-only model = pay only on what you draw, (d) rate advantage (8.75% vs 9.5%), (e) pledge process is fully digital — no physical DIS required'
  },
  {
    id: 'obj-dpps-migration',
    icon: '🏦',
    category: 'process',
    product: 'Salary Accounts / Direct Payment Products',
    objection: 'We have 10,000 salary accounts with SBI. Every employee has auto-debit mandates, EMIs, and insurance linked to SBI accounts. Switching will cause chaos. Last time we tried with Kotak, 300 employees complained.',
    customerContext: 'Manufacturing conglomerate, 10,000 employees, SBI salary accounts for 8 years, Group HR Head is risk-averse about disruption.',
    competitorMentioned: 'SBI (10,000 salary accounts, 8-year relationship)',
    suggestedApproach: 'Don\'t propose full migration — offer "dual salary" approach: (a) new joiners start with HDFC, (b) existing employees given choice with incentive to switch (credit card pre-approved, higher OD limit), (c) dedicated migration desk handles NACH/mandate transfers, (d) 90-day parallel run where salary goes to both accounts, (e) show Kotak failure was due to no migration support — HDFC provides dedicated SPOC team'
  },
  {
    id: 'obj-pl-instant',
    icon: '⚡',
    category: 'competitor',
    product: 'Personal Loan',
    objection: 'Bajaj Finance approved me in 10 minutes on my phone. Your branch process takes 2 days and I need to submit physical documents. In 2025, why should I wait?',
    customerContext: 'IT professional, 22 LPA, needs 8L for home renovation, pre-approved by Bajaj at 12.5% on app. HDFC rate would be 11% but process is slower.',
    competitorMentioned: 'Bajaj Finance (10-minute digital approval)',
    suggestedApproach: 'Show rate savings over tenure (₹42K on 8L over 5 years) + our pre-approved digital journey for existing salary account holders + no hidden insurance bundling that Bajaj adds + relationship benefits (future home loan/CC eligibility)'
  },
  {
    id: 'obj-infra-cashflow',
    icon: '🏗️',
    category: 'timing',
    product: 'Infrastructure / Equipment Finance',
    objection: 'NHAI payments come 120 days after milestone. If I take your EMI starting immediately, I will default in month 2. Srei used to give me moratorium until first payment — can you?',
    customerContext: 'Highway contractor, 15 tippers + 3 excavators needed, active NHAI contract worth ₹200 Cr, strong track record but lumpy cash flow.',
    competitorMentioned: 'Srei Equipment Finance (moratorium + milestone EMI)',
    suggestedApproach: 'Offer balloon/step-up EMI structure linked to NHAI milestones + show that Srei is defunct (post-NCLT) so comparison is moot + government receivable discounting facility + fleet package pricing including fuel cards'
  },
  {
    id: 'obj-lap-valuation',
    icon: '🏘️',
    category: 'product',
    product: 'Loan Against Property',
    objection: 'ICICI valued my property at ₹4.2 Cr and your valuer says ₹3.6 Cr. That is a ₹36 lakh difference in what I can borrow. Either match their valuation or I go to ICICI.',
    customerContext: 'CA with 2 commercial properties in Delhi NCR, needs ₹2.5 Cr LAP, frustrated by conservative bank valuations.',
    competitorMentioned: 'ICICI Bank (higher property valuation)',
    suggestedApproach: 'Offer second property as additional collateral to bridge the gap + show our lower interest rate (9.5% vs 10.25%) saves ₹5L+ over tenure + OD facility option (interest on utilized only) + fast-track revaluation with empaneled valuer of choice'
  },
  {
    id: 'obj-abcp-volume',
    icon: '🤝',
    category: 'trust',
    product: 'ABCP / Channel Partnership',
    objection: 'ICICI guarantees us 50,000 leads per quarter from their branch network. Your proposal just says "best efforts." I need committed volumes, not promises.',
    customerContext: 'Insurance company evaluating bank distribution partners for FY27, needs guaranteed lead pipeline to justify partnership investment.',
    competitorMentioned: 'ICICI Bank (50K guaranteed leads/quarter)',
    suggestedApproach: 'Propose tiered commitment model (30K Q1, scaling to 50K by Q3 as processes mature) + show our higher conversion rate (HDFC quality leads convert 2x vs ICICI volume) + salary account base access for group insurance + digital shelf on HDFC app + dedicated training for branch staff'
  },
  {
    id: 'obj-lpg-fd-rate',
    icon: '💰',
    category: 'rate',
    product: 'Fixed Deposits / Liabilities',
    objection: 'SBI is giving 7.5% on 1-year FD. Your rate is 7.1%. On ₹200 Cr, that is ₹80 lakh less interest per year. My board will never approve moving to lower rates.',
    customerContext: 'Corporate treasury head, parks ₹200 Cr in short-term FDs, reviewing banking partners for better returns.',
    competitorMentioned: 'SBI (7.5% FD rate on 1-year)',
    suggestedApproach: 'Pitch sweep-in FD (higher effective yield through auto-breakage optimization) + overnight FD for idle funds + flexi FD with partial withdrawal + show that net yield after considering salary account float, prepaid card settlement, and overall treasury dashboard value exceeds SBI pure FD return'
  },
  {
    id: 'obj-dbc-compliance',
    icon: '🔒',
    category: 'trust',
    product: 'Digital Banking / BaaS / API Banking',
    objection: 'RBI has been cracking down on fintech-bank partnerships. What if regulations change and you pull the plug on our integration? We have 2 million users depending on this.',
    customerContext: 'Fintech, 2M users, wants to embed HDFC products (FD, lending, cards) via API, worried about regulatory risk.',
    competitorMentioned: 'N/A (regulatory environment)',
    suggestedApproach: 'Acknowledge concern as valid + show: (a) HDFC has the largest fintech partnership ecosystem — not pulling back, (b) partnership agreement includes 12-month wind-down clause, (c) HDFC has dedicated Digital Banking Channel team for compliance co-management, (d) RBI digital lending guidelines actually favor bank-led partnerships, (e) risk-sharing model aligns incentives — we succeed when partner succeeds'
  },
];

export const PROSPECT_RESEARCH_SCENARIOS: ProspectResearchScenario[] = [
  {
    id: 'pr-auto-components',
    icon: '🏭',
    category: 'corporate',
    title: 'Auto Components Manufacturer — Fleet Finance',
    description: 'Research a mid-size auto parts company for commercial vehicle loan and business loan pitch',
    customerProfile: 'Pinnacle Auto Components, Pune, 320 Cr revenue, 1800 employees, supplies to Tata Motors, banks with ICICI',
    productFocus: 'Commercial Vehicle Loans (12 trucks) + Business Loan',
    meetingContext: 'Meeting with CFO in 15 minutes. Need quick industry and company intelligence.',
    researchPrompt: 'I am sitting in the lobby of Pinnacle Auto Components in Pune. Meeting the CFO in 15 minutes. They are an auto parts supplier to Tata Motors (320 Cr revenue, 1800 employees), banking with ICICI. I want to pitch CV loans for 12 logistics trucks and a business loan for expansion. Give me: (1) Quick industry context — auto components sector health and what drives their borrowing needs, (2) Likely pain points for their ICICI relationship, (3) 5 smart questions to ask that demonstrate knowledge, (4) Key numbers/facts about their industry I should mention, (5) Why HDFC is better than ICICI for fleet finance.'
  },
  {
    id: 'pr-solar-energy',
    icon: '☀️',
    category: 'corporate',
    title: 'Renewable Energy Company — Project Finance',
    description: 'Rapid industry research for a solar EPC company meeting — zero prior sector experience',
    customerProfile: 'SolarTech Energy Solutions, Ahmedabad, 280 Cr revenue, 1200 employees, solar panel EPC, banks with Yes Bank',
    productFocus: 'Business Loan (project finance) + Commercial Vehicle Loans (8 vehicles)',
    meetingContext: 'First meeting with Director Finance. You have never sold to solar/renewable sector before.',
    researchPrompt: 'I have never sold to the renewable energy sector. Meeting the Director Finance of SolarTech Energy (Ahmedabad, 280 Cr, solar EPC company) in 2 hours. They need project finance and 8 specialized vehicles. Currently with Yes Bank. Brief me in 5 minutes: (1) How solar EPC companies make money, (2) Their typical financing needs and cash flow challenges, (3) Why they might be unhappy with Yes Bank, (4) What products fit their needs, (5) 5 questions that make me sound like I know solar, (6) Key terminology cheat sheet (PPA, RPO, EPC, COD).'
  },
  {
    id: 'pr-hospital-chain',
    icon: '🏥',
    category: 'corporate',
    title: 'Hospital Chain — Equipment Finance + POS',
    description: 'Research a healthcare group for business loan and merchant acquiring solutions',
    customerProfile: 'Wellness First Hospital Chain, Bangalore, 150 Cr revenue, 3 hospitals expanding to 5, existing HDFC home loan customer (promoter)',
    productFocus: 'Business Loan (equipment) + Merchant Acquiring (POS at all centers)',
    meetingContext: 'Cross-sell meeting with existing customer. Promoter has home loan with us.',
    researchPrompt: 'Dr Meena Krishnan (promoter of Wellness First Hospitals, Bangalore) has a home loan with us. She is expanding from 3 to 5 hospitals and needs: medical equipment finance and POS terminals at all centers. Research and prepare: (1) Healthcare industry financing trends, (2) Typical capital needs for a hospital chain expanding, (3) POS usage patterns in hospitals (insurance tie-ups, EMI for patients), (4) Cross-sell path from home loan relationship to full business banking, (5) Competition in healthcare lending (other banks actively targeting this space).'
  },
  {
    id: 'pr-it-couple',
    icon: '💻',
    category: 'individual',
    title: 'IT Couple — First Home Loan Battle',
    description: 'Research and prepare for a rate-sensitive dual-income couple comparing multiple lenders',
    customerProfile: 'Neha (Wipro, 16 LPA) & Vikram (TCS, 16 LPA), 29/31, Pune, buying 3BHK in Hinjewadi for 1.4 Cr',
    productFocus: 'Home Loan 1.2 Cr + Credit Card + CASA',
    meetingContext: 'Final meeting — couple has offers from SBI and Kotak. Signing with Kotak this weekend unless we convince them.',
    researchPrompt: 'Last chance meeting tomorrow with Neha & Vikram (combined 32 LPA IT couple buying in Pune). They have: SBI at 8.25% (rejected for slow process), Kotak at 8.45% + zero processing. Our offer: 8.50%. They made an Excel showing Kotak saves 1.2L over 20 years. Prepare my counter: (1) Total cost recalculation including hidden Kotak costs, (2) Rate reset mechanism comparison (monthly RLLR vs annual reset), (3) Prepayment scenario analysis (IT professionals prepay within 7 years typically), (4) Service quality differentiators, (5) Closing offer I can present within RM authority.'
  },
  {
    id: 'pr-farmer-tractor',
    icon: '🌾',
    category: 'individual',
    title: 'Farmer — Tractor Finance Without Documents',
    description: 'Prepare for a rural customer meeting where alternative credit assessment is needed',
    customerProfile: 'Ramesh Yadav, 45, farmer + trader, 15 acres in Indore, no CIBIL, good UPI history, wants Mahindra 575 tractor',
    productFocus: 'Tractor Finance (8.5L) + Personal Loan (daughter education)',
    meetingContext: 'Village visit. Farmer skeptical of banks asking documents. Mahindra Finance offered no-doc approval.',
    researchPrompt: 'Visiting farmer Ramesh Yadav in his village (Indore district). He wants a Mahindra 575 tractor (8.5L) but has no CIBIL score or ITR. Mahindra Finance will approve without documents at 13.5%. BoB at 9% but 25-day process. His son runs UPI transactions of 10L/month through processing unit. Help me prepare: (1) How to explain our rate advantage in simple farmer-friendly terms (EMI comparison), (2) How to position UPI data as alternative income proof, (3) Harvest-linked EMI explanation, (4) Why bank loan is better than captive finance (farmer language), (5) Cross-sell: personal loan for daughter education, (6) How to build trust with a farmer skeptical of banks.'
  },
  {
    id: 'pr-merchant-convert',
    icon: '🏪',
    category: 'merchant',
    title: 'Cash-Heavy Merchant — Digital Conversion',
    description: 'Convert a successful but cash-dominant catering business to digital payments',
    customerProfile: 'Mohammed Sharif, Royal Catering & Events, Chennai, 38L/month revenue, 90% cash, lost corporate clients due to no digital',
    productFocus: 'Merchant Acquiring (POS + QR) + Current Account + Future Business Loan',
    meetingContext: 'Referred by existing customer. Merchant has lost 12L in contracts due to cash-only operations.',
    researchPrompt: 'Meeting a cash-heavy catering business owner (38L/month, 90% cash) who just lost 12L in corporate contracts because they couldn\'t provide digital payment. He fears: GST scrutiny, MDR eating margins, technology complexity. Prepare: (1) Revenue growth model showing digital brings NEW customers, (2) GST myth-busting (input credit actually saves money), (3) MDR cost vs revenue uplift math, (4) Simplest possible technology setup, (5) Business loan pathway after 6 months of digital history, (6) Conversation approach for a traditional business owner who fears change.'
  },
  {
    id: 'pr-cc-corporate-bulk',
    icon: '💳',
    category: 'corporate',
    title: 'IT Giant — Corporate Card Program Renewal',
    description: 'Prepare for a corporate credit card RFP from a large IT services company with 5,000+ employees',
    customerProfile: 'Vertex Infotech, Mumbai, 2,400 Cr revenue, 5,200 employees, current Axis corporate cards expiring in 90 days, annual T&E spend ₹18 Cr',
    productFocus: 'Corporate Credit Cards (bulk) + Purchase Cards + Prepaid Travel Cards + Fleet Cards',
    meetingContext: 'RFP stage — competing against Axis (incumbent) and SBI. Meeting Head of Procurement.',
    researchPrompt: 'Vertex Infotech (Mumbai, 2,400 Cr revenue, 5,200 employees) is renewing their corporate card program. Axis is the incumbent with 18 Cr annual T&E spend. Pain: poor spend analytics, no API integration with their SAP S/4HANA, and low rebates. SBI also pitching. Meeting Head of Procurement in 1 hour. Prepare: (1) HDFC Corporate Card program features vs Axis/SBI comparison, (2) Spend analytics and control dashboard advantages (grade-wise limits, category blocks, real-time alerts), (3) Rebate structure for 18 Cr annual volume, (4) API integration capability with SAP/ERP, (5) Purchase card value for vendor payments, (6) Fleet card bundling for company vehicles, (7) Migration plan from Axis — zero-disruption employee card reissuance.'
  },
  {
    id: 'pr-ecom-marketplace',
    icon: '🛒',
    category: 'corporate',
    title: 'E-Commerce Marketplace — Unified Payment Stack',
    description: 'Research a high-volume online marketplace seeking to consolidate payment infrastructure',
    customerProfile: 'ShopNow India, Bangalore, 800 Cr GMV, 18,000 sellers, split between Razorpay & Cashfree, growing 40% YoY',
    productFocus: 'Payment Gateway + Nodal Account + Auto-Split Settlement + Seller Lending',
    meetingContext: 'Meeting CTO and CFO together. They want one partner for everything payments.',
    researchPrompt: 'ShopNow India (Bangalore, 800 Cr GMV, 18,000 sellers) is consolidating their payment stack from Razorpay + Cashfree split to a single partner. Growing 40% YoY. Meeting CTO (cares about API/uptime) and CFO (cares about settlement speed/cost) together. Prepare: (1) How HDFC PG handles marketplace model (auto-split between platform commission and seller payout), (2) Nodal/escrow account structure for RBI compliance, (3) Settlement speed comparison (T+0 for sellers vs T+2 from Razorpay), (4) Transaction-data-based lending to sellers (HDFC lending as revenue share opportunity for marketplace), (5) API documentation quality and developer support, (6) Uptime SLA guarantees (99.99%), (7) Cross-border payment capability for international sellers, (8) Cost comparison: bank PG vs aggregator PG at 800 Cr volume.'
  },
  {
    id: 'pr-dbc-fintech',
    icon: '📱',
    category: 'corporate',
    title: 'Fintech Startup — Banking-as-a-Service Partnership',
    description: 'Explore a digital banking co-creation deal with a payments fintech company',
    customerProfile: 'PayZen Technologies, Bangalore, Series C funded, 2M users, neo-banking app, wants to offer lending and deposits via banking partner',
    productFocus: 'BankOne API Platform + Co-branded Cards + UPI as PSP + Lending API + FD Partnership',
    meetingContext: 'Strategic meeting with CEO and CTO. They want to embed banking into their app.',
    researchPrompt: 'PayZen Technologies (Bangalore, Series C, 2M users, neo-banking app) wants to embed real banking products into their consumer app. Currently working with small banks but want a tier-1 partner. Meeting CEO (business vision) and CTO (API integration). Prepare: (1) HDFC BankOne API platform — what it offers (accounts, cards, lending, deposits via API), (2) How co-branded debit/credit cards work and revenue sharing model, (3) UPI PSP partnership — what it means for PayZen users, (4) Lending API — how PayZen can offer HDFC pre-approved loans in their app, (5) FD-in-app: how fintech users can open HDFC FDs within PayZen, (6) Regulatory considerations (RBI digital lending guidelines, FLDG norms), (7) Competitor analysis — what ICICI/Kotak/Yes offer to fintechs, (8) Revenue model for both parties.'
  },
  {
    id: 'pr-las-hni-wealth',
    icon: '💎',
    category: 'individual',
    title: 'HNI Portfolio Owner — LAS + Wealth Management',
    description: 'Prepare for a high-net-worth individual seeking liquidity against investment portfolio',
    customerProfile: 'Anand Malhotra, 55, ex-CEO, ₹12 Cr portfolio (MF ₹6 Cr, equities ₹4 Cr, bonds ₹2 Cr), ICICI Private Banking customer',
    productFocus: 'Loan Against Securities (OD facility ₹4 Cr) + Education Loan (son at MIT) + Wealth Advisory',
    meetingContext: 'Referred by existing customer. HNI comparing HDFC vs ICICI Private Banking LAS terms.',
    researchPrompt: 'Meeting Anand Malhotra (55, ex-CEO, ₹12 Cr portfolio) who wants: (a) ₹4 Cr OD facility against his mutual funds and equities without selling, (b) ₹60L education loan for son going to MIT. Currently with ICICI Private Banking — LAS at 9.5%, 50% LTV, no flexi-drawdown. Prepare: (1) HDFC LAS product features — LTV by asset class (MF vs equity vs bonds), interest rates, margin call mechanism, (2) Comparison with ICICI Private Banking LAS terms, (3) OD vs term loan — why OD is better for HNIs (pay interest only on utilized amount), (4) Education loan cross-sell (concessional rate for existing LAS customer), (5) How to position HDFC Private Banking vs ICICI Private Banking, (6) Wealth advisory as value-add — portfolio restructuring for better LTV, (7) Grace period and flexible margin call handling.'
  },
  {
    id: 'pr-dpps-salary',
    icon: '🏢',
    category: 'corporate',
    title: 'Conglomerate — Salary Account + Prepaid + Treasury',
    description: 'Research a large corporate for salary account bulk acquisition and direct payment products',
    customerProfile: 'Vikram Group (diversified conglomerate), Delhi, 12,000 employees across 5 subsidiaries, currently SBI + ICICI for salaries',
    productFocus: 'Salary Accounts (bulk) + Corporate Prepaid Cards + FD/Sweep + Direct Payment Products',
    meetingContext: 'Annual banking review — Group CFO consolidating treasury operations. RFP for salary banking.',
    researchPrompt: 'Vikram Group (Delhi, 12,000 employees, 5 subsidiaries) is consolidating from 3 salary banks to 1-2. Group CFO meeting in 2 hours. They pay 1,200 Cr annual salaries, park 200 Cr in short-term FDs, and issue 500 prepaid cards/quarter for vendor advances. Prepare: (1) HDFC Salary Account program — benefits by employee grade (junior/mid/senior/CXO), (2) Competitive comparison with SBI and ICICI salary programs, (3) Prepaid card for vendor advance payments — controls, limits, reconciliation, (4) Treasury products — sweep-in FD, flexi FD, overnight FD rates, (5) Single dashboard for multi-subsidiary HR payroll, (6) Employee retention impact of premium salary account (home loan preferential, insurance, credit card pre-approved), (7) Migration plan for 12,000 accounts with zero payroll disruption.'
  },
  {
    id: 'pr-pl-corporate-tieup',
    icon: '💰',
    category: 'corporate',
    title: 'IT Company — Bulk Personal Loan Corporate Tie-up',
    description: 'Prepare for a salary-linked personal loan bulk deal with a large IT employer',
    customerProfile: 'Infosys BPO, Pune, 4,000 employees in zone, current PL partner is Bajaj Finance, annual PL demand ~500 applications',
    productFocus: 'Personal Loans (salary-linked bulk) + Credit Cards + Salary Account Cross-Pollination',
    meetingContext: 'Meeting Zonal HR Head to propose exclusive PL tie-up replacing Bajaj Finance.',
    researchPrompt: 'Infosys BPO Pune zone (4,000 employees, avg salary 8-25 LPA) currently uses Bajaj Finance for employee personal loans. Bajaj offers instant approval but at 12-14% rates with compulsory insurance. Meeting Zonal HR Head. Prepare: (1) Salary-linked PL program features — pre-approved limits, salary deduction EMI, zero processing for bulk, (2) Rate advantage analysis: HDFC 10.5-11.5% vs Bajaj 12-14% savings per employee, (3) Cross-pollination opportunity: PL → credit card → salary account → home loan funnel, (4) Employee benefit page/portal integration approach, (5) Bajaj Pain points: hidden insurance cost, aggressive recovery tactics, no relationship banking.'
  },
  {
    id: 'pr-infra-equipment',
    icon: '🏗️',
    category: 'corporate',
    title: 'Infrastructure Company — Equipment + Fleet Finance',
    description: 'Research a highway contractor for construction equipment and fleet financing',
    customerProfile: 'Patel Infrastructure Ltd, Ahmedabad, 800 Cr revenue, active NHAI contracts, fleet of 150 vehicles, banks with L&T Finance',
    productFocus: 'CV Loans (tippers/tankers) + Construction Equipment Finance + LAP (warehouse) + Business Loan',
    meetingContext: 'Meeting CFO — company expanding fleet by 30 vehicles and 5 excavators for new highway project.',
    researchPrompt: 'Patel Infrastructure (Ahmedabad, 800 Cr, highway construction, 150-vehicle fleet) has won 2 new NHAI contracts worth ₹500 Cr. Needs 30 tippers + 5 excavators. Banks with L&T Finance (CV loans) and Union Bank (working capital). Meeting CFO in 1 hour. Prepare: (1) Infrastructure sector lending landscape — who finances what, (2) NHAI payment cycle challenges and how to structure EMIs around them, (3) Equipment finance vs lease comparison, (4) Why HDFC over L&T Finance for fleet expansion (better rates, multi-product relationship), (5) Cross-sell: fuel cards for 150 vehicles, LAP on warehouse property, corporate credit cards for procurement.'
  },
  {
    id: 'pr-lap-professional',
    icon: '🏠',
    category: 'individual',
    title: 'Self-Employed Professional — Multi-Property LAP',
    description: 'Prepare for a chartered accountant seeking LAP with multiple properties as collateral',
    customerProfile: 'Rajesh Gupta, 48, CA with practice in Delhi, 3 commercial properties worth ₹6 Cr, needs ₹3.5 Cr for office expansion + client advances',
    productFocus: 'Loan Against Property (OD facility) + Business Loan + Professional Indemnity Insurance',
    meetingContext: 'Walk-in at branch — comparing LAP terms from ICICI, Axis, and HDFC.',
    researchPrompt: 'CA Rajesh Gupta (48, Delhi, 3 commercial properties worth ₹6 Cr) needs ₹3.5 Cr LAP. ICICI offers 60% LTV at 10.25%, Axis offers 55% at 10%. Our standard: 65% LTV at 9.75% on approved properties. He wants OD facility, not term loan. Prepare: (1) Multi-property LAP structuring — how to combine properties for higher eligible amount, (2) OD vs term loan math showing interest savings for a CA who draws down irregularly, (3) ICICI/Axis comparison table (LTV, rate, processing, valuation approach), (4) Professional segment benefits — GST-registered fast-track, digital valuation, no physical visits, (5) Cross-sell: business loan top-up, professional indemnity insurance.'
  },
  {
    id: 'pr-abcp-partnership',
    icon: '🤝',
    category: 'corporate',
    title: 'Insurance Company — ABCP Distribution Alliance',
    description: 'Research an insurance company seeking bank distribution partnership',
    customerProfile: 'HDFC Life (strategic alliance renewal), wants expanded branch access, co-branded product launch, salary base for group insurance',
    productFocus: 'ABCP Co-branded Products + Distribution Alliance + Digital Shelf Access + Group Insurance via Salary Base',
    meetingContext: 'Annual partnership review — they want expanded scope, we want higher commission and exclusivity.',
    researchPrompt: 'Annual review with insurance partner seeking expanded distribution. They want: (a) access to 5,000 branches (up from 3,500), (b) co-branded term plan for salary account holders, (c) group insurance access for corporate salary accounts. Prepare: (1) Distribution economics — revenue per branch per month, conversion rates by channel, (2) Co-branded product structure and regulatory requirements (IRDAI norms), (3) Salary account base segmentation for group insurance targeting, (4) Competitive landscape — what ICICI/SBI/Kotak offer their insurance partners, (5) Negotiation framework: branch access in exchange for exclusivity + higher commission + lead quality guarantees.'
  },
  {
    id: 'pr-lpg-salary-migration',
    icon: '🏢',
    category: 'corporate',
    title: 'Retail Chain — Salary Banking + FD Migration',
    description: 'Research a large retailer for salary account bulk acquisition and FD book migration',
    customerProfile: 'Future Group Retail, Mumbai, 15,000 employees, 500 stores, ₹300 Cr FD book, currently SBI + Kotak salary split',
    productFocus: 'Salary Accounts (bulk) + Corporate FD + Savings Bank + Salary Advance + Zero-Balance for Contractual',
    meetingContext: 'Invited to present by Group Treasury Head after competitor (Kotak) service failure.',
    researchPrompt: 'Future Group Retail (15,000 employees, 500 stores, ₹300 Cr FD book) is reviewing salary banking after poor Kotak experience (app crashes, delayed NACH processing, no WhatsApp banking). Currently split SBI/Kotak. Meeting Group Treasury Head. Prepare: (1) Salary account program by employee tier (store staff/middle management/senior/CXO), (2) Zero-balance salary account for 3,000 contractual workers, (3) FD book migration: sweep-in vs flexi vs overnight FD comparison, (4) Salary advance facility for frontline staff (festive season demand), (5) WhatsApp banking and digital-first features comparison, (6) Migration plan: phased approach with zero payroll disruption guarantee.'
  },
  {
    id: 'pr-dbc-embedded',
    icon: '📱',
    category: 'corporate',
    title: 'Digital Platform — Embedded Banking Partnership',
    description: 'Research a digital platform seeking to embed banking products via API',
    customerProfile: 'MobiWallet Technologies, Bangalore, Series C, 8M users, wants embedded FD + lending + cards in their app',
    productFocus: 'BankOne API + Embedded Lending API + FD-in-App + Co-branded Virtual Cards + UPI PSP',
    meetingContext: 'Strategic pitch to CEO and CTO — they just ended partnership with a small bank.',
    researchPrompt: 'MobiWallet (Bangalore, 8M users, Series C, ₹400 Cr monthly UPI volume) ended partnership with a small bank after regulatory issues. Want a tier-1 bank for: embedded FD, in-app lending, co-branded virtual debit card, and UPI PSP. Meeting CEO + CTO. Prepare: (1) HDFC BankOne API platform capabilities vs what small banks offered, (2) Embedded FD product: how users open HDFC FD within MobiWallet app, revenue share, (3) Lending API: HDFC pre-approved loans surfaced in partner app, FLDG structure, (4) Co-branded virtual card launch timeline and economics, (5) Regulatory framework: how tier-1 bank partnership is more stable than small bank, (6) Uptime SLA and contractual protections they need.'
  },
];

export const CLOSING_SCENARIOS: ClosingScenario[] = [
  {
    id: 'close-fleet',
    icon: '🚛',
    title: 'Fleet Deal — 20 Vehicles Against SBI Competition',
    situation: 'Bharat Logistics needs 20 Tata Ace trucks for Amazon contract. SBI fleet rate at 8.75%. Our standard is 10.2%. VP Ops is loyal but needs board-level justification for higher rate.',
    products: ['Commercial Vehicle Loan', 'Corporate Credit Cards', 'Business Loan'],
    challenge: 'Price gap of 145bps on a 3.5 Cr deal. How to justify premium pricing and close?',
    prompt: 'I need to close a 20-vehicle CV fleet deal (3.5 Cr) against SBI\'s 8.75% fleet rate. My standard rate is 10.2%. The customer (Bharat Logistics, VP Ops Deepak Patil) is an existing customer with good history. SBI is just cheaper. Create a deal-closing strategy: (1) Fleet pricing proposal I can seek from RBH (what rate to ask for), (2) Value-add package that justifies any remaining rate gap (faster execution, dedicated fleet desk, corporate fuel cards, same-day approval for repeat orders), (3) TCO comparison showing hidden SBI fleet costs, (4) The "relationship bundle" approach — CV + CC + Business Loan as package pricing, (5) Board presentation talking points the VP can use internally to justify HDFC. Make me close this by Friday.'
  },
  {
    id: 'close-balance-transfer',
    icon: '🔄',
    title: 'Balance Transfer + Top-up — Winning Back a Lost Customer',
    situation: 'A customer took SBI home loan 2 years ago (rate 8.25% then, now 9.15% after reset). Property appreciated 25%. We can offer 8.50% + top-up of 20L. Customer has 18 months good repayment.',
    products: ['Home Loan (Balance Transfer)', 'Top-up Loan', 'Credit Card', 'CASA'],
    challenge: 'Customer feels switching hassle is not worth the savings. How to quantify the benefit and make switching frictionless?',
    prompt: 'Win-back opportunity: Customer took SBI HL 2 years ago at 8.25% (attracted by rate). Now their rate reset to 9.15%. Outstanding 68L, property value up 25% (now 1.2 Cr). We can offer BT at 8.50% + top-up 20L (they want to renovate). Customer concern: "Switching is too much paperwork for 0.65% savings." Create: (1) Exact savings calculation over remaining tenure, (2) Top-up benefit model (renovation adds property value), (3) Frictionless switching pitch — what we handle vs what they do, (4) Full relationship package (BT + top-up + CC + CASA), (5) Urgency creator — why waiting another quarter costs them money.'
  },
  {
    id: 'close-merchant-bundle',
    icon: '💳',
    title: 'Merchant Bundle — POS + Current Account + Business Loan',
    situation: 'Metro Grocery Mart (65L/month, 6 outlets in Ahmedabad) currently has ICICI POS paying 1.7% MDR + 500/terminal/month. We can offer free terminals + 1.5% MDR if they open Current Account.',
    products: ['Merchant Acquiring', 'Current Account', 'Business Loan', 'Corporate Credit Card'],
    challenge: 'ICICI is existing banker for 8 years. Owner fears disruption to settlement flow during switch.',
    prompt: 'Close a merchant bundle deal: Metro Grocery (6 outlets, 65L/month). Currently ICICI POS (1.7% MDR + 500/terminal rental = 1.17L + 3K/month). We offer: free terminals + 1.5% MDR + same-day settlement if they open CA with us. The owner fears: "What if settlement breaks during transition? I can\'t miss even one day." Create: (1) Savings calculator (annual savings from switch), (2) Zero-disruption migration plan (parallel run before cutover), (3) The bigger prize pitch — 6 months POS data qualifies him for 40L business loan, (4) Phased approach: start with 2 outlets, prove reliability, then expand, (5) Corporate CC benefits for business expenses + fuel + utilities.'
  },
  {
    id: 'close-nri-premium',
    icon: '🌍',
    title: 'NRI Premium Home Loan — Against Federal Bank Relationship',
    situation: 'Dr Deepa (Apollo Hospital) & Arun Nair (IIT Professor) in Kochi. Building villa 1.5 Cr + want Fortuner (20L). 10-year relationship with Federal Bank who is offering bundled rate.',
    products: ['Home Loan', 'Auto Loan', 'Life Insurance', 'CASA'],
    challenge: 'Deep existing relationship with Federal Bank. How to break a 10-year loyalty barrier?',
    prompt: 'Win a premium home loan + auto deal (1.7 Cr total) from a doctor-professor couple with 10-year Federal Bank relationship. Federal offering 8.3% home + 8.9% auto as "loyalty pricing." Our rates: 8.50% home + 8.7% auto. Create: (1) Why our higher home rate is offset by better auto rate and total relationship value, (2) Doctor-specific benefits (flexi EMI during residency change, medical equipment loan pathway), (3) Premium service differentiators (dedicated RM, priority processing, doorstep everything), (4) The relationship migration plan — not "leave Federal" but "add HDFC for your growth journey," (5) Lifestyle benefits mapping (credit card for travel, insurance bundle), (6) Closing script for the joint meeting.'
  },
  {
    id: 'close-sme-digital',
    icon: '🖥️',
    title: 'SaaS Company — Payment Gateway + Business Banking',
    situation: 'TechVista Solutions (540 Cr revenue, Hyderabad) processes 200 Cr through Razorpay. Growing fast. Currently with Axis Bank for banking. Wants integrated payment + lending solution.',
    products: ['Payment Gateway', 'Business Loan', 'Current Account', 'Corporate Credit Cards'],
    challenge: 'Razorpay has superior API/developer experience. How to compete with a fintech on technology while leveraging banking strengths?',
    prompt: 'Close a 540 Cr SaaS company away from Razorpay (PG) and Axis (banking). They process 200 Cr annually. Pain points: T+2 settlement from Razorpay, no lending from their PG provider, Axis is slow on trade finance. Create: (1) Integrated banking + PG proposition (instant settlement, TDS management, automatic compliance), (2) Transaction data-backed lending (200 Cr throughput = high business loan eligibility), (3) Competitive comparison: HDFC PG vs Razorpay (where we win: settlement speed, lending, compliance), (4) Migration sweetener (fee waiver first 6 months, dedicated integration support), (5) Relationship bundle: PG + CA + BL + Corporate CC as ecosystem play, (6) Meeting strategy with CEO who cares about growth, not just API docs.'
  },
  {
    id: 'close-cc-corporate-rfp',
    icon: '💳',
    title: 'IT Company — Corporate Card Program (5,000 cards) Against Axis',
    situation: 'DataTech Solutions (3,200 Cr revenue, 5,200 employees) is renewing its Axis corporate card program (₹18 Cr annual T&E spend). Axis offering 1.2% rebate. HDFC proposal at 0.95%. SBI also in the race.',
    products: ['Corporate Credit Cards', 'Purchase Cards', 'Fleet Cards', 'Prepaid Travel Cards'],
    challenge: 'Axis incumbent with higher rebate. How to win on total value, not just rebate rate?',
    prompt: 'Close a 5,200-employee corporate card deal against Axis incumbent. DataTech spends ₹18 Cr/year on T&E. Axis gives 1.2% rebate (₹21.6L/year). Our rebate: 0.95% (₹17.1L/year) — a ₹4.5L gap. Create: (1) Total Value Proposition beyond rebate — spend analytics saving 8-10% on unauthorized expenses (₹1.4 Cr+ saved), (2) API integration with SAP that Axis cannot offer, (3) Purchase card for vendor payments — reduce check/RTGS processing cost, (4) Fleet card bundling for 200 company vehicles (fuel savings ₹8-12L/year), (5) Tiered rebate roadmap showing path to 1.2% within 18 months at higher volume, (6) Migration plan: zero disruption, same-week card reissuance, (7) Procurement Head presentation deck covering TCO over 3 years.'
  },
  {
    id: 'close-ecom-unified',
    icon: '🛒',
    title: 'E-Commerce Marketplace — PG + Settlement + Seller Lending',
    situation: 'MegaMart Online (600 Cr GMV, 15,000 sellers) split between Razorpay & Cashfree. Growing 45% YoY. Needs unified PG, compliant nodal account, and seller lending. CTO wants APIs, CFO wants cheaper rates.',
    products: ['Payment Gateway', 'Nodal Account', 'Seller Lending', 'BBPS Integration'],
    challenge: 'Two decision-makers with different priorities (CTO: technology, CFO: cost). How to create a unified pitch that wins both?',
    prompt: 'Close a 600 Cr marketplace away from Razorpay + Cashfree dual setup. 15,000 sellers, growing 45% YoY. Meeting CTO and CFO together. Create: (1) Unified stack pitch: PG + nodal account + auto-split settlement + seller lending as ONE integrated platform, (2) CTO-targeted: API quality comparison, sandbox access, webhook reliability, uptime SLA guarantee, (3) CFO-targeted: cost comparison at 600 Cr volume (bank PG vs aggregator PG — we are cheaper), (4) Seller lending revenue share model (HDFC lends to sellers based on transaction data — marketplace earns fee), (5) Compliance advantage: RBI nodal account guidelines — we handle everything, (6) Migration roadmap: 4-week phased transition with parallel run, (7) The "grow with us" pitch — as they scale to 2,000 Cr, only a bank can handle settlement compliance at that volume.'
  },
  {
    id: 'close-las-portfolio',
    icon: '💎',
    title: 'HNI — ₹4 Cr LAS + Education Loan Against ICICI Private',
    situation: 'Sunil Malhotra (₹12 Cr portfolio, ex-CEO) wants ₹4 Cr OD against securities + ₹60L education loan for son at Wharton. ICICI Private Banking offers LAS at 9.5%, 50% LTV. HDFC can offer 8.75%, 65% LTV on approved MFs.',
    products: ['Loan Against Securities (OD)', 'Education Loan', 'Private Banking', 'NRI Services'],
    challenge: 'Long-standing ICICI Private Banking relationship. How to win on product superiority while building trust for a premium client?',
    prompt: 'Close an HNI away from ICICI Private Banking. Sunil Malhotra has ₹12 Cr portfolio — ₹6 Cr in MF, ₹4 Cr in equities, ₹2 Cr in bonds. Wants: (a) ₹4 Cr OD facility, (b) ₹60L education loan for son at Wharton. ICICI offers: 9.5% rate, 50% LTV, no grace period on margin calls. Create: (1) Product superiority pitch: 8.75% rate, 65% LTV on approved MFs = ₹7.8L more accessible without selling, (2) OD vs term loan math showing interest savings of ₹3-5L/year, (3) Digital pledge process — no physical DIS, done in 2 hours vs 3 days, (4) Education loan cross-sell at concessional 8.5% (vs standalone 10.5%), (5) Margin call handling: 2-day grace + proactive RM alert before breach, (6) Private Banking experience — dedicated RM + wealth advisory + priority services, (7) Closing strategy: "Don\'t leave ICICI, add HDFC for your liquidity needs" positioning.'
  },
  {
    id: 'close-dpps-salary-treasury',
    icon: '🏢',
    title: 'Conglomerate — 12,000 Salary Accounts + Treasury Consolidation',
    situation: 'Vikram Industries (12,000 employees, 5 subsidiaries) is consolidating from SBI + ICICI + Kotak to 1-2 salary bankers. Also parks ₹200 Cr in short-term FDs and issues 500 prepaid cards/quarter for vendor advances. Group CFO meeting.',
    products: ['Salary Accounts', 'Corporate Prepaid Cards', 'Fixed Deposits', 'Direct Payment Products'],
    challenge: 'Risk-averse Group HR Head fears migration disruption. Group CFO wants better treasury returns. Two different stakeholders, two agendas.',
    prompt: 'Close a 12,000-employee salary account deal + treasury consolidation. Vikram Industries splits across SBI/ICICI/Kotak. Group CFO wants: better FD rates, single treasury dashboard, prepaid card controls. Group HR Head wants: zero payroll disruption, no employee complaints (burned by failed Kotak migration). Create: (1) Dual-stakeholder strategy — how to align CFO (money) and HR (risk) interests, (2) Zero-disruption migration plan: new joinees on HDFC immediately, existing employees voluntary switch with incentives, 90-day parallel run, (3) Treasury value: sweep-in FD rates vs competitors, overnight FD option, liquidity management, (4) Prepaid card for vendor advances: instant issuance, spend controls, auto-reconciliation, (5) Salary account benefits by grade (junior/mid/senior/CXO tier) — credit card pre-approved, home loan preferential, insurance bundle, (6) The "earn more, risk nothing" positioning, (7) ROI model: annual savings from treasury optimization + reduced employee attrition from premium salary benefits.'
  },
  {
    id: 'close-pl-corporate-bulk',
    icon: '💰',
    title: 'IT Company — Bulk Personal Loan Tie-up (4,000 employees)',
    situation: 'TechVista Solutions (4,000 employees, Pune zone) currently with Bajaj Finance for PL. 500 applications/year at 12.5%. HDFC can offer 10.5-11% salary-linked with zero processing for 50+/month. HR Head wants single-window experience.',
    products: ['Personal Loans (salary-linked)', 'Credit Cards', 'Salary Accounts'],
    challenge: 'Bajaj Finance embedded in HR portal with 10-minute approval. How to win on rate + relationship despite slower TAT?',
    prompt: 'Close a bulk PL corporate tie-up replacing Bajaj Finance. TechVista (4,000 employees) processes 500 PL applications/year through Bajaj at 12.5%. We offer 10.5-11% with salary deduction EMI. HR Head concern: "Bajaj approves in 10 minutes. Your process takes 2 days." Create: (1) Per-employee savings calculation (₹42K saved per 8L loan over 5 years), (2) Pre-approved limits solution — load limits on salary accounts so approval is instant, (3) Cross-pollination roadmap: PL → CC pre-approved → salary migration → home loan funnel, (4) HR portal integration proposal (employee self-service), (5) Volume commitment: 50+ applications/month = zero processing guarantee.'
  },
  {
    id: 'close-infra-equipment-fleet',
    icon: '🏗️',
    title: 'Highway Contractor — 30 Vehicles + 5 Equipment Against L&T Finance',
    situation: 'Patel Infrastructure (800 Cr, 2 NHAI contracts) needs 30 tippers + 5 excavators. L&T Finance offers equipment lease at 11%. Our CV loan at 10.2%. But NHAI pays 120 days after milestone — needs moratorium/step-up EMI.',
    products: ['CV Loans', 'Equipment Finance', 'LAP', 'Fuel Cards'],
    challenge: 'Lumpy cash flow from government contracts. Standard EMI structure will cause defaults. How to structure for infrastructure clients?',
    prompt: 'Close a ₹15 Cr infrastructure finance deal (30 tippers + 5 excavators) against L&T Finance. Patel Infrastructure has NHAI contracts but payments come 120 days after milestones. They need EMI flexibility. Create: (1) Milestone-linked EMI structure (step-up EMI post first NHAI payment), (2) Equipment finance vs lease comparison showing our ownership advantage, (3) Fleet package: CV + equipment + fuel cards (150 existing vehicles) + LAP on warehouse, (4) L&T counter-positioning (L&T is equipment-only, we offer full relationship), (5) NHAI receivable discounting as bridge finance between milestones, (6) Speed commitment: sanction in 7 days for existing customer.'
  },
  {
    id: 'close-lap-professional',
    icon: '🏘️',
    title: 'CA — ₹3.5 Cr LAP with OD Facility Against ICICI/Axis',
    situation: 'CA Rajesh Gupta has 3 commercial properties (₹6 Cr). ICICI offers 60% LTV at 10.25%, Axis 55% at 10%. HDFC: 65% LTV at 9.75% but lower valuation. He needs OD, not term loan.',
    products: ['Loan Against Property (OD)', 'Business Loan', 'Professional Indemnity Insurance'],
    challenge: 'Valuation gap between banks. Customer disputes our lower valuation. How to bridge the gap and win on total proposition?',
    prompt: 'Close a ₹3.5 Cr LAP deal for a CA with 3 properties. Our valuation is ₹5.2 Cr vs ICICI at ₹6 Cr. But our LTV is 65% (₹3.38 Cr) vs ICICI 60% (₹3.6 Cr). Gap: ₹22L. Create: (1) Bridge solution: add second property or accept top-up business loan for remaining ₹12L at blended rate, (2) OD advantage math: show ₹4-6L/year interest savings vs term loan for irregular usage pattern (CAs draw down 40-60% on average), (3) Rate advantage: 9.75% vs 10.25% = ₹1.75L/year savings on ₹3.5 Cr, (4) Professional segment fast-track: GST-registered, no physical visit, digital valuation, (5) Revaluation option: request revaluation with mutually agreed empaneled valuer, (6) Closing sweetener: zero processing + immediate OD activation.'
  },
  {
    id: 'close-abcp-distribution',
    icon: '🤝',
    title: 'Insurance Company — Exclusive Distribution Partnership (5,000 branches)',
    situation: 'Max Life wants exclusive HDFC distribution for term insurance + ULIP. Currently with ICICI (50K guaranteed leads/quarter). HDFC offers higher conversion quality. Annual deal worth ₹80 Cr in premium.',
    products: ['ABCP Distribution', 'Co-branded Products', 'Salary Base Access', 'Digital Shelf'],
    challenge: 'ICICI offers guaranteed volume. We offer quality. How to win when the partner demands numbers?',
    prompt: 'Close a ₹80 Cr annual insurance distribution partnership against ICICI. Max Life wants guaranteed 50K leads/quarter. ICICI promises this. Our strength: higher conversion (3.2% vs 1.8%) and salary account base. Create: (1) Quality vs quantity math: 30K HDFC leads at 3.2% = 960 policies vs 50K ICICI leads at 1.8% = 900 policies, (2) Salary account employee base: 2M salary accounts for group insurance cross-sell, (3) Co-branded term plan for home loan customers (natural cross-sell at loan disbursal), (4) Digital shelf on HDFC app reaching 40M MAU, (5) Tiered volume commitment: 30K → 40K → 50K over 3 quarters as processes mature, (6) Exclusive territory proposal for 500 branches in top-10 cities.'
  },
  {
    id: 'close-lpg-treasury',
    icon: '🏢',
    title: 'Retailer — 15,000 Salary Accounts + ₹300 Cr FD Migration',
    situation: 'Future Retail (15K employees, ₹300 Cr FD book) unhappy with Kotak. SBI is incumbent for 60% of salary accounts. Group Treasury wants better FD returns + digital experience for store staff.',
    products: ['Salary Accounts', 'Corporate FD', 'Salary Advance', 'Zero-Balance Contractual'],
    challenge: 'Risk-averse HR Head fears migration chaos. Treasury wants better rates. Two stakeholders, conflicting priorities.',
    prompt: 'Close a 15,000-employee salary account deal + ₹300 Cr FD migration from SBI/Kotak. Group Treasury wants higher FD returns (SBI at 7.5%, Kotak at 7.3%). HR wants zero disruption. Create: (1) Dual-stakeholder strategy: Treasury (money) and HR (risk) alignment, (2) FD value proposition: sweep-in FD effective yield 7.6% + overnight FD + flexi partial withdrawal, (3) Salary tiering: store staff (zero-balance + salary advance) / middle mgmt (savings + CC) / senior (premium + PB), (4) Migration plan: new joiners on HDFC immediately, voluntary switch with incentives for existing, 90-day parallel run, (5) WhatsApp banking for 10,000 store-level employees who rarely visit branches, (6) ROI model: FD yield improvement + reduced attrition from premium salary benefits = ₹2.4 Cr annual value.'
  },
  {
    id: 'close-dbc-embedded',
    icon: '📱',
    title: 'Fintech — Full-Stack Embedded Banking Partnership (8M Users)',
    situation: 'MobiWallet (8M users, ₹400 Cr/month UPI) left small bank partner. Wants HDFC for embedded FD + lending + cards. CTO needs 99.99% uptime + sandbox. CEO needs revenue share model.',
    products: ['BankOne API', 'Embedded Lending', 'Co-branded Cards', 'FD-in-App', 'UPI PSP'],
    challenge: 'Previous bank pulled plug with 7 days notice. They need contractual protection + technology proof before committing.',
    prompt: 'Close an embedded banking partnership with MobiWallet (8M users). They are scarred by previous bank dumping them with 7-day notice. Create: (1) Contractual protection: 12-month wind-down clause, 6-month notice period, data portability guarantee, (2) Technology proof: sandbox environment with production-like data available in 72 hours, (3) Product launch sequencing: Month 1 (FD-in-app) → Month 3 (lending API) → Month 6 (co-branded virtual card), (4) Revenue model: FD (margin share), lending (commission per disbursement), cards (interchange share), (5) Regulatory positioning: tier-1 bank partnership = RBI comfort, no FLDG issues, (6) Uptime SLA: 99.99% with penalty clause + dedicated tech SPOC, (7) Growth pitch: as they scale to 20M users, bank infrastructure is the only scalable path.'
  },
];

export const BEFORE_DURING_AFTER_FRAMEWORK = {
  title: '3 Ways GenAI Sharpens Your Sales Motion',
  phases: [
    {
      phase: 'BEFORE the Meeting',
      icon: '🔍',
      color: '#3B82F6',
      capabilities: [
        { title: 'Prospect Research', description: 'Company financials, industry trends, recent news, key decision-makers' },
        { title: 'Industry Intelligence', description: 'Sector-specific pain points, regulatory changes, competitive dynamics' },
        { title: 'Competitor Analysis', description: 'What the competitor offers, their weaknesses, positioning strategy' },
        { title: 'Objection Anticipation', description: 'Pre-build responses to likely pushbacks based on customer profile' },
        { title: 'Meeting Strategy', description: 'Conversation plan, power questions, opening rapport-builders' },
      ],
    },
    {
      phase: 'DURING the Meeting',
      icon: '🎯',
      color: '#10B981',
      capabilities: [
        { title: 'Real-time Pitch Tailoring', description: 'Adjust messaging based on customer signals and questions raised' },
        { title: 'Quick Calculations', description: 'EMI estimates, total cost comparisons, eligibility checks on the spot' },
        { title: 'Objection Counters', description: 'Access pre-prepared responses to handle unexpected objections' },
        { title: 'Cross-sell Triggers', description: 'Identify and propose relevant additional products based on customer needs revealed' },
        { title: 'Competitive Positioning', description: 'Instant comparison data when competitor is mentioned' },
      ],
    },
    {
      phase: 'AFTER the Meeting',
      icon: '📝',
      color: '#8B5CF6',
      capabilities: [
        { title: 'Meeting Notes → Actions', description: 'Convert raw notes to structured follow-ups with owners and deadlines' },
        { title: 'Proposal Drafting', description: 'Generate customized proposals incorporating meeting discussion points' },
        { title: 'Follow-up Communication', description: 'Draft personalized follow-up emails referencing specific conversation points' },
        { title: 'Pipeline Update', description: 'Structure meeting outcomes for CRM entry' },
        { title: 'Deal Strategy Refinement', description: 'Adjust approach based on new information gathered in meeting' },
      ],
    },
  ],
};
