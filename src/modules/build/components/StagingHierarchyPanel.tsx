import React from 'react';
import { AssembledComponent } from '../types';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Layers,
  Fuel,
} from 'lucide-react';

interface StagingHierarchyPanelProps {
  components: AssembledComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (instanceId: string) => void;
  onRemoveComponent: (instanceId: string) => void;
  onMoveStage: (fromIndex: number, toIndex: number) => void;
  onUpdatePropellantFill: (instanceId: string, fillRate: number) => void;
}

export const StagingHierarchyPanel: React.FC<StagingHierarchyPanelProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent,
  onMoveStage,
  onUpdatePropellantFill,
}) => {
  return (
    <div className="flex flex-col h-full gap-3">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#818CF8]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Active Staging Hierarchy
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#38BDF8] font-bold">
          {components.length} Stages Mounted
        </span>
      </div>

      {/* Staging Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] pr-1 scrollbar-thin">
        {components.map((comp, idx) => {
          const isSelected = selectedComponentId === comp.instanceId;
          const stageNumber = components.length - idx;

          return (
            <div
              key={comp.instanceId}
              onClick={() => onSelectComponent(comp.instanceId)}
              className={`group flex flex-col gap-2 rounded-xl border p-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#38BDF8] bg-[#0E1B38] shadow-[0_0_14px_rgba(56,189,248,0.25)]'
                  : 'border-white/[0.08] bg-[#070C1B]/80 hover:border-white/20 hover:bg-[#0B1226]'
              }`}
            >
              {/* Row 1: Stage Tag, Name & Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#030611]'
                        : 'bg-white/10 text-[#38BDF8]'
                    }`}
                  >
                    S{stageNumber}
                  </span>
                  <span className="font-sans text-xs font-bold text-white truncate">
                    {comp.name}
                  </span>
                </div>

                {/* Move & Remove Controls */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => onMoveStage(idx, idx - 1)}
                    title="Move component up in staging stack"
                    className="flex h-6 w-6 items-center justify-center rounded text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === components.length - 1}
                    onClick={() => onMoveStage(idx, idx + 1)}
                    title="Move component down in staging stack"
                    className="flex h-6 w-6 items-center justify-center rounded text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveComponent(comp.instanceId)}
                    title="Demount component from assembly"
                    data-testid={`remove-part-${comp.instanceId}`}
                    className="flex h-6 w-6 items-center justify-center rounded text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 ml-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Specs summary */}
              <div className="flex items-center gap-3 font-mono text-[10px] text-[#94A3B8]">
                <span>Dry: {comp.mass.toLocaleString()} kg</span>
                {comp.thrust > 0 && (
                  <span className="text-[#F59E0B]">Thrust: {comp.thrust} kN</span>
                )}
                {comp.isp > 0 && <span className="text-[#A78BFA]">Isp: {comp.isp}s</span>}
                <span className="ml-auto uppercase text-[9px] text-[#64748B]">
                  {comp.mountSlot}
                </span>
              </div>

              {/* Row 3: Propellant Fill Rate Slider (If tank or booster) */}
              {comp.propellantCapacity > 0 && (
                <div
                  className="flex flex-col gap-1 border-t border-white/5 pt-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between font-mono text-[9.5px]">
                    <span className="flex items-center gap-1 text-[#38BDF8]">
                      <Fuel className="h-2.5 w-2.5" />
                      <span>Cryo Fill:</span>
                    </span>
                    <span className="text-white font-bold">
                      {Math.round(comp.propellantFill * 100)}% (
                      {Math.round(
                        comp.propellantCapacity * comp.propellantFill
                      ).toLocaleString()}{' '}
                      kg)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(comp.propellantFill * 100)}
                    onChange={(e) =>
                      onUpdatePropellantFill(
                        comp.instanceId,
                        parseFloat(e.target.value) / 100
                      )
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#0B1226] accent-[#38BDF8]"
                  />
                </div>
              )}
            </div>
          );
        })}

        {components.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#94A3B8]">
            <Layers className="h-8 w-8 text-[#64748B] mb-2" />
            <p className="font-sans text-xs">Assembly stack is currently empty.</p>
            <p className="font-mono text-[10px] text-[#64748B] mt-1">
              Select modules from the Component Library to begin fabrication.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
