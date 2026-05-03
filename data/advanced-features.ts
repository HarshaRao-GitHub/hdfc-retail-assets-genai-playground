// ─── Advanced Features Data ───
// Myths vs Reality, Red Flags, Objection Bot, Risk Detection,
// Hallucination Detection, HITL Scenarios, System vs User Prompting

// ─── 1. Myths vs. Banking Reality ───

export interface MythReality {
  id: string;
  myth: string;
  reality: string;
  takeaway: string;
  icon: string;
  category: 'leadership' | 'technical' | 'regulatory' | 'operational';
  riskOfBelieving: 'High' | 'Medium' | 'Low';
}

export const MYTHS_VS_REALITY: MythReality[] = [
  {
    id: 'myth-replace-rms',
    myth: 'GenAI will replace Relationship Managers and branch staff',
    reality: 'GenAI augments RMs by automating data compilation, report drafting, and routine follow-ups — freeing them to focus on relationship-building and complex customer conversations that require empathy and judgment.',
    takeaway: 'Position GenAI as a "co-pilot" for your team, not a replacement. RMs who use AI effectively will outperform those who don\'t.',
    icon: '🤝',
    category: 'leadership',
    riskOfBelieving: 'High',
  },
  {
    id: 'myth-chatgpt-data',
    myth: 'We can feed customer data into ChatGPT or any public AI for analysis',
    reality: 'Public AI tools do NOT meet banking data privacy and security requirements. Customer PII, loan data, and financial records must NEVER be shared with external AI platforms without explicit compliance approval and data processing agreements.',
    takeaway: 'Use only bank-approved AI platforms. This playground uses synthetic data only. Always check with compliance before any AI tool adoption.',
    icon: '🔒',
    category: 'regulatory',
    riskOfBelieving: 'High',
  },
  {
    id: 'myth-always-accurate',
    myth: 'AI-generated content is always accurate and can be used as-is',
    reality: 'GenAI can "hallucinate" — invent plausible-sounding but incorrect facts, fake RBI circular numbers, wrong EMI calculations, or biased language. Every AI output in banking MUST be verified by a subject matter expert before use.',
    takeaway: 'Implement a "Trust but Verify" protocol: AI drafts, humans review. Never send AI output directly to customers or regulators without SME review.',
    icon: '⚠️',
    category: 'technical',
    riskOfBelieving: 'High',
  },
  {
    id: 'myth-autonomous-lending',
    myth: 'GenAI can make lending decisions autonomously',
    reality: 'RBI guidelines require human accountability for credit decisions. AI can recommend, score, and flag — but the final lending decision must involve authorized human approvers per the Delegation of Authority matrix.',
    takeaway: 'Use AI for decision SUPPORT, not decision MAKING. Ensure every AI-assisted workflow has a Human-in-the-Loop (HITL) gate.',
    icon: '⚖️',
    category: 'regulatory',
    riskOfBelieving: 'High',
  },
  {
    id: 'myth-build-llm',
    myth: 'We need to build our own Large Language Model (LLM) to use AI',
    reality: 'Building an LLM costs hundreds of millions and requires massive infrastructure. Banks can leverage existing foundation models (Claude, GPT) through secure APIs, fine-tuning, and prompt engineering — achieving 80% of the value at 1% of the cost.',
    takeaway: 'Focus on prompt engineering and workflow integration, not model building. The competitive advantage is in HOW you use AI, not in building the AI itself.',
    icon: '💰',
    category: 'technical',
    riskOfBelieving: 'Medium',
  },
  {
    id: 'myth-one-time',
    myth: 'AI implementation is a one-time project — deploy and forget',
    reality: 'AI systems need continuous monitoring, prompt refinement, data updates, and compliance reviews. Regulatory changes, market shifts, and customer behaviour evolution require ongoing tuning.',
    takeaway: 'Budget for ongoing AI operations (AIOps) — not just implementation. Assign ownership for monitoring AI output quality.',
    icon: '🔄',
    category: 'operational',
    riskOfBelieving: 'Medium',
  },
  {
    id: 'myth-no-training',
    myth: 'AI is intuitive — no special training is needed for teams',
    reality: 'Prompt engineering is a skill. The difference between a vague prompt and a CRAFT-framework prompt can be the difference between a generic paragraph and a board-ready strategy document. Teams need structured training.',
    takeaway: 'Invest in prompt engineering training for all team members. This playground demonstrates the L1→L4 quality progression.',
    icon: '📚',
    category: 'leadership',
    riskOfBelieving: 'Medium',
  },
  {
    id: 'myth-only-tech',
    myth: 'AI adoption is the IT/Technology team\'s responsibility',
    reality: 'The highest-value AI use cases come from business teams who understand customer pain points, operational bottlenecks, and growth opportunities. IT enables, but business must drive.',
    takeaway: 'Every business leader should identify 3 AI use cases for their function. Don\'t wait for IT to come to you — bring use cases to them.',
    icon: '🎯',
    category: 'leadership',
    riskOfBelieving: 'Medium',
  },
  {
    id: 'myth-replaces-process',
    myth: 'AI eliminates the need for standard operating procedures',
    reality: 'AI works WITHIN processes, not instead of them. You still need SOPs, compliance frameworks, and audit trails. AI makes processes faster and more consistent, but the governance structure must remain.',
    takeaway: 'Update your SOPs to include AI-assisted steps with clear human checkpoints. Document where AI is used and where humans must intervene.',
    icon: '📋',
    category: 'operational',
    riskOfBelieving: 'Medium',
  },
  {
    id: 'myth-all-or-nothing',
    myth: 'We must transform everything at once — AI is all-or-nothing',
    reality: 'The most successful AI adoptions start with one high-impact, low-risk use case, prove value, then scale. A 30-day pilot with measurable KPIs beats a 12-month grand transformation plan.',
    takeaway: 'Pick ONE use case this week. Run it for 30 days. Measure the impact. Then expand. Start small, learn fast.',
    icon: '🚀',
    category: 'leadership',
    riskOfBelieving: 'Low',
  },
];

