import { Flight } from './booking-context';

export interface AviationstackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Array<{
    flight_date: string;
    flight_status: string;
    departure: {
      airport: string;
      timezone: string;
      iata: string;
      icao: string;
      terminal: string;
      gate: string;
      delay: number | null;
      scheduled: string;
      estimated: string;
      actual: string | null;
      estimated_runway: string | null;
      actual_runway: string | null;
    };
    arrival: {
      airport: string;
      timezone: string;
      iata: string;
      icao: string;
      terminal: string;
      gate: string;
      baggage: string;
      delay: number | null;
      scheduled: string;
      estimated: string;
      actual: string | null;
      estimated_runway: string | null;
      actual_runway: string | null;
    };
    airline: {
      name: string;
      iata: string;
      icao: string;
    };
    flight: {
      number: string;
      iata: string;
      icao: string;
      codeshared: null | object;
    };
    aircraft: null | {
      registration: string;
      iata: string;
      icao: string;
      icao24: string;
    };
    live: null | object;
  }>;
}

/**
 * Transforms an Aviationstack response into our frontend Flight model.
 */
export function transformFlights(apiResponse: AviationstackResponse): Flight[] {
  if (!apiResponse || !apiResponse.data) {
    return [];
  }

  return apiResponse.data.map((flight) => {
    // Calculate a mock price based on duration for demo purposes
    const departureTime = new Date(flight.departure.scheduled).getTime();
    const arrivalTime = new Date(flight.arrival.scheduled).getTime();
    let diffMs = arrivalTime - departureTime;
    if (diffMs <= 0 || isNaN(diffMs)) {
      // Fallback to 2 hours if dates are weird
      diffMs = 2 * 60 * 60 * 1000; 
    }
    const durationHours = diffMs / (1000 * 60 * 60);
    const flightNumber = flight.flight.iata || flight.flight.number || '';
    const hash = flightNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = (hash % 100) - 50; // varies by -$50 to +$50
    const mockPrice = Math.round(50 + durationHours * 45 + variation); // Base $50 + $45/hr +/- variation

    return {
      id: `${flight.flight.iata}-${flight.flight_date}`,
      airline: flight.airline.name || 'Unknown Airline',
      flightNumber: flight.flight.iata || flight.flight.number,
      departureTime: flight.departure.scheduled,
      arrivalTime: flight.arrival.scheduled,
      departureAirport: flight.departure.iata || flight.departure.airport,
      arrivalAirport: flight.arrival.iata || flight.arrival.airport,
      duration: `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
      stops: 0, // Aviationstack free tier doesn't easily show stops in real-time, defaulting to 0
      price: mockPrice,
      aircraft: flight.aircraft ? flight.aircraft.iata || 'Airbus A320' : 'Airbus A320',
      baggage: '1x 23kg Checked, 1x 8kg Cabin',
    };
  });
}
