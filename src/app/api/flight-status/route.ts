import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flight = (searchParams.get('flight') || '').toUpperCase();
  
  if (!flight) {
    return NextResponse.json({ error: 'Flight number required' }, { status: 400 });
  }

  try {
    // 1. Try fetching from custom Database first
    const q = query(collection(db, 'custom_flights'), where('flightNo', '==', flight));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docData = snapshot.docs[0].data();
      if (docData.detailed) {
        const d = docData.detailed;
        
        const formatTime = (isoString: string | null) => {
          if (!isoString) return 'TBD';
          const d = new Date(isoString);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        const formatDate = (isoString: string | null) => {
          if (!isoString) return 'TBD';
          const d = new Date(isoString);
          return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
        };

        return NextResponse.json({
          flightNumber: docData.flightNo,
          airline: docData.airline,
          status: docData.status,
          isDelayed: docData.status === 'Delayed',
          departure: {
            airport: d.departureAirport,
            time: formatTime(d.departureTime),
            date: formatDate(d.departureTime),
            gate: 'TBD', terminal: 'TBD',
            lat: d.depLat, lng: d.depLng
          },
          arrival: {
            airport: d.arrivalAirport,
            time: formatTime(d.arrivalTime),
            date: formatDate(d.arrivalTime),
            gate: 'TBD', terminal: 'TBD',
            lat: d.arrLat, lng: d.arrLng
          },
          duration: d.duration,
          aircraft: d.aircraft || 'Unknown'
        });
      }
    }

    // 1.5 Fallback for mock Aerosky flights generated in the flights API
    if (flight.startsWith('AE')) {
      return NextResponse.json({
        flightNumber: flight,
        airline: 'Aerosky',
        status: 'In Air',
        isDelayed: false,
        departure: {
          airport: 'BOM',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
          gate: 'A1', terminal: '1',
          lat: 19.0896, lng: 72.8656
        },
        arrival: {
          airport: 'LHR',
          time: new Date(Date.now() + 11.5 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
          gate: 'B2', terminal: '3',
          lat: 51.4700, lng: -0.4543
        },
        duration: '5h 00m',
        aircraft: 'Boeing 777-300ER'
      });
    }

    // 2. Fallback to Aviationstack if not in local DB
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Flight not found in DB and Aviationstack key not configured' }, { status: 500 });
    }

    const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flight}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      // Find the most relevant flight (e.g. active or scheduled)
      // Usually the first one is fine as Aviationstack sorts them chronologically or logically
      
      // Let's grab the first one
      const f = data.data[0];
      
      const formatTime = (isoString: string | null) => {
        if (!isoString) return 'TBD';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      
      const formatDate = (isoString: string | null) => {
        if (!isoString) return 'TBD';
        const d = new Date(isoString);
        return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
      };

      let statusFormatted = 'Unknown';
      if (f.flight_status === 'scheduled') statusFormatted = 'Scheduled';
      else if (f.flight_status === 'active') statusFormatted = 'Active';
      else if (f.flight_status === 'landed') statusFormatted = 'Landed';
      else if (f.flight_status === 'cancelled') statusFormatted = 'Cancelled';
      else if (f.flight_status === 'incident') statusFormatted = 'Diverted';
      else if (f.flight_status === 'diverted') statusFormatted = 'Diverted';

      let diffMs = 0;
      if (f.arrival.scheduled && f.departure.scheduled) {
         diffMs = new Date(f.arrival.scheduled).getTime() - new Date(f.departure.scheduled).getTime();
      }
      const durationHours = diffMs / (1000 * 60 * 60);
      const durationStr = diffMs > 0 ? `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m` : 'Unknown';

      const result = {
        flightNumber: (f.flight.iata || f.flight.number).toUpperCase(),
        airline: f.airline.name || 'Unknown Airline',
        status: statusFormatted,
        isDelayed: f.departure.delay > 0,
        departure: {
          airport: f.departure.airport || f.departure.iata || 'Unknown',
          time: formatTime(f.departure.scheduled),
          date: formatDate(f.departure.scheduled),
          gate: f.departure.gate || 'TBD',
          terminal: f.departure.terminal || 'TBD'
        },
        arrival: {
          airport: f.arrival.airport || f.arrival.iata || 'Unknown',
          time: formatTime(f.arrival.scheduled),
          date: formatDate(f.arrival.scheduled),
          gate: f.arrival.gate || 'TBD',
          terminal: f.arrival.terminal || 'TBD'
        },
        duration: durationStr,
        aircraft: f.aircraft ? (f.aircraft.iata || f.aircraft.icao24 || 'Unknown') : 'Unknown'
      };

      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Flight not found or inactive.' }, { status: 404 });
    }

  } catch (error) {
    console.error("Aviationstack API error", error);
    return NextResponse.json({ error: 'Failed to fetch flight data.' }, { status: 500 });
  }
}
