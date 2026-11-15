import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Play,
  RotateCcw,
  SlidersHorizontal,
  FolderOpen,
  Info,
  LogOut,
  Volume2,
  VolumeX,
  Compass,
  Save,
  X,
} from 'lucide-react';
import { audioSystem } from '../../systems/audioSynthesizer';

interface MainMenuModalProps {
  onReturnToBriefing?: () => void;
  onStartNewCampaign: () => void;
}

export const MainMenuModal: React.FC<MainMenuModalProps> = ({
  onReturnToBriefing,
  onStartNewCampaign,
}) => {
  const isMainMenuOpen = useMarsGameStore((state) => state.isMainMenuOpen);
  const closeMainMenu = useMarsGameStore((state) => state.closeMainMenu);
  const settings = useMarsGameStore((state) => state.settings);
  const updateSettings = useMarsGameStore((state) => state.updateSettings);
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const campaignChapter = useMarsGameStore((state) => state.campaignChapter);
  const saveToSlot = useMarsGameStore((state) => state.saveToSlot);
  const loadFromSlot = useMarsGameStore((state) => state.loadFromSlot);
  const getSaveSlotsInfo = useMarsGameStore((state) => state.getSaveSlotsInfo);

  const [activeSubView, setActiveSubView] = useState<'main' | 'slots' | 'settings' | 'credits'>('main');
  const [showConfirmNew, setShowConfirmNew] = useState<boolean>(false);
  const [saveSlotFeedback, setSaveSlotFeedback] = useState<string | null>(null);

  if (!isMainMenuOpen) return null;

  const slotsInfo = getSaveSlotsInfo();
  const hasExistingSave = slotsInfo[1]?.exists || false;

  const handleContinue = () => {
    audioSystem.playChime(1100);
    closeMainMenu();
  };

  const handleConfirmNewGame = () => {
    audioSystem.playChapterFanfare();
    setShowConfirmNew(false);
    onStartNewCampaign();
  };

  const handleSaveSlot = (slot: number) => {
    const res = saveToSlot(slot);
    audioSystem.playChime(1200);
    setSaveSlotFeedback(res.message);
    setTimeout(() => setSaveSlotFeedback(null), 3000);
  };

  const handleLoadSlot = (slot: number) => {
    const res = loadFromSlot(slot);
    if (res.success) {
      audioSystem.playChime(1100);
      setSaveSlotFeedback(`Loaded Slot ${slot} successfully!`);
      setTimeout(() => {
        setSaveSlotFeedback(null);
        closeMainMenu();
      }, 800);
    } else {
      audioSystem.playAlarm();
      setSaveSlotFeedback(res.message);
      setTimeout(() => setSaveSlotFeedback(null), 3000);
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in font-mono select-none">
      <div className="relative flex flex-col justify-between h-[85vh] max-h-[720px] w-full max-w-4xl overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-b from-[#160B0B] via-[#090D1A] to-[#04060C] p-6 sm:p-10 shadow-[0_0_90px_rgba(239,68,68,0.3)]">
        {/* Top Header Branding */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl border border-red-500/30 bg-red-950/60 text-red-400">
              <Compass className="h-6 w-6 animate-spin [animation-duration:16s]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-extrabold">
                  ORBIT ACADEMY SIMULATION LABS
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                  RELEASE v1.2.0
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white">
                MARS: LAST FRONTIER
              </h1>
            </div>
          </div>

          {activeSubView !== 'main' && (
            <button
              onClick={() => setActiveSubView('main')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>MAIN MENU</span>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dynamic Center Views */}
        <div className="my-auto py-4 overflow-y-auto max-h-[500px]">
          {activeSubView === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Column: Menu Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleContinue}
                  disabled={!hasExistingSave}
                  className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    hasExistingSave
                      ? 'border-red-500/50 bg-red-950/40 hover:bg-red-900/50 hover:scale-[1.02] shadow-[0_0_25px_rgba(239,68,68,0.3)]'
                      : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-red-400 fill-current group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-sm font-black text-white block">
                        CONTINUE EXPEDITION
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {hasExistingSave
                          ? `Resume Sol ${solCycle.solNumber} • Chapter ${campaignChapter}`
                          : 'No saved mission found'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-red-300 font-bold">ENTER</span>
                </button>

                <button
                  onClick={() => setShowConfirmNew(true)}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0C1222]/80 p-4 text-left hover:border-cyan-500/40 hover:bg-[#10172C] transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-cyan-400" />
                    <div>
                      <span className="text-sm font-black text-white block">
                        NEW EXPEDITION
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Touch down at Sol 1 after the Jezero squall
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-300 font-bold">START</span>
                </button>

                <button
                  onClick={() => setActiveSubView('slots')}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0C1222]/80 p-4 text-left hover:border-amber-500/40 hover:bg-[#10172C] transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-amber-400" />
                    <div>
                      <span className="text-sm font-black text-white block">
                        SAVE & LOAD ARCHIVE
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Manage 3 local telemetry slots
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-300 font-bold">ARCHIVE</span>
                </button>

                <button
                  onClick={() => setActiveSubView('settings')}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0C1222]/80 p-4 text-left hover:border-purple-500/40 hover:bg-[#10172C] transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5 text-purple-400" />
                    <div>
                      <span className="text-sm font-black text-white block">
                        SETTINGS & CALIBRATION
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Audio levels, graphics quality, and controls
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-purple-300 font-bold">CONFIG</span>
                </button>

                <button
                  onClick={() => setActiveSubView('credits')}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0C1222]/80 p-4 text-left hover:border-white/20 hover:bg-[#10172C] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-slate-400" />
                    <div>
                      <span className="text-sm font-black text-white block">
                        EXPEDITION CREDITS
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Orbit Academy team & NASA acknowledgements
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">CREDITS</span>
                </button>
              </div>

              {/* Right Column: Narrative Mission Overview */}
              <div className="hidden md:flex flex-col justify-between h-full rounded-2xl border border-white/10 bg-black/40 p-6 space-y-4">
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 mb-2">
                    OUTPOST ALPHA TELEMETRY STATUS
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    JEZERO PALEOLAKE BASIN
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    A severe synoptic dust storm severed communication with Earth. As the sole active specialist on the surface, your directives are to restore habitat life support, generate solar power, drive the 6-wheel rocker-bogie rover, cultivate aeroponic crops, and uncover the ancient prebiotic secrets of Mars.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">SURFACE GRAVITY</span>
                    <span className="font-extrabold text-amber-400">0.38g Kinematics</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">TERRAIN EXPANSE</span>
                    <span className="font-extrabold text-cyan-400">360m Procedural</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subview 2: Save & Load Archive Slots */}
          {activeSubView === 'slots' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-xs text-slate-300 mb-2">
                Manage your expedition save state across three local telemetry slots. Autosave updates automatically in Slot 1.
              </div>

              {saveSlotFeedback && (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-xs text-emerald-300 font-bold text-center animate-fade-in">
                  {saveSlotFeedback}
                </div>
              )}

              {[1, 2, 3].map((slotNum) => {
                const info = slotsInfo[slotNum];
                return (
                  <div
                    key={slotNum}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          SLOT {slotNum} {slotNum === 1 && '(PRIMARY / AUTOSAVE)'}
                        </span>
                        {info?.exists ? (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                            VALID SAVE
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            EMPTY SLOT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {info?.exists
                          ? `Sol ${info.sol} • Chapter ${info.chapter} • ${info.timestamp || 'Recorded'}`
                          : 'No mission data recorded in this slot'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleSaveSlot(slotNum)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>SAVE</span>
                      </button>

                      <button
                        onClick={() => handleLoadSlot(slotNum)}
                        disabled={!info?.exists}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                          info?.exists
                            ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25'
                            : 'border-white/5 bg-white/5 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        <span>LOAD</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subview 3: Settings & Calibration */}
          {activeSubView === 'settings' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <h3 className="text-sm font-extrabold text-white border-b border-white/10 pb-2">
                AUDIO & SYNTHESIZER CALIBRATION
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Audio Synthesizer</span>
                  <button
                    onClick={() => {
                      updateSettings({ soundEnabled: !settings.soundEnabled });
                      audioSystem.setMuted(!settings.soundEnabled);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold ${
                      settings.soundEnabled
                        ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                        : 'border-red-500/40 bg-red-950/60 text-red-300'
                    }`}
                  >
                    {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <span>{settings.soundEnabled ? 'ENABLED' : 'MUTED'}</span>
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Master Volume</span>
                    <span>{Math.round((settings.masterVolume ?? 1.0) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.masterVolume ?? 1.0}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      updateSettings({ masterVolume: v });
                      audioSystem.setMasterVolume(v);
                    }}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Sound Effects & Servos</span>
                    <span>{Math.round((settings.effectsVolume ?? 0.9) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.effectsVolume ?? 0.9}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      updateSettings({ effectsVolume: v });
                      audioSystem.setEffectsVolume(v);
                    }}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-white border-b border-white/10 pb-2 pt-2">
                GRAPHICS PRESET (PERFORMANCE PROFILING)
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((q) => {
                  const isCurrent = (settings.graphicsQuality ?? 'high') === q;
                  return (
                    <button
                      key={q}
                      onClick={() => {
                        audioSystem.playChime(1000);
                        updateSettings({ graphicsQuality: q });
                      }}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-red-500 bg-red-950/50 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                          : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs uppercase block">{q}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {q === 'low' ? '512 Shadow / 50 Particles' : q === 'medium' ? '1024 Shadow / 100 Particles' : '2048 Shadow / 200 Particles'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subview 4: Expedition Credits */}
          {activeSubView === 'credits' && (
            <div className="space-y-4 max-w-xl mx-auto text-center text-xs text-slate-300">
              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-3">
                <h3 className="text-base font-extrabold text-white">MARS: LAST FRONTIER</h3>
                <p className="text-slate-400">
                  Developed for the Orbit Academy Educational Space Ecosystem.
                </p>

                <div className="pt-2 border-t border-white/10 text-left space-y-2">
                  <div>
                    <span className="text-[10px] text-red-400 font-bold block uppercase">3D Game Architecture & Simulation</span>
                    <span className="text-white">Senior Systems & 3D WebGL Engineering Team</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold block uppercase">AI Robotics & Autonomous Agents</span>
                    <span className="text-white">DeepMind Autonomous Agent Architecture</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold block uppercase">Planetary & Geological Reference</span>
                    <span className="text-white">NASA JPL Mars 2020 Jezero Crater Science Mission</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal: Start New Game */}
        {showConfirmNew && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="max-w-md w-full rounded-2xl border border-red-500/50 bg-[#0B0F1C] p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold text-white">START NEW EXPEDITION?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Starting a fresh Sol 1 campaign resets mission progress and survival vitals to fresh touchdown state. Are you sure you wish to initiate a new expedition?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmNew(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/10"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmNewGame}
                  className="px-4 py-1.5 rounded-xl bg-red-600 text-xs font-extrabold text-white hover:bg-red-500 shadow-lg shadow-red-600/30"
                >
                  CONFIRM NEW EXPEDITION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-500">
          <span>Outpost Alpha Telemetry • Jezero Crater [-18.38°N, 77.58°E]</span>

          {onReturnToBriefing && (
            <button
              onClick={onReturnToBriefing}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors font-bold"
            >
              <LogOut className="h-4 w-4" />
              <span>RETURN TO ACADEMY HUB</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
