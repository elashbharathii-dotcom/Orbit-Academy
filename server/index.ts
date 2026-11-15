import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  getApod,
  GIBS_AVAILABLE_LAYERS,
  getGibsWmsUrl,
  getNeoWsFeed,
  getDonkiSpaceWeather,
  getComprehensiveSpaceWeather,
  getDonkiFlares,
  getDonkiCmes,
  getDonkiGeomagneticStorms,
  getDonkiSepEvents,
  getDonkiNotifications,
  searchNasaMedia,
  getExoplanets,
  getEpicImages,
  getEonetEvents,
  getNasaTrekCatalog,
  getNasaTrekLayers,
  getNasaTrekNomenclature,
  getNasaTrekBookmarks,
  getNasaPowerPointData,
} from './nasaService';
import {
  getOsdrDatasetsList,
  getOsdrStudyMetadata,
  getOsdrAssays,
  getOsdrFiles,
  searchOsdrCatalog,
  getOsdrResearchStats,
} from './services/nasaOsdrService';

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
    service: 'ORBIT ACADEMY NASA Open Science & LAURA AI Service',
    model: GEMINI_MODEL,
    hasGeminiKey: hasValidApiKey(),
    hasNasaKey: Boolean(process.env.NASA_API_KEY && process.env.NASA_API_KEY !== 'DEMO_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// NASA OPEN API PROXY ENDPOINTS
// -----------------------------------------------------------------------------

// 1. NASA APOD (Astronomy Picture of the Day)
app.get('/api/nasa/apod', async (req: Request, res: Response) => {
  try {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const result = await getApod(date);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA APOD', details: String(err) });
  }
});

// 2. NASA GIBS Satellite Layers & Direct Imagery URL
app.get('/api/nasa/gibs/layers', (_req: Request, res: Response) => {
  res.json({
    layers: GIBS_AVAILABLE_LAYERS,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/nasa/gibs/url', (req: Request, res: Response) => {
  const layer = typeof req.query.layer === 'string' ? req.query.layer : 'MODIS_Terra_CorrectedReflectance_TrueColor';
  const date = typeof req.query.date === 'string' ? req.query.date : new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const bbox = typeof req.query.bbox === 'string' ? req.query.bbox : '-90,-180,90,180';
  const url = getGibsWmsUrl(layer, date, bbox);
  res.json({ url, layer, date, bbox });
});

// NASA POWER Solar Irradiance & Meteorology
app.get('/api/nasa/power/point', async (req: Request, res: Response) => {
  try {
    const lat = typeof req.query.lat === 'string' ? parseFloat(req.query.lat) : 0;
    const lon = typeof req.query.lon === 'string' ? parseFloat(req.query.lon) : 0;
    const data = await getNasaPowerPointData(lat, lon);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA POWER data', details: String(err) });
  }
});

// 3. NASA NeoWs Near-Earth Asteroid Tracking
app.get('/api/nasa/neows/feed', async (req: Request, res: Response) => {
  try {
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const result = await getNeoWsFeed(startDate, endDate);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA NeoWs feed', details: String(err) });
  }
});

// 4. NASA DONKI Space Weather Dashboard & Real-Time Command Center
app.get('/api/nasa/donki/summary', async (_req: Request, res: Response) => {
  try {
    const result = await getDonkiSpaceWeather();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA DONKI space weather', details: String(err) });
  }
});

app.get('/api/nasa/donki/comprehensive', async (_req: Request, res: Response) => {
  try {
    const result = await getComprehensiveSpaceWeather();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve comprehensive NASA space weather', details: String(err) });
  }
});

app.get('/api/nasa/donki/flr', async (req: Request, res: Response) => {
  try {
    const start = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const end = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const result = await getDonkiFlares(start, end);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA solar flares', details: String(err) });
  }
});

app.get('/api/nasa/donki/cme', async (req: Request, res: Response) => {
  try {
    const start = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const end = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const result = await getDonkiCmes(start, end);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA CMEs', details: String(err) });
  }
});

app.get('/api/nasa/donki/gst', async (req: Request, res: Response) => {
  try {
    const start = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const end = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const result = await getDonkiGeomagneticStorms(start, end);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA geomagnetic storms', details: String(err) });
  }
});

app.get('/api/nasa/donki/sep', async (req: Request, res: Response) => {
  try {
    const start = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const end = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const result = await getDonkiSepEvents(start, end);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA SEP events', details: String(err) });
  }
});

app.get('/api/nasa/donki/notifications', async (_req: Request, res: Response) => {
  try {
    const result = await getDonkiNotifications();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA space weather alerts', details: String(err) });
  }
});

// 5. NASA Image and Video Library Search
app.get('/api/nasa/images/search', async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : 'earth';
    const mediaType = typeof req.query.media_type === 'string' ? req.query.media_type : 'image';
    const result = await searchNasaMedia(query, mediaType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search NASA media library', details: String(err) });
  }
});

// 6. NASA Exoplanet Archive TAP Confirmed Planets
app.get('/api/nasa/exoplanets', async (req: Request, res: Response) => {
  try {
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 40;
    const result = await getExoplanets(limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA Exoplanet Archive', details: String(err) });
  }
});

// 7. NASA EPIC DSCOVR Lagrange-1 Daily Earth Imagery
app.get('/api/nasa/epic', async (_req: Request, res: Response) => {
  try {
    const result = await getEpicImages();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA EPIC imagery', details: String(err) });
  }
});

// 8. NASA EONET Active Natural Environmental Events
app.get('/api/nasa/eonet/events', async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const result = await getEonetEvents(category);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA EONET events', details: String(err) });
  }
});

// -----------------------------------------------------------------------------
// 9. NASA SOLAR SYSTEM TREKS (WMTS Layers, Nomenclature & Rover Landing Bookmarks)
// -----------------------------------------------------------------------------

// Comprehensive Catalog of Supported Bodies
app.get('/api/nasa/trek/catalog', async (_req: Request, res: Response) => {
  try {
    const result = await getNasaTrekCatalog();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA Trek catalog', details: String(err) });
  }
});

// Layers Query for a Planetary Destination
app.get('/api/nasa/trek/layers', async (req: Request, res: Response) => {
  try {
    const body = typeof req.query.body === 'string' ? req.query.body : 'mars';
    const start = typeof req.query.start === 'string' ? parseInt(req.query.start, 10) : 0;
    const rows = typeof req.query.rows === 'string' ? parseInt(req.query.rows, 10) : 50;
    const result = await getNasaTrekLayers(body, start, rows);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA Trek layers', details: String(err) });
  }
});

// Nomenclature Features Query (Craters, Montes, Valles with IAU Coordinates)
app.get('/api/nasa/trek/nomenclature', async (req: Request, res: Response) => {
  try {
    const body = typeof req.query.body === 'string' ? req.query.body : 'mars';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 30;
    const result = await getNasaTrekNomenclature(body, category, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA Trek nomenclature', details: String(err) });
  }
});

// Rover and Spacecraft Landing Bookmarks
app.get('/api/nasa/trek/bookmarks', async (req: Request, res: Response) => {
  try {
    const body = typeof req.query.body === 'string' ? req.query.body : 'mars';
    const result = await getNasaTrekBookmarks(body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA Trek bookmarks', details: String(err) });
  }
});

// -----------------------------------------------------------------------------
// 10. NASA OSDR (OPEN SCIENCE DATA REPOSITORY & SPACE BIOLOGY API v2)
// -----------------------------------------------------------------------------

// High-Level Aggregated Research Statistics for Dashboard
app.get('/api/nasa/osdr/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getOsdrResearchStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA OSDR statistics', details: String(err) });
  }
});

