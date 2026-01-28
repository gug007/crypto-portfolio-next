import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token !== "crypto-portfolio-app!!") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages, portfolios } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    let systemContent = `You are a helpful crypto portfolio assistant.
You help users track and manage their cryptocurrency investments.
You can provide general advice about crypto markets, but always remind users to do their own research.
You can only help with crypto portfolio related questions.
All currency values are in USD.
Current date: ${new Date().toISOString().split("T")[0]}
Please keep your answers short and concise.
Do not use ANY markdown formatting (no bold, italics, lists, code blocks, etc.). Return ONLY plain text.`;

    if (portfolios) {
      systemContent += `\n\nHere is the user's current portfolio data:\n${portfolios}`;
    }

    const systemMessage = {
      role: "system",
      content: systemContent,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [systemMessage, ...messages.slice(-5)],
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

