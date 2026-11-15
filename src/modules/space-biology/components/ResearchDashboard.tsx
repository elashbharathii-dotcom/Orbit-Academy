import React, { useState, useMemo } from 'react';
import {
  Search,
  Dna,
  Database,
  Rocket,
  Microscope,
  RotateCcw,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { NasaOsdrStudyMetadata } from '../../../services/nasa/types';
import { VERIFIED_OSDR_STUDIES } from '../biologyData';

interface ResearchDashboardProps {
  onSelectStudy: (study: NasaOsdrStudyMetadata) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({
  onSelectStudy,
  onNavigateToTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<string>('all');
  const [selectedAssay, setSelectedAssay] = useState<string>('all');

  const organismOptions = [
    { label: 'All Organisms', value: 'all' },
    { label: 'Human (Homo sapiens)', value: 'Homo sapiens' },
    { label: 'Rodent (Mus musculus)', value: 'Mus musculus' },
    { label: 'Plant (Arabidopsis)', value: 'Arabidopsis thaliana' },
    { label: 'Microbe (Bacillus)', value: 'Bacillus subtilis' },
    { label: 'Fruit Fly (Drosophila)', value: 'Drosophila melanogaster' },
  ];

  const domainOptions = [
    { label: 'All Repositories', value: 'all' },
    { label: 'NASA GeneLab (cgene)', value: 'cgene' },
    { label: 'NASA ALSDA', value: 'alsda' },
    { label: 'ESA Life Sciences', value: 'esa' },
  ];

  const missionOptions = [
    { label: 'All Missions', value: 'all' },
    { label: 'ISS Expeditions', value: 'ISS' },
    { label: 'STS Space Shuttle', value: 'STS' },
    { label: 'SpaceX CRS Resupply', value: 'SpaceX' },
    { label: 'Bion-M1 Biosatellite', value: 'Bion' },
  ];

  const assayOptions = [
    { label: 'All Assays', value: 'all' },
    { label: 'RNA-Seq / Transcriptomics', value: 'RNA-Seq' },
    { label: 'Proteomics / MS', value: 'Proteomics' },
    { label: 'Microbiome / WGS', value: 'WGS' },
    { label: 'Flow Cytometry', value: 'Cytometry' },
  ];

  const filteredStudies = useMemo(() => {
    return VERIFIED_OSDR_STUDIES.filter((study) => {
      // 1. Text Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
          study.accession.toLowerCase().includes(query) ||
          study.title.toLowerCase().includes(query) ||
          study.description.toLowerCase().includes(query) ||
          study.organism.some((org) => org.toLowerCase().includes(query)) ||
          (study.missionName && study.missionName.toLowerCase().includes(query)) ||
          (study.factors && study.factors.some((f) => f.toLowerCase().includes(query)));

        if (!matchesQuery) return false;
      }

      // 2. Organism Filter
      if (selectedOrganism !== 'all') {
        const matchesOrg = study.organism.some((org) =>
          org.toLowerCase().includes(selectedOrganism.toLowerCase())
        );
        if (!matchesOrg) return false;
      }

      // 3. Domain Filter
      if (selectedDomain !== 'all') {
        if (study.dataSourceType.toLowerCase() !== selectedDomain.toLowerCase()) {
          return false;
        }
      }

      // 4. Mission Filter
      if (selectedMission !== 'all') {
        const missionStr = (study.missionName || '') + ' ' + (study.flightProgram || '');
        if (!missionStr.toLowerCase().includes(selectedMission.toLowerCase())) {
          return false;
        }
      }

      // 5. Assay Filter
      if (selectedAssay !== 'all') {
        const assayStr =
          (study.measurementType || '') + ' ' + (study.technologyPlatform || '');
        if (!assayStr.toLowerCase().includes(selectedAssay.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedOrganism, selectedDomain, selectedMission, selectedAssay]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedOrganism('all');
    setSelectedDomain('all');
    setSelectedMission('all');
    setSelectedAssay('all');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedOrganism !== 'all' ||
    selectedDomain !== 'all' ||
    selectedMission !== 'all' ||
    selectedAssay !== 'all';

  return (
    <div className="space-y-6">
      {/* Telemetry Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0B1528] border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TOTAL OSDR STUDIES</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-2">647+</div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-omics & life sciences</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>GENELAB TRANSCRIPTOMICS</span>
            <Dna className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300 mt-2">492</div>
          <div className="text-[11px] text-slate-400 mt-1">RNA-seq, DNA microarrays</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>ALSDA PHYSIOLOGY</span>
            <Microscope className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-2">155</div>
          <div className="text-[11px] text-slate-400 mt-1">Ames Life Sciences Archive</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>ESA VERIFIED STUDIES</span>
            <Rocket className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-2">18</div>
          <div className="text-[11px] text-slate-400 mt-1">European Space Agency sync</div>
        </div>
      </div>

      {/* Quick Navigation Action Strip */}
      {onNavigateToTab && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#070C1B] border border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Research Modules:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab('visualizer_3d')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>3D Bio Structures</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('charts')}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Expression Charts</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('simulations')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Countermeasure Lab</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-[#070C1B] border border-white/10 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search NASA OSDR studies by accession (e.g. OSD-168), gene, organism, mission, tissue, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B1528] border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Organism Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Organism Model
            </label>
            <select
              value={selectedOrganism}
              onChange={(e) => setSelectedOrganism(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B1528] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {organismOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Repository Archive
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B1528] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {domainOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mission Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Mission / Flight Program
            </label>
            <select
              value={selectedMission}
              onChange={(e) => setSelectedMission(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B1528] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {missionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assay Platform */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Assay Technology
            </label>
            <select
              value={selectedAssay}
              onChange={(e) => setSelectedAssay(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B1528] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {assayOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="text-slate-400">
            Showing <span className="font-bold text-cyan-300">{filteredStudies.length}</span> verified OSDR spaceflight studies
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Studies Grid */}
      {filteredStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudies.map((study) => (
            <div
              key={study.accession}
              className="group p-5 rounded-2xl bg-[#070C1B] border border-white/10 hover:border-cyan-500/40 hover:bg-[#0B1528]/80 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {study.accession}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/10">
                      {study.dataSourceType.toUpperCase()}
                    </span>
                    {study.dataSourceAccession && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {study.dataSourceAccession}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {study.publicReleaseDate}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  {study.title}
                </h3>

                {/* Description Excerpt */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {study.description}
                </p>

                {/* Metadata Pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Microscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="italic">{study.organism.join(', ')}</span>
                  </div>

                  {study.flightProgram && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Rocket className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{study.flightProgram} • {study.missionName}</span>
                    </div>
                  )}

                  {study.measurementType && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{study.measurementType}</span>
                    </div>
                  )}
                </div>

                {/* Factor Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {study.factors.slice(0, 4).map((factor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-cyan-200 border border-cyan-500/10"
                    >
                      {factor}
                    </span>
                  ))}
                  {study.factors.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                      +{study.factors.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={() => onSelectStudy(study)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Inspect Study Details
                </button>

                <a
                  href={study.authoritativeSourceUrl || `https://osdr.nasa.gov/bio/repo/data/studies/${study.accession}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="View on Official NASA OSDR Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#070C1B] border border-white/10 space-y-3">
          <Info className="w-8 h-8 text-cyan-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No Studies Match the Current Filters</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords, organism category, or technology platform.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 border border-cyan-500/30 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
