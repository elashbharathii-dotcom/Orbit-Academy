import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Navigation } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { MILKY_WAY_DATA } from '../../data/milkyWayData';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { CelestialId } from '../../types';

interface SearchItem {
  id: string;
  name: string;
  category: 'planet' | 'moon' | 'star' | 'galaxy';
  subtitle: string;
  parentPlanetId?: CelestialId;
  color: string;
}

export const CelestialSearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectPlanet, selectMoon, setActiveEnvironment } = useSolarSystem();

  // Aggregate all searchable items
  const allItems = useMemo<SearchItem[]>(() => {
    const list: SearchItem[] = [];

    // Milky Way
    list.push({
      id: 'milky-way-core',
      name: 'Milky Way (Sagittarius A*)',
      category: 'galaxy',
      subtitle: `${MILKY_WAY_DATA.centralBlackHole.massSolarMasses.toLocaleString()} M☉ Supermassive Core`,
      color: '#A855F7',
    });

    list.push({
      id: 'solar-neighborhood',
      name: 'Sun / Solar System',
      category: 'star',
      subtitle: 'Type G2V Yellow Dwarf // Orion Spur',
      parentPlanetId: 'sun',
      color: '#F59E0B',
    });

    // Planets & Moons
    for (const body of CELESTIAL_BODIES) {
      if (body.id !== 'sun') {
        list.push({
          id: body.id,
          name: body.name,
          category: 'planet',
          subtitle: `${body.physical.classification} // ${body.physical.realDistanceAU} AU`,
          parentPlanetId: body.id,
          color: body.visual.primaryColor,
        });

        if (body.visual.moons) {
          for (const moon of body.visual.moons) {
            list.push({
              id: moon.id,
              name: `${moon.name} (${body.name})`,
              category: 'moon',
              subtitle: `Satellite of ${body.name} // ⌀ ${moon.realDiameterKm}`,
              parentPlanetId: body.id,
              color: moon.primaryColor,
            });
          }
        }
      }
    }

    return list;
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) => item.name.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allItems, query]);

  const handleSelect = (item: SearchItem) => {
    if (item.category === 'galaxy') {
      setActiveEnvironment?.('milky-way');
      selectPlanet(null);
      selectMoon?.(null);
    } else if (item.category === 'star' || item.category === 'planet') {
      setActiveEnvironment?.('solar-system');
      selectPlanet(item.parentPlanetId || null);
      selectMoon?.(null);
    } else if (item.category === 'moon') {
      setActiveEnvironment?.('solar-system');
      if (item.parentPlanetId) {
        selectPlanet(item.parentPlanetId);
      }
      selectMoon?.(item.id);
    }
    setIsOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative pointer-events-auto" ref={dropdownRef}>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#94A3B8] glass-pill hover:border-[#38BDF8] hover:text-[#F8FAFC] transition-all"
          title="Search celestial bodies (Planets, Moons, Milky Way)"
        >
          <Search className="h-3 w-3 text-[#38BDF8]" />
          <span className="hidden sm:inline">FIND OBJECT</span>
          <span className="sm:hidden">SEARCH</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 glass-pill border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.25)] animate-fade-in w-56 sm:w-72">
          <Search className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search planets, moons, galaxy..."
            className="w-full bg-transparent text-xs font-mono text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
            className="text-[#94A3B8] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute right-0 top-9 z-50 w-72 sm:w-80 overflow-hidden rounded-xl border border-white/[0.12] bg-[#070C1B]/95 p-1.5 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-fade-in">
          <div className="px-2 py-1 text-[9px] font-mono uppercase text-[#64748B] tracking-wider">
            {query.trim() ? `Search Results (${filteredItems.length})` : 'Popular Destinations'}
          </div>

          <div className="space-y-0.5 mt-1 max-h-60 overflow-y-auto custom-scrollbar">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-white/[0.08] transition-colors group"
              >
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#38BDF8]">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] truncate">{item.subtitle}</div>
                  </div>
                </div>
                <Navigation className="h-3 w-3 text-[#64748B] opacity-0 group-hover:opacity-100 group-hover:text-[#38BDF8] shrink-0 ml-1.5 transition-all" />
              </button>
            ))}

            {filteredItems.length === 0 && (
              <div className="py-4 text-center font-mono text-xs text-[#64748B]">
                No celestial destinations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
