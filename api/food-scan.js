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

    const { base64Image } = req.body || {};
    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64Image" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = `
Identify the food items in this image and estimate nutritional values.
Return ONLY valid JSON:
{
  "food_name": "Concise dish name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}
`;

    const data = String(base64Image).includes(",")
      ? String(base64Image).split(",")[1]
      : String(base64Image);

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data, mimeType: "image/jpeg" } },
    ]);

    const response = await result.response;
    const text = response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid response format", raw: text });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ data: parsed });
  } catch (e) {
    console.error("food-scan error:", e);
    return res.status(500).json({ error: "Food scan failed" });
  }
}


