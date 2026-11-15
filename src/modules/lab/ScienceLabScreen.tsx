import React, { useState } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../components/ui/SpaceButton';
import {
  LAB_CHAMBERS,
  LabChamberId,
  LAB_MILESTONES,
} from './labData';
import { OrbitalMechanicsChamber } from './chambers/OrbitalMechanicsChamber';
import { SolarPhysicsChamber } from './chambers/SolarPhysicsChamber';
import { PlanetaryGeologyChamber } from './chambers/PlanetaryGeologyChamber';
import { SpaceEnvironmentChamber } from './chambers/SpaceEnvironmentChamber';
import { LabPad } from './components/LabPad';
import {
  Orbit,
  Sun,
  Globe2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Activity,
  Award,
} from 'lucide-react';

const CHAMBER_ICONS: Record<LabChamberId, React.ComponentType<{ className?: string }>> = {
  orbital: Orbit,
  solar: Sun,
  geology: Globe2,
  environment: Shield,
};

export const ScienceLabScreen: React.FC = () => {
  // Navigation State: Landing Gallery vs Active Chamber
  const [selectedChamber, setSelectedChamber] = useState<LabChamberId | null>(null);

  // Student XP & Completed Milestones
  const [totalXp, setTotalXp] = useState<number>(150);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([
    'orbit-circular',
    'solar-irradiance',
    'geology-compare',
  ]);

  // Streaming Telemetry Logs
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '[08:00:12] LAB_INIT: Primary experimental telemetry bus online.',
    '[08:00:15] SENSORS: 4 chambers calibrated to CODATA standards.',
    '[08:00:20] LABPAD: Student session initialized with 150 base XP.',
  ]);

  // Completion Reward Modal
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [latestRewardTitle, setLatestRewardTitle] = useState<string>('');

  const activeChamberMeta = LAB_CHAMBERS.find((c) => c.id === selectedChamber) || LAB_CHAMBERS[0];

  const handleLogTelemetry = (msg: string) => {
    const timestamp = new Date().toTimeString().slice(0, 8);
    setTelemetryLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 24)]);
  };

  const handleMilestoneAchieved = (milestoneId: string) => {
    if (!completedMilestones.includes(milestoneId)) {
      const milestone = LAB_MILESTONES.find((m) => m.id === milestoneId);
      const reward = milestone?.xpReward || 50;

      setCompletedMilestones((prev) => [...prev, milestoneId]);
      setTotalXp((x) => x + reward);

      handleLogTelemetry(
        `ACHIEVEMENT: Completed "${milestone?.title || milestoneId}" (+${reward} XP awarded)`
      );

      setLatestRewardTitle(milestone?.title || 'Scientific Milestone');
      setShowRewardModal(true);
    }
  };

  const handleSelectChamber = (id: LabChamberId) => {
    setSelectedChamber(id);
    handleLogTelemetry(`CHAMBER_SELECT: Entered ${id.toUpperCase()} chamber`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      {/* Subtle Starfield & Ambient Glow Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,35,65,0.4),rgba(3,6,17,0.95))]"
        aria-hidden="true"
      />

      <MasterHeader />

      <main className="relative z-10 flex-1 p-4 sm:p-6 md:p-8 pb-24 sm:pb-32 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* VIEW 1: SCIENCE LABORATORY LANDING EXPERIENCE */}
        {!selectedChamber && (
          <div className="flex flex-col gap-8 animate-fade-in w-full">
            {/* Lab Hero Introduction Banner */}
            <GlassCard
              variant="elevated"
              className="p-6 sm:p-8 flex flex-col justify-between border-white/10 bg-gradient-to-r from-[#07132B]/90 via-[#070C1B]/95 to-[#160B29]/80 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <TelemetryBadge
                      label="FUTURISTIC SCIENCE LABORATORY"
                      tone="cyan"
                      pulsing
                      size="sm"
                    />
                    <TelemetryBadge
                      label="4 VIRTUAL CHAMBERS"
                      tone="amber"
                      size="sm"
                    />
                    <TelemetryBadge
                      label="INTERACTIVE THREE.JS & PHYSICS"
                      tone="emerald"
                      size="sm"
                    />
                  </div>

                  <h1 className="mt-3 font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                    Orbit Academy Science Complex
                  </h1>

                  <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                    Conduct verified NASA-grade physics simulations across four dedicated virtual chambers: 
                    model Keplerian planetary trajectories, erupt solar flares, inspect comparative planetary geophysics, 
                    and test hypervelocity asteroid impacts.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1226]/80 px-4 py-2.5 font-mono text-xs text-[#94A3B8]">
                    <Award className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-[#F8FAFC] font-bold">{totalXp} XP</span>
                    <span>Earned</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1226]/80 px-4 py-2.5 font-mono text-xs text-[#94A3B8]">
                    <Activity className="h-4 w-4 text-[#10B981]" />
                    <span className="text-[#F8FAFC] font-bold">
                      {completedMilestones.length}/{LAB_MILESTONES.length}
                    </span>
                    <span>Milestones</span>
                  </div>
                </div>
              </div>

              {/* Lab Telemetry Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4 text-xs font-mono text-[#94A3B8]">
                <span className="text-[#38BDF8]">Chambers: 4 ONLINE</span>
                <span>•</span>
                <span>Astrodynamics: G = 6.67430×10⁻¹¹ m³/(kg·s²)</span>
                <span>•</span>
                <span className="text-[#F59E0B]">Solar Constant: 1,361 W/m²</span>
                <span>•</span>
                <span className="text-[#10B981]">Precision: IEEE-754 64-bit</span>
              </div>
            </GlassCard>

            {/* 4 VIRTUAL SCIENCE CHAMBER CARDS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Virtual Science Chambers ({LAB_CHAMBERS.length})
                </span>
                <span className="font-mono text-[10px] text-[#64748B]">
                  Select chamber to launch apparatus
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LAB_CHAMBERS.map((ch) => {
                  const Icon = CHAMBER_ICONS[ch.id];
                  const chamberMilestones = LAB_MILESTONES.filter((m) => m.chamberId === ch.id);
                  const isDoneCount = chamberMilestones.filter((m) =>
                    completedMilestones.includes(m.id)
                  ).length;

                  return (
                    <GlassCard
                      key={ch.id}
                      variant="interactive"
                      data-chamber-card={ch.id}
                      onClick={() => handleSelectChamber(ch.id)}
                      className="group p-6 flex flex-col justify-between border-white/10 bg-[#070C1B]/85 hover:bg-[#0B1528]/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <span
                            className="p-3 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${ch.accentColor}15`,
                              borderColor: `${ch.accentColor}30`,
                              color: ch.accentColor,
                            }}
                          >
                            <Icon className="h-6 w-6" />
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#94A3B8]">
                              {isDoneCount}/{chamberMilestones.length} Tasks
                            </span>
                            <TelemetryBadge
                              label={ch.discipline.split(' ')[0]}
                              tone={ch.glowTone}
                              size="sm"
                            />
                          </div>
                        </div>

                        <span className="mt-4 block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                          {ch.tagline}
                        </span>

                        <h3 className="mt-1 font-sans text-lg sm:text-xl font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                          {ch.name}
                        </h3>

                        <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                          {ch.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#64748B] flex items-center gap-1.5 truncate mr-2">
                          <Activity className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                          <span className="truncate">{ch.apparatus}</span>
                        </span>

                        <SpaceButton
                          variant="secondary"
                          size="sm"
                          icon={ArrowRight}
                          iconPosition="right"
                          onClick={() => handleSelectChamber(ch.id)}
                        >
                          Enter Chamber
                        </SpaceButton>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE VIRTUAL SCIENCE CHAMBER */}
        {selectedChamber && (
          <div className="flex flex-col gap-6 animate-fade-in w-full">
            {/* Chamber Top Navigation Bar */}
            <GlassCard
              variant="elevated"
              className="p-3.5 flex flex-wrap items-center justify-between gap-4 border-white/10"
            >
              <div className="flex items-center gap-3">
                <SpaceButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowLeft}
                  onClick={() => setSelectedChamber(null)}
                >
                  All Chambers
                </SpaceButton>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC]">
                      {activeChamberMeta.name}
                    </h2>
                    <TelemetryBadge
                      label="CHAMBER ACTIVE"
                      tone="emerald"
                      size="sm"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {activeChamberMeta.discipline} // {activeChamberMeta.telemetry}
                  </span>
                </div>
              </div>

              {/* Sub-Station Switcher Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {LAB_CHAMBERS.map((ch) => {
                  const Icon = CHAMBER_ICONS[ch.id];
                  const isActive = selectedChamber === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      data-chamber-tab={ch.id}
                      onClick={() => handleSelectChamber(ch.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all whitespace-nowrap ${
                        isActive
                          ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{ch.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Chamber Interactive Simulation Area */}
            {selectedChamber === 'orbital' && (
              <OrbitalMechanicsChamber
                onLogTelemetry={handleLogTelemetry}
                onMilestoneAchieved={handleMilestoneAchieved}
              />
            )}

            {selectedChamber === 'solar' && (
              <SolarPhysicsChamber
                onLogTelemetry={handleLogTelemetry}
                onMilestoneAchieved={handleMilestoneAchieved}
              />
            )}

            {selectedChamber === 'geology' && (
              <PlanetaryGeologyChamber
                onLogTelemetry={handleLogTelemetry}
                onMilestoneAchieved={handleMilestoneAchieved}
              />
            )}

            {selectedChamber === 'environment' && (
              <SpaceEnvironmentChamber
                onLogTelemetry={handleLogTelemetry}
                onMilestoneAchieved={handleMilestoneAchieved}
              />
            )}

            {/* Persistent LabPad Virtual Terminal (Inspired by Reference Images) */}
            <LabPad
              activeChamber={selectedChamber}
              completedMilestones={completedMilestones}
              onCompleteMilestone={handleMilestoneAchieved}
              telemetryLogs={telemetryLogs}
              totalXp={totalXp}
            />
          </div>
        )}

        {/* Milestone Achievement Modal */}
        {showRewardModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          >
            <GlassCard
              variant="elevated"
              glowingBorder="amber"
              className="relative flex max-w-md w-full flex-col items-center p-6 sm:p-8 text-center bg-[#070C1B]/95 border-[#F59E0B]/40 shadow-2xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.5)]">
                <Award className="h-8 w-8 animate-bounce" />
              </div>

              <TelemetryBadge
                label="MILESTONE VERIFIED"
                tone="amber"
                size="sm"
                className="mt-4"
              />

              <h3 className="mt-2 font-sans text-xl font-extrabold text-[#F8FAFC]">
                {latestRewardTitle}
              </h3>

              <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Outstanding laboratory research, Investigator! You have verified this physics condition using real mathematical astrodynamics.
              </p>

              <div className="mt-4 rounded-xl border border-amber-500/30 bg-[#F59E0B]/10 p-3 font-mono text-xs text-[#F59E0B] font-bold">
                +50 SCIENTIFIC RESEARCH XP CLAIMED
              </div>

              <SpaceButton
                variant="primary"
                size="md"
                className="mt-6 w-full"
                onClick={() => setShowRewardModal(false)}
              >
                Continue Experimentation
              </SpaceButton>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
};
