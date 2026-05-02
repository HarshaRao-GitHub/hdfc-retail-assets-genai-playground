'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import { saveChatHistory, loadChatHistory, clearChatHistory, CHAT_KEYS } from '@/lib/chat-history';

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

const DOC_SCENARIOS = [
  {
    title: 'Analyze Sanction Letter',
    icon: '📑',
    prompt: 'Review this synthetic sanction letter summary and flag red flags:\n\nLoan Amount: INR 75,00,000\nProperty Value: INR 85,00,000 (LTV: 88.2%)\nApplicant Age: 58 years (retiring in 2 years)\nCo-applicant: Listed but no income documents provided\nEMI-to-Income Ratio: 62%\nProperty: Under-construction, 3BHK in Sector 150, Noida\nRERA Registration: Not mentioned in documents\nEmployer: Small private company (50 employees)\nCIBIL Score: 702\n\nList all compliance risks with severity (High/Medium/Low), the specific regulation or policy they violate, and recommended actions for each.'
  },
  {
    title: 'Extract from Bank Statement',
    icon: '🏦',
    prompt: 'Analyze this synthetic bank statement summary for a home loan applicant:\n\nAccount: Savings Account, SBI, opened 5 years ago\nAvg Monthly Balance: INR 1,85,000\nSalary Credit: INR 1,50,000 (consistent for 18 months, from "TCS Ltd")\nHighest Balance: INR 8,50,000 (Dec - bonus month)\nLowest Balance: INR 12,500 (March)\nEMI Debits: INR 15,000 (car loan), INR 8,000 (personal loan)\nBounced Cheques: 2 in last 12 months (both reversed same day)\nLarge Cash Deposits: INR 3,00,000 in October (no source noted)\nUPI Transactions: 150+ per month\n\nExtract: income assessment, expense pattern, risk flags, and a recommendation on loan eligibility for INR 60 lakhs home loan. Present as a structured credit assessment report.'
  },
  {
    title: 'ITR Income Assessment',
    icon: '📊',
    prompt: 'Analyze this synthetic ITR summary for a self-employed home loan applicant:\n\nITR Type: ITR-4 (Presumptive Income)\nBusiness: Retail garment shop, 12 years vintage\nFY23-24 Gross Revenue: INR 1.2 Cr\nFY23-24 Net Profit (declared): INR 9.6 lakhs (8% of turnover)\nFY22-23 Net Profit: INR 8.1 lakhs\nFY21-22 Net Profit: INR 7.2 lakhs\nGST Registration: Active, monthly filing\nBank Statement shows avg deposits of INR 15 lakhs/month\n\nAssess: actual estimated income vs declared income, comment on the gap, determine eligible loan amount using both bank-statement and ITR methods, and flag any concerns. Format as an income assessment report.'
  },
  {
    title: 'Property Document Check',
    icon: '🏘️',
    prompt: 'Review this synthetic property document summary:\n\nProperty: 3BHK flat, Wing A, Floor 12, Prestige Lakeside, Bangalore\nSale Deed: Registered March 2024, stamp duty paid INR 3,60,000\nPrevious Owner: Mr. Suresh Reddy (purchased in 2019 from builder)\nBuilder: Prestige Group (listed developer)\nOC/CC: Completion Certificate received 2023\nEncumbrance Certificate: Shows clear title for last 15 years\nKhata: A-Khata available\nSociety: Registered under Karnataka Cooperative Societies Act\nOne concern: Power of Attorney sale in 2019 from builder to previous owner (not direct sale deed)\n\nAnalyze: Is the title chain clean? What risks does the POA sale introduce? What additional documents should we request? Rate overall property risk as Low/Medium/High with justification.'
  },
  {
    title: 'Customer Email to Action Items',
    icon: '📧',
    prompt: 'Convert this customer email into structured action items:\n\n"Dear Sir/Madam,\n\nI am writing regarding my home loan account HL/WR/2023/45678.\n\nFirstly, I want to know my current outstanding balance and how much I have paid so far. I also want a complete amortization schedule.\n\nSecondly, I am planning to prepay INR 5 lakhs. Please tell me the impact on my EMI and remaining tenure. Should I reduce EMI or reduce tenure?\n\nThirdly, my interest rate seems higher than what new customers are getting. Can I get a rate review or switch to RLLR?\n\nAlso, please send me the interest certificate for tax purposes for FY 2024-25.\n\nRegards,\nRamesh Kumar\nMobile: 98765XXXXX"\n\nExtract: customer details, each request as a separate action item with SLA, department routing, and draft response for each request.'
  },
  {
    title: 'Meeting Minutes to Tracker',
    icon: '📝',
    prompt: 'Convert this meeting transcript into a structured action tracker:\n\n"Credit committee meeting - Jan 15th. Present: Sunil (Chair), Rekha (Credit), Amit (Risk), Priya (Operations).\n\nDiscussed NPA account of Mr. Sharma - outstanding 82L, property in Gurgaon now worth only 60L due to market dip. Amit suggested restructuring with 12-month moratorium. Rekha disagrees, wants to initiate SARFAESI. Sunil asked both to prepare a cost-benefit analysis by Jan 20th.\n\nBulk approval of 15 Bangalore accounts total 12Cr - all within policy, approved unanimously.\n\nNew policy on digital verification of income - Priya to draft SOP by Feb 1st. Need pilot in 3 branches first.\n\nSBI rate cut impact - losing 8% of pipeline to SBI in West. Need competitive response by Jan 18th. Sunil to escalate to NSH."\n\nGenerate: Decisions table, Action items table (with owner, due date, priority), Risks flagged, Follow-ups for next meeting.'
  },
];

