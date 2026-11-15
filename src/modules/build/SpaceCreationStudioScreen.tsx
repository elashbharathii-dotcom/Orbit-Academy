import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { BuildCanvas3D } from './components/BuildCanvas3D';
import { TopEditorToolbar } from './components/TopEditorToolbar';
import { ComponentLibraryPanel } from './components/ComponentLibraryPanel';
import { ShipInspectorPanel } from './components/ShipInspectorPanel';
import { BottomShipyardDock } from './components/BottomShipyardDock';
import { BottomStatusFooter } from './components/BottomStatusFooter';
import { MissionReadinessModal } from './components/MissionReadinessModal';
import { BlueprintManagerModal } from './components/BlueprintManagerModal';
import { TestFlightModal } from './components/TestFlightModal';
import { ProgressionToast } from './components/ProgressionToast';
import {
  PRESET_BLUEPRINTS,
  LIVERY_OPTIONS,
  BUILDER_ACHIEVEMENTS,
} from './buildData';
import {
  VehicleComponentDef,
  AssembledComponent,
  LiveryOption,
  MaterialFinish,
  Blueprint,
  VehicleStats,
  BuilderAchievement,
  TransformMode,
  QualityPreset,
  ShadingMode,
  CameraProjection,
  CameraViewAngle,
  LightingEnvironmentMode,
  ShipClass,
} from './types';
import './aerospace-workshop.css';

const STORAGE_KEY_BLUEPRINTS = 'orbit_academy_blueprints_v2';
const STORAGE_KEY_PROGRESSION = 'orbit_academy_builder_progression';

