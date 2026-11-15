import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  StorageContainerType,
  ResourceType,
  RESOURCE_DEFINITIONS,
} from '../../types/survivalTypes';
import {
  PRESET_ROVER_DESTINATIONS,
  RobotMode,
} from '../../types/aiTypes';
import {
  Cpu,
  Bot,
  Truck,
  AlertTriangle,
  CheckCircle2,
  X,
  Play,
  Square,
  ArrowRight,
  BatteryCharging,
  Zap,
  Activity,
  Compass,
  Layers,
  ShieldCheck,
  Radio,
} from 'lucide-react';

type TabType = 'overview' | 'rover' | 'robot' | 'logistics' | 'alerts';

export const IntelligentBaseModal: React.FC = () => {
  const isOpen = useMarsGameStore((state) => state.isIntelligentBaseModalOpen);
  const close = useMarsGameStore((state) => state.closeIntelligentBaseModal);

  // Store state selectors
  const powerGrid = useMarsGameStore((state) => state.powerGrid);
  const solCycle = useMarsGameStore((state) => state.solCycle);
  const vitals = useMarsGameStore((state) => state.vitals);
  const roverTelemetry = useMarsGameStore((state) => state.roverTelemetry);
  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const roverAIMode = useMarsGameStore((state) => state.roverAIMode);
  const roverNavPlan = useMarsGameStore((state) => state.roverNavPlan);
  const robotState = useMarsGameStore((state) => state.robotState);
  const transportTasks = useMarsGameStore((state) => state.transportTasks);
  const baseRecommendations = useMarsGameStore((state) => state.baseRecommendations);
  const baseAlerts = useMarsGameStore((state) => state.baseAlerts);
  const facilityRenovations = useMarsGameStore((state) => state.facilityRenovations);
  const inventory = useMarsGameStore((state) => state.inventory);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const roverStorage = useMarsGameStore((state) => state.roverStorage);

  // Store actions
  const setRoverDestination = useMarsGameStore((state) => state.setRoverDestination);
  const cancelRoverAutonomous = useMarsGameStore((state) => state.cancelRoverAutonomous);
  const setRobotMode = useMarsGameStore((state) => state.setRobotMode);
  const assignTransportTask = useMarsGameStore((state) => state.assignTransportTask);
  const cancelTransportTask = useMarsGameStore((state) => state.cancelTransportTask);
  const executeAIAction = useMarsGameStore((state) => state.executeAIAction);
  const acknowledgeAIRecommendation = useMarsGameStore((state) => state.acknowledgeAIRecommendation);

  // Local UI state
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedDestId, setSelectedDestId] = useState<string>('dest_base_garage');

  // Logistics form state
  const [taskSource, setTaskSource] = useState<StorageContainerType>('vault');
  const [taskDest, setTaskDest] = useState<StorageContainerType>('rover');
  const [taskResource, setTaskResource] = useState<ResourceType>('scrap_metal');
  const [taskCount, setTaskCount] = useState<number>(2);

  if (!isOpen) return null;

  // Calculate Base Overall Health Score (0 - 100%)
  const powerRatio = Math.min(1.0, powerGrid.batteryStorageKWh / 50.0);
  const vitalsRatio = (vitals.health + vitals.oxygen + vitals.power) / 300.0;
  const suitRatio = vitals.suitIntegrity / 100.0;
  const gridActiveRatio = powerGrid.isBlackout ? 0.2 : 1.0;
  const healthScore = Math.round((powerRatio * 0.35 + vitalsRatio * 0.35 + suitRatio * 0.15 + gridActiveRatio * 0.15) * 100);

  // Available resources at selected source container
  const getSourceResources = (source: StorageContainerType): { type: ResourceType; count: number }[] => {
    const list: { type: ResourceType; count: number }[] = [];
    if (source === 'backpack') {
      for (const k of Object.keys(inventory) as ResourceType[]) {
        if (inventory[k] && inventory[k].count > 0) list.push({ type: k, count: inventory[k].count });
      }
    } else if (source === 'vault') {
      for (const k of Object.keys(vaultStorage) as ResourceType[]) {
        if (vaultStorage[k] && vaultStorage[k] > 0) list.push({ type: k, count: vaultStorage[k] });
      }
    } else if (source === 'rover') {
      for (const k of Object.keys(roverStorage) as ResourceType[]) {
        if (roverStorage[k] && roverStorage[k] > 0) list.push({ type: k, count: roverStorage[k] });
      }
    }
    return list;
  };

  const availableSourceResources = getSourceResources(taskSource);

  // Handler for dispatching transport task
  const handleDispatchTransport = () => {
    assignTransportTask(taskResource, taskCount, taskSource, taskDest);
  };

  // Handler for engaging autonomous rover
  const handleEngageRover = () => {
    const target = PRESET_ROVER_DESTINATIONS.find((d) => d.id === selectedDestId);
    if (target) {
      setRoverDestination(target);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none">
      <div className="relative flex flex-col h-[90vh] max-h-[820px] w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-[#070D18]/95 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-slate-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 px-6 py-4 bg-[#0A1222]/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wider text-white">
                  OUTPOST ALPHA INTELLIGENT BASE & AUTONOMOUS SYSTEMS
                </h2>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  AI CORE V8.4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sol {solCycle.solNumber} • Jezero Planetary Telemetry, Autonomous Rover Autopilot & Robotics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Base Health Gauge */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Base Health:</span>
              <span
                className={`text-sm font-black ${
                  healthScore >= 75
                    ? 'text-emerald-400'
                    : healthScore >= 45
                    ? 'text-amber-400'
                    : 'text-rose-400 animate-pulse'
                }`}
              >
                {healthScore}%
              </span>
            </div>

            <button
              onClick={close}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-500/20 bg-[#08101E]/60 px-6 gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'overview' as TabType, label: 'BASE ADVISORY & STATUS', icon: Cpu, count: baseRecommendations.filter((r) => !r.acknowledged).length },
            { id: 'rover' as TabType, label: 'AUTONOMOUS ROVER', icon: Compass, count: roverAIMode === 'autonomous' ? 1 : 0 },
            { id: 'robot' as TabType, label: 'AERO-BOT COMPANION', icon: Bot, count: robotState.batteryPercent < 20 ? 1 : 0 },
            { id: 'logistics' as TabType, label: 'RESOURCE LOGISTICS', icon: Truck, count: transportTasks.filter((t) => t.status === 'in_progress' || t.status === 'pending').length },
            { id: 'alerts' as TabType, label: 'SYSTEM ALERTS', icon: AlertTriangle, count: baseAlerts.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                      tab.id === 'alerts' || tab.id === 'overview'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: BASE ADVISORY & OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Telemetry Snapshot Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#0B1528] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>GRID POWER</span>
                    <Zap className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-black text-white">
                      {powerGrid.batteryStorageKWh.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ 100 kWh</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        powerGrid.batteryStorageKWh > 35 ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, (powerGrid.batteryStorageKWh / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1528] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>SOLAR YIELD</span>
                    <Activity className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-black text-white">
                      {powerGrid.solarOutputKW.toFixed(1)}
                    </span>
                    <span className="text-xs text-cyan-400 ml-1">kW Gen</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Irradiance: {solCycle.solarIrradiance.toFixed(0)} W/m²
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1528] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>EVA OXYGEN</span>
                    <Radio className="h-4 w-4 text-sky-400" />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-black text-white">
                      {vitals.oxygen.toFixed(0)}%
                    </span>
                    <span className="text-xs text-sky-400 ml-1">Suit Tank</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        vitals.oxygen > 30 ? 'bg-sky-400' : 'bg-rose-500 animate-pulse'
                      }`}
                      style={{ width: `${vitals.oxygen}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0B1528] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>ROVER BATTERY</span>
                    <BatteryCharging className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-black text-white">
                      {roverTelemetry.batteryPercent.toFixed(0)}%
                    </span>
                    <span className="text-xs text-emerald-400 ml-1">Accumulator</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Mode: {roverAIMode === 'autonomous' ? 'AUTONOMOUS' : 'MANUAL'}
                  </div>
                </div>
              </div>

              {/* Base AI Recommendations Queue */}
              <div className="rounded-2xl border border-cyan-500/30 bg-[#0B1528]/80 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                      PRIORITIZED BASE AI ADVISORY RECOMMENDATIONS
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {baseRecommendations.length} recommendations formulated
                  </span>
                </div>

                {baseRecommendations.length === 0 ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center text-xs text-emerald-300">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    ALL BASE SYSTEMS NOMINAL — No critical environmental or life support anomalies detected.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {baseRecommendations.map((rec) => {
                      const priorityColor =
                        rec.priority === 'critical'
                          ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                          : rec.priority === 'high'
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                          : rec.priority === 'medium'
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                          : 'border-slate-700 bg-white/5 text-slate-300';

                      const badgeBg =
                        rec.priority === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : rec.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

                      return (
                        <div
                          key={rec.id}
                          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${priorityColor}`}
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-black uppercase ${badgeBg}`}>
                                {rec.priority}
                              </span>
                              <h4 className="text-xs font-bold text-white tracking-wide">
                                {rec.title}
                              </h4>
                              <span className="text-[10px] text-slate-400">
                                {rec.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {rec.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {rec.actionLabel && (
                              <button
                                onClick={() => executeAIAction(rec.id)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg border border-cyan-400 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/30 transition-colors shadow-sm"
                              >
                                <Play className="h-3.5 w-3.5 text-cyan-400" />
                                {rec.actionLabel}
                              </button>
                            )}
                            <button
                              onClick={() => acknowledgeAIRecommendation(rec.id)}
                              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Facility Operational Grid */}
              <div className="rounded-2xl border border-white/10 bg-[#0B1528]/80 p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  OUTPOST ALPHA FACILITY STATUS
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { id: 'command_centre', name: 'Command Hub', lvl: facilityRenovations.command_centre },
                    { id: 'greenhouse', name: 'Greenhouse', lvl: facilityRenovations.greenhouse },
                    { id: 'engineering_workshop', name: 'Workshop', lvl: facilityRenovations.engineering_workshop },
                    { id: 'rover_garage', name: 'Rover Garage', lvl: facilityRenovations.rover_garage },
                    { id: 'living_quarters', name: 'Living Bunks', lvl: facilityRenovations.living_quarters },
                    { id: 'comm_room', name: 'Comms Dish', lvl: facilityRenovations.comm_room },
                  ].map((f) => (
                    <div
                      key={f.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-bold text-slate-300 truncate">{f.name}</span>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Level {f.lvl}</span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            f.lvl >= 2 ? 'bg-emerald-400' : f.lvl === 1 ? 'bg-amber-400' : 'bg-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AUTONOMOUS ROVER NAVIGATION */}
          {/* ========================================================================= */}
          {activeTab === 'rover' && (
            <div className="space-y-6">
              {/* Rover Status Header */}
              <div className="rounded-2xl border border-cyan-500/30 bg-[#0B1528] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      MARS EXPLORATION ROVER NAVIGATION CONTROLLER
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                        roverAIMode === 'autonomous'
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 animate-pulse'
                          : 'border-slate-600 bg-slate-800 text-slate-300'
                      }`}
                    >
                      {roverAIMode === 'autonomous' ? 'AUTOPILOT ENGAGED' : 'MANUAL CONTROL'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Coordinates: [{roverPos[0].toFixed(1)}, {roverPos[1].toFixed(1)}, {roverPos[2].toFixed(1)}] • Speed: {roverTelemetry.speedKmH} km/h • Battery: {roverTelemetry.batteryPercent.toFixed(0)}%
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {roverAIMode === 'autonomous' ? (
                    <button
                      onClick={cancelRoverAutonomous}
                      className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-colors shadow-lg"
                    >
                      <Square className="h-4 w-4 text-rose-400" />
                      DISENGAGE AUTOPILOT
                    </button>
                  ) : (
                    <button
                      onClick={handleEngageRover}
                      className="flex items-center gap-2 rounded-xl border border-cyan-400 bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-500/30 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      <Play className="h-4 w-4 text-cyan-400" />
                      ENGAGE AUTONOMOUS DRIVE
                    </button>
                  )}
                </div>
              </div>

              {/* Active Navigation Route Telemetry */}
              {roverAIMode === 'autonomous' && roverNavPlan.destination && (
                <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">
                      ACTIVE ROUTE: {roverNavPlan.destination.name}
                    </span>
                    <span className="text-slate-300">
                      ETA: ~{roverNavPlan.estimatedSecondsRemaining ?? 0}s
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress: {roverNavPlan.progressPercent.toFixed(0)}%</span>
                      <span>Remaining: {roverNavPlan.remainingDistance.toFixed(0)}m / {roverNavPlan.totalDistance.toFixed(0)}m</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all rounded-full"
                        style={{ width: `${roverNavPlan.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Waypoints: {roverNavPlan.currentWaypointIndex + 1} / {roverNavPlan.waypoints.length}</span>
                    <span>• Status: {roverNavPlan.state.toUpperCase().replace('_', ' ')}</span>
                  </div>
                </div>
              )}

              {/* Preset Destinations Selector */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  SELECT PLANETARY WAYPOINT DESTINATION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PRESET_ROVER_DESTINATIONS.map((dest) => {
                    const isSelected = selectedDestId === dest.id;
                    const distFromRover = Math.round(
                      Math.hypot(dest.position[0] - roverPos[0], dest.position[2] - roverPos[2])
                    );
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestId(dest.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                            : 'border-white/10 bg-[#0B1528] hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{dest.name}</span>
                            <span className="text-[10px] text-cyan-400 font-bold">{distFromRover}m</span>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {dest.category}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Coords: [{dest.position[0]}, {dest.position[2]}]</span>
                          <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                            {isSelected ? 'SELECTED' : 'SELECT'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ROBOTIC ASSISTANT (AERO-BOT) */}
          {/* ========================================================================= */}
          {activeTab === 'robot' && (
            <div className="space-y-6">
              {/* Aero-Bot Status & Battery Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                    <Bot className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">AERO-BOT MARS ASSISTANT</h3>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30 uppercase">
                        {robotState.mode.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Autonomous Mobile Companion • Outpost Alpha Docking Cradle
                    </p>
                  </div>
                </div>

                {/* Battery Gauge */}
                <div className="flex flex-col items-start md:items-end space-y-1 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 uppercase">Aero-Bot Battery:</span>
                    <span
                      className={`text-sm font-black ${
                        robotState.batteryPercent > 30 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'
                      }`}
                    >
                      {robotState.batteryPercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        robotState.batteryPercent > 30 ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${robotState.batteryPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {robotState.isCharging ? 'Charging in dock cradle (+3.5%/s)' : 'Consuming power (-0.12%/s)'}
                  </span>
                </div>
              </div>

              {/* Order Mode Controls */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  DIRECTIVE ASSIGNMENT
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { mode: 'follow_player' as RobotMode, title: 'FOLLOW ASTRONAUT', desc: 'Maintains 2.5m safe perimeter and illuminates player path.' },
                    { mode: 'idle' as RobotMode, title: 'HOLD POSITION', desc: 'Halts movement and holds current position in the world.' },
                    { mode: 'return_to_dock' as RobotMode, title: 'RETURN TO CRADLE', desc: 'Navigates back to Command Centre cradle to recharge battery.' },
                  ].map((item) => {
                    const isSelected = robotState.mode === item.mode;
                    return (
                      <button
                        key={item.mode}
                        onClick={() => setRobotMode(item.mode)}
                        className={`text-left rounded-xl border p-4 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                            : 'border-white/10 bg-[#0B1528] hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{item.title}</span>
                            {isSelected && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="mt-3 text-[10px] font-bold text-cyan-400">
                          {isSelected ? 'ACTIVE DIRECTIVE' : 'SELECT DIRECTIVE'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Cargo Payload */}
              <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  AERO-BOT HOPPER PAYLOAD
                </h3>
                {robotState.payload ? (
                  <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3.5">
                    <div className="flex items-center gap-3">
                      <Layers className="h-5 w-5 text-cyan-400" />
                      <div>
                        <span className="text-xs font-bold text-white uppercase">
                          {RESOURCE_DEFINITIONS[robotState.payload.type]?.name || robotState.payload.type}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Quantity: {robotState.payload.count} units • Mass: {robotState.payload.weightKg.toFixed(1)} kg
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-cyan-300 font-bold uppercase">IN TRANSIT</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-center text-xs text-slate-400">
                    Cargo hopper is currently empty.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: RESOURCE LOGISTICS & TASKS */}
          {/* ========================================================================= */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              {/* Create New Transport Task Form */}
              <div className="rounded-2xl border border-cyan-500/30 bg-[#0B1528] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    ASSIGN RESOURCE HAULING TASK TO AERO-BOT
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Source Container */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase">SOURCE CONTAINER</label>
                    <select
                      value={taskSource}
                      onChange={(e) => setTaskSource(e.target.value as StorageContainerType)}
                      className="w-full rounded-xl border border-white/10 bg-[#070D18] p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="vault">OUTPOST VAULT</option>
                      <option value="rover">ROVER STORAGE</option>
                      <option value="backpack">ASTRONAUT BACKPACK</option>
                    </select>
                  </div>

                  {/* Destination Container */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase">DESTINATION</label>
                    <select
                      value={taskDest}
                      onChange={(e) => setTaskDest(e.target.value as StorageContainerType)}
                      className="w-full rounded-xl border border-white/10 bg-[#070D18] p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="rover">ROVER STORAGE</option>
                      <option value="vault">OUTPOST VAULT</option>
                      <option value="backpack">ASTRONAUT BACKPACK</option>
                    </select>
                  </div>

                  {/* Resource Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase">RESOURCE TYPE</label>
                    <select
                      value={taskResource}
                      onChange={(e) => setTaskResource(e.target.value as ResourceType)}
                      className="w-full rounded-xl border border-white/10 bg-[#070D18] p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {availableSourceResources.length > 0 ? (
                        availableSourceResources.map((res) => (
                          <option key={res.type} value={res.type}>
                            {RESOURCE_DEFINITIONS[res.type]?.name || res.type} ({res.count} available)
                          </option>
                        ))
                      ) : (
                        <option value="scrap_metal">No items at source</option>
                      )}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase">QUANTITY</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={taskCount}
                        onChange={(e) => setTaskCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full rounded-xl border border-white/10 bg-[#070D18] p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        onClick={handleDispatchTransport}
                        disabled={availableSourceResources.length === 0}
                        className="rounded-xl border border-cyan-400 bg-cyan-500/20 px-4 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/30 disabled:opacity-50 transition-colors whitespace-nowrap"
                      >
                        DISPATCH
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transport Task Queue */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  ACTIVE LOGISTICS QUEUE
                </h3>
                {transportTasks.length === 0 ? (
                  <div className="rounded-xl border border-white/5 bg-white/5 p-6 text-center text-xs text-slate-400">
                    No active transport tasks in queue.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {transportTasks.map((t) => {
                      const resDef = RESOURCE_DEFINITIONS[t.resourceType];
                      return (
                        <div
                          key={t.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0B1528] p-3.5 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${
                                  t.status === 'in_progress'
                                    ? 'bg-cyan-500/20 text-cyan-300'
                                    : t.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : t.status === 'cancelled'
                                    ? 'bg-slate-700 text-slate-400'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {t.status}
                              </span>
                              <span className="font-bold text-white">
                                {t.count}x {resDef?.name || t.resourceType}
                              </span>
                              <span className="text-slate-400">
                                ({t.source.toUpperCase()} <ArrowRight className="inline h-3 w-3 text-cyan-400" /> {t.destination.toUpperCase()})
                              </span>
                            </div>
                            {t.status === 'in_progress' && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${t.progressPercent}%` }} />
                                </div>
                                <span>{t.progressPercent.toFixed(0)}%</span>
                              </div>
                            )}
                          </div>

                          {t.status === 'pending' || t.status === 'in_progress' ? (
                            <button
                              onClick={() => cancelTransportTask(t.id)}
                              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-300 hover:bg-rose-500/20 transition-colors"
                            >
                              Cancel Task
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">{t.completedAt || t.timestamp}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SYSTEM ALERTS LOG */}
          {/* ========================================================================= */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  OUTPOST ALPHA TELEMETRY AUDIT LOG (DEDUPLICATED)
                </h3>
                <span className="text-xs text-slate-400">
                  {baseAlerts.length} logged incidents
                </span>
              </div>

              {baseAlerts.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center text-xs text-slate-400">
                  No telemetry anomalies recorded.
                </div>
              ) : (
                <div className="space-y-2">
                  {baseAlerts.map((a) => {
                    const badgeColor =
                      a.severity === 'hazard'
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        : a.severity === 'caution'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center justify-between rounded-xl border p-3 text-xs ${badgeColor}`}
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>{a.message}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 ml-4 shrink-0">{a.timestamp}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between border-t border-cyan-500/20 bg-[#0A1222] px-6 py-3 text-xs text-slate-400">
          <span>AI Simulation Loop: 60 FPS • Real-time Kinematic Coupling Active</span>
          <div className="flex items-center gap-4">
            <span>Press [U] or [ESC] to Exit</span>
          </div>
        </div>

      </div>
    </div>
  );
};
