import { airports } from '@/lib/airports';

export type ChatIntent = 
  | 'GREETING'
  | 'MY_BOOKINGS'
  | 'PNR_SEARCH'
  | 'FORGOT_PNR'
  | 'BOOKING_STATUS'
  | 'FLIGHT_SEARCH'
  | 'FLIGHT_TRACKING'
  | 'UNKNOWN';

export interface IntentResult {
  intent: ChatIntent;
  data?: any;
}

export function detectIntent(message: string): IntentResult {
  const msg = message.toLowerCase().trim();

  // 1. PNR SEARCH
  // PNRs are usually 6 alphanumeric characters
  const pnrMatch = msg.match(/\b([a-z0-9]{6})\b/i);
  if (pnrMatch && !msg.includes('flight') && !msg.includes('book')) {
    // Basic heuristics: if it contains a 6 char code and words like 'pnr' or just the code
    if (msg.includes('pnr') || msg === pnrMatch[1].toLowerCase()) {
      return { intent: 'PNR_SEARCH', data: { pnr: pnrMatch[1].toUpperCase() } };
    }
  }

  // 1b. FORGOT PNR
  if (
    msg.includes('forgot pnr') ||
    msg.includes('lost pnr') ||
    msg.includes('dont know pnr') ||
    msg.includes('don\'t know pnr') ||
    msg.includes('find pnr') ||
    msg.includes('where is my pnr') ||
    msg.includes('cannot find my pnr') ||
    msg.includes('unable to find my pnr')
  ) {
    return { intent: 'FORGOT_PNR' };
  }

  // 2. BOOKING STATUS / FAILURE
  if (
    msg.includes('failed') || 
    msg.includes('did not book') || 
    msg.includes("didn't book") ||
    msg.includes('not confirmed') ||
    msg.includes('pending') ||
    msg.includes('issue with my booking') ||
    msg.includes('why didn\'t my flight get booked')
  ) {
    return { intent: 'BOOKING_STATUS' };
  }

  // 3. MY BOOKINGS
  if (
    msg.includes('my booking') ||
    msg.includes('my flight') ||
    msg.includes('my trip') ||
    msg.includes('what flights did i book') ||
    msg.includes('upcoming flight') ||
    msg.includes('cancel my booking') // Handling cancellation as showing bookings first
  ) {
    // Let tracking have priority if "track" is mentioned
    if (!msg.includes('track') && !msg.includes('where is')) {
      return { intent: 'MY_BOOKINGS' };
    }
  }

  // 4. FLIGHT TRACKING
  if (
    msg.includes('track my flight') ||
    msg.includes('where is my flight') ||
    msg.includes('flight status')
  ) {
    return { intent: 'FLIGHT_TRACKING' };
  }

  const hasCity = airports.some(a => msg.includes(a.city.toLowerCase()) || msg.includes(a.name.toLowerCase()));

  // 5. FLIGHT SEARCH
  if (
    msg.includes('flights from') ||
    msg.includes('flights to') ||
    msg.includes('book a flight') ||
    msg.includes('find flights') ||
    msg.includes('cheap flight') ||
    msg.includes('cheapest flight') ||
    msg.includes('chepaest') || // common typo
    (msg.includes(' to ') && msg.includes('flight')) ||
    (msg.includes(' to ') && hasCity) ||
    msg.includes('flight') // fallback since MY_BOOKINGS and TRACKING are already checked
  ) {
    return parseFlightSearch(msg);
  }

  // 6. GREETING / ACCOUNT INFO
  if (
    msg === 'hi' ||
    msg === 'hello' ||
    msg.includes('how are you') ||
    msg.includes('who am i') ||
    msg.includes('my name') ||
    msg.includes('my account') ||
    msg.startsWith('hi ') ||
    msg.startsWith('hello ')
  ) {
    return { intent: 'GREETING' };
  }

  return { intent: 'UNKNOWN' };
}

function parseFlightSearch(msg: string): IntentResult {
  // Simple NLP for origin and destination
  let origin = '';
  let destination = '';
  
  for (const airport of airports) {
    const city = airport.city.toLowerCase();
    if (msg.includes(city) || msg.includes(airport.name.toLowerCase())) {
      // Very basic logic: first mentioned city might be origin or just check "from {city}"
      if (msg.includes(`from ${city}`) || msg.includes(`${city} to`)) {
        origin = airport.iata;
      } else if (msg.includes(`to ${city}`) || msg.match(new RegExp(`\\b${city}\\b`))) {
        destination = airport.iata;
      }
    }
  }

  // Date parsing logic
  let date = new Date();
  
  if (msg.includes('tomorrow')) {
    date.setDate(date.getDate() + 1);
  } else if (msg.includes('this weekend')) {
    // Next Saturday
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 6); // adjust when day is sunday
    date.setDate(diff);
  } else if (msg.includes('next weekend')) {
    const day = date.getDay();
    const diff = date.getDate() - day + 13;
    date.setDate(diff);
  }

  const dateStr = date.toISOString().split('T')[0];

  return {
    intent: 'FLIGHT_SEARCH',
    data: {
      origin: origin || null,
      destination: destination || null,
      date: dateStr
    }
  };
}
