import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { Navigation2 } from 'lucide-react';

export const CompassRadar: React.FC = () => {
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const resourceNodes = useMarsGameStore((state) => state.resourceNodes);
  const visorActive = useMarsGameStore((state) => state.settings.visorScanActive);

  // Distance to Hab ([0, 0, 0])
  const distToHab = Math.round(Math.hypot(playerPos[0] - 0, playerPos[2] - 0));
  // Distance to Rover
  const distToRover = Math.round(Math.hypot(playerPos[0] - roverPos[0], playerPos[2] - roverPos[2]));

  // Radar scale (radar radius represents 50m)
  const RADAR_RADIUS_M = 50;
  const RADAR_PX = 54; // radius in pixels

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-white/10 bg-[#0A0F1D]/85 p-3 backdrop-blur-xl shadow-2xl font-mono text-xs">
      <div className="mb-2 flex w-full items-center justify-between border-b border-white/10 pb-1 text-[10px] text-slate-400">
        <span className="flex items-center gap-1 font-bold text-sky-400">
          <Navigation2 className="h-3 w-3 fill-current" /> RADAR
        </span>
        <span>RANGE: 50m</span>
      </div>

      {/* Radar Circle */}
      <div className="relative h-28 w-28 rounded-full border border-sky-500/30 bg-[#050B14]/90 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Radar Range Rings */}
        <div className="absolute h-20 w-20 rounded-full border border-sky-500/20" />
        <div className="absolute h-10 w-10 rounded-full border border-sky-500/20" />

        {/* Crosshairs */}
        <div className="absolute h-full w-[1px] bg-sky-500/15" />
        <div className="absolute h-[1px] w-full bg-sky-500/15" />

        {/* Radar Sweeping Beam */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.25)_360deg)] animate-spin [animation-duration:3s]" />

        {/* Center: Player dot */}
        <div className="z-10 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white]" />

        {/* Habitat Alpha Marker (position: [0, 0, 0]) */}
        {(() => {
          const relX = (0 - playerPos[0]) / RADAR_RADIUS_M;
          const relZ = (0 - playerPos[2]) / RADAR_RADIUS_M;
          if (Math.hypot(relX, relZ) <= 1.0) {
            const px = relX * RADAR_PX;
            const pz = relZ * RADAR_PX;
            return (
              <div
                title="Habitat Alpha"
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]"
                style={{
                  left: `calc(50% + ${px}px)`,
                  top: `calc(50% + ${pz}px)`,
                }}
              />
            );
          }
          return null;
        })()}

        {/* Rover Marker */}
        {(() => {
          const relX = (roverPos[0] - playerPos[0]) / RADAR_RADIUS_M;
          const relZ = (roverPos[2] - playerPos[2]) / RADAR_RADIUS_M;
          if (Math.hypot(relX, relZ) <= 1.0) {
            const px = relX * RADAR_PX;
            const pz = relZ * RADAR_PX;
            return (
              <div
                title="Mars Rover"
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-amber-400 shadow-[0_0_6px_#FBBF24]"
                style={{
                  left: `calc(50% + ${px}px)`,
                  top: `calc(50% + ${pz}px)`,
                }}
              />
            );
          }
          return null;
        })()}

        {/* Resource Node Markers */}
        {resourceNodes.map((node) => {
          if (node.depleted) return null;
          const relX = (node.position[0] - playerPos[0]) / RADAR_RADIUS_M;
          const relZ = (node.position[2] - playerPos[2]) / RADAR_RADIUS_M;
          if (Math.hypot(relX, relZ) <= 1.0) {
            const px = relX * RADAR_PX;
            const pz = relZ * RADAR_PX;
            return (
              <div
                key={node.id}
                className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  node.type === 'water_ice' ? 'bg-cyan-400' : 'bg-orange-400'
                } ${visorActive ? 'animate-ping' : ''}`}
                style={{
                  left: `calc(50% + ${px}px)`,
                  top: `calc(50% + ${pz}px)`,
                }}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Target Telemetry Readouts */}
      <div className="mt-2 flex w-full flex-col gap-1 text-[10px] text-slate-300">
        <div className="flex justify-between">
          <span className="text-emerald-400 font-semibold">HAB ALPHA:</span>
          <span>{distToHab}m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-amber-400 font-semibold">ROVER:</span>
          <span>{distToRover}m</span>
        </div>
      </div>
    </div>
  );
};
