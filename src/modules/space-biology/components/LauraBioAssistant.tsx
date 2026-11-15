import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface BriefingTopic {
  id: string;
  title: string;
  category: string;
  speechText: string;
  keyPoints: string[];
  referenceStudy?: string;
}

const BRIEFING_TOPICS: BriefingTopic[] = [
  {
    id: 'osdr_overview',
    title: 'NASA OSDR & Multi-Omics Architecture',
    category: 'Architecture',
    speechText:
      'Welcome to the Space Biology Laboratory. The NASA Open Science Data Repository, or OSDR, is the worlds premier open science platform for spaceflight biology. It synthesizes transcriptomics from GeneLab, physiological data from the Ames Life Sciences Data Archive, and verified European Space Agency experiments to uncover how living systems adapt to the extreme conditions of space.',
    keyPoints: [
      'Houses over 640 curated multi-omics spaceflight studies.',
      'Includes raw sequencing data, normalized counts, and phenotypic observations.',
      'Compliant with FAIR data principles: Findable, Accessible, Interoperable, and Reusable.',
    ],
    referenceStudy: 'OSD-255',
  },
  {
    id: 'radiation_dna',
    title: 'Cosmic Radiation & Cellular DNA Damage',
    category: 'Cellular Physics',
    speechText:
      'Outside the protection of Earths magnetosphere, galactic cosmic rays and solar particle events subject cells to high-LET heavy ions like Iron-56. These ions induce complex double-strand breaks in DNA. We observe strong upregulation of repair genes like CDKN1A and activation of oxidative stress enzymes like Superoxide Dismutase 2.',
    keyPoints: [
      'HZE ions cause clustered DNA lesions difficult to repair accurately.',
      'Activates ATM and p53 signaling pathways promoting cell cycle arrest.',
      'Hydrogen-rich shielding like polyethylene and water walls reduce secondary neutron showers.',
    ],
    referenceStudy: 'OSD-168',
  },
  {
    id: 'muscle_bone',
    title: 'Muscle Atrophy & Bone Demineralization',
    category: 'Physiology',
    speechText:
      'In microgravity, the absence of mechanical loading triggers rapid skeletal unloading. Astronauts can lose one to one point five percent of bone mineral density per month in cancellous bone like the femur and lumbar spine. Simultaneously, muscle-specific E3 ubiquitin ligases break down myofibrillar proteins in postural muscles.',
    keyPoints: [
      'Upregulation of TRIM63 (MuRF-1) drives soleus muscle sarcomeric atrophy.',
      'Osteoclast bone resorption outpaces osteoblast formation, releasing calcium into the bloodstream.',
      'Daily 2.5-hour ARED heavy resistive training is essential to preserve musculoskeletal mass for Mars transit.',
    ],
    referenceStudy: 'OSD-104',
  },
  {
    id: 'sans_fluids',
    title: 'Cephalad Fluid Shifts & SANS Syndrome',
    category: 'Human Health',
    speechText:
      'Without gravitational hydrostatic pull, approximately two liters of vascular fluid shifts toward the head. This cephalad redistribution elevates jugular vein pressure and optic nerve sheath diameter, contributing to Spaceflight-Associated Neuro-ocular Syndrome, or SANS, and changes in cerebral blood flow.',
    keyPoints: [
      'Causes choroidal folds, optic disc edema, and hyperopic refractive vision shifts.',
      'Alters venous return and increases intracranial venous pressure.',
      'Countermeasures under evaluation include lower body negative pressure (LBNP) and chaser cuffs.',
    ],
    referenceStudy: 'OSD-137',
  },
  {
    id: 'immune_system',
    title: 'T-Cell Dysregulation & Latent Viruses',
    category: 'Immunology',
    speechText:
      'Spaceflight induces immune system alterations characterized by reduced T-cell proliferation and altered cytokine cascades. Under mission stress and microgravity, latent herpesviruses such as Epstein-Barr and Varicella-Zoster frequently reactivate in astronaut saliva and blood.',
    keyPoints: [
      'Suppressed Interleukin-2 and Protein Kinase C theta (PRKCQ) signaling in T-cells.',
      'Shift toward Th2 anti-inflammatory phenotype, reducing cellular cytotoxicity.',
      'Elevated salivary cortisol and salivary viral shedding during long-duration flight.',
    ],
    referenceStudy: 'OSD-423',
  },
  {
    id: 'space_plants',
    title: 'Space Agriculture & Plant Gravitropism',
    category: 'Space Agriculture',
    speechText:
      'To sustain crews on lunar Artemis bases and Mars transit vehicles, bioregenerative life support systems rely on crops like Arabidopsis and dwarf wheat. In microgravity, roots lose directional gravitropic statolith sedimentation and depend on blue light phototropism and red LED spectrum tuning to maintain healthy biomass.',
    keyPoints: [
      'Auxin transport cascades adapt to absence of gravity vector.',
      'LED lighting with 3-to-1 red-to-blue spectrum optimizes photosynthetic stomatal conductance.',
      'Spaceflight plants demonstrate elevated stress antioxidants like anthocyanins.',
    ],
    referenceStudy: 'OSD-120',
  },
  {
    id: 'space_microbes',
    title: 'Spacecraft Microbiome & Biofilms',
    category: 'Microbiology',
    speechText:
      'Microorganisms on the International Space Station adapt rapidly to the enclosed environment. Swabs from dining tables and water recyclers reveal thicker polysaccharide biofilms and enhanced tolerance to cleaning disinfectants in species like Bacillus subtilis and Staphylococcus.',
    keyPoints: [
      'Elevated extracellular polymeric substance (EPS) production.',
      'Horizontal gene transfer and stress-induced mutational shifts.',
      'Essential to monitor ECLSS water recycling systems to protect crew health.',
    ],
    referenceStudy: 'OSD-60',
  },
  {
    id: 'scientific_integrity',
    title: 'Evidence Tiers & Scientific Limitations',
    category: 'Scientific Guardrails',
    speechText:
      'A crucial principle of science education: never extrapolate raw molecular gene expressions as direct evidence of clinical pathology. Gene expression changes in NASA OSDR datasets reflect cellular adaptation and environmental acclimation. Spaceflight biology combines molecular data with clinical health measurements to ensure safe human exploration.',
    keyPoints: [
      'Differentiates correlation in omics datasets from clinical disease causation.',
      'Respects sample size limitations inherent in human and animal spaceflight payloads.',
      'Distinguishes conceptual 3D biological models from dataset-derived physical models.',
    ],
    referenceStudy: 'OSD-255',
  },
];

