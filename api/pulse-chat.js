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

    const { messages, stream = false } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini chat requires the conversation to start with a 'user' role.
    // Our UI starts with an assistant greeting, so we *don't* send history for now
    // to avoid "First content should be with role 'user'" errors.
    const history = [];

    const lastMessage = String(messages[messages.length - 1]?.content ?? "").trim();
    if (!lastMessage) {
      return res.status(400).json({ error: "Last message is empty" });
    }

    const chat = model.startChat({ history });

    if (stream) {
      // Stream response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const result = await chat.sendMessageStream(lastMessage);
      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      // Single response
      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      const text = response.text();
      return res.status(200).json({ text });
    }
  } catch (e) {
    console.error("pulse-chat error:", e);
    return res.status(500).json({ error: "Pulse request failed: " + e.message });
  }
}


