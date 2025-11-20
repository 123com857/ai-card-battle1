import { GoogleGenAI } from "@google/genai";

// Ensure API Key is present
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const isAiAvailable = !!apiKey;

export const polishText = async (text: string, context: string = "resume"): Promise<string> => {
  if (!ai) return text;
  if (!text.trim()) return "";

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional career coach. Rewrite the following ${context} text to be more impactful, professional, and concise. Do not add quotes or conversational filler. Just return the polished text.
      
      Original text: "${text}"`,
    });
    
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};

export const generateSummary = async (role: string, experience: string): Promise<string> => {
  if (!ai) return "";
  
  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional resume summary (max 3 sentences) for a ${role}. Key experience highlights: ${experience}. Use an active voice.`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "";
  }
};

export const generateBulletPoints = async (role: string, company: string): Promise<string> => {
    if (!ai) return "";
    
    try {
      const model = ai.models;
      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 3 impactful, metric-driven resume bullet points for a ${role} position at ${company}. Return them as a simple list separated by newlines, no bullets or numbers at the start.`,
      });
      return response.text?.trim() || "";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "";
    }
  };