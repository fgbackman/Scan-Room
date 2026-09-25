import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { RoomType, GeminiModelChoice } from '../types';
import { DEMO_ROOMS, DemoRoom } from '../data/demoRooms';

interface RoomUploaderProps {
  onAnalyze: (params: {
    imageBase64: string;
    mimeType: string;
    roomTypeHint: string;
    focusGoals: string[];
    preferredModel: GeminiModelChoice;
    roomTitle?: string;
  }) => Promise<void>;
  onSelectDemoRoom: (demo: DemoRoom) => void;
  isAnalyzing: boolean;
}

const ROOM_TYPES: RoomType[] = [
  'Auto-Detect',
  'Home Office',
  'Living Room',
  'Bedroom',
  'Closet & Wardrobe',
  'Kitchen & Pantry',
  'Garage & Workshop',
  'Bathroom',
  'Kids Playroom',
  'Entryway & Mudroom',
];

const GOAL_OPTIONS = [
  'Minimalist Calm & Zen',
  'Maximize Hidden Storage',
  'Deep Work & Focus',
  'Family & Kid Safe',
  'Fast 15-Min Quick Wins',
  'Downsizing & Moving',
];

export const RoomUploader: React.FC<RoomUploaderProps> = ({
  onAnalyze,
  onSelectDemoRoom,
  isAnalyzing,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');
  const [roomType, setRoomType] = useState<RoomType>('Auto-Detect');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Minimalist Calm & Zen',
    'Maximize Hidden Storage',
  ]);
  const [preferredModel, setPreferredModel] = useState<GeminiModelChoice>('gemini-3.1-pro-preview');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 20MB. Please select a smaller photo.');
      return;
    }

    setMimeType(file.type || 'image/jpeg');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;
    setErrorMsg(null);
    try {
      await onAnalyze({
        imageBase64: selectedImage,
        mimeType,
        roomTypeHint: roomType,
        focusGoals: selectedGoals,
        preferredModel,
        roomTitle: fileName ? fileName.replace(/\.[^/.]+$/, '') : `${roomType} Scan`,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze room.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Hero Intro */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Next-Generation Spatial Organization AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif mb-3">
          Turn Room Chaos Into Calm
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Snap or upload a photo of your messy room, closet, desk, or kitchen.
          Gemini analyzes clutter patterns, identifies problem zones, and provides
          a prioritized step-by-step decluttering plan with storage recommendations.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Notice</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Upload Box & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Dropzone */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
              dragActive
                ? 'border-amber-500 bg-amber-500/5'
                : selectedImage
                ? 'border-stone-300 bg-stone-50'
                : 'border-stone-300 hover:border-amber-400 bg-stone-50/70 hover:bg-stone-50'
            } min-h-[340px] flex flex-col items-center justify-center p-6 text-center shadow-xs`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img
                  src={selectedImage}
                  alt="Room to analyze"
                  className="max-h-[300px] w-auto object-contain rounded-xl shadow-sm border border-stone-200"
                />
                <div className="mt-4 flex items-center gap-2 text-xs text-stone-600 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium truncate max-w-[200px]">{fileName || 'Photo ready'}</span>
                  <span className="text-stone-400">· Click or drop to replace</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-stone-900 font-semibold text-base">
                    Click to upload or drag photo here
                  </p>
                  <p className="text-stone-500 text-xs mt-1">
                    Supports high-res JPG, PNG, WEBP from your phone camera or gallery
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 bg-white px-3 py-1.5 rounded-md border border-stone-200 shadow-2xs">
                  <Camera className="w-3.5 h-3.5 text-stone-500" />
                  <span>Take photo or choose file</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Previews */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Or try an instant sample room:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {DEMO_ROOMS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => onSelectDemoRoom(demo)}
                  className="group relative rounded-xl border border-stone-200 overflow-hidden bg-white hover:border-amber-400 text-left transition-all hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <div className="aspect-video w-full overflow-hidden bg-stone-100">
                    <img
                      src={demo.thumbnailUrl}
                      alt={demo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {demo.roomType}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      Score: {demo.analysis.overallScore}/100
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Trigger */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sliders className="w-4 h-4 text-stone-500" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Declutter Audit Settings
            </h2>
          </div>

          {/* Room Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Room Category
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as RoomType)}
              className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            >
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Declutter Goals */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Primary Organization Priorities
            </label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((goal) => {
                const active = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      active
                        ? 'bg-stone-900 text-stone-50 border-stone-900 font-medium'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Vision Understanding Engine
            </label>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="model"
                  value="gemini-3.1-pro-preview"
                  checked={preferredModel === 'gemini-3.1-pro-preview'}
                  onChange={() => setPreferredModel('gemini-3.1-pro-preview')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <span>gemini-3.1-pro-preview</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                      High Precision
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Deep spatial reasoning, zone identification, and tailored storage architecture.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-stone-200">
                <input
                  type="radio"
                  name="model"
                  value="gemini-3.5-flash"
                  checked={preferredModel === 'gemini-3.5-flash'}
                  onChange={() => setPreferredModel('gemini-3.5-flash')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <span>gemini-3.5-flash</span>
                    <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                      Fast
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Rapid multimodal audit with quick action plan.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleStartAnalysis}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                !selectedImage
                  ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                  : isAnalyzing
                  ? 'bg-amber-400 text-stone-950 cursor-wait opacity-90'
                  : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Room with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Room & Generate Declutter Plan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              Analyzes spatial layout, items triage, and generates a personalized action checklist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
