import React from 'react';

export interface StardustParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  char: string;
}

interface LauraFlightTrailProps {
  particles: StardustParticle[];
}

/**
 * Subtle Celestial Stardust Trail (Phase 6D)
 * Emits restrained, glittering particle sparkles behind LAURA during flight
 */
export const LauraFlightTrail: React.FC<LauraFlightTrailProps> = ({ particles }) => {
  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute select-none font-serif text-[#FDE047] drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] transition-all duration-500"
          style={{
            left: p.x,
            top: p.y,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) scale(${p.scale})`,
            fontSize: '11px',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};

