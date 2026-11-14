import React, { useState, useMemo } from 'react';
import { ColoringArtwork, ColoringCategoryId } from '../types';
import { COLORING_CATEGORIES } from '../coloringData';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { Search, Sparkles, Paintbrush, CheckCircle2, Clock } from 'lucide-react';

interface ColoringGalleryProps {
  artworks: ColoringArtwork[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: ColoringCategoryId | 'all') => void;
  onSelectArtwork: (artwork: ColoringArtwork) => void;
}

export const ColoringGallery: React.FC<ColoringGalleryProps> = ({
  artworks,
  activeCategoryId,
  onSelectCategory,
  onSelectArtwork,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Check saved progress from localStorage for badges
  const savedProgressMap = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    artworks.forEach((art) => {
      try {
        const saved = localStorage.getItem(`orbit_coloring_progress_${art.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          const count = Object.values(parsed).filter((c) => c !== '#FFFFFF').length;
          map[art.id] = { count, total: art.regions.length };
        }
      } catch (e) {
        // ignore
      }
    });
    return map;
  }, [artworks]);

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const matchesCategory =
        activeCategoryId === 'all' || art.category === activeCategoryId;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.learningTopic.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [artworks, activeCategoryId, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Category Pills & Search Controls */}
      <GlassCard variant="elevated" className="p-4 border-white/10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search illustrations (e.g. Saturn, Artemis, Aurora, Black Hole)..."
              className="w-full rounded-xl border border-white/10 bg-[#070C1B] pl-10 pr-4 py-2 text-xs font-mono text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none transition-colors"
            />
          </div>

          <div className="font-mono text-xs text-[#94A3B8] flex items-center gap-2">
            <span>Showing:</span>
            <span className="font-bold text-[#38BDF8]">
              {filteredArtworks.length} of {artworks.length} Plates
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
              activeCategoryId === 'all'
                ? 'border border-[#38BDF8] bg-[#38BDF8]/20 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                : 'border border-transparent bg-white/[0.04] text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]'
            }`}
          >
            All Plates ({artworks.length})
          </button>

          {COLORING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                activeCategoryId === cat.id
                  ? 'border border-[#38BDF8] bg-[#38BDF8]/20 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'border border-transparent bg-white/[0.04] text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.shortTitle}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Grid of Artwork Plates */}
      {filteredArtworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-[#94A3B8] rounded-2xl border border-white/5 bg-[#070C1B]/50">
          <Paintbrush className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="font-sans text-base font-bold text-white">No coloring plates found</h3>
          <p className="text-xs max-w-sm mt-1">
            Try adjusting your search terms or switch to "All Plates" to view our complete collection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className="mt-4 rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-4 py-2 font-mono text-xs text-[#38BDF8] hover:bg-[#38BDF8]/20"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredArtworks.map((artwork) => {
            const progress = savedProgressMap[artwork.id];
            const hasStarted = Boolean(progress && progress.count > 0);
            const isCompleted = Boolean(progress && progress.count === progress.total);

            return (
              <GlassCard
                key={artwork.id}
                variant="interactive"
                onClick={() => onSelectArtwork(artwork)}
                className="group p-4 flex flex-col justify-between border-white/10 bg-[#070C1B]/80 hover:bg-[#0B1528]/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Scaled Preview Surface */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center group-hover:border-[#38BDF8] transition-colors shadow-inner">
                  <svg
                    viewBox={artwork.viewBox}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  >
                    {artwork.underlaySvg && (
                      <g dangerouslySetInnerHTML={{ __html: artwork.underlaySvg }} />
                    )}
                    {artwork.regions.map((r, idx) => (
                      <path
                        key={r.id}
                        d={r.path}
                        fill={idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}
                        stroke="#0F172A"
                        strokeWidth="2.5"
                      />
                    ))}
                    {artwork.overlaySvg && (
                      <g dangerouslySetInnerHTML={{ __html: artwork.overlaySvg }} />
                    )}
                  </svg>

                  {/* Badges on Top */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                    <TelemetryBadge
                      label={artwork.difficulty}
                      tone={
                        artwork.difficulty === 'Easy'
                          ? 'emerald'
                          : artwork.difficulty === 'Medium'
                          ? 'amber'
                          : 'violet'
                      }
                      size="sm"
                    />
                    {artwork.id.includes('-flagship') && (
                      <span className="rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/60 px-2 py-0.5 text-[9px] font-mono font-bold text-[#F59E0B]">
                        ✨ Signature
                      </span>
                    )}
                  </div>

                  {/* In Progress / Done Indicator */}
                  {hasStarted && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[#030611]/85 border border-white/20 px-2 py-0.5 font-mono text-[9px] backdrop-blur-md shadow-md">
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                          <span className="text-[#10B981] font-bold">Finished</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-[#38BDF8]" />
                          <span className="text-[#38BDF8] font-bold">
                            {progress.count}/{progress.total}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Information */}
                <div className="mt-3.5 flex flex-col gap-1 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span className="text-[#38BDF8] font-bold">{artwork.learningTopic}</span>
                    <span>{artwork.regions.length} Regions</span>
                  </div>

                  <h3 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                    {artwork.title}
                  </h3>

                  <p className="font-sans text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {artwork.description}
                  </p>
                </div>

                {/* Card CTA Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-1 font-semibold">
                    <Sparkles className="h-3 w-3" />
                    <span>NASA Fact</span>
                  </span>

                  <span className="rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-3 py-1 font-mono text-[10.5px] font-bold text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#030611] transition-all tracking-wide shadow-sm">
                    {hasStarted ? 'CONTINUE →' : 'COLOR NOW →'}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