// ─── 2. Red Flag Detection Rules ───

export interface RedFlagRule {
  id: string;
  category: string;
  flag: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectionMethod: string;
  action: string;
}

export const RED_FLAG_RULES: RedFlagRule[] = [
  { id: 'rf-ltv-breach', category: 'Loan Parameters', flag: 'LTV Ratio Exceeds RBI Limit', description: 'Loan-to-Value ratio exceeds the regulatory maximum (90% for <30L, 80% for 30-75L, 75% for >75L)', severity: 'Critical', detectionMethod: 'Compare sanctioned LTV against RBI threshold based on loan amount band', action: 'Escalate to Credit Head — loan cannot proceed until LTV is corrected' },
  { id: 'rf-foir-high', category: 'Income Assessment', flag: 'FOIR Exceeds 60%', description: 'Fixed Obligation to Income Ratio exceeds prudent lending threshold', severity: 'High', detectionMethod: 'Calculate total EMI obligations (including proposed) vs verified monthly income', action: 'Require co-applicant income or restructure loan terms to bring FOIR within limits' },
  { id: 'rf-age-tenure', category: 'Borrower Profile', flag: 'Loan Maturity Beyond Retirement', description: 'Loan tenure extends beyond borrower\'s retirement age (60 for salaried, 65 for self-employed)', severity: 'High', detectionMethod: 'Check (borrower age + tenure) against retirement age threshold', action: 'Reduce tenure or require co-borrower for income continuation post-retirement' },
  { id: 'rf-income-mismatch', category: 'Income Assessment', flag: 'Income Mismatch Across Documents', description: 'Salary slip, ITR, Form 16, and bank statement show inconsistent income figures', severity: 'Critical', detectionMethod: 'Cross-reference income from salary slips, ITR, Form 16, and bank credit entries', action: 'Seek explanation and additional proof. If variance >15%, flag for fraud investigation' },
  { id: 'rf-no-rera', category: 'Property Documents', flag: 'Under-Construction Property Without RERA', description: 'Property is under construction but no RERA registration number provided', severity: 'Critical', detectionMethod: 'Check property status (ready/under-construction) and validate RERA registration', action: 'Do not proceed with sanction until RERA registration is verified' },
  { id: 'rf-title-gap', category: 'Property Documents', flag: 'Incomplete Title Chain', description: 'Chain of ownership title does not cover the mandatory 30-year period', severity: 'High', detectionMethod: 'Verify title deed chain for continuous ownership transfer over 30 years', action: 'Escalate to Legal team for title investigation before proceeding' },
  { id: 'rf-valuation-diff', category: 'Property Documents', flag: 'Valuation Discrepancy >15%', description: 'Two independent property valuations differ by more than 15%', severity: 'High', detectionMethod: 'Compare independent valuation reports and calculate percentage variance', action: 'Request third valuation. Use lower of two values for LTV calculation' },
  { id: 'rf-cibil-low', category: 'Credit History', flag: 'CIBIL Score Below 650', description: 'Applicant\'s credit score is below the minimum threshold for standard processing', severity: 'High', detectionMethod: 'Check CIBIL/bureau report score against minimum threshold', action: 'Require additional collateral, higher margin, or policy deviation approval' },
  { id: 'rf-circular-txn', category: 'Financial Behaviour', flag: 'Circular Transactions Detected', description: 'Large round-figure deposits followed by immediate withdrawals suggesting source manipulation', severity: 'Critical', detectionMethod: 'Analyze bank statement for round-figure deposits with matching withdrawals within 3 days', action: 'Flag for AML review. Require source of funds declaration' },
  { id: 'rf-multiple-apps', category: 'Application Pattern', flag: 'Multiple Simultaneous Applications', description: 'Applicant has pending loan applications at 3+ lenders simultaneously', severity: 'Medium', detectionMethod: 'Check bureau report for recent inquiries from multiple lenders within 90 days', action: 'Seek clarification on intent. Adjust risk assessment accordingly' },
  { id: 'rf-employer-unverified', category: 'Employment', flag: 'Employer Verification Failed', description: 'Employer details on salary slip cannot be verified through independent channels', severity: 'High', detectionMethod: 'Cross-check employer name, address, and registration against public databases', action: 'Require additional employment proof (appointment letter, LinkedIn, PF statements)' },
  { id: 'rf-co-app-no-income', category: 'Co-Applicant', flag: 'Co-Applicant Listed Without Income Proof', description: 'Co-applicant appears on application but no income documents provided', severity: 'Medium', detectionMethod: 'Check co-applicant section against document checklist', action: 'Collect co-applicant income proof or assess eligibility on primary applicant income only' },
];

