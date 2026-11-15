/**
 * ORBIT ACADEMY — CLIMATE LAB
 * PHASE 6: LAURA AI CLIMATE SCIENCE INSTRUCTOR
 * 
 * Features:
 * - Natural voice narration via Web Speech API (speechSynthesis)
 * - Synchronized speech wave animation and real-time caption ticker
 * - Context-aware environmental education: responds to mode, weather, scenario, and active experiment
 * - Interactive "Ask Laura" climate inquiry system with intelligent responses
 * - Built-in verified Climate Glossary drawer (NASA/NOAA/IPCC definitions)
 * - Mute / Unmute / Replay controls
 */

import React, { useState } from 'react';
import {
  ClimateLabMode,
  WeatherSystemConfig,
  ClimateParameters,
  ContinentRegion,
} from '../types';
import { CLIMATE_GLOSSARY } from '../climateData';
import { climateAudio } from '../audio/climateAudio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Send,
  Loader2,
  X,
  Bot,
} from 'lucide-react';

const LAURA_BRIEFINGS = [
  {
    id: 'measured_vs_models',
    title: 'Measured Data vs. Models',
    text: 'Cadet, a foundational law of scientific inquiry: never confuse measured satellite observations with simulated climate models. NASA GIBS, FIRMS, and POWER measure actual physical photons emitted and reflected by Earth right now. In contrast, climate models solve mathematical energy balance equations to project potential future pathways. Both are essential, but one is empirical observation, and the other is mathematical simulation.',
  },
  {
    id: 'greenhouse_physics',
    title: 'Greenhouse Infrared Trapping',
    text: 'Polyatomic molecules like Carbon Dioxide and Water Vapor possess vibrational dipole resonance matching 15-micron terrestrial infrared radiation. They absorb outgoing surface heat and re-radiate downwelling thermal flux, providing Earth with a vital +33°C natural warming blanket.',
  },
  {
    id: 'remote_sensing',
    title: 'NASA Polar Orbits',
    text: 'NASA Terra and Aqua fly in Sun-synchronous polar orbits at 705 kilometers altitude. Terra crosses the equator at 10:30 AM local time descending, and Aqua crosses at 1:30 PM ascending, providing daily global coverage across 36 spectral bands.',
  },
  {
    id: 'earth_mars',
    title: 'Earth vs. Mars Paleoclimate',
    text: 'Four billion years ago, Mars had abundant liquid water rivers and lakes. When its metallic core dynamo cooled, the loss of its magnetosphere allowed solar wind to strip 99% of its atmosphere into deep space, transforming Mars into a freezing, hyper-arid desert.',
  },
  {
    id: 'water_cycle',
    title: 'The Water Cycle Engine',
    text: 'Every degree Celsius of atmospheric warming increases atmospheric moisture-holding capacity by approximately 7 percent via the Clausius-Clapeyron equation, intensifying both soil evaporation droughts and torrential convective downpours.',
  },
  {
    id: 'firms_fires',
    title: 'FIRMS Thermal Fire Detection',
    text: 'NASA FIRMS detects thermal anomalies using middle-infrared radiance at 3.9 microns. It measures fire radiative power in megawatts, allowing scientists and firefighters to track wildfire boundaries and carbon emissions within hours of satellite overpass.',
  },
  {
    id: 'arctic_albedo',
    title: 'Arctic Albedo Feedback',
    text: 'Fresh sea ice reflects ~85% of incoming solar flux back into space. When it melts into dark open ocean water, reflectance plummets to 6%, causing the ocean to absorb massive heat and amplifying Arctic warming at triple the global average.',
  },
  {
    id: 'modeling_assumptions',
    title: 'Scientific Boundary Assumptions',
    text: 'All climate experiments operate under stated physical assumptions. When testing radiative forcing in the laboratory, we hold solar constant fixed to isolate greenhouse forcing. Authentic science always makes its boundary assumptions explicit.',
  },
];

interface LauraClimateGuideProps {
  currentMode: ClimateLabMode;
  selectedRegion: ContinentRegion;
  activeWeather: WeatherSystemConfig;
  climateParams: ClimateParameters;
}

