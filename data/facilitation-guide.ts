// ─── Workshop Facilitation Guide ───
// Maps to the 2-day leadership program facilitation framework.
// Each entry has: intent, facilitation tips, common pushback + responses.

export interface FacilitationItem {
  id: string;
  title: string;
  icon: string;
  section: 'prompt-lab' | 'doc-intelligence' | 'sales-ai' | 'use-cases';
  intent: string;
  facilitationTips: string[];
  pushbacks: { question: string; response: string }[];
  liveExercisePrompt?: string;
  keyTakeaway: string;
}

export const FACILITATION_GUIDE: FacilitationItem[] = [
  {
    id: 'fg-myths',
    title: 'GenAI Myths vs Bank Reality',
    icon: '💡',
    section: 'use-cases',
    intent: 'Kill fear early. People are assuming, unaware, messy. Debunk myths before they become blockers.',
    facilitationTips: [
      'Use Slido or raise-hand poll: "True or False: GenAI can read our CBS data directly"',
      'Debunk each myth in 1 line — don\'t lecture, shock-and-reveal',
      'End with the anchor phrase: "GenAI is like an intern with Google. Smart, but needs supervision."',
      'Ask: "Which myth did YOU believe before today?" — gets honest engagement',
      'Flip cards work great — let them discover, don\'t tell them',
    ],
    pushbacks: [
      { question: 'Is it safe at all?', response: 'Safe if we control data. That\'s why synthetic data + human review. No customer PII ever touches external AI.' },
      { question: 'Our IT won\'t allow this', response: 'IT controls the guardrails (system prompts). You control the business value (user prompts). You need each other.' },
      { question: 'This is just hype, right?', response: 'JPMorgan saves 360,000 lawyer hours/year with AI contract analysis. ICICI uses AI for KYC. This is happening — question is whether we lead or follow.' },
    ],
    liveExercisePrompt: 'True or False: GenAI can make a lending decision without human approval. [Answer: FALSE — RBI mandates human accountability. AI recommends, humans decide.]',
    keyTakeaway: 'GenAI is like an intern with Google. Smart, but needs supervision.',
  },
  {
    id: 'fg-prompt-library',
    title: 'Prompt Library for Mortgage Leaders',
    icon: '📚',
    section: 'prompt-lab',
    intent: 'This is the "star of the day" takeaway. Leaders leave with a practical toolkit they can use Monday morning.',
    facilitationTips: [
      'Print 1-pager with top 10 prompts. Have them scan QR to download the full library',
      'Make them run Prompt #3 LIVE: "Summarize this credit appraisal note in 5 bullets for my manager"',
      'Do L1 vs L4 side-by-side comparison — the "jaw drop" moment when quality difference is visible',
      'Ask: "Which of these 10 prompts would save YOU the most time this week?" — gets personal commitment',
      'End with: "Pick ONE prompt. Use it 5 times this week. That\'s your homework."',
    ],
    pushbacks: [
      { question: 'Will this work on my data?', response: 'Structure will. Content needs your inputs. Never paste customer PII. Use the CRAFT framework and fill in YOUR context.' },
      { question: 'I don\'t have time to learn prompting', response: 'You already prompt every day — when you brief your team, write emails, ask questions in meetings. This is the same skill, typed instead of spoken.' },
      { question: 'Can\'t I just use ChatGPT?', response: 'Not for bank work — data privacy. Use bank-approved platforms only. This playground shows what\'s possible within guardrails.' },
    ],
    liveExercisePrompt: 'Summarize this credit appraisal note in 5 bullets for my manager. Focus on: income assessment, property risk, CIBIL observations, recommendation, and one concern. Keep each bullet under 20 words.',
    keyTakeaway: 'Pick ONE prompt. Use it 5 times this week. That\'s your homework.',
  },
  {
    id: 'fg-red-flags',
    title: 'Red Flag Detection in Docs',
    icon: '🚩',
    section: 'doc-intelligence',
    intent: 'Service + Credit teams love this. Immediate time save — AI as first-pass compliance checker.',
    facilitationTips: [
      'Use the synthetic sanction letter with 1 missing signature + income mismatch baked in',
      'Give the prompt: "List 3 compliance risks with severity and page numbers"',
      'Celebrate when AI finds it — "This took AI 8 seconds. How long does your team take?"',
      'Show the Red Flag Scanner in Doc Intelligence — load the red_flag_samples.csv',
      'Ask credit officers: "What red flag would YOU add to this list?" — crowdsource their expertise',
    ],
    pushbacks: [
      { question: 'Can we trust it?', response: 'Trust but verify. AI is the first-pass checker. You are the final sign-off. It catches 80% of routine flags in seconds — you focus on the complex 20%.' },
      { question: 'What if it misses something?', response: 'Same question you\'d ask about a new analyst. That\'s why HITL review is mandatory. AI + Human > Either alone.' },
      { question: 'Our compliance team won\'t accept AI findings', response: 'AI doesn\'t make compliance decisions — it flags potential issues for human review. Think of it as a spell-checker for compliance.' },
    ],
    liveExercisePrompt: 'Review this sanction letter and flag all red flags: Loan INR 75L, property value INR 85L (LTV 88%), applicant age 58, retirement in 2 years, EMI-to-income ratio 62%, co-applicant listed but no income docs, property under-construction with no RERA mentioned. List severity (Critical/High/Medium) and recommended action for each.',
    keyTakeaway: 'AI is the first-pass checker. You are the final sign-off.',
  },
  {
    id: 'fg-voc',
    title: 'VoC in 60 Seconds',
    icon: '👂',
    section: 'sales-ai',
    intent: 'Service leaders drown in complaints. Quick win — analyze customer voice in seconds instead of hours.',
    facilitationTips: [
      'Use 3 synthetic emails: 1) angry customer about delay, 2) renewal query, 3) foreclosure request',
      'Give the prompt: "Give 3 pain points + 1 resolution + urgency: High/Med/Low"',
      'Time it visibly: "That analysis took 12 seconds. Your service team does this for 200 emails/month."',
      'Show tone sensitivity: Run same complaint with "Use HDFC empathetic tone. No jargon" added to prompt',
      'Ask: "How many hours does your team spend on complaint categorization weekly?"',
    ],
    pushbacks: [
      { question: 'What if tone is wrong?', response: 'Add to your prompt: "Use HDFC empathetic tone. No jargon. Professional but warm." The CRAFT framework gives you this control.' },
      { question: 'Our service desk already has tools', response: 'This isn\'t replacing tools — it\'s augmenting. AI drafts, your team reviews and personalizes. Faster first response = higher CSAT.' },
      { question: 'Customers will know it\'s AI', response: 'Only if you send it as-is. AI drafts, human reviews and adds the personal touch. The customer gets faster + personalized response.' },
    ],
    liveExercisePrompt: 'Analyze these 3 customer messages and for each provide: main pain point, urgency (High/Medium/Low), recommended resolution, and a draft response in HDFC empathetic tone.\n\n1. "I applied for home loan 3 weeks ago and NO ONE has called me back. I gave all documents. SBI approved mine in 5 days. Very disappointed."\n\n2. "My home loan renewal is coming up next month. What are current rates? Can I get a better deal as existing customer?"\n\n3. "I want to foreclose my loan account HL-2023-4567. Please provide foreclosure amount and process. Need this done before March 31."',
    keyTakeaway: 'VoC analysis: from hours to seconds. AI categorizes, you personalize.',
  },
  {
    id: 'fg-30day',
    title: 'Your First 30-Day Plan',
    icon: '📅',
    section: 'use-cases',
    intent: 'Converts learning to action. The "one opportunity to try" that makes this training stick.',
    facilitationTips: [
      '3-box worksheet: Week 1-2 (Quick Win) | Week 3 (Team Training) | Week 4 (Measure & Share)',
      '5 minutes SILENT fill — no discussion yet. Let them think personally',
      'Ask 2 volunteers to share their plan. Celebrate specificity over ambition',
      'Commit publicly: "My 30-day AI action is: ___" — peer accountability works',
      'Photograph their worksheets. Email copies back. Follow up in 30 days',
    ],
    pushbacks: [
      { question: 'No time after training', response: 'Pick 1 thing that takes you 10 minutes/week today. Automate THAT first. If it saves even 5 minutes, you\'ve already won.' },
      { question: 'I need IT approval first', response: 'You don\'t need IT to practice prompting. Use this playground with synthetic data. When you have results, THEN take the business case to IT.' },
      { question: 'What if my team resists?', response: 'Don\'t mandate — demonstrate. Show them the time saved. When they see you using it, curiosity beats resistance.' },
    ],
    liveExercisePrompt: 'Create my personal 30-day GenAI action plan as a Branch Head managing home loans. I want to: Week 1-2: Automate one daily task (my daily MIS compilation takes 2 hours). Week 3: Train one team member on prompt engineering. Week 4: Measure time saved and present to regional head. For each week, give me specific actions, which prompts to use from the library, and how to measure success.',
    keyTakeaway: 'Pick 1 thing. Automate it. Measure the impact. Then expand.',
  },
  {
    id: 'fg-objection',
    title: 'Objection Handler Bot',
    icon: '🗣️',
    section: 'sales-ai',
    intent: 'Sales leaders\' #1 daily pain. Highest feedback score area in every workshop.',
    facilitationTips: [
      'Take a REAL objection from the room: "SBI giving 8.4%. Why HDFC 8.65%?"',
      'Run 3 tones live: Empathetic, Data-driven, Offer-led',
      'Ask the group: "Which response would YOU send to this customer?"',
      'Edit the best one LIVE — add local context, change a number, personalize',
      'Key moment: when they realize they can iterate, not just generate',
    ],
    pushbacks: [
      { question: 'Compliance will block this', response: 'You\'re drafting, not sending. All outputs need manager review per policy. Think of it as a senior RM helping you write the first draft.' },
      { question: 'Every customer is different', response: 'Exactly — that\'s why you EDIT the AI output. AI gives you 80% in 10 seconds. You add the 20% that\'s personal knowledge.' },
      { question: 'My RMs won\'t use technology', response: 'They use WhatsApp and Google Maps. This is simpler. Show the time saving: 15 minutes drafting → 2 minutes editing.' },
    ],
    liveExercisePrompt: 'Customer objection: "SBI is giving 8.4% and processing in 7 days. HDFC offered me 8.65% and said 2 weeks. Why should I wait and pay more?"\n\nGenerate 3 responses:\n1. EMPATHETIC: Acknowledge frustration, redirect to long-term value\n2. DATA-DRIVEN: Total cost comparison over 20 years including all fees\n3. OFFER-LED: What we can offer today to close\n\nMake each response sound like a real RM talking, not a script.',
    keyTakeaway: 'AI drafts 3 options in 10 seconds. You pick the best one and make it yours.',
  },
  {
    id: 'fg-walkin',
    title: 'Branch Walk-in to Lead',
    icon: '🚶',
    section: 'sales-ai',
    intent: 'Service branches = lead leak. This plugs it. Every walk-in becomes a CRM-ready lead.',
    facilitationTips: [
      'Show a messy handwritten note image (or read one out dramatically)',
      'Use prompt: "Extract Name, Mobile, Product, Amount, Next Action as table"',
      'Copy the output to Excel/CRM — show the end-to-end flow',
      'Ask: "How many walk-ins does your branch get per day? How many become leads?"',
      'The gap between walk-ins and leads = revenue leak. This closes it',
    ],
    pushbacks: [
      { question: 'Staff won\'t use it', response: 'If it saves 5 minutes per inquiry and their branch head tracks lead conversion, they will. Pilot with 1 branch, show results, then scale.' },
      { question: 'We have CRM already', response: 'CRM needs structured input. Today your branches enter 3 fields and leave 10 blank. AI fills ALL fields from a messy note.' },
      { question: 'What about handwriting recognition?', response: 'Today: type or voice-record the note. Tomorrow: photo-to-text. Start with what works now.' },
    ],
    liveExercisePrompt: 'Convert this messy branch walk-in note into a complete CRM-ready lead record:\n\n"Mr Deshmukh walked in today. Works at Bajaj Auto Pune. Wife is doctor at Ruby Hall clinic. Want 3BHK in Kothrud area, budget around 1-1.2 Cr. Have 25L in FDs with us. Current HL with SBI at 8.5% for their first flat which they want to sell. Mother-in-law may co-apply. Need possession before Diwali for vastu reasons."\n\nExtract: Name | Contact (to collect) | Product | Amount | Employment | Co-applicant | Timeline | Cross-sell | Next 3 RM Actions',
    keyTakeaway: 'Every walk-in note = structured CRM lead in 30 seconds.',
  },
  {
    id: 'fg-build-buy-wait',
    title: 'Build vs Buy vs Wait Decision Tree',
    icon: '🔀',
    section: 'use-cases',
    intent: 'Leaders confused on governance and "what should we actually do". Give them a decision framework.',
    facilitationTips: [
      'Draw the decision tree on flipchart: Sensitive Data? → Yes → Wait for IT. → No → Need custom model? → Yes → Buy. → No → Upskill team.',
      'Run 3 examples through the tree as a group exercise',
      'Example 1: "Automate foreclosure statement" → Sensitive data? Yes → Wait for IT/Compliance',
      'Example 2: "Summarize product policy for RMs" → Sensitive? No. Custom model? No → Upskill your team with prompts',
      'Example 3: "AI credit scoring" → Sensitive? Yes. Custom model? Yes → Buy solution, IT leads',
    ],
    pushbacks: [
      { question: 'Who decides Build vs Buy?', response: 'You flag the business need and the value. IT + Risk + Compliance decide the HOW. Your job is to bring the use case, not build the solution.' },
      { question: 'Everything seems to need IT', response: 'Not true. Prompt engineering on approved platforms = no IT needed. Summarizing, drafting, analyzing non-PII data = start today.' },
      { question: 'We need a vendor evaluation', response: 'For Buy decisions, yes. For Upskill decisions, no vendor needed. That\'s 60% of use cases — just better prompting.' },
    ],
    liveExercisePrompt: 'Help me apply the Build vs Buy vs Wait framework to these 5 AI use cases for HDFC Retail Assets:\n\n1. Automated loan document processing (extracts data from ITR, salary slips, property docs)\n2. Customer chatbot for loan status queries\n3. AI-driven credit scoring for self-employed customers\n4. Meeting minutes to action tracker for internal reviews\n5. Competitive rate monitoring and analysis\n\nFor each, evaluate: Data Sensitivity (High/Med/Low), Custom Model Needed (Y/N), Regulatory Readiness (Ready/Needs Approval/Blocked), Build Complexity (High/Med/Low), and give a clear DECISION: Build / Buy / Wait / Upskill Team. Present as a decision matrix.',
    keyTakeaway: 'You flag the business need. IT + Risk decide the how. 60% of use cases just need better prompting.',
  },
  {
    id: 'fg-hallucination',
    title: 'Risk & Hallucination Checkpoint',
    icon: '⚡',
    section: 'prompt-lab',
    intent: 'Bank\'s #1 fear. Must address directly or leadership won\'t sponsor AI adoption.',
    facilitationTips: [
      'Show 3 real fails LIVE: 1) AI cites fake RBI circular, 2) EMI calculation wrong, 3) "Housewife" → biased output',
      'Teach the golden rule: "Ask AI: Give me your source. If it can\'t cite one, discard the claim."',
      'Run the Hallucination Detection exercise — let them click "Reveal" and discover',
      'End with the anchor phrase: "Like a junior analyst. Fast draft, needs senior review. You are the senior."',
      'Ask: "Who here has ever caught a junior team member\'s mistake?" → "Same job. AI is just faster at making the draft."',
    ],
    pushbacks: [
      { question: 'So GenAI is unreliable?', response: 'Like a junior analyst. Fast draft, needs senior review. You ARE the senior. The combination of AI speed + your expertise = breakthrough.' },
      { question: 'Then why use it at all?', response: 'Because it turns a 2-hour task into a 10-minute review. You don\'t write from scratch — you edit an 80% draft. That\'s 10x productivity.' },
      { question: 'Regulators won\'t accept this', response: 'They don\'t need to accept AI. They accept YOUR decision, backed by YOUR review. AI is a tool, not a decision-maker. HITL ensures human accountability.' },
    ],
    liveExercisePrompt: 'I\'m going to test if you hallucinate. Answer these 3 questions about Indian banking regulations:\n\n1. What is the exact RBI circular number that sets the current LTV limits for home loans?\n2. Calculate the exact EMI for a loan of INR 50,00,000 at 8.65% for 20 years.\n3. Draft a one-line rejection message for a 55-year-old female homemaker applying for a home loan.\n\nFor each answer, tell me: your confidence level (High/Medium/Low), your source (if any), and whether a human should verify before using this.',
    keyTakeaway: 'GenAI is like a junior analyst. Fast draft, needs senior review. You are the senior.',
  },
];

