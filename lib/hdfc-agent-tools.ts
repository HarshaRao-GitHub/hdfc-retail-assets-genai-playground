import type Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

// ─── CSV Loader (HDFC-specific, reads from /public/sample-data/doc-intelligence/) ───

interface CsvData {
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
  file: string;
}

const csvCache = new Map<string, { data: CsvData; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function resolveHdfcDataFile(folder: string, file: string): string {
  const basePath = path.resolve(process.cwd(), 'public', 'sample-data', 'doc-intelligence', folder, file);
  if (existsSync(basePath)) return basePath;
  throw new Error(`HDFC data file not found: doc-intelligence/${folder}/${file}`);
}

export function loadHdfcCsv(folder: string, file: string): CsvData {
  const cacheKey = `hdfc:${folder}/${file}`;
  const cached = csvCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const filePath = resolveHdfcDataFile(folder, file);
  const raw = readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    const empty = { headers: [], rows: [], rowCount: 0, file };
    csvCache.set(cacheKey, { data: empty, ts: Date.now() });
    return empty;
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record: Record<string, string> = {};
    headers.forEach((h, i) => { record[h] = values[i] ?? ''; });
    return record;
  });

  const result = { headers, rows, rowCount: rows.length, file };
  csvCache.set(cacheKey, { data: result, ts: Date.now() });
  return result;
}

export function loadHdfcTextFile(folder: string, file: string): string {
  const filePath = resolveHdfcDataFile(folder, file);
  return readFileSync(filePath, 'utf-8');
}

// ─── Tool Names ───

export type HdfcToolName =
  | 'scan_market_signals' | 'analyze_competitors' | 'score_leads'
  | 'assess_eligibility' | 'verify_documents' | 'check_pmay'
  | 'validate_income' | 'calculate_foir_ltv' | 'assess_risk_rating'
  | 'verify_rera_status' | 'check_title_chain' | 'assess_property_risk'
  | 'check_rbi_compliance' | 'scan_red_flags' | 'detect_fraud'
  | 'generate_sanction_recommendation' | 'check_disbursement_readiness' | 'verify_pre_disbursement'
  | 'monitor_npa_watchlist' | 'assess_portfolio_risk' | 'generate_early_warnings'
  | 'analyze_dpd_aging' | 'evaluate_collection_performance' | 'assess_recovery_options'
  | 'analyze_complaints' | 'assess_customer_nps' | 'identify_cross_sell';

// ─── Tool Definitions (Anthropic Schema) ───

const leadIntelTools: Anthropic.Messages.Tool[] = [
  {
    name: 'scan_market_signals',
    description: 'Scans competitor rate cards, branch performance, and RM scorecards to identify market trends, competitive threats, and pricing opportunities.',
    input_schema: {
      type: 'object' as const,
      properties: {
        product_filter: { type: 'string', description: 'Filter by product type (Home Loan, LAP, etc.)' },
        top_n: { type: 'number', description: 'Number of top insights to return (default: 10)' }
      },
      required: []
    }
  },
  {
    name: 'analyze_competitors',
    description: 'Performs detailed competitive benchmarking — HDFC vs all competitors across rates, fees, LTV, tenure, and special offers.',
    input_schema: {
      type: 'object' as const,
      properties: {
        competitor_name: { type: 'string', description: 'Specific competitor to focus on (optional)' },
        product_type: { type: 'string', description: 'Product type filter' }
      },
      required: []
    }
  },
  {
    name: 'score_leads',
    description: 'Scores each lead in the pipeline by amount, stage, probability, recency, and customer segment. Returns a prioritized lead ranking.',
    input_schema: {
      type: 'object' as const,
      properties: {
        min_amount_lakhs: { type: 'number', description: 'Minimum loan amount filter in lakhs' },
        stage_filter: { type: 'string', description: 'Filter by stage (Hot, Warm, Cold, etc.)' }
      },
      required: []
    }
  }
];

const onboardingTools: Anthropic.Messages.Tool[] = [
  {
    name: 'assess_eligibility',
    description: 'Evaluates each loan application against product eligibility criteria — income, age, employment type, and loan amount limits.',
    input_schema: {
      type: 'object' as const,
      properties: {
        application_id: { type: 'string', description: 'Specific application ID (or "all" for full pipeline)' },
        product_filter: { type: 'string', description: 'Filter by product type' }
      },
      required: []
    }
  },
  {
    name: 'verify_documents',
    description: 'Checks document completeness for each application against mandatory checklist. Flags missing, expired, or mismatched documents.',
    input_schema: {
      type: 'object' as const,
      properties: {
        application_id: { type: 'string', description: 'Specific application ID (or "all")' }
      },
      required: []
    }
  },
  {
    name: 'check_pmay',
    description: 'Assesses PMAY (Pradhan Mantri Awas Yojana) eligibility based on income, property value, and first-time buyer status.',
    input_schema: {
      type: 'object' as const,
      properties: {
        income_category: { type: 'string', description: 'EWS, LIG, MIG-I, MIG-II filter' }
      },
      required: []
    }
  }
];

const creditTools: Anthropic.Messages.Tool[] = [
  {
    name: 'validate_income',
    description: 'Cross-references income declarations against assessment framework. Validates stability, source, and consistency.',
    input_schema: {
      type: 'object' as const,
      properties: {
        application_id: { type: 'string', description: 'Specific application ID (or "all")' },
        employment_type: { type: 'string', description: 'Salaried or Self-Employed filter' }
      },
      required: []
    }
  },
  {
    name: 'calculate_foir_ltv',
    description: 'Calculates Fixed Obligation to Income Ratio (FOIR) and Loan-to-Value (LTV) ratio. Checks against RBI limits and runs stress tests.',
    input_schema: {
      type: 'object' as const,
      properties: {
        stress_bps: { type: 'number', description: 'Basis points for stress test (default: 200)' }
      },
      required: []
    }
  },
  {
    name: 'assess_risk_rating',
    description: 'Assigns risk rating (Green/Amber/Red) based on CIBIL, FOIR, LTV, income stability, and policy deviations.',
    input_schema: {
      type: 'object' as const,
      properties: {
        include_deviations: { type: 'boolean', description: 'Include deviation analysis (default: true)' }
      },
      required: []
    }
  }
];

const legalTools: Anthropic.Messages.Tool[] = [
  {
    name: 'verify_rera_status',
    description: 'Checks RERA registration status for all under-construction properties. Flags expired, missing, or at-risk registrations.',
    input_schema: {
      type: 'object' as const,
      properties: {
        city_filter: { type: 'string', description: 'Filter by city' },
        status_filter: { type: 'string', description: 'Filter by RERA status' }
      },
      required: []
    }
  },
  {
    name: 'check_title_chain',
    description: 'Assesses property title chain completeness — identifies gaps, encumbrances, litigation, and title risks.',
    input_schema: {
      type: 'object' as const,
      properties: {
        risk_only: { type: 'boolean', description: 'Show only properties with title risks (default: false)' }
      },
      required: []
    }
  },
  {
    name: 'assess_property_risk',
    description: 'Evaluates overall property risk — builder track record, valuation adequacy, construction status, and legal clearances.',
    input_schema: {
      type: 'object' as const,
      properties: {
        builder_filter: { type: 'string', description: 'Filter by builder name' }
      },
      required: []
    }
  }
];

const complianceTools: Anthropic.Messages.Tool[] = [
  {
    name: 'check_rbi_compliance',
    description: 'Validates the portfolio against RBI/NHB norms — LTV limits, FOIR caps, KYC requirements, NPA classification, fair lending practices.',
    input_schema: {
      type: 'object' as const,
      properties: {
        regulation_focus: { type: 'string', description: 'Specific regulation to focus on (LTV, FOIR, KYC, AML)' }
      },
      required: []
    }
  },
  {
    name: 'scan_red_flags',
    description: 'Scans all applications for red flags across 7 categories: loan parameters, income, property, credit, financial behavior, documents, compliance.',
    input_schema: {
      type: 'object' as const,
      properties: {
        severity_filter: { type: 'string', description: 'Filter by severity (Critical, High, Medium, Low)' },
        category_filter: { type: 'string', description: 'Filter by red flag category' }
      },
      required: []
    }
  },
  {
    name: 'detect_fraud',
    description: 'Detects fraud typologies — identity fraud, income inflation, property fraud, syndicate patterns, circular transactions, and AML indicators.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type_filter: { type: 'string', description: 'Specific fraud type to focus on' }
      },
      required: []
    }
  }
];

