import React from 'react';
import { QuizCategoryMeta } from './quizData';

interface GlassCategoryCardProps {
  category: QuizCategoryMeta;
  questionCount: number;
  isSelected: boolean;
  isAnySelected: boolean;
  onSelect: (id: string) => void;
}

export const GlassCategoryCard: React.FC<GlassCategoryCardProps> = ({
  category,
  questionCount,
  isSelected,
  isAnySelected,
  onSelect,
}) => {
  const isDimmed = isAnySelected && !isSelected;

  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      data-testid={`category-card-${category.id}`}
      style={{
        boxShadow: isSelected
          ? `0 0 30px ${category.glowColor}, 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
          : undefined,
      }}
      className={`group relative overflow-hidden rounded-2xl p-4.5 flex flex-col items-center justify-between text-center min-h-[155px] cursor-pointer transition-all duration-300 transform backdrop-blur-2xl ${
        isSelected
          ? 'scale-[1.04] -translate-y-1.5 border-2 z-10'
          : 'border border-white/[0.12] hover:-translate-y-2 hover:scale-[1.03] hover:border-white/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
      } ${
        isDimmed
          ? 'opacity-70 hover:opacity-100'
          : 'opacity-100'
      }`}
    >
      {/* Dynamic Frosted Glass Background with Category Tint */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isSelected
            ? `radial-gradient(circle at 50% 20%, ${category.glowColor}, rgba(11, 18, 38, 0.85) 75%)`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 60%, ${category.glowColor} 100%)`,
        }}
      />

      {/* Moving Glass Shimmer / Light Sheen across surface */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45 animate-shimmer-sweep" />
      </div>

      {/* Selected Neon Border Ring */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl border-2 pointer-events-none animate-pulse"
          style={{ borderColor: category.accentColor }}
        />
      )}

      {/* Top Beacon Status Indicator */}
      <div className="w-full flex items-center justify-between relative z-10">
        <span
          className="font-mono text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border transition-colors"
          style={{
            borderColor: isSelected ? category.accentColor : 'rgba(255,255,255,0.1)',
            backgroundColor: isSelected ? `${category.accentColor}20` : 'rgba(255,255,255,0.03)',
            color: isSelected ? '#FFFFFF' : '#94A3B8',
          }}
        >
          {category.badge}
        </span>

        {isSelected ? (
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: category.accentColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: category.accentColor }}
            />
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors" />
        )}
      </div>

      {/* Floating Animated Planet / Category Icon */}
      <div className="my-2 relative z-10 transform transition-transform duration-300 group-hover:scale-125">
        <span className="text-4xl inline-block animate-float-gentle filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          {category.icon}
        </span>
      </div>

      {/* Category Title & Challenge Count */}
      <div className="w-full relative z-10">
        <span
          className={`block font-sans text-xs font-bold leading-tight tracking-wide transition-colors ${
            isSelected ? 'text-white' : 'text-[#E2E8F0] group-hover:text-white'
          }`}
        >
          {category.label}
        </span>
        <span
          className="block mt-1 font-mono text-[10px] transition-colors"
          style={{ color: isSelected ? category.accentColor : '#94A3B8' }}
        >
          {questionCount} {questionCount === 1 ? 'Challenge' : 'Challenges'}
        </span>
      </div>

      {/* Subtle Bottom Ambient Glow Line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-[1px] transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${category.accentColor}, transparent)`,
          opacity: isSelected ? 1 : 0.2,
        }}
      />
    </button>
  );
};

