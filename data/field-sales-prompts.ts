export interface FieldSalesPromptLevel {
  label: string;
  tag: string;
  prompt: string;
  color: string;
}

export interface FieldSalesLabExperiment {
  theme: string;
  icon: string;
  description: string;
  anchorScenario: string;
  levels: FieldSalesPromptLevel[];
}

export const FIELD_SALES_LAB_EXPERIMENTS: FieldSalesLabExperiment[] = [
  {
    theme: 'Pre-Meeting Prospect Research — Corporate Client',
    icon: '🏢',
    description: 'Watch how prompt precision transforms a vague "tell me about this company" into a battle-ready sales intelligence brief before walking into a corporate meeting.',
    anchorScenario: 'You are sitting in the reception lobby of Pinnacle Auto Components, hoping to onboard them today for Commercial Vehicle Loans.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'Tell me about the auto components industry in India so I can sell loans to them.'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'I am an HDFC Bank sales professional about to meet the CFO of Pinnacle Auto Components — a mid-size auto parts company in Pune with ~1800 employees and ~320 Cr revenue. They currently bank with ICICI. I want to pitch Commercial Vehicle Loans (they need fleet for logistics) and a Business Loan for expansion. Give me: (1) key talking points about the auto components industry, (2) likely financial pain points for a company this size, (3) questions I should ask the CFO, and (4) why HDFC is better than ICICI for their needs.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'I am about to walk into a meeting at Pinnacle Auto Components (Pune, ~320 Cr revenue, 1800 employees, auto parts supplier to Tata Motors). They bank with ICICI for CC/OD and Term Loan. My objective is to onboard them for: (a) Commercial Vehicle Loans for 12 logistics trucks, (b) Business Loan for capacity expansion. Analyse: (1) Auto components industry trends in 2025-26 — growth drivers, challenges, and how they affect borrowing needs, (2) Typical cash flow patterns and working capital cycles for an auto OEM supplier, (3) ICICI\'s likely product structure for them and its weaknesses I can exploit, (4) 5 high-impact questions to ask the CFO that demonstrate industry knowledge, (5) Competitive positioning matrix: HDFC CV Loan vs ICICI vs SBI vs Tata Motors Finance for fleet purchases, (6) Cross-sell opportunities beyond the initial products. Format as a 1-page pre-meeting intelligence brief I can review in 5 minutes.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: I am a Senior Relationship Manager at HDFC Bank, sitting in the reception lobby of Pinnacle Auto Components Pvt Ltd in Pune. Meeting is in 10 minutes with Rakesh Joshi (CFO). Company profile: auto parts manufacturer supplying Tata Motors, annual revenue ~320 Cr, 1800 employees, currently banking with ICICI (CC/OD + Term Loan). They are expanding logistics with 12 new commercial vehicles and need capacity expansion finance. ICICI has been their primary banker for 5 years. I have 1 chance to make a strong impression and initiate the relationship.\n\nRole: You are a senior banking sales strategist with 15 years experience in corporate relationship management. You understand manufacturing sector financing, fleet management economics, and competitive banking dynamics.\n\nAction: Create a comprehensive pre-meeting intelligence brief that will make me the most prepared person in the room. Include: (1) Industry snapshot — auto components sector health, Tata Motors supply chain dynamics, and what this means for Pinnacle\'s growth, (2) Client financial intelligence — likely revenue mix, margin structure, working capital cycle, and borrowing needs for a company this profile, (3) ICICI vulnerability analysis — where ICICI typically underserves mid-size manufacturers and what gaps I can position against, (4) Meeting conversation strategy — opening rapport builder, 5 power questions, objection anticipation (rate, relationship, switching cost), and closing technique, (5) Product packaging — how to bundle CV Loan + Business Loan + Corporate Cards + Current Account as a relationship, (6) Competitive positioning table vs ICICI/SBI/Tata Finance.\n\nFormat: Deliver as a crisp, scannable 1-page brief with bullet points, tables where helpful, and a clear "First 5 Minutes" script I can memorize before walking in.\n\nTarget Audience: Me — a field sales professional who needs this in my head before the meeting starts in 10 minutes.'
      }
    ]
  },
  {
    theme: 'Objection Handling — Rate-Sensitive Home Loan Customer',
    icon: '🏠',
    description: 'See how layered prompting transforms generic objection responses into empathetic, data-backed counter-strategies that close deals.',
    anchorScenario: 'A young IT couple is comparing HDFC Home Loan (8.50%) with SBI (8.25%) and Kotak (8.45%). They are about to sign with Kotak.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'How do I convince a customer to take HDFC home loan when SBI is offering lower rate?'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'A young IT couple (combined income 32 LPA, both in Pune, first-time buyers) is about to sign with Kotak Mahindra for a home loan of 1.2 Cr at 8.45%. Our rate is 8.50%. SBI has offered 8.25% but they ruled out SBI due to slow processing. The couple is data-driven and has done Excel comparisons. Create 3 response strategies to win them back: (1) Total cost of ownership argument (include processing fees, insurance, prepayment flexibility), (2) Service and speed differentiators, (3) Relationship value proposition (cross-sell bundle that makes effective cost lower). Include specific numbers they can verify.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Customer: Neha (29, Wipro, 16 LPA) & Vikram (31, TCS, 16 LPA). Home loan: 1.2 Cr for 3BHK in Hinjewadi, Pune. 20 years tenure. Current offers: Kotak 8.45% + nil processing, HDFC 8.50% + 0.5% processing, SBI 8.25% (rejected for slow processing). The couple has created an Excel comparison showing Kotak saves them 1.2L over loan life vs HDFC. They are visiting our branch tomorrow for "final answer." Analyse: (1) Calculate EXACT total cost comparison across all 3 lenders for 20 years (EMI, processing fee, insurance cost, prepayment charges, rate reset frequency), (2) Identify the hidden costs in Kotak\'s offer (insurance bundling, rate reset mechanism, prepayment lock-in), (3) Build a "Year 1-5 benefit" model showing HDFC advantages in early years, (4) Create 3 objection responses graded by customer personality type (analytical, emotional, time-pressed), (5) Design a "same-day closer" offer I can present that makes them sign tomorrow. Present as a battle card the RM can carry into the meeting.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: Neha Patel (29, Product Manager at Wipro, 16 LPA) and Vikram Patel (31, Tech Lead at TCS, 16 LPA) are buying their first home — a 3BHK in Hinjewadi, Pune for 1.4 Cr (loan 1.2 Cr, down payment 20L). They have visited 3 banks. Kotak offered 8.45% + zero processing fee + gold coin. SBI offered 8.25% but they rejected it after 3 branch visits with no progress. Our offer: 8.50% + 0.5% processing. The couple shared their Excel: Kotak saves 1.2L vs HDFC over 20 years. They told our RM Snehal: "Give us one good reason to choose HDFC — we are signing with Kotak this weekend." Meeting is tomorrow at 11 AM.\n\nRole: You are HDFC\'s top-performing Home Loan Sales Trainer — you have coached 200 RMs and personally closed 500+ deals against lower-rate competitors. You know that rate is rarely the real decision driver for informed buyers; trust, flexibility, and total experience win.\n\nAction: Create a complete "Deal Rescue Kit" for RM Snehal to win this couple back tomorrow. Include: (1) Rate myth-buster: recalculate their Excel correctly (factor in Kotak\'s annual reset mechanism vs HDFC\'s monthly RLLR, actual insurance costs, processing fee tax benefit), (2) Emotional connection strategy for first-time buyers (fear of getting stuck, importance of responsive bank, horror stories from slow lenders), (3) "What if" scenarios that favour HDFC (prepayment after 3 years, rate drop benefit pass-through speed, balance transfer ease), (4) Same-day closing offer construction (what can Snehal offer within RM authority?), (5) Exact meeting script: first 5 minutes, key pivot moments, and closing line, (6) Plan B: if they still choose Kotak, set up the balance transfer follow-up for 12 months later.\n\nFormat: (1) 1-page battle card (table format) for quick reference, (2) Full meeting conversation script with branching for different responses, (3) Cost comparison corrected table with HDFC advantage highlighted, (4) Closing offer template needing only BM signature.\n\nTarget Audience: RM Snehal Patil — 3 years experience, good relationship skills, but struggles with data-heavy objections. Make it simple enough to internalize in 30 minutes before the meeting.'
      }
    ]
  },
  {
    theme: 'Industry Research — Entering a New Vertical (Renewable Energy)',
    icon: '☀️',
    description: 'Demonstrate how AI helps a sales professional rapidly learn a new industry vertical to sound credible in a prospect meeting.',
    anchorScenario: 'You just got assigned to cover renewable energy companies and have a meeting with a solar installation company CFO in 2 hours.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'Tell me about the renewable energy industry in India for a banking sales meeting.'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'I am meeting the CFO of SolarTech Energy Solutions (Ahmedabad, 280 Cr revenue, 1200 employees, solar panel installation company). I have never sold to the renewable energy sector before. Brief me on: (1) How solar installation companies make money — revenue model and cash flow cycle, (2) Their typical banking needs and borrowing patterns, (3) Key financial challenges (government subsidy delays, project finance, equipment costs), (4) HDFC products that fit their needs (Business Loan, CV for specialized vehicles, LAP), (5) Industry jargon I should know to sound credible.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Meeting in 2 hours with Harsh Patel (Director Finance, SolarTech Energy Solutions, Ahmedabad). Company: 280 Cr revenue, 1200 employees, solar panel EPC (engineering, procurement, construction) company. They install rooftop and ground-mount solar for commercial and industrial clients. Currently banking with Yes Bank (working capital) and want to expand fleet with 8 specialized vehicles for panel transportation/installation. Analyse: (1) Solar EPC business model — revenue recognition, project cycles, cash flow gaps between milestone payments, (2) Government incentive landscape — PM Kusum, PLI for solar, state policies, and how subsidy delays affect cash flow, (3) Why they might be unhappy with Yes Bank (known issues with Yes Bank corporate banking post-crisis), (4) Product fit analysis: rank our products by relevance — Business Loan, CV Loan, LAP, Working Capital, PG, (5) Competitive positioning vs Tata Capital and Yes Bank for this segment, (6) 5 industry-specific questions that show domain expertise, (7) Red flags to watch for in renewable energy lending (project viability, subsidy dependency). Deliver as a rapid-prep intelligence brief.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: I am a Senior RM at HDFC Bank, Ahmedabad. I have been assigned to cover the renewable energy sector — a vertical I have zero experience in. My first meeting is in 2 hours with Harsh Patel (Director Finance) at SolarTech Energy Solutions. Company profile: Solar EPC company, 280 Cr revenue, 1200 employees, installs rooftop and ground-mount solar for commercial/industrial clients across Gujarat and Rajasthan. They currently bank with Yes Bank (working capital facility 40 Cr) and want: (a) 8 specialized vehicles for panel transport (CV Loan), (b) Project finance for a large government tender (Business Loan ~10 Cr), (c) Possibly a payment gateway for B2B milestone collections. My knowledge gap: I don\'t know solar industry economics, project financing norms, government subsidy mechanisms, or industry terminology.\n\nRole: You are a sector research analyst at HDFC who supports field RMs with industry intelligence. You combine deep sector knowledge with practical sales applicability — every insight must translate to a talking point or question for the RM.\n\nAction: Create a "Zero to Credible in 2 Hours" industry crash course and meeting prep kit covering: (1) Solar EPC 101: business model canvas, typical project lifecycle, revenue/cost structure, and cash flow pattern diagram, (2) India solar market snapshot: installed capacity, growth trajectory, key policies (PM Kusum, PLI, RPO), state-wise opportunity, (3) SolarTech-specific intelligence: what a 280 Cr solar EPC likely looks like financially, their client mix (C&I vs government), margin structure, and why they need external finance, (4) Banking needs map: which products fit at which stage of their business cycle, (5) Yes Bank vulnerability: known service gaps post-2020 that I can position against, (6) Conversation strategy: 5 smart questions that demonstrate sector knowledge, 3 things to NEVER say (that mark you as a sector novice), and key terminology cheat sheet, (7) Product proposal framework: how to package CV Loan + Business Loan + PG as a relationship.\n\nFormat: (1) Industry 1-pager with visual structure (bullet points, not paragraphs), (2) Key terminology glossary (10 terms: EPC, PPA, RPO, DCR, etc.), (3) Meeting conversation map (15-minute structure), (4) Product-fit table with talking points per product.\n\nTarget Audience: Me — an experienced banker who is credible in conversation but needs sector-specific ammunition quickly. I can memorize 10 key facts and 5 questions in 2 hours.'
      }
    ]
  },
  {
    theme: 'Personalizing the Pitch — Individual vs Corporate Borrower',
    icon: '🎯',
    description: 'Experience how the same loan product requires completely different pitch strategies for an individual first-time buyer vs a corporate fleet manager.',
    anchorScenario: 'You have back-to-back meetings: first with a farmer wanting a tractor loan, then with a logistics company CFO wanting 20 commercial vehicles.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'How should I pitch vehicle loans to different types of customers?'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'I have two vehicle loan meetings today: (A) Ramesh Yadav — a farmer in Indore with 15 acres, wants a Mahindra 575 tractor (cost 8L), has no CIBIL score, income from crop sales + a small soybean processing unit, currently banks with BoB who offered tractor loan at 9%. (B) Deepak Patil — VP Operations at Bharat Logistics (420 Cr revenue), needs 20 new delivery trucks for an Amazon last-mile contract, currently has 3 vehicle loans with HDFC, SBI offering fleet rate at 8.75%. Create separate pitch strategies for each meeting: key selling points, objection handling, documentation approach, and cross-sell opportunities. Show how my conversation style must shift between the two.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Back-to-back meeting analysis for vehicle finance:\n\nMEETING A (10 AM - Village visit): Ramesh Yadav, 45, farmer + trader, Indore district. 15 acres irrigated land + small soybean processing unit. Annual income ~8L (seasonal). Zero CIBIL. Wants Mahindra 575 tractor (~8L). BoB offers tractor loan at 9% but slow; Mahindra Finance will do no-document but at 13.5%. His concern: "Why should I give so many documents when Mahindra Finance doesn\'t ask?"\n\nMEETING B (3 PM - Corporate office): Deepak Patil, VP Operations, Bharat Logistics Solutions, Mumbai. 420 Cr revenue, 2500 employees. Existing customer (3 vehicle loans with HDFC). Needs 20 Tata Ace trucks for Amazon last-mile delivery contract. SBI offering fleet rate 8.75%. His concern: "For 20 vehicles, I expect fleet pricing below 9%. What can you do?"\n\nAnalyse for each meeting: (1) Customer psychology and decision-making factors, (2) Value proposition that resonates (not generic benefits), (3) Specific objection counter-strategy with numbers, (4) Conversation opening and closing technique, (5) Cross-sell identification and timing, (6) Risk factors for the bank and mitigation. Present as two separate 1-page meeting briefs.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: I am an HDFC RM covering both rural (tractor finance) and urban (commercial vehicles) segments. Today I have two critical meetings that require completely different approaches:\n\nMEETING A — Ramesh Yadav (farmer, Indore rural): 45 years old, 15 acres irrigated farmland, grows soybean and wheat. Runs a small dal processing unit (additional income). Has a Kisan Credit Card with BoB but no other formal credit history. Wants Mahindra 575 DI tractor (on-road ~8.5L). Alternatives: BoB tractor loan at 9% (approved but slow — 25 days); Mahindra Finance at 13.5% (no documents, same day). His son uses UPI heavily (10L+ monthly through processing unit). The farmer is skeptical of banks asking too many questions.\n\nMEETING B — Deepak Patil (VP Ops, Bharat Logistics): 420 Cr company, 2500 employees, national fleet of 500+ vehicles. Won Amazon last-mile contract for West India (200 pin codes). Needs 20 Tata Ace Mini trucks immediately. Has 3 existing CV loans with HDFC (excellent repayment). SBI Corporate offering fleet rate 8.75% for entire contract. His concern: volume-based pricing and speed of execution. He needs vehicles on road in 30 days.\n\nRole: You are HDFC\'s best vehicle finance sales trainer. You understand that selling a tractor to a farmer requires trust, simplicity, and respect — while selling fleet finance to a corporate requires data, speed, and commercial acumen. The common mistake RMs make is using the same pitch for both.\n\nAction: Create two separate meeting preparation kits that demonstrate the art of pitch personalization:\n\nFor Meeting A (Farmer): (1) Rapport-building approach in rural context, (2) How to explain our product simply without banking jargon, (3) Alternative credit assessment pitch (UPI data as income proof), (4) Rate comparison simplified (EMI per month vs BoB vs Mahindra), (5) Harvest-linked EMI explanation, (6) Cross-sell: Personal Loan for daughter\'s education + Kisan Credit Card.\n\nFor Meeting B (Corporate): (1) Fleet economics model (cost per delivery per vehicle), (2) Fleet pricing proposal structure, (3) Speed commitment: how to guarantee 30-day vehicle delivery, (4) Value-adds beyond rate (dedicated fleet RM, insurance tie-up, fuel cards), (5) SBI counter-positioning (we are faster, dedicated fleet desk, same-day approval for existing customers), (6) Cross-sell: Corporate Credit Cards for drivers + Working Capital for operations.\n\nFormat: Two distinct 1-page battle cards — Meeting A in simple Hindi-English mixed language points that a rural-visiting RM would use; Meeting B in crisp corporate presentation format with numbers and timelines.\n\nTarget Audience: An RM who must code-switch between these two worlds in a single day — show them HOW the approach fundamentally differs.'
      }
    ]
  },
  {
    theme: 'Cross-Selling at Point of Onboarding',
    icon: '🔄',
    description: 'Master the art of identifying and pitching cross-sell products at the moment of primary product onboarding — when customer trust is highest.',
    anchorScenario: 'A customer is signing auto loan documents. You have 10 minutes to introduce Credit Card, Insurance, and CASA without seeming pushy.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'What other products can I sell to a customer taking an auto loan?'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'Priyanka Reddy (28, Product Manager at Google, 42 LPA) is finalizing her BMW X1 auto loan (18L, 5 years) at our Bangalore branch. She is an existing savings account customer. At this moment of high engagement, create a cross-sell strategy for: (1) Credit Card upgrade to Infinia (she currently has Millennia), (2) Motor Insurance through HDFC Ergo, (3) CASA salary account migration (salary goes to ICICI currently). For each: the natural conversation bridge from auto loan signing, the 30-second elevator pitch, and handling a "not now" response.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Onboarding moment cross-sell maximization:\n\nCustomer: Priyanka Reddy, 28, Google PM, 42 LPA, Bangalore. Auto Loan: BMW X1, 18L, 5 years at 8.9%.\nExisting relationship: HDFC Savings Account (low balance, salary goes to ICICI).\nProfile signals: High spender (50K+ monthly card spends on Millennia), frequent traveler (4 international trips/year), fitness enthusiast.\n\nAnalyse: (1) Customer lifetime value calculation if we convert her to full banking relationship vs auto-loan-only, (2) Product priority ranking by conversion probability at this exact moment, (3) Psychological triggers that work during loan signing (commitment consistency, reciprocity, loss aversion), (4) Natural conversation flow that introduces 3 products without seeming transactional, (5) Specific Infinia card benefits that map to her lifestyle (travel, dining, fuel), (6) Salary account migration economics (what she gains by moving salary to HDFC), (7) Revenue impact per product for the branch. Build a "10-Minute Cross-sell Playbook" for this exact customer at this exact moment.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: Priyanka Reddy is sitting across from me at our Koramangala branch, pen in hand, about to sign her BMW X1 auto loan documents (18L, 5 years, 8.9%). She is relaxed, excited about the car, and has just said "This was so smooth — much easier than I expected!" This is the golden moment for cross-selling.\n\nHer profile: 28, Product Manager at Google India, 42 LPA, lives in Indiranagar. Existing HDFC customer: Savings Account (opened as student, low balance 50K), HDFC Millennia Credit Card (50K monthly spends, mostly travel and dining). Salary goes to ICICI (20+ years family banking relationship). Single, travels 4x internationally per year, frequent diner, fitness enthusiast (Cult Fit membership). Digital-native, hates paperwork.\n\nCross-sell targets (priority order): (1) Infinia Credit Card upgrade (lifetime value: 2.5L), (2) Salary Account migration to HDFC (float income: 3.5L/year average balance), (3) Motor Insurance via HDFC Ergo (premium: 45K), (4) Personal Loan pre-approved offer loading (for future furniture/interior).\n\nRole: You are a behavioral selling expert who specializes in cross-sell at moments of positive customer emotion. You know that the signing moment has 3x higher conversion than any follow-up call. Your technique: natural conversation bridges, lifestyle-aligned benefits, and zero-pressure "let me just show you" approach.\n\nAction: Design a complete 10-minute cross-sell conversation playbook for RM Ravi Kumar:\n(1) Opening bridge: How to transition from "congratulations on the car" to "while you\'re here, let me show you something perfect for your new BMW lifestyle"\n(2) Infinia pitch: 45-second lifestyle pitch (not feature dump) — specifically: which Infinia benefits map to BMW owners (fuel surcharge, international lounge, dining)\n(3) Salary migration: 30-second "did you know" approach — auto-EMI debit advantage + sweep facility\n(4) Insurance: 20-second "before you drive out" urgency + instant digital issuance\n(5) Handling "I\'ll think about it" — a graceful fallback that keeps the door open without pressure\n(6) The "paperless" angle — how to make cross-sell signup as digital as possible (she hates forms)\n\nFormat: (1) A conversation script with RM lines and expected customer responses (decision-tree style), (2) Product benefit cards: 3 bullet points per product mapped to HER lifestyle, (3) Fallback calendar: if not today, when and how to follow up.\n\nTarget Audience: RM Ravi Kumar who has good rapport skills but tends to over-explain features instead of connecting to lifestyle. Make the script conversational, not salesy.'
      }
    ]
  },
  {
    theme: 'Merchant Acquiring — Converting a Cash-Heavy Business to Digital',
    icon: '💳',
    description: 'Learn to pitch payment solutions to traditional businesses that have resisted digital adoption — the conversation requires education before selling.',
    anchorScenario: 'A successful catering business owner handles 90% transactions in cash. You need to show him why going digital helps his business grow.',
    levels: [
      {
        label: 'Simple',
        tag: 'L1',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        prompt: 'How do I convince a merchant to use POS machine when they prefer cash?'
      },
      {
        label: 'Detailed',
        tag: 'L2',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        prompt: 'Mohammed Sharif runs Royal Catering & Events in Chennai (monthly turnover ~38L, 90% cash). His clients are increasingly asking for card/UPI payment for large event bookings (2-10L per event). He is worried about: GST scrutiny if he goes digital, MDR eating into thin margins (15% profit), and learning new technology. Create a pitch strategy that addresses each concern with specific benefits: how digital payments actually GROW his business, not just formalize it. Include a comparison of his current cash vs digital scenario with real numbers.'
      },
      {
        label: 'Analytical',
        tag: 'L3',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        prompt: 'Client: Mohammed Sharif, Royal Catering & Events, Chennai. Business: event catering for weddings, corporate events, social gatherings. Monthly revenue ~38L (90% cash, 10% UPI through personal account). Employees: 45. He lost 3 corporate event contracts last month because companies insisted on invoice + digital payment — this is his trigger for considering change.\n\nAnalyse: (1) Revenue impact model: how much business he is LOSING by being cash-only (estimate based on industry shift), (2) MDR cost analysis at 1.5-1.8% vs revenue uplift from accepting cards (typical 20-30% revenue increase for cash-heavy businesses going digital), (3) GST concern address: show him the actual tax math — formalization benefits (input credit, easier compliance, lower audit risk), (4) Technology adoption path: simplest possible setup for a non-tech person (QR + 1 POS + payment links for advance booking), (5) Cash flow improvement: instant advance collection vs chasing payments post-event, (6) Business loan eligibility: how 6 months of POS data makes him eligible for collateral-free business loan (which he cannot get today with cash income), (7) Full solution package: POS + QR + Payment Link + Current Account + Business Loan pathway. Present as a "Business Growth Calculator" that shows him the 12-month impact.'
      },
      {
        label: 'CRAFT Framework',
        tag: 'L4',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        prompt: 'Context: Mohammed Sharif owns Royal Catering & Events in Chennai. 15 years in business, 45 employees, monthly turnover approximately 38 lakhs. 90% cash transactions through personal account UPI (10%). He just lost 3 corporate event contracts (total value 12L) because companies demanded proper invoices and card payment facilities. His wife manages accounts in a notebook. He is semi-literate in English but sharp in business — runs everything on relationships and reputation. He agreed to meet me after his regular customer (who is our existing client) referred him.\n\nHis concerns (in his words): "Saar, if I do digital, income tax will come. My margins are only 15%. I don\'t know computer. My staff will make mistakes. And these machines charge commission on every transaction — how is that good for me?"\n\nProduct opportunity: POS (2 terminals for event venue) + QR code + Payment Link (for advance booking) + Current Account + Future Business Loan (after 6 months digital history).\n\nRole: You are a Merchant Acquisition specialist who has converted 200+ cash-heavy merchants. You understand that for traditional business owners, the conversation is 80% education and trust-building, and 20% product. You never start with the product — you start with their business problem.\n\nAction: Create a complete merchant conversion playbook for RM Manoj Bhagat:\n(1) Trust-building opening: acknowledge his success running cash business for 15 years; don\'t make him feel wrong for being cash-heavy\n(2) Problem amplification: the 12L he lost is just the start — show the trend of corporate clients moving to compliant vendors\n(3) Fear-to-opportunity reframe: GST concern reframed as "you\'re already paying GST on purchases — input credit actually SAVES you money"\n(4) Business Growth Calculator: side-by-side comparison showing Year 1 with digital (revenue growth 25% from new corporate clients, input credit savings, business loan eligibility) vs staying cash (declining corporate business, audit risk, no bank credit access)\n(5) Simplicity assurance: "Your staff already knows UPI — POS is the same button press" + training included\n(6) Zero-risk trial: propose 3-month pilot with zero terminal cost (tied to Current Account)\n(7) The relationship sweetener: after 6 months of POS data showing 38L+ monthly turnover, pre-approve him for a 20L collateral-free business loan (he cannot get this today)\n(8) Cross-sell sequencing: Month 1 (POS + QR + CA), Month 6 (Business Loan pre-approved), Month 12 (Vehicle Loan for event van + Corporate CC)\n\nFormat: (1) Conversation script in simple English (some Tamil business terms acceptable), (2) 1-page visual "Business Growth Calculator" he can take home and show his wife, (3) 3-month pilot proposal template, (4) Objection response card for the 5 common cash-merchant objections.\n\nTarget Audience: RM Manoj who needs to make this pitch feel like business advice, not a product sale. The merchant should walk away feeling "this banker understood my business" not "he was trying to sell me something."'
      }
    ]
  },
];

export const FIELD_SALES_DISCLAIMER = 'IMPORTANT DISCLAIMERS: (1) No bank-confidential data is to be entered into any external Gen AI tool, on any personal device, at any point. (2) No tool demonstrated here is approved for production bank workflow — this is for demonstration and learning purposes only. (3) Co-pilot Chat is the only currently sanctioned internal Gen AI tool. (4) All exercises showcase awareness and possibility, not a deployment-ready toolkit.';
