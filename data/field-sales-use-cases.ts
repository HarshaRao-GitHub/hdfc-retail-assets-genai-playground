export interface FieldSalesUseCase {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  audience: string[];
  coverageLevel: 'hands-on' | 'demo' | 'awareness';
  productLine: string[];
  anchorScenario: string;
  samplePrompt: string;
}

export const FIELD_SALES_USE_CASE_CATEGORIES = [
  { id: 'prospect-research', label: 'Pre-Meeting Prospect Research', icon: '🔍', color: '#3B82F6' },
  { id: 'competitive-positioning', label: 'Competitive Positioning', icon: '⚔️', color: '#DC2626' },
  { id: 'objection-handling', label: 'Objection Handling & Persuasion', icon: '🗣️', color: '#F59E0B' },
  { id: 'pitch-personalization', label: 'Pitch Personalization', icon: '🎯', color: '#10B981' },
  { id: 'cross-sell', label: 'Cross-sell & Deal Expansion', icon: '🔄', color: '#8B5CF6' },
  { id: 'deal-closing', label: 'Deal Closing & Acceleration', icon: '🤝', color: '#059669' },
  { id: 'industry-research', label: 'Industry & Vertical Research', icon: '📊', color: '#0066B3' },
  { id: 'post-meeting', label: 'Post-Meeting Follow-through', icon: '📝', color: '#D97706' },
] as const;

