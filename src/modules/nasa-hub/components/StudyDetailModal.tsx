import React, { useState, useEffect } from 'react';
import {
  NasaOsdrStudyMetadata,
  NasaOsdrAssayItem,
  NasaOsdrFileItem,
} from '../../../services/nasa/types';
import { osdrService } from '../../../services/nasa/osdrService';
import {
  X,
  Download,
  ExternalLink,
  Bot,
  BookOpen,
} from 'lucide-react';

interface StudyDetailModalProps {
  study: NasaOsdrStudyMetadata | null;
  onClose: () => void;
  onAskLaura?: (topic: string, description: string) => void;
}

export const StudyDetailModal: React.FC<StudyDetailModalProps> = ({
  study,
  onClose,
  onAskLaura,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assays' | 'files'>('overview');
  const [assays, setAssays] = useState<NasaOsdrAssayItem[]>([]);
  const [files, setFiles] = useState<NasaOsdrFileItem[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    if (!study) return;

    setIsLoadingDetails(true);
    Promise.all([
      osdrService.getAssays(study.accession),
      osdrService.getFiles(study.accession),
    ])
      .then(([assayRes, filesRes]) => {
        setAssays(assayRes.data.assays || []);
        setFiles(filesRes.data.files || []);
      })
      .finally(() => {
        setIsLoadingDetails(false);
      });
  }, [study]);

  if (!study) return null;

  const isGeneLab = study.dataSourceType === 'cgene';
  const isAlsda = study.dataSourceType === 'alsda';
  const isEsa = study.dataSourceType === 'esa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-purple-500/30 bg-[#070C1B] shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-study-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="space-y-2 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/90 border border-cyan-800 px-2.5 py-0.5 rounded-lg">
                {study.accession}
              </span>
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  isGeneLab
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : isAlsda
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : isEsa
                    ? 'bg-blue-950 text-blue-300 border-blue-700'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isGeneLab ? 'GeneLab Omics' : isAlsda ? 'NASA ALSDA' : isEsa ? 'ESA Spaceflight' : 'NASA OSDR'}
              </span>
              {study.dataSourceAccession && (
                <span className="font-mono text-xs text-slate-400">
                  Accession: {study.dataSourceAccession}
                </span>
              )}
            </div>

            <h3 id="modal-study-title" className="text-lg font-bold text-white leading-snug">
              {study.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Scientific Overview & Protocols
          </button>
          <button
            onClick={() => setActiveTab('assays')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'assays'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Assays & Technology Platforms ({assays.length})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'files'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Downloadable Data Files ({files.length})
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SCIENTIFIC OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Mission & Experimental Telemetry Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Space Mission</span>
                  <strong className="text-amber-300 block truncate mt-0.5">{study.missionName}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Organism Studied</span>
                  <strong className="text-cyan-300 block truncate mt-0.5">{study.organism.join(', ')}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Managing Center</span>
                  <strong className="text-slate-200 block truncate mt-0.5">{study.managingNasaCenter}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Flight Program</span>
                  <strong className="text-slate-200 block truncate mt-0.5">{study.flightProgram}</strong>
                </div>
              </div>

              {/* Study Description */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Study Abstract & Experimental Objective
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {study.description}
                </p>
              </div>

              {/* Spaceflight Factors */}
              {study.factors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Experimental Factors & Variables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {study.factors.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl font-mono text-xs bg-slate-800/80 border border-slate-700 text-slate-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Peer-Reviewed Publication */}
              {study.publicationTitle && (
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-purple-400">
                    Peer-Reviewed Scientific Publication
                  </span>
                  <h5 className="text-sm font-semibold text-white">{study.publicationTitle}</h5>
                  {study.publicationAuthors && (
                    <p className="text-xs text-slate-400 italic">{study.publicationAuthors}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ASSAYS & TECHNOLOGY */}
          {activeTab === 'assays' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                Assays document the physical measurements, technology types, and instrument platforms used to sequence or image the spaceflight samples.
              </p>

              {isLoadingDetails ? (
                <div className="text-center py-10 font-mono text-xs text-slate-400 animate-pulse">
                  Loading NASA assay metadata from OSDR Biological Data API v2...
                </div>
              ) : assays.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-mono text-xs">
                  No assay profiles registered for this accession.
                </div>
              ) : (
                <div className="space-y-3">
                  {assays.map((assay, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-cyan-300 font-mono truncate">
                          {assay.assayName}
                        </strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700">
                          {assay.technologyType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                        <div>
                          <span className="text-slate-500">Measurement Type: </span>
                          <span className="text-slate-200">{assay.measurementType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Platform: </span>
                          <span className="text-slate-200">{assay.technologyPlatform}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOWNLOADABLE FILES */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                Direct science data assets provided via the official NASA Geode Data Manager service.
              </p>

              {isLoadingDetails ? (
                <div className="text-center py-10 font-mono text-xs text-slate-400 animate-pulse">
                  Querying official NASA Geode file registry...
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-mono text-xs">
                  No downloadable files cataloged.
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="space-y-0.5 truncate pr-4">
                        <div className="font-mono text-xs font-semibold text-slate-200 truncate">
                          {file.fileName}
                        </div>
                        <div className="text-[10px] font-mono text-purple-400">
                          {file.fileCategory || 'Science Data Asset'}
                        </div>
                      </div>

                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shrink-0 transition-colors shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onAskLaura) {
                  onAskLaura(
                    `NASA Spaceflight Study ${study.accession}: ${study.title}`,
                    `Explain why studying ${study.organism.join(', ')} during mission ${study.missionName} is essential for human deep-space exploration. ${study.description}`
                  );
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask Laura to Explain Biology</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={study.authoritativeSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <span>Official NASA OSDR Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
