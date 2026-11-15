import React from 'react';
import { ClippedButton } from './ClippedButton';
import { Rocket } from 'lucide-react';

interface MarsRoverNavbarProps {
  activeTab: 'home' | 'mission' | 'explore' | 'telemetry' | 'learn' | 'support';
  onSelectTab: (tab: 'home' | 'mission' | 'explore' | 'telemetry' | 'learn' | 'support') => void;
  onLaunchMission: () => void;
}

export const MarsRoverNavbar: React.FC<MarsRoverNavbarProps> = ({
  activeTab,
  onSelectTab,
  onLaunchMission,
}) => {
  return (
    <header id="mars-navbar" className="relative z-20 w-full px-5 pt-5 md:px-10 md:pt-6 lg:px-14">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        {/* Orbit Academy Brand Emblem */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 group cursor-pointer text-left"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#EE3F2C] text-sm font-bold text-white clip-corner transition-transform group-hover:scale-105 shadow-[0_0_12px_rgba(238,63,44,0.4)]"
            aria-hidden
          >
            OA
          </span>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white uppercase" data-editable>
              ORBIT ACADEMY
            </span>
            <span className="text-[9.5px] font-mono tracking-widest text-[#EE3F2C] uppercase font-semibold">
              MARS ROVER MISSION
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 lg:flex">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`text-sm font-medium transition cursor-pointer ${
              activeTab === 'home' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('mission')}
            className={`text-sm font-medium transition cursor-pointer ${
              activeTab === 'mission' ? 'text-[#EE3F2C] font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Rover Mission
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('explore')}
            className={`text-sm font-medium transition cursor-pointer ${
              activeTab === 'explore' ? 'text-[#EE3F2C] font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Explore Mars
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('telemetry')}
            className={`text-sm font-medium transition cursor-pointer ${
              activeTab === 'telemetry' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Mission Control
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('learn')}
            className={`text-sm font-medium transition cursor-pointer ${
              activeTab === 'learn' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Learn
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('support')}
            className={`text-sm font-medium transition cursor-pointer ${
              activeTab === 'support' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Contact / Support
          </button>
        </div>

        {/* Action Button: Launch Rover */}
        <ClippedButton
          onClick={onLaunchMission}
          className="!px-5 !py-2.5 text-xs uppercase tracking-wider font-bold"
        >
          <span className="flex items-center gap-1.5">
            <Rocket className="h-3.5 w-3.5" />
            <span>Launch Rover</span>
          </span>
        </ClippedButton>
      </nav>
    </header>
  );
};

export default MarsRoverNavbar;