const sanctionTools: Anthropic.Messages.Tool[] = [
  {
    name: 'generate_sanction_recommendation',
    description: 'Synthesizes all upstream assessments into a final sanction recommendation with conditions, deviations, and risk mitigants.',
    input_schema: {
      type: 'object' as const,
      properties: {
        application_id: { type: 'string', description: 'Specific application ID (or "all")' }
      },
      required: []
    }
  },
  {
    name: 'check_disbursement_readiness',
    description: 'Verifies all pre-disbursement requirements — agreement execution, insurance, NACH mandate, property documents.',
    input_schema: {
      type: 'object' as const,
      properties: {
        check_type: { type: 'string', description: 'Focus on specific check type' }
      },
      required: []
    }
  },
  {
    name: 'verify_pre_disbursement',
    description: 'Runs final pre-disbursement verification — anomaly check, document freshness, compliance revalidation.',
    input_schema: {
      type: 'object' as const,
      properties: {
        days_since_sanction: { type: 'number', description: 'Filter cases sanctioned more than N days ago' }
      },
      required: []
    }
  }
];

const portfolioTools: Anthropic.Messages.Tool[] = [
  {
    name: 'monitor_npa_watchlist',
    description: 'Analyzes the NPA watchlist — identifies accounts showing stress signals, EMI bounce patterns, and CIBIL deterioration.',
    input_schema: {
      type: 'object' as const,
      properties: {
        risk_level: { type: 'string', description: 'Filter by risk level (Critical, High, Medium)' },
        top_n: { type: 'number', description: 'Number of accounts to show (default: all)' }
      },
      required: []
    }
  },
  {
    name: 'assess_portfolio_risk',
    description: 'Multi-dimensional risk assessment across credit, fraud, property, market, operational, and regulatory dimensions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        dimension_focus: { type: 'string', description: 'Focus on specific risk dimension' }
      },
      required: []
    }
  },
  {
    name: 'generate_early_warnings',
    description: 'Generates early warning intelligence — accounts likely to slip to NPA in 30/60/90 days with recommended interventions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        horizon_days: { type: 'number', description: 'Prediction horizon in days (default: 90)' }
      },
      required: []
    }
  }
];

const collectionsTools: Anthropic.Messages.Tool[] = [
  {
    name: 'analyze_dpd_aging',
    description: 'Analyzes DPD aging distribution — bucket migration patterns, concentration analysis, and flow rate trends.',
    input_schema: {
      type: 'object' as const,
      properties: {
        bucket_filter: { type: 'string', description: 'Filter by DPD bucket (0-30, 31-60, 61-90, 90+)' }
      },
      required: []
    }
  },
  {
    name: 'evaluate_collection_performance',
    description: 'Evaluates collection agency performance — success rates, recovery amounts, cost efficiency, and optimal account matching.',
    input_schema: {
      type: 'object' as const,
      properties: {
        agency_filter: { type: 'string', description: 'Specific agency to evaluate' }
      },
      required: []
    }
  },
  {
    name: 'assess_recovery_options',
    description: 'Evaluates recovery options per account — soft collections, SARFAESI, OTS, restructuring, write-off — with NPV analysis.',
    input_schema: {
      type: 'object' as const,
      properties: {
        strategy_filter: { type: 'string', description: 'Focus on specific recovery strategy' }
      },
      required: []
    }
  }
];

const serviceTools: Anthropic.Messages.Tool[] = [
  {
    name: 'analyze_complaints',
    description: 'Analyzes complaint patterns — categories, SLA compliance, root cause clustering, branch-wise performance, and severity trends.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category_filter: { type: 'string', description: 'Filter by complaint category' },
        branch_filter: { type: 'string', description: 'Filter by branch' }
      },
      required: []
    }
  },
  {
    name: 'assess_customer_nps',
    description: 'Analyzes NPS survey results — score distribution, detractor themes, promoter characteristics, and actionable improvement areas.',
    input_schema: {
      type: 'object' as const,
      properties: {
        segment_filter: { type: 'string', description: 'Filter by customer segment' }
      },
      required: []
    }
  },
  {
    name: 'identify_cross_sell',
    description: 'Identifies cross-sell opportunities from service interactions — customers ripe for CASA, insurance, credit cards, top-up loans.',
    input_schema: {
      type: 'object' as const,
      properties: {
        product_focus: { type: 'string', description: 'Focus on specific product for cross-sell' }
      },
      required: []
    }
  }
];

// ─── Tool Registry ───

const toolRegistry: Record<string, Anthropic.Messages.Tool[]> = {
  'lead-intelligence': leadIntelTools,
  'customer-onboarding': onboardingTools,
  'credit-underwriting': creditTools,
  'legal-property': legalTools,
  'compliance-fraud': complianceTools,
  'sanction-disbursement': sanctionTools,
  'portfolio-monitoring': portfolioTools,
  'collections-recovery': collectionsTools,
  'service-excellence': serviceTools,
};

export function getToolsForSlug(slug: string): Anthropic.Messages.Tool[] | null {
  return toolRegistry[slug] ?? null;
}

export function getAgenticInstructions(slug: string): string {
  const tools = toolRegistry[slug];
  if (!tools) return '';

  const toolNames = tools.map((t) => t.name);
  const numberedList = toolNames.map((n, i) => `${i + 1}. Call ${n}`).join('\n');

  return `\n\nIMPORTANT AGENTIC INSTRUCTIONS:
You have ${tools.length} tools available. You MUST use them in this order before writing your final analysis:
${numberedList}

Always use the tools — do not skip them. The user expects to see you call each tool visibly.
After all tools complete, produce a comprehensive, structured report synthesizing all tool results.
Include confidence scores, data quality flags, and governance recommendations in your final output.`;
}

// ─── Tool Execution ───