// ─── VoC (Voice of Customer) Quick Analysis Scenarios ───

export interface VoCScenario {
  id: string;
  title: string;
  icon: string;
  customerMessage: string;
  expectedAnalysis: {
    painPoint: string;
    urgency: 'High' | 'Medium' | 'Low';
    resolution: string;
  };
}

export const VOC_SCENARIOS: VoCScenario[] = [
  {
    id: 'voc-angry-delay',
    title: 'Angry Customer — Processing Delay',
    icon: '😤',
    customerMessage: 'I applied for home loan 3 weeks ago and NO ONE has called me back. I submitted all my documents on the first day itself. My property dealer is pressuring me for the payment. SBI approved my friend\'s loan in just 5 days. This is extremely disappointing service from HDFC. If I don\'t hear back by Friday, I\'m cancelling and going to SBI.',
    expectedAnalysis: { painPoint: 'Processing delay and no communication', urgency: 'High', resolution: 'Immediate callback from RM with status update and expedited processing' },
  },
  {
    id: 'voc-renewal-query',
    title: 'Renewal Query — Rate Negotiation',
    icon: '📋',
    customerMessage: 'My home loan renewal is coming up next month. Account number HL-2022-7890. I\'ve been a customer for 5 years with perfect repayment. Current rate is 9.1% which I feel is high compared to new customers getting 8.65%. Can I get a rate revision? Also want to know if I should continue with floating rate or switch to fixed. Please advise.',
    expectedAnalysis: { painPoint: 'Existing customer feels disadvantaged vs new customers on rate', urgency: 'Medium', resolution: 'Rate revision assessment + retention offer + floating vs fixed comparison' },
  },
  {
    id: 'voc-foreclosure',
    title: 'Foreclosure Request — Urgent',
    icon: '🏁',
    customerMessage: 'I want to foreclose my home loan account HL-2023-4567 immediately. I\'ve received a lump sum from selling my other property and want to close this loan before March 31 for tax benefit purposes. Please provide: exact foreclosure amount, any charges applicable, documents I need to bring, and whether I can do this online or must visit branch. Time is critical.',
    expectedAnalysis: { painPoint: 'Needs fast foreclosure with clear process/charges', urgency: 'High', resolution: 'Foreclosure quote + charges breakdown + document list + branch/online process + retention attempt' },
  },
  {
    id: 'voc-service-complaint',
    title: 'Service Complaint — Branch Experience',
    icon: '😞',
    customerMessage: 'Visited your Koramangala branch today for a simple address change on my loan account. Was made to wait 45 minutes. The staff seemed clueless about the process. They asked me to bring 3 documents which weren\'t mentioned on your website. Then said the system is down and asked me to come tomorrow. This is for a 1 Cr loan customer. Extremely poor service.',
    expectedAnalysis: { painPoint: 'Branch service failure — wait time, staff knowledge, system', urgency: 'High', resolution: 'Apology + immediate address change processing + service recovery + branch feedback to ops head' },
  },
  {
    id: 'voc-cross-sell-query',
    title: 'Cross-sell Opportunity — Insurance',
    icon: '💡',
    customerMessage: 'I recently saw that my home loan doesn\'t have any insurance cover. My colleague mentioned that if something happens to me, my family will have to keep paying the EMI or lose the house. That worries me. What home loan protection plans do you offer? Is it too late to add insurance after 2 years of the loan? What would be the cost for a cover of INR 60 lakhs?',
    expectedAnalysis: { painPoint: 'Financial anxiety about family protection', urgency: 'Medium', resolution: 'Home loan protection plan options + premium quote + easy enrollment process' },
  },
];