// ─── 3. Objection Handling Bot Scenarios ───

export interface ObjectionScenario {
  id: string;
  objection: string;
  customerContext: string;
  icon: string;
  category: 'rate' | 'fee' | 'process' | 'trust' | 'competitor';
  strategies: {
    type: 'empathetic' | 'data-driven' | 'offer-led';
    label: string;
    response: string;
  }[];
}

export const OBJECTION_SCENARIOS: ObjectionScenario[] = [
  {
    id: 'obj-rate-sbi',
    objection: 'SBI is offering 8.25% while HDFC is at 8.65%. Why should I pay more?',
    customerContext: 'Rate-sensitive IT professional comparing offers across 3 banks',
    icon: '📉',
    category: 'rate',
    strategies: [
      { type: 'empathetic', label: 'Empathetic Redirect', response: 'I completely understand your concern about the rate difference. You\'re being smart by comparing — and that 0.40% looks significant on paper. But let me share what our customers who did the same comparison found: the total cost of the loan over 20 years includes processing fees, insurance premiums, prepayment charges, and service quality. Many customers who went with lower rates came back to us within 2 years because of hidden charges and poor service.' },
      { type: 'data-driven', label: 'Total Cost Analysis', response: 'Let me do a transparent comparison for you. On a 80L loan over 20 years: HDFC at 8.65% = EMI 70,890, SBI at 8.25% = EMI 68,580. The EMI difference is INR 2,310/month. But HDFC charges zero prepayment penalty (SBI charges 0.5%), our processing fee is 0.35% vs SBI\'s 0.40%, and we include property insurance at no extra cost. Over 20 years, the total cost difference is actually just INR 1.2 lakh — less than 0.15% of the loan amount — while you get doorstep service, dedicated RM, and 3-day sanction guarantee.' },
      { type: 'offer-led', label: 'Special Offer', response: 'I appreciate you sharing that. Let me check what I can do for you. As an existing HDFC CASA customer with excellent credit, you qualify for our Special Rate scheme — I can get your rate down to 8.45%. Plus, I can waive the processing fee entirely if you move your salary account to HDFC. That brings us within 0.20% of SBI with significantly better service. Can I prepare the pre-approved offer for you today?' },
    ],
  },
  {
    id: 'obj-processing-fee',
    objection: 'Your processing fee of INR 31,000 is too high. Other banks are waiving it.',
    customerContext: 'First-time home buyer trying to minimize upfront costs',
    icon: '💸',
    category: 'fee',
    strategies: [
      { type: 'empathetic', label: 'Empathetic Redirect', response: 'I hear you — when you\'re buying your first home, every rupee counts, and upfront costs can feel overwhelming. The processing fee covers the complete due diligence on your application — credit assessment, property verification, legal opinion, and valuation. Think of it as an investment in peace of mind that everything about your property and loan is thoroughly checked.' },
      { type: 'data-driven', label: 'Value Breakdown', response: 'Let me break down what the processing fee covers: property valuation report (INR 5,000-8,000 independently), legal title verification (INR 3,000-5,000 from a lawyer), credit assessment and bureau check (INR 1,500), and administrative processing. If you did these independently, you\'d spend INR 15,000-20,000 anyway. The balance covers our 3-day turnaround commitment and dedicated RM support through the entire journey.' },
      { type: 'offer-led', label: 'Waiver Offer', response: 'Let me see what I can do. Since you\'re a first-time buyer and this is during our festive scheme window, I can offer a 50% waiver on the processing fee — bringing it down to INR 15,500. Additionally, if you open an HDFC CASA for your salary credit, I can get the fee waived entirely. This is our way of building a long-term relationship. Would you like me to set up both the loan and the CASA today?' },
    ],
  },
  {
    id: 'obj-slow-process',
    objection: 'I\'ve heard HDFC takes 3-4 weeks to process. I need my loan fast.',
    customerContext: 'Customer with a property deal closing deadline in 2 weeks',
    icon: '⏱️',
    category: 'process',
    strategies: [
      { type: 'empathetic', label: 'Empathetic Redirect', response: 'I understand the urgency — a property deal waits for no one. Let me assure you: HDFC has a Fast Track program specifically for time-sensitive cases. Your situation is exactly what it\'s designed for. I personally will ensure your file gets priority processing.' },
      { type: 'data-driven', label: 'TAT Evidence', response: 'Let me share our actual numbers: our average sanction TAT is now 5 working days for salaried customers with complete documentation. Last quarter, 78% of complete applications were sanctioned within 4 days. The cases that take 3-4 weeks are typically due to incomplete documentation or complex property titles. If you can provide all documents upfront, I can commit to a 5-day sanction timeline with our Branch Head\'s backing.' },
      { type: 'offer-led', label: 'Express Processing', response: 'I can put your application on our Express Track — this means dedicated processing, same-day property valuation scheduling, and direct credit team coordination. I\'ll give you my personal mobile number and commit to daily updates. If your documents are complete, I\'m confident we can sanction within 5 working days. Let\'s start the document collection today?' },
    ],
  },
  {
    id: 'obj-documentation',
    objection: 'You\'re asking for too many documents. It\'s a nightmare.',
    customerContext: 'Self-employed business owner frustrated with paperwork',
    icon: '📄',
    category: 'process',
    strategies: [
      { type: 'empathetic', label: 'Empathetic Redirect', response: 'I completely understand — as a business owner, your time is valuable and paperwork feels like a burden. We ask for these documents not to create trouble, but to build the strongest possible case for your approval. Think of it this way: the more evidence we have of your income and assets, the better rate and higher loan amount we can get for you.' },
      { type: 'data-driven', label: 'Simplified List', response: 'Let me simplify this for you. For a self-employed professional like you, we really need just 5 things: last 2 years ITR, 6 months bank statement (primary account), GST returns (if applicable), business proof (registration/license), and property documents. That\'s it. I\'ll create a digital checklist you can share with your CA, and we accept scanned copies initially — originals only at disbursement.' },
      { type: 'offer-led', label: 'Doorstep Collection', response: 'Tell you what — I\'ll come to your office personally and help you go through the document list. Our doorstep document collection service means you don\'t need to visit the branch even once. I\'ll also connect you with our document helpline where you can WhatsApp any document for instant pre-verification. Let me schedule a 30-minute visit at your convenience?' },
    ],
  },
  {
    id: 'obj-trust',
    objection: 'How do I know there won\'t be hidden charges later?',
    customerContext: 'Cautious customer who has read negative reviews online',
    icon: '🔍',
    category: 'trust',
    strategies: [
      { type: 'empathetic', label: 'Empathetic Redirect', response: 'That\'s a very fair concern, and I appreciate you asking directly. Trust is earned, not assumed. HDFC Bank is India\'s largest private sector bank, and our mortgage business has been serving customers for over 45 years. But rather than just tell you, let me show you exactly what the costs look like.' },
      { type: 'data-driven', label: 'Full Transparency', response: 'Here\'s the complete cost structure — nothing hidden: Interest rate: 8.65% (floating, linked to HDFC RPLR). Processing fee: 0.35% + GST. Prepayment charges: ZERO for floating rate (mandatory by RBI). EMI bounce charge: INR 500 + GST. Late payment: 2% per month on overdue amount. Conversion fee: 0.5% + GST (if you switch rate type). Insurance: optional, not bundled. That\'s the full list. I\'ll give you this in writing before you sign anything.' },
      { type: 'offer-led', label: 'Written Guarantee', response: 'I\'ll provide you with a Most Important Terms (MIT) document before you even apply — this is an RBI-mandated disclosure that lists every single charge. You can review it at home, share it with your CA, and come back with any questions. Zero surprises. Additionally, our sanction letter will itemize every charge. Would you like me to email you the MIT document right now?' },
    ],
  },
];

