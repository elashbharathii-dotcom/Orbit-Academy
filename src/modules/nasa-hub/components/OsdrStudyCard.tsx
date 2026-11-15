import React from 'react';
import { NasaOsdrStudyMetadata } from '../../../services/nasa/types';
import {
  Dna,
  Calendar,
  Rocket,
  ChevronRight,
} from 'lucide-react';

interface OsdrStudyCardProps {
  study: NasaOsdrStudyMetadata;
  onSelect: (study: NasaOsdrStudyMetadata) => void;
}

export const OsdrStudyCard: React.FC<OsdrStudyCardProps> = ({ study, onSelect }) => {
  const isGeneLab = study.dataSourceType === 'cgene';
  const isAlsda = study.dataSourceType === 'alsda';
  const isEsa = study.dataSourceType === 'esa';

  return (
    <div
      onClick={() => onSelect(study)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900/80 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)] cursor-pointer"
    >
      {/* Top Bar: Accession, Data Source, Date */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-0.5 rounded-lg">
              {study.accession}
            </span>

            {/* Source Badge */}
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                isGeneLab
                  ? 'bg-purple-950/90 text-purple-300 border-purple-700/60'
                  : isAlsda
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
                  : isEsa
                  ? 'bg-blue-950/90 text-blue-300 border-blue-700/60'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isGeneLab ? 'GeneLab Omics' : isAlsda ? 'NASA ALSDA' : isEsa ? 'ESA Biology' : 'NASA OSDR'}
            </span>

            {study.dataSourceAccession && (
              <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                ({study.dataSourceAccession})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{study.publicReleaseDate || 'Curated'}</span>
          </div>
        </div>

        {/* Study Title */}
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-purple-200 transition-colors line-clamp-2 mb-2">
          {study.title}
        </h4>

        {/* Study Description */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {study.description}
        </p>
      </div>

      {/* Meta Specs Grid */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Rocket className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate" title={study.missionName}>
              {study.missionName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Dna className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate" title={study.organism.join(', ')}>
              {study.organism.join(', ')}
            </span>
          </div>
        </div>

        {/* Technology Platform / Assay Tag */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="truncate max-w-[240px] text-slate-400">
            {study.technologyPlatform || study.measurementType}
          </span>

          <span className="flex items-center gap-1 text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
            <span>Inspect</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
