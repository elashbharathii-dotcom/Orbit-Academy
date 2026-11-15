import React, { useState } from 'react';
import { BioModelId } from '../types';
import { BIO_STRUCTURES, VERIFIED_OSDR_STUDIES } from '../biologyData';
import { BiologyVisualizer3D } from './BiologyVisualizer3D';
import { NasaOsdrStudyMetadata } from '../../../services/nasa/types';
import {
  Rotate3d,
  Sparkles,
  Info,
  Sliders,
  Microscope,
} from 'lucide-react';

interface Bio3dExplorerViewProps {
  onInspectStudy: (study: NasaOsdrStudyMetadata) => void;
  initialModelId?: BioModelId;
}

export const Bio3dExplorerView: React.FC<Bio3dExplorerViewProps> = ({
  onInspectStudy,
  initialModelId = 'human_cell',
}) => {
  const [selectedModelId, setSelectedModelId] = useState<BioModelId>(initialModelId);
  const [explodeFactor, setExplodeFactor] = useState<number>(0.0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string | null>(null);

  const selectedModel =
    BIO_STRUCTURES.find((m) => m.id === selectedModelId) || BIO_STRUCTURES[0];

  const activeOrganelle = selectedModel.organelles.find(
    (org) => org.id === selectedOrganelleId
  );

  const handleStudyClick = (accession?: string) => {
    if (!accession) return;
    const study = VERIFIED_OSDR_STUDIES.find((s) => s.accession === accession);
    if (study) {
      onInspectStudy(study);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3D Model Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#070C1B] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Microscope className="w-4 h-4" />
            Select Biological System (8 Interactive Models)
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Scale: {selectedModel.scaleDescription}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {BIO_STRUCTURES.map((structure) => {
            const isSelected = structure.id === selectedModelId;
            return (
              <button
                key={structure.id}
                onClick={() => {
                  setSelectedModelId(structure.id);
                  setSelectedOrganelleId(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-[#0B1528] border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {structure.category}
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {structure.name.split(' (')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Viewport & Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 3D Viewport (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative w-full h-[540px] rounded-2xl bg-gradient-to-b from-[#030712] via-[#050C1F] to-[#02050D] border border-cyan-500/30 overflow-hidden shadow-2xl">
            {/* 3D Canvas */}
            <BiologyVisualizer3D
              selectedModelId={selectedModelId}
              explodeFactor={explodeFactor}
              selectedOrganelleId={selectedOrganelleId}
              onSelectOrganelle={setSelectedOrganelleId}
              isRotating={isRotating}
            />

            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                  {selectedModel.name}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    selectedModel.modelType === 'conceptual'
                      ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-500/40'
                      : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedModel.modelType === 'conceptual'
                    ? 'CONCEPTUAL 3D MODEL'
                    : 'DATASET-DERIVED 3D'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 italic font-serif">
                {selectedModel.scientificName}
              </span>
            </div>

            {/* Viewport Control Strip (Bottom Overlay) */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isRotating
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}
                >
                  <Rotate3d className="w-3.5 h-3.5" />
                  Auto-Rotate: {isRotating ? 'ON' : 'OFF'}
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explode View:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={explodeFactor}
                    onChange={(e) => setExplodeFactor(Number(e.target.value))}
                    className="w-24 accent-cyan-400"
                  />
                  <span className="font-mono text-cyan-300 text-[11px]">
                    {Math.round(explodeFactor * 100)}%
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Left click to orbit</span>
                <span>•</span>
                <span>Scroll to zoom</span>
              </div>
            </div>
          </div>

          {/* Model Summary & Spaceflight Impact */}
          <div className="p-5 rounded-2xl bg-[#070C1B] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Biological Overview & Spaceflight Alterations
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedModel.summary}
            </p>
            <div className="p-3.5 rounded-xl bg-[#0B1528] border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold block mb-1">
                Spaceflight Relevance & Cellular Vulnerability:
              </strong>
              {selectedModel.spaceflightRelevance}
            </div>

            {selectedModel.nasaStudyRef && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">
                  Linked NASA Open Science Dataset: <code className="text-cyan-300 font-bold">{selectedModel.nasaStudyRef}</code>
                </span>
                <button
                  onClick={() => handleStudyClick(selectedModel.nasaStudyRef)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Inspect Study Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Organelle & Structure Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#070C1B] border border-white/10 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Interactive Components</span>
                <span className="font-mono text-cyan-400">{selectedModel.organelles.length} Substructures</span>
              </div>
              <p className="text-xs text-slate-400">
                Click any component below or in the 3D viewport to inspect its spaceflight alterations:
              </p>
            </div>

            {/* Organelles List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {selectedModel.organelles.map((organelle) => {
                const isSelected = organelle.id === selectedOrganelleId;
                return (
                  <button
                    key={organelle.id}
                    onClick={() =>
                      setSelectedOrganelleId(isSelected ? null : organelle.id)
                    }
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50'
                        : 'bg-[#0B1528] border-white/5 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: organelle.color }}
                      />
                      <span className="text-xs font-bold text-white truncate">
                        {organelle.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">
                      {organelle.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Component Details */}
            {activeOrganelle ? (
              <div className="p-4 rounded-xl bg-[#0B1528] border border-cyan-500/30 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeOrganelle.color }}
                  />
                  <h5 className="text-xs font-bold text-cyan-300">
                    {activeOrganelle.name}
                  </h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeOrganelle.description}
                </p>
                <div className="pt-1 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Microgravity & Space Stress Response:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeOrganelle.spaceflightImpact}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-center text-xs text-slate-500 italic">
                Select any sub-structure in the list or 3D scene to display detailed space biological analysis.
              </div>
            )}

            {/* Scientific Modeling Badge Notice */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Model Integrity:</strong> This visualization provides a scientifically accurate conceptual representation designed for pedagogy and structural intuition. PDB macromolecular structures utilize NASA GeneLab protein coordinates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
