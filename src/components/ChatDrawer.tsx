import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  HelpCircle,
  Minimize2,
  Maximize2,
  Trash2,
  Loader2,
  CheckCircle,
  Paperclip
} from 'lucide-react';
import { ChatMessage, GeminiModelChoice, CoachRole, RoomAnalysisResult } from '../types';
import { sendChatMessage } from '../services/api';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomContext?: RoomAnalysisResult | null;
  roomTitle?: string;
}

const COACH_ROLES: Array<{
  id: CoachRole;
  title: string;
  icon: string;
  desc: string;
}> = [
  {
    id: 'master_organizer',
    title: 'Master Space Strategist',
    icon: '🛋️',
    desc: 'Ergonomic 5S organization, functional layout zoning & sustainable systems.',
  },
  {
    id: 'konmari',
    title: 'KonMari Joy Mentor',
    icon: '✨',
    desc: 'Gratitude for items, spark-joy discernment & mindful category tidying.',
  },
  {
    id: 'swedish_death',
    title: 'Scandinavian Realist',
    icon: '🌿',
    desc: 'Swedish Death Cleaning: unburdening your home with warmth & honesty.',
  },
  {
    id: 'speed_organizer',
    title: '15-Min Sprint Coach',
    icon: '⚡',
    desc: 'Rapid decisions, high-speed momentum & quick tactical wins.',
  },
];

const MODEL_OPTIONS: Array<{
  id: GeminiModelChoice;
  name: string;
  tag: string;
  badge: string;
}> = [
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    tag: 'Complex Tasks',
    badge: 'Deep Architecture',
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    tag: 'General Tasks',
    badge: 'Balanced & Thorough',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Fast Tasks',
    badge: 'Lightning Speed',
  },
];

const SUGGESTED_PROMPTS = [
  'How do I begin the 5-minute quick win right now?',
  'What should I do with sentimental letters and photos?',
  'How do I organize this room on a zero-dollar budget?',
  'What is the best way to handle cords and tech chargers?',
  'How can I prevent this space from cluttering up again?',
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  roomContext,
  roomTitle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<CoachRole>('master_organizer');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [attachRoomContext, setAttachRoomContext] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize welcoming message
  useEffect(() => {
    if (messages.length === 0) {
      const initialText = roomContext
        ? `Hello! I'm your ClutterSense AI Coach. I see your ${roomContext.roomType} (${roomTitle || 'Room'}) with an Organization Score of ${roomContext.overallScore}/100. How can I help you tackle this space today?`
        : `Hello! I'm your ClutterSense AI Coach. Tell me about any room or clutter roadblock you're facing, or ask for advice on categorizing specific items!`;

      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: initialText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        },
      ]);
    }
  }, [roomContext, roomTitle]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsSending(true);

    try {
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await sendChatMessage({
        messages: apiMessages,
        model: selectedModel,
        role: selectedRole,
        roomContext: attachRoomContext && roomContext ? roomContext : undefined,
      });

      const assistantMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Error: ${err.message || 'Could not connect to Gemini.'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: 'Chat history cleared. What space shall we focus on next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      <div
        className={`bg-white h-full shadow-2xl flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-full md:w-3/4 max-w-4xl' : 'w-full md:w-[500px]'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white font-serif">
                  Gemini Declutter Coach
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30 font-semibold">
                  Multi-Turn
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Personalized organization strategy & item triage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors hidden sm:block"
              title={isExpanded ? 'Minimize drawer' : 'Expand drawer'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={clearChat}
              className="p-1.5 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Coach Settings Ribbon */}
        <div className="bg-stone-50 border-b border-stone-200 p-3 space-y-2.5">
          {/* Persona & Model controls */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Coach Persona Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Coach Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as CoachRole)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {COACH_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.icon} {role.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Gemini Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as GeminiModelChoice)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.tag})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room Context Active Badge */}
          {roomContext && (
            <div className="flex items-center justify-between pt-1 text-[11px] border-t border-stone-200/60">
              <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachRoomContext}
                  onChange={(e) => setAttachRoomContext(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 text-xs"
                />
                <span>Attach visual context: <strong className="text-stone-800">{roomTitle || roomContext.roomType}</strong></span>
              </label>
              <span className="text-stone-400">Score: {roomContext.overallScore}/100</span>
            </div>
          )}
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-100/50">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isModel ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isModel
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-stone-900 text-white'
                  }`}
                >
                  {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isModel
                      ? 'bg-white border border-stone-200 text-stone-800'
                      : 'bg-stone-900 text-white font-normal'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`mt-1.5 text-[10px] flex items-center gap-1.5 ${
                      isModel ? 'text-stone-400' : 'text-stone-400 justify-end'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{msg.modelUsed}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-3.5 text-xs text-stone-500 shadow-2xs flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Coach is analyzing with {selectedModel}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="p-2.5 bg-stone-50 border-t border-stone-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isSending}
              className="text-[11px] bg-white hover:bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200 shrink-0 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about decluttering, zoning, or item decisions..."
              disabled={isSending}
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl pl-3 pr-12 py-2 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                !inputText.trim() || isSending
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-2xs'
              }`}
              title="Send message (Enter)"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1.5 px-1">
            <span>Press Enter to send, Shift+Enter for newline</span>
            <span className="font-mono text-[10px]">
              {selectedModel === 'gemini-3.1-pro-preview'
                ? 'Deep Complex Mode'
                : selectedModel === 'gemini-3.1-flash-lite'
                ? 'Ultra Fast Mode'
                : 'Balanced Mode'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
