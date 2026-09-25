import React from 'react';
import { X, FolderOpen, Trash2, ArrowRight, CheckCircle2, Home, Plus } from 'lucide-react';
import { RoomSession } from '../types';

interface RoomHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRooms: RoomSession[];
  activeRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
  onNewScan: () => void;
}

export const RoomHistoryModal: React.FC<RoomHistoryModalProps> = ({
  isOpen,
  onClose,
  savedRooms,
  activeRoomId,
  onSelectRoom,
  onDeleteRoom,
  onNewScan,
}) => {
  if (!isOpen) return null;

  // Calculate whole-house completion stats
  let totalHouseTasks = 0;
  let completedHouseTasks = 0;

  savedRooms.forEach((r) => {
    const taskCount = r.analysis.actionPlan.flatMap((p) => p.tasks).length;
    totalHouseTasks += taskCount;
    completedHouseTasks += r.completedTaskIds.length;
  });

  const overallProgress = totalHouseTasks > 0
    ? Math.round((completedHouseTasks / totalHouseTasks) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif">
                Your House Declutter Vault
              </h3>
              <p className="text-xs text-stone-400">
                {savedRooms.length} room{savedRooms.length === 1 ? '' : 's'} scanned & mapped
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:text-white text-stone-400 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* House Progress Bar */}
          {savedRooms.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-600" />
                  <span>Whole-Home Organization Index</span>
                </span>
                <span className="font-bold text-stone-900">
                  {completedHouseTasks} of {totalHouseTasks} tasks completed ({overallProgress}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Rooms List */}
          {savedRooms.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <p className="text-stone-700 font-semibold text-sm">
                No rooms saved in your vault yet.
              </p>
              <p className="text-stone-500 text-xs max-w-sm mx-auto">
                Scan or upload a room photo to start tracking decluttering progress and storage systems.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewScan();
                }}
                className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Scan a Room Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
              {savedRooms.map((room) => {
                const isActive = room.id === activeRoomId;
                const totalTasks = room.analysis.actionPlan.flatMap((p) => p.tasks).length;
                const doneTasks = room.completedTaskIds.length;

                return (
                  <div
                    key={room.id}
                    className={`rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-amber-400 bg-amber-500/5 ring-2 ring-amber-400/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={room.imageUrl}
                        alt={room.title}
                        className="w-20 h-20 object-cover rounded-lg shrink-0 border border-stone-200 bg-stone-100"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            {room.roomType}
                          </span>
                          <span className="text-xs font-bold text-stone-800">
                            {room.analysis.overallScore}/100
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                          {room.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1">
                          {doneTasks}/{totalTasks} tasks done
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {room.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => onDeleteRoom(room.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove room"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectRoom(room.id);
                          onClose();
                        }}
                        className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                          isActive
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                        }`}
                      >
                        <span>{isActive ? 'Current' : 'Open'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onNewScan();
            }}
            className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Room Scan</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