// ─── 4. Risk Detection Categories ───

export interface RiskCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  signals: string[];
  mitigations: string[];
  severity: 'Critical' | 'High' | 'Medium';
}

export const RISK_CATEGORIES: RiskCategory[] = [
  {
    id: 'risk-credit',
    name: 'Credit Risk',
    icon: '📊',
    description: 'Risk of borrower defaulting on loan repayment obligations',
    signals: ['CIBIL score declining trend', 'FOIR above 55%', 'Multiple active loans', 'Employment instability', 'Income to EMI ratio stress'],
    mitigations: ['Require co-borrower', 'Reduce loan amount', 'Increase collateral margin', 'Add credit life insurance', 'Set up auto-debit mandate'],
    severity: 'Critical',
  },
  {
    id: 'risk-fraud',
    name: 'Fraud Risk',
    icon: '🚨',
    description: 'Risk of identity fraud, income fabrication, or property title manipulation',
    signals: ['Income document inconsistencies', 'Employer verification failure', 'Circular bank transactions', 'Property valuation manipulation', 'Multiple applications across lenders'],
    mitigations: ['Enhanced KYC verification', 'Independent income verification', 'Bank statement forensic analysis', 'Physical property inspection', 'Bureau report deep analysis'],
    severity: 'Critical',
  },
  {
    id: 'risk-property',
    name: 'Property Risk',
    icon: '🏗️',
    description: 'Risk related to property title, construction quality, or market value',
    signals: ['Unclear title chain', 'No RERA registration', 'Builder bankruptcy risk', 'Valuation significantly above market', 'Litigation on property'],
    mitigations: ['Independent legal opinion', 'Third-party valuation', 'RERA compliance verification', 'Builder track record check', 'Title insurance requirement'],
    severity: 'High',
  },
  {
    id: 'risk-market',
    name: 'Market & Concentration Risk',
    icon: '📈',
    description: 'Risk from geographic or segment concentration and market downturns',
    signals: ['Heavy portfolio concentration in one geography', 'Single industry dependence (IT sector)', 'Property price correction signals', 'Interest rate volatility impact', 'Regulatory policy changes'],
    mitigations: ['Geographic diversification targets', 'Sector exposure limits', 'Dynamic LTV adjustment', 'Stress testing portfolio', 'Early warning monitoring'],
    severity: 'High',
  },
  {
    id: 'risk-operational',
    name: 'Operational Risk',
    icon: '⚙️',
    description: 'Risk from process failures, human errors, or system breakdowns',
    signals: ['Document verification skipped', 'TAT breaches increasing', 'Post-disbursement audit failures', 'Customer complaint spikes', 'Compliance deadline misses'],
    mitigations: ['Automated compliance checks', 'Maker-checker workflow enforcement', 'Regular process audits', 'Staff training programs', 'Exception monitoring dashboards'],
    severity: 'Medium',
  },
  {
    id: 'risk-regulatory',
    name: 'Regulatory & Compliance Risk',
    icon: '📜',
    description: 'Risk of non-compliance with RBI, NHB, RERA, and internal policies',
    signals: ['LTV limit violations', 'KYC document gaps', 'PMAY eligibility misclassification', 'AML reporting delays', 'Pricing guideline deviations'],
    mitigations: ['Automated regulatory checks', 'Regular compliance training', 'Pre-disbursement audit checklist', 'Regulatory circular tracking', 'Compliance dashboard monitoring'],
    severity: 'Critical',
  },
];

