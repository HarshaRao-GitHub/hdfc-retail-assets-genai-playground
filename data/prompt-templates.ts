export interface PromptLevel {
  label: string;
  tag: string;
  prompt: string;
  color: string;
}

export interface LabExperiment {
  theme: string;
  icon: string;
  description: string;
  levels: PromptLevel[];
}

export interface PromptLadder {
  theme: string;
  icon: string;
  levels: PromptLevel[];
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    theme: 'Home Loan Customer Pitch — First-Time Buyer',
    icon: '🏠',
    description: 'Watch a generic home loan pitch evolve into a deal-closing, personalized document as context, analytics, and structure are layered in.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'Draft a sales pitch for a home loan customer.'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'Draft a personalized home loan sales pitch for a young married couple — both IT professionals in Bangalore, combined CTC of 30 LPA, first-time home buyers looking at 2BHK apartments in Whitefield (budget INR 80 lakhs to 1 Cr). They currently rent and have a combined savings of INR 20 lakhs. Include competitive rate positioning against SBI and LIC HFL, tax benefit highlights under Section 24 and 80C, and a pre-approved offer framing.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Draft a personalized home loan sales pitch for first-time buyers in Bangalore. Analyse: (1) why HDFC should be chosen over SBI (8.25%), LIC HFL (8.40%), and Bajaj Housing (8.50%) when our rate is 8.65%, (2) the total cost of ownership comparison across 20 years including processing fees, insurance, and prepayment flexibility, (3) specific tax benefits for this couple under current IT laws, (4) property market trends in Whitefield showing 12% appreciation over 3 years, (5) how their dual income creates a stronger eligibility case for premium properties. The output should be a persuasive, evidence-backed pitch — not a generic rate sheet.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: A young married couple (ages 29 and 31) — both senior software engineers at top MNCs in Bangalore — are actively house-hunting in Whitefield and Sarjapur Road. Combined CTC is INR 30 LPA. They have INR 22 lakhs in savings, a running SIP of INR 40,000/month, and no existing loans. They visited our branch last week and also visited SBI (offered 8.25%) and LIC HFL (offered 8.40%). Our rate is 8.65% but we offer faster processing, doorstep service, and pre-approved offers. Property prices in their target areas have appreciated 12% in 3 years.\n\nRole: You are a senior Relationship Manager at HDFC with 10 years of experience in home loans. You specialise in converting rate-sensitive IT professionals by demonstrating long-term value rather than competing on rate alone.\n\nAction: Draft a compelling, personalized home loan pitch that makes this couple choose HDFC despite the rate difference.\n\nFormat: Deliver as (1) a 1-page personalised letter addressing them by segment, (2) a 5-row total-cost comparison table showing HDFC vs SBI vs LIC HFL across rate, processing fee, insurance, prepayment charges, and service quality, (3) a tax benefits calculator summary for their income bracket, and (4) a recommended 3-step next action plan with timeline.\n\nTarget Audience: The couple will read this at home and compare with other offers. The pitch must be warm yet data-rich, building trust rather than pressure.'
      }
    ]
  },
  {
    theme: 'Cross-sell Strategy — CASA + Insurance for HL Customers',
    icon: '🔄',
    description: 'See how a vague cross-sell question transforms into a data-driven, customer-specific strategy as prompt precision increases.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'How can we cross-sell other products to home loan customers?'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'Develop a cross-selling strategy for existing HDFC home loan customers. Target products: CASA accounts (to capture salary credits), home insurance, term life insurance, and credit cards. The customer base includes 50,000 active HL accounts in the West region. Currently, only 30% have a CASA with us, 15% have home insurance, and 8% have life cover. Identify the right timing in the loan lifecycle for each cross-sell and suggest approach channels.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Design a cross-sell playbook for home loan customers. Analyse: (1) which products have the highest conversion probability at each lifecycle stage — pre-sanction, post-sanction, post-disbursement, 1-year anniversary, (2) customer segments most receptive to each product based on income level, age, and family status, (3) competitor product comparison for CASA (SBI Yono vs HDFC), (4) revenue per product per customer vs acquisition cost, (5) channel effectiveness — branch push vs digital nudge vs RM call. Create a prioritised cross-sell matrix with expected revenue impact and conversion rates for each segment-product combination.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: HDFC Retail Assets has 50,000 active home loan customers in the West region. Only 30% have a CASA with us (rest salary accounts at SBI, ICICI, Kotak). Home insurance penetration is 15%, life cover is 8%, and credit card holding is 22%. Management has set a target to increase cross-sell ratio from 1.3 to 2.5 products per customer within 12 months. The bank recently launched a bundled "Home Complete" offer but uptake has been poor (3% conversion).\n\nRole: You are the Head of Cross-sell Strategy for Retail Assets, reporting to the National Sales Head. You have deep experience in lifecycle marketing, customer analytics, and incentive design for sales teams.\n\nAction: Create a comprehensive 12-month cross-sell transformation plan that doubles the cross-sell ratio. Include customer segmentation, product sequencing, channel strategy, RM incentive redesign, and digital journey integration.\n\nFormat: Deliver as (1) a 2-page executive strategy memo with the revenue bridge from current to target, (2) a customer lifecycle cross-sell matrix showing which product at which stage through which channel, (3) a 90-day quick wins plan with 8 specific initiatives, and (4) a dashboard design showing KPIs to track weekly.\n\nTarget Audience: The National Sales Head and Product Heads will review this for immediate implementation. The document should be practical, not theoretical — every initiative should have an owner and a metric.'
      }
    ]
  },
  {
    theme: 'Sales Forecasting — Quarterly Disbursal Prediction',
    icon: '📊',
    description: 'Experience how the same forecasting question produces dramatically different quality outputs as prompt sophistication increases.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'Forecast next quarter home loan disbursals for our region.'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'Forecast Q2 FY26 home loan disbursals for the South region. Historical data: Q1 INR 1,800 Cr, Q2 last year INR 1,650 Cr, Q3 INR 2,100 Cr, Q4 INR 2,500 Cr. The region has 25 branches, 150 RMs, and covers Bangalore, Chennai, Hyderabad, and Kochi. Factor in: monsoon season impact, repo rate cut of 25bps in April, 2 new affordable housing projects launching in Bangalore, and competitor (SBI) aggressive pricing campaign.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Build a comprehensive Q2 FY26 disbursal forecast for the South region. Analyse: (1) historical seasonality patterns across 8 quarters with growth trends, (2) macro factors — RBI repo rate trajectory, property price index, GDP growth, IT sector hiring trends, (3) competitive landscape — SBI festive rate of 8.25%, LIC HFL doorstep service push, new digital-first lenders, (4) internal factors — 15 new RM hires taking 3 months to ramp, 2 underperforming branches under review, pipeline conversion rate drop from 32% to 27%, (5) regulatory changes — new PMAY guidelines expanding eligibility. Deliver best/base/worst scenarios with probability weights, revenue impact, and 5 specific actions to close the gap between base and best.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: HDFC South region achieved Q1 FY26 disbursals of INR 1,800 Cr against a target of INR 2,000 Cr (90% achievement). Historical Q2 shows 8-12% seasonal dip due to monsoons. Key data: 25 branches, 150 RMs (15 new hires), pipeline of INR 3,200 Cr (27% conversion rate, down from 32%), average ticket size INR 52 lakhs. Macro: RBI cut repo by 25bps, property prices up 6% YoY, IT sector stable but cautious hiring. Competitors: SBI launched 8.25% festive offer, Bajaj Housing expanding in Bangalore. 2 branches (Kochi, Coimbatore) underperforming at 65% achievement.\n\nRole: You are the Regional Sales Head for South, presenting to the National Sales Committee. You need to demonstrate analytical rigour and propose realistic yet ambitious targets with a clear action plan.\n\nAction: Build a data-driven Q2 FY26 disbursal forecast with three scenarios. For each scenario, provide specific branch-level breakdowns and actionable levers to influence the outcome.\n\nFormat: Deliver as (1) an executive summary with key forecast number and confidence level, (2) a branch-level forecast table with 25 branches showing Q1 actual, Q2 target, pipeline, conversion rate, and risk flag, (3) a scenario analysis (best INR X / base INR Y / worst INR Z) with probability weights and key assumptions, (4) a Gantt chart showing 10 tactical initiatives across Q2 with owners and milestones, and (5) a one-page competitive response playbook for the SBI festive campaign.\n\nTarget Audience: National Sales Committee members including the MD, National Sales Head, and CFO. The document must be presentation-ready with clear asks and resource requirements.'
      }
    ]
  },
];

