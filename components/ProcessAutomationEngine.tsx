'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import type { ProcessApp, PipelineStage } from '@/data/process-automation-config';

type PhaseState = 'selection' | 'running' | 'complete';
type StageStatus = 'pending' | 'running' | 'complete' | 'error';

interface StageResult {
  stageId: string;
  output: string;
  elapsed: number;
  status: StageStatus;
}

async function fetchDocumentText(path: string): Promise<string> {
  try {
    const res = await fetch(path);
    if (!res.ok) return `[Could not load ${path}]`;
    return await res.text();
  } catch {
    return `[Error loading ${path}]`;
  }
}

async function streamChat(
  systemPrompt: string,
  userMessage: string,
  documentTexts: { filename: string; text: string }[],
  onDelta: (text: string) => void,
  priorContext?: string,
): Promise<string> {
  const contextParts = [systemPrompt];
  if (priorContext) {
    contextParts.push(`\n\n### PRIOR STAGE OUTPUTS (use as context)\n${priorContext}`);
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: userMessage }],
      context: contextParts.join('\n'),
      promptLevel: 'L4',
      documentTexts,
    }),
  });

  if (!res.ok || !res.body) throw new Error('API request failed');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let assembled = '';

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
          if (currentEvent === 'text_delta') {
            assembled += data;
            onDelta(assembled);
          }
        } catch { /* skip malformed */ }
        currentEvent = '';
      }
    }
  }
  return assembled;
}