// ─── 5. Hallucination Examples ───

export interface HallucinationExample {
  id: string;
  title: string;
  icon: string;
  aiOutput: string;
  hallucination: string;
  whyItHappened: string;
  howToDetect: string;
  verificationRule: string;
  correctInfo: string;
  category: 'factual' | 'numerical' | 'regulatory' | 'bias';
}

export const HALLUCINATION_EXAMPLES: HallucinationExample[] = [
  {
    id: 'hall-fake-circular',
    title: 'AI Invents a Fake RBI Circular',
    icon: '📜',
    category: 'regulatory',
    aiOutput: 'As per RBI Circular No. RBI/2024-25/87 dated 15 March 2025, the maximum LTV for home loans above INR 75 lakhs has been revised to 80% from the earlier 75%.',
    hallucination: 'The circular number RBI/2024-25/87 does not exist. The AI fabricated a plausible-looking circular reference.',
    whyItHappened: 'LLMs are pattern-completion engines — they generate text that looks structurally correct (proper circular number format) but isn\'t grounded in actual RBI publications.',
    howToDetect: 'Always verify RBI circular numbers on the official RBI website (rbi.org.in). Check the circular date, number format, and subject against the RBI master circular index.',
    verificationRule: 'NEVER trust AI-generated regulatory references. Always cross-check against rbi.org.in or your bank\'s compliance database.',
    correctInfo: 'As of the knowledge cutoff, RBI LTV norms for home loans above 75 lakhs remain at 75%. Always verify current norms with your compliance team.',
  },
  {
    id: 'hall-wrong-emi',
    title: 'AI Calculates Wrong EMI Amount',
    icon: '🧮',
    category: 'numerical',
    aiOutput: 'For a home loan of INR 50 lakhs at 8.65% for 20 years, the EMI would be approximately INR 42,500 per month.',
    hallucination: 'The actual EMI for 50L at 8.65% for 20 years is approximately INR 43,650. The AI underestimated by INR 1,150/month.',
    whyItHappened: 'LLMs don\'t actually compute — they estimate based on patterns. EMI calculation requires the precise PMT formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1), which LLMs approximate rather than calculate.',
    howToDetect: 'Use the standard EMI formula or an authorized bank EMI calculator. Never rely on AI for financial calculations without independent verification.',
    verificationRule: 'ALL financial calculations from AI must be verified using an approved calculator or spreadsheet formula before sharing with customers.',
    correctInfo: 'Use the formula EMI = P * r * (1+r)^n / ((1+r)^n - 1) where P = principal, r = monthly interest rate, n = total months. Or use the bank\'s official EMI calculator.',
  },
  {
    id: 'hall-biased-language',
    title: 'AI Generates Biased Customer Communication',
    icon: '⚠️',
    category: 'bias',
    aiOutput: 'Dear Customer, given your age of 55 and limited remaining earning years, we recommend a shorter tenure loan with higher EMI to minimize risk to the bank.',
    hallucination: 'The AI used age-discriminatory language and framed the recommendation in terms of "risk to the bank" rather than customer benefit — violating fair lending practices.',
    whyItHappened: 'LLMs can embed societal biases present in training data. Age-based risk framing, while actuarially relevant, must be communicated carefully to avoid discrimination under Fair Practices Code.',
    howToDetect: 'Review all customer-facing AI outputs for discriminatory language based on age, gender, religion, caste, or geography. Check against RBI Fair Practices Code.',
    verificationRule: 'ALL customer communications must be reviewed by a human for bias, tone, and compliance with Fair Practices Code before sending.',
    correctInfo: 'Correct approach: "Based on your financial profile, we recommend a 15-year tenure that ensures comfortable repayment within your planned timeline. This gives you an optimal EMI of INR X while maximizing tax benefits."',
  },
  {
    id: 'hall-fake-stats',
    title: 'AI Fabricates Market Statistics',
    icon: '📊',
    category: 'factual',
    aiOutput: 'According to the National Housing Bank\'s report, Bangalore property prices increased by 18.4% in Q3 FY25, making it the fastest-growing market in India.',
    hallucination: 'The specific figure of 18.4% and the "fastest-growing" claim are fabricated. The AI generated a plausible statistic without grounding in actual NHB data.',
    whyItHappened: 'LLMs generate statistically plausible numbers that "feel right" based on patterns but are not sourced from actual datasets. They cannot access real-time market data.',
    howToDetect: 'Verify market statistics against official sources: NHB Residex, RBI data, CRISIL reports, or authorized market research firms. Be suspicious of precise percentages from AI.',
    verificationRule: 'NEVER present AI-generated statistics as facts in customer presentations or management reports. Always source from authorized data providers.',
    correctInfo: 'For accurate property price trends, refer to NHB\'s RESIDEX index, PropEquity data, or your bank\'s internal market research team.',
  },
];

