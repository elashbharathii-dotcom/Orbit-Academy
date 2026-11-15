import React from 'react';
import {
  Compass,
  Cpu,
  ShieldAlert,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { ClippedButton } from './ClippedButton';

interface MarsRoverSectionsProps {
  onOpenContactModal: () => void;
  onLaunchMission?: () => void;
  onExploreRadar?: () => void;
}

export const MarsRoverSections: React.FC<MarsRoverSectionsProps> = ({
  onOpenContactModal,
  onLaunchMission,
  onExploreRadar,
}) => {
  const features = [
    {
      icon: Compass,
      tag: 'MOBILITY',
      title: 'Autonomous Surface Mobility',
      desc: 'Advanced 6-wheel rocker-bogie titanium suspension engineered to scale 40-centimeter boulders and traverse 30-degree slopes in 0.38G Martian gravity without tipping.',
    },
    {
      icon: Cpu,
      tag: 'PAYLOAD',
      title: 'Scientific Instrument Suite',
      desc: 'Equipped with SuperCam 1064nm Raman laser spectrometry, RIMFAX ground-penetrating radar for 10-meter subsurface mapping, and Mastcam-Z 3D stereoscopic imaging.',
    },
    {
      icon: ShieldAlert,
      tag: 'SURVIVAL',
      title: 'Extreme Environmental Survival',
      desc: 'Active RTG thermal management protects core avionics from brutal -125°C Martian nights, fine atmospheric dust storms, and solar irradiance drops.',
    },
  ];

  const telemetryMetrics = [
    { label: 'CRATER FORMATION', value: '3.7 Billion Yrs', detail: 'Ancient paleolake river delta' },
    { label: 'LANDING COORDINATES', value: '18.38°N 77.58°E', detail: 'Jezero Crater floor margin' },
    { label: 'SURFACE GRAVITY', value: '0.38 G', detail: '38% of Earth standard gravity' },
    { label: 'DIURNAL RANGE', value: '-125°C to +20°C', detail: 'Martian atmospheric variation' },
  ];

  const faqs = [
    {
      q: 'How does rover mobility operate in 0.38G Martian gravity?',
      a: 'The rover utilizes a differential rocker-bogie kinematic system with cleated aluminum-titanium wheels. Each wheel possesses an independent drive motor, allowing equal weight distribution across uneven bedrock and high-slip loose dunes.',
    },
    {
      q: 'How does the Raman laser spectrometer identify biosignatures?',
      a: 'The SuperCam fires pulsed 1064nm infrared laser bursts onto rock surfaces from up to 7 meters away, generating a glowing plasma flash. The spectrometer reads emission lines to isolate carbon, organic macromolecules, and hydrated clays.',
    },
    {
      q: 'How are core samples hermetically cached for Mars Sample Return?',
      a: 'Coring drill bits deposit pristine cylindrical rock cores into ultra-clean titanium sample tubes. The sample caching assembly seals each tube with gold-coated seals to preserve ancient microfossils for Earth return.',
    },
    {
      q: 'What is the role of Outpost Alpha and cadet habitat systems?',
      a: 'Outpost Alpha serves as the primary crewed staging base in Jezero Crater. Cadets can dock their rovers to recharge high-density supercapacitor banks, replenish life support oxygen scrubbers, and catalog core tubes.',
    },
    {
      q: 'How does Deep Space Network comms latency affect operations?',
      a: 'Radio signals traveling between Earth and Mars take 4 to 24 minutes each way depending on planetary orbital positions. The rover utilizes on-board autonomous computer vision (AutoNav) to navigate hazards in real-time.',
    },
  ];

  return (
    <div className="w-full">
      {/* 1. FEATURES SECTION */}
      <section id="features" className="border-t border-white/10 py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                PLANETARY CAPABILITIES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
                Cutting-Edge Mars Exploration Architecture
              </h2>
            </div>
            <p className="text-sm text-white/60 max-w-md">
              Engineered with authentic NASA Jet Propulsion Laboratory robotics telemetry and life support systems.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:border-[#EE3F2C]/40 hover:bg-white/[0.06] flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EE3F2C]/15 border border-[#EE3F2C]/30 text-[#EE3F2C] group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 border border-white/10 px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-white/65 text-sm leading-relaxed mt-3">{item.desc}</p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/50 group-hover:text-white transition">
                    <span>STATUS: NOMINAL</span>
                    <ArrowRight className="h-4 w-4 text-[#EE3F2C] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="border-t border-white/10 py-20 md:py-28 px-6 md:px-12 scroll-mt-24 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                MISSION DESTINATION
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Why NASA Explores Jezero Crater
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Jezero Crater was once flooded with water and home to an ancient river-delta system. Billions of years ago, sediment carried by inflowing rivers settled into fan-shaped delta beds, creating ideal conditions to trap and preserve evidence of past Martian microbial life.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                As an Orbit Academy explorer, you navigate real topological datasets gathered by the Mars Reconnaissance Orbiter (MRO) HiRISE camera and Curiosity/Perseverance ground missions. Your mission: survey hazardous terrain, extract mineral samples, and maintain life support at Outpost Alpha.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {onLaunchMission && (
                  <ClippedButton onClick={onLaunchMission} className="!px-6 !py-3 text-xs font-bold uppercase tracking-wider">
                    <span>Deploy Rover to Jezero</span>
                  </ClippedButton>
                )}
                {onExploreRadar && (
                  <ClippedButton
                    variant="outline"
                    onClick={onExploreRadar}
                    className="!px-6 !py-3 text-xs font-bold uppercase tracking-wider"
                  >
                    <span>View Radar Grid</span>
                  </ClippedButton>
                )}
              </div>
            </div>

            {/* Scientific Telemetry Metric Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {telemetryMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    {metric.label}
                  </span>
                  <div className="my-2">
                    <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/60 leading-tight">
                    {metric.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ / TELEMETRY INTEL SECTION */}
      <section id="faq" className="border-t border-white/10 py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                TELEMETRY & FLIGHT INTEL
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
                Frequently Asked Mission Questions
              </h2>
            </div>
            <span className="text-xs font-mono text-white/50 border border-white/10 px-3 py-1.5 rounded-full w-fit">
              NASA JPL ARCHIVES • DEEP SPACE
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between hover:border-white/20 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-mono text-[#EE3F2C] font-bold">
                      0{idx + 1} //
                    </span>
                    <h3 className="font-semibold text-white text-base leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed mt-2">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT / MISSION SUPPORT SECTION */}
      <section id="contact" className="border-t border-white/10 py-20 md:py-28 px-6 md:px-12 scroll-mt-24 bg-gradient-to-b from-transparent to-black/80">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-white/[0.03] p-8 md:p-14 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#EE3F2C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EE3F2C] text-white text-xs font-bold">
                OA
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                FLIGHT DIRECTORATE UPLINK
              </p>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Connect with NASA Mission Control
            </h2>

            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Have questions regarding rover teleoperations, Raman spectroscopy calibration, or cadet curriculum advancement? Open an instant comms uplink with Orbit Academy flight directors and Laura AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <ClippedButton
                onClick={onOpenContactModal}
                className="!px-7 !py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                <span className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <span>Transmit to Mission Control</span>
                </span>
              </ClippedButton>

              <div className="flex items-center gap-3 text-xs font-mono text-white/50 pl-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>DEEP SPACE NETWORK CHANNEL 43 ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarsRoverSections;
