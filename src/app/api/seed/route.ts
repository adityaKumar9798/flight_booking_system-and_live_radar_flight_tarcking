import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';

const AIRLINES = ['Aerosky', 'British Airways', 'American Airlines', 'Emirates', 'IndiGo', 'Air India', 'Qatar Airways', 'Lufthansa'];
const AIRPORTS = [
  { iata: 'BOM', name: 'Mumbai (BOM)', lat: 19.0896, lng: 72.8656 },
  { iata: 'DEL', name: 'Delhi (DEL)', lat: 28.5562, lng: 77.1000 },
  { iata: 'LHR', name: 'London (LHR)', lat: 51.4700, lng: -0.4543 },
  { iata: 'JFK', name: 'New York (JFK)', lat: 40.6413, lng: -73.7781 },
  { iata: 'DXB', name: 'Dubai (DXB)', lat: 25.2532, lng: 55.3657 },
  { iata: 'SIN', name: 'Singapore (SIN)', lat: 1.3644, lng: 103.9915 },
  { iata: 'SYD', name: 'Sydney (SYD)', lat: -33.9461, lng: 151.1772 },
  { iata: 'CDG', name: 'Paris (CDG)', lat: 49.0097, lng: 2.5479 }
];

export async function GET(request: Request) {
  try {
    // First, let's clear the existing custom_flights to prevent duplicates if run multiple times
    const snapshot = await getDocs(collection(db, 'custom_flights'));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.delete(doc(db, 'custom_flights', d.id));
    });
    await batch.commit();

    // Generate 100 flights
    let flightsGenerated = 0;
    const newBatch = writeBatch(db);
    const flightsCol = collection(db, 'custom_flights');

    for (let i = 0; i < 100; i++) {
      const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
      const flightNumber = `${airline.substring(0, 2).toUpperCase()}${1000 + i}`;
      
      let depAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
      let arrAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
      while (depAirport.iata === arrAirport.iata) {
        arrAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
      }

      const today = new Date();
      // Randomize departure between today and +30 days
      const daysToAdd = Math.floor(Math.random() * 30);
      const hoursToAdd = Math.floor(Math.random() * 24);
      const departureTime = new Date(today);
      departureTime.setDate(today.getDate() + daysToAdd);
      departureTime.setHours(hoursToAdd, 0, 0, 0);

      // Duration between 2 and 15 hours
      const durationHours = 2 + Math.random() * 13;
      const arrivalTime = new Date(departureTime.getTime() + durationHours * 60 * 60 * 1000);

      const price = Math.round(150 + durationHours * 45 + (Math.random() * 100 - 50));

      const flightData = {
        flightNo: flightNumber,
        airline: airline,
        departure: `${depAirport.iata} (${departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
        arrival: `${arrAirport.iata} (${arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
        date: departureTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
        status: daysToAdd === 0 ? 'In Air' : 'Scheduled',
        
        // Detailed fields needed for booking engine & radar
        detailed: {
          id: `custom-${flightNumber}-${Date.now()}-${i}`,
          airline: airline,
          flightNumber: flightNumber,
          departureTime: departureTime.toISOString(),
          arrivalTime: arrivalTime.toISOString(),
          departureAirport: depAirport.iata,
          arrivalAirport: arrAirport.iata,
          duration: `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
          stops: 0,
          price: price,
          aircraft: ['Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787 Dreamliner'][Math.floor(Math.random() * 3)],
          depLat: depAirport.lat,
          depLng: depAirport.lng,
          arrLat: arrAirport.lat,
          arrLng: arrAirport.lng
        }
      };

      newBatch.set(doc(flightsCol), flightData);
      flightsGenerated++;
      
      // Firestore batch size limit is 500, but we only have 100, so we can commit once at the end
    }

    await newBatch.commit();
    return NextResponse.json({ success: true, message: `Successfully seeded ${flightsGenerated} flights.` });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