// ─── 6. HITL Scenarios ───

export interface HITLScenario {
  id: string;
  title: string;
  context: string;
  icon: string;
  section: 'sales-ai' | 'doc-intelligence' | 'prompt-lab' | 'use-cases';
  aiDraftPrompt: string;
  confidenceRange: [number, number];
  approverRole: string;
  reviewCheckpoints: string[];
  riskIfSkipped: string;
}

export const HITL_SCENARIOS: HITLScenario[] = [
  {
    id: 'hitl-objection-response',
    title: 'Customer Objection Response Review',
    context: 'AI generates a response to a customer rate objection. Before sending to customer, RM must review for accuracy, tone, and compliance.',
    icon: '🗣️',
    section: 'sales-ai',
    aiDraftPrompt: 'Customer says: "Why is HDFC rate 8.65% when SBI offers 8.25%?" Generate a response.',
    confidenceRange: [0.72, 0.92],
    approverRole: 'Relationship Manager / Branch Head',
    reviewCheckpoints: ['Rate figures are current and accurate', 'No misleading competitor claims', 'Tone is professional and empathetic', 'Complies with Fair Practices Code', 'No unauthorized offers or commitments'],
    riskIfSkipped: 'Incorrect rate quotes, unauthorized offers, or non-compliant language could lead to customer complaints and regulatory issues.',
  },
  {
    id: 'hitl-crm-lead',
    title: 'Branch Note to CRM Lead Conversion',
    context: 'AI converts messy branch walk-in notes into structured CRM lead records. Human must verify extracted details before CRM entry.',
    icon: '🚶',
    section: 'sales-ai',
    aiDraftPrompt: 'Convert this branch note into a CRM lead: "Mr Gupta came, wants HL 60L, works at Infosys, wife homemaker, looking at Whitefield Bangalore, has FD with ICICI"',
    confidenceRange: [0.78, 0.95],
    approverRole: 'Branch Sales Executive',
    reviewCheckpoints: ['Customer name and details correctly extracted', 'Product interest accurately identified', 'Income/employment details verified', 'Next actions are appropriate', 'No fabricated details added by AI'],
    riskIfSkipped: 'Incorrect customer data in CRM, wrong product mapping, or fabricated details leading to wasted follow-up effort.',
  },
  {
    id: 'hitl-red-flag',
    title: 'Document Red Flag Review',
    context: 'AI scans loan application documents and flags potential red flags. Credit officer must validate each flag before escalation.',
    icon: '🚩',
    section: 'doc-intelligence',
    aiDraftPrompt: 'Scan this loan application for red flags: LTV 88%, applicant age 57, FOIR 62%, no RERA registration.',
    confidenceRange: [0.65, 0.88],
    approverRole: 'Credit Officer / Credit Head',
    reviewCheckpoints: ['Each red flag is valid and not a false positive', 'Severity ratings are appropriate', 'Recommended actions are per bank policy', 'No genuine issues missed by AI', 'Regulatory references are accurate'],
    riskIfSkipped: 'False positives waste time; false negatives miss genuine risks. Both impact processing efficiency and portfolio quality.',
  },
  {
    id: 'hitl-risk-assessment',
    title: 'Risk Assessment Validation',
    context: 'AI generates a risk assessment for a loan portfolio segment. Risk manager must validate methodology and findings.',
    icon: '🛡️',
    section: 'doc-intelligence',
    aiDraftPrompt: 'Assess credit risk for self-employed borrowers in the West region portfolio with LTV above 75%.',
    confidenceRange: [0.60, 0.85],
    approverRole: 'Risk Manager / Portfolio Head',
    reviewCheckpoints: ['Risk categorization methodology is sound', 'Data interpretations are correct', 'Mitigation recommendations are feasible', 'Regulatory implications are accurate', 'Portfolio impact assessment is realistic'],
    riskIfSkipped: 'Flawed risk assessment could lead to incorrect provisioning, missed early warnings, or regulatory non-compliance.',
  },
  {
    id: 'hitl-compliance-check',
    title: 'Compliance Check Verification',
    context: 'AI runs a compliance check against RBI/NHB norms. Compliance officer must verify each finding before sign-off.',
    icon: '✅',
    section: 'doc-intelligence',
    aiDraftPrompt: 'Check this loan file for RBI compliance: home loan INR 80L, LTV 82%, salaried customer, FOIR 58%, property under-construction.',
    confidenceRange: [0.70, 0.90],
    approverRole: 'Compliance Officer',
    reviewCheckpoints: ['Regulatory references are correct and current', 'Compliance status (Pass/Fail) is accurate', 'Gap analysis is complete', 'Remediation steps are actionable', 'No outdated norms cited'],
    riskIfSkipped: 'Incorrect compliance assessment could result in regulatory penalties, audit observations, or loan recall.',
  },
];

