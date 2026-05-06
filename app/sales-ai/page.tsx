'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import HITLReviewPanel from '@/components/HITLReviewPanel';
import type { HITLEvent } from '@/components/HITLReviewPanel';
import AIOutputReviewPanel from '@/components/AIOutputReviewPanel';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { useDocuments } from '@/lib/document-context';
import EnhanceToCraft from '@/components/EnhanceToCraft';
import { OBJECTION_SCENARIOS, HITL_SCENARIOS } from '@/data/advanced-features';
import { VOC_SCENARIOS, FACILITATION_GUIDE } from '@/data/facilitation-guide';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

type SalesMode = 'scenarios' | 'objection-bot' | 'crm-converter' | 'voc-analysis';

const SALES_SCENARIOS = [
  {
    title: 'Quarterly Disbursal Forecast',
    icon: '📊',
    prompt: 'Based on the following South region data: Q1 INR 1,800 Cr, Q2 last year INR 1,650 Cr, Q3 INR 2,100 Cr, Q4 INR 2,500 Cr. 25 branches, 150 RMs. Repo rate cut of 25bps, SBI festive offer at 8.25%, 2 new affordable projects in Bangalore. Build best/base/worst forecast scenarios for next quarter with specific branch-level actions.',
    level: 'L3'
  },
  {
    title: 'Cross-sell CASA to HL Customers',
    icon: '🔄',
    prompt: 'We have 50,000 active HL customers in the West region. Only 30% have CASA with us, rest salary accounts at SBI/ICICI. Create a 90-day campaign plan to move 5,000 salary accounts to HDFC CASA. Include: customer selection criteria, offer structure, channel mix (branch/digital/RM call), messaging templates, and weekly KPIs.',
    level: 'L3'
  },
  {
    title: 'Upsell Top-up Loan',
    icon: '💰',
    prompt: 'Customer profile: HL customer for 4 years, outstanding INR 48L, perfect repayment, property value appreciated 20%, salary increased from 12L to 18L, wants to renovate kitchen and add a balcony (estimated INR 8L). Draft a top-up loan pitch including: eligibility assessment, rate offer, EMI impact, and why top-up is better than personal loan. Make it warm and advisory.',
    level: 'L2'
  },
  {
    title: 'NRI Home Loan Pitch',
    icon: '🌍',
    prompt: 'An NRI working in Dubai (IT manager, salary AED 25,000/month, 6 years in UAE, owns no property in India) wants to buy a 3BHK in Mumbai for parents. Budget INR 1.5-2 Cr. Create a complete NRI home loan pitch covering: eligibility, documents needed, power of attorney requirements, repatriation rules, tax implications (Section 80C, 24), and our NRI-specific advantages over SBI and ICICI.',
    level: 'L3'
  },
  {
    title: 'Micro-Segmentation for Campaign',
    icon: '📐',
    prompt: 'From our 200,000 HL customer portfolio, define 6 actionable micro-segments using: income (under 10L, 10-25L, 25-50L, 50L+), life stage (young professional, young family, established, pre-retirement), and product depth (HL only vs HL+CASA vs HL+3 products). For each segment: size estimate, CLV ranking, top cross-sell opportunity, preferred channel, and campaign theme. Present as a segmentation matrix.',
    level: 'L3'
  },
  {
    title: 'Meeting Review to Actions',
    icon: '📝',
    prompt: 'Sales review meeting notes: "Pune disbursals down 15% — Rajesh to investigate. Festive campaign plan needed by Friday — Priya to submit. Nagpur NPA at 2.3%, Amit to review top 10 accounts. New SBI rate 8.25% creating pressure in West — need competitive response. 5 new RMs joining Bangalore next week, training plan needed. Next review 20th Jan." Extract: decisions, action items with owners and dates, risks flagged, and competitive actions needed. Format as email-ready table.',
    level: 'L2'
  },
];

const CRM_SAMPLE_NOTES = [
  { label: 'Walk-in: Young Couple', note: 'Mr & Mrs Sharma came today, both working in IT, combined salary around 28 LPA, want 2BHK in Whitefield Bangalore, budget 80-90L, have 15L savings, currently rent paying 25K/month, SBI offered them 8.25%, want to compare' },
  { label: 'Walk-in: Govt Employee', note: 'Mrs. Patel came in, govt teacher, husband retired bank officer, want to buy flat in Ahmedabad, budget 40-50L, have 15L savings, want low EMI, daughter getting married next year so timing important, currently at BOB for salary' },
  { label: 'Walk-in: NRI Inquiry', note: 'Mr Reddy called from Dubai, works at Emirates airline, salary AED 18K, parents in Hyderabad want to buy a flat for them, budget 60-70L, has FD with ICICI 20L, worried about documentation while abroad' },
  { label: 'Walk-in: Self-Employed', note: 'Rajesh owns a garment shop in Surat, 8 years in business, no ITR but strong UPI transactions 10L/month, wants LAP on existing property worth 1.2Cr to expand business, needs 40L urgent' },
];

