import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Method Check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 2. API Key Check
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { base64Image, prompt } = req.body || {};
    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64Image data" });
    }

    // 3. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // UPDATED: Use 'gemini-2.5-flash' (Current standard for Vision)
    // 'gemini-pro-vision' is retired/deprecated.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Parse Base64 & Detect MimeType
    // This handles cases where the string includes "data:image/png;base64," or is just raw data
    let mimeType = "image/jpeg"; // Default fallback
    let imageParts = "";

    if (String(base64Image).includes(",")) {
      const parts = String(base64Image).split(",");
      imageParts = parts[1]; // The actual data
      
      // Try to extract real mimeType (e.g., image/png) from the header
      const match = parts[0].match(/:(.*?);/);
      if (match) {
        mimeType = match[1];
      }
    } else {
      imageParts = String(base64Image);
    }

    // 5. Generate Content
    const result = await model.generateContent([
      String(prompt || "Analyze this image for fitness or nutrition insights. Be concise and specific."),
      { 
        inlineData: { 
          data: imageParts, 
          mimeType: mimeType 
        } 
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ text });

  } catch (e) {
    console.error("Analyze-Image Error:", e.message);
    // Return the actual error message to help debugging
    return res.status(500).json({ 
      error: "Image analysis failed", 
      details: e.message 
    });
  }
}