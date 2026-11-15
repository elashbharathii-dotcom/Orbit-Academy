import React, { useState, useMemo } from 'react';
import { COMPONENT_CATALOG } from '../buildData';
import { ComponentCategory, VehicleComponentDef } from '../types';
import {
  Compass,
  Layers,
  Flame,
  Wind,
  Rocket,
  Sun,
  Radio,
  Plus,
  Search,
  Zap,
  Weight,
  Gauge,
  Sliders,
} from 'lucide-react';

interface ComponentCatalogPanelProps {
  onAddComponent: (def: VehicleComponentDef) => void;
}

const CATEGORY_META: Record<
  ComponentCategory | 'all',
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  all: { label: 'All Modules', icon: Sliders },
  fuselage: { label: 'Fuselage', icon: Layers },
  cockpit: { label: 'Cockpits', icon: Compass },
  engines: { label: 'Engines', icon: Flame },
  thrusters: { label: 'Thrusters', icon: Zap },
  wings: { label: 'Wings / Fins', icon: Wind },
  solar_panels: { label: 'Solar Arrays', icon: Sun },
  antennas: { label: 'Antennas', icon: Radio },
  landing_legs: { label: 'Landing Gear', icon: Weight },
  fuel_tanks: { label: 'Fuel Tanks', icon: Gauge },
  cargo_modules: { label: 'Cargo Modules', icon: Layers },
  scientific_instruments: { label: 'Instruments', icon: Compass },
  communication_equipment: { label: 'Comms', icon: Radio },
  systems: { label: 'Systems', icon: Sun },
  modules: { label: 'Modules', icon: Layers },
  utility: { label: 'Utility / Comms', icon: Radio },
  decor: { label: 'Decor / Accent', icon: Rocket },
};

export const ComponentCatalogPanel: React.FC<ComponentCatalogPanelProps> = ({
  onAddComponent,
}) => {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return COMPONENT_CATALOG.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header and Search */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-[#38BDF8]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Component Library
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            {filteredItems.length} Available
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search aerospace parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#070C1B]/90 pl-8 pr-3 py-1.5 font-sans text-xs text-white placeholder-[#64748B] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CATEGORY_META) as (ComponentCategory | 'all')[]).map((catKey) => {
            const meta = CATEGORY_META[catKey];
            const Icon = meta.icon;
            const isActive = activeCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategory(catKey)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] transition-all capitalize ${
                  isActive
                    ? 'border border-[#38BDF8] bg-[#38BDF8]/20 text-[#38BDF8] font-bold shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                    : 'border border-white/5 bg-[#0B1226]/70 text-[#94A3B8] hover:text-white hover:border-white/15'
                }`}
              >
                <Icon className="h-2.5 w-2.5" />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Component Grid / List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px] scrollbar-thin">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#070C1B]/85 p-3 transition-all hover:border-[#38BDF8]/40 hover:bg-[#0E172F]/90"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-sans text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                  {item.name}
                </span>
                <p className="mt-1 font-sans text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Quick Add Button */}
              <button
                type="button"
                onClick={() => onAddComponent(item)}
                title={`Mount ${item.name} to spacecraft`}
                data-testid={`add-part-${item.id}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8] transition-all hover:bg-[#38BDF8] hover:text-[#030611] hover:scale-105 active:scale-95 shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Micro Telemetry Specs Row */}
            <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-2 font-mono text-[10px] text-[#94A3B8]">
              {/* Mass */}
              <span className="flex items-center gap-1 text-[#CBD5E1]">
                <Weight className="h-2.5 w-2.5 text-[#38BDF8]" />
                <span>{item.mass.toLocaleString()} kg</span>
              </span>

              {/* Propellant */}
              {item.propellant ? (
                <span className="flex items-center gap-1 text-[#38BDF8]">
                  <span>Fuel:</span>
                  <span className="font-bold">{item.propellant.toLocaleString()} kg</span>
                </span>
              ) : null}

              {/* Thrust */}
              {item.thrust ? (
                <span className="flex items-center gap-1 text-[#F59E0B]">
                  <Flame className="h-2.5 w-2.5" />
                  <span className="font-bold">{item.thrust.toLocaleString()} kN</span>
                </span>
              ) : null}

              {/* Isp */}
              {item.isp ? (
                <span className="flex items-center gap-1 text-[#A78BFA]">
                  <Gauge className="h-2.5 w-2.5" />
                  <span>Isp: {item.isp}s</span>
                </span>
              ) : null}

              {/* Power */}
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  item.power > 0
                    ? 'text-[#34D399]'
                    : item.power < 0
                    ? 'text-amber-400'
                    : 'text-[#94A3B8]'
                }`}
              >
                <Zap className="h-2.5 w-2.5" />
                <span>{item.power > 0 ? `+${item.power}` : item.power} kW</span>
              </span>

              {/* Mount Slot Tag */}
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#64748B]">
                {item.mountSlot}
              </span>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#94A3B8]">
            <Search className="h-8 w-8 text-[#64748B] mb-2" />
            <p className="font-sans text-xs">No aerospace components matched your search filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
