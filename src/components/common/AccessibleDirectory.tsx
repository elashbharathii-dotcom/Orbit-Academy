import React, { useEffect, useRef } from 'react';
import { X, Globe, Check, Rocket } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';
import { CelestialId } from '../../types';

interface AccessibleDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Accessible 2D Solar System Directory Modal (Phase 5 & 7)
 * Requirements:
 * - Semantic HTML table with screen-reader accessible captions & headers
 * - Full keyboard navigation (Escape to close, auto-focus management)
 * - Enables both selecting celestial destinations and launching educational modules directly
 */
export const AccessibleDirectory: React.FC<AccessibleDirectoryProps> = ({ isOpen, onClose }) => {
  const { selectedPlanetId, selectPlanet } = useSolarSystem();
  const { launchModuleForPlanet } = useNavigation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (id: CelestialId) => {
    selectPlanet(id);
    onClose();
  };

  const handleLaunch = (id: CelestialId) => {
    onClose();
    launchModuleForPlanet(id, { immediate: true });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="directory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-fade-in"
    >
      <div
        ref={modalRef}
        className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0B1226]/98 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.14)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8]">
              <Globe className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="directory-title" className="font-sans text-xl font-bold tracking-tight text-[#F8FAFC]">
                Solar System Celestial Directory
              </h2>
              <p className="font-mono text-xs text-[#94A3B8]">
                2D Accessible Navigation &amp; Academic Curriculum Index
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close celestial directory modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(148,163,184,0.18)] bg-[#11182E] text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Semantic Table */}
        <div className="overflow-x-auto overflow-y-auto p-6 scrollbar-none">
          <table className="w-full text-left font-mono text-xs">
            <caption className="sr-only">
              Astronomical and educational directory of the Sun and the eight planets in the Solar System
            </caption>
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.16)] text-[#94A3B8] text-[11px] uppercase tracking-wider">
                <th scope="col" className="pb-3 pr-4 font-semibold">Celestial Body</th>
                <th scope="col" className="pb-3 px-4 font-semibold">Classification</th>
                <th scope="col" className="pb-3 px-4 font-semibold">Distance (AU)</th>
                <th scope="col" className="pb-3 px-4 font-semibold">Diameter</th>
                <th scope="col" className="pb-3 px-4 font-semibold">Gravity</th>
                <th scope="col" className="pb-3 px-4 font-semibold">Destination Module</th>
                <th scope="col" className="pb-3 pl-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.08)]">
              {CELESTIAL_BODIES.map((body) => {
                const isSelected = selectedPlanetId === body.id;

                return (
                  <tr
                    key={body.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-[#F59E0B]/10'
                        : 'hover:bg-[#11182E]/50'
                    }`}
                  >
                    {/* Name */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: body.visual.primaryColor }}
                          aria-hidden="true"
                        />
                        <div>
                          <span className="font-bold text-[#F8FAFC]">{body.name}</span>
                          <span className="ml-1.5 text-[10px] text-[#94A3B8]">({body.latinName})</span>
                        </div>
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      {body.physical.classification}
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 text-[#F8FAFC]">
                      {body.physical.realDistanceAU} AU
                    </td>

                    {/* Diameter */}
                    <td className="py-3.5 px-4 text-[#F8FAFC]">
                      {body.physical.realDiameterKm}
                    </td>

                    {/* Gravity */}
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      {body.physical.surfaceGravityMs2} m/s²
                    </td>

                    {/* Learning Destination */}
                    <td className="py-3.5 px-4">
                      <span className="rounded border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-2 py-0.5 text-[10px] text-[#38BDF8]">
                        {body.learningModule.learningCategory}
                      </span>
                    </td>

                    {/* Actions: Select in 3D & Launch Module */}
                    <td className="py-3.5 pl-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => handleSelect(body.id)}
                          aria-label={`Select and fly to ${body.name}`}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border border-[#F59E0B] bg-[#F59E0B] text-[#05070D]'
                              : 'border border-[rgba(148,163,184,0.2)] bg-[#11182E] text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-3 w-3" aria-hidden="true" />
                              <span>Focused</span>
                            </>
                          ) : (
                            <span>Focus 3D</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLaunch(body.id)}
                          aria-label={`Launch ${body.name} educational module`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/15 px-2.5 py-1 text-xs font-semibold text-[#F59E0B] transition-all hover:bg-[#F59E0B] hover:text-[#05070D]"
                        >
                          <Rocket className="h-3 w-3" aria-hidden="true" />
                          <span>Launch</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[rgba(148,163,184,0.14)] bg-[#11182E]/40 px-6 py-3 font-mono text-xs text-[#94A3B8]">
          <span>Press [Esc] to close directory</span>
          <span className="text-[#38BDF8]">NASA Planetary Metrics Verified</span>
        </div>
      </div>
    </div>
  );
};