// ─── 30-Day Plan Worksheet Template ───

export interface PlanWeek {
  week: string;
  label: string;
  icon: string;
  description: string;
  prompts: string[];
  successMetric: string;
}

export const THIRTY_DAY_PLAN_TEMPLATE: PlanWeek[] = [
  {
    week: 'Week 1-2',
    label: 'Quick Win',
    icon: '🚀',
    description: 'Pick ONE task that takes you 10+ minutes daily. Automate it with prompting.',
    prompts: [
      'Summarize this [MIS report / credit note / meeting minutes] in 5 key bullets for my manager',
      'Draft a follow-up email to [customer name] about their home loan application status',
      'Convert these branch walk-in notes into a structured lead tracker table',
    ],
    successMetric: 'Time saved per day (target: 30+ minutes)',
  },
  {
    week: 'Week 3',
    label: 'Team Training',
    icon: '👥',
    description: 'Train 1 team member. Show them your quick win. Let them try 3 prompts.',
    prompts: [
      'Show the L1 vs L4 comparison — the "jaw drop moment"',
      'Have them run the objection handler with a real customer objection',
      'Let them convert a branch walk-in note into a CRM lead',
    ],
    successMetric: 'Team member independently uses AI for 1 task/day',
  },
  {
    week: 'Week 4',
    label: 'Measure & Share',
    icon: '📊',
    description: 'Measure impact. Share with your regional head. Plan next month.',
    prompts: [
      'Compile time-saved data: tasks automated, minutes saved per task, total hours recovered',
      'Draft a 1-page "AI Quick Win" summary for regional head showing results',
      'Identify next 3 tasks to automate in Month 2 based on team feedback',
    ],
    successMetric: 'Regional head briefed, Month 2 plan ready, 1+ team member onboarded',
  },
];

