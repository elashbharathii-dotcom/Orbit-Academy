import React from 'react';
import { SpacecraftFlightState } from '../types';

interface NavBallHUDProps {
  flightState: SpacecraftFlightState;
  size?: number;
}

export const NavBallHUD: React.FC<NavBallHUDProps> = ({
  flightState,
  size = 180,
}) => {
  const pitchDeg = Math.round((flightState.rotation.x * 180) / Math.PI);
  const yawDeg = Math.round((((flightState.rotation.y * 180) / Math.PI) % 360 + 360) % 360);
  const rollDeg = Math.round((flightState.rotation.z * 180) / Math.PI);

  // Velocity heading angles for Prograde Marker
  const vTotal = Math.sqrt(
    flightState.velocity.x * flightState.velocity.x +
    flightState.velocity.y * flightState.velocity.y +
    flightState.velocity.z * flightState.velocity.z
  ) || 0.1;

  const vPitchDeg = Math.asin(Math.max(-1, Math.min(1, flightState.velocity.y / vTotal))) * (180 / Math.PI);
  const vYawDeg = Math.atan2(flightState.velocity.x, flightState.velocity.z) * (180 / Math.PI);

  // Relative pitch/yaw offset for prograde relative to spacecraft nose
  const progradePitchOffset = Math.max(-45, Math.min(45, vPitchDeg - pitchDeg));
  const progradeYawOffset = Math.max(-45, Math.min(45, vYawDeg - yawDeg));

  // Retrograde is opposite
  const retrogradePitchOffset = -progradePitchOffset;
  const retrogradeYawOffset = -progradeYawOffset;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded-full border-2 border-cyan-500/40 bg-[#040816] shadow-[0_0_25px_rgba(6,182,212,0.25)] overflow-hidden select-none"
    >
      {/* Outer Heading Ring Bezel */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none z-30" />

      {/* Rotating Artificial Horizon Sphere Simulator */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `rotate(${-rollDeg}deg)`,
        }}
      >
        {/* Sky (Upper Cyan/Blue) & Ground (Lower Amber/Brown) Hemisphere */}
        <div
          className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 transition-transform duration-75"
          style={{
            transform: `translateY(${pitchDeg * 0.9}px)`,
          }}
        >
          {/* Sky Hemisphere */}
          <div className="w-full h-1/2 bg-gradient-to-b from-[#0369a1] via-[#0284c7] to-[#38bdf8]/40 border-b-2 border-white" />

          {/* Ground / Nadir Hemisphere */}
          <div className="w-full h-1/2 bg-gradient-to-t from-[#451a03] via-[#78350f] to-[#b45309]/50" />

          {/* Pitch Ladder Rungs */}
          {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg) => (
            <div
              key={deg}
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 font-mono text-[9px] text-white/90"
              style={{
                top: `calc(50% - ${deg * 1.8}px)`,
              }}
            >
              <div className="w-3 h-[1px] bg-white/70" />
              <span>{Math.abs(deg)}°</span>
              <div className="w-3 h-[1px] bg-white/70" />
            </div>
          ))}
        </div>
      </div>

      {/* Center Fixed Aircraft Reticle Symbol (Orange Wings) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative flex items-center justify-center">
          {/* Left Wing */}
          <div className="w-6 h-[2.5px] bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
          {/* Center Pip */}
          <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 bg-transparent mx-1" />
          {/* Right Wing */}
          <div className="w-6 h-[2.5px] bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
        </div>
      </div>

      {/* Dynamic Flight Path Vectors: Prograde & Retrograde */}
      {/* 1. Prograde Vector Glyph (Circle with 3 fins) */}
      <div
        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-25 flex items-center justify-center transition-all duration-75"
        style={{
          left: `calc(50% + ${progradeYawOffset * 1.4}px)`,
          top: `calc(50% - ${progradePitchOffset * 1.4}px)`,
        }}
      >
        <div className="relative w-4 h-4 rounded-full border border-emerald-400 bg-emerald-400/20 shadow-[0_0_8px_#10b981] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-emerald-300" />
          {/* Top fin */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-emerald-400" />
          {/* Left fin */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1.5 h-[1px] bg-emerald-400" />
          {/* Right fin */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1.5 h-[1px] bg-emerald-400" />
        </div>
      </div>

      {/* 2. Retrograde Vector Glyph (Circle with internal cross) */}
      <div
        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-25 flex items-center justify-center transition-all duration-75"
        style={{
          left: `calc(50% + ${retrogradeYawOffset * 1.4}px)`,
          top: `calc(50% - ${retrogradePitchOffset * 1.4}px)`,
        }}
      >
        <div className="relative w-4 h-4 rounded-full border border-rose-400 bg-rose-400/20 shadow-[0_0_8px_#f43f5e] flex items-center justify-center">
          <div className="w-2.5 h-[1px] bg-rose-400" />
          <div className="h-2.5 w-[1px] bg-rose-400 absolute" />
        </div>
      </div>

      {/* Roll Indicator Pip at 12 o'clock */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-cyan-400 shadow-[0_0_6px_#22d3ee] z-30" />

      {/* Heading Tape Readout Pill at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 border border-white/20 font-mono text-[10px] text-cyan-300 font-bold z-30 tracking-wider">
        HDG {String(yawDeg).padStart(3, '0')}°
      </div>
    </div>
  );
};
