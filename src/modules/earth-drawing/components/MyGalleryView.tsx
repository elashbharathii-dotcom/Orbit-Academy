import React from 'react';
import { SavedStudioProject } from '../types';
import { FolderOpen, Download, Trash2, Calendar, Paintbrush, ArrowRight } from 'lucide-react';

interface MyGalleryViewProps {
  savedProjects: SavedStudioProject[];
  onOpenProject: (project: SavedStudioProject) => void;
  onDeleteProject: (projectId: string) => void;
  onStartBlank: () => void;
}

export const MyGalleryView: React.FC<MyGalleryViewProps> = ({
  savedProjects,
  onOpenProject,
  onDeleteProject,
  onStartBlank,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[6px_6px_0px_#0B0B0B]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F59E0B] border border-[#0B0B0B]" />
            <span
              className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
              style={{ fontFamily: '"Silkscreen", monospace' }}
            >
              MY SAVED ARTWORKS ({savedProjects.length})
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-black text-[#0B0B0B] uppercase"
            style={{ fontFamily: '"Silkscreen", monospace' }}
          >
            STUDENT MISSION ARCHIVE
          </h2>
          <p className="font-mono text-xs text-[#555555]">
            Reopen, edit, or export high-resolution PNGs of your space sketches and spacecraft designs.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartBlank}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#0B0B0B] bg-[#00E5FF] text-[#0B0B0B] font-mono text-xs font-black uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[4px_4px_0px_#0B0B0B] active:translate-x-0.5 active:translate-y-0.5"
        >
          <Paintbrush className="w-4 h-4" />
          <span>NEW DRAWING</span>
        </button>
      </div>

      {/* Projects Grid or Empty State */}
      {savedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#FFFFFF] border-2 border-[#0B0B0B] text-center shadow-[4px_4px_0px_#0B0B0B]">
          <div className="w-16 h-16 border-2 border-[#0B0B0B] bg-[#F1F1F0] flex items-center justify-center text-3xl mb-4 shadow-[3px_3px_0px_#9A9A9A]">
            🎨
          </div>
          <h3
            className="font-mono text-lg font-black text-[#0B0B0B] uppercase mb-2"
            style={{ fontFamily: '"Silkscreen", monospace' }}
          >
            NO SAVED MISSIONS YET
          </h3>
          <p className="font-mono text-xs text-[#555555] max-w-md mb-6 leading-relaxed">
            Your creative artwork will appear here when you save in the Cosmic Creative Studio. Create your first celestial artwork!
          </p>
          <button
            type="button"
            onClick={onStartBlank}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0B0B0B] bg-[#0B0B0B] text-[#F1F1F0] font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#9A9A9A] hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <span>LAUNCH CREATIVE STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProjects.map((project) => {
            const dateStr = new Date(project.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between bg-[#FFFFFF] border-2 border-[#0B0B0B] p-4 shadow-[4px_4px_0px_#0B0B0B] hover:shadow-[6px_6px_0px_#0B0B0B] transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full bg-[#F1F1F0] border-2 border-[#0B0B0B] overflow-hidden mb-3 flex items-center justify-center">
                  {project.thumbnailDataUrl ? (
                    <img
                      src={project.thumbnailDataUrl}
                      alt={project.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="font-mono text-xs text-[#777777]">No Preview</span>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#0B0B0B] text-[#F1F1F0] font-mono text-[9px] font-bold">
                    {project.width}×{project.height}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 mb-4">
                  <h4
                    className="font-mono text-sm font-black text-[#0B0B0B] uppercase truncate"
                    style={{ fontFamily: '"Silkscreen", monospace' }}
                  >
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#555555]">
                    <Calendar className="w-3 h-3 text-[#9A9A9A]" />
                    <span>Saved {dateStr}</span>
                    <span>•</span>
                    <span>{project.layers.length} Layers</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-dashed border-[#9A9A9A]">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    title="Open in Studio"
                    className="flex items-center justify-center gap-1 p-2 border-2 border-[#0B0B0B] bg-[#00E5FF] text-[#0B0B0B] font-mono text-xs font-bold hover:bg-[#00D0EE] shadow-[2px_2px_0px_#0B0B0B]"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>OPEN</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}.png`;
                      link.href = project.thumbnailDataUrl;
                      link.click();
                    }}
                    title="Download PNG"
                    className="flex items-center justify-center gap-1 p-2 border-2 border-[#0B0B0B] bg-[#F1F1F0] text-[#0B0B0B] font-mono text-xs font-bold hover:bg-[#FFFFFF] shadow-[2px_2px_0px_#9A9A9A]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteProject(project.id)}
                    title="Delete Project"
                    className="flex items-center justify-center p-2 border-2 border-[#0B0B0B] bg-[#F1F1F0] text-[#EF4444] hover:bg-[#FFE4E6] shadow-[2px_2px_0px_#9A9A9A]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
