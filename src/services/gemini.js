import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const redesignRoom = async (imageBase64, prompt = "Modern, minimal interior design") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: "image/jpeg",
            },
          },
          {
            text: `Redesign this room in ${prompt} style. Keep the basic structure but change the furniture, wall colors, and lighting to match the style. Generate a high-quality visualization.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      }
    });

    let imageUrl = null;
    let description = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      } else if (part.text) {
        description += part.text;
      }
    }

    return { imageUrl, description };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const generateInspiration = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: `Generate a stunning, photorealistic interior design concept for: ${prompt}. Professional architectural photography style, 4k.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      }
    });

    let imageUrl = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return imageUrl;
  } catch (error) {
    console.error("Gemini Inspiration Error:", error);
    return null;
  }
};
