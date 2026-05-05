'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import { useDocuments } from '@/lib/document-context';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';
import { FIELD_SALES_DOC_CATEGORIES, FIELD_SALES_DOC_OPERATIONS } from '@/data/field-sales-doc-config';
import { FIELD_SALES_DISCLAIMER } from '@/data/field-sales-prompts';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

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
      addDocument({ filename, text, images: [], source: 'sample' });
    } catch (e) {
      console.error('Failed to load sample:', e);
    } finally {
      setLoadingSample(null);
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

    const operation = FIELD_SALES_DOC_OPERATIONS.find(op => op.id === selectedOperation);
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

  const activeOperation = FIELD_SALES_DOC_OPERATIONS.find(op => op.id === selectedOperation);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-purple-800 to-purple-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
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

          {/* Operations Selection */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-2">Select Analysis Operation</h3>
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

          {/* Active Operation Starter Prompts */}
          {activeOperation && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-[11px] text-purple-700 font-medium mb-2">{activeOperation.description}</p>
              <div className="flex flex-wrap gap-2">
                {activeOperation.starterPrompts.map((sp, i) => (
                  <button key={i} onClick={() => { setInput(sp); inputRef.current?.focus(); }} className="text-[10px] bg-white border border-purple-200 text-purple-800 px-3 py-1.5 rounded-md hover:bg-purple-100 transition font-medium">
                    {sp}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  <div className="space-y-1.5">
                    {cat.sampleFiles.map(file => (
                      <button
                        key={file.filename}
                        onClick={() => loadSampleFile(file.path, file.filename)}
                        disabled={!!loadingSample || documents.some(d => d.filename === file.filename)}
                        className={`w-full text-left text-[10px] px-2.5 py-1.5 rounded border transition ${documents.some(d => d.filename === file.filename) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200'}`}
                      >
                        {loadingSample === file.filename ? '⏳ Loading...' : documents.some(d => d.filename === file.filename) ? `✓ ${file.label}` : `+ ${file.label}`}
                      </button>
                    ))}
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
              <p className="text-[10px] text-gray-400 font-mono mt-2 text-right">Ctrl/Cmd + Enter to send</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Field Sales Doc Intelligence &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
