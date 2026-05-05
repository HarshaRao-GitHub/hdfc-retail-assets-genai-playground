# Advanced AI Sales Tools — Feature Documentation

## Overview

Six high-impact, interactive AI-powered tools built into the **Field Sales AI** module of the HDFC Retail Asset Sales Gen AI Playground. These tools are designed to give sales professionals a "wow factor" experience — demonstrating how GenAI can transform every stage of the sales process from pre-meeting prep to post-meeting follow-through.

All tools use **Claude AI (claude-sonnet-4-6)** for real-time generation, streaming responses, and are fully functional with synthetic data. No real customer data is required or should be used.

---

## 1. Live AI Role-Play Simulator

**Route:** `/field-sales-ai/role-play`

### What It Does
A two-panel conversational interface where the AI plays a realistic customer persona, and the user responds as the HDFC Bank Relationship Manager. After the conversation, users can request a real-time performance score across five dimensions.

### How It Works
1. **Choose a Persona** — Select from 6 distinct customer characters, each with unique personality, industry, objection style, and hidden triggers (things that would make them say yes).
2. **Converse** — The AI stays fully in character. If you're generic or pushy, the customer becomes more resistant. If you demonstrate product knowledge and personalization, they warm up.
3. **Score Performance** — Click "Score My Performance" at any point to get a detailed evaluation.

### Customer Personas Available

| Persona | Industry | Product Interest | Difficulty |
|---------|----------|-----------------|------------|
| Rajesh Mehta — Skeptical CFO | Auto Components Manufacturing | Business Loan / LAP | Hard |
| Priya Sharma — Busy Entrepreneur | FMCG / Organic Food Retail | BL + Merchant Acquiring + PG | Medium |
| Amit Patel — Rate-Shopping Individual | IT / Technology | Home Loan | Medium |
| Harinder Singh — Progressive Farmer | Agriculture | Tractor Finance + Personal Loan | Easy |
| Suresh Reddy — Transport Fleet Owner | Logistics / Transportation | CV Loans (bulk) | Hard |
| Kavita Desai — Restaurant Chain Owner | Food & Beverage / Hospitality | Merchant Acquiring + PG + BL | Medium |

### Scoring Dimensions (each /20, total /100)
- **Rapport Building** — Did the RM establish connection before pitching?
- **Product Knowledge** — Were HDFC-specific product details accurate and relevant?
- **Objection Handling** — Were objections addressed with evidence and empathy?
- **Personalization** — Was the pitch tailored to the customer's specific situation?
- **Closing Technique** — Did the RM move towards commitment/next steps?

### Key Features
- Real-time character responses that react to RM quality
- Conversation phase tracker (Opening → Building Rapport → Closing)
- Side panel with persona intel and tips
- Downloadable score report
- Hidden triggers that the RM must discover through good questioning

---

## 2. Deal Win Probability Scorer

**Route:** `/field-sales-ai/deal-scorer`

### What It Does
Paste or fill in deal details, and AI instantly produces a win probability percentage with an animated visual gauge, detailed factor breakdown, specific risk analysis, and actionable recommendations to increase the odds.

### How It Works
1. **Select a Template** (optional) — Choose from Corporate Business Loan, Individual Home Loan, Vehicle/CV/Tractor Finance, or Merchant Acquiring. Templates pre-fill the input with relevant fields.
2. **Enter Deal Details** — Fill in customer info, product, amount, stage, competitor threat, key objections, relationship history.
3. **Click "Score This Deal"** — AI analyzes and returns a comprehensive assessment.

### Templates Available
- **Corporate Business Loan** — Company, industry, loan amount, existing banking, meeting stage, competitor threat, decision maker, main objection
- **Individual Home Loan** — Customer profile, property details, income, competitor offers, stage, blocker, urgency
- **Vehicle / CV / Tractor Finance** — Customer type, vehicle details, down payment, competitor, dealer relationship, urgency
- **Merchant Acquiring / PG** — Business details, turnover, current provider, pain point, products needed, bundling opportunity

