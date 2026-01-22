import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API Key" });
    }

    const { base64Image } = req.body || {};
    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64Image" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. Use the Modern Model
    // 'gemini-2.5-flash' is the 2026 standard for fast, cheap vision tasks.
    // (If you are on an older API version, use 'gemini-1.5-flash')
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      // 2. Enable JSON Mode (Crucial for reliability)
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Identify the food items in this image and estimate nutritional values.
    Return a single JSON object with these keys:
    - food_name (string)
    - calories (number)
    - protein (number)
    - carbs (number)
    - fats (number)
    `;

    // 3. Clean Base64 Data
    const data = String(base64Image).includes(",")
      ? String(base64Image).split(",")[1]
      : String(base64Image);

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data, mimeType: "image/jpeg" } },
    ]);

    const response = await result.response;
    const text = response.text();

    // 4. Safe Parsing (No Regex needed due to JSON Mode)
    const parsed = JSON.parse(text);
    
    return res.status(200).json({ data: parsed });

  } catch (e) {
    console.error("Food Scan Error:", e.message);
    return res.status(500).json({ error: "Food scan failed", details: e.message });
  }
}