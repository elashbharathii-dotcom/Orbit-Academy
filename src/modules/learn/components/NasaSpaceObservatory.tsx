/**
 * ORBIT ACADEMY — NASA SPACE OBSERVATORY
 * OFFICIAL NASA OPEN SCIENCE INTEGRATION: APOD, NeoWs, AND DONKI
 * 
 * Features:
 * 1. NASA APOD (Astronomy Picture of the Day):
 *    - Daily official image & scientific explanation
 *    - Time-travel historical date picker
 *    - High-resolution modal & video embedding
 * 2. NASA NeoWs (Near Earth Object Web Service):
 *    - Real-time near-Earth asteroid tracking
 *    - Estimated diameter with landmark scale comparison
 *    - Velocity (km/h & km/s), miss distance in Lunar Distances (LD) & km
 *    - Potentially Hazardous Asteroid (PHA) radar warning
 * 3. NASA DONKI (Space Weather Database):
 *    - Solar Flares: X-Class, M-Class, and C-Class energy classifications
 *    - Coronal Mass Ejections (CME): Plasma speeds (km/s) and propagation directions
 *    - Geomagnetic Storms: Planetary Kp index alerts & auroral impact
 */

import React, { useState, useEffect } from 'react';
import {
  NasaApod,
  NasaNeoAsteroid,
  NasaSpaceWeatherSummary,
} from '../../../services/nasa/types';
import { nasaClient } from '../../../services/nasa/nasaClient';
import { climateAudio } from '../../climate/audio/climateAudio';
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  Radio,
  ExternalLink,
  Zap,
  Loader2,
  Globe2,
} from 'lucide-react';
import { useNavigation } from '../../../navigation/NavigationProvider';
import { ROUTES } from '../../../navigation/routes';

interface NasaSpaceObservatoryProps {
  initialTab?: 'apod' | 'neows' | 'donki';
  onExplainWithLaura?: (title: string, details: string) => void;
}

