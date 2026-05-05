# Field Sales AI Module — Complete Reference Guide

## Strategic Objective

This module is **OUTWARD-LOOKING**. The objective is NOT to help participants ease their internal daily work using AI on internal bank documents. The objective is to make them **better business-development / sales professionals** by using AI for:

- Pre-meeting prospect & industry research
- Competitive positioning vs. other banks
- Anticipating and overcoming customer objections
- Personalising the pitch
- Closing more deals

### Anchor Scenario

> "I'm sitting in the client's reception lobby, hoping to onboard them today — what services should I talk about, what should I understand about this industry, how do I make myself a more enhanced sales person right now?"

---

## Product Lines Covered (PRIMARY CONTENT FOCUS)

| Category | Products |
|----------|----------|
| **Unsecured Loans** | Personal Loans (individuals), Business Loans (SME/entities) |
| **Vehicle & Asset Finance** | Auto Loans, Tractor Finance, Commercial Vehicle Loans (B2B + B2C) |
| **Secured / Mortgage Loans** | Home Loans, Loan Against Property (LAP) |
| **Payments Business** | Credit Cards, Merchant Acquiring (POS terminals), Payment Gateway |

---

## Module Structure

| Route | Sub-Module | Purpose |
|-------|-----------|---------|
| `/field-sales-ai` | Hub/Dashboard | Module overview, anchor scenario, Before/During/After framework, learning outcomes |
| `/field-sales-ai/prompting` | Prompt Engineering Lab | 6 CRAFT-ladder experiments (L1→L4) for field sales |
| `/field-sales-ai/doc-intelligence` | Document Intelligence & Visualization | 6 analysis operations on sales data with Mermaid charts |
| `/field-sales-ai/sales-growth` | Sales & Growth AI | 4 modes: Prospect Research, Objection Handling, Deal Closing, Pitch Builder |
| `/field-sales-ai/use-cases` | Use Case Library | 24 use cases across 8 categories |

---

## Before / During / After Framework

### BEFORE the Meeting
| Capability | Description |
|-----------|-------------|
| Prospect Research | Company financials, industry trends, recent news, key decision-makers |
| Industry Intelligence | Sector-specific pain points, regulatory changes, competitive dynamics |
| Competitor Analysis | What the competitor offers, their weaknesses, positioning strategy |
| Objection Anticipation | Pre-build responses to likely pushbacks based on customer profile |
| Meeting Strategy | Conversation plan, power questions, opening rapport-builders |

### DURING the Meeting
| Capability | Description |
|-----------|-------------|
| Real-time Pitch Tailoring | Adjust messaging based on customer signals and questions raised |
| Quick Calculations | EMI estimates, total cost comparisons, eligibility checks on the spot |
| Objection Counters | Access pre-prepared responses to handle unexpected objections |
| Cross-sell Triggers | Identify and propose relevant additional products |
| Competitive Positioning | Instant comparison data when competitor is mentioned |

### AFTER the Meeting
| Capability | Description |
|-----------|-------------|
| Meeting Notes → Actions | Convert raw notes to structured follow-ups with owners and deadlines |
| Proposal Drafting | Generate customized proposals incorporating meeting discussion points |
| Follow-up Communication | Draft personalized follow-up emails referencing specific conversation points |
| Pipeline Update | Structure meeting outcomes for CRM entry |
| Deal Strategy Refinement | Adjust approach based on new information gathered |

---

## Data Files — Complete Inventory

### CSV Data Files (9 files)

#### 1. `public/sample-data/field-sales/prospect-profiles/corporate_prospects.csv`
**Purpose:** Corporate prospect database for pre-meeting research exercises

| Column | Description |
|--------|-------------|
| prospect_id | Unique identifier (CP001-CP012) |
| company_name | Company name |
| industry | Industry vertical |
| annual_revenue_cr | Annual revenue in crores |
| employee_count | Number of employees |
| city | Location |
| state | State |
| existing_banker | Current banking relationship |
| products_used | Products currently used with existing banker |
| key_contact | Decision-maker name |
| designation | Contact's role |
| meeting_status | Current deal status |
| deal_size_cr | Estimated deal value in crores |
| product_interest | HDFC products they need |
| last_contact_date | Most recent interaction |
| notes | Contextual sales notes |

