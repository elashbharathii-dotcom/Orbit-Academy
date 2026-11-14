import React, { useState, useEffect, useRef } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../components/ui/SpaceButton';
import {
  Atom,
  Globe2,
  Orbit,
  Telescope,
  Play,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Activity,
  Layers,
  Check,
  Plus,
} from 'lucide-react';

type LabChamberId = 'physics' | 'planetary' | 'chemistry' | 'astronomy';

interface ChamberMeta {
  id: LabChamberId;
  name: string;
  tagline: string;
  discipline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  glowTone: 'cyan' | 'amber' | 'emerald' | 'violet';
  description: string;
  telemetry: string;
}

const CHAMBERS: ChamberMeta[] = [
  {
    id: 'physics',
    name: 'Relativistic Spacetime & Black Holes',
    tagline: 'General Relativity & Gravitational Lensing',
    discipline: 'Theoretical Astrophysics',
    icon: Orbit,
    accentColor: '#38BDF8',
    glowTone: 'cyan',
    description:
      'Simulate the gravitational lensing of light around supermassive black holes. Adjust core mass in solar units, calculate the Schwarzschild radius, and observe relativistic Doppler beaming.',
    telemetry: 'Einstein Ring // Event Horizon Raytracer',
  },
  {
    id: 'planetary',
    name: 'Planetary Vacuum Drop Tower',
    tagline: 'Gravitational Kinematics & Freefall',
    discipline: 'Planetary Mechanics',
    icon: Globe2,
    accentColor: '#F59E0B',
    glowTone: 'amber',
    description:
      'Drop standardized test masses through evacuated shafts across five worlds—from the Moon to the surface of the Sun. Calculate instantaneous velocity and quadratic time dilation.',
    telemetry: 'Vacuum Drop Shaft // 5 Planetary Gravities',
  },
  {
    id: 'chemistry',
    name: 'Cosmic Nucleosynthesis & Molecules',
    tagline: 'Stellar Fusion & Chemical Synthesis',
    discipline: 'Astrochemistry',
    icon: Atom,
    accentColor: '#10B981',
    glowTone: 'emerald',
    description:
      'Investigate the cosmic abundance of elements forged in stellar furnaces and supernovae. Assemble chemical compounds like interstellar water ice, cryogenic methane, and mantle silicates.',
    telemetry: 'Periodic Abundance Matrix // Molecular Assembly',
  },
  {
    id: 'astronomy',
    name: 'Multi-Wavelength Observatory',
    tagline: 'Electromagnetic Spectrum Analysis',
    discipline: 'Observational Astronomy',
    icon: Telescope,
    accentColor: '#A78BFA',
    glowTone: 'violet',
    description:
      'Observe the Crab Nebula supernova remnant across radio, infrared, optical, and X-ray bands. Discover how different wavelengths expose distinct physical mechanisms.',
    telemetry: 'M1 Crab Remnant // 4 Spectral Bandpasses',
  },
];

// Chemical Elements
interface CosmicElement {
  sym: string;
  name: string;
  z: number;
  mass: string;
  cat: string;
  cosmicRole: string;
  stellarOrigin: string;
  color: string;
}