export function executeToolLocally(
  name: HdfcToolName,
  input: Record<string, unknown>
): string {
  try {
    switch (name) {
      case 'scan_market_signals': return execScanMarketSignals(input);
      case 'analyze_competitors': return execAnalyzeCompetitors(input);
      case 'score_leads': return execScoreLeads(input);
      case 'assess_eligibility': return execAssessEligibility(input);
      case 'verify_documents': return execVerifyDocuments(input);
      case 'check_pmay': return execCheckPmay(input);
      case 'validate_income': return execValidateIncome(input);
      case 'calculate_foir_ltv': return execCalculateFoirLtv(input);
      case 'assess_risk_rating': return execAssessRiskRating(input);
      case 'verify_rera_status': return execVerifyReraStatus(input);
      case 'check_title_chain': return execCheckTitleChain(input);
      case 'assess_property_risk': return execAssessPropertyRisk(input);
      case 'check_rbi_compliance': return execCheckRbiCompliance(input);
      case 'scan_red_flags': return execScanRedFlags(input);
      case 'detect_fraud': return execDetectFraud(input);
      case 'generate_sanction_recommendation': return execGenerateSanction(input);
      case 'check_disbursement_readiness': return execCheckDisbursement(input);
      case 'verify_pre_disbursement': return execVerifyPreDisbursement(input);
      case 'monitor_npa_watchlist': return execMonitorNpa(input);
      case 'assess_portfolio_risk': return execAssessPortfolioRisk(input);
      case 'generate_early_warnings': return execGenerateEarlyWarnings(input);
      case 'analyze_dpd_aging': return execAnalyzeDpdAging(input);
      case 'evaluate_collection_performance': return execEvalCollectionPerf(input);
      case 'assess_recovery_options': return execAssessRecoveryOptions(input);
      case 'analyze_complaints': return execAnalyzeComplaints(input);
      case 'assess_customer_nps': return execAssessCustomerNps(input);
      case 'identify_cross_sell': return execIdentifyCrossSell(input);
      default: return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return JSON.stringify({ error: msg, tool: name });
  }
}

// ─── Stage 1: Lead Intelligence Tool Implementations ───

function execScanMarketSignals(input: Record<string, unknown>): string {
  const rates = loadHdfcCsv('sales-distribution', 'competitor_rate_card.csv');
  const branches = loadHdfcCsv('sales-distribution', 'branch_performance.csv');
  const rmCards = loadHdfcCsv('sales-distribution', 'rm_scorecard.csv');
  const productFilter = input.product_filter as string | undefined;

  let filteredRates = rates.rows;
  if (productFilter) {
    filteredRates = filteredRates.filter(r => r.Product?.toLowerCase().includes(productFilter.toLowerCase()));
  }

  const hdfcRates = filteredRates.filter(r => r.Lender === 'HDFC Ltd' || r.Lender?.includes('HDFC'));
  const competitorRates = filteredRates.filter(r => !r.Lender?.includes('HDFC'));
  const avgBranchLogins = branches.rows.reduce((a, r) => a + Number(r.Login_Count || r.Total_Logins || 0), 0) / Math.max(branches.rowCount, 1);
  const topRMs = [...rmCards.rows].sort((a, b) => Number(b.Cases_Logged || b.Total_Cases || 0) - Number(a.Cases_Logged || a.Total_Cases || 0)).slice(0, 5);

  return JSON.stringify({
    total_competitors: rates.rowCount,
    hdfc_products: hdfcRates.length,
    competitor_products: competitorRates.length,
    market_signals: {
      rate_landscape: filteredRates.slice(0, 20).map(r => ({
        lender: r.Lender,
        product: r.Product,
        rate_range: r.Rate_Range_Percent,
        processing_fee: r.Processing_Fee_Percent,
        max_ltv: r.Max_LTV_Percent,
        special_offers: r.Special_Offers,
        strengths: r.Strengths,
        weaknesses: r.Weaknesses
      })),
      branch_performance_avg_logins: avgBranchLogins.toFixed(0),
      total_branches: branches.rowCount,
      top_rms: topRMs.map(r => ({ name: r.RM_Name || r.Name, cases: r.Cases_Logged || r.Total_Cases, branch: r.Branch })),
    },
    summary: `Scanned ${rates.rowCount} competitor rate entries across ${new Set(filteredRates.map(r => r.Lender)).size} lenders. ${branches.rowCount} branches and ${rmCards.rowCount} RMs analyzed.`
  });
}

function execAnalyzeCompetitors(input: Record<string, unknown>): string {
  const rates = loadHdfcCsv('sales-distribution', 'competitor_rate_card.csv');
  const competitorName = input.competitor_name as string | undefined;

  let filtered = rates.rows;
  if (competitorName) {
    filtered = filtered.filter(r => r.Lender?.toLowerCase().includes(competitorName.toLowerCase()));
  }

  const byLender: Record<string, { products: number; minRate: number; maxRate: number; strengths: string[]; weaknesses: string[] }> = {};
  for (const r of filtered) {
    const lender = r.Lender || 'Unknown';
    if (!byLender[lender]) byLender[lender] = { products: 0, minRate: 99, maxRate: 0, strengths: [], weaknesses: [] };
    byLender[lender].products++;
    const rateStr = r.Rate_Range_Percent || '0-0';
    const parts = rateStr.split('-').map(Number);
    if (parts[0] < byLender[lender].minRate) byLender[lender].minRate = parts[0];
    if (parts[1] > byLender[lender].maxRate) byLender[lender].maxRate = parts[1];
    if (r.Strengths) byLender[lender].strengths.push(r.Strengths);
    if (r.Weaknesses) byLender[lender].weaknesses.push(r.Weaknesses);
  }

  return JSON.stringify({
    total_entries: filtered.length,
    lender_count: Object.keys(byLender).length,
    competitive_landscape: Object.entries(byLender).map(([lender, data]) => ({
      lender,
      product_count: data.products,
      rate_range: `${data.minRate.toFixed(2)}-${data.maxRate.toFixed(2)}%`,
      key_strengths: Array.from(new Set(data.strengths)).slice(0, 3),
      key_weaknesses: Array.from(new Set(data.weaknesses)).slice(0, 3),
    })),
    detailed_comparison: filtered.slice(0, 30).map(r => ({
      lender: r.Lender, product: r.Product, rate: r.Rate_Range_Percent,
      fee: r.Processing_Fee_Percent, ltv: r.Max_LTV_Percent, tenure: r.Max_Tenure_Years,
      prepayment: r.Prepayment_Penalty, offers: r.Special_Offers
    })),
    summary: `Analyzed ${filtered.length} product entries across ${Object.keys(byLender).length} lenders. Competitive benchmarking complete.`
  });
}

function execScoreLeads(input: Record<string, unknown>): string {
  const leads = loadHdfcCsv('sales-distribution', 'lead_tracker.csv');
  const minAmount = Number(input.min_amount_lakhs) || 0;
  const stageFilter = input.stage_filter as string | undefined;

  let filtered = leads.rows.filter(r => Number(r.Estimated_Amount_Lakhs || 0) >= minAmount);
  if (stageFilter) {
    filtered = filtered.filter(r => r.Stage?.toLowerCase() === stageFilter.toLowerCase());
  }

  const scored = filtered.map(r => {
    const amount = Number(r.Estimated_Amount_Lakhs || 0);
    const probability = Number(r.Probability_Percent || 0);
    const stageScore = r.Stage === 'Hot' ? 40 : r.Stage === 'Warm' ? 25 : r.Stage === 'Cold' ? 10 : 5;
    const amountScore = Math.min(amount / 5, 30);
    const probabilityScore = probability * 0.3;
    const compositeScore = stageScore + amountScore + probabilityScore;
    return { row: r, composite_score: Math.round(compositeScore * 10) / 10 };
  }).sort((a, b) => b.composite_score - a.composite_score);

  const byStage: Record<string, number> = {};
  const totalValue = scored.reduce((a, s) => { const stage = s.row.Stage || 'Unknown'; byStage[stage] = (byStage[stage] || 0) + 1; return a + Number(s.row.Estimated_Amount_Lakhs || 0); }, 0);

  return JSON.stringify({
    total_leads: leads.rowCount,
    filtered_leads: scored.length,
    total_pipeline_value_lakhs: totalValue,
    stage_distribution: byStage,
    scored_leads: scored.slice(0, 25).map(s => ({
      lead_id: s.row.Lead_ID, customer: s.row.Customer_Name, source: s.row.Source,
      product: s.row.Product_Interest, amount_lakhs: s.row.Estimated_Amount_Lakhs,
      location: s.row.Property_Location, rm: s.row.RM_Assigned, stage: s.row.Stage,
      probability: s.row.Probability_Percent, score: s.composite_score,
      next_action: s.row.Next_Action, remarks: s.row.Remarks
    })),
    summary: `${scored.length} leads scored. Total pipeline: ₹${totalValue}L. Top lead: ${scored[0]?.row.Customer_Name} (Score: ${scored[0]?.composite_score}).`
  });
}

// ─── Stage 2: Customer Onboarding Tool Implementations ───

function execAssessEligibility(input: Record<string, unknown>): string {
  const apps = loadHdfcCsv('loan-origination', 'loan_applications.csv');
  const products = loadHdfcCsv('product-mgmt', 'product_catalog.csv');
  const appId = input.application_id as string | undefined;

  let filtered = apps.rows;
  if (appId && appId !== 'all') {
    filtered = filtered.filter(r => r.Application_ID === appId || r.App_ID === appId);
  }

  const assessed = filtered.map(r => {
    const loanAmt = Number(r.Loan_Amount_Lakhs || r.Requested_Amount || 0);
    const income = Number(r.Monthly_Income || r.Annual_Income || 0);
    const age = Number(r.Age || r.Applicant_Age || 0);
    const issues: string[] = [];
    if (age < 21) issues.push('Below minimum age (21)');
    if (age > 65) issues.push('Above maximum age (65)');
    if (loanAmt > 500) issues.push('Exceeds standard limit — needs higher approval');
    if (income <= 0) issues.push('Income not declared');
    const eligible = issues.length === 0;
    return {
      application_id: r.Application_ID || r.App_ID,
      customer: r.Customer_Name || r.Applicant_Name,
      product: r.Product || r.Product_Type,
      loan_amount_lakhs: loanAmt,
      income: income,
      age: age,
      employment: r.Employment_Type || r.Employment,
      eligible,
      issues,
      status: eligible ? 'ELIGIBLE' : 'NEEDS_REVIEW'
    };
  });

  const eligibleCount = assessed.filter(a => a.eligible).length;
  return JSON.stringify({
    total_assessed: assessed.length,
    eligible: eligibleCount,
    needs_review: assessed.length - eligibleCount,
    product_catalog_count: products.rowCount,
    assessments: assessed.slice(0, 30),
    summary: `${assessed.length} applications assessed. ${eligibleCount} eligible, ${assessed.length - eligibleCount} need review.`
  });
}

function execVerifyDocuments(input: Record<string, unknown>): string {
  const docs = loadHdfcCsv('loan-origination', 'document_checklist.csv');
  const appId = input.application_id as string | undefined;

  let filtered = docs.rows;
  if (appId && appId !== 'all') {
    filtered = filtered.filter(r => r.Application_ID === appId || r.App_ID === appId);
  }

  const byApp: Record<string, { total: number; received: number; pending: number; rejected: number; docs: Record<string, string>[] }> = {};
  for (const r of filtered) {
    const id = r.Application_ID || r.App_ID || 'UNKNOWN';
    if (!byApp[id]) byApp[id] = { total: 0, received: 0, pending: 0, rejected: 0, docs: [] };
    byApp[id].total++;
    const status = (r.Status || r.Doc_Status || '').toLowerCase();
    if (status.includes('received') || status.includes('verified') || status.includes('complete')) byApp[id].received++;
    else if (status.includes('reject')) byApp[id].rejected++;
    else byApp[id].pending++;
    byApp[id].docs.push({ document: r.Document_Name || r.Document || r.Doc_Type, status: r.Status || r.Doc_Status, remarks: r.Remarks || '' });
  }

  const appSummaries = Object.entries(byApp).map(([id, data]) => ({
    application_id: id,
    total_docs: data.total,
    received: data.received,
    pending: data.pending,
    rejected: data.rejected,
    completeness: `${Math.round(data.received / data.total * 100)}%`,
    status: data.pending === 0 && data.rejected === 0 ? 'COMPLETE' : data.rejected > 0 ? 'HAS_REJECTIONS' : 'INCOMPLETE',
    documents: data.docs
  }));

  return JSON.stringify({
    total_documents: filtered.length,
    applications_checked: appSummaries.length,
    fully_complete: appSummaries.filter(a => a.status === 'COMPLETE').length,
    incomplete: appSummaries.filter(a => a.status === 'INCOMPLETE').length,
    has_rejections: appSummaries.filter(a => a.status === 'HAS_REJECTIONS').length,
    applications: appSummaries.slice(0, 20),
    summary: `${filtered.length} documents verified across ${appSummaries.length} applications. ${appSummaries.filter(a => a.status === 'COMPLETE').length} fully complete.`
  });
}

function execCheckPmay(input: Record<string, unknown>): string {
  const apps = loadHdfcCsv('loan-origination', 'loan_applications.csv');
  const incomeCategory = input.income_category as string | undefined;

  const assessed = apps.rows.map(r => {
    const income = Number(r.Annual_Income || r.Monthly_Income || 0);
    const annualIncome = income > 100000 ? income : income * 12;
    let category = 'Not Eligible';
    let subsidy = '0%';
    if (annualIncome <= 300000) { category = 'EWS'; subsidy = '6.5% on first ₹6L'; }
    else if (annualIncome <= 600000) { category = 'LIG'; subsidy = '6.5% on first ₹6L'; }
    else if (annualIncome <= 1200000) { category = 'MIG-I'; subsidy = '4% on first ₹9L'; }
    else if (annualIncome <= 1800000) { category = 'MIG-II'; subsidy = '3% on first ₹12L'; }
    return {
      application_id: r.Application_ID || r.App_ID,
      customer: r.Customer_Name || r.Applicant_Name,
      annual_income: annualIncome,
      category,
      subsidy_benefit: subsidy,
      eligible: category !== 'Not Eligible'
    };
  });

  let result = assessed;
  if (incomeCategory) {
    result = result.filter(a => a.category.toLowerCase() === incomeCategory.toLowerCase());
  }

  const eligibleCount = result.filter(a => a.eligible).length;
  const byCat: Record<string, number> = {};
  result.forEach(a => { byCat[a.category] = (byCat[a.category] || 0) + 1; });

  return JSON.stringify({
    total_assessed: result.length,
    pmay_eligible: eligibleCount,
    not_eligible: result.length - eligibleCount,
    category_distribution: byCat,
    assessments: result.slice(0, 25),
    summary: `${result.length} applications assessed for PMAY. ${eligibleCount} eligible across ${Object.keys(byCat).length} categories.`
  });
}

// ─── Stage 3: Credit Underwriting Tool Implementations ───

function execValidateIncome(input: Record<string, unknown>): string {
  const credit = loadHdfcCsv('credit-underwriting', 'credit_assessment_summary.csv');
  const empFilter = input.employment_type as string | undefined;

  let filtered = credit.rows;
  if (empFilter) {
    filtered = filtered.filter(r => (r.Employment_Type || r.Employment || '').toLowerCase().includes(empFilter.toLowerCase()));
  }

  const validated = filtered.map(r => {
    const declaredIncome = Number(r.Declared_Income || r.Monthly_Income || r.Income || 0);
    const verifiedIncome = Number(r.Verified_Income || r.Assessed_Income || declaredIncome * 0.9);
    const variance = declaredIncome > 0 ? Math.round((verifiedIncome - declaredIncome) / declaredIncome * 100) : 0;
    const stable = Math.abs(variance) < 15;
    return {
      application_id: r.Application_ID || r.App_ID || r.Loan_ID,
      customer: r.Customer_Name || r.Applicant,
      employment: r.Employment_Type || r.Employment,
      declared_income: declaredIncome,
      verified_income: verifiedIncome,
      variance_percent: variance,
      income_stable: stable,
      status: stable ? 'VALIDATED' : 'VARIANCE_FLAGGED',
      cibil: r.CIBIL_Score || r.CIBIL
    };
  });

  return JSON.stringify({
    total_validated: validated.length,
    validated_ok: validated.filter(v => v.income_stable).length,
    variance_flagged: validated.filter(v => !v.income_stable).length,
    validations: validated.slice(0, 25),
    summary: `${validated.length} income records validated. ${validated.filter(v => v.income_stable).length} OK, ${validated.filter(v => !v.income_stable).length} flagged for variance.`
  });
}

function execCalculateFoirLtv(input: Record<string, unknown>): string {
  const credit = loadHdfcCsv('credit-underwriting', 'credit_assessment_summary.csv');
  const stressBps = Number(input.stress_bps) || 200;

  const calculated = credit.rows.map(r => {
    const income = Number(r.Monthly_Income || r.Income || r.Declared_Income || 50000);
    const emi = Number(r.Proposed_EMI || r.EMI || income * 0.35);
    const existingObligations = Number(r.Existing_Obligations || r.Other_EMI || 0);
    const loanAmount = Number(r.Loan_Amount || r.Loan_Amount_Lakhs || 0) * 100000;
    const propertyValue = Number(r.Property_Value || r.Valuation || loanAmount * 1.3);

    const foir = income > 0 ? Math.round((emi + existingObligations) / income * 100) : 0;
    const ltv = propertyValue > 0 ? Math.round(loanAmount / propertyValue * 100) : 0;
    const stressedEmi = emi * (1 + stressBps / 10000 * 12);
    const stressedFoir = income > 0 ? Math.round((stressedEmi + existingObligations) / income * 100) : 0;

    const foirOk = foir <= 60;
    const ltvLimit = loanAmount / 100000 <= 30 ? 90 : loanAmount / 100000 <= 75 ? 80 : 75;
    const ltvOk = ltv <= ltvLimit;

    return {
      application_id: r.Application_ID || r.App_ID || r.Loan_ID,
      customer: r.Customer_Name || r.Applicant,
      monthly_income: income, proposed_emi: Math.round(emi), existing_obligations: existingObligations,
      foir_percent: foir, foir_limit: 60, foir_ok: foirOk,
      loan_amount: loanAmount, property_value: propertyValue,
      ltv_percent: ltv, ltv_limit: ltvLimit, ltv_ok: ltvOk,
      stressed_foir: stressedFoir, stress_test_bps: stressBps,
      overall_status: foirOk && ltvOk ? 'WITHIN_LIMITS' : 'BREACH'
    };
  });

  return JSON.stringify({
    total_calculated: calculated.length,
    within_limits: calculated.filter(c => c.overall_status === 'WITHIN_LIMITS').length,
    breaches: calculated.filter(c => c.overall_status === 'BREACH').length,
    stress_test_applied: `${stressBps}bps`,
    calculations: calculated.slice(0, 25),
    summary: `FOIR/LTV calculated for ${calculated.length} applications. ${calculated.filter(c => c.overall_status === 'BREACH').length} breaches detected. Stress test at +${stressBps}bps applied.`
  });
}

function execAssessRiskRating(input: Record<string, unknown>): string {
  const credit = loadHdfcCsv('credit-underwriting', 'credit_assessment_summary.csv');
  const deviations = loadHdfcCsv('credit-underwriting', 'deviation_register.csv');
  const includeDevs = input.include_deviations !== false;

  const rated = credit.rows.map(r => {
    const cibil = Number(r.CIBIL_Score || r.CIBIL || 700);
    const foir = Number(r.FOIR || r.FOIR_Percent || 45);
    const ltv = Number(r.LTV || r.LTV_Percent || 70);
    let riskScore = 0;
    if (cibil < 650) riskScore += 3; else if (cibil < 700) riskScore += 2; else if (cibil < 750) riskScore += 1;
    if (foir > 55) riskScore += 2; else if (foir > 45) riskScore += 1;
    if (ltv > 80) riskScore += 2; else if (ltv > 70) riskScore += 1;
    const rating = riskScore >= 5 ? 'RED' : riskScore >= 3 ? 'AMBER' : 'GREEN';
    return {
      application_id: r.Application_ID || r.App_ID || r.Loan_ID,
      customer: r.Customer_Name || r.Applicant,
      cibil, foir, ltv, risk_score: riskScore, rating,
      recommendation: rating === 'RED' ? 'DECLINE / ESCALATE' : rating === 'AMBER' ? 'CONDITIONAL APPROVAL' : 'RECOMMEND APPROVAL'
    };
  });

  const devSummary = includeDevs ? deviations.rows.slice(0, 15).map(d => ({
    deviation_id: d.Deviation_ID || d.ID, application_id: d.Application_ID || d.App_ID,
    type: d.Deviation_Type || d.Type, severity: d.Severity || d.Risk_Level,
    mitigant: d.Mitigant || d.Risk_Mitigant, status: d.Status || d.Approval_Status
  })) : [];

  const byRating: Record<string, number> = {};
  rated.forEach(r => { byRating[r.rating] = (byRating[r.rating] || 0) + 1; });

  return JSON.stringify({
    total_rated: rated.length,
    rating_distribution: byRating,
    deviations_found: includeDevs ? deviations.rowCount : 'not checked',
    rated_applications: rated.slice(0, 25),
    deviation_register: devSummary,
    summary: `${rated.length} applications rated. GREEN: ${byRating.GREEN || 0}, AMBER: ${byRating.AMBER || 0}, RED: ${byRating.RED || 0}. ${deviations.rowCount} deviations logged.`
  });
}

// ─── Stage 4: Legal & Property Tool Implementations ───

function execVerifyReraStatus(input: Record<string, unknown>): string {
  const rera = loadHdfcCsv('compliance-risk', 'rera_project_status.csv');
  const cityFilter = input.city_filter as string | undefined;

  let filtered = rera.rows;
  if (cityFilter) {
    filtered = filtered.filter(r => (r.City || r.Location || '').toLowerCase().includes(cityFilter.toLowerCase()));
  }

  const verified = filtered.map(r => {
    const reraStatus = (r.RERA_Status || r.RERA_Registration || '').toLowerCase();
    const valid = reraStatus.includes('active') || reraStatus.includes('valid') || reraStatus.includes('registered');
    return {
      project: r.Project_Name || r.Project,
      builder: r.Builder_Name || r.Builder || r.Developer,
      city: r.City || r.Location,
      rera_id: r.RERA_ID || r.RERA_Number,
      rera_status: r.RERA_Status || r.RERA_Registration,
      oc_status: r.OC_Status || r.Completion_Status,
      risk_flag: r.Risk_Flag || r.Risk || '',
      valid,
      action: valid ? 'CLEARED' : 'NEEDS_VERIFICATION'
    };
  });

  return JSON.stringify({
    total_projects: verified.length,
    rera_valid: verified.filter(v => v.valid).length,
    rera_issues: verified.filter(v => !v.valid).length,
    projects: verified.slice(0, 30),
    summary: `${verified.length} projects checked. ${verified.filter(v => v.valid).length} RERA valid, ${verified.filter(v => !v.valid).length} need verification.`
  });
}

function execCheckTitleChain(input: Record<string, unknown>): string {
  const docs = loadHdfcCsv('loan-origination', 'document_checklist.csv');
  const riskOnly = input.risk_only === true;

  const legalDocs = docs.rows.filter(r => {
    const docType = (r.Document_Name || r.Document || r.Doc_Type || '').toLowerCase();
    return docType.includes('title') || docType.includes('sale') || docType.includes('agreement') ||
           docType.includes('chain') || docType.includes('encumbrance') || docType.includes('legal');
  });

  const byApp: Record<string, { docs: string[]; complete: boolean; issues: string[] }> = {};
  for (const r of legalDocs) {
    const id = r.Application_ID || r.App_ID || 'UNKNOWN';
    if (!byApp[id]) byApp[id] = { docs: [], complete: true, issues: [] };
    byApp[id].docs.push(r.Document_Name || r.Document || r.Doc_Type);
    const status = (r.Status || r.Doc_Status || '').toLowerCase();
    if (!status.includes('received') && !status.includes('verified') && !status.includes('complete')) {
      byApp[id].complete = false;
      byApp[id].issues.push(`${r.Document_Name || r.Document}: ${r.Status || r.Doc_Status}`);
    }
  }

  let results = Object.entries(byApp).map(([id, data]) => ({
    application_id: id,
    legal_docs_count: data.docs.length,
    title_clear: data.complete,
    issues: data.issues,
    status: data.complete ? 'TITLE_CLEAR' : 'TITLE_RISK'
  }));

  if (riskOnly) results = results.filter(r => !r.title_clear);

  return JSON.stringify({
    total_applications: results.length,
    title_clear: results.filter(r => r.title_clear).length,
    title_risk: results.filter(r => !r.title_clear).length,
    applications: results.slice(0, 25),
    summary: `Title chain checked for ${results.length} applications. ${results.filter(r => r.title_clear).length} clear, ${results.filter(r => !r.title_clear).length} at risk.`
  });
}

function execAssessPropertyRisk(input: Record<string, unknown>): string {
  const rera = loadHdfcCsv('compliance-risk', 'rera_project_status.csv');
  const builderFilter = input.builder_filter as string | undefined;

  let filtered = rera.rows;
  if (builderFilter) {
    filtered = filtered.filter(r => (r.Builder_Name || r.Builder || r.Developer || '').toLowerCase().includes(builderFilter.toLowerCase()));
  }

  const assessed = filtered.map(r => {
    const reraOk = (r.RERA_Status || '').toLowerCase().includes('active') || (r.RERA_Status || '').toLowerCase().includes('valid');
    const ocOk = (r.OC_Status || '').toLowerCase().includes('received') || (r.OC_Status || '').toLowerCase().includes('obtained');
    const riskFlag = r.Risk_Flag || r.Risk || '';
    const hasRisk = riskFlag.toLowerCase().includes('high') || riskFlag.toLowerCase().includes('critical');
    let riskLevel = 'LOW';
    if (!reraOk && !ocOk) riskLevel = 'HIGH';
    else if (!reraOk || hasRisk) riskLevel = 'MEDIUM';
    return {
      project: r.Project_Name || r.Project,
      builder: r.Builder_Name || r.Builder || r.Developer,
      city: r.City || r.Location,
      rera_ok: reraOk, oc_status: r.OC_Status || r.Completion_Status,
      risk_flag: riskFlag, risk_level: riskLevel,
      recommendation: riskLevel === 'HIGH' ? 'DO NOT LEND' : riskLevel === 'MEDIUM' ? 'ADDITIONAL DUE DILIGENCE' : 'APPROVED FOR LENDING'
    };
  });

  const byRisk: Record<string, number> = {};
  assessed.forEach(a => { byRisk[a.risk_level] = (byRisk[a.risk_level] || 0) + 1; });

  return JSON.stringify({
    total_properties: assessed.length,
    risk_distribution: byRisk,
    assessments: assessed.slice(0, 25),
    summary: `${assessed.length} properties assessed. HIGH: ${byRisk.HIGH || 0}, MEDIUM: ${byRisk.MEDIUM || 0}, LOW: ${byRisk.LOW || 0}.`
  });
}

// ─── Stage 5: Compliance & Fraud Tool Implementations ───

function execCheckRbiCompliance(input: Record<string, unknown>): string {
  const regulatories = loadHdfcCsv('compliance-risk', 'regulatory_circulars.csv');
  const audits = loadHdfcCsv('compliance-risk', 'audit_findings.csv');
  const focus = input.regulation_focus as string | undefined;

  let filteredCirculars = regulatories.rows;
  if (focus) {
    filteredCirculars = filteredCirculars.filter(r =>
      (r.Subject || r.Circular_Subject || r.Title || '').toLowerCase().includes(focus.toLowerCase()) ||
      (r.Category || r.Type || '').toLowerCase().includes(focus.toLowerCase())
    );
  }

  const openAudits = audits.rows.filter(r => {
    const status = (r.Status || r.Finding_Status || '').toLowerCase();
    return status.includes('open') || status.includes('pending') || status.includes('progress');
  });

  return JSON.stringify({
    total_circulars: regulatories.rowCount,
    filtered_circulars: filteredCirculars.length,
    circulars: filteredCirculars.slice(0, 20).map(r => ({
      circular_id: r.Circular_ID || r.ID,
      subject: r.Subject || r.Circular_Subject || r.Title,
      issuer: r.Issuer || r.Issued_By || 'RBI',
      date: r.Date || r.Issue_Date,
      compliance_deadline: r.Deadline || r.Compliance_Date,
      status: r.Status || r.Compliance_Status,
      category: r.Category || r.Type
    })),
    audit_findings: {
      total: audits.rowCount,
      open: openAudits.length,
      findings: openAudits.slice(0, 15).map(a => ({
        finding_id: a.Finding_ID || a.ID,
        category: a.Category || a.Finding_Category,
        severity: a.Severity || a.Risk_Rating,
        description: a.Description || a.Finding,
        status: a.Status || a.Finding_Status
      }))
    },
    summary: `${regulatories.rowCount} regulatory circulars reviewed. ${openAudits.length} open audit findings. Compliance check complete.`
  });
}

function execScanRedFlags(input: Record<string, unknown>): string {
  const redFlags = loadHdfcCsv('compliance-risk', 'red_flag_samples.csv');
  const severityFilter = input.severity_filter as string | undefined;
  const categoryFilter = input.category_filter as string | undefined;

  let filtered = redFlags.rows;
  if (severityFilter) {
    filtered = filtered.filter(r => (r.Severity || r.Risk_Level || '').toLowerCase().includes(severityFilter.toLowerCase()));
  }
  if (categoryFilter) {
    filtered = filtered.filter(r => (r.Category || r.Red_Flag_Category || '').toLowerCase().includes(categoryFilter.toLowerCase()));
  }

  const bySeverity: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  filtered.forEach(r => {
    const sev = r.Severity || r.Risk_Level || 'Unknown';
    const cat = r.Category || r.Red_Flag_Category || 'Unknown';
    bySeverity[sev] = (bySeverity[sev] || 0) + 1;
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  return JSON.stringify({
    total_red_flags: filtered.length,
    severity_breakdown: bySeverity,
    category_breakdown: byCategory,
    red_flags: filtered.slice(0, 25).map(r => ({
      id: r.Red_Flag_ID || r.ID,
      application_id: r.Application_ID || r.App_ID,
      category: r.Category || r.Red_Flag_Category,
      severity: r.Severity || r.Risk_Level,
      description: r.Description || r.Red_Flag_Description,
      indicator: r.Indicator || r.Signal,
      action_required: r.Action || r.Recommended_Action
    })),
    summary: `${filtered.length} red flags identified. Critical: ${bySeverity.Critical || bySeverity.High || 0}. Scan complete.`
  });
}

function execDetectFraud(input: Record<string, unknown>): string {
  const fraudAlerts = loadHdfcCsv('compliance-risk', 'fraud_alerts.csv');
  const typeFilter = input.type_filter as string | undefined;

  let filtered = fraudAlerts.rows;
  if (typeFilter) {
    filtered = filtered.filter(r => (r.Fraud_Type || r.Type || r.Category || '').toLowerCase().includes(typeFilter.toLowerCase()));
  }

  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  filtered.forEach(r => {
    const t = r.Fraud_Type || r.Type || r.Category || 'Unknown';
    const s = r.Severity || r.Risk_Level || 'Unknown';
    byType[t] = (byType[t] || 0) + 1;
    bySeverity[s] = (bySeverity[s] || 0) + 1;
  });

  return JSON.stringify({
    total_alerts: filtered.length,
    fraud_type_distribution: byType,
    severity_distribution: bySeverity,
    alerts: filtered.slice(0, 25).map(r => ({
      alert_id: r.Alert_ID || r.ID,
      application_id: r.Application_ID || r.App_ID || r.Loan_ID,
      fraud_type: r.Fraud_Type || r.Type || r.Category,
      severity: r.Severity || r.Risk_Level,
      description: r.Description || r.Alert_Description,
      indicators: r.Indicators || r.Red_Flags || r.Signal,
      amount_at_risk: r.Amount_At_Risk || r.Exposure,
      status: r.Status || r.Alert_Status,
      action: r.Action || r.Recommended_Action
    })),
    summary: `${filtered.length} fraud alerts detected across ${Object.keys(byType).length} typologies. Immediate escalation needed for ${bySeverity.Critical || bySeverity.High || 0} critical cases.`
  });
}

// ─── Stage 6: Sanction & Disbursement Tool Implementations ───

function execGenerateSanction(input: Record<string, unknown>): string {
  const credit = loadHdfcCsv('credit-underwriting', 'credit_assessment_summary.csv');
  const deviations = loadHdfcCsv('credit-underwriting', 'deviation_register.csv');
  const appId = input.application_id as string | undefined;

  let filtered = credit.rows;
  if (appId && appId !== 'all') {
    filtered = filtered.filter(r => (r.Application_ID || r.App_ID || r.Loan_ID) === appId);
  }

  const recommendations = filtered.map(r => {
    const cibil = Number(r.CIBIL_Score || r.CIBIL || 700);
    const loanAmt = Number(r.Loan_Amount || r.Loan_Amount_Lakhs || 0);
    const riskRating = cibil >= 750 ? 'GREEN' : cibil >= 650 ? 'AMBER' : 'RED';
    const appDevs = deviations.rows.filter(d => (d.Application_ID || d.App_ID) === (r.Application_ID || r.App_ID || r.Loan_ID));
    const decision = riskRating === 'RED' ? 'DECLINE' : appDevs.length > 2 ? 'CONDITIONAL' : 'RECOMMEND_SANCTION';
    return {
      application_id: r.Application_ID || r.App_ID || r.Loan_ID,
      customer: r.Customer_Name || r.Applicant,
      loan_amount_lakhs: loanAmt,
      cibil, risk_rating: riskRating,
      deviations_count: appDevs.length,
      decision,
      conditions: decision === 'CONDITIONAL' ? appDevs.map(d => d.Mitigant || d.Risk_Mitigant || d.Condition).filter(Boolean) : [],
      sanction_authority: loanAmt > 100 ? 'Zonal Credit Committee' : loanAmt > 50 ? 'Regional Credit Head' : 'Branch Credit Manager'
    };
  });

  const byDecision: Record<string, number> = {};
  recommendations.forEach(r => { byDecision[r.decision] = (byDecision[r.decision] || 0) + 1; });

  return JSON.stringify({
    total_recommendations: recommendations.length,
    decision_distribution: byDecision,
    recommendations: recommendations.slice(0, 25),
    summary: `Sanction recommendations generated for ${recommendations.length} applications. ${byDecision.RECOMMEND_SANCTION || 0} recommended, ${byDecision.CONDITIONAL || 0} conditional, ${byDecision.DECLINE || 0} declined.`
  });
}

function execCheckDisbursement(input: Record<string, unknown>): string {
  const tracker = loadHdfcCsv('loan-origination', 'disbursement_tracker.csv');
  const docs = loadHdfcCsv('loan-origination', 'document_checklist.csv');

  const assessed = tracker.rows.map(r => {
    const appId = r.Application_ID || r.App_ID || r.Loan_ID;
    const appDocs = docs.rows.filter(d => (d.Application_ID || d.App_ID) === appId);
    const pendingDocs = appDocs.filter(d => {
      const status = (d.Status || d.Doc_Status || '').toLowerCase();
      return !status.includes('received') && !status.includes('verified') && !status.includes('complete');
    });
    const ready = pendingDocs.length === 0;
    return {
      application_id: appId,
      customer: r.Customer_Name || r.Applicant || r.Borrower,
      loan_amount: r.Loan_Amount || r.Sanctioned_Amount,
      sanction_date: r.Sanction_Date,
      disbursement_status: r.Status || r.Disbursement_Status,
      tranche: r.Tranche || r.Disbursement_Tranche,
      pending_docs: pendingDocs.length,
      ready,
      status: ready ? 'READY_FOR_DISBURSEMENT' : 'PENDING_REQUIREMENTS'
    };
  });

  return JSON.stringify({
    total_cases: assessed.length,
    ready_for_disbursement: assessed.filter(a => a.ready).length,
    pending_requirements: assessed.filter(a => !a.ready).length,
    cases: assessed.slice(0, 25),
    summary: `${assessed.length} cases checked. ${assessed.filter(a => a.ready).length} ready for disbursement, ${assessed.filter(a => !a.ready).length} pending requirements.`
  });
}

function execVerifyPreDisbursement(input: Record<string, unknown>): string {
  const tracker = loadHdfcCsv('loan-origination', 'disbursement_tracker.csv');
  const daysSinceSanction = Number(input.days_since_sanction) || 0;

  const verified = tracker.rows.map(r => {
    const sanctionDate = r.Sanction_Date || r.Date;
    const daysSince = sanctionDate ? Math.floor((Date.now() - new Date(sanctionDate).getTime()) / 86400000) : 0;
    const stale = daysSince > 180;
    const anomalies: string[] = [];
    if (stale) anomalies.push('Sanction older than 180 days — revalidation needed');
    if (!r.Sanction_Date && !r.Date) anomalies.push('Missing sanction date');
    return {
      application_id: r.Application_ID || r.App_ID || r.Loan_ID,
      customer: r.Customer_Name || r.Applicant || r.Borrower,
      sanction_date: sanctionDate,
      days_since_sanction: daysSince,
      stale,
      anomalies,
      status: anomalies.length === 0 ? 'CLEARED' : 'NEEDS_REVALIDATION'
    };
  }).filter(r => r.days_since_sanction >= daysSinceSanction);

  return JSON.stringify({
    total_verified: verified.length,
    cleared: verified.filter(v => v.status === 'CLEARED').length,
    needs_revalidation: verified.filter(v => v.status === 'NEEDS_REVALIDATION').length,
    verifications: verified.slice(0, 25),
    summary: `${verified.length} pre-disbursement checks. ${verified.filter(v => v.status === 'CLEARED').length} cleared, ${verified.filter(v => v.status === 'NEEDS_REVALIDATION').length} need revalidation.`
  });
}

// ─── Stage 7: Portfolio Monitoring Tool Implementations ───

function execMonitorNpa(input: Record<string, unknown>): string {
  const watchlist = loadHdfcCsv('credit-underwriting', 'npa_watchlist.csv');
  const riskLevel = input.risk_level as string | undefined;

  let filtered = watchlist.rows;
  if (riskLevel) {
    filtered = filtered.filter(r => (r.Risk_Level || r.Risk || r.Category || '').toLowerCase().includes(riskLevel.toLowerCase()));
  }

  const byRisk: Record<string, number> = {};
  let totalExposure = 0;
  filtered.forEach(r => {
    const risk = r.Risk_Level || r.Risk || r.Category || 'Unknown';
    byRisk[risk] = (byRisk[risk] || 0) + 1;
    totalExposure += Number(r.Outstanding || r.Exposure || r.Loan_Amount || 0);
  });

  return JSON.stringify({
    total_watchlist: filtered.length,
    risk_distribution: byRisk,
    total_exposure: totalExposure,
    accounts: filtered.slice(0, 25).map(r => ({
      account_id: r.Account_ID || r.Loan_ID || r.ID,
      customer: r.Customer_Name || r.Borrower || r.Name,
      outstanding: r.Outstanding || r.Exposure || r.Loan_Amount,
      dpd: r.DPD || r.Days_Past_Due,
      risk_level: r.Risk_Level || r.Risk || r.Category,
      stress_signals: r.Stress_Signals || r.Warning_Signs || r.Indicators,
      recommended_action: r.Action || r.Recommended_Action || r.Intervention
    })),
    summary: `${filtered.length} accounts on NPA watchlist. Total exposure: ₹${(totalExposure / 100000).toFixed(1)}L. Immediate attention needed.`
  });
}

function execAssessPortfolioRisk(input: Record<string, unknown>): string {
  const portfolio = loadHdfcCsv('compliance-risk', 'risk_assessment_portfolio.csv');
  const focus = input.dimension_focus as string | undefined;

  let filtered = portfolio.rows;
  if (focus) {
    filtered = filtered.filter(r =>
      (r.Risk_Dimension || r.Category || r.Segment || '').toLowerCase().includes(focus.toLowerCase())
    );
  }

  const byDimension: Record<string, { count: number; avgScore: number }> = {};
  filtered.forEach(r => {
    const dim = r.Risk_Dimension || r.Category || r.Segment || 'General';
    if (!byDimension[dim]) byDimension[dim] = { count: 0, avgScore: 0 };
    byDimension[dim].count++;
    byDimension[dim].avgScore += Number(r.Risk_Score || r.Score || 0);
  });
  Object.values(byDimension).forEach(d => { d.avgScore = Math.round(d.avgScore / d.count * 10) / 10; });

  return JSON.stringify({
    total_assessments: filtered.length,
    dimensions: byDimension,
    assessments: filtered.slice(0, 25).map(r => ({
      id: r.ID || r.Assessment_ID,
      dimension: r.Risk_Dimension || r.Category || r.Segment,
      risk_score: r.Risk_Score || r.Score,
      risk_level: r.Risk_Level || r.Rating,
      description: r.Description || r.Assessment,
      mitigation: r.Mitigation || r.Action || r.Recommendation
    })),
    summary: `Portfolio risk assessed across ${Object.keys(byDimension).length} dimensions. ${filtered.length} risk factors evaluated.`
  });
}

function execGenerateEarlyWarnings(input: Record<string, unknown>): string {
  const watchlist = loadHdfcCsv('credit-underwriting', 'npa_watchlist.csv');
  const dpd = loadHdfcCsv('collections-recovery', 'dpd_aging_report.csv');
  const horizon = Number(input.horizon_days) || 90;

  const earlyWarnings = watchlist.rows.map(r => {
    const currentDpd = Number(r.DPD || r.Days_Past_Due || 0);
    const outstanding = Number(r.Outstanding || r.Exposure || r.Loan_Amount || 0);
    const likelihood = currentDpd > 60 ? 'HIGH' : currentDpd > 30 ? 'MEDIUM' : 'LOW';
    const projectedDpd = currentDpd + Math.round(horizon * 0.5);
    const willSlip = projectedDpd > 90;
    return {
      account_id: r.Account_ID || r.Loan_ID || r.ID,
      customer: r.Customer_Name || r.Borrower || r.Name,
      current_dpd: currentDpd,
      outstanding,
      projected_dpd_at_horizon: projectedDpd,
      npa_likelihood: likelihood,
      will_slip_to_npa: willSlip,
      intervention: willSlip ? 'IMMEDIATE CONTACT + RESTRUCTURE OFFER' : likelihood === 'MEDIUM' ? 'PROACTIVE FOLLOW-UP' : 'MONITOR',
      stress_signals: r.Stress_Signals || r.Warning_Signs || r.Indicators
    };
  });

  const highRisk = earlyWarnings.filter(e => e.will_slip_to_npa);
  return JSON.stringify({
    horizon_days: horizon,
    total_monitored: earlyWarnings.length,
    likely_npa_slippage: highRisk.length,
    dpd_report_size: dpd.rowCount,
    early_warnings: earlyWarnings.slice(0, 25),
    summary: `Early warning: ${highRisk.length} of ${earlyWarnings.length} accounts likely to slip to NPA within ${horizon} days. Total DPD portfolio: ${dpd.rowCount} accounts.`
  });
}

// ─── Stage 8: Collections & Recovery Tool Implementations ───

function execAnalyzeDpdAging(input: Record<string, unknown>): string {
  const dpd = loadHdfcCsv('collections-recovery', 'dpd_aging_report.csv');
  const bucketFilter = input.bucket_filter as string | undefined;

  let filtered = dpd.rows;
  if (bucketFilter) {
    filtered = filtered.filter(r => (r.DPD_Bucket || r.Bucket || r.Category || '').includes(bucketFilter));
  }

  const byBucket: Record<string, { count: number; totalAmount: number }> = {};
  filtered.forEach(r => {
    const bucket = r.DPD_Bucket || r.Bucket || r.Category || 'Unknown';
    if (!byBucket[bucket]) byBucket[bucket] = { count: 0, totalAmount: 0 };
    byBucket[bucket].count++;
    byBucket[bucket].totalAmount += Number(r.Outstanding || r.Amount || r.Loan_Amount || 0);
  });

  return JSON.stringify({
    total_accounts: filtered.length,
    bucket_distribution: byBucket,
    accounts: filtered.slice(0, 25).map(r => ({
      account_id: r.Account_ID || r.Loan_ID || r.ID,
      customer: r.Customer_Name || r.Borrower || r.Name,
      dpd_bucket: r.DPD_Bucket || r.Bucket || r.Category,
      dpd_days: r.DPD_Days || r.DPD || r.Days,
      outstanding: r.Outstanding || r.Amount || r.Loan_Amount,
      product: r.Product || r.Loan_Type,
      branch: r.Branch || r.Location,
      last_payment: r.Last_Payment_Date || r.Last_Receipt
    })),
    summary: `${filtered.length} accounts analyzed across ${Object.keys(byBucket).length} DPD buckets. Aging pattern complete.`
  });
}

function execEvalCollectionPerf(input: Record<string, unknown>): string {
  const performance = loadHdfcCsv('collections-recovery', 'collection_performance.csv');
  const agencyFilter = input.agency_filter as string | undefined;

  let filtered = performance.rows;
  if (agencyFilter) {
    filtered = filtered.filter(r => (r.Agency_Name || r.Agency || r.Collector || '').toLowerCase().includes(agencyFilter.toLowerCase()));
  }

  const byAgency: Record<string, { allocated: number; collected: number; cases: number }> = {};
  filtered.forEach(r => {
    const agency = r.Agency_Name || r.Agency || r.Collector || 'Unknown';
    if (!byAgency[agency]) byAgency[agency] = { allocated: 0, collected: 0, cases: 0 };
    byAgency[agency].allocated += Number(r.Allocated_Amount || r.Target || 0);
    byAgency[agency].collected += Number(r.Collected_Amount || r.Actual || r.Recovery || 0);
    byAgency[agency].cases++;
  });

  const agencyScores = Object.entries(byAgency).map(([agency, data]) => ({
    agency,
    cases: data.cases,
    allocated: data.allocated,
    collected: data.collected,
    efficiency: data.allocated > 0 ? `${Math.round(data.collected / data.allocated * 100)}%` : 'N/A',
    rating: data.allocated > 0 && data.collected / data.allocated > 0.7 ? 'HIGH' : data.collected / data.allocated > 0.4 ? 'MEDIUM' : 'LOW'
  })).sort((a, b) => Number(b.collected) - Number(a.collected));

  return JSON.stringify({
    total_entries: filtered.length,
    agency_count: agencyScores.length,
    agency_performance: agencyScores,
    detailed: filtered.slice(0, 20).map(r => ({
      id: r.ID || r.Record_ID,
      agency: r.Agency_Name || r.Agency || r.Collector,
      bucket: r.DPD_Bucket || r.Bucket,
      allocated: r.Allocated_Amount || r.Target,
      collected: r.Collected_Amount || r.Actual || r.Recovery,
      status: r.Status || r.Collection_Status
    })),
    summary: `${agencyScores.length} agencies evaluated. Top performer: ${agencyScores[0]?.agency} (${agencyScores[0]?.efficiency} efficiency).`
  });
}

function execAssessRecoveryOptions(input: Record<string, unknown>): string {
  const sarfaesi = loadHdfcCsv('collections-recovery', 'sarfaesi_tracker.csv');
  const ots = loadHdfcCsv('collections-recovery', 'ots_proposals.csv');
  const strategyFilter = input.strategy_filter as string | undefined;

  const sarfaesiCases = sarfaesi.rows.slice(0, 20).map(r => ({
    case_id: r.Case_ID || r.ID || r.Loan_ID,
    customer: r.Customer_Name || r.Borrower || r.Name,
    outstanding: r.Outstanding || r.Amount,
    stage: r.Stage || r.SARFAESI_Stage || r.Status,
    property_value: r.Property_Value || r.Security_Value,
    strategy: 'SARFAESI',
    recovery_estimate: r.Expected_Recovery || r.Recovery_Estimate
  }));

  const otsCases = ots.rows.slice(0, 20).map(r => ({
    proposal_id: r.Proposal_ID || r.ID || r.OTS_ID,
    customer: r.Customer_Name || r.Borrower || r.Name,
    outstanding: r.Outstanding || r.Total_Due,
    ots_amount: r.OTS_Amount || r.Settlement_Amount,
    discount: r.Discount_Percent || r.Haircut,
    strategy: 'OTS',
    status: r.Status || r.OTS_Status,
    recommendation: r.Recommendation || r.Decision
  }));

  let allOptions = [...sarfaesiCases.map(c => ({ ...c, type: 'SARFAESI' })), ...otsCases.map(c => ({ ...c, type: 'OTS' }))];
  if (strategyFilter) {
    allOptions = allOptions.filter(o => o.type.toLowerCase().includes(strategyFilter.toLowerCase()));
  }

  return JSON.stringify({
    sarfaesi_cases: sarfaesi.rowCount,
    ots_proposals: ots.rowCount,
    total_options: allOptions.length,
    sarfaesi_details: sarfaesiCases,
    ots_details: otsCases,
    summary: `Recovery options assessed: ${sarfaesi.rowCount} SARFAESI cases, ${ots.rowCount} OTS proposals. Strategy recommendations generated.`
  });
}

// ─── Stage 9: Service & CX Tool Implementations ───

function execAnalyzeComplaints(input: Record<string, unknown>): string {
  const complaints = loadHdfcCsv('service-ops', 'customer_complaints.csv');
  const categoryFilter = input.category_filter as string | undefined;
  const branchFilter = input.branch_filter as string | undefined;

  let filtered = complaints.rows;
  if (categoryFilter) {
    filtered = filtered.filter(r => (r.Category || r.Complaint_Category || r.Type || '').toLowerCase().includes(categoryFilter.toLowerCase()));
  }
  if (branchFilter) {
    filtered = filtered.filter(r => (r.Branch || r.Branch_Name || r.Location || '').toLowerCase().includes(branchFilter.toLowerCase()));
  }

  const byCategory: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  filtered.forEach(r => {
    const cat = r.Category || r.Complaint_Category || r.Type || 'Unknown';
    const sev = r.Severity || r.Priority || 'Medium';
    const st = r.Status || r.Complaint_Status || 'Open';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
    bySeverity[sev] = (bySeverity[sev] || 0) + 1;
    byStatus[st] = (byStatus[st] || 0) + 1;
  });

  return JSON.stringify({
    total_complaints: filtered.length,
    category_distribution: byCategory,
    severity_distribution: bySeverity,
    status_distribution: byStatus,
    complaints: filtered.slice(0, 25).map(r => ({
      complaint_id: r.Complaint_ID || r.ID || r.Ticket_ID,
      customer: r.Customer_Name || r.Name,
      category: r.Category || r.Complaint_Category || r.Type,
      severity: r.Severity || r.Priority,
      description: r.Description || r.Complaint,
      branch: r.Branch || r.Branch_Name || r.Location,
      status: r.Status || r.Complaint_Status,
      sla_met: r.SLA_Met || r.Within_SLA,
      resolution: r.Resolution || r.Action_Taken
    })),
    summary: `${filtered.length} complaints analyzed. Top category: ${Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0]}. SLA compliance being tracked.`
  });
}

function execAssessCustomerNps(input: Record<string, unknown>): string {
  const nps = loadHdfcCsv('service-ops', 'nps_survey_results.csv');
  const segmentFilter = input.segment_filter as string | undefined;

  let filtered = nps.rows;
  if (segmentFilter) {
    filtered = filtered.filter(r => (r.Segment || r.Customer_Segment || r.Category || '').toLowerCase().includes(segmentFilter.toLowerCase()));
  }

  let promoters = 0, detractors = 0, passives = 0;
  const themes: Record<string, number> = {};
  filtered.forEach(r => {
    const score = Number(r.NPS_Score || r.Score || r.Rating || 0);
    if (score >= 9) promoters++;
    else if (score <= 6) detractors++;
    else passives++;
    const theme = r.Feedback_Theme || r.Theme || r.Category || 'General';
    themes[theme] = (themes[theme] || 0) + 1;
  });

  const npsScore = filtered.length > 0 ? Math.round((promoters - detractors) / filtered.length * 100) : 0;

  return JSON.stringify({
    total_responses: filtered.length,
    nps_score: npsScore,
    promoters, passives, detractors,
    promoter_pct: filtered.length > 0 ? `${Math.round(promoters / filtered.length * 100)}%` : '0%',
    detractor_pct: filtered.length > 0 ? `${Math.round(detractors / filtered.length * 100)}%` : '0%',
    feedback_themes: themes,
    responses: filtered.slice(0, 20).map(r => ({
      response_id: r.Response_ID || r.ID,
      customer: r.Customer_Name || r.Name,
      score: r.NPS_Score || r.Score || r.Rating,
      segment: r.Segment || r.Customer_Segment,
      theme: r.Feedback_Theme || r.Theme,
      verbatim: r.Verbatim || r.Comments || r.Feedback,
      branch: r.Branch || r.Branch_Name
    })),
    summary: `NPS Score: ${npsScore}. ${filtered.length} responses. Promoters: ${promoters}, Passives: ${passives}, Detractors: ${detractors}.`
  });
}

function execIdentifyCrossSell(input: Record<string, unknown>): string {
  const services = loadHdfcCsv('service-ops', 'service_requests.csv');
  const walkins = loadHdfcCsv('service-ops', 'branch_walkin_log.csv');
  const productFocus = input.product_focus as string | undefined;

  const opportunities = walkins.rows.map(r => {
    const purpose = (r.Purpose || r.Visit_Purpose || r.Query || '').toLowerCase();
    const products: string[] = [];
    if (purpose.includes('home') || purpose.includes('loan')) products.push('Top-up Loan', 'Home Insurance');
    if (purpose.includes('account') || purpose.includes('savings')) products.push('CASA Upgrade', 'Fixed Deposit');
    if (purpose.includes('card') || purpose.includes('credit')) products.push('Premium Credit Card');
    if (purpose.includes('insurance') || purpose.includes('policy')) products.push('Life Insurance', 'Health Insurance');
    if (products.length === 0) products.push('Credit Card', 'Personal Loan', 'Insurance');
    return {
      walkin_id: r.Walkin_ID || r.ID || r.Token_No,
      customer: r.Customer_Name || r.Name || r.Visitor,
      purpose: r.Purpose || r.Visit_Purpose || r.Query,
      branch: r.Branch || r.Branch_Name,
      date: r.Date || r.Visit_Date,
      cross_sell_products: products,
      potential_value: products.length > 2 ? 'HIGH' : 'MEDIUM'
    };
  });

  let result = opportunities;
  if (productFocus) {
    result = result.filter(o => o.cross_sell_products.some(p => p.toLowerCase().includes(productFocus.toLowerCase())));
  }

  const productCounts: Record<string, number> = {};
  result.forEach(o => o.cross_sell_products.forEach(p => { productCounts[p] = (productCounts[p] || 0) + 1; }));

  return JSON.stringify({
    total_opportunities: result.length,
    service_requests: services.rowCount,
    product_opportunity_distribution: productCounts,
    opportunities: result.slice(0, 25),
    summary: `${result.length} cross-sell opportunities identified from ${walkins.rowCount} walk-ins. Top product: ${Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0]}.`
  });
}
