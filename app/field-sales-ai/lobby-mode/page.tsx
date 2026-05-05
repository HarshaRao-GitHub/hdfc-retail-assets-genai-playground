'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import HallucinationDetector from '@/components/HallucinationDetector';
import { LOBBY_MODE_SCENARIOS } from '@/data/field-sales-advanced';

export default function LobbyModePage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function generateBrief(scenarioId?: string) {
    const scenario = scenarioId ? LOBBY_MODE_SCENARIOS.find(s => s.id === scenarioId) : null;
    let briefingRequest = '';

    if (scenario && scenario.id !== 'custom') {
      briefingRequest = `I'm about to walk into a meeting with a ${scenario.company_type} in the ${scenario.industry} sector. They're potentially interested in ${scenario.product}. Give me my 60-second lobby briefing.`;
      setSelectedScenario(scenario.id);
    } else {
      if (!customInput.trim()) return;
      briefingRequest = customInput.trim();
      setSelectedScenario('custom');
    }

    setStreaming(true);
    setResult('');
    setGenerationTime(null);
    const startTime = Date.now();

    const systemPrompt = `You are a real-time sales intelligence AI for HDFC Bank Retail Assets. The RM is literally sitting in a client's lobby about to walk into a meeting. Generate a RAPID, ACTIONABLE briefing card.

FORMAT (use exactly this structure with clear sections):

## ⚡ 60-Second Lobby Briefing

### 🏢 Company Snapshot
| Key | Intel |
|-----|-------|
| Industry | [sector + sub-sector] |
| Est. Revenue | [range or estimate] |
| Key Trends | [2-3 industry trends affecting them NOW] |
| Banking Needs | [likely financial products they'd need] |

### 🎯 Your Opening (First 30 Seconds)
> "[Exact opening line they should say — personalized, industry-aware, non-generic]"

### 💡 3 Talking Points (Most → Least Important)
1. **[Point]** — [Why it matters to THIS client + which HDFC product maps to it]
2. **[Point]** — [Why it matters + product mapping]
3. **[Point]** — [Cross-sell angle]

### ⚔️ Competitor Watch
- Most likely competitor: **[Name]** — Their pitch: [what they'd offer]
- Your counter: [specific HDFC advantage for this client]

### 🗣️ Likely Objections & Quick Responses
| They'll Say | You Say |
|-------------|---------|
| "[Objection 1]" | "[2-line counter]" |
| "[Objection 2]" | "[2-line counter]" |

### 📋 Before You Walk In — Checklist
- [ ] [Mental prep item 1]
- [ ] [Mental prep item 2]
- [ ] [Body language / rapport tip]

### 🎪 Wow Factor — Industry Insight to Drop
> "[A specific industry stat or trend that will make you look hyper-prepared]"

Keep it PUNCHY. This person has 60 seconds to read this. No fluff.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: briefingRequest }],
          context: systemPrompt,
          promptLevel: 'L4'
        })
      });
      if (!res.ok || !res.body) { setStreaming(false); return; }
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
          if (line.startsWith('event: ')) currentEvent = line.slice(7).trim();
          else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (currentEvent === 'text_delta') { assembled += data; setResult(assembled); }
            } catch {}
            currentEvent = '';
          }
        }
      }
      setResult(assembled);
      setGenerationTime(Math.round((Date.now() - startTime) / 1000));
    } catch {} finally {
      setStreaming(false);
    }
  }

  function reset() {
    setSelectedScenario(null);
    setResult('');
    setCustomInput('');
    setGenerationTime(null);
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-orange-600 to-amber-500 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Field Sales AI
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                  Field Sales — Lobby Mode
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">60-Second Lobby Briefing</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  You&apos;re in the lobby, meeting starts in 60 seconds. One click = instant briefing with company intel, talking points, objection counters & opening lines.
                </p>
              </div>
              {result && <button onClick={reset} className="text-sm text-white/80 hover:text-white border border-white/30 px-4 py-2 rounded-lg font-medium transition">New Briefing</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          {!result && !streaming ? (
            <>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">🏢</div>
                <h2 className="text-xl font-black text-gray-900">You&apos;re in the lobby. Meeting in 60 seconds.</h2>
                <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">Select a scenario below or type your own — AI generates an instant briefing card you can read before walking in.</p>
              </div>

              {/* Quick Scenarios */}
              <div>
                <h3 className="text-[13px] font-bold text-gray-800 mb-3">One-Click Scenarios</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {LOBBY_MODE_SCENARIOS.filter(s => s.id !== 'custom').map(s => (
                    <button
                      key={s.id}
                      onClick={() => generateBrief(s.id)}
                      className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-lg transition group"
                    >
                      <p className="text-[9px] text-orange-600 font-bold uppercase tracking-wider">{s.industry}</p>
                      <h4 className="text-[12px] font-bold text-gray-900 mt-1 group-hover:text-orange-700 transition">{s.label}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">{s.product}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md">
                <h3 className="text-[13px] font-bold text-gray-800 mb-2">Or describe your meeting:</h3>
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') generateBrief(); }}
                    placeholder="e.g. Meeting a textile manufacturer in Surat for ₹3 Cr business loan, they're currently with Axis Bank..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                  <button
                    onClick={() => generateBrief()}
                    disabled={!customInput.trim()}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md whitespace-nowrap"
                  >
                    ⚡ Generate Brief
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              {/* Timer Badge */}
              {generationTime !== null && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-[11px] font-bold">
                    ⚡ Generated in {generationTime}s
                  </span>
                  <span className="text-[10px] text-gray-400">Ready to use — read before walking in</span>
                </div>
              )}

              {/* Briefing Output */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="prose prose-sm max-w-none text-[13px] leading-relaxed">
                  <Markdown isStreaming={streaming}>{result}</Markdown>
                </div>
                {!streaming && result && (
                  <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <DownloadMenu content={result} filenamePrefix="lobby-briefing" />
                      <button onClick={reset} className="text-[11px] font-semibold text-orange-700 hover:text-orange-900 px-3 py-1.5 border border-orange-300 rounded-md hover:bg-orange-50 transition">
                        New Briefing
                      </button>
                    </div>
                    <HallucinationDetector
                      content={result}
                      originalPrompt={selectedScenario === 'custom' ? customInput : `Lobby briefing for ${LOBBY_MODE_SCENARIOS.find(s => s.id === selectedScenario)?.label ?? 'scenario'}`}
                    />
                  </div>
                )}
              </div>

              {streaming && (
                <div className="flex items-center gap-2 mt-3 justify-center">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] text-gray-500 font-medium">Generating your briefing...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Lobby Mode 60-Second Briefing &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
