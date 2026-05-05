'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import EnhanceToCraft from '@/components/EnhanceToCraft';
import { useDocuments } from '@/lib/document-context';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { FIELD_OBJECTION_SCENARIOS, PROSPECT_RESEARCH_SCENARIOS, CLOSING_SCENARIOS } from '@/data/field-sales-scenarios';
import { FIELD_SALES_DISCLAIMER } from '@/data/field-sales-prompts';
import SalesDocumentsPanel from '@/components/SalesDocumentsPanel';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }
type SalesMode = 'prospect-research' | 'objection-handling' | 'deal-closing' | 'pitch-builder';

const CHAT_KEY = 'field_sales_growth';

export default function FieldSalesSalesGrowthPage() {
  const { documents, setTrayOpen } = useDocuments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [mode, setMode] = useState<SalesMode>('prospect-research');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transcript: ChatMessage[] = streaming && streamBuffer ? [...messages, { role: 'assistant', content: streamBuffer }] : messages;

  useEffect(() => {
    const saved = loadChatHistory(CHAT_KEY as keyof typeof CHAT_KEYS);
    if (saved.length > 0) setMessages(saved);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !streaming) saveChatHistory(CHAT_KEY as keyof typeof CHAT_KEYS, messages);
  }, [messages, streaming]);

  const scrollToBottom = useCallback(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const words = text.split(/\s+/).length;
    const level = words <= 20 ? 'L1' : words <= 80 ? 'L2' : words <= 150 ? 'L3' : 'L4';
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');
    setTimeout(scrollToBottom, 50);

    const contextMap: Record<SalesMode, string> = {
      'prospect-research': 'You are a Sales Intelligence Analyst for HDFC Bank. The user is a field sales professional about to enter a client meeting. Generate comprehensive pre-meeting intelligence briefs that make the salesperson the most prepared person in the room. Cover: company/industry context, financial pain points, banking needs, competitive landscape, power questions to ask, and conversation strategy. Focus on HDFC retail asset products: Personal Loans, Business Loans, Auto Loans, Tractor Finance, CV Loans, Home Loans, LAP, Credit Cards, Merchant Acquiring, Payment Gateway.',
      'objection-handling': 'You are a Sales Coaching expert for HDFC Bank Retail Assets. Generate multi-strategy objection responses. For every objection, provide 3 response approaches: (1) EMPATHETIC — acknowledge and redirect to value, (2) DATA-DRIVEN — use specific numbers and comparisons, (3) OFFER-BASED — what we can do within policy. Make responses conversational and customer-friendly. Include specific data points. Comply with Fair Practices Code. Product lines: Personal Loans, Business Loans, Auto Loans, Tractor Finance, CV Loans, Home Loans, LAP, Credit Cards, Merchant Acquiring, Payment Gateway.',
      'deal-closing': 'You are a Deal Strategy expert for HDFC Bank Retail Assets. Help field sales professionals close complex deals. Generate: deal structure proposals, competitive counter-strategies, urgency creation techniques, bundle pricing approaches, and meeting scripts for closing conversations. Focus on multi-product deals, fleet financing, merchant bundles, and relationship-based selling. Products: Personal Loans, Business Loans, Auto Loans, Tractor Finance, CV Loans, Home Loans, LAP, Credit Cards, Merchant Acquiring, Payment Gateway.',
      'pitch-builder': 'You are a Pitch Personalization expert for HDFC Bank Retail Assets. Create highly personalized product pitches tailored to specific customer profiles, industries, life stages, and situations. Show how the same product becomes a different story for different customers. Cover: emotional triggers, data points, competitive positioning, lifestyle alignment, and closing techniques. Products: Personal Loans, Business Loans, Auto Loans, Tractor Finance, CV Loans, Home Loans, LAP, Credit Cards, Merchant Acquiring, Payment Gateway.',
    };

    try {
      const docPayload = documents.length > 0 ? documents.map(d => ({ filename: d.filename, text: d.text })) : undefined;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), promptLevel: level, context: contextMap[mode], documentTexts: docPayload })
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

  function clearChat() { setMessages([]); setStreamBuffer(''); setInput(''); clearChatHistory(CHAT_KEY as keyof typeof CHAT_KEYS); }
  function switchMode(m: SalesMode) { if (m !== mode) { clearChat(); setMode(m); } }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-emerald-800 to-teal-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Field Sales AI
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                  Field Sales — Sales &amp; Growth AI
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Sales & Growth AI Engine</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  AI-powered tools for prospect research, objection handling, deal closing, and pitch personalization — anchored to HDFC retail asset products.
                </p>
              </div>
              {messages.length > 0 && <button onClick={clearChat} disabled={streaming} className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40">Clear</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>All scenarios use synthetic data. Do NOT input actual customer data into any external AI tool.</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => switchMode('prospect-research')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'prospect-research' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              🔍 Prospect Research
            </button>
            <button onClick={() => switchMode('objection-handling')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'objection-handling' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              🗣️ Objection Handling
            </button>
            <button onClick={() => switchMode('deal-closing')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'deal-closing' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              🤝 Deal Closing
            </button>
            <button onClick={() => switchMode('pitch-builder')} className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${mode === 'pitch-builder' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              🎯 Pitch Builder
            </button>
          </div>

          {/* Sales Reference Documents */}
          <SalesDocumentsPanel />

          {/* Document Context Bar */}
          <div className={`rounded-lg px-4 py-2.5 flex items-center justify-between text-[12px] border ${documents.length > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <span>{documents.length > 0 ? '📄' : '📂'}</span>
              {documents.length > 0 ? (
                <span><strong>{documents.length} document{documents.length !== 1 ? 's' : ''}</strong> attached — AI will reference them for context</span>
              ) : (
                <span>No documents attached. Load prospect data, competitor cards, or pipeline via Document Tray for richer responses.</span>
              )}
            </div>
            <button onClick={() => setTrayOpen(true)} className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1 border border-emerald-300 rounded-md hover:bg-emerald-100 transition">
              {documents.length > 0 ? 'Manage Docs' : 'Load Docs'}
            </button>
          </div>

          {/* MODE: Prospect Research */}
          {mode === 'prospect-research' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🔍</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Pre-Meeting Prospect Research</h2>
                    <p className="text-xs text-gray-600">Select a scenario or describe your upcoming meeting. AI generates a pre-meeting intelligence brief in seconds.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
                  {PROSPECT_RESEARCH_SCENARIOS.map(sc => (
                    <button key={sc.id} onClick={() => { setInput(sc.researchPrompt); inputRef.current?.focus(); }} className="text-left group bg-white border border-gray-200 rounded-xl p-3.5 hover:border-blue-300 hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{sc.icon}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sc.category === 'corporate' ? 'text-blue-700 bg-blue-50 border-blue-200' : sc.category === 'individual' ? 'text-green-700 bg-green-50 border-green-200' : 'text-purple-700 bg-purple-50 border-purple-200'}`}>{sc.category}</span>
                      </div>
                      <h4 className="text-[12px] font-bold text-gray-800 group-hover:text-blue-700 transition">{sc.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{sc.description}</p>
                      <p className="text-[9px] text-blue-600 mt-1.5 font-medium">{sc.productFocus}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE: Objection Handling */}
          {mode === 'objection-handling' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🗣️</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Objection Handling AI</h2>
                    <p className="text-xs text-gray-600">Select a customer objection or type your own. AI generates 3 response strategies: Empathetic, Data-driven, and Offer-based.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
                  {FIELD_OBJECTION_SCENARIOS.map(obj => (
                    <button
                      key={obj.id}
                      onClick={() => {
                        const prompt = `Customer objection: "${obj.objection}"\n\nCustomer context: ${obj.customerContext}\nProduct: ${obj.product}\nCompetitor mentioned: ${obj.competitorMentioned}\n\nGenerate 3 complete response strategies:\n1) EMPATHETIC — acknowledge the concern, validate their feelings, and redirect to HDFC's value proposition\n2) DATA-DRIVEN — use specific numbers, total cost comparisons, and calculations to counter the objection\n3) OFFER-BASED — what we can offer within policy to address their concern and close the deal\n\nFor each strategy: provide the complete response script (conversational, not corporate). Include specific data points. End with a closing question that moves the deal forward.`;
                        setInput(prompt);
                        inputRef.current?.focus();
                      }}
                      className="text-left group bg-white border border-gray-200 rounded-xl p-3.5 hover:border-orange-300 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{obj.icon}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          obj.category === 'rate' ? 'text-red-700 bg-red-50 border-red-200' :
                          obj.category === 'process' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                          obj.category === 'trust' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                          obj.category === 'competitor' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                          obj.category === 'timing' ? 'text-cyan-700 bg-cyan-50 border-cyan-200' :
                          'text-gray-700 bg-gray-50 border-gray-200'
                        }`}>{obj.category} · {obj.product}</span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-800 leading-snug line-clamp-2">&ldquo;{obj.objection.slice(0, 80)}...&rdquo;</p>
                      <p className="text-[9px] text-gray-500 mt-1">vs {obj.competitorMentioned}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE: Deal Closing */}
          {mode === 'deal-closing' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🤝</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Deal Closing Strategies</h2>
                    <p className="text-xs text-gray-600">Select a complex deal scenario. AI generates closing strategies, competitive counters, and presentation scripts.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {CLOSING_SCENARIOS.map(sc => (
                    <button key={sc.id} onClick={() => { setInput(sc.prompt); inputRef.current?.focus(); }} className="text-left group bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{sc.icon}</span>
                        <h4 className="text-[13px] font-bold text-gray-800 group-hover:text-emerald-700 transition">{sc.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug mb-2">{sc.situation.slice(0, 120)}...</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sc.products.map(p => (
                          <span key={p} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{p}</span>
                        ))}
                      </div>
                      <p className="text-[10px] text-red-600 font-medium mt-2">Challenge: {sc.challenge}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE: Pitch Builder */}
          {mode === 'pitch-builder' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">🎯</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Personalized Pitch Builder</h2>
                    <p className="text-xs text-gray-600">Describe your customer and product. AI builds a personalized pitch with emotional hooks, data points, and closing technique.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
                  {[
                    { icon: '👨‍🌾', title: 'Farmer — Tractor Loan', prompt: 'Build a personalized pitch for a 45-year-old farmer (15 acres, soybean + wheat, no CIBIL, skeptical of banks) who wants a Mahindra 575 tractor (8.5L). Competitor: Mahindra Finance (no-doc, 13.5%). Our advantage: lower rate (9.5%), flexible harvest EMI. Make it simple, trust-building, and in language a farmer relates to.' },
                    { icon: '💻', title: 'IT Couple — Home Loan', prompt: 'Build a personalized pitch for a dual-income IT couple (combined 32 LPA, first-time buyers, data-driven, comparing 3 banks) looking at a 1.2 Cr home in Pune. Competitor: Kotak (8.45% + zero processing). Our rate: 8.50%. They will decide this weekend. Make it data-rich, logical, and show total value beyond rate.' },
                    { icon: '🏥', title: 'Hospital Chain — Business Loan + POS', prompt: 'Build a pitch for a hospital chain promoter (3 hospitals, expanding to 5) who needs: medical equipment finance (18L) + POS terminals at all 5 locations. She is an existing home loan customer. Make it relationship-focused, showing how we can be their growth banking partner across personal and business needs.' },
                    { icon: '🚛', title: 'Fleet Owner — CV Loan Bundle', prompt: 'Build a pitch for a logistics company VP (420 Cr revenue, existing customer, 3 CV loans with us) who needs 20 new trucks for Amazon contract. SBI offering fleet rate 8.75%. Our standard: 10.2%. Create a "Total Relationship" pitch that packages CV + fuel cards + working capital + dedicated fleet desk to justify the premium.' },
                    { icon: '🏪', title: 'Cash Merchant — Going Digital', prompt: 'Build a pitch for a traditional catering business owner (38L/month, 90% cash, lost corporate clients due to no digital) who fears GST scrutiny and MDR costs. Position POS + QR not as a cost, but as a business growth tool that unlocks corporate clients + future business loan eligibility.' },
                    { icon: '🌍', title: 'NRI — Premium Home + Auto', prompt: 'Build a pitch for an NRI doctor-professor couple (combined 45 LPA, Kerala, building villa 1.5 Cr + want Fortuner) with 10-year Federal Bank relationship. Position HDFC as the "growth partner" — not replacement for Federal — with premium service, doctor-specific benefits, and lifestyle-aligned products.' },
                  ].map(sc => (
                    <button key={sc.title} onClick={() => { setInput(sc.prompt); inputRef.current?.focus(); }} className="text-left group bg-white border border-gray-200 rounded-xl p-3.5 hover:border-indigo-300 hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xl">{sc.icon}</span>
                      </div>
                      <h4 className="text-[12px] font-bold text-gray-800 group-hover:text-indigo-700 transition">{sc.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-3">{sc.prompt.slice(0, 100)}...</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">{mode === 'prospect-research' ? '🔍' : mode === 'objection-handling' ? '🗣️' : mode === 'deal-closing' ? '🤝' : '🎯'}</div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {mode === 'prospect-research' ? 'Prospect Research AI' : mode === 'objection-handling' ? 'Objection Handling AI' : mode === 'deal-closing' ? 'Deal Closing Strategy' : 'Pitch Builder AI'}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">
                    {mode === 'prospect-research' ? 'Select a scenario above or describe your upcoming meeting. AI generates a pre-meeting intelligence brief in seconds.' :
                     mode === 'objection-handling' ? 'Select an objection or type one from your experience. AI generates 3 complete response strategies.' :
                     mode === 'deal-closing' ? 'Select a deal scenario or describe your situation. AI generates closing strategies and competitive counters.' :
                     'Describe your customer profile and product. AI builds a personalized pitch with emotional hooks and closing technique.'}
                  </p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          {mode === 'prospect-research' ? 'Sales Intel' : mode === 'objection-handling' ? 'Objection Coach' : mode === 'deal-closing' ? 'Deal Strategist' : 'Pitch AI'}
                        </span>
                      </div>
                      <div className="text-gray-900 leading-relaxed"><Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown></div>
                      {!streaming && msg.content && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200">
                          <DownloadMenu content={msg.content} filenamePrefix="field-sales-strategy" />
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
                  <span className="text-xs text-gray-500 font-medium">
                    {mode === 'prospect-research' ? 'Generating intelligence brief...' : mode === 'objection-handling' ? 'Building response strategies...' : mode === 'deal-closing' ? 'Crafting closing strategy...' : 'Personalizing pitch...'}
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder={mode === 'objection-handling' ? 'Type a customer objection you face in the field...' : mode === 'prospect-research' ? 'Describe your upcoming meeting — customer, industry, product...' : mode === 'deal-closing' ? 'Describe the deal situation, competitor, and your challenge...' : 'Describe your customer profile and what product to pitch...'} rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Send</button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <EnhanceToCraft prompt={input} onEnhanced={setInput} disabled={streaming} pageContext="Field Sales AI — prospect research, objection handling, deal closing, pitch personalization for HDFC retail assets" />
                <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Field Sales &amp; Growth AI &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