export default function DocIntelligencePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transcript: ChatMessage[] = streaming && streamBuffer ? [...messages, { role: 'assistant', content: streamBuffer }] : messages;

  useEffect(() => {
    const saved = loadChatHistory(CHAT_KEYS.DOC_INTELLIGENCE);
    if (saved.length > 0) setMessages(saved);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !streaming) saveChatHistory(CHAT_KEYS.DOC_INTELLIGENCE, messages);
  }, [messages, streaming]);

  const scrollToBottom = useCallback(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next); setInput(''); setStreaming(true); setStreamBuffer('');
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          promptLevel: 'L3',
          context: 'This is the Document Intelligence module. Focus on mortgage document analysis — sanction letters, bank statements, ITRs, property documents, KYC verification, and extracting structured information from unstructured text. Always present findings in tables with risk flags.'
        })
      });
      if (!res.ok || !res.body) {
        setMessages([...next, { role: 'assistant', content: `*Error: ${await res.text().catch(() => 'Failed')}*` }]);
        setStreaming(false); return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '', assembled = '';
      const flush = () => { setStreamBuffer(assembled); streamThrottleRef.current = 0; scrollToBottom(); };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        let evt = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) evt = line.slice(7).trim();
          else if (line.startsWith('data: ')) {
            try {
              const d = JSON.parse(line.slice(6));
              if (evt === 'text_delta') { assembled += d; if (!streamThrottleRef.current) streamThrottleRef.current = requestAnimationFrame(flush); }
              else if (evt === 'error') { assembled += `\n\n*Error: ${d.message}*`; setStreamBuffer(assembled); }
            } catch {}
            evt = '';
          }
        }
      }
      if (streamThrottleRef.current) cancelAnimationFrame(streamThrottleRef.current);
      setMessages([...next, { role: 'assistant', content: assembled }]);
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: `*Error: ${err instanceof Error ? err.message : 'unknown'}*` }]);
    } finally { setStreaming(false); setStreamBuffer(''); }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-hdfc-blueDeep to-hdfc-blueBright border-b">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                  Document Intelligence — Extended Session
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Mortgage Document Intelligence</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl">Process mortgage documents in plain English. Analyze sanction letters, bank statements, ITRs, property docs — get instant structured reports.</p>
              </div>
              {messages.length > 0 && <button onClick={() => { setMessages([]); setStreamBuffer(''); setInput(''); clearChatHistory(CHAT_KEYS.DOC_INTELLIGENCE); }} disabled={streaming} className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40">Clear</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span>⚠️</span><span>All documents shown are synthetic examples. Do NOT upload or paste actual customer documents.</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOC_SCENARIOS.map((sc, i) => (
              <button key={i} onClick={() => { setInput(sc.prompt); inputRef.current?.focus(); }} className="text-left group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition">
                <div className="text-2xl mb-2">{sc.icon}</div>
                <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-hdfc-blue transition">{sc.title}</h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{sc.prompt.slice(0, 90)}...</p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 && !streaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-5xl mb-3">📄</div>
                  <h3 className="text-lg font-bold text-gray-800">Document Intelligence</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-2">Select a document scenario above or paste your own synthetic document text. AI will extract, analyze, and flag issues.</p>
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-hdfc-blue to-hdfc-blueBright text-white rounded-2xl rounded-tr-md px-5 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="max-w-[95%] w-full bg-slate-50 border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-hdfc-blue rounded-full" /><span className="text-xs font-bold text-hdfc-blue uppercase tracking-wider">Doc Intelligence AI</span></div>
                      <Markdown isStreaming={streaming && i === transcript.length - 1}>{msg.content}</Markdown>
                      {!streaming && msg.content && <div className="mt-3 pt-2.5 border-t border-gray-200"><DownloadMenu content={msg.content} filenamePrefix="hdfc-doc-analysis" /></div>}
                    </div>
                  )}
                </div>
              ))}
              {streaming && !streamBuffer && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" /><span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-hdfc-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Analyzing document...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }} placeholder="Paste a synthetic document or ask a document analysis question..." rows={3} disabled={streaming} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 resize-y focus:outline-none focus:border-hdfc-blue focus:ring-2 focus:ring-hdfc-blue/20 disabled:opacity-40 transition shadow-sm" />
                <button onClick={() => send()} disabled={streaming || !input.trim()} className="bg-hdfc-blue hover:bg-hdfc-blueDeep text-white font-semibold px-6 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Analyze</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-hdfc-line bg-white"><div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">HDFC Retail Assets GenAI Playground &middot; Document Intelligence &middot; Synthetic Data Only</div></footer>
    </>
  );
}
