'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const THERMAX_URL = process.env.NEXT_PUBLIC_THERMAX_URL || 'http://localhost:3001';

const CLIENTS = [
  {
    id: 'thermax',
    name: 'Thermax',
    subtitle: 'Agentic AI Operating System 2030',
    description: '9-stage enterprise AI system for energy & environment solutions — Market Intelligence to O&M Services with AgentGuard governance, 10 agents, and 4 experience modes.',
    tags: ['Prompting', 'Doc Intelligence', 'Agentic AI', 'AI Nexus'],
    letter: 'T',
    letterBg: '#FF7A1A',
    letterColor: '#0A2540',
    accentColor: '#FF7A1A',
    gradientFrom: '#0A2540',
    gradientTo: '#1F3A5F',
    borderHover: 'rgba(255,122,26,0.5)',
    shadowHover: '0 0 40px rgba(255,122,26,0.15)',
    barFrom: '#FF7A1A',
    barTo: '#E5630A',
    href: THERMAX_URL,
    external: true,
    pin: '427890',
  },
  {
    id: 'hdfc',
    name: 'HDFC Retail Assets',
    subtitle: 'GenAI Leadership Playground',
    description: 'GenAI enablement for mortgage business leaders — Home Loans & LAP. 35+ use cases across Sales, Product, Portfolio & Service with hands-on prompt engineering.',
    tags: ['Prompt Lab', 'Doc Intelligence', 'Sales AI', 'Use Cases'],
    letter: 'H',
    letterBg: '#ED1C24',
    letterColor: '#ffffff',
    accentColor: '#ED1C24',
    gradientFrom: '#002D5A',
    gradientTo: '#004B87',
    borderHover: 'rgba(237,28,36,0.5)',
    shadowHover: '0 0 40px rgba(237,28,36,0.15)',
    barFrom: '#ED1C24',
    barTo: '#C41018',
    href: '/dashboard',
    external: false,
    pin: '316781',
  },
];

const SESSION_KEY = 'genai_hub_unlocked';

function getUnlocked(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch { return new Set(); }
}

function persistUnlocked(ids: Set<string>) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(ids))); } catch {}
}

export default function ClientSelector() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { setUnlocked(getUnlocked()); }, []);

  const openPinModal = useCallback((clientId: string) => {
    if (unlocked.has(clientId)) {
      const client = CLIENTS.find(c => c.id === clientId)!;
      if (client.external) {
        window.location.href = client.href;
      } else {
        router.push(client.href);
      }
      return;
    }
    setActiveClient(clientId);
    setPinDigits(['', '', '', '', '', '']);
    setError('');
    setShake(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [unlocked, router]);

  const closePinModal = () => {
    setActiveClient(null);
    setPinDigits(['', '', '', '', '', '']);
    setError('');
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...pinDigits];
    next[index] = digit;
    setPinDigits(next);
    setError('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === 5) {
      const fullPin = next.join('');
      if (fullPin.length === 6) {
        verifyPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...pinDigits];
      next[index - 1] = '';
      setPinDigits(next);
    }
    if (e.key === 'Enter') {
      const fullPin = pinDigits.join('');
      if (fullPin.length === 6) verifyPin(fullPin);
    }
    if (e.key === 'Escape') closePinModal();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...pinDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setPinDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === 6) {
      setTimeout(() => verifyPin(pasted), 100);
    }
  };

  const verifyPin = (pin: string) => {
    const client = CLIENTS.find(c => c.id === activeClient);
    if (!client) return;

    if (pin === client.pin) {
      const next = new Set(unlocked);
      next.add(client.id);
      setUnlocked(next);
      persistUnlocked(next);
      closePinModal();
      if (client.external) {
        window.location.href = client.href;
      } else {
        router.push(client.href);
      }
    } else {
      setError('Invalid access key. Please try again.');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPinDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }, 600);
    }
  };

  const activeClientData = CLIENTS.find(c => c.id === activeClient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-[11px] font-mono text-white/70 mb-6 tracking-wide">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              GenAI Leadership Enablement Platform &middot; Powered by Claude AI
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise GenAI
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Playground Hub
              </span>
            </h1>
            <p className="mt-5 text-white/60 max-w-2xl mx-auto text-[15px] leading-relaxed">
              Select your client workspace to access the AI-powered playground. Each workspace is
              purpose-built with industry-specific use cases, prompt engineering labs, and hands-on
              GenAI tools for leadership teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {CLIENTS.map(client => {
              const isUnlocked = unlocked.has(client.id);
              return (
                <button
                  key={client.id}
                  onClick={() => openPinModal(client.id)}
                  className="group relative text-left rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(to bottom right, ${client.gradientFrom}, ${client.gradientTo})`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = client.borderHover;
                    e.currentTarget.style.boxShadow = client.shadowHover;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                    style={{ background: `linear-gradient(to right, ${client.barFrom}, ${client.barTo})` }}
                  />

                  {/* Lock badge */}
                  <div className="absolute top-4 right-4">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-lg group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: client.letterBg, color: client.letterColor }}
                    >
                      {client.letter}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white transition" style={{ }}>{client.name}</h2>
                      <p className="text-[11px] text-white/50 font-mono">{client.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-white/70 leading-relaxed mb-6">
                    {client.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {client.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full border"
                        style={{
                          color: client.accentColor,
                          backgroundColor: `${client.accentColor}15`,
                          borderColor: `${client.accentColor}30`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    className="flex items-center gap-2 text-[12px] font-semibold group-hover:gap-3 transition-all"
                    style={{ color: client.accentColor }}
                  >
                    {isUnlocked ? `Launch ${client.name.split(' ')[0]} Playground` : `Unlock ${client.name.split(' ')[0]} Playground`}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      {isUnlocked ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      )}
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 text-[11px] text-white/40">
              <span>80% Hands-on</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Use Case Driven</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Synthetic Data Only</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Policy Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Entry Modal */}
      {activeClient && activeClientData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={closePinModal}>
          <div
            className={`relative w-full max-w-md rounded-2xl p-8 border border-white/15 shadow-2xl ${shake ? 'animate-shake' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${activeClientData.gradientFrom}, ${activeClientData.gradientTo})`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closePinModal}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xl font-bold transition"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-lg mx-auto mb-4"
                style={{ backgroundColor: activeClientData.letterBg, color: activeClientData.letterColor }}
              >
                {activeClientData.letter}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{activeClientData.name}</h3>
              <p className="text-[13px] text-white/60">Enter 6-digit access key to unlock</p>
            </div>

            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {pinDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white/10 text-white placeholder:text-white/20 focus:outline-none transition-all"
                  style={{
                    borderColor: error ? '#EF4444' : digit ? activeClientData.accentColor : 'rgba(255,255,255,0.2)',
                    boxShadow: digit ? `0 0 12px ${activeClientData.accentColor}30` : 'none',
                  }}
                  placeholder="·"
                  autoComplete="off"
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-red-400 text-[13px] font-semibold mb-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {error}
              </p>
            )}

            <p className="text-center text-[11px] text-white/30 mt-4">
              Access keys are provided by your session facilitator
            </p>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-white/30 flex flex-wrap items-center justify-between gap-2">
          <span>
            Enterprise GenAI Playground &middot; Designed &amp; Developed by Harsha Rao | Director - AI Strategy &amp; Consulting | Regenesys School of AI
          </span>
          <span className="font-mono">
            Powered by Claude AI &middot; Anthropic
          </span>
        </div>
      </footer>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
