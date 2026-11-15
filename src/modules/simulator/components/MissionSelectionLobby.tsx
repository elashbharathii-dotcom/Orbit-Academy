import React, { useState } from 'react';
import {
  Rocket,
  Compass,
  Trophy,
  Star,
  Gauge,
  ShieldCheck,
  Volume2,
  VolumeX,
  Play,
} from 'lucide-react';
import { MissionDefinition, MissionId } from '../types';
import { NASA_MISSIONS } from '../simulatorData';
import { flightAudio } from '../audio/flightAudio';

interface MissionSelectionLobbyProps {
  completedMissionIds: MissionId[];
  missionBestStars: Record<string, number>;
  totalFlightTimeSeconds: number;
  totalLandings: number;
  totalDockings: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectAndLaunchMission: (mission: MissionDefinition) => void;
}

export const MissionSelectionLobby: React.FC<MissionSelectionLobbyProps> = ({
  completedMissionIds,
  missionBestStars,
  totalFlightTimeSeconds,
  totalLandings,
  totalDockings,
  isMuted,
  onToggleMute,
  onSelectAndLaunchMission,
}) => {
  const [filterBody, setFilterBody] = useState<string>('all');
  const [selectedMissionId, setSelectedMissionId] = useState<MissionId>(NASA_MISSIONS[0].id);

  const activeMission = NASA_MISSIONS.find((m) => m.id === selectedMissionId) || NASA_MISSIONS[0];

  const filteredMissions = NASA_MISSIONS.filter((m) => {
    if (filterBody === 'all') return true;
    if (filterBody === 'earth') return m.targetBody === 'earth' || m.targetBody === 'iss';
    if (filterBody === 'moon') return m.targetBody === 'moon';
    if (filterBody === 'mars') return m.targetBody === 'mars';
    if (filterBody === 'deep-space') return m.targetBody === 'asteroid' || m.targetBody === 'deep-space' || m.targetBody === 'sun';
    return true;
  });

  const totalFlightHours = Math.round((totalFlightTimeSeconds / 3600) * 10) / 10;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12 font-sans text-white">
      {/* 1. Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c152e] via-[#070c1b] to-[#040714] border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/20 shrink-0">
              <Rocket className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NASA Space Mission Simulator</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Stage 09 Aerospace Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AAA Space Flight & Interactive Orbital Missions
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                Take command in an interactive 3D cockpit. Execute real-world orbital burns, station dockings, lunar touchdowns, and interplanetary trajectories.
              </p>
            </div>
          </div>

          {/* Quick Pilot Stats & Mute Control */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{completedMissionIds.length} / 10 Cleared</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>{totalFlightHours}h Logged</span>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="relative z-10 pt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-[#050814]/90 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'All 10 Missions' },
              { id: 'earth', label: 'Earth & ISS' },
              { id: 'moon', label: 'Lunar Operations' },
              { id: 'mars', label: 'Mars & EDL' },
              { id: 'deep-space', label: 'Asteroid & Sun' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterBody(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterBody === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-slate-400 flex items-center gap-3">
            <span>Landings: <strong className="text-emerald-400">{totalLandings}</strong></span>
            <span>Dockings: <strong className="text-cyan-400">{totalDockings}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Mission Catalog Grid (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            Select Flight Directive ({filteredMissions.length} Available)
          </div>

          {filteredMissions.map((mission) => {
            const isSelected = selectedMissionId === mission.id;
            const stars = missionBestStars[mission.id] || 0;
            const isCompleted = completedMissionIds.includes(mission.id);

            return (
              <div
                key={mission.id}
                onClick={() => {
                  flightAudio.playClick(840);
                  setSelectedMissionId(mission.id);
                }}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 backdrop-blur-xl ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                    : 'border-slate-800 bg-[#070c1b]/80 hover:border-slate-700 hover:bg-[#0c152e]/60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-2xl p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    {mission.icon}
                  </span>

                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/5 border border-white/10 text-cyan-300 uppercase">
                        {mission.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {mission.difficulty}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          ✓ CLEARED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate font-mono">
                      {mission.subtitle}
                    </p>
                  </div>
                </div>

                {/* Stars Rating & Delta-V */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 font-mono text-xs">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Δv: <strong className="text-white">{mission.deltaVBudgetMs} m/s</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Mission Briefing & Launch Cockpit (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-[#070c1b]/90 border border-cyan-500/30 backdrop-blur-2xl flex-1 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    FLIGHT DIRECTIVE BRIEFING
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  +{activeMission.baseXpReward} XP
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeMission.title}
                </h2>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  {activeMission.description}
                </p>
              </div>

              {/* Historical NASA Context */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-slate-300 leading-relaxed space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                  NASA Operational Heritage:
                </span>
                <p>{activeMission.historicalContext}</p>
              </div>

              {/* Sequential Objectives Checklist */}
              <div className="space-y-2 pt-1 font-mono text-xs">
                <span className="text-slate-400 block uppercase text-[10px]">
                  Mission Objectives Checklist:
                </span>
                {activeMission.objectives.map((obj, i) => (
                  <div
                    key={obj.id}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5 text-slate-200"
                  >
                    <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <div>
                      <span className="font-semibold block text-white">{obj.title}</span>
                      <span className="text-[11px] text-slate-400 font-sans">{obj.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Primary CTA Button */}
            <div className="pt-6 mt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  flightAudio.playVictoryFanfare();
                  onSelectAndLaunchMission(activeMission);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold font-mono text-sm tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>INITIALIZE FLIGHT & ENTER COCKPIT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
