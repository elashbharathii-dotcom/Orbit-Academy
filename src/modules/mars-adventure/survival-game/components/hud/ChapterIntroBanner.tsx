import React, { useEffect } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { Compass, X } from 'lucide-react';

export const ChapterIntroBanner: React.FC = () => {
  const chapterBanner = useMarsGameStore((state) => state.chapterBanner);
  const dismissChapterBanner = useMarsGameStore((state) => state.dismissChapterBanner);

  useEffect(() => {
    if (!chapterBanner?.visible) return;
    const timer = setTimeout(() => {
      dismissChapterBanner();
    }, 8500);
    return () => clearTimeout(timer);
  }, [chapterBanner, dismissChapterBanner]);

  if (!chapterBanner || !chapterBanner.visible) return null;

  const ch = chapterBanner.chapter;

  return (
    <div className="pointer-events-auto fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-fade-in font-mono">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/50 bg-[#070B16]/95 p-4 sm:p-5 shadow-[0_0_40px_rgba(0,240,255,0.3)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400 animate-spin [animation-duration:12s]" />
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
              CAMPAIGN CHAPTER UNLOCKED
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded">
            {ch.solEstimate}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
          {ch.title} — {ch.subtitle}
        </h3>
        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
          {ch.overview}
        </p>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
          <span className="text-[10px] text-slate-500">
            Open Journal [J] to review chapter directives.
          </span>
          <button
            onClick={dismissChapterBanner}
            className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-white transition-colors"
          >
            <span>DISMISS</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
