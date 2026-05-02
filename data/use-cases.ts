export interface UseCase {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  audience: string[];
  dayNumber: 1 | 2;
  coverageLevel: 'hands-on' | 'demo' | 'awareness';
  samplePrompt: string;
}

export const USE_CASE_CATEGORIES = [
  { id: 'lifecycle', label: 'Retail Asset Lifecycle', icon: '🏦', color: '#004B87' },
  { id: 'sales', label: 'Sales, Upselling & Cross-sell', icon: '📈', color: '#059669' },
  { id: 'operations', label: 'Operational Efficiency', icon: '⚙️', color: '#7C3AED' },
  { id: 'risk', label: 'Risk, Fraud & Compliance', icon: '🛡️', color: '#DC2626' },
  { id: 'customer', label: 'Customer Engagement & Service', icon: '🤝', color: '#0066B3' },
  { id: 'strategy', label: 'Team Enablement & Strategy', icon: '🗺️', color: '#D97706' },
] as const;

export const USE_CASES: UseCase[] = [
  {
    id: 'loan-origination',
    title: 'AI-Powered Loan Origination',
    category: 'lifecycle',
    icon: '🏠',
    description: 'Automate and streamline the end-to-end home loan origination process — from lead capture to sanction letter generation — using GenAI.',
    audience: ['Sales', 'Product'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'A salaried customer (age 35, IT professional, CTC 24 LPA, existing HDFC CASA customer) wants a home loan of INR 80 lakhs for a 2BHK in Whitefield, Bangalore. Draft a complete loan origination summary including eligibility assessment, recommended tenure, EMI estimate, required documents checklist, and a personalized cover letter to the customer.'
  },
  {
    id: 'kyc-verification',
    title: 'Automating KYC & Document Verification',
    category: 'lifecycle',
    icon: '📋',
    description: 'Use GenAI to extract, validate, and cross-check KYC documents — PAN, Aadhaar, address proofs — reducing manual review time from hours to minutes.',
    audience: ['Service', 'Product'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'I have a home loan application with the following KYC documents: PAN card (ABCDE1234F), Aadhaar (masked), electricity bill for address proof, and 6 months bank statements. Create a KYC verification checklist, flag potential discrepancies to look for, and generate a verification summary report template.'
  },
  {
    id: 'alternative-credit',
    title: 'Creditworthiness Using Alternative Data',
    category: 'lifecycle',
    icon: '📊',
    description: 'Assess creditworthiness of non-salaried and thin-file customers using alternative data signals — transactional patterns, digital footprint, and behavioral analytics.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'A self-employed business owner (garment shop in Surat, 5 years in business, no ITR filed for 2 years, but has strong UPI transaction history of INR 8-12 lakhs/month) is applying for a Loan Against Property of INR 40 lakhs. How can AI use alternative data to assess creditworthiness? Create a framework for evaluating this customer.'
  },
  {
    id: 'doc-processing',
    title: 'Mortgage Document Processing',
    category: 'lifecycle',
    icon: '📄',
    description: 'Process unstructured mortgage documents — sanction letters, ITRs, bank statements, property documents — using plain English queries instead of manual reading.',
    audience: ['Service', 'Sales', 'Product'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'I have a 15-page property title deed document. Ask the following questions: 1) Who is the current owner? 2) Are there any encumbrances or liens? 3) What is the property area and type? 4) Is the chain of title complete for the last 30 years? Summarize the findings in a tabular format with risk flags.'
  },
  {
    id: 'underwriting-disbursement',
    title: 'Underwriting & Disbursement Workflows',
    category: 'lifecycle',
    icon: '✅',
    description: 'Map and optimize underwriting decision workflows and disbursement processes using AI-driven checklists, auto-validation, and exception flagging.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'Create an AI-assisted underwriting checklist for a home loan application of INR 1.2 Cr. The customer is a 42-year-old doctor with private practice income. Map the complete workflow from application receipt to disbursement, highlighting where AI can automate vs where human review is mandatory per RBI guidelines.'
  },
  {
    id: 'default-risk',
    title: 'Predicting Default Risk',
    category: 'lifecycle',
    icon: '⚠️',
    description: 'Use AI-driven predictive models to identify early warning signals of potential loan defaults and recommend proactive outreach strategies.',
    audience: ['Portfolio', 'Product'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'A home loan customer (outstanding INR 45 lakhs, EMI 38,000, 18 months into tenure) has shown: 2 EMI bounces in last 6 months, salary credit reduced by 30%, and increased credit card utilization to 85%. Analyze default risk probability, recommend early intervention strategies, and draft a customer outreach plan.'
  },
  {
    id: 'dynamic-outreach',
    title: 'Dynamic Outreach Strategies',
    category: 'lifecycle',
    icon: '📞',
    description: 'Generate AI-personalized outreach and follow-up strategies for different stages of the mortgage customer lifecycle.',
    audience: ['Sales', 'Service'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'Create a 90-day dynamic outreach plan for a home loan customer who visited the branch, showed interest in a 3BHK property in Pune (budget INR 1.5 Cr) but did not submit an application. Include touchpoints, message templates, and escalation triggers.'
  },
  {
    id: 'anomaly-flagging',
    title: 'Real-time Anomaly Flagging Before Disbursement',
    category: 'lifecycle',
    icon: '🔍',
    description: 'AI-driven real-time checks to flag anomalies in application data, documents, or property details before loan disbursement.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'awareness',
    samplePrompt: 'Before disbursing a home loan of INR 65 lakhs, the following anomalies were detected: property valuation differs by 25% between two assessors, applicant address on bank statement differs from Aadhaar, and employer verification shows a mismatch. Create an anomaly assessment report with risk severity and recommended actions.'
  },
  {
    id: 'sales-leads',
    title: 'Sales Leads Generation Using GenAI',
    category: 'sales',
    icon: '🎯',
    description: 'Leverage GenAI to identify, qualify, and prioritize sales leads from existing customer data, digital interactions, and market signals.',
    audience: ['Sales'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'From our existing CASA customer base in Mumbai, identify the profile of ideal home loan prospects. Create a lead scoring framework using these parameters: age, income, savings pattern, existing relationship depth, life stage indicators. Generate 5 synthetic customer profiles that would rank as high-priority leads with recommended approach strategies.'
  },
  {
    id: 'sales-pitching',
    title: 'AI-Powered Sales Pitch Generation',
    category: 'sales',
    icon: '💼',
    description: 'Generate customized, compelling sales pitches for different customer segments — first-time buyers, property investors, NRIs, business owners.',
    audience: ['Sales'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'Draft a personalized home loan sales pitch for a young married couple (both IT professionals, combined income 30 LPA, first-time home buyers) looking at apartments in Hyderabad. Include: competitive rate positioning, tax benefit highlights, pre-approved offer framing, and a closing call-to-action. Make it conversational but professional.'
  },
  {
    id: 'sales-forecasting',
    title: 'Sales Forecasting Using GenAI',
    category: 'sales',
    icon: '📈',
    description: 'Forecast home loan disbursals, pipeline conversion, and regional demand using AI-driven pattern analysis and market intelligence.',
    audience: ['Sales', 'Product'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'Based on the following data pattern for the West region: Q1 disbursals INR 2,400 Cr, Q2 INR 2,100 Cr (dip due to monsoon), Q3 INR 2,800 Cr, Q4 INR 3,200 Cr — forecast next quarter disbursals considering: repo rate cut of 25bps, new PMAY guidelines, 3 new competitor launches, and festive season. Create a forecast model with best/base/worst scenarios.'
  },
  {
    id: 'upselling',
    title: 'AI-Driven Upselling & Cross-selling',
    category: 'sales',
    icon: '🔄',
    description: 'Use customer data and AI insights to identify upsell opportunities (top-up loans, balance transfer) and cross-sell products (CASA, insurance, credit cards).',
    audience: ['Sales', 'Service'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'Customer profile: Home loan customer for 3 years, outstanding INR 55 lakhs, perfect repayment record, salary credits of INR 1.8 LPA to a competitor bank CASA, no insurance with HDFC. Generate: 1) Top 3 cross-sell recommendations ranked by likelihood of conversion, 2) Personalized pitch for each product, 3) Best channel and timing for approach, 4) Estimated revenue per product.'
  },
  {
    id: 'segment-marketing',
    title: 'Segment-of-One Marketing',
    category: 'sales',
    icon: '🎪',
    description: 'Move from mass campaigns to hyper-personalized, segment-of-one marketing using GenAI-driven customer insights and behavioral analytics.',
    audience: ['Sales', 'Product'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'Create a hyper-personalized marketing campaign for a specific customer persona: 28-year-old startup founder, income volatile (INR 6-15 LPA), active mutual fund investor, recently married, browsing property sites in Bangalore. Design: message copy, channel mix, timing strategy, offer customization, and follow-up sequence. Explain how this differs from a generic home loan campaign.'
  },
  {
    id: 'micro-segmentation',
    title: 'AI-Driven Micro-Segmentation & CLV',
    category: 'sales',
    icon: '📐',
    description: 'Use behavioral analytics and AI to create micro-segments of customers and predict Customer Lifetime Value for targeted engagement.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'From a portfolio of 50,000 home loan customers, define 6 micro-segments based on: income stability, property type, geographic cluster, tenure stage, and cross-product holding. For each segment, calculate estimated CLV, recommend engagement strategy, and identify the top revenue opportunity. Present as a segmentation matrix.'
  },
  {
    id: 'objection-handler',
    title: 'AI Objection Handler for Sales',
    category: 'sales',
    icon: '🗣️',
    description: 'Generate intelligent, empathetic responses to common customer objections — rate comparisons, processing fees, documentation burden — in brand voice.',
    audience: ['Sales', 'Service'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'Customer objection: "SBI is offering 8.25% while HDFC is at 8.65%. Why should I pay more?" Generate 3 response strategies: 1) Empathetic — acknowledge and redirect to value, 2) Data-driven — total cost comparison with processing fees and insurance, 3) Offer-led — what we can match or sweeten. Each response should be conversational, not scripted.'
  },
  {
    id: 'automation-mundane',
    title: 'Automating Repetitive Sales Activities',
    category: 'operations',
    icon: '🤖',
    description: 'Identify and automate mundane sales tasks — data entry, report generation, follow-up scheduling, MIS compilation — to improve salesperson productivity.',
    audience: ['Sales', 'Service'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'A sales manager spends 3 hours daily on: 1) Compiling MIS from 5 different sources, 2) Writing follow-up emails to 20 prospects, 3) Preparing daily activity reports. Show how GenAI can automate each task. For the follow-up emails, generate 3 templates for different stages: initial inquiry, post-site-visit, and documentation pending. Estimate time saved per task.'
  },
  {
    id: 'back-office',
    title: 'Back-Office Operations with AI',
    category: 'operations',
    icon: '🗂️',
    description: 'Streamline back-office operations — document filing, data extraction, compliance reporting — using AI to handle unstructured documents at scale.',
    audience: ['Service', 'Product'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'A service branch processes 200 loan modification requests per month. Each requires: reading the customer letter, extracting request type, validating eligibility, and generating a response. Create an AI workflow that handles this process. Show the input format, processing steps, and output template for 3 request types: part-prepayment, tenure extension, and EMI holiday.'
  },
  {
    id: 'ai-scorecards',
    title: 'AI Scorecards & Income Estimation',
    category: 'operations',
    icon: '📊',
    description: 'Build AI-driven scorecards for income estimation from non-salary profiles and alternative data for faster, more accurate credit decisions.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'Design an AI scorecard for estimating monthly income of a self-employed professional (chartered accountant, 10 years practice). Available data: GST filings, bank statements showing irregular deposits, rent agreement for office space, and professional membership. Create the scorecard with parameters, weights, and scoring logic. Show how the final income estimate compares to traditional ITR-based assessment.'
  },
  {
    id: 'meeting-minutes',
    title: 'Meeting Minutes to Action Tracker',
    category: 'operations',
    icon: '📝',
    description: 'Convert meeting transcripts into structured action items with owners, due dates, and follow-up tracking using GenAI.',
    audience: ['Sales', 'Product', 'Portfolio', 'Service'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'Here is a sales review meeting transcript: "Rajesh mentioned the Pune disbursals are down 15% this month. Priya needs to submit the festive campaign plan by Friday. The Nagpur branch NPA is at 2.3% — Amit to investigate top 10 accounts. Next review on 20th." Extract: 1) Decisions made, 2) Action items with owners and due dates, 3) Risks flagged, 4) Open items. Format as a table ready for email distribution.'
  },
  {
    id: 'fraud-detection',
    title: 'Fraud Detection & Anomaly Patterns',
    category: 'risk',
    icon: '🚨',
    description: 'Understand how AI detects fraud typologies — identity fraud, income inflation, property valuation manipulation, syndicate patterns — in mortgage applications.',
    audience: ['Portfolio', 'Product'],
    dayNumber: 2,
    coverageLevel: 'awareness',
    samplePrompt: 'Explain the top 5 fraud typologies in the Indian home loan industry. For each: describe the pattern, how AI can detect it, what data signals to watch for, and one real-world example (anonymized). Add a disclaimer about using this knowledge responsibly within policy guidelines.'
  },
  {
    id: 'compliance-awareness',
    title: 'Compliance & Regulatory Awareness',
    category: 'risk',
    icon: '📜',
    description: 'Stay updated on RBI, NHB, and SEBI regulations affecting retail lending through AI-powered regulatory summaries and impact assessments.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'awareness',
    samplePrompt: 'Summarize the key RBI regulations affecting home loans in India as of 2024-2025. Cover: LTV ratios, risk weights, NPA classification norms, co-lending guidelines, and digital lending rules. For each regulation, note the impact on HDFC retail assets operations and any upcoming changes to watch for.'
  },
  {
    id: 'explainable-ai',
    title: 'Explainable AI & Model Interpretability',
    category: 'risk',
    icon: '🔬',
    description: 'Understand why AI makes specific decisions — loan approvals, risk ratings, pricing — and how to explain these to customers and regulators.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'awareness',
    samplePrompt: 'A home loan application was declined by an AI scoring model. The applicant asks "Why was I rejected?" The model considered: income stability (score: 6/10), property valuation risk (4/10), credit history (7/10), and employment sector risk (3/10). Generate a customer-friendly explanation letter and an internal review note for the credit supervisor.'
  },
  {
    id: 'risk-pricing',
    title: 'Risk-Based Pricing Models',
    category: 'risk',
    icon: '💰',
    description: 'Learn how AI enables dynamic, risk-based loan pricing that balances customer acquisition with portfolio health.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'awareness',
    samplePrompt: 'Design a risk-based pricing framework for home loans. Create a pricing grid that shows how the interest rate varies based on: credit score bands (750+, 700-749, 650-699, below 650), LTV ratio (up to 75%, 75-80%, 80-90%), income type (salaried vs self-employed), and property type (ready vs under-construction). Explain the business logic behind each differential.'
  },
  {
    id: 'post-sale-service',
    title: 'Post-Sale Service Excellence',
    category: 'customer',
    icon: '🌟',
    description: 'Enhance post-disbursement customer experience — service requests, account queries, statement generation, restructuring — using GenAI.',
    audience: ['Service'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'A customer walks into a service branch and says: "I want to know my outstanding balance, when my loan will end, how much I have paid so far, and what happens if I prepay INR 5 lakhs right now." Generate a complete service response that covers: current outstanding, amortization summary, prepayment impact analysis (EMI reduction vs tenure reduction), and any charges applicable. Make it customer-friendly.'
  },
  {
    id: 'customer-reference',
    title: 'Customer Reference & Lead Mining',
    category: 'customer',
    icon: '🔗',
    description: 'Use AI to identify referral opportunities from satisfied customers and generate personalized reference request approaches.',
    audience: ['Service', 'Sales'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'Identify the characteristics of home loan customers most likely to give referrals. Create a referral scoring model based on: NPS score, relationship tenure, number of products held, complaint history, and communication engagement. Then draft 3 different referral request messages: in-person script, SMS, and email template.'
  },
  {
    id: 'service-automation',
    title: 'Service Desk Automation',
    category: 'customer',
    icon: '💬',
    description: 'Automate service desk responses for common requests — statements, NOC, foreclosure, EMI date change — while maintaining quality and compliance.',
    audience: ['Service'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'A customer emails: "I need a foreclosure statement for my home loan account XYZ123. I am planning to close the loan next month. Please also let me know the charges and process." Draft a professional response that covers: foreclosure amount, applicable charges, required documents, timeline, and next steps. Also flag this as an upsell opportunity for retention.'
  },
  {
    id: 'walkin-conversion',
    title: 'Branch Walk-in to Lead Conversion',
    category: 'customer',
    icon: '🚶',
    description: 'Convert messy branch walk-in notes into structured lead records with complete customer profiles, product interest, and next actions.',
    audience: ['Service', 'Sales'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'A branch employee jotted this note on paper: "Mr Sharma came today, interested in home loan, govt employee, posting to Mumbai, budget 80L-1Cr, wife also works in private co, has SBI salary a/c, wants to move to HDFC, daughter school admission in June so need possession soon." Convert this into: Name, Contact, Product Interest, Customer Profile, Budget, Timeline, Cross-sell Opportunities, Next Action, and CRM-ready format.'
  },
  {
    id: 'chatbots-workflow',
    title: 'Chatbots as Workflow Assistants',
    category: 'customer',
    icon: '🤖',
    description: 'Understand how AI chatbots can serve as 24/7 workflow assistants for both customers and internal teams in the mortgage journey.',
    audience: ['Product', 'Service'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'Design a chatbot conversation flow for a customer inquiring about home loan eligibility on the HDFC website. The chatbot should: collect basic information (income, age, city, property budget), provide instant eligibility estimate, explain required documents, offer appointment booking, and hand off to human agent when needed. Show the complete conversation tree for the happy path and 2 exception paths.'
  },
  {
    id: 'voice-of-customer',
    title: 'Voice of Customer Analysis',
    category: 'customer',
    icon: '👂',
    description: 'Analyze customer feedback, complaints, and social media mentions to extract actionable insights using GenAI.',
    audience: ['Service', 'Product'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'Analyze these 5 customer complaints: 1) "Loan process took 45 days, competitor promised 7 days" 2) "Branch staff was unhelpful when I asked about part-prepayment" 3) "Interest rate increased without proper communication" 4) "Online portal does not show EMI schedule clearly" 5) "Property verification delayed my disbursement by 3 weeks". Extract: top 3 pain points, root causes, suggested fixes, and a customer sentiment score for each.'
  },
  {
    id: 'red-flag-detection',
    title: 'Red Flag Detection in Documents',
    category: 'operations',
    icon: '🚩',
    description: 'Use GenAI to quickly scan mortgage documents for compliance risks, missing signatures, income mismatches, and property document gaps.',
    audience: ['Service', 'Product', 'Portfolio'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'Review this synthetic sanction letter summary and flag any red flags: Loan amount INR 75L, property value INR 85L (LTV 88%), applicant age 58, retirement in 2 years, EMI-to-income ratio 62%, co-applicant listed but no income documents provided, property is under-construction with no RERA registration mentioned. List all compliance risks with severity (High/Medium/Low) and recommended actions.'
  },
  {
    id: 'ai-roadmap',
    title: 'Building AI Roadmap for Your Team',
    category: 'strategy',
    icon: '🗺️',
    description: 'Learn to create an executable AI adoption roadmap for your team — from identifying use cases to getting approvals and measuring success.',
    audience: ['Sales', 'Product', 'Portfolio', 'Service'],
    dayNumber: 2,
    coverageLevel: 'hands-on',
    samplePrompt: 'As a sales leader managing 50 relationship managers across 10 branches in the West region, create a 90-day GenAI adoption roadmap for my team. Include: Phase 1 (Week 1-4) — Quick wins, Phase 2 (Week 5-8) — Process optimization, Phase 3 (Week 9-12) — Scaling. For each phase, list specific use cases, tools needed, training required, expected impact metrics, and policy checkpoints.'
  },
  {
    id: 'genai-myths',
    title: 'GenAI Myths vs Banking Reality',
    category: 'strategy',
    icon: '💡',
    description: 'Debunk common GenAI misconceptions and align expectations with what is actually possible within banking policy and regulatory guardrails.',
    audience: ['Sales', 'Product', 'Portfolio', 'Service'],
    dayNumber: 1,
    coverageLevel: 'demo',
    samplePrompt: 'Address these 5 common GenAI myths in the banking context: 1) "GenAI will replace relationship managers" 2) "We can feed customer data into ChatGPT for analysis" 3) "AI-generated content is always accurate" 4) "GenAI can make lending decisions autonomously" 5) "We need to build our own LLM". For each myth, provide: the reality, what leaders should know, and one actionable takeaway.'
  },
  {
    id: '30-day-plan',
    title: 'Your First 30-Day GenAI Plan',
    category: 'strategy',
    icon: '📅',
    description: 'Create a personal 30-day plan to start leveraging GenAI in your daily work as a banking leader — within policy guardrails.',
    audience: ['Sales', 'Product', 'Portfolio', 'Service'],
    dayNumber: 1,
    coverageLevel: 'hands-on',
    samplePrompt: 'As a branch head managing home loans and LAP, create my personal 30-day GenAI adoption plan. I want to: 1) Automate one daily task, 2) Train one team member, 3) Identify one policy question to clarify with compliance. For each, suggest specific actions, tools to use, and how to measure success. Keep it practical — I have limited time.'
  },
  {
    id: 'build-buy-wait',
    title: 'Build vs Buy vs Wait Decision Framework',
    category: 'strategy',
    icon: '🔀',
    description: 'A decision framework for leaders to evaluate whether a GenAI use case should be built internally, purchased as a solution, or deferred pending policy.',
    audience: ['Product', 'Portfolio'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'Evaluate these 3 GenAI use cases using a Build vs Buy vs Wait framework: 1) Automated loan document processing, 2) Customer chatbot for loan queries, 3) AI-driven credit scoring for self-employed. For each, assess: data sensitivity, build complexity, regulatory readiness, vendor availability, and expected ROI timeline. Deliver as a decision matrix with clear recommendations.'
  },
  {
    id: 'hallucination-check',
    title: 'Risk & Hallucination Checkpoint',
    category: 'strategy',
    icon: '⚡',
    description: 'Learn to identify when GenAI makes mistakes — inventing RBI circulars, wrong calculations, biased outputs — and how to verify AI outputs.',
    audience: ['Sales', 'Product', 'Portfolio', 'Service'],
    dayNumber: 2,
    coverageLevel: 'demo',
    samplePrompt: 'Show 3 examples of GenAI hallucinations in a banking context: 1) AI invents a fake RBI circular number, 2) AI calculates wrong EMI amount, 3) AI generates biased language in a customer communication. For each example, explain: why it happened, how to detect it, and the verification rule to follow. End with a simple "Ask for Source + Verify with SME" protocol.'
  },
];

export function getUseCasesByCategory(categoryId: string): UseCase[] {
  return USE_CASES.filter(uc => uc.category === categoryId);
}

export function getUseCasesByDay(day: 1 | 2): UseCase[] {
  return USE_CASES.filter(uc => uc.dayNumber === day);
}

export function getUseCasesByAudience(audience: string): UseCase[] {
  return USE_CASES.filter(uc => uc.audience.includes(audience));
}
