'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import type { Stage } from '@/data/hdfc-agents-config';
import Markdown from './Markdown';
import HdfcApprovalPanel from './HdfcApprovalPanel';
import type { HitlEvent } from './HdfcApprovalPanel';
import { useHdfcWorkflow } from './HdfcWorkflowContext';
import { getStageResult, saveStageResult, getUpstreamResults } from '@/lib/hdfc-client-store';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }
interface UploadedFile { filename: string; text: string; truncated: boolean; }
interface ToolEvent { type: 'start' | 'result'; tool: string; input?: Record<string, unknown>; result?: string; timestamp: number; }
interface UsageStats { input_tokens?: number; output_tokens?: number; total_tokens?: number; tool_calls?: number; api_turns?: number; model?: string; response_time_s?: number; estimated_cost_usd?: number; }

function computeProgress(events: ToolEvent[], total: number, textStarted: boolean, streaming: boolean) {
  if (!streaming && events.length === 0) return 0;
  const completedTools = events.filter(e => e.type === 'result').length;
  const toolPct = total > 0 ? (completedTools / total) * 70 : 0;
  const textPct = textStarted ? 25 : 0;
  const donePct = !streaming && textStarted ? 5 : 0;
  return Math.min(Math.round(toolPct + textPct + donePct), 100);
}

