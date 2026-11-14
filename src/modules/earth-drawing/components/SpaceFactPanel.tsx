import React from 'react';
import { ColoringArtwork } from '../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { Sparkles, BookOpen, Award, CheckCircle2, Atom } from 'lucide-react';

interface SpaceFactPanelProps {
  artwork: ColoringArtwork;
  coloredCount: number;
  totalCount: number;
  progressPercent: number;
  isComplete: boolean;
}

export const SpaceFactPanel: React.FC<SpaceFactPanelProps> = ({
  artwork,
  coloredCount,
  totalCount,
  progressPercent,
  isComplete,
}) => {
  return (
    <GlassCard variant="elevated" className="p-4 border-white/10 flex flex-col gap-4 font-mono text-xs">
      {/* Educational Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
            <Atom className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider">
              Astronomy Science Dossier
            </h3>
            <span className="text-[10px] text-[#38BDF8]">{artwork.learningTopic}</span>
          </div>
        </div>

        <TelemetryBadge
          label={isComplete ? 'CERTIFIED' : 'ACTIVE'}
          tone={isComplete ? 'emerald' : 'cyan'}
          size="sm"
        />
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
          <span>Plate Coloring Completion</span>
          <span className="font-bold text-[#F8FAFC]">
            {coloredCount} / {totalCount} ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#38BDF8] to-[#10B981] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Primary Fact Card */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-1">
          <Sparkles className="h-3 w-3" />
          <span>Verified Astrophysics Fact</span>
        </div>
        <p className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
          {artwork.educationalFact}
        </p>
      </div>

      {/* Additional Fact Card */}
      {artwork.additionalFact && (
        <div className="rounded-xl border border-white/5 bg-[#070C1B]/70 p-3 text-left">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
            <BookOpen className="h-3 w-3" />
            <span>Cosmic Exploration Context</span>
          </div>
          <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
            {artwork.additionalFact}
          </p>
        </div>
      )}

      {/* Completion Trophy Card */}
      {isComplete && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 flex items-center gap-3 animate-fade-in">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-[#10B981]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Plate Mastered!</span>
            </div>
            <p className="font-sans text-[11px] text-slate-300 mt-0.5">
              All vector regions have been accurately rendered. Export your artwork or print a commemorative poster!
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
