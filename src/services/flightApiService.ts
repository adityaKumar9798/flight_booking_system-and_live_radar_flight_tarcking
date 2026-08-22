export async function searchFlights(args: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
}) {
  try {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Aviationstack API key.');
    }

    // Aviationstack requires HTTP (not HTTPS for free tier usually, but Next.js fetch handles this)
    const params = new URLSearchParams({
      access_key: apiKey,
      dep_iata: args.originLocationCode.toUpperCase(),
      arr_iata: args.destinationLocationCode.toUpperCase(),
      limit: '5'
    });

    // We use the real-time flights endpoint which returns scheduled and active flights for the route
    const response = await fetch(`http://api.aviationstack.com/v1/flights?${params}`);

    if (!response.ok) {
      return { error: 'Flight API returned an error. Please try again later.' };
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return { message: 'No scheduled flights found for the given criteria.' };
    }

    // Map Aviationstack data to a simpler structure for the chatbot
    return data.data.map((flight: any) => ({
      flight_date: flight.flight_date,
      status: flight.flight_status,
      departure: {
        airport: flight.departure.airport,
        timezone: flight.departure.timezone,
        scheduled_time: flight.departure.scheduled
      },
      arrival: {
        airport: flight.arrival.airport,
        timezone: flight.arrival.timezone,
        scheduled_time: flight.arrival.scheduled
      },
      airline: {
        name: flight.airline.name,
      },
      flight_number: flight.flight.iata
    }));

  } catch (error: any) {
    console.error("Flight API Error:", error.message);
    return { 
      error: "Could not fetch live flight data. The flight data API might be temporarily unavailable." 
    };
  }
}
