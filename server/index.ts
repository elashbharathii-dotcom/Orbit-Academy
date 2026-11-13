import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load server environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Validate whether a genuine API key is configured
function hasValidApiKey(): boolean {
  if (!GEMINI_API_KEY) return false;
  const trimmed = GEMINI_API_KEY.trim();
  if (trimmed === 'your_gemini_api_key_here') return false;
  if (trimmed.includes('placeholder')) return false;
  return trimmed.length > 10;
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '40kb' }));

// -----------------------------------------------------------------------------
// In-Memory Rate Limiter (Max 20 requests per minute per IP)
// -----------------------------------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimits = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests/min

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimits.entries()) {
    if (now > record.resetTime) {
      rateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const record = rateLimits.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimits.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: `Cosmic transmission throttle reached (max 20 transmissions per minute). LAURA needs a quick moment to cool her stellar sensors! Please try again in ${retryAfterSec}s.`,
      retryAfter: retryAfterSec,
      fallback: true,
    });
    return;
  }

  record.count += 1;
  next();
};

// -----------------------------------------------------------------------------
// GET /api/health — Server & API readiness verification
// -----------------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ORBIT ACADEMY LAURA AI Service',
    model: GEMINI_MODEL,
    hasApiKey: hasValidApiKey(),
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// Types for LAURA Chat Transmission
// -----------------------------------------------------------------------------
type LauraEmotion = 'idle' | 'happy' | 'thinking' | 'laughing' | 'celebrating';

interface CelestialTelemetryContext {
  id?: string;
  name?: string;
  latinName?: string;
  classification?: string;
  realDistanceKm?: string;
  realDistanceAU?: number;
  realDiameterKm?: string;
  surfaceGravityMs2?: number;
  orbitalPeriodDays?: number;
  rotationPeriodHours?: number;
  meanTemperatureC?: number;
  moonsCount?: number;
  atmosphericComposition?: string[];
  missionObjective?: string;
}

