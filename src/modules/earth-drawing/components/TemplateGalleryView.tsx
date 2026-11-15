import React, { useState, useMemo } from 'react';
import { ColoringArtwork } from '../types';
import { COLORING_CATEGORIES, COLORING_ARTWORKS } from '../coloringData';
import { Search, Paintbrush, Palette, ArrowRight, Layers } from 'lucide-react';

interface TemplateGalleryViewProps {
  onSelectStudioTemplate: (artwork: ColoringArtwork) => void;
  onSelectColoringPlate: (artwork: ColoringArtwork) => void;
  onStartBlankCanvas: () => void;
}

export const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({
  onSelectStudioTemplate,
  onSelectColoringPlate,
  onStartBlankCanvas,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArtworks = useMemo(() => {
    return COLORING_ARTWORKS.filter((art) => {
      const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.learningTopic.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* 1. HERO BANNER: START BLANK OR PICK A TEMPLATE */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[6px_6px_0px_#0B0B0B]">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00E5FF] border border-[#0B0B0B]" />
            <span
              className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
              style={{ fontFamily: '"Silkscreen", monospace' }}
            >
              SPACE-ART TEMPLATE LIBRARY
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-black text-[#0B0B0B] tracking-tight uppercase"
            style={{ fontFamily: '"Silkscreen", monospace' }}
          >
            SKETCH, TRACE &amp; COLOR THE COSMOS
          </h2>
          <p className="font-mono text-xs text-[#555555] leading-relaxed">
            Choose from 10 NASA-inspired categories: Solar system maps, lunar bases, rovers, and deep-space nebulae. Open any template in the Studio to trace, or enter Color-by-Number mode.
          </p>
        </div>

        {/* Blank Canvas CTA */}
        <button
          type="button"
          onClick={onStartBlankCanvas}
          className="flex items-center gap-2 px-5 py-3 border-2 border-[#0B0B0B] bg-[#00E5FF] text-[#0B0B0B] font-mono text-xs font-black uppercase tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[4px_4px_0px_#0B0B0B] active:translate-x-0.5 active:translate-y-0.5"
        >
          <Paintbrush className="w-4 h-4" />
          <span>START BLANK CANVAS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[4px_4px_0px_#0B0B0B]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. Saturn, Artemis, Apollo, Rover)..."
            className="w-full pl-9 pr-3 py-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] font-mono text-xs text-[#0B0B0B] placeholder-[#777777] focus:outline-none"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 border-2 font-mono text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#0B0B0B] text-[#F1F1F0] border-[#0B0B0B] shadow-[2px_2px_0px_#9A9A9A]'
                : 'bg-[#F1F1F0] text-[#0B0B0B] border-[#0B0B0B] hover:bg-[#FFFFFF]'
            }`}
          >
            ALL ({COLORING_ARTWORKS.length})
          </button>

          {COLORING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1 border-2 font-mono text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0B0B0B] text-[#F1F1F0] border-[#0B0B0B] shadow-[2px_2px_0px_#9A9A9A]'
                  : 'bg-[#F1F1F0] text-[#0B0B0B] border-[#0B0B0B] hover:bg-[#FFFFFF]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArtworks.map((art) => {
          return (
            <div
              key={art.id}
              className="group flex flex-col justify-between bg-[#FFFFFF] border-2 border-[#0B0B0B] p-4 shadow-[4px_4px_0px_#0B0B0B] hover:shadow-[6px_6px_0px_#0B0B0B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 border border-[#0B0B0B] bg-[#F1F1F0] font-mono text-[10px] font-bold text-[#0B0B0B] uppercase">
                  {art.difficulty} PLATE
                </span>

                <span className="font-mono text-[10px] font-bold text-[#555555]">
                  {art.learningTopic}
                </span>
              </div>

              {/* SVG Vector Preview */}
              <div className="relative aspect-[4/3] w-full bg-[#F1F1F0] border-2 border-[#0B0B0B] p-3 flex items-center justify-center overflow-hidden mb-3">
                <svg
                  viewBox={art.viewBox}
                  className="w-full h-full object-contain filter contrast-125"
                >
                  {art.regions.map((region) => (
                    <path
                      key={region.id}
                      d={region.path}
                      fill={region.defaultFill || '#FFFFFF'}
                      stroke="#0B0B0B"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>

              {/* Title & Fact */}
              <div className="flex flex-col gap-1 mb-4 flex-1">
                <h3
                  className="font-mono text-sm font-black text-[#0B0B0B] uppercase"
                  style={{ fontFamily: '"Silkscreen", monospace' }}
                >
                  {art.title}
                </h3>
                <p className="font-mono text-[11px] text-[#555555] line-clamp-2 leading-relaxed">
                  {art.educationalFact}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-[#9A9A9A]">
                <button
                  type="button"
                  onClick={() => onSelectStudioTemplate(art)}
                  title="Open as Trace Template in Creative Studio"
                  className="flex items-center justify-center gap-1 p-2 border-2 border-[#0B0B0B] bg-[#00E5FF] text-[#0B0B0B] font-mono text-xs font-black uppercase transition-all hover:bg-[#00D0EE] shadow-[2px_2px_0px_#0B0B0B] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>STUDIO</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectColoringPlate(art)}
                  title="Color plate by number"
                  className="flex items-center justify-center gap-1 p-2 border-2 border-[#0B0B0B] bg-[#0B0B0B] text-[#F1F1F0] font-mono text-xs font-black uppercase transition-all hover:bg-[#222222] shadow-[2px_2px_0px_#9A9A9A] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>COLOR</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
