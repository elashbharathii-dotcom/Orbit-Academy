import React from 'react';
import { Dna, ExternalLink, Bot, CheckCircle2 } from 'lucide-react';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';

export interface OsdrStudySummary {
  accession: string;
  title: string;
  organism: string;
  mission: string;
  assayType: string;
  keyFinding: string;
  osdrUrl: string;
}

interface NasaOsdrLessonCardProps {
  study: OsdrStudySummary;
  onExplainWithLaura?: (study: OsdrStudySummary) => void;
  className?: string;
}

export const NasaOsdrLessonCard: React.FC<NasaOsdrLessonCardProps> = ({
  study,
  onExplainWithLaura,
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl border border-[#00E5FF]/20 bg-[#070C1B]/95 backdrop-blur-2xl p-5 shadow-2xl space-y-3.5 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#0284C7]/30 border border-[#00E5FF]/40 text-[#00E5FF]">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-[#00E5FF] tracking-wider">
                {study.accession}
              </span>
              <TelemetryBadge label="NASA OSDR VERIFIED" tone="cyan" size="sm" />
            </div>
            <h4 className="font-sans text-sm font-extrabold text-white mt-0.5">
              {study.title}
            </h4>
          </div>
        </div>

        <a
          href={study.osdrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10 text-xs font-mono transition-all"
        >
          <span>Open OSDR</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-[#94A3B8] block uppercase">Model Organism</span>
          <span className="text-white font-bold italic">{study.organism}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-[#94A3B8] block uppercase">Flight Payload</span>
          <span className="text-[#38BDF8] font-bold">{study.mission}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-[#94A3B8] block uppercase">Assay Technology</span>
          <span className="text-[#F59E0B] font-bold">{study.assayType}</span>
        </div>
      </div>

      {/* Key Finding Card */}
      <div className="p-3 rounded-2xl bg-[#0B1226] border border-white/10 text-xs text-[#CBD5E1] space-y-1">
        <div className="font-bold text-white flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Biological Conclusion & Finding</span>
        </div>
        <p className="font-mono text-[11px] leading-relaxed text-[#94A3B8]">
          {study.keyFinding}
        </p>
      </div>

      {/* Laura Assistance CTA */}
      {onExplainWithLaura && (
        <button
          type="button"
          onClick={() => onExplainWithLaura(study)}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
        >
          <Bot className="w-4 h-4" />
          <span>Ask Laura AI to Explain {study.accession} in Plain English</span>
        </button>
      )}
    </div>
  );
};
