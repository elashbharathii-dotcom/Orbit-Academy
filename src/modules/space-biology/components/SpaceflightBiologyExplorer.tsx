import React, { useState } from 'react';
import {
  SpaceflightTopicId,
  SpaceflightTopicDef,
} from '../types';
import { SPACEFLIGHT_TOPICS, VERIFIED_OSDR_STUDIES } from '../biologyData';
import { NasaOsdrStudyMetadata } from '../../../services/nasa/types';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Dna,
  Microscope,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface SpaceflightBiologyExplorerProps {
  onInspectStudy: (study: NasaOsdrStudyMetadata) => void;
  onExplore3dModel?: (modelId: string) => void;
}

export const SpaceflightBiologyExplorer: React.FC<SpaceflightBiologyExplorerProps> = ({
  onInspectStudy,
  onExplore3dModel,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<SpaceflightTopicId>('microgravity_fluids');

  const selectedTopic = SPACEFLIGHT_TOPICS.find((t) => t.id === selectedTopicId) || SPACEFLIGHT_TOPICS[0];

  const getSeverityBadge = (severity: SpaceflightTopicDef['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Critical Risk
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            High Severity
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Moderate
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Operational
          </span>
        );
    }
  };

  const handleInspectLinkedStudy = () => {
    const study = VERIFIED_OSDR_STUDIES.find(
      (s) => s.accession === selectedTopic.osdrStudy.accession
    );
    if (study) {
      onInspectStudy(study);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1528] to-[#070C1B] border border-cyan-500/30">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4" />
            NASA Spaceflight Biology & Human Research Program
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Spaceflight Physiological Hallmarks & Cellular Adaptation
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Investigate how long-duration microgravity, deep space ionizing radiation, and closed spacecraft atmospheres alter living systems from molecular gene expression to whole-organ physiology, grounded in NASA OSDR open science datasets.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8 Topic Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Select Spaceflight Hallmark (8)
          </h3>

          <div className="space-y-2">
            {SPACEFLIGHT_TOPICS.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400/80 shadow-lg shadow-cyan-950/50'
                      : 'bg-[#070C1B] border-white/10 hover:border-cyan-500/30 hover:bg-[#0B1528]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        {topic.osdrStudy.accession}
                      </span>
                      {getSeverityBadge(topic.severity)}
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {topic.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      System: <span className="text-slate-300">{topic.system}</span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform mt-1 ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Dive Inspection Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-6">
            {/* Topic Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Target System: {selectedTopic.system}
                </span>
                {getSeverityBadge(selectedTopic.severity)}
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {selectedTopic.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Baseline 1g vs Microgravity State Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#0B1528] border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  1G Earth Baseline State
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hydrostatic pressure gradient (~100 mmHg lower limb, 25 mmHg cerebral). Normal osteoblast/osteoclast remodeling homeostasis. Continuous gravity-driven muscular tone maintains myofibrillar protein synthesis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1528] border border-rose-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Microgravity Alteration
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Loss of hydrostatic column forces ~1.5–2.0 L cephalad fluid shift. Unloading triggers rapid osteocyte apoptosis, while muscle specific E3 ubiquitin ligases (MuRF-1/TRIM63) drive rapid sarcomeric degradation.
                </p>
              </div>
            </div>

            {/* Cellular Pathway Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Dna className="w-4 h-4" />
                Cellular & Molecular Pathway
              </h4>
              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
                {selectedTopic.cellularPathway}
              </div>
            </div>

            {/* Clinical & Mission Implication */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Clinical & Mission Implication
              </h4>
              <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 text-xs text-slate-300 leading-relaxed">
                {selectedTopic.clinicalImplication}
              </div>
            </div>

            {/* Validated Countermeasures */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                NASA Operational Countermeasures
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTopic.countermeasures.map((cm, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0B1528] border border-emerald-500/10 flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{cm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Biomarker Genes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Microscope className="w-4 h-4" />
                Key Biomarker Genes in this Pathway
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.keyGenes.map((gene, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/15 text-purple-200 border border-purple-500/30"
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Verified OSDR Study Card */}
            <div className="p-4 rounded-xl bg-[#0B1528] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Primary Linked NASA OSDR Dataset
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {selectedTopic.osdrStudy.accession}
                </span>
              </div>

              <div>
                <h5 className="text-sm font-bold text-white">
                  {selectedTopic.osdrStudy.title}
                </h5>
                <div className="text-xs text-slate-400 mt-1">
                  Organism: <span className="italic text-slate-300">{selectedTopic.osdrStudy.organism}</span> • Mission: <span className="text-slate-300">{selectedTopic.osdrStudy.mission}</span> • Platform: <span className="text-slate-300">{selectedTopic.osdrStudy.platform}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedTopic.osdrStudy.summaryFindings}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleInspectLinkedStudy}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
                  >
                    <Microscope className="w-3.5 h-3.5" />
                    Inspect Study Details & Download Data
                  </button>

                  {onExplore3dModel && (
                    <button
                      onClick={() => {
                        const model = selectedTopic.id.includes('radiation')
                          ? 'dna_helix'
                          : selectedTopic.id.includes('plant')
                          ? 'plant_cell'
                          : selectedTopic.id.includes('microbial')
                          ? 'microorganism'
                          : selectedTopic.id.includes('bone')
                          ? 'bone_tissue'
                          : selectedTopic.id.includes('muscle')
                          ? 'muscle_sarcomere'
                          : 'human_cell';
                        onExplore3dModel(model);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Dna className="w-3.5 h-3.5 text-purple-300" />
                      Explore 3D Structure
                    </button>
                  )}
                </div>

                <a
                  href={selectedTopic.osdrStudy.authoritativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Open on OSDR Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