**Sample Companies:** Pinnacle Auto Components (Pune), GreenLeaf Agri Exports (Nashik), TechVista Solutions (Hyderabad), Sharma Construction (Jaipur), Bharat Logistics (Mumbai), Wellness First Hospitals (Bangalore), FreshKart Retail (Chennai), SolarTech Energy (Ahmedabad), Vishal Mega Mart Franchise (Lucknow), Oceanic Shipping (Mumbai), Kisan Agro Industries (Indore), Metro Cabs (Delhi NCR)

---

#### 2. `public/sample-data/field-sales/prospect-profiles/individual_prospects.csv`
**Purpose:** Individual prospect pipeline with competitor offers and life events

| Column | Description |
|--------|-------------|
| prospect_id | Unique identifier (IP001-IP010) |
| name | Customer name |
| age | Age |
| occupation | Profession |
| employer | Employer/business |
| annual_income_lpa | Annual income in LPA |
| city | Location |
| existing_bank | Current primary bank |
| credit_score | CIBIL score |
| product_interest | Products interested in |
| deal_size_lakhs | Deal value in lakhs |
| stage | Pipeline stage |
| source | Lead source |
| rm_assigned | Relationship Manager |
| last_interaction | Last contact date |
| life_event | Trigger event (marriage, promotion, expansion, etc.) |
| competitor_offer | What competitor has offered |
| notes | Contextual notes with selling challenge |