export default function ProcessAutomationEngine({ process }: { process: ProcessApp }) {
  const [phase, setPhase] = useState<PhaseState>('selection');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(() => new Set(process.documents.map(d => d.id)));
  const [stageResults, setStageResults] = useState<Map<string, StageResult>>(new Map());
  const [activeStageIdx, setActiveStageIdx] = useState(-1);
  const [currentOutput, setCurrentOutput] = useState('');
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const abortRef = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const allSelected = selectedDocs.size === process.documents.length;

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelectedDocs(new Set());
    else setSelectedDocs(new Set(process.documents.map(d => d.id)));
  };

  const getDeptColor = (deptId: string) => {
    return process.departments.find(d => d.id === deptId)?.color ?? '#6B7280';
  };

  const getDeptIcon = (deptId: string) => {
    return process.departments.find(d => d.id === deptId)?.icon ?? '📋';
  };

  const runPipeline = useCallback(async () => {
    if (selectedDocs.size === 0) return;
    abortRef.current = false;
    setPhase('running');
    setStageResults(new Map());
    setCurrentOutput('');
    setExecutiveSummary('');
    setActiveStageIdx(0);
    setTotalElapsed(0);

    const selectedDocList = process.documents.filter(d => selectedDocs.has(d.id));
    const docTextCache: Record<string, string> = {};

    for (const doc of selectedDocList) {
      docTextCache[doc.id] = await fetchDocumentText(doc.path);
    }

    let priorContext = '';
    const t0 = Date.now();

    for (let i = 0; i < process.stages.length; i++) {
      if (abortRef.current) break;
      const stage = process.stages[i];
      setActiveStageIdx(i);
      setCurrentOutput('');

      setStageResults(prev => {
        const next = new Map(prev);
        next.set(stage.id, { stageId: stage.id, output: '', elapsed: 0, status: 'running' });
        return next;
      });

      const stageDocIds = stage.documentIds.filter(id => selectedDocs.has(id));
      const stageDocs = stageDocIds.map(id => {
        const doc = process.documents.find(d => d.id === id)!;
        return { filename: doc.filename, text: docTextCache[doc.id] ?? '' };
      });

      const userMessage = `Execute this pipeline stage: "${stage.title}"\n\nDescription: ${stage.description}\n\nAnalyze the attached documents and produce the required outputs as specified in your instructions. Be thorough, use tables, and provide actionable insights.`;

      const stageStart = Date.now();
      try {
        const result = await streamChat(
          stage.systemPrompt,
          userMessage,
          stageDocs,
          (text) => setCurrentOutput(text),
          priorContext.slice(-8000),
        );

        const elapsed = Date.now() - stageStart;
        priorContext += `\n\n### Stage: ${stage.title}\n${result.slice(0, 3000)}`;

        setStageResults(prev => {
          const next = new Map(prev);
          next.set(stage.id, { stageId: stage.id, output: result, elapsed, status: 'complete' });
          return next;
        });
        setExpandedStages(prev => new Set(prev).add(stage.id));
      } catch {
        const elapsed = Date.now() - stageStart;
        setStageResults(prev => {
          const next = new Map(prev);
          next.set(stage.id, { stageId: stage.id, output: 'Error occurred during processing.', elapsed, status: 'error' });
          return next;
        });
      }
    }

    setTotalElapsed(Date.now() - t0);
    setActiveStageIdx(-1);
    setPhase('complete');

    setGeneratingSummary(true);
    try {
      const summaryPrompt = `You are an HDFC Retail Assets AI senior strategist. You have just completed a multi-stage process automation pipeline: "${process.title}".

Synthesize ALL stage outputs below into a crisp EXECUTIVE SUMMARY for senior leadership.

Format:
## Executive Summary — ${process.title}

### Key Findings (5-7 bullet points)
The most critical discoveries across all stages.

### Critical Actions Required
Top 5 actions requiring immediate leadership attention, with owner and timeline.

### Risk Alerts
Any critical risks identified that need escalation.

### Strategic Recommendation
One paragraph strategic recommendation for the leadership team.

IMPORTANT: All data is SYNTHETIC. Include disclaimer.`;

      const allOutputs = Array.from(stageResults.entries())
        .map(([, r]) => `### ${process.stages.find(s => s.id === r.stageId)?.title}\n${r.output.slice(0, 2000)}`)
        .join('\n\n');

      await streamChat(
        summaryPrompt,
        `Here are all stage outputs:\n\n${allOutputs}`,
        [],
        (text) => setExecutiveSummary(text),
      );
    } catch { /* summary is optional */ }
    setGeneratingSummary(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocs, process]);

  const resetPipeline = () => {
    abortRef.current = true;
    setPhase('selection');
    setStageResults(new Map());
    setActiveStageIdx(-1);
    setCurrentOutput('');
    setExecutiveSummary('');
    setExpandedStages(new Set());
  };

  const toggleStageExpand = (stageId: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId); else next.add(stageId);
      return next;
    });
  };

  const getFullReport = () => {
    let report = `# ${process.title} — Complete Report\n\n`;
    if (executiveSummary) report += `${executiveSummary}\n\n---\n\n`;
    for (const stage of process.stages) {
      const result = stageResults.get(stage.id);
      if (result) report += `## Stage: ${stage.title}\n\n${result.output}\n\n---\n\n`;
    }
    report += `\n\n*Report generated by HDFC Retail Assets Process Automation AI. All data is SYNTHETIC.*`;
    return report;
  };

  const completedCount = Array.from(stageResults.values()).filter(r => r.status === 'complete').length;
  const progressPct = process.stages.length > 0 ? Math.round((completedCount / process.stages.length) * 100) : 0;

  useEffect(() => {
    if (phase === 'running' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [currentOutput, phase]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero */}
        <section className={`bg-gradient-to-r ${process.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-6 relative">
            <Link href="/field-sales-ai/process-automation" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Process Automation Hub
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-3xl shrink-0 shadow-lg border border-white/20">
                {process.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white/90 mb-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  END-TO-END PROCESS AUTOMATION
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{process.title}</h1>
                <p className="mt-2 text-white/75 text-sm max-w-2xl leading-relaxed">{process.description}</p>
                {/* Department Flow */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {process.departments.map((dept, i) => (
                    <span key={dept.id} className="flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/20">
                        <span>{dept.icon}</span> {dept.label}
                      </span>
                      {i < process.departments.length - 1 && (
                        <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar (visible during running/complete) */}
        {phase !== 'selection' && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-gray-700">
                  {phase === 'running' ? `Processing Stage ${activeStageIdx + 1} of ${process.stages.length}...` : 'Pipeline Complete'}
                </span>
                <div className="flex items-center gap-3">
                  {totalElapsed > 0 && (
                    <span className="text-[10px] text-gray-500">Total: {(totalElapsed / 1000).toFixed(1)}s</span>
                  )}
                  <span className="text-[11px] font-bold text-gray-600">{progressPct}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${phase === 'complete' ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${phase === 'running' ? Math.max(progressPct, ((activeStageIdx) / process.stages.length) * 100 + 5) : 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">&#9888;&#65039;</span>
            <span>All analysis uses SYNTHETIC data. Do NOT enter real customer data. Subject to bank policy approval.</span>
          </div>

          {/* Pipeline Stage Indicators */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3">Pipeline Stages</h3>
            <div className="flex flex-wrap items-center gap-2">
              {process.stages.map((stage, i) => {
                const result = stageResults.get(stage.id);
                const status: StageStatus = result?.status ?? 'pending';
                const isActive = phase === 'running' && i === activeStageIdx;

                return (
                  <span key={stage.id} className="flex items-center gap-1.5">
                    <button
                      onClick={() => result && toggleStageExpand(stage.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        isActive
                          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-md animate-pulse'
                          : status === 'complete'
                            ? 'bg-green-50 border-green-300 text-green-700 cursor-pointer hover:shadow-md'
                            : status === 'error'
                              ? 'bg-red-50 border-red-300 text-red-700'
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      {status === 'complete' ? (
                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      ) : status === 'error' ? (
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      ) : isActive ? (
                        <span className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border-2 border-gray-300" />
                      )}
                      <span style={{ color: status !== 'pending' ? getDeptColor(stage.department) : undefined }}>
                        {getDeptIcon(stage.department)}
                      </span>
                      {stage.title}
                      {result?.elapsed ? (
                        <span className="text-[9px] font-normal text-gray-400 ml-1">{(result.elapsed / 1000).toFixed(1)}s</span>
                      ) : null}
                    </button>
                    {i < process.stages.length - 1 && (
                      <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* PHASE: Document Selection */}
          {phase === 'selection' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">Associated Documents</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{selectedDocs.size} of {process.documents.length} documents selected</p>
                  </div>
                  <button
                    onClick={toggleAll}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* Group docs by department */}
                {process.departments.map(dept => {
                  const deptDocs = process.documents.filter(d => d.department === dept.id);
                  if (deptDocs.length === 0) return null;
                  return (
                    <div key={dept.id} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dept.color }}>{dept.icon} {dept.label}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {deptDocs.map(doc => {
                          const isSelected = selectedDocs.has(doc.id);
                          return (
                            <label
                              key={doc.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleDoc(doc.id)}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-bold text-gray-800 truncate">{doc.label}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{doc.description}</div>
                                <div className="text-[9px] font-mono text-gray-400 mt-1 truncate">{doc.filename}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Run Button */}
              <button
                onClick={runPipeline}
                disabled={selectedDocs.size === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl disabled:opacity-30 transition-all text-[15px] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>
                Run End-to-End Process ({process.stages.length} Stages, {selectedDocs.size} Documents)
              </button>
            </div>
          )}

          {/* PHASE: Running / Complete — Stage Results */}
          {(phase === 'running' || phase === 'complete') && (
            <div className="space-y-4" ref={resultsRef}>
              {process.stages.map((stage, i) => {
                const result = stageResults.get(stage.id);
                if (!result) return null;
                const isExpanded = expandedStages.has(stage.id);
                const isActive = phase === 'running' && i === activeStageIdx;
                const displayOutput = isActive ? currentOutput : result.output;

                return (
                  <div
                    key={stage.id}
                    className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${
                      isActive ? 'border-blue-300 shadow-md' : result.status === 'complete' ? 'border-green-200' : 'border-red-200'
                    }`}
                  >
                    {/* Stage Header */}
                    <button
                      onClick={() => !isActive && toggleStageExpand(stage.id)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50/50 transition"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        {result.status === 'complete' ? (
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          </div>
                        ) : isActive ? (
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                          </div>
                        )}
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: getDeptColor(stage.department) + '18', color: getDeptColor(stage.department) }}>
                          {getDeptIcon(stage.department)} {stage.departmentLabel}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-gray-900">Stage {i + 1}: {stage.title}</div>
                        <div className="text-[10px] text-gray-500">{stage.description}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {result.elapsed > 0 && (
                          <span className="text-[10px] text-gray-400">{(result.elapsed / 1000).toFixed(1)}s</span>
                        )}
                        {!isActive && (
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        )}
                      </div>
                    </button>

                    {/* Stage Output */}
                    {(isActive || isExpanded) && displayOutput && (
                      <div className="border-t border-gray-100 px-5 py-4">
                        <div className="prose prose-sm max-w-none text-[12px] leading-relaxed">
                          <Markdown isStreaming={isActive}>{displayOutput}</Markdown>
                        </div>
                        {result.status === 'complete' && !isActive && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <DownloadMenu content={result.output} filenamePrefix={`${process.id}-stage-${i + 1}`} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Executive Summary */}
              {(executiveSummary || generatingSummary) && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl shadow-md overflow-hidden">
                  <div className="px-5 py-3.5 flex items-center gap-3 border-b border-indigo-100">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
                      {generatingSummary ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : '★'}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-indigo-900">Executive Summary</div>
                      <div className="text-[10px] text-indigo-600">AI-synthesized from all pipeline stages</div>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <div className="prose prose-sm max-w-none text-[12px] leading-relaxed">
                      <Markdown isStreaming={generatingSummary}>{executiveSummary}</Markdown>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Bar */}
              {phase === 'complete' && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3">
                  <button
                    onClick={resetPipeline}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[12px] font-bold text-gray-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                    Run Again
                  </button>
                  <DownloadMenu content={getFullReport()} filenamePrefix={`${process.id}-full-report`} />
                  <div className="flex-1" />
                  <div className="text-[11px] text-gray-400">
                    {completedCount}/{process.stages.length} stages completed &middot; {selectedDocs.size} documents analyzed &middot; {(totalElapsed / 1000).toFixed(1)}s total
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Process Automation AI &middot; {process.title} &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
