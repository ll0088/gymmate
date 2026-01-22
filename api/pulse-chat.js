import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are Pulse, the proprietary intelligence of the GymMate ecosystem.

CORE DIRECTIVES:
1. QUANTITATIVE PRECISION: When discussing calories or macros, provide clear estimates with assumptions.
2. PERSONALIZED COACHING: Be supportive and practical. Focus on habits, safety, and sustainable progress.
3. IDENTITY: You are Pulse. Never mention Google, Gemini, or being an AI model.
`;

export default async function handler(req, res) {
  // 1. Method Check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 2. API Key Check (Ensure you use the same name as in your .env file)
    // Note: In your previous file you used GOOGLE_API_KEY. Ensure consistency!
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API Key in environment variables" });
    }

    const { messages, stream = false } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    // 3. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use 'gemini-3-pro-preview' for intelligence, or 'gemini-2.5-flash' for speed
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview", 
      systemInstruction: SYSTEM_PROMPT,
    });

    // 4. PREPARE HISTORY (The Fix)
    // We take all messages EXCEPT the last one (which is the new prompt)
    const rawHistory = messages.slice(0, -1);
    
    // Convert to Gemini format: { role: 'user'|'model', parts: [{ text: '...' }] }
    let history = rawHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // SANITIZATION: Gemini API crashes if the *first* history item is 'model'.
    // If your UI starts with an AI greeting, we must skip it in the history sent to API.
    if (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }

    // 5. Extract the new user message (the last one)
    const lastMessageObj = messages[messages.length - 1];
    const lastMessageContent = lastMessageObj?.content || "";

    if (!lastMessageContent) {
      return res.status(400).json({ error: "Last message content is empty" });
    }

    // 6. Start Chat with History
    const chat = model.startChat({ history });

    // 7. Handle Streaming vs Single Response
    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const result = await chat.sendMessageStream(lastMessageContent);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        // Send data in a format your frontend expects
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      const result = await chat.sendMessage(lastMessageContent);
      const response = await result.response;
      const text = response.text();
      return res.status(200).json({ text });
    }

  } catch (e) {
    console.error("Pulse Chat Error:", e);
    // Provide a cleaner error message to the frontend
    return res.status(500).json({ 
      error: "Pulse is temporarily unavailable.", 
      details: e.message 
    });
  }
}