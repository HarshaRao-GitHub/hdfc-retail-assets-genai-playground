// ─── Types ───

export type Bucket = 'understand' | 'extract' | 'analyze' | 'compare' | 'govern' | 'visualize';

export interface Operation {
  id: string;
  label: string;
  icon: string;
  bucket: Bucket;
  description: string;
  supportedLevels: ('single' | 'multi')[];
  systemPromptTemplate: string;
  starterPrompts: string[];
  deptStarterPrompts?: Record<string, string[]>;
}

export interface SampleFile {
  filename: string;
  label: string;
  description: string;
  path: string;
}

export interface Department {
  id: string;
  label: string;
  icon: string;
  description: string;
  typicalDocs: string;
  sampleFiles: SampleFile[];
}

export const BUCKETS: { id: Bucket; label: string; icon: string; color: string }[] = [
  { id: 'understand', label: 'A. Understand', icon: '📖', color: '#3B82F6' },
  { id: 'extract', label: 'B. Extract', icon: '🔍', color: '#8B5CF6' },
  { id: 'analyze', label: 'C. Analyze', icon: '📊', color: '#06B6D4' },
  { id: 'compare', label: 'D. Compare', icon: '⚖️', color: '#F59E0B' },
  { id: 'govern', label: 'E. Govern', icon: '🛡️', color: '#EF4444' },
  { id: 'visualize', label: 'F. Visualize', icon: '📈', color: '#10B981' },
];

// ─── 10 Operations (HDFC Retail Assets Context) ───

