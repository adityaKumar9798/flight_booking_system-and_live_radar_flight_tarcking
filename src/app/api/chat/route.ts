import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const { message, userId, userName, bookingsContext: clientBookings } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    // Use bookings context provided by the authenticated client
    let bookingsContext = '';
    if (userId) {
      if (clientBookings && clientBookings.length > 0) {
        bookingsContext = `The user has the following recent bookings:\n${JSON.stringify(clientBookings, null, 2)}`;
      } else {
        bookingsContext = `The user has no recent bookings.`;
      }
    } else {
      bookingsContext = `The user is not logged in. If they ask about their personal flights or bookings, politely tell them they need to log in to access booking details.`;
    }

    // Determine default date (tomorrow) for flight search
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const systemInstruction = `You are a helpful AI Flight Assistant for Aerosky.
Your goal is to help users with flight tracking, booking status, and flight search.
The user's name is ${userName ? userName : 'Guest'}.
${bookingsContext}

IMPORTANT: If the user explicitly asks to search for flights (e.g., "Find flights from Mumbai to Delhi on 2024-05-12" or "I want to fly to New York"), you MUST respond with a JSON object containing a redirect URL.
The JSON should look exactly like this:
{"message": "I found some flights! I'm redirecting you to see all available flights now.", "redirect": "/flights?from=BOM&to=DEL&date=${tomorrowStr}"}
Note: Use 3-letter IATA codes for the 'from' and 'to' parameters. Default the date to tomorrow (${tomorrowStr}) if not specified. Format date as YYYY-MM-DD.

For all other queries (like asking about PNR, flight status, greetings, etc.), respond directly in a conversational, helpful, and concise tone using Markdown formatting. DO NOT output JSON if you are not redirecting to the flight search page. Use the provided user booking data to answer specific questions accurately.
`;

    // Call Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      systemInstruction,
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    // Check if the response is JSON (for flight search redirect)
    try {
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || responseText.match(/(\{[\s\S]*?\})/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.redirect && parsed.message) {
          return NextResponse.json({ 
            success: true, 
            message: parsed.message,
            redirect: parsed.redirect
          });
        }
      }
    } catch (e) {
      // Not JSON or couldn't parse, just return as regular text
    }

    return NextResponse.json({ 
      success: true, 
      message: responseText 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { success: false, message: "I encountered an unexpected error processing your request. Please try again." },
      { status: 500 }
    );
  }
}
