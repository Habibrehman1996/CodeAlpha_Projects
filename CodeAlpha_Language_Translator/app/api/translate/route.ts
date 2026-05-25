import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { text, sourceLang, targetLang } = await request.json();

    // Validation
    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Initialize Gemini AI inside the request handler to get fresh env vars
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Get the Gemini model (using Gemini 2.5 Flash - available model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create a simple, focused prompt that returns only the translation
    const prompt = `Translate from ${sourceLang} to ${targetLang}. Return only translated text without explanations.\n\n${text}`;

    // Generate the translation
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    // Return only the translated text
    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation error:", error);

    // Check if it's a quota error
    if (error?.message?.includes("quota") || error?.message?.includes("429")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later or contact support." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 500 }
    );
  }
}
