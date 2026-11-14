import React from 'react';
import { COLORING_CATEGORIES } from '../coloringData';
import { ColoringCategoryId } from '../types';
import { CategoryBannerSvg } from './CategoryBannerSvgs';
import { ChevronRight, Sparkles } from 'lucide-react';

interface ColoringCategoryGridProps {
  onSelectCategory: (categoryId: ColoringCategoryId) => void;
  activeCategoryId: string;
}

// Icon representations matching the user's mockup top-left badges
const CATEGORY_BADGE_ICONS: Record<ColoringCategoryId, React.ReactNode> = {
  'solar-system': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#2A1608] border border-amber-500/40 text-amber-400 text-sm shadow-md">
      🪐
    </span>
  ),
  'earth-features': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#081F33] border border-sky-500/40 text-sky-400 text-sm shadow-md">
      🌍
    </span>
  ),
  'moon-exploration': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1E2333] border border-slate-400/40 text-slate-300 text-sm shadow-md">
      🌕
    </span>
  ),
  'astronauts-space-travel': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1C1633] border border-purple-500/40 text-purple-300 text-sm shadow-md">
      👨‍🚀
    </span>
  ),
  'galaxies-nebulae': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#18112E] border border-violet-500/40 text-violet-400 text-sm shadow-md">
      🌌
    </span>
  ),
  'rockets-satellites': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#2A1010] border border-red-500/40 text-red-400 text-sm shadow-md">
      🚀
    </span>
  ),
  'mars-alien-worlds': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#2E0F12] border border-rose-500/40 text-rose-400 text-sm shadow-md">
      🔴
    </span>
  ),
  'stars-mysteries': (
    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#091D26] border border-cyan-500/40 text-cyan-300 text-sm shadow-md">
      ✨
    </span>
  ),
};

export const ColoringCategoryGrid: React.FC<ColoringCategoryGridProps> = ({
  onSelectCategory,
  activeCategoryId,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 2x4 Responsive Grid matching image_7.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {COLORING_CATEGORIES.map((cat) => {
          const isActive = activeCategoryId === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative flex flex-col rounded-2xl border p-2.5 transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)] ${
                isActive
                  ? 'border-[#38BDF8] bg-[#0E1A38] shadow-[0_0_24px_rgba(56,189,248,0.3)]'
                  : 'border-white/10 bg-[#080E1E]/90 hover:border-[#38BDF8]/50 hover:bg-[#0B152B]'
              }`}
            >
              {/* White Cartoon Line-Art Banner Preview Surface */}
              <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shadow-inner group-hover:border-[#38BDF8] transition-colors">
                <CategoryBannerSvg categoryId={cat.id} />

                {/* Floating Top-Left Category Icon Badge */}
                <div className="absolute top-2 left-2 z-10 transition-transform group-hover:scale-110">
                  {CATEGORY_BADGE_ICONS[cat.id]}
                </div>

                {/* Floating Top-Right Plates Count Pill */}
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-[#080E1E]/95 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#38BDF8] shadow-md backdrop-blur-sm">
                  <span>{cat.itemCount} Plates</span>
                </div>
              </div>

              {/* Bottom Exploration Row */}
              <div className="mt-2.5 flex items-center justify-between px-1.5 py-1 text-xs font-mono">
                <div className="flex items-center gap-1 font-bold text-[#F59E0B] group-hover:text-amber-300 transition-colors">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  <span>Explore</span>
                </div>

                <div className="flex items-center gap-0.5 font-bold text-[#38BDF8] group-hover:text-cyan-200 group-hover:translate-x-1 transition-all">
                  <span>Browse</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
