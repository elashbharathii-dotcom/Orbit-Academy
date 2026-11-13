import React from 'react';
import { LauraEmotion } from '../../data/lauraDialogues';

interface LauraStarProps {
  emotion: LauraEmotion;
  size?: number;
  onClick?: () => void;
}

/**
 * LAURA: Original Celestial Star Companion
 * Visual Features:
 * - Rounded organic golden star morphology with radial warmth
 * - Animated expressive vector face responding to 5 emotional states
 * - Soft pulsing corona and floating stardust sparklets
 * - Subtle vertical bobbing physics
 */
export const LauraStar: React.FC<LauraStarProps> = ({
  emotion,
  size = 56,
  onClick,
}) => {
  return (
    <div
      role="img"
      aria-label={`LAURA the AI Star Companion in ${emotion} mood`}
      onClick={onClick}
      className="group relative cursor-pointer select-none transition-transform duration-300 hover:scale-110 active:scale-95"
      style={{ width: size, height: size }}
    >
      {/* 1. Ambient Golden Radiance Aura (Pulsing Glow) */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-[#FDE047]/30 via-[#F59E0B]/40 to-[#D97706]/30 blur-md transition-all duration-500 animate-pulse"
        style={{
          boxShadow: emotion === 'celebrating' 
            ? '0 0 24px rgba(245, 158, 11, 0.65)' 
            : '0 0 16px rgba(245, 158, 11, 0.4)'
        }}
      />

      {/* 2. Delicate Floating Stardust Sparkles */}
      <div className="pointer-events-none absolute -inset-3">
        {/* Sparkle 1 */}
        <span
          className="absolute -top-1 right-1 text-[10px] text-[#FEF08A] transition-all duration-700 animate-ping opacity-75"
          style={{ animationDuration: '2.5s' }}
        >
          ✦
        </span>
        {/* Sparkle 2 */}
        <span
          className="absolute bottom-0 -left-1 text-[8px] text-[#FDE047] transition-all duration-700 animate-ping opacity-60"
          style={{ animationDuration: '3.2s' }}
        >
          ✧
        </span>
        {/* Sparkle 3 (Active during celebrating) */}
        {emotion === 'celebrating' && (
          <span className="absolute top-1/2 -right-3 text-[12px] text-[#F59E0B] animate-bounce">
            ★
          </span>
        )}
      </div>

      {/* 3. Star Vector Body with Expressive Face */}
      <svg
        viewBox="0 0 100 100"
        className={`relative h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-500 ${
          emotion === 'laughing'
            ? 'animate-bounce'
            : emotion === 'thinking'
            ? '-rotate-6'
            : 'animate-pulse'
        }`}
        style={{ animationDuration: emotion === 'laughing' ? '0.6s' : '3s' }}
      >
        <defs>
          {/* Radiant Solar Gradient */}
          <linearGradient id="lauraStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FEF08A" />
            <stop offset="65%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Cheerful Blush Glow */}
          <radialGradient id="lauraBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 5-Point Rounded Cute Star Silhouette */}
        <path
          d="M 50,8 
             C 54,26 62,34 78,38 
             C 62,48 58,60 62,80 
             C 48,70 42,70 30,80 
             C 34,60 30,48 14,38 
             C 30,34 38,26 50,8 Z"
          fill="url(#lauraStarGrad)"
          stroke="#FBBF24"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Soft Pastel Blush Cheeks */}
        <ellipse cx="36" cy="53" rx="5" ry="3.5" fill="url(#lauraBlush)" />
        <ellipse cx="64" cy="53" rx="5" ry="3.5" fill="url(#lauraBlush)" />

        {/* ===================================== */}
        {/* EXPRESSIVE EYES BY EMOTION */}
        {/* ===================================== */}
        {emotion === 'happy' ? (
          // Happy Crescent Eyes (^ ^)
          <g stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 33,48 Q 38,42 43,48" />
            <path d="M 57,48 Q 62,42 67,48" />
          </g>
        ) : emotion === 'laughing' ? (
          // Joyful Winking Eyes (> <)
          <g stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 34,44 L 42,48 L 34,52" />
            <path d="M 66,44 L 58,48 L 66,52" />
          </g>
        ) : emotion === 'celebrating' ? (
          // Star Eyes (★ ★)
          <g fill="#1E293B">
            <text x="32" y="52" fontSize="12" fontWeight="bold">★</text>
            <text x="56" y="52" fontSize="12" fontWeight="bold">★</text>
          </g>
        ) : emotion === 'thinking' ? (
          // Curious Looking-Up Eyes
          <g fill="#0F172A">
            <circle cx="39" cy="46" r="4.2" />
            <circle cx="41" cy="44" r="1.5" fill="#FFFFFF" />
            <circle cx="61" cy="46" r="4.2" />
            <circle cx="63" cy="44" r="1.5" fill="#FFFFFF" />
          </g>
        ) : (
          // Idle Friendly Big Catchlight Eyes
          <g fill="#0F172A">
            <circle cx="38" cy="48" r="4" />
            <circle cx="40" cy="46" r="1.5" fill="#FFFFFF" />
            <circle cx="62" cy="48" r="4" />
            <circle cx="64" cy="46" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* ===================================== */}
        {/* EXPRESSIVE MOUTH BY EMOTION */}
        {/* ===================================== */}
        {emotion === 'laughing' || emotion === 'celebrating' ? (
          // Wide Happy Open Mouth (D)
          <path
            d="M 43,56 Q 50,66 57,56 Z"
            fill="#7F1D1D"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ) : emotion === 'thinking' ? (
          // Cute Little Curious Mouth (o)
          <ellipse cx="50" cy="57" rx="2.5" ry="3" fill="#1E293B" />
        ) : emotion === 'happy' ? (
          // Gentle Happy Smile (‿)
          <path
            d="M 44,56 Q 50,62 56,56"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Gentle Neutral Smile
          <path
            d="M 45,56 Q 50,60 55,56"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};
