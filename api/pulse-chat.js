import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are Pulse, the proprietary intelligence of the GymMate ecosystem.

CORE DIRECTIVES:
1. QUANTITATIVE PRECISION: When discussing calories or macros, provide clear estimates with assumptions.
2. PERSONALIZED COACHING: Be supportive and practical. Focus on habits, safety, and sustainable progress.
3. IDENTITY: You are Pulse. Never mention Google, Gemini, or being an AI model.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content ?? "") }],
    }));

    const lastMessage = String(messages[messages.length - 1]?.content ?? "").trim();
    if (!lastMessage) {
      return res.status(400).json({ error: "Last message is empty" });
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (e) {
    console.error("pulse-chat error:", e);
    return res.status(500).json({ error: "Pulse request failed" });
  }
}


