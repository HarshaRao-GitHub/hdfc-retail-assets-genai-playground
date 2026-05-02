'use client';

import Link from 'next/link';

export default function Header() {
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

        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-md text-[12px] font-semibold bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition border border-white/15"
        >
          Switch Client
        </Link>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="hidden md:flex items-center justify-center gap-3 py-2">
            <ModeLink href="/prompt-lab" icon="💬" label="Prompt Lab" />
            <ModeLink href="/doc-intelligence" icon="📄" label="Doc Intelligence" />
            <ModeLink href="/sales-ai" icon="📈" label="Sales & Growth AI" />
            <ModeLink href="/use-cases" icon="🎯" label="Use Case Library" />
          </nav>
          <nav className="hidden md:flex items-center justify-center gap-1 pb-2 -mt-0.5">
            <NavLink href="/dashboard">Dashboard</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function ModeLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white/85 hover:text-white bg-white/5 hover:bg-white/15 transition flex items-center gap-1.5 border border-white/10 hover:border-white/25"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-2.5 py-1 rounded-md text-[12px] text-white/70 hover:text-white hover:bg-white/10 transition font-medium"
    >
      {children}
    </Link>
  );
}