const COSMIC_ELEMENTS: CosmicElement[] = [
  {
    sym: 'H',
    name: 'Hydrogen',
    z: 1,
    mass: '1.008',
    cat: 'Stellar Fuel',
    cosmicRole: 'Accounts for 74% of baryonic mass in the universe. Primary fuel for stellar fusion.',
    stellarOrigin: 'Big Bang Nucleosynthesis',
    color: '#38BDF8',
  },
  {
    sym: 'He',
    name: 'Helium',
    z: 2,
    mass: '4.003',
    cat: 'Noble Gas',
    cosmicRole: 'Ash of hydrogen fusion. Second most abundant element; major constituent of gas giants.',
    stellarOrigin: 'Big Bang & Main Sequence Fusion',
    color: '#FBBF24',
  },
  {
    sym: 'C',
    name: 'Carbon',
    z: 6,
    mass: '12.011',
    cat: 'Organogenic',
    cosmicRole: 'Backbone of organic molecules and interstellar polycyclic aromatic hydrocarbons.',
    stellarOrigin: 'Triple-Alpha Process in Red Giants',
    color: '#34D399',
  },
  {
    sym: 'N',
    name: 'Nitrogen',
    z: 7,
    mass: '14.007',
    cat: 'Atmospheric',
    cosmicRole: 'Dominates Earth atmosphere (78%) and Titan atmosphere (98%). Essential for amino acids.',
    stellarOrigin: 'CNO Cycle in Massive Stars',
    color: '#818CF8',
  },
  {
    sym: 'O',
    name: 'Oxygen',
    z: 8,
    mass: '15.999',
    cat: 'Oxidizer',
    cosmicRole: 'Third most abundant element. Reacts with hydrogen to create vast oceans and interstellar ices.',
    stellarOrigin: 'Helium Fusion in Massive Stars',
    color: '#F472B6',
  },
  {
    sym: 'Si',
    name: 'Silicon',
    z: 14,
    mass: '28.085',
    cat: 'Silicate',
    cosmicRole: 'Forms quartz and olivine minerals comprising 90% of Earth’s crust and planetary mantles.',
    stellarOrigin: 'Oxygen Burning in Supergiants',
    color: '#FB923C',
  },
  {
    sym: 'Fe',
    name: 'Iron',
    z: 26,
    mass: '55.845',
    cat: 'Transition Metal',
    cosmicRole: 'Tightly bound nucleus. Generates planetary magnetic shields and cores; ends stellar fusion.',
    stellarOrigin: 'Silicon Burning & Core-Collapse Supernovae',
    color: '#EF4444',
  },
];

// Molecular Recipes
interface CosmicMolecule {
  id: string;
  name: string;
  formula: string;
  required: { sym: string; count: number }[];
  location: string;
  role: string;
}

const COSMIC_MOLECULES: CosmicMolecule[] = [
  {
    id: 'water',
    name: 'Interstellar Water Ice',
    formula: 'H₂O',
    required: [
      { sym: 'H', count: 2 },
      { sym: 'O', count: 1 },
    ],
    location: 'Comets, Europa oceans, Enceladus plumes, Earth',
    role: 'Universal polar solvent essential for biochemical reactions and planetary habitability.',
  },
  {
    id: 'methane',
    name: 'Cryogenic Methane',
    formula: 'CH₄',
    required: [
      { sym: 'C', count: 1 },
      { sym: 'H', count: 4 },
    ],
    location: 'Titan lakes, Uranus & Neptune mantles',
    role: 'Condenses into liquid lakes on Titan; under mantle pressure, compresses into diamond rain.',
  },
  {
    id: 'silica',
    name: 'Silicate Mantle Rock',
    formula: 'SiO₂',
    required: [
      { sym: 'Si', count: 1 },
      { sym: 'O', count: 2 },
    ],
    location: 'Terrestrial crusts, stony meteorites, Moon regolith',
    role: 'The primary structural chemical foundation of rocky terrestrial planets.',
  },
  {
    id: 'ammonia',
    name: 'Atmospheric Ammonia',
    formula: 'NH₃',
    required: [
      { sym: 'N', count: 1 },
      { sym: 'H', count: 3 },
    ],
    location: 'Jupiter upper cloud decks, Saturn storms',
    role: 'Freezes into white reflective clouds in gas giant upper tropospheres.',
  },
];

