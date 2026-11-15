import React, { useState } from 'react';
import { Blueprint } from '../types';
import {
  X,
  Bookmark,
  FolderOpen,
  Trash2,
  Edit2,
  Check,
  Plus,
  Sparkles,
  Rocket,
} from 'lucide-react';

interface BlueprintManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBlueprints: Blueprint[];
  presetBlueprints: Blueprint[];
  onSaveCurrentDesign: (name: string) => void;
  onLoadBlueprint: (bp: Blueprint) => void;
  onRenameBlueprint: (id: string, newName: string) => void;
  onDeleteBlueprint: (id: string) => void;
  currentVehicleName: string;
}

export const BlueprintManagerModal: React.FC<BlueprintManagerModalProps> = ({
  isOpen,
  onClose,
  savedBlueprints,
  presetBlueprints,
  onSaveCurrentDesign,
  onLoadBlueprint,
  onRenameBlueprint,
  onDeleteBlueprint,
  currentVehicleName,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'saved'>('presets');
  const [saveName, setSaveName] = useState<string>(currentVehicleName);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSaveCurrentDesign(saveName.trim());
    setActiveTab('saved');
  };

  const handleStartRename = (bp: Blueprint) => {
    setEditingId(bp.id);
    setEditingName(bp.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      onRenameBlueprint(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#070C1B] p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8]">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="blueprint-modal-title"
                className="font-sans text-lg font-extrabold text-white"
              >
                Spacecraft Blueprint Hangar
              </h2>
              <p className="font-mono text-xs text-[#94A3B8]">
                Save, load, and manage vehicle configurations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Save Current Vehicle Bar */}
        <form
          onSubmit={handleSave}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border border-white/10 bg-[#0B1226]/80"
        >
          <div className="flex items-center gap-2 flex-1">
            <Rocket className="h-4 w-4 text-[#F59E0B] shrink-0" />
            <input
              type="text"
              placeholder="Name your blueprint..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#070C1B] px-3 py-1 font-sans text-xs text-white focus:border-[#38BDF8] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-[#F59E0B] text-[#030611] font-bold text-xs hover:bg-[#FBBF24] transition-all shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Save Blueprint</span>
          </button>
        </form>

        {/* Tabs: Presets vs Saved */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs transition-all ${
              activeTab === 'presets'
                ? 'border border-[#38BDF8] bg-[#38BDF8]/20 text-[#38BDF8] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Academy Presets ({presetBlueprints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs transition-all ${
              activeTab === 'saved'
                ? 'border border-[#38BDF8] bg-[#38BDF8]/20 text-[#38BDF8] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Custom Blueprints ({savedBlueprints.length})</span>
          </button>
        </div>

        {/* Blueprints List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {activeTab === 'presets' && (
            <div className="space-y-2">
              {presetBlueprints.map((bp) => (
                <div
                  key={bp.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#070C1B]/90 hover:border-[#38BDF8]/40 hover:bg-[#0E172F] transition-all"
                >
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">
                      {bp.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#94A3B8] block mt-0.5">
                      {bp.author} • {bp.components.length} Components • Livery: {bp.liveryId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadBlueprint(bp);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-mono font-bold hover:bg-[#38BDF8] hover:text-[#030611] transition-all"
                  >
                    <span>Load Blueprint</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-2">
              {savedBlueprints.map((bp) => {
                const isEditing = editingId === bp.id;
                const isConfirmingDelete = confirmDeleteId === bp.id;

                return (
                  <div
                    key={bp.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#070C1B]/90 hover:border-white/20 transition-all"
                  >
                    <div className="flex-1 pr-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="rounded border border-[#38BDF8] bg-[#070C1B] px-2 py-0.5 font-sans text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(bp.id)}
                            className="text-[#34D399] hover:text-white"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-xs font-bold text-white">
                              {bp.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartRename(bp)}
                              title="Rename blueprint"
                              className="text-[#94A3B8] hover:text-white"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-mono text-[10px] text-[#94A3B8] block mt-0.5">
                            {new Date(bp.updatedAt).toLocaleDateString()} •{' '}
                            {bp.components.length} Components
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadBlueprint(bp);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-mono font-bold hover:bg-[#38BDF8] hover:text-[#030611] transition-all"
                      >
                        Load
                      </button>

                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-lg">
                          <span className="font-mono text-[10px] text-red-400">Confirm?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteBlueprint(bp.id);
                              setConfirmDeleteId(null);
                            }}
                            className="font-mono text-[10px] text-red-400 font-bold hover:underline"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="font-mono text-[10px] text-[#94A3B8] hover:underline ml-1"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(bp.id)}
                          title="Delete blueprint"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {savedBlueprints.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-[#94A3B8]">
                  <FolderOpen className="h-8 w-8 text-[#64748B] mb-2" />
                  <p className="font-sans text-xs">No custom blueprints saved yet.</p>
                  <p className="font-mono text-[10px] text-[#64748B] mt-1">
                    Design a spacecraft and click "Save Blueprint" to store it here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
