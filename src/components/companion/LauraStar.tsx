import React, { useState, useEffect } from 'react';
import { LauraEmotion } from '../../data/lauraDialogues';

interface LauraStarProps {
  emotion: LauraEmotion;
  size?: number;
  onClick?: () => void;
  isFlying?: boolean;
}

/**
 * LAURA 3.0: Premium Sculpted Celestial Mascot Character
 * 
 * Visual Architecture:
 * - Rounded, organically sculpted 5-point celestial star geometry
 * - Multi-layer dimensional shading (photometric rim light, soft specular crescent, gold core)
 * - Expressive large celestial eyes with pupils, dual catchlights, and natural blinking
 * - Dynamic emotive eyebrows and blush cheeks
 * - Sculpted emotive mouths across 5 distinct emotional states:
 *   idle, happy, thinking, laughing, celebrating
 * - Soft, restrained golden aura without excessive opaque bloom
 */
export const LauraStar: React.FC<LauraStarProps> = ({
  emotion,
  size = 64,
  onClick,
  isFlying = false,
}) => {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  // Natural intermittent blinking cycle (every 3.8 to 6.5 seconds)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const delay = 3500 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 180); // Blink duration
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      role="img"
      aria-label={`LAURA the Celestial AI Companion in ${emotion} mood`}
      onClick={onClick}
      className={`group relative cursor-pointer select-none transition-transform duration-300 hover:scale-105 active:scale-95 ${
        isFlying ? 'scale-y-110 scale-x-95' : ''
      }`}
      style={{ width: size, height: size }}
    >
      {/* 1. Soft Controlled Ambient Aura (Non-intrusive warm gold radiance) */}
      <div
        className="pointer-events-none absolute -inset-2.5 rounded-full bg-gradient-to-r from-[#FDE047]/25 via-[#F59E0B]/30 to-[#D97706]/20 blur-md transition-all duration-700"
        style={{
          boxShadow:
            emotion === 'celebrating'
              ? '0 0 22px rgba(245, 158, 11, 0.55)'
              : '0 0 14px rgba(245, 158, 11, 0.35)',
        }}
      />

      {/* 2. Delicate Golden Sparkle Accents */}
      <div className="pointer-events-none absolute -inset-2">
        <span
          className="absolute -top-1 right-0 text-[10px] text-[#FEF08A] opacity-70 transition-opacity"
          style={{ animation: 'pulse 2.8s infinite' }}
        >
          ✦
        </span>
        <span
          className="absolute bottom-0 -left-1 text-[8px] text-[#FDE047] opacity-60"
          style={{ animation: 'pulse 3.4s infinite' }}
        >
          ✧
        </span>
      </div>

      {/* 3. Sculpted 3D Vector Character Body */}
      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
      >
        <defs>
          {/* Main Dimensional Golden Material Gradient */}
          <linearGradient id="laura3BodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="20%" stopColor="#FDE68A" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Top-Light Specular Highlight Curve */}
          <linearGradient id="laura3Highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.0" />
          </linearGradient>

          {/* Cheerful Pastel Blush Cheeks */}
          <radialGradient id="laura3Blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#F43F5E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
          </radialGradient>

          {/* Deep Celestial Eye Gradient */}
          <linearGradient id="laura3EyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* --- Back Bevel Rim (Provides dimensional thickness) --- */}
        <path
          d="M 50,6 
             C 54,25 64,34 82,38 
             C 65,49 60,62 64,83 
             C 49,72 43,72 29,83 
             C 33,62 28,49 11,38 
             C 29,34 39,25 50,6 Z"
          fill="#92400E"
          opacity="0.5"
          transform="translate(0, 2)"
        />

        {/* --- Main 5-Point Rounded Golden Star Body --- */}
        <path
          d="M 50,6 
             C 54,25 64,34 82,38 
             C 65,49 60,62 64,83 
             C 49,72 43,72 29,83 
             C 33,62 28,49 11,38 
             C 29,34 39,25 50,6 Z"
          fill="url(#laura3BodyGrad)"
          stroke="#FDE68A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* --- Specular Crown Highlight Arc --- */}
        <path
          d="M 50,8 
             C 53,24 61,31 75,35 
             C 60,33 40,25 31,35
             C 40,26 46,18 50,8 Z"
          fill="url(#laura3Highlight)"
        />

        {/* --- Soft Pastel Blush Cheeks --- */}
        <ellipse cx="33" cy="54" rx="5.5" ry="3.8" fill="url(#laura3Blush)" />
        <ellipse cx="67" cy="54" rx="5.5" ry="3.8" fill="url(#laura3Blush)" />

        {/* ================================================================= */}
        {/* EXPRESSIVE EYEBROWS */}
        {/* ================================================================= */}
        {emotion === 'thinking' ? (
          // Curious Angled Eyebrows (one raised, one lowered)
          <g stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d="M 33,39 Q 39,37 43,41" />
            <path d="M 57,38 Q 62,35 68,37" />
          </g>
        ) : emotion === 'celebrating' ? (
          // Excited High Curved Eyebrows
          <g stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d="M 32,38 Q 38,34 44,38" />
            <path d="M 56,38 Q 62,34 68,38" />
          </g>
        ) : (
          // Gentle Cheerful Eyebrows
          <g stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M 34,40 Q 39,38 43,40" />
            <path d="M 57,40 Q 61,38 66,40" />
          </g>
        )}

        {/* ================================================================= */}
        {/* EXPRESSIVE EYES WITH NATURAL BLINKING & CATCHLIGHTS */}
        {/* ================================================================= */}
        {isBlinking ? (
          // Quick Natural Blink State (- -)
          <g stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 32,49 Q 38,53 44,49" />
            <path d="M 56,49 Q 62,53 68,49" />
          </g>
        ) : emotion === 'happy' ? (
          // Cheerful Crescent Eyes (^ ^)
          <g stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 32,49 Q 38,43 44,49" />
            <path d="M 56,49 Q 62,43 68,49" />
          </g>
        ) : emotion === 'laughing' ? (
          // Joyful Winking Eyes (> <)
          <g stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 33,45 L 42,49 L 33,53" />
            <path d="M 67,45 L 58,49 L 67,53" />
          </g>
        ) : emotion === 'celebrating' ? (
          // Gleaming Star Eyes (★ ★)
          <g fill="#0F172A">
            <text x="31" y="53" fontSize="13" fontWeight="bold">★</text>
            <text x="56" y="53" fontSize="13" fontWeight="bold">★</text>
          </g>
        ) : emotion === 'thinking' ? (
          // Curious Pondering Looking-Up Eyes
          <g>
            <ellipse cx="38" cy="46" rx="5.2" ry="5.8" fill="url(#laura3EyeGrad)" />
            <ellipse cx="62" cy="46" rx="5.2" ry="5.8" fill="url(#laura3EyeGrad)" />
            {/* Primary Catchlights (Looking upward toward cosmos) */}
            <circle cx="40" cy="44" r="2.2" fill="#FFFFFF" />
            <circle cx="36" cy="48" r="1.1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="64" cy="44" r="2.2" fill="#FFFFFF" />
            <circle cx="60" cy="48" r="1.1" fill="#FFFFFF" opacity="0.8" />
          </g>
        ) : (
          // Default Warm Expressive Eyes with Dual Catchlights
          <g>
            <ellipse cx="38" cy="48" rx="5.2" ry="5.8" fill="url(#laura3EyeGrad)" />
            <ellipse cx="62" cy="48" rx="5.2" ry="5.8" fill="url(#laura3EyeGrad)" />
            {/* Primary Large Sunlit Catchlights */}
            <circle cx="40" cy="46" r="2.2" fill="#FFFFFF" />
            <circle cx="36" cy="50" r="1.1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="64" cy="46" r="2.2" fill="#FFFFFF" />
            <circle cx="60" cy="50" r="1.1" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}

        {/* ================================================================= */}
        {/* EXPRESSIVE SCULPTED MOUTH */}
        {/* ================================================================= */}
        {emotion === 'laughing' || emotion === 'celebrating' ? (
          // Wide Joyful Open Mouth with Tongue Detail
          <g>
            <path
              d="M 43,56 Q 50,67 57,56 Z"
              fill="#881337"
              stroke="#0F172A"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Cute pink tongue */}
            <path
              d="M 46,62 Q 50,66 54,62 Q 50,59 46,62 Z"
              fill="#FB7185"
            />
          </g>
        ) : emotion === 'thinking' ? (
          // Cute Curious Inquisitive Mouth (o)
          <ellipse cx="50" cy="58" rx="2.6" ry="3.2" fill="#0F172A" />
        ) : emotion === 'happy' ? (
          // Warm Uplifting Gentle Smile
          <path
            d="M 43,57 Q 50,63 57,57"
            stroke="#0F172A"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Subtle Content Smile
          <path
            d="M 44,57 Q 50,61 56,57"
            stroke="#0F172A"
            strokeWidth="2.0"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};
