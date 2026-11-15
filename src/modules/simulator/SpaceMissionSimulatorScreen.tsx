import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  MissionDefinition,
  SpacecraftFlightState,
  FlightControls,
  CameraViewMode,
  LauraCommsMessage,
  MissionDebriefStats,
  SimulatorPersistence,
} from './types';
import { NASA_MISSIONS } from './simulatorData';
import { OrbitalPhysicsEngine } from './physics/orbitalPhysics';
import { flightAudio } from './audio/flightAudio';
import { useStudentProgress } from '../../services/studentProgressService';

// Components
import { MissionSelectionLobby } from './components/MissionSelectionLobby';
import { MissionEnvironment3D } from './components/MissionEnvironment3D';
import { FlightInstrumentsOverlay } from './components/FlightInstrumentsOverlay';
import { LauraMissionControlHUD } from './components/LauraMissionControlHUD';
import { FlightDebriefModal } from './components/FlightDebriefModal';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL Rendering Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#030611] text-cyan-400 p-8 text-center">
          <div className="p-6 rounded-2xl bg-[#070C1B]/90 border border-cyan-500/30 max-w-md shadow-2xl backdrop-blur-md">
            <h3 className="font-mono font-bold text-lg mb-2 text-white">Tactical Avionics HUD Active</h3>
            <p className="font-mono text-xs text-slate-300 leading-relaxed">
              Flight computer running in resilient telemetry mode. Full 6-DOF controls, NavBall attitude director, PFD instrument tapes, and Laura Flight Director guidance remain 100% active.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const STORAGE_KEY_RECORDS = 'orbit_academy_flight_simulator_records';

