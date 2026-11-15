import React, { useState, useMemo } from 'react';
import { COMPONENT_CATALOG } from '../buildData';
import { VehicleComponentDef } from '../types';
import {
  Compass,
  Flame,
  Wind,
  Shield,
  Box,
  Radio,
  Grid,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sun,
  Activity,
  Fuel,
  FlaskConical,
  Users,
  Rocket,
  CircleDot,
  Zap,
  Layers,
  Thermometer,
} from 'lucide-react';
import { workshopAudio } from '../audio/workshopAudio';

interface ComponentLibraryPanelProps {
  onAddComponent: (def: VehicleComponentDef) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type AerospaceSystemCategory =
  | 'all'
  | 'propulsion'
  | 'structural'
  | 'power'
  | 'thermal'
  | 'navigation'
  | 'science';

const SYSTEM_CATEGORIES: { id: AerospaceSystemCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'All Systems', icon: Box },
  { id: 'propulsion', label: 'Propulsion', icon: Flame },
  { id: 'structural', label: 'Structures', icon: Grid },
  { id: 'power', label: 'Power', icon: Sun },
  { id: 'thermal', label: 'Thermal', icon: Thermometer },
  { id: 'navigation', label: 'Nav & Comms', icon: Radio },
  { id: 'science', label: 'Scientific', icon: FlaskConical },
];

const COMPONENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  Radio,
  Zap,
  Flame,
  Wind,
  Sun,
  Shield,
  Activity,
  Box,
  Fuel,
  FlaskConical,
  Users,
  Rocket,
  CircleDot,
  Grid,
  Layers,
  Thermometer,
};

export const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
  onAddComponent,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeSystem, setActiveSystem] = useState<AerospaceSystemCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredComponents = useMemo(() => {
    return COMPONENT_CATALOG.filter((item) => {
      let matchCat = false;
      if (activeSystem === 'all') {
        matchCat = true;
      } else if (activeSystem === 'propulsion') {
        matchCat =
          item.category === 'engines' ||
          item.category === 'thrusters' ||
          item.category === 'fuel_tanks';
      } else if (activeSystem === 'structural') {
        matchCat =
          item.category === 'fuselage' ||
          item.category === 'wings' ||
          item.category === 'landing_legs' ||
          item.category === 'cargo_modules' ||
          item.category === 'decor';
      } else if (activeSystem === 'power') {
        matchCat = item.category === 'solar_panels' || item.id.startsWith('p-');
      } else if (activeSystem === 'thermal') {
        matchCat =
          item.id.includes('radiator') ||
          item.id.includes('thermal') ||
          item.id.includes('mli') ||
          item.category === 'utility';
      } else if (activeSystem === 'navigation') {
        matchCat =
          item.category === 'antennas' ||
          item.category === 'communication_equipment' ||
          item.category === 'cockpit' ||
          item.id.startsWith('n-');
      } else if (activeSystem === 'science') {
        matchCat = item.category === 'scientific_instruments' || item.id.startsWith('si-');
      }

      const matchQuery =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    });
  }, [activeSystem, searchQuery]);

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 bg-[#070C1B]/90 border border-white/10 rounded-2xl w-11 shrink-0 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => {
            onToggleCollapse();
            workshopAudio.playClick(1000);
          }}
          title="Expand Component Library"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#00E5FF] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="font-display text-[10px] uppercase tracking-widest text-[#00E5FF] rotate-90 mt-16 whitespace-nowrap font-bold">
          COMPONENT LIBRARY
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-[340px] sm:max-w-[360px] rounded-2xl border border-white/10 bg-[#070C1B]/90 p-3.5 backdrop-blur-xl shadow-2xl shrink-0 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-bold text-white tracking-wider uppercase">
            Component Library
          </span>
          <span className="rounded-full bg-[#00E5FF]/10 px-2 py-0.2 font-mono text-[10px] font-bold text-[#00E5FF] border border-[#00E5FF]/20">
            {filteredComponents.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            onToggleCollapse();
            workshopAudio.playClick(900);
          }}
          title="Collapse Panel"
          className="flex h-6 w-6 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
        <input
          type="text"
          placeholder="Search systems, engines, antennas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0B1226]/80 pl-8 pr-8 py-1.5 font-sans text-xs text-white placeholder-white/30 focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-white/5 px-1 py-0.5 font-mono text-[9px] text-white/40">
          ⌘F
        </span>
      </div>

      {/* 6 Core Aerospace System Categories */}
      <div className="flex flex-wrap gap-1">
        {SYSTEM_CATEGORIES.map((cat) => {
          const isActive = activeSystem === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveSystem(cat.id);
                workshopAudio.playClick(1200);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00E5FF] text-[#030611] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'bg-[#0B1226] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Component Cards Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
        <div className="grid grid-cols-3 gap-2">
          {filteredComponents.map((item) => {
            const Icon = COMPONENT_ICONS[item.iconName] || Box;

            return (
              <div
                key={item.id}
                onClick={() => {
                  onAddComponent(item);
                  workshopAudio.playAttach();
                }}
                title={`${item.name}\n${item.description}\nMass: ${item.mass} kg | Power: ${item.power} kW`}
                className="group relative flex flex-col items-center justify-between p-2 rounded-xl border border-white/10 bg-[#0B1226]/70 hover:border-[#00E5FF]/60 hover:bg-[#0E1E3D]/90 transition-all cursor-pointer shadow-sm active:scale-95 text-center"
              >
                {/* 3D-styled Icon Card Container */}
                <div className="flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#131F38] to-[#070C1B] border border-white/5 group-hover:border-[#00E5FF]/40 transition-colors shadow-inner">
                  <Icon className="h-6 w-6 text-[#00E5FF] group-hover:scale-110 transition-transform" />
                </div>

                {/* Component Name */}
                <span className="font-sans text-[10.5px] font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-tight mt-1.5 line-clamp-2">
                  {item.name}
                </span>

                {/* Subtitle Telemetry */}
                <span className="font-mono text-[9px] text-white/50 mt-0.5">
                  {(item.mass / 1000).toFixed(1)}t
                  {item.thrust ? ` • ${item.thrust}kN` : ''}
                </span>

                {/* Hover Add Badge */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00E5FF] text-[#030611] font-bold">
                    <Plus className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-white/50">
            <Search className="h-6 w-6 text-white/30 mb-2" />
            <span className="font-sans text-xs">No matching components found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentLibraryPanel;
