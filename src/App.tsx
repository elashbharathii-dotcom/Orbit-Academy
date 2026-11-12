import React from 'react';
import { Compass, Radio, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export default function App(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-[#05070D] p-6 text-[#F8FAFC]">
      {/* Subtle Background Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-[#38BDF8]/10 blur-3xl" 
      />

      {/* Mission Control HUD Card */}
      <section className="relative z-10 w-full max-w-xl rounded-2xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/90 p-8 shadow-2xl backdrop-blur-md">
        <header className="mb-6 flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#38BDF8]"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
              Mission Control // Subsystem Telemetry
            </span>
          </div>
          <span className="rounded border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#F59E0B]">
            PHASE 1 READY
          </span>
        </header>

        <h1 className="font-sans text-3xl font-bold tracking-tight text-[#F8FAFC]">
          ORBIT ACADEMY
        </h1>
        <p className="mt-2 text-sm text-[#94A3B8]">
          Interactive 3D Solar System Platform &amp; Space Science Academy. Foundation and design tokens successfully established.
        </p>

        {/* System Checklist */}
        <div className="mt-6 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/50 px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-[#F8FAFC]">
              <Radio className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
              Runtime Stack
            </span>
            <span className="text-[#38BDF8]">React 18 + TS + Vite 6</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/50 px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-[#F8FAFC]">
              <Compass className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
              Design System Tokens
            </span>
            <span className="text-[#F59E0B]">MASTER.md (Tailwind v4)</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/50 px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-[#F8FAFC]">
              <Sparkles className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
              3D Engine Pipeline
            </span>
            <span className="text-[#10B981]">Three.js + R3F + Drei</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/50 px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-[#F8FAFC]">
              <ShieldCheck className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
              Typography &amp; A11y
            </span>
            <span className="text-[#94A3B8]">Exo + Roboto Mono (AAA)</span>
          </div>
        </div>

        {/* Next Step Callout */}
        <footer className="mt-6 flex items-center justify-between rounded-xl border border-[#38BDF8]/20 bg-[#38BDF8]/5 p-4">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Terminal className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
            <span>Next: Phase 2 Celestial 3D Engine</span>
          </div>
          <span className="font-mono text-xs font-semibold text-[#38BDF8]">
            STANDING BY
          </span>
        </footer>
      </section>
    </main>
  );
}

