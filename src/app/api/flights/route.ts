import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  
  // Extract 3-letter IATA code from the search string (e.g., "Mumbai (BOM)" -> "BOM")
  const extractIata = (str: string) => {
    const match = str.match(/\b([A-Z]{3})\b/);
    return match ? match[1] : null;
  };

  const depIata = extractIata(from);
  const arrIata = extractIata(to);

  try {
    // Fetch all custom flights from the database (since we only seeded ~100)
    const snapshot = await getDocs(collection(db, 'custom_flights'));
    const allFlights = snapshot.docs
      .map(doc => {
        const data = doc.data();
        if (!data.detailed) return null;
        return {
          ...data.detailed,
          airline: data.detailed.airline || data.airline,
          flightNumber: data.detailed.flightNumber || data.flightNo,
          stops: data.detailed.stops || 0
        };
      })
      .filter(f => f); // only keep those with detailed payload

    // Filter in memory to avoid Firestore missing index errors
    let filteredFlights = allFlights;
    if (depIata && arrIata) {
      filteredFlights = allFlights.filter(f => 
        f.departureAirport === depIata && f.arrivalAirport === arrIata
      );
    } else if (depIata) {
       filteredFlights = allFlights.filter(f => f.departureAirport === depIata);
    } else if (arrIata) {
       filteredFlights = allFlights.filter(f => f.arrivalAirport === arrIata);
    }

    // Always ensure we return some fallback mock data if the DB search turns up totally empty for the demo
    if (filteredFlights.length === 0) {
      console.log(`No custom DB flights found for ${from} to ${to}, falling back to mock data.`);
      const mockFlights = generateMockFlights(from, to);
      return NextResponse.json({ data: mockFlights });
    }

    return NextResponse.json({ data: filteredFlights });
  } catch (error) {
    console.error("Firestore API error", error);
    // Fallback to mock data on error so the UI doesn't break
    const mockFlights = generateMockFlights(from, to);
    return NextResponse.json({ data: mockFlights });
  }
}

function generateMockFlights(from: string, to: string) {
  const extractIata = (str: string) => {
    const match = str.match(/\b([A-Z]{3})\b/);
    return match ? match[1] : (str.substring(0, 3).toUpperCase() || 'JFK');
  };
  
  const fromCode = extractIata(from);
  const toCode = extractIata(to);
  
  const airlines = ['Aerosky', 'Aerosky', 'Aerosky'];
  const today = new Date();
  const flights = [];
  
  for (let i = 0; i < 3; i++) {
    const depTime = new Date(today);
    depTime.setHours(today.getHours() + (i * 3) + 2);
    const arrTime = new Date(depTime);
    arrTime.setHours(depTime.getHours() + 5 + Math.random() * 5);
    
    const durationHours = (arrTime.getTime() - depTime.getTime()) / (1000 * 60 * 60);
    const flightNumber = `${airlines[i % airlines.length].substring(0, 2).toUpperCase()}${1000 + i}`;
    const hash = flightNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = (hash % 100) - 50; 
    const mockPrice = Math.round(50 + durationHours * 45 + variation); 
    
    flights.push({
      id: `mock-${i}-${Date.now()}`,
      airline: airlines[i % airlines.length],
      flightNumber: flightNumber,
      departureTime: depTime.toISOString(),
      arrivalTime: arrTime.toISOString(),
      departureAirport: fromCode,
      arrivalAirport: toCode,
      duration: `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
      stops: i % 3 === 0 ? 1 : 0,
      price: mockPrice,
      aircraft: 'Boeing 777-300ER',
      baggage: '1x 23kg Checked, 1x 8kg Cabin',
    });
  }
  
  return flights;
}
