/**
 * ORBIT ACADEMY — DISCOVERY MODE
 * NASA DISCOVERY HUB: MEDIA LIBRARY & EXOPLANET ARCHIVE
 * 
 * Features:
 * 1. NASA Image & Video Library Search:
 *    - Search official NASA imagery for planets, rovers, and telescopes (Curiosity, Perseverance, JWST, Hubble, Voyager)
 *    - High-resolution media cards with date, mission center, and full descriptions
 * 2. NASA Exoplanet Archive:
 *    - Confirmed alien worlds catalog from Caltech/IPAC TAP service
 *    - Orbital periods, planetary radii (Earth radii), mass, equilibrium temp (K)
 *    - Habitable zone filter (identifies candidates with liquid water potential)
 * 3. Laura AI explanation integration
 */

import React, { useState, useEffect } from 'react';
import {
  NasaMediaAsset,
  NasaExoplanet,
} from '../../../services/nasa/types';
import { nasaClient } from '../../../services/nasa/nasaClient';
import { climateAudio } from '../../climate/audio/climateAudio';
import { useNavigation } from '../../../navigation/NavigationProvider';
import { ROUTES } from '../../../navigation/routes';
import {
  Search,
  Telescope,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
  Globe2,
} from 'lucide-react';

interface NasaDiscoveryHubProps {
  onSelectExoplanet?: (planet: NasaExoplanet) => void;
  onExplainWithLaura?: (title: string, details: string) => void;
}