export const FIELD_SALES_USE_CASES: FieldSalesUseCase[] = [
  // ─── Prospect Research ───
  {
    id: 'fs-corporate-research',
    title: 'Corporate Prospect Intelligence Brief',
    category: 'prospect-research',
    icon: '🏢',
    description: 'Generate a comprehensive pre-meeting intelligence brief for a corporate prospect — industry context, financial health indicators, banking needs, and competitive positioning.',
    audience: ['Corporate RM', 'Branch Manager'],
    coverageLevel: 'hands-on',
    productLine: ['Business Loan', 'Commercial Vehicle Loan', 'Merchant Acquiring'],
    anchorScenario: 'Sitting in the corporate lobby, 10 minutes before meeting the CFO.',
    samplePrompt: 'I am about to meet the CFO of a mid-size auto components company (300 Cr revenue, 1500 employees, supplies to Tata Motors, currently banks with ICICI). I want to pitch commercial vehicle loans and business loans. In 5 minutes, give me: industry health snapshot, their likely banking pain points, 5 power questions to ask, and why they should consider HDFC over ICICI. Format as a scannable 1-page brief.'
  },
  {
    id: 'fs-individual-profiling',
    title: 'Individual Prospect Quick Profile',
    category: 'prospect-research',
    icon: '👤',
    description: 'Build a quick customer profile and product-fit assessment for an individual prospect based on available information — occupation, life stage, income signals.',
    audience: ['Retail RM', 'Branch Executive'],
    coverageLevel: 'hands-on',
    productLine: ['Home Loan', 'Auto Loan', 'Personal Loan', 'Credit Card'],
    anchorScenario: 'Walk-in customer at branch — need to assess and respond in real-time.',
    samplePrompt: 'A 32-year-old software engineer (Infosys, 18 LPA) just walked in asking about home loans. He is getting married next month, looking at 2BHK in Whitefield Bangalore (budget 80-90L), has 15L savings, salary account with SBI. In 2 minutes, tell me: his likely eligibility, best product fit, competitive threats (SBI pre-approved), cross-sell opportunities, and 3 key questions I should ask to qualify him further.'
  },
  {
    id: 'fs-public-info-leverage',
    title: 'Leveraging Public Information for Sales Edge',
    category: 'prospect-research',
    icon: '🌐',
    description: 'Teach sales professionals to use publicly available information (company websites, annual reports, news, LinkedIn, GST portal) to prepare for meetings.',
    audience: ['All Sales', 'RM'],
    coverageLevel: 'hands-on',
    productLine: ['All Products'],
    anchorScenario: 'No insider information available — use only public data to seem prepared.',
    samplePrompt: 'I have a meeting with a logistics company tomorrow. I only know their name, city, and approximate size. Show me exactly what public information sources I can use (without breaching privacy) to learn about them before the meeting. For each source, tell me what specific sales-relevant data I can extract and how to use it in conversation.'
  },

  // ─── Competitive Positioning ───
  {
    id: 'fs-rate-counter',
    title: 'Rate War Counter-Strategy',
    category: 'competitive-positioning',
    icon: '📉',
    description: 'Build total-cost-of-ownership arguments when a competitor is offering a lower headline interest rate — reveal hidden costs and quantify HDFC\'s true value.',
    audience: ['All Sales', 'RM', 'Branch Manager'],
    coverageLevel: 'hands-on',
    productLine: ['Home Loan', 'Auto Loan', 'LAP', 'Business Loan'],
    anchorScenario: 'Customer shows competitor offer letter with lower rate — need to respond on the spot.',
    samplePrompt: 'A customer shows me SBI home loan offer at 8.25% vs our 8.50%. Loan amount 1 Cr, 20 years. Create a total cost comparison that shows where HDFC wins despite the rate gap: processing fee (SBI 0.35% vs HDFC 0.5% but capped at 10K), insurance bundling differences, prepayment flexibility, rate reset mechanism (EBLR vs RLLR frequency), and service quality quantified. Show me the EXACT numbers to present.'
  },
  {
    id: 'fs-competitor-weakness',
    title: 'Competitor Vulnerability Exploitation',
    category: 'competitive-positioning',
    icon: '🎯',
    description: 'Identify and ethically leverage known weaknesses of specific competitor banks for different product lines — slow processing, poor service, hidden charges.',
    audience: ['Corporate RM', 'Branch Manager'],
    coverageLevel: 'demo',
    productLine: ['All Products'],
    anchorScenario: 'Customer mentions they are already in talks with a specific competitor.',
    samplePrompt: 'A corporate prospect says they are close to finalizing business loan with Bajaj Finance because of instant approval. I know Bajaj has higher rates, shorter tenure, aggressive recovery, and compulsory insurance. Create a tasteful but effective comparison card that highlights these gaps without badmouthing the competitor. Show me how to position HDFC as "the mature business banking partner" vs "the quick-fix lender."'
  },
  {
    id: 'fs-lost-deal-recovery',
    title: 'Win-Back Strategy for Lost Deals',
    category: 'competitive-positioning',
    icon: '🔄',
    description: 'Develop re-approach strategies for customers who chose a competitor — timing, triggers, and positioning for the balance-transfer/migration pitch.',
    audience: ['RM', 'Sales Manager'],
    coverageLevel: 'demo',
    productLine: ['Home Loan', 'Business Loan', 'Merchant Acquiring'],
    anchorScenario: 'Reviewing lost deals from last quarter — which ones can we win back?',
    samplePrompt: 'I lost a home loan deal to SBI 6 months ago (customer chose 8.25% rate). SBI has annual rate reset — their rate will likely increase to 9.1% at reset. Our current rate is 8.50%. Create a balance transfer win-back strategy: (1) When exactly to re-approach, (2) The savings pitch with exact calculations, (3) How to make switching seem effortless, (4) What additional products to bundle that SBI cannot offer.'
  },

  // ─── Objection Handling ───
  {
    id: 'fs-rate-objection',
    title: 'Handling "Your Rate is Too High"',
    category: 'objection-handling',
    icon: '💰',
    description: 'Generate multi-strategy responses to the most common banking objection — rate comparison. Cover empathetic, analytical, and offer-based counter-approaches.',
    audience: ['All Sales'],
    coverageLevel: 'hands-on',
    productLine: ['Home Loan', 'Personal Loan', 'Business Loan', 'Auto Loan'],
    anchorScenario: 'Customer has competitor rate card on their phone and is asking you to match.',
    samplePrompt: 'Customer: "SBI is giving personal loan at 10.65%. You are at 13%. That is a LOT more over 5 years. Why should I pay extra?" Generate 3 complete response strategies: (1) Empathetic — acknowledge and redirect to value, (2) Data-driven — total cost with processing fees, insurance, prepayment penalty comparison, (3) Offer-led — what we can do within policy to bridge the gap. Make each response conversational, not scripted.'
  },
  {
    id: 'fs-process-objection',
    title: 'Handling "Too Much Documentation/Process"',
    category: 'objection-handling',
    icon: '📋',
    description: 'Counter the "your process is too complicated" objection by reframing documentation as value (better rate, higher amount) and offering simplification.',
    audience: ['All Sales'],
    coverageLevel: 'hands-on',
    productLine: ['Business Loan', 'LAP', 'Tractor Finance'],
    anchorScenario: 'Self-employed customer frustrated with documentation list — considering NBFC with minimal docs.',
    samplePrompt: 'A textile businessman in Surat says: "Bajaj asks for Aadhaar and PAN only. You are asking for ITR, GST returns, bank statements, trade references, property papers... I don\'t have time for all this." He needs 30L business loan. Create my response that: (1) Acknowledges his time constraints, (2) Shows WHY more documentation gives HIM better terms (12% vs 18% rate, 30L vs 10L amount, 7 years vs 3 years tenure), (3) Offers a simplified document path (GST-registered track), (4) Makes him feel smart choosing us over the easy option.'
  },
  {
    id: 'fs-relationship-objection',
    title: 'Handling "I Have Been With X Bank for Years"',
    category: 'objection-handling',
    icon: '🏦',
    description: 'Overcome loyalty-based objections where customers resist switching because of long-standing relationships with their existing bank.',
    audience: ['Corporate RM', 'RM'],
    coverageLevel: 'hands-on',
    productLine: ['Current Account', 'Merchant Acquiring', 'Business Loan'],
    anchorScenario: 'Merchant has been with SBI for 20 years and sees no reason to change.',
    samplePrompt: 'A grocery store owner (3 outlets, 65L/month turnover) says: "My father opened this SBI account. I have been with them 20 years. Everything works. Why should I change?" I want him to open a Current Account and take our POS. Create a strategy that: (1) Does NOT ask him to leave SBI, (2) Positions HDFC as "your growth banker alongside SBI," (3) Shows specific service gaps SBI has for retail merchants, (4) Uses the POS savings (free terminal vs paid) as entry point, (5) Builds to full relationship over 12 months.'
  },
  {
    id: 'fs-timing-objection',
    title: 'Handling "Not Now, Maybe Later"',
    category: 'objection-handling',
    icon: '⏰',
    description: 'Convert "timing" objections into urgency — show customers why waiting costs them money and how to lock in current advantages.',
    audience: ['All Sales'],
    coverageLevel: 'demo',
    productLine: ['Home Loan', 'Business Loan', 'LAP'],
    anchorScenario: 'Customer likes the offer but keeps postponing the decision.',
    samplePrompt: 'A CA wants LAP of 80L for office purchase but says "Let me think about it for 2-3 weeks" even though ICICI is also in the picture (10-day promise). Create urgency without being pushy: (1) Rate trajectory argument (rates may increase), (2) Property opportunity cost (the office space won\'t wait), (3) Processing advantage of starting now, (4) Limited-period offer framing, (5) The "what do you lose by starting paperwork today" soft close.'
  },

  // ─── Pitch Personalization ───
  {
    id: 'fs-b2c-vs-b2b',
    title: 'B2C vs B2B Pitch Adaptation',
    category: 'pitch-personalization',
    icon: '🎭',
    description: 'Demonstrate how the same product requires fundamentally different pitching approaches for individual consumers vs business entities.',
    audience: ['All Sales'],
    coverageLevel: 'hands-on',
    productLine: ['Commercial Vehicle Loan', 'Tractor Finance', 'Auto Loan'],
    anchorScenario: 'Back-to-back meetings — individual farmer at 10 AM, corporate fleet manager at 3 PM.',
    samplePrompt: 'I am pitching vehicle finance twice today: (A) A farmer who wants 1 tractor (8.5L, no CIBIL, skeptical of banks), and (B) A logistics VP who wants 20 commercial vehicles (3.5 Cr fleet deal, data-driven, comparing 3 lenders). Create two COMPLETELY different pitch strategies showing how language, benefits framing, conversation style, and closing technique must change between individual and corporate customers for the SAME product category.'
  },
  {
    id: 'fs-industry-tailored',
    title: 'Industry-Specific Pitch Tailoring',
    category: 'pitch-personalization',
    icon: '🏭',
    description: 'Customize the standard product pitch for specific industry verticals — healthcare, manufacturing, retail, logistics — using sector-specific language and pain points.',
    audience: ['Corporate RM'],
    coverageLevel: 'hands-on',
    productLine: ['Business Loan', 'Merchant Acquiring', 'Payment Gateway'],
    anchorScenario: 'Standard product pitch fails because it does not resonate with the industry context.',
    samplePrompt: 'I have the same product (Business Loan + POS) to pitch to 3 different industries next week: (1) A restaurant chain owner (F&B), (2) A dental clinic owner (Healthcare), (3) A coaching institute director (Education). For each, create an industry-specific pitch that: speaks their language, addresses their unique pain points, quantifies benefits in their metrics, and positions the product as solving THEIR specific problem, not a generic bank product.'
  },
  {
    id: 'fs-lifecycle-pitch',
    title: 'Life-Stage Based Pitch Personalization',
    category: 'pitch-personalization',
    icon: '📅',
    description: 'Adapt loan pitches based on customer life stage — first job, marriage, first child, business expansion, retirement planning.',
    audience: ['Retail RM', 'Branch Executive'],
    coverageLevel: 'demo',
    productLine: ['Home Loan', 'Personal Loan', 'Auto Loan', 'Credit Card'],
    anchorScenario: 'Same product, three different customers at different life stages.',
    samplePrompt: 'I am pitching home loans today to 3 customers: (1) Rahul, 27, just got first job at Google (25 LPA), single, wants studio apartment, (2) Neha & Vikram, 31, married 2 years, expecting first child, need bigger home, (3) Suresh, 55, retired bank manager, buying flat for son\'s wedding. Create 3 completely personalized pitch approaches: different benefits highlighted, different emotional triggers, different rate strategies, different cross-sell products. Show how the same home loan becomes 3 different stories.'
  },

  // ─── Cross-sell ───
  {
    id: 'fs-onboarding-crosssell',
    title: 'Cross-sell at Point of Onboarding',
    category: 'cross-sell',
    icon: '✨',
    description: 'Maximize the golden moment of product onboarding to introduce 2-3 additional products when customer engagement and trust are at their peak.',
    audience: ['All Sales', 'Branch Executive'],
    coverageLevel: 'hands-on',
    productLine: ['Credit Card', 'Insurance', 'CASA', 'Personal Loan'],
    anchorScenario: 'Customer signing auto loan docs — 10 minutes to pitch additional products naturally.',
    samplePrompt: 'Priyanka (28, Google PM, 42 LPA) is signing her BMW auto loan (18L). She has HDFC savings and Millennia card. Salary goes to ICICI. Create a 10-minute cross-sell conversation flow that naturally introduces: (1) Infinia card upgrade (lifestyle-aligned), (2) CASA salary migration (auto-debit convenience), (3) Motor insurance (before she drives out). Make it feel like helpful advice, not product pushing. Include what to say and what NOT to say.'
  },
  {
    id: 'fs-portfolio-crosssell',
    title: 'Mining Existing Portfolio for Cross-sell',
    category: 'cross-sell',
    icon: '💎',
    description: 'Use customer signals and product holding patterns to identify the next-best-product for existing customers and the right trigger moment.',
    audience: ['RM', 'Sales Manager'],
    coverageLevel: 'demo',
    productLine: ['All Products'],
    anchorScenario: 'Reviewing existing customer book — where are the untapped cross-sell opportunities?',
    samplePrompt: 'I have an auto loan customer (3 years, perfect repayment, salary 18 LPA, no other HDFC products). Analyse what cross-sell signals this profile shows and create a prioritized outreach plan: (1) Which product next and why, (2) The right trigger moment to approach, (3) The conversation opener that connects to their existing product, (4) Expected conversion probability per product. Show how each product deepens the relationship.'
  },
  {
    id: 'fs-merchant-expansion',
    title: 'Merchant Relationship Expansion',
    category: 'cross-sell',
    icon: '🏪',
    description: 'Expand a merchant from POS-only to full business banking — current account, business loan, corporate cards, payment gateway.',
    audience: ['Merchant Sales', 'RM'],
    coverageLevel: 'hands-on',
    productLine: ['Merchant Acquiring', 'Current Account', 'Business Loan', 'Corporate CC'],
    anchorScenario: 'Merchant has 1 POS terminal with us. Monthly transactions show growing business. Time to deepen.',
    samplePrompt: 'A jewellery store merchant has 1 HDFC POS terminal (processing 1.2 Cr/month in card transactions). They bank with SBI (current account) and have no lending relationship with us. Their transaction data shows 25% YoY growth. Create a relationship expansion strategy: (1) Why they should move current account to HDFC, (2) How their POS data makes them eligible for 50L business loan, (3) Corporate CC for gold purchase trips, (4) Online payment link for festive pre-booking. Build a 6-month migration roadmap.'
  },

  // ─── Deal Closing ───
  {
    id: 'fs-same-day-close',
    title: 'Same-Day Deal Closing Techniques',
    category: 'deal-closing',
    icon: '⚡',
    description: 'Create urgency and remove friction to close deals in a single meeting — the "why not today?" approach with proper preparation.',
    audience: ['All Sales', 'RM'],
    coverageLevel: 'hands-on',
    productLine: ['Personal Loan', 'Auto Loan', 'Credit Card', 'Merchant Acquiring'],
    anchorScenario: 'Customer is interested but not ready to commit — how to convert interest to action today.',
    samplePrompt: 'A young professional (28, 42 LPA) is interested in auto loan for BMW X1 but says "let me check with a few more banks this weekend." I know she has no competitor offers in hand — this is just default caution. Create a same-day closing strategy: (1) Pre-approved offer reveal (create sense of exclusivity), (2) "What happens if you wait" argument (rate, car availability), (3) Paperless instant process (she hates paperwork), (4) The soft close: "Shall I just create the application and you can always decide later?" Make me close today.'
  },
  {
    id: 'fs-complex-deal',
    title: 'Complex Multi-Product Deal Structuring',
    category: 'deal-closing',
    icon: '🧩',
    description: 'Structure and close complex deals involving multiple products for corporate customers — packaging, pricing, and presentation strategy.',
    audience: ['Corporate RM', 'Branch Manager'],
    coverageLevel: 'demo',
    productLine: ['Multiple Products'],
    anchorScenario: 'Corporate customer needs 4 different products — how to package them as one relationship?',
    samplePrompt: 'A logistics company (420 Cr revenue, existing customer) needs: 20 CV loans (3.5 Cr), corporate fuel cards (200 cards), working capital facility (5 Cr), and payment gateway for client invoicing. SBI is offering the CV fleet deal alone at 8.75%. Create a "Total Relationship Proposal" that: (1) Packages all 4 products with cross-subsidized pricing, (2) Shows the TCO advantage of HDFC bundle vs buying each from different providers, (3) Includes implementation timeline, (4) Quantifies value delivered per year, (5) Makes the decision-maker feel stupid splitting this across banks.'
  },

  // ─── Industry Research ───
  {
    id: 'fs-new-vertical',
    title: 'Rapid Industry Vertical Learning',
    category: 'industry-research',
    icon: '📚',
    description: 'Use AI to rapidly learn a new industry vertical you have never sold into before — enough to sound credible in a first meeting.',
    audience: ['All Sales'],
    coverageLevel: 'hands-on',
    productLine: ['All Products'],
    anchorScenario: 'Assigned to cover renewable energy sector — first meeting in 2 hours, zero prior knowledge.',
    samplePrompt: 'I have been assigned to cover the renewable energy sector and have a meeting with a solar company CFO in 2 hours. I know NOTHING about solar. Give me a crash course: (1) How solar companies make money, (2) Their typical banking needs, (3) Key terminology I must know (PPA, RPO, EPC, etc.), (4) Government policies affecting the sector, (5) 5 questions that demonstrate sector knowledge, (6) Common mistakes bankers make when approaching solar companies. Make me dangerous in 2 hours.'
  },
  {
    id: 'fs-sector-pain-points',
    title: 'Industry Pain Points → Banking Solutions',
    category: 'industry-research',
    icon: '🎯',
    description: 'Map specific industry pain points to HDFC product solutions — understand WHY they need banking help, not just WHAT products to sell.',
    audience: ['Corporate RM', 'Sales Manager'],
    coverageLevel: 'demo',
    productLine: ['Business Loan', 'Commercial Vehicle Loan', 'Merchant Acquiring'],
    anchorScenario: 'Need to understand what drives borrowing needs in different industries.',
    samplePrompt: 'Map the top 5 financial pain points of the logistics/transportation industry to HDFC products: (1) What hurts them financially (fuel costs, vehicle maintenance, driver costs, client payment delays), (2) How each pain point creates a banking need, (3) Which HDFC product solves it, (4) How to frame the conversation around their pain (not our product). Present as a "Pain → Product → Pitch" framework.'
  },
  {
    id: 'fs-seasonal-intelligence',
    title: 'Seasonal Selling Intelligence',
    category: 'industry-research',
    icon: '📅',
    description: 'Understand industry-specific seasonal patterns that create peak selling opportunities — when are different sectors most likely to borrow?',
    audience: ['Sales Manager', 'Branch Manager'],
    coverageLevel: 'awareness',
    productLine: ['All Products'],
    anchorScenario: 'Planning next quarter\'s sales calendar — which industries to target when.',
    samplePrompt: 'Build a 12-month selling calendar showing: which industries have peak banking needs in each month, what triggers the need (harvest, festive, fiscal year, admissions), which HDFC products are in demand, and what competitive offers to watch out for. Focus on: agriculture (tractor), retail (POS/BL), manufacturing (CV/BL), and healthcare (equipment). Present as a monthly action calendar for an RM team.'
  },

  // ─── Post-Meeting ───
  {
    id: 'fs-meeting-to-actions',
    title: 'Meeting Notes → Structured Follow-up',
    category: 'post-meeting',
    icon: '📝',
    description: 'Convert messy meeting notes into structured action items, CRM entries, and follow-up communication — never let a lead go cold.',
    audience: ['All Sales'],
    coverageLevel: 'hands-on',
    productLine: ['All Products'],
    anchorScenario: 'Just walked out of a 45-minute corporate meeting with scribbled notes on the back of a visiting card.',
    samplePrompt: 'Just left a meeting with Bharat Logistics VP. My scribbled notes: "Needs 20 trucks, Amazon contract, SBI 8.75%, want fleet pricing, also asked about fuel cards, CFO approval needed, send proposal by Friday, existing customer - 3 loans already, mention dedicated fleet desk." Convert this into: (1) Structured CRM update, (2) Action items with deadlines, (3) Draft email to the VP summarizing discussion, (4) Internal note to RBH requesting fleet pricing approval, (5) Proposal outline.'
  },
  {
    id: 'fs-proposal-draft',
    title: 'AI-Assisted Proposal Generation',
    category: 'post-meeting',
    icon: '📄',
    description: 'Generate customized credit proposals and product presentations incorporating meeting-specific discussion points and customer requirements.',
    audience: ['Corporate RM', 'Branch Manager'],
    coverageLevel: 'demo',
    productLine: ['Business Loan', 'Commercial Vehicle Loan', 'LAP'],
    anchorScenario: 'VP asked for a written proposal by Friday — need to create from scratch quickly.',
    samplePrompt: 'Create a professional proposal for Bharat Logistics (420 Cr, 2500 employees, existing customer): Fleet CV Loan for 20 Tata Ace trucks (estimated 3.5 Cr), bundled with corporate fuel cards (200 cards) and dedicated fleet desk service. Include: executive summary, proposed terms, pricing rationale, implementation timeline, SBI comparison (we are better because...), and required approvals from their side. Make it boardroom-ready.'
  },
  {
    id: 'fs-follow-up-cadence',
    title: 'Intelligent Follow-up Cadence Design',
    category: 'post-meeting',
    icon: '📧',
    description: 'Design multi-touch follow-up sequences that keep deals warm without being pushy — the right message at the right time through the right channel.',
    audience: ['All Sales', 'RM'],
    coverageLevel: 'demo',
    productLine: ['Home Loan', 'Business Loan', 'Merchant Acquiring'],
    anchorScenario: 'Customer said "I\'ll think about it" — how to follow up without annoying them.',
    samplePrompt: 'The IT couple (home loan, 1.2 Cr) said "we will decide this weekend" but it has been 5 days with no response. Design a 14-day follow-up sequence: (1) Day 1 after deadline: gentle check-in, (2) Day 3: add-value touch (new property they might like), (3) Day 7: rate-change trigger (if applicable), (4) Day 10: loss-aversion message, (5) Day 14: final graceful close or park. For each touchpoint: channel (call/WhatsApp/email), exact message draft, and tone guidance.'
  },
  {
    id: 'fs-deal-pipeline-review',
    title: 'AI-Assisted Pipeline Review & Strategy',
    category: 'post-meeting',
    icon: '📊',
    description: 'Use AI to review your deal pipeline, identify at-risk deals, suggest acceleration tactics, and prioritize your week based on deal probability and value.',
    audience: ['RM', 'Sales Manager'],
    coverageLevel: 'awareness',
    productLine: ['All Products'],
    anchorScenario: 'Monday morning — reviewing 15 open deals. Which ones need attention this week?',
    samplePrompt: 'Review my pipeline of 10 deals and help me prioritize my week. For each deal, assess: (1) Risk of losing (based on days in stage and competitor presence), (2) What specific action moves it forward, (3) If I can only work 5 deals this week, which ones and why? Also flag: deals that might be dead (I should disqualify), deals where I need manager help, and quick wins I can close this week.'
  },
];

export function getFieldSalesUseCasesByCategory(categoryId: string): FieldSalesUseCase[] {
  return FIELD_SALES_USE_CASES.filter(uc => uc.category === categoryId);
}
