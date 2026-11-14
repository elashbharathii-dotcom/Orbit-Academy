import React from 'react';
import { COLORING_CATEGORIES } from '../coloringData';
import { ColoringCategoryId } from '../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { ChevronRight, Sparkles } from 'lucide-react';

interface ColoringCategoryGridProps {
  onSelectCategory: (categoryId: ColoringCategoryId) => void;
  activeCategoryId: string;
}

export const ColoringCategoryGrid: React.FC<ColoringCategoryGridProps> = ({
  onSelectCategory,
  activeCategoryId,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-lg sm:text-xl font-extrabold text-[#F8FAFC]">
            Astronomy Coloring Library
          </h2>
          <p className="font-sans text-xs text-[#94A3B8]">
            Choose a cosmic theme to discover printable and colorable vector plates.
          </p>
        </div>
        <span className="font-mono text-xs text-[#38BDF8] font-bold">
          {COLORING_CATEGORIES.length} Categories
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLORING_CATEGORIES.map((cat) => {
          const isActive = activeCategoryId === cat.id;

          return (
            <GlassCard
              key={cat.id}
              variant="interactive"
              onClick={() => onSelectCategory(cat.id)}
              className={`group p-4 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left ${
                isActive
                  ? 'border-[#38BDF8] bg-[#0C1B33]/90 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'border-white/10 bg-[#070C1B]/80 hover:bg-[#0B1528]/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#38BDF8]">
                    {cat.itemCount} Plates
                  </span>
                </div>

                <h3 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                  {cat.shortTitle}
                </h3>

                <p className="mt-1 font-sans text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-1 font-semibold">
                  <Sparkles className="h-3 w-3" />
                  <span>Explore</span>
                </span>

                <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#38BDF8] group-hover:translate-x-1 transition-transform">
                  <span>Browse</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