// ─── Build vs Buy vs Wait Decision Tree ───

export interface DecisionTreeNode {
  id: string;
  question: string;
  yesPath: string;
  noPath: string;
}

export interface BuildBuyExample {
  id: string;
  useCase: string;
  dataSensitivity: 'High' | 'Medium' | 'Low';
  customModelNeeded: boolean;
  regulatoryReady: 'Ready' | 'Needs Approval' | 'Blocked';
  buildComplexity: 'High' | 'Medium' | 'Low';
  decision: 'Build' | 'Buy' | 'Wait' | 'Upskill Team';
  reasoning: string;
}

export const BUILD_BUY_EXAMPLES: BuildBuyExample[] = [
  {
    id: 'bbw-doc-processing',
    useCase: 'Automated Loan Document Processing',
    dataSensitivity: 'High',
    customModelNeeded: true,
    regulatoryReady: 'Needs Approval',
    buildComplexity: 'High',
    decision: 'Buy',
    reasoning: 'Involves real customer documents with PII. Needs specialized OCR/AI pipeline. Buy a bank-approved document processing solution. IT leads evaluation.',
  },
  {
    id: 'bbw-chatbot',
    useCase: 'Customer Chatbot for Loan Queries',
    dataSensitivity: 'Medium',
    customModelNeeded: true,
    regulatoryReady: 'Needs Approval',
    buildComplexity: 'High',
    decision: 'Buy',
    reasoning: 'Customer-facing = higher compliance bar. Needs integration with CBS/CRM. Buy from an approved vendor with banking chatbot experience.',
  },
  {
    id: 'bbw-credit-scoring',
    useCase: 'AI-Driven Credit Scoring for Self-Employed',
    dataSensitivity: 'High',
    customModelNeeded: true,
    regulatoryReady: 'Blocked',
    buildComplexity: 'High',
    decision: 'Wait',
    reasoning: 'Regulatory framework for AI credit scoring still evolving. RBI requires explainability. Wait for clear guidelines, then Build with Risk team.',
  },
  {
    id: 'bbw-meeting-minutes',
    useCase: 'Meeting Minutes to Action Tracker',
    dataSensitivity: 'Low',
    customModelNeeded: false,
    regulatoryReady: 'Ready',
    buildComplexity: 'Low',
    decision: 'Upskill Team',
    reasoning: 'Internal use only. No customer data. No custom model needed. Just teach your team prompt engineering — they can do this TODAY.',
  },
  {
    id: 'bbw-rate-monitoring',
    useCase: 'Competitive Rate Monitoring & Analysis',
    dataSensitivity: 'Low',
    customModelNeeded: false,
    regulatoryReady: 'Ready',
    buildComplexity: 'Low',
    decision: 'Upskill Team',
    reasoning: 'Public data analysis. No PII. No regulation. Train product team to use AI for competitor monitoring. Start this week.',
  },
  {
    id: 'bbw-foreclosure-auto',
    useCase: 'Automated Foreclosure Statement Generation',
    dataSensitivity: 'High',
    customModelNeeded: false,
    regulatoryReady: 'Needs Approval',
    buildComplexity: 'Medium',
    decision: 'Wait',
    reasoning: 'Involves actual loan account data and financial calculations. Needs IT + Compliance sign-off. Wait for approved integration path.',
  },
  {
    id: 'bbw-policy-summary',
    useCase: 'Summarize Product Policies for Field Staff',
    dataSensitivity: 'Low',
    customModelNeeded: false,
    regulatoryReady: 'Ready',
    buildComplexity: 'Low',
    decision: 'Upskill Team',
    reasoning: 'Internal policy documents, no PII. Product team can use prompt engineering to create training materials today. No IT dependency.',
  },
];

export const DECISION_TREE_FLOW: DecisionTreeNode[] = [
  { id: 'node-1', question: 'Does it involve real customer data or PII?', yesPath: 'node-2', noPath: 'node-3' },
  { id: 'node-2', question: 'Does it need a custom AI model?', yesPath: 'BUY — IT leads vendor evaluation', noPath: 'WAIT — Need IT + Compliance approval path' },
  { id: 'node-3', question: 'Does it need a custom AI model?', yesPath: 'BUY — Evaluate with IT support', noPath: 'UPSKILL TEAM — Start with prompt engineering today' },
];
