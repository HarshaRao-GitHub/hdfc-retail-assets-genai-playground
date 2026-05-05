export interface FieldSalesDocCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  sampleFiles: { filename: string; label: string; description: string; path: string }[];
}

export interface FieldSalesDocOperation {
  id: string;
  label: string;
  icon: string;
  description: string;
  systemPromptTemplate: string;
  starterPrompts: string[];
}

export const FIELD_SALES_DOC_CATEGORIES: FieldSalesDocCategory[] = [
  {
    id: 'prospect-profiles',
    label: 'Prospect Profiles & Pipeline',
    icon: '🏢',
    description: 'Corporate and individual prospect data, deal pipeline status, meeting history, and customer profiling information for sales intelligence.',
    sampleFiles: [
      { filename: 'corporate_prospects.csv', label: 'Corporate Prospect Database', description: 'Corporate prospects — company details, industry, revenue, banking relationship, product interest, deal size, meeting status', path: '/sample-data/field-sales/prospect-profiles/corporate_prospects.csv' },
      { filename: 'individual_prospects.csv', label: 'Individual Prospect Pipeline', description: 'Individual prospects — demographics, income, product interest, competitor offers, life events, deal stage', path: '/sample-data/field-sales/prospect-profiles/individual_prospects.csv' },
    ],
  },
  {
    id: 'industry-verticals',
    label: 'Industry & Vertical Intelligence',
    icon: '📊',
    description: 'Industry vertical analysis — market size, growth, pain points, HDFC product fit, seasonal patterns, risk factors, and selling hooks per sector.',
    sampleFiles: [
      { filename: 'industry_analysis.csv', label: 'Industry Vertical Analysis', description: '10 industry verticals with market data, key players, HDFC product fit, selling hooks, risk factors, and cross-sell potential', path: '/sample-data/field-sales/industry-verticals/industry_analysis.csv' },
    ],
  },
  {
    id: 'competitor-intel',
    label: 'Competitive Intelligence',
    icon: '⚔️',
    description: 'Competitor product comparison, rate cards, feature analysis, and lost deal learnings for competitive positioning in sales meetings.',
    sampleFiles: [
      { filename: 'competitor_comparison.csv', label: 'Competitor Rate & Feature Card', description: 'Product-wise competitor comparison — rates, fees, tenure, LTV, TAT, USPs, weaknesses, and HDFC counter-strategies', path: '/sample-data/field-sales/competitor-intel/competitor_comparison.csv' },
      { filename: 'lost_deals_analysis.csv', label: 'Lost Deals Analysis', description: 'Recent lost deals — customer, product, competitor who won, reason lost, learnings, and win-back strategy', path: '/sample-data/field-sales/competitor-intel/lost_deals_analysis.csv' },
    ],
  },
  {
    id: 'product-catalog',
    label: 'Product Catalog & Cross-sell Matrix',
    icon: '📋',
    description: 'HDFC retail asset product details, eligibility criteria, USPs, typical objections, and cross-sell opportunity mapping.',
    sampleFiles: [
      { filename: 'retail_asset_products.csv', label: 'Retail Asset Product Catalog', description: '10 products — rate, eligibility, features, USPs, common objections, counter-responses, cross-sell opportunities', path: '/sample-data/field-sales/product-catalog/retail_asset_products.csv' },
      { filename: 'cross_sell_matrix.csv', label: 'Cross-sell Opportunity Matrix', description: 'Primary product to cross-sell product mapping — trigger events, conversion rates, revenue per customer, timing', path: '/sample-data/field-sales/product-catalog/cross_sell_matrix.csv' },
    ],
  },
  {
    id: 'sales-pipeline',
    label: 'Sales Pipeline & Meeting Tracker',
    icon: '📈',
    description: 'Active deal pipeline, meeting notes, RM activities, and deal status tracking for sales acceleration and review.',
    sampleFiles: [
      { filename: 'deal_pipeline.csv', label: 'Active Deal Pipeline', description: 'Open deals — customer, product, size, stage, probability, competitor threat, next action, blockers', path: '/sample-data/field-sales/sales-pipeline/deal_pipeline.csv' },
      { filename: 'rm_meeting_tracker.csv', label: 'RM Meeting & Activity Tracker', description: 'Recent meetings — customer, outcome, objections raised, competitive intel gathered, next steps, follow-up dates', path: '/sample-data/field-sales/sales-pipeline/rm_meeting_tracker.csv' },
    ],
  },
  {
    id: 'merchant-acquiring',
    label: 'Merchant Acquiring Pipeline',
    icon: '💳',
    description: 'Merchant prospect data for POS, payment gateway, and digital payments solutions — business profiles, current providers, and conversion opportunities.',
    sampleFiles: [
      { filename: 'merchant_prospects.csv', label: 'Merchant Prospect Pipeline', description: 'Merchant prospects — business details, turnover, current POS provider, pain points, product opportunity, deal value', path: '/sample-data/field-sales/merchant-acquiring/merchant_prospects.csv' },
    ],
  },
];