export const NasaDiscoveryHub: React.FC<NasaDiscoveryHubProps> = ({
  onSelectExoplanet,
  onExplainWithLaura,
}) => {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'media' | 'exoplanets'>('media');

  // --- 1. NASA MEDIA STATE ---
  const [searchQuery, setSearchQuery] = useState<string>('neptune voyager');
  const [mediaAssets, setMediaAssets] = useState<NasaMediaAsset[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<NasaMediaAsset | null>(null);

  // --- 2. EXOPLANET ARCHIVE STATE ---
  const [exoplanets, setExoplanets] = useState<NasaExoplanet[]>([]);
  const [habitableOnly, setHabitableOnly] = useState<boolean>(false);
  const [isExoLoading, setIsExoLoading] = useState<boolean>(false);

  // Initial Fetch
  useEffect(() => {
    // Load default media
    setIsMediaLoading(true);
    nasaClient.searchMedia(searchQuery).then((res) => {
      setMediaAssets(res.data);
      setIsMediaLoading(false);
    });

    // Load exoplanets
    setIsExoLoading(true);
    nasaClient.getExoplanets(40).then((res) => {
      setExoplanets(res.data);
      setIsExoLoading(false);
    });
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    climateAudio.playClick();
    setIsMediaLoading(true);
    nasaClient.searchMedia(searchQuery).then((res) => {
      setMediaAssets(res.data);
      setIsMediaLoading(false);
    });
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    climateAudio.playClick();
    setIsMediaLoading(true);
    nasaClient.searchMedia(term).then((res) => {
      setMediaAssets(res.data);
      setIsMediaLoading(false);
    });
  };

  const filteredExoplanets = habitableOnly
    ? exoplanets.filter((p) => p.isPotentiallyHabitable)
    : exoplanets;

  const handleAskLauraMedia = (asset: NasaMediaAsset) => {
    if (onExplainWithLaura) {
      onExplainWithLaura(
        `NASA Archive Media: ${asset.title}`,
        `Explain the astrophysical significance and mission background of this NASA image: ${asset.description}`
      );
    }
  };

  const handleAskLauraExo = (planet: NasaExoplanet) => {
    if (onExplainWithLaura) {
      onExplainWithLaura(
        `Exoplanet ${planet.name}`,
        `Explain the characteristics of exoplanet ${planet.name} orbiting star ${planet.hostname}: discovery method ${planet.discoveryMethod}, orbital period of ${planet.orbitalPeriodDays} days, radius of ${planet.radiusEarthRadii} Earth radii, equilibrium temperature ${planet.equilibriumTempK} K, and whether it could support liquid water or atmospheric biosignatures.`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. DISCOVERY HUB NAVIGATION */}
      <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Telescope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                NASA Deep-Space Discovery Deck
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  OFFICIAL ARCHIVE DATA
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct access to the NASA Image & Video Library and NASA Caltech/IPAC Exoplanet Archive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveTab('media');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'media'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              NASA Media Library
            </button>
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveTab('exoplanets');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'exoplanets'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Exoplanet Archive ({exoplanets.length})
            </button>
            <button
              onClick={() => {
                climateAudio.playClick();
                navigate(ROUTES.TREK_PREVIEW);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-all flex items-center gap-1.5"
              title="Open NASA Solar System Treks Planetary Data Foundation"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>NASA Trek 3D</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB A: NASA IMAGE AND VIDEO LIBRARY SEARCH */}
      {activeTab === 'media' && (
        <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-5 shadow-xl space-y-4">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search official NASA photographs (e.g. Neptune, JWST, Curiosity, Mars, Artemis)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold shadow-md transition-colors"
            >
              Search Archive
            </button>
          </form>

          {/* Quick-Filter Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Curated:</span>
            {['Neptune Voyager', 'James Webb Deep Field', 'Curiosity Mars Rover', 'Apollo 11', 'Artemis Orion', 'Earth Blue Marble'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuickSearch(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 font-mono transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Media Grid */}
          {isMediaLoading ? (
            <div className="flex items-center justify-center p-12 text-cyan-400 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying NASA Image and Video Library...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.nasaId}
                  onClick={() => {
                    climateAudio.playClick();
                    setSelectedMedia(asset);
                  }}
                  className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-[10px] font-mono text-cyan-400 line-clamp-1">{asset.dateCreated} • {asset.center}</div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-cyan-300 transition-colors">
                      {asset.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Selected Media Modal/Card */}
          {selectedMedia && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    NASA ID: {selectedMedia.nasaId}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Created: {selectedMedia.dateCreated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAskLauraMedia(selectedMedia)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask Laura
                  </button>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white">{selectedMedia.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                {selectedMedia.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB B: NASA EXOPLANET ARCHIVE (TAP CONFIRMED PLANETS) */}
      {activeTab === 'exoplanets' && (
        <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-5 shadow-xl space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400">
                Caltech / IPAC NASA Exoplanet Archive
              </span>
              <div className="text-xs text-slate-400 mt-0.5">
                Official astronomical database of verified worlds beyond our solar system
              </div>
            </div>

            <button
              onClick={() => {
                climateAudio.playClick();
                setHabitableOnly(!habitableOnly);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                habitableOnly
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {habitableOnly ? 'Showing Habitable Zone Candidates' : 'Filter Habitable Zone Candidates'}
            </button>
          </div>

          {/* Exoplanet Cards Grid */}
          {isExoLoading ? (
            <div className="flex items-center justify-center p-12 text-cyan-400 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying NASA Caltech/IPAC Exoplanet Archive...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
              {filteredExoplanets.map((planet) => (
                <div
                  key={planet.name}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">{planet.name}</span>
                      {planet.isPotentiallyHabitable ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          Habitable Zone
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {planet.discoveryMethod}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Host Star: {planet.hostname} • Discovered: {planet.discoveryYear}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Radius</span>
                      <span className="text-white font-bold">{planet.radiusEarthRadii || '?'} R⊕</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Period</span>
                      <span className="text-cyan-400 font-bold">{planet.orbitalPeriodDays || '?'} d</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Eq. Temp</span>
                      <span className="text-amber-400 font-bold">{planet.equilibriumTempK ? `${planet.equilibriumTempK} K` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Distance</span>
                      <span className="text-slate-300">{planet.distanceLightYears ? `${planet.distanceLightYears} ly` : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleAskLauraExo(planet)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Ask Laura
                    </button>
                    {onSelectExoplanet && (
                      <button
                        onClick={() => onSelectExoplanet(planet)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold transition-colors"
                      >
                        Inspect World
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
