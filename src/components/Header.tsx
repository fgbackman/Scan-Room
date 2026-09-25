import React from 'react';
import { Sparkles, Zap, FolderOpen, Plus, Home } from 'lucide-react';

interface HeaderProps {
  onNewScan: () => void;
  onOpenQuickTriage: () => void;
  onOpenHistory: () => void;
  savedRoomsCount: number;
  activeRoomTitle?: string;
  isAnalyzing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewScan,
  onOpenQuickTriage,
  onOpenHistory,
  savedRoomsCount,
  activeRoomTitle,
  isAnalyzing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewScan}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-stone-100 font-serif">
                ClutterSense
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Smart Room Organizer & Declutter Architect
            </p>
          </div>
        </div>

        {/* Center active room indicator */}
        {activeRoomTitle && (
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60 max-w-xs truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-stone-400">Viewing:</span>
            <span className="font-medium text-stone-200 truncate">{activeRoomTitle}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Triage button */}
          <button
            onClick={onOpenQuickTriage}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-white rounded-lg border border-stone-700 transition-colors"
            title="Rapid 30-Second Item Verdict"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Speed Triage</span>
          </button>

          {/* Saved Rooms button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-white rounded-lg border border-stone-700 transition-colors"
            title="View saved rooms"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Rooms</span>
            {savedRoomsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-stone-700 text-stone-300 rounded text-[11px]">
                {savedRoomsCount}
              </span>
            )}
          </button>

          {/* New Scan */}
          <button
            onClick={onNewScan}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow-sm font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Scan Room</span>
          </button>
        </div>
      </div>
    </header>
  );
};
