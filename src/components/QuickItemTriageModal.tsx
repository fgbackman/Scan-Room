import React, { useState } from 'react';
import { X, Zap, Loader2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { quickCategorizeItem } from '../services/api';

interface QuickItemTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomContext?: string;
}

const COMMON_DILEMMAS = [
  'Box of unknown charging cables',
  'Tax returns from 2018',
  'Duplicate vegetable peelers',
  'Half-used hotel shampoos',
  'High school sports trophy',
  'Clothes that might fit next year',
];

export const QuickItemTriageModal: React.FC<QuickItemTriageModalProps> = ({
  isOpen,
  onClose,
  currentRoomContext,
}) => {
  const [itemName, setItemName] = useState<string>('');
  const [context, setContext] = useState<string>(currentRoomContext || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ answer: string; modelUsed: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriage = async (itemToSubmit?: string) => {
    const item = (itemToSubmit || itemName).trim();
    if (!item || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await quickCategorizeItem(item, context);
      setResult(response);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick triage failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">
                Instant Item Speed Triage
              </h3>
              <p className="text-[11px] text-stone-400">
                Powered by Gemini 3.1 Flash Lite for 3-second verdicts
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

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              What item are you debating?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTriage()}
                placeholder="e.g. 5 unused gym water bottles, manual from 2016 fridge..."
                className="flex-1 text-sm bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => handleTriage()}
                disabled={!itemName.trim() || isLoading}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
              Common clutter dilemmas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DILEMMAS.map((dilemma, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setItemName(dilemma);
                    handleTriage(dilemma);
                  }}
                  className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg transition-colors text-left"
                >
                  {dilemma}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Coach Verdict</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {result.modelUsed}
                </span>
              </div>
              <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
                {result.answer}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
