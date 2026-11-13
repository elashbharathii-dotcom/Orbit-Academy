import React from 'react';
import { SolarSystemCanvas } from '../../components/canvas/SolarSystemCanvas';
import { MissionHUD } from '../../components/hud/MissionHUD';

interface MissionControlScreenProps {
  speedScale: number;
  onSpeedChange: (speed: number) => void;
}

/**
 * Mission Control & Academy Home View (Phase 7)
 * Renders the full 3D interactive Solar System, cinematic camera navigation,
 * planetary telemetry HUD, quick-access dock, and planet dossier.
 */
export const MissionControlScreen: React.FC<MissionControlScreenProps> = ({
  speedScale,
  onSpeedChange,
}) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05070D]">
      {/* 1. Full-bleed Interactive 3D WebGL Canvas */}
      <SolarSystemCanvas speedScale={speedScale} />

      {/* 2. Floating Mission Control Telemetry HUD */}
      <MissionHUD
        speedScale={speedScale}
        onSpeedChange={onSpeedChange}
      />
    </div>
  );
};
