import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoomUploader } from './components/RoomUploader';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ChatDrawer } from './components/ChatDrawer';
import { RoomHistoryModal } from './components/RoomHistoryModal';
import { QuickItemTriageModal } from './components/QuickItemTriageModal';
import { analyzeRoomImage } from './services/api';
import { DEMO_ROOMS, DemoRoom } from './data/demoRooms';
import { RoomSession, RoomAnalysisResult, GeminiModelChoice } from './types';
import { AlertCircle, X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'cluttersense_saved_rooms_v1';
const ACTIVE_ROOM_KEY = 'cluttersense_active_room_id_v1';

export default function App() {
  const [savedRooms, setSavedRooms] = useState<RoomSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved rooms from localStorage', e);
    }
    // Initialize with a demo room so user immediately has a great reference experience if desired
    const defaultDemo = DEMO_ROOMS[0];
    return [
      {
        id: defaultDemo.id,
        title: defaultDemo.title,
        createdAt: new Date().toISOString(),
        imageUrl: defaultDemo.imageUrl,
        roomType: defaultDemo.roomType,
        analysis: defaultDemo.analysis,
        completedTaskIds: ['task-1-1'],
      },
    ];
  });

  const [activeRoomId, setActiveRoomId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_ROOM_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Modals and Drawers
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isQuickTriageOpen, setIsQuickTriageOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRooms));
    } catch (e) {
      console.warn('Failed to save rooms to localStorage', e);
    }
  }, [savedRooms]);

  useEffect(() => {
    try {
      if (activeRoomId) {
        localStorage.setItem(ACTIVE_ROOM_KEY, activeRoomId);
      } else {
        localStorage.removeItem(ACTIVE_ROOM_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active room id', e);
    }
  }, [activeRoomId]);

  // Find active room session
  const activeRoom = savedRooms.find((r) => r.id === activeRoomId) || null;

  // Handle image analysis
  const handleAnalyze = async (params: {
    imageBase64: string;
    mimeType: string;
    roomTypeHint: string;
    focusGoals: string[];
    preferredModel: GeminiModelChoice;
    roomTitle?: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const analysis: RoomAnalysisResult = await analyzeRoomImage({
        imageBase64: params.imageBase64,
        mimeType: params.mimeType,
        roomTypeHint: params.roomTypeHint,
        focusGoals: params.focusGoals,
        preferredModel: params.preferredModel,
      });

      const newRoomId = 'room-' + Date.now();
      const generatedTitle =
        params.roomTitle || `${analysis.roomType || 'Room'} Space Analysis`;

      // Form image URL
      const imageUrl = params.imageBase64.startsWith('data:')
        ? params.imageBase64
        : `data:${params.mimeType};base64,${params.imageBase64}`;

      const newSession: RoomSession = {
        id: newRoomId,
        title: generatedTitle,
        createdAt: new Date().toISOString(),
        imageUrl: imageUrl,
        roomType: analysis.roomType,
        analysis: analysis,
        completedTaskIds: [],
      };

      setSavedRooms((prev) => [newSession, ...prev]);
      setActiveRoomId(newRoomId);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(
        err.message || 'Failed to analyze room photograph. Please try another image or check connection.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle selecting a demo room
  const handleSelectDemoRoom = (demo: DemoRoom) => {
    const existingIndex = savedRooms.findIndex((r) => r.id === demo.id);
    if (existingIndex >= 0) {
      setActiveRoomId(demo.id);
    } else {
      const newSession: RoomSession = {
        id: demo.id,
        title: demo.title,
        createdAt: new Date().toISOString(),
        imageUrl: demo.imageUrl,
        roomType: demo.roomType,
        analysis: demo.analysis,
        completedTaskIds: ['task-1-1'],
      };
      setSavedRooms((prev) => [newSession, ...prev]);
      setActiveRoomId(demo.id);
    }
  };

  // Toggle action task completion
  const handleToggleTask = (taskId: string) => {
    if (!activeRoomId) return;

    setSavedRooms((prev) =>
      prev.map((room) => {
        if (room.id !== activeRoomId) return room;
        const exists = room.completedTaskIds.includes(taskId);
        const updated = exists
          ? room.completedTaskIds.filter((id) => id !== taskId)
          : [...room.completedTaskIds, taskId];
        return { ...room, completedTaskIds: updated };
      })
    );
  };

  // Delete saved room
  const handleDeleteRoom = (roomId: string) => {
    setSavedRooms((prev) => prev.filter((r) => r.id !== roomId));
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }
  };

  // Switch to room from history
  const handleSelectRoomFromHistory = (roomId: string) => {
    setActiveRoomId(roomId);
    setIsHistoryModalOpen(false);
  };

  // Start a new scan
  const handleNewScan = () => {
    setActiveRoomId(null);
    setAnalysisError(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Global Header */}
      <Header
        onNewScan={handleNewScan}
        onOpenQuickTriage={() => setIsQuickTriageOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        savedRoomsCount={savedRooms.length}
        activeRoomTitle={activeRoom?.title}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner */}
        {analysisError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Room Analysis Error</p>
                <p className="text-xs text-rose-700 mt-0.5">{analysisError}</p>
              </div>
            </div>
            <button
              onClick={() => setAnalysisError(null)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic View: Uploader vs Dashboard */}
        {activeRoom ? (
          <AnalysisDashboard
            analysis={activeRoom.analysis}
            imageUrl={activeRoom.imageUrl}
            roomTitle={activeRoom.title}
            completedTaskIds={activeRoom.completedTaskIds}
            onToggleTask={handleToggleTask}
            onOpenChatWithContext={() => setIsChatOpen(true)}
            onOpenQuickTriage={() => setIsQuickTriageOpen(true)}
            onNewScan={handleNewScan}
          />
        ) : (
          <RoomUploader
            onAnalyze={handleAnalyze}
            onSelectDemoRoom={handleSelectDemoRoom}
            isAnalyzing={isAnalyzing}
          />
        )}
      </main>

      {/* Floating Action Button for AI Chat when viewing a room */}
      {activeRoom && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-2xl border border-stone-700 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-stone-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold tracking-wide pr-1">Ask Declutter Coach</span>
        </button>
      )}

      {/* Slide-over Multi-Turn AI Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        roomContext={activeRoom?.analysis || null}
        roomTitle={activeRoom?.title}
      />

      {/* Quick 30-Second Item Triage Modal (Powered by gemini-3.1-flash-lite) */}
      <QuickItemTriageModal
        isOpen={isQuickTriageOpen}
        onClose={() => setIsQuickTriageOpen(false)}
        currentRoomContext={activeRoom ? `${activeRoom.roomType}: ${activeRoom.title}` : undefined}
      />

      {/* Saved Rooms / Vault Modal */}
      <RoomHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        savedRooms={savedRooms}
        activeRoomId={activeRoomId || undefined}
        onSelectRoom={handleSelectRoomFromHistory}
        onDeleteRoom={handleDeleteRoom}
        onNewScan={() => {
          handleNewScan();
          setIsHistoryModalOpen(false);
        }}
      />
    </div>
  );
}
