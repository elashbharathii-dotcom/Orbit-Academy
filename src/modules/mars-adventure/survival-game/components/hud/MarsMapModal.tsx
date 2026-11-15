import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Map,
  X,
  Navigation,
  Crosshair,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const MarsMapModal: React.FC = () => {
  const isMapModalOpen = useMarsGameStore((state) => state.isMapModalOpen);
  const closeMapModal = useMarsGameStore((state) => state.closeMapModal);
  const playerPosition = useMarsGameStore((state) => state.playerPosition);
  const roverPosition = useMarsGameStore((state) => state.roverPosition);
  const landmarks = useMarsGameStore((state) => state.landmarks);
  const navTarget = useMarsGameStore((state) => state.navTarget);
  const setNavTarget = useMarsGameStore((state) => state.setNavTarget);
  const activeWorldEvent = useMarsGameStore((state) => state.activeWorldEvent);
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);

  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);

  if (!isMapModalOpen) return null;

  // Coordinate mapping:
  // World coordinates range from -180 to +180 on X (West-East) and Z (North-South).
  // Map SVG canvas is 600 x 600 px.
  // mapX = ((x + 180) / 360) * 600
  // mapY = ((z + 180) / 360) * 600
  const worldToMap = (x: number, z: number): [number, number] => {
    const mx = ((x + 180) / 360) * 600;
    const my = ((z + 180) / 360) * 600;
    return [Math.max(10, Math.min(590, mx)), Math.max(10, Math.min(590, my))];
  };

  const mapToWorld = (mx: number, my: number): [number, number] => {
    const wx = (mx / 600) * 360 - 180;
    const wz = (my / 600) * 360 - 180;
    return [Math.round(wx), Math.round(wz)];
  };

  const [playerMapX, playerMapY] = worldToMap(playerPosition[0], playerPosition[2]);
  const [roverMapX, roverMapY] = worldToMap(roverPosition[0], roverPosition[2]);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 600;
    const clickY = ((e.clientY - rect.top) / rect.height) * 600;
    const [wx, wz] = mapToWorld(clickX, clickY);

    setNavTarget({
      x: wx,
      z: wz,
      name: `Waypoint [${wx}, ${wz}]`,
    });
  };

  const selectedLandmark = landmarks.find((l) => l.id === selectedLandmarkId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-mono select-none">
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[820px] bg-zinc-950/95 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden text-zinc-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-cyan-500/30 bg-zinc-900/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
              <Map className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-wider text-cyan-300">
                  JEZERO CRATER • SATELLITE RADAR TOPOGRAPHIC SURVEY
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                  GRID SCALE 360m × 360m • 8 PLANETARY REGIONS
                </span>
              </div>
              <div className="text-xs text-zinc-400 flex items-center space-x-3 mt-0.5">
                <span>ASTRONAUT: [{playerPosition[0].toFixed(1)}, {playerPosition[2].toFixed(1)}]</span>
                <span className="text-zinc-600">•</span>
                <span>ROVER: [{roverPosition[0].toFixed(1)}, {roverPosition[2].toFixed(1)}]</span>
                <span className="text-zinc-600">•</span>
                {navTarget ? (
                  <span className="text-amber-400 flex items-center space-x-1 font-bold">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>
                      NAV WAYPOINT: {navTarget.name} [{navTarget.x}, {navTarget.z}] (
                      {Math.round(
                        Math.hypot(
                          (controlMode === 'driving_rover' ? roverPosition[0] : playerPosition[0]) - navTarget.x,
                          (controlMode === 'driving_rover' ? roverPosition[2] : playerPosition[2]) - navTarget.z
                        )
                      )}m)
                    </span>
                  </span>
                ) : (
                  <span className="text-zinc-500">NO WAYPOINT PINNED (CLICK MAP TO PIN)</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={closeMapModal}
            className="p-1.5 rounded-lg border border-zinc-700 hover:border-cyan-400 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-12 min-h-0 divide-x divide-zinc-800">
          {/* Left: Interactive SVG Radar Map */}
          <div className="col-span-8 p-4 flex flex-col items-center justify-center bg-zinc-950/80 relative overflow-hidden">
            <div className="relative w-full aspect-square max-w-[540px] border border-cyan-500/30 rounded-xl overflow-hidden bg-[#0A0D14] shadow-inner">
              <svg
                viewBox="0 0 600 600"
                className="w-full h-full cursor-crosshair"
                onClick={handleMapClick}
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="37.5" height="37.5" patternUnits="userSpaceOnUse">
                    <path d="M 37.5 0 L 0 0 0 37.5" fill="none" stroke="#1E293B" strokeWidth="0.8" />
                  </pattern>
                  <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.08" />
                    <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.7" />
                  </radialGradient>
                </defs>

                {/* Radar Gradient Background */}
                <rect width="600" height="600" fill="url(#radarSweep)" />
                <rect width="600" height="600" fill="url(#grid)" />

                {/* Topographic Elevation Rings (36m, 72m, 108m, 144m) */}
                <circle cx="300" cy="300" r="60" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
                <circle cx="300" cy="300" r="120" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <circle cx="300" cy="300" r="180" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="5 5" opacity="0.25" />
                <circle cx="300" cy="300" r="240" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" />

                {/* 1. Central Jezero Basin Perimeter */}
                <circle cx="300" cy="300" r="65" fill="#9A3412" fillOpacity="0.08" stroke="#06B6D4" strokeWidth="1.2" strokeDasharray="3 3" />
                <text x="245" y="285" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.6">
                  CENTRAL BASIN
                </text>

                {/* 2. Eastern Mawrth Canyon Pass & Navigable Wadi */}
                <path
                  d="M 370 240 L 590 240 L 590 360 L 370 360 Z"
                  fill="#B45309"
                  fillOpacity="0.08"
                  stroke="#D97706"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                {/* Canyon Flat Sandy Wadi Road */}
                <line x1="370" y1="300" x2="590" y2="300" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.5" />
                <text x="420" y="290" fill="#FBBF24" fontSize="9" fontFamily="monospace" opacity="0.8">
                  MAWRTH CANYON (WADI PASS)
                </text>

                {/* 3. Crater Borealis Impact Basin & Secondary Crater */}
                <circle cx="300" cy="387" r="24" fill="#78350F" fillOpacity="0.15" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="300" cy="387" r="11" fill="#1C1917" fillOpacity="0.3" stroke="#EF4444" strokeWidth="0.8" />
                <text x="315" y="420" fill="#F87171" fontSize="9" fontFamily="monospace" opacity="0.8">
                  CRATER BOREALIS
                </text>
                <circle cx="347" cy="442" r="14" fill="#78350F" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" />

                {/* 4. Noctis Valley Rift Depression (South) */}
                <path
                  d="M 230 420 Q 300 450 370 420 L 390 580 L 210 580 Z"
                  fill="#7C2D12"
                  fillOpacity="0.08"
                  stroke="#9A3412"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text x="250" y="520" fill="#FB923C" fontSize="9" fontFamily="monospace" opacity="0.7">
                  NOCTIS VALLEY RIFT
                </text>

                {/* 5. West Jezero Delta Escarpment */}
                <path
                  d="M 170 260 Q 230 300 240 350 Q 180 390 140 340 Z"
                  fill="#0284C7"
                  fillOpacity="0.1"
                  stroke="#0284C7"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text x="145" y="320" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.8">
                  JEZERO DELTA
                </text>

                {/* 6. Syrtis Basalt Field & Subterranean Lava Tube System */}
                <path
                  d="M 180 180 L 270 180 L 270 270 L 180 270 Z"
                  fill="#451A03"
                  fillOpacity="0.12"
                  stroke="#8B5CF6"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                {/* Subterranean Lava Tube Tunnel Path (Surface entrance [242, 230] to deep vault [250, 187]) */}
                <line x1="242" y1="230" x2="250" y2="187" stroke="#A78BFA" strokeWidth="3" strokeDasharray="5 3" opacity="0.8" />
                <circle cx="250" cy="187" r="10" fill="#7C3AED" fillOpacity="0.3" stroke="#A78BFA" strokeWidth="1.5" />
                <text x="185" y="245" fill="#C4B5FD" fontSize="9" fontFamily="monospace" opacity="0.85">
                  LAVA TUBE CAVE SYSTEM
                </text>

                {/* 7. Elysium Barchan Dunes (North-West) */}
                <path
                  d="M 130 110 Q 200 130 250 170 L 190 220 L 110 180 Z"
                  fill="#EA580C"
                  fillOpacity="0.08"
                  stroke="#EA580C"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x="135" y="150" fill="#FDBA74" fontSize="9" fontFamily="monospace" opacity="0.7">
                  ELYSIUM DUNES
                </text>

                {/* 8. Ares Mountain Ridge (North-East) */}
                <path
                  d="M 375 120 L 530 120 L 530 230 L 375 230 Z"
                  fill="#C2410C"
                  fillOpacity="0.08"
                  stroke="#C2410C"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x="400" y="170" fill="#FCA5A5" fontSize="9" fontFamily="monospace" opacity="0.7">
                  ARES HIGHLAND RIDGE
                </text>

                {/* Axes and Compass Cardinal Markers */}
                <line x1="300" y1="0" x2="300" y2="600" stroke="#06B6D4" strokeWidth="0.8" opacity="0.25" />
                <line x1="0" y1="300" x2="600" y2="300" stroke="#06B6D4" strokeWidth="0.8" opacity="0.25" />
                <text x="305" y="20" fill="#06B6D4" fontSize="12" fontWeight="bold">N (-Z)</text>
                <text x="305" y="590" fill="#06B6D4" fontSize="12" fontWeight="bold">S (+Z)</text>
                <text x="15" y="315" fill="#06B6D4" fontSize="12" fontWeight="bold">W (-X)</text>
                <text x="565" y="315" fill="#06B6D4" fontSize="12" fontWeight="bold">E (+X)</text>

                {/* Outpost Alpha Center Hub [0, 0] */}
                <g transform="translate(300, 300)">
                  <circle r="14" fill="#06B6D4" fillOpacity="0.2" stroke="#00F0FF" strokeWidth="1.8" />
                  <rect x="-6" y="-6" width="12" height="12" fill="#00F0FF" />
                  <text x="18" y="4" fill="#00F0FF" fontSize="11" fontWeight="bold">
                    OUTPOST ALPHA [0, 0]
                  </text>
                </g>

                {/* Exploration Landmarks */}
                {landmarks.map((lm) => {
                  const [lx, ly] = worldToMap(lm.coordinates[0], lm.coordinates[2]);
                  const isSel = lm.id === selectedLandmarkId;

                  return (
                    <g
                      key={lm.id}
                      transform={`translate(${lx}, ${ly})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLandmarkId(lm.id);
                        setNavTarget({
                          x: lm.coordinates[0],
                          z: lm.coordinates[2],
                          name: lm.name,
                        });
                      }}
                      className="cursor-pointer"
                    >
                      {/* Discovery proximity ring */}
                      <circle
                        r="22"
                        fill="none"
                        stroke={lm.discovered ? '#10B981' : '#F59E0B'}
                        strokeWidth="1.2"
                        strokeDasharray={lm.discovered ? 'none' : '3 3'}
                        opacity={isSel ? '0.9' : '0.4'}
                      />
                      {/* Center Node Marker */}
                      <circle
                        r="7"
                        fill={lm.discovered ? '#10B981' : '#F59E0B'}
                        stroke="#000"
                        strokeWidth="1.5"
                      />
                      <text
                        x="10"
                        y="4"
                        fill={lm.discovered ? '#34D399' : '#FBBF24'}
                        fontSize="10"
                        fontWeight="bold"
                        opacity={isSel ? '1.0' : '0.8'}
                      >
                        {lm.name.split(' (')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Dynamic World Event Beacon if active */}
                {activeWorldEvent?.coordinates && (
                  <g transform={`translate(${worldToMap(activeWorldEvent.coordinates[0], activeWorldEvent.coordinates[2])[0]}, ${worldToMap(activeWorldEvent.coordinates[0], activeWorldEvent.coordinates[2])[1]})`}>
                    <circle r="30" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="2" className="animate-ping" />
                    <circle r="8" fill="#EF4444" />
                    <text x="12" y="4" fill="#F87171" fontSize="10" fontWeight="bold">
                      EVENT: {activeWorldEvent.title}
                    </text>
                  </g>
                )}

                {/* Rover Position (Amber Marker) */}
                <g transform={`translate(${roverMapX}, ${roverMapY})`}>
                  <rect x="-8" y="-8" width="16" height="16" fill="#F59E0B" stroke="#000" strokeWidth="1.5" rx="3" />
                  <circle r="3" fill="#000" />
                  <text x="12" y="4" fill="#F59E0B" fontSize="10" fontWeight="bold">
                    ROVER
                  </text>
                </g>

                {/* Player Position (Cyan Dot + Radar Pulse) */}
                <g transform={`translate(${playerMapX}, ${playerMapY})`}>
                  <circle r="14" fill="#00F0FF" fillOpacity="0.3" stroke="#00F0FF" strokeWidth="1.5" className="animate-ping" />
                  <circle r="6" fill="#00F0FF" stroke="#000" strokeWidth="1.5" />
                  <text x="12" y="4" fill="#00F0FF" fontSize="11" fontWeight="bold">
                    EVA SUIT
                  </text>
                </g>

                {/* Navigation Target Waypoint (Pulsing Crosshair) */}
                {navTarget && (
                  <g transform={`translate(${worldToMap(navTarget.x, navTarget.z)[0]}, ${worldToMap(navTarget.x, navTarget.z)[1]})`}>
                    <circle r="16" fill="none" stroke="#F59E0B" strokeWidth="2" className="animate-ping" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#F59E0B" strokeWidth="2" />
                    <text x="14" y="-8" fill="#F59E0B" fontSize="11" fontWeight="bold">
                      WAYPOINT
                    </text>
                  </g>
                )}
              </svg>

              {/* In-Map Helper Notice */}
              <div className="absolute bottom-2 left-3 text-[10px] text-zinc-400 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800">
                Click map to pin custom navigation waypoint. Click landmark to lock telemetry.
              </div>
            </div>
          </div>

          {/* Right: Landmark Dossiers & Navigation Control Panel */}
          <div className="col-span-4 p-4 flex flex-col min-h-0 bg-zinc-900/40 overflow-y-auto space-y-4">
            {/* Active Waypoint Panel */}
            <div className="p-3.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-xs font-semibold text-cyan-300 flex items-center justify-between mb-2">
                <span className="flex items-center space-x-1.5">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>ACTIVE VISOR NAV WAYPOINT</span>
                </span>
                {navTarget && (
                  <button
                    onClick={() => setNavTarget(null)}
                    className="text-[10px] text-zinc-400 hover:text-red-400"
                  >
                    CLEAR
                  </button>
                )}
              </div>
              {navTarget ? (
                <div className="text-xs text-zinc-300 space-y-1">
                  <div className="font-bold text-amber-300">{navTarget.name}</div>
                  <div className="text-[11px] text-zinc-400">
                    Coordinates: [{navTarget.x}, {navTarget.z}]
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    Range: ~
                    {Math.round(
                      Math.hypot(
                        (controlMode === 'driving_rover' ? roverPosition[0] : playerPosition[0]) - navTarget.x,
                        (controlMode === 'driving_rover' ? roverPosition[2] : playerPosition[2]) - navTarget.z
                      )
                    )}{' '}
                    meters (conforming to Jezero terrain)
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-500">
                  No waypoint active. Select a landmark below or click on the radar grid to deploy a guidance beacon.
                </div>
              )}
            </div>

            {/* Landmarks List */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center justify-between">
                <span>SURFACE LANDMARKS ({landmarks.length})</span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  {landmarks.filter((l) => l.discovered).length} DISCOVERED
                </span>
              </div>
              <div className="space-y-2">
                {landmarks.map((lm) => {
                  const isSel = lm.id === selectedLandmarkId;
                  const isCurNav = navTarget?.x === lm.coordinates[0] && navTarget?.z === lm.coordinates[2];
                  const dist = Math.round(
                    Math.hypot(
                      (controlMode === 'driving_rover' ? roverPosition[0] : playerPosition[0]) - lm.coordinates[0],
                      (controlMode === 'driving_rover' ? roverPosition[2] : playerPosition[2]) - lm.coordinates[2]
                    )
                  );

                  return (
                    <div
                      key={lm.id}
                      onClick={() => {
                        setSelectedLandmarkId(lm.id);
                        setNavTarget({
                          x: lm.coordinates[0],
                          z: lm.coordinates[2],
                          name: lm.name,
                        });
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isCurNav
                          ? 'border-amber-400 bg-amber-950/25 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : isSel
                          ? 'border-cyan-400 bg-cyan-950/30'
                          : lm.discovered
                          ? 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                          : 'border-zinc-800/60 bg-zinc-950/30 opacity-70 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {lm.discovered ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          )}
                          <span className="font-bold text-zinc-100 truncate">{lm.name}</span>
                        </div>
                        <span className="text-zinc-500 font-mono text-[10px]">{dist}m</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{lm.description}</div>
                      <div className="flex items-center justify-between mt-1.5 text-[10px]">
                        <span className="font-mono text-zinc-500">[{lm.coordinates[0]}, {lm.coordinates[2]}]</span>
                        {isCurNav && (
                          <span className="text-amber-400 font-bold flex items-center space-x-1">
                            <Crosshair className="w-3 h-3" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Landmark Details */}
            {selectedLandmark && (
              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/70 text-xs space-y-2">
                <div className="font-bold text-cyan-300">{selectedLandmark.name}</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">{selectedLandmark.description}</div>
                {selectedLandmark.hasSample && (
                  <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Scientific core specimen ready for recovery [E].</span>
                  </div>
                )}
                <button
                  onClick={() =>
                    setNavTarget({
                      x: selectedLandmark.coordinates[0],
                      z: selectedLandmark.coordinates[2],
                      name: selectedLandmark.name,
                    })
                  }
                  className="w-full py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs uppercase transition-all"
                >
                  SET AS VISOR WAYPOINT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
