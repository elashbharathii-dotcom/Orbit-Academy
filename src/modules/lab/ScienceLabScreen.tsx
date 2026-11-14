import React, { useState, useEffect, useRef } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  Atom,
  Globe2,
  Orbit,
  Telescope,
  Play,
  Zap,
} from 'lucide-react';

type LabTab = 'chemistry' | 'planetary' | 'physics' | 'astronomy';

export const ScienceLabScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('physics');

  // --- 1. CHEMISTRY LAB STATE ---
  const [selectedElement, setSelectedElement] = useState<{
    sym: string;
    name: string;
    z: number;
    mass: string;
    cat: string;
    cosmicRole: string;
  }>({
    sym: 'H',
    name: 'Hydrogen',
    z: 1,
    mass: '1.008',
    cat: 'Non-metal',
    cosmicRole: 'Most abundant element in the universe; fuels stellar thermonuclear fusion.',
  });

  const ELEMENTS = [
    { sym: 'H', name: 'Hydrogen', z: 1, mass: '1.008', cat: 'Stellar Fuel', cosmicRole: '74% of baryonic mass in universe; fuses into helium in stellar cores.' },
    { sym: 'He', name: 'Helium', z: 2, mass: '4.003', cat: 'Noble Gas', cosmicRole: 'Ash of hydrogen fusion; dominant component of gas giants.' },
    { sym: 'C', name: 'Carbon', z: 6, mass: '12.011', cat: 'Organogenic', cosmicRole: 'Formed via Triple-Alpha process in red giant stars; backbone of organic life.' },
    { sym: 'N', name: 'Nitrogen', z: 7, mass: '14.007', cat: 'Atmospheric', cosmicRole: 'Dominates Earth atmosphere (78%) and Titan atmosphere (98%).' },
    { sym: 'O', name: 'Oxygen', z: 8, mass: '15.999', cat: 'Oxidizer', cosmicRole: 'Formed in massive stars; reacts with hydrogen to make vast water oceans.' },
    { sym: 'Si', name: 'Silicon', z: 14, mass: '28.085', cat: 'Silicate', cosmicRole: 'Primary component of terrestrial rocky crusts, mantles, and meteorites.' },
    { sym: 'Fe', name: 'Iron', z: 26, mass: '55.845', cat: 'Transition Metal', cosmicRole: 'Heaviest element formed by fusion before core-collapse supernova; powers geodynamos.' },
  ];

  // --- 2. PLANETARY GRAVITY EXPERIMENT STATE ---
  const [gravityWorld, setGravityWorld] = useState<{ name: string; g: number; col: string }>({
    name: 'Earth',
    g: 9.81,
    col: '#38BDF8',
  });
  const [dropHeight, setDropHeight] = useState<number>(50); // meters
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [ballY, setBallY] = useState<number>(0);

  const WORLDS = [
    { name: 'Moon', g: 1.62, col: '#94A3B8' },
    { name: 'Mars', g: 3.72, col: '#EF4444' },
    { name: 'Earth', g: 9.81, col: '#38BDF8' },
    { name: 'Jupiter', g: 24.79, col: '#F97316' },
    { name: 'Sun Surface', g: 274.0, col: '#F59E0B' },
  ];

  const handleStartDrop = () => {
    setIsDropping(true);
    setBallY(0);
    const calculatedTime = Math.sqrt((2 * dropHeight) / gravityWorld.g);
    setDropTime(calculatedTime);

    const startTime = Date.now();
    const durationMs = Math.min(3500, calculatedTime * 1000);

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

  // --- 3. SPACE PHYSICS: BLACK HOLE LENSING STATE ---
  const [blackHoleMass, setBlackHoleMass] = useState<number>(4.3); // million solar masses
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Black Hole Lensing Raytracer Canvas
  useEffect(() => {
    if (activeTab !== 'physics') return;
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
      const rs = 18 + blackHoleMass * 4;

      // 1. Accretion Disk Plasma Ring (Doppler Beaming: left side brighter as it approaches observer)
      const diskGrad = ctx.createRadialGradient(cx, cy, rs * 1.5, cx, cy, rs * 3.4);
      diskGrad.addColorStop(0, '#FEF08A');
      diskGrad.addColorStop(0.3, '#F59E0B');
      diskGrad.addColorStop(0.7, '#DC2626');
      diskGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1.8, 0.45); // Tilted accretion disk
      ctx.rotate(t * 0.03);

      ctx.fillStyle = diskGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rs * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Gravitational Lensing Halo (Einstein Ring)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, rs * 1.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Event Horizon (Absolute Shadow Void)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, rs, 0, Math.PI * 2);
      ctx.fill();

      // Thin Photon Sphere Glow Ring
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rs * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      t += 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, blackHoleMass]);

  // --- 4. ASTRONOMY TELESCOPE WAVELENGTH STATE ---
  const [wavelength, setWavelength] = useState<'optical' | 'infrared' | 'xray' | 'radio'>('optical');

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030712] font-sans text-[#F8FAFC]">
      <MasterHeader />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in flex flex-col gap-6">
        {/* Lab Hero Banner */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E1726] via-[#05070D] to-[#0B1528] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#10B981]">
                VIRTUAL SCIENCE & ASTROPHYSICS LABORATORY
              </span>
            </div>
            <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Experimental Science Chambers
            </h1>
            <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Explore hands-on physics and astronomy stations: test chemical elements of the cosmos, 
              compare planetary gravitational acceleration, simulate relativistic black holes, and scan multi-wavelength skies.
            </p>
          </div>

          {/* Sub-Station Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1.5 shadow-lg">
            {[
              { id: 'physics', label: 'Space Physics', icon: Zap },
              { id: 'chemistry', label: 'Chemistry Lab', icon: Atom },
              { id: 'planetary', label: 'Planetary Gravity', icon: Globe2 },
              { id: 'astronomy', label: 'Astronomy Telescope', icon: Telescope },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as LabTab)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs transition-all ${
                    isActive
                      ? 'border border-[#38BDF8] bg-[#38BDF8]/15 font-bold text-[#F8FAFC]'
                      : 'border border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. SPACE PHYSICS LAB: RELATIVISTIC BLACK HOLE LENSING */}
        {activeTab === 'physics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Lensing Canvas */}
            <div className="lg:col-span-2 relative aspect-[16/10] min-h-[360px] rounded-3xl border border-white/10 bg-[#000000] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Orbit className="h-4 w-4 text-[#38BDF8]" />
                  <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                    GENERAL RELATIVITY // SAGITTARIUS A* ANALOGUE
                  </span>
                </div>
                <span className="font-mono text-xs text-[#F59E0B]">
                  Photon Sphere: r = 1.5 rₛ
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={640}
                height={400}
                className="absolute inset-0 h-full w-full"
              />

              <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
                <span>Event Horizon (Schwarzschild Radius): {(blackHoleMass * 2.95).toFixed(1)} km</span>
                <span>Doppler Beaming Active (Left-side blueshifted)</span>
                <span>Escape Velocity = Speed of Light c (300,000 km/s)</span>
              </div>
            </div>

            {/* Mass Controller & Physics Panel */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl">
                <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                  Supermassive Black Hole Mass
                </h3>

                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#94A3B8]">Core Mass (M)</span>
                    <span className="font-bold text-[#F59E0B]">{blackHoleMass} Million Solar Masses (M☉)</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={blackHoleMass}
                    onChange={(e) => setBlackHoleMass(parseFloat(e.target.value))}
                    className="h-2 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2 font-mono text-xs border-t border-white/5 pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-[#94A3B8]">Schwarzschild Radius rₛ:</span>
                    <span className="text-[#F8FAFC]">{(blackHoleMass * 2.95).toFixed(1)} Million km</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#94A3B8]">Photon Sphere Radius:</span>
                    <span className="text-[#38BDF8]">{(blackHoleMass * 2.95 * 1.5).toFixed(1)} Million km</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#94A3B8]">ISCO Stable Orbit:</span>
                    <span className="text-[#10B981]">{(blackHoleMass * 2.95 * 3.0).toFixed(1)} Million km</span>
                  </div>
                </div>
              </div>

              {/* Educational Principle */}
              <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 font-mono text-xs">
                <span className="text-[10px] text-[#38BDF8] font-bold block mb-1">
                  EINSTEIN’S FIELD EQUATIONS:
                </span>
                <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                  Mass severely curves spacetime. Photons traveling grazing the event horizon are deflected by gravitational lensing into an Einstein ring. Inside the Schwarzschild radius, all world-lines terminate at the singularity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. PLANETARY GRAVITY EXPERIMENT */}
        {activeTab === 'planetary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Freefall Drop Tower Simulator */}
            <div className="lg:col-span-2 relative aspect-[16/10] min-h-[360px] rounded-3xl border border-white/10 bg-[#080C1A] shadow-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  VACUUM DROP TOWER // {gravityWorld.name.toUpperCase()} (g = {gravityWorld.g} m/s²)
                </span>
                <span className="font-mono text-xs text-[#38BDF8]">
                  Release Height: {dropHeight} meters
                </span>
              </div>

              {/* Interactive Drop Shaft */}
              <div className="relative flex-1 flex items-center justify-center my-4">
                <div className="relative h-full w-24 rounded-2xl border border-white/10 bg-black/40 flex flex-col justify-between p-2">
                  {/* Top Release Mechanism */}
                  <div className="flex justify-between text-[8px] font-mono text-[#94A3B8]">
                    <span>{dropHeight}m</span>
                    <span>0m</span>
                  </div>

                  {/* Falling Test Sphere */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-none"
                    style={{
                      top: `${Math.min(92, 8 + ballY * 0.84)}%`,
                      backgroundColor: gravityWorld.col,
                      boxShadow: `0 0 16px ${gravityWorld.col}`,
                    }}
                  >
                    <span className="font-mono text-[9px] font-bold text-black">1 kg</span>
                  </div>

                  {/* Impact Floor */}
                  <div className="h-2 w-full rounded bg-white/20" />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="font-mono text-xs">
                  <span className="text-[#94A3B8]">Recorded Fall Time: </span>
                  <span className="font-bold text-[#10B981]">
                    {dropTime !== null ? `${dropTime.toFixed(2)} seconds` : '--'}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isDropping}
                  onClick={handleStartDrop}
                  className="flex items-center gap-1.5 rounded-xl bg-[#38BDF8] px-4 py-2 font-mono text-xs font-bold text-[#05070D] hover:bg-[#7DD3FC] disabled:opacity-40"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Release Mass</span>
                </button>
              </div>
            </div>

            {/* World Selector & Height Slider */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl">
                <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                  Select Celestial World
                </h3>

                <div className="mt-3 flex flex-col gap-2">
                  {WORLDS.map((w) => (
                    <button
                      key={w.name}
                      type="button"
                      onClick={() => {
                        setGravityWorld(w);
                        setDropTime(null);
                        setBallY(0);
                      }}
                      className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                        gravityWorld.name === w.name
                          ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-md'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                      }`}
                    >
                      <span className="font-sans text-xs font-bold text-[#F8FAFC]">
                        {w.name}
                      </span>
                      <span className="font-mono text-xs text-[#38BDF8] font-semibold">
                        {w.g} m/s²
                      </span>
                    </button>
                  ))}
                </div>

                {/* Drop Height Slider */}
                <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#94A3B8]">Drop Tower Height</span>
                    <span className="font-bold text-[#F8FAFC]">{dropHeight} m</span>
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
                      setBallY(0);
                    }}
                    className="h-2 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CHEMISTRY LAB: PERIODIC TABLE & MOLECULES */}
        {activeTab === 'chemistry' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Elements Grid */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#080F1D]/80 p-6 shadow-2xl backdrop-blur-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[#10B981] font-bold">
                COSMIC ELEMENT EXPLORER
              </span>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ELEMENTS.map((el) => {
                  const isSelected = selectedElement.sym === el.sym;
                  return (
                    <button
                      key={el.sym}
                      type="button"
                      onClick={() => setSelectedElement(el)}
                      className={`flex flex-col items-center justify-center aspect-square rounded-2xl border p-3 transition-all ${
                        isSelected
                          ? 'border-[#10B981] bg-[#10B981]/20 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[#94A3B8]">Z = {el.z}</span>
                      <span className="font-sans text-2xl font-extrabold text-[#F8FAFC] my-0.5">
                        {el.sym}
                      </span>
                      <span className="font-sans text-[11px] text-[#CBD5E1]">{el.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Element Detail Card */}
            <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-2xl font-bold text-[#10B981]">{selectedElement.sym}</span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[#38BDF8]">
                    {selectedElement.cat}
                  </span>
                </div>

                <h3 className="mt-3 font-sans text-lg font-bold text-[#F8FAFC]">
                  {selectedElement.name} (Atomic Mass: {selectedElement.mass})
                </h3>

                <p className="mt-2 font-sans text-xs text-[#94A3B8] leading-relaxed">
                  {selectedElement.cosmicRole}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left">
                <span className="text-[10px] text-[#10B981] font-bold block mb-1">
                  STELLAR NUCLEOSYNTHESIS:
                </span>
                <p className="font-sans text-[11px] text-[#CBD5E1]">
                  Elements lighter than iron fuse during normal stellar life cycles; all elements heavier than iron are forged during violent supernovae or neutron star mergers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. ASTRONOMY LAB: MULTI-WAVELENGTH TELESCOPE */}
        {activeTab === 'astronomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Telescope Viewport */}
            <div className="lg:col-span-2 relative aspect-[16/10] min-h-[360px] rounded-3xl border border-white/10 bg-[#02050D] shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  CRAB NEBULA (M1) // {wavelength.toUpperCase()} OBSERVATORY
                </span>
                <span className="font-mono text-xs text-[#38BDF8]">
                  Target: Supernova Remnant
                </span>
              </div>

              {/* Simulated Spectral Multi-wavelength View */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-64 w-64 rounded-full blur-2xl transition-all duration-700"
                  style={{
                    backgroundColor:
                      wavelength === 'optical'
                        ? '#38BDF8'
                        : wavelength === 'infrared'
                        ? '#EF4444'
                        : wavelength === 'xray'
                        ? '#A855F7'
                        : '#F59E0B',
                    opacity: 0.35,
                  }}
                />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Telescope className="h-12 w-12 text-[#F8FAFC] opacity-40 mb-2" />
                  <span className="font-sans text-sm font-bold text-[#F8FAFC]">
                    {wavelength === 'optical' && 'Visible Light (Hubble): Expanding gas filaments glowing in hydrogen and sulfur'}
                    {wavelength === 'infrared' && 'Infrared Light (JWST): Cold interstellar dust lanes and proto-stellar envelopes'}
                    {wavelength === 'xray' && 'X-Ray Light (Chandra): Relativistic central pulsar spinning at 30 times per second'}
                    {wavelength === 'radio' && 'Radio Light (VLA): Synchrotron radiation emitted by relativistic electrons in magnetic fields'}
                  </span>
                </div>
              </div>

              <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
                <span>Filter: {wavelength.toUpperCase()} Bandpass</span>
                <span>Signal-to-Noise Ratio: 48.2 dB</span>
                <span>Distance: 6,500 Light-Years</span>
              </div>
            </div>

            {/* Wavelength Selector */}
            <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                Spectral Wavelength Band
              </h3>

              {[
                { id: 'optical', name: 'Visible Optical (400 - 700 nm)', desc: 'Human eye wavelengths revealing glowing ionized gas.' },
                { id: 'infrared', name: 'Infrared (0.7 - 300 µm)', desc: 'Peers directly through dense opaque cosmic dust.' },
                { id: 'xray', name: 'X-Ray (0.01 - 10 nm)', desc: 'Detects superheated plasma exceeding 1 million Kelvin.' },
                { id: 'radio', name: 'Radio (1 mm - 100 km)', desc: 'Traces magnetic synchrotron radiation and neutral hydrogen.' },
              ].map((wl) => (
                <button
                  key={wl.id}
                  type="button"
                  onClick={() => setWavelength(wl.id as any)}
                  className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                    wavelength === wl.id
                      ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-md'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                  }`}
                >
                  <span className="font-sans text-xs font-bold text-[#F8FAFC]">{wl.name}</span>
                  <span className="font-sans text-[11px] text-[#94A3B8] mt-1">{wl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