### Output Includes
- **Visual Probability Gauge** — Animated SVG circle with color-coded score (Green 70+, Amber 45-69, Red <45)
- **Factor Breakdown Table** — 6 weighted factors scored individually
- **Strengths & Risks** — What's working for you vs. against you
- **Top 3 Actions** — Specific actions with expected probability improvement
- **Recommended Next Steps** — This-week checklist
- **Competitive Counter-Strategy** — How to neutralize the competitor threat
- **Cross-sell Opportunities** — Additional products to introduce

### Key Features
- Animated circular gauge with smooth CSS transitions
- Color-coded assessment (Strong Deal / Needs Work / At Risk)
- One-sentence actionable recommendation per risk factor
- Downloadable as PDF/Markdown/TXT

---

## 3. Lobby Mode — 60-Second Briefing

**Route:** `/field-sales-ai/lobby-mode`

### What It Does
Simulates the exact scenario from the client brief: *"I'm sitting in the client's reception lobby, hoping to onboard them today."* One click generates a complete meeting prep briefing card designed to be read in under 60 seconds.

### How It Works
1. **One-Click Scenarios** — Select a pre-built scenario (Pharma Company, IT Startup, Retail Chain, Real Estate Developer, Agri Business, Hospital Chain, Logistics Company).
2. **Or Type Your Own** — Describe your meeting in one sentence and hit "Generate Brief."
3. **Instant Output** — Full briefing card appears with generation time displayed.

### Scenarios Available

| Scenario | Industry | Product |
|----------|----------|---------|
| Pharma Company | Pharmaceutical | Business Loan ₹5 Cr |
| IT Startup | Technology/SaaS | LAP + Payment Gateway |
| Retail Chain | Retail | POS + QR + Working Capital |
| Real Estate Developer | Real Estate | LAP / Business Loan |
| Agri Business | Agriculture/Agribusiness | Tractor Finance + CV Loan |
| Hospital Chain | Healthcare | Business Loan + Payment Gateway |
| Logistics Company | Logistics/Transportation | CV Loan (bulk) + Fuel Card |
| Custom | User-defined | User-defined |

### Briefing Card Sections
- **Company Snapshot** — Industry, revenue, key trends, banking needs (table format)
- **Your Opening (First 30 Seconds)** — Exact opening line to use, personalized and industry-aware
- **3 Talking Points** — Ranked most → least important, each mapped to an HDFC product
- **Competitor Watch** — Most likely competitor and your specific counter
- **Likely Objections & Quick Responses** — Table of "They'll Say" → "You Say"
- **Before You Walk In — Checklist** — Mental prep and body language tips
- **Wow Factor — Industry Insight to Drop** — One stat/trend that makes you look hyper-prepared

### Key Features
- Generation time badge (shows how fast the briefing was created)
- Designed for mobile readability (short, punchy, scannable)
- Download as file for offline access
- Custom free-text input for real-world scenarios

---

## 4. Visual Battle Map Generator

**Route:** Integrated into `/field-sales-ai/doc-intelligence` (select "Visual Battle Map Generator" operation)

### What It Does
Generates interactive Mermaid diagrams — competitive positioning maps, deal flow visualizations, customer journey maps, and strategic battle plans — rendered as live visual charts directly in the browser.

### How It Works
1. Navigate to **Document Intelligence & Visualization**
2. Select the **"Visual Battle Map Generator"** operation
3. Choose a starter prompt or type your own
4. AI generates 2-3 Mermaid diagrams with interpretation bullets

### Starter Prompts
- "Create a competitive battle map: HDFC vs ICICI vs SBI vs Kotak for home loans"
- "Visualize the deal flow from cold prospect to closed deal for a business loan"
- "Map the customer journey for a merchant acquiring a POS terminal — all touchpoints"
- "Generate a cross-sell pathway diagram: Auto Loan → Credit Card → Insurance → LAP"
- "Create a visual battle map showing HDFC strengths vs competitor weaknesses for CV loans"

