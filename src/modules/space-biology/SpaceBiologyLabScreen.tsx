import React, { useState } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { LabTabId, BioModelId } from './types';
import { NasaOsdrStudyMetadata } from '../../services/nasa/types';
import { ResearchDashboard } from './components/ResearchDashboard';
import { Bio3dExplorerView } from './components/Bio3dExplorerView';
import { SpaceflightBiologyExplorer } from './components/SpaceflightBiologyExplorer';
import { ScientificDataCharts } from './components/ScientificDataCharts';
import { InteractiveCountermeasureLab } from './components/InteractiveCountermeasureLab';
import { LauraBioAssistant } from './components/LauraBioAssistant';
import { OsdrStudyInspectorModal } from './components/OsdrStudyInspectorModal';
import {
  Dna,
  Database,
  Layers,
  Activity,
  Sliders,
  Bot,
  Rotate3d,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const SpaceBiologyLabScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTabId>('dashboard');
  const [inspectedStudy, setInspectedStudy] = useState<NasaOsdrStudyMetadata | null>(null);
  const [target3dModel, setTarget3dModel] = useState<BioModelId>('human_cell');

  const handleInspectStudy = (study: NasaOsdrStudyMetadata) => {
    setInspectedStudy(study);
  };

  const handleExplore3dModel = (modelId: string) => {
    setTarget3dModel(modelId as BioModelId);
    setActiveTab('visualizer_3d');
  };

  return (
    <div className="min-h-screen bg-[#02050D] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <MasterHeader />

      {/* Flagship Hero Banner */}
      <div className="relative border-b border-cyan-500/20 bg-gradient-to-b from-[#070C1B] via-[#050A17] to-[#02050D] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                  <Dna className="w-3.5 h-3.5 text-cyan-400" />
                  NASA OSDR & GENELAB
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  STAGE 05 FLAGSHIP
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/40">
                  OPEN SCIENCE VERIFIED
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Space Biology & Astronaut Research Lab
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Explore the frontiers of space life sciences using actual NASA Open Science Data Repository (OSDR) multi-omics datasets, interactive 3D cellular and molecular models, spaceflight physiological hallmarks, and simulated countermeasure protocols for deep space exploration.
              </p>
            </div>

            {/* Quick Stats Pill Panel */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 lg:items-end">
              <div className="p-3 rounded-xl bg-[#0B1528] border border-cyan-500/20 flex items-center gap-3">
                <Database className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">647+ Studies</div>
                  <div className="text-[10px] text-slate-400 font-mono">NASA OSDR Datasets</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1528] border border-indigo-500/20 flex items-center gap-3">
                <Rotate3d className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">8 3D Systems</div>
                  <div className="text-[10px] text-slate-400 font-mono">Cellular & Molecular Models</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1528] border border-emerald-500/20 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">3 Sim Chambers</div>
                  <div className="text-[10px] text-slate-400 font-mono">Interactive Countermeasures</div>
                </div>
              </div>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 pt-6 sm:pt-8 scrollbar-none border-t border-white/5 mt-6">
            {[
              {
                id: 'dashboard' as const,
                label: 'OSDR Research Dashboard',
                icon: Database,
                badge: '647 Studies',
              },
              {
                id: 'visualizer_3d' as const,
                label: '3D Biology Visualizer',
                icon: Rotate3d,
                badge: '8 Models',
              },
              {
                id: 'spaceflight_biology' as const,
                label: 'Spaceflight Hallmarks',
                icon: Activity,
                badge: '8 Pathways',
              },
              {
                id: 'multiomics_data' as const,
                label: 'Multi-Omics & Biomarkers',
                icon: Layers,
                badge: 'Heatmap & Genes',
              },
              {
                id: 'countermeasure_lab' as const,
                label: 'Countermeasure Lab',
                icon: Sliders,
                badge: 'Simulation',
              },
              {
                id: 'laura_assistant' as const,
                label: 'Laura AI Guide',
                icon: Bot,
                badge: 'Audio Voice',
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-[1.02]'
                      : 'bg-[#070C1B] text-slate-300 hover:text-white hover:bg-[#0B1528] border border-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-cyan-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-black/20 text-black font-extrabold'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <ResearchDashboard
            onSelectStudy={handleInspectStudy}
            onNavigateToTab={(tab) => setActiveTab(tab as LabTabId)}
          />
        )}

        {activeTab === 'visualizer_3d' && (
          <Bio3dExplorerView
            onInspectStudy={handleInspectStudy}
            initialModelId={target3dModel}
          />
        )}

        {activeTab === 'spaceflight_biology' && (
          <SpaceflightBiologyExplorer
            onInspectStudy={handleInspectStudy}
            onExplore3dModel={handleExplore3dModel}
          />
        )}

        {activeTab === 'multiomics_data' && (
          <ScientificDataCharts onInspectStudy={handleInspectStudy} />
        )}

        {activeTab === 'countermeasure_lab' && <InteractiveCountermeasureLab />}

        {activeTab === 'laura_assistant' && <LauraBioAssistant />}
      </main>

      {/* Inspector Modal */}
      <OsdrStudyInspectorModal
        study={inspectedStudy}
        onClose={() => setInspectedStudy(null)}
        onExplore3dModel={handleExplore3dModel}
      />

      {/* Scientific Citation & Footer Strip */}
      <footer className="border-t border-white/10 bg-[#050A17] text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-cyan-300">ORBIT ACADEMY</span>
            <span>•</span>
            <span>Powered by NASA Open Science Data Repository (OSDR) & GeneLab</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://osdr.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>NASA OSDR Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://genelab.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>NASA GeneLab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>NASA Open Science Tier 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