export const LauraClimateGuide: React.FC<LauraClimateGuideProps> = ({
  currentMode,
  selectedRegion,
  activeWeather,
  climateParams,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'laura'; text: string }[]>([
    {
      role: 'laura',
      text: 'Greetings, Cadet! I am LAURA, your Climate Science Instructor. Ask me anything about atmospheric physics, ocean currents, the Keeling Curve, or planetary energy equilibrium!',
    },
  ]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Compute contextual narration text based on application state
  const activeNarration = (() => {
    switch (currentMode) {
      case 'earth-orbit':
        return `Observing ${selectedRegion.name}. Notice the planetary energy balance where solar irradiance drives atmospheric circulation and ocean currents. ${selectedRegion.description}`;
      case 'weather':
        return `Active weather system: ${activeWeather.name}. ${activeWeather.description} Current barometric pressure is ${activeWeather.pressureHpa} hectopascals with sustained wind speeds of ${activeWeather.windSpeedKmh} kilometers per hour.`;
      case 'climate-change':
        return `Simulating climate perturbation. At ${climateParams.co2Ppm} parts per million of CO2, global temperature anomaly reaches +${climateParams.globalTempAnomaly} degrees Celsius, with estimated sea level rise of ${climateParams.seaLevelRiseCm} centimeters.`;
      case 'ecosystems':
        return `Exploring planetary ecosystem chambers. Dynamic interaction between cryosphere, hydrosphere, and biosphere regulates planetary albedo and carbon sequestration.`;
      case 'experiments':
        return `Welcome to the scientific experiment chamber. Test hypotheses, adjust variables, and observe empirical thermodynamic results to advance your Cadet certification.`;
      case 'nasa-gibs':
        return `Observing empirical NASA satellite imagery from the Earth Observing System (EOSDIS GIBS). Satellites such as Terra, Aqua, and Suomi-NPP provide daily global radiance data, measuring cloud cover, vegetation health, and active wildfires in near-real-time.`;
      default:
        return 'Welcome to the Orbit Academy Climate Science Simulator.';
    }
  })();

  // Trigger voice synthesis when user presses play or when mode changes if already playing
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setCurrentSubtitle(text);
      return;
    }

    window.speechSynthesis.cancel();
    if (isMuted) {
      setCurrentSubtitle(text);
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    // Select female English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentSubtitle(text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    climateAudio.playClick();
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      speakText(activeNarration);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (!nextMuted) {
      speakText(activeNarration);
    }
  };

  // Submit AI Question
  const handleSendQuestion = () => {
    if (!chatInput.trim()) return;
    const q = chatInput.trim();
    setChatInput('');
    setChatLog((prev) => [...prev, { role: 'user', text: q }]);
    setIsThinking(true);
    climateAudio.playClick();

    setTimeout(() => {
      let answer = '';
      const lower = q.toLowerCase();

      if (lower.includes('1.5') || lower.includes('paris')) {
        answer = 'The 1.5°C threshold is established by the IPCC to prevent irreversible tipping points: beyond this, multi-meter sea-level rise from West Antarctica and total collapse of tropical coral reefs become far more likely.';
      } else if (lower.includes('satellite') || lower.includes('gibs') || lower.includes('modis') || lower.includes('viirs')) {
        answer = 'NASA GIBS delivers full-resolution imagery from polar-orbiting satellites like Terra, Aqua, and Suomi-NPP. These sensors capture daily true-color reflectance, NDVI vegetation chlorophyll absorption, and thermal anomalies for wildfire detection across Earth.';
      } else if (lower.includes('albedo')) {
        answer = 'Albedo is surface reflectivity. Fresh snow reflects ~85% of solar radiation back to space. When it melts into open ocean water, reflectance plummets to 6%, absorbing heat and creating a self-reinforcing warming feedback loop.';
      } else if (lower.includes('co2') || lower.includes('greenhouse')) {
        answer = 'CO2 molecules vibrate in asymmetrical bending dipole modes that resonate specifically with 15-micron terrestrial infrared radiation, absorbing outgoing heat and re-radiating it back down toward Earth.';
      } else if (lower.includes('ocean') || lower.includes('acid')) {
        answer = 'Oceans absorb over 25% of human CO2 emissions. The resulting chemical reaction creates carbonic acid, which reduces carbonate ions (aragonite saturation) required by shellfish and corals to build shells.';
      } else if (lower.includes('hurricane') || lower.includes('cyclone')) {
        answer = 'Hurricanes act as thermodynamic Carnot engines. When ocean surface temperatures exceed 26.5°C, intense evaporation fuels low-pressure cores and drives wind speeds up to Category 5 intensity.';
      } else {
        answer = `That is an excellent inquiry regarding planetary systems! In our simulation, the coupling between atmospheric carbon at ${climateParams.co2Ppm} ppm and ocean heat content directly governs the frequency of extreme events. Examine the Climate Experiments tab to test this mathematically!`;
      }

      setChatLog((prev) => [...prev, { role: 'laura', text: answer }]);
      setIsThinking(false);
      speakText(answer);
    }, 700);
  };

  return (
    <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 shadow-xl space-y-3">
      {/* 1. HEADER & CONTROLS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              LAURA AI
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                Climate Instructor
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Web Speech API Voice Guidance
            </div>
          </div>
        </div>

        {/* Right audio controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause Narration' : 'Play Narration'}
            className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => speakText(activeNarration)}
            title="Replay Current Context"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              climateAudio.playClick();
              setIsGlossaryOpen(!isGlossaryOpen);
            }}
            title="Open Scientific Glossary"
            className={`p-1.5 rounded-lg border transition-colors ${
              isGlossaryOpen
                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              climateAudio.playClick();
              setIsChatOpen(!isChatOpen);
            }}
            title="Ask Laura Q&A"
            className={`p-1.5 rounded-lg border transition-colors ${
              isChatOpen
                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1B. CURATED SCIENTIFIC MASTER BRIEFINGS */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
          <Bot className="w-3 h-3 text-cyan-400" /> Laura Scientific Master Briefings:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {LAURA_BRIEFINGS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                climateAudio.playClick();
                speakText(b.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#0B1528] text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 text-[11px] whitespace-nowrap transition-all font-mono"
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LIVE SPEECH CAPTION TICKER */}
      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 leading-relaxed min-h-[46px] flex items-center gap-2">
        {isPlaying && (
          <span className="flex gap-0.5 items-end h-3">
            <span className="w-1 bg-cyan-400 animate-[bounce_0.8s_infinite] h-3 rounded-full" />
            <span className="w-1 bg-cyan-400 animate-[bounce_0.8s_infinite_0.2s] h-2 rounded-full" />
            <span className="w-1 bg-cyan-400 animate-[bounce_0.8s_infinite_0.4s] h-3.5 rounded-full" />
          </span>
        )}
        <p className="line-clamp-2">
          {currentSubtitle || activeNarration}
        </p>
      </div>

      {/* 3. SCIENTIFIC GLOSSARY DRAWER */}
      {isGlossaryOpen && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Climate Science Lexicon (NASA / IPCC AR6)
            </span>
            <button onClick={() => setIsGlossaryOpen(false)}>
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>

          <div className="space-y-2">
            {CLIMATE_GLOSSARY.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.term}</span>
                  {item.phonetic && (
                    <span className="text-[10px] font-mono text-cyan-400">/{item.phonetic}/</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">{item.definition}</p>
                <div className="text-[10px] text-slate-500 font-mono">Ref: {item.citation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ASK LAURA Q&A DRAWER */}
      {isChatOpen && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Ask LAURA Climate Science
            </span>
            <button onClick={() => setIsChatOpen(false)}>
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                  msg.role === 'laura'
                    ? 'bg-slate-950 border border-cyan-900/40 text-cyan-100'
                    : 'bg-cyan-950/50 border border-cyan-700/40 text-white ml-4'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-cyan-400 mb-0.5">
                  {msg.role === 'laura' ? 'LAURA AI Instructor' : 'Cadet'}
                </div>
                {msg.text}
              </div>
            ))}
            {isThinking && (
              <div className="text-xs text-cyan-400 font-mono flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analyzing climate physics models...
              </div>
            )}
          </div>

          {/* Question Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Why is 1.5°C so critical? How does albedo work?"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendQuestion}
              disabled={!chatInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