// List of all registered OSDR datasets from Biological Data API v2
app.get('/api/nasa/osdr/datasets', async (_req: Request, res: Response) => {
  try {
    const result = await getOsdrDatasetsList();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA OSDR datasets', details: String(err) });
  }
});

// Single Study Metadata & Biological Protocols
app.get('/api/nasa/osdr/dataset/:accessionId', async (req: Request, res: Response) => {
  try {
    const { accessionId } = req.params;
    const metadata = await getOsdrStudyMetadata(accessionId);
    res.json(metadata);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA OSDR study metadata', details: String(err) });
  }
});

// Assays and Technology Platforms for a Study
app.get('/api/nasa/osdr/dataset/:accessionId/assays', async (req: Request, res: Response) => {
  try {
    const { accessionId } = req.params;
    const assays = await getOsdrAssays(accessionId);
    res.json({ accession: accessionId, assays });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA OSDR assays', details: String(err) });
  }
});

// Downloadable Files and Data Assets for a Study
app.get('/api/nasa/osdr/dataset/:accessionId/files', async (req: Request, res: Response) => {
  try {
    const { accessionId } = req.params;
    const files = await getOsdrFiles(accessionId);
    res.json({ accession: accessionId, files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve NASA OSDR files', details: String(err) });
  }
});

// High-Volume Search across OSDR / GeneLab / ALSDA / ESA
app.get('/api/nasa/osdr/search', async (req: Request, res: Response) => {
  try {
    const term = typeof req.query.term === 'string' ? req.query.term : undefined;
    const type = typeof req.query.type === 'string' ? req.query.type : undefined;
    const size = typeof req.query.size === 'string' ? parseInt(req.query.size, 10) : 20;
    const from = typeof req.query.from === 'string' ? parseInt(req.query.from, 10) : 0;
    const results = await searchOsdrCatalog({ term, type, size, from });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to execute NASA OSDR search', details: String(err) });
  }
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
