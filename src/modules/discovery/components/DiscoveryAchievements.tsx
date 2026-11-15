import React from 'react';
import { Trophy, CheckCircle2, Lock, Sparkles, X } from 'lucide-react';
import { CelestialId } from '../../../types';

export interface DiscoveryBadge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  iconName: string;
  isUnlocked: boolean;
}

interface DiscoveryAchievementsProps {
  isOpen: boolean;
  onClose: () => void;
  exploredPlanets: CelestialId[];
  journeysCount: number;
}

export const DiscoveryAchievements: React.FC<DiscoveryAchievementsProps> = ({
  isOpen,
  onClose,
  exploredPlanets,
  journeysCount,
}) => {
  if (!isOpen) return null;

  const hasInner = ['mercury', 'venus', 'earth', 'mars'].every((id) =>
    exploredPlanets.includes(id as CelestialId)
  );
  const hasGasGiants = ['jupiter', 'saturn'].every((id) =>
    exploredPlanets.includes(id as CelestialId)
  );
  const hasIceGiants = ['uranus', 'neptune'].every((id) =>
    exploredPlanets.includes(id as CelestialId)
  );
  const hasSun = exploredPlanets.includes('sun');
  const hasAceJourneys = journeysCount >= 3;
  const hasMasterAll = exploredPlanets.length >= 9;

  const BADGES: DiscoveryBadge[] = [
    {
      id: 'b-inner',
      title: 'Inner System Surveyor',
      description: 'Survey all four inner terrestrial worlds: Mercury, Venus, Earth, and Mars.',
      xpReward: 350,
      iconName: 'Globe',
      isUnlocked: hasInner,
    },
    {
      id: 'b-gas',
      title: 'Gas Giant Voyager',
      description: 'Chart the massive Jovian realms of Jupiter and ringed Saturn.',
      xpReward: 400,
      iconName: 'Layers',
      isUnlocked: hasGasGiants,
    },
    {
      id: 'b-ice',
      title: 'Ice Giant Navigator',
      description: 'Reach the distant aquamarine outposts of Uranus and supersonic Neptune.',
      xpReward: 450,
      iconName: 'Wind',
      isUnlocked: hasIceGiants,
    },
    {
      id: 'b-sun',
      title: 'Solar Heliophysicist',
      description: 'Observe Sol’s coronal loops and thermonuclear core dynamics.',
      xpReward: 300,
      iconName: 'Sun',
      isUnlocked: hasSun,
    },
    {
      id: 'b-journeys',
      title: 'Interplanetary Ace',
      description: 'Execute three or more complete 3D cinematic spacecraft flight transitions.',
      xpReward: 250,
      iconName: 'Rocket',
      isUnlocked: hasAceJourneys,
    },
    {
      id: 'b-grand',
      title: 'Grand Solar System Master',
      description: 'Complete exploration surveys across all nine celestial destinations.',
      xpReward: 1000,
      iconName: 'Award',
      isUnlocked: hasMasterAll,
    },
  ];

  const totalEarnedXp = BADGES.filter((b) => b.isUnlocked).reduce(
    (acc, b) => acc + b.xpReward,
    0
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[#070C1B] p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/20 text-[#F59E0B]">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#F59E0B]">
                CADET EXPLORATION DOSSIER
              </span>
              <h2 className="font-sans text-xl font-black">
                Discovery Badges & Achievements
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Overview Bar */}
        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#030611] p-4 font-mono text-xs">
          <div>
            <span className="text-[#94A3B8] block">Planetary Surveys:</span>
            <span className="text-base font-bold text-white">
              {exploredPlanets.length} / 9 Worlds Charted
            </span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div>
            <span className="text-[#94A3B8] block">Flight Journeys:</span>
            <span className="text-base font-bold text-[#38BDF8]">
              {journeysCount} Completed
            </span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div>
            <span className="text-[#94A3B8] block">Earned XP:</span>
            <span className="text-base font-bold text-[#F59E0B]">
              +{totalEarnedXp} XP
            </span>
          </div>
        </div>

        {/* Badges List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`flex items-start gap-3 rounded-2xl p-4 border transition-all ${
                b.isUnlocked
                  ? 'border-[#F59E0B]/40 bg-[#0E1B33]/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'border-white/5 bg-[#0B1226]/50 opacity-60'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  b.isUnlocked
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    : 'bg-white/5 text-[#64748B]'
                }`}
              >
                {b.isUnlocked ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-sans text-xs font-bold text-white">{b.title}</h4>
                  <span className="font-mono text-[10px] font-bold text-[#F59E0B]">
                    +{b.xpReward} XP
                  </span>
                </div>
                <p className="font-sans text-[11px] text-[#94A3B8] leading-relaxed">
                  {b.description}
                </p>
                <div className="font-mono text-[9px] pt-1">
                  {b.isUnlocked ? (
                    <span className="text-[#10B981] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3 w-3" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[#64748B]">LOCKED</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
