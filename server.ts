import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// PERSONAS DEFINITIONS
const PERSONAS = [
  {
    id: "fomo",
    name: "El Degenerado FOMO",
    bias: "irrational FOMO, high momentum focus, ignores risk",
    role: "Arquetipo #01 • Momentum",
    color: "#00e479"
  },
  {
    id: "cautious",
    name: "El Cauteloso",
    bias: "risk management, technical indicators, conservative",
    role: "Arquetipo #02 • Riesgo",
    color: "#00daf3"
  },
  {
    id: "contrarian",
    name: "El Paranoico Contrarian",
    bias: "skepticism, looks for traps, expects reversals",
    role: "Arquetipo #03 • Skeptic",
    color: "#ffb3b2"
  },
  {
    id: "maximalist",
    name: "El Maximalista Fiel",
    bias: "long term fundamental value, ignores noise, accumulation focus",
    role: "Arquetipo #04 • Fundamental",
    color: "#f1ffef"
  }
];

// Lazy initialization of Gemini
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// API Routes
app.post("/api/simulate", async (req, res) => {
  const { ticker, context } = req.body;
  
  if (!ticker) {
    return res.status(400).json({ error: "Ticker is required" });
  }

  try {
    const ai = getGenAI();

    // Ask Gemini to simulate all personas in a single call to save quota and ensure consistency
    const prompt = `
      You are a multi-agent psychological market analysis engine. 
      Evaluate the sentiment for the asset: ${ticker}.
      
      Market Context: ${context || "Market stability with typical intraday volatility."}
      
      You must simulate these 4 distinct personas:
      ${PERSONAS.map(p => `- ${p.name} (Bias: ${p.bias})`).join('\n')}
      
      For each persona, provide their emotional state, conviction (0-100), stance, and a one-sentence rationale in Spanish.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              emotion: { type: Type.STRING },
              conviction: { type: Type.NUMBER },
              stance: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["id", "emotion", "conviction", "stance", "reasoning"]
          }
        }
      }
    });

    let results = [];
    try {
      results = JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse JSON from Gemini", response.text);
      throw new Error("Invalid response format from AI");
    }

    // Merge AI results with persona metadata (colors, roles)
    const simulations = PERSONAS.map(p => {
      const aiResult = results.find((r: any) => r.id.toLowerCase().includes(p.id.toLowerCase()) || r.id.toLowerCase().includes(p.name.toLowerCase().split(' ')[1].toLowerCase()));
      return {
        ...p,
        emotion: aiResult?.emotion || "Neutral",
        conviction: aiResult?.conviction || 50,
        stance: aiResult?.stance || "HOLD",
        reasoning: aiResult?.reasoning || "Análisis en progreso."
      };
    });

    // Aggregation logic
    const longVotes = simulations.filter(s => s.stance.toUpperCase().includes("BUY") || s.stance.toUpperCase().includes("ACCUMULATE")).length;
    const holdVotes = simulations.filter(s => s.stance.toUpperCase().includes("HOLD")).length;
    const panicVotes = simulations.filter(s => s.stance.toUpperCase().includes("SELL")).length;
    
    const sentimentIndex = Math.round((longVotes / simulations.length) * 100);

    res.json({
      timestamp: new Date().toISOString(),
      ticker,
      sentimentIndex,
      simulations,
      stats: {
        long: Math.round((longVotes / simulations.length) * 100),
        hold: Math.round((holdVotes / simulations.length) * 100),
        panic: Math.round((panicVotes / simulations.length) * 100)
      }
    });
  } catch (error: any) {
    console.error("Simulation error:", error);
    
    // Better error message for quota/capacity issues
    let userMessage = error.message;
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      userMessage = "Límite de API excedido. Por favor espere 15 segundos antes de reintentar.";
    } else if (error.message?.includes("503") || error.message?.includes("high demand")) {
      userMessage = "El modelo está saturado. Reintentando en unos instantes...";
    }
    
    res.status(500).json({ error: userMessage });
  }
});

// Vite middleware for development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