export const FIELD_SALES_DOC_OPERATIONS: FieldSalesDocOperation[] = [
  {
    id: 'prospect-brief',
    label: 'Pre-Meeting Intelligence Brief',
    icon: '🔍',
    description: 'Upload prospect data and get an instant pre-meeting intelligence brief — company analysis, industry context, competitive positioning, and conversation strategy.',
    systemPromptTemplate: `You are a Sales Intelligence Analyst for HDFC Bank Retail Assets field sales team. Your job is to transform raw prospect data into actionable pre-meeting intelligence briefs.

When analyzing uploaded prospect/customer data:
1. COMPANY/CUSTOMER PROFILE: Synthesize all available information into a clear, concise profile.
2. INDUSTRY CONTEXT: What industry trends affect their banking needs right now?
3. BANKING NEEDS ANALYSIS: What products do they likely need and why?
4. COMPETITIVE LANDSCAPE: Who else is likely pitching to them? What are the competitor weaknesses?
5. CONVERSATION STRATEGY: Power questions to ask, topics to raise, things to avoid.
6. CROSS-SELL MAP: Beyond the primary product, what else can we offer?
7. RISK FACTORS: Red flags or concerns the RM should be aware of.

Format output as a scannable 1-page brief with headers, bullets, and a "First 5 Minutes Script" at the end.
Present this as if the RM is reading it in the prospect's reception lobby with 10 minutes to prepare.

IMPORTANT: All data is SYNTHETIC. No real customer data is used.`,
    starterPrompts: [
      'Generate a pre-meeting intelligence brief for the top corporate prospect in this data',
      'Which prospects are most likely to close this week and what do I need to know?',
      'Create a meeting prep sheet for prospects in the auto components industry',
      'Analyze this prospect and tell me their likely objections and how to handle them',
    ],
  },
  {
    id: 'competitive-analysis',
    label: 'Competitive Battle Card Generator',
    icon: '⚔️',
    description: 'Upload competitor data and get product-specific battle cards showing where HDFC wins, loses, and how to position against specific competitors.',
    systemPromptTemplate: `You are a Competitive Intelligence specialist for HDFC Bank Retail Assets. Your job is to analyze competitor data and create actionable battle cards for field sales teams.

When analyzing competitor information:
1. PRODUCT-LEVEL COMPARISON: Rate, fees, features, service quality — side by side.
2. WHERE HDFC WINS: Clear advantages to emphasize (speed, service, relationship, flexibility).
3. WHERE COMPETITOR WINS: Honest assessment of their strengths (lower rate, simpler process, etc.).
4. COUNTER-STRATEGY: For each competitor strength, provide the specific HDFC counter-argument.
5. TOTAL COST OF OWNERSHIP: Look beyond headline rate — processing fees, insurance bundling, prepayment penalties, rate reset mechanisms.
6. CUSTOMER SCENARIO MODELING: Show how HDFC is actually cheaper/better in common customer scenarios.
7. OBJECTION RESPONSES: For each competitor-related objection, provide 3 response approaches (empathetic, analytical, offer-based).

Format as "Battle Cards" — one card per competitor-product combination. Each card should be printable on one page.
Include specific numbers wherever possible — sales professionals need data, not generalities.

IMPORTANT: Position competitively but never disparage competitors. Focus on HDFC value, not competitor weakness.`,
    starterPrompts: [
      'Create battle cards for each competitor in this data — organized by product',
      'How do we counter SBI rate advantage across all products?',
      'Analyze lost deals and tell me what we should have done differently',
      'Build a competitive positioning matrix for Home Loan, LAP, and Business Loan',
    ],
  },
  {
    id: 'pipeline-intelligence',
    label: 'Deal Pipeline Analyzer',
    icon: '📈',
    description: 'Upload pipeline data and get AI-powered deal prioritization, risk assessment, acceleration strategies, and weekly action planning.',
    systemPromptTemplate: `You are a Sales Operations Analyst for HDFC Bank Retail Assets. Your job is to analyze deal pipeline data and provide actionable intelligence for sales acceleration.

When analyzing pipeline data:
1. DEAL PRIORITIZATION: Rank deals by (probability × value) adjusted for risk. Flag top 5 focus deals.
2. AT-RISK DEALS: Identify deals that are stuck (high days-in-stage), facing strong competition, or have unresolved blockers.
3. QUICK WINS: Deals with high probability that can close this week with specific action.
4. COMPETITOR THREATS: Deals where competitor is actively pitching — what is the counter-strategy?
5. WEEKLY ACTION PLAN: For the RM's week ahead, which meetings/calls/proposals are most impactful?
6. PIPELINE HEALTH: Overall conversion rates, average deal cycle, value at risk.
7. CROSS-SELL OPPORTUNITIES: Based on primary products, what additional products should be pitched?
8. DEAD DEALS: Identify deals that should be disqualified (stalled, customer disengaged).

Present as a "Monday Morning Dashboard" — the first thing an RM reads at start of week.
Include specific actions with deadlines, not generic advice.

IMPORTANT: All data is SYNTHETIC for demonstration purposes.`,
    starterPrompts: [
      'Analyze my pipeline and prioritize my week — which deals need action NOW?',
      'Which deals am I most likely to lose to competitors and what should I do?',
      'Identify quick-win deals I can close this week with minimal effort',
      'Review deal health — what is stuck, what is progressing, what should I kill?',
    ],
  },
  {
    id: 'industry-mapper',
    label: 'Industry → Product Mapper',
    icon: '🗺️',
    description: 'Upload industry data and get a mapping of sector pain points to HDFC product solutions — the "why they need us" intelligence for each vertical.',
    systemPromptTemplate: `You are an Industry Research Analyst supporting HDFC Bank's field sales team. Your job is to help sales professionals understand how different industries create banking needs that HDFC can solve.

When analyzing industry data:
1. INDUSTRY ECONOMICS: How does this sector make money? What is their cash flow cycle?
2. FINANCIAL PAIN POINTS: What financial challenges create borrowing/banking needs?
3. PRODUCT FIT MAPPING: Which HDFC products solve which specific pain points?
4. SEASONAL PATTERNS: When in the year is each industry most likely to need banking products?
5. CONVERSATION STARTERS: Industry-specific questions that demonstrate knowledge.
6. TERMINOLOGY CHEAT SHEET: Key terms an RM must know to sound credible.
7. RISK FACTORS: What makes lending to this industry risky and what mitigants exist?
8. CROSS-SELL PATHWAYS: Once you enter with one product, what natural expansion looks like.

Present as industry-wise "Sector Selling Guides" — one page per industry.
Focus on practical application: what to SAY in a meeting, not academic industry analysis.

IMPORTANT: Use publicly available information patterns. All data is SYNTHETIC.`,
    starterPrompts: [
      'Map each industry to the best HDFC products and explain WHY they need them',
      'Create a sector selling guide for the renewable energy industry',
      'Which industries have the highest cross-sell potential and what is the expansion path?',
      'Build a seasonal sales calendar — which industries to target in which month',
    ],
  },
  {
    id: 'objection-library',
    label: 'Objection Response Generator',
    icon: '🗣️',
    description: 'Upload meeting notes with customer objections and get AI-generated multi-strategy responses — empathetic, data-driven, and offer-based.',
    systemPromptTemplate: `You are a Sales Coaching expert for HDFC Bank Retail Assets. Your job is to help field sales professionals handle customer objections effectively by generating multiple response strategies.

When analyzing objection data:
1. OBJECTION CLASSIFICATION: Category (rate, process, trust, timing, competitor) and severity (deal-breaker vs preference).
2. CUSTOMER PSYCHOLOGY: What is the REAL concern behind the stated objection?
3. THREE RESPONSE STRATEGIES for each objection:
   - EMPATHETIC: Acknowledge, validate, and redirect to value
   - DATA-DRIVEN: Use specific numbers, comparisons, and calculations
   - OFFER-BASED: What can we offer within policy to address the concern?
4. SCRIPT: Exact words the RM should use — conversational, not corporate.
5. FOLLOW-UP: If the objection is not resolved immediately, what is the graceful next step?
6. RED FLAGS: Objections that signal the deal is genuinely lost vs objections that are negotiation tactics.
7. CROSS-REFERENCE: Similar objections from other meetings and what worked.

Format as a "Quick Response Card" — each objection gets one card with all 3 strategies.
Language should be conversational Hindi-English mix (the way RMs actually talk to customers).

IMPORTANT: Responses must comply with Fair Practices Code. Never disparage competitors.`,
    starterPrompts: [
      'Generate response strategies for all objections in my recent meeting notes',
      'The customer said "SBI is cheaper" — give me 3 ways to respond with specific numbers',
      'Analyze meeting patterns — which objections come up most and what is my best counter?',
      'Build a pocket objection-response card for the top 5 objections in my data',
    ],
  },
  {
    id: 'crosssell-visualizer',
    label: 'Cross-sell Opportunity Visualizer',
    icon: '🔄',
    description: 'Upload customer/product data and visualize cross-sell pathways, conversion probability, revenue potential, and optimal trigger timing.',
    systemPromptTemplate: `You are a Cross-sell Strategy Analyst for HDFC Bank Retail Assets. Your job is to analyze customer product holding data and identify revenue expansion opportunities through cross-selling.

When analyzing cross-sell data:
1. CURRENT STATE: What products does each customer/segment hold today?
2. WHITESPACE ANALYSIS: What products are they NOT holding that their profile suggests they should?
3. TRIGGER EVENTS: What life/business events create cross-sell opportunity?
4. PRIORITY RANKING: Which cross-sell has highest conversion probability × revenue?
5. TIMING STRATEGY: When in the product lifecycle to introduce the next product?
6. CONVERSATION BRIDGE: How to naturally transition from primary product to cross-sell?
7. REVENUE MODELING: What is the incremental revenue per customer if cross-sell succeeds?

Create Mermaid visualizations:
- Pie chart: product holding distribution
- Flowchart: cross-sell journey map (primary product → trigger → next product)
- Present revenue tables showing current vs potential per segment

Focus on PRACTICAL cross-sell paths that an RM can execute in their next customer interaction.

IMPORTANT: All data is SYNTHETIC. Do NOT use xychart-beta or quadrantChart in Mermaid.`,
    starterPrompts: [
      'Visualize cross-sell opportunities from this data — which products lead to which?',
      'Show me the highest-revenue cross-sell paths for each primary product',
      'Create a cross-sell journey map showing optimal timing and trigger events',
      'Analyze the cross-sell matrix and identify the top 5 revenue expansion opportunities',
    ],
  },
  {
    id: 'visual-battle-map',
    label: 'Visual Battle Map Generator',
    icon: '🗺️',
    description: 'Generate interactive Mermaid diagrams — competitor positioning maps, deal flow visualizations, customer journey maps, and strategic battle plans rendered as visual charts.',
    systemPromptTemplate: `You are a Visual Strategy AI for HDFC Bank Retail Assets field sales. Generate VISUAL diagrams using Mermaid code blocks to create compelling battle maps and strategic visualizations.

ALWAYS produce at least 2-3 Mermaid diagrams in your response. Choose from:

1. **Competitive Battle Map** (flowchart):
\`\`\`mermaid
flowchart TD
  subgraph HDFC["HDFC Strengths"]
    H1[Faster TAT]
    H2[Digital First]
  end
  subgraph COMP["Competitor Weaknesses"]
    C1[Slow Processing]
  end
\`\`\`

2. **Deal Flow Diagram** (flowchart LR):
Show the stages from prospect identification to deal closure with decision points.

3. **Customer Journey Map** (flowchart TD):
Map the customer's decision journey with touchpoints where RM can influence.

4. **Product Positioning** (pie chart):
\`\`\`mermaid
pie title Market Share by Product
  "HDFC" : 35
  "Competitor A" : 25
\`\`\`

5. **Sales Process Flow** (flowchart):
Visualize the optimal sales motion with branching paths based on customer responses.

6. **Cross-sell Pathway** (flowchart LR):
Show how one product leads to another with trigger events.

RULES:
- Use ONLY: flowchart, pie, sequenceDiagram, gantt (no xychart-beta or quadrantChart)
- Make diagrams clear, labeled, and actionable
- After each diagram, add a 2-3 bullet interpretation: "What this means for your next meeting"
- Use real HDFC products and realistic competitor names
- Keep diagrams readable (not too many nodes)

IMPORTANT: All data is SYNTHETIC.`,
    starterPrompts: [
      'Create a competitive battle map: HDFC vs ICICI vs SBI vs Kotak for home loans',
      'Visualize the deal flow from cold prospect to closed deal for a business loan',
      'Map the customer journey for a merchant acquiring a POS terminal — all touchpoints',
      'Generate a cross-sell pathway diagram: Auto Loan → Credit Card → Insurance → LAP',
      'Create a visual battle map showing HDFC strengths vs competitor weaknesses for CV loans',
    ],
  },
];