export const LauraBioAssistant: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('osdr_overview');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const selectedTopic =
    BRIEFING_TOPICS.find((t) => t.id === selectedTopicId) || BRIEFING_TOPICS[0];

  useEffect(() => {
    // Stop any ongoing speech when component unmounts or topic changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [selectedTopicId]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser environment.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (isMuted) {
      setIsMuted(false);
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedTopic.speechText);
    utterance.rate = speechRate;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) &&
        v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleMuteToggle = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-6">
      {/* Laura Hero Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#070C1B] to-[#0B1528] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
              <Bot className="w-8 h-8" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">Laura</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                NASA SPACE BIOLOGY AI GUIDE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Interactive voice companion explaining spaceflight cellular mechanisms, multi-omics discoveries, and empirical countermeasure science with audio narration.
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-3 bg-[#070C1B] p-2 rounded-xl border border-white/10">
          <button
            onClick={toggleSpeech}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause Audio
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Listen to Briefing
              </>
            )}
          </button>

          <button
            onClick={handleMuteToggle}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-slate-800 text-slate-500 border-white/5'
                : 'bg-slate-800/80 text-cyan-300 border-cyan-500/20 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Speed Selector */}
          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className="px-2 py-1.5 bg-[#0B1528] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value={0.9}>0.9x Speed</option>
            <option value={1.0}>1.0x Speed</option>
            <option value={1.15}>1.15x Speed</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topic List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Scientific Briefings (8)
          </h4>

          <div className="space-y-1.5">
            {BRIEFING_TOPICS.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400/80 shadow-md shadow-cyan-950/50'
                      : 'bg-[#070C1B] border-white/10 hover:border-cyan-500/30 hover:bg-[#0B1528]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block mb-0.5">
                      {topic.category}
                    </span>
                    <div className="text-xs font-bold text-white truncate">
                      {topic.title}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Audio Transcript & Deep Dive (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Category: {selectedTopic.category}
                </span>
                {selectedTopic.referenceStudy && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-white/10">
                    Ref: {selectedTopic.referenceStudy}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedTopic.title}
              </h3>
            </div>

            {/* Audio Waveform / Speech Bubble */}
            <div className="p-5 rounded-xl bg-[#0B1528] border border-cyan-500/20 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  Laura's Spoken Explanation
                </span>
                {isPlaying && (
                  <span className="text-xs font-mono text-cyan-300 flex items-center gap-1 animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Narrating...
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans italic">
                "{selectedTopic.speechText}"
              </p>
            </div>

            {/* Key Scientific Takeaways */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Key Scientific Insights
              </h4>
              <div className="space-y-2">
                {selectedTopic.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0B1528] border border-white/5 flex items-start gap-3 text-xs text-slate-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Transparency Notice */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3 text-[11px] text-slate-400 leading-relaxed">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Curriculum Alignment:</strong> Laura's scientific briefings are formulated directly from NASA Human Research Program (HRP) evidence books and NASA GeneLab peer-reviewed publications. Audio synthesis runs natively using the W3C Web Speech API without external cloud audio transmissions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