export default function HdfcAgentChat({ stage }: { stage: Stage }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<'live' | null>(null);
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>([]);
  const [textStreamStarted, setTextStreamStarted] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [elapsedTimer, setElapsedTimer] = useState(0);
  const [hitlEvent, setHitlEvent] = useState<HitlEvent | null>(null);
  const [hitlDecision, setHitlDecision] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [showDataPanel, setShowDataPanel] = useState(true);
  const [showToolPanel, setShowToolPanel] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const { refresh: refreshWorkflow } = useHdfcWorkflow();

  const transcript: ChatMessage[] =
    streaming && streamBuffer
      ? [...messages, { role: 'assistant', content: streamBuffer }]
      : messages;

  const totalTools = stage.tools.length;
  const progress = computeProgress(toolEvents, totalTools, textStreamStarted, streaming);

  useEffect(() => {
    if (restored) return;
    try {
      const saved = getStageResult(stage.slug);
      if (saved) {
        setMessages(saved.messages ?? []);
        setToolEvents(saved.toolEvents ?? []);
        setUsageStats(saved.usageStats as UsageStats | null);
        setHitlEvent(saved.hitlEvent as HitlEvent | null);
        setHitlDecision(saved.hitlDecision ?? null);
        setMode(saved.mode ?? null);
        if (saved.messages?.length > 0) setTextStreamStarted(true);
      }
    } catch { /* no saved state */ }
    setRestored(true);
  }, [stage.slug, restored]);

  const persistResult = useCallback(() => {
    try {
      saveStageResult({
        slug: stage.slug,
        stageNumber: stage.number,
        messages,
        toolEvents,
        usageStats: usageStats as Record<string, unknown> | null,
        hitlEvent: hitlEvent as Record<string, unknown> | null,
        hitlDecision,
        mode,
        completedAt: new Date().toISOString(),
      });
      refreshWorkflow();
    } catch { /* fail silently */ }
  }, [stage.slug, stage.number, messages, toolEvents, usageStats, hitlEvent, hitlDecision, mode, refreshWorkflow]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');
    setToolEvents([]);
    setTextStreamStarted(false);
    setUsageStats(null);
    setElapsedTimer(0);
    setHitlEvent(null);
    setHitlDecision(null);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTimer(parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(1)));
    }, 100);

    try {
      const upstreamResults = getUpstreamResults(stage.slug);
      const res = await fetch('/api/hdfc-agentic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: stage.slug,
          messages: next,
          uploadedTexts: uploadedFiles.map(f => ({ filename: f.filename, text: f.text })),
          ...(upstreamResults.length > 0 ? { upstreamResults } : {}),
        })
      });

      const headerMode = res.headers.get('X-Workbench-Mode');
      if (headerMode === 'live') setMode('live');

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => 'Request failed');
        setMessages([...next, { role: 'assistant', content: `*Error: ${errText}*` }]);
        return;
      }

      await readSSE(res.body, next);
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `*Network error: ${err instanceof Error ? err.message : 'unknown'}*` }]);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setTimeout(() => persistResult(), 500);
    }
  }

  async function readSSE(body: ReadableStream<Uint8Array>, prev: ChatMessage[]) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assembled = '';

    const flushStream = () => { setStreamBuffer(assembled); streamThrottleRef.current = 0; };

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
              case 'tool_start':
                setToolEvents((prev) => [...prev, { type: 'start', tool: data.tool, input: data.input, timestamp: Date.now() }]);
                break;
              case 'tool_result':
                setToolEvents((prev) => [...prev, { type: 'result', tool: data.tool, result: data.result, timestamp: Date.now() }]);
                break;
              case 'text_delta':
                if (!assembled) setTextStreamStarted(true);
                assembled += data;
                if (!streamThrottleRef.current) {
                  streamThrottleRef.current = requestAnimationFrame(flushStream);
                }
                break;
              case 'usage':
              case 'usage_delta':
                setUsageStats(data as UsageStats);
                break;
              case 'hitl_required':
                setHitlEvent(data as HitlEvent);
                break;
              case 'error':
                assembled += `\n\n*Error: ${data?.message ?? 'Unknown error'}*`;
                setStreamBuffer(assembled);
                break;
              case 'done':
                break;
            }
          } catch { /* skip */ }
          currentEvent = '';
        }
      }
    }
    if (streamThrottleRef.current) cancelAnimationFrame(streamThrottleRef.current);
    setMessages([...prev, { role: 'assistant', content: assembled }]);
  }

  function reset() {
    setMessages([]);
    setStreamBuffer('');
    setToolEvents([]);
    setTextStreamStarted(false);
    setUsageStats(null);
    setElapsedTimer(0);
    setUploadedFiles([]);
    setUploadError(null);
    setHitlEvent(null);
    setHitlDecision(null);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploadError(null);
    const newFiles: UploadedFile[] = [];
    for (const file of Array.from(files).slice(0, 5)) {
      try {
        const text = await file.text();
        const MAX = 100000;
        newFiles.push({ filename: file.name, text: text.slice(0, MAX), truncated: text.length > MAX });
      } catch { setUploadError(`Failed to read ${file.name}`); }
    }
    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const hasPriorRun = messages.length > 0 && !streaming;
  const isFollowUp = hasPriorRun;
  const lastAssistant = messages.filter(m => m.role === 'assistant').pop()?.content || '';

  return (
    <div className="space-y-4">
      {/* ─── Section A: Data Backbone Panel ─── */}
      <CollapsibleSection title="Data Backbone" icon="📊" defaultOpen={showDataPanel} onToggle={() => setShowDataPanel(!showDataPanel)} badge={`${stage.dataSources.length} files`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stage.dataSources.map((ds) => (
            <div key={ds.file} className="bg-white rounded-lg border border-slate-200 p-3 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📄</span>
                <span className="text-[11px] font-semibold text-slate-700 truncate">{ds.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-1">{ds.description}</p>
              <div className="flex items-center gap-2 text-[9px] text-slate-400">
                <span>{ds.folder}/</span>
                <span>~{ds.rowEstimate} rows</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* ─── Section B: Upload Panel ─── */}
      <CollapsibleSection title="Upload Additional Documents" icon="📎" defaultOpen={false} badge={uploadedFiles.length > 0 ? `${uploadedFiles.length} uploaded` : undefined}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" multiple accept=".csv,.txt,.json,.pdf" onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
              + Upload Files
            </button>
            <span className="text-[11px] text-slate-400">CSV, TXT, JSON (max 5 per batch, 10 total)</span>
          </div>
          {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                  <span className="text-[11px] text-slate-700">{f.filename}</span>
                  {f.truncated && <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 rounded">truncated</span>}
                  <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 text-xs">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ─── Section D: Tool Execution Timeline ─── */}
      {toolEvents.length > 0 && (
        <CollapsibleSection title="Tool Execution Timeline" icon="⚡" defaultOpen={showToolPanel} onToggle={() => setShowToolPanel(!showToolPanel)} badge={`${toolEvents.filter(e => e.type === 'result').length}/${totalTools} completed`}>
          <div className="space-y-2">
            {stage.tools.map((tool) => {
              const starts = toolEvents.filter(e => e.type === 'start' && e.tool === tool.name);
              const results = toolEvents.filter(e => e.type === 'result' && e.tool === tool.name);
              const isRunning = starts.length > results.length;
              const isDone = results.length > 0;
              const lastResult = results[results.length - 1];
              const isExpanded = expandedTool === tool.name;

              return (
                <div key={tool.name} className={`rounded-lg border transition-colors ${isDone ? 'border-emerald-200 bg-emerald-50/30' : isRunning ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
                  <button onClick={() => setExpandedTool(isExpanded ? null : tool.name)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left">
                    <span className="text-lg">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-slate-700">{tool.label}</span>
                        {isRunning && <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                        {isDone && <span className="text-emerald-600 text-xs">✓</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{tool.description}</p>
                    </div>
                    {isDone && (
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    )}
                  </button>
                  {isExpanded && lastResult?.result && (
                    <div className="px-4 pb-3 border-t border-slate-200">
                      <pre className="text-[10px] text-slate-600 bg-slate-50 rounded-lg p-3 overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                        {(() => { try { return JSON.stringify(JSON.parse(lastResult.result), null, 2); } catch { return lastResult.result; } })()}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* ─── Progress Bar ─── */}
      {streaming && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px] font-semibold text-blue-700">
                {textStreamStarted ? 'Agent writing final report...' : `Executing tools (${toolEvents.filter(e => e.type === 'result').length}/${totalTools})...`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ─── Section E: Usage Metrics ─── */}
      {(usageStats || streaming) && (
        <UsageCard stats={usageStats} elapsed={elapsedTimer} streaming={streaming} toolCount={toolEvents.filter(e => e.type === 'result').length} />
      )}

      {/* ─── Section C: Chat / Streaming Output ─── */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center gap-3">
          <Image src={stage.agentAvatar} alt={stage.agent.name} width={36} height={36} className="rounded-full border-2 border-white/30" />
          <div className="flex-1">
            <h3 className="text-white font-bold text-[14px]">{stage.agent.name}</h3>
            <p className="text-white/70 text-[10px]">{stage.agent.shortId} · Stage {stage.number}</p>
          </div>
          {mode === 'live' && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">LIVE</span>}
          {hasPriorRun && (
            <button onClick={reset} className="px-3 py-1 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 text-[11px] font-medium transition">
              Reset
            </button>
          )}
        </div>

        <div ref={streamRef} className="p-5 min-h-[200px] max-h-[600px] overflow-y-auto space-y-4">
          {transcript.length === 0 && !streaming && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">{stage.icon}</div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">{stage.title}</h3>
              <p className="text-[13px] text-slate-500 mb-4 max-w-lg mx-auto">{stage.agent.description}</p>
              <p className="text-[11px] text-slate-400 mb-6">This agent uses {totalTools} tools backed by {stage.dataSources.length} data sources.</p>
              <button
                onClick={() => send(stage.starterPrompt)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-sm"
              >
                Run {stage.agent.name}
              </button>
              <p className="text-[10px] text-slate-400 mt-3 max-w-md mx-auto italic">&quot;{stage.starterPrompt.slice(0, 100)}...&quot;</p>
            </div>
          )}

          {transcript.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} streaming={streaming && i === transcript.length - 1 && msg.role === 'assistant'} agentName={stage.agent.name} />
          ))}
        </div>

        {/* ─── Section F: HITL Approval ─── */}
        {hitlEvent && !hitlDecision && (
          <div className="border-t border-slate-200 p-4">
            <HdfcApprovalPanel
              hitl={hitlEvent}
              stageSlug={stage.slug}
              originalResult={lastAssistant}
              onDecision={(decision, detail) => {
                setHitlDecision(detail);
                setTimeout(() => persistResult(), 300);
              }}
              onModifiedResult={(content) => {
                setMessages(prev => [...prev, { role: 'assistant', content }]);
              }}
            />
          </div>
        )}

        {hitlDecision && (
          <div className="border-t border-slate-200 p-4 bg-emerald-50/50">
            <div className="flex items-center gap-2 text-emerald-700 text-[12px] font-semibold">
              <span>✓</span> {hitlDecision}
            </div>
          </div>
        )}

        {/* Follow-up input */}
        {(hasPriorRun || messages.length === 0) && !streaming && (
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={isFollowUp ? 'Ask a follow-up question...' : 'Type your question or press the button above to start...'}
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isFollowUp ? 'Follow Up' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Collapsible Section ───

function CollapsibleSection({ title, icon, children, defaultOpen = true, onToggle, badge }: {
  title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean; onToggle?: () => void; badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => { setOpen(!open); onToggle?.(); }}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-[13px] font-semibold text-slate-700">{title}</span>
          {badge && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

// ─── Usage Card ───

function UsageCard({ stats, elapsed, streaming: isActive, toolCount }: { stats: UsageStats | null; elapsed: number; streaming: boolean; toolCount: number }) {
  const fmt = (n: number) => n.toLocaleString();
  const displayTime = stats?.response_time_s ?? elapsed;
  const modelDisplay = stats?.model ? stats.model.replace(/claude-opus-4-7/gi, 'Enterprise LLM').replace(/claude/gi, 'Enterprise') : '—';

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 overflow-hidden">
      <div className="px-5 py-2.5 border-b border-slate-200 bg-white/60 flex items-center gap-2">
        <span className="text-sm">📈</span>
        <span className="text-[12px] font-semibold text-slate-700">Usage Metrics</span>
        {isActive && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
      </div>
      <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCell label="Response Time" value={`${displayTime.toFixed(1)}s`} active={isActive} />
        <MetricCell label="Model" value={modelDisplay} />
        <MetricCell label="Input Tokens" value={stats?.input_tokens ? fmt(stats.input_tokens) : '—'} />
        <MetricCell label="Output Tokens" value={stats?.output_tokens ? fmt(stats.output_tokens) : '—'} />
        <MetricCell label="Tool Calls" value={String(stats?.tool_calls ?? toolCount)} />
        <MetricCell label="Est. Cost" value={stats?.estimated_cost_usd ? `$${stats.estimated_cost_usd.toFixed(4)}` : '—'} />
      </div>
    </div>
  );
}

function MetricCell({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-[9px] font-mono uppercase text-slate-400 mb-0.5">{label}</div>
      <div className={`text-[13px] font-bold ${active ? 'text-blue-600 animate-pulse' : 'text-slate-700'}`}>{value}</div>
    </div>
  );
}

// ─── Message Bubble ───

function MessageBubble({ role, content, streaming: isStreaming, agentName }: { role: Role; content: string; streaming?: boolean; agentName?: string }) {
  const [copied, setCopied] = useState(false);

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-full w-full relative group">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-blue-600">{agentName || 'Agent'}</span>
          {isStreaming && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
        </div>
        <div className="prose prose-sm max-w-none text-[13px] text-slate-700 prose-headings:text-slate-800 prose-headings:font-bold prose-p:leading-relaxed">
          <Markdown>{content}</Markdown>
        </div>
        {!isStreaming && content && (
          <button
            onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded bg-white border border-slate-200 text-[10px] text-slate-500 hover:text-blue-600"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}
