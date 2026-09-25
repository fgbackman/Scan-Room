import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Package,
  Layers,
  Layout,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Share2,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { RoomAnalysisResult, ActionTask } from '../types';

interface AnalysisDashboardProps {
  analysis: RoomAnalysisResult;
  imageUrl: string;
  roomTitle: string;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onOpenChatWithContext: () => void;
  onOpenQuickTriage: () => void;
  onNewScan: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  imageUrl,
  roomTitle,
  completedTaskIds,
  onToggleTask,
  onOpenChatWithContext,
  onOpenQuickTriage,
  onNewScan,
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'triage' | 'zones' | 'storage'>('plan');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute total tasks and completed count
  const allTasks: ActionTask[] = analysis.actionPlan.flatMap((p) => p.tasks);
  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Clutter level color styling
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const copyPlanMarkdown = () => {
    let md = `# Declutter Plan for ${roomTitle} (${analysis.roomType})\n`;
    md += `Organization Score: ${analysis.overallScore}/100 | Clutter: ${analysis.clutterLevel}\n\n`;
    md += `## Executive Summary\n${analysis.executiveSummary}\n\n`;
    md += `## Phased Action Plan\n`;
    analysis.actionPlan.forEach((phase) => {
      md += `### ${phase.phase} (~${phase.estimatedMinutes} mins)\n`;
      phase.tasks.forEach((t) => {
        const isDone = completedTaskIds.includes(t.id) ? '[x]' : '[ ]';
        md += `- ${isDone} **${t.title}** (${t.difficulty}): ${t.description}\n`;
        if (t.tips) md += `  *Tip: ${t.tips}*\n`;
      });
      md += `\n`;
    });
    md += `## Item Triage\n`;
    analysis.itemTriage.forEach((group) => {
      md += `### ${group.category}\nItems: ${group.itemNames.join(', ')}\nRationale: ${group.rationale}\nDestination: ${group.suggestedDestination}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload Another Room</span>
          </button>
          <span className="text-stone-300">|</span>
          <span className="text-xs text-stone-500 font-medium">
            Analyzed with <span className="font-semibold text-stone-700">{analysis.modelUsed || 'gemini-3.1-pro-preview'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyPlanMarkdown}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copied ? 'Copied to Clipboard!' : 'Export Plan (Markdown)'}</span>
          </button>

          <button
            onClick={onOpenChatWithContext}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Gemini About This Room</span>
          </button>
        </div>
      </div>

      {/* Main Room Card & Overview Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Room Photo & Overall Score */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 shadow-sm aspect-4/3 group">
            <img
              src={imageUrl}
              alt={roomTitle}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                {analysis.roomType}
              </span>
              <h2 className="text-white text-xl font-bold tracking-tight mt-0.5">
                {roomTitle}
              </h2>
            </div>
          </div>

          {/* Overall Organization Score Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Organization Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-stone-900 font-serif">
                    {analysis.overallScore}
                  </span>
                  <span className="text-stone-400 text-sm font-medium">/ 100</span>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${getScoreColor(
                  analysis.overallScore
                )}`}
              >
                {analysis.clutterLevel} Clutter
              </div>
            </div>

            {/* Checklist Completion Progress */}
            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
                <span className="font-medium">Action Checklist Progress</span>
                <span className="font-semibold text-stone-900">
                  {completedCount} of {totalTasks} tasks done ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 4 Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                Surface Clutter
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold text-stone-900 font-serif">
                  {analysis.metrics.surfaceClutter}
                  <span className="text-xs font-normal text-stone-400">/10</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  {analysis.metrics.surfaceClutter > 6 ? 'Dense' : 'Moderate'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                Storage Efficiency
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold text-stone-900 font-serif">
                  {analysis.metrics.storageUtilization}
                  <span className="text-xs font-normal text-stone-400">/10</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  {analysis.metrics.storageUtilization < 5 ? 'Under-utilized' : 'Good'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                Floor Pathways
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold text-stone-900 font-serif">
                  {analysis.metrics.floorPathways}
                  <span className="text-xs font-normal text-stone-400">/10</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  {analysis.metrics.floorPathways > 6 ? 'Clear' : 'Obstructed'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                Visual Calm Index
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold text-stone-900 font-serif">
                  {analysis.metrics.visualCalmIndex}
                  <span className="text-xs font-normal text-stone-400">/10</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  {analysis.metrics.visualCalmIndex > 6 ? 'Harmonious' : 'High Noise'}
                </span>
              </div>
            </div>
          </div>

          {/* Motivational Quote Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-800 text-xs italic leading-relaxed">
            <p className="font-serif text-stone-900 text-sm not-italic mb-1 font-semibold">
              Coach’s Perspective
            </p>
            {analysis.motivationalQuote}
          </div>
        </div>

        {/* Right Column: Detailed Blueprint Tabs & Content */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Spatial Diagnosis & Potential</span>
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed">
              {analysis.executiveSummary}
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'plan'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Phased Action Plan</span>
              <span className="text-[10px] bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                {totalTasks}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('triage')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'triage'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              <span>4-Box Item Triage</span>
              <span className="text-[10px] bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                {analysis.itemTriage.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('zones')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'zones'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              <span>Identified Zones</span>
              <span className="text-[10px] bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                {analysis.identifiedZones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'storage'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Smart Storage</span>
              <span className="text-[10px] bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                {analysis.storageSolutions.length}
              </span>
            </button>
          </div>

          {/* TAB 1: PHASED ACTION PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {analysis.actionPlan.map((phase, pIdx) => (
                <div
                  key={phase.phase}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
                >
                  <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-stone-900 text-stone-100 text-xs font-bold flex items-center justify-center">
                        {pIdx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900">
                        {phase.phase}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>~{phase.estimatedMinutes} mins</span>
                    </div>
                  </div>

                  <div className="divide-y divide-stone-100 p-2">
                    {phase.tasks.map((task) => {
                      const isCompleted = completedTaskIds.includes(task.id);
                      return (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(task.id)}
                          className={`p-3.5 rounded-xl cursor-pointer transition-colors flex items-start gap-3.5 ${
                            isCompleted
                              ? 'bg-emerald-50/50 text-stone-500'
                              : 'hover:bg-stone-50 text-stone-800'
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-sm font-semibold ${
                                  isCompleted
                                    ? 'line-through text-stone-400'
                                    : 'text-stone-900'
                                }`}
                              >
                                {task.title}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                  task.difficulty === 'Easy'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : task.difficulty === 'Medium'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {task.difficulty}
                              </span>
                            </div>

                            <p
                              className={`text-xs mt-1 leading-relaxed ${
                                isCompleted ? 'text-stone-400' : 'text-stone-600'
                              }`}
                            >
                              {task.description}
                            </p>

                            {task.tips && (
                              <div className="mt-2 text-[11px] text-stone-500 flex items-start gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span>{task.tips}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ITEM TRIAGE (THE 4-BOX MATRIX) */}
          {activeTab === 'triage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>The 4-Box Sorting Method: Categorize every visible object.</span>
                <button
                  onClick={onOpenQuickTriage}
                  className="inline-flex items-center gap-1 text-amber-700 font-semibold hover:underline"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Unsure about an item? Speed Triage</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.itemTriage.map((group) => {
                  let accent = 'border-emerald-200 bg-emerald-50/40 text-emerald-900';
                  let badge = 'bg-emerald-100 text-emerald-800';

                  if (group.category === 'Donate / Gift') {
                    accent = 'border-blue-200 bg-blue-50/40 text-blue-900';
                    badge = 'bg-blue-100 text-blue-800';
                  } else if (group.category === 'Sell / Consign') {
                    accent = 'border-amber-200 bg-amber-50/40 text-amber-900';
                    badge = 'bg-amber-100 text-amber-800';
                  } else if (group.category === 'Recycle / Trash') {
                    accent = 'border-rose-200 bg-rose-50/40 text-rose-900';
                    badge = 'bg-rose-100 text-rose-800';
                  }

                  return (
                    <div
                      key={group.category}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${badge}`}>
                            {group.category}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {group.itemNames.length} items
                          </span>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          {group.itemNames.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs font-medium text-stone-800 flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
                        <div>
                          <span className="text-stone-400 font-medium">Why: </span>
                          <span className="text-stone-600">{group.rationale}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 font-medium">Destination: </span>
                          <span className="text-stone-900 font-semibold">
                            {group.suggestedDestination}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: IDENTIFIED ZONES & SPATIAL FLOW */}
          {activeTab === 'zones' && (
            <div className="space-y-6">
              {/* Problem Zones List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Target Areas in Photo
                </h4>
                {analysis.identifiedZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <h5 className="font-bold text-stone-900 text-sm">{zone.name}</h5>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                          zone.status === 'Critical Attention'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : zone.status === 'Needs Tweaking'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {zone.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                        <span className="font-semibold text-stone-700 block mb-1">
                          Current Observation:
                        </span>
                        <p className="text-stone-600 leading-relaxed">{zone.observation}</p>
                      </div>

                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                        <span className="font-semibold text-amber-900 block mb-1">
                          Direct Remedy:
                        </span>
                        <p className="text-amber-800 leading-relaxed">{zone.actionRequired}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Spatial Layout Tips */}
              {analysis.spatialLayoutTips && analysis.spatialLayoutTips.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Layout className="w-4 h-4 text-stone-600" />
                    <span>Spatial Flow & Ergonomic Tips</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysis.spatialLayoutTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-stone-700 flex items-start gap-2.5 leading-relaxed"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SMART STORAGE SOLUTIONS */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500">
                Curated organizer concepts tailored specifically to this room’s clutter zones.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.storageSolutions.map((sol, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                          Zone: {sol.targetZone}
                        </span>
                        <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {sol.budgetLevel}
                        </span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-sm">{sol.title}</h5>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {sol.purpose}
                      </p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 text-xs">
                      <span className="font-semibold text-stone-800 flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Zero-Cost DIY Alternative:</span>
                      </span>
                      <p className="text-stone-600 leading-relaxed">{sol.diyAlternative}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Chat Prompt Callout */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-stone-100 font-serif">
                Have specific questions about this room?
              </h4>
              <p className="text-xs text-stone-400 max-w-md">
                Chat multi-turn with our Gemini Declutter Coach with this room’s visual analysis already loaded into memory.
              </p>
            </div>
            <button
              onClick={onOpenChatWithContext}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch Gemini Coach</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