export const SpaceMissionSimulatorScreen: React.FC = () => {
  const { unlockAchievement, recordQuizResult } = useStudentProgress();

  // Root Navigation View
  const [activeView, setActiveView] = useState<'lobby' | 'simulation' | 'debrief'>('lobby');
  const [currentMission, setCurrentMission] = useState<MissionDefinition>(NASA_MISSIONS[0]);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('cockpit');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(flightAudio.isAudioMuted());

  // Persistence State
  const [persistence, setPersistence] = useState<SimulatorPersistence>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      completedMissionIds: [],
      missionBestStars: {},
      totalFlightTimeSeconds: 0,
      totalLandings: 0,
      totalDockings: 0,
      totalDeltaVExpendedMs: 0,
    };
  });

  // Flight Controls State
  const [flightControls, setFlightControls] = useState<FlightControls>({
    throttle: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    rcsX: 0,
    rcsY: 0,
    rcsZ: 0,
    sasActive: true,
    gearDeployed: false,
    solarDeployed: false,
    commsDeployed: true,
    engineIgnited: false,
  });

  // Active Flight Dynamics State
  const [flightState, setFlightState] = useState<SpacecraftFlightState>(() =>
    OrbitalPhysicsEngine.createInitialState(NASA_MISSIONS[0])
  );

  // Laura Flight Director Message State
  const [lauraMessage, setLauraMessage] = useState<LauraCommsMessage>({
    id: 'msg-initial',
    timestamp: 'MET 00:00:00',
    callsign: 'FLIGHT DIR // LAURA',
    message: 'Welcome to Mission Flight Deck. All telemetry channels verified green. Awaiting your throttle command.',
    tone: 'info',
  });

  // Debrief Statistics
  const [debriefStats, setDebriefStats] = useState<MissionDebriefStats | null>(null);

  // Animation Frame Loop Reference
  const lastTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  // Save persistence to localStorage
  const savePersistence = (next: SimulatorPersistence) => {
    setPersistence(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(next));
    }
  };

  // Launch a Mission from Lobby
  const handleLaunchMission = useCallback((mission: MissionDefinition) => {
    setCurrentMission(mission);
    const initial = OrbitalPhysicsEngine.createInitialState(mission);
    setFlightState(initial);
    setFlightControls({
      throttle: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      rcsX: 0,
      rcsY: 0,
      rcsZ: 0,
      sasActive: true,
      gearDeployed: false,
      solarDeployed: false,
      commsDeployed: true,
      engineIgnited: true,
    });
    setCameraMode('cockpit');
    setDebriefStats(null);
    lastTimeRef.current = Date.now();

    setLauraMessage({
      id: `launch-${Date.now()}`,
      timestamp: 'MET 00:00:00',
      callsign: 'FLIGHT DIR // LAURA',
      message: `Flight Director is Go for ${mission.title}. Target: ${mission.targetBody.toUpperCase()}. Objectives initialized.`,
      tone: 'info',
    });

    setActiveView('simulation');
  }, []);

  // Finalize / Debrief Mission Outcome
  const handleFinalizeMission = useCallback(
    (isSuccess: boolean, reason?: string) => {
      flightAudio.stopContinuousSounds();

      const elapsed = Math.max(1, flightState.elapsedSeconds);
      const fuelRemainingPct = Math.round((flightState.fuelKg / flightState.maxFuelKg) * 100);

      // Star Rating Computation
      let stars: 1 | 2 | 3 = 1;
      if (isSuccess) {
        if (flightState.deltaVExpendedMs <= currentMission.starCriteria.threeStars.maxDeltaVMs) {
          stars = 3;
        } else if (flightState.deltaVExpendedMs <= currentMission.starCriteria.twoStars.maxDeltaVMs) {
          stars = 2;
        }
      }

      // Calculate XP
      const baseReward = isSuccess ? currentMission.baseXpReward : 35;
      const efficiencyBonus = isSuccess ? stars * 25 : 0;
      const totalXp = baseReward + efficiencyBonus;

      // Unlocked Achievements
      const unlockedBadges: string[] = [];
      if (isSuccess) {
        if (currentMission.id === 'earth-orbit-insertion') unlockedBadges.push('orbital-aviator');
        if (currentMission.id === 'iss-rendezvous-docking') unlockedBadges.push('docking-master');
        if (currentMission.id === 'artemis-lunar-landing') unlockedBadges.push('lunar-lander');
        if (currentMission.id === 'mars-transfer-insertion') unlockedBadges.push('interplanetary-navigator');
        if (currentMission.id === 'mars-surface-landing') unlockedBadges.push('red-planet-pioneer');
        if (currentMission.id === 'voyager-deep-space' || currentMission.id === 'parker-solar-perihelion') {
          unlockedBadges.push('deep-space-pilot');
        }

        unlockedBadges.forEach((badge) => unlockAchievement(badge));

        // Record in student progress
        recordQuizResult({
          category: 'spacecraft-missions',
          questionsCount: 3,
          correctCount: stars,
          xpEarned: totalXp,
          streak: 1,
          isBlitz: false,
          destinationId: currentMission.targetBody,
          achievementIdsToAward: unlockedBadges,
        });
      }

      // Update Persistence
      const nextCompleted = isSuccess && !persistence.completedMissionIds.includes(currentMission.id)
        ? [...persistence.completedMissionIds, currentMission.id]
        : persistence.completedMissionIds;

      const prevBest = persistence.missionBestStars[currentMission.id] || 0;
      const nextBestStars = {
        ...persistence.missionBestStars,
        [currentMission.id]: Math.max(prevBest, isSuccess ? stars : 0),
      };

      savePersistence({
        completedMissionIds: nextCompleted,
        missionBestStars: nextBestStars,
        totalFlightTimeSeconds: persistence.totalFlightTimeSeconds + elapsed,
        totalLandings: persistence.totalLandings + (flightState.flightPhase === 'landed' ? 1 : 0),
        totalDockings: persistence.totalDockings + (flightState.flightPhase === 'docked' ? 1 : 0),
        totalDeltaVExpendedMs: persistence.totalDeltaVExpendedMs + flightState.deltaVExpendedMs,
      });

      const stats: MissionDebriefStats = {
        missionId: currentMission.id,
        missionTitle: currentMission.title,
        isSuccess,
        failureReason: reason,
        starRating: stars,
        elapsedSeconds: Math.round(elapsed),
        finalTouchdownSpeedMs: Math.abs(flightState.verticalSpeedMs),
        deltaVExpendedMs: flightState.deltaVExpendedMs,
        fuelRemainingPercent: fuelRemainingPct,
        scoreXp: totalXp,
        achievementsUnlocked: unlockedBadges,
      };

      setDebriefStats(stats);
      setActiveView('debrief');

      if (isSuccess) {
        flightAudio.playVictoryFanfare();
      } else {
        flightAudio.playMasterCaution();
      }
    },
    [flightState, currentMission, persistence, unlockAchievement, recordQuizResult]
  );

  // Real-time 60 FPS Physics Simulation Loop
  useEffect(() => {
    if (activeView !== 'simulation') {
      flightAudio.stopContinuousSounds();
      return;
    }

    const step = () => {
      const now = Date.now();
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      setFlightState((prev) => {
        const next = OrbitalPhysicsEngine.stepSimulation(prev, flightControls, currentMission, dt);

        // Continuous audio updates
        flightAudio.updateEngineSound(next.throttle, flightControls.engineIgnited);
        flightAudio.updateAtmosphericWind(next.dynamicPressureKPa);

        // Check for phase transitions (landed, docked, crashed)
        if (next.flightPhase === 'landed' && prev.flightPhase !== 'landed') {
          flightAudio.playTouchdownThump(true);
          setTimeout(() => handleFinalizeMission(true), 1200);
        } else if (next.flightPhase === 'docked' && prev.flightPhase !== 'docked') {
          flightAudio.playDockingCapture();
          setTimeout(() => handleFinalizeMission(true), 1200);
        } else if (next.flightPhase === 'crashed' && prev.flightPhase !== 'crashed') {
          flightAudio.playTouchdownThump(false);
          setTimeout(() => handleFinalizeMission(false, 'Excessive touchdown velocity / structural failure'), 1200);
        }

        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      flightAudio.stopContinuousSounds();
    };
  }, [activeView, flightControls, currentMission, handleFinalizeMission]);

  // Keyboard Flight Controls Listener
  useEffect(() => {
    if (activeView !== 'simulation') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();

      // Pitch: W / S
      if (key === 'w') {
        setFlightControls((c) => ({ ...c, pitch: -1 }));
      } else if (key === 's') {
        setFlightControls((c) => ({ ...c, pitch: 1 }));
      }
      // Yaw: A / D
      else if (key === 'a') {
        setFlightControls((c) => ({ ...c, yaw: -1 }));
      } else if (key === 'd') {
        setFlightControls((c) => ({ ...c, yaw: 1 }));
      }
      // Roll: Q / E
      else if (key === 'q') {
        setFlightControls((c) => ({ ...c, roll: -1 }));
      } else if (key === 'e') {
        setFlightControls((c) => ({ ...c, roll: 1 }));
      }
      // Throttle: Shift (up) / Control (down) / Z (full) / X (cutoff)
      else if (e.shiftKey) {
        setFlightControls((c) => ({ ...c, throttle: Math.min(1, c.throttle + 0.05) }));
      } else if (e.ctrlKey) {
        setFlightControls((c) => ({ ...c, throttle: Math.max(0, c.throttle - 0.05) }));
      } else if (key === 'z') {
        setFlightControls((c) => ({ ...c, throttle: 1, engineIgnited: true }));
      } else if (key === 'x') {
        setFlightControls((c) => ({ ...c, throttle: 0 }));
      }
      // Ignition: Space
      else if (key === ' ') {
        e.preventDefault();
        setFlightControls((c) => ({ ...c, engineIgnited: !c.engineIgnited }));
      }
      // Subsystems: T (SAS), G (Gear), P (Solar), C (Comms), V (Camera)
      else if (key === 't') {
        setFlightControls((c) => ({ ...c, sasActive: !c.sasActive }));
      } else if (key === 'g') {
        setFlightControls((c) => ({ ...c, gearDeploy: !c.gearDeployed, gearDeployed: !c.gearDeployed }));
      } else if (key === 'p') {
        setFlightControls((c) => ({ ...c, solarDeployed: !c.solarDeployed }));
      } else if (key === 'c') {
        setFlightControls((c) => ({ ...c, commsDeployed: !c.commsDeployed }));
      } else if (key === 'v') {
        setCameraMode((m) => (m === 'cockpit' ? 'chase' : m === 'chase' ? 'orbit-map' : 'cockpit'));
      }
      // RCS Translation: I / K / J / L
      else if (key === 'i') {
        flightAudio.playRcsBurst();
        setFlightControls((c) => ({ ...c, rcsY: 1 }));
      } else if (key === 'k') {
        flightAudio.playRcsBurst();
        setFlightControls((c) => ({ ...c, rcsY: -1 }));
      } else if (key === 'j') {
        flightAudio.playRcsBurst();
        setFlightControls((c) => ({ ...c, rcsX: -1 }));
      } else if (key === 'l') {
        flightAudio.playRcsBurst();
        setFlightControls((c) => ({ ...c, rcsX: 1 }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 's') {
        setFlightControls((c) => ({ ...c, pitch: 0 }));
      } else if (key === 'a' || key === 'd') {
        setFlightControls((c) => ({ ...c, yaw: 0 }));
      } else if (key === 'q' || key === 'e') {
        setFlightControls((c) => ({ ...c, roll: 0 }));
      } else if (key === 'i' || key === 'k') {
        setFlightControls((c) => ({ ...c, rcsY: 0 }));
      } else if (key === 'j' || key === 'l') {
        setFlightControls((c) => ({ ...c, rcsX: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeView]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#02040a] font-sans text-white overflow-hidden select-none">
      <MasterHeader />

      <main className="flex-1 relative w-full flex flex-col overflow-hidden">
        {/* ================================================================= */}
        {/* 1. MISSION SELECTION LOBBY VIEW                                   */}
        {/* ================================================================= */}
        {activeView === 'lobby' && (
          <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <MissionSelectionLobby
              completedMissionIds={persistence.completedMissionIds}
              missionBestStars={persistence.missionBestStars}
              totalFlightTimeSeconds={persistence.totalFlightTimeSeconds}
              totalLandings={persistence.totalLandings}
              totalDockings={persistence.totalDockings}
              isMuted={isAudioMuted}
              onToggleMute={() => {
                const next = flightAudio.toggleMute();
                setIsAudioMuted(next);
              }}
              onSelectAndLaunchMission={handleLaunchMission}
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. ACTIVE 3D SPACE FLIGHT SIMULATION VIEW                         */}
        {/* ================================================================= */}
        {activeView === 'simulation' && (
          <div className="relative w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden">
            {/* 3D WebGL Canvas Viewport */}
            <div className="absolute inset-0 z-0">
              <WebGLErrorBoundary>
                <Canvas
                  camera={{
                    position: cameraMode === 'cockpit' ? [0, 0, 0] : [0, 2.5, 9],
                    fov: cameraMode === 'cockpit' ? 72 : 55,
                    near: 0.1,
                    far: 2000,
                  }}
                  gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
                >
                  <MissionEnvironment3D
                    flightState={flightState}
                    flightControls={flightControls}
                    mission={currentMission}
                    cameraMode={cameraMode}
                  />
                </Canvas>
              </WebGLErrorBoundary>
            </div>

            {/* 2D Glass Cockpit & Flight Instruments Overlay */}
            <FlightInstrumentsOverlay
              flightState={flightState}
              flightControls={flightControls}
              mission={currentMission}
              cameraMode={cameraMode}
              onSetThrottle={(val) => setFlightControls((c) => ({ ...c, throttle: val, engineIgnited: val > 0 }))}
              onToggleIgnition={() => setFlightControls((c) => ({ ...c, engineIgnited: !c.engineIgnited }))}
              onToggleSas={() => setFlightControls((c) => ({ ...c, sasActive: !c.sasActive }))}
              onToggleGear={() => setFlightControls((c) => ({ ...c, gearDeployed: !c.gearDeployed }))}
              onToggleSolar={() => setFlightControls((c) => ({ ...c, solarDeployed: !c.solarDeployed }))}
              onToggleComms={() => setFlightControls((c) => ({ ...c, commsDeployed: !c.commsDeployed }))}
              onSetCameraMode={setCameraMode}
              onAbortMission={() => handleFinalizeMission(false, 'Flight manually aborted by Pilot In Command')}
            />

            {/* Laura Mission Flight Director HUD */}
            <LauraMissionControlHUD
              currentMessage={lauraMessage}
              flightState={flightState}
              mission={currentMission}
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. POST-FLIGHT DEBRIEF MODAL                                      */}
        {/* ================================================================= */}
        {activeView === 'debrief' && debriefStats && (
          <FlightDebriefModal
            stats={debriefStats}
            onRetry={() => handleLaunchMission(currentMission)}
            onNextMission={() => {
              const currentIdx = NASA_MISSIONS.findIndex((m) => m.id === currentMission.id);
              const nextIdx = (currentIdx + 1) % NASA_MISSIONS.length;
              handleLaunchMission(NASA_MISSIONS[nextIdx]);
            }}
            onReturnToLobby={() => setActiveView('lobby')}
          />
        )}
      </main>
    </div>
  );
};
