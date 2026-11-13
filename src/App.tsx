import React, { useState } from 'react';
import { SolarSystemCanvas } from './components/canvas/SolarSystemCanvas';
import { MissionHUD } from './components/hud/MissionHUD';

/**
 * ORBIT ACADEMY — 3D Solar System Mission Control Root
 * Phase 2 Milestone: Immersive 3D Solar System Engine
 */
export default function App(): React.JSX.Element {
  // Global orbital speed multiplier (0 = paused, 0.45 = standard 1x)
  const [speedScale, setSpeedScale] = useState<number>(0.45);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05070D] font-sans text-[#F8FAFC]">
      {/* 1. Full-bleed Interactive 3D WebGL Canvas */}
      <SolarSystemCanvas speedScale={speedScale} />

      {/* 2. Floating Mission Control Telemetry HUD */}
      <MissionHUD
        speedScale={speedScale}
        onSpeedChange={setSpeedScale}
      />
    </div>
  );
}