export const PROMPT_LADDERS: PromptLadder[] = [
  {
    theme: 'Loan Origination Automation',
    icon: '🏦',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can AI help automate the home loan origination process?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Map the end-to-end home loan origination process — from lead capture to sanction. Identify 5 specific steps where GenAI can automate manual work: document collection reminders, eligibility pre-screening, income verification summarisation, property valuation report analysis, and sanction letter drafting. For each, estimate current time vs AI-assisted time and the quality improvement.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Redesign the home loan origination workflow for a branch processing 200 applications/month. Analyse: (1) current process bottlenecks (avg 21 days to sanction), (2) AI intervention points with expected time reduction, (3) compliance checkpoints that must remain manual per RBI guidelines, (4) integration requirements with existing CBS, (5) RM productivity impact — how many more applications per RM per month. Model the ROI of implementing AI origination for a 25-branch region over 12 months.' }
    ]
  },
  {
    theme: 'KYC Document Verification',
    icon: '📋',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can GenAI help verify KYC documents for home loan applications?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Design a GenAI-assisted KYC verification workflow for home loan applicants. Cover: PAN validation, Aadhaar-address cross-check, employer verification from salary slips, bank statement analysis for income patterns, and photo ID matching. Include a checklist template the AI generates after processing each application.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Build a comprehensive AI-powered KYC verification system design for HDFC home loans. Analyse: (1) document types and their fraud risk levels, (2) cross-verification rules between PAN-Aadhaar-employer-bank data, (3) false positive/negative trade-offs in automated flagging, (4) regulatory requirements for VKYC and e-KYC under RBI Master Directions, (5) integration with CKYC registry. Deliver an implementation plan with accuracy targets, exception handling workflow, and human override protocols.' }
    ]
  },
  {
    theme: 'Customer Objection Handling',
    icon: '🗣️',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'What are common objections home loan customers raise and how should sales teams respond?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Create an objection handling playbook for HDFC home loan RMs. Cover the top 8 objections: rate comparison with SBI, high processing fees, long processing time, documentation burden, hidden charges perception, no pre-approved offer, property not approved, and competitor offering better terms. For each objection, provide: empathetic acknowledgement, data-backed response, and a redirect to HDFC strengths.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Design a dynamic objection handling system for HDFC home loan sales. Analyse: (1) categorise objections by stage — initial inquiry, post-quote, documentation, post-sanction, (2) for each objection, provide 3 response strategies — empathetic, analytical, offer-based — with success rate estimates, (3) role-play scripts for the top 5 objections, (4) escalation protocol when RM cannot resolve, (5) data points each RM should have ready before any customer meeting. Create a one-page quick-reference card RMs can carry to meetings.' }
    ]
  },
  {
    theme: 'Default Risk Prediction',
    icon: '⚠️',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can AI help predict which home loan customers might default?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Create an early warning system for home loan defaults. Define 10 data signals that indicate rising default risk: EMI bounce frequency, salary credit pattern changes, credit card utilization increase, CIBIL score drop, property market depreciation in area, employment sector distress, and co-borrower status changes. For each signal, define the threshold that triggers an alert and the recommended intervention.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Build a comprehensive default prediction and prevention framework for a portfolio of 100,000 home loan accounts. Analyse: (1) early warning signals with severity weighting and composite risk score, (2) intervention strategies by risk tier — Green (monitor), Amber (proactive call), Red (restructuring offer), (3) communication templates for each intervention tier, (4) portfolio-level NPA prevention impact model, (5) regulatory constraints on proactive contact, (6) RM workload allocation for at-risk accounts. Model the NPA reduction impact if early warning catches 30% more pre-NPA accounts.' }
    ]
  },
  {
    theme: 'Branch Walk-in Lead Conversion',
    icon: '🚶',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can we better convert branch walk-in visitors into home loan customers?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Design a GenAI-assisted walk-in conversion process for HDFC branches. A customer walks in and shows interest in a home loan. The branch executive captures basic details on a tablet. The AI instantly provides: eligibility estimate, rate offer, EMI calculator output, required document list, and next-step appointment scheduling. Create the complete user journey from walk-in to lead registration.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Redesign the HDFC branch walk-in experience to achieve 60% lead capture rate (current: 35%). Analyse: (1) drop-off points in the current walk-in journey, (2) information the branch executive needs in the first 3 minutes, (3) AI-powered instant eligibility engine design, (4) digital capture of messy handwritten notes into CRM-ready format, (5) automated follow-up sequence post walk-in, (6) branch executive training requirements, (7) success metrics and A/B testing plan for 5 pilot branches.' }
    ]
  },
  {
    theme: 'Service Request Processing',
    icon: '📞',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can GenAI speed up service request processing for home loan customers?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Automate the top 5 service requests in home loans using GenAI: statement of account, interest certificate, part-prepayment processing, EMI date change, and property document return. For each, define: input required from customer, AI processing steps, output generated, TAT improvement, and exception handling when AI cannot process autonomously.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Transform the HDFC service branch from reactive to proactive using GenAI. Analyse: (1) current service request volumes by type across 50 branches, (2) AI automation potential per request type, (3) customer satisfaction impact of faster resolution, (4) staff redeployment opportunity from routine to complex tasks, (5) self-service portal design enabling 50% requests without branch visit, (6) proactive service triggers — approaching tenure milestones, prepayment suggestions, renewal reminders. Build a business case with cost savings and CSAT improvement projections.' }
    ]
  },
  {
    theme: 'Mortgage Document Analysis',
    icon: '📄',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can AI help process and understand mortgage documents faster?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Design a GenAI-powered mortgage document processing system. It should handle: ITR analysis (extract income, deductions, tax paid), bank statement parsing (average balance, salary credits, bounce frequency), property documents (title check, encumbrance status, valuation), and employer verification letters. For each document type, define what AI extracts, validation rules, and the summary output format.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Build a complete AI document intelligence platform for HDFC home loan processing. Analyse: (1) document types by processing complexity and volume, (2) extraction accuracy requirements per field, (3) cross-document validation rules (ITR income vs bank statement salary vs Form 16), (4) fraud detection rules embedded in document processing, (5) integration with underwriting decision engine, (6) exception workflow when AI confidence is below threshold. Include an accuracy benchmark framework and phased rollout plan for 100 branches.' }
    ]
  },
  {
    theme: 'Customer Micro-Segmentation',
    icon: '📐',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can we segment our home loan customers better for targeted marketing?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Create a micro-segmentation model for HDFC home loan customers using 5 dimensions: income bracket (under 10L, 10-25L, 25-50L, 50L+), life stage (single, newly married, young family, established family, pre-retirement), property type (affordable, mid-segment, premium, ultra-premium), geographic cluster (metro, Tier 1, Tier 2, Tier 3), and product holding depth (HL only, HL+CASA, HL+3 products, HL+5+ products). For each top segment, recommend targeted campaigns.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Design a comprehensive customer intelligence platform for HDFC Retail Assets. Analyse: (1) build 8 micro-segments from a 200,000 customer portfolio, (2) calculate CLV for each segment over 10-year horizon, (3) identify the top 3 revenue levers per segment, (4) design trigger-based personalization rules (life events, financial events, market events), (5) channel preference mapping per segment, (6) churn prediction model integration. Deliver as a segmentation playbook with segment profiles, size, revenue contribution, and strategic priority ranking.' }
    ]
  },
  {
    theme: 'AI Scorecard for Income Estimation',
    icon: '📊',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'How can AI estimate the income of self-employed home loan applicants?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Build an AI income estimation model for self-employed applicants applying for home loans at HDFC. Input data available: GST returns (last 12 months), bank statements (6 months), ITR (if available), rent agreement for business premises, and business vintage declaration. Create the estimation methodology, validation cross-checks, and a confidence scoring system (High/Medium/Low).' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Design a comprehensive non-salaried income estimation engine for HDFC. Analyse: (1) data sources by profession type — doctors, lawyers, traders, shop owners, freelancers, (2) surrogate data signals — UPI volume, rental income, vehicle ownership, mutual fund SIPs, (3) validation framework against traditional ITR assessment, (4) regulatory acceptability of alternative data per NHB guidelines, (5) accuracy benchmarking — compare AI estimates vs actual repayment behaviour on historical data. Build a scoring card with weights, thresholds, and override rules.' }
    ]
  },
  {
    theme: 'Red Flag Detection in Mortgage Documents',
    icon: '🚩',
    levels: [
      { label: 'Simple', tag: 'L1', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', prompt: 'What red flags should we look for in home loan application documents?' },
      { label: 'Detailed', tag: 'L2', color: 'bg-blue-100 text-blue-700 border-blue-200', prompt: 'Create a comprehensive red flag detection checklist for home loan applications. Cover: income documents (salary slip inconsistencies, ITR-Form 16 mismatch), property documents (missing RERA, unclear title chain, valuation discrepancy), identity documents (address mismatches, employer verification failures), and financial behaviour (sudden large deposits, circular transactions, multiple loan applications). Rate each flag: Critical, High, Medium, Low.' },
      { label: 'Analytical', tag: 'L3', color: 'bg-purple-100 text-purple-700 border-purple-200', prompt: 'Build an automated red flag detection engine for HDFC home loan processing. Analyse: (1) 20 most common red flags categorised by document type and severity, (2) detection logic — rules-based vs AI-pattern-matching for each, (3) false positive rate management, (4) escalation matrix — which flags go to credit supervisor vs fraud team vs legal, (5) integration with existing workflow to flag at right process stage, (6) quarterly learning loop to update flag rules. Include 5 case studies showing how early detection prevented losses.' }
    ]
  },
];

export const DISCLAIMER_TEXT = 'IMPORTANT DISCLAIMER: This is a concept demonstration using synthetic data only. Do NOT use actual bank customer data on any external AI platform. All use cases shown are for learning and awareness purposes. Take due approval from your compliance and IT teams before implementing any GenAI solution. Wait for bank policy clearance before any production use.';
