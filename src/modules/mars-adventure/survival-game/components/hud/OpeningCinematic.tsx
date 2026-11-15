import React, { useState, useEffect } from 'react';
import { Radio, ArrowRight, SkipForward } from 'lucide-react';
import { audioSystem } from '../../systems/audioSynthesizer';

interface OpeningCinematicProps {
  onComplete: () => void;
}

export const OpeningCinematic: React.FC<OpeningCinematicProps> = ({ onComplete }) => {
  const [slide, setSlide] = useState<number>(0);

  const slides = [
    {
      telemetry: 'TRANSMISSION LOSS DETECTED • LMST 05:48',
      headline: 'THE SQUALL IN JEZERO CRATER',
      body: 'A class-5 synoptic dust squall tore across Syrtis Major and descended into Jezero Crater with 140 km/h saltating basalt gusts. The high-gain parabolic antenna to Earth was ripped from its roof stanchion.',
    },
    {
      telemetry: 'AUXILIARY LIFE SUPPORT ONLINE • SOL 01',
      headline: 'OUTPOST ALPHA SEVERED',
      body: 'Automated pressure bulkheads slammed shut, isolating the central geodesic dome. The crew evacuated to the orbital ascent vehicle, but your airlock seals held. You are the sole operational astronaut remaining on the surface.',
    },
    {
      telemetry: 'MISSION MANDATE: SURVIVE & RESTORE',
      headline: 'THE LAST FRONTIER',
      body: 'With sub-zero temperatures dropping to -115°C tonight, battery reserves are critical. Step outside onto the red sands, extract volatile water ice, restore the engineering workshop, and establish a permanent foothold on Mars.',
    },
  ];

  useEffect(() => {
    audioSystem.playRadioTransmission();
  }, [slide]);

  const handleNext = () => {
    audioSystem.playCommBeep();
    if (slide < slides.length - 1) {
      setSlide((s) => s + 1);
    } else {
      audioSystem.playChapterFanfare();
      onComplete();
    }
  };

  const handleSkip = () => {
    audioSystem.playCommBeep();
    onComplete();
  };

  // Keyboard shortcut: Space / Enter to advance, Esc to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slide]);

  const current = slides[slide];

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in font-mono select-none">
      <div className="relative flex flex-col justify-between h-[80vh] max-h-[640px] w-full max-w-3xl overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-b from-[#180A0A] via-[#080B14] to-[#04060C] p-6 sm:p-10 shadow-[0_0_80px_rgba(239,68,68,0.3)]">
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-red-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold block">
                EXPEDITION PROLOGUE • {current.telemetry}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                PART {slide + 1} OF {slides.length}
              </span>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>SKIP [ESC]</span>
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Narrative Center */}
        <div className="my-auto space-y-4 py-6">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/30 bg-red-950/40 text-red-300 uppercase tracking-wider">
            NASA ARES-IV ARCHIVE
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide leading-tight">
            {current.headline}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-mono">
            {current.body}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === slide
                    ? 'w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2.5 rounded-2xl bg-red-600 px-6 py-3 font-mono text-xs sm:text-sm font-extrabold text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all hover:bg-red-500 hover:scale-105 active:scale-95"
          >
            <span>{slide < slides.length - 1 ? 'CONTINUE [SPACE]' : 'STEP ONTO MARS [ENTER]'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