### Diagram Types Generated
- **Flowcharts** — Deal flows, customer journeys, sales process with decision branches
- **Pie Charts** — Market share, product distribution, win/loss ratios
- **Sequence Diagrams** — Multi-stakeholder interaction timelines
- **Gantt Charts** — Deal timeline and milestone planning

### Key Features
- Diagrams render live in the browser using Mermaid.js
- Each diagram includes 2-3 bullet interpretation ("What this means for your next meeting")
- Uses real HDFC products and realistic competitor names
- Downloadable as image or as Mermaid code for reuse

---

## 5. Post-Meeting AI Debrief

**Route:** `/field-sales-ai/debrief`

### What It Does
Transforms quick, raw meeting notes into structured professional outputs — CRM entries, follow-up emails, risk analysis, and next-best-actions. Designed for the RM who just walked out of a meeting and has 2 minutes to type rough notes.

### How It Works
1. **Select Meeting Type** — First Meeting, Follow-up, Negotiation, Objection-Heavy, Closing Attempt, or Lost Deal Post-Mortem.
2. **Type Raw Notes** — Informal bullet points, fragments, abbreviations — however the RM naturally captures.
3. **Click "Generate Full Debrief"** — AI produces all outputs simultaneously.
4. **Use Tabs** — Switch between Full Analysis, CRM Update, and Follow-up Email views.

### Meeting Types

| Type | Icon | Use Case |
|------|------|----------|
| First Meeting — New Prospect | 🤝 | Initial client meeting, gathering requirements |
| Follow-up Meeting | 🔄 | Second/third interaction, building relationship |
| Negotiation / Rate Discussion | 💰 | Price/rate negotiation phase |
| Objection-Heavy Meeting | ⚡ | Customer raised multiple concerns |
| Closing Attempt | 🎯 | Trying to get commitment/signature |
| Lost Deal — Post-Mortem | 📋 | Analyzing why a deal was lost |

### Output Sections
- **Meeting Analysis** — Summary, key takeaways table, sentiment assessment, risk flags
- **CRM Update** — Copy-paste ready structured entry with all fields
- **Follow-Up Email Draft** — Professional email with subject line, personalized content, value-add
- **Next Best Actions** — Priority-ordered weekly action items with cross-sell triggers
- **Preparation for Next Meeting** — Checklist of items to prepare

### Example Scenarios (Pre-built)
1. First Meeting — Pharma Company for Business Loan
2. Objection-Heavy — Home Loan rate negotiation with IT professional
3. Merchant Acquiring Visit — Restaurant chain with POS frustration

### Key Features
- Tabbed output for quick access to specific sections
- Copy-paste ready CRM format
- Professional email draft with warm-but-business tone
- Cross-sell trigger identification from meeting context
- Downloadable full debrief

---

## 6. Industry News Pulse

**Route:** Embedded on the Field Sales AI hub page (`/field-sales-ai`)

### What It Does
A real-time (simulated) news ticker displaying industry-specific headlines with direct sales implications. Gives RMs ready-made conversation starters and demonstrates how staying informed makes you a better sales professional.

### How It Works
- Displays automatically on the Field Sales AI hub page
- Filterable by industry sector
- Each news item includes a "Sales Angle" — the specific implication for an HDFC RM

### Sectors Covered

