import React, { useState } from 'react';
import {
  BIOMARKER_GENES,
  HEATMAP_SAMPLES,
  VERIFIED_OSDR_STUDIES,
} from '../biologyData';
import { NasaOsdrStudyMetadata } from '../../../services/nasa/types';
import {
  Dna,
  Layers,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';

interface ScientificDataChartsProps {
  onInspectStudy: (study: NasaOsdrStudyMetadata) => void;
}

export const ScientificDataCharts: React.FC<ScientificDataChartsProps> = ({
  onInspectStudy,
}) => {
  const [selectedGeneSymbol, setSelectedGeneSymbol] = useState<string>('CDKN1A');
  const [hoveredCell, setHoveredCell] = useState<{
    sampleId: string;
    condition: string;
    gene: string;
    zScore: number;
  } | null>(null);

  const selectedGene =
    BIOMARKER_GENES.find((g) => g.symbol === selectedGeneSymbol) || BIOMARKER_GENES[0];

  const handleStudyClick = (accession: string) => {
    const study = VERIFIED_OSDR_STUDIES.find((s) => s.accession === accession);
    if (study) {
      onInspectStudy(study);
    }
  };

  // Helper to color z-scores (-2.5 to +2.5)
  const getZScoreColor = (z: number) => {
    if (z > 1.8) return 'bg-rose-500 text-white font-bold';
    if (z > 1.0) return 'bg-amber-500/80 text-white font-semibold';
    if (z > 0.3) return 'bg-amber-500/40 text-amber-200';
    if (z > -0.3) return 'bg-slate-800 text-slate-300';
    if (z > -1.0) return 'bg-cyan-900/40 text-cyan-200';
    if (z > -1.8) return 'bg-cyan-700/80 text-white font-semibold';
    return 'bg-blue-600 text-white font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Scientific Integrity Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold uppercase tracking-wider block mb-0.5">
            NASA Scientific Integrity & Molecular Disclaimer
          </strong>
          These gene expression levels, fold-changes, and multi-omics z-scores are derived from peer-reviewed NASA GeneLab and ALSDA flight investigations. In accordance with NASA Open Science guidelines, these molecular alterations reflect cellular environmental stress response, metabolic plasticity, and gravity sensing adaptation — not direct clinical pathology or disease diagnosis.
        </div>
      </div>

      {/* Part 1: Interactive Biomarker Gene Expression Profiler */}
      <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Dna className="w-4 h-4" />
              NASA GeneLab Multi-Omics Biomarker Suite
            </div>
            <h3 className="text-lg font-bold text-white">
              Spaceflight vs Ground vs In-Flight 1G Expression
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a key spaceflight biomarker to inspect normalized expression fold-changes and biological pathways:
            </p>
          </div>

          {/* Gene Selector Pills */}
          <div className="flex flex-wrap gap-1.5">
            {BIOMARKER_GENES.map((gene) => {
              const isSelected = gene.symbol === selectedGeneSymbol;
              return (
                <button
                  key={gene.symbol}
                  onClick={() => setSelectedGeneSymbol(gene.symbol)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 scale-105'
                      : 'bg-[#0B1528] text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'
                  }`}
                >
                  {gene.symbol}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Gene Detail Card */}
        <div className="p-5 rounded-xl bg-[#0B1528] border border-white/5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-cyan-300">
                  {selectedGene.symbol}
                </span>
                <span className="text-xs text-slate-400 italic">
                  ({selectedGene.name})
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedGene.direction === 'up'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {selectedGene.direction === 'up' ? 'Up-Regulated' : 'Down-Regulated'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Pathway: <span className="text-slate-200 font-semibold">{selectedGene.pathway}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                p-value: <span className="text-cyan-300 font-bold">{selectedGene.pVal.toExponential(2)}</span>
              </span>
              <button
                onClick={() => handleStudyClick(selectedGene.studyAccession)}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors flex items-center gap-1"
              >
                <span>Study: {selectedGene.studyAccession}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-[#070C1B]/80 p-3.5 rounded-lg border border-white/5">
            {selectedGene.description}
          </p>

          {/* Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Normalized Relative Expression (Fold Change)
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Spaceflight Microgravity Condition */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    Spaceflight Microgravity (Flight ISS)
                  </span>
                  <span className="font-bold text-cyan-300">
                    {selectedGene.flightExpression.toFixed(2)}x
                  </span>
                </div>
                <div className="w-full h-5 rounded-lg bg-slate-900 overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (selectedGene.flightExpression / 4.0) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Ground Control Condition */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Ground Control Baseline (ISS Telemetry Matched)
                  </span>
                  <span className="font-bold text-emerald-300">
                    {selectedGene.groundControlExpression.toFixed(2)}x (Baseline)
                  </span>
                </div>
                <div className="w-full h-5 rounded-lg bg-slate-900 overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{
                      width: `${(selectedGene.groundControlExpression / 4.0) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* In-Flight 1G Centrifuge Control */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    In-Flight 1G Centrifuge Control (Isolates Radiation vs Gravity)
                  </span>
                  <span className="font-bold text-purple-300">
                    {selectedGene.centrifugeControlExpression.toFixed(2)}x
                  </span>
                </div>
                <div className="w-full h-5 rounded-lg bg-slate-900 overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (selectedGene.centrifugeControlExpression / 4.0) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong>Note on Centrifuge Control:</strong> If the 1G centrifuge expression returns close to 1.0x (as in <em>TRIM63</em> or <em>ALPL</em>), the biological change is primarily gravity-dependent. If it remains elevated (as in <em>CDKN1A</em>), radiation or spacecraft atmospheric factors are the driving stressors.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Interactive Multi-Omics Expression Heatmap */}
      <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Transcriptomic & Multi-Omics Heatmap Matrix
            </div>
            <h3 className="text-lg font-bold text-white">
              Standardized Z-Score Expression Across 10 Biological Replicates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hover over or click cells to view replicate metadata, experimental group, and normalized z-score:
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Down (-2.5)</span>
            <div className="flex h-3 w-32 rounded overflow-hidden">
              <div className="flex-1 bg-blue-600" />
              <div className="flex-1 bg-cyan-700" />
              <div className="flex-1 bg-slate-800" />
              <div className="flex-1 bg-amber-500" />
              <div className="flex-1 bg-rose-500" />
            </div>
            <span>Up (+2.5)</span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-[#050A17] text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-3 text-left font-bold text-slate-300">Gene</th>
                {HEATMAP_SAMPLES.map((s) => (
                  <th key={s.sampleId} className="py-3 px-2 font-mono whitespace-nowrap">
                    <div className="text-[11px] text-white">{s.sampleId}</div>
                    <div className="text-[9px] text-slate-500">
                      {s.condition === 'Ground Control'
                        ? 'Ground'
                        : s.condition === 'Spaceflight (uG)'
                        ? 'Flight µG'
                        : 'ISS 1G'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {BIOMARKER_GENES.map((gene) => (
                <tr key={gene.symbol} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-left font-bold text-cyan-300 flex items-center justify-between gap-2">
                    <span>{gene.symbol}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {gene.direction === 'up' ? '▲' : '▼'}
                    </span>
                  </td>
                  {HEATMAP_SAMPLES.map((sample) => {
                    const zScore = sample.values[gene.symbol] ?? 0;
                    const cellColorClass = getZScoreColor(zScore);
                    return (
                      <td
                        key={sample.sampleId}
                        onMouseEnter={() =>
                          setHoveredCell({
                            sampleId: sample.sampleId,
                            condition: sample.condition,
                            gene: gene.symbol,
                            zScore,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`py-2 px-1 text-[11px] transition-transform cursor-pointer hover:scale-110 ${cellColorClass}`}
                        title={`${gene.symbol} in ${sample.sampleId} (${sample.condition}): z-score = ${zScore.toFixed(2)}`}
                      >
                        {zScore > 0 ? `+${zScore.toFixed(1)}` : zScore.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hovered Cell Info Footer */}
        <div className="p-3 rounded-xl bg-[#0B1528] border border-white/5 min-h-[44px] flex items-center justify-between text-xs">
          {hoveredCell ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono font-bold text-cyan-300">{hoveredCell.gene}</span>
              <span className="text-slate-400">Sample: <code className="text-white font-mono">{hoveredCell.sampleId}</code></span>
              <span className="text-slate-400">Condition: <strong className="text-slate-200">{hoveredCell.condition}</strong></span>
              <span className="text-slate-400">Z-Score: <strong className="font-mono text-cyan-400">{hoveredCell.zScore > 0 ? `+${hoveredCell.zScore.toFixed(2)}` : hoveredCell.zScore.toFixed(2)}</strong></span>
            </div>
          ) : (
            <span className="text-slate-500 italic text-[11px]">
              Hover over any heatmap coordinate to inspect experimental replicate details.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
