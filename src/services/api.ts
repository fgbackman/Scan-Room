import { RoomAnalysisResult, ChatMessage, GeminiModelChoice, CoachRole } from '../types';

export async function analyzeRoomImage(params: {
  imageBase64: string;
  mimeType?: string;
  roomTypeHint?: string;
  focusGoals?: string[];
  preferredModel?: GeminiModelChoice;
}): Promise<RoomAnalysisResult> {
  const response = await fetch('/api/analyze-room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error (${response.status})`);
  }

  const result = await response.json();
  return result.data;
}

export async function sendChatMessage(params: {
  messages: Array<{ role: 'user' | 'model'; text: string }>;
  model: GeminiModelChoice;
  role: CoachRole;
  customSystemInstruction?: string;
  roomContext?: any;
}): Promise<{ text: string; modelUsed: string }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Chat error (${response.status})`);
  }

  const result = await response.json();
  return {
    text: result.text,
    modelUsed: result.modelUsed || params.model,
  };
}

export async function quickCategorizeItem(
  itemName: string,
  context?: string
): Promise<{ answer: string; modelUsed: string }> {
  const response = await fetch('/api/quick-categorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemName, context }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Quick triage error (${response.status})`);
  }

  const result = await response.json();
  return {
    answer: result.answer,
    modelUsed: result.modelUsed || 'gemini-3.1-flash-lite',
  };
}