| Sector | Example Sales Angle |
|--------|-------------------|
| Pharmaceuticals | Expansion capital needed — Business Loan opportunity |
| Real Estate | Rate stability = buying confidence, push Home Loans in tier-2 |
| Electric Vehicles | EV dealers expanding — Merchant Acquiring + Vehicle Loan |
| FMCG / Retail | Kirana digital payments + working capital |
| Agriculture | Tractor Finance demand spike, pre-approve farmers |
| IT / Technology | High-income professionals = Home Loan + PL + Credit Card |
| Logistics | Fleet expansion = CV Loan demand + fuel cards |
| Healthcare | Equipment financing + Payment Gateway for billing |
| Manufacturing | PLI scheme = Business Loan + LAP for capacity |
| Fintech / Payments | Non-digital merchants = greenfield Merchant Acquiring |

### Key Features
- Live pulse indicator (animated green dot)
- Collapsible panel to save space
- Color-coded sentiment indicators (positive/mixed/negative)
- Sector filter buttons for quick navigation
- Each item has timestamp for recency feel
- "Sales Angle" callout box highlights the RM opportunity

---

## Technical Architecture

### New Files Created

| File | Purpose |
|------|---------|
| `data/field-sales-advanced.ts` | All personas, templates, scenarios, and news data |
| `app/field-sales-ai/role-play/page.tsx` | Role-Play Simulator page |
| `app/field-sales-ai/deal-scorer/page.tsx` | Deal Win Probability Scorer page |
| `app/field-sales-ai/lobby-mode/page.tsx` | 60-Second Lobby Briefing page |
| `app/field-sales-ai/debrief/page.tsx` | Post-Meeting Debrief page |
| `components/IndustryNewsPulse.tsx` | News Pulse reusable component |

### Modified Files

| File | Change |
|------|--------|
| `app/field-sales-ai/page.tsx` | Added Advanced Tools grid + News Pulse + imports |
| `data/field-sales-doc-config.ts` | Added Visual Battle Map Generator operation |

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **AI Model:** Claude claude-sonnet-4-6 via Anthropic SDK
- **Streaming:** Server-Sent Events (SSE) for real-time response rendering
- **Visualization:** Mermaid.js (integrated via Markdown component)
- **Styling:** Tailwind CSS
- **State:** React hooks (useState, useRef, useCallback)

### API Integration
All features use the existing `/api/chat` endpoint with customized system prompts per feature. Each tool sends:
- `messages` — User input
- `context` — Feature-specific system prompt
- `promptLevel` — Set to 'L4' for maximum quality

---

## Usage Guidelines for Workshop Facilitators

### Recommended Demo Flow
1. **Start with Lobby Mode** — Instant wow factor, shows AI speed and depth
2. **Show Role-Play** — Interactive, engaging, gets participants laughing
3. **Demo Deal Scorer** — Relatable to their daily pipeline
4. **Show Debrief** — Practical immediate value they can envision using
5. **End with Battle Maps** — Visual impact, memorable

### Key Talking Points
- "Imagine doing this before EVERY client meeting — 60 seconds of prep that makes you look like you spent 60 minutes"
- "The AI scores your conversation just like a sales trainer would — but available 24/7"
- "Your raw notes become a professional CRM entry and follow-up email in 10 seconds"
- "This is what 'AI-augmented selling' looks like in practice"

### Disclaimers (Must State)
- All data is synthetic — no real customer information is used or should be entered
- These tools are for demonstration and learning — not approved for production use
- Co-pilot Chat is the only currently sanctioned internal GenAI tool
- The objective is awareness and skill-building, not deployment

---

## Data Files Reference

### `data/field-sales-advanced.ts`

Contains:
- `ROLE_PLAY_PERSONAS` — 6 customer characters with full personality profiles
- `DEAL_SCORER_TEMPLATES` — 4 deal templates with fillable fields
- `LOBBY_MODE_SCENARIOS` — 7 pre-built scenarios + custom option
- `DEBRIEF_TEMPLATES` — 6 meeting type classifications
- `INDUSTRY_NEWS_ITEMS` — 10 sector-specific news items with sales implications

---

*Document generated: May 2026*
*Module: HDFC Retail Asset Sales — Field Sales AI*
*Status: Deployed on Vercel*
