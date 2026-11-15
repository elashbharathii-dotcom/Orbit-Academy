import React, { useState, useEffect, useMemo } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { useNavigation } from '../../navigation/NavigationProvider';
import { ROUTES } from '../../navigation/routes';
import { osdrService } from '../../services/nasa/osdrService';
import {
  NasaOsdrResearchStats,
  NasaOsdrStudyMetadata,
  NasaOsdrSearchHit,
} from '../../services/nasa/types';
import { OsdrStudyCard } from './components/OsdrStudyCard';
import { StudyDetailModal } from './components/StudyDetailModal';
import { OsdrTelemetryStats } from './components/OsdrTelemetryStats';
import {
  Dna,
  Search,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  RotateCcw,
  Rocket,
  Globe2,
  Sun,
  Telescope,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const NasaResearchHubScreen: React.FC = () => {
  const { navigate } = useNavigation();

  // 1. Data States
  const [stats, setStats] = useState<NasaOsdrResearchStats | null>(null);
  const [studies, setStudies] = useState<NasaOsdrStudyMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStudy, setSelectedStudy] = useState<NasaOsdrStudyMetadata | null>(null);

  // 2. Filter & Search States
  const [selectedSource, setSelectedSource] = useState<'all' | 'cgene' | 'alsda' | 'esa'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrganism, setSelectedOrganism] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // 3. Sub-Domain Tab (Universal Hub)
  const [activeHubDomain, setActiveHubDomain] = useState<'osdr' | 'treks' | 'earth' | 'weather' | 'astronomy'>('osdr');

  // 4. Laura AI Voice Guide State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lauraTopic, setLauraTopic] = useState<string>('NASA Open Science Data Repository (OSDR)');
  const [lauraExplanation, setLauraExplanation] = useState<string>(
    'Welcome to the NASA Universal Scientific Data Hub! The Open Science Data Repository unites over 138,000 biological and spaceflight datasets from GeneLab, the Ames Life Sciences Data Archive, and international space agencies. Here, researchers analyze how microgravity and cosmic radiation alter genetics, bone density, and cellular aging to safeguard astronauts heading to Mars!'
  );

  // Load initial research statistics & fallback/curated studies
  useEffect(() => {
    setIsLoading(true);
    osdrService
      .getResearchStats()
      .then((res) => {
        setStats(res.data);
        setStudies(res.data.recentStudies || []);
      })
      .catch((err) => {
        console.error('Failed to load OSDR research stats:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Web Speech API Voice Narration
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskLaura = (topic: string, details: string) => {
    setLauraTopic(topic);
    setLauraExplanation(details);
    speakText(details);
  };

  // Filtered Studies computation
  const filteredStudies = useMemo(() => {
    return studies.filter((s) => {
      // 1. Source filter
      if (selectedSource !== 'all' && s.dataSourceType !== selectedSource) {
        return false;
      }

      // 2. Organism filter
      if (selectedOrganism !== 'all') {
        const matchesOrg = s.organism.some((org) =>
          org.toLowerCase().includes(selectedOrganism.toLowerCase())
        );
        if (!matchesOrg) return false;
      }

      // 3. Mission filter
      if (selectedMission !== 'all') {
        const matchesMission = s.flightProgram.toLowerCase().includes(selectedMission.toLowerCase()) ||
          s.missionName.toLowerCase().includes(selectedMission.toLowerCase());
        if (!matchesMission) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.accession.toLowerCase().includes(q) ||
          s.organism.some((o) => o.toLowerCase().includes(q)) ||
          s.missionName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [studies, selectedSource, selectedOrganism, selectedMission, searchQuery]);

  // Paginated Studies
  const totalPages = Math.max(1, Math.ceil(filteredStudies.length / pageSize));
  const paginatedStudies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudies.slice(start, start + pageSize);
  }, [filteredStudies, currentPage, pageSize]);

  // Execute Search query against backend if user searches
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    osdrService
      .search({
        term: searchQuery.trim(),
        type: selectedSource === 'cgene' || selectedSource === 'alsda' ? selectedSource : undefined,
        size: 12,
      })
      .then((res) => {
        const hits = res.data.hits || [];
        const mapped: NasaOsdrStudyMetadata[] = hits.map((h: NasaOsdrSearchHit) => ({
          accession: h.accession,
          title: h.title,
          description: h.description,
          spaceProgram: 'NASA',
          flightProgram: h.flightProgram,
          missionName: h.mission,
          managingNasaCenter: 'NASA Ames Research Center',
          organism: h.organism,
          dataSourceType: (h.dataSourceType === 'alsda' ? 'alsda' : h.dataSourceType === 'esa' ? 'esa' : 'cgene') as any,
          publicReleaseDate: 'Curated Release',
          measurementType: 'spaceflight multi-omics',
          technologyPlatform: 'NASA High-Throughput Assay',
          authoritativeSourceUrl: `https://osdr.nasa.gov/bio/repo/data/studies/${h.accession}`,
          factors: ['spaceflight: microgravity vs ground control'],
        }));
        setStudies(mapped);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error('Search failed:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResetFilters = () => {
    setSelectedSource('all');
    setSelectedCategory('all');
    setSelectedOrganism('all');
    setSelectedMission('all');
    setSearchQuery('');
    setCurrentPage(1);
    if (stats?.recentStudies) {
      setStudies(stats.recentStudies);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030611] font-sans text-slate-100 flex flex-col">
      {/* 1. MASTER HEADER */}
      <MasterHeader />

      {/* 2. UNIVERSAL NASA DOMAIN SELECTOR BAR */}
      <div className="sticky top-14 z-30 w-full border-b border-slate-800/80 bg-[#070C1B]/90 backdrop-blur-xl px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveHubDomain('osdr')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeHubDomain === 'osdr'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-purple-500/40 hover:text-white'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-purple-400" />
              1. NASA OSDR Space Biology
            </button>

            <button
              onClick={() => navigate(ROUTES.TREK_PREVIEW)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-cyan-500/40 hover:text-white transition-all"
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              2. Solar System Treks
            </button>

            <button
              onClick={() => navigate(ROUTES.CLIMATE)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-emerald-500/40 hover:text-white transition-all"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              3. Earthdata & GIBS
            </button>

            <button
              onClick={() => navigate(ROUTES.SPACE_WEATHER)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-amber-500/40 hover:text-white transition-all"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              4. DONKI Space Weather
            </button>

            <button
              onClick={() => navigate(ROUTES.DISCOVERY)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-indigo-500/40 hover:text-white transition-all"
            >
              <Telescope className="w-3.5 h-3.5 text-indigo-400" />
              5. Astronomy & Exoplanets
            </button>
          </div>

          {/* Quick API Key & Live Verification Pill */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/60 font-mono text-[10px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NASA OSDR API v2 CONNECTED</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* HERO TITLE & LAURA COMPANION INTERACTION DECK */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950/80 to-slate-950 border border-purple-500/25 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-purple-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>NASA Biological Data API & Open Science Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              NASA Universal Scientific Data Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Explore authentic space biology investigations across GeneLab, the Ames Life Sciences Data Archive (ALSDA), and ESA collaborative missions. Discover how microgravity and cosmic ray exposure affect human physiology, model organisms, and orbital agriculture.
            </p>
          </div>

          {/* Laura Guide Widget */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                  Laura AI Guide
                </span>
                <span className="text-xs font-medium text-slate-200 block truncate max-w-[180px]">
                  {lauraTopic}
                </span>
              </div>
            </div>

            <button
              onClick={() => speakText(lauraExplanation)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md shrink-0"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Mute Laura' : 'Voice Narrate'}</span>
            </button>
          </div>
        </div>

        {/* 4. MASTER KPI STATS & SOURCE DISTRIBUTION */}
        <OsdrTelemetryStats
          stats={stats}
          selectedSource={selectedSource}
          onSelectSource={(src) => {
            setSelectedSource(src);
            setCurrentPage(1);
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
        />

        {/* 5. SEARCH & FILTER CONTROLS DECK */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 138,419 NASA studies (e.g. radiation, telomere, liver, STS-135, Veggie)..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {/* Organism Filter */}
              <select
                value={selectedOrganism}
                onChange={(e) => {
                  setSelectedOrganism(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Organisms</option>
                <option value="Mus musculus">Mouse (Mus musculus)</option>
                <option value="Homo sapiens">Human (Homo sapiens)</option>
                <option value="Arabidopsis">Plant (Arabidopsis)</option>
                <option value="Drosophila">Fruit Fly (Drosophila)</option>
                <option value="elegans">Nematode (C. elegans)</option>
                <option value="Pseudomonas">Microbes (Bacteria)</option>
              </select>

              {/* Mission Filter */}
              <select
                value={selectedMission}
                onChange={(e) => {
                  setSelectedMission(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Missions</option>
                <option value="ISS">Space Station (ISS)</option>
                <option value="STS">Space Shuttle (STS)</option>
                <option value="SpaceX">SpaceX CRS</option>
                <option value="Bion">Bion-M1</option>
              </select>

              {/* Reset Filters */}
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset all filters"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <div>
              Showing <strong className="text-white">{filteredStudies.length}</strong> matching NASA space biology studies
              {searchQuery && (
                <span> for query "<strong className="text-purple-300">{searchQuery}</strong>"</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authentic NASA OSDR / GeneLab / ALSDA / ESA Datasets</span>
            </div>
          </div>
        </div>

        {/* 6. STUDY RESULTS GRID */}
        {isLoading ? (
          <div className="text-center py-20 font-mono text-xs text-purple-400 animate-pulse">
            Querying NASA OSDR Biological Data API v2.0...
          </div>
        ) : paginatedStudies.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
            <Dna className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No matching NASA studies found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or resetting filters to explore all 647 curated OSDR spaceflight studies.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedStudies.map((study) => (
              <OsdrStudyCard
                key={study.accession}
                study={study}
                onSelect={(s) => setSelectedStudy(s)}
              />
            ))}
          </div>
        )}

        {/* 7. PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="font-mono text-xs text-slate-400">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-bold transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* 8. STUDY DETAIL MODAL */}
      <StudyDetailModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
        onAskLaura={handleAskLaura}
      />
    </div>
  );
};
