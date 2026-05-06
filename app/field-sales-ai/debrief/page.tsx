'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import HallucinationDetector from '@/components/HallucinationDetector';
import { DEBRIEF_TEMPLATES } from '@/data/field-sales-advanced';

export default function DebriefPage() {
  const [selectedType, setSelectedType] = useState<string>('first-meeting');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<'crm' | 'email' | 'analysis'>('analysis');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function generateDebrief() {
    if (!notes.trim() || streaming) return;
    setStreaming(true);
    setResult('');

    const meetingType = DEBRIEF_TEMPLATES.find(t => t.id === selectedType)?.label ?? 'Meeting';

    const systemPrompt = `You are a post-meeting AI assistant for HDFC Bank Retail Assets field sales team. The RM just came out of a "${meetingType}" and is typing quick raw notes. Transform these into structured, professional, actionable outputs.

Generate ALL of the following sections in one response:

## 📊 Meeting Analysis

### Meeting Summary
[2-3 sentence professional summary of what happened]

### Key Takeaways
| # | Insight | Implication | Action Required |
|---|---------|-------------|-----------------|
| 1 | [insight] | [what it means] | [specific action] |
| 2 | [insight] | [what it means] | [specific action] |
| 3 | [insight] | [what it means] | [specific action] |

### Customer Sentiment Assessment
- **Overall Mood:** [Positive / Neutral / Cautious / Negative]
- **Interest Level:** [High / Medium / Low] — Reason: [why]
- **Decision Timeline:** [Immediate / 1 week / 1 month / Exploring]
- **Competitor Threat Level:** [High / Medium / Low]

### Risk Flags 🚩
- [Any concerns or red flags from the meeting]

---

## 📝 CRM Update (Copy-Paste Ready)

**Meeting Date:** [Today]
**Meeting Type:** ${meetingType}
**Customer:** [Extract from notes]
**Product Discussed:** [Extract]
**Meeting Outcome:** [Extract]
**Next Action:** [Specific action with date]
**Pipeline Stage:** [Recommend stage change if applicable]
**Probability:** [Updated probability %]
**Notes:** [3-4 line professional summary]

---

## ✉️ Follow-Up Email Draft

**Subject:** [Professional subject line]

Dear [Name],

[Professional follow-up email — thank them, summarize key discussion points, confirm next steps, include a value-add (industry insight or relevant product info). Keep it warm but professional. 150-200 words max.]

Best regards,
[RM Name]
HDFC Bank — Retail Assets

---

## 🚀 Next Best Actions

### This Week (Priority Order):
1. **[Action]** — By [day] — Why: [reason]
2. **[Action]** — By [day] — Why: [reason]
3. **[Action]** — By [day] — Why: [reason]

### Cross-sell Trigger Identified:
- **Product:** [What additional product to introduce]
- **Timing:** [When to bring it up]
- **Bridge:** [How to naturally introduce it in next conversation]

### Prepare For Next Meeting:
- [ ] [Preparation item 1]
- [ ] [Preparation item 2]
- [ ] [Preparation item 3]

IMPORTANT: All data is SYNTHETIC. Generate realistic but fictional details.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Meeting type: ${meetingType}\n\nMy raw notes from the meeting:\n\n${notes}` }],
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
    } catch {} finally {
      setStreaming(false);
    }
  }

  const exampleNotes = [
    { label: 'First Meeting — Pharma Co.', text: 'Met with CFO of MedPharma Ltd today. Revenue approx 200cr. Currently with ICICI for WC limits. Unhappy with RM turnover. Interested in BL for new plant in Baddi. Also asked about payment gateway for their distributor payments. Seemed warm but said "we need to think". Competitor: ICICI offering 9.5% for 5yr. They want faster TAT. Decision likely in 2 weeks.' },
    { label: 'Objection-Heavy — Rate Discussion', text: 'Home loan discussion with Suresh K. IT professional, 25L salary. Wants 80L loan for Whitefield apartment. Has SBI offer at 8.4%. I quoted 8.55%. He pushed back hard on rate. Mentioned prepayment charges concern. Wife was supportive but husband skeptical. They want answer by Friday. Builder is pushing them to close.' },
    { label: 'Merchant Acquiring Visit', text: 'Visited Cafe Sunrise chain - 5 outlets in Koramangala/Indiranagar. Currently using PayTM POS. Frustrated with settlement taking T+3 days. Monthly txn volume ~18L across outlets. Owner Anita wants unified dashboard. Also interested in working capital loan against transaction history. She compares us with Razorpay PG for online orders.' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-cyan-700 to-teal-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Retail Assets AI
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg shrink-0 hidden sm:block">
                <Image src="/personas/persona-debrief-rm.png" alt="Debrief AI" width={56} height={56} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
                  Retail Assets AI — Post-Meeting Debrief
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Post-Meeting AI Debrief</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  Type quick meeting notes — AI generates CRM updates, follow-up emails, risk analysis & next-best-actions instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>All outputs are AI-generated from synthetic scenarios. Do NOT enter real customer data.</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-4">
            {/* Input Panel */}
            <div className="lg:col-span-2 space-y-3">
              {/* Meeting Type */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-[12px] font-bold text-gray-700 mb-2">Meeting Type</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEBRIEF_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition text-left ${selectedType === t.id ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-cyan-400'}`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Input */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-[12px] font-bold text-gray-700 mb-2">Your Raw Meeting Notes</h4>
                <textarea
                  ref={inputRef}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Type your quick notes from the meeting — customer name, what was discussed, objections raised, outcome, next steps, competitor mentions, your gut feeling..."
                  rows={8}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
                <button
                  onClick={generateDebrief}
                  disabled={streaming || !notes.trim()}
                  className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg disabled:opacity-30 transition text-sm shadow-md"
                >
                  {streaming ? '⏳ Generating Debrief...' : '📋 Generate Full Debrief'}
                </button>
              </div>

              {/* Example Notes */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="text-[11px] font-bold text-gray-600 mb-2">Try an Example:</h4>
                <div className="space-y-1.5">
                  {exampleNotes.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => { setNotes(ex.text); inputRef.current?.focus(); }}
                      className="w-full text-left text-[10px] px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-cyan-300 hover:bg-cyan-50 transition font-medium"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-3">
              {result ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex gap-1">
                    <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 rounded-lg text-[11px] font-bold transition ${activeTab === 'analysis' ? 'bg-white text-cyan-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                      📊 Full Analysis
                    </button>
                    <button onClick={() => setActiveTab('crm')} className={`px-4 py-2 rounded-lg text-[11px] font-bold transition ${activeTab === 'crm' ? 'bg-white text-cyan-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                      📝 CRM Update
                    </button>
                    <button onClick={() => setActiveTab('email')} className={`px-4 py-2 rounded-lg text-[11px] font-bold transition ${activeTab === 'email' ? 'bg-white text-cyan-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                      ✉️ Follow-up Email
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 max-h-[600px] overflow-y-auto">
                    <div className="text-[12px] leading-relaxed">
                      {activeTab === 'analysis' && <Markdown isStreaming={streaming}>{result}</Markdown>}
                      {activeTab === 'crm' && (
                        <Markdown isStreaming={streaming}>
                          {result.includes('## 📝 CRM Update') ? result.split('## 📝 CRM Update')[1]?.split('---')[0] ?? result : result}
                        </Markdown>
                      )}
                      {activeTab === 'email' && (
                        <Markdown isStreaming={streaming}>
                          {result.includes('## ✉️ Follow-Up Email') ? result.split('## ✉️ Follow-Up Email')[1]?.split('---')[0] ?? result : result}
                        </Markdown>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  {!streaming && (
                    <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <DownloadMenu content={result} filenamePrefix="meeting-debrief" />
                        <button
                          onClick={() => { navigator.clipboard.writeText(result); }}
                          className="text-[11px] font-semibold text-gray-700 hover:text-cyan-700 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white transition"
                        >
                          📋 Copy All
                        </button>
                      </div>
                      <HallucinationDetector
                        content={result}
                        originalPrompt={notes}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center h-full flex flex-col items-center justify-center">
                  <div className="text-5xl mb-3">📋</div>
                  <h3 className="text-lg font-bold text-gray-700">Post-Meeting Debrief</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-md">
                    Type your raw meeting notes on the left. AI will generate a complete debrief with CRM update, follow-up email, risk analysis, and next actions.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-lg mb-1">📝</p>
                      <p className="text-[9px] font-bold text-gray-600">CRM Update</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-lg mb-1">✉️</p>
                      <p className="text-[9px] font-bold text-gray-600">Follow-up Email</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-lg mb-1">🚀</p>
                      <p className="text-[9px] font-bold text-gray-600">Next Actions</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Post-Meeting Debrief AI &middot; Synthetic Data Only
        </div>
      </footer>
    </>
  );
}
