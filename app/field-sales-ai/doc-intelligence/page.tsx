'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import EnhanceToCraft from '@/components/EnhanceToCraft';
import HallucinationDetector from '@/components/HallucinationDetector';
import { useDocuments } from '@/lib/document-context';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { FIELD_SALES_DOC_CATEGORIES, FIELD_SALES_DOC_OPERATIONS, FIELD_SALES_STANDARD_OPERATIONS } from '@/data/field-sales-doc-config';
import { FIELD_SALES_DISCLAIMER } from '@/data/field-sales-prompts';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

interface PreviewData {
  filename: string;
  text: string;
  headers?: string[];
  rows?: string[][];
}

const CHAT_KEY = 'field_sales_doc_intel';

export default function FieldSalesDocIntelligencePage() {
  const { documents, setTrayOpen, addDocument } = useDocuments();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PreviewData | null>(null);
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

  async function loadSampleFile(path: string, filename: string) {
    setLoadingSample(filename);
    try {
      const res = await fetch(path);
      const text = await res.text();
      addDocument({ filename, text, images: [], source: 'sample', samplePath: path });
    } catch (e) {
      console.error('Failed to load sample:', e);
    } finally {
      setLoadingSample(null);
    }
  }

  async function viewSampleFile(path: string, filename: string) {
    try {
      const res = await fetch(path);
      const text = await res.text();
      let headers: string[] | undefined;
      let rows: string[][] | undefined;
      if (filename.endsWith('.csv')) {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
          headers = lines[0].split(',').map(h => h.trim());
          rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
        }
      }
      setPreviewDoc({ filename, text, headers, rows });
    } catch (e) {
      console.error('Failed to preview:', e);
    }
  }

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');
    setTimeout(scrollToBottom, 50);

    const operation = FIELD_SALES_DOC_OPERATIONS.find(op => op.id === selectedOperation) ?? FIELD_SALES_STANDARD_OPERATIONS.find(op => op.id === selectedOperation);
    const systemContext = operation?.systemPromptTemplate ?? 'You are a Field Sales Intelligence AI for HDFC Bank Retail Assets. Analyze uploaded documents (prospect profiles, competitor data, pipeline, industry research) and provide actionable sales intelligence — pre-meeting briefs, competitive battle cards, deal prioritization, cross-sell mapping, and objection responses. Focus on making the sales professional more prepared, credible, and persuasive.';

    try {
      const docPayload = documents.length > 0 ? documents.map(d => ({ filename: d.filename, text: d.text })) : undefined;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), promptLevel: 'L3', context: systemContext, documentTexts: docPayload })
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

  const activeOperation = FIELD_SALES_DOC_OPERATIONS.find(op => op.id === selectedOperation) ?? FIELD_SALES_STANDARD_OPERATIONS.find(op => op.id === selectedOperation);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-purple-800 to-purple-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Field Sales AI
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
                  Field Sales — Document Intelligence
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Sales Document Intelligence & Visualization</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  Load prospect data, competitor intelligence, pipeline trackers, and industry reports. AI generates pre-meeting briefs, battle cards, and deal strategies.
                </p>
              </div>
              {messages.length > 0 && <button onClick={clearChat} disabled={streaming} className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40">Clear</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>All data is synthetic. Do NOT upload real customer data to any external AI tool.</span>
          </div>

          {/* Document Context Bar */}
          <div className={`rounded-lg px-4 py-2.5 flex items-center justify-between text-[12px] border ${documents.length > 0 ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <span>{documents.length > 0 ? '📄' : '📂'}</span>
              {documents.length > 0 ? (
                <span><strong>{documents.length} document{documents.length !== 1 ? 's' : ''}</strong> loaded — AI will use them for sales intelligence analysis</span>
              ) : (
                <span>No documents loaded. Load sample sales data below or upload your own via the Document Tray.</span>
              )}
            </div>
            <button onClick={() => setTrayOpen(true)} className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 px-3 py-1 border border-purple-300 rounded-md hover:bg-purple-100 transition">
              {documents.length > 0 ? 'Manage Docs' : 'Upload Docs'}
            </button>
          </div>

          {/* Operations Selection — Two Tiers */}
          <div className="space-y-4">
            {/* Sales-Specific Analysis Operations */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">1</span>
                <h3 className="text-[13px] font-bold text-gray-800">Sales Analysis Operations</h3>
                <span className="text-[10px] text-gray-400 font-medium">— Pre-built for field sales intelligence</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FIELD_SALES_DOC_OPERATIONS.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperation(selectedOperation === op.id ? null : op.id)}
                    className={`px-4 py-2 rounded-lg text-[11px] font-bold border transition ${selectedOperation === op.id ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'}`}
                  >
                    {op.icon} {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Document Operations */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">2</span>
                <h3 className="text-[13px] font-bold text-gray-800">Standard Document Operations</h3>
                <span className="text-[10px] text-gray-400 font-medium">— General-purpose document intelligence</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FIELD_SALES_STANDARD_OPERATIONS.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperation(selectedOperation === op.id ? null : op.id)}
                    className={`px-4 py-2 rounded-lg text-[11px] font-bold border transition ${selectedOperation === op.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}
                  >
                    {op.icon} {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Operation Starter Prompts */}
          {activeOperation && (() => {
            const isStandard = FIELD_SALES_STANDARD_OPERATIONS.some(op => op.id === selectedOperation);
            const bgColor = isStandard ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200';
            const textColor = isStandard ? 'text-blue-700' : 'text-purple-700';
            const btnBorder = isStandard ? 'border-blue-200 text-blue-800 hover:bg-blue-100' : 'border-purple-200 text-purple-800 hover:bg-purple-100';
            return (
              <div className={`${bgColor} border rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{activeOperation.icon}</span>
                  <span className={`text-[12px] font-bold ${textColor}`}>{activeOperation.label}</span>
                </div>
                <p className={`text-[11px] ${textColor} font-medium mb-3`}>{activeOperation.description}</p>
                <div className="flex flex-wrap gap-2">
                  {activeOperation.starterPrompts.map((sp, i) => (
                    <button key={i} onClick={() => { setInput(sp); inputRef.current?.focus(); }} className={`text-[10px] bg-white border ${btnBorder} px-3 py-1.5 rounded-md transition font-medium`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Sample Data Categories */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-2">Sample Sales Data</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FIELD_SALES_DOC_CATEGORIES.map(cat => (
                <div key={cat.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-[12px] font-bold text-gray-800">{cat.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2">{cat.description}</p>
                  <div className="space-y-2">
                    {cat.sampleFiles.map(file => {
                      const isLoaded = documents.some(d => d.filename === file.filename);
                      return (
                        <div key={file.filename} className={`rounded-lg border transition ${isLoaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between px-2.5 py-2">
                            <span className={`text-[10px] font-medium truncate flex-1 mr-2 ${isLoaded ? 'text-green-700' : 'text-gray-700'}`}>
                              {isLoaded ? '✓ ' : ''}{file.label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => viewSampleFile(file.path, file.filename)}
                                className="p-1 rounded text-blue-600 hover:bg-blue-50 transition"
                                title="View document"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                              <a
                                href={file.path}
                                download={file.filename}
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition"
                                title="Download file"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              </a>
                              <button
                                onClick={() => loadSampleFile(file.path, file.filename)}
                                disabled={!!loadingSample || isLoaded}
                                className={`p-1 rounded transition ${isLoaded ? 'text-green-400 cursor-default' : 'text-purple-600 hover:bg-purple-50'}`}
                                title={isLoaded ? 'Loaded for AI' : 'Load for AI analysis'}
                              >
                                {loadingSample === file.filename ? (
                                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                  </svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">📊</div>
                  <h3 className="text-lg font-bold text-gray-800">Sales Document Intelligence</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">
                    Load sample data above, select an operation, and ask questions. AI will analyze your sales data and generate actionable intelligence for field sales.
                  </p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-purple-600 rounded-full" />
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Sales Intelligence</span>
                      </div>
                      <div className="text-gray-900 leading-relaxed"><Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown></div>
                      {!streaming && msg.content && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200">
                          <DownloadMenu content={msg.content} filenamePrefix="field-sales-intel" />
                          <HallucinationDetector
                            content={msg.content}
                            originalPrompt={messages[i - 1]?.content ?? ''}
                            context={documents.length > 0 ? `Documents loaded: ${documents.map(d => d.filename).join(', ')}` : undefined}
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
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Analyzing sales data...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder="Ask about loaded data — prospect intelligence, competitive analysis, pipeline priorities..." rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Analyze</button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <EnhanceToCraft prompt={input} onEnhanced={setInput} disabled={streaming} pageContext="Field Sales AI — document intelligence, prospect research, competitive analysis, pipeline prioritization for HDFC retail asset sales" />
                <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Field Sales Doc Intelligence &middot; Synthetic Data Only
        </div>
      </footer>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{previewDoc.filename}</h3>
                  <p className="text-[10px] text-gray-500">
                    {previewDoc.headers ? `${previewDoc.rows?.length ?? 0} rows × ${previewDoc.headers.length} columns` : `${previewDoc.text.length.toLocaleString()} characters`}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {previewDoc.headers && previewDoc.rows ? (
                <div className="overflow-x-auto">
                  <table className="text-[11px] w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-purple-600 text-white">
                        <th className="px-3 py-2 text-left font-semibold border-r border-white/20 text-[10px]">#</th>
                        {previewDoc.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap border-r border-white/20">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewDoc.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? 'bg-white hover:bg-purple-50' : 'bg-slate-50 hover:bg-purple-50'}>
                          <td className="px-3 py-1.5 border-r border-b border-gray-200 text-gray-400 font-mono text-[9px]">{ri + 1}</td>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-1.5 border-r border-b border-gray-200 whitespace-nowrap max-w-[200px] truncate" title={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-5">
                  <pre className="text-[12px] font-mono text-gray-800 bg-slate-50 rounded-lg p-5 whitespace-pre-wrap leading-relaxed">{previewDoc.text}</pre>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-slate-50 rounded-b-xl flex items-center justify-between shrink-0">
              <span className="text-[10px] text-gray-400">Sample document · Synthetic data for demonstration</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewDoc.text);
                  }}
                  className="text-[11px] font-semibold text-gray-700 hover:text-blue-700 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white transition"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([previewDoc.text], { type: previewDoc.filename.endsWith('.csv') ? 'text/csv' : 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = previewDoc.filename; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 border border-emerald-300 rounded-md hover:bg-emerald-50 transition"
                >
                  ⬇ Download
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-[11px] font-semibold bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
