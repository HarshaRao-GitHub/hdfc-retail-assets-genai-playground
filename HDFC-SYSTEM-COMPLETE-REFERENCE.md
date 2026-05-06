# HDFC Retail Assets — GenAI Playground: Complete System Reference

> **Version:** 3.2 | **Last Updated:** May 2026 | **Classification:** Internal — Training & Demonstration  
> **Stack:** Next.js 14 + Claude AI (claude-sonnet-4-6) + Synthetic Data  
> **Deployment:** Vercel (auto-deploy from GitHub)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture & Navigation](#2-architecture--navigation)
3. [14 Business Units Covered](#3-14-business-units-covered)
4. [Application Routes & Pages](#4-application-routes--pages)
5. [Components Library](#5-components-library)
6. [Data Configuration Files](#6-data-configuration-files)
7. [Sample Data Files — CSVs](#7-sample-data-files--csvs)
8. [Sample Data Files — PDFs (Policy Manuals)](#8-sample-data-files--pdfs-policy-manuals)
9. [Sample Data Files — TXT (Policy Documents)](#9-sample-data-files--txt-policy-documents)
10. [Persona Images](#10-persona-images)
11. [AI-Powered Features](#11-ai-powered-features)
12. [BU-wise Coverage Matrix](#12-bu-wise-coverage-matrix)
13. [API Endpoints](#13-api-endpoints)
14. [Recent Changes & Additions Log](#14-recent-changes--additions-log)

---

## 1. System Overview

The **HDFC Retail Assets GenAI Playground** is a hands-on GenAI training platform designed for HDFC Bank leaders across Sales, Product, Portfolio, and Service functions. It demonstrates 30+ use cases, a prompt engineering lab, document intelligence, and AI-powered sales tools — all built with synthetic data within bank policy guardrails.

### Key Capabilities

- **Prompt Engineering Lab** — CRAFT methodology with L1–L4 progression ladders across 10 themes
- **Document Intelligence** — Upload and analyze CSV/PDF banking documents with AI across 7 departments and 13 operations
- **Retail Assets AI** — Full sales enablement suite with 8 sub-modules covering the complete sales lifecycle
- **Sales & Growth AI** — Prospect research, objection handling, closing strategies, pitch builder, and VOC analysis
- **Use Case Library** — 35 leadership use cases across 6 categories with facilitation guides
- **Human-in-the-Loop (HITL)** — Demonstration of AI approval workflows with multi-role checkpoints
- **Hallucination Detection** — Claim-level risk analysis with confidence scoring and mitigation

### Technology

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| AI Engine | Claude AI (claude-sonnet-4-6) via Anthropic API |
| Styling | Tailwind CSS with custom HDFC theme |
| Deployment | Vercel (auto-deploy on push to GitHub) |
| Data | 100% synthetic — no real customer/bank data |

---

## 2. Architecture & Navigation

### Navigation Structure (Header)

The primary navigation bar contains 5 modules with **Retail Assets AI** highlighted as the first option:

| # | Menu Item | Route | Description |
|---|-----------|-------|-------------|
| 1 | **Retail Assets AI** | `/field-sales-ai` | Full sales enablement suite (highlighted, first position) |
| 2 | Prompt Lab | `/prompt-lab` | CRAFT prompt engineering laboratory |
| 3 | Doc Intelligence | `/doc-intelligence` | Document analysis across 7 banking departments |
| 4 | Sales & Growth AI | `/sales-ai` | Advanced sales acceleration tools |
| 5 | Use Case Library | `/use-cases` | 35 leadership use cases with facilitation |

Additional pages accessible through navigation:
- **Dashboard** (`/dashboard`) — Landing page with hero image, subtitle, and mode cards
- **Root** (`/`) — Client workspace launcher (URL-based routing for HDFC vs Thermax)

### Client Separation

The root page (`/`) supports URL-based client routing:
- `?client=hdfc` — Shows only HDFC entry
- `?client=thermax` — Shows only Thermax entry
- No parameter — Shows both options

---

## 3. 14 Business Units Covered

The system provides comprehensive coverage for all 14 HDFC Bank Retail Assets business units:

| # | Business Unit | Short Code | Key Products |
|---|---------------|------------|--------------|
| 1 | **Home Loans** | HL | Home Loan Regular, NRI, PMAY, Balance Transfer, Self-Construction |
| 2 | **Personal Loans** | PL | Regular, Pre-Approved (Xpress), Top-Up, Salary-Linked Bulk |
| 3 | **Auto / Vehicle Finance** | Auto/CV/Tractor | New Car, Used Car, EV, Two-Wheeler, Tractor, Commercial Vehicle |
| 4 | **Loan Against Property** | LAP | Term Loan, Overdraft, Top-Up, Balance Transfer, Lease Rental Discounting |
| 5 | **Credit Cards & CPS** | CC/CPS | Retail Cards (MoneyBack/Regalia/Infinia), Corporate Cards, Purchase Cards, Fleet Cards |
| 6 | **ECOM & Payment Gateway** | ECOM/PG | Payment Gateway, Nodal Account, Seller Lending, BBPS, Recurring Mandates |
| 7 | **LAS & Education Loans** | LAS/EL | Loan Against Securities (OD), Domestic Education Loan, Study Abroad Loan |
| 8 | **Digital Banking & BankOne** | DBC | BankOne API Platform, Co-branded Cards, Lending API, FD-in-App, UPI PSP |
| 9 | **DPPS & Prepaid** | DPPS | Corporate Prepaid Cards, Vendor Advance Cards, Gift Cards, Salary Advance/EWA |
| 10 | **ABCP Partnerships** | ABCP | Insurance Distribution, MF Distribution, Co-branded Products, Digital Shelf |
| 11 | **Liabilities Product Group** | LPG | Salary Accounts (tiered), Corporate FD, Current Accounts, NRE/NRO FD |
| 12 | **Infrastructure Finance** | Infra | Equipment Finance, Fleet Finance, Project Finance, Government Receivable Discounting |
| 13 | **Merchant Services** | Merchant | POS Terminals, Android POS, QR, Merchant Lending, Payment Links |
| 14 | **Collections & Recovery** | Collections | Pre-Delinquency, Soft/Hard Collections, SARFAESI, OTS, Write-off Management |

---

## 4. Application Routes & Pages

### 15 Routes Total

| Route | Page | Description |
|-------|------|-------------|
| `/` | Client Launcher | URL-based workspace selector for HDFC / Thermax |
| `/dashboard` | Dashboard | Landing page — hero image, GenAI for Retail Assets heading, mode navigation cards |
| `/prompt-lab` | Prompt Lab | CRAFT methodology lab with L1–L4 prompt ladders, system vs user prompts, hallucination demos |
| `/doc-intelligence` | Doc Intelligence Hub | 7-department document analysis with CSV/PDF upload, 13 analytical operations |
| `/sales-ai` | Sales & Growth AI | Prospect research, objection handling, closing strategies, VOC analysis, facilitation guide |
| `/use-cases` | Use Case Library | 35 use cases across 6 categories with myths, HITL, 30-day plan, build-buy frameworks |
| `/field-sales-ai` | Retail Assets AI Hub | Main hub with 8 sub-module cards, industry news pulse, product line tags |
| `/field-sales-ai/prompting` | Sales Prompt Lab | CRAFT prompting with L1–L4 persona images and field-sales-specific experiments |
| `/field-sales-ai/doc-intelligence` | Sales Doc Intelligence | Field-sales document analysis with 6 categories and 9 analytical operations |
| `/field-sales-ai/sales-growth` | Sales Acceleration | Prospect research, objection handling, closing playbook, pitch builder |
| `/field-sales-ai/use-cases` | Sales Use Cases | 22 field sales use cases across 8 categories |
| `/field-sales-ai/role-play` | AI Role-Play Simulator | Live buyer simulation with 16 customer personas and real-time scoring |
| `/field-sales-ai/deal-scorer` | Deal Win Probability | 14 deal templates with AI-powered win probability analysis |
| `/field-sales-ai/lobby-mode` | 60-Second Lobby Brief | 18 pre-built scenarios for instant meeting prep |
| `/field-sales-ai/debrief` | Post-Meeting Debrief | CRM notes, email drafts, and meeting analysis from 6 templates |

---

## 5. Components Library

### 12 React Components

| Component | File | Purpose |
|-----------|------|---------|
| **Header** | `Header.tsx` | Top navigation bar with HDFC branding, 5-module nav, Docs tray trigger |
| **AppShell** | `AppShell.tsx` | Document provider wrapper, renders DocumentTray on all routes except `/` |
| **DocumentTray** | `DocumentTray.tsx` | Multi-file upload and ingestion via `/api/upload`, global document store |
| **PromptPlayground** | `PromptPlayground.tsx` | CRAFT prompt lab UI — experiments, ladders, system/user demos, hallucination cards |
| **DocIntelligenceHub** | `DocIntelligenceHub.tsx` | Department-based document analysis — uploads, sample files, CSV/PDF viewers, streaming chat |
| **HallucinationDetector** | `HallucinationDetector.tsx` | Claim-level risk analysis with accept/regenerate/remove actions |
| **HITLReviewPanel** | `HITLReviewPanel.tsx` | Human-in-the-loop approval demo with checkpoints and modify/reject flows |
| **Markdown** | `Markdown.tsx` | ReactMarkdown + GFM with optional Mermaid diagram rendering |
| **DownloadMenu** | `DownloadMenu.tsx` | Export AI responses in MD/TXT/HTML/PDF formats |
| **EnhanceToCraft** | `EnhanceToCraft.tsx` | One-click prompt upgrade calling `/api/enhance-prompt` |
| **SalesDocumentsPanel** | `SalesDocumentsPanel.tsx` | Collapsible sample data browser with CSV preview |
| **IndustryNewsPulse** | `IndustryNewsPulse.tsx` | Synthetic sector headline ticker using industry news items |

---

## 6. Data Configuration Files

### 10 TypeScript Data Files (`data/*.ts`)

| File | Key Exports | Item Counts |
|------|-------------|-------------|
| `use-cases.ts` | `USE_CASE_CATEGORIES`, `USE_CASES` | 6 categories, 35 use cases |
| `prompt-templates.ts` | `LAB_EXPERIMENTS`, `PROMPT_LADDERS`, `DISCLAIMER_TEXT` | 3 CRAFT ladders, 10 prompt themes (each with 3 levels) |
| `advanced-features.ts` | Myths, Objections, Risks, Hallucination examples, HITL scenarios | 10 myths, 5 objections, 6 risk categories, 4 hallucination examples, 5 HITL scenarios |
| `doc-intelligence-config.ts` | `BUCKETS`, `OPERATIONS`, `DEPARTMENTS` | 6 buckets, 13 operations, 7 departments |
| `facilitation-guide.ts` | `FACILITATION_GUIDE`, `VOC_SCENARIOS`, `THIRTY_DAY_PLAN`, `BUILD_BUY_EXAMPLES` | 9 facilitation items, 5 VOC scenarios, 3-week plan, 7 build-buy examples |
| `field-sales-prompts.ts` | `FIELD_SALES_LAB_EXPERIMENTS` | 6 prompt engineering themes |
| `field-sales-scenarios.ts` | `FIELD_OBJECTION_SCENARIOS`, `PROSPECT_RESEARCH_SCENARIOS`, `CLOSING_SCENARIOS` | ~21 objections, ~17 prospect scenarios, ~15 closing strategies |
| `field-sales-use-cases.ts` | `FIELD_SALES_USE_CASE_CATEGORIES`, `FIELD_SALES_USE_CASES` | 8 categories, 22 use cases |
| `field-sales-doc-config.ts` | `FIELD_SALES_DOC_CATEGORIES`, `FIELD_SALES_DOC_OPERATIONS` | 6 document categories, 9 analytical operations, 13 standard operations |
| `field-sales-advanced.ts` | `ROLE_PLAY_PERSONAS`, `DEAL_SCORER_TEMPLATES`, `LOBBY_MODE_SCENARIOS`, `DEBRIEF_TEMPLATES`, `INDUSTRY_NEWS_ITEMS` | 16 personas, 14 deal templates, 18 lobby scenarios, 6 debrief templates, 20 news headlines |

### BU Coverage in Data Files

New entries added for previously uncovered BUs:

| Data Category | Original Count | After BU Expansion |
|---------------|---------------|-------------------|
| Role-Play Personas | 10 | **16** (+6 for PL, Infra, ABCP, LPG, DBC, LAP) |
| Deal Scorer Templates | 7 | **14** (+7 for PL, LAP, Infra, ABCP, LPG, DPPS, DBC) |
| Lobby Mode Scenarios | 14 | **18** (+4 for IT/PL, Infra, CA/LAP, Retail/Salary) |
| Objection Scenarios | 16 | **~21** (+5 for PL instant, Infra cash flow, LAP valuation, ABCP volume, LPG FD rates) |
| Prospect Research Scenarios | 11 | **~17** (+6 for IT/PL, Infra, Professional/LAP, Insurance/ABCP, Retail/Salary, Digital/DBC) |
| Closing Scenarios | 9 | **~15** (+6 for IT/PL, Highway/Infra, CA/LAP, Insurance/ABCP, Retail/Salary, Fintech/DBC) |
| Industry News Items | 14 | **20** (+6 for PL, Infra, LAP/Mortgage, ABCP, LPG) |

---

## 7. Sample Data Files — CSVs

### Total: 36 CSV files, all with 50–60+ records

#### Field Sales CSVs (10 files)

| Folder | File | Records | Coverage |
|--------|------|---------|----------|
| `product-catalog/` | `retail_asset_products.csv` | **55** | All 14 BUs — 55 product SKUs (P001–P055) including variants |
| `product-catalog/` | `cross_sell_matrix.csv` | **50** | 50 cross-sell paths covering all product combinations |
| `prospect-profiles/` | `corporate_prospects.csv` | **55** | 55 corporate prospects across all BUs and industries |
| `prospect-profiles/` | `individual_prospects.csv` | **55** | 55 individual prospects with diverse demographics |
| `sales-pipeline/` | `deal_pipeline.csv` | **55** | 55 active deals across all BUs with varied stages |
| `sales-pipeline/` | `rm_meeting_tracker.csv` | **55** | 55 RM meeting records with competitive intel |
| `competitor-intel/` | `competitor_comparison.csv` | **55** | 55 competitor entries covering all BUs and major competitors |
| `competitor-intel/` | `lost_deals_analysis.csv` | **55** | 55 lost deal cases with reapproach strategies |
| `industry-verticals/` | `industry_analysis.csv` | **50** | 50 industry verticals with market sizing |
| `merchant-acquiring/` | `merchant_prospects.csv` | **55** | 55 merchant prospects across business types |

#### Doc Intelligence CSVs (26 files)

| Folder | File | Records |
|--------|------|---------|
| **loan-origination/** | `loan_applications.csv` | 60 |
| | `document_checklist.csv` | 117 |
| | `disbursement_tracker.csv` | 57 |
| **credit-underwriting/** | `credit_assessment_summary.csv` | 52 |
| | `deviation_register.csv` | 52 |
| | `npa_watchlist.csv` | 51 |
| **sales-distribution/** | `branch_performance.csv` | 55 |
| | `competitor_rate_card.csv` | 61 |
| | `lead_tracker.csv` | 55 |
| | `rm_scorecard.csv` | 52 |
| **product-mgmt/** | `product_catalog.csv` | 52 |
| | `rate_card_history.csv` | 69 |
| **service-ops/** | `customer_complaints.csv` | 52 |
| | `service_requests.csv` | 52 |
| | `branch_walkin_log.csv` | 54 |
| | `nps_survey_results.csv` | 52 |
| **compliance-risk/** | `audit_findings.csv` | 52 |
| | `fraud_alerts.csv` | 52 |
| | `red_flag_samples.csv` | 55 |
| | `regulatory_circulars.csv` | 52 |
| | `rera_project_status.csv` | 53 |
| | `risk_assessment_portfolio.csv` | 55 |
| **collections-recovery/** | `collection_performance.csv` | 53 |
| | `dpd_aging_report.csv` | 52 |
| | `ots_proposals.csv` | 52 |
| | `sarfaesi_tracker.csv` | 52 |

---

## 8. Sample Data Files — PDFs (Policy Manuals)

### Total: 14 PDF documents (one per BU, 10+ pages each, ~15–17 KB)

Each PDF contains 8 chapters covering: product design, credit policy, operations, regulatory compliance, competitive intelligence, sales enablement, and performance metrics.

| # | BU | Folder | PDF Filename | Chapters |
|---|---|--------|-------------|----------|
| 1 | Home Loans | `home-loans/` | `home_loan_policy_manual.pdf` | Product Variants, Eligibility & Income, Property Appraisal, Processing & Disbursement, Insurance & Risk, Post-Disbursement, Regulatory Compliance, Sales Training |
| 2 | Personal Loans | `personal-loans/` | `personal_loan_credit_policy.pdf` | Product Architecture, Credit Assessment, Disbursement & Collections, Fraud Prevention, Corporate Tie-Up Programs, Competitive Intelligence, Regulatory Framework, Performance Dashboards |
| 3 | Vehicle Finance | `vehicle-finance/` | `vehicle_finance_handbook.pdf` | Product Portfolio, Dealer Management, Credit Underwriting, Insurance & Ancillary, Collections Specifics, Digital Innovation, Market Analysis, Operational Checklists |
| 4 | LAP | `lap/` | `lap_operations_manual.pdf` | Product Variants, Property Valuation & Legal, Credit Assessment, Operations & Disbursement, Post-Disbursement Monitoring, Pricing & Competition, Regulatory & Risk, Sales Enablement |
| 5 | Credit Cards & CPS | `credit-cards-cps/` | `credit_card_cps_policy.pdf` | Product Portfolio, Corporate Program Design, Rewards & Revenue, Risk & Fraud Prevention, Digital Features, Fleet Card Operations, Regulatory Compliance, Sales & Distribution |
| 6 | ECOM & PG | `ecom-payments/` | `ecom_payment_gateway_guide.pdf` | PG Architecture, Marketplace & Escrow, Technical Specs, Pricing & Commercial, BBPS Integration, Fraud & Risk, Competitive Positioning, Onboarding & Support |
| 7 | LAS & Education | `las-education/` | `las_education_loan_circular.pdf` | LAS Product Design, LAS Operations & Risk, Education Loan Architecture, EL Credit Assessment, Disbursement & Repayment, Government Schemes, Market Intelligence, Operational Guidelines |
| 8 | Digital Banking | `digital-banking/` | `digital_banking_bankone_handbook.pdf` | BankOne Overview, Partner Onboarding, Regulatory Framework, Commercial Model, Technology & Infrastructure, Risk Management, Case Studies, Growth Strategy |
| 9 | DPPS & Prepaid | `dpps-prepaid/` | `dpps_prepaid_policy.pdf` | Product Portfolio, Corporate Program Design, Salary Advance/EWA, Tax & Statutory Payments, Technology & Integration, Compliance & Risk, Competitive Landscape, Sales & Pricing |
| 10 | ABCP | `abcp/` | `abcp_partnership_manual.pdf` | ABCP Business Model, Insurance Distribution, MF & Wealth, Partnership Management, Co-Branded Products, Regulatory Framework, Branch Operations, Digital Distribution |
| 11 | Liabilities | `liabilities/` | `liabilities_product_manual.pdf` | Salary Account Programs, Fixed Deposits, Current Accounts, Migration & Retention, Digital Banking, Regulatory & Compliance, Performance Metrics, Competitive Intelligence |
| 12 | Infrastructure | `infrastructure-finance/` | `infrastructure_equipment_finance_policy.pdf` | Product Architecture, Credit Assessment, Milestone-Linked EMI, Sector-Specific Risk, Government Receivable Financing, Fleet Management, Collections & NPA, Market Opportunity |
| 13 | Merchant Services | `merchant-services/` | `merchant_acquiring_guidelines.pdf` | Product Suite, Merchant Onboarding, Terminal Management, Settlement & Reconciliation, Merchant Lending, Fraud & Risk, Sales & Growth, Operational Excellence |
| 14 | Collections | `collections-recovery/` | `collections_recovery_procedures.pdf` | Collections Framework, Pre-Delinquency & EWS, Soft Collections, Hard Collections, Recovery & Legal, Product-Specific Strategies, Technology & Analytics, Regulatory Compliance |

---

## 9. Sample Data Files — TXT (Policy Documents)

### 4 Text Documents

| Folder | File | Lines | Content |
|--------|------|-------|---------|
| `credit-underwriting/` | `income_assessment_template.txt` | 192 | Detailed income assessment template for salaried and self-employed applicants |
| `loan-origination/` | `sanction_letter_sample.txt` | 205 | Sample home loan sanction letter with terms and conditions |
| `product-mgmt/` | `pmay_guidelines.txt` | 219 | PMAY (Pradhan Mantri Awas Yojana) scheme guidelines and eligibility |
| `product-mgmt/` | `scheme_circular.txt` | 242 | Product scheme circular with rate structure and operational guidelines |

---

## 10. Persona Images

### Prompt Level Personas (L1–L4)

| Image | Used In |
|-------|---------|
| `prompt-level-l1.png` | Prompt Lab — Level 1 (Basic) prompting |
| `prompt-level-l2.png` | Prompt Lab — Level 2 (Structured) prompting |
| `prompt-level-l3.png` | Prompt Lab — Level 3 (Advanced) prompting |
| `prompt-level-l4.png` | Prompt Lab — Level 4 (Expert) prompting |

### Role-Play Persona Avatars

| Image | Character | BU Coverage |
|-------|-----------|-------------|
| `persona-rajesh-mehta.png` | Skeptical CFO — Auto Components | Business Loan / LAP |
| `persona-priya-sharma.png` | Busy Entrepreneur — FMCG Retail | BL + Merchant + PG |
| `persona-amit-patel.png` | Rate-Shopping Individual — IT | Home Loan |
| `persona-harinder-singh.png` | Progressive Farmer — Agriculture | Tractor Finance + PL |
| `persona-suresh-reddy.png` | Fleet Owner — Logistics | Commercial Vehicle |
| `persona-kavita-desai.png` | Premium HNI — Healthcare | Credit Card + LAP |
| `persona-cc-corporate.png` | Corporate HR — IT Services | Credit Cards & CPS |
| `persona-ecom-founder.png` | E-Commerce Founder — Marketplace | ECOM & Payment Gateway |
| `persona-las-hni.png` | HNI Investor — Wealth | LAS & Education Loans |
| `persona-dpps-corporate.png` | Corporate Treasurer — Conglomerate | DPPS & Prepaid |

### Dashboard & Hub Images

| Image | Used In |
|-------|---------|
| `hdfc-leader-ai-hero.png` | Dashboard hero — Leader working with AI |
| `persona-user-prompter.png` | Retail Assets AI hub — Prompt Lab card |
| `persona-doc-intel.png` | Retail Assets AI hub — Doc Intelligence card |
| `persona-sales-growth.png` | Retail Assets AI hub — Sales Growth card |

---

## 11. AI-Powered Features

### Retail Assets AI — 8 Sub-Modules

| # | Module | Route | Key Feature | Data Source |
|---|--------|-------|-------------|-------------|
| 1 | **Sales Prompt Lab** | `/field-sales-ai/prompting` | CRAFT methodology with L1–L4 progression | `field-sales-prompts.ts` (6 themes) |
| 2 | **Sales Doc Intelligence** | `/field-sales-ai/doc-intelligence` | CSV/PDF analysis with 9 field-sales operations | `field-sales-doc-config.ts` (6 categories) |
| 3 | **Sales Acceleration** | `/field-sales-ai/sales-growth` | Prospect research + Objection handling + Closing playbook + Pitch builder | `field-sales-scenarios.ts` (~53 scenarios) |
| 4 | **Sales Use Cases** | `/field-sales-ai/use-cases` | 22 use cases across 8 categories | `field-sales-use-cases.ts` |
| 5 | **AI Role-Play Simulator** | `/field-sales-ai/role-play` | Live buyer simulation with 16 personas + real-time scoring | `field-sales-advanced.ts` (16 personas) |
| 6 | **Deal Win Probability** | `/field-sales-ai/deal-scorer` | AI-powered win analysis with 14 templates | `field-sales-advanced.ts` (14 templates) |
| 7 | **60-Second Lobby Brief** | `/field-sales-ai/lobby-mode` | Instant meeting prep from 18 pre-built scenarios | `field-sales-advanced.ts` (18 scenarios) |
| 8 | **Post-Meeting Debrief** | `/field-sales-ai/debrief` | CRM notes + email drafts + meeting analysis | `field-sales-advanced.ts` (6 templates) |

### Leadership Modules — 4 Modules

| # | Module | Route | Key Feature |
|---|--------|-------|-------------|
| 1 | **Prompt Lab** | `/prompt-lab` | 10 prompt ladders with CRAFT methodology |
| 2 | **Doc Intelligence** | `/doc-intelligence` | 7 departments, 13 operations, CSV/PDF analysis |
| 3 | **Sales & Growth AI** | `/sales-ai` | VOC analysis, facilitation guides, decision trees |
| 4 | **Use Case Library** | `/use-cases` | 35 use cases, myths, HITL demos, 30-day plan |

### Cross-Cutting AI Features

| Feature | Component | Description |
|---------|-----------|-------------|
| **Hallucination Detection** | `HallucinationDetector.tsx` | Claim-level risk analysis with confidence factors and mitigation actions |
| **HITL Review** | `HITLReviewPanel.tsx` | Multi-role approval workflow demo with checkpoint management |
| **Prompt Enhancement** | `EnhanceToCraft.tsx` | One-click upgrade of basic prompts to CRAFT methodology |
| **Document Tray** | `DocumentTray.tsx` | Global multi-file upload accessible from any page |
| **Industry News Pulse** | `IndustryNewsPulse.tsx` | Real-time sector headline ticker with 20 synthetic news items |
| **Download/Export** | `DownloadMenu.tsx` | Export AI responses as MD, TXT, HTML, or PDF |

---

## 12. BU-wise Coverage Matrix

### Complete coverage map showing how each BU is represented across the system

| BU | Products CSV | Prospects CSV | Pipeline CSV | Competitors CSV | Meeting CSV | Lost Deals CSV | PDF Manual | Role-Play Persona | Deal Scorer | Lobby Scenario | Objection | Closing | News |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Home Loans** | P006, P020–P023 | Yes | Yes | Yes | Yes | Yes | Yes | Amit Patel | Yes | Yes | Yes | Yes | Yes |
| **Personal Loans** | P001, P024–P025 | Yes | Yes | Yes | Yes | Yes | Yes | PL Zonal Mgr | Yes | Yes | Yes | Yes | Yes |
| **Auto/Vehicle** | P003–P005, P026–P029 | Yes | Yes | Yes | Yes | Yes | Yes | Harinder Singh, Suresh Reddy | Yes | Yes | Yes | Yes | Yes |
| **LAP** | P007, P049 | Yes | Yes | Yes | Yes | Yes | Yes | LAP Channel Lead | Yes | Yes | Yes | Yes | Yes |
| **Credit Cards/CPS** | P008, P011, P042 | Yes | Yes | Yes | Yes | Yes | Yes | CC Corporate HR | Yes | Yes | Yes | Yes | Yes |
| **ECOM/PG** | P010, P012, P048, P052–P053 | Yes | Yes | Yes | Yes | Yes | Yes | ECOM Founder | Yes | Yes | Yes | Yes | Yes |
| **LAS & Education** | P013–P014 | Yes | Yes | Yes | Yes | Yes | Yes | LAS HNI | Yes | Yes | Yes | Yes | Yes |
| **Digital Banking** | P015 | Yes | Yes | Yes | Yes | Yes | Yes | DBC Unit Head | Yes | Yes | Yes | Yes | Yes |
| **DPPS Prepaid** | P016, P054 | Yes | Yes | Yes | Yes | Yes | Yes | DPPS Treasurer | Yes | Yes | Yes | Yes | Yes |
| **ABCP** | P019 | Yes | Yes | Yes | Yes | Yes | Yes | ABCP Channel Head | Yes | Yes | Yes | Yes | Yes |
| **Liabilities/LPG** | P017, P037–P041, P046–P047 | Yes | Yes | Yes | Yes | Yes | Yes | LPG Process Head | Yes | Yes | Yes | Yes | Yes |
| **Infra Finance** | P018, P051 | Yes | Yes | Yes | Yes | Yes | Yes | Infra Logistics Head | Yes | Yes | Yes | Yes | Yes |
| **Merchant Services** | P009, P052, P055 | Yes | Yes | Yes | Yes | Yes | Yes | Via scenarios | Yes | Yes | Yes | Yes | Yes |
| **Collections** | Via doc-intel CSVs | Via doc-intel CSVs | — | — | — | — | Yes | Via doc-intel dept | — | — | — | — | — |

---

## 13. API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Main AI chat endpoint — streaming Claude responses |
| `/api/doc-intelligence` | POST | Document analysis with uploaded files |
| `/api/enhance-prompt` | POST | CRAFT prompt enhancement |
| `/api/hallucination-check` | POST | Claim-level hallucination risk analysis |
| `/api/upload` | POST | File upload handler for document tray |

---

## 14. Recent Changes & Additions Log

### Phase 1: UI & Branding Updates

| Change | Details |
|--------|---------|
| **Renamed "Field Sales AI" → "Retail Assets AI"** | Updated across all pages, navigation, headers, footers, and context strings |
| **Repositioned Retail Assets AI** | Moved to first position in header navigation with highlight styling |
| **Updated Dashboard heading** | "GenAI for Mortgage" → "GenAI for Retail Assets" |
| **Updated Dashboard subtitle** | "n-1, n-2 leaders" → "leaders"; "35 use cases" → "30+ use cases" |
| **Replaced stats grid with hero image** | Removed statistics cards, added AI-generated HDFC leader hero image |
| **Removed "2-Day Program Structure"** | Eliminated the DayCard/Stat components from dashboard |
| **Removed "Switch Client" button** | Eliminated client switching from header |
| **Removed "Dashboard" nav link** | Dashboard no longer shown as a clickable menu item |
| **Hidden Sales Documents Panel** | Removed SalesDocumentsPanel from Prompt Engineering Lab page |
| **Added visual separator** | Added `w-px h-6 bg-white/20` separator after Retail Assets AI in nav |

### Phase 2: URL-Based Client Routing

| Change | Details |
|--------|---------|
| **Client-specific URL routing** | Root page reads `?client=` parameter to show HDFC-only or Thermax-only entry |
| **URL separation** | HDFC users don't see Thermax branding in URL and vice versa |

### Phase 3: Comprehensive 14-BU Coverage (Data Files)

| Category | Records Added | New Items |
|----------|---------------|-----------|
| **Role-Play Personas** | +6 | Personal Loans Zonal Manager, Infrastructure Logistics Head, ABCP Channel Head, LPG Process Head, Digital Banking Unit Head, LAP Channel Lead |
| **Deal Scorer Templates** | +7 | Personal Loan, LAP, Infrastructure/Equipment, ABCP Partnership, Liabilities Salary+FD, DPPS Prepaid, Digital Banking/BaaS |
| **Lobby Mode Scenarios** | +4 | IT Company PL Tie-up, Infra Equipment+Fleet, CA Firm LAP, Retail Chain Salary Banking |
| **Objection Scenarios** | +5 | PL instant approval, Infra cash flow timing, LAP valuation gap, ABCP volume guarantee, LPG FD rates |
| **Prospect Research** | +6 | IT/PL Bulk, Infra Equipment, Professional LAP, Insurance ABCP, Retail Salary, Digital Platform Banking |
| **Closing Scenarios** | +6 | IT Bulk PL, Highway Equipment, CA LAP+OD, Insurance Distribution, Retailer Salary Migration, Fintech Embedded Banking |
| **Industry News** | +6 | Personal Loans, Infrastructure Finance, LAP/Mortgages, ABCP/Distribution, Liabilities/LPG |
| **Product Line Tags** | +6 | LAS & Education Loans, Digital Banking & BankOne, DPPS & Prepaid, ABCP & Partnerships, Liabilities & Salary, Infrastructure Finance |

### Phase 4: CSV Data Expansion to 50–60 Records

| File | Before | After | New Records |
|------|--------|-------|-------------|
| `retail_asset_products.csv` | 10 → 19 | **55** | +36 product variants (NRI HL, PMAY, EV, Gold Loan, Working Capital, Trade, Forex, etc.) |
| `cross_sell_matrix.csv` | 10 → 18 | **50** | +32 cross-sell paths for all new products |
| `corporate_prospects.csv` | 12 → 22 | **55** | +33 corporate prospects across all BUs |
| `individual_prospects.csv` | 10 → 13 | **55** | +42 individual prospects with diverse profiles |
| `deal_pipeline.csv` | 10 → 20 | **55** | +35 deals across all BU categories |
| `rm_meeting_tracker.csv` | 10 → 18 | **55** | +37 meeting records with competitive intel |
| `competitor_comparison.csv` | 14 → 30 | **55** | +25 competitor entries for new BUs |
| `lost_deals_analysis.csv` | 8 → 14 | **55** | +41 lost deal cases with reapproach strategies |
| `industry_analysis.csv` | 10 → 14 | **50** | +36 industry verticals |
| `merchant_prospects.csv` | 8 | **55** | +47 merchant prospects |
| `red_flag_samples.csv` | 15 | **55** | +40 red flag samples |
| `risk_assessment_portfolio.csv` | 10 | **55** | +45 portfolio risk entries |

### Phase 5: PDF Policy Manuals

| Change | Details |
|--------|---------|
| **Created 14 PDF manuals** | One comprehensive policy manual per BU, 8 chapters each, 10+ pages |
| **Installed pdfkit** | Added `pdfkit` npm dependency for PDF generation |
| **Created generation script** | `scripts/generate-pdfs.js` — generates all 14 PDFs programmatically |
| **Organized by BU folder** | Each PDF placed in its own BU folder under `public/sample-data/field-sales/` |

### Data Asset Summary

| Asset Type | Count |
|------------|------:|
| Application Routes | 15 |
| React Components | 12 |
| Data Config Files (.ts) | 10 |
| CSV Data Files | 36 |
| PDF Policy Manuals | 14 |
| TXT Policy Documents | 4 |
| Persona Images | ~21 |
| API Endpoints | 5 |
| **Total Data Files** | **54** |
| **Total CSV Records** | **~2,000+** |

---

*This document is auto-generated from the HDFC Retail Assets GenAI Playground codebase. All data is synthetic — no real customer or bank information is used.*
