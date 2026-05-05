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
