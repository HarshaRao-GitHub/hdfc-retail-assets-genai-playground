'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

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
    title: 'Customer Objection: Rate Too High',
    icon: '🗣️',
    prompt: 'Customer says: "SBI is offering 8.25% while HDFC is at 8.65%. Why should I pay more?" Generate 3 response strategies: 1) Empathetic — acknowledge and redirect to value, 2) Data-driven — total cost comparison including processing fees, insurance, prepayment flexibility, 3) Offer-led — what we can match or sweeten. Make each response conversational and customer-friendly.',
    level: 'L2'
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
    title: 'Branch Walk-in Note to CRM Lead',
    icon: '🚶',
    prompt: 'Branch note: "Mrs. Patel came in, govt teacher, husband retired bank officer, want to buy flat in Ahmedabad, budget 40-50L, have 15L savings, want low EMI, daughter getting married next year so timing important, currently at BOB for salary." Convert this into a structured CRM lead record with: customer profile, financial assessment, product recommendation, cross-sell opportunities, urgency factors, and next 3 actions for the RM.',
    level: 'L2'
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

export default function SalesAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
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

  async function send(textOverride?: string, levelOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const words = text.split(/\s+/).length;
    const level = levelOverride ?? (words <= 20 ? 'L1' : words <= 80 ? 'L2' : words <= 150 ? 'L3' : 'L4');
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          promptLevel: level,
          context: 'This is the Sales & Growth AI module. Focus on sales forecasting, upselling, cross-selling, objection handling, and lead conversion for HDFC Retail Assets mortgage business.'
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
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `*Network error: ${err instanceof Error ? err.message : 'unknown'}*` }]);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
    }
  }

  function clearChat() { setMessages([]); setStreamBuffer(''); setInput(''); clearChatHistory(CHAT_KEYS.SALES_AI); }

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

          {/* Scenario Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SALES_SCENARIOS.map((sc, i) => (
              <button key={i} onClick={() => { setInput(sc.prompt); inputRef.current?.focus(); }} className="text-left group bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition">
                <div className="text-2xl mb-2">{sc.icon}</div>
                <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-700 transition">{sc.title}</h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{sc.prompt.slice(0, 80)}...</p>
                <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${sc.level === 'L2' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-purple-700 bg-purple-50 border-purple-200'}`}>{sc.level}</span>
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">📈</div>
                  <h3 className="text-lg font-bold text-gray-800">Sales &amp; Growth AI Assistant</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">Pick a scenario above or type your sales/growth question. AI will generate forecasts, pitches, strategies, and analysis.</p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-emerald-600 rounded-full" /><span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Sales AI</span></div>
                      <div className="text-gray-900 leading-relaxed"><Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown></div>
                      {!streaming && msg.content && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200">
                          <DownloadMenu content={msg.content} filenamePrefix="hdfc-sales-analysis" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {streaming && !streamBuffer && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Generating sales insights...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder="Ask about sales forecasting, upselling, cross-sell, objection handling..." rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Send</button>
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
