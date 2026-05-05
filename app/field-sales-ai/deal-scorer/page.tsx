'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import { DEAL_SCORER_TEMPLATES } from '@/data/field-sales-advanced';

export default function DealScorerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function loadTemplate(id: string) {
    const t = DEAL_SCORER_TEMPLATES.find(tt => tt.id === id);
    if (t) { setSelectedTemplate(id); setInput(t.template); inputRef.current?.focus(); }
  }

  async function analyze() {
    if (!input.trim() || streaming) return;
    setStreaming(true);
    setResult('');
    setScore(null);

    const systemPrompt = `You are an expert deal-scoring AI for HDFC Bank Retail Assets sales team. Analyze the deal details provided and produce a comprehensive win probability assessment.

OUTPUT FORMAT (follow exactly):

## 🎯 Deal Win Probability

<SCORE_START>[NUMBER 0-100]<SCORE_END>

### Probability Breakdown

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Customer Intent | 20% | /20 | [assessment] |
| Competitive Position | 20% | /20 | [assessment] |
| Relationship Strength | 15% | /15 | [assessment] |
| Product Fit | 15% | /15 | [assessment] |
| Decision Timeline | 15% | /15 | [assessment] |
| Blocker Severity | 15% | /15 | [assessment] |

### 🟢 Strengths (Working For You)
- [2-3 deal strengths]

### 🔴 Risks (Working Against You)
- [2-3 deal risks with specific mitigation strategies]

### 🚀 Top 3 Actions to Increase Probability
1. **[Action]** — Expected impact: +[X]% → New probability: [Y]%
2. **[Action]** — Expected impact: +[X]% → New probability: [Y]%
3. **[Action]** — Expected impact: +[X]% → New probability: [Y]%

### 📅 Recommended Next Steps (This Week)
- [ ] [Specific action 1]
- [ ] [Specific action 2]
- [ ] [Specific action 3]

### ⚡ Competitive Counter-Strategy
[Specific strategy to neutralize competitor threat based on the deal details]

### 💡 Cross-sell Opportunities
[Based on this customer profile, identify 1-2 additional HDFC products to introduce]`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Analyze this deal and provide win probability:\n\n${input}` }],
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

      const scoreMatch = assembled.match(/<SCORE_START>(\d+)<SCORE_END>/);
      if (scoreMatch) setScore(parseInt(scoreMatch[1], 10));
    } catch {} finally {
      setStreaming(false);
    }
  }

  function getScoreColor(s: number) {
    if (s >= 70) return { ring: 'text-green-500', bg: 'bg-green-50', text: 'text-green-700', label: 'Strong Deal' };
    if (s >= 45) return { ring: 'text-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Needs Work' };
    return { ring: 'text-red-500', bg: 'bg-red-50', text: 'text-red-700', label: 'At Risk' };
  }

  const displayResult = result.replace(/<SCORE_START>\d+<SCORE_END>/, '');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-indigo-800 to-violet-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Field Sales AI
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse" />
                Field Sales — Deal Win Probability
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Deal Win Probability Scorer</h1>
              <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                Paste your deal details — AI instantly scores win probability, identifies risks, and recommends specific actions to increase your odds.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>All analysis is AI-generated using synthetic scenarios. Do NOT enter real customer data.</span>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-2">Quick Templates</h3>
            <div className="flex flex-wrap gap-2">
              {DEAL_SCORER_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => loadTemplate(t.id)}
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold border transition ${selectedTemplate === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Input Panel */}
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
                <h4 className="text-[12px] font-bold text-gray-700 mb-2">Deal Details</h4>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter deal details — customer, product, amount, stage, competitor threat, key objections, relationship status..."
                  rows={14}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition font-mono"
                />
                <button
                  onClick={analyze}
                  disabled={streaming || !input.trim()}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg disabled:opacity-30 transition text-sm shadow-md"
                >
                  {streaming ? '⏳ Analyzing Deal...' : '🎯 Score This Deal'}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-3">
              {/* Score Gauge */}
              {score !== null && (
                <div className={`${getScoreColor(score).bg} border border-gray-200 rounded-xl p-5 flex items-center gap-5`}>
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        className={getScoreColor(score).ring}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 264} 264`}
                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-black ${getScoreColor(score).text}`}>{score}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-black ${getScoreColor(score).text}`}>{getScoreColor(score).label}</h3>
                    <p className="text-[11px] text-gray-600 mt-1">
                      {score >= 70 ? 'Strong position — focus on closing.' : score >= 45 ? 'Winnable with right actions. Follow AI recommendations.' : 'Significant risks. Needs strategy reset before next meeting.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Analysis */}
              {result && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 max-h-[500px] overflow-y-auto">
                  <div className="text-[12px] leading-relaxed">
                    <Markdown isStreaming={streaming}>{displayResult}</Markdown>
                  </div>
                  {!streaming && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <DownloadMenu content={displayResult} filenamePrefix="deal-score" />
                    </div>
                  )}
                </div>
              )}

              {!result && !streaming && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <div className="text-5xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-gray-700">Win Probability Score</h3>
                  <p className="text-sm text-gray-500 mt-2">Fill in deal details and click "Score This Deal" to get an instant AI assessment with actionable recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Deal Win Probability Scorer &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
