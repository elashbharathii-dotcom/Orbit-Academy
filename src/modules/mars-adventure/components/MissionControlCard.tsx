import React from 'react';
import { Radio, Signal } from 'lucide-react';

interface MissionControlCardProps {
  onClick?: () => void;
  className?: string;
}

export const MissionControlCard: React.FC<MissionControlCardProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`glass-card clip-corner group inline-flex max-w-md items-center gap-4 px-6 py-5 transition hover:bg-white/12 text-left cursor-pointer ${className}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EE3F2C] text-white transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(238,63,44,0.5)]">
        <Radio className="h-5 w-5 animate-pulse" strokeWidth={2} aria-hidden />
      </span>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold leading-snug text-white group-hover:text-white transition">
            Contact Mission Control
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
            <Signal className="h-2.5 w-2.5" />
            LIVE
          </span>
        </div>
        <span className="text-xs text-white/60 group-hover:text-white/80 transition">
          Direct Comms with Flight Directorate & Support
        </span>
      </div>
    </button>
  );
};

export default MissionControlCard;
