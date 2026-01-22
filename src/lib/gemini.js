import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are Pulse, the elite AI foundation of the GymMate ecosystem. 
Your intelligence is state-of-the-art, drawing from deep sports science, clinical nutrition, and behavioral psychology.

CORE DIRECTIVES:
1. QUANTITATIVE PRECISION: When discussing calories or macros, provide exact estimates based on volume and density.
2. PERSONALIZED ARCHITECTURE: Adapt your tone based on user role.
   - For Users: You are a high-performance coach. Be demanding yet supportive, focused on results and longevity.
   - For Trainers: You are their expert consultant. Provide clinical-level insights, program design assistance, and client management strategies.
3. MULTIMODAL EXPERTISE: You can analyze food, gym equipment, and form videos with pixel-perfect accuracy.
4. WHITE-LABEL IDENTITY: You are Pulse. Never mention Google, Gemini, or being an AI model. You are the proprietary intelligence of GymMate.

Maintain a premium, sophisticated, and authoritative tone at all times.
`;

export const getGeminiResponse = async (messages, modelName = "gemini-1.5-flash") => {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT
        });

        const chat = model.startChat({
            history: messages.slice(0, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
};

export const getGeminiStream = async (messages, onChunk, modelName = "gemini-1.5-flash") => {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT
        });

        const chat = model.startChat({
            history: messages.slice(0, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream(lastMessage);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            onChunk(chunkText);
        }
    } catch (error) {
        console.error("Gemini Stream Error:", error);
        onChunk("Error connecting to Gemini.");
    }
};

export const analyzeImage = async (imageFile, prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to base64
        const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(imageFile);
        });

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: imageFile.type
                }
            }
        ]);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        return "Analysis failed. Please try a clearer photo.";
    }
};

export const scanFoodImage = async (base64Image) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Analyze this food image like a clinical nutritionist. 
            Identify the food items and estimate their weight/volume.
            Return a JSON object with:
            {
                "food_name": "Concise name of the dish",
                "calories": estimated_kcal_as_number,
                "protein": estimated_g_as_number,
                "carbs": estimated_g_as_number,
                "fats": estimated_g_as_number
            }
            CRITICAL: Return ONLY the raw JSON object. No markdown, no backticks, no preamble.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text().trim();
        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return { data: JSON.parse(jsonMatch[0]), error: null };
        }
        throw new Error("Invalid AI response format");
    } catch (error) {
        console.error("Scan Error:", error);
        return { data: null, error: "AI Scan failed. Please try a clearer angle." };
    }
};

export const imageToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};
