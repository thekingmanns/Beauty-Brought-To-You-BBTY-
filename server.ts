import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily on first API request to avoid crash on load if key is missing
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY key is missing. Please declare it in the AI Studio environment.");
      }
      aiClient = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // --- API Routes for Veo Video Generation ---

  // 1. Start generation: POST /api/generate-video
  app.post("/api/generate-video", async (req, res) => {
    try {
      const ai = getAiClient();
      const { prompt, resolution, aspectRatio } = req.body;
      
      const defaultPrompt = "A professional, warm, comforting and highly aesthetic 15-second promo video highlighting a smiling professional mobile stylist gently styling the clean hair of a happy senior lady sitting in her cozy living room, warm natural golden hour lighting, slow cinematic pans.";
      
      console.log(`[VIDEO-GEN] Triggering Veo with prompt: "${prompt || defaultPrompt}" (${resolution || '720p'}, ${aspectRatio || '16:9'})`);
      
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || defaultPrompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution || '720p',
          aspectRatio: aspectRatio || '16:9'
        }
      });
      
      console.log(`[VIDEO-GEN] Operation created: ${operation.name}`);
      res.json({ operationName: operation.name });
    } catch (error: any) {
      console.error("[VIDEO-GEN] Error in /api/generate-video:", error);
      const errorMsg = error.message || "Failed to initiate video generation.";
      const isQuota = typeof errorMsg === 'string' && (
        errorMsg.includes("429") || 
        errorMsg.includes("quota") || 
        errorMsg.includes("RESOURCE_EXHAUSTED") || 
        errorMsg.includes("rate-limit") ||
        errorMsg.includes("billing")
      );
      res.status(500).json({ 
        error: errorMsg,
        isQuotaExceeded: isQuota || error.status === 429
      });
    }
  });

  // 2. Poll status: POST /api/video-status
  app.post("/api/video-status", async (req, res) => {
    try {
      const ai = getAiClient();
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: "operationName is required" });
      }

      console.log(`[VIDEO-GEN] Polling operation status: ${operationName}`);
      const op = new GenerateVideosOperation();
      op.name = operationName;
      
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      console.log(`[VIDEO-GEN] Polling response received. Done: ${updated.done}`);
      res.json({ 
        done: updated.done,
        error: updated.error,
        response: updated.response
      });
    } catch (error: any) {
      console.error("[VIDEO-GEN] Error in /api/video-status:", error);
      res.status(500).json({ error: error.message || "Failed to poll video status." });
    }
  });

  // 3. Download/Stream video back: POST /api/video-download
  app.post("/api/video-download", async (req, res) => {
    try {
      const ai = getAiClient();
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: "operationName is required" });
      }

      console.log(`[VIDEO-GEN] Pulling results for download: ${operationName}`);
      const op = new GenerateVideosOperation();
      op.name = operationName;
      
      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      
      if (!uri) {
        console.warn("[VIDEO-GEN] Video URI not found / video not complete yet.");
        return res.status(400).json({ error: "Video is not fully compiled or URI is unavailable." });
      }

      console.log(`[VIDEO-GEN] Downloading video from Google Storage URI: ${uri}`);
      const apiKey = process.env.GEMINI_API_KEY;
      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': apiKey || '' },
      });

      if (!videoRes.ok) {
        throw new Error(`Failed to download from GCS: ${videoRes.statusText}`);
      }

      res.setHeader('Content-Type', 'video/mp4');
      const reader = videoRes.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not a readable stream.");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
      console.log(`[VIDEO-GEN] Video stream completed successfully.`);
    } catch (error: any) {
      console.error("[VIDEO-GEN] Error in /api/video-download:", error);
      res.status(500).json({ error: error.message || "Failed to stream video" });
    }
  });

  // --- Serve Frontend Application ---

  if (process.env.NODE_ENV !== "production") {
    console.log("[VITE] Mounting Vite development server middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[VITE] Serving static build from /dist directory.");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Full-stack Beauty-Brought-To-You ready on http://localhost:${PORT}`);
  });
}

startServer();
