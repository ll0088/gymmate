export const getGeminiStream = async (messages, onChunk, modelName = "gemini-1.5-flash") => {
  // Client-side wrapper: we call our Vercel Serverless Function instead of exposing the API key in the browser.
  // We keep the same signature so the UI doesn't need major changes.
  try {
    const res = await fetch("/api/pulse-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, modelName }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Pulse request failed");
    onChunk(String(json.text || ""));
  } catch (error) {
    console.error("Pulse Stream Error:", error);
    onChunk("Pulse is unavailable right now. Please try again.");
  }
};

export const analyzeImage = async (imageFile, prompt) => {
  try {
    // Convert file to base64 if it's a file, otherwise assume it's already base64
    let base64Data;
    if (typeof imageFile === "string") {
      base64Data = imageFile;
    } else {
      base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
    }

    const res = await fetch("/api/analyze-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image: base64Data, prompt }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Image analysis failed");
    return String(json.text || "");
  } catch (error) {
    console.error("Pulse Vision Error:", error);
    return "Image analysis failed. Please try again with a clearer photo.";
  }
};

export const scanFoodImage = async (base64Image) => {
  try {
    const res = await fetch("/api/food-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Food scan failed");
    return { data: json.data, error: null };
  } catch (error) {
    console.error("Food Scan Error:", error);
    return { data: null, error: "Food scan failed. Try better lighting and a closer shot." };
  }
};

export const imageToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
