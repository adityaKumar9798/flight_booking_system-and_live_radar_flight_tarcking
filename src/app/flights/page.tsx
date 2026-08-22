'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBooking, Flight } from '@/lib/booking-context';
import { airports, Airport as AirportType } from '@/lib/airports';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './FlightResults.module.css';

function FlightResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, selectFlight } = useBooking();
  
  const from = searchParams.get('from') || state.search?.from || 'JFK';
  const to = searchParams.get('to') || state.search?.to || 'LHR';
  const date = state.search?.date || 'Aug 15';

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [routeState, setRouteState] = useState('');
  const [routeCity, setRouteCity] = useState('');
  const [routeAirport, setRouteAirport] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedDepartures, setSelectedDepartures] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedCabinClasses, setSelectedCabinClasses] = useState<string[]>([]);
  const [selectedBaggage, setSelectedBaggage] = useState<string[]>([]);
  const [selectedFareTypes, setSelectedFareTypes] = useState<string[]>([]);
  const [selectedAircrafts, setSelectedAircrafts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'cheapest' | 'recommended' | 'fastest'>('cheapest');

  const [activeAc, setActiveAc] = useState<'state' | 'city' | 'airport' | null>(null);
  const routeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (routeRef.current && !routeRef.current.contains(event.target as Node)) {
        setActiveAc(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredAc = (type: 'state' | 'city' | 'airport', query: string) => {
    const safeAirports = airports || [];
    if (!query) return safeAirports.slice(0, 5);
    const lowerQ = query.toLowerCase();
    return safeAirports.filter(a => {
      if (type === 'state') return a.state?.toLowerCase().includes(lowerQ);
      if (type === 'city') return a.city.toLowerCase().includes(lowerQ);
      return a.name.toLowerCase().includes(lowerQ) || a.iata.toLowerCase().includes(lowerQ);
    }).slice(0, 5);
  };

  useEffect(() => {
    async function fetchFlights() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
        if (!res.ok) throw new Error('Failed to fetch flights');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setFlights(json.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong while fetching flights.');
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [from, to]);

  const handleSelectFlight = (flight: Flight) => {
    selectFlight(flight);
    router.push(`/flights/${flight.id}`);
  };

  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], value: string) => {
    if (current.includes(value)) {
      setter(current.filter(item => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearAllFilters = () => {
    setRouteState('');
    setRouteCity('');
    setRouteAirport('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedStops([]);
    setSelectedAirlines([]);
    setSelectedDepartures([]);
    setSelectedDurations([]);
    setSelectedCabinClasses([]);
    setSelectedBaggage([]);
    setSelectedFareTypes([]);
    setSelectedAircrafts([]);
  };

  // Real-time filtering logic
  const filteredFlights = flights.filter(flight => {
    // 1. Route match (soft text search on departure/arrival airport)
    const lowerAirport = routeAirport.toLowerCase();
    if (lowerAirport && !flight.departureAirport.toLowerCase().includes(lowerAirport) && !flight.arrivalAirport.toLowerCase().includes(lowerAirport)) return false;

    // 2. Price match (using local currency values)
    const localPrice = flight.price * state.exchangeRate;
    if (minPrice && localPrice < parseFloat(minPrice)) return false;
    if (maxPrice && localPrice > parseFloat(maxPrice)) return false;

    // 3. Stops
    if (selectedStops.length > 0) {
      let matchesStops = false;
      if (selectedStops.includes('Direct') && flight.stops === 0) matchesStops = true;
      if (selectedStops.includes('1 Stop') && flight.stops === 1) matchesStops = true;
      if (selectedStops.includes('2+ Stops') && flight.stops >= 2) matchesStops = true;
      if (!matchesStops) return false;
    }

    // 4. Airlines
    if (selectedAirlines.length > 0) {
      if (!selectedAirlines.includes(flight.airline)) return false;
    }

    // 5. Departure Time
    if (selectedDepartures.length > 0) {
      const depHour = new Date(flight.departureTime).getHours();
      let matchesTime = false;
      if (selectedDepartures.includes('Early Morning') && depHour >= 0 && depHour < 8) matchesTime = true;
      if (selectedDepartures.includes('Morning') && depHour >= 8 && depHour < 12) matchesTime = true;
      if (selectedDepartures.includes('Afternoon') && depHour >= 12 && depHour < 16) matchesTime = true;
      if (selectedDepartures.includes('Evening') && depHour >= 16 && depHour < 20) matchesTime = true;
      if (selectedDepartures.includes('Night') && depHour >= 20 && depHour <= 24) matchesTime = true;
      if (!matchesTime) return false;
    }

    // 6. Duration
    if (selectedDurations.length > 0) {
      // Parse "Xh Ym" to minutes
      const hoursMatch = flight.duration.match(/(\d+)h/);
      const minsMatch = flight.duration.match(/(\d+)m/);
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
      const totalMins = (hours * 60) + mins;
      
      let matchesDur = false;
      if (selectedDurations.includes('< 2h') && totalMins < 120) matchesDur = true;
      if (selectedDurations.includes('2–4h') && totalMins >= 120 && totalMins < 240) matchesDur = true;
      if (selectedDurations.includes('4–6h') && totalMins >= 240 && totalMins < 360) matchesDur = true;
      if (selectedDurations.includes('6h+') && totalMins >= 360) matchesDur = true;
      if (!matchesDur) return false;
    }

    return true; // Passed all filters
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    const parseDur = (dur: string) => {
      const hMatch = dur.match(/(\d+)h/);
      const mMatch = dur.match(/(\d+)m/);
      return (hMatch ? parseInt(hMatch[1]) : 0) * 60 + (mMatch ? parseInt(mMatch[1]) : 0);
    };
    
    if (sortBy === 'cheapest') {
      return a.price - b.price;
    } else if (sortBy === 'fastest') {
      return parseDur(a.duration) - parseDur(b.duration);
    } else {
      return (a.price * parseDur(a.duration)) - (b.price * parseDur(b.duration));
    }
  });

  return (
    <>
      <div className={styles.searchSummaryContainer}>
        <div className="container">
          <div className={styles.searchSummary}>
            <div className={styles.route}>
              <h2>{from} <span className={styles.arrow}>→</span> {to}</h2>
              <p>{date} • {state.search?.adults || 1} Adult • {state.search?.travelClass || 'Economy'}</p>
            </div>
            <button className={styles.editBtn} onClick={() => router.push('/')}>Edit Search</button>
          </div>
        </div>
      </div>

      <div className={`container ${styles.resultsContainer}`}>
        <aside className={styles.sidebar}>
          <h3>
            Filters 
            <button className={styles.clearFilters} onClick={clearAllFilters}>Clear all</button>
          </h3>
          
          <div className={styles.filterSection} ref={routeRef}>
            <h4>📍 Route</h4>
            <div className={styles.inputWrapper}>
              <input type="text" placeholder="State" className={styles.routeInput} value={routeState} onChange={e => setRouteState(e.target.value)} onFocus={() => setActiveAc('state')} />
              {activeAc === 'state' && routeState.trim().length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {getFilteredAc('state', routeState).map(a => (
                    <div key={`state-${a.iata}`} className={styles.autocompleteItem} onClick={() => { setRouteState(a.state || ''); setActiveAc(null); }}>
                      <span className={styles.acCity}>{a.state || 'Unknown'} <span className={styles.acIata}>{a.iata}</span></span>
                      <span className={styles.acName}>{a.city}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input type="text" placeholder="City" className={styles.routeInput} value={routeCity} onChange={e => setRouteCity(e.target.value)} onFocus={() => setActiveAc('city')} />
              {activeAc === 'city' && routeCity.trim().length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {getFilteredAc('city', routeCity).map(a => (
                    <div key={`city-${a.iata}`} className={styles.autocompleteItem} onClick={() => { setRouteCity(a.city); setActiveAc(null); }}>
                      <span className={styles.acCity}>{a.city} <span className={styles.acIata}>{a.iata}</span></span>
                      <span className={styles.acName}>{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input type="text" placeholder="Airport" className={styles.routeInput} value={routeAirport} onChange={e => setRouteAirport(e.target.value)} onFocus={() => setActiveAc('airport')} />
              {activeAc === 'airport' && routeAirport.trim().length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {getFilteredAc('airport', routeAirport).map(a => (
                    <div key={`airport-${a.iata}`} className={styles.autocompleteItem} onClick={() => { setRouteAirport(a.iata); setActiveAc(null); }}>
                      <span className={styles.acCity}>{a.city} <span className={styles.acIata}>{a.iata}</span></span>
                      <span className={styles.acName}>{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4>💰 Price</h4>
            <div className={styles.priceRangeInputs}>
              <input type="number" placeholder="Min" className={styles.priceInput} value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <span className={styles.priceDivider}>-</span>
              <input type="number" placeholder="Max" className={styles.priceInput} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4>🛫 Stops</h4>
            {['Direct', '1 Stop', '2+ Stops'].map(stop => (
              <label key={stop} className={styles.checkbox}>
                <input type="checkbox" checked={selectedStops.includes(stop)} onChange={() => toggleFilter(setSelectedStops, selectedStops, stop)} /> {stop}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>🏢 Airlines</h4>
            {['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet', 'Vistara', 'Air India Express'].map(airline => (
              <label key={airline} className={styles.checkbox}>
                <input type="checkbox" checked={selectedAirlines.includes(airline)} onChange={() => toggleFilter(setSelectedAirlines, selectedAirlines, airline)} /> {airline}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>⏰ Departure</h4>
            {['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
              <label key={time} className={styles.checkbox}>
                <input type="checkbox" checked={selectedDepartures.includes(time)} onChange={() => toggleFilter(setSelectedDepartures, selectedDepartures, time)} /> {time}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>⏱ Duration</h4>
            {['< 2h', '2–4h', '4–6h', '6h+'].map(dur => (
              <label key={dur} className={styles.checkbox}>
                <input type="checkbox" checked={selectedDurations.includes(dur)} onChange={() => toggleFilter(setSelectedDurations, selectedDurations, dur)} /> {dur}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>💺 Cabin Class</h4>
            {['Economy', 'Premium Economy', 'Business', 'First'].map(cls => (
              <label key={cls} className={styles.checkbox}>
                <input type="checkbox" checked={selectedCabinClasses.includes(cls)} onChange={() => toggleFilter(setSelectedCabinClasses, selectedCabinClasses, cls)} /> {cls}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>🧳 Baggage</h4>
            {['15 kg+', '20 kg+', '25 kg+', '30 kg+'].map(bag => (
              <label key={bag} className={styles.checkbox}>
                <input type="checkbox" checked={selectedBaggage.includes(bag)} onChange={() => toggleFilter(setSelectedBaggage, selectedBaggage, bag)} /> {bag}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>🎫 Fare Type</h4>
            {['Refundable', 'Free Cancellation'].map(fare => (
              <label key={fare} className={styles.checkbox}>
                <input type="checkbox" checked={selectedFareTypes.includes(fare)} onChange={() => toggleFilter(setSelectedFareTypes, selectedFareTypes, fare)} /> {fare}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>✈️ Aircraft</h4>
            {['Airbus', 'Boeing', 'ATR'].map(ac => (
              <label key={ac} className={styles.checkbox}>
                <input type="checkbox" checked={selectedAircrafts.includes(ac)} onChange={() => toggleFilter(setSelectedAircrafts, selectedAircrafts, ac)} /> {ac}
              </label>
            ))}
          </div>
        </aside>

        <section className={styles.flightsList}>
          <div className={styles.sortingBar}>
            <span className={sortBy === 'cheapest' ? styles.sortActive : ''} onClick={() => setSortBy('cheapest')}>Cheapest</span>
            <span className={sortBy === 'recommended' ? styles.sortActive : ''} onClick={() => setSortBy('recommended')}>Recommended</span>
            <span className={sortBy === 'fastest' ? styles.sortActive : ''} onClick={() => setSortBy('fastest')}>Fastest</span>
          </div>

          {loading && (
            <div className={styles.skeletonList}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonHeader}></div>
                  <div className={styles.skeletonBody}></div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
            </div>
          )}

          {!loading && !error && sortedFlights.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No flights found matching your filters</h3>
              <p>Try clearing some filters or adjusting your search.</p>
              <button className={styles.retryBtn} onClick={clearAllFilters} style={{marginTop: '1rem'}}>Clear Filters</button>
            </div>
          )}

          {!loading && !error && sortedFlights.map(flight => (
            <div key={flight.id} className={styles.flightCard}>
              <div className={styles.airlineInfo}>
                <div className={styles.logoPlaceholder}>{(flight.airline || '??').substring(0, 2).toUpperCase()}</div>
                <div>
                  <h4>{flight.airline || 'Unknown Airline'}</h4>
                  <p className={styles.flightNo}>{flight.flightNumber}</p>
                </div>
              </div>
              
              <div className={styles.flightTimes}>
                <div className={styles.timeBlock}>
                  <span className={styles.time}>{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className={styles.airport}>{flight.departureAirport}</span>
                </div>
                
                <div className={styles.durationBlock}>
                  <span className={styles.duration}>{flight.duration}</span>
                  <div className={styles.line}></div>
                  <span className={styles.stops}>{(!flight.stops || flight.stops === 0) ? 'Direct' : `${flight.stops} Stop(s)`}</span>
                </div>
                
                <div className={styles.timeBlock}>
                  <span className={styles.time}>{new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className={styles.airport}>{flight.arrivalAirport}</span>
                </div>
              </div>

              <div className={styles.priceAction}>
                <div className={styles.price}>
                  <span className={styles.currency}>{state.currencySymbol}</span>
                  <span className={styles.amount}>{Math.round((flight.price + 45) * state.exchangeRate)}</span>
                </div>
                <p style={{fontSize: '11px', color: '#64748b', marginTop: '-4px', marginBottom: '8px'}}>incl. taxes</p>
                <button 
                  className={styles.selectBtn}
                  onClick={() => handleSelectFlight(flight)}
                >
                  Select Flight
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export default function FlightResults() {
  return (
    <main className={styles.main}>
      <Header />
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading flights...</div>}>
        <FlightResultsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
