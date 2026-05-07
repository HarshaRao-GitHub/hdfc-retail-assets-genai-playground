// ─── Types ───

export interface Department {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ProcessDocument {
  id: string;
  filename: string;
  label: string;
  description: string;
  path: string;
  department: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  department: string;
  departmentLabel: string;
  description: string;
  documentIds: string[];
  systemPrompt: string;
}

export interface ProcessApp {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  borderColor: string;
  departments: Department[];
  documents: ProcessDocument[];
  stages: PipelineStage[];
}

// ─── 10 Process Automation Apps ───

export const PROCESS_APPS: ProcessApp[] = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. LOAN ORIGINATION TO DISBURSEMENT PIPELINE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'loan-origination-pipeline',
    title: 'Loan Origination to Disbursement',
    subtitle: 'Sales → Credit → Legal → Operations → Compliance → Disbursement',
    description: 'End-to-end loan processing from lead capture through credit appraisal, legal verification, compliance validation, to final disbursement clearance — producing a complete decision file with escalation points.',
    icon: '🏦',
    gradient: 'from-blue-700 to-cyan-600',
    borderColor: 'border-blue-300',
    departments: [
      { id: 'sales', label: 'Sales', icon: '📈', color: '#3B82F6' },
      { id: 'credit', label: 'Credit', icon: '📊', color: '#8B5CF6' },
      { id: 'legal', label: 'Legal', icon: '⚖️', color: '#6366F1' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#EF4444' },
      { id: 'disbursement', label: 'Disbursement', icon: '💰', color: '#10B981' },
    ],
    documents: [
      { id: 'loan-apps', filename: 'loan_applications.csv', label: 'Loan Application Pipeline', description: 'Active loan applications with applicant details, amounts, stages', path: '/sample-data/doc-intelligence/loan-origination/loan_applications.csv', department: 'sales' },
      { id: 'credit-summary', filename: 'credit_assessment_summary.csv', label: 'Credit Assessment Summary', description: 'Loan-wise credit assessment with income, FOIR, LTV, CIBIL', path: '/sample-data/doc-intelligence/credit-underwriting/credit_assessment_summary.csv', department: 'credit' },
      { id: 'income-template', filename: 'income_assessment_template.txt', label: 'Income Assessment Template', description: 'Self-employed income assessment framework', path: '/sample-data/doc-intelligence/credit-underwriting/income_assessment_template.txt', department: 'credit' },
      { id: 'doc-checklist', filename: 'document_checklist.csv', label: 'Document Checklist Tracker', description: 'Application-wise document status tracking', path: '/sample-data/doc-intelligence/loan-origination/document_checklist.csv', department: 'operations' },
      { id: 'deviation-reg', filename: 'deviation_register.csv', label: 'Policy Deviation Register', description: 'Approved deviations with risk mitigants', path: '/sample-data/doc-intelligence/credit-underwriting/deviation_register.csv', department: 'compliance' },
      { id: 'sanction-letter', filename: 'sanction_letter_sample.txt', label: 'Sample Sanction Letter', description: 'Synthetic home loan sanction letter with terms', path: '/sample-data/doc-intelligence/loan-origination/sanction_letter_sample.txt', department: 'operations' },
      { id: 'rera-status', filename: 'rera_project_status.csv', label: 'RERA Project Status', description: 'Builder project legal/RERA compliance status', path: '/sample-data/doc-intelligence/compliance-risk/rera_project_status.csv', department: 'legal' },
      { id: 'disbursement-tracker', filename: 'disbursement_tracker.csv', label: 'Disbursement Tracker', description: 'Disbursement pipeline with tranche and pending requirements', path: '/sample-data/doc-intelligence/loan-origination/disbursement_tracker.csv', department: 'disbursement' },
      { id: 'red-flags', filename: 'red_flag_samples.csv', label: 'Red Flag Samples', description: 'Loan applications with red flag indicators', path: '/sample-data/doc-intelligence/compliance-risk/red_flag_samples.csv', department: 'compliance' },
    ],
    stages: [
      {
        id: 'lead-qualification',
        title: 'Lead Qualification & Application Intake',
        department: 'sales',
        departmentLabel: 'Sales & Distribution',
        description: 'Analyze incoming loan applications, qualify leads, assess pipeline quality, and prioritize applications for processing.',
        documentIds: ['loan-apps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1 of the Loan Origination Pipeline: Lead Qualification & Application Intake.

Analyze the loan application pipeline data and produce:

## 1. Application Pipeline Summary
- Total applications, amount distribution, product mix
- Stage-wise breakdown (how many at each processing stage)
- Branch and RM distribution

## 2. Lead Quality Assessment
For each application, score lead quality (High/Medium/Low) based on:
- Loan amount vs typical ticket size
- Customer segment (salaried vs self-employed)
- Product type demand patterns
- Processing stage and TAT

## 3. Priority Queue
Rank applications by processing priority considering:
- Amount (higher = more revenue impact)
- Stage (closer to sanction = faster conversion)
- Customer type (existing HDFC customer = faster KYC)

## 4. Sales Insights
- Conversion funnel analysis
- Branch-wise pipeline health
- RM workload distribution

Present all data in structured tables. Flag any applications with unusual patterns.
IMPORTANT: All data is SYNTHETIC. Include disclaimer.`,
      },
      {
        id: 'credit-appraisal',
        title: 'Credit Appraisal & Underwriting',
        department: 'credit',
        departmentLabel: 'Credit & Underwriting',
        description: 'Perform comprehensive credit assessment — income validation, CIBIL analysis, FOIR calculation, risk rating, and deviation identification.',
        documentIds: ['credit-summary', 'income-template', 'deviation-reg'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2 of the Loan Origination Pipeline: Credit Appraisal & Underwriting.

Using the credit assessment data, income template, and deviation register, produce:

## 1. Credit Assessment Dashboard
| Application | Income | FOIR | LTV | CIBIL | Risk Rating | Recommendation |
For each application, provide a structured credit evaluation.

## 2. Income Validation Analysis
- Cross-reference income declarations against assessment framework
- Flag income inconsistencies or verification gaps
- Assess income stability and sustainability

## 3. FOIR & LTV Compliance Check
- FOIR limit: Flag any exceeding 60%
- LTV limits per RBI: 90% for <30L, 80% for 30-75L, 75% for >75L
- Stress test: Impact of 200bps rate increase on FOIR

## 4. Policy Deviation Assessment
- List all deviations from standard credit policy
- Assess risk mitigant adequacy for each deviation
- Recommend: Approve / Approve with conditions / Refer to higher authority / Decline

## 5. Underwriting Recommendation
- Tier applications: Green (auto-approve) / Amber (conditional) / Red (decline/escalate)
- Specific conditions for conditional approvals
- Escalation recommendations per Delegation of Authority

Present as a structured Credit Committee Ready report. Use tables extensively.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'legal-verification',
        title: 'Legal & Property Verification',
        department: 'legal',
        departmentLabel: 'Legal',
        description: 'Verify property title chain, RERA compliance, builder credentials, and legal clearances for all applications in the pipeline.',
        documentIds: ['rera-status', 'doc-checklist'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3 of the Loan Origination Pipeline: Legal & Property Verification.

Using RERA project data and document checklist, produce:

## 1. Property Verification Matrix
| Property/Project | RERA Status | Builder | OC Status | Title Status | Risk Level |
For each property in the pipeline, assess legal clearance status.

## 2. RERA Compliance Check
- Verify RERA registration for all under-construction properties
- Flag projects with expired or missing RERA
- Assess builder track record and financial health

## 3. Title Chain Assessment
- Identify properties with title gaps or disputes
- Flag encumbrances, litigation, or liens
- Recommend title insurance where applicable

## 4. Document Completeness — Legal
- Check: Sale agreement, title deed, encumbrance certificate, NOC, occupancy certificate
- Flag missing legal documents per application
- Generate document collection follow-up list

## 5. Legal Risk Summary
- Classify each application: Legal Clear / Conditional / Hold / Reject
- Specific conditions for conditional clearances
- Properties requiring physical verification or additional legal opinion

Present as a Legal Clearance Report ready for credit committee.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'compliance-check',
        title: 'Compliance & Red Flag Scan',
        department: 'compliance',
        departmentLabel: 'Compliance & Risk',
        description: 'Run exhaustive compliance checks against RBI/NHB norms, scan for red flags, fraud indicators, and AML concerns across the entire pipeline.',
        documentIds: ['red-flags', 'deviation-reg', 'credit-summary'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4 of the Loan Origination Pipeline: Compliance & Red Flag Scan.

Using red flag samples, deviation register, and credit data, produce:

## 1. Compliance Scorecard
For each application:
| Check | Status (Pass/Fail/Warning) | Finding | Regulation | Action Required |
Cover: RBI LTV, FOIR, KYC, PMAY eligibility, AML, Fair Practices Code

## 2. Red Flag Analysis
Scan every application for:
- LOAN FLAGS: LTV breach, FOIR >60%, tenure beyond retirement
- INCOME FLAGS: Salary-ITR mismatch, sudden spikes, unverified employer
- PROPERTY FLAGS: Missing RERA, title gaps, valuation discrepancy >15%
- CREDIT FLAGS: CIBIL <650, multiple active loans, recent inquiries
- DOCUMENT FLAGS: Missing mandatory docs, expired KYC, address mismatch

## 3. Fraud Indicator Assessment
- Circular transaction patterns
- Document inconsistencies across applications
- Round-figure deposits or suspicious cash flows

## 4. Compliance Score
- Overall portfolio compliance percentage
- Critical gaps requiring immediate resolution
- Applications that MUST NOT proceed without remediation

## 5. Escalation Matrix
| Application | Red Flag | Severity | Escalate To | Deadline |

Present as a Compliance Clearance Report. Rate each application: Compliant / Conditionally Compliant / Non-Compliant.
IMPORTANT: All data is SYNTHETIC. AI-assisted compliance check — final decisions require authorized approvers.`,
      },
      {
        id: 'sanction-disbursement',
        title: 'Sanction & Disbursement Readiness',
        department: 'disbursement',
        departmentLabel: 'Disbursement',
        description: 'Generate final sanction recommendations, disbursement readiness assessment, and pre-disbursement checklist for all cleared applications.',
        documentIds: ['sanction-letter', 'disbursement-tracker', 'doc-checklist'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 5 of the Loan Origination Pipeline: Sanction & Disbursement Readiness.

Using the sanction letter template, disbursement tracker, and document checklist, produce:

## 1. Sanction Recommendation Summary
Based on all prior stages (credit, legal, compliance), produce final recommendations:
| Application | Recommendation | Conditions | Sanctioning Authority | Special Terms |

## 2. Pre-Disbursement Checklist
For each approved application:
| Requirement | Status | Pending Action | Owner | Deadline |
Cover: Agreement execution, insurance, NACH mandate, property documents, NOC

## 3. Disbursement Schedule
- Tranche-wise disbursement plan for under-construction properties
- Single disbursement cases ready for immediate processing
- Pending requirements blocking disbursement

## 4. Post-Sanction Monitoring Plan
- Conditions to be fulfilled post-disbursement
- Insurance renewal tracking
- RERA milestone monitoring for under-construction

## 5. Executive Summary for Leadership
- Pipeline conversion: Applications received → Sanctioned → Ready for disbursement
- Total disbursement amount in pipeline
- Average TAT per stage
- Bottleneck identification and resolution recommendations
- Revenue impact of faster processing

Present as a Disbursement Readiness Report ready for operations head.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. NPA EARLY WARNING TO RECOVERY RESOLUTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'npa-recovery',
    title: 'NPA Early Warning to Recovery',
    subtitle: 'Portfolio → Risk → Collections → Legal → Compliance',
    description: 'From the first EMI bounce signal through soft collections, hard collections, SARFAESI initiation, OTS negotiation, to resolution — a fully orchestrated recovery pipeline with auto-escalation and recovery probability scoring.',
    icon: '⚠️',
    gradient: 'from-red-700 to-orange-600',
    borderColor: 'border-red-300',
    departments: [
      { id: 'portfolio', label: 'Portfolio', icon: '📋', color: '#8B5CF6' },
      { id: 'risk', label: 'Risk', icon: '🛡️', color: '#EF4444' },
      { id: 'collections', label: 'Collections', icon: '💰', color: '#F59E0B' },
      { id: 'legal', label: 'Legal', icon: '⚖️', color: '#6366F1' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
    ],
    documents: [
      { id: 'npa-watchlist', filename: 'npa_watchlist.csv', label: 'NPA Watchlist', description: 'Early warning accounts with DPD, outstanding, collateral', path: '/sample-data/doc-intelligence/credit-underwriting/npa_watchlist.csv', department: 'portfolio' },
      { id: 'dpd-aging', filename: 'dpd_aging_report.csv', label: 'DPD Aging Report', description: 'Overdue accounts by DPD bucket with action plans', path: '/sample-data/doc-intelligence/collections-recovery/dpd_aging_report.csv', department: 'collections' },
      { id: 'risk-portfolio', filename: 'risk_assessment_portfolio.csv', label: 'Portfolio Risk Assessment', description: 'Segment-wise risk scores across 6 dimensions', path: '/sample-data/doc-intelligence/compliance-risk/risk_assessment_portfolio.csv', department: 'risk' },
      { id: 'collection-perf', filename: 'collection_performance.csv', label: 'Collection Agency Performance', description: 'Agency-wise collection efficiency and recovery rates', path: '/sample-data/doc-intelligence/collections-recovery/collection_performance.csv', department: 'collections' },
      { id: 'sarfaesi', filename: 'sarfaesi_tracker.csv', label: 'SARFAESI Proceedings', description: 'SARFAESI cases with notice, possession, auction status', path: '/sample-data/doc-intelligence/collections-recovery/sarfaesi_tracker.csv', department: 'legal' },
      { id: 'ots-proposals', filename: 'ots_proposals.csv', label: 'OTS Proposal Register', description: 'One-time settlement proposals with haircut and approval status', path: '/sample-data/doc-intelligence/collections-recovery/ots_proposals.csv', department: 'collections' },
      { id: 'credit-summary', filename: 'credit_assessment_summary.csv', label: 'Credit Assessment Summary', description: 'Original credit profiles for reference', path: '/sample-data/doc-intelligence/credit-underwriting/credit_assessment_summary.csv', department: 'risk' },
      { id: 'loan-apps', filename: 'loan_applications.csv', label: 'Loan Applications', description: 'Original loan terms for reference', path: '/sample-data/doc-intelligence/loan-origination/loan_applications.csv', department: 'portfolio' },
    ],
    stages: [
      {
        id: 'early-warning',
        title: 'Early Warning Signal Detection',
        department: 'portfolio',
        departmentLabel: 'Portfolio Management',
        description: 'Identify accounts showing early stress signals — EMI bounces, CIBIL deterioration, income disruption patterns.',
        documentIds: ['npa-watchlist', 'dpd-aging', 'loan-apps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1 of NPA Recovery Pipeline: Early Warning Signal Detection.

Analyze the NPA watchlist, DPD aging report, and loan data to produce:

## 1. Early Warning Dashboard
| Account | DPD Bucket | Outstanding | Signal Type | Severity | Probability of Default |
Identify every account showing stress signals.

## 2. Signal Classification
Categorize early warning signals:
- PAYMENT STRESS: EMI bounces, partial payments, increasing DPD
- CREDIT DETERIORATION: CIBIL score drops, new inquiries, increased utilization
- INCOME DISRUPTION: Sector risk (IT layoffs, real estate slowdown), employer instability
- COLLATERAL RISK: Property market correction, builder stress, RERA issues

## 3. NPA Migration Forecast
- Accounts likely to slip to NPA (90+ DPD) in next 30/60/90 days
- Portfolio-level NPA projection
- Segment-wise vulnerability analysis

## 4. Proactive Intervention Recommendations
For each at-risk account:
| Account | Current DPD | Recommended Action | Timeline | Expected Outcome |

Present as an Early Warning Intelligence Report for Portfolio Head.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'risk-assessment',
        title: 'Multi-Dimensional Risk Assessment',
        department: 'risk',
        departmentLabel: 'Risk Management',
        description: 'Perform comprehensive risk scoring across credit, fraud, property, market, operational, and regulatory dimensions for stressed accounts.',
        documentIds: ['risk-portfolio', 'credit-summary', 'npa-watchlist'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2 of NPA Recovery Pipeline: Multi-Dimensional Risk Assessment.

Using portfolio risk data, credit summaries, and NPA watchlist, produce:

## 1. Risk Summary Dashboard
For each stressed account, score across 6 dimensions:
| Account | Credit Risk | Fraud Risk | Property Risk | Market Risk | Operational Risk | Regulatory Risk | Overall |
Use Green/Amber/Red indicators.

## 2. Credit Risk Deep Dive
- Default probability scoring
- FOIR stress analysis under rate increase scenarios
- Income sustainability assessment
- Collateral coverage adequacy

## 3. Recovery Probability Matrix
| Account | Outstanding | Collateral Value | LTV | Recovery Probability | Expected Recovery Amount |

## 4. Risk-Based Segmentation
Segment accounts into tiers for differentiated collection strategy:
- Tier 1: Self-cure likely (soft touch)
- Tier 2: Needs intervention (structured follow-up)
- Tier 3: Unlikely to cure (legal/SARFAESI track)
- Tier 4: Write-off candidates (minimize costs)

## 5. Portfolio Impact Analysis
- Total exposure at risk
- Expected credit losses
- Provision adequacy assessment
- Impact on portfolio NPA ratio

Present as a Risk Assessment Report for Risk Committee.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'collection-strategy',
        title: 'Collection Strategy & Execution',
        department: 'collections',
        departmentLabel: 'Collections & Recovery',
        description: 'Design risk-based collection strategies, assign agencies, track performance, and evaluate OTS proposals.',
        documentIds: ['collection-perf', 'ots-proposals', 'dpd-aging'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3 of NPA Recovery Pipeline: Collection Strategy & Execution.

Using collection performance data, OTS proposals, and DPD aging, produce:

## 1. Collection Strategy by Tier
For each risk tier (from prior stage), define:
| Tier | Strategy | Channel | Frequency | Escalation Trigger | Target Resolution |

## 2. Agency Performance Analysis
- Agency-wise success rates, recovery amounts, cost efficiency
- Optimal agency-account matching recommendations
- Underperforming agencies requiring replacement

## 3. OTS Evaluation
For each OTS proposal:
| Borrower | Outstanding | Proposed Amount | Haircut % | NPV Analysis | Recommendation |
- Compare OTS recovery vs SARFAESI expected recovery
- Time-value analysis: early OTS vs prolonged legal recovery

## 4. Collection Forecast
- 30/60/90-day recovery projections by segment
- Cash flow forecast from collections
- Resource allocation optimization

## 5. Escalation Recommendations
- Accounts requiring immediate legal action
- Accounts suitable for restructuring
- Accounts for OTS negotiation
- Write-off candidates with justification

Present as a Collections Strategy Report for Collections Head.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'legal-recovery',
        title: 'Legal Action & SARFAESI Proceedings',
        department: 'legal',
        departmentLabel: 'Legal',
        description: 'Track SARFAESI proceedings, assess legal recovery timelines, and generate status reports for accounts requiring legal intervention.',
        documentIds: ['sarfaesi', 'npa-watchlist'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4 of NPA Recovery Pipeline: Legal Action & SARFAESI Proceedings.

Using SARFAESI tracker and NPA watchlist, produce:

## 1. SARFAESI Status Dashboard
| Case | Borrower | Outstanding | Stage | Notice Date | Possession | Auction | Expected Recovery |
Track each case through the SARFAESI lifecycle.

## 2. Legal Action Recommendations
For accounts not yet under SARFAESI:
- Eligibility assessment (>INR 1 lakh outstanding, secured asset available)
- Priority ranking for legal action initiation
- Expected timeline and costs

## 3. Recovery Timeline Analysis
- Average time from notice to recovery
- Bottleneck identification in legal process
- Court jurisdiction delays analysis

## 4. Legal Cost-Benefit Analysis
| Account | Legal Cost | Expected Recovery | Net Recovery | Time to Recover | ROI |

## 5. Legal Proceedings Summary for Management
- Total cases under SARFAESI
- Stage-wise distribution
- Expected recovery in next quarter
- Cases requiring senior management intervention

Present as a Legal Recovery Report for Legal Head.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'resolution-summary',
        title: 'Resolution Summary & Board Report',
        department: 'compliance',
        departmentLabel: 'Compliance & Reporting',
        description: 'Generate comprehensive resolution summary with regulatory compliance status, provision adequacy, and board-ready NPA management report.',
        documentIds: ['npa-watchlist', 'risk-portfolio', 'sarfaesi', 'ots-proposals'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 5 of NPA Recovery Pipeline: Resolution Summary & Board Report.

Synthesize all prior stage outputs and data into a board-ready NPA management report:

## 1. Executive Summary
- Portfolio stress overview in 5 key metrics
- NPA movement: Opening → Additions → Recoveries → Write-offs → Closing
- Recovery rate and efficiency metrics

## 2. NPA Movement Analysis
| Category | Opening NPA | Fresh Slippages | Recoveries | Upgrades | Write-offs | Closing NPA |
Break down by product, segment, geography.

## 3. Recovery Performance Scorecard
| Channel | Cases | Amount Recovered | Success Rate | Cost of Recovery | Net Recovery |
Channels: Self-cure, Soft collections, Hard collections, SARFAESI, OTS

## 4. Regulatory Compliance Status
- RBI NPA classification compliance
- Provision adequacy (as per IRAC norms)
- Disclosure requirements status
- Audit observation remediation

## 5. Forward-Looking Strategy
- Projected NPA for next quarter
- Strategic interventions planned
- Resource and budget requirements
- Risk mitigation measures

## 6. Board-Ready Recommendations
Numbered, specific, time-bound recommendations for the Board/ALCO.

Present as a Board-Ready NPA Management Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. REGULATORY CIRCULAR IMPACT TO IMPLEMENTATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'regulatory-impact',
    title: 'Regulatory Impact to Implementation',
    subtitle: 'Compliance → Product → Legal → Operations → Sales → Service',
    description: 'When a new RBI/NHB circular drops, auto-analyze impact on every product, identify affected live loans, draft policy changes, update SOPs, generate sales talking points, and produce training material — all in one pass.',
    icon: '📜',
    gradient: 'from-emerald-700 to-teal-600',
    borderColor: 'border-emerald-300',
    departments: [
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
      { id: 'legal', label: 'Legal', icon: '⚖️', color: '#6366F1' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'sales', label: 'Sales', icon: '📈', color: '#F59E0B' },
      { id: 'service', label: 'Service', icon: '🤝', color: '#EC4899' },
    ],
    documents: [
      { id: 'reg-circulars', filename: 'regulatory_circulars.csv', label: 'Regulatory Circular Tracker', description: 'RBI/NHB circulars with impact area and compliance deadlines', path: '/sample-data/doc-intelligence/compliance-risk/regulatory_circulars.csv', department: 'compliance' },
      { id: 'product-catalog', filename: 'product_catalog.csv', label: 'Product Catalog', description: 'Full retail asset product suite with features and terms', path: '/sample-data/doc-intelligence/product-mgmt/product_catalog.csv', department: 'product' },
      { id: 'rate-history', filename: 'rate_card_history.csv', label: 'Rate Card History', description: 'Historical interest rate changes and triggers', path: '/sample-data/doc-intelligence/product-mgmt/rate_card_history.csv', department: 'product' },
      { id: 'pmay', filename: 'pmay_guidelines.txt', label: 'PMAY Guidelines', description: 'Pradhan Mantri Awas Yojana eligibility and subsidy details', path: '/sample-data/doc-intelligence/product-mgmt/pmay_guidelines.txt', department: 'compliance' },
      { id: 'scheme', filename: 'scheme_circular.txt', label: 'Product Scheme Circular', description: 'Special scheme details with terms and validity', path: '/sample-data/doc-intelligence/product-mgmt/scheme_circular.txt', department: 'product' },
      { id: 'loan-apps', filename: 'loan_applications.csv', label: 'Loan Applications', description: 'Live loan portfolio to assess impact', path: '/sample-data/doc-intelligence/loan-origination/loan_applications.csv', department: 'operations' },
      { id: 'risk-portfolio', filename: 'risk_assessment_portfolio.csv', label: 'Portfolio Risk Assessment', description: 'Current portfolio risk profile', path: '/sample-data/doc-intelligence/compliance-risk/risk_assessment_portfolio.csv', department: 'compliance' },
    ],
    stages: [
      {
        id: 'circular-analysis',
        title: 'Regulatory Circular Analysis',
        department: 'compliance',
        departmentLabel: 'Compliance',
        description: 'Parse and analyze new regulatory circulars, extract key requirements, and assess compliance deadlines.',
        documentIds: ['reg-circulars', 'pmay'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Regulatory Circular Analysis.

Analyze the regulatory circulars and produce:

## 1. Circular Summary Dashboard
| Circular | Date | Regulator | Subject | Impact Area | Deadline | Status |

## 2. Key Requirements Extraction
For each pending/new circular, extract:
- What changed (specific norms, limits, requirements)
- Who is affected (which products, which customer segments)
- Compliance deadline and penalties for non-compliance
- Transitional provisions

## 3. Priority Classification
Rate each circular: Critical / High / Medium / Low based on impact and deadline.

## 4. Gap Analysis
Current compliance status vs new requirements — identify gaps.

Present as a Regulatory Intelligence Brief for Compliance Head.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'product-impact',
        title: 'Product Impact Assessment',
        department: 'product',
        departmentLabel: 'Product Management',
        description: 'Assess impact on every product in the catalog, identify required pricing/feature changes, and draft product modification memos.',
        documentIds: ['product-catalog', 'rate-history', 'scheme'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Product Impact Assessment.

Using the product catalog, rate history, and scheme details, produce:

## 1. Product Impact Matrix
| Product | Affected Parameter | Current Value | Required Change | Revenue Impact | Priority |

## 2. Pricing Impact Analysis
- Rate card changes required per regulatory update
- Impact on competitive positioning
- Customer EMI impact analysis

## 3. Product Modification Recommendations
For each affected product:
- Specific changes needed (LTV, pricing, eligibility, documentation)
- Timeline for implementation
- Customer communication requirements

## 4. New Product Opportunities
- Any regulatory changes that create new product possibilities
- Market gaps created by new regulations

Present as a Product Impact Assessment for Product Head.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'ops-implementation',
        title: 'Operational SOP & Process Update',
        department: 'operations',
        departmentLabel: 'Operations',
        description: 'Draft operational process changes, update SOPs, design checklists, and plan implementation timeline.',
        documentIds: ['loan-apps', 'reg-circulars'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Operational SOP & Process Update.

Produce:

## 1. Process Change Register
| Process | Current SOP | Required Change | Impact Level | Implementation Date |

## 2. Updated Checklists
Draft updated operational checklists incorporating new regulatory requirements.

## 3. System Change Requirements
- Which systems need parameter updates
- Data fields to be added/modified
- Report format changes required

## 4. Implementation Timeline
Gantt-style timeline with milestones, owners, and dependencies.

## 5. Impact on Live Pipeline
- How many in-process applications are affected
- Transitional handling guidelines

Present as an Operations Implementation Plan.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'sales-enablement',
        title: 'Sales Communication & Training Material',
        department: 'sales',
        departmentLabel: 'Sales & Service',
        description: 'Generate frontline communication, sales talking points, FAQ documents, and training capsules for the field sales and service teams.',
        documentIds: ['product-catalog', 'reg-circulars', 'rate-history'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Sales Communication & Training.

Produce:

## 1. Sales Talking Points
Crisp, field-ready talking points for RMs explaining regulatory changes in customer-friendly language.

## 2. Customer FAQ Document
Q&A format addressing anticipated customer questions about the changes.

## 3. Competitive Positioning Update
How to position HDFC vs competitors under new regulatory framework.

## 4. Training Capsule
One-page training module for branch staff covering:
- What changed and why
- Impact on customer conversations
- Updated product features/terms
- Common customer objections and responses

## 5. Customer Communication Drafts
Draft letters/emails for affected customers explaining changes.

Present as a Sales & Service Enablement Kit.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. CUSTOMER COMPLAINT ROOT CAUSE TO PROCESS REDESIGN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'complaint-resolution',
    title: 'Complaint Root Cause to Redesign',
    subtitle: 'Service → Operations → Product → Compliance → Sales',
    description: 'Ingest all customer complaints, service requests, and NPS data — perform root cause clustering, identify systemic failures, map to responsible departments, generate process fixes, and produce frontline training capsules.',
    icon: '🔧',
    gradient: 'from-amber-700 to-yellow-600',
    borderColor: 'border-amber-300',
    departments: [
      { id: 'service', label: 'Service', icon: '🤝', color: '#EC4899' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
      { id: 'sales', label: 'Sales', icon: '📈', color: '#F59E0B' },
    ],
    documents: [
      { id: 'complaints', filename: 'customer_complaints.csv', label: 'Customer Complaint Register', description: 'Complaints with category, priority, SLA, resolution', path: '/sample-data/doc-intelligence/service-ops/customer_complaints.csv', department: 'service' },
      { id: 'service-reqs', filename: 'service_requests.csv', label: 'Service Request Tracker', description: 'Active service requests with type, status, TAT', path: '/sample-data/doc-intelligence/service-ops/service_requests.csv', department: 'service' },
      { id: 'nps', filename: 'nps_survey_results.csv', label: 'NPS Survey Results', description: 'Customer satisfaction survey with verbatim feedback', path: '/sample-data/doc-intelligence/service-ops/nps_survey_results.csv', department: 'service' },
      { id: 'walkin-log', filename: 'branch_walkin_log.csv', label: 'Branch Walk-in Log', description: 'Daily walk-in register with purpose and conversion', path: '/sample-data/doc-intelligence/service-ops/branch_walkin_log.csv', department: 'operations' },
      { id: 'product-catalog', filename: 'product_catalog.csv', label: 'Product Catalog', description: 'Product features for gap analysis', path: '/sample-data/doc-intelligence/product-mgmt/product_catalog.csv', department: 'product' },
      { id: 'audit-findings', filename: 'audit_findings.csv', label: 'Audit Findings', description: 'Internal audit observations related to service', path: '/sample-data/doc-intelligence/compliance-risk/audit_findings.csv', department: 'compliance' },
      { id: 'reg-circulars', filename: 'regulatory_circulars.csv', label: 'Regulatory Circulars', description: 'Regulatory requirements on customer service', path: '/sample-data/doc-intelligence/compliance-risk/regulatory_circulars.csv', department: 'compliance' },
    ],
    stages: [
      {
        id: 'complaint-analysis',
        title: 'Complaint Intake & Classification',
        department: 'service',
        departmentLabel: 'Service',
        description: 'Analyze all complaints, classify by category, severity, and SLA compliance.',
        documentIds: ['complaints', 'service-reqs', 'nps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Complaint Intake & Classification.

Analyze complaints, service requests, and NPS data to produce:

## 1. Complaint Dashboard
| Category | Count | Avg Resolution Time | SLA Breach % | Avg CSAT | Trend |
Show category-wise complaint distribution and performance.

## 2. Severity Classification
Reclassify all complaints by actual impact:
- Critical: Regulatory risk, financial loss to customer
- High: Significant customer dissatisfaction, retention risk
- Medium: Process delay, inconvenience
- Low: Information request, minor issue

## 3. NPS Correlation Analysis
Map NPS detractor verbatims to complaint categories — which issues drive the most dissatisfaction?

## 4. SLA Performance
- Overall SLA compliance rate
- Category-wise SLA breach analysis
- Branch-wise SLA performance

Present as a Customer Voice Intelligence Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'root-cause',
        title: 'Root Cause Clustering & Analysis',
        department: 'operations',
        departmentLabel: 'Operations',
        description: 'Perform deep root cause analysis, identify systemic patterns, and map failures to responsible processes.',
        documentIds: ['complaints', 'walkin-log', 'audit-findings'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Root Cause Clustering & Analysis.

Produce:

## 1. Root Cause Clusters
Group complaints into systemic root causes (not just categories):
| Root Cause | Complaints Linked | Impact Score | Department Responsible | Process Gap |

## 2. Systemic Failure Identification
Identify recurring patterns that indicate process failures vs one-off issues.

## 3. Walk-in Friction Analysis
Map branch walk-in data to identify service delivery bottlenecks.

## 4. Audit Finding Correlation
Link complaint patterns to existing audit observations — which audit findings are manifesting as customer complaints?

## 5. Impact Quantification
- Revenue at risk from unresolved systemic issues
- Customer churn risk
- Regulatory exposure

Present as a Root Cause Analysis Report for Operations Head.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'process-redesign',
        title: 'Process Fix & SOP Redesign',
        department: 'product',
        departmentLabel: 'Product & Process',
        description: 'Design specific process fixes for each root cause, draft updated SOPs, and create implementation roadmap.',
        documentIds: ['product-catalog', 'complaints'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Process Fix & SOP Redesign.

Produce:

## 1. Process Fix Register
| Root Cause | Current Process | Proposed Fix | Expected Impact | Owner | Timeline |

## 2. Product Feature Gap Fixes
Where complaints stem from product limitations — recommend feature enhancements.

## 3. Updated SOP Drafts
For top 3 root causes, draft updated Standard Operating Procedures.

## 4. Implementation Roadmap
Phase 1 (Quick wins — 2 weeks), Phase 2 (Process changes — 4 weeks), Phase 3 (System changes — 8 weeks)

## 5. Success Metrics
KPIs to track whether fixes are working — complaint reduction targets, SLA improvement, NPS lift.

Present as a Process Improvement Plan.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'training-rollout',
        title: 'Training Material & Rollout Plan',
        department: 'sales',
        departmentLabel: 'Sales & Frontline',
        description: 'Generate training capsules, communication scripts, and branch-level rollout plan to prevent complaint recurrence.',
        documentIds: ['complaints', 'nps', 'walkin-log'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Training & Prevention Rollout.

Produce:

## 1. Training Capsules
For each major complaint category, create a one-page training module:
- What customers experience
- What staff should do differently
- Scripts for handling similar situations
- Escalation protocol

## 2. Branch Communication Kit
- Branch head briefing document
- Staff talking points
- Customer communication templates for proactive outreach

## 3. Rollout Plan
| Week | Activity | Target Audience | Channel | Owner | Metric |

## 4. Prevention Dashboard Design
Define the ongoing monitoring dashboard to track complaint prevention:
- Leading indicators (process compliance, training completion)
- Lagging indicators (complaint volumes, NPS)

Present as a Training & Prevention Rollout Kit.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. FRAUD DETECTION TO CONTROL STRENGTHENING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'fraud-investigation',
    title: 'Fraud Detection to Control Strengthening',
    subtitle: 'Risk → Compliance → Credit → Legal → Operations → Audit',
    description: 'From anomaly detection through investigation dossier assembly, pattern matching against known fraud typologies, legal action preparation, to org-wide control strengthening and audit trail documentation.',
    icon: '🚨',
    gradient: 'from-rose-700 to-red-600',
    borderColor: 'border-rose-300',
    departments: [
      { id: 'risk', label: 'Risk', icon: '🛡️', color: '#EF4444' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
      { id: 'credit', label: 'Credit', icon: '📊', color: '#8B5CF6' },
      { id: 'legal', label: 'Legal', icon: '⚖️', color: '#6366F1' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'audit', label: 'Audit', icon: '🔍', color: '#F59E0B' },
    ],
    documents: [
      { id: 'fraud-alerts', filename: 'fraud_alerts.csv', label: 'Fraud Alert Register', description: 'Suspicious cases with type, indicator, status, amount at risk', path: '/sample-data/doc-intelligence/compliance-risk/fraud_alerts.csv', department: 'risk' },
      { id: 'red-flags', filename: 'red_flag_samples.csv', label: 'Red Flag Samples', description: 'Known red flag patterns for matching', path: '/sample-data/doc-intelligence/compliance-risk/red_flag_samples.csv', department: 'compliance' },
      { id: 'loan-apps', filename: 'loan_applications.csv', label: 'Loan Applications', description: 'Suspect applications for investigation', path: '/sample-data/doc-intelligence/loan-origination/loan_applications.csv', department: 'credit' },
      { id: 'credit-summary', filename: 'credit_assessment_summary.csv', label: 'Credit Assessment', description: 'Credit profiles of suspect cases', path: '/sample-data/doc-intelligence/credit-underwriting/credit_assessment_summary.csv', department: 'credit' },
      { id: 'deviation-reg', filename: 'deviation_register.csv', label: 'Deviation Register', description: 'Policy deviations in suspect cases', path: '/sample-data/doc-intelligence/credit-underwriting/deviation_register.csv', department: 'compliance' },
      { id: 'audit-findings', filename: 'audit_findings.csv', label: 'Audit Findings', description: 'Related audit observations', path: '/sample-data/doc-intelligence/compliance-risk/audit_findings.csv', department: 'audit' },
      { id: 'doc-checklist', filename: 'document_checklist.csv', label: 'Document Checklist', description: 'Document integrity verification', path: '/sample-data/doc-intelligence/loan-origination/document_checklist.csv', department: 'operations' },
    ],
    stages: [
      {
        id: 'anomaly-detection',
        title: 'Anomaly Detection & Alert Triage',
        department: 'risk',
        departmentLabel: 'Risk Management',
        description: 'Detect anomalies, triage fraud alerts by severity, and identify investigation priorities.',
        documentIds: ['fraud-alerts', 'red-flags'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Anomaly Detection & Alert Triage.

Analyze fraud alerts and red flag data to produce:

## 1. Fraud Alert Dashboard
| Alert ID | Type | Amount at Risk | Severity | Status | Investigation Priority |

## 2. Pattern Recognition
Match alerts against known fraud typologies:
- Identity fraud (document inconsistencies, fake employers)
- Income inflation (circular transactions, inflated salary claims)
- Property fraud (valuation manipulation, fake RERA)
- Syndicate patterns (connected applications, common intermediaries)

## 3. Alert Prioritization
Rank by: Amount at risk x Probability of fraud x Ease of detection

## 4. Investigation Queue
Top 10 cases requiring immediate investigation with justification.

Present as a Fraud Intelligence Brief.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'investigation-dossier',
        title: 'Investigation Dossier Assembly',
        department: 'credit',
        departmentLabel: 'Credit & Investigation',
        description: 'Build comprehensive investigation dossiers by cross-referencing application data, credit assessments, and deviations.',
        documentIds: ['loan-apps', 'credit-summary', 'deviation-reg', 'doc-checklist'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Investigation Dossier Assembly.

For priority fraud cases, produce:

## 1. Case Dossier (per suspect case)
- Applicant profile and application details
- Credit assessment anomalies
- Document verification status
- Policy deviations approved
- Cross-reference inconsistencies

## 2. Evidence Matrix
| Evidence Type | Document | Finding | Fraud Indicator | Confidence |

## 3. Connected Entity Analysis
Identify links between suspect cases (common employer, property, intermediary, address).

## 4. Timeline of Events
Chronological sequence of application processing with suspicious decision points flagged.

## 5. Investigation Recommendations
For each case: Continue investigation / Refer to legal / Escalate to management / Close with monitoring.

Present as Investigation Dossiers ready for fraud committee.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'legal-action',
        title: 'Legal Action & Recovery',
        department: 'legal',
        departmentLabel: 'Legal',
        description: 'Prepare legal action documents, assess recovery options, and create prosecution-ready case files.',
        documentIds: ['fraud-alerts', 'loan-apps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Legal Action & Recovery.

Produce:

## 1. Legal Action Recommendations
| Case | Fraud Type | Amount | Legal Route | Expected Timeline | Recovery Prospect |
Options: FIR, Civil suit, SARFAESI, Insurance claim, Write-off

## 2. Prosecution Readiness Assessment
For each case, assess evidence strength: Strong / Moderate / Weak

## 3. Recovery Strategy
- Asset attachment possibilities
- Guarantor/co-applicant liability
- Insurance claim eligibility

## 4. Regulatory Reporting Requirements
- RBI fraud reporting obligations
- Internal incident reporting
- Board/committee notification requirements

Present as a Legal Action Plan.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'control-strengthening',
        title: 'Control Strengthening & Prevention',
        department: 'audit',
        departmentLabel: 'Audit & Controls',
        description: 'Identify control gaps that allowed fraud, recommend process controls, and create audit trail for future prevention.',
        documentIds: ['audit-findings', 'deviation-reg', 'fraud-alerts'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Control Strengthening & Prevention.

Produce:

## 1. Control Gap Analysis
| Process | Current Control | Gap Identified | Fraud It Enabled | Recommended Enhancement |

## 2. Process Control Recommendations
Specific, implementable control enhancements for:
- Application intake (identity verification, employer verification)
- Credit appraisal (income validation, site verification)
- Document processing (digital authentication, cross-verification)
- Disbursement (pre-disbursement checks, legal verification)

## 3. Early Warning System Design
Define automated triggers/rules for future fraud detection.

## 4. Audit Trail Requirements
Documentation and monitoring requirements for ongoing fraud prevention.

## 5. Organization-Wide Prevention Report
- Lessons learned summary
- Control enhancement timeline
- Training needs for staff
- Technology recommendations (AI/ML fraud detection, digital verification)
- Cost-benefit of prevention vs detection

Present as a Fraud Prevention & Control Strengthening Report for Audit Committee.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. COMPETITIVE INTELLIGENCE TO RETENTION WARFARE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'competitive-retention',
    title: 'Competitive Intelligence to Retention',
    subtitle: 'Product → Sales → Risk → Service → Compliance',
    description: 'Monitor competitor rates, identify at-risk customers, score attrition probability, design personalized retention offers, generate RM outreach scripts, and track retention campaign ROI.',
    icon: '🛡️',
    gradient: 'from-violet-700 to-purple-600',
    borderColor: 'border-violet-300',
    departments: [
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
      { id: 'sales', label: 'Sales', icon: '📈', color: '#F59E0B' },
      { id: 'risk', label: 'Risk', icon: '🛡️', color: '#EF4444' },
      { id: 'service', label: 'Service', icon: '🤝', color: '#EC4899' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
    ],
    documents: [
      { id: 'competitor-rates', filename: 'competitor_rate_card.csv', label: 'Competitor Rate Card', description: 'Market pricing across lenders', path: '/sample-data/doc-intelligence/sales-distribution/competitor_rate_card.csv', department: 'product' },
      { id: 'rate-history', filename: 'rate_card_history.csv', label: 'Rate Card History', description: 'HDFC rate trajectory over time', path: '/sample-data/doc-intelligence/product-mgmt/rate_card_history.csv', department: 'product' },
      { id: 'loan-apps', filename: 'loan_applications.csv', label: 'Loan Applications', description: 'Customer portfolio for attrition analysis', path: '/sample-data/doc-intelligence/loan-origination/loan_applications.csv', department: 'sales' },
      { id: 'nps', filename: 'nps_survey_results.csv', label: 'NPS Survey Results', description: 'Customer satisfaction signals', path: '/sample-data/doc-intelligence/service-ops/nps_survey_results.csv', department: 'service' },
      { id: 'product-catalog', filename: 'product_catalog.csv', label: 'Product Catalog', description: 'Available counter-offers', path: '/sample-data/doc-intelligence/product-mgmt/product_catalog.csv', department: 'product' },
      { id: 'rm-scorecard', filename: 'rm_scorecard.csv', label: 'RM Scorecard', description: 'RM capacity for outreach', path: '/sample-data/doc-intelligence/sales-distribution/rm_scorecard.csv', department: 'sales' },
      { id: 'lead-tracker', filename: 'lead_tracker.csv', label: 'Lead Tracker', description: 'Competitor-mentioned leads', path: '/sample-data/doc-intelligence/sales-distribution/lead_tracker.csv', department: 'sales' },
      { id: 'complaints', filename: 'customer_complaints.csv', label: 'Customer Complaints', description: 'Dissatisfaction signals', path: '/sample-data/doc-intelligence/service-ops/customer_complaints.csv', department: 'service' },
    ],
    stages: [
      {
        id: 'competitive-intel',
        title: 'Competitive Intelligence Scan',
        department: 'product',
        departmentLabel: 'Product Management',
        description: 'Analyze competitor pricing, features, and market positioning to identify threats and opportunities.',
        documentIds: ['competitor-rates', 'rate-history', 'product-catalog'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Competitive Intelligence Scan.

Produce:

## 1. Competitive Rate Matrix
| Lender | Product | Rate Range | Processing Fee | LTV | Special Offers | HDFC Position |
Compare HDFC vs every competitor across all products.

## 2. Competitive Threat Assessment
- Where HDFC is losing on price
- Where HDFC has rate advantage
- Feature gaps vs competitors
- Market share risk areas

## 3. Rate Trend Analysis
Historical rate movements — who cut first, who followed, competitive response patterns.

## 4. Strategic Positioning Map
HDFC's position on Price vs Service vs Features matrix.

Present as a Competitive Intelligence Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'attrition-risk',
        title: 'Customer Attrition Risk Scoring',
        department: 'risk',
        departmentLabel: 'Risk & Analytics',
        description: 'Score every customer for balance-transfer risk based on rate differential, satisfaction, tenure, and competitive exposure.',
        documentIds: ['loan-apps', 'nps', 'complaints'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Customer Attrition Risk Scoring.

Produce:

## 1. Attrition Risk Scorecard
| Customer | Loan Outstanding | Current Rate | Competitor Rate | Rate Gap | NPS Score | Complaint History | Attrition Risk |
Score: High / Medium / Low for every customer.

## 2. Risk Drivers Analysis
Top factors driving attrition risk:
- Rate differential (largest gap = highest risk)
- Customer dissatisfaction (NPS detractors)
- Complaint history (unresolved = higher risk)
- Tenure (recent loans more likely to transfer)

## 3. Portfolio at Risk
- Total outstanding at risk of balance transfer
- Revenue impact if attrition occurs
- Segment-wise vulnerability

## 4. Priority Retention List
Top 20 customers requiring immediate retention action.

Present as an Attrition Risk Intelligence Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'retention-offers',
        title: 'Retention Offer Design & RM Outreach',
        department: 'sales',
        departmentLabel: 'Sales',
        description: 'Design personalized retention offers and generate RM-ready outreach scripts for at-risk customers.',
        documentIds: ['product-catalog', 'rm-scorecard', 'lead-tracker'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Retention Offer Design & RM Outreach.

Produce:

## 1. Personalized Retention Offers
| Customer | Risk Level | Offer Type | Offer Details | Expected Save Rate | Revenue Protected |
Offer types: Rate match, Rate reduction, Top-up loan, Tenure restructure, Cross-sell bundle, Loyalty reward

## 2. RM Outreach Scripts
For each offer type, provide ready-to-use scripts:
- Opening hook (empathetic, not desperate)
- Value proposition framing
- Competitor counter-positioning
- Objection handling (3 common objections)
- Closing technique

## 3. RM Assignment & Workload
Match retention cases to RMs based on capacity, expertise, and customer relationship.

## 4. Campaign Execution Plan
| Week | Activity | Target Segment | Channel | RM | Expected Outcome |

Present as a Retention Campaign Playbook.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'retention-roi',
        title: 'Retention ROI & Compliance Validation',
        department: 'compliance',
        departmentLabel: 'Compliance & Finance',
        description: 'Validate retention offers against compliance guardrails and project campaign ROI.',
        documentIds: ['competitor-rates', 'loan-apps', 'product-catalog'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Retention ROI & Compliance Validation.

Produce:

## 1. Offer Compliance Check
| Offer | Regulatory Check | Fair Practices Code | Pricing Policy | Board Limit | Status |
Validate every retention offer against compliance guardrails.

## 2. Financial Impact Analysis
- Cost of retention offers (rate concessions, fee waivers)
- Revenue protected (interest income on retained portfolio)
- Net ROI of retention campaign
- Break-even analysis

## 3. Portfolio Impact Projection
- With retention: Portfolio size, NIM, cross-sell revenue
- Without retention: Portfolio erosion, competitive loss
- Net benefit of retention investment

## 4. Board-Ready Recommendation
Executive summary with:
- Total at-risk portfolio
- Retention budget required
- Expected save rate and revenue protected
- ROI and payback period
- Strategic recommendations

Present as a Retention Campaign Business Case for ALCO/Board.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. QUARTER-END PORTFOLIO REVIEW TO BOARD PACK
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'quarter-review',
    title: 'Quarter-End Review to Board Pack',
    subtitle: 'Portfolio → Risk → Sales → Collections → Compliance → Product',
    description: 'Pull together the entire quarter data across all departments — portfolio health, sales performance, collections efficiency, compliance status, customer sentiment — and auto-generate a board-ready intelligence pack.',
    icon: '📊',
    gradient: 'from-slate-700 to-zinc-600',
    borderColor: 'border-slate-300',
    departments: [
      { id: 'portfolio', label: 'Portfolio', icon: '📋', color: '#8B5CF6' },
      { id: 'risk', label: 'Risk', icon: '🛡️', color: '#EF4444' },
      { id: 'sales', label: 'Sales', icon: '📈', color: '#F59E0B' },
      { id: 'collections', label: 'Collections', icon: '💰', color: '#06B6D4' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
    ],
    documents: [
      { id: 'risk-portfolio', filename: 'risk_assessment_portfolio.csv', label: 'Portfolio Risk Assessment', description: 'Portfolio risk profile across dimensions', path: '/sample-data/doc-intelligence/compliance-risk/risk_assessment_portfolio.csv', department: 'risk' },
      { id: 'npa-watchlist', filename: 'npa_watchlist.csv', label: 'NPA Watchlist', description: 'Stressed accounts and asset quality', path: '/sample-data/doc-intelligence/credit-underwriting/npa_watchlist.csv', department: 'portfolio' },
      { id: 'dpd-aging', filename: 'dpd_aging_report.csv', label: 'DPD Aging Report', description: 'Delinquency trends', path: '/sample-data/doc-intelligence/collections-recovery/dpd_aging_report.csv', department: 'collections' },
      { id: 'branch-perf', filename: 'branch_performance.csv', label: 'Branch Performance', description: 'Sales delivery metrics', path: '/sample-data/doc-intelligence/sales-distribution/branch_performance.csv', department: 'sales' },
      { id: 'rm-scorecard', filename: 'rm_scorecard.csv', label: 'RM Scorecard', description: 'People performance metrics', path: '/sample-data/doc-intelligence/sales-distribution/rm_scorecard.csv', department: 'sales' },
      { id: 'disbursement-tracker', filename: 'disbursement_tracker.csv', label: 'Disbursement Tracker', description: 'Disbursement volumes', path: '/sample-data/doc-intelligence/loan-origination/disbursement_tracker.csv', department: 'sales' },
      { id: 'collection-perf', filename: 'collection_performance.csv', label: 'Collection Performance', description: 'Recovery efficiency', path: '/sample-data/doc-intelligence/collections-recovery/collection_performance.csv', department: 'collections' },
      { id: 'complaints', filename: 'customer_complaints.csv', label: 'Customer Complaints', description: 'Service quality metrics', path: '/sample-data/doc-intelligence/service-ops/customer_complaints.csv', department: 'compliance' },
      { id: 'nps', filename: 'nps_survey_results.csv', label: 'NPS Survey', description: 'Customer sentiment', path: '/sample-data/doc-intelligence/service-ops/nps_survey_results.csv', department: 'compliance' },
      { id: 'competitor-rates', filename: 'competitor_rate_card.csv', label: 'Competitor Rates', description: 'Market position', path: '/sample-data/doc-intelligence/sales-distribution/competitor_rate_card.csv', department: 'product' },
      { id: 'audit-findings', filename: 'audit_findings.csv', label: 'Audit Findings', description: 'Governance status', path: '/sample-data/doc-intelligence/compliance-risk/audit_findings.csv', department: 'compliance' },
      { id: 'fraud-alerts', filename: 'fraud_alerts.csv', label: 'Fraud Alerts', description: 'Fraud trends', path: '/sample-data/doc-intelligence/compliance-risk/fraud_alerts.csv', department: 'risk' },
    ],
    stages: [
      {
        id: 'portfolio-health',
        title: 'Portfolio Health & Risk Dashboard',
        department: 'portfolio',
        departmentLabel: 'Portfolio & Risk',
        description: 'Analyze portfolio composition, risk distribution, NPA trends, and asset quality metrics.',
        documentIds: ['risk-portfolio', 'npa-watchlist', 'dpd-aging', 'fraud-alerts'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Portfolio Health & Risk Dashboard for the quarterly board pack.

Produce:

## 1. Portfolio Overview
Key metrics: Total AUM, disbursement growth, portfolio composition by product/segment/geography.

## 2. Asset Quality Dashboard
| Metric | Current Quarter | Previous Quarter | Change | Benchmark |
NPA ratio, GNPA/NNPA, provision coverage, slippage ratio, recovery rate.

## 3. Risk Heat Map
| Risk Dimension | Score | Trend | Key Driver | Action Required |
Credit, Fraud, Property, Market, Operational, Regulatory — with Green/Amber/Red.

## 4. NPA Movement
Opening → Fresh slippages → Recoveries → Upgrades → Write-offs → Closing.

## 5. Early Warning Summary
Accounts requiring attention in next quarter.

Present as Section 1 of the Board Pack: Portfolio Health.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'sales-performance',
        title: 'Sales Performance & Growth Analysis',
        department: 'sales',
        departmentLabel: 'Sales & Distribution',
        description: 'Analyze branch-wise performance, RM productivity, conversion rates, and disbursement trends.',
        documentIds: ['branch-perf', 'rm-scorecard', 'disbursement-tracker'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Sales Performance for the quarterly board pack.

Produce:

## 1. Sales Scorecard
| Metric | Target | Actual | Achievement % | YoY Growth |
Logins, sanctions, disbursements, ticket size, conversion rate.

## 2. Branch Performance Ranking
Top 5 and Bottom 5 branches with diagnosis.

## 3. RM Productivity Analysis
- Average deals per RM
- Revenue per RM
- Cross-sell ratio
- Customer satisfaction scores

## 4. Disbursement Trend
Monthly disbursement trends with seasonal patterns.

## 5. Growth Opportunities
Identified growth levers for next quarter.

Present as Section 2 of the Board Pack: Sales Performance.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'collections-review',
        title: 'Collections Efficiency & Recovery',
        department: 'collections',
        departmentLabel: 'Collections',
        description: 'Assess collection agency performance, recovery rates, SARFAESI progress, and OTS outcomes.',
        documentIds: ['collection-perf', 'dpd-aging'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Collections Efficiency for the quarterly board pack.

Produce:

## 1. Collection Efficiency Metrics
| Metric | Current | Target | Gap | Improvement Plan |

## 2. Agency Performance Comparison
| Agency | Cases Assigned | Resolved | Amount Recovered | Efficiency % | Rating |

## 3. DPD Bucket Analysis
Movement across buckets: 30 → 60 → 90 → NPA migration patterns.

## 4. Recovery Forecast
Expected recoveries in next quarter by channel.

Present as Section 3 of the Board Pack: Collections & Recovery.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'compliance-customer',
        title: 'Compliance, Governance & Customer Pulse',
        department: 'compliance',
        departmentLabel: 'Compliance & Service',
        description: 'Compile compliance status, audit findings, customer satisfaction trends, and regulatory readiness.',
        documentIds: ['audit-findings', 'complaints', 'nps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Compliance & Customer Pulse for the quarterly board pack.

Produce:

## 1. Regulatory Compliance Scorecard
| Regulation | Status | Gap | Remediation Timeline |

## 2. Audit Finding Status
- Open findings by severity
- Overdue remediation items
- New findings this quarter

## 3. Customer Satisfaction Metrics
- NPS score and trend
- Complaint resolution rate and SLA compliance
- Top customer pain points

## 4. Governance Health
Risk, compliance, and governance effectiveness indicators.

Present as Section 4 of the Board Pack: Governance & Customer.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'board-summary',
        title: 'Executive Board Pack Summary',
        department: 'product',
        departmentLabel: 'Strategy',
        description: 'Synthesize all sections into a crisp board-ready executive summary with strategic recommendations.',
        documentIds: ['competitor-rates', 'risk-portfolio', 'branch-perf'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 5: Executive Board Pack Summary.

Synthesize ALL prior stage outputs into a comprehensive board-ready executive summary:

## 1. Chairman's Brief (1 Page)
5 key highlights, 3 concerns, 2 strategic recommendations.

## 2. Quarterly Scorecard
| KPI | Target | Actual | Status | Trend |
Cover all critical metrics in one table.

## 3. Competitive Position Summary
Where HDFC stands vs market — strengths, vulnerabilities, opportunities.

## 4. Strategic Recommendations (Numbered)
Time-bound, specific, actionable recommendations for the Board.

## 5. Next Quarter Outlook
- Key risks and opportunities
- Target setting recommendations
- Strategic initiatives proposed
- Resource and budget requirements

Present as the Executive Summary section of the Board Pack.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8. NEW PRODUCT/SCHEME LAUNCH READINESS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'product-launch',
    title: 'New Product Launch Readiness',
    subtitle: 'Product → Compliance → Legal → Operations → Sales → Service',
    description: 'From market gap identification through product design, regulatory feasibility, pricing strategy, operational readiness, sales enablement, and service team preparation — an end-to-end go-to-market pipeline.',
    icon: '🚀',
    gradient: 'from-sky-700 to-blue-600',
    borderColor: 'border-sky-300',
    departments: [
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
      { id: 'legal', label: 'Legal', icon: '⚖️', color: '#6366F1' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'sales', label: 'Sales', icon: '📈', color: '#F59E0B' },
      { id: 'service', label: 'Service', icon: '🤝', color: '#EC4899' },
    ],
    documents: [
      { id: 'product-catalog', filename: 'product_catalog.csv', label: 'Product Catalog', description: 'Existing product suite for gap analysis', path: '/sample-data/doc-intelligence/product-mgmt/product_catalog.csv', department: 'product' },
      { id: 'competitor-rates', filename: 'competitor_rate_card.csv', label: 'Competitor Rate Card', description: 'Competitive white spaces', path: '/sample-data/doc-intelligence/sales-distribution/competitor_rate_card.csv', department: 'product' },
      { id: 'complaints', filename: 'customer_complaints.csv', label: 'Customer Complaints', description: 'Unmet need signals', path: '/sample-data/doc-intelligence/service-ops/customer_complaints.csv', department: 'service' },
      { id: 'nps', filename: 'nps_survey_results.csv', label: 'NPS Survey Results', description: 'Feature demand signals', path: '/sample-data/doc-intelligence/service-ops/nps_survey_results.csv', department: 'service' },
      { id: 'reg-circulars', filename: 'regulatory_circulars.csv', label: 'Regulatory Circulars', description: 'Regulatory feasibility check', path: '/sample-data/doc-intelligence/compliance-risk/regulatory_circulars.csv', department: 'compliance' },
      { id: 'pmay', filename: 'pmay_guidelines.txt', label: 'PMAY Guidelines', description: 'Government scheme alignment', path: '/sample-data/doc-intelligence/product-mgmt/pmay_guidelines.txt', department: 'compliance' },
      { id: 'scheme', filename: 'scheme_circular.txt', label: 'Scheme Circular', description: 'Internal scheme framework', path: '/sample-data/doc-intelligence/product-mgmt/scheme_circular.txt', department: 'product' },
      { id: 'rate-history', filename: 'rate_card_history.csv', label: 'Rate Card History', description: 'Pricing benchmarking', path: '/sample-data/doc-intelligence/product-mgmt/rate_card_history.csv', department: 'product' },
      { id: 'branch-perf', filename: 'branch_performance.csv', label: 'Branch Performance', description: 'Launch channel readiness', path: '/sample-data/doc-intelligence/sales-distribution/branch_performance.csv', department: 'sales' },
    ],
    stages: [
      {
        id: 'market-gap',
        title: 'Market Gap & Opportunity Analysis',
        department: 'product',
        departmentLabel: 'Product Management',
        description: 'Identify unmet market needs, competitive white spaces, and customer demand signals for new product opportunities.',
        documentIds: ['product-catalog', 'competitor-rates', 'complaints', 'nps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Market Gap & Opportunity Analysis.

Produce:

## 1. Current Product Portfolio Assessment
Gap analysis: What HDFC offers vs what the market demands.

## 2. Competitive White Spaces
Products/features offered by competitors but missing from HDFC.

## 3. Customer Demand Signals
From complaints and NPS — what are customers asking for that doesn't exist?

## 4. Opportunity Sizing
| Opportunity | Target Segment | Market Size | HDFC Readiness | Revenue Potential | Priority |

## 5. Product Concept Recommendation
Top 3 new product/scheme concepts with feature specifications.

Present as a Market Opportunity Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'regulatory-feasibility',
        title: 'Regulatory Feasibility & Compliance Design',
        department: 'compliance',
        departmentLabel: 'Compliance & Legal',
        description: 'Assess regulatory feasibility, design compliance framework, and identify approval requirements for the new product.',
        documentIds: ['reg-circulars', 'pmay', 'scheme'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Regulatory Feasibility & Compliance Design.

Produce:

## 1. Regulatory Feasibility Matrix
| Regulation | Applicable? | Requirement | Product Design Implication | Risk |

## 2. Compliance Framework
Design compliance requirements for the new product:
- KYC requirements
- LTV and FOIR limits
- Documentation standards
- Disclosure requirements

## 3. Approval Roadmap
Required approvals: Board / ALCO / Product Committee / RBI (if needed).

## 4. Risk Assessment
Regulatory risks of launching vs not launching.

Present as a Regulatory Feasibility Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'pricing-design',
        title: 'Pricing Strategy & Product Design',
        department: 'product',
        departmentLabel: 'Product & Pricing',
        description: 'Design pricing strategy, define product features, and create the product specification document.',
        documentIds: ['rate-history', 'competitor-rates', 'product-catalog'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Pricing Strategy & Product Design.

Produce:

## 1. Pricing Strategy
| Parameter | Proposed Value | Competitor Benchmark | Rationale |
Interest rate, processing fees, prepayment terms, insurance requirements.

## 2. Product Specification Sheet
Complete feature specification ready for product committee:
- Eligibility criteria (income, age, employment, geography)
- Loan parameters (amount range, tenure, LTV, FOIR)
- Pricing structure (base rate, margin, concessions)
- Security requirements
- Documentation requirements

## 3. Financial Projections
| Quarter | Expected Disbursements | Revenue | Costs | Net Margin |
12-month financial projection.

## 4. Cannibalization Analysis
Impact on existing product sales.

Present as a Product Specification & Pricing Document.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'launch-readiness',
        title: 'Launch Readiness & Go-to-Market',
        department: 'sales',
        departmentLabel: 'Sales & Service',
        description: 'Create sales enablement kit, service readiness checklist, branch preparation plan, and go-to-market timeline.',
        documentIds: ['branch-perf', 'product-catalog'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Launch Readiness & Go-to-Market.

Produce:

## 1. Sales Enablement Kit
- Product pitch deck outline (key slides)
- RM talking points and FAQs
- Customer persona targeting guide
- Objection handling scripts

## 2. Service Readiness Checklist
| Requirement | Status | Owner | Deadline |
Systems, training, documentation, customer communication.

## 3. Branch Launch Plan
- Pilot branch selection criteria and recommendations
- Branch staff training schedule
- Marketing material requirements
- Customer event/campaign plan

## 4. Go-to-Market Timeline
Week-by-week launch plan with milestones.

## 5. Launch KPIs
Success metrics for first 30/60/90 days.

Present as a Go-to-Market Launch Plan.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. BRANCH PERFORMANCE TURNAROUND ENGINE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'branch-turnaround',
    title: 'Branch Performance Turnaround',
    subtitle: 'Sales → Operations → Training → Product → Risk → Service',
    description: 'Identify underperforming branches, diagnose root causes across multiple dimensions, generate branch-specific turnaround playbooks with RM-level coaching plans and weekly milestones.',
    icon: '📈',
    gradient: 'from-orange-700 to-amber-600',
    borderColor: 'border-orange-300',
    departments: [
      { id: 'sales', label: 'Sales', icon: '📈', color: '#F59E0B' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'training', label: 'Training', icon: '📚', color: '#8B5CF6' },
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
      { id: 'risk', label: 'Risk', icon: '🛡️', color: '#EF4444' },
      { id: 'service', label: 'Service', icon: '🤝', color: '#EC4899' },
    ],
    documents: [
      { id: 'branch-perf', filename: 'branch_performance.csv', label: 'Branch Performance MIS', description: 'Branch-level performance metrics', path: '/sample-data/doc-intelligence/sales-distribution/branch_performance.csv', department: 'sales' },
      { id: 'rm-scorecard', filename: 'rm_scorecard.csv', label: 'RM Performance Scorecard', description: 'Individual RM performance data', path: '/sample-data/doc-intelligence/sales-distribution/rm_scorecard.csv', department: 'sales' },
      { id: 'lead-tracker', filename: 'lead_tracker.csv', label: 'Lead Tracker', description: 'Lead pipeline quality', path: '/sample-data/doc-intelligence/sales-distribution/lead_tracker.csv', department: 'sales' },
      { id: 'walkin-log', filename: 'branch_walkin_log.csv', label: 'Branch Walk-in Log', description: 'Walk-in conversion funnel', path: '/sample-data/doc-intelligence/service-ops/branch_walkin_log.csv', department: 'operations' },
      { id: 'disbursement-tracker', filename: 'disbursement_tracker.csv', label: 'Disbursement Tracker', description: 'Output metrics', path: '/sample-data/doc-intelligence/loan-origination/disbursement_tracker.csv', department: 'sales' },
      { id: 'competitor-rates', filename: 'competitor_rate_card.csv', label: 'Competitor Rate Card', description: 'Local competitive pressure', path: '/sample-data/doc-intelligence/sales-distribution/competitor_rate_card.csv', department: 'product' },
      { id: 'complaints', filename: 'customer_complaints.csv', label: 'Customer Complaints', description: 'Service drag on sales', path: '/sample-data/doc-intelligence/service-ops/customer_complaints.csv', department: 'service' },
      { id: 'nps', filename: 'nps_survey_results.csv', label: 'NPS Survey Results', description: 'Customer perception', path: '/sample-data/doc-intelligence/service-ops/nps_survey_results.csv', department: 'service' },
      { id: 'product-catalog', filename: 'product_catalog.csv', label: 'Product Catalog', description: 'Product availability', path: '/sample-data/doc-intelligence/product-mgmt/product_catalog.csv', department: 'product' },
    ],
    stages: [
      {
        id: 'performance-diagnosis',
        title: 'Performance Diagnosis & Benchmarking',
        department: 'sales',
        departmentLabel: 'Sales & Distribution',
        description: 'Identify underperforming branches, benchmark against peers, and diagnose performance gaps.',
        documentIds: ['branch-perf', 'rm-scorecard', 'disbursement-tracker'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Performance Diagnosis & Benchmarking.

Produce:

## 1. Branch Performance Ranking
| Rank | Branch | Logins | Sanctions | Disbursements | Conversion % | YoY Growth | Status |
Color-code: Green (above target) / Amber (at target) / Red (below target).

## 2. Underperformer Identification
Branches in bottom quartile with specific metrics lagging.

## 3. RM-Level Drill Down
For underperforming branches:
| RM | Leads | Logins | Conversions | Productivity Score | Gap vs Top Performer |

## 4. Peer Benchmarking
Compare underperformers against best-in-class branches — what's different?

## 5. Quick Diagnosis
For each underperformer — hypothesize top 3 reasons for underperformance.

Present as a Performance Diagnostic Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'root-cause-diagnosis',
        title: 'Root Cause Deep Dive',
        department: 'operations',
        departmentLabel: 'Operations & Service',
        description: 'Analyze walk-in patterns, lead quality, customer satisfaction, and competitive pressure to identify root causes.',
        documentIds: ['walkin-log', 'lead-tracker', 'complaints', 'nps'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Root Cause Deep Dive.

For underperforming branches, investigate:

## 1. Walk-in Analysis
- Walk-in volume vs conversion rate
- Purpose distribution (inquiry vs application vs service)
- Time spent per walk-in
- Referral source analysis

## 2. Lead Quality Assessment
- Lead source effectiveness
- Lead-to-login conversion by source
- Pipeline leakage points

## 3. Customer Experience Assessment
- Branch-specific NPS scores
- Complaint patterns
- Service-related friction points

## 4. Root Cause Matrix
| Branch | Root Cause | Evidence | Impact | Fixability |
Categorize: People / Process / Product / Competition / Market

## 5. Prioritized Action Items
For each underperformer — top 3 quick wins and top 3 structural fixes.

Present as a Root Cause Analysis Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'turnaround-playbook',
        title: 'Turnaround Playbook Generation',
        department: 'training',
        departmentLabel: 'Training & Development',
        description: 'Generate branch-specific turnaround playbooks with RM coaching plans, training needs, and competitive strategies.',
        documentIds: ['rm-scorecard', 'competitor-rates', 'product-catalog'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Turnaround Playbook Generation.

For each underperforming branch, produce a playbook:

## 1. Branch Turnaround Plan (per branch)
### Week 1-2: Quick Wins
- Specific actions for immediate results
- Low-hanging fruit opportunities
- RM re-deployment/re-assignment

### Week 3-4: Process Optimization
- Lead management improvements
- Walk-in conversion tactics
- Cross-sell activation

### Week 5-8: Structural Changes
- Training interventions
- Competitive counter-strategies
- Product mix optimization

## 2. RM Coaching Plan
| RM | Skill Gap | Coaching Focus | Action | Timeline | Mentor |

## 3. Competitive Counter-Strategy
Branch-specific competitive positioning based on local competitor strength.

## 4. Product Recommendation
Products to push based on local market demand.

## 5. Success Milestones
| Week | Metric | Target | Measurement Method |

Present as Branch Turnaround Playbooks.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'monitoring-framework',
        title: 'Monitoring Framework & Escalation',
        department: 'risk',
        departmentLabel: 'Risk & Monitoring',
        description: 'Design monitoring dashboards, define escalation triggers, and create weekly review cadence.',
        documentIds: ['branch-perf', 'rm-scorecard'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Monitoring Framework & Escalation.

Produce:

## 1. Weekly Monitoring Dashboard Design
| KPI | Source | Frequency | Target | Escalation Trigger |
Define metrics for daily/weekly tracking.

## 2. Escalation Framework
- Amber triggers (early warning of continued underperformance)
- Red triggers (intervention required)
- Escalation path: Branch Head → Area Head → Regional Head → National Head

## 3. Review Cadence
Weekly review meeting agenda with required data points.

## 4. Incentive Recommendations
Performance-linked incentives for turnaround achievement.

## 5. 90-Day Report Card Template
Structured format for quarterly turnaround assessment.

## 6. Executive Summary for Regional Head
Overall turnaround program status, progress, risks, and recommendations.

Present as a Turnaround Monitoring Framework.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 10. AUDIT FINDING TO REMEDIATION CLOSURE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'audit-remediation',
    title: 'Audit Finding to Remediation Closure',
    subtitle: 'Audit → Compliance → Operations → Risk → Legal → Product',
    description: 'Take audit findings, map to responsible departments, assess regulatory severity, generate remediation plans, create evidence checklists, and produce audit committee-ready status reports.',
    icon: '🔍',
    gradient: 'from-indigo-700 to-blue-600',
    borderColor: 'border-indigo-300',
    departments: [
      { id: 'audit', label: 'Audit', icon: '🔍', color: '#F59E0B' },
      { id: 'compliance', label: 'Compliance', icon: '✅', color: '#10B981' },
      { id: 'operations', label: 'Operations', icon: '⚙️', color: '#06B6D4' },
      { id: 'risk', label: 'Risk', icon: '🛡️', color: '#EF4444' },
      { id: 'legal', label: 'Legal', icon: '⚖️', color: '#6366F1' },
      { id: 'product', label: 'Product', icon: '🎯', color: '#3B82F6' },
    ],
    documents: [
      { id: 'audit-findings', filename: 'audit_findings.csv', label: 'Audit Findings', description: 'Internal/external audit observations', path: '/sample-data/doc-intelligence/compliance-risk/audit_findings.csv', department: 'audit' },
      { id: 'reg-circulars', filename: 'regulatory_circulars.csv', label: 'Regulatory Circulars', description: 'Applicable regulations', path: '/sample-data/doc-intelligence/compliance-risk/regulatory_circulars.csv', department: 'compliance' },
      { id: 'fraud-alerts', filename: 'fraud_alerts.csv', label: 'Fraud Alerts', description: 'Fraud-related findings', path: '/sample-data/doc-intelligence/compliance-risk/fraud_alerts.csv', department: 'risk' },
      { id: 'red-flags', filename: 'red_flag_samples.csv', label: 'Red Flag Samples', description: 'Control failure patterns', path: '/sample-data/doc-intelligence/compliance-risk/red_flag_samples.csv', department: 'risk' },
      { id: 'deviation-reg', filename: 'deviation_register.csv', label: 'Deviation Register', description: 'Deviation patterns', path: '/sample-data/doc-intelligence/credit-underwriting/deviation_register.csv', department: 'compliance' },
      { id: 'risk-portfolio', filename: 'risk_assessment_portfolio.csv', label: 'Portfolio Risk Assessment', description: 'Risk impact assessment', path: '/sample-data/doc-intelligence/compliance-risk/risk_assessment_portfolio.csv', department: 'risk' },
      { id: 'doc-checklist', filename: 'document_checklist.csv', label: 'Document Checklist', description: 'Documentation compliance', path: '/sample-data/doc-intelligence/loan-origination/document_checklist.csv', department: 'operations' },
    ],
    stages: [
      {
        id: 'finding-analysis',
        title: 'Audit Finding Analysis & Severity Rating',
        department: 'audit',
        departmentLabel: 'Internal Audit',
        description: 'Analyze all audit findings, rate severity, and map to responsible departments and processes.',
        documentIds: ['audit-findings', 'reg-circulars'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 1: Audit Finding Analysis & Severity Rating.

Produce:

## 1. Audit Finding Dashboard
| Finding ID | Area | Finding | Severity | Department | Regulatory Reference | Status |
Rate each: Critical / High / Medium / Low.

## 2. Thematic Grouping
Group findings into themes (documentation, process, compliance, technology, people).

## 3. Regulatory Mapping
Map each finding to applicable RBI/NHB regulation and assess penalty risk.

## 4. Repeat Finding Analysis
Identify findings that recur across audit cycles — these indicate systemic issues.

## 5. Department-Wise Allocation
| Department | Findings Count | Critical | High | Medium | Low |

Present as an Audit Intelligence Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'remediation-plan',
        title: 'Remediation Action Plan',
        department: 'compliance',
        departmentLabel: 'Compliance',
        description: 'Create specific, time-bound remediation plans for each finding with ownership and evidence requirements.',
        documentIds: ['audit-findings', 'deviation-reg', 'doc-checklist'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 2: Remediation Action Plan.

Produce:

## 1. Remediation Register
| Finding | Root Cause | Action Required | Owner | Deadline | Evidence Required | Status |

## 2. Priority Matrix
Prioritize by: Regulatory risk x Customer impact x Ease of fix.

## 3. Evidence Collection Checklist
For each remediation action — what evidence proves the fix is implemented.

## 4. Resource Requirements
People, technology, budget needed for remediation.

## 5. Dependency Mapping
Which remediations are interdependent and need coordinated execution.

Present as a Remediation Action Plan.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'risk-impact',
        title: 'Risk Impact & Control Enhancement',
        department: 'risk',
        departmentLabel: 'Risk Management',
        description: 'Assess risk impact of each finding, design enhanced controls, and update the risk register.',
        documentIds: ['risk-portfolio', 'fraud-alerts', 'red-flags'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 3: Risk Impact & Control Enhancement.

Produce:

## 1. Risk Impact Assessment
| Finding | Risk Dimension | Current Control | Gap | Enhanced Control | Risk Reduction |

## 2. Control Enhancement Recommendations
For each high-severity finding, design specific control improvements.

## 3. Risk Register Update
Updated risk register entries incorporating audit findings.

## 4. Fraud & Red Flag Correlation
Do audit findings correlate with any fraud alerts or red flag patterns?

## 5. Prevention Framework
Long-term control enhancements to prevent recurrence.

Present as a Risk Impact & Control Enhancement Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
      {
        id: 'committee-report',
        title: 'Audit Committee Status Report',
        department: 'audit',
        departmentLabel: 'Audit Committee',
        description: 'Generate board/audit committee-ready status report with remediation progress, risk status, and strategic recommendations.',
        documentIds: ['audit-findings', 'risk-portfolio'],
        systemPrompt: `You are an HDFC Retail Assets AI Agent performing Stage 4: Audit Committee Status Report.

Synthesize ALL prior stages into an audit committee-ready report:

## 1. Executive Summary
- Total findings: by severity
- Remediation progress: % closed, % in progress, % overdue
- Key risk areas requiring committee attention

## 2. Progress Dashboard
| Theme | Total Findings | Closed | In Progress | Overdue | Risk Level |

## 3. Overdue Items (Escalation Required)
Specific attention items for the committee.

## 4. Regulatory Risk Assessment
Current regulatory exposure from open findings.

## 5. Management Assurance
Areas where management can provide assurance of adequate controls.

## 6. Committee Recommendations
Specific actions the audit committee should direct.

## 7. Next Audit Cycle Focus Areas
Recommended areas for the next audit cycle based on current findings.

Present as an Audit Committee Status Report.
IMPORTANT: All data is SYNTHETIC.`,
      },
    ],
  },
];

// ─── Helper Functions ───

export function getProcessById(id: string): ProcessApp | undefined {
  return PROCESS_APPS.find(p => p.id === id);
}

export function getAllProcessIds(): string[] {
  return PROCESS_APPS.map(p => p.id);
}
