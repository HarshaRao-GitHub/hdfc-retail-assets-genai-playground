'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import EnhanceToCraft from '@/components/EnhanceToCraft';
import { useDocuments } from '@/lib/document-context';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { FIELD_SALES_USE_CASE_CATEGORIES, FIELD_SALES_USE_CASES, getFieldSalesUseCasesByCategory } from '@/data/field-sales-use-cases';
import { FIELD_SALES_DISCLAIMER } from '@/data/field-sales-prompts';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

const CHAT_KEY = 'field_sales_use_cases';

export default function FieldSalesUseCasesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <FieldSalesUseCasesContent />
    </Suspense>
  );
}

function FieldSalesUseCasesContent() {
  const searchParams = useSearchParams();
  const { documents } = useDocuments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'prospect-research');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transcript: ChatMessage[] = streaming && streamBuffer ? [...messages, { role: 'assistant', content: streamBuffer }] : messages;
  const filteredUseCases = getFieldSalesUseCasesByCategory(selectedCategory);

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

    const context = 'This is the Field Sales AI Use Case Library. Focus on OUTWARD-LOOKING sales enablement for HDFC Bank retail asset sales professionals. Help them with prospect research, competitive positioning, objection handling, pitch personalization, cross-selling, deal closing, industry research, and post-meeting follow-through. Product lines: Personal Loans, Business Loans, Auto Loans, Tractor Finance, Commercial Vehicle Loans, Home Loans, Loan Against Property, Credit Cards, Merchant Acquiring, Payment Gateway. Every response should make the sales professional more prepared, credible, and effective at closing deals.';

    try {
      const docPayload = documents.length > 0 ? documents.map(d => ({ filename: d.filename, text: d.text })) : undefined;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), promptLevel: level, context, documentTexts: docPayload })
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-amber-700 to-orange-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" />
                  Field Sales — Use Case Library
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Field Sales Use Case Library</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  {FIELD_SALES_USE_CASES.length} use cases across {FIELD_SALES_USE_CASE_CATEGORIES.length} categories — from pre-meeting research to post-meeting follow-through. Each with a ready-to-use prompt.
                </p>
              </div>
              {messages.length > 0 && <button onClick={clearChat} disabled={streaming} className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40">Clear</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>{FIELD_SALES_DISCLAIMER}</span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {FIELD_SALES_USE_CASE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-[11px] font-bold border transition ${selectedCategory === cat.id ? 'text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'}`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Use Cases Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredUseCases.map(uc => (
              <button
                key={uc.id}
                onClick={() => { setInput(uc.samplePrompt); inputRef.current?.focus(); }}
                className="text-left group bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{uc.icon}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${uc.coverageLevel === 'hands-on' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : uc.coverageLevel === 'demo' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                    {uc.coverageLevel}
                  </span>
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-amber-700 transition mb-1">{uc.title}</h3>
                <p className="text-[11px] text-gray-600 leading-snug mb-2 line-clamp-2">{uc.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {uc.productLine.slice(0, 3).map(p => (
                    <span key={p} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{p}</span>
                  ))}
                  {uc.productLine.length > 3 && <span className="text-[9px] text-gray-400">+{uc.productLine.length - 3}</span>}
                </div>
                <p className="text-[9px] text-gray-400 italic line-clamp-1">{uc.anchorScenario}</p>
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-gray-800">Field Sales Use Case Library</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">
                    Browse categories above and click a use case to load its prompt. Each use case is anchored to a real field-selling scenario with specific product context.
                  </p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-amber-600 rounded-full" />
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Field Sales AI</span>
                      </div>
                      <div className="text-gray-900 leading-relaxed"><Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown></div>
                      {!streaming && msg.content && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200">
                          <DownloadMenu content={msg.content} filenamePrefix="field-sales-usecase" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {streaming && !streamBuffer && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Generating field sales response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder="Click a use case above or type your own field sales question..." rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Send</button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <EnhanceToCraft prompt={input} onEnhanced={setInput} disabled={streaming} pageContext="Field Sales Use Case Library — HDFC retail asset sales enablement" />
                <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Field Sales Use Case Library &middot; {FIELD_SALES_USE_CASES.length} Use Cases &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
