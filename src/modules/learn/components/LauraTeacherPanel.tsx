import React, { useState, useEffect, useRef } from 'react';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { Lesson, TrekLandmarkFeature, VocabularyTerm } from '../learnData';
import {
  Sparkles,
  HelpCircle,
  BookOpen,
  Bot,
  Send,
  Play,
  Pause,
  Compass,
} from 'lucide-react';

interface LauraTeacherPanelProps {
  lesson: Lesson;
  selectedFeature?: TrekLandmarkFeature | null;
  celestialTitle: string;
  onGuide3D?: () => void;
}

interface QuickQuestion {
  q: string;
  a: string;
}

const DISCIPLINE_INQUIRIES: Record<string, QuickQuestion[]> = {
  astronomy: [
    {
      q: 'Why do space telescopes look in infrared rather than visible light?',
      a: 'Cosmic expansion redshifts light from the earliest galaxies into infrared wavelengths. Additionally, long infrared wavelengths pass right through dense interstellar dust clouds that block visible light, revealing hidden stellar nurseries and exoplanet atmospheres.',
    },
    {
      q: 'What is the Chandrasekhar limit?',
      a: 'The Chandrasekhar limit (1.44 solar masses) is the maximum mass a white dwarf star can support against gravitational collapse through electron degeneracy pressure. Above this limit, electron capture occurs and the star explodes as a Type Ia supernova.',
    },
  ],
  'solar-system': [
    {
      q: 'Why did the terrestrial planets form rocky while gas giants grew huge?',
      a: 'Inside the Frost Line (2.7 AU), high temperatures prevented water, methane, and ammonia from freezing into ice. Only scarce refractory silicates and metals could condense. Outside the frost line, abundant frozen ices allowed protoplanets to accrete massive 10-Earth-mass cores that captured vast hydrogen-helium envelopes.',
    },
    {
      q: 'What keeps planetary orbits from decaying into the Sun?',
      a: 'Planets are in perpetual free fall with high perpendicular tangential velocities. Gravitational acceleration continually bends their straight-line momentum into elliptical orbits, with orbital energy conserved in the vacuum of space.',
    },
  ],
  sun: [
    {
      q: 'What makes the solar corona millions of degrees hotter than the surface?',
      a: 'This is the celebrated Coronal Heating Problem. NASA missions like the Parker Solar Probe have revealed that billions of microscopic magnetic reconnection events (nanoflares) and Alfvén plasma wave dissipation deposit magnetic energy directly into the upper coronal plasma.',
    },
    {
      q: 'How does the Sun produce energy through thermonuclear fusion?',
      a: 'In the core, at 15 million Kelvin and 250 billion atmospheres of pressure, the proton-proton (p-p) chain fuses four hydrogen nuclei (protons) into one helium-4 nucleus, converting 0.7% of the mass directly into pure energy via Einstein’s E = mc².',
    },
  ],
  geology: [
    {
      q: 'Why is Olympus Mons on Mars so much taller than Mount Everest?',
      a: 'Mars lacks mobile tectonic plates. On Earth, crustal plates move over mantle hotspots to create volcanic island chains. On Mars, the crust remained stationary over a fixed mantle plume for hundreds of millions of years, stacking basaltic lava 22 kilometers high in one spot.',
    },
    {
      q: 'How did Valles Marineris form if not by water erosion?',
      a: 'Valles Marineris is primarily a colossal tectonic extensional rift system (a graben). As the nearby Tharsis volcanic province swelled with magma, the crust tore open along massive fault lines, later widened by landslides and localized groundwater sapping.',
    },
  ],
  'space-biology': [
    {
      q: 'How does microgravity affect human DNA and gene expression?',
      a: 'NASA GeneLab and OSDR research (e.g. OSD-379) demonstrate that the absence of hydrostatic pressure and gravity-driven convection induces cellular oxidative stress, mitochondrial dysregulation, and changes in chromatin accessibility, triggering global epigenetic transcriptomic shifts.',
    },
    {
      q: 'Why do astronauts lose bone density in space?',
      a: 'Without gravity loading the skeleton, mechanotransduction signals to osteoblasts (bone-building cells) drop sharply while osteoclasts continue resorbing mineral matrix. Astronauts can lose 1% to 1.5% of cancellous bone mass per month without high-resistance exercise.',
    },
  ],
  climate: [
    {
      q: 'How does Venus have a surface temperature of 465°C even though it reflects more sunlight than Earth?',
      a: 'Venus experienced a runaway greenhouse effect. Its 92-bar atmosphere is 96.5% carbon dioxide, which creates extreme optical depth in the thermal infrared. Heat from the surface is trapped repeatedly, raising the temperature by over 450°C above radiative equilibrium.',
    },
    {
      q: 'What is the role of NASA satellites in observing Earth’s climate system?',
      a: 'NASA satellites like Terra, Aqua, and Aura measure Earth’s global radiation budget (CERES), atmospheric aerosol loading, cloud optical thickness, and greenhouse gas column densities with millimeter-wave and infrared spectrometers, providing ground-truth measurements of global energy imbalance.',
    },
  ],
  'space-weather': [
    {
      q: 'What causes geomagnetic storms on Earth?',
      a: 'When a coronal mass ejection (CME) carries a southward-oriented magnetic field (Bz < 0), it reconnects with Earth’s northward geomagnetic field. This opens the magnetosphere, injecting gigawatts of energetic plasma into the magnetotail and ionosphere, causing grid fluctuations and auroras.',
    },
  ],
  exploration: [
    {
      q: 'What is a Hohmann transfer orbit and why is it so efficient?',
      a: 'A Hohmann transfer is an elliptical trajectory tangent to both the departure and arrival planetary orbits. It requires only two instantaneous velocity changes (Δv) and consumes the minimal possible propellant dictated by Keplerian orbital mechanics.',
    },
  ],
  general: [
    {
      q: 'How do NASA scientists know what planets are made of without digging?',
      a: 'Scientists use orbital reflectance spectroscopy (analyzing absorption bands in sunlight reflected from surface minerals), gravimetry (measuring minute spacecraft doppler frequency shifts to map mass distribution), and magnetometer sensors.',
    },
  ],
};

