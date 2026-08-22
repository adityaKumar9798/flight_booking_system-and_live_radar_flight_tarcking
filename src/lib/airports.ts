export interface Airport {
  city: string;
  name: string;
  iata: string;
  country: string;
  state?: string;
}

export const airports: Airport[] = [
  { city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj', iata: 'BOM', country: 'India', state: 'Maharashtra' },
  { city: 'Delhi', name: 'Indira Gandhi International', iata: 'DEL', country: 'India', state: 'Delhi' },
  { city: 'Bangalore', name: 'Kempegowda International', iata: 'BLR', country: 'India', state: 'Karnataka' },
  { city: 'Kolkata', name: 'Netaji Subhas Chandra Bose', iata: 'CCU', country: 'India', state: 'West Bengal' },
  { city: 'Chennai', name: 'Chennai International', iata: 'MAA', country: 'India', state: 'Tamil Nadu' },
  { city: 'Hyderabad', name: 'Rajiv Gandhi International', iata: 'HYD', country: 'India', state: 'Telangana' },
  { city: 'Pune', name: 'Pune Airport', iata: 'PNQ', country: 'India', state: 'Maharashtra' },
  { city: 'Ranchi', name: 'Birsa Munda Airport', iata: 'IXR', country: 'India', state: 'Jharkhand' },
  { city: 'London', name: 'Heathrow', iata: 'LHR', country: 'United Kingdom' },
  { city: 'London', name: 'Gatwick', iata: 'LGW', country: 'United Kingdom' },
  { city: 'New York', name: 'John F. Kennedy', iata: 'JFK', country: 'United States' },
  { city: 'New York', name: 'Newark Liberty', iata: 'EWR', country: 'United States' },
  { city: 'Dubai', name: 'Dubai International', iata: 'DXB', country: 'United Arab Emirates' },
  { city: 'Singapore', name: 'Changi', iata: 'SIN', country: 'Singapore' },
  { city: 'Tokyo', name: 'Haneda', iata: 'HND', country: 'Japan' },
  { city: 'Tokyo', name: 'Narita', iata: 'NRT', country: 'Japan' },
  { city: 'Paris', name: 'Charles de Gaulle', iata: 'CDG', country: 'France' },
  { city: 'Frankfurt', name: 'Frankfurt Airport', iata: 'FRA', country: 'Germany' },
  { city: 'Amsterdam', name: 'Schiphol', iata: 'AMS', country: 'Netherlands' },
  { city: 'Hong Kong', name: 'Hong Kong International', iata: 'HKG', country: 'Hong Kong' },
  { city: 'Sydney', name: 'Kingsford Smith', iata: 'SYD', country: 'Australia' },
  { city: 'Toronto', name: 'Pearson', iata: 'YYZ', country: 'Canada' },
  { city: 'Los Angeles', name: 'Los Angeles International', iata: 'LAX', country: 'United States' },
  { city: 'Chicago', name: 'O\'Hare', iata: 'ORD', country: 'United States' },
  { city: 'Doha', name: 'Hamad International', iata: 'DOH', country: 'Qatar' },
  { city: 'Bangkok', name: 'Suvarnabhumi', iata: 'BKK', country: 'Thailand' },
  { city: 'Kuala Lumpur', name: 'Kuala Lumpur International', iata: 'KUL', country: 'Malaysia' },
  { city: 'Seoul', name: 'Incheon', iata: 'ICN', country: 'South Korea' }
];