export const NasaSpaceObservatory: React.FC<NasaSpaceObservatoryProps> = ({
  initialTab = 'apod',
  onExplainWithLaura,
}) => {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'apod' | 'neows' | 'donki'>(initialTab);

  // --- 1. APOD STATE ---
  const [apod, setApod] = useState<NasaApod | null>(null);
  const [apodDate, setApodDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isApodLoading, setIsApodLoading] = useState<boolean>(false);

  // --- 2. NeoWs STATE ---
  const [asteroids, setAsteroids] = useState<NasaNeoAsteroid[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NasaNeoAsteroid | null>(null);

  // --- 3. DONKI SPACE WEATHER STATE ---
  const [spaceWeather, setSpaceWeather] = useState<NasaSpaceWeatherSummary | null>(null);

  // Fetch initial data
  useEffect(() => {
    // 1. APOD
    setIsApodLoading(true);
    nasaClient.getApod(apodDate).then((res) => {
      setApod(res.data);
      setIsApodLoading(false);
    });

    // 2. NeoWs
    nasaClient.getNeoWsFeed().then((res) => {
      setAsteroids(res.data);
      if (res.data.length > 0) setSelectedAsteroid(res.data[0]);
    });

    // 3. DONKI
    nasaClient.getSpaceWeather().then((res) => {
      setSpaceWeather(res.data);
    });
  }, [apodDate]);

  const handleDateChange = (newDate: string) => {
    climateAudio.playTick();
    setApodDate(newDate);
    setIsApodLoading(true);
    nasaClient.getApod(newDate).then((res) => {
      setApod(res.data);
      setIsApodLoading(false);
    });
  };

  const handleAskLauraApod = () => {
    if (onExplainWithLaura && apod) {
      onExplainWithLaura(
        `NASA APOD: ${apod.title}`,
        `Explain the astronomy and astrophysical processes depicted in NASA's Astronomy Picture of the Day from ${apod.date}: ${apod.explanation}`
      );
    }
  };

  const handleAskLauraNeo = (ast: NasaNeoAsteroid) => {
    if (onExplainWithLaura) {
      onExplainWithLaura(
        `Near-Earth Asteroid ${ast.name}`,
        `Explain the orbit, close approach distance of ${ast.missDistanceLunar} Lunar Distances, diameter of ${ast.estimatedDiameterMeters.min}-${ast.estimatedDiameterMeters.max} meters, and whether ${ast.name} poses any collision risk to Earth.`
      );
    }
  };

  const handleAskLauraSolar = () => {
    if (onExplainWithLaura && spaceWeather) {
      onExplainWithLaura(
        'NASA DONKI Space Weather & Solar Flare Activity',
        `Explain how recent solar flares like ${spaceWeather.flares[0]?.classType || 'X-Class'} and Coronal Mass Ejections affect Earth's magnetosphere, create geomagnetic storms, and induce auroral displays.`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. OBSERVATORY NAVIGATION HEADER */}
      <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                NASA Deep-Space Observatory
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  LIVE NASA DATA FEED
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Official astrophysics feeds from NASA Science APOD, JPL CNEOS NeoWs, and NASA DONKI
              </p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveTab('apod');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'apod'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Daily APOD
            </button>
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveTab('neows');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'neows'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Asteroids (NeoWs)
            </button>
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveTab('donki');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'donki'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Space Weather (DONKI)
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB A: NASA APOD (ASTRONOMY PICTURE OF THE DAY) */}
      {activeTab === 'apod' && (
        <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-5 shadow-xl space-y-4">
          {/* APOD Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-300">Archive Date:</span>
              <input
                type="date"
                value={apodDate}
                min="1995-06-16"
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <button
              onClick={handleAskLauraApod}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explain with Laura AI
            </button>
          </div>

          {/* APOD Content Card */}
          {isApodLoading ? (
            <div className="flex items-center justify-center p-16 text-cyan-400 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying NASA Science APOD API...</span>
            </div>
          ) : (
            apod && (
              <div className="space-y-4">
                <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[460px] flex items-center justify-center">
                  {apod.media_type === 'video' ? (
                    <iframe
                      src={apod.url}
                      title={apod.title}
                      className="w-full h-80 sm:h-96"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={apod.hdurl || apod.url}
                      alt={apod.title}
                      className="w-full h-auto max-h-[460px] object-contain"
                      loading="lazy"
                    />
                  )}
                  {apod.copyright && (
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400">
                      Image Credit: {apod.copyright}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{apod.title}</h3>
                  <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                    Official NASA APOD • {apod.date}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                    {apod.explanation}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* 3. TAB B: NASA NeoWs (NEAR-EARTH ASTEROIDS) */}
      {activeTab === 'neows' && (
        <div className="space-y-4">
          <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Near-Earth Asteroid Radar (NASA JPL CNEOS)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {asteroids.length} Tracked Asteroids
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {asteroids.map((ast) => {
                const isSelected = selectedAsteroid?.id === ast.id;
                return (
                  <button
                    key={ast.id}
                    onClick={() => {
                      climateAudio.playSonarPing();
                      setSelectedAsteroid(ast);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{ast.name}</span>
                      {ast.isPotentiallyHazardous ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          PHA Target
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                          Non-Hazardous
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 mt-2">
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">Est. Diameter</span>
                        <span className="text-white font-bold">{ast.estimatedDiameterMeters.min} - {ast.estimatedDiameterMeters.max} m</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">Miss Distance</span>
                        <span className="text-cyan-400 font-bold">{ast.missDistanceLunar} LD</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">Velocity</span>
                        <span className="text-amber-400 font-bold">{ast.relativeVelocityKmh.toLocaleString()} km/h</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">Close Approach</span>
                        <span className="text-slate-300">{ast.closeApproachDate}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Asteroid Deep-Dive Card */}
          {selectedAsteroid && (
            <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{selectedAsteroid.name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Absolute Magnitude: H={selectedAsteroid.absoluteMagnitudeH} • Orbiting: {selectedAsteroid.orbitingBody}
                  </div>
                </div>
                <button
                  onClick={() => handleAskLauraNeo(selectedAsteroid)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Laura about {selectedAsteroid.name}
                </button>
              </div>

              {/* Relative Scale comparison */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong>Landmark Size Comparison:</strong> At approximately{' '}
                <span className="text-cyan-300 font-bold font-mono">
                  {selectedAsteroid.estimatedDiameterMeters.max} meters
                </span>{' '}
                across, this object is roughly comparable to{' '}
                {selectedAsteroid.estimatedDiameterMeters.max > 300
                  ? 'the height of the Eiffel Tower (330m) or a supertanker vessel'
                  : selectedAsteroid.estimatedDiameterMeters.max > 100
                  ? 'a regulation football stadium'
                  : 'a Boeing 747 aircraft or high-rise building'}
                . A miss distance of {selectedAsteroid.missDistanceLunar} Lunar Distances corresponds to{' '}
                {(selectedAsteroid.missDistanceKm / 1000000).toFixed(2)} million kilometers from Earth.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB C: NASA DONKI SPACE WEATHER */}
      {activeTab === 'donki' && spaceWeather && (
        <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-[10px] uppercase font-mono text-amber-400">
                NASA Space Weather Database (DONKI)
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5 font-mono">
                Solar Dynamics & Heliophysics Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  climateAudio.playSonarPing();
                  navigate(ROUTES.SPACE_WEATHER);
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Globe2 className="w-3.5 h-3.5" />
                Launch 3D Space Weather Center
              </button>
              <button
                onClick={handleAskLauraSolar}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explain Solar Activity
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Current Phase</span>
              <div className="text-xs font-bold text-amber-400 font-mono mt-0.5">{spaceWeather.solarCycle}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Sunspot Number</span>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{spaceWeather.sunspotCountEstimate} Active</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Solar Wind Speed</span>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">{spaceWeather.solarWindSpeedKmS} km/s</div>
            </div>
          </div>

          {/* Solar Flares Log */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Recent High-Energy Solar Flares
            </span>

            <div className="space-y-2">
              {spaceWeather.flares.map((flare) => (
                <div key={flare.flrId} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      flare.classType.startsWith('X')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : flare.classType.startsWith('M')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {flare.classType}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">
                        Active Region AR {flare.activeRegionNum || 'Quiet Sun'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Source: {flare.sourceLocation} • Peak: {flare.peakTime}
                      </div>
                    </div>
                  </div>

                  <a
                    href={flare.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-400 p-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Coronal Mass Ejection & Geomagnetic Storms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                Coronal Mass Ejections (CME)
              </span>
              {spaceWeather.cmes[0] && (
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Speed: <strong className="text-amber-400 font-mono">{spaceWeather.cmes[0].speedKmS} km/s</strong></div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">{spaceWeather.cmes[0].note}</div>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                Geomagnetic Storm Status
              </span>
              {spaceWeather.geomagneticStorms[0] && (
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Planetary Kp Index: <strong className="text-cyan-300 font-mono">{spaceWeather.geomagneticStorms[0].kpIndex} / 9</strong></div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">{spaceWeather.geomagneticStorms[0].linkedEvents}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
