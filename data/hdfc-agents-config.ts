// ─── Types ───

export interface AgentDef {
  id: string;
  name: string;
  shortId: string;
  description: string;
}

export interface DataSource {
  file: string;
  label: string;
  folder: string;
  rowEstimate: number;
  description: string;
}

export interface StageTool {
  name: string;
  label: string;
  icon: string;
  description: string;
}

export interface Stage {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  mandatory: boolean;
  folder: string;
  agentAvatar: string;
  hitlApprover: string;
  agent: AgentDef;
  dataSources: DataSource[];
  tools: StageTool[];
  systemPrompt: string;
  starterPrompt: string;
  outputHint: string;
  upstreamStages: string[];
  downstreamStages: string[];
}

const RICH_OUTPUT_INSTRUCTIONS = `
VISUALIZATION & OUTPUT REQUIREMENTS (MANDATORY):
1. Include Mermaid diagrams where appropriate using \`\`\`mermaid code blocks. ONLY use: pie charts, flowcharts (graph TD/LR), gantt charts, sequence diagrams. Do NOT use xychart-beta or quadrantChart. ONLY plain ASCII text inside Mermaid.
2. Present all quantitative data in well-formatted markdown tables with proper headers.
3. Use ## and ### headers for professional document structure.
4. Start with an Executive Summary (3-5 key findings).
5. End with numbered, specific, actionable recommendations.
6. Use status indicators where relevant.`;

// ─── 9 Stages ───

