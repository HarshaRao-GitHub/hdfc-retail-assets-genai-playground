'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import EnhanceToCraft from '@/components/EnhanceToCraft';
import { useDocuments } from '@/lib/document-context';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { FIELD_SALES_LAB_EXPERIMENTS, FIELD_SALES_DISCLAIMER } from '@/data/field-sales-prompts';
import SalesDocumentsPanel from '@/components/SalesDocumentsPanel';
import HallucinationDetector from '@/components/HallucinationDetector';

const LEVEL_PERSONAS = [
  { image: '/personas/prompt-level-l1.png', title: 'Junior Executive' },
  { image: '/personas/prompt-level-l2.png', title: 'Relationship Manager' },
  { image: '/personas/prompt-level-l3.png', title: 'Senior Strategist' },
  { image: '/personas/prompt-level-l4.png', title: 'Leadership Architect' },
];

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

const CHAT_KEY = 'field_sales_prompting';

export default function FieldSalesPromptingPage() {
  const { documents } = useDocuments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [selectedExperiment, setSelectedExperiment] = useState(0);
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

    const context = 'This is the Field Sales AI Prompt Engineering Lab. The focus is OUTWARD-LOOKING sales enablement — helping HDFC Bank retail asset sales professionals become more effective at prospect research, competitive positioning, objection handling, pitch personalization, and deal closing. Product lines: Personal Loans, Business Loans, Auto Loans, Tractor Finance, Commercial Vehicle Loans, Home Loans, LAP, Credit Cards, Merchant Acquiring, Payment Gateway. The anchor scenario is: "I am sitting in the client\'s reception lobby, hoping to onboard them today." Every response should help the sales professional be more prepared, more credible, and more persuasive.';

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

  const experiment = FIELD_SALES_LAB_EXPERIMENTS[selectedExperiment];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-blue-800 to-blue-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Field Sales AI
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg shrink-0 hidden sm:block">
                  <Image src="/personas/persona-user-prompter.png" alt="Prompt Lab AI" width={56} height={56} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                    <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                    Field Sales — Prompt Engineering Lab
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Sales Prompt Engineering Lab</h1>
                  <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                    Master prompt engineering through real selling scenarios. Watch how a vague question transforms into a deal-closing intelligence brief as context and structure are layered in.
                  </p>
                </div>
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

          {/* Experiment Selector */}
          <div className="flex flex-wrap gap-2">
            {FIELD_SALES_LAB_EXPERIMENTS.map((exp, i) => (
              <button
                key={i}
                onClick={() => setSelectedExperiment(i)}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold border transition ${selectedExperiment === i ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}
              >
                {exp.icon} {exp.theme.split(' — ')[0]}
              </button>
            ))}
          </div>

          {/* Experiment Detail */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">{experiment.icon}</div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900">{experiment.theme}</h2>
                <p className="text-[12px] text-gray-600 mt-0.5">{experiment.description}</p>
                <div className="mt-2 bg-white/70 rounded-lg px-3 py-2 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-0.5">Anchor Scenario</p>
                  <p className="text-[11px] text-gray-700 italic">{experiment.anchorScenario}</p>
                </div>
              </div>
            </div>

            {/* Prompt Levels */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {experiment.levels.map((level, i) => {
                const persona = LEVEL_PERSONAS[i];
                const glowColors = ['ring-emerald-200', 'ring-blue-200', 'ring-purple-200', 'ring-amber-200'];
                return (
                  <button
                    key={i}
                    onClick={() => { setInput(level.prompt); inputRef.current?.focus(); }}
                    className="text-left group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="shrink-0 relative">
                        <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${glowColors[i]} shadow-sm`}>
                          <Image src={persona.image} alt={persona.title} width={32} height={32} className="w-full h-full object-cover" />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 text-[7px] font-extrabold px-1 py-0.5 rounded-full border ${level.color} shadow-sm`}>{level.tag}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">{level.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-snug line-clamp-3">{level.prompt.slice(0, 120)}...</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sales Reference Documents */}
          <SalesDocumentsPanel />

          {/* Chat */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">💬</div>
                  <h3 className="text-lg font-bold text-gray-800">Field Sales Prompt Lab</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">
                    Select a prompt level above to see how the same scenario produces dramatically different AI outputs as prompt quality improves. Or type your own field-sales scenario.
                  </p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Field Sales AI</span>
                      </div>
                      <div className="text-gray-900 leading-relaxed"><Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown></div>
                      {!streaming && msg.content && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200">
                          <DownloadMenu content={msg.content} filenamePrefix="field-sales-prompt" />
                          <HallucinationDetector
                            content={msg.content}
                            originalPrompt={messages[i - 1]?.content ?? ''}
                            onRegenerate={(instructions) => { setInput(`[Regenerate with less hallucination]: ${instructions}\n\nOriginal request: ${messages[i - 1]?.content ?? ''}`); }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {streaming && !streamBuffer && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Generating sales intelligence...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder="Type your field sales prompt — prospect research, objection handling, pitch generation..." rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Send</button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <EnhanceToCraft prompt={input} onEnhanced={setInput} disabled={streaming} pageContext="Field Sales AI — prospect research, objection handling, pitch personalization for HDFC retail asset sales" />
                <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Field Sales Prompt Lab &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
