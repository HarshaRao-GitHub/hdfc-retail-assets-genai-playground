'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Markdown from '@/components/Markdown';
import DownloadMenu from '@/components/DownloadMenu';
import { ROLE_PLAY_PERSONAS } from '@/data/field-sales-advanced';

const PERSONA_AVATARS: Record<string, string> = {
  'skeptical-cfo': '/personas/persona-rajesh-mehta.png',
  'busy-entrepreneur': '/personas/persona-priya-sharma.png',
  'price-shopper': '/personas/persona-amit-patel.png',
  'farmer-landowner': '/personas/persona-harinder-singh.png',
  'fleet-owner': '/personas/persona-suresh-reddy.png',
  'merchant-owner': '/personas/persona-kavita-desai.png',
};

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string; }

export default function RolePlayPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [scoreVisible, setScoreVisible] = useState(false);
  const [scoreData, setScoreData] = useState<string>('');
  const [scoringInProgress, setScoringInProgress] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamThrottleRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const persona = ROLE_PLAY_PERSONAS.find(p => p.id === selectedPersona);
  const transcript: ChatMessage[] = streaming && streamBuffer ? [...messages, { role: 'assistant', content: streamBuffer }] : messages;

  const scrollToBottom = useCallback(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  function startRolePlay(personaId: string) {
    const p = ROLE_PLAY_PERSONAS.find(pp => pp.id === personaId)!;
    setSelectedPersona(personaId);
    setMessages([{ role: 'assistant', content: p.opening }]);
    setScoreVisible(false);
    setScoreData('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function resetRolePlay() {
    setSelectedPersona(null);
    setMessages([]);
    setInput('');
    setStreamBuffer('');
    setScoreVisible(false);
    setScoreData('');
  }

  async function send() {
    const text = input.trim();
    if (!text || streaming || !persona) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');
    setTimeout(scrollToBottom, 50);

    const systemPrompt = `You are role-playing as "${persona.name}" in a sales simulation for HDFC Bank retail assets training.

CHARACTER PROFILE:
- Company: ${persona.company}
- Industry: ${persona.industry}
- Personality: ${persona.personality}
- Product Interest: ${persona.product_interest}
- Objection Style: ${persona.objection_style}
- Difficulty: ${persona.difficulty}
- Hidden Triggers (things that would make you say yes): ${persona.hidden_triggers.join(', ')}

RULES:
1. Stay FULLY in character. Never break character or reveal you are AI.
2. Respond as the customer would — with realistic objections, questions, skepticism, or interest.
3. If the sales person addresses your hidden triggers well, gradually warm up.
4. Keep responses conversational and realistic (2-4 sentences typically).
5. If the sales person is generic or pushy, become more resistant.
6. Occasionally mention competitor offers or your existing bank relationship.
7. React naturally to good rapport-building, industry knowledge, and personalized pitches.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), context: systemPrompt, promptLevel: 'L4' })
      });
      if (!res.ok || !res.body) {
        setMessages([...next, { role: 'assistant', content: '*Error: Could not get response*' }]);
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
              }
            } catch {}
            currentEvent = '';
          }
        }
      }
      if (streamThrottleRef.current) cancelAnimationFrame(streamThrottleRef.current);
      setMessages([...next, { role: 'assistant', content: assembled }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: '*Network error*' }]);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
    }
  }

  async function requestScore() {
    if (!persona || messages.length < 3) return;
    setScoringInProgress(true);
    setScoreVisible(true);
    setScoreData('');

    const scorePrompt = `You are a senior sales trainer evaluating a role-play conversation between an HDFC Bank RM and a customer.

CUSTOMER PROFILE: ${persona.name} — ${persona.personality}
PRODUCT: ${persona.product_interest}
HIDDEN TRIGGERS: ${persona.hidden_triggers.join(', ')}
DIFFICULTY: ${persona.difficulty}

Analyze the RM's performance and provide:

## 🎯 Overall Score: [X/100]

### Performance Breakdown:
| Dimension | Score | Assessment |
|-----------|-------|------------|
| Rapport Building | /20 | [brief note] |
| Product Knowledge | /20 | [brief note] |
| Objection Handling | /20 | [brief note] |
| Personalization | /20 | [brief note] |
| Closing Technique | /20 | [brief note] |

### 💪 What Worked Well
- [2-3 specific things the RM did right]

### ⚠️ Missed Opportunities
- [2-3 things the RM could have done better, referencing hidden triggers they missed]

### 🚀 Suggested Next Response
If continuing this conversation, the ideal next response would be:
> [Write the ideal response]

### 📊 Win Probability
Based on this conversation so far: **[X]%** chance of converting this prospect.`;

    const conversationForScoring = messages.map(m => ({
      role: m.role as string,
      content: m.role === 'user' ? `[RM]: ${m.content}` : `[Customer - ${persona.name}]: ${m.content}`
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Here's the role-play conversation to evaluate:\n\n${conversationForScoring.map(m => m.content).join('\n\n')}\n\nPlease score this RM's performance.` }],
          context: scorePrompt,
          promptLevel: 'L4'
        })
      });
      if (!res.ok || !res.body) { setScoringInProgress(false); return; }
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
              if (currentEvent === 'text_delta') { assembled += data; setScoreData(assembled); }
            } catch {}
            currentEvent = '';
          }
        }
      }
      setScoreData(assembled);
    } catch {} finally {
      setScoringInProgress(false);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-r from-rose-700 to-pink-600 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 pt-3 pb-5">
            <Link href="/field-sales-ai" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-[11px] font-medium mb-3 transition group">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Field Sales AI
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-2">
                  <span className="w-2 h-2 bg-rose-300 rounded-full animate-pulse" />
                  Field Sales — AI Role-Play Simulator
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Live Sales Role-Play Simulator</h1>
                <p className="mt-1.5 text-white/80 text-sm max-w-xl leading-relaxed">
                  Practice real sales conversations with AI customers. Get scored on persuasion, product knowledge, objection handling & closing.
                </p>
              </div>
              {persona && <button onClick={resetRolePlay} className="text-sm text-red-200 hover:text-white border border-red-300/40 px-4 py-2 rounded-lg font-medium transition">New Session</button>}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <span className="text-amber-600">⚠️</span>
            <span>All personas are synthetic. This is a training simulation — no real customer data is used.</span>
          </div>

          {!persona ? (
            <div>
              <h3 className="text-[14px] font-bold text-gray-800 mb-3">Choose Your Customer Persona</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ROLE_PLAY_PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => startRolePlay(p.id)}
                    className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-lg transition group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : p.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {p.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-400">{p.industry}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      {PERSONA_AVATARS[p.id] && (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-200 shadow-sm shrink-0">
                          <Image src={PERSONA_AVATARS[p.id]} alt={p.name} width={48} height={48} className="w-full h-full object-cover object-top" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-rose-700 transition">{p.name}</h4>
                        <p className="text-[10px] text-gray-500">{p.company}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2 leading-relaxed line-clamp-2">{p.personality}</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[9px] text-purple-600 font-semibold">Product: {p.product_interest}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Chat Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '550px' }}>
                  {/* Persona Header */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-200 shadow-sm shrink-0">
                          {PERSONA_AVATARS[persona.id] ? (
                            <Image src={PERSONA_AVATARS[persona.id]} alt={persona.name} width={40} height={40} className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full bg-rose-100 flex items-center justify-center text-lg font-bold text-rose-700">{persona.name.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-900">{persona.name}</h4>
                          <p className="text-[10px] text-gray-500">{persona.company} · {persona.industry}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${persona.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : persona.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {persona.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {transcript.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? (
                          <div className="max-w-[80%]">
                            <p className="text-[9px] text-right text-gray-400 mb-0.5 font-medium">You (RM)</p>
                            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed shadow-md whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        ) : (
                          <div className="max-w-[80%] flex items-start gap-2">
                            {PERSONA_AVATARS[persona.id] && (
                              <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-200 shadow-sm shrink-0 mt-4">
                                <Image src={PERSONA_AVATARS[persona.id]} alt={persona.name} width={28} height={28} className="w-full h-full object-cover object-top" />
                              </div>
                            )}
                            <div>
                              <p className="text-[9px] text-gray-400 mb-0.5 font-medium">{persona.name.split(' — ')[0]}</p>
                              <div className="bg-rose-50 border border-rose-200 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-gray-900 leading-relaxed shadow-sm whitespace-pre-wrap">{msg.content}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {streaming && !streamBuffer && (
                      <div className="flex items-center gap-2 px-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] text-gray-400">{persona.name.split(' — ')[0]} is thinking...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-gray-200 bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
                        placeholder="Respond as the RM — build rapport, handle objections, pitch your product..."
                        rows={2}
                        disabled={streaming}
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 disabled:opacity-40 transition shadow-sm"
                      />
                      <button onClick={send} disabled={streaming || !input.trim()} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 rounded-lg disabled:opacity-30 transition text-sm shadow-md">Reply</button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={requestScore}
                        disabled={messages.length < 3 || scoringInProgress || streaming}
                        className="text-[11px] font-bold text-rose-700 hover:text-rose-900 px-3 py-1.5 border border-rose-300 rounded-md hover:bg-rose-50 transition disabled:opacity-30"
                      >
                        {scoringInProgress ? '⏳ Scoring...' : '📊 Score My Performance'}
                      </button>
                      <p className="text-[10px] text-gray-400 font-mono">Ctrl/Cmd + Enter to send</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Panel — Score & Tips */}
              <div className="space-y-3">
                <div className="bg-gradient-to-b from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
                  <h4 className="text-[12px] font-bold text-rose-800 mb-2">🎭 Persona Intel</h4>
                  <div className="space-y-2 text-[10px] text-gray-700">
                    <p><strong>Objection Style:</strong> {persona.objection_style}</p>
                    <p><strong>Product Interest:</strong> {persona.product_interest}</p>
                    <div className="pt-2 border-t border-rose-100">
                      <p className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mb-1">Tips to Win</p>
                      <ul className="space-y-1">
                        <li>• Build rapport before pitching</li>
                        <li>• Acknowledge their current situation</li>
                        <li>• Use industry-specific language</li>
                        <li>• Address objections with evidence</li>
                        <li>• Look for cross-sell openings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Score Panel */}
                {scoreVisible && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md max-h-[400px] overflow-y-auto">
                    <h4 className="text-[12px] font-bold text-gray-800 mb-2">📊 Performance Score</h4>
                    {scoreData ? (
                      <div className="text-[11px]">
                        <Markdown isStreaming={scoringInProgress}>{scoreData}</Markdown>
                        {!scoringInProgress && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <DownloadMenu content={scoreData} filenamePrefix="roleplay-score" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-gray-500">Analyzing your performance...</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="text-[12px] font-bold text-gray-700 mb-2">💡 Conversation Tracker</h4>
                  <div className="text-[10px] text-gray-600 space-y-1">
                    <p>Exchanges: <strong>{Math.floor(messages.length / 2)}</strong></p>
                    <p>Your messages: <strong>{messages.filter(m => m.role === 'user').length}</strong></p>
                    <p>Status: <strong className={messages.length < 3 ? 'text-amber-600' : messages.length < 7 ? 'text-blue-600' : 'text-green-600'}>{messages.length < 3 ? 'Opening' : messages.length < 7 ? 'Building Rapport' : 'Closing Phase'}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-gray-500 text-center">
          HDFC Retail Assets — Sales Role-Play Simulator &middot; All personas are synthetic
        </div>
      </footer>
    </>
  );
}
