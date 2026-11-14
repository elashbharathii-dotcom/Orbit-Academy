import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { hasLineOfSight } from '../../systems/collisionSystem';
import { Scan, Sparkles, Droplets, Layers, Gem, Mountain, Wrench } from 'lucide-react';

export const ScannerOverlay: React.FC = () => {
  const visorScanActive = useMarsGameStore((state) => state.settings.visorScanActive);
  const resourceNodes = useMarsGameStore((state) => state.resourceNodes);
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const doorOpen = useMarsGameStore((state) => state.doorOpen);
  const openSubstanceModal = useMarsGameStore((state) => state.openSubstanceModal);

  if (!visorScanActive) return null;

  // Filter resources within 35m scan radius with line of sight check
  const detected = resourceNodes
    .filter((n) => !n.depleted)
    .map((node) => {
      const dist = Math.hypot(node.position[0] - playerPos[0], node.position[2] - playerPos[2]);
      const los = hasLineOfSight(playerPos, node.position, doorOpen);
      return { node, dist: Math.round(dist), inRange: dist <= 35 && los };
    })
    .filter((item) => item.inRange)
    .sort((a, b) => a.dist - b.dist);

  const getCategoryTheme = (type: string) => {
    switch (type) {
      case 'water_ice':
        return {
          color: 'text-cyan-400 border-cyan-400/50 bg-cyan-500/10',
          badge: 'bg-cyan-500/20 text-cyan-300',
          icon: <Droplets className="h-4 w-4 text-cyan-400" />,
        };
      case 'hematite':
        return {
          color: 'text-orange-400 border-orange-400/50 bg-orange-500/10',
          badge: 'bg-orange-500/20 text-orange-300',
          icon: <Layers className="h-4 w-4 text-orange-400" />,
        };
      case 'sulfur_mineral':
        return {
          color: 'text-emerald-400 border-emerald-400/50 bg-emerald-500/10',
          badge: 'bg-emerald-500/20 text-emerald-300',
          icon: <Gem className="h-4 w-4 text-emerald-400" />,
        };
      case 'regolith':
        return {
          color: 'text-amber-400 border-amber-400/50 bg-amber-500/10',
          badge: 'bg-amber-500/20 text-amber-300',
          icon: <Mountain className="h-4 w-4 text-amber-400" />,
        };
      case 'silicate_crystal':
        return {
          color: 'text-yellow-300 border-yellow-300/50 bg-yellow-500/10',
          badge: 'bg-yellow-500/20 text-yellow-300',
          icon: <Sparkles className="h-4 w-4 text-yellow-300" />,
        };
      default:
        return {
          color: 'text-slate-300 border-slate-300/50 bg-slate-500/10',
          badge: 'bg-slate-500/20 text-slate-300',
          icon: <Wrench className="h-4 w-4 text-slate-300" />,
        };
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 font-mono select-none overflow-hidden">
      {/* Holographic AR Scanning Grid lines across viewport */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,182,212,0.12)_100%)] pointer-events-none" />
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-[#0A0F1D]/85 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        <Scan className="h-4 w-4 text-cyan-400 animate-spin [animation-duration:8s]" />
        <span className="text-xs font-bold text-cyan-300">
          SPECTRAL SCANNER ACTIVE • RANGE: 35 METERS
        </span>
        <span className="rounded bg-cyan-400/20 px-2 py-0.5 text-[10px] font-black text-cyan-200">
          {detected.length} TARGETS IN RANGE
        </span>
      </div>

      {/* Detected Mineral Signatures List on Top-Right */}
      <div className="pointer-events-auto absolute top-28 right-6 flex flex-col gap-2 max-w-xs w-full max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        {detected.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 p-3 text-center text-xs text-slate-400 backdrop-blur-md">
            No mineral signatures within 35m. Traverse towards craters or dunes.
          </div>
        ) : (
          detected.map(({ node, dist }) => {
            const theme = getCategoryTheme(node.type);
            return (
              <div
                key={node.id}
                onClick={() =>
                  openSubstanceModal({
                    id: node.id,
                    name: node.name,
                    chemicalFormula: node.chemicalFormula,
                    category: node.category,
                    description: node.description,
                    scientificProperties: node.scientificProperties,
                    marsStationUsefulness: node.marsStationUsefulness,
                    canBeCollected: !node.depleted,
                    discoveryStatus: node.depleted ? 'Depleted' : 'Analyzed',
                  })
                }
                className={`group flex items-center justify-between rounded-2xl border p-3 backdrop-blur-md transition-all hover:scale-102 cursor-pointer shadow-lg ${theme.color}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
                    {theme.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {node.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{node.category}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${theme.badge}`}>
                    {dist}m
                  </span>
                  <span className="text-[9px] text-sky-400 underline mt-0.5">Click for Info [I]</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
