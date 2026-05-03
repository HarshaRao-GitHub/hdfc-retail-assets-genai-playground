'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import HITLReviewPanel from '@/components/HITLReviewPanel';
import type { HITLEvent } from '@/components/HITLReviewPanel';
import { USE_CASES, USE_CASE_CATEGORIES } from '@/data/use-cases';
import { MYTHS_VS_REALITY, HITL_SCENARIOS, HITL_APPROVER_ROLES } from '@/data/advanced-features';
import { FACILITATION_GUIDE, THIRTY_DAY_PLAN_TEMPLATE, BUILD_BUY_EXAMPLES } from '@/data/facilitation-guide';
import { useDocuments } from '@/lib/document-context';
import EnhanceToCraft from '@/components/EnhanceToCraft';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

type PageMode = 'browse' | 'build' | 'myths' | 'hitl-demo' | '30day-plan' | 'build-buy-wait';

export default function UseCasesPage() {
  const { documents, setTrayOpen } = useDocuments();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageMode, setPageMode] = useState<PageMode>('browse');
  const [flippedMyths, setFlippedMyths] = useState<Set<string>>(new Set());
  const [mythFilter, setMythFilter] = useState<string | null>(null);
  const [demoHitlEvent, setDemoHitlEvent] = useState<HITLEvent | null>(null);
  const [demoHitlDecision, setDemoHitlDecision] = useState<string | null>(null);
  const [selectedHitlDemo, setSelectedHitlDemo] = useState<string | null>(null);
  const [planInputs, setPlanInputs] = useState<Record<string, string>>({});

  const buildMode = pageMode === 'build';
  const [ucTitle, setUcTitle] = useState('');
  const [ucDescription, setUcDescription] = useState('');
  const [ucPrompt, setUcPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);

  const transcript: ChatMessage[] = streaming && streamBuffer ? [...messages, { role: 'assistant', content: streamBuffer }] : messages;

  const scrollToBottom = useCallback(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  const filteredCases = USE_CASES.filter(uc => {
    if (activeCategory && uc.category !== activeCategory) return false;
    if (activeAudience && !uc.audience.includes(activeAudience)) return false;
    if (activeDay && uc.dayNumber !== activeDay) return false;
    return true;
  });

  const audiences = ['Sales', 'Product', 'Portfolio', 'Service'];

  async function copyPrompt(id: string, prompt: string) {
    try { await navigator.clipboard.writeText(prompt); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); } catch {}
  }

  async function runCustomUseCase() {
    const prompt = ucPrompt.trim();
    if (!prompt || streaming) return;

    const contextParts: string[] = [];
    if (ucTitle.trim()) contextParts.push(`Use Case: ${ucTitle.trim()}`);
    if (ucDescription.trim()) contextParts.push(`Description: ${ucDescription.trim()}`);

    const fullPrompt = contextParts.length > 0
      ? `[Custom Use Case: ${ucTitle || 'User-Defined'}]\n${ucDescription ? ucDescription + '\n\n' : ''}${prompt}`
      : prompt;

    const next: ChatMessage[] = [...messages, { role: 'user', content: fullPrompt }];
    setMessages(next);
    setStreaming(true);
    setStreamBuffer('');
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
          promptLevel: 'L4',
          context: `The user is building and running their own custom use case for HDFC Retail Assets mortgage business. Provide thorough, actionable, structured output. ${ucTitle ? `Use Case Title: "${ucTitle}".` : ''} ${ucDescription ? `Use Case Context: "${ucDescription}".` : ''}`,
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
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `*Network error: ${err instanceof Error ? err.message : 'unknown'}*` }]);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
    }
  }

  function resetBuild() {
    setMessages([]);
    setStreamBuffer('');
    setUcPrompt('');
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-amber-700 to-amber-500 border-b">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
              <span className="w-2 h-2 bg-amber-200 rounded-full animate-pulse" />
              {USE_CASES.length} Use Cases &middot; 6 Categories &middot; Build Your Own
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Use Case Library</h1>
            <p className="mt-1.5 text-white/80 text-sm max-w-xl">Browse {USE_CASES.length} mortgage use cases, or build and run your own with attached documents and custom prompts.</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

          {/* Mode Toggle Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPageMode('browse')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${pageMode === 'browse' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'}`}
            >
              📚 Browse Use Cases
            </button>
            <button
              onClick={() => setPageMode('build')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${pageMode === 'build' ? 'bg-hdfc-blue text-white border-hdfc-blue shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}
            >
              ✨ Build Your Own
            </button>
            <button
              onClick={() => setPageMode('myths')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${pageMode === 'myths' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'}`}
            >
              💡 Myths vs Reality
            </button>
            <button
              onClick={() => setPageMode('hitl-demo')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${pageMode === 'hitl-demo' ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'}`}
            >
              🔍 HITL Demo
            </button>
            <button
              onClick={() => setPageMode('30day-plan')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${pageMode === '30day-plan' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
            >
              📅 30-Day Plan
            </button>
            <button
              onClick={() => setPageMode('build-buy-wait')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${pageMode === 'build-buy-wait' ? 'bg-cyan-600 text-white border-cyan-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-400'}`}
            >
              🔀 Build vs Buy vs Wait
            </button>
          </div>

          {/* ─── Myths vs Reality ─── */}
          {pageMode === 'myths' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">💡</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">GenAI Myths vs. Banking Reality</h2>
                    <p className="text-xs text-gray-600">Click any card to reveal the reality. {MYTHS_VS_REALITY.length} common myths debunked with actionable takeaways for banking leaders.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => setMythFilter(null)} className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition ${!mythFilter ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'}`}>All</button>
                  {['leadership', 'technical', 'regulatory', 'operational'].map(cat => (
                    <button key={cat} onClick={() => setMythFilter(mythFilter === cat ? null : cat)} className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition capitalize ${mythFilter === cat ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MYTHS_VS_REALITY.filter(m => !mythFilter || m.category === mythFilter).map(myth => {
                  const isFlipped = flippedMyths.has(myth.id);
                  return (
                    <div
                      key={myth.id}
                      onClick={() => setFlippedMyths(prev => { const next = new Set(prev); if (next.has(myth.id)) next.delete(myth.id); else next.add(myth.id); return next; })}
                      className="cursor-pointer group"
                    >
                      {!isFlipped ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 hover:border-red-400 hover:shadow-lg transition min-h-[200px] flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{myth.icon}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${myth.riskOfBelieving === 'High' ? 'text-red-700 bg-red-100 border-red-200' : myth.riskOfBelieving === 'Medium' ? 'text-amber-700 bg-amber-100 border-amber-200' : 'text-green-700 bg-green-100 border-green-200'}`}>Risk: {myth.riskOfBelieving}</span>
                              <span className="text-[9px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full border border-red-200 uppercase">{myth.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">MYTH</span>
                          </div>
                          <p className="text-[13px] font-medium text-red-900 leading-relaxed flex-1">&ldquo;{myth.myth}&rdquo;</p>
                          <p className="text-[10px] text-red-400 mt-3 text-center group-hover:text-red-600 transition font-semibold">Click to reveal reality →</p>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 hover:border-emerald-400 hover:shadow-lg transition min-h-[200px] flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{myth.icon}</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">{myth.category}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">REALITY</span>
                          </div>
                          <p className="text-[12px] text-emerald-900 leading-relaxed mb-3">{myth.reality}</p>
                          <div className="bg-white/70 rounded-lg p-2.5 border border-emerald-100 mt-auto">
                            <p className="text-[10px] font-bold text-emerald-700 mb-0.5">Takeaway:</p>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{myth.takeaway}</p>
                          </div>
                          <p className="text-[10px] text-emerald-400 mt-2 text-center group-hover:text-emerald-600 transition font-semibold">Click to see myth again ←</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-800 mb-2">Key Principle for Leaders</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  GenAI is a <strong>powerful tool within guardrails</strong>, not a magic solution. The most successful AI adoptions happen when leaders understand both the capabilities and limitations, set realistic expectations, and invest in training their teams on prompt engineering and output verification.
                </p>
              </div>

              {/* Facilitation Tips for Myths */}
              <FacilitationTipPanel guideId="fg-myths" />
            </div>
          )}

          {/* ─── 30-Day Plan Worksheet ─── */}
          {pageMode === '30day-plan' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">📅</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Your First 30-Day GenAI Plan</h2>
                    <p className="text-xs text-gray-600">Fill in each box. 5 minutes of silent thinking. Then share with your table. One commitment = one action this month.</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {THIRTY_DAY_PLAN_TEMPLATE.map(week => (
                  <div key={week.week} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{week.icon}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white">{week.week}</h3>
                          <p className="text-xs text-white/80">{week.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-[12px] text-gray-700 font-medium">{week.description}</p>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Suggested Prompts</p>
                        {week.prompts.map((p, i) => (
                          <p key={i} className="text-[11px] text-gray-600 leading-relaxed mb-1 flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>{p}
                          </p>
                        ))}
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-700 mb-0.5">Success Metric</p>
                        <p className="text-[11px] text-emerald-800">{week.successMetric}</p>
                      </div>
                      {/* Editable input */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Your Plan</p>
                        <textarea
                          value={planInputs[week.week] ?? ''}
                          onChange={e => setPlanInputs(prev => ({ ...prev, [week.week]: e.target.value }))}
                          placeholder={`Write your ${week.label.toLowerCase()} plan here...`}
                          rows={3}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* My Commitment */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
                <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">✊</span> My 30-Day AI Commitment
                </h3>
                <p className="text-xs text-gray-600 mb-3">Write your one commitment below. Say it out loud to your table neighbor for peer accountability.</p>
                <textarea
                  value={planInputs['commitment'] ?? ''}
                  onChange={e => setPlanInputs(prev => ({ ...prev, commitment: e.target.value }))}
                  placeholder='e.g., "I will automate my daily MIS compilation using AI prompts, saving 2 hours per day by end of month."'
                  rows={2}
                  className="w-full bg-white border border-amber-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Facilitation Tips */}
              <FacilitationTipPanel guideId="fg-30day" />
            </div>
          )}

          {/* ─── Build vs Buy vs Wait ─── */}
          {pageMode === 'build-buy-wait' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center text-xl">🔀</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Build vs Buy vs Wait Decision Framework</h2>
                    <p className="text-xs text-gray-600">Not every AI use case needs the same approach. Use this framework to decide the right path for each initiative.</p>
                  </div>
                </div>
              </div>

              {/* Decision Tree Visual */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Decision Tree</h3>
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-cyan-100 border-2 border-cyan-300 rounded-xl px-6 py-3 text-center">
                    <p className="text-[12px] font-bold text-cyan-800">Does it involve real customer data or PII?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className="text-center space-y-3">
                      <div className="text-xs font-bold text-red-600 bg-red-50 rounded-full px-3 py-1 inline-block">YES — Sensitive</div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                        <p className="text-[11px] font-bold text-amber-800">Needs custom AI model?</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center">
                          <p className="text-[10px] font-bold text-blue-800">YES</p>
                          <p className="text-[11px] font-bold text-blue-900 mt-1">BUY</p>
                          <p className="text-[9px] text-blue-600">IT leads evaluation</p>
                        </div>
                        <div className="bg-amber-100 border border-amber-300 rounded-lg p-2 text-center">
                          <p className="text-[10px] font-bold text-amber-800">NO</p>
                          <p className="text-[11px] font-bold text-amber-900 mt-1">WAIT</p>
                          <p className="text-[9px] text-amber-600">IT + Compliance path</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 inline-block">NO — Not sensitive</div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                        <p className="text-[11px] font-bold text-amber-800">Needs custom AI model?</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center">
                          <p className="text-[10px] font-bold text-blue-800">YES</p>
                          <p className="text-[11px] font-bold text-blue-900 mt-1">BUY</p>
                          <p className="text-[9px] text-blue-600">Evaluate with IT</p>
                        </div>
                        <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-2 text-center">
                          <p className="text-[10px] font-bold text-emerald-800">NO</p>
                          <p className="text-[11px] font-bold text-emerald-900 mt-1">UPSKILL</p>
                          <p className="text-[9px] text-emerald-600">Start with prompts!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Matrix */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800">Example Decision Matrix — Walk Through These Together</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-3 py-2 font-bold text-gray-600">Use Case</th>
                        <th className="text-center px-3 py-2 font-bold text-gray-600">Data Sensitivity</th>
                        <th className="text-center px-3 py-2 font-bold text-gray-600">Custom Model?</th>
                        <th className="text-center px-3 py-2 font-bold text-gray-600">Regulatory</th>
                        <th className="text-center px-3 py-2 font-bold text-gray-600">Complexity</th>
                        <th className="text-center px-3 py-2 font-bold text-gray-600">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {BUILD_BUY_EXAMPLES.map(ex => (
                        <tr key={ex.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 py-2.5 font-medium text-gray-800">{ex.useCase}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ex.dataSensitivity === 'High' ? 'text-red-700 bg-red-50' : ex.dataSensitivity === 'Medium' ? 'text-amber-700 bg-amber-50' : 'text-green-700 bg-green-50'}`}>{ex.dataSensitivity}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-[11px]">{ex.customModelNeeded ? 'Yes' : 'No'}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ex.regulatoryReady === 'Ready' ? 'text-green-700 bg-green-50' : ex.regulatoryReady === 'Blocked' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'}`}>{ex.regulatoryReady}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-[11px]">{ex.buildComplexity}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                              ex.decision === 'Upskill Team' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                              ex.decision === 'Buy' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                              ex.decision === 'Wait' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                              'text-purple-700 bg-purple-50 border-purple-200'
                            }`}>{ex.decision}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reasoning Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BUILD_BUY_EXAMPLES.slice(0, 6).map(ex => (
                  <div key={ex.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[12px] font-bold text-gray-800 leading-tight">{ex.useCase}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        ex.decision === 'Upskill Team' ? 'text-emerald-700 bg-emerald-50' :
                        ex.decision === 'Buy' ? 'text-blue-700 bg-blue-50' :
                        ex.decision === 'Wait' ? 'text-amber-700 bg-amber-50' :
                        'text-purple-700 bg-purple-50'
                      }`}>{ex.decision}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{ex.reasoning}</p>
                  </div>
                ))}
              </div>

              {/* Key Insight */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-cyan-800 mb-1">Key Insight for Leaders</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>60% of AI use cases just need better prompting</strong> — no vendor, no IT project, no budget approval. You can start TODAY with prompt engineering on approved platforms. Focus your Build/Buy energy on the 40% that truly needs custom solutions.
                </p>
              </div>

              {/* Facilitation Tips */}
              <FacilitationTipPanel guideId="fg-build-buy-wait" />
            </div>
          )}

          {/* ─── HITL Demo ─── */}
          {pageMode === 'hitl-demo' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🔍</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Human-in-the-Loop (HITL) — Interactive Demo</h2>
                    <p className="text-xs text-gray-600">Experience the HITL pattern used across the platform. AI generates output, then a human reviewer must Approve, Modify, or Reject before it can be used.</p>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-4 mt-3 border border-orange-100">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Why HITL Matters in Banking</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="text-center">
                      <span className="text-2xl">⚖️</span>
                      <h5 className="text-xs font-bold text-gray-800 mt-1">Regulatory Mandate</h5>
                      <p className="text-[10px] text-gray-600 mt-0.5">RBI requires human accountability for lending decisions. AI assists, humans decide.</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl">🛡️</span>
                      <h5 className="text-xs font-bold text-gray-800 mt-1">Quality Assurance</h5>
                      <p className="text-[10px] text-gray-600 mt-0.5">Catches hallucinations, errors, bias, and policy violations before they reach customers.</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl">📋</span>
                      <h5 className="text-xs font-bold text-gray-800 mt-1">Audit Trail</h5>
                      <p className="text-[10px] text-gray-600 mt-0.5">Every AI output has a recorded human decision — approve, modify, or reject — for compliance.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delegation of Authority Matrix */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800">Delegation of Authority (DoA) — HITL Approver Matrix</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Each AI output type requires review by a specific role based on the Delegation of Authority</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-2 font-bold text-gray-600">Role</th>
                        <th className="text-left px-4 py-2 font-bold text-gray-600">Level</th>
                        <th className="text-left px-4 py-2 font-bold text-gray-600">Review Scope</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {HITL_APPROVER_ROLES.map(r => (
                        <tr key={r.role} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-2 font-medium text-gray-800">{r.role}</td>
                          <td className="px-4 py-2"><span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">{r.level}</span></td>
                          <td className="px-4 py-2 text-gray-600">{r.scope}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* HITL Scenario Cards */}
              <h3 className="text-sm font-bold text-gray-800">Try HITL Review Gates</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HITL_SCENARIOS.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedHitlDemo(scenario.id);
                      const confidence = parseFloat((scenario.confidenceRange[0] + Math.random() * (scenario.confidenceRange[1] - scenario.confidenceRange[0])).toFixed(2));
                      setDemoHitlEvent({
                        approvalId: `DEMO-${Date.now().toString(36).toUpperCase()}`,
                        title: scenario.title,
                        approverRole: scenario.approverRole,
                        confidence,
                        confidenceThreshold: 0.80,
                        isMandatory: true,
                        reason: confidence < 0.80
                          ? `Agent confidence ${Math.round(confidence * 100)}% is below 80% threshold — mandatory human review escalation.`
                          : `Mandatory HITL gate — ${scenario.approverRole} sign-off required per Delegation of Authority.`,
                        reviewCheckpoints: scenario.reviewCheckpoints,
                      });
                      setDemoHitlDecision(null);
                    }}
                    className={`text-left group bg-white border rounded-xl p-4 hover:shadow-md transition ${selectedHitlDemo === scenario.id ? 'border-orange-400 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{scenario.icon}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        scenario.section === 'sales-ai' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                        scenario.section === 'doc-intelligence' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        'text-purple-700 bg-purple-50 border-purple-200'
                      }`}>{scenario.section.replace('-', ' ')}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-orange-700 transition">{scenario.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{scenario.context}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">Approver: {scenario.approverRole}</span>
                    </div>
                    <p className="text-[10px] text-orange-400 mt-2 font-semibold group-hover:text-orange-600">Click to try HITL →</p>
                  </button>
                ))}
              </div>

              {/* Active HITL Demo Panel */}
              {demoHitlEvent && (
                <div className="space-y-3">
                  {/* Simulated AI output */}
                  <div className="bg-slate-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Simulated AI Output</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      {(() => {
                        const scenario = HITL_SCENARIOS.find(s => s.id === selectedHitlDemo);
                        return (
                          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                            <p className="font-medium text-gray-800">{scenario?.title}</p>
                            <p className="text-xs text-gray-600 italic">{scenario?.context}</p>
                            <div className="bg-blue-50 rounded p-3 border border-blue-100 mt-2">
                              <p className="text-[11px] text-blue-700">This is a simulated AI output for demonstration. In the live application, this would be the actual AI-generated response from the relevant module ({scenario?.section}).</p>
                            </div>
                            <p className="text-xs text-amber-700 bg-amber-50 rounded p-2 border border-amber-100">⚠️ Risk if HITL is skipped: {scenario?.riskIfSkipped}</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* HITL Review Panel */}
                  {!demoHitlDecision ? (
                    <HITLReviewPanel
                      hitl={demoHitlEvent}
                      onDecision={(decision, detail) => {
                        setDemoHitlDecision(`${decision}: ${detail}`);
                      }}
                      accentColor="#EA580C"
                    />
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">✅</span>
                        <h4 className="text-sm font-bold text-emerald-800">HITL Gate Complete</h4>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">Decision recorded: <strong>{demoHitlDecision}</strong></p>
                      <p className="text-[11px] text-emerald-600 mt-2">In the live application, this decision would be persisted, audit-logged, and the workflow would proceed based on the outcome.</p>
                      <button
                        onClick={() => { setDemoHitlEvent(null); setDemoHitlDecision(null); setSelectedHitlDemo(null); }}
                        className="mt-3 text-[11px] font-bold text-orange-700 hover:text-white bg-orange-50 hover:bg-orange-600 border border-orange-200 hover:border-orange-600 rounded-lg px-4 py-2 transition"
                      >
                        Try Another HITL Scenario
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {buildMode ? (
            /* ─── Build Your Own Use Case ─── */
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-hdfc-blue mb-1">Define Your Use Case</h2>
                  <p className="text-[12px] text-gray-600">Describe your business scenario, attach documents, write your prompt, and run it live.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Use Case Title</label>
                    <input
                      type="text"
                      value={ucTitle}
                      onChange={e => setUcTitle(e.target.value)}
                      placeholder="e.g. Branch-Level Disbursal Forecast for Q2"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hdfc-blue focus:ring-2 focus:ring-hdfc-blue/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Business Context / Description</label>
                    <input
                      type="text"
                      value={ucDescription}
                      onChange={e => setUcDescription(e.target.value)}
                      placeholder="e.g. South region sales review for leadership meeting"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hdfc-blue focus:ring-2 focus:ring-hdfc-blue/20"
                    />
                  </div>
                </div>

                {/* Document Context */}
                <div className={`rounded-lg px-4 py-3 flex items-center justify-between text-[12px] border ${documents.length > 0 ? 'bg-white border-blue-200 text-blue-800' : 'bg-white border-gray-200 text-gray-500'}`}>
                  <div className="flex items-center gap-2">
                    <span>{documents.length > 0 ? '📄' : '📂'}</span>
                    {documents.length > 0 ? (
                      <span><strong>{documents.length} document{documents.length !== 1 ? 's' : ''}</strong> will be used — AI will reference them in the analysis</span>
                    ) : (
                      <span>No documents attached. Load sample data or upload your own via the Document Tray for richer output.</span>
                    )}
                  </div>
                  <button onClick={() => setTrayOpen(true)} className="text-[11px] font-semibold text-hdfc-blue hover:text-hdfc-red px-3 py-1 border border-hdfc-blue/30 rounded-md hover:bg-blue-100 transition shrink-0">
                    {documents.length > 0 ? 'Manage Docs' : 'Load Docs'}
                  </button>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Your Prompt</label>
                  <textarea
                    value={ucPrompt}
                    onChange={e => setUcPrompt(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); runCustomUseCase(); } }}
                    placeholder="Write your prompt here... Be as detailed as you want. Reference specific documents, ask for analysis, forecasts, comparisons, strategies, or any business output."
                    rows={5}
                    disabled={streaming}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-hdfc-blue focus:ring-2 focus:ring-hdfc-blue/20 disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={runCustomUseCase}
                    disabled={streaming || !ucPrompt.trim()}
                    className="bg-hdfc-blue hover:bg-hdfc-blueDeep text-white font-bold px-8 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition text-sm shadow-md"
                  >
                    {streaming ? 'Running...' : 'Run Use Case'}
                  </button>
                  <EnhanceToCraft prompt={ucPrompt} onEnhanced={setUcPrompt} disabled={streaming} pageContext="Use Case Builder — custom mortgage business use case" />
                  {messages.length > 0 && (
                    <button onClick={resetBuild} disabled={streaming} className="text-sm text-gray-500 hover:text-red-600 font-medium transition disabled:opacity-40">
                      Clear Results
                    </button>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto">Ctrl/Cmd + Enter to run</span>
                </div>
              </div>

              {/* Results */}
              {(transcript.length > 0 || streaming) && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
                  <div className="px-5 py-3 border-b border-gray-200 bg-slate-50 flex items-center gap-3">
                    <span className="text-xs font-bold bg-hdfc-blue text-white px-2.5 py-1 rounded-md">RESULTS</span>
                    <span className="text-sm font-semibold text-gray-700">{ucTitle || 'Custom Use Case'}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {transcript.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? (
                          <div className="max-w-[80%] bg-gradient-to-r from-hdfc-blue to-hdfc-blueBright text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                          <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 bg-hdfc-blue rounded-full" />
                              <span className="text-xs font-bold text-hdfc-blue uppercase tracking-wider">AI Output</span>
                            </div>
                            <div className="text-gray-900 leading-relaxed">
                              <Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown>
                            </div>
                            {!streaming && msg.content && (
                              <div className="mt-3 pt-2.5 border-t border-gray-200">
                                <DownloadMenu content={msg.content} filenamePrefix="hdfc-custom-usecase" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {streaming && !streamBuffer && (
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Running your use case...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Follow-up input */}
                  <div className="border-t border-gray-200 bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={ucPrompt}
                        onChange={e => setUcPrompt(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runCustomUseCase(); } }}
                        placeholder="Ask a follow-up question or refine your use case..."
                        disabled={streaming}
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hdfc-blue focus:ring-2 focus:ring-hdfc-blue/20 disabled:opacity-40 transition shadow-sm"
                      />
                      <button onClick={runCustomUseCase} disabled={streaming || !ucPrompt.trim()} className="bg-hdfc-blue hover:bg-hdfc-blueDeep text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">
                        Send
                      </button>
                    </div>
                    <div className="mt-2">
                      <EnhanceToCraft prompt={ucPrompt} onEnhanced={setUcPrompt} disabled={streaming} pageContext="Use Case Builder follow-up — mortgage business" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : pageMode === 'browse' ? (
            /* ─── Browse Use Cases ─── */
            <div>
              {/* Filters */}
              <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-hdfc-line">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Category</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${!activeCategory ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>All</button>
                    {USE_CASE_CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${activeCategory === cat.id ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`} style={activeCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}>
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Audience</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setActiveAudience(null)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${!activeAudience ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>All</button>
                    {audiences.map(a => (
                      <button key={a} onClick={() => setActiveAudience(activeAudience === a ? null : a)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${activeAudience === a ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Day</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setActiveDay(null)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${!activeDay ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>Both</button>
                    {[1, 2].map(d => (
                      <button key={d} onClick={() => setActiveDay(activeDay === d ? null : d)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${activeDay === d ? 'bg-hdfc-blue text-white border-hdfc-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}>Day {d}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[12px] text-gray-500 mb-4">{filteredCases.length} use case{filteredCases.length !== 1 ? 's' : ''} found</div>

              {/* Use Case Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCases.map(uc => {
                  const cat = USE_CASE_CATEGORIES.find(c => c.id === uc.category);
                  const isCopied = copiedId === uc.id;
                  return (
                    <div key={uc.id} className="bg-white rounded-xl border border-hdfc-line overflow-hidden hover:shadow-lg transition group">
                      <div className="h-1" style={{ backgroundColor: cat?.color || '#004B87' }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{uc.icon}</span>
                            <div>
                              <h3 className="text-[14px] font-bold text-hdfc-blue group-hover:text-hdfc-red transition leading-tight">{uc.title}</h3>
                              <span className="text-[10px] text-gray-500">{cat?.label}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${uc.coverageLevel === 'hands-on' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : uc.coverageLevel === 'demo' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                            {uc.coverageLevel}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{uc.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {uc.audience.map(a => (
                            <span key={a} className="text-[9px] font-semibold text-hdfc-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{a}</span>
                          ))}
                          <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Day {uc.dayNumber}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase">Sample Prompt</span>
                            <button onClick={() => copyPrompt(uc.id, uc.samplePrompt)} className="text-[10px] font-semibold text-hdfc-blue hover:text-hdfc-red transition">
                              {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-3">{uc.samplePrompt}</p>
                        </div>
                        <button
                          onClick={() => { setPageMode('build'); setUcTitle(uc.title); setUcDescription(uc.description); setUcPrompt(uc.samplePrompt); setMessages([]); setStreamBuffer(''); }}
                          className="mt-3 w-full text-center text-[11px] font-bold text-hdfc-blue hover:text-white bg-blue-50 hover:bg-hdfc-blue border border-blue-200 hover:border-hdfc-blue rounded-lg py-2 transition"
                        >
                          Run This Use Case &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCases.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-bold text-gray-800">No use cases match your filters</h3>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting the category, audience, or day filter.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <footer className="border-t border-hdfc-line bg-white"><div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">HDFC Retail Assets GenAI Playground &middot; Use Case Library &middot; {USE_CASES.length}+ Use Cases</div></footer>
    </>
  );
}

function FacilitationTipPanel({ guideId }: { guideId: string }) {
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