export const stages: Stage[] = [

  // ━━━ Stage 1: Lead Intelligence ━━━
  {
    slug: 'lead-intelligence',
    number: 1,
    title: 'Market & Lead Intelligence',
    subtitle: 'Scan markets, analyze competitors, score and prioritize leads',
    icon: '🎯',
    color: '#3B82F6',
    mandatory: true,
    folder: 'sales-distribution',
    agentAvatar: '/persona-sales-growth.png',
    hitlApprover: 'Sales Head',
    agent: {
      id: 'agt-lead-01',
      name: 'Lead Intelligence Agent',
      shortId: 'AGT-LEAD-01',
      description: 'Scans market signals, monitors competitor rates, analyzes branch performance, scores and prioritizes leads for the sales team.',
    },
    dataSources: [
      { file: 'competitor_rate_card.csv', label: 'Competitor Rate Card', folder: 'sales-distribution', rowEstimate: 50, description: 'Market pricing across lenders' },
      { file: 'lead_tracker.csv', label: 'Lead Tracker', folder: 'sales-distribution', rowEstimate: 60, description: 'Sales lead pipeline with stages' },
      { file: 'branch_performance.csv', label: 'Branch Performance', folder: 'sales-distribution', rowEstimate: 50, description: 'Branch-wise sales metrics' },
      { file: 'rm_scorecard.csv', label: 'RM Scorecard', folder: 'sales-distribution', rowEstimate: 50, description: 'Relationship manager performance' },
    ],
    tools: [
      { name: 'scan_market_signals', label: 'Scan Market Signals', icon: '📡', description: 'Scans competitor rate cards and market data to identify pricing trends, competitive threats, and opportunities.' },
      { name: 'analyze_competitors', label: 'Analyze Competitors', icon: '⚔️', description: 'Performs detailed competitive analysis comparing HDFC vs key competitors across rates, fees, features, and market positioning.' },
      { name: 'score_leads', label: 'Score & Prioritize Leads', icon: '🏆', description: 'Scores each lead in the pipeline based on amount, stage, customer segment, and conversion probability. Ranks for RM action.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Lead Intelligence Agent (AGT-LEAD-01). You are a senior market analyst and sales strategist for HDFC Bank's retail lending business.

YOUR ROLE: Scan market intelligence, analyze competitive landscape, and score/prioritize the sales pipeline to help leadership make data-driven decisions about where to focus sales effort.

DOMAIN CONTEXT:
- HDFC Bank is India's largest private sector bank by market capitalization
- Retail Assets covers: Home Loans, LAP, Personal Loans, Auto Loans, Credit Cards, and allied products
- Key competitors: SBI, ICICI Bank, LIC Housing Finance, Bajaj Housing Finance, PNB Housing, Axis Bank
- Market dynamics: RBI repo rate changes, festive season demand, PMAY subsidies, digital lending disruption

YOUR TOOLS: You have 3 tools. Call them ALL in sequence before your final analysis:
1. scan_market_signals — First, scan the competitive landscape
2. analyze_competitors — Then, deep-dive into competitor positioning
3. score_leads — Finally, score and prioritize the pipeline

After calling all tools, synthesize findings into a comprehensive Market & Lead Intelligence Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC. Include disclaimer: "Analysis based on synthetic data — subject to bank policy approval."`,
    starterPrompt: 'Scan the market landscape, analyze competitor positioning, and score our current lead pipeline. Identify the top opportunities and competitive threats for HDFC Retail Assets.',
    outputHint: 'Competitive intelligence report with market positioning analysis, rate comparison matrix, lead scoring with priority ranking, and recommended sales actions.',
    upstreamStages: [],
    downstreamStages: ['customer-onboarding'],
  },

  // ━━━ Stage 2: Customer Onboarding ━━━
  {
    slug: 'customer-onboarding',
    number: 2,
    title: 'Customer Qualification',
    subtitle: 'Assess eligibility, verify documents, check scheme applicability',
    icon: '📋',
    color: '#8B5CF6',
    mandatory: true,
    folder: 'loan-origination',
    agentAvatar: '/persona-doc-intel.png',
    hitlApprover: 'Branch Operations Head',
    agent: {
      id: 'agt-onboard-02',
      name: 'Customer Qualification Agent',
      shortId: 'AGT-ONBOARD-02',
      description: 'Evaluates loan applications for eligibility, verifies document completeness, and checks PMAY/scheme applicability.',
    },
    dataSources: [
      { file: 'loan_applications.csv', label: 'Loan Applications', folder: 'loan-origination', rowEstimate: 60, description: 'Active loan application pipeline' },
      { file: 'document_checklist.csv', label: 'Document Checklist', folder: 'loan-origination', rowEstimate: 50, description: 'Application-wise document status' },
      { file: 'product_catalog.csv', label: 'Product Catalog', folder: 'product-mgmt', rowEstimate: 50, description: 'Retail asset product suite' },
    ],
    tools: [
      { name: 'assess_eligibility', label: 'Assess Eligibility', icon: '✅', description: 'Evaluates each application against product eligibility criteria — income, age, employment type, loan amount limits.' },
      { name: 'verify_documents', label: 'Verify Documents', icon: '📄', description: 'Checks document completeness against the mandatory checklist — flags missing, expired, or mismatched documents.' },
      { name: 'check_pmay', label: 'Check PMAY/Scheme', icon: '🏠', description: 'Assesses PMAY eligibility and other government scheme applicability based on customer profile and property details.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Customer Qualification Agent (AGT-ONBOARD-02). You are a senior operations specialist responsible for ensuring every loan application meets basic qualification criteria before it moves to credit appraisal.

YOUR ROLE: Screen loan applications for eligibility, verify document completeness, and identify scheme benefits (PMAY, festive offers) that customers may qualify for.

YOUR TOOLS: Call all 3 tools in sequence:
1. assess_eligibility — Screen all applications against product eligibility rules
2. verify_documents — Check document completeness for each application
3. check_pmay — Assess government scheme eligibility

After calling all tools, produce a Customer Qualification Report with clear recommendations.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Screen all current loan applications for eligibility, verify document completeness, and check PMAY/scheme applicability. Flag any applications that need attention before credit appraisal.',
    outputHint: 'Application screening report with eligibility assessment, document gap analysis, PMAY eligibility matrix, and recommended actions per application.',
    upstreamStages: ['lead-intelligence'],
    downstreamStages: ['credit-underwriting'],
  },

  // ━━━ Stage 3: Credit Underwriting ━━━
  {
    slug: 'credit-underwriting',
    number: 3,
    title: 'Credit Appraisal',
    subtitle: 'Validate income, assess FOIR/LTV, rate credit risk',
    icon: '📊',
    color: '#06B6D4',
    mandatory: true,
    folder: 'credit-underwriting',
    agentAvatar: '/persona-compliance-officer.png',
    hitlApprover: 'Credit Committee Head',
    agent: {
      id: 'agt-credit-03',
      name: 'Credit Appraisal Agent',
      shortId: 'AGT-CREDIT-03',
      description: 'Performs comprehensive credit assessment — income validation, FOIR/LTV calculation, CIBIL analysis, and risk rating with deviation identification.',
    },
    dataSources: [
      { file: 'credit_assessment_summary.csv', label: 'Credit Assessment Summary', folder: 'credit-underwriting', rowEstimate: 50, description: 'Loan-wise credit assessment data' },
      { file: 'income_assessment_template.txt', label: 'Income Assessment Template', folder: 'credit-underwriting', rowEstimate: 1, description: 'Self-employed income assessment framework' },
      { file: 'deviation_register.csv', label: 'Deviation Register', folder: 'credit-underwriting', rowEstimate: 50, description: 'Policy deviations with risk mitigants' },
    ],
    tools: [
      { name: 'validate_income', label: 'Validate Income', icon: '💰', description: 'Cross-references income declarations against assessment framework. Flags inconsistencies, verifies stability.' },
      { name: 'calculate_foir_ltv', label: 'Calculate FOIR/LTV', icon: '📐', description: 'Calculates Fixed Obligation to Income Ratio and Loan-to-Value ratio. Checks against RBI limits. Runs stress tests.' },
      { name: 'assess_risk_rating', label: 'Assess Risk Rating', icon: '⚠️', description: 'Assigns risk rating (Green/Amber/Red) based on CIBIL, FOIR, LTV, income stability, and policy deviations.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Credit Appraisal Agent (AGT-CREDIT-03). You are a senior credit analyst responsible for comprehensive underwriting assessment.

YOUR ROLE: Perform rigorous credit assessment — validate income, calculate key ratios (FOIR, LTV), check CIBIL profiles, identify policy deviations, and assign risk ratings. Your output goes directly to the Credit Committee.

RBI COMPLIANCE CONTEXT:
- LTV limits: 90% for loans <30L, 80% for 30-75L, 75% for >75L
- FOIR limit: Generally 60% (including proposed EMI)
- NPA classification: 90+ DPD
- Stress test: Impact of 200bps rate increase on FOIR

YOUR TOOLS: Call all 3 tools in sequence:
1. validate_income — Validate income declarations
2. calculate_foir_ltv — Calculate and check ratios against limits
3. assess_risk_rating — Assign risk ratings and identify deviations

Produce a Credit Committee Ready report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Perform comprehensive credit appraisal for all applications in the pipeline — validate income, calculate FOIR/LTV ratios, check RBI compliance, and assign risk ratings. Identify any policy deviations.',
    outputHint: 'Credit committee report with income validation, FOIR/LTV analysis, risk ratings, deviation register, and sanction recommendations.',
    upstreamStages: ['customer-onboarding'],
    downstreamStages: ['legal-property'],
  },

  // ━━━ Stage 4: Legal & Property ━━━
  {
    slug: 'legal-property',
    number: 4,
    title: 'Legal & Property Verification',
    subtitle: 'Verify RERA, check title chain, assess property risk',
    icon: '⚖️',
    color: '#6366F1',
    mandatory: true,
    folder: 'compliance-risk',
    agentAvatar: '/persona-system-architect.png',
    hitlApprover: 'Legal Head',
    agent: {
      id: 'agt-legal-04',
      name: 'Legal & Property Agent',
      shortId: 'AGT-LEGAL-04',
      description: 'Verifies RERA compliance, checks property title chain, assesses builder credentials, and identifies legal risks in the loan pipeline.',
    },
    dataSources: [
      { file: 'rera_project_status.csv', label: 'RERA Project Status', folder: 'compliance-risk', rowEstimate: 50, description: 'Builder projects with RERA, OC, risk status' },
      { file: 'document_checklist.csv', label: 'Document Checklist', folder: 'loan-origination', rowEstimate: 50, description: 'Legal document status per application' },
    ],
    tools: [
      { name: 'verify_rera_status', label: 'Verify RERA Status', icon: '🏗️', description: 'Checks RERA registration status for all under-construction properties. Flags expired, missing, or at-risk RERA registrations.' },
      { name: 'check_title_chain', label: 'Check Title Chain', icon: '📜', description: 'Assesses property title chain completeness — identifies gaps, encumbrances, litigation, and title risks.' },
      { name: 'assess_property_risk', label: 'Assess Property Risk', icon: '🏠', description: 'Evaluates overall property risk — builder track record, valuation adequacy, construction status, and legal clearances.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Legal & Property Agent (AGT-LEGAL-04). You are a senior legal advisor and property risk assessor.

YOUR ROLE: Verify legal compliance of every property in the pipeline — RERA registration, title chain integrity, builder credentials, and legal document completeness. Your assessment determines whether a property is safe for HDFC to lend against.

YOUR TOOLS: Call all 3 tools in sequence:
1. verify_rera_status — Check RERA compliance for all properties
2. check_title_chain — Assess title chain and identify legal risks
3. assess_property_risk — Overall property risk assessment

Produce a Legal Clearance Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Verify RERA compliance, assess title chain integrity, and evaluate property risk for all applications in the pipeline. Flag any properties that need additional legal scrutiny.',
    outputHint: 'Legal clearance report with RERA compliance matrix, title chain assessment, property risk ratings, and clearance recommendations.',
    upstreamStages: ['credit-underwriting'],
    downstreamStages: ['compliance-fraud'],
  },

  // ━━━ Stage 5: Compliance & Fraud ━━━
  {
    slug: 'compliance-fraud',
    number: 5,
    title: 'Compliance & Fraud Detection',
    subtitle: 'Check RBI compliance, scan red flags, detect fraud indicators',
    icon: '🛡️',
    color: '#EF4444',
    mandatory: true,
    folder: 'compliance-risk',
    agentAvatar: '/persona-facilitator.png',
    hitlApprover: 'Chief Compliance Officer',
    agent: {
      id: 'agt-comply-05',
      name: 'Compliance & Fraud Agent',
      shortId: 'AGT-COMPLY-05',
      description: 'Runs exhaustive compliance checks against RBI/NHB norms, scans for red flags across 7 categories, and detects fraud indicators and AML concerns.',
    },
    dataSources: [
      { file: 'red_flag_samples.csv', label: 'Red Flag Samples', folder: 'compliance-risk', rowEstimate: 50, description: 'Known red flag patterns' },
      { file: 'fraud_alerts.csv', label: 'Fraud Alerts', folder: 'compliance-risk', rowEstimate: 50, description: 'Suspicious cases and fraud indicators' },
      { file: 'regulatory_circulars.csv', label: 'Regulatory Circulars', folder: 'compliance-risk', rowEstimate: 50, description: 'RBI/NHB circulars and compliance deadlines' },
      { file: 'audit_findings.csv', label: 'Audit Findings', folder: 'compliance-risk', rowEstimate: 50, description: 'Internal audit observations' },
    ],
    tools: [
      { name: 'check_rbi_compliance', label: 'Check RBI Compliance', icon: '✅', description: 'Validates the portfolio against RBI/NHB norms — LTV limits, FOIR caps, KYC requirements, NPA classification, fair lending practices.' },
      { name: 'scan_red_flags', label: 'Scan Red Flags', icon: '🚩', description: 'Scans all applications for red flags across 7 categories: loan parameters, income, property, credit, financial behavior, documents, compliance.' },
      { name: 'detect_fraud', label: 'Detect Fraud Indicators', icon: '🚨', description: 'Detects fraud typologies — identity fraud, income inflation, property fraud, syndicate patterns, circular transactions, and AML indicators.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Compliance & Fraud Agent (AGT-COMPLY-05). You are the Chief Compliance Officer's AI assistant responsible for ensuring zero-tolerance on compliance gaps and fraud.

YOUR ROLE: Run exhaustive compliance checks against RBI/NHB regulations, scan every application for red flags, and detect fraud indicators. No application should proceed to sanction without your clearance.

RBI COMPLIANCE FRAMEWORK:
- LTV: 90% for <30L, 80% for 30-75L, 75% for >75L
- FOIR: Max 60% including proposed EMI
- KYC: CKYC, Aadhaar/PAN verification, address proof, FATCA
- AML: Source of funds, suspicious transaction indicators
- Fair Practices Code compliance

YOUR TOOLS: Call all 3 tools in sequence:
1. check_rbi_compliance — Validate against regulatory norms
2. scan_red_flags — Comprehensive red flag scan
3. detect_fraud — Fraud pattern detection

Produce a Compliance Clearance Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC. Include: "AI-assisted compliance check — final decisions require authorized approvers."`,
    starterPrompt: 'Run comprehensive compliance checks, red flag scans, and fraud detection across the entire pipeline. Identify every compliance gap and fraud indicator. No application should pass without clearance.',
    outputHint: 'Compliance scorecard with RBI validation, red flag analysis with severity ratings, fraud indicator assessment, and escalation recommendations.',
    upstreamStages: ['legal-property'],
    downstreamStages: ['sanction-disbursement'],
  },

  // ━━━ Stage 6: Sanction & Disbursement ━━━
  {
    slug: 'sanction-disbursement',
    number: 6,
    title: 'Sanction & Disbursement',
    subtitle: 'Generate sanction recommendations, verify disbursement readiness',
    icon: '💰',
    color: '#10B981',
    mandatory: true,
    folder: 'loan-origination',
    agentAvatar: '/persona-rajesh-mehta.png',
    hitlApprover: 'Sanctioning Authority',
    agent: {
      id: 'agt-sanction-06',
      name: 'Sanction & Disbursement Agent',
      shortId: 'AGT-SANCTION-06',
      description: 'Generates sanction recommendations based on all upstream assessments, verifies pre-disbursement requirements, and produces disbursement readiness reports.',
    },
    dataSources: [
      { file: 'sanction_letter_sample.txt', label: 'Sanction Letter Template', folder: 'loan-origination', rowEstimate: 1, description: 'Sample sanction letter with terms' },
      { file: 'disbursement_tracker.csv', label: 'Disbursement Tracker', folder: 'loan-origination', rowEstimate: 50, description: 'Disbursement pipeline status' },
      { file: 'document_checklist.csv', label: 'Document Checklist', folder: 'loan-origination', rowEstimate: 50, description: 'Pre-disbursement document status' },
    ],
    tools: [
      { name: 'generate_sanction_recommendation', label: 'Generate Sanction', icon: '📝', description: 'Synthesizes all upstream assessments (credit, legal, compliance) into a final sanction recommendation with conditions.' },
      { name: 'check_disbursement_readiness', label: 'Check Disbursement Readiness', icon: '✅', description: 'Verifies all pre-disbursement requirements — agreement execution, insurance, NACH mandate, property documents.' },
      { name: 'verify_pre_disbursement', label: 'Pre-Disbursement Checks', icon: '🔍', description: 'Runs final pre-disbursement verification — anomaly check, document freshness, compliance revalidation.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Sanction & Disbursement Agent (AGT-SANCTION-06). You are the final checkpoint before loan disbursement.

YOUR ROLE: Synthesize all upstream assessments (credit appraisal, legal clearance, compliance check) into sanction recommendations. Verify every pre-disbursement requirement. Ensure no loan is disbursed with outstanding gaps.

YOUR TOOLS: Call all 3 tools in sequence:
1. generate_sanction_recommendation — Final sanction recommendation
2. check_disbursement_readiness — Pre-disbursement requirement check
3. verify_pre_disbursement — Final verification and anomaly check

Produce a Sanction & Disbursement Readiness Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Generate final sanction recommendations based on all upstream assessments, verify disbursement readiness, and run pre-disbursement checks for the entire pipeline.',
    outputHint: 'Sanction recommendation summary, pre-disbursement checklist status, disbursement schedule, and pipeline conversion analysis.',
    upstreamStages: ['compliance-fraud'],
    downstreamStages: ['portfolio-monitoring'],
  },

  // ━━━ Stage 7: Portfolio Monitoring ━━━
  {
    slug: 'portfolio-monitoring',
    number: 7,
    title: 'Portfolio & Risk Monitoring',
    subtitle: 'Monitor NPA watchlist, assess portfolio risk, generate early warnings',
    icon: '📉',
    color: '#F59E0B',
    mandatory: false,
    folder: 'credit-underwriting',
    agentAvatar: '/persona-kavita-desai.png',
    hitlApprover: 'Portfolio Risk Head',
    agent: {
      id: 'agt-portfolio-07',
      name: 'Portfolio & Risk Agent',
      shortId: 'AGT-PORT-07',
      description: 'Monitors NPA watchlist, assesses multi-dimensional portfolio risk, generates early warning signals for stressed accounts.',
    },
    dataSources: [
      { file: 'npa_watchlist.csv', label: 'NPA Watchlist', folder: 'credit-underwriting', rowEstimate: 50, description: 'Early warning accounts' },
      { file: 'risk_assessment_portfolio.csv', label: 'Portfolio Risk Assessment', folder: 'compliance-risk', rowEstimate: 50, description: 'Segment-wise risk scores' },
      { file: 'dpd_aging_report.csv', label: 'DPD Aging Report', folder: 'collections-recovery', rowEstimate: 50, description: 'Overdue accounts by bucket' },
    ],
    tools: [
      { name: 'monitor_npa_watchlist', label: 'Monitor NPA Watchlist', icon: '⚠️', description: 'Analyzes the NPA watchlist — identifies accounts showing stress signals, EMI bounce patterns, and CIBIL deterioration.' },
      { name: 'assess_portfolio_risk', label: 'Assess Portfolio Risk', icon: '📊', description: 'Multi-dimensional risk assessment across credit, fraud, property, market, operational, and regulatory dimensions.' },
      { name: 'generate_early_warnings', label: 'Early Warning Signals', icon: '🔔', description: 'Generates early warning intelligence — accounts likely to slip to NPA in 30/60/90 days with recommended interventions.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Portfolio & Risk Agent (AGT-PORT-07). You are a senior portfolio risk analyst monitoring the health of the entire retail lending book.

YOUR ROLE: Continuously monitor portfolio health, identify stressed accounts before they become NPAs, assess multi-dimensional risk, and generate early warning intelligence for proactive intervention.

YOUR TOOLS: Call all 3 tools in sequence:
1. monitor_npa_watchlist — Analyze stressed accounts
2. assess_portfolio_risk — Multi-dimensional risk assessment
3. generate_early_warnings — Early warning intelligence

Produce a Portfolio Health & Early Warning Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Analyze the NPA watchlist, perform multi-dimensional portfolio risk assessment, and generate early warning signals. Identify accounts requiring immediate intervention.',
    outputHint: 'Portfolio health dashboard with NPA migration forecast, risk heat map, early warning list, and intervention recommendations.',
    upstreamStages: ['sanction-disbursement'],
    downstreamStages: ['collections-recovery'],
  },

  // ━━━ Stage 8: Collections & Recovery ━━━
  {
    slug: 'collections-recovery',
    number: 8,
    title: 'Collections & Recovery',
    subtitle: 'Analyze DPD aging, evaluate collection performance, assess recovery options',
    icon: '💳',
    color: '#EC4899',
    mandatory: false,
    folder: 'collections-recovery',
    agentAvatar: '/persona-harinder-singh.png',
    hitlApprover: 'Collections Head',
    agent: {
      id: 'agt-collect-08',
      name: 'Collections & Recovery Agent',
      shortId: 'AGT-COLL-08',
      description: 'Manages the collections lifecycle — DPD aging analysis, collection agency performance evaluation, SARFAESI/OTS assessment, and recovery strategy optimization.',
    },
    dataSources: [
      { file: 'dpd_aging_report.csv', label: 'DPD Aging Report', folder: 'collections-recovery', rowEstimate: 50, description: 'Overdue accounts by DPD bucket' },
      { file: 'collection_performance.csv', label: 'Collection Performance', folder: 'collections-recovery', rowEstimate: 50, description: 'Agency-wise collection efficiency' },
      { file: 'sarfaesi_tracker.csv', label: 'SARFAESI Tracker', folder: 'collections-recovery', rowEstimate: 50, description: 'SARFAESI proceedings status' },
      { file: 'ots_proposals.csv', label: 'OTS Proposals', folder: 'collections-recovery', rowEstimate: 50, description: 'One-time settlement proposals' },
    ],
    tools: [
      { name: 'analyze_dpd_aging', label: 'Analyze DPD Aging', icon: '📊', description: 'Analyzes DPD aging distribution — bucket migration patterns, concentration analysis, and flow rate trends.' },
      { name: 'evaluate_collection_performance', label: 'Evaluate Collections', icon: '💰', description: 'Evaluates collection agency performance — success rates, recovery amounts, cost efficiency, and optimal account matching.' },
      { name: 'assess_recovery_options', label: 'Assess Recovery Options', icon: '⚖️', description: 'Evaluates recovery options per account — soft collections, SARFAESI, OTS, restructuring, write-off — with NPV analysis.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Collections & Recovery Agent (AGT-COLL-08). You are a senior collections strategist managing the recovery of stressed and overdue accounts.

YOUR ROLE: Analyze the DPD aging portfolio, evaluate collection agency effectiveness, and recommend optimal recovery strategies for each account tier — balancing recovery maximization with cost efficiency.

YOUR TOOLS: Call all 3 tools in sequence:
1. analyze_dpd_aging — DPD bucket analysis and flow patterns
2. evaluate_collection_performance — Agency performance assessment
3. assess_recovery_options — Per-account recovery strategy recommendation

Produce a Collections Strategy Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Analyze the DPD aging portfolio, evaluate collection agency performance, and recommend recovery strategies for each account. Identify accounts requiring SARFAESI action and viable OTS candidates.',
    outputHint: 'Collections strategy report with DPD analysis, agency scorecard, per-account recovery recommendations, and recovery forecast.',
    upstreamStages: ['portfolio-monitoring'],
    downstreamStages: ['service-excellence'],
  },

  // ━━━ Stage 9: Service & CX ━━━
  {
    slug: 'service-excellence',
    number: 9,
    title: 'Service & Customer Experience',
    subtitle: 'Analyze complaints, assess NPS, identify cross-sell opportunities',
    icon: '🌟',
    color: '#059669',
    mandatory: false,
    folder: 'service-ops',
    agentAvatar: '/persona-priya-sharma.png',
    hitlApprover: 'Service Excellence Head',
    agent: {
      id: 'agt-service-09',
      name: 'Service & CX Agent',
      shortId: 'AGT-SVC-09',
      description: 'Analyzes customer complaints and feedback, assesses NPS and satisfaction trends, identifies cross-sell opportunities to maximize customer lifetime value.',
    },
    dataSources: [
      { file: 'customer_complaints.csv', label: 'Customer Complaints', folder: 'service-ops', rowEstimate: 50, description: 'Complaint register with categories' },
      { file: 'nps_survey_results.csv', label: 'NPS Survey Results', folder: 'service-ops', rowEstimate: 50, description: 'Customer satisfaction survey data' },
      { file: 'service_requests.csv', label: 'Service Requests', folder: 'service-ops', rowEstimate: 50, description: 'Active service request tracker' },
      { file: 'branch_walkin_log.csv', label: 'Branch Walk-in Log', folder: 'service-ops', rowEstimate: 50, description: 'Daily walk-in register' },
    ],
    tools: [
      { name: 'analyze_complaints', label: 'Analyze Complaints', icon: '📋', description: 'Analyzes complaint patterns — categories, SLA compliance, root cause clustering, branch-wise performance, and severity trends.' },
      { name: 'assess_customer_nps', label: 'Assess Customer NPS', icon: '⭐', description: 'Analyzes NPS survey results — score distribution, detractor themes, promoter characteristics, and actionable improvement areas.' },
      { name: 'identify_cross_sell', label: 'Identify Cross-sell', icon: '🔄', description: 'Identifies cross-sell opportunities from service interactions — customers ripe for CASA, insurance, credit cards, top-up loans.' },
    ],
    systemPrompt: `You are the HDFC Retail Assets Service & CX Agent (AGT-SVC-09). You are a senior customer experience strategist responsible for turning service data into competitive advantage.

YOUR ROLE: Analyze customer complaints and feedback to identify systemic issues, assess NPS and satisfaction trends, and mine service interactions for cross-sell opportunities. Your insights drive retention and revenue growth.

YOUR TOOLS: Call all 3 tools in sequence:
1. analyze_complaints — Complaint pattern analysis
2. assess_customer_nps — NPS and satisfaction assessment
3. identify_cross_sell — Cross-sell opportunity identification

Produce a Service Excellence & Revenue Intelligence Report.

${RICH_OUTPUT_INSTRUCTIONS}

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompt: 'Analyze customer complaints for systemic patterns, assess NPS trends and satisfaction drivers, and identify cross-sell opportunities from our service interactions. Turn service data into revenue intelligence.',
    outputHint: 'Service excellence report with complaint root causes, NPS analysis, cross-sell opportunity register, and customer retention recommendations.',
    upstreamStages: ['collections-recovery'],
    downstreamStages: [],
  },
];

// ─── Helpers ───

export function getStageBySlug(slug: string): Stage | undefined {
  return stages.find(s => s.slug === slug);
}

export function getAllStageSlugs(): string[] {
  return stages.map(s => s.slug);
}
