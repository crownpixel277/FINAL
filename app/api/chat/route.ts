import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Ensure your OPENAI_API_KEY is set in your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the system prompt to guide the AI
const systemPrompt = `You are a helpful AI assistant embedded in a web application focused on DeepFake Detection and cybersecurity awareness. 
Your primary role is to answer user questions about:
- Features of this application (image/video/audio/URL/email scanning, deepfake detection).
- General cybersecurity topics (phishing, malware, online safety, deepfakes).
- How the application works.

If the user asks a question outside these topics, politely state your focus areas but provide a brief, helpful answer if possible and safe to do so. Keep your answers concise and informative.`;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found.');
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 });
    }

    const body = await request.json();
    const userPrompt = body.prompt;

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt provided' }, { status: 400 });
    }

    // Call OpenAI Chat Completions API directly
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using a cost-effective and capable model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 150, // Limit response length for widget
      temperature: 0.7, // Balance creativity and consistency
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Provide a slightly more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
} 