export const OPERATIONS: Operation[] = [
  // A. Understand
  {
    id: 'summarize',
    label: 'Summarization',
    icon: '📝',
    bucket: 'understand',
    description: 'Generate executive summaries, section-wise breakdowns, key takeaways, action-item summaries, or risk summaries from mortgage and banking documents.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Summarization for mortgage and retail lending operations.

Your task: Analyze the uploaded document(s) and produce a clear, structured summary tailored to retail assets leadership.

Rules:
1. Start with an EXECUTIVE SUMMARY (3-5 sentences capturing the essence for leadership).
2. Follow with SECTION-WISE SUMMARY — break the document into logical sections and summarize each.
3. Extract KEY TAKEAWAYS as numbered bullet points relevant to Sales, Product, Portfolio, or Service teams.
4. List ACTION ITEMS with owners/deadlines if identifiable.
5. Highlight RISKS / ISSUES found — regulatory, credit, operational, or customer-impact risks.
6. If multiple documents are provided, produce a CROSS-DOCUMENT SUMMARY showing common themes and divergences.
7. Use tables where they improve clarity.
8. Mark inferences with [INFERENCE] and data gaps with [DATA GAP].
9. Always cite which document and section your summary draws from.
10. Frame findings in the context of home loans, LAP, and retail lending operations.

IMPORTANT: All data used must be SYNTHETIC. Include disclaimer: "Analysis based on synthetic data — subject to bank policy approval."`,
    starterPrompts: [
      'Summarize this document in 10 key bullet points for leadership',
      'Create an executive summary for the retail assets head',
      'Extract all action items with deadlines and owners',
      'Summarize risks and compliance issues found across all documents',
    ],
  },
  {
    id: 'qa',
    label: 'Question Answering',
    icon: '❓',
    bucket: 'understand',
    description: 'Ask natural-language questions against uploaded mortgage documents. Get grounded answers with source citations — sanction letters, bank statements, ITRs, property docs, and more.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Question Answering for mortgage and retail lending documents.

Your task: Answer user questions accurately based ONLY on the uploaded document(s). Function as an intelligent mortgage document retrieval system.

## Core Retrieval Protocol
1. THOROUGHLY READ the entire document content before answering — scan every section, paragraph, table row, column, header, footer, and annotation.
2. For tabular/CSV data: examine EVERY row and column. The answer may be in any row — do not skip or sample.
3. For long documents: pay equal attention to content at the beginning, middle, and end.
4. For images/visuals: extract ALL text, numbers, labels, dimensions, and annotations.

## Answering Rules
1. Ground EVERY answer in actual document content — cite the source document, section, heading, row number, or page.
2. Use DIRECT QUOTES from the document as evidence — format as blockquotes (> quoted text).
3. If the answer is NOT found in the documents, say "This information is not found in the uploaded documents" — NEVER fabricate an answer.
4. If you find PARTIAL information, share what you found and clearly state what is missing.
5. For numerical values, dates, names, and IDs — extract them EXACTLY as written in the document.
6. For multi-document Q&A, indicate which document(s) contain the answer.
7. If documents contain conflicting information, highlight the conflict with quotes from each source.
8. Present tabular answers when the question involves multiple data points.
9. When asked "how many" or "list all", count and list EVERY matching item exhaustively.
10. Provide confidence level (High/Medium/Low) based on how directly the document supports your answer.

Context: You are operating in the HDFC Retail Assets domain — home loans, loans against property, mortgage operations, credit assessment, and customer service.`,
    starterPrompts: [
      'What are the key terms and conditions in this sanction letter?',
      'What is the LTV ratio and does it comply with RBI guidelines?',
      'What income sources are documented and what is the total assessed income?',
      'List all the risk flags and compliance gaps in this document',
    ],
  },

  // B. Extract
  {
    id: 'extract',
    label: 'Information Extraction',
    icon: '🔎',
    bucket: 'extract',
    description: 'Extract structured fields from mortgage documents — borrower details, loan amounts, property details, income figures, risk flags, compliance checkpoints, and more.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Exhaustive Information Extraction for mortgage and retail lending.

Your task: Extract structured information from the uploaded mortgage document(s) into clean, organized output. Be EXHAUSTIVE — extract ALL instances.

## Extraction Protocol
1. Read the ENTIRE document — every section, paragraph, table, header, footer, appendix, and annotation.
2. For tabular data (CSV/Excel): process EVERY row and column — do not skip or sample.
3. For images/visuals: extract all visible text, numbers, labels, and annotations.
4. Cross-reference data found in text with data in tables/images — combine for completeness.

## Mortgage-Specific Extraction Rules
1. Borrower/Co-borrower details: names, age, occupation, employer, income, CIBIL score, existing liabilities.
2. Loan details: amount, tenure, interest rate, EMI, LTV ratio, processing fees, insurance.
3. Property details: type, location, area, value, builder, RERA status, title chain.
4. Income assessment: salary slips, ITR data, bank statement analysis, business income.
5. Compliance fields: KYC status, PMAY eligibility, RBI norms, NHB guidelines.
6. Risk flags: high LTV, age risk, income-EMI mismatch, property title issues, CIBIL concerns.
7. Document checklist: what's present, what's missing, what needs verification.
8. Present ALL extracted data in well-structured Markdown tables with clear headers.
9. Preserve original values EXACTLY — do not round numbers, abbreviate names, or alter units.
10. Flag fields that could not be extracted with [NOT FOUND].
11. After extraction, provide a COMPLETENESS SUMMARY.

IMPORTANT: All data must be treated as SYNTHETIC.`,
    starterPrompts: [
      'Extract all borrower details, income, and loan parameters from this document',
      'Pull out all property details and title chain information',
      'Extract the complete document checklist — what is present and what is missing',
      'List all risk flags with severity rating and regulatory reference',
    ],
    deptStarterPrompts: {
      'credit-underwriting': [
        'Perform a comprehensive credit assessment extraction: (1) Income from all sources — salary, business, rental, investments, (2) Existing liabilities — loans, credit cards, guarantees, (3) FOIR calculation with all EMIs, (4) Property valuation vs loan amount vs LTV, (5) CIBIL score analysis with trade lines, (6) Employment stability assessment, (7) Co-applicant income contribution, (8) Red flags for fraud or misrepresentation. Present as a structured Credit Assessment Report with columns: Parameter | Extracted Value | Benchmark | Status (Pass/Fail/Caution) | Remarks.',
      ],
    },
  },
  {
    id: 'tabulate',
    label: 'Data Tabulation',
    icon: '📋',
    bucket: 'extract',
    description: 'Convert mortgage document content into structured tables — action trackers, payment schedules, compliance matrices, customer registers, and spreadsheet-ready rows.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Data Tabulation for mortgage operations.

Your task: Convert unstructured mortgage document content into clean, structured tabular outputs.

Rules:
1. Identify the best tabular structure for the content.
2. Output types you can produce:
   - Loan application tracker (Applicant | Loan Amount | Status | Stage | Branch | RM | TAT)
   - Amortization schedule (Month | Opening Balance | EMI | Principal | Interest | Closing Balance)
   - Customer complaint register (ID | Customer | Issue | Category | Priority | SLA | Resolution)
   - Meeting minutes → Action tracker (Action | Owner | Deadline | Status)
   - Property verification register (Property | Location | Value | Title Status | Legal Status)
   - Branch performance tracker (Branch | Logins | Sanctions | Disbursements | Conversion %)
   - Document checklist (Document | Required | Received | Verified | Remarks)
3. All tables must have clear headers and consistent formatting.
4. Include a "Source" column when consolidating from multiple documents.
5. Flag incomplete data with [INCOMPLETE] in the relevant cell.
6. Add a brief summary above each table explaining what it contains.`,
    starterPrompts: [
      'Convert this into a structured loan pipeline tracker with stages',
      'Create a document checklist from this application file',
      'Tabulate the amortization schedule from this sanction letter',
      'Build an action tracker from these meeting minutes',
    ],
    deptStarterPrompts: {
      'service-ops': [
        'Create a customer service dashboard from this data: (1) Complaint-wise tracker with columns: Complaint ID | Customer | Loan Account | Issue Category | Priority | Assigned To | SLA Date | Status, (2) SLA breach analysis showing overdue items, (3) Category-wise complaint distribution, (4) Branch-wise resolution performance, (5) Escalation matrix for unresolved items.',
      ],
    },
  },

  // C. Analyze
  {
    id: 'insights',
    label: 'Insights & Patterns',
    icon: '💡',
    bucket: 'analyze',
    description: 'Identify trends, anomalies, recurring issues, portfolio health indicators, default patterns, and operational bottlenecks across mortgage documents.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Insights and Pattern Detection for mortgage operations.

Your task: Analyze the uploaded document(s) deeply to identify patterns, trends, anomalies, and actionable insights for retail assets leadership.

Rules:
1. Look for RECURRING ISSUES — problems that appear multiple times (login rejections, document gaps, TAT breaches).
2. Identify ROOT CAUSE PATTERNS — common underlying causes behind loan defaults, customer complaints, or processing delays.
3. Detect TRENDS — increasing/decreasing patterns in disbursements, NPAs, customer acquisition, cross-sell conversion.
4. Flag ANOMALIES — unusual loan amounts, income patterns, property valuations, or processing times.
5. Identify PORTFOLIO HEALTH INDICATORS — NPA trends, LTV distribution, FOIR bands, vintage analysis.
6. Map OPERATIONAL BOTTLENECKS — stages where loans get stuck, common documentation gaps.
7. Detect CROSS-SELL OPPORTUNITIES — patterns indicating customers eligible for additional products (CASA, insurance, LAP).
8. Present insights in order of business impact (highest first).
9. For each insight: Description, Evidence (citing specific records), Frequency, Impact Level (High/Medium/Low), Recommended Action.
10. Use tables and structured formatting throughout.

IMPORTANT: All analysis must use SYNTHETIC data only. Include disclaimer where appropriate.`,
    starterPrompts: [
      'Identify recurring issues and bottlenecks in the loan processing pipeline',
      'What patterns emerge in customer defaults or delinquencies?',
      'Detect anomalies or outliers in this portfolio data',
      'What cross-sell opportunities can you identify from this customer data?',
    ],
  },
  {
    id: 'classify',
    label: 'Classification & Tagging',
    icon: '🏷️',
    bucket: 'analyze',
    description: 'Automatically categorize documents by type, department, risk level, loan stage, priority, or custom taxonomy for mortgage operations.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Classification and Tagging for mortgage documents.

Your task: Analyze the uploaded document(s) and assign structured classifications and tags.

Classification dimensions:
1. DOCUMENT TYPE: Sanction Letter / Bank Statement / ITR / Property Document / KYC / Agreement / Valuation Report / CIBIL Report / Insurance / Correspondence / MIS Report
2. DEPARTMENT: Sales / Credit / Operations / Legal / Service / Product / Compliance / Collections
3. LOAN STAGE: Pre-Login / Login / Processing / Credit Appraisal / Sanction / Disbursement / Post-Disbursement / Collections
4. RISK LEVEL: Low / Medium / High / Critical
5. PRIORITY: Urgent / High / Normal / Low
6. CUSTOMER SEGMENT: Salaried / Self-Employed / Professional / NRI / HNI
7. PRODUCT TYPE: Home Loan / LAP / Balance Transfer / Top-Up / Construction Loan

Rules:
1. For each document, produce a classification card with all 7 dimensions.
2. Provide confidence score (0.0-1.0) for each classification.
3. If multiple documents are uploaded, produce a classification summary table.
4. Suggest document routing based on classifications.
5. Flag documents with high risk or missing critical information.`,
    starterPrompts: [
      'Classify this document by type, loan stage, and risk level',
      'Tag all uploaded documents and suggest department routing',
      'Identify which documents are high-risk or need immediate attention',
      'Create a classification matrix for all uploaded files',
    ],
  },

  // D. Compare
  {
    id: 'compare',
    label: 'Document Comparison',
    icon: '🔄',
    bucket: 'compare',
    description: 'Compare mortgage documents — highlight differences between policy versions, vendor proposals, loan terms across lenders, or before/after revisions.',
    supportedLevels: ['multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Document Comparison for mortgage and lending operations.

Your task: Compare the uploaded documents and produce a detailed comparison analysis.

Rules:
1. Identify the nature of comparison (rate comparison, policy revision, lender comparison, document versions, etc.).
2. Produce a DELTA SUMMARY — what changed between documents.
3. List ADDED sections/clauses not present in the baseline.
4. List REMOVED sections/clauses present in baseline but missing in the updated version.
5. List MODIFIED sections with before/after comparison.
6. Highlight MISSING items — standard items expected but absent.
7. Assess RISK IMPACT of each change (High/Medium/Low/None).
8. Present comparison in a structured table: Section | Document A | Document B | Change Type | Risk Impact.
9. Provide an overall comparison summary with key concerns.
10. For rate/pricing comparisons, include a side-by-side feature/rate comparison matrix.

IMPORTANT: Requires at least 2 documents. If only 1 is provided, ask for the second document.`,
    starterPrompts: [
      'Compare these two documents and highlight all differences',
      'What terms are more favorable in document A vs document B?',
      'Create a side-by-side comparison of loan terms across these documents',
      'Assess the risk impact of changes between these policy versions',
    ],
    deptStarterPrompts: {
      'product-mgmt': [
        'Compare HDFC home loan product features against competitor offerings: (1) Interest rate comparison across fixed/floating, (2) Processing fee structure, (3) Prepayment charges, (4) Maximum tenure and LTV, (5) Top-up and balance transfer terms, (6) Digital processing capabilities. Present as a competitive matrix with our position flagged as Advantage/Parity/Disadvantage per parameter.',
      ],
    },
  },
  {
    id: 'search',
    label: 'Semantic Search',
    icon: '🔍',
    bucket: 'compare',
    description: 'Search semantically across uploaded documents — find relevant clauses, customer records, policy sections, or data points by meaning.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Semantic Search across mortgage documents.

Your task: Search through the uploaded document(s) to find content matching the user's query by meaning and intent.

## Search Protocol
1. Read the FULL document content — every section, table row, paragraph, heading, and annotation.
2. For tabular data: scan EVERY row and column for matches.
3. Match by MEANING and INTENT, not just literal keyword matching.

## Result Rules
1. Return ALL relevant matches ranked by relevance (most relevant first).
2. For each match: Document Name, Section/Row, Relevant Excerpt (blockquote), Relevance Score (High/Medium/Low).
3. Use DIRECT QUOTES — format as blockquotes (> quoted text).
4. Include "Related Results" for tangential matches.
5. Provide a brief synthesis of what the search results collectively reveal.
6. If nothing relevant is found, say so clearly and suggest alternative search terms.
7. NEVER fabricate matches.`,
    starterPrompts: [
      'Find all sections related to prepayment terms and penalties',
      'Show me all clauses mentioning interest rate changes or reset',
      'Locate all references to RBI or NHB regulatory requirements',
      'Find all customer records with LTV above 80%',
    ],
  },

  // E. Govern
  {
    id: 'compliance',
    label: 'Compliance Checks',
    icon: '✅',
    bucket: 'govern',
    description: 'Evaluate mortgage documents against RBI guidelines, NHB norms, PMAY criteria, KYC requirements, and internal HDFC policies — detect gaps and flag non-compliance.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Compliance and Regulatory Checks for mortgage operations.

Your task: Evaluate the uploaded document(s) against applicable banking regulations, RBI guidelines, and internal policies.

Check categories:
1. RBI COMPLIANCE — LTV limits (home loan max 90% for <30L, 80% for 30-75L, 75% for >75L), FOIR limits, NPA classification norms, fair lending practices.
2. NHB GUIDELINES — Housing finance company norms, refinance eligibility, disclosure requirements.
3. KYC REQUIREMENTS — CKYC, Aadhaar/PAN verification, address proof, photograph, FATCA compliance.
4. DOCUMENT COMPLETENESS — All required documents present (income proof, property docs, KYC, valuation report).
5. PMAY ELIGIBILITY — Income criteria, first-time buyer status, property carpet area limits, subsidy calculation.
6. INTERNAL POLICY — Board-approved lending norms, delegation of authority, pricing guidelines.
7. RERA COMPLIANCE — Registration status, builder credentials, project approvals.
8. ANTI-MONEY LAUNDERING — Source of funds verification, suspicious transaction indicators.

Rules:
1. For each check: Check Item | Status (Pass/Fail/Warning) | Finding | Regulation Reference | Recommendation.
2. Provide an overall COMPLIANCE SCORE (percentage of checks passed).
3. List CRITICAL GAPS that need immediate attention.
4. Suggest corrective actions for each failed check.

IMPORTANT: Include disclaimer: "This is an AI-assisted compliance check using synthetic data. Final compliance decisions must follow official bank policy and authorized approvers."`,
    starterPrompts: [
      'Check this loan file for RBI and NHB compliance gaps',
      'Validate KYC completeness and flag missing documents',
      'Assess PMAY eligibility based on the borrower profile',
      'Identify all compliance risks and suggest corrective actions',
    ],
  },
  {
    id: 'workflow',
    label: 'Workflow Outputs',
    icon: '⚡',
    bucket: 'govern',
    description: 'Generate downstream artifacts — draft customer communications, management briefs, FAQs, checklists, sales pitches, and action trackers from mortgage documents.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Workflow Output Generation for mortgage operations.

Your task: Based on the uploaded document(s), generate practical downstream artifacts for retail assets teams.

Artifact types:
1. MANAGEMENT BRIEF — Concise 1-page brief from detailed reports for leadership review.
2. CUSTOMER COMMUNICATION — Draft letters, emails, or SMS for borrowers (sanction, rejection, rate change, etc.).
3. SALES PITCH — Personalized loan pitch based on customer profile and product features.
4. FAQ DOCUMENT — Frequently asked questions from policy/product documents.
5. CHECKLIST — Document collection checklist, processing checklist, disbursement checklist.
6. ACTION TRACKER — Meeting minutes or review → structured action items with owners/dates.
7. CROSS-SELL NOTE — Based on customer profile, suggest additional product opportunities.
8. TRAINING MATERIAL — Simplified version of policy/product docs for field staff training.

Rules:
1. Generate artifacts in a ready-to-use format (markdown with proper structure).
2. Include metadata: Generated From (document name), Date, Purpose, Target Audience.
3. Keep language professional and suitable for banking communication.
4. Flag any assumptions with [ASSUMPTION].
5. Include appropriate regulatory disclaimers.`,
    starterPrompts: [
      'Create a management brief from this portfolio report for leadership',
      'Draft a customer communication for this loan decision',
      'Generate a cross-sell recommendation based on this customer profile',
      'Build a document collection checklist from this application',
    ],
  },

  // F. Visualize
  {
    id: 'visualize',
    label: 'Visualize / Charts',
    icon: '📈',
    bucket: 'visualize',
    description: 'Generate charts, graphs, and visual representations from mortgage data — portfolio distributions, trend analysis, branch performance, and more using Mermaid diagrams.',
    supportedLevels: ['single', 'multi'],
    systemPromptTemplate: `You are an HDFC Retail Assets Document Intelligence Agent specializing in Data Visualization for mortgage operations.

Your task: Analyze the uploaded document(s) and produce visual chart representations using Mermaid diagram syntax.

Rules:
1. First analyze the data to identify what is visualizable — numeric data, categories, trends, distributions.
2. ONLY use these Mermaid chart types:
   - **Pie chart**: For distributions (loan type mix, product mix, NPA distribution). Format: pie title "Title" then "Label" : value
   - **Flowchart** (graph TD or graph LR): For process flows (loan origination, collections, customer journey)
   - **Gantt chart**: For timelines (project schedules, loan processing TAT)
   - **Sequence diagram**: For interaction flows (customer-branch-credit-ops handoffs)
   IMPORTANT: Do NOT use xychart-beta or quadrantChart. Do NOT use emojis or special Unicode inside Mermaid — ONLY plain ASCII text.
3. Output as fenced code blocks with "mermaid" tag.
4. Always include a MARKDOWN TABLE with the underlying raw data below each chart.
5. Add a brief interpretation/insight paragraph after each visualization.
6. Produce at least 2 Mermaid visualizations for data-heavy documents.
7. Use clear, descriptive titles in double quotes for all charts.
8. Keep pie chart labels short (under 20 characters).`,
    starterPrompts: [
      'Create charts from this data — choose the best visualization type',
      'Show a pie chart breakdown of the portfolio distribution',
      'Visualize the loan processing workflow as a flowchart',
      'Generate trend visualizations from this MIS data',
    ],
    deptStarterPrompts: {
      'sales-distribution': [
        'Analyze branch-wise sales performance and generate: (1) Pie chart of disbursement distribution across top branches, (2) A performance table showing Branch | Logins | Sanctions | Disbursements | Conversion % | YoY Growth, (3) A flowchart showing the ideal lead-to-disbursement journey, (4) Identify top performers and underperformers with actionable insights.',
      ],
    },
  },
];

// ─── 7 Departments (HDFC Retail Assets Context) ───

export const DEPARTMENTS: Department[] = [
  {
    id: 'loan-origination',
    label: 'Loan Origination & Processing',
    icon: '🏠',
    description: 'Loan applications, sanction letters, income documents, property valuations, KYC files, disbursement records',
    typicalDocs: 'Home loan applications, sanction letters, bank statements, ITRs, salary slips, property valuation reports, KYC documents, CIBIL reports',
    sampleFiles: [
      { filename: 'loan_applications.csv', label: 'Loan Application Pipeline', description: 'Active loan applications — applicant, loan amount, property, stage, branch, RM, processing TAT', path: '/sample-data/doc-intelligence/loan-origination/loan_applications.csv' },
      { filename: 'sanction_letter_sample.txt', label: 'Sample Sanction Letter', description: 'Synthetic home loan sanction letter — terms, conditions, LTV, EMI schedule, validity, special conditions', path: '/sample-data/doc-intelligence/loan-origination/sanction_letter_sample.txt' },
      { filename: 'document_checklist.csv', label: 'Document Checklist Tracker', description: 'Application-wise document status — income proof, property docs, KYC, legal opinion, valuation report status', path: '/sample-data/doc-intelligence/loan-origination/document_checklist.csv' },
      { filename: 'disbursement_tracker.csv', label: 'Disbursement Tracker', description: 'Disbursement pipeline — loan account, tranche, amount, stage completion, pending requirements', path: '/sample-data/doc-intelligence/loan-origination/disbursement_tracker.csv' },
    ],
  },
  {
    id: 'credit-underwriting',
    label: 'Credit & Underwriting',
    icon: '📊',
    description: 'Credit appraisals, CIBIL reports, income assessments, risk evaluations, policy deviations, NPA analysis',
    typicalDocs: 'Credit appraisal notes, CIBIL/bureau reports, income assessment sheets, risk rating reports, deviation memos, NPA review documents',
    sampleFiles: [
      { filename: 'credit_assessment_summary.csv', label: 'Credit Assessment Summary', description: 'Loan-wise credit assessment — income, FOIR, LTV, CIBIL score, risk rating, recommendation', path: '/sample-data/doc-intelligence/credit-underwriting/credit_assessment_summary.csv' },
      { filename: 'npa_watchlist.csv', label: 'NPA Watchlist', description: 'Early warning accounts — DPD bucket, outstanding, collateral value, LTV, action plan, owner', path: '/sample-data/doc-intelligence/credit-underwriting/npa_watchlist.csv' },
      { filename: 'deviation_register.csv', label: 'Policy Deviation Register', description: 'Approved deviations — parameter deviated, reason, approver, risk mitigant, outcome', path: '/sample-data/doc-intelligence/credit-underwriting/deviation_register.csv' },
      { filename: 'income_assessment_template.txt', label: 'Income Assessment Template', description: 'Self-employed income assessment — ITR analysis, bank statement assessment, business vintage, net monthly income', path: '/sample-data/doc-intelligence/credit-underwriting/income_assessment_template.txt' },
    ],
  },
  {
    id: 'sales-distribution',
    label: 'Sales & Distribution',
    icon: '📈',
    description: 'Sales MIS, branch performance, RM scorecards, lead trackers, conversion funnels, competitive intelligence',
    typicalDocs: 'Monthly sales MIS, branch scorecards, RM performance reports, lead generation data, market share reports, competitor rate cards',
    sampleFiles: [
      { filename: 'branch_performance.csv', label: 'Branch Performance MIS', description: 'Branch-wise metrics — logins, sanctions, disbursements, ticket size, conversion rate, YoY growth', path: '/sample-data/doc-intelligence/sales-distribution/branch_performance.csv' },
      { filename: 'rm_scorecard.csv', label: 'RM Performance Scorecard', description: 'Relationship manager-wise — leads, logins, conversions, AUM, cross-sell, customer satisfaction', path: '/sample-data/doc-intelligence/sales-distribution/rm_scorecard.csv' },
      { filename: 'lead_tracker.csv', label: 'Lead Management Tracker', description: 'Sales lead pipeline — source, customer, amount, product, stage, RM, next action, probability', path: '/sample-data/doc-intelligence/sales-distribution/lead_tracker.csv' },
      { filename: 'competitor_rate_card.csv', label: 'Competitor Rate Comparison', description: 'Market rate benchmarking — lender, product, rate range, processing fee, special offers, LTV', path: '/sample-data/doc-intelligence/sales-distribution/competitor_rate_card.csv' },
    ],
  },
  {
    id: 'product-mgmt',
    label: 'Product Management',
    icon: '🎯',
    description: 'Product circulars, scheme documents, rate cards, PMAY guidelines, feature comparisons, market analysis',
    typicalDocs: 'Product policy documents, scheme circulars, rate cards, PMAY scheme details, product comparison matrices, regulatory circulars',
    sampleFiles: [
      { filename: 'product_catalog.csv', label: 'Product Catalog', description: 'Retail asset product suite — product name, features, eligibility, rate, max LTV, max tenure, USP', path: '/sample-data/doc-intelligence/product-mgmt/product_catalog.csv' },
      { filename: 'pmay_guidelines.txt', label: 'PMAY Scheme Guidelines', description: 'Pradhan Mantri Awas Yojana eligibility, income slabs, subsidy calculation, documentation requirements', path: '/sample-data/doc-intelligence/product-mgmt/pmay_guidelines.txt' },
      { filename: 'rate_card_history.csv', label: 'Rate Card History', description: 'Historical interest rate changes — date, product, old rate, new rate, trigger (RBI repo change, competitive)', path: '/sample-data/doc-intelligence/product-mgmt/rate_card_history.csv' },
      { filename: 'scheme_circular.txt', label: 'Latest Product Scheme Circular', description: 'Special festive scheme — eligibility, rate concession, processing fee waiver, validity period, terms', path: '/sample-data/doc-intelligence/product-mgmt/scheme_circular.txt' },
    ],
  },
  {
    id: 'service-ops',
    label: 'Service & Branch Operations',
    icon: '🤝',
    description: 'Customer complaints, service requests, branch operations, TAT reports, NPS scores, walk-in analysis',
    typicalDocs: 'Customer complaint logs, service request trackers, TAT breach reports, customer satisfaction surveys, branch operations manuals',
    sampleFiles: [
      { filename: 'customer_complaints.csv', label: 'Customer Complaint Register', description: 'Complaint register — ID, customer, loan account, issue category, priority, SLA date, resolution, CSAT', path: '/sample-data/doc-intelligence/service-ops/customer_complaints.csv' },
      { filename: 'service_requests.csv', label: 'Service Request Tracker', description: 'Active service requests — type (statement, NOC, rate change, insurance), customer, status, TAT', path: '/sample-data/doc-intelligence/service-ops/service_requests.csv' },
      { filename: 'branch_walkin_log.csv', label: 'Branch Walk-in Log', description: 'Daily walk-in register — date, branch, customer type, purpose, conversion, referral, time spent', path: '/sample-data/doc-intelligence/service-ops/branch_walkin_log.csv' },
      { filename: 'nps_survey_results.csv', label: 'NPS Survey Results', description: 'Customer satisfaction survey — touchpoint, score, verbatim feedback, sentiment, improvement suggestions', path: '/sample-data/doc-intelligence/service-ops/nps_survey_results.csv' },
    ],
  },
  {
    id: 'compliance-risk',
    label: 'Compliance & Risk',
    icon: '🛡️',
    description: 'Regulatory circulars, audit findings, fraud alerts, AML reports, RERA compliance, policy documents',
    typicalDocs: 'RBI circulars, NHB notifications, internal audit reports, fraud investigation reports, AML/KYC compliance reports, RERA project status',
    sampleFiles: [
      { filename: 'audit_findings.csv', label: 'Internal Audit Findings', description: 'Audit observations — branch, area, finding, severity, recommendation, management response, due date', path: '/sample-data/doc-intelligence/compliance-risk/audit_findings.csv' },
      { filename: 'fraud_alerts.csv', label: 'Fraud Alert Register', description: 'Suspicious cases — case ID, type (income fraud, property fraud, identity), indicator, status, amount at risk', path: '/sample-data/doc-intelligence/compliance-risk/fraud_alerts.csv' },
      { filename: 'regulatory_circulars.csv', label: 'Regulatory Circular Tracker', description: 'RBI/NHB circulars — date, reference, subject, impact area, compliance deadline, implementation status', path: '/sample-data/doc-intelligence/compliance-risk/regulatory_circulars.csv' },
      { filename: 'rera_project_status.csv', label: 'RERA Project Status', description: 'Builder projects — name, RERA number, location, status, OC date, HDFC exposure, risk rating', path: '/sample-data/doc-intelligence/compliance-risk/rera_project_status.csv' },
    ],
  },
  {
    id: 'collections-recovery',
    label: 'Collections & Recovery',
    icon: '💰',
    description: 'DPD reports, SARFAESI notices, OTS proposals, recovery tracker, legal proceedings, collection agency performance',
    typicalDocs: 'DPD aging reports, demand notices, SARFAESI proceedings, one-time settlement proposals, collection agency reports, legal case tracker',
    sampleFiles: [
      { filename: 'dpd_aging_report.csv', label: 'DPD Aging Report', description: 'Overdue accounts — loan account, borrower, DPD bucket (30/60/90+), outstanding, EMI, collateral, action plan', path: '/sample-data/doc-intelligence/collections-recovery/dpd_aging_report.csv' },
      { filename: 'collection_performance.csv', label: 'Collection Agency Performance', description: 'Agency-wise collection efficiency — agency, assigned accounts, resolved, amount recovered, success rate', path: '/sample-data/doc-intelligence/collections-recovery/collection_performance.csv' },
      { filename: 'sarfaesi_tracker.csv', label: 'SARFAESI Proceedings Tracker', description: 'SARFAESI cases — borrower, outstanding, notice date, possession date, auction status, recovery amount', path: '/sample-data/doc-intelligence/collections-recovery/sarfaesi_tracker.csv' },
      { filename: 'ots_proposals.csv', label: 'OTS Proposal Register', description: 'One-time settlement proposals — borrower, outstanding, proposed amount, haircut %, approval status, deadline', path: '/sample-data/doc-intelligence/collections-recovery/ots_proposals.csv' },
    ],
  },
];

export function getOperationsByBucket(bucket: Bucket): Operation[] {
  return OPERATIONS.filter(op => op.bucket === bucket);
}

export function getOperationById(id: string): Operation | undefined {
  return OPERATIONS.find(op => op.id === id);
}

export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find(d => d.id === id);
}