**Sample Profiles:** IT professional getting married (SBI competitor), Self-employed dentist (ICICI competitor), Farmer wanting tractor (BoB/Mahindra Finance), IT couple first-time buyers (Kotak competitor), Textile businessman, Google PM (existing customer upsell), Retired bank manager (son's home), Govt teacher, CA with practice, Doctor-professor couple (Federal Bank relationship)

---

#### 3. `public/sample-data/field-sales/industry-verticals/industry_analysis.csv`
**Purpose:** Industry vertical intelligence for rapid sector learning

| Column | Description |
|--------|-------------|
| industry_vertical | Sector name |
| market_size_cr | Market size in crores |
| growth_rate_pct | Annual growth percentage |
| key_players | Major companies in the sector |
| hdfc_product_fit | Which HDFC products match |
| typical_loan_size_lakhs | Typical deal size range |
| avg_deal_cycle_days | Average days to close |
| key_pain_points | Financial pain points creating banking needs |
| selling_hooks | What resonates in sales conversations |
| seasonal_peak | When they buy most |
| risk_factors | Lending risks in this sector |
| cross_sell_potential | Additional products to offer |

**Industries Covered:** Auto Components & OEM, Agriculture & Food Processing, IT & Software Services, Healthcare & Pharma, Real Estate & Construction, Retail & FMCG, Transportation & Logistics, Education & Ed-Tech, Renewable Energy & EV, Textiles & Garments

---

#### 4. `public/sample-data/field-sales/competitor-intel/competitor_comparison.csv`
**Purpose:** Product-level competitive analysis with counter-strategies

| Column | Description |
|--------|-------------|
| competitor | Bank/NBFC name |
| product | Product category |
| interest_rate_pct | Rate range |
| processing_fee_pct | Processing fee |
| max_tenure_years | Maximum tenure |
| max_ltv_pct | Maximum LTV ratio |
| min_credit_score | Minimum CIBIL score required |
| disbursement_tat_days | Processing time |
| prepayment_charges | Prepayment/foreclosure terms |
| usp | Their key selling point |
| weakness | Their known weakness |
| hdfc_counter_strategy | How HDFC should position against them |

**Competitors Covered:** SBI (Personal Loan, Home Loan, Auto Loan, LAP, CV Loan), ICICI Bank (Personal Loan, Home Loan, LAP), Kotak Mahindra (Home Loan), Bajaj Finance (Business Loan), Axis Bank (Auto Loan), Mahindra Finance (Tractor Finance), Paytm/Pine Labs (Merchant Acquiring), Razorpay (Payment Gateway)

---

#### 5. `public/sample-data/field-sales/competitor-intel/lost_deals_analysis.csv`
**Purpose:** Post-mortem on lost deals with win-back strategies

| Column | Description |
|--------|-------------|
| deal_id | Identifier (LD001-LD008) |
| customer_name | Customer/company |
| product | Product lost |
| deal_size_lakhs | Deal value |
| competitor_won | Who won the deal |
| reason_lost | Primary loss reason |
| specific_detail | Detailed context |
| rm_name | RM who lost it |
| branch | Branch |
| date_lost | When we lost |
| could_have_won_if | What would have changed the outcome |
| reapproach_strategy | How to win them back |
| reapproach_timing | When to re-approach |

**Lost Deal Scenarios:** Faster processing (Bajaj won), Lower rate (SBI won), Zero cost terminal (Paytm won), Dealer tie-up (Axis won), Fleet discount (SBI won), Existing relationship (ICICI won), No credit history (Mahindra Finance won), API quality (Razorpay won)

---

#### 6. `public/sample-data/field-sales/product-catalog/retail_asset_products.csv`
**Purpose:** Complete HDFC retail asset product catalog with objection handling

| Column | Description |
|--------|-------------|
| product_id | Identifier (P001-P010) |
| category | Unsecured/Vehicle/Secured/Payments |
| product_name | Product name |
| target_segment | Who it's for |
| rate_range_pct | Interest rate range |
| processing_fee_pct | Processing fee |
| max_amount_lakhs | Maximum loan amount |
| max_tenure_years | Maximum tenure |
| min_credit_score | Minimum CIBIL |
| key_eligibility | Key eligibility criteria |
| usp_1 | First unique selling point |
| usp_2 | Second unique selling point |
| usp_3 | Third unique selling point |
| cross_sell_with | Natural cross-sell products |
| typical_objection | Most common objection heard |
| counter_response | How to counter it |

**Products:** Personal Loan, Business Loan, Auto Loan, Tractor Finance, Commercial Vehicle Loan, Home Loan, LAP, Credit Card (Regalia/Infinia), Merchant Acquiring (POS), Payment Gateway

---

#### 7. `public/sample-data/field-sales/product-catalog/cross_sell_matrix.csv`
**Purpose:** Cross-sell opportunity mapping with triggers and conversion rates

| Column | Description |
|--------|-------------|
| primary_product | Product customer already has |
| cross_sell_product_1 | First cross-sell target |
| trigger_event_1 | When to pitch it |
| conversion_rate_1 | Expected conversion % |
| revenue_per_customer_1 | Annual revenue from cross-sell |
| cross_sell_product_2 | Second cross-sell target |
| trigger_event_2 | Trigger |
| conversion_rate_2 | Conversion % |
| revenue_per_customer_2 | Revenue |
| cross_sell_product_3 | Third cross-sell target |
| trigger_event_3 | Trigger |
| conversion_rate_3 | Conversion % |
| revenue_per_customer_3 | Revenue |

**Primary Products Mapped:** Home Loan, Auto Loan, Personal Loan, Business Loan, Tractor Finance, Commercial Vehicle Loan, LAP, Credit Card, Merchant Acquiring, Payment Gateway

---

#### 8. `public/sample-data/field-sales/sales-pipeline/deal_pipeline.csv`
**Purpose:** Active deal pipeline for prioritization and strategy exercises

| Column | Description |
|--------|-------------|
| deal_id | Identifier (D001-D010) |
| customer_name | Customer/company |
| customer_type | Corporate/Individual |
| product | Product being pitched |
| deal_size_lakhs | Deal value |
| stage | Pipeline stage |
| probability_pct | Win probability |
| rm_name | Assigned RM |
| branch | Branch |
| days_in_stage | Days stuck in current stage |
| next_action | What needs to happen next |
| competitor_threat | Who else is pitching |
| expected_close_date | Target close |
| blockers | What's holding it up |
| cross_sell_identified | Additional products identified |

---

#### 9. `public/sample-data/field-sales/sales-pipeline/rm_meeting_tracker.csv`
**Purpose:** Meeting history with outcomes, objections, and competitive intelligence gathered

| Column | Description |
|--------|-------------|
| meeting_id | Identifier (MT001-MT010) |
| rm_name | RM who conducted meeting |
| branch | Branch |
| customer_name | Customer met |
| customer_type | Individual/Corporate |
| meeting_date | Date of meeting |
| meeting_type | Site Visit/Proposal/Branch/Phone/Village Visit |
| product_discussed | Products pitched |
| meeting_outcome | Result |
| next_steps | Follow-up actions |
| competitive_intel_gathered | What we learned about competitors |
| objections_raised | Customer objections encountered |
| deal_value_lakhs | Deal size |
| follow_up_date | Next touchpoint scheduled |

---

#### 10. `public/sample-data/field-sales/merchant-acquiring/merchant_prospects.csv`
**Purpose:** Merchant acquisition pipeline for POS/PG solutions

| Column | Description |
|--------|-------------|
| merchant_id | Identifier (MA001-MA008) |
| business_name | Business name |
| business_type | Industry/type |
| owner_name | Owner/contact |
| city | Location |
| monthly_turnover_lakhs | Monthly revenue |
| current_provider | Existing POS provider |
| current_mdr_pct | Current MDR being paid |
| num_pos_terminals | Number of terminals |
| pain_points | Issues with current provider |
| product_opportunity | What we can offer |
| deal_value_annual | Annual value of the deal |
| stage | Sales stage |
| rm_assigned | RM |
| cross_sell_potential | Additional products |

**Merchant Types:** Restaurant chain (F&B), Dental clinic (Healthcare), Auto service center, Coaching institute (Education), Grocery chain (Retail), Jewellers, Gym chain (Fitness), Catering & Events

---

## TypeScript Configuration Files (4 files)

### `data/field-sales-prompts.ts`
**Contains:** 6 CRAFT-ladder prompt experiments, each with L1 (Simple) → L4 (CRAFT Framework)

| # | Experiment Theme | Anchor Scenario | Products |
|---|-----------------|-----------------|----------|
| 1 | Pre-Meeting Prospect Research — Corporate Client | Sitting in lobby of Pinnacle Auto Components, meeting CFO in 10 min | CV Loans + Business Loan |
| 2 | Objection Handling — Rate-Sensitive Home Loan Customer | IT couple comparing HDFC (8.50%) with SBI (8.25%) and Kotak (8.45%) | Home Loan |
| 3 | Industry Research — Entering a New Vertical (Renewable Energy) | First meeting with solar company CFO, zero sector experience | Business Loan + CV Loans |
| 4 | Personalizing the Pitch — Individual vs Corporate Borrower | Back-to-back: farmer (tractor) at 10 AM, logistics VP (20 CVs) at 3 PM | Tractor Finance + CV Loans |
| 5 | Cross-Selling at Point of Onboarding | Customer signing auto loan docs, 10 minutes to pitch 3 more products | Auto Loan + Credit Card + CASA + Insurance |
| 6 | Merchant Acquiring — Converting Cash-Heavy Business to Digital | Catering business owner handles 90% cash, losing corporate clients | POS + QR + Current Account + Business Loan |

---

### `data/field-sales-scenarios.ts`
**Contains:** Objection scenarios, prospect research scenarios, closing scenarios, and the Before/During/After framework

#### Objection Handling Scenarios (10 scenarios)

| # | ID | Product | Objection Summary | Competitor | Category |
|---|----|---------|--------------------|-----------|----------|
| 1 | obj-rate-hl | Home Loan | "SBI is 8.25%, you're 8.50% — that's 4L extra over 20 years" | SBI, Kotak | rate |
| 2 | obj-rate-pl | Personal Loan | "Bajaj gives 12% in 2 hours, you're 14% in 3 days" | Bajaj Finance | rate |
| 3 | obj-process-bl | Business Loan | "Your documentation is too much — Bajaj asks Aadhaar and PAN only" | Bajaj Finance | process |
| 4 | obj-trust-switch | Current Account + POS | "Been with SBI 20 years — father had account there. Why switch?" | SBI | trust |
| 5 | obj-competitor-cv | CV Loan | "Tata Motors Finance gives captive rate 8.5% with instant approval" | Tata Motors Finance | competitor |
| 6 | obj-product-tractor | Tractor Finance | "Mahindra Finance gives without CIBIL or documents" | Mahindra Finance | product |
| 7 | obj-timing-lap | LAP | "ICICI promised 10 days, you're saying 15-20 days" | ICICI Bank | timing |
| 8 | obj-competitor-pg | Payment Gateway | "Razorpay works perfectly — better API, cleaner docs" | Razorpay | competitor |
| 9 | obj-rate-auto | Auto Loan | "Hyundai showroom has Axis desk giving same-day at 8.75%" | Axis Bank | rate |
| 10 | obj-trust-digital | Credit Card | "I have AMEX Platinum — what does Infinia have that AMEX doesn't?" | AMEX | trust |

#### Prospect Research Scenarios (6 scenarios)

| # | ID | Category | Title | Product Focus |
|---|----|---------|----|---------------|
| 1 | pr-auto-components | Corporate | Auto Components Manufacturer — Fleet Finance | CV Loans + Business Loan |
| 2 | pr-solar-energy | Corporate | Renewable Energy Company — Project Finance | Business Loan + CV Loans |
| 3 | pr-hospital-chain | Corporate | Hospital Chain — Equipment Finance + POS | Business Loan + Merchant Acquiring |
| 4 | pr-it-couple | Individual | IT Couple — First Home Loan Battle | Home Loan + Credit Card + CASA |
| 5 | pr-farmer-tractor | Individual | Farmer — Tractor Finance Without Documents | Tractor Finance + Personal Loan |
| 6 | pr-merchant-convert | Merchant | Cash-Heavy Merchant — Digital Conversion | Merchant Acquiring + Current Account |

#### Deal Closing Scenarios (5 scenarios)

| # | ID | Title | Products | Challenge |
|---|----|----|----------|-----------|
| 1 | close-fleet | Fleet Deal — 20 Vehicles Against SBI | CV Loan + Corporate CC + Business Loan | 145bps price gap on 3.5 Cr deal |
| 2 | close-balance-transfer | Balance Transfer + Top-up — Win-Back | Home Loan BT + Top-up + CC + CASA | Customer feels switching hassle not worth it |
| 3 | close-merchant-bundle | Merchant Bundle — POS + CA + Business Loan | Merchant Acquiring + CA + Business Loan + CC | ICICI is existing banker for 8 years |
| 4 | close-nri-premium | NRI Premium Home Loan — Against Federal Bank | Home Loan + Auto Loan + Insurance + CASA | 10-year Federal Bank loyalty barrier |
| 5 | close-sme-digital | SaaS Company — Payment Gateway + Business Banking | PG + Business Loan + CA + Corporate CC | Razorpay has superior API/developer experience |

---

### `data/field-sales-use-cases.ts`
**Contains:** 24 use cases across 8 categories

#### Category: Pre-Meeting Prospect Research (3 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 1 | fs-corporate-research | Corporate Prospect Intelligence Brief | hands-on | Business Loan, CV Loan, Merchant Acquiring |
| 2 | fs-individual-profiling | Individual Prospect Quick Profile | hands-on | Home Loan, Auto Loan, Personal Loan, Credit Card |
| 3 | fs-public-info-leverage | Leveraging Public Information for Sales Edge | hands-on | All Products |

#### Category: Competitive Positioning (3 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 4 | fs-rate-counter | Rate War Counter-Strategy | hands-on | Home Loan, Auto Loan, LAP, Business Loan |
| 5 | fs-competitor-weakness | Competitor Vulnerability Exploitation | demo | All Products |
| 6 | fs-lost-deal-recovery | Win-Back Strategy for Lost Deals | demo | Home Loan, Business Loan, Merchant Acquiring |

#### Category: Objection Handling & Persuasion (4 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 7 | fs-rate-objection | Handling "Your Rate is Too High" | hands-on | Home Loan, Personal Loan, Business Loan, Auto Loan |
| 8 | fs-process-objection | Handling "Too Much Documentation/Process" | hands-on | Business Loan, LAP, Tractor Finance |
| 9 | fs-relationship-objection | Handling "I Have Been With X Bank for Years" | hands-on | Current Account, Merchant Acquiring, Business Loan |
| 10 | fs-timing-objection | Handling "Not Now, Maybe Later" | demo | Home Loan, Business Loan, LAP |

#### Category: Pitch Personalization (3 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 11 | fs-b2c-vs-b2b | B2C vs B2B Pitch Adaptation | hands-on | CV Loan, Tractor Finance, Auto Loan |
| 12 | fs-industry-tailored | Industry-Specific Pitch Tailoring | hands-on | Business Loan, Merchant Acquiring, Payment Gateway |
| 13 | fs-lifecycle-pitch | Life-Stage Based Pitch Personalization | demo | Home Loan, Personal Loan, Auto Loan, Credit Card |

#### Category: Cross-sell & Deal Expansion (3 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 14 | fs-onboarding-crosssell | Cross-sell at Point of Onboarding | hands-on | Credit Card, Insurance, CASA, Personal Loan |
| 15 | fs-portfolio-crosssell | Mining Existing Portfolio for Cross-sell | demo | All Products |
| 16 | fs-merchant-expansion | Merchant Relationship Expansion | hands-on | Merchant Acquiring, Current Account, Business Loan, Corporate CC |

#### Category: Deal Closing & Acceleration (2 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 17 | fs-same-day-close | Same-Day Deal Closing Techniques | hands-on | Personal Loan, Auto Loan, Credit Card, Merchant Acquiring |
| 18 | fs-complex-deal | Complex Multi-Product Deal Structuring | demo | Multiple Products |

#### Category: Industry & Vertical Research (3 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 19 | fs-new-vertical | Rapid Industry Vertical Learning | hands-on | All Products |
| 20 | fs-sector-pain-points | Industry Pain Points → Banking Solutions | demo | Business Loan, CV Loan, Merchant Acquiring |
| 21 | fs-seasonal-intelligence | Seasonal Selling Intelligence | awareness | All Products |

#### Category: Post-Meeting Follow-through (3 use cases)

| # | ID | Title | Coverage | Products |
|---|----|-------|----------|----------|
| 22 | fs-meeting-to-actions | Meeting Notes → Structured Follow-up | hands-on | All Products |
| 23 | fs-proposal-draft | AI-Assisted Proposal Generation | demo | Business Loan, CV Loan, LAP |
| 24 | fs-follow-up-cadence | Intelligent Follow-up Cadence Design | demo | Home Loan, Business Loan, Merchant Acquiring |

---

### `data/field-sales-doc-config.ts`
**Contains:** 6 document categories and 6 analysis operations

#### Document Categories

| # | Category | Description | Sample Files |
|---|----------|-------------|-------------|
| 1 | Prospect Profiles & Pipeline | Corporate & individual prospect data | corporate_prospects.csv, individual_prospects.csv |
| 2 | Industry & Vertical Intelligence | Market analysis per industry | industry_analysis.csv |
| 3 | Competitive Intelligence | Competitor comparison & lost deals | competitor_comparison.csv, lost_deals_analysis.csv |
| 4 | Product Catalog & Cross-sell Matrix | Product details & cross-sell mapping | retail_asset_products.csv, cross_sell_matrix.csv |
| 5 | Sales Pipeline & Meeting Tracker | Active deals & meeting history | deal_pipeline.csv, rm_meeting_tracker.csv |
| 6 | Merchant Acquiring Pipeline | Merchant POS/PG prospects | merchant_prospects.csv |

#### Document Intelligence Operations

| # | Operation | Description | Use For |
|---|-----------|-------------|---------|
| 1 | Pre-Meeting Intelligence Brief | Transform prospect data into scannable meeting prep brief | Corporate meetings, client visits |
| 2 | Competitive Battle Card Generator | Create product-level battle cards against specific competitors | Rate wars, competitor comparisons |
| 3 | Deal Pipeline Analyzer | AI-powered deal prioritization, risk assessment, weekly planning | Monday pipeline review |
| 4 | Industry → Product Mapper | Map sector pain points to HDFC product solutions | Entering new verticals |
| 5 | Objection Response Generator | Multi-strategy objection responses from meeting notes | Post-meeting follow-up |
| 6 | Cross-sell Opportunity Visualizer | Visualize cross-sell pathways with Mermaid charts | Portfolio mining |

---

## Sample Prompts Used (Key Examples)

### Prompt Level L1 (Simple)
```
Tell me about the auto components industry in India so I can sell loans to them.
```

### Prompt Level L2 (Detailed)
```
I am an HDFC Bank sales professional about to meet the CFO of Pinnacle Auto Components — a mid-size auto parts company in Pune with ~1800 employees and ~320 Cr revenue. They currently bank with ICICI. I want to pitch Commercial Vehicle Loans (they need fleet for logistics) and a Business Loan for expansion. Give me: (1) key talking points about the auto components industry, (2) likely financial pain points for a company this size, (3) questions I should ask the CFO, and (4) why HDFC is better than ICICI for their needs.
```

### Prompt Level L3 (Analytical)
```
I am about to walk into a meeting at Pinnacle Auto Components (Pune, ~320 Cr revenue, 1800 employees, auto parts supplier to Tata Motors). They bank with ICICI for CC/OD and Term Loan. My objective is to onboard them for: (a) Commercial Vehicle Loans for 12 logistics trucks, (b) Business Loan for capacity expansion. Analyse: (1) Auto components industry trends in 2025-26, (2) Typical cash flow patterns for an auto OEM supplier, (3) ICICI's likely product structure and weaknesses I can exploit, (4) 5 high-impact questions to ask the CFO, (5) Competitive positioning matrix: HDFC CV Loan vs ICICI vs SBI vs Tata Motors Finance, (6) Cross-sell opportunities. Format as a 1-page pre-meeting intelligence brief.
```

### Prompt Level L4 (CRAFT Framework)
```
Context: I am a Senior Relationship Manager at HDFC Bank, sitting in the reception lobby of Pinnacle Auto Components Pvt Ltd in Pune. Meeting is in 10 minutes with Rakesh Joshi (CFO). Company profile: auto parts manufacturer supplying Tata Motors, annual revenue ~320 Cr, 1800 employees, currently banking with ICICI (CC/OD + Term Loan). They are expanding logistics with 12 new commercial vehicles and need capacity expansion finance. ICICI has been their primary banker for 5 years.

Role: You are a senior banking sales strategist with 15 years experience in corporate relationship management.

Action: Create a comprehensive pre-meeting intelligence brief including: (1) Industry snapshot, (2) Client financial intelligence, (3) ICICI vulnerability analysis, (4) Meeting conversation strategy with 5 power questions, (5) Product packaging — CV Loan + Business Loan + Corporate Cards + Current Account, (6) Competitive positioning table.

Format: Crisp, scannable 1-page brief with bullet points, tables, and a "First 5 Minutes" script.

Target Audience: Me — a field sales professional with 10 minutes to prepare.
```

### Objection Handling Prompt
```
Customer objection: "SBI is giving me 8.25% and you are asking 8.50%. Over 20 years that is almost 4 lakhs extra. Why would I pay more?"

Customer context: IT couple, first-time buyers, combined 30 LPA, buying 1.2 Cr apartment in Pune.
Product: Home Loan
Competitor mentioned: SBI (8.25%), Kotak (8.45%)

Generate 3 complete response strategies:
1) EMPATHETIC — acknowledge the concern, validate their feelings, and redirect to HDFC's value
2) DATA-DRIVEN — use specific numbers, total cost comparisons, and calculations
3) OFFER-BASED — what we can offer within policy to address their concern and close

For each: provide complete response script (conversational, not corporate). Include specific data points.
```

### Deal Closing Prompt
```
I need to close a 20-vehicle CV fleet deal (3.5 Cr) against SBI's 8.75% fleet rate. My standard rate is 10.2%. The customer (Bharat Logistics, VP Ops Deepak Patil) is existing customer with good history. Create: (1) Fleet pricing proposal I can seek from RBH, (2) Value-add package justifying rate gap, (3) TCO comparison showing hidden SBI fleet costs, (4) The "relationship bundle" — CV + CC + BL as package pricing, (5) Board presentation talking points the VP can use internally.
```

### Merchant Conversion Prompt
```
Meeting a cash-heavy catering business owner (38L/month, 90% cash) who just lost 12L in corporate contracts because they couldn't provide digital payment. He fears: GST scrutiny, MDR eating margins, technology complexity. Prepare: (1) Revenue growth model showing digital brings NEW customers, (2) GST myth-busting, (3) MDR cost vs revenue uplift math, (4) Simplest possible technology setup, (5) Business loan pathway after 6 months of digital history, (6) Conversation approach for traditional business owner.
```

### Cross-sell at Onboarding Prompt
```
Priyanka (28, Google PM, 42 LPA) is signing her BMW auto loan (18L). She has HDFC savings and Millennia card. Salary goes to ICICI. Create a 10-minute cross-sell conversation flow that naturally introduces: (1) Infinia card upgrade, (2) CASA salary migration, (3) Motor insurance. Make it feel like helpful advice, not product pushing.
```

### Industry Research (Zero-to-Credible) Prompt
```
I have been assigned to cover the renewable energy sector and have a meeting with a solar company CFO in 2 hours. I know NOTHING about solar. Give me: (1) How solar companies make money, (2) Their typical banking needs, (3) Key terminology (PPA, RPO, EPC, etc.), (4) Government policies, (5) 5 questions that demonstrate knowledge, (6) Common mistakes bankers make. Make me dangerous in 2 hours.
```

---

## Business Flows & Workflows

### Flow 1: Pre-Meeting Preparation Workflow
```
1. Load prospect data → Doc Intelligence
2. Select "Pre-Meeting Intelligence Brief" operation
3. AI generates: Company profile, Industry context, Banking needs, Competitive landscape
4. Review and refine with follow-up questions
5. Download as PDF/Markdown for offline reading in lobby
```

### Flow 2: Objection Handling Preparation
```
1. Navigate to Sales & Growth AI → Objection Handling mode
2. Select from 10 pre-built objection scenarios (or type custom)
3. AI generates 3 response strategies (Empathetic, Data-driven, Offer-based)
4. Review each strategy with complete conversation scripts
5. Practice and memorize key talking points
```

### Flow 3: Competitive Battle Card Creation
```
1. Load competitor_comparison.csv → Doc Intelligence
2. Select "Competitive Battle Card Generator" operation
3. AI creates product-level battle cards with:
   - Where HDFC wins
   - Where competitor wins
   - Counter-strategy for each competitor strength
   - Total Cost of Ownership comparison
4. Download battle cards for field reference
```

### Flow 4: Pipeline Review & Prioritization
```
1. Load deal_pipeline.csv + rm_meeting_tracker.csv → Doc Intelligence
2. Select "Deal Pipeline Analyzer" operation
3. AI generates:
   - Top 5 priority deals for this week
   - At-risk deals needing immediate action
   - Quick wins closeable this week
   - Dead deals to disqualify
4. Get specific action items per deal with deadlines
```

### Flow 5: Cross-sell Identification
```
1. Load cross_sell_matrix.csv + individual_prospects.csv → Doc Intelligence
2. Select "Cross-sell Opportunity Visualizer" operation
3. AI generates:
   - Mermaid flowchart of cross-sell pathways
   - Revenue opportunity per customer
   - Trigger events and timing
   - Conversation bridges from primary to cross-sell product
```

### Flow 6: Industry Rapid Learning
```
1. Navigate to Sales & Growth AI → Prospect Research mode
2. Select industry scenario (or type custom)
3. AI delivers: Business model 101, Cash flow patterns, Banking needs, Terminology cheat sheet
4. Get 5 credibility-building questions to ask in meeting
5. Understand risk factors and what NOT to say
```

### Flow 7: Post-Meeting Action Planning
```
1. Navigate to Use Cases → Post-Meeting category
2. Paste raw meeting notes
3. AI converts to:
   - Structured CRM update
   - Action items with owners and deadlines
   - Follow-up email draft
   - Proposal outline
   - Internal approval request
```

### Flow 8: Lost Deal Win-Back Strategy
```
1. Load lost_deals_analysis.csv → Doc Intelligence
2. Ask: "Which lost deals can we win back and when?"
3. AI identifies:
   - Deals approaching competitor contract renewal
   - Balance transfer opportunities
   - Pricing changes that create re-approach window
4. Get specific win-back strategy per deal
```

---

## Learning Outcomes

By the end of this module, participants will be able to:

1. **Articulate 3+ ways** GenAI sharpens their sales motion before, during, and after a customer meeting
2. **Independently write effective prompts** for prospect research, industry research, and objection handling using free public GenAI tools on their personal device
3. **Identify at least one retail-asset deal** in their own pipeline where they will apply a technique from this session within the next two weeks

---

## Mandatory Disclaimers

1. No bank-confidential data is to be entered into any external Gen AI tool, on any personal device, at any point
2. No tool demonstrated here is approved for production bank workflow — this is for demonstration and learning purposes only
3. Co-pilot Chat is the only currently sanctioned internal Gen AI tool; broader Co-pilot capabilities are addressed via parallel Pan-Bank webinars on Empower
4. The day's exercises showcase awareness and possibility, not a deployment-ready toolkit

---

*Module designed for HDFC Bank Retail Asset Sales professionals — Field Sales AI Enablement*
*All data is synthetic. Not for production use.*
