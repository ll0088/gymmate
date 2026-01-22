import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { base64Image, prompt } = req.body || {};
    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64Image" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const data = String(base64Image).includes(",")
      ? String(base64Image).split(",")[1]
      : String(base64Image);

    const result = await model.generateContent([
      String(prompt || "Analyze this image for fitness or nutrition insights. Be concise and specific."),
      { inlineData: { data, mimeType: "image/jpeg" } },
    ]);

    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (e) {
    console.error("analyze-image error:", e);
    return res.status(500).json({ error: "Image analysis failed" });
  }
}


