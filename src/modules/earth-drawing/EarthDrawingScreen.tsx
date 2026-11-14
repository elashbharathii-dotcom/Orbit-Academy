import React, { useState, useEffect } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { COLORING_ARTWORKS, COLORING_CATEGORIES } from './coloringData';
import { ColoringArtwork, ColoringCategoryId } from './types';
import { ColoringCategoryGrid } from './components/ColoringCategoryGrid';
import { ColoringGallery } from './components/ColoringGallery';
import { ColoringWorkspace } from './components/ColoringWorkspace';
import { Palette, Award } from 'lucide-react';

export const EarthDrawingScreen: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<ColoringArtwork | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedArtwork]);

  const handleSelectCategory = (catId: ColoringCategoryId | 'all') => {
    setActiveCategoryId(catId);
    setSelectedArtwork(null);
  };

  const handleSelectArtwork = (artwork: ColoringArtwork) => {
    setSelectedArtwork(artwork);
  };

  const handleBackToGallery = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      {/* Subtle Starfield & Ambient Glow Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,40,60,0.3),rgba(3,6,17,0.95))]"
        aria-hidden="true"
      />

      {/* 1. Global Master Navigation Header */}
      <MasterHeader />

      {/* 2. Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 max-w-7xl w-full mx-auto">
        <div className="flex flex-col gap-6 w-full">
          {/* VIEW 1: Active Interactive Coloring Workspace */}
          {selectedArtwork ? (
            <ColoringWorkspace
              artwork={selectedArtwork}
              onBackToGallery={handleBackToGallery}
            />
          ) : (
            /* VIEW 2: Category Library & Gallery */
            <div className="flex flex-col gap-8 w-full animate-fade-in">
              {/* Hero Banner Card */}
              <GlassCard
                variant="elevated"
                className="p-6 sm:p-8 flex flex-col justify-between border-white/10 bg-gradient-to-r from-[#031A2A]/90 via-[#070C1B]/95 to-[#0A2540]/80 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TelemetryBadge
                        label="EARTH // COLORING STUDIO"
                        tone="emerald"
                        pulsing
                        size="sm"
                      />
                      <TelemetryBadge
                        label={`${COLORING_ARTWORKS.length} VECTOR PLATES`}
                        tone="cyan"
                        size="sm"
                      />
                      <TelemetryBadge
                        label={`${COLORING_CATEGORIES.length} THEMES`}
                        tone="amber"
                        size="sm"
                      />
                    </div>

                    <h1 className="mt-3 font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                      Space & Astronomy Coloring Studio
                    </h1>

                    <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                      Color certified vector illustrations across {COLORING_CATEGORIES.length} space exploration themes.
                      Click or tap enclosed regions to paint, explore verified NASA astrophysics facts,
                      and download or print your customized cosmic posters!
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0B1226]/80 px-4 py-3 font-mono text-xs text-[#94A3B8]">
                      <Palette className="h-5 w-5 text-[#38BDF8]" />
                      <div className="flex flex-col">
                        <span className="text-[#F8FAFC] font-bold">Vector Click-to-Fill</span>
                        <span className="text-[10px] text-[#64748B]">Preserves Clean Outlines</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0B1226]/80 px-4 py-3 font-mono text-xs text-[#94A3B8]">
                      <Award className="h-5 w-5 text-[#F59E0B]" />
                      <div className="flex flex-col">
                        <span className="text-[#F8FAFC] font-bold">Printable A4 Sheets</span>
                        <span className="text-[10px] text-[#64748B]">High-Res PNG Export</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* 8 Categories Browser */}
              <ColoringCategoryGrid
                onSelectCategory={handleSelectCategory}
                activeCategoryId={activeCategoryId}
              />

              {/* Plate Gallery with Search and Category Filtering */}
              <ColoringGallery
                artworks={COLORING_ARTWORKS}
                activeCategoryId={activeCategoryId}
                onSelectCategory={handleSelectCategory}
                onSelectArtwork={handleSelectArtwork}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
