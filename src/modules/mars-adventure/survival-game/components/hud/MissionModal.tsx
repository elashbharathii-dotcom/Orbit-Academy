import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { MissionCategory } from '../../types/missionTypes';
import {
  Compass,
  CheckCircle2,
  Lock,
  Award,
  AlertCircle,
  X,
  Target,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  Zap,
} from 'lucide-react';

export const MissionModal: React.FC = () => {
  const isMissionModalOpen = useMarsGameStore((state) => state.isMissionModalOpen);
  const closeMissionModal = useMarsGameStore((state) => state.closeMissionModal);
  const missions = useMarsGameStore((state) => state.missions);
  const activeMissionId = useMarsGameStore((state) => state.activeMissionId);
  const completedMissionIds = useMarsGameStore((state) => state.completedMissionIds);
  const startMission = useMarsGameStore((state) => state.startMission);
  const trackMission = useMarsGameStore((state) => state.trackMission);
  const claimMissionReward = useMarsGameStore((state) => state.claimMissionReward);
  const researchPoints = useMarsGameStore((state) => state.researchDataPoints);
  const solCycle = useMarsGameStore((state) => state.solCycle);

  const [activeCategory, setActiveCategory] = useState<MissionCategory | 'all'>('all');
  const [selectedMissionId, setSelectedMissionId] = useState<string>(activeMissionId || 'mis_restore_comms');

  if (!isMissionModalOpen) return null;

  const missionList = Object.values(missions);
  const filteredMissions = activeCategory === 'all'
    ? missionList
    : missionList.filter((m) => m.category === activeCategory);

  const currentMission = missions[selectedMissionId] || filteredMissions[0] || missionList[0];

  const allObjectivesMet = currentMission?.objectives.every(
    (o) => o.currentValue >= o.targetValue
  );

  const isCompleted = completedMissionIds.includes(currentMission?.id);
  const isActive = currentMission?.state === 'active';
  const isAvailable = currentMission?.state === 'available';

  const categoryBadges: Record<MissionCategory, { label: string; color: string }> = {
    story: { label: 'PRIMARY CAMPAIGN', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40' },
    scientific: { label: 'PLANETARY SCIENCE', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40' },
    exploration: { label: 'SURFACE EXPLORATION', color: 'border-amber-500/50 text-amber-400 bg-amber-950/40' },
    recovery: { label: 'SALVAGE & RECOVERY', color: 'border-orange-500/50 text-orange-400 bg-orange-950/40' },
    optional: { label: 'FIELD DIRECTIVE', color: 'border-purple-500/50 text-purple-400 bg-purple-950/40' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none">
      <div className="relative w-full max-w-5xl h-[86vh] max-h-[780px] bg-zinc-950/95 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.18)] flex flex-col overflow-hidden text-zinc-200">
        {/* Top Aerospace Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-zinc-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-wider text-cyan-300">
                  COMMAND CENTRE • MISSION OPERATIONS TERMINAL
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                  JEZERO CRATER OUTPOST ALPHA
                </span>
              </div>
              <div className="text-xs text-zinc-400 flex items-center space-x-4 mt-0.5">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Sol {solCycle.solNumber} • {Math.floor(solCycle.timeOfDay).toString().padStart(2, '0')}:
                    {Math.floor((solCycle.timeOfDay % 1) * 60).toString().padStart(2, '0')}
                  </span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RESEARCH POINTS: {researchPoints} RP</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span>
                  CAMPAIGNS: {completedMissionIds.length} / {missionList.length} ACCOMPLISHED
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={closeMissionModal}
            className="p-1.5 rounded-lg border border-zinc-700 hover:border-cyan-400 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 px-6 py-2.5 border-b border-zinc-800 bg-zinc-900/30 overflow-x-auto text-xs">
          {(['all', 'story', 'scientific', 'exploration', 'recovery', 'optional'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              {cat === 'all' ? 'All Directives' : cat}
            </button>
          ))}
        </div>

        {/* Main Content Split: Master-Detail */}
        <div className="flex-1 grid grid-cols-12 min-h-0 divide-x divide-zinc-800/80">
          {/* Left Column: Mission Directory */}
          <div className="col-span-5 flex flex-col min-h-0 bg-zinc-950/50">
            <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/40 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex justify-between">
              <span>Telemetry Dossiers ({filteredMissions.length})</span>
              <span className="text-zinc-500">SELECT TO INSPECT</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredMissions.map((m) => {
                const isSel = m.id === currentMission?.id;
                const isDone = completedMissionIds.includes(m.id);
                const isCurActive = m.state === 'active';
                const compObjs = m.objectives.filter((o) => o.currentValue >= o.targetValue).length;
                const totalObjs = m.objectives.length;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMissionId(m.id)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all text-left ${
                      isSel
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : isDone
                        ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-400/50'
                        : isCurActive
                        ? 'border-amber-500/40 bg-amber-950/15 hover:border-amber-400/60'
                        : m.state === 'locked'
                        ? 'border-zinc-800/70 bg-zinc-900/20 opacity-60 hover:opacity-80'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-semibold ${categoryBadges[m.category].color}`}>
                        {categoryBadges[m.category].label}
                      </span>
                      {isDone ? (
                        <span className="text-xs text-emerald-400 flex items-center space-x-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACCOMPLISHED</span>
                        </span>
                      ) : isCurActive ? (
                        <span className="text-xs text-amber-400 flex items-center space-x-1 font-bold animate-pulse">
                          <Target className="w-3.5 h-3.5" />
                          <span>ACTIVE</span>
                        </span>
                      ) : m.state === 'locked' ? (
                        <span className="text-xs text-zinc-500 flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>LOCKED</span>
                        </span>
                      ) : (
                        <span className="text-xs text-cyan-400">AVAILABLE</span>
                      )}
                    </div>

                    <div className="text-sm font-semibold text-zinc-100 truncate">{m.title}</div>
                    <div className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{m.description}</div>

                    {/* Mini progress bar */}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Directives: {compObjs}/{totalObjs}</span>
                      <span className="text-cyan-400 font-mono">
                        {Math.round((compObjs / totalObjs) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-400' : isCurActive ? 'bg-amber-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${(compObjs / totalObjs) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Mission Briefing & Objectives Checklist */}
          <div className="col-span-7 flex flex-col min-h-0 bg-zinc-900/30 overflow-y-auto p-5">
            {currentMission ? (
              <div className="space-y-4">
                {/* Header Section */}
                <div className="border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded border uppercase font-semibold ${categoryBadges[currentMission.category].color}`}>
                      {categoryBadges[currentMission.category].label}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      REF ID: #{currentMission.id.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100 tracking-wide">
                    {currentMission.title}
                  </h2>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {currentMission.description}
                  </p>
                </div>

                {/* Lore / Aerospace Briefing Box */}
                <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-xs leading-relaxed text-zinc-400">
                  <div className="text-cyan-400 font-semibold mb-1 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ORBIT ACADEMY FLIGHT TELEMETRY BRIEFING</span>
                  </div>
                  <p>{currentMission.loreBriefing}</p>
                </div>

                {/* Waypoint Coordinates Indicator if present */}
                {currentMission.waypointCoordinates && (
                  <div className="flex items-center justify-between p-2.5 rounded bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>TARGET WAYPOINT COORDINATES:</span>
                    </div>
                    <span className="font-mono font-bold">
                      [{currentMission.waypointCoordinates[0]}, {currentMission.waypointCoordinates[1]}, {currentMission.waypointCoordinates[2]}]
                    </span>
                  </div>
                )}

                {/* Objectives Checklist */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center justify-between">
                    <span>OPERATIONAL OBJECTIVES</span>
                    <span className="text-zinc-500 text-[11px]">
                      {currentMission.objectives.filter((o) => o.currentValue >= o.targetValue).length} / {currentMission.objectives.length} FULFILLED
                    </span>
                  </div>
                  <div className="space-y-2">
                    {currentMission.objectives.map((obj) => {
                      const complete = obj.currentValue >= obj.targetValue;
                      const pct = Math.min(100, Math.round((obj.currentValue / obj.targetValue) * 100));

                      return (
                        <div
                          key={obj.id}
                          className={`p-3 rounded-lg border text-xs transition-all ${
                            complete
                              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                              : 'border-zinc-800 bg-zinc-950/50 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              {complete ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center flex-shrink-0 text-[10px] text-zinc-400">
                                  •
                                </div>
                              )}
                              <span className={`font-semibold ${complete ? 'line-through text-emerald-400/80' : 'text-zinc-100'}`}>
                                {obj.title}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-cyan-400">
                              {obj.currentValue} / {obj.targetValue}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 ml-6.5 mt-1">{obj.description}</p>
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-2 ml-6.5">
                            <div
                              className={`h-full ${complete ? 'bg-emerald-400' : 'bg-cyan-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mission Rewards Panel */}
                <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/15">
                  <div className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5 mb-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>MISSION COMPLETION REWARDS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {currentMission.rewards.researchPoints && (
                      <div className="p-2 rounded bg-zinc-950/60 border border-zinc-800 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400">RESEARCH DATA</div>
                          <div className="font-bold text-emerald-400">+{currentMission.rewards.researchPoints} RP</div>
                        </div>
                      </div>
                    )}
                    {currentMission.rewards.resources?.map((r) => (
                      <div key={r.type} className="p-2 rounded bg-zinc-950/60 border border-zinc-800 flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase">{r.type.replace('_', ' ')}</div>
                          <div className="font-bold text-cyan-300">+{r.count} Units</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {currentMission.rewards.title && (
                    <div className="mt-2 text-[11px] text-amber-200/80">
                      🏅 Flight Accolade: <span className="font-bold text-amber-300">"{currentMission.rewards.title}"</span>
                    </div>
                  )}
                </div>

                {/* Mission Operational Action Buttons */}
                <div className="pt-2">
                  {isCompleted ? (
                    <div className="p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/30 text-center text-xs font-bold text-emerald-300 flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CAMPAIGN DIRECTIVE ACCOMPLISHED & REWARDS ARCHIVED</span>
                    </div>
                  ) : allObjectivesMet && isActive ? (
                    <button
                      onClick={() => claimMissionReward(currentMission.id)}
                      className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2"
                    >
                      <Award className="w-5 h-5" />
                      <span>CLAIM MISSION REWARD & TRANSMIT TELEMETRY</span>
                    </button>
                  ) : isActive ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => trackMission(currentMission.id)}
                        className="flex-1 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center space-x-2"
                      >
                        <Target className="w-4 h-4" />
                        <span>PIN WAYPOINT TO VISOR HUD</span>
                      </button>
                      <div className="px-4 py-2.5 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>IN PROGRESS</span>
                      </div>
                    </div>
                  ) : isAvailable ? (
                    <button
                      onClick={() => startMission(currentMission.id)}
                      className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center space-x-2"
                    >
                      <Compass className="w-5 h-5" />
                      <span>ACTIVATE MISSION CAMPAIGN</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/70 text-center text-xs text-zinc-500 flex items-center justify-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>
                        LOCKED — Complete required precursor missions: {currentMission.prerequisiteMissionIds?.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
                Select a mission telemetry file from the directory to review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
