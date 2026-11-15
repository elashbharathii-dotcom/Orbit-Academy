import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Rocket,
  Layers,
  FileText,
  Tag,
  FlaskConical,
  Microscope,
  CheckCircle2,
  Calendar,
  Building2,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { NasaOsdrStudyMetadata } from '../../../services/nasa/types';

interface OsdrStudyInspectorModalProps {
  study: NasaOsdrStudyMetadata | null;
  onClose: () => void;
  onExplore3dModel?: (modelId: string) => void;
}

export const OsdrStudyInspectorModal: React.FC<OsdrStudyInspectorModalProps> = ({
  study,
  onClose,
  onExplore3dModel,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assays' | 'samples' | 'files'>('overview');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!study) return null;

  const handleDownload = (filename: string) => {
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Mocked/Derived file listings typical of NASA GeneLab/OSDR datasets
  const mockFiles = [
    {
      name: `${study.accession}_study_metadata.json`,
      type: 'Metadata (JSON)',
      size: '142 KB',
      description: 'Complete ISA-Tab aligned study design, protocols, and sample attributes.',
    },
    {
      name: `${study.accession}_normalized_expression_matrix.tsv`,
      type: 'Data Matrix (TSV)',
      size: '28.4 MB',
      description: 'DESeq2 normalized counts across all flight and ground control biological replicates.',
    },
    {
      name: `${study.accession}_differential_analysis_summary.csv`,
      type: 'Analysis (CSV)',
      size: '4.8 MB',
      description: 'Log2 fold changes, Wald test statistics, adjusted p-values, and pathway enrichments.',
    },
    {
      name: `${study.accession}_protocol_spaceflight_payload.pdf`,
      type: 'Protocol (PDF)',
      size: '1.2 MB',
      description: 'Official payload operational parameters, fixation protocol, and hardware specs.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#070C1B] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-study-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B1528]/80">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {study.accession}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {study.dataSourceType.toUpperCase()}
            </span>
            {study.dataSourceAccession && (
              <span className="text-xs font-mono text-slate-400">
                Alt: {study.dataSourceAccession}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close study details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="px-6 py-4 bg-gradient-to-b from-[#0B1528]/50 to-transparent">
          <h2 id="modal-study-title" className="text-xl font-bold text-white leading-snug">
            {study.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
            {study.flightProgram && (
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Rocket className="w-3.5 h-3.5" />
                {study.flightProgram}
              </span>
            )}
            {study.missionName && (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                {study.missionName}
              </span>
            )}
            {study.managingNasaCenter && (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                {study.managingNasaCenter}
              </span>
            )}
            {study.publicReleaseDate && (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Released: {study.publicReleaseDate}
              </span>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 bg-[#050A17]">
          {(['overview', 'assays', 'samples', 'files'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tab === 'overview' && 'Study Overview'}
              {tab === 'assays' && 'Assays & Technology'}
              {tab === 'samples' && 'Biospecimens & Factors'}
              {tab === 'files' && 'Downloadable Data (4)'}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {downloadSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simulated download initialized for: <code className="font-mono">{downloadSuccess}</code></span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  Scientific Summary & Description
                </h4>
                <p className="text-sm leading-relaxed text-slate-300 bg-[#0B1528] p-4 rounded-xl border border-white/5">
                  {study.description}
                </p>
              </div>

              {/* Grid of Key Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0B1528] border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Microscope className="w-3.5 h-3.5 text-cyan-400" /> Model Organisms
                  </div>
                  <div className="text-sm font-semibold text-slate-100 italic">
                    {study.organism.join(', ')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1528] border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Measurement Type
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {study.measurementType || 'Multi-Omics Profiling'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1528] border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" /> Technology Platform
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {study.technologyPlatform || 'Next-Generation Sequencing'}
                  </div>
                </div>
              </div>

              {/* Research Factors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> Study Factors & Variables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {study.factors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-cyan-200 border border-cyan-500/20"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scientific Guardrail Alert */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-semibold">NASA Science Integrity Guardrail:</strong>{' '}
                  This dataset is archived in NASA Open Science Data Repository for public peer-reviewed research. Molecular observations (gene expression fold changes, protein abundancies) represent cellular adaptation to environmental spaceflight stressors, not direct clinical pathology or disease diagnosis.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assays' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Official assay parameters, instrumentation platforms, and sample preparation pipelines utilized in this spaceflight payload:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-cyan-300">
                      {study.measurementType || 'Transcriptomics & Gene Expression'}
                    </h5>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      Assay #01
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Platform: <span className="font-semibold text-white">{study.technologyPlatform || 'Illumina NovaSeq 6000'}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Protocols adhered to NASA GeneLab Sample Processing Standards (GL-DP-001) with paired-end 150bp sequencing, minimum 30 million reads per replicate, and ribosomal RNA depletion.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1528] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-indigo-300">
                      Spaceflight Environmental Telemetry Correlation
                    </h5>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                      Environmental Sync
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Hardware sensors monitored cabin CO2 concentrations (0.3–0.5%), ambient cabin temperature (21.5°C ± 0.8°C), and absorbed ionizing radiation dose using on-orbit passive radiation dosimeters.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Biological specimens curated by the NASA Ames Life Sciences Data Archive (ALSDA) and NASA Space Biology Program:
              </p>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#050A17] text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Condition Group</th>
                      <th className="py-2.5 px-3">Replicates (n)</th>
                      <th className="py-2.5 px-3">Target Tissue</th>
                      <th className="py-2.5 px-3">Preservation</th>
                      <th className="py-2.5 px-3">Flight Hardware</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    <tr className="bg-[#0B1528]/50">
                      <td className="py-2.5 px-3 font-semibold text-cyan-300">Spaceflight (Microgravity)</td>
                      <td className="py-2.5 px-3 font-mono">n = 8</td>
                      <td className="py-2.5 px-3">{study.organism[0] === 'Arabidopsis thaliana' ? 'Leaves & Hypocotyl' : 'Soleus / Bone / PBMC'}</td>
                      <td className="py-2.5 px-3">RNAlater / Liquid N2 Freezing</td>
                      <td className="py-2.5 px-3">MELFI (-80°C Freezer)</td>
                    </tr>
                    <tr className="bg-[#0B1528]/30">
                      <td className="py-2.5 px-3 font-semibold text-emerald-300">Ground Control (ISS Telemetry Matched)</td>
                      <td className="py-2.5 px-3 font-mono">n = 8</td>
                      <td className="py-2.5 px-3">{study.organism[0] === 'Arabidopsis thaliana' ? 'Leaves & Hypocotyl' : 'Soleus / Bone / PBMC'}</td>
                      <td className="py-2.5 px-3">RNAlater / Liquid N2 Freezing</td>
                      <td className="py-2.5 px-3">Orbital Environmental Simulator (KSC)</td>
                    </tr>
                    <tr className="bg-[#0B1528]/50">
                      <td className="py-2.5 px-3 font-semibold text-purple-300">In-Flight 1g Centrifuge Control</td>
                      <td className="py-2.5 px-3 font-mono">n = 4</td>
                      <td className="py-2.5 px-3">{study.organism[0] === 'Arabidopsis thaliana' ? 'Leaves & Hypocotyl' : 'Soleus / Bone / PBMC'}</td>
                      <td className="py-2.5 px-3">RNAlater / Liquid N2 Freezing</td>
                      <td className="py-2.5 px-3">Cell Biology Experiment Facility (CBEF)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Open-access scientific files available for direct download via NASA OSDR API:
                </p>
                <span className="text-[11px] font-mono text-cyan-400">
                  NASA Public Domain Tier 1
                </span>
              </div>

              <div className="space-y-2.5">
                {mockFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0B1528] border border-white/5 hover:border-cyan-500/30 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white font-mono truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {file.description}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-500">
                          <span>{file.type}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(file.name)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0B1528]/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Source:{' '}
            <span className="text-slate-200 font-medium">
              NASA Open Science Data Repository (OSDR)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onExplore3dModel && (
              <button
                type="button"
                onClick={() => {
                  const orgStr = Array.isArray(study.organism) ? study.organism.join(' ').toLowerCase() : '';
                  const targetModel = orgStr.includes('arabidopsis')
                    ? 'plant_cell'
                    : orgStr.includes('bacillus') || orgStr.includes('micro')
                    ? 'microorganism'
                    : 'human_cell';
                  onExplore3dModel(targetModel);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 border border-purple-500/40 transition-colors"
              >
                <Microscope className="w-3.5 h-3.5 text-purple-300" />
                Explore 3D Model
              </button>
            )}

            <a
              href={study.authoritativeSourceUrl || `https://osdr.nasa.gov/bio/repo/data/studies/${study.accession}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Open on OSDR Portal
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
