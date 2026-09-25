import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '30mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_SYSTEM_INSTRUCTION = `You are ClutterSense AI, an elite interior decluttering coach, master professional space organizer, and spatial layout architect.
Your approach blends Marie Kondo's intentionality, professional 5S organization methodology (Sort, Set in order, Shine, Standardize, Sustain), and modern functional interior ergonomics.
You are warm, non-judgmental, structured, and pragmatic. You provide clear, step-by-step guidance, actionable storage product recommendations, and space-saving layout tips. Always celebrate the user's initiative to transform their living space.`;

// POST /api/analyze-room
app.post('/api/analyze-room', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', roomTypeHint = 'Auto-Detect', focusGoals = [] } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required.' });
    }

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const goalsText = Array.isArray(focusGoals) && focusGoals.length > 0
      ? `User's key organizational priorities: ${focusGoals.join(', ')}.`
      : 'General comprehensive declutter and functional organization.';

    const promptText = `Analyze this room photograph in detail.
Room context hint: ${roomTypeHint}.
${goalsText}

Perform a rigorous, empathetic, and actionable visual declutter and organization audit.
Return your evaluation adhering strictly to the JSON schema:
1. Identify the room type and current condition.
2. Provide an overall Organization Score from 1-100 (where 1 is extreme chaos and 100 is pristine functional haven).
3. Score the 4 key metrics (1-10 scale): surfaceClutter, storageUtilization, floorPathways, and visualCalmIndex.
4. Pinpoint specific problem zones visible in the photo.
5. Create an item triage plan (keep & relocate, donate/gift, sell, recycle/trash).
6. Provide a prioritized, phased action plan (Quick wins, Zone sorting, and System setup).
7. Suggest tangible storage solutions or furniture rearrangement tips.
8. Include an uplifting, motivating summary statement.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    // Primary model as required: gemini-3.1-pro-preview
    let targetModel = req.body.preferredModel || 'gemini-3.1-pro-preview';
    let response;
    let modelUsed = targetModel;

    const schemaConfig = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roomType: { type: Type.STRING, description: 'Detected or confirmed room type (e.g. Home Office, Bedroom, Kitchen, Living Room, Closet, Garage, Pantry)' },
          overallScore: { type: Type.INTEGER, description: 'Organization score 1 to 100' },
          clutterLevel: { type: Type.STRING, description: 'One of: Minimal, Moderate, Substantial, Severe' },
          executiveSummary: { type: Type.STRING, description: 'Warm, realistic overview of the room potential and current clutter state' },
          metrics: {
            type: Type.OBJECT,
            properties: {
              surfaceClutter: { type: Type.INTEGER, description: '1-10 scale where 10 is heavily cluttered surfaces' },
              storageUtilization: { type: Type.INTEGER, description: '1-10 scale where 10 is optimal smart storage' },
              floorPathways: { type: Type.INTEGER, description: '1-10 scale where 10 is completely clear walkways' },
              visualCalmIndex: { type: Type.INTEGER, description: '1-10 scale where 10 is zen visual harmony' },
            },
            required: ['surfaceClutter', 'storageUtilization', 'floorPathways', 'visualCalmIndex'],
          },
          identifiedZones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING, description: 'Zone name, e.g. Desk Surface, Corner Pile, Open Shelving, Floor Area' },
                status: { type: Type.STRING, description: 'Critical Attention | Needs Tweaking | Well Organized' },
                observation: { type: Type.STRING, description: 'What is currently observed in this zone' },
                actionRequired: { type: Type.STRING, description: 'Immediate decluttering or organizing action' },
              },
              required: ['id', 'name', 'status', 'observation', 'actionRequired'],
            },
          },
          itemTriage: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: 'Keep & Relocate | Donate / Gift | Sell / Consign | Recycle / Trash' },
                itemNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific items spotted or inferred' },
                rationale: { type: Type.STRING, description: 'Why this action is recommended' },
                suggestedDestination: { type: Type.STRING, description: 'Where it belongs or who to give it to' },
              },
              required: ['category', 'itemNames', 'rationale', 'suggestedDestination'],
            },
          },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING, description: 'e.g. Phase 1: 5-Minute Quick Wins, Phase 2: 20-Minute Triage, Phase 3: System Organization' },
                estimatedMinutes: { type: Type.INTEGER, description: 'Estimated time in minutes' },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      difficulty: { type: Type.STRING, description: 'Easy | Medium | Challenging' },
                      tips: { type: Type.STRING },
                    },
                    required: ['id', 'title', 'description', 'difficulty'],
                  },
                },
              },
              required: ['phase', 'estimatedMinutes', 'tasks'],
            },
          },
          storageSolutions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Product or organizer name, e.g. Clear Stackable Bins, Cable Raceway' },
                targetZone: { type: Type.STRING },
                purpose: { type: Type.STRING },
                budgetLevel: { type: Type.STRING, description: '$ | $$ | $$$' },
                diyAlternative: { type: Type.STRING, description: 'Zero-cost or DIY alternative using household items' },
              },
              required: ['title', 'targetZone', 'purpose', 'budgetLevel', 'diyAlternative'],
            },
          },
          spatialLayoutTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Furniture placement, light optimization, and flow recommendations',
          },
          motivationalQuote: { type: Type.STRING, description: 'Short inspiring encouragement' },
        },
        required: [
          'roomType',
          'overallScore',
          'clutterLevel',
          'executiveSummary',
          'metrics',
          'identifiedZones',
          'itemTriage',
          'actionPlan',
          'storageSolutions',
          'spatialLayoutTips',
          'motivationalQuote',
        ],
      },
    };

    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
          ...schemaConfig,
        },
      });
    } catch (primaryErr: any) {
      console.warn(`Primary model ${targetModel} failed: ${primaryErr.message}. Attempting fallback to gemini-3.5-flash...`);
      // Fallback model
      targetModel = 'gemini-3.5-flash';
      modelUsed = targetModel;
      response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
          ...schemaConfig,
        },
      });
    }

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);
    parsedData.modelUsed = modelUsed;

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing room:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze room image. Please try again.',
    });
  }
});

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      model = 'gemini-3.5-flash',
      role = 'master_organizer',
      customSystemInstruction,
      roomContext,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Role-based system instruction
    let systemInstruction = DEFAULT_SYSTEM_INSTRUCTION;
    if (role === 'konmari') {
      systemInstruction = `You are a mindful decluttering master guided by the KonMari method.