export const SpaceCreationStudioScreen: React.FC = () => {
  // --------------------------------------------------------------------------
  // 1. Core Spacecraft Configuration State
  // --------------------------------------------------------------------------
  const initialBlueprint = PRESET_BLUEPRINTS[0]; // Starfire Explorer flagship
  const [shipName, setShipName] = useState<string>(initialBlueprint.name);
  const [shipClass, setShipClass] = useState<ShipClass>(initialBlueprint.shipClass || 'Explorer');
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(initialBlueprint.id);

  const [selectedLivery, setSelectedLivery] = useState<LiveryOption>(
    () => LIVERY_OPTIONS.find((l) => l.id === initialBlueprint.liveryId) || LIVERY_OPTIONS[0]
  );
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFinish>(
    initialBlueprint.materialFinish || 'titanium'
  );
  const [engineGlowColor, setEngineGlowColor] = useState<string>(
    initialBlueprint.engineGlowColor || '#00E5FF'
  );

  const [assembledParts, setAssembledParts] = useState<AssembledComponent[]>(
    () => initialBlueprint.components
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    () => initialBlueprint.components[0]?.instanceId || null
  );

  // --------------------------------------------------------------------------
  // 2. 3D Viewport & Studio Editing State
  // --------------------------------------------------------------------------
  const [transformMode, setTransformMode] = useState<TransformMode>('select');
  const [isSnapEnabled, setIsSnapEnabled] = useState<boolean>(true);
  const [qualityPreset] = useState<QualityPreset>('balanced');
  const [shadingMode, setShadingMode] = useState<ShadingMode>('lit');
  const [cameraProjection, setCameraProjection] = useState<CameraProjection>('perspective');
  const [cameraViewAngle, setCameraViewAngle] = useState<CameraViewAngle>('isometric');
  const [lightingEnvironmentMode, setLightingEnvironmentMode] = useState<LightingEnvironmentMode>('cleanroom');
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [showCenterOfMass, setShowCenterOfMass] = useState<boolean>(false);
  const [showCenterOfThrust, setShowCenterOfThrust] = useState<boolean>(false);
  const [showMeasurementCalipers, setShowMeasurementCalipers] = useState<boolean>(false);
  const [focusTrigger, setFocusTrigger] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // 3. UI Panels & Modals State
  // --------------------------------------------------------------------------
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1280;
  });
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1280;
  });
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState<boolean>(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState<boolean>(false);
  const [isTestFlightOpen, setIsTestFlightOpen] = useState<boolean>(false);
  const spacecraftRootGroupRef = useRef<any>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 1280) {
        setIsLeftPanelCollapsed(true);
        setIsRightPanelCollapsed(true);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const handleToggleLeftPanel = () => {
    const next = !isLeftPanelCollapsed;
    setIsLeftPanelCollapsed(next);
    if (!next && typeof window !== 'undefined' && window.innerWidth < 1280) {
      setIsRightPanelCollapsed(true);
    }
  };

  const handleToggleRightPanel = () => {
    const next = !isRightPanelCollapsed;
    setIsRightPanelCollapsed(next);
    if (!next && typeof window !== 'undefined' && window.innerWidth < 1280) {
      setIsLeftPanelCollapsed(true);
    }
  };

  // --------------------------------------------------------------------------
  // 4. Undo / Redo History Stack
  // --------------------------------------------------------------------------
  const [history, setHistory] = useState<AssembledComponent[][]>(() => [initialBlueprint.components]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushHistory = useCallback(
    (newParts: AssembledComponent[]) => {
      setHistory((prev) => {
        const nextSlice = prev.slice(0, historyIndex + 1);
        return [...nextSlice, newParts].slice(-30);
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      setAssembledParts(target);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      setAssembledParts(target);
    }
  }, [historyIndex, history]);

  // --------------------------------------------------------------------------
  // 5. Persistence State (Blueprints & Progression)
  // --------------------------------------------------------------------------
  const [savedBlueprints, setSavedBlueprints] = useState<Blueprint[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BLUEPRINTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESSION);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [activeToast, setActiveToast] = useState<BuilderAchievement | null>(null);

  const persistBlueprints = (bps: Blueprint[]) => {
    setSavedBlueprints(bps);
    try {
      localStorage.setItem(STORAGE_KEY_BLUEPRINTS, JSON.stringify(bps));
    } catch {}
  };

  const triggerUnlock = useCallback(
    (achievementId: string) => {
      if (unlockedAchievementIds.includes(achievementId)) return;
      const ach = BUILDER_ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!ach) return;

      const next = [...unlockedAchievementIds, achievementId];
      setUnlockedAchievementIds(next);
      setActiveToast(ach);
      try {
        localStorage.setItem(STORAGE_KEY_PROGRESSION, JSON.stringify(next));
      } catch {}
    },
    [unlockedAchievementIds]
  );

  // --------------------------------------------------------------------------
  // 6. AEROSPACE PHYSICS CALCULATIONS (Tsiolkovsky, TWR, Stability, Readiness)
  // --------------------------------------------------------------------------
  const vehicleStats: VehicleStats = useMemo(() => {
    const dryMass = assembledParts.reduce((acc, p) => acc + p.mass, 0);
    const propellantMass = assembledParts.reduce(
      (acc, p) => acc + p.propellantCapacity * p.propellantFill,
      0
    );
    const totalGrossMass = dryMass + propellantMass;

    const totalThrustKn = assembledParts.reduce((acc, p) => acc + (p.thrust || 0), 0);
    const weightKn = (totalGrossMass * 9.80665) / 1000;
    const twr = weightKn > 0 ? parseFloat((totalThrustKn / weightKn).toFixed(2)) : 0;

    // Specific impulse thrust-weighted average
    const engines = assembledParts.filter((p) => p.thrust > 0 && p.isp > 0);
    let weightedIsp = 0;
    if (engines.length > 0) {
      const thrustSum = engines.reduce((acc, e) => acc + e.thrust, 0);
      const ispSum = engines.reduce((acc, e) => acc + e.thrust * e.isp, 0);
      weightedIsp = Math.round(ispSum / thrustSum);
    }

    // Tsiolkovsky Rocket Equation: Î”v = Isp * g0 * ln(m_wet / m_dry)
    let deltaV = 0;
    if (weightedIsp > 0 && dryMass > 0 && totalGrossMass > dryMass) {
      deltaV = Math.round(weightedIsp * 9.80665 * Math.log(totalGrossMass / dryMass));
    }

    const netPowerKw = parseFloat(
      assembledParts.reduce((acc, p) => acc + (p.power || 0), 0).toFixed(1)
    );

    const hasEngine = assembledParts.some((p) => p.category === 'engines');
    const hasCockpit = assembledParts.some((p) => p.category === 'cockpit');

    const validationErrors: string[] = [];
    if (!hasCockpit) validationErrors.push('Missing forward command deck or cockpit module');
    if (!hasEngine) validationErrors.push('No propulsion systems installed');
    if (netPowerKw < 0) validationErrors.push('Electrical draw exceeds generation capacity');
    if (twr < 1.0 && totalThrustKn > 0) validationErrors.push('Thrust-to-weight ratio below 1.0 (sub-orbital)');

    // Stability Score calculation
    let stabilityScore = 88;
    if (!hasEngine) stabilityScore -= 30;
    if (!hasCockpit) stabilityScore -= 15;
    if (netPowerKw < 0) stabilityScore -= 10;
    if (twr < 1.0 && totalThrustKn > 0) stabilityScore -= 15;
    stabilityScore = Math.max(10, Math.min(100, stabilityScore));

    let missionReadiness = 99;
    if (validationErrors.length > 0) {
      missionReadiness = Math.max(20, 100 - validationErrors.length * 25);
    }
    const isFlightReady = validationErrors.length === 0 && (twr >= 1.0 || totalThrustKn === 0);

    // Dynamic length approximation from assembly bounds
    let maxZ = 0;
    let minZ = 0;
    assembledParts.forEach((p) => {
      const halfLen = (p.length || 2) / 2;
      maxZ = Math.max(maxZ, p.position[2] + halfLen);
      minZ = Math.min(minZ, p.position[2] - halfLen);
    });
    const totalLengthMeters = assembledParts.length > 0 ? parseFloat((maxZ - minZ).toFixed(1)) : 16.8;

    return {
      dryMass,
      propellantMass,
      totalGrossMass,
      totalThrustKn,
      weightKn,
      twr,
      weightedIsp,
      deltaV,
      netPowerKw,
      stabilityScore,
      missionReadiness,
      totalLengthMeters: totalLengthMeters || 16.8,
      isFlightReady,
      validationErrors,
    };
  }, [assembledParts]);

  // Check achievements dynamically
  useEffect(() => {
    if (vehicleStats.isFlightReady && vehicleStats.deltaV >= 9200) {
      triggerUnlock('ach-flight-ready');
    }
    if (vehicleStats.deltaV >= 16500) {
      triggerUnlock('ach-mars-capable');
    }
  }, [vehicleStats, triggerUnlock]);

  // --------------------------------------------------------------------------
  // 7. COMPONENT MANIPULATION & BLENDER ACTIONS
  // --------------------------------------------------------------------------
  const selectedComponent = useMemo(() => {
    return assembledParts.find((p) => p.instanceId === selectedComponentId) || null;
  }, [assembledParts, selectedComponentId]);

  const handleAddComponent = (def: VehicleComponentDef) => {
    let initialPos: [number, number, number] = [0, 0.8, 0];
    if (def.category === 'cockpit') initialPos = [0, 1.2, 3.2];
    else if (def.category === 'engines') initialPos = [0, 0.8, -4.5];
    else if (def.category === 'wings') initialPos = [2.6, 0.4, -0.6];
    else if (def.category === 'systems') initialPos = [0, 1.5, 0];
    else if (def.category === 'modules') initialPos = [0, 0.8, -1.5];
    else if (def.category === 'utility') initialPos = [1.8, 0.2, -2.5];
    else if (def.category === 'decor') initialPos = [0, 0.5, 1.0];

    const newComp: AssembledComponent = {
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      defId: def.id,
      name: def.name,
      category: def.category,
      mountSlot: def.mountSlot,
      mountSide: def.mountSlot === 'radial' ? 'both' : undefined,
      position: initialPos,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      mass: def.mass,
      propellantCapacity: def.propellant || 0,
      propellantFill: def.propellant ? 1.0 : 0,
      thrust: def.thrust || 0,
      isp: def.isp || 0,
      power: def.power,
      height: def.height,
      width: def.width,
      length: def.length || 2.0,
    };

    const next = [...assembledParts, newComp];
    setAssembledParts(next);
    setSelectedComponentId(newComp.instanceId);
    setTransformMode('translate');
    pushHistory(next);
    triggerUnlock('ach-first-assembly');
  };

  const handleUpdateComponentTransform = useCallback(
    (
      instanceId: string,
      position: [number, number, number],
      rotation: [number, number, number],
      scale: [number, number, number]
    ) => {
      setAssembledParts((prev) => {
        const next = prev.map((p) =>
          p.instanceId === instanceId
            ? { ...p, position, rotation, scale }
            : p
        );
        return next;
      });
    },
    []
  );

  const handleDuplicateComponent = useCallback(
    (instanceId: string) => {
      const comp = assembledParts.find((p) => p.instanceId === instanceId);
      if (!comp) return;

      const duplicated: AssembledComponent = {
        ...comp,
        instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: `${comp.name} Copy`,
        position: [comp.position[0] + 0.6, comp.position[1], comp.position[2] + 0.6],
      };

      const next = [...assembledParts, duplicated];
      setAssembledParts(next);
      setSelectedComponentId(duplicated.instanceId);
      pushHistory(next);
    },
    [assembledParts, pushHistory]
  );

  const handleDeleteComponent = useCallback(
    (instanceId: string) => {
      const next = assembledParts.filter((p) => p.instanceId !== instanceId);
      setAssembledParts(next);
      if (selectedComponentId === instanceId) {
        setSelectedComponentId(next[0]?.instanceId || null);
      }
      pushHistory(next);
    },
    [assembledParts, selectedComponentId, pushHistory]
  );

  const handleUpdatePropellantFill = (instanceId: string, fillRate: number) => {
    setAssembledParts((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, propellantFill: fillRate } : p))
    );
  };

  // --------------------------------------------------------------------------
  // 8. GLOBAL BLENDER KEYBOARD SHORTCUTS (W, E, R, Q, F, Delete, Ctrl+D, Ctrl+Z, Ctrl+Y)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z (without Shift)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedComponentId) {
          handleDuplicateComponent(selectedComponentId);
        }
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponentId) {
          e.preventDefault();
          handleDeleteComponent(selectedComponentId);
        }
        return;
      }

      // Blender transform modes
      const key = e.key.toLowerCase();
      if (key === 'w') {
        setTransformMode('translate');
      } else if (key === 'e') {
        setTransformMode('rotate');
      } else if (key === 'r') {
        setTransformMode('scale');
      } else if (key === 'q' || e.key === 'Escape') {
        setTransformMode('select');
      } else if (key === 'f') {
        setFocusTrigger((n) => n + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, handleUndo, handleRedo, handleDuplicateComponent, handleDeleteComponent]);

  // --------------------------------------------------------------------------
  // 9. SIMULATION & SNAPSHOT ACTIONS
  // --------------------------------------------------------------------------
  const handleToggleSimulation = () => {
    setIsSimulating((s) => {
      const next = !s;
      if (next && vehicleStats.totalThrustKn > 0) {
        triggerUnlock('ach-hotfire-test');
      }
      return next;
    });
  };

  const handleTakeSnapshot = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${shipName.toLowerCase().replace(/\s+/g, '-')}-blueprint.png`;
        link.href = dataUrl;
        link.click();
        triggerUnlock('ach-photo-capture');
      }
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // --------------------------------------------------------------------------
  // 10. BLUEPRINT MANAGEMENT & EXPORT
  // --------------------------------------------------------------------------
  const handleSelectBlueprint = (bp: Blueprint) => {
    setActiveBlueprintId(bp.id);
    setShipName(bp.name);
    setShipClass(bp.shipClass || 'Explorer');
    const liv = LIVERY_OPTIONS.find((l) => l.id === bp.liveryId) || LIVERY_OPTIONS[0];
    setSelectedLivery(liv);
    setSelectedMaterial(bp.materialFinish || 'titanium');
    if (bp.engineGlowColor) setEngineGlowColor(bp.engineGlowColor);
    setAssembledParts(bp.components);
    setSelectedComponentId(bp.components[0]?.instanceId || null);
    setIsSimulating(false);
    pushHistory(bp.components);
  };

  const handleNewDesign = () => {
    setActiveBlueprintId(null);
    setShipName('New Orbital Prototype');
    setShipClass('Explorer');
    setAssembledParts([]);
    setSelectedComponentId(null);
    setIsSimulating(false);
    pushHistory([]);
  };

  const handleSaveCurrentDesign = (name: string) => {
    const newBlueprint: Blueprint = {
      id: `bp-${Date.now()}`,
      name,
      shipClass,
      author: 'Orbit Academy Architect',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPreset: false,
      liveryId: selectedLivery.id,
      materialFinish: selectedMaterial,
      engineGlowColor,
      components: assembledParts,
    };

    persistBlueprints([newBlueprint, ...savedBlueprints]);
    triggerUnlock('ach-blueprint-saved');
  };

  const handleExportBlueprint = () => {
    const bp: Blueprint = {
      id: `bp-${Date.now()}`,
      name: shipName,
      shipClass,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPreset: false,
      author: 'Orbit Academy Architect',
      liveryId: selectedLivery.id,
      materialFinish: selectedMaterial,
      engineGlowColor,
      components: assembledParts,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bp, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${shipName.toLowerCase().replace(/\s+/g, '-')}.json`);
    dlAnchor.click();
    triggerUnlock('ach-blueprint-saved');
  };

  const handleExportGLB = async () => {
    if (!spacecraftRootGroupRef.current) {
      alert('Spacecraft 3D model is initializing. Please try again in a moment.');
      return;
    }
    try {
      const { GLTFExporter } = await import('three-stdlib');
      const exporter = new GLTFExporter();
      exporter.parse(
        spacecraftRootGroupRef.current,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${shipName.toLowerCase().replace(/\s+/g, '-')}.glb`;
          a.click();
          URL.revokeObjectURL(url);
          triggerUnlock('ach-blueprint-saved');
        },
        (error) => {
          console.error('GLTF export error:', error);
        },
        { binary: true }
      );
    } catch (err) {
      console.error('Failed to export GLB:', err);
    }
  };

  const handleDeleteBlueprint = (id: string) => {
    persistBlueprints(savedBlueprints.filter((b) => b.id !== id));
  };

  const handleRenameBlueprint = (id: string, newName: string) => {
    persistBlueprints(
      savedBlueprints.map((b) => (b.id === id ? { ...b, name: newName, updatedAt: Date.now() } : b))
    );
  };

  return (
    <div className="aerospace-workshop-root relative h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC] overflow-hidden select-none">
      {/* 1. Universal Master Header */}
      <div className="flex-none z-30">
        <MasterHeader />
      </div>

      {/* 2. Full-Bleed 3D Engineering Stage & Floating CAD HUD Consoles */}
      <div className="relative flex-1 w-full overflow-hidden min-h-0">
        {/* Realtime 3D Three.js Viewport (Full Stage) */}
        <div className="absolute inset-0 z-0">
          <BuildCanvas3D
            components={assembledParts}
            isSimulating={isSimulating}
            livery={selectedLivery}
            materialFinish={selectedMaterial}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            transformMode={transformMode}
            onTransformChange={handleUpdateComponentTransform}
            qualityPreset={qualityPreset}
            shadingMode={shadingMode}
            cameraProjection={cameraProjection}
            focusTrigger={focusTrigger}
            cameraViewAngle={cameraViewAngle}
            lightingEnvironmentMode={lightingEnvironmentMode}
            explodedFactor={explodedFactor}
            showCenterOfMass={showCenterOfMass}
            showCenterOfThrust={showCenterOfThrust}
            showMeasurementCalipers={showMeasurementCalipers}
            onRegisterSpacecraftGroup={(g) => {
              spacecraftRootGroupRef.current = g;
            }}
          />
        </div>

        {/* Floating Top Editor Toolbar */}
        <div className="absolute top-2 left-4 right-4 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-[1550px] mx-auto">
            <TopEditorToolbar
              shipName={shipName}
              onShipNameChange={setShipName}
              isMissionReady={vehicleStats.isFlightReady}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
              shadingMode={shadingMode}
              onShadingModeChange={setShadingMode}
              cameraProjection={cameraProjection}
              onCameraProjectionChange={setCameraProjection}
              cameraViewAngle={cameraViewAngle}
              onCameraViewAngleChange={setCameraViewAngle}
              lightingEnvironmentMode={lightingEnvironmentMode}
              onLightingEnvironmentModeChange={setLightingEnvironmentMode}
              showCenterOfMass={showCenterOfMass}
              onToggleCenterOfMass={() => setShowCenterOfMass((v) => !v)}
              showCenterOfThrust={showCenterOfThrust}
              onToggleCenterOfThrust={() => setShowCenterOfThrust((v) => !v)}
              showMeasurementCalipers={showMeasurementCalipers}
              onToggleMeasurementCalipers={() => setShowMeasurementCalipers((v) => !v)}
              onTakeSnapshot={handleTakeSnapshot}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              onTestFlight={() => setIsTestFlightOpen(true)}
              onExportGLB={handleExportGLB}
            />
          </div>
        </div>

        {/* Floating Left Panel: Component Library */}
        <div className="absolute left-3 top-16 bottom-20 z-20 pointer-events-auto flex">
          <ComponentLibraryPanel
            onAddComponent={handleAddComponent}
            isCollapsed={isLeftPanelCollapsed}
            onToggleCollapse={handleToggleLeftPanel}
          />
        </div>

        {/* Floating Right Panel: Ship Inspector */}
        <div className="absolute right-3 top-16 bottom-20 z-20 pointer-events-auto flex">
          <ShipInspectorPanel
            shipName={shipName}
            onShipNameChange={setShipName}
            shipClass={shipClass}
            onShipClassChange={setShipClass}
            stats={vehicleStats}
            selectedComponent={selectedComponent}
            onUpdateComponentTransform={handleUpdateComponentTransform}
            onUpdatePropellantFill={handleUpdatePropellantFill}
            onDuplicateComponent={handleDuplicateComponent}
            onDeleteComponent={handleDeleteComponent}
            allComponents={assembledParts}
            onSelectComponent={setSelectedComponentId}
            selectedLivery={selectedLivery}
            onSelectLivery={setSelectedLivery}
            selectedMaterial={selectedMaterial}
            onSelectMaterial={setSelectedMaterial}
            engineGlowColor={engineGlowColor}
            onEngineGlowColorChange={setEngineGlowColor}
            isCollapsed={isRightPanelCollapsed}
            onToggleCollapse={handleToggleRightPanel}
          />
        </div>

        {/* Floating Bottom Shipyard Dock */}
        <div className="absolute bottom-2 left-4 right-4 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-4xl mx-auto">
            <BottomShipyardDock
              blueprints={PRESET_BLUEPRINTS}
              activeBlueprintId={activeBlueprintId}
              onSelectBlueprint={handleSelectBlueprint}
              onNewDesign={handleNewDesign}
              transformMode={transformMode}
              onTransformModeChange={setTransformMode}
              isSnapEnabled={isSnapEnabled}
              onToggleSnap={() => setIsSnapEnabled(!isSnapEnabled)}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              onSaveBlueprint={() => setIsBlueprintModalOpen(true)}
              onExportBlueprint={handleExportBlueprint}
              explodedFactor={explodedFactor}
              onExplodedFactorChange={setExplodedFactor}
              stats={vehicleStats}
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Status Telemetry Footer (At Page Base) */}
      <div className="flex-none z-30">
        <BottomStatusFooter
          isBuildValid={vehicleStats.isFlightReady}
          validationMessage={
            vehicleStats.isFlightReady
              ? 'Build Ready • 100% Valid'
              : vehicleStats.validationErrors[0] || 'Build Needs Calibration'
          }
          triangleCount={245000}
          unlockedAchievementTitle="Shipwright"
          unlockedXpReward={250}
        />
      </div>

      {/* 3. Modals & Toast Overlays */}
      <TestFlightModal
        isOpen={isTestFlightOpen}
        onClose={() => setIsTestFlightOpen(false)}
        components={assembledParts}
        livery={selectedLivery}
        materialFinish={selectedMaterial}
        stats={vehicleStats}
        shipName={shipName}
      />

      <MissionReadinessModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        stats={vehicleStats}
        components={assembledParts}
      />

      <BlueprintManagerModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
        savedBlueprints={savedBlueprints}
        presetBlueprints={PRESET_BLUEPRINTS}
        onSaveCurrentDesign={handleSaveCurrentDesign}
        onLoadBlueprint={handleSelectBlueprint}
        onRenameBlueprint={handleRenameBlueprint}
        onDeleteBlueprint={handleDeleteBlueprint}
        currentVehicleName={shipName}
      />

      {activeToast && (
        <ProgressionToast
          achievement={activeToast}
          onDismiss={() => setActiveToast(null)}
        />
      )}
    </div>
  );
};

export default SpaceCreationStudioScreen;