export default function SalesAIPage() {
  const { documents, setTrayOpen } = useDocuments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [mode, setMode] = useState<SalesMode>('scenarios');
  const [hitlEvent, setHitlEvent] = useState<HITLEvent | null>(null);
  const [hitlDecision, setHitlDecision] = useState<string | null>(null);
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transcript: ChatMessage[] = streaming && streamBuffer ? [...messages, { role: 'assistant', content: streamBuffer }] : messages;

  useEffect(() => {
    const saved = loadChatHistory(CHAT_KEYS.SALES_AI);
    if (saved.length > 0) setMessages(saved);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !streaming) saveChatHistory(CHAT_KEYS.SALES_AI, messages);
  }, [messages, streaming]);

  const scrollToBottom = useCallback(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  function generateHitlEvent(title: string): HITLEvent {
    const confidence = parseFloat((0.70 + Math.random() * 0.25).toFixed(2));
    const hitlScenario = HITL_SCENARIOS.find(s => s.section === 'sales-ai');
    return {
      approvalId: `APR-${Date.now().toString(36).toUpperCase()}`,
      title,
      approverRole: hitlScenario?.approverRole ?? 'Relationship Manager / Branch Head',
      confidence,
      confidenceThreshold: 0.80,
      isMandatory: true,
      reason: confidence < 0.80
        ? `Agent confidence ${Math.round(confidence * 100)}% is below 80% threshold — human review escalation triggered.`
        : `Mandatory HITL gate — ${hitlScenario?.approverRole ?? 'RM'} sign-off required per Delegation of Authority.`,
      reviewCheckpoints: hitlScenario?.reviewCheckpoints ?? [
        'Response is factually accurate',
        'Tone is professional and customer-friendly',
        'No unauthorized commitments or offers',
        'Complies with Fair Practices Code',
        'Data/figures are current and correct',
      ],
    };
  }

  async function send(textOverride?: string, levelOverride?: string, contextOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const words = text.split(/\s+/).length;
    const level = levelOverride ?? (words <= 20 ? 'L1' : words <= 80 ? 'L2' : words <= 150 ? 'L3' : 'L4');
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');
    setHitlEvent(null);
    setHitlDecision(null);
    setTimeout(scrollToBottom, 50);

    const defaultContext = 'This is the Sales & Growth AI module. Focus on sales forecasting, upselling, cross-selling, objection handling, and lead conversion for HDFC Retail Assets mortgage business.';

    try {
      const docPayload = documents.length > 0
        ? documents.map(d => ({ filename: d.filename, text: d.text }))
        : undefined;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          promptLevel: level,
          context: contextOverride ?? defaultContext,
          documentTexts: docPayload,
        })
      });
      if (!res.ok || !res.body) {
        setMessages([...next, { role: 'assistant', content: `*Error: ${await res.text().catch(() => 'Request failed')}*` }]);
        setStreaming(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assembled = '';
      const flushStream = () => { setStreamBuffer(assembled); streamThrottleRef.current = 0; scrollToBottom(); };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) currentEvent = line.slice(7).trim();
          else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (currentEvent === 'text_delta') {
                assembled += data;
                if (!streamThrottleRef.current) streamThrottleRef.current = requestAnimationFrame(flushStream);
              } else if (currentEvent === 'error') {
                assembled += `\n\n*Error: ${data.message}*`;
                setStreamBuffer(assembled);
              }
            } catch {}
            currentEvent = '';
          }
        }
      }
      if (streamThrottleRef.current) cancelAnimationFrame(streamThrottleRef.current);
      setMessages([...next, { role: 'assistant', content: assembled }]);

      if (mode === 'objection-bot' || mode === 'crm-converter' || mode === 'voc-analysis') {
        const title = mode === 'objection-bot' ? 'Objection Response Review' : mode === 'crm-converter' ? 'CRM Lead Record Review' : 'VoC Response Review';
        setHitlEvent(generateHitlEvent(title));
      }
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `*Network error: ${err instanceof Error ? err.message : 'unknown'}*` }]);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
    }
  }

  function clearChat() {
    setMessages([]); setStreamBuffer(''); setInput('');
    setHitlEvent(null); setHitlDecision(null);
    clearChatHistory(CHAT_KEYS.SALES_AI);
  }

  function switchMode(m: SalesMode) {
    if (m !== mode) {
      clearChat();
      setMode(m);
      setSelectedObjection(null);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-emerald-800 to-emerald-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                  Sales &amp; Growth AI
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Sales Forecasting &amp; Growth AI</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  Forecast disbursals, craft upsell pitches, handle objections, convert leads, and build cross-sell strategies using GenAI.
                </p>
              </div>
              {messages.length > 0 && <button onClick={clearChat} disabled={streaming} className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40">Clear</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>All scenarios use synthetic data. Do NOT input actual customer data. Wait for bank policy before production use.</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2">
            <button onClick={() => switchMode('scenarios')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'scenarios' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              📊 Sales Scenarios
            </button>
            <button onClick={() => switchMode('objection-bot')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'objection-bot' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              🗣️ Objection Handling Bot
            </button>
            <button onClick={() => switchMode('crm-converter')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'crm-converter' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              🚶 Branch Notes → CRM
            </button>
            <button onClick={() => switchMode('voc-analysis')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'voc-analysis' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              👂 VoC in 60 Sec
            </button>
          </div>

          {/* Document Context Bar */}
          <div className={`rounded-lg px-4 py-2.5 flex items-center justify-between text-[12px] border ${documents.length > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <span>{documents.length > 0 ? '📄' : '📂'}</span>
              {documents.length > 0 ? (
                <span><strong>{documents.length} document{documents.length !== 1 ? 's' : ''}</strong> attached — AI will use them for forecasting &amp; analysis</span>
              ) : (
                <span>No documents attached. Load your sales data, MIS reports, or lead trackers via the Document Tray for data-driven insights.</span>
              )}
            </div>
            <button onClick={() => setTrayOpen(true)} className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1 border border-emerald-300 rounded-md hover:bg-emerald-100 transition">
              {documents.length > 0 ? 'Manage Docs' : 'Load Docs'}
            </button>
          </div>

          {/* ─── MODE: Sales Scenarios ─── */}
          {mode === 'scenarios' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SALES_SCENARIOS.map((sc, i) => (
                <button key={i} onClick={() => { setInput(sc.prompt); inputRef.current?.focus(); }} className="text-left group bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition">
                  <div className="text-2xl mb-2">{sc.icon}</div>
                  <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-700 transition">{sc.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{sc.prompt.slice(0, 80)}...</p>
                  <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${sc.level === 'L2' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-purple-700 bg-purple-50 border-purple-200'}`}>{sc.level}</span>
                </button>
              ))}
            </div>
          )}

          {/* ─── MODE: Objection Handling Bot ─── */}
          {mode === 'objection-bot' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🗣️</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Objection Handling AI Bot</h2>
                    <p className="text-xs text-gray-600">Select a common objection or type a custom one. AI generates 3 response strategies (Empathetic, Data-driven, Offer-led) with HITL review.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
                  {OBJECTION_SCENARIOS.map(obj => (
                    <button
                      key={obj.id}
                      onClick={() => {
                        setSelectedObjection(obj.id);
                        const prompt = `Customer objection: "${obj.objection}"\n\nCustomer context: ${obj.customerContext}\n\nGenerate 3 response strategies:\n1) EMPATHETIC — acknowledge the concern and redirect to value\n2) DATA-DRIVEN — use numbers, comparisons, and evidence to address the objection\n3) OFFER-LED — what we can offer or sweeten to close the deal\n\nFor each strategy: provide the complete response script the RM should use. Make responses conversational, customer-friendly, and compliant with Fair Practices Code. Include specific data points where relevant.`;
                        setInput(prompt);
                        inputRef.current?.focus();
                      }}
                      className={`text-left group bg-white border rounded-xl p-3.5 hover:shadow-md transition ${
                        selectedObjection === obj.id ? 'border-orange-400 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{obj.icon}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          obj.category === 'rate' ? 'text-red-700 bg-red-50 border-red-200' :
                          obj.category === 'fee' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                          obj.category === 'process' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                          obj.category === 'trust' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                          'text-gray-700 bg-gray-50 border-gray-200'
                        }`}>{obj.category}</span>
                      </div>
                      <p className="text-[12px] font-medium text-gray-800 leading-snug">&ldquo;{obj.objection.slice(0, 70)}...&rdquo;</p>
                      <p className="text-[10px] text-gray-500 mt-1">{obj.customerContext}</p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Facilitation Tip */}
              <FacilitationTip guideId="fg-objection" />
            </div>
          )}

          {/* ─── MODE: Branch Notes → CRM ─── */}
          {mode === 'crm-converter' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🚶</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Branch Notes → CRM-Ready Leads</h2>
                    <p className="text-xs text-gray-600">Paste messy branch walk-in notes. AI converts them into structured CRM lead records with HITL verification before CRM entry.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
                  {CRM_SAMPLE_NOTES.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const prompt = `Convert this branch walk-in note into a complete, structured CRM lead record:\n\n"${sample.note}"\n\nOutput format:\n1. CUSTOMER PROFILE: Name, age estimate, occupation, employer, family details\n2. FINANCIAL ASSESSMENT: Estimated income, savings, existing banking relationship, loan capacity\n3. PRODUCT RECOMMENDATION: Best-fit product, loan amount, tenure, estimated EMI\n4. CROSS-SELL OPPORTUNITIES: CASA, insurance, credit card, investment products\n5. URGENCY FACTORS: Timeline, competing offers, life events\n6. NEXT 3 ACTIONS for RM: Specific, time-bound follow-up steps\n7. CRM FIELDS: Ready-to-enter structured data for CRM system\n\nMake the output ready for direct CRM entry. Flag any information gaps that need to be collected in the next interaction.`;
                        setInput(prompt);
                        inputRef.current?.focus();
                      }}
                      className="text-left group bg-white border border-gray-200 rounded-xl p-3.5 hover:border-blue-300 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">📝</span>
                        <span className="text-[12px] font-bold text-blue-700">{sample.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">&ldquo;{sample.note.slice(0, 100)}...&rdquo;</p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Facilitation Tip */}
              <FacilitationTip guideId="fg-walkin" />
            </div>
          )}

          {/* ─── MODE: VoC in 60 Seconds ─── */}
          {mode === 'voc-analysis' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-xl">👂</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Voice of Customer — 60-Second Analysis</h2>
                    <p className="text-xs text-gray-600">Analyze customer complaints, queries, and feedback in seconds. Get pain points, urgency ratings, and draft responses instantly.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
                  {VOC_SCENARIOS.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        const prompt = `Analyze this customer message and provide:\n1. MAIN PAIN POINT (1 sentence)\n2. URGENCY: High / Medium / Low with reasoning\n3. ROOT CAUSE ANALYSIS (what went wrong)\n4. RECOMMENDED RESOLUTION (specific action steps)\n5. DRAFT RESPONSE to customer in HDFC empathetic tone (professional but warm, no jargon, acknowledge their frustration)\n6. CROSS-SELL/RETENTION OPPORTUNITY (if any)\n\nCustomer message:\n"${scenario.customerMessage}"`;
                        setInput(prompt);
                        inputRef.current?.focus();
                      }}
                      className="text-left group bg-white border border-gray-200 rounded-xl p-3.5 hover:border-teal-300 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{scenario.icon}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          scenario.expectedAnalysis.urgency === 'High' ? 'text-red-700 bg-red-50 border-red-200' :
                          scenario.expectedAnalysis.urgency === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                          'text-green-700 bg-green-50 border-green-200'
                        }`}>{scenario.expectedAnalysis.urgency}</span>
                      </div>
                      <h4 className="text-[12px] font-bold text-gray-800 group-hover:text-teal-700 transition">{scenario.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">&ldquo;{scenario.customerMessage.slice(0, 80)}...&rdquo;</p>
                    </button>
                  ))}
                </div>
                {/* All-in-one VoC prompt */}
                <button
                  onClick={() => {
                    const allMessages = VOC_SCENARIOS.slice(0, 3).map((s, i) => `${i + 1}. "${s.customerMessage}"`).join('\n\n');
                    const prompt = `Analyze these 3 customer messages. For EACH, provide:\n- Main Pain Point (1 line)\n- Urgency: High/Medium/Low\n- Resolution (specific action)\n- Draft Response in HDFC empathetic tone (no jargon, professional but warm)\n\n${allMessages}`;
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                  className="mt-3 w-full text-center text-[12px] font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-600 border border-teal-200 hover:border-teal-600 rounded-lg py-2.5 transition"
                >
                  Run All 3 Together — VoC Batch Analysis
                </button>
              </div>
              {/* Facilitation Tip */}
              <FacilitationTip guideId="fg-voc" />
            </div>
          )}

          {/* Chat */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">{mode === 'objection-bot' ? '🗣️' : mode === 'crm-converter' ? '🚶' : mode === 'voc-analysis' ? '👂' : '📈'}</div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {mode === 'objection-bot' ? 'Objection Handling Bot' : mode === 'crm-converter' ? 'Branch Notes → CRM Converter' : mode === 'voc-analysis' ? 'VoC — 60-Second Analysis' : 'Sales & Growth AI Assistant'}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">
                    {mode === 'objection-bot'
                      ? 'Select an objection above or type a customer objection. AI generates 3 response strategies with HITL review gate.'
                      : mode === 'crm-converter'
                      ? 'Select a sample note or paste raw branch walk-in notes. AI converts them to structured CRM leads with human verification.'
                      : mode === 'voc-analysis'
                      ? 'Select a customer scenario above or paste any customer message. AI extracts pain points, urgency, and drafts a response in seconds.'
                      : 'Pick a scenario above or type your sales/growth question. AI will generate forecasts, pitches, strategies, and analysis.'}
                  </p>
                  {(mode === 'objection-bot' || mode === 'crm-converter' || mode === 'voc-analysis') && (
                    <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <span className="text-amber-600 text-sm">🔍</span>
                      <span className="text-[11px] text-amber-800 font-medium">HITL Gate Active — AI output will require human review before use</span>
                    </div>
                  )}
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          {mode === 'objection-bot' ? 'Objection Handler' : mode === 'crm-converter' ? 'CRM Converter' : 'Sales AI'}
                        </span>
                      </div>
                      <div className="text-gray-900 leading-relaxed"><Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown></div>
                      {!streaming && msg.content && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200">
                          <DownloadMenu content={msg.content} filenamePrefix="hdfc-sales-analysis" />
                          <AIOutputReviewPanel
                            content={msg.content}
                            originalPrompt={messages[i - 1]?.content ?? ''}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* HITL Review Gate */}
              {hitlEvent && !streaming && !hitlDecision && (
                <div className="mt-4">
                  <HITLReviewPanel
                    hitl={hitlEvent}
                    originalContent={transcript.find(m => m.role === 'assistant')?.content}
                    onDecision={(decision, detail) => {
                      setHitlDecision(`${decision}: ${detail}`);
                    }}
                    onModifiedContent={(content) => {
                      setMessages(prev => [...prev, { role: 'assistant', content: `**[Modified by Reviewer]**\n\n${content}` }]);
                    }}
                    accentColor="#059669"
                  />
                </div>
              )}

              {streaming && !streamBuffer && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {mode === 'objection-bot' ? 'Generating objection responses...' : mode === 'crm-converter' ? 'Converting to CRM lead...' : mode === 'voc-analysis' ? 'Analyzing customer voice...' : 'Generating sales insights...'}
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder={mode === 'objection-bot' ? 'Type a customer objection...' : mode === 'crm-converter' ? 'Paste branch walk-in notes here...' : 'Ask about sales forecasting, upselling, cross-sell, objection handling...'} rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Send</button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <EnhanceToCraft prompt={input} onEnhanced={setInput} disabled={streaming} pageContext="Sales & Growth AI — forecasting, upselling, cross-selling for mortgage business" />
                <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-hdfc-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">
          HDFC Retail Assets GenAI Playground &middot; Sales &amp; Growth AI &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}

function FacilitationTip({ guideId }: { guideId: string }) {
  const [open, setOpen] = useState(false);
  const item = FACILITATION_GUIDE.find(g => g.id === guideId);
  if (!item) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-100/50 transition">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded">FACILITATOR</span>
          <span className="text-[12px] font-semibold text-indigo-800">{item.title} — Workshop Tips &amp; Pushback Responses</span>
        </div>
        <svg className={`w-4 h-4 text-indigo-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-indigo-200">
          <div className="mt-3 bg-white/70 rounded-lg p-3 border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-700 mb-1">Intent</p>
            <p className="text-[11px] text-gray-700">{item.intent}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-700 mb-1.5">Facilitation Tips</p>
            <ul className="space-y-1">
              {item.facilitationTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                  <span className="text-indigo-400 mt-0.5 shrink-0">•</span>{tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/70 rounded-lg p-3 border border-red-100">
            <p className="text-[10px] font-bold text-red-700 mb-1.5">Common Pushback &amp; Your Response</p>
            <div className="space-y-2">
              {item.pushbacks.map((pb, i) => (
                <div key={i} className="bg-white rounded-lg p-2.5 border border-gray-100">
                  <p className="text-[11px] font-medium text-red-700">&ldquo;{pb.question}&rdquo;</p>
                  <p className="text-[11px] text-gray-700 mt-1">→ {pb.response}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
            <p className="text-[10px] font-bold text-emerald-700 mb-1">Key Takeaway</p>
            <p className="text-[12px] font-semibold text-emerald-800 italic">&ldquo;{item.keyTakeaway}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}