You believe in treating possessions with gratitude, touching each item to see if it sparks genuine joy, tidying by category (Clothes, Books, Papers, Komono, Sentimental), and visualizing the ideal lifestyle. Your tone is serene, respectful, poetic, and encouraging.`;
    } else if (role === 'swedish_death') {
      systemInstruction = `You are a warm, practical Scandinavian minimalist inspired by Swedish Death Cleaning (Döstädning).
You believe in freeing oneself and loved ones from overwhelming burdens of unneeded possessions. You speak with humorous honesty, gentle clarity, and deep affection, helping users let go of what they no longer need while treasuring meaningful memories.`;
    } else if (role === 'speed_organizer') {
      systemInstruction = `You are an energetic, fast-action declutter coach. You focus on high-speed 5-minute sprints, the 20/20 rule, the "One Touch" rule, and rapid decision matrices. You keep answers concise, actionable, and punchy.`;
    }

    if (customSystemInstruction) {
      systemInstruction += `\nAdditional user guidelines: ${customSystemInstruction}`;
    }

    if (roomContext) {
      systemInstruction += `\nCurrent Room Context for this conversation:
Room Type: ${roomContext.roomType || 'Unknown'}
Clutter Level: ${roomContext.clutterLevel || 'Assessed'}
Identified Zones: ${(roomContext.identifiedZones || []).map((z: any) => z.name).join(', ')}
Executive Summary: ${roomContext.executiveSummary || ''}`;
    }

    // Model selection logic matching user request:
    // gemini-3.1-pro-preview for particularly complex tasks
    // gemini-3.5-flash for general tasks
    // gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = model;
    if (!['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'].includes(selectedModel)) {
      selectedModel = 'gemini-3.5-flash';
    }

    // Format messages for @google/genai
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    let response;
    let modelUsed = selectedModel;

    try {
      response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    } catch (err: any) {
      console.warn(`Chat model ${selectedModel} failed: ${err.message}. Trying gemini-3.5-flash fallback...`);
      selectedModel = 'gemini-3.5-flash';
      modelUsed = selectedModel;
      response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    }

    return res.json({
      success: true,
      text: response.text || '',
      modelUsed,
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.status(500).json({
      error: error.message || 'Chat generation failed. Please try again.',
    });
  }
});

// POST /api/quick-categorize (Fast triage using gemini-3.1-flash-lite)
app.post('/api/quick-categorize', async (req: Request, res: Response) => {
  try {
    const { itemName, context = '' } = req.body;
    if (!itemName) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const prompt = `Item: "${itemName}". Context: "${context}".
Rapidly advise:
1. Verdict: Keep, Relocate, Donate, Sell, or Toss?
2. 2-sentence rationale with actionable decision rule (e.g. 20/20 rule, 1-year rule).
3. Best storage placement or donation avenue.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: 'You are an ultra-fast decluttering decision bot. Give immediate, punchy, pragmatic recommendations in under 50 words.',
      },
    });

    return res.json({ success: true, answer: response.text, modelUsed: 'gemini-3.1-flash-lite' });
  } catch (error: any) {
    console.error('Error in quick-categorize:', error);
    return res.status(500).json({ error: error.message || 'Quick triage failed.' });
  }
});

// Vite middleware in dev, static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = 3000;

  if (isProduction) {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClutterSense AI server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