export const LauraTeacherPanel: React.FC<LauraTeacherPanelProps> = ({
  lesson,
  selectedFeature,
  celestialTitle,
  onGuide3D,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [activeInquiry, setActiveInquiry] = useState<QuickQuestion | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<VocabularyTerm | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Set narrative text whenever lesson or feature changes
  useEffect(() => {
    let narrative = '';
    if (selectedFeature) {
      narrative = `Welcome to ${selectedFeature.name}. ${selectedFeature.description} Scientifically, ${selectedFeature.scientificSignificance}`;
    } else {
      narrative = `Welcome to our academic investigation on ${lesson.title}. ${lesson.summary} ${
        lesson.objectives && lesson.objectives.length > 0
          ? `Our key objective: ${lesson.objectives[0]}.`
          : ''
      }`;
    }
    setActiveSpeechText(narrative);
    setActiveInquiry(null);
    setCustomAnswer(null);
  }, [lesson, selectedFeature]);

  // Voice Speech Synthesis Handler
  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = customAnswer
      ? customAnswer
      : activeInquiry
      ? activeInquiry.a
      : selectedVocab
      ? `${selectedVocab.term}. ${selectedVocab.definition}. Analogy: ${selectedVocab.lauraAnalogy || selectedVocab.definition}`
      : activeSpeechText;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Zira') ||
          v.name.includes('Samantha')) &&
        v.lang.startsWith('en')
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Custom question answering generator
  const handleAskCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsThinking(true);
    const qLower = customQuestion.toLowerCase();

    setTimeout(() => {
      let ans = '';
      if (qLower.includes('gravity') || qLower.includes('orbit') || qLower.includes('kepler')) {
        ans = `According to Kepler’s laws and General Relativity, gravity curves the spacetime manifold around mass. For our current topic (${lesson.title}), gravitational potential energy dictates orbital velocities and structural equilibria.`;
      } else if (qLower.includes('life') || qLower.includes('biology') || qLower.includes('cell') || qLower.includes('dna')) {
        ans = `In NASA space biology, microgravity removes buoyant convection and hydrostatic pressure. As observed in NASA OSDR data, this alters transcription factors, mitochondrial energy metabolism, and DNA repair pathways.`;
      } else if (qLower.includes('sun') || qLower.includes('heat') || qLower.includes('fusion') || qLower.includes('flare')) {
        ans = `The Sun is powered by proton-proton thermonuclear fusion in its core. Plasma instabilities and magnetic reconnection events in the convective zone drive solar flares and coronal mass ejections that affect planetary atmospheres.`;
      } else if (qLower.includes('mars') || qLower.includes('volcano') || qLower.includes('rock')) {
        ans = `Planetary geological evidence collected by NASA orbiters and rovers demonstrates that Mars had active volcanism and liquid surface water during the Noachian and Hesperian epochs before atmospheric stripping occurred.`;
      } else {
        ans = `In the context of ${lesson.title}, NASA missions employ specialized spectroscopy, radiometry, and physical modeling to investigate this phenomenon. ${lesson.summary}`;
      }

      setCustomAnswer(ans);
      setIsThinking(false);
      setActiveInquiry({ q: customQuestion, a: ans });
      setCustomQuestion('');
    }, 450);
  };

  // Select questions based on discipline
  const getRelevantInquiries = (): QuickQuestion[] => {
    const disc = lesson.id.startsWith('astro')
      ? 'astronomy'
      : lesson.id.startsWith('ss')
      ? 'solar-system'
      : lesson.id.startsWith('sun')
      ? 'sun'
      : lesson.id.startsWith('geo') || lesson.id.startsWith('mars')
      ? 'geology'
      : lesson.id.startsWith('bio')
      ? 'space-biology'
      : lesson.id.startsWith('clim') || lesson.id.startsWith('earth')
      ? 'climate'
      : lesson.id.startsWith('spw')
      ? 'space-weather'
      : lesson.id.startsWith('explor')
      ? 'exploration'
      : 'general';
    return DISCIPLINE_INQUIRIES[disc] || DISCIPLINE_INQUIRIES.general;
  };

  const inquiries = getRelevantInquiries();

  return (
    <div className="flex flex-col rounded-3xl border border-[#00E5FF]/20 bg-[#070C1B]/95 backdrop-blur-2xl p-5 shadow-2xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#0284C7]/30 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5FF]" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-extrabold text-white">
                Laura AI Teacher &amp; Mentor
              </h3>
              <TelemetryBadge label="ONLINE" tone="cyan" size="sm" />
            </div>
            <p className="font-mono text-[10.5px] text-[#94A3B8]">
              NASA Curriculum Specialist • Academic Science Guide
            </p>
          </div>
        </div>

        {/* Voice Play/Pause & Speed Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSpeechRate((r) => (r === 1.0 ? 1.2 : r === 1.2 ? 0.8 : 1.0))}
            className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 font-mono text-[10px] text-[#94A3B8] hover:text-white"
            title="Speech Rate"
          >
            {speechRate}x
          </button>
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-sans text-xs font-bold transition-all ${
              isSpeaking
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)] animate-pulse'
                : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSpeaking ? 'Pause' : 'Read Aloud'}</span>
          </button>
        </div>
      </div>

      {/* Narrative Dialogue Box */}
      <div className="relative p-4 rounded-2xl bg-[#030611] border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#00E5FF]">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Laura's Explanation:</span>
          </span>
          {onGuide3D && (
            <button
              type="button"
              onClick={onGuide3D}
              className="flex items-center gap-1 text-[10.5px] text-[#38BDF8] hover:text-white underline font-mono"
            >
              <Compass className="w-3 h-3" />
              <span>Show in 3D</span>
            </button>
          )}
        </div>

        <p className="font-mono text-xs leading-relaxed text-[#CBD5E1]">
          {customAnswer || (activeInquiry ? activeInquiry.a : activeSpeechText)}
        </p>

        {activeInquiry && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
            <span>Inquiry: "{activeInquiry.q}"</span>
            <button
              type="button"
              onClick={() => {
                setActiveInquiry(null);
                setCustomAnswer(null);
              }}
              className="text-[#38BDF8] hover:underline"
            >
              Reset to Lesson
            </button>
          </div>
        )}
      </div>

      {/* Vocabulary Terms with Real-World Analogies */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-[10.5px] uppercase font-bold text-[#94A3B8] block flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[#38BDF8]" />
            <span>Key Terminology &amp; Intuitive Analogies</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lesson.vocabulary.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedVocab(v);
                  setActiveInquiry({
                    q: `What is ${v.term}?`,
                    a: `${v.definition} ${
                      v.lauraAnalogy ? `Think of it like this: ${v.lauraAnalogy}` : ''
                    }`,
                  });
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-all ${
                  selectedVocab?.term === v.term
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/5 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                }`}
              >
                {v.term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Curated Questions */}
      <div className="space-y-2">
        <span className="font-mono text-[10.5px] uppercase font-bold text-[#94A3B8] block flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#F59E0B]" />
          <span>Curated Questions for Laura</span>
        </span>
        <div className="space-y-1.5">
          {inquiries.map((inq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveInquiry(inq);
                setCustomAnswer(null);
              }}
              className={`w-full text-left p-2.5 rounded-xl border font-mono text-[11px] transition-all ${
                activeInquiry?.q === inq.q
                  ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF] font-bold'
                  : 'border-white/5 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
              }`}
            >
              • {inq.q}
            </button>
          ))}
        </div>
      </div>

      {/* Ask Custom Question Input */}
      <form onSubmit={handleAskCustomQuestion} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder={`Ask Laura a science question about ${celestialTitle}...`}
          className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-[#030611] text-white font-mono text-xs placeholder:text-[#64748B] focus:border-[#00E5FF] focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!customQuestion.trim() || isThinking}
          className="flex items-center justify-center h-8 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0284C7] text-[#030611] font-sans text-xs font-black shadow-[0_0_12px_rgba(0,229,255,0.4)] disabled:opacity-40 transition-all"
        >
          {isThinking ? (
            <span className="animate-spin text-xs">●</span>
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
};