// ─── 7. System Prompting vs User Prompting ───

export interface PromptingExample {
  id: string;
  title: string;
  icon: string;
  description: string;
  systemPrompt: string;
  systemPurpose: string;
  userPromptBad: string;
  userPromptGood: string;
  outputDifference: string;
}

export const SYSTEM_VS_USER_EXAMPLES: PromptingExample[] = [
  {
    id: 'sp-guardrail-data',
    title: 'Data Privacy Guardrail',
    icon: '🔒',
    description: 'System prompt prevents PII leakage regardless of what the user asks',
    systemPrompt: 'You are an HDFC Retail Assets AI assistant. CRITICAL GUARDRAILS: 1) NEVER generate, display, or process actual customer data — names, Aadhaar numbers, PAN, account numbers, or phone numbers. 2) If the user provides real customer data, respond: "I cannot process real customer data. Please use synthetic data." 3) ALL examples must use clearly synthetic data.',
    systemPurpose: 'Platform-level safety: ensures NO user — even accidentally — can get the AI to process real customer PII. This is a non-negotiable guardrail set by the platform team.',
    userPromptBad: 'Analyze this customer: Rajesh Sharma, PAN ABCDE1234F, Aadhaar 9876-5432-1098, salary 18 LPA',
    userPromptGood: 'Analyze this synthetic customer profile: Salaried professional, age 35, IT sector, CTC 18 LPA, wants HL of 60L in Bangalore',
    outputDifference: 'With system guardrail: AI refuses to process the PII and reminds user to use synthetic data. Without guardrail: AI would process the real PII, creating a compliance violation.',
  },
  {
    id: 'sp-guardrail-lending',
    title: 'Lending Decision Guardrail',
    icon: '⚖️',
    description: 'System prompt ensures AI never autonomously approves/rejects loans',
    systemPrompt: 'MANDATORY GUARDRAIL: You are a decision-SUPPORT tool, not a decision-MAKING tool. You MUST: 1) Frame all outputs as recommendations, not decisions. 2) Always include "Subject to authorized approver sign-off" disclaimer. 3) NEVER use language like "Loan approved" or "Application rejected" — use "Recommended for approval" or "Flagged for further review". 4) Reference the Delegation of Authority matrix for human sign-off requirements.',
    systemPurpose: 'Regulatory compliance: RBI requires human accountability for lending decisions. This guardrail ensures AI can never be perceived as the decision-maker.',
    userPromptBad: 'Should I approve this loan application? CIBIL 720, income 15 LPA, loan 50 lakhs, LTV 78%.',
    userPromptGood: 'Assess this loan application and provide a recommendation with risk factors: CIBIL 720, income 15 LPA, loan 50 lakhs, LTV 78%.',
    outputDifference: 'With guardrail: AI provides a structured recommendation with "Recommended for approval — subject to Credit Head sign-off per DoA". Without: AI might say "This loan should be approved" — implying autonomous decision-making.',
  },
  {
    id: 'sp-user-customize',
    title: 'User-Level Output Customization',
    icon: '🎨',
    description: 'User prompting controls format, depth, and audience — system prompt ensures safety',
    systemPrompt: 'You are an HDFC Retail Assets AI assistant. Guardrails: synthetic data only, no autonomous decisions, include disclaimers. Within these guardrails, follow the user\'s instructions for format, depth, tone, and audience.',
    systemPurpose: 'The system prompt sets boundaries; the user prompt customizes within those boundaries.',
    userPromptBad: 'Tell me about home loans.',
    userPromptGood: 'Context: I\'m presenting to the National Sales Committee next week. Role: Act as the Head of Sales Analytics. Action: Create a quarterly forecast for South region with 3 scenarios. Format: Executive memo with comparison table and Mermaid pie chart. Target: MD and CFO who want data-driven projections.',
    outputDifference: 'Bad user prompt yields generic info within guardrails. Good user prompt (CRAFT framework) yields a board-ready memo within guardrails. The system prompt keeps it safe; the user prompt makes it useful.',
  },
  {
    id: 'sp-anti-hallucination',
    title: 'Anti-Hallucination Guardrail',
    icon: '🎯',
    description: 'System prompt forces source citation and confidence disclosure',
    systemPrompt: 'CRITICAL: 1) If the user asks a factual question and you are not certain of the answer, say "I\'m not confident about this — please verify with [specific source]." 2) For regulatory references, ALWAYS add: "Verify this against the latest RBI/NHB circulars." 3) For numerical calculations, show your formula and add: "Please verify with an authorized calculator." 4) Mark inferences with [INFERENCE] and gaps with [DATA GAP].',
    systemPurpose: 'Reduces hallucination impact by forcing the AI to disclose uncertainty and cite verification sources — creating a safety net.',
    userPromptBad: 'What is the current RBI repo rate and its impact on home loan EMIs?',
    userPromptGood: 'What is the current RBI repo rate and its impact on home loan EMIs? Please cite your source and confidence level. If unsure about the exact rate, say so.',
    outputDifference: 'With both guardrails working: AI provides information with confidence level, formula shown, and verification reminder. Without: AI might state a confident but outdated or wrong repo rate as fact.',
  },
];

// ─── 8. HITL Decision Types ───

export type HITLDecision = 'approved' | 'modified' | 'rejected' | 'pending';

export interface HITLDecisionRecord {
  id: string;
  scenarioId: string;
  decision: HITLDecision;
  reviewer: string;
  timestamp: number;
  confidence: number;
  modifications?: string;
  rejectionReason?: string;
  reviewCheckResults: Record<string, boolean>;
}

export const HITL_APPROVER_ROLES = [
  { role: 'Relationship Manager', level: 'L1', scope: 'Customer communications, lead records' },
  { role: 'Branch Head', level: 'L2', scope: 'Sales strategies, branch-level decisions' },
  { role: 'Credit Officer', level: 'L2', scope: 'Credit assessments, risk flags' },
  { role: 'Credit Head', level: 'L3', scope: 'Policy deviations, high-value sanctions' },
  { role: 'Risk Manager', level: 'L3', scope: 'Portfolio risk assessments, NPA strategies' },
  { role: 'Compliance Officer', level: 'L3', scope: 'Regulatory compliance, audit responses' },
  { role: 'Regional Head', level: 'L4', scope: 'Regional strategy, resource allocation' },
  { role: 'National Head', level: 'L5', scope: 'National policy, board-level decisions' },
];
