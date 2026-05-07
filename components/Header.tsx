'use client';

import Link from 'next/link';
import { useDocuments } from '@/lib/document-context';

export default function Header() {
  const { documents, setTrayOpen } = useDocuments();
  const docCount = documents.length;

  return (
    <header className="bg-hdfc-blue text-white">
      <div className="max-w-7xl mx-auto px-6 pt-3 pb-2 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-hdfc-red flex items-center justify-center font-bold text-white text-lg group-hover:scale-105 transition shadow-md">
            H
          </div>
          <div>
            <div className="font-bold text-[17px] tracking-tight">
              HDFC Retail Assets — GenAI Playground
            </div>
            <div className="text-[10px] text-white/60 font-mono tracking-wide">
              Leadership Enablement &middot; Sales &middot; Product &middot; Portfolio &middot; Service
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTrayOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition border border-white/15"
          >
            📄 Docs
            {docCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-hdfc-red text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
                {docCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="hidden md:flex items-center justify-center gap-3 py-2">
            <ModeLink href="/field-sales-ai" icon="🚀" label="Retail Assets AI" highlight />
            <span className="w-px h-6 bg-white/20 mx-1" />
            <ModeLink href="/prompt-lab" icon="💬" label="Prompt Lab" />
            <ModeLink href="/doc-intelligence" icon="📄" label="Doc Intelligence" />
            <ModeLink href="/sales-ai" icon="📈" label="Sales & Growth AI" />
            <ModeLink href="/use-cases" icon="🎯" label="Use Case Library" />
            <span className="w-px h-6 bg-white/20 mx-1" />
            <ModeLink href="/agentic-ai" icon="🤖" label="Agentic AI" highlight />
          </nav>
        </div>
      </div>
    </header>
  );
}

function ModeLink({ href, icon, label, highlight }: { href: string; icon: string; label: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition flex items-center gap-1.5 border ${
        highlight
          ? 'text-white bg-hdfc-red/80 hover:bg-hdfc-red border-hdfc-red/60 hover:border-hdfc-red shadow-sm'
          : 'text-white/85 hover:text-white bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/25'
      }`}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