export const ScienceLabScreen: React.FC = () => {
  // Navigation State: Landing Gallery vs Chamber
  const [selectedChamber, setSelectedChamber] = useState<LabChamberId | null>(null);

  // --- 1. BLACK HOLE LENSING STATE ---
  const [blackHoleMass, setBlackHoleMass] = useState<number>(4.3); // Million Solar Masses
  const [showDoppler, setShowDoppler] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Raytracer Canvas Animation
  useEffect(() => {
    if (selectedChamber !== 'physics') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Schwarzschild Radius scaled visually
      const rs = 16 + blackHoleMass * 3.8;

      // Starfield background
      ctx.fillStyle = '#02050D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant stars lensed around the hole
      for (let i = 0; i < 40; i++) {
        const angle = (i * 9) + t * 0.005;
        const dist = rs * 1.8 + (i * 3.5);
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist * 0.6;
        ctx.fillStyle = i % 3 === 0 ? '#38BDF8' : '#F8FAFC';
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // 1. Accretion Disk Plasma Ring
      const diskGrad = ctx.createRadialGradient(cx, cy, rs * 1.4, cx, cy, rs * 3.6);
      diskGrad.addColorStop(0, '#FEF08A');
      diskGrad.addColorStop(0.25, '#F59E0B');
      diskGrad.addColorStop(0.7, '#DC2626');
      diskGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1.85, 0.48); // Tilted perspective
      ctx.rotate(t * 0.025);

      ctx.fillStyle = diskGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rs * 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Gravitational Lensing Halo (Einstein Ring)
      ctx.strokeStyle = showDoppler ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, rs * 1.68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Event Horizon (Absolute Shadow Void)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, rs, 0, Math.PI * 2);
      ctx.fill();

      // 4. Photon Sphere Glow Ring (r = 1.5 rs)
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#FDE047';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, rs * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      t += 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedChamber, blackHoleMass, showDoppler]);

  // --- 2. PLANETARY GRAVITY STATE ---
  const [gravityWorld, setGravityWorld] = useState<{ name: string; g: number; col: string; desc: string }>({
    name: 'Earth',
    g: 9.81,
    col: '#38BDF8',
    desc: 'Standard terrestrial reference: 1.00 g surface gravity.',
  });
  const [dropHeight, setDropHeight] = useState<number>(50); // meters
  const dropMass = 1; // kg standardized test mass
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [impactVelocity, setImpactVelocity] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [ballY, setBallY] = useState<number>(0);

  const WORLDS = [
    { name: 'Moon', g: 1.62, col: '#94A3B8', desc: '16.6% Earth gravity. Slow, buoyant descent.' },
    { name: 'Mars', g: 3.72, col: '#EF4444', desc: '38% Earth gravity. Thinned carbon-dioxide atmosphere.' },
    { name: 'Earth', g: 9.81, col: '#38BDF8', desc: '1.00 g standard terrestrial baseline.' },
    { name: 'Jupiter', g: 24.79, col: '#F97316', desc: '2.53 g heavy gravitational pull at 1-bar cloud level.' },
    { name: 'Sun Surface', g: 274.0, col: '#F59E0B', desc: '27.9 g extreme gravitational acceleration.' },
  ];

  const handleStartDrop = () => {
    setIsDropping(true);
    setBallY(0);
    const calculatedTime = Math.sqrt((2 * dropHeight) / gravityWorld.g);
    const calculatedVelocity = gravityWorld.g * calculatedTime;
    setDropTime(calculatedTime);
    setImpactVelocity(calculatedVelocity);

    const startTime = Date.now();
    const durationMs = Math.min(3000, calculatedTime * 1000);

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / durationMs;
      if (elapsed >= 1) {
        setBallY(100);
        setIsDropping(false);
        clearInterval(interval);
      } else {
        setBallY(elapsed * elapsed * 100); // Quadratic acceleration y = 1/2 g t^2
      }
    }, 16);
  };

  // --- 3. CHEMISTRY & MOLECULE SYNTHESIS STATE ---
  const [selectedElement, setSelectedElement] = useState<CosmicElement>(COSMIC_ELEMENTS[0]);
  const [selectedMolecule, setSelectedMolecule] = useState<CosmicMolecule>(COSMIC_MOLECULES[0]);
  const [synthesizedMolecules, setSynthesizedMolecules] = useState<string[]>(['water']);

  const handleSynthesize = (molecule: CosmicMolecule) => {
    if (!synthesizedMolecules.includes(molecule.id)) {
      setSynthesizedMolecules((prev) => [...prev, molecule.id]);
    }
    setSelectedMolecule(molecule);
  };

  // --- 4. MULTI-WAVELENGTH TELESCOPE STATE ---
  const [wavelength, setWavelength] = useState<'optical' | 'infrared' | 'xray' | 'radio'>('optical');

  const SPECTRA = [
    {
      id: 'optical' as const,
      name: 'Visible Optical (400 - 700 nm)',
      observatory: 'Hubble Space Telescope',
      color: '#38BDF8',
      desc: 'Reveals optical synchrotron glow and filaments of ionized hydrogen and sulfur expanding at 1,500 km/s.',
      temp: '10,000 K',
    },
    {
      id: 'infrared' as const,
      name: 'Near / Mid-Infrared (0.7 - 300 µm)',
      observatory: 'James Webb Space Telescope (JWST)',
      color: '#EF4444',
      desc: 'Penetrates opaque circumstellar dust lanes to uncover thermal emission from warm silicate grains.',
      temp: '30 - 300 K',
    },
    {
      id: 'xray' as const,
      name: 'High-Energy X-Ray (0.01 - 10 nm)',
      observatory: 'Chandra X-Ray Observatory',
      color: '#A855F7',
      desc: 'Exposes the ultra-relativistic pulsar wind nebula surrounding the central neutron star spinning 30 times per second.',
      temp: '1,000,000+ K',
    },
    {
      id: 'radio' as const,
      name: 'Radio Microwave (1 mm - 100 km)',
      observatory: 'Very Large Array (VLA)',
      color: '#F59E0B',
      desc: 'Traces magnetic field lines where electrons spiral at near light-speed, generating polarized synchrotron radiation.',
      temp: '< 10 K',
    },
  ];

  const currentSpectrum = SPECTRA.find((s) => s.id === wavelength) || SPECTRA[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      {/* Subtle Starfield & Ambient Glow Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,35,65,0.35),rgba(3,6,17,0.95))]"
        aria-hidden="true"
      />

      <MasterHeader />

      <main className="relative z-10 flex-1 p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 max-w-7xl w-full mx-auto flex flex-col gap-8">
        {/* VIEW 1: SCIENCE LABORATORY LANDING EXPERIENCE */}
        {!selectedChamber && (
          <div className="flex flex-col gap-8 animate-fade-in">
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
                      label="4 EXPERIMENTAL CHAMBERS"
                      tone="amber"
                      size="sm"
                    />
                    <span className="font-mono text-[10px] text-[#94A3B8] hidden sm:inline">
                      // GENERAL RELATIVITY • KINEMATICS • SPECTROSCOPY
                    </span>
                  </div>

                  <h1 className="mt-3 font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                    Aerospace Experimental Chambers
                  </h1>

                  <p className="mt-2 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                    Welcome to the Orbit Academy science complex. Conduct verified astrophysics simulations:
                    calculate spacetime curvature near event horizons, drop test masses in simulated planetary gravity,
                    synthesize interplanetary chemical compounds, and observe the Crab Nebula across the electromagnetic spectrum.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1226]/80 px-4 py-2.5 font-mono text-xs text-[#94A3B8]">
                    <Activity className="h-4 w-4 text-[#10B981]" />
                    <span className="text-[#F8FAFC] font-bold">100% Real</span>
                    <span>Physics Calculations</span>
                  </div>
                </div>
              </div>

              {/* Lab Telemetry Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4 text-xs font-mono text-[#94A3B8]">
                <span className="text-[#38BDF8]">Chamber Status: ALL ONLINE</span>
                <span>•</span>
                <span>Gravity Engine: G = 6.67430×10⁻¹¹ m³/(kg·s²)</span>
                <span>•</span>
                <span className="text-[#F59E0B]">Precision: IEEE-754 64-bit</span>
              </div>
            </GlassCard>

            {/* 4 EXPERIMENTAL CHAMBER CARDS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Experimental Chambers (4)
                </span>
                <span className="font-mono text-[10px] text-[#64748B]">
                  Select chamber to begin experiment
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CHAMBERS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <GlassCard
                      key={ch.id}
                      variant="interactive"
                      onClick={() => {
                        setSelectedChamber(ch.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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

                          <TelemetryBadge
                            label={ch.discipline}
                            tone={ch.glowTone}
                            size="sm"
                          />
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
                        <span className="font-mono text-[10px] text-[#64748B] flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-[#38BDF8]" />
                          <span>{ch.telemetry}</span>
                        </span>

                        <SpaceButton
                          variant="secondary"
                          size="sm"
                          icon={ArrowRight}
                          iconPosition="right"
                          onClick={() => {
                            setSelectedChamber(ch.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
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

        {/* VIEW 2: INTERACTIVE EXPERIMENTAL CHAMBERS */}
        {selectedChamber && (
          <div className="flex flex-col gap-6 animate-fade-in">
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
                      {CHAMBERS.find((c) => c.id === selectedChamber)?.name}
                    </h2>
                    <TelemetryBadge
                      label="CHAMBER ACTIVE"
                      tone="emerald"
                      size="sm"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {CHAMBERS.find((c) => c.id === selectedChamber)?.discipline}
                  </span>
                </div>
              </div>

              {/* Sub-Station Switcher Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {CHAMBERS.map((ch) => {
                  const Icon = ch.icon;
                  const isActive = selectedChamber === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChamber(ch.id)}
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

            {/* 1. SPACE PHYSICS: RELATIVISTIC BLACK HOLE LENSING CHAMBER */}
            {selectedChamber === 'physics' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Lensing Canvas Viewport */}
                <GlassCard
                  variant="elevated"
                  className="lg:col-span-2 relative aspect-[16/10] min-h-[380px] p-5 flex flex-col justify-between overflow-hidden border-white/10 bg-[#000000]"
                >
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Orbit className="h-4 w-4 text-[#38BDF8]" />
                      <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                        SPACETIME CURVATURE // SAGITTARIUS A* ANALOGUE
                      </span>
                    </div>
                    <TelemetryBadge
                      label="PHOTON SPHERE"
                      value={`r = ${(blackHoleMass * 2.95 * 1.5).toFixed(1)}M km`}
                      tone="amber"
                      size="sm"
                    />
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={720}
                    height={450}
                    className="absolute inset-0 h-full w-full pointer-events-none"
                  />

                  <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-3 text-[10.5px] font-mono text-[#94A3B8] gap-2">
                    <span>
                      Event Horizon: <strong className="text-[#F8FAFC]">{(blackHoleMass * 2.95).toFixed(1)}M km</strong>
                    </span>
                    <span>
                      ISCO Orbit: <strong className="text-[#10B981]">{(blackHoleMass * 2.95 * 3).toFixed(1)}M km</strong>
                    </span>
                    <span className="text-[#38BDF8]">v_escape = c (300,000 km/s)</span>
                  </div>
                </GlassCard>

                {/* Relativistic Mass & Parameter Controls */}
                <div className="flex flex-col gap-4">
                  <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                        Black Hole Core Parameters
                      </h3>
                      <TelemetryBadge
                        label="GENERAL RELATIVITY"
                        tone="cyan"
                        size="sm"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-[#94A3B8]">Core Mass M:</span>
                        <span className="font-bold text-[#F59E0B]">
                          {blackHoleMass.toFixed(1)} Million M☉
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="10.0"
                        step="0.1"
                        value={blackHoleMass}
                        onChange={(e) => setBlackHoleMass(parseFloat(e.target.value))}
                        className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                      />
                    </div>

                    {/* Doppler Beaming Toggle */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold text-[#F8FAFC]">
                          Relativistic Doppler Beaming
                        </span>
                        <span className="font-mono text-[10px] text-[#94A3B8]">
                          Blue-shifted approaching plasma
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDoppler((prev) => !prev)}
                        className={`rounded-full px-3 py-1 font-mono text-xs font-bold transition-all ${
                          showDoppler
                            ? 'bg-[#38BDF8] text-[#030611]'
                            : 'bg-white/10 text-[#94A3B8]'
                        }`}
                      >
                        {showDoppler ? 'ENABLED' : 'OFF'}
                      </button>
                    </div>

                    {/* Calculated Metrics Table */}
                    <div className="flex flex-col gap-2 font-mono text-xs border-t border-white/5 pt-3">
                      <div className="flex justify-between py-1 border-b border-white/[0.03]">
                        <span className="text-[#94A3B8]">Schwarzschild Radius rₛ:</span>
                        <span className="text-[#F8FAFC]">{(blackHoleMass * 2.95).toFixed(1)} M km</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.03]">
                        <span className="text-[#94A3B8]">Photon Sphere (1.5 rₛ):</span>
                        <span className="text-[#38BDF8]">{(blackHoleMass * 2.95 * 1.5).toFixed(1)} M km</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#94A3B8]">Innermost Stable Orbit (3 rₛ):</span>
                        <span className="text-[#10B981]">{(blackHoleMass * 2.95 * 3).toFixed(1)} M km</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Theoretical Principle Card */}
                  <GlassCard variant="elevated" className="p-4 border-white/10">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#38BDF8] font-bold mb-1">
                      <Sparkles className="h-3 w-3" />
                      <span>EINSTEIN’S EQUIVALENCE PRINCIPLE</span>
                    </div>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                      Mass curves spacetime. Photons traveling grazing the event horizon are deflected by gravitational lensing into a glowing Einstein ring. Inside the Schwarzschild radius, escape velocity exceeds light-speed c.
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* 2. PLANETARY GRAVITY EXPERIMENT CHAMBER */}
            {selectedChamber === 'planetary' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Drop Tower Simulator Shaft */}
                <GlassCard
                  variant="elevated"
                  className="lg:col-span-2 relative aspect-[16/10] min-h-[380px] p-6 flex flex-col justify-between border-white/10 bg-[#040814]"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4" style={{ color: gravityWorld.col }} />
                      <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                        VACUUM DROP SHAFT // {gravityWorld.name.toUpperCase()} (g = {gravityWorld.g} m/s²)
                      </span>
                    </div>
                    <TelemetryBadge
                      label="DROP HEIGHT"
                      value={`${dropHeight} m`}
                      tone="amber"
                      size="sm"
                    />
                  </div>

                  {/* Simulated Shaft */}
                  <div className="relative flex-1 flex items-center justify-center my-4">
                    <div className="relative h-full w-28 rounded-2xl border border-white/10 bg-[#070C1B]/90 flex flex-col justify-between p-2 shadow-inner">
                      {/* Height markers */}
                      <div className="flex justify-between text-[8px] font-mono text-[#94A3B8] border-b border-white/5 pb-1">
                        <span>{dropHeight}m</span>
                        <span>0m</span>
                      </div>

                      {/* Falling Mass */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full shadow-2xl transition-none"
                        style={{
                          top: `${Math.min(91, 9 + ballY * 0.82)}%`,
                          backgroundColor: gravityWorld.col,
                          boxShadow: `0 0 20px ${gravityWorld.col}`,
                        }}
                      >
                        <span className="font-mono text-[9px] font-bold text-[#030611]">{dropMass} kg</span>
                      </div>

                      {/* Impact Floor */}
                      <div className="h-2 w-full rounded bg-white/20 border-t border-white/40" />
                    </div>
                  </div>

                  {/* Telemetry Footer */}
                  <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-3 gap-3">
                    <div className="font-mono text-xs flex items-center gap-3">
                      <div>
                        <span className="text-[#94A3B8]">Fall Time: </span>
                        <strong className="text-[#10B981]">
                          {dropTime !== null ? `${dropTime.toFixed(3)} s` : '--'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">Impact Speed: </span>
                        <strong className="text-[#38BDF8]">
                          {impactVelocity !== null ? `${impactVelocity.toFixed(1)} m/s (${(impactVelocity * 3.6).toFixed(0)} km/h)` : '--'}
                        </strong>
                      </div>
                    </div>

                    <SpaceButton
                      variant="primary"
                      size="sm"
                      icon={Play}
                      disabled={isDropping}
                      onClick={handleStartDrop}
                    >
                      Release Mass
                    </SpaceButton>
                  </div>
                </GlassCard>

                {/* World Selection & Height Controls */}
                <div className="flex flex-col gap-4">
                  <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
                    <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                      Select Gravitational World
                    </h3>

                    <div className="flex flex-col gap-2">
                      {WORLDS.map((w) => (
                        <button
                          key={w.name}
                          type="button"
                          onClick={() => {
                            setGravityWorld(w);
                            setDropTime(null);
                            setImpactVelocity(null);
                            setBallY(0);
                          }}
                          className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                            gravityWorld.name === w.name
                              ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-md'
                              : 'border-white/5 bg-[#0B1226]/50 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: w.col }}
                            />
                            <span className="font-sans text-xs font-bold text-[#F8FAFC]">
                              {w.name}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-[#38BDF8] font-semibold">
                            {w.g} m/s²
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Height Slider */}
                    <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-[#94A3B8]">Release Height</span>
                        <span className="font-bold text-[#F8FAFC]">{dropHeight} meters</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={dropHeight}
                        onChange={(e) => {
                          setDropHeight(parseInt(e.target.value, 10));
                          setDropTime(null);
                          setImpactVelocity(null);
                          setBallY(0);
                        }}
                        className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                      />
                    </div>
                  </GlassCard>

                  {/* Physics Formula Card */}
                  <GlassCard variant="elevated" className="p-4 border-white/10 font-mono text-xs">
                    <span className="text-[10px] text-[#F59E0B] font-bold block mb-1">
                      GALILEAN KINEMATICS:
                    </span>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                      In a vacuum, gravitational acceleration is completely independent of mass: t = √(2h / g). All objects fall at the identical acceleration regardless of composition.
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* 3. CHEMISTRY LAB: PERIODIC TABLE & MOLECULAR SYNTHESIS */}
            {selectedChamber === 'chemistry' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Elements Matrix & Molecule Assembly */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Element Matrix */}
                  <GlassCard variant="elevated" className="p-6 border-white/10">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#10B981] font-bold">
                        ASTROPHYSICAL PERIODIC ABUNDANCE MATRIX
                      </span>
                      <TelemetryBadge
                        label="7 COSMIC ELEMENTS"
                        tone="emerald"
                        size="sm"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                      {COSMIC_ELEMENTS.map((el) => {
                        const isSelected = selectedElement.sym === el.sym;
                        return (
                          <button
                            key={el.sym}
                            type="button"
                            onClick={() => setSelectedElement(el)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                              isSelected
                                ? 'border-[#10B981] bg-[#10B981]/20 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                                : 'border-white/5 bg-[#0B1226]/50 hover:bg-white/5'
                            }`}
                          >
                            <span className="font-mono text-[9px] text-[#94A3B8]">Z = {el.z}</span>
                            <span
                              className="font-sans text-2xl font-extrabold my-0.5"
                              style={{ color: el.color }}
                            >
                              {el.sym}
                            </span>
                            <span className="font-sans text-[11px] text-[#CBD5E1] truncate max-w-full">
                              {el.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </GlassCard>

                  {/* Molecular Construction Workspace */}
                  <GlassCard variant="elevated" className="p-6 border-white/10">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#38BDF8]" />
                        <span className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                          MOLECULAR SYNTHESIS WORKBENCH
                        </span>
                      </div>
                      <TelemetryBadge
                        label="SYNTHESIZED"
                        value={`${synthesizedMolecules.length} / ${COSMIC_MOLECULES.length}`}
                        tone="cyan"
                        size="sm"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {COSMIC_MOLECULES.map((mol) => {
                        const isSynthesized = synthesizedMolecules.includes(mol.id);
                        const isSelected = selectedMolecule.id === mol.id;

                        return (
                          <div
                            key={mol.id}
                            onClick={() => handleSynthesize(mol)}
                            className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#38BDF8] bg-[#38BDF8]/10'
                                : 'border-white/5 bg-[#0B1226]/50 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-sans text-lg font-bold text-[#F8FAFC]">
                                {mol.name} ({mol.formula})
                              </span>
                              {isSynthesized ? (
                                <span className="flex items-center gap-1 font-mono text-[10px] text-[#10B981] font-bold">
                                  <Check className="h-3 w-3" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 font-mono text-[10px] text-[#38BDF8]">
                                  <Plus className="h-3 w-3" />
                                  <span>Synthesize</span>
                                </span>
                              )}
                            </div>

                            <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                              {mol.role}
                            </p>

                            <div className="font-mono text-[10px] text-[#64748B] border-t border-white/5 pt-2">
                              <span>Found in: {mol.location}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </div>

                {/* Element & Molecule Telemetry Sidebar */}
                <div className="flex flex-col gap-4">
                  <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-3xl font-extrabold" style={{ color: selectedElement.color }}>
                        {selectedElement.sym}
                      </span>
                      <TelemetryBadge
                        label={selectedElement.cat}
                        tone="emerald"
                        size="sm"
                      />
                    </div>

                    <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
                      {selectedElement.name} (Atomic Mass: {selectedElement.mass})
                    </h3>

                    <div className="font-mono text-xs text-[#94A3B8] space-y-2">
                      <div>
                        <span className="text-[#38BDF8] font-bold block">Cosmic Role:</span>
                        <p className="font-sans text-xs text-[#CBD5E1] mt-0.5">{selectedElement.cosmicRole}</p>
                      </div>
                      <div>
                        <span className="text-[#F59E0B] font-bold block">Stellar Origin:</span>
                        <p className="font-sans text-xs text-[#CBD5E1] mt-0.5">{selectedElement.stellarOrigin}</p>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard variant="elevated" className="p-4 border-white/10">
                    <span className="font-mono text-[10px] text-[#10B981] font-bold block mb-1">
                      NUCLEOSYNTHETIC MECHANISM:
                    </span>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                      Elements lighter than iron fuse during standard stellar hydrogen/helium/carbon burning. All elements heavier than iron are forged exclusively through neutron capture during violent core-collapse supernovae or kilonova neutron star collisions.
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* 4. ASTRONOMY LAB: MULTI-WAVELENGTH TELESCOPE CHAMBER */}
            {selectedChamber === 'astronomy' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Telescope Spectral Viewport */}
                <GlassCard
                  variant="elevated"
                  className="lg:col-span-2 relative aspect-[16/10] min-h-[380px] p-6 flex flex-col justify-between border-white/10 bg-[#02050D] overflow-hidden"
                >
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Telescope className="h-4 w-4" style={{ color: currentSpectrum.color }} />
                      <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                        CRAB NEBULA (M1) // {currentSpectrum.observatory.toUpperCase()}
                      </span>
                    </div>
                    <TelemetryBadge
                      label="BANDPASS"
                      value={wavelength.toUpperCase()}
                      tone="violet"
                      size="sm"
                    />
                  </div>

                  {/* Spectral Simulated Image Display */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="h-72 w-72 rounded-full blur-3xl transition-all duration-700"
                      style={{
                        backgroundColor: currentSpectrum.color,
                        opacity: 0.32,
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center text-center max-w-md px-6">
                      <span
                        className="font-mono text-3xl font-extrabold mb-2"
                        style={{ color: currentSpectrum.color }}
                      >
                        {wavelength === 'optical' && 'λ 400 - 700 nm'}
                        {wavelength === 'infrared' && 'λ 0.7 - 300 µm'}
                        {wavelength === 'xray' && 'λ 0.01 - 10 nm'}
                        {wavelength === 'radio' && 'λ 1 mm - 100 km'}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                        {currentSpectrum.desc}
                      </p>
                    </div>
                  </div>

                  {/* Viewport Meta Footer */}
                  <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/5 pt-2 text-[10.5px] font-mono text-[#94A3B8] gap-2">
                    <span>Target: Supernova Remnant M1</span>
                    <span>Distance: 6,500 Light-Years</span>
                    <span>Plasma Temp: {currentSpectrum.temp}</span>
                  </div>
                </GlassCard>

                {/* Spectral Band Selector */}
                <div className="flex flex-col gap-4">
                  <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-3">
                    <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                      Electromagnetic Spectrum Bands
                    </h3>

                    {SPECTRA.map((sp) => (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => setWavelength(sp.id)}
                        className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                          wavelength === sp.id
                            ? 'border-[#A78BFA] bg-[#A78BFA]/15 shadow-md'
                            : 'border-white/5 bg-[#0B1226]/50 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-bold text-[#F8FAFC]">{sp.name}</span>
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: sp.color }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[#38BDF8] mt-1">{sp.observatory}</span>
                      </button>
                    ))}
                  </GlassCard>

                  <GlassCard variant="elevated" className="p-4 border-white/10">
                    <span className="font-mono text-[10px] text-[#A78BFA] font-bold block mb-1">
                      MULTI-WAVELENGTH ASTROPHYSICS:
                    </span>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                      Celestial bodies radiate across the entire electromagnetic spectrum. Observing in a single band yields an incomplete picture; multi-wavelength synthesis exposes hidden pulsars, cold dust, and relativistic shocks.
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
