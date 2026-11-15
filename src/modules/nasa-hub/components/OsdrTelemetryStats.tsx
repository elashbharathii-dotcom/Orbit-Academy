import React from 'react';
import { NasaOsdrResearchStats } from '../../../services/nasa/types';
import {
  Dna,
  Database,
  Rocket,
  Activity,
  Layers,
  BarChart3,
} from 'lucide-react';

interface OsdrTelemetryStatsProps {
  stats: NasaOsdrResearchStats | null;
  selectedSource: 'all' | 'cgene' | 'alsda' | 'esa';
  onSelectSource: (src: 'all' | 'cgene' | 'alsda' | 'esa') => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const OsdrTelemetryStats: React.FC<OsdrTelemetryStatsProps> = ({
  stats,
  selectedSource,
  onSelectSource,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* 1. MASTER KPI METRIC BADGES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Searchable Studies */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Searchable Records
            </span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {stats.totalSearchableHits.toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            NASA OSDR ElasticSearch catalog
          </p>
        </div>

        {/* Curated Space Biology Studies */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Curated OSD Studies
            </span>
            <Dna className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {stats.totalCuratedStudies.toLocaleString()}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            OSDR Biological Data API v2.0
          </p>
        </div>

        {/* NASA GeneLab Omics */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              GeneLab Multi-Omics
            </span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {stats.geneLabCount} Studies
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            Spaceflight genomics & RNA-Seq
          </p>
        </div>

        {/* NASA ALSDA Animal Physiology */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
              ALSDA Life Sciences
            </span>
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {stats.alsdaCount} Studies
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            Ames Life Sciences Archive
          </p>
        </div>
      </div>

      {/* 2. DATA SOURCE DISTRIBUTION SELECTOR */}
      <div className="p-4 rounded-2xl bg-slate-950/85 border border-purple-500/20 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Space Biology Data Source Distribution
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click source to filter studies
          </span>
        </div>

        {/* Interactive Source Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onSelectSource('all')}
            className={`p-3 rounded-xl border text-left font-mono transition-all ${
              selectedSource === 'all'
                ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="text-[10px] block text-slate-400 uppercase">Universal OSDR</span>
            <strong className="text-sm block text-purple-200 mt-0.5">All Sources ({stats.totalCuratedStudies})</strong>
          </button>

          <button
            onClick={() => onSelectSource('cgene')}
            className={`p-3 rounded-xl border text-left font-mono transition-all ${
              selectedSource === 'cgene'
                ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="text-[10px] block text-purple-400 uppercase">GeneLab (cgene)</span>
            <strong className="text-sm block text-white mt-0.5">{stats.geneLabCount} Omics (65%)</strong>
          </button>

          <button
            onClick={() => onSelectSource('alsda')}
            className={`p-3 rounded-xl border text-left font-mono transition-all ${
              selectedSource === 'alsda'
                ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="text-[10px] block text-emerald-400 uppercase">NASA ALSDA</span>
            <strong className="text-sm block text-white mt-0.5">{stats.alsdaCount} Physiology (25%)</strong>
          </button>

          <button
            onClick={() => onSelectSource('esa')}
            className={`p-3 rounded-xl border text-left font-mono transition-all ${
              selectedSource === 'esa'
                ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="text-[10px] block text-blue-400 uppercase">ESA Spaceflight</span>
            <strong className="text-sm block text-white mt-0.5">{stats.esaCount} Biology (10%)</strong>
          </button>
        </div>
      </div>

      {/* 3. ORGANISM DISTRIBUTION & RESEARCH CATEGORIES DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Organisms Studied (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
            <Dna className="w-4 h-4" />
            Organisms Studied in Spaceflight
          </h4>
          <div className="space-y-2.5 pt-1">
            {stats.organismsDistribution.map((org, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 truncate pr-2">{org.organism}</span>
                  <span className="text-cyan-400 font-bold shrink-0">{org.percentage}% ({org.count})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${org.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Research Categories (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Spaceflight Biological Research Domains
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white font-bold shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              All Domains
            </button>
            {stats.categoriesDistribution.map((cat, i) => (
              <button
                key={i}
                onClick={() => onSelectCategory(cat.category)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                  selectedCategory === cat.category
                    ? 'bg-purple-600 text-white font-bold shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-purple-500/40 hover:text-white'
                }`}
              >
                {cat.category} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
