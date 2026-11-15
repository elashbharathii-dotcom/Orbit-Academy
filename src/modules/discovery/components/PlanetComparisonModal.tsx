import React, { useState } from 'react';
import { PlanetDiscoveryProfile } from '../types';
import { PLANET_DISCOVERY_PROFILES } from '../data/discoveryData';
import { X, Scale } from 'lucide-react';

interface PlanetComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryProfile: PlanetDiscoveryProfile;
}

export const PlanetComparisonModal: React.FC<PlanetComparisonModalProps> = ({
  isOpen,
  onClose,
  primaryProfile,
}) => {
  const [secondaryId, setSecondaryId] = useState<string>('earth');

  if (!isOpen) return null;

  const secondaryProfile = PLANET_DISCOVERY_PROFILES[secondaryId] || PLANET_DISCOVERY_PROFILES.earth;

  // Comparative ratios
  const diameterRatio = (
    primaryProfile.physics.equatorialDiameterKm / secondaryProfile.physics.equatorialDiameterKm
  ).toFixed(2);

  const gravityRatio = (
    primaryProfile.physics.surfaceGravityMs2 / secondaryProfile.physics.surfaceGravityMs2
  ).toFixed(2);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-[#070C1B] p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8]/20 text-[#38BDF8]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#38BDF8]">
                ASTRONOMICAL SCALE COMPARATOR
              </span>
              <h2 className="font-sans text-xl font-black">
                {primaryProfile.name} vs. {secondaryProfile.name}
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

        {/* Planet Comparison Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#94A3B8]">Compare against:</span>
          <select
            value={secondaryId}
            onChange={(e) => setSecondaryId(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1226] px-3 py-1.5 text-white focus:border-[#38BDF8] focus:outline-none"
          >
            {Object.values(PLANET_DISCOVERY_PROFILES).map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === primaryProfile.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visual Scale Spheres Demonstration */}
        <div className="flex items-center justify-around rounded-2xl border border-white/5 bg-[#030611] p-6">
          <div className="flex flex-col items-center gap-2">
            <div
              className="rounded-full shadow-lg transition-all"
              style={{
                width: `${Math.max(20, Math.min(120, primaryProfile.physics.diameterEarthRatio * 45))}px`,
                height: `${Math.max(20, Math.min(120, primaryProfile.physics.diameterEarthRatio * 45))}px`,
                backgroundColor: primaryProfile.visuals.primaryColor,
              }}
            />
            <span className="font-sans font-bold text-sm text-white">{primaryProfile.name}</span>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              {primaryProfile.physics.equatorialDiameterKm.toLocaleString()} km
            </span>
          </div>

          <div className="font-mono text-xs text-[#38BDF8] flex flex-col items-center">
            <span>Ratio</span>
            <span className="text-lg font-bold">{diameterRatio}x</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className="rounded-full shadow-lg transition-all"
              style={{
                width: `${Math.max(20, Math.min(120, secondaryProfile.physics.diameterEarthRatio * 45))}px`,
                height: `${Math.max(20, Math.min(120, secondaryProfile.physics.diameterEarthRatio * 45))}px`,
                backgroundColor: secondaryProfile.visuals.primaryColor,
              }}
            />
            <span className="font-sans font-bold text-sm text-white">{secondaryProfile.name}</span>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              {secondaryProfile.physics.equatorialDiameterKm.toLocaleString()} km
            </span>
          </div>
        </div>

        {/* Comparative Metrics Table */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1226]/80 p-4 font-mono text-xs space-y-3">
          <div className="grid grid-cols-3 font-bold border-b border-white/10 pb-2 text-[#94A3B8]">
            <span>Parameter</span>
            <span className="text-right text-white">{primaryProfile.name}</span>
            <span className="text-right text-white">{secondaryProfile.name}</span>
          </div>

          <div className="grid grid-cols-3 border-b border-white/5 pb-2">
            <span className="text-[#94A3B8]">Distance to Sol</span>
            <span className="text-right font-bold text-[#38BDF8]">
              {primaryProfile.astronomy.semiMajorAxisAU} AU
            </span>
            <span className="text-right font-bold text-[#38BDF8]">
              {secondaryProfile.astronomy.semiMajorAxisAU} AU
            </span>
          </div>

          <div className="grid grid-cols-3 border-b border-white/5 pb-2">
            <span className="text-[#94A3B8]">Surface Gravity ({gravityRatio}x)</span>
            <span className="text-right font-bold text-white">
              {primaryProfile.physics.surfaceGravityMs2} m/s² ({primaryProfile.physics.gravityEarthG}g)
            </span>
            <span className="text-right font-bold text-white">
              {secondaryProfile.physics.surfaceGravityMs2} m/s² ({secondaryProfile.physics.gravityEarthG}g)
            </span>
          </div>

          <div className="grid grid-cols-3 border-b border-white/5 pb-2">
            <span className="text-[#94A3B8]">Orbital Period (Year)</span>
            <span className="text-right font-bold text-white">
              {primaryProfile.astronomy.orbitalPeriodDays.toFixed(1)} Days
            </span>
            <span className="text-right font-bold text-white">
              {secondaryProfile.astronomy.orbitalPeriodDays.toFixed(1)} Days
            </span>
          </div>

          <div className="grid grid-cols-3 border-b border-white/5 pb-2">
            <span className="text-[#94A3B8]">Day Length</span>
            <span className="text-right font-bold text-white">
              {primaryProfile.astronomy.rotationPeriodHours.toFixed(1)} Hours
            </span>
            <span className="text-right font-bold text-white">
              {secondaryProfile.astronomy.rotationPeriodHours.toFixed(1)} Hours
            </span>
          </div>

          <div className="grid grid-cols-3 border-b border-white/5 pb-2">
            <span className="text-[#94A3B8]">Mean Temperature</span>
            <span className="text-right font-bold text-white">
              {primaryProfile.physics.meanTemperatureC}°C
            </span>
            <span className="text-right font-bold text-white">
              {secondaryProfile.physics.meanTemperatureC}°C
            </span>
          </div>

          <div className="grid grid-cols-3">
            <span className="text-[#94A3B8]">Confirmed Moons</span>
            <span className="text-right font-bold text-[#F59E0B]">
              {primaryProfile.satellites.moonCount}
            </span>
            <span className="text-right font-bold text-[#F59E0B]">
              {secondaryProfile.satellites.moonCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