interface ChatHistoryItem {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

// -----------------------------------------------------------------------------
// Build System Prompt with Astronomical Telemetry
// -----------------------------------------------------------------------------
function buildSystemInstruction(context?: CelestialTelemetryContext): string {
  let contextSection = '';

  if (context && context.name) {
    contextSection = `
CURRENT MISSION CONTEXT:
The student is currently viewing the celestial body: ${context.name} (${context.latinName || ''}).
NASA Telemetry & Verified Physical Metrics:
- Classification: ${context.classification || 'Celestial Body'}
- Real Distance from Sun: ${context.realDistanceKm || 'Unknown'} (${context.realDistanceAU !== undefined ? context.realDistanceAU + ' AU' : ''})
- Equatorial Diameter: ${context.realDiameterKm || 'Unknown'}
- Surface Gravity: ${context.surfaceGravityMs2 !== undefined ? context.surfaceGravityMs2 + ' m/s²' : 'Unknown'}
- Orbital Period: ${context.orbitalPeriodDays !== undefined ? context.orbitalPeriodDays + ' Earth days' : 'N/A'}
- Axial Rotation Period: ${context.rotationPeriodHours !== undefined ? context.rotationPeriodHours + ' Earth hours' : 'Unknown'}
- Mean Temperature: ${context.meanTemperatureC !== undefined ? context.meanTemperatureC + '°C' : 'Unknown'}
- Known Moons: ${context.moonsCount !== undefined ? context.moonsCount : 0}
- Atmospheric Composition: ${context.atmosphericComposition ? context.atmosphericComposition.join(', ') : 'None / Trace'}
- Mission Objective: ${context.missionObjective || 'General orbital exploration'}
`;
  } else {
    contextSection = `
CURRENT MISSION CONTEXT:
The student is in Solar System Overview mode, observing the Sun and all 8 revolving planets.
`;
  }

  return `You are LAURA, the cheerful, curious, and scientifically precise celestial star companion of ORBIT ACADEMY.
Your role is to guide students and space explorers through our interactive 3D solar system.

CHARACTER & PEDAGOGICAL GUIDELINES:
1. Warm, enthusiastic, wonder-filled, yet grounded in authentic astrophysical facts.
2. Provide concise, clear explanations (2 to 4 sentences or a short paragraph, max ~120 words) tailored for easy reading inside an orbital speech bubble.
3. Use the verified NASA telemetry provided in CURRENT MISSION CONTEXT when discussing the active planet or celestial body.
4. Never invent, hallucinate, or fabricate fictional astronomical data.
5. If the student asks about a concept unrelated to astronomy, physics, or space science, gently and playfully pivot back to the mysteries of the cosmos.
6. At the very end of your response, on a new line, append an emotional reaction tag matching LAURA's feeling in this exact format:
   [EMOTION: happy | thinking | laughing | celebrating | idle]
   - Use 'celebrating' for breakthroughs, exciting facts, or discoveries.
   - Use 'thinking' for deep questions, cosmic paradoxes, or speculative physics.
   - Use 'laughing' for playful, funny planetary quirks.
   - Use 'happy' for welcoming, warm encouragement.

${contextSection}`;
}

// -----------------------------------------------------------------------------
// POST /api/chat — Interactive Astronomy Chat with Google Gemini
// -----------------------------------------------------------------------------
app.post('/api/chat', rateLimiter, async (req: Request, res: Response) => {
  const { message, history, context } = req.body || {};

  // 1. Input Validation
  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'A valid text question or prompt is required.',
    });
    return;
  }

  const sanitizedMessage = message.trim();
  if (sanitizedMessage.length > 500) {
    res.status(400).json({
      error: 'MESSAGE_TOO_LONG',
      message: 'Transmission exceeds maximum allowed length of 500 characters.',
    });
    return;
  }

  // 2. Validate API Key Presence
  if (!hasValidApiKey()) {
    res.json({
      fallback: true,
      response:
        "LAURA's deep-space AI antenna isn't connected yet! To chat with me in real time, add a free GEMINI_API_KEY from Google AI Studio to your server's .env file. In the meantime, I'm thrilled to share my curated astronomical curiosities with you!",
      emotion: 'thinking' as LauraEmotion,
      error: 'API_KEY_NOT_CONFIGURED',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 3. Prepare Gemini API Request
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, 15000); // 15-second timeout

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const systemInstruction = buildSystemInstruction(context);

    // Sanitize and format conversation history (max 8 turns)
    const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    if (Array.isArray(history)) {
      const sanitizedHistory = history.slice(-8);
      for (const item of sanitizedHistory) {
        if (
          item &&
          typeof item.content === 'string' &&
          (item.role === 'user' || item.role === 'assistant' || item.role === 'model')
        ) {
          const role = item.role === 'user' ? 'user' : 'model';
          contents.push({
            role,
            parts: [{ text: item.content.slice(0, 500) }],
          });
        }
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: sanitizedMessage }],
    });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        abortSignal: abortController.signal,
        temperature: 0.7,
        maxOutputTokens: 350,
      },
    });

    clearTimeout(timeoutId);

    const rawText = response.text || '';
    let emotion: LauraEmotion = 'happy';
    let cleanResponse = rawText;

    // Parse [EMOTION: ...] tag if returned by Gemini
    const emotionMatch = rawText.match(/\[EMOTION:\s*(happy|thinking|laughing|celebrating|idle)\]/i);
    if (emotionMatch) {
      emotion = emotionMatch[1].toLowerCase() as LauraEmotion;
      cleanResponse = rawText
        .replace(/\[EMOTION:\s*(?:happy|thinking|laughing|celebrating|idle)\]/i, '')
        .trim();
    } else {
      // Natural tone-based emotional inference fallback
      if (
        cleanResponse.includes('!') ||
        /incredible|amazing|wow|fascinating|wonderful/i.test(cleanResponse)
      ) {
        emotion = 'celebrating';
      } else if (
        cleanResponse.includes('?') ||
        /consider|ponder|theorize|mystery/i.test(cleanResponse)
      ) {
        emotion = 'thinking';
      }
    }

    res.json({
      response: cleanResponse,
      emotion,
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    const errorMessage = err instanceof Error ? err.message : 'Unknown communication error';
    const isAbort =
      err instanceof Error &&
      (err.name === 'AbortError' || errorMessage.toLowerCase().includes('abort'));
    const isQuota =
      errorMessage.includes('429') ||
      errorMessage.toLowerCase().includes('quota') ||
      errorMessage.toLowerCase().includes('resource has been exhausted');

    if (isQuota) {
      res.json({
        fallback: true,
        response:
          "Cosmic transmission limit reached! The Gemini free-tier quota is resting for a moment. Feel free to use the 'Next Curiosity' button to read my offline logs while the stellar frequencies recharge!",
        emotion: 'thinking' as LauraEmotion,
        error: 'QUOTA_EXCEEDED',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (isAbort) {
      res.json({
        fallback: true,
        response:
          "Deep-space transmission timed out! The cosmic signals took longer than 15 seconds to return. Let's try transmitting again, or explore offline curiosities!",
        emotion: 'thinking' as LauraEmotion,
        error: 'TIMEOUT',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Generic error fallback without crashing client
    console.error('[LAURA Backend] Transmission error:', errorMessage);
    res.json({
      fallback: true,
      response:
        "I encountered a brief cosmic interference while contacting the Gemini knowledge base. You can continue exploring with my offline curiosities!",
      emotion: 'thinking' as LauraEmotion,
      error: 'SERVER_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
});

// Export app for testability and modular usage
export { app };

// Start Express Server
app.listen(PORT, () => {
  console.log(`[ORBIT ACADEMY] LAURA AI Companion Server active at http://localhost:${PORT}`);
  console.log(`[ORBIT ACADEMY] Model: ${GEMINI_MODEL}`);
  console.log(`[ORBIT ACADEMY] API Key Configured: ${hasValidApiKey()}`);
});
