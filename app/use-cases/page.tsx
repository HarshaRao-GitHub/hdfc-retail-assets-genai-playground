'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import { USE_CASES, USE_CASE_CATEGORIES } from '@/data/use-cases';
import { useDocuments } from '@/lib/document-context';
import EnhanceToCraft from '@/components/EnhanceToCraft';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

export default function UseCasesPage() {
  const { documents, setTrayOpen } = useDocuments();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [buildMode, setBuildMode] = useState(false);
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

          {/* Build Your Own Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setBuildMode(false)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${!buildMode ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'}`}
            >
              📚 Browse Use Cases
            </button>
            <button
              onClick={() => setBuildMode(true)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition ${buildMode ? 'bg-hdfc-blue text-white border-hdfc-blue shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-hdfc-blue'}`}
            >
              ✨ Build Your Own Use Case
            </button>
          </div>

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
          ) : (
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
                          onClick={() => { setBuildMode(true); setUcTitle(uc.title); setUcDescription(uc.description); setUcPrompt(uc.samplePrompt); setMessages([]); setStreamBuffer(''); }}
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
          )}
        </div>
      </div>
      <footer className="border-t border-hdfc-line bg-white"><div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">HDFC Retail Assets GenAI Playground &middot; Use Case Library &middot; {USE_CASES.length}+ Use Cases</div></footer>
    </>
  );
}
