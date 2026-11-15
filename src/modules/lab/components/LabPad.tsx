import React, { useState } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../../components/ui/SpaceButton';
import { LabChamberId, LAB_MILESTONES } from '../labData';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Terminal,
  Activity,
  BookOpen,
} from 'lucide-react';

interface LabPadProps {
  activeChamber: LabChamberId;
  completedMilestones: string[];
  onCompleteMilestone: (milestoneId: string) => void;
  telemetryLogs: string[];
  totalXp: number;
  className?: string;
}

export const LabPad: React.FC<LabPadProps> = ({
  activeChamber,
  completedMilestones,
  onCompleteMilestone,
  telemetryLogs,
  totalXp,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'objectives' | 'theory' | 'telemetry'>('objectives');

  // Filter milestones for this chamber
  const chamberMilestones = LAB_MILESTONES.filter((m) => m.chamberId === activeChamber);
  const chamberCompletedCount = chamberMilestones.filter((m) =>
    completedMilestones.includes(m.id)
  ).length;
  const progressPct =
    chamberMilestones.length > 0
      ? Math.round((chamberCompletedCount / chamberMilestones.length) * 100)
      : 0;

  // Active guide prompt (next uncompleted milestone)
  const activePrompt =
    chamberMilestones.find((m) => !completedMilestones.includes(m.id)) ||
    chamberMilestones[chamberMilestones.length - 1];

  return (
    <GlassCard
      variant="elevated"
      glowingBorder="cyan"
      className={`border-cyan-500/30 bg-[#070F22]/95 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-4 py-2.5 gap-2 bg-gradient-to-r from-[#031A2A]/80 via-[#07132B]/80 to-[#0A1A3A]/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold tracking-wider text-[#F8FAFC]">
                LABPAD // SCIENTIFIC TERMINAL
              </span>
              <TelemetryBadge
                label="ONLINE"
                tone="emerald"
                pulsing
                size="sm"
              />
            </div>
            <span className="font-mono text-[9.5px] text-[#94A3B8]">
              SESSION 01 • REAL-TIME EXPERIMENTAL TELEMETRY
            </span>
          </div>
        </div>

        {/* Score & Progress Badges (Directly inspired by reference images) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-[#F59E0B]/10 px-2.5 py-1 font-mono text-[11px] text-[#F59E0B]">
            <Award className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className="font-bold">SCORE: {totalXp} XP</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-[#38BDF8]/10 px-2.5 py-1 font-mono text-[11px] text-[#38BDF8]">
            <Activity className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="font-bold">PROGRESS: {progressPct}%</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            title={isExpanded ? 'Minimize LabPad' : 'Expand LabPad'}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-[#F8FAFC]"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Primary Procedural Mission Briefing Prompt (Like LabPad prompt in reference images) */}
      <div className="border-b border-white/5 px-4 py-2 bg-[#050C1C]/90 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 shrink-0 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="font-mono text-[10px] text-[#38BDF8] uppercase tracking-wider font-bold shrink-0">
            OBJECTIVE PROMPT:
          </span>
          <span className="font-sans text-xs text-[#CBD5E1] truncate font-medium">
            {activePrompt?.instruction || 'All experimental milestones completed! Review theory and telemetry.'}
          </span>
        </div>

        {activePrompt && !completedMilestones.includes(activePrompt.id) && (
          <SpaceButton
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => onCompleteMilestone(activePrompt.id)}
            className="shrink-0 text-[10px] py-0.5 px-2.5"
          >
            Claim +{activePrompt.xpReward} XP
          </SpaceButton>
        )}
      </div>

      {/* Expanded Content Panels */}
      {isExpanded && (
        <div className="p-4 flex flex-col gap-3">
          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('objectives')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                activeTab === 'objectives'
                  ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Experiment Milestones ({chamberCompletedCount}/{chamberMilestones.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theory')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                activeTab === 'theory'
                  ? 'border border-[#F59E0B] bg-[#F59E0B]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Scientific Whiteboard & Formulas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                activeTab === 'telemetry'
                  ? 'border border-[#A78BFA] bg-[#A78BFA]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                  : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Telemetry Stream</span>
            </button>
          </div>

          {/* TAB 1: OBJECTIVES */}
          {activeTab === 'objectives' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
              {chamberMilestones.map((m) => {
                const isDone = completedMilestones.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : 'border-white/10 bg-[#0B1528]/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => onCompleteMilestone(m.id)}
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors ${
                            isDone
                              ? 'bg-emerald-500 text-[#030611]'
                              : 'border border-white/20 hover:border-[#38BDF8]'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </button>

                        <div>
                          <h4 className="font-sans text-xs font-bold text-[#F8FAFC]">
                            {m.title}
                          </h4>
                          <p className="font-sans text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">
                            {m.instruction}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        +{m.xpReward} XP
                      </span>
                    </div>

                    <div className="font-mono text-[9px] text-[#64748B] border-t border-white/5 pt-1.5 flex items-center justify-between">
                      <span className="truncate">{m.scientificCitation}</span>
                      {isDone ? (
                        <span className="text-emerald-400 font-bold shrink-0">COMPLETED</span>
                      ) : (
                        <span className="text-[#38BDF8] shrink-0">PENDING</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: WHITEBOARD & THEORY FORMULAS */}
          {activeTab === 'theory' && (
            <div className="p-4 rounded-xl border border-white/10 bg-[#030814] flex flex-col gap-3 font-mono animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[#F59E0B] font-bold tracking-wide">
                  LABORATORY WHITEBOARD & GOVERNING EQUATIONS
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  NASA & CODATA STANDARDIZED CONSTANTS
                </span>
              </div>

              {activeChamber === 'orbital' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#38BDF8] font-bold block mb-1">Vis-Viva Equation</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      v² = GM (2/r - 1/a)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Relates orbital speed v to instantaneous radius r and semi-major axis a.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#F59E0B] font-bold block mb-1">Kepler’s Harmonic 3rd Law</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      T² = (4π² / GM) · a³
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      The square of the orbital period T is directly proportional to the cube of semi-major axis a.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#10B981] font-bold block mb-1">Orbital Eccentricity</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      e = (r_a - r_p) / (r_a + r_p)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      e = 0 for circular orbits, 0 &lt; e &lt; 1 for ellipses, e = 1 for parabolic escape.
                    </p>
                  </div>
                </div>
              )}

              {activeChamber === 'solar' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#F59E0B] font-bold block mb-1">Stefan-Boltzmann Law</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      L = 4π R² σ T⁴
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Total solar radiant luminosity emitted by the photosphere at effective temperature T.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#38BDF8] font-bold block mb-1">Solar Constant at 1 AU</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      S₀ = L / (4π d²) ≈ 1,361 W/m²
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Direct solar irradiance received perpendicularly above Earth’s atmosphere.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#EF4444] font-bold block mb-1">Magnetic Energy Density</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      u_B = B² / (2 μ₀)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Tangled magnetic field lines store energy converted into kinetic CME blasts during reconnection.
                    </p>
                  </div>
                </div>
              )}

              {activeChamber === 'geology' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#10B981] font-bold block mb-1">Hydrostatic Equilibrium</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      dP/dr = -ρ(r) · g(r)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Balance between inward gravitational crushing pressure and outward thermal/bulk modulus pressure.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#F59E0B] font-bold block mb-1">Barometric Pressure Profile</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      P(z) = P₀ · exp(-z / H)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Atmospheric scale height H = k_B T / (m g) dictates density decay with altitude.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#38BDF8] font-bold block mb-1">Surface Gravity Scaling</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      g = G M / R² = (4/3) π G ρ R
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Determines escape velocities and maximum volcanic mountain heights (e.g. Olympus Mons).
                    </p>
                  </div>
                </div>
              )}

              {activeChamber === 'environment' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#A78BFA] font-bold block mb-1">Kinetic Impact Energy</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      E = ½ m v²  (1 Mt TNT = 4.184×10¹⁵ J)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Kinetic energy delivered by hypervelocity projectile instantaneously converted into vapor and crater excavation.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#38BDF8] font-bold block mb-1">Transient Crater Diameter</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      D_tc ≈ 1.16 · (E / ρ_target)^0.29
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Schmidt-Holsapple pi-scaling law for gravity-dominated impact crater formation.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[#10B981] font-bold block mb-1">Radiation Attenuation</span>
                    <div className="font-mono text-sm text-[#F8FAFC] my-1 font-bold">
                      I = I₀ · exp(-μ · x)
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] font-sans">
                      Beer-Lambert law for ionizing radiation absorbed through protective shielding of thickness x.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STREAMING TELEMETRY LOG */}
          {activeTab === 'telemetry' && (
            <div className="rounded-xl border border-white/10 bg-[#02050E] p-3 font-mono text-[10.5px] text-[#94A3B8] flex flex-col gap-1 max-h-48 overflow-y-auto">
              {telemetryLogs.length === 0 ? (
                <span className="text-[#64748B] italic">No telemetry recorded yet. Adjust controls to initialize streaming.</span>
              ) : (
                telemetryLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[#38BDF8]">{log.slice(0, 10)}</span>
                    <span className="text-[#F8FAFC]">{log.slice(10)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};
