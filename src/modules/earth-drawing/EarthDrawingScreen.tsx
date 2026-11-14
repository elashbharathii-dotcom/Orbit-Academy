import React, { useState, useEffect, useRef } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { COLORING_ARTWORKS } from './coloringData';
import { ColoringArtwork, ColoringCategoryId } from './types';
import { ColoringCategoryGrid } from './components/ColoringCategoryGrid';
import { ColoringGallery } from './components/ColoringGallery';
import { ColoringWorkspace } from './components/ColoringWorkspace';
import { Search, SlidersHorizontal } from 'lucide-react';

export const EarthDrawingScreen: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<ColoringArtwork | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [headerSearch, setHeaderSearch] = useState<string>('');
  const galleryRef = useRef<HTMLDivElement>(null);

  // Scroll to top when opening an artwork
  useEffect(() => {
    if (selectedArtwork) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedArtwork]);

  const handleSelectCategory = (catId: ColoringCategoryId | 'all') => {
    setActiveCategoryId(catId);
    setSelectedArtwork(null);
    // Smooth scroll down to gallery
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
            <div className="flex flex-col gap-6 w-full animate-fade-in">
              {/* Platform Branding Bar matching image_7.png */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#080E1E]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-spin [animation-duration:24s]">🪐</span>
                    <span className="font-sans text-base sm:text-lg font-black tracking-tight text-[#F8FAFC]">
                      Orbit Academy
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1838] border border-violet-500/40 text-xs font-mono font-bold text-violet-300 shadow-sm">
                    <span>🎨</span>
                    <span>Planet Painter</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={headerSearch}
                      onChange={(e) => setHeaderSearch(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#070C1B] pl-9 pr-3 py-1.5 font-mono text-xs text-white placeholder-slate-500 focus:border-[#38BDF8] focus:outline-none w-36 sm:w-52 transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      // Toggle all categories view
                      setActiveCategoryId((prev) => (prev === 'all' ? 'solar-system' : 'all'));
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                </div>
              </div>

              {/* 8 Categories Browser Grid (Pixel-Perfect from image_7.png) */}
              <ColoringCategoryGrid
                onSelectCategory={handleSelectCategory}
                onStartColoring={handleSelectArtwork}
                activeCategoryId={activeCategoryId}
              />

              {/* Plate Gallery with Search and Category Filtering */}
              <div ref={galleryRef} className="scroll-mt-6">
                <ColoringGallery
                  artworks={COLORING_ARTWORKS}
                  activeCategoryId={activeCategoryId}
                  onSelectCategory={handleSelectCategory}
                  onSelectArtwork={handleSelectArtwork}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
