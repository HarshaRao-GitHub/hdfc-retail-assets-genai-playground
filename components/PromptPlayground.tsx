'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Markdown from './Markdown';
import DownloadMenu from './DownloadMenu';
import AIOutputReviewPanel from './AIOutputReviewPanel';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { LAB_EXPERIMENTS, PROMPT_LADDERS, DISCLAIMER_TEXT } from '@/data/prompt-templates';
import { useDocuments } from '@/lib/document-context';
import EnhanceToCraft from './EnhanceToCraft';
import { SYSTEM_VS_USER_EXAMPLES, HALLUCINATION_EXAMPLES } from '@/data/advanced-features';
import { FACILITATION_GUIDE } from '@/data/facilitation-guide';

const LEVEL_PERSONAS = [
  { image: '/personas/prompt-level-l1.png', title: 'Junior Executive', subtitle: 'Entry-level RM' },
  { image: '/personas/prompt-level-l2.png', title: 'Relationship Manager', subtitle: 'Mid-level Professional' },
  { image: '/personas/prompt-level-l3.png', title: 'Senior Strategist', subtitle: 'Analytics Expert' },
  { image: '/personas/prompt-level-l4.png', title: 'Leadership Architect', subtitle: 'C-Suite Thought Leader' },
];

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

export default function PromptPlayground() {
  const { documents, setTrayOpen } = useDocuments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [promptLevel, setPromptLevel] = useState<string | null>(null);
  const [labExpanded, setLabExpanded] = useState(true);
  const [expandedLabLadders, setExpandedLabLadders] = useState<Set<number>>(new Set([0]));
  const [themesExpanded, setThemesExpanded] = useState(false);
  const [expandedLadders, setExpandedLadders] = useState<Set<number>>(new Set([0]));
  const [sysUserExpanded, setSysUserExpanded] = useState(false);
  const [hallExpanded, setHallExpanded] = useState(false);
  const [expandedSysUser, setExpandedSysUser] = useState<string | null>(null);
  const [expandedHall, setExpandedHall] = useState<string | null>(null);
  const [revealedHall, setRevealedHall] = useState<Set<string>>(new Set());
  const [webSearchStatus, setWebSearchStatus] = useState<null | 'searching' | 'done'>(null);
  const [webSearchMeta, setWebSearchMeta] = useState<{ resultCount?: number; ms?: number } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transcript: ChatMessage[] =
    streaming && streamBuffer
      ? [...messages, { role: 'assistant', content: streamBuffer }]
      : messages;

  useEffect(() => {
    const saved = loadChatHistory(CHAT_KEYS.PROMPT_LAB);
    if (saved.length > 0) setMessages(saved);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !streaming) saveChatHistory(CHAT_KEYS.PROMPT_LAB, messages);
  }, [messages, streaming]);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  function toggleLabLadder(idx: number) {
    setExpandedLabLadders(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function toggleLadder(idx: number) {
    setExpandedLadders(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function detectPromptLevel(text: string): string {
    const words = text.split(/\s+/).length;
    if (words <= 20) return 'L1';
    if (words <= 80) return 'L2';
    if (words <= 150) return 'L3';
    return 'L4';
  }

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const level = promptLevel ?? detectPromptLevel(text);
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setPromptLevel(null);
    setStreaming(true);
    setStreamBuffer('');
    setWebSearchStatus(null);
    setWebSearchMeta(null);
    setTimeout(scrollToBottom, 50);

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
          documentTexts: docPayload,
        })
      });
      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => 'Request failed');
        setMessages([...next, { role: 'assistant', content: `*Error: ${errText}*` }]);
        setStreaming(false);
        return;
      }
      await readSSE(res.body, next);
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `*Network error: ${err instanceof Error ? err.message : 'unknown'}*` }]);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
      setWebSearchStatus(null);
    }
  }

  async function readSSE(body: ReadableStream<Uint8Array>, prev: ChatMessage[]) {
    const reader = body.getReader();
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
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            switch (currentEvent) {
              case 'web_search':
                if (data.status === 'searching') setWebSearchStatus('searching');
                else if (data.status === 'done') { setWebSearchStatus('done'); setWebSearchMeta({ resultCount: data.resultCount, ms: data.ms }); }
                break;
              case 'text_delta':
                assembled += data;
                if (!streamThrottleRef.current) streamThrottleRef.current = requestAnimationFrame(flushStream);
                break;
              case 'error':
                assembled += `\n\n*Error: ${data.message}*`;
                setStreamBuffer(assembled);
                break;
            }
          } catch { /* skip malformed lines */ }
          currentEvent = '';
        }
      }
    }
    if (streamThrottleRef.current) cancelAnimationFrame(streamThrottleRef.current);
    setMessages([...prev, { role: 'assistant', content: assembled }]);
    setTimeout(scrollToBottom, 100);
  }

  function clearChat() {
    setMessages([]); setStreamBuffer(''); setInput('');
    clearChatHistory(CHAT_KEYS.PROMPT_LAB);
  }

  function handlePromptClick(prompt: string, level?: string) {
    setInput(prompt); setPromptLevel(level ?? null); inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-hdfc-blueDeep to-hdfc-blue border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 tracking-wide">
                <span className="w-2 h-2 bg-hdfc-red rounded-full animate-pulse" />
                STAR SESSION — Prompt Engineering Lab
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Prompt Engineering Playground</h1>
              <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                Master prompt engineering for mortgage business. Run experiments, compare output quality across 4 levels, and build structured thinking.
              </p>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} disabled={streaming} className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 hover:border-red-400/60 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40">
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
        <section className="flex flex-col min-h-[calc(100vh-200px)] gap-4">

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600 shrink-0">⚠️</span>
            <span>{DISCLAIMER_TEXT}</span>
          </div>

          {/* Document Context Bar */}
          <div className={`rounded-lg px-4 py-2.5 flex items-center justify-between text-[12px] border ${documents.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <span>{documents.length > 0 ? '📄' : '📂'}</span>
              {documents.length > 0 ? (
                <span><strong>{documents.length} document{documents.length !== 1 ? 's' : ''}</strong> attached — AI will reference them in responses</span>
              ) : (
                <span>No documents attached. Load docs via the Document Tray or Doc Intelligence to enable document-grounded prompting.</span>
              )}
            </div>
            <button onClick={() => setTrayOpen(true)} className="text-[11px] font-semibold text-hdfc-blue hover:text-hdfc-red px-3 py-1 border border-hdfc-blue/30 rounded-md hover:bg-blue-100 transition">
              {documents.length > 0 ? 'Manage Docs' : 'Load Docs'}
            </button>
          </div>

          {/* Lab Experiments */}
          <div className="rounded-xl border border-blue-200 shadow-lg overflow-hidden bg-white">
            <button onClick={() => setLabExpanded(!labExpanded)} className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-hdfc-blue via-hdfc-blueBright to-hdfc-red text-left group">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧪</span>
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight">Prompt Experimentation Lab</h2>
                  <p className="text-sm text-white/85 mt-0.5">Run the same problem through 4 progressively stronger prompts — see how the answer quality transforms</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden md:flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
                  {LEVEL_PERSONAS.map((p, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/40 shadow-sm">
                        <Image src={p.image} alt={p.title} width={24} height={24} className="w-full h-full object-cover" />
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${['bg-emerald-400/30','bg-blue-400/30','bg-purple-400/30','bg-amber-400/30'][i]} text-white`}>L{i+1}</span>
                      {i < 3 && <span className="text-white/50 text-xs mx-0.5">&rarr;</span>}
                    </span>
                  ))}
                </div>
                <svg className={`w-5 h-5 text-white/80 transition-transform duration-300 ${labExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>

            {labExpanded && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 italic">
                    <strong className="text-gray-800 not-italic">Principle:</strong> The complexity belongs in the prompt, not in the expected outcome — better prompts yield sharper answers.
                  </p>
                  <span className="text-xs font-semibold text-hdfc-blue bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full shrink-0 ml-3">
                    CRAFT = Context &middot; Role &middot; Action &middot; Format &middot; Target
                  </span>
                </div>
                <div className="space-y-4">
                  {LAB_EXPERIMENTS.map((exp, ei) => {
                    const isOpen = expandedLabLadders.has(ei);
                    return (
                      <div key={ei} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <button onClick={() => toggleLabLadder(ei)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition text-left">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{exp.icon}</span>
                            <div>
                              <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{exp.theme}</h3>
                              <p className="text-xs text-gray-600 mt-1 leading-snug">{exp.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span className="text-[10px] font-semibold text-hdfc-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">4 levels</span>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 pt-1 border-t border-gray-100 space-y-3">
                            {exp.levels.map((level, lvi) => {
                              const stepColors = ['border-l-emerald-400 hover:bg-emerald-50/50', 'border-l-blue-400 hover:bg-blue-50/50', 'border-l-purple-400 hover:bg-purple-50/50', 'border-l-amber-400 hover:bg-amber-50/50'];
                              const persona = LEVEL_PERSONAS[lvi];
                              const glowColors = ['ring-emerald-200', 'ring-blue-200', 'ring-purple-200', 'ring-amber-200'];
                              return (
                                <button key={lvi} onClick={() => handlePromptClick(level.prompt, level.tag)} className={`w-full text-left group rounded-lg border border-gray-100 border-l-[3px] ${stepColors[lvi]} bg-white p-4 transition-all hover:shadow-md`}>
                                  <div className="flex items-start gap-3.5">
                                    <div className="shrink-0 relative">
                                      <div className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${glowColors[lvi]} shadow-md`}>
                                        <Image src={persona.image} alt={persona.title} width={48} height={48} className="w-full h-full object-cover" />
                                      </div>
                                      <span className={`absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${level.color} shadow-sm`}>{level.tag}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-gray-900 group-hover:text-hdfc-blue transition">{level.label}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">{persona.title}</span>
                                        {lvi === 3 && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">C &middot; R &middot; A &middot; F &middot; T</span>}
                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-hdfc-blue ml-auto transition shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                      </div>
                                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{level.prompt}</p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">💬</div>
                  <h3 className="text-lg font-bold text-gray-800">Start Your Prompt Experiment</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2 leading-relaxed">
                    Pick a prompt level from the Lab above, or type your own prompt below. Watch the answer quality evolve as the prompt complexity increases.
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    {LAB_EXPERIMENTS.length} experimentation themes &middot; {PROMPT_LADDERS.length} use-case templates &middot; {LAB_EXPERIMENTS.length * 4 + PROMPT_LADDERS.length * 3} total prompts
                  </div>
                </div>
              )}
              {transcript.map((msg, i) => (
                <ChatBubble key={i} message={msg} isStreaming={streaming && msg.role === 'assistant' && i === transcript.length - 1} originalPrompt={msg.role === 'assistant' ? transcript[i - 1]?.content : undefined} />
              ))}
              {streaming && !streamBuffer && (
                <div className="px-4 py-3 space-y-2">
                  {webSearchStatus === 'searching' && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 animate-pulse">
                      <svg className="w-4 h-4 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      <span className="text-xs text-amber-700 font-semibold">Searching the web for live data...</span>
                    </div>
                  )}
                  {webSearchStatus === 'done' && webSearchMeta && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs text-emerald-700 font-semibold">{webSearchMeta.resultCount} web result{webSearchMeta.resultCount !== 1 ? 's' : ''} found ({webSearchMeta.ms}ms)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{webSearchStatus === 'done' ? 'Analyzing web results...' : 'AI is thinking...'}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your prompt here... (Ctrl/Cmd+Enter to send)" rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-hdfc-blue focus:ring-2 focus:ring-hdfc-blue/20 disabled:opacity-40 transition shadow-sm" />
                <div className="flex flex-col gap-2">
                  <button onClick={() => send()} disabled={streaming || !input.trim()} className="flex-1 bg-gradient-to-r from-hdfc-blue to-hdfc-blueBright hover:from-hdfc-blueBright hover:to-hdfc-blue text-white font-semibold px-6 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition text-sm shadow-md">Send</button>
                  {messages.length > 0 && <button onClick={clearChat} disabled={streaming} className="text-[10px] font-semibold text-gray-400 hover:text-red-500 transition disabled:opacity-40">Clear</button>}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <EnhanceToCraft prompt={input} onEnhanced={setInput} disabled={streaming} pageContext="Prompt Engineering Lab — mortgage business prompt experiments" />
                  <p className="text-[10px] text-gray-400">{messages.length > 0 ? `${Math.ceil(messages.filter(m => m.role === 'user').length)} turn${messages.filter(m => m.role === 'user').length !== 1 ? 's' : ''} in conversation` : 'Start a new conversation or pick a prompt from the library'}</p>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use-case Templates */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <button onClick={() => setThemesExpanded(!themesExpanded)} className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition text-left">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold bg-hdfc-blue text-white w-7 h-7 flex items-center justify-center rounded-lg">📚</span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Use-case Driven Prompt Templates</h3>
                <p className="text-xs text-gray-500 mt-0.5">{PROMPT_LADDERS.length} mortgage themes &middot; L1 (Simple) &rarr; L2 (Detailed) &rarr; L3 (Analytical)</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-blue-400 transition-transform duration-200 shrink-0 ${themesExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {themesExpanded && (
            <>
              <div className="divide-y divide-gray-100">
                {PROMPT_LADDERS.map((ladder, li) => {
                  const isOpen = expandedLadders.has(li);
                  return (
                    <div key={li}>
                      <button onClick={() => toggleLadder(li)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition text-left">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{ladder.icon}</span>
                          <span className="text-sm font-bold text-gray-800">{ladder.theme}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 space-y-2">
                          {ladder.levels.map((level, lvi) => (
                            <button key={lvi} onClick={() => handlePromptClick(level.prompt, level.tag)} className="w-full text-left group">
                              <div className="rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition p-3 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${level.color}`}>{level.tag}</span>
                                  <span className="text-xs font-semibold text-gray-700 group-hover:text-hdfc-blue transition">{level.label}</span>
                                </div>
                                <p className="text-xs text-gray-600 group-hover:text-gray-800 leading-snug transition line-clamp-2">{level.prompt}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-3 bg-amber-50 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-xs mt-0.5 shrink-0">💡</span>
                  <p className="text-xs text-amber-800 leading-snug">
                    <strong>Tip:</strong> Start with L1 to explore, refine with L2 for depth, then use L3 for analytical, board-ready strategic output. The CRAFT framework (L4) in the Lab above produces consulting-firm-quality deliverables.
                  </p>
                </div>
              </div>
            </>
          )}
          {/* Facilitation Tip for Prompt Library */}
          <PromptLabFacilitationTip guideId="fg-prompt-library" />
        </div>

        {/* ─── System Prompting vs User Prompting ─── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <button onClick={() => setSysUserExpanded(!sysUserExpanded)} className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 transition text-left">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold bg-white/20 text-white w-7 h-7 flex items-center justify-center rounded-lg">🛡️</span>
              <div>
                <h3 className="text-sm font-bold text-white">System Prompting (Guardrailing) vs User Prompting (Customization)</h3>
                <p className="text-xs text-white/80 mt-0.5">{SYSTEM_VS_USER_EXAMPLES.length} examples &middot; Learn how platform guardrails and user prompts work together</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-white/80 transition-transform duration-200 shrink-0 ${sysUserExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {sysUserExpanded && (
            <div className="p-5 space-y-4">
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-violet-800 mb-2 flex items-center gap-2"><span className="text-lg">🛡️</span> System Prompt (Platform Guardrails)</h4>
                    <ul className="text-xs text-gray-700 space-y-1.5 leading-relaxed">
                      <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5 shrink-0">•</span>Set by the platform/IT team — users cannot change them</li>
                      <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5 shrink-0">•</span>Enforce data privacy, compliance, and safety boundaries</li>
                      <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5 shrink-0">•</span>Prevent autonomous decisions, PII leakage, hallucination impact</li>
                      <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5 shrink-0">•</span>Invisible to the end user but always active</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><span className="text-lg">🎨</span> User Prompt (Customization &amp; Automation)</h4>
                    <ul className="text-xs text-gray-700 space-y-1.5 leading-relaxed">
                      <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5 shrink-0">•</span>Written by the business user for each specific task</li>
                      <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5 shrink-0">•</span>Controls format, depth, audience, and analytical focus</li>
                      <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5 shrink-0">•</span>CRAFT framework produces consulting-quality output</li>
                      <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5 shrink-0">•</span>Works WITHIN the guardrails set by the system prompt</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-violet-200 text-center">
                  <p className="text-xs text-violet-700 font-semibold">System Prompt = Safety Net &nbsp;&bull;&nbsp; User Prompt = Business Value &nbsp;&bull;&nbsp; Together = Secure + Useful AI</p>
                </div>
              </div>

              {SYSTEM_VS_USER_EXAMPLES.map(ex => {
                const isOpen = expandedSysUser === ex.id;
                return (
                  <div key={ex.id} className="rounded-xl border border-gray-200 overflow-hidden">
                    <button onClick={() => setExpandedSysUser(isOpen ? null : ex.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{ex.icon}</span>
                        <div>
                          <span className="text-sm font-bold text-gray-800">{ex.title}</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">{ex.description}</p>
                        </div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                        <div className="mt-3 bg-violet-50 rounded-lg p-3 border border-violet-200">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-white bg-violet-600 px-2 py-0.5 rounded">SYSTEM PROMPT</span>
                            <span className="text-[10px] text-violet-600 font-medium">Hidden from user — set by platform</span>
                          </div>
                          <pre className="text-[11px] text-gray-700 whitespace-pre-wrap font-mono leading-relaxed bg-white/50 rounded p-2.5 border border-violet-100">{ex.systemPrompt}</pre>
                          <p className="text-[10px] text-violet-600 mt-2 italic">{ex.systemPurpose}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded">BAD USER PROMPT</span>
                            </div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{ex.userPromptBad}</p>
                          </div>
                          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded">GOOD USER PROMPT</span>
                            </div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{ex.userPromptGood}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-[10px] font-bold text-blue-700 mb-1">Output Difference</p>
                          <p className="text-[11px] text-gray-700 leading-relaxed">{ex.outputDifference}</p>
                        </div>
                        <button
                          onClick={() => handlePromptClick(ex.userPromptGood)}
                          className="text-[11px] font-bold text-violet-700 hover:text-white bg-violet-50 hover:bg-violet-600 border border-violet-200 hover:border-violet-600 rounded-lg px-4 py-2 transition"
                        >
                          Try the Good Prompt →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Hallucination Detection & Mitigation ─── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <button onClick={() => setHallExpanded(!hallExpanded)} className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition text-left">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold bg-white/20 text-white w-7 h-7 flex items-center justify-center rounded-lg">⚡</span>
              <div>
                <h3 className="text-sm font-bold text-white">Hallucination Detection &amp; Mitigation</h3>
                <p className="text-xs text-white/80 mt-0.5">{HALLUCINATION_EXAMPLES.length} interactive examples &middot; Learn to spot and prevent AI hallucinations in banking</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-white/80 transition-transform duration-200 shrink-0 ${hallExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {hallExpanded && (
            <div className="p-5 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-red-800 mb-2">What is AI Hallucination?</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  AI &ldquo;hallucination&rdquo; occurs when a language model generates plausible-sounding but <strong>factually incorrect</strong> information — fake RBI circular numbers, wrong EMI calculations, fabricated statistics, or biased language. In banking, unchecked hallucinations can lead to <strong>compliance violations, customer harm, and regulatory penalties</strong>.
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[
                    { label: 'Regulatory', icon: '📜', desc: 'Fake circulars/norms' },
                    { label: 'Numerical', icon: '🧮', desc: 'Wrong calculations' },
                    { label: 'Factual', icon: '📊', desc: 'Fabricated stats' },
                    { label: 'Bias', icon: '⚠️', desc: 'Discriminatory language' },
                  ].map(cat => (
                    <div key={cat.label} className="text-center bg-white/60 rounded-lg p-2 border border-red-100">
                      <span className="text-lg">{cat.icon}</span>
                      <p className="text-[10px] font-bold text-red-700 mt-1">{cat.label}</p>
                      <p className="text-[9px] text-gray-500">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {HALLUCINATION_EXAMPLES.map(ex => {
                const isOpen = expandedHall === ex.id;
                const isRevealed = revealedHall.has(ex.id);
                return (
                  <div key={ex.id} className="rounded-xl border border-gray-200 overflow-hidden">
                    <button onClick={() => setExpandedHall(isOpen ? null : ex.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{ex.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">{ex.title}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              ex.category === 'regulatory' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                              ex.category === 'numerical' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                              ex.category === 'factual' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                              'text-red-700 bg-red-50 border-red-200'
                            }`}>{ex.category}</span>
                          </div>
                        </div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                        {/* AI Output (looks convincing) */}
                        <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-[10px] font-bold text-blue-700 uppercase">AI Output</span>
                            <span className="text-[10px] text-gray-400 ml-auto">Can you spot the hallucination?</span>
                          </div>
                          <p className="text-[12px] text-gray-800 leading-relaxed italic">&ldquo;{ex.aiOutput}&rdquo;</p>
                        </div>

                        {!isRevealed ? (
                          <button
                            onClick={() => setRevealedHall(prev => new Set(prev).add(ex.id))}
                            className="w-full text-center text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg py-2.5 transition"
                          >
                            🔍 Reveal the Hallucination
                          </button>
                        ) : (
                          <>
                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                              <p className="text-[10px] font-bold text-red-700 mb-1">🚨 The Hallucination</p>
                              <p className="text-[12px] text-red-800 leading-relaxed">{ex.hallucination}</p>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                              <p className="text-[10px] font-bold text-amber-700 mb-1">🧠 Why It Happened</p>
                              <p className="text-[11px] text-gray-700 leading-relaxed">{ex.whyItHappened}</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <p className="text-[10px] font-bold text-blue-700 mb-1">🔍 How to Detect</p>
                              <p className="text-[11px] text-gray-700 leading-relaxed">{ex.howToDetect}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                              <p className="text-[10px] font-bold text-emerald-700 mb-1">✅ Verification Rule</p>
                              <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">{ex.verificationRule}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-[10px] font-bold text-gray-600 mb-1">📌 Correct Information</p>
                              <p className="text-[11px] text-gray-700 leading-relaxed">{ex.correctInfo}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-emerald-800 mb-2">Anti-Hallucination Protocol for Banking</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { step: '1', title: 'Ask for Source', desc: 'Always ask AI to cite the source of any factual claim, regulatory reference, or statistic.' },
                    { step: '2', title: 'Verify with SME', desc: 'Have a subject matter expert review AI outputs before using them in decisions or customer communications.' },
                    { step: '3', title: 'Use Calculators', desc: 'Never trust AI for financial calculations. Always verify with approved EMI calculators and spreadsheets.' },
                  ].map(s => (
                    <div key={s.step} className="bg-white rounded-lg p-3 border border-emerald-100">
                      <div className="w-7 h-7 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-sm mb-2">{s.step}</div>
                      <h5 className="text-xs font-bold text-gray-800 mb-1">{s.title}</h5>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Facilitation Tip */}
              <PromptLabFacilitationTip guideId="fg-hallucination" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message, isStreaming, originalPrompt }: { message: ChatMessage; isStreaming: boolean; originalPrompt?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-gradient-to-r from-hdfc-blue to-hdfc-blueBright text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md">
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    );
  }

  const showCollapse = !isStreaming && message.content.length > 0;
  const handleCopy = async () => { try { await navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };

  return (
    <div className="flex justify-start">
      <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-2 group cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-hdfc-blue rounded-full" />
            <span className="text-xs font-bold text-hdfc-blue uppercase tracking-wider">AI Research Assistant</span>
          </div>
          {showCollapse && <span className="text-xs font-bold text-hdfc-blue group-hover:text-hdfc-red tracking-wide transition">{expanded ? 'COLLAPSE ▲' : 'EXPAND ▼'}</span>}
        </button>
        {isStreaming || expanded ? (
          <>
            <div className="text-gray-900 leading-relaxed prompt-markdown"><Markdown isStreaming={isStreaming}>{message.content}</Markdown></div>
            {isStreaming && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-hdfc-blue to-hdfc-red rounded-full animate-pulse" style={{ width: '60%' }} /></div>
                <span className="text-xs text-gray-500 font-medium">streaming...</span>
              </div>
            )}
            {!isStreaming && message.content && (
              <>
                <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-center gap-3">
                  <DownloadMenu content={message.content} filenamePrefix="hdfc-analysis" />
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition">
                    {copied ? <span className="text-emerald-700 font-bold">Copied!</span> : <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy
                    </>}
                  </button>
                </div>
                <AIOutputReviewPanel
                  content={message.content}
                  originalPrompt={originalPrompt ?? ''}
                />
              </>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-xs leading-relaxed cursor-pointer" onClick={() => setExpanded(true)}>
            {message.content.slice(0, 500).replace(/\n/g, ' ')}{message.content.length > 500 ? '...' : ''}
            <span className="ml-2 text-hdfc-blue font-semibold">Click to expand</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PromptLabFacilitationTip({ guideId }: { guideId: string }) {
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
          {item.liveExercisePrompt && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-[10px] font-bold text-blue-700 mb-1">Live Exercise Prompt</p>
              <p className="text-[11px] text-gray-700 font-mono leading-relaxed bg-white/50 rounded p-2 border border-blue-100">{item.liveExercisePrompt}</p>
            </div>
          )}
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
