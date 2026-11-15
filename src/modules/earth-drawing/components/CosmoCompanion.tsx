import React, { useState, useEffect, useRef } from 'react';
import { StudioTool } from '../types';
import { COSMO_FACES, CosmoFaceMood, getCosmoQuoteForTool, getRandomCosmoQuote } from '../cosmoDialogue';
import { RefreshCw } from 'lucide-react';

interface CosmoCompanionProps {
  activeTool: StudioTool;
  isDrawing?: boolean;
}

export const CosmoCompanion: React.FC<CosmoCompanionProps> = ({ activeTool }) => {
  const [mood, setMood] = useState<CosmoFaceMood>('idle');
  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [badgeCategory, setBadgeCategory] = useState<'tip' | 'fact' | 'encouragement'>('tip');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const typingTimerRef = useRef<number | null>(null);

  // When activeTool changes, update Cosmo's dialogue
  useEffect(() => {
    const tip = getCosmoQuoteForTool(activeTool);
    triggerNewDialogue(tip, 'tip', 'thinking');
  }, [activeTool]);

  // Typewriter effect
  const triggerNewDialogue = (text: string, category: 'tip' | 'fact' | 'encouragement', newMood: CosmoFaceMood) => {
    setBadgeCategory(category);
    setMood(newMood);
    setDisplayedText('');
    setIsTyping(true);

    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
    }

    let charIndex = 0;
    typingTimerRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayedText(text.slice(0, charIndex));
      if (charIndex >= text.length) {
        if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
        setIsTyping(false);
        setTimeout(() => setMood('idle'), 1200);
      }
    }, 24);
  };

  // Click on Cosmo -> Hop animation + New encouraging fact or quote!
  const handleCosmoClick = () => {
    setIsBouncing(true);
    const random = getRandomCosmoQuote();
    triggerNewDialogue(random.text, random.category, 'happy');
    setTimeout(() => setIsBouncing(false), 600);
  };

  // Convert ASCII grid to pixel SVG rects
  const renderFaceSvg = (faceMatrix: string[]) => {
    const rects: React.ReactNode[] = [];
    faceMatrix.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === '#') {
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#0B0B0B"
            />
          );
        }
      }
    });

    return (
      <svg
        viewBox="0 0 12 8"
        className="w-16 h-12 object-contain"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {rects}
      </svg>
    );
  };

  return (
    <div className="relative flex flex-col items-start w-full transition-all">
      {/* Top Speech Bubble with Stepped Tail */}
      {!isCollapsed && (
        <div className="relative w-full mb-3 animate-fade-in">
          <div
            className="relative w-full bg-[#FFFFFF] border-2 border-[#0B0B0B] p-3 sm:p-4 text-[#0B0B0B] transition-transform"
            style={{
              boxShadow: '4px 4px 0 #0B0B0B',
            }}
          >
            {/* Header pill */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-dashed border-[#9A9A9A]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#0B0B0B] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">
                  COSMO // {badgeCategory.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCosmoClick}
                  title="New advice from Cosmo"
                  className="p-1 hover:bg-[#F1F1F0] active:translate-x-0.5 active:translate-y-0.5 border border-[#0B0B0B] transition-all text-[#0B0B0B]"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Typewritten Dialogue */}
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-[#0B0B0B] min-h-[2.8rem]">
              <span>{displayedText}</span>
              {isTyping && (
                <span className="inline-block w-2 h-3.5 ml-0.5 bg-[#0B0B0B] animate-pulse align-middle" />
              )}
            </p>

            {/* Stepped Pixel Bubble Tail */}
            <div
              className="absolute left-8 -bottom-[12px] w-3 h-3 bg-[#0B0B0B] pointer-events-none"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Cosmo Mascot Interactive Character Avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCosmoClick}
          title="Click Cosmo for advice & space facts!"
          className={`group relative flex items-center justify-center p-2.5 bg-[#FFFFFF] border-2 border-[#0B0B0B] cursor-pointer transition-all duration-150 ${
            isBouncing ? '-translate-y-2 scale-105' : 'hover:-translate-y-0.5 hover:-translate-x-0.5'
          }`}
          style={{
            boxShadow: isBouncing ? '6px 6px 0 #0B0B0B' : '4px 4px 0 #9A9A9A',
          }}
        >
          {/* Astronaut Helmet Antenna */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <span className="w-1.5 h-1.5 bg-[#00E5FF] border border-[#0B0B0B]" />
            <span className="w-0.5 h-1.5 bg-[#0B0B0B]" />
          </div>

          {/* Pixel Face Display */}
          <div className="bg-[#E2E2E0] p-1 border border-[#0B0B0B]">
            {renderFaceSvg(COSMO_FACES[mood])}
          </div>

          {/* Interactive Tag */}
          <span className="absolute -bottom-2 -right-2 px-1 py-0.5 bg-[#00E5FF] text-[#0B0B0B] font-mono text-[9px] font-black border border-[#0B0B0B]">
            AI
          </span>
        </button>

        <div className="flex flex-col">
          <span
            className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
            style={{ fontFamily: '"Silkscreen", monospace' }}
          >
            COSMO THE COMPANION
          </span>
          <span className="font-mono text-[10px] text-[#555555]">
            Click to interact &amp; learn
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="ml-auto text-[10px] font-mono text-[#555555] hover:text-[#0B0B0B] underline"
        >
          {isCollapsed ? 'Show Tips' : 'Hide Tips'}
        </button>
      </div>
    </div>
  );
};
