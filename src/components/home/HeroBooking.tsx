'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/booking-context';
import { airports } from '@/lib/airports';
import styles from './HeroBooking.module.css';

export default function HeroBooking() {
  const router = useRouter();
  const { updateSearch } = useBooking();

  const [tripType, setTripType] = useState('Round trip');
  const [isTripDropdownOpen, setIsTripDropdownOpen] = useState(false);
  
  const [travelClass, setTravelClass] = useState('Economy');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isPassengerPopupOpen, setIsPassengerPopupOpen] = useState(false);
  const [activePopupTab, setActivePopupTab] = useState('Travel details');
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('');

  const [from, setFrom] = useState('Mumbai (BOM)');
  const [to, setTo] = useState('London (LHR)');
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);

  const tripDropdownRef = useRef<HTMLDivElement>(null);
  const passengerPopupRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tripDropdownRef.current && !tripDropdownRef.current.contains(event.target as Node)) {
        setIsTripDropdownOpen(false);
      }
      if (passengerPopupRef.current && !passengerPopupRef.current.contains(event.target as Node)) {
        setIsPassengerPopupOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalTravellers = adults + children + infants;
  const daysInMonth = Array.from({length: 31}, (_, i) => i + 1);

  // Filter airports for autocomplete
  const getFilteredAirports = (query: string) => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return airports.filter(a => 
      a.city.toLowerCase().includes(lowerQuery) || 
      a.iata.toLowerCase().includes(lowerQuery) ||
      a.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to 5 results
  };

  const handleSelectAirport = (field: 'from' | 'to', airport: any) => {
    const formattedStr = `${airport.city} (${airport.iata})`;
    if (field === 'from') setFrom(formattedStr);
    else setTo(formattedStr);
    setActiveInput(null);
  };

  const handleSearch = () => {
    // If not fully filled, we just use defaults for the demo
    updateSearch({
      from: from || 'JFK',
      to: to || 'LHR',
      date: selectedDateRange || 'Aug 15',
      adults,
      children,
      infants,
      travelClass,
      tripType
    });
    
    router.push(`/flights?from=${encodeURIComponent(from || 'JFK')}&to=${encodeURIComponent(to || 'LHR')}`);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <section className={styles.container}>
      <div className={styles.bookingWidget}>
        <div className={styles.topOptions}>
          
          <div className={styles.dropdownWrapper} ref={tripDropdownRef}>
            <button 
              className={`${styles.optionButton} ${isTripDropdownOpen ? styles.active : ''}`}
              onClick={() => setIsTripDropdownOpen(!isTripDropdownOpen)}
            >
              {tripType}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={isTripDropdownOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}/>
              </svg>
            </button>
            
            {isTripDropdownOpen && (
              <div className={styles.tripDropdown}>
                {['Round trip', 'One-way', 'Multi-city'].map((type) => (
                  <div 
                    key={type}
                    className={`${styles.tripItem} ${tripType === type ? styles.selected : ''}`}
                    onClick={() => {
                      setTripType(type);
                      setIsTripDropdownOpen(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dropdownWrapper} ref={passengerPopupRef}>
            <button 
              className={`${styles.optionButton} ${isPassengerPopupOpen ? styles.active : ''}`}
              onClick={() => setIsPassengerPopupOpen(!isPassengerPopupOpen)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5-5 5 5M7 9l5 5 5-5"/></svg>
              {travelClass}, {totalTravellers} {totalTravellers === 1 ? 'Traveller' : 'Travellers'}
            </button>

            {isPassengerPopupOpen && (
              <div className={styles.passengerPopup}>
                <div className={styles.popupHeader}>
                  <div className={styles.popupTabs}>
                    <div 
                      className={`${styles.popupTab} ${activePopupTab === 'Travel details' ? styles.active : ''}`}
                      onClick={() => setActivePopupTab('Travel details')}
                    >
                      Travel details
                    </div>
                    <div 
                      className={`${styles.popupTab} ${activePopupTab === 'Redeem miles' ? styles.active : ''}`}
                      onClick={() => setActivePopupTab('Redeem miles')}
                    >
                      Redeem miles
                    </div>
                  </div>
                  <button className={styles.closePopup} onClick={() => setIsPassengerPopupOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                {activePopupTab === 'Travel details' ? (
                  <>
                    <div className={styles.popupContent}>
                      <div className={styles.popupLeft}>
                        <span className={styles.popupLabel}>Travel class</span>
                        <select 
                          className={styles.classSelect}
                          value={travelClass}
                          onChange={(e) => setTravelClass(e.target.value)}
                        >
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="First">First</option>
                        </select>

                        <div className={styles.counterRow}>
                          <div>
                            <span className={styles.counterLabel}>Adults</span>
                          </div>
                          <div className={styles.counterControls}>
                            <button className={styles.counterBtn} onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
                            <span className={styles.counterValue}>{adults}</span>
                            <button className={styles.counterBtn} onClick={() => setAdults(adults + 1)}>+</button>
                          </div>
                        </div>

                        <div className={styles.counterRow}>
                          <div>
                            <span className={styles.counterLabel}>Children</span>
                            <span className={styles.counterSub}>(2-11 years)</span>
                          </div>
                          <div className={styles.counterControls}>
                            <button className={styles.counterBtn} onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                            <span className={styles.counterValue}>{children}</span>
                            <button className={styles.counterBtn} onClick={() => setChildren(children + 1)}>+</button>
                          </div>
                        </div>

                        <div className={styles.counterRow}>
                          <div>
                            <span className={styles.counterLabel}>Infants without seat</span>
                            <span className={styles.counterSub}>(0-23 months)</span>
                          </div>
                          <div className={styles.counterControls}>
                            <button className={styles.counterBtn} onClick={() => setInfants(Math.max(0, infants - 1))}>−</button>
                            <span className={styles.counterValue}>{infants}</span>
                            <button className={styles.counterBtn} onClick={() => setInfants(infants + 1)}>+</button>
                          </div>
                        </div>

                        <div className={styles.groupBooking}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          <span>Group bookings for 10 or more passengers.</span>
                        </div>
                      </div>

                      <div className={styles.popupRight}>
                        <h3 className={styles.rightTitle}>Alternative fare selection</h3>
                        <h4 className={styles.rightSubtitle}>Which fare benefits do you prefer?</h4>
                        
                        <div className={styles.radioGroup}>
                          <label className={styles.radioLabel}>
                            <input type="radio" name="fare" defaultChecked />
                            Best price offers
                          </label>
                          <label className={styles.radioLabel}>
                            <input type="radio" name="fare" />
                            Change the sequence of my flights
                          </label>
                          <label className={styles.radioLabel}>
                            <input type="radio" name="fare" />
                            Flexibility/highest booking class to collect more miles
                          </label>
                        </div>

                        <div className={styles.accessCode}>
                          <div className={styles.accessCodeInputWrapper}>
                            <input type="text" placeholder="Access code" />
                            <span className={styles.accessCodeOptional}>Optional</span>
                          </div>
                          <p className={styles.accessCodeHint}>
                            This field is for access codes only. If you have a promotional code, please enter it on the payment page.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.popupFooter}>
                      <button 
                        className={styles.continueBtn}
                        onClick={() => setIsPassengerPopupOpen(false)}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.popupContent} style={{ flexDirection: 'column', gap: '2rem' }}>
                    <h2 className={styles.redeemTitle}>Choose from two ways to use your miles.</h2>
                    <div className={styles.redeemGrid}>
                      <div className={styles.redeemCol}>
                        <h3 className={styles.redeemColTitle}>Cash & Miles</h3>
                        <ul className={styles.redeemList}>
                          <li className={styles.redeemListItem}>
                            <svg className={styles.redeemCheck} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="white" d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Redeem from just 3,000 miles.
                          </li>
                          <li className={styles.redeemListItem}>
                            <svg className={styles.redeemCheck} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="white" d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Choose freely how many miles you want to use.
                          </li>
                          <li className={styles.redeemListItem}>
                            <svg className={styles.redeemCheck} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="white" d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Available for any travel date.
                          </li>
                        </ul>
                        <button className={styles.redeemLoginBtn}>Continue with login</button>
                        <p className={styles.redeemHint}>The Cash & Miles payment option will be displayed after you select your flight.</p>
                        <a href="#" className={styles.redeemLink}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          Become a member
                        </a>
                      </div>
                      <div className={styles.redeemCol}>
                        <h3 className={styles.redeemColTitle}>Book Award Flights</h3>
                        <ul className={styles.redeemList}>
                          <li className={styles.redeemListItem}>
                            <svg className={styles.redeemCheck} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="white" d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Start redeeming from just 15,000 miles.
                          </li>
                          <li className={styles.redeemListItem}>
                            <svg className={styles.redeemCheck} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="white" d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Redeem miles based on your destination and travel class.
                          </li>
                          <li className={styles.redeemListItem}>
                            <svg className={styles.redeemCheck} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="white" d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Our most popular way to redeem miles worldwide.
                          </li>
                        </ul>
                        <button className={styles.redeemOutlineBtn}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                          Search award flights
                        </button>
                        <p className={styles.redeemHint}>You're being sent to miles-and-more.com to continue.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <label className={styles.checkboxOption}>
            <input type="checkbox" />
            Nonstop only
          </label>
        </div>
        
        <div className={styles.formGrid} ref={autocompleteRef}>
          <div className={styles.inputGroup} style={{ flex: 1.2 }}>
            <label>From</label>
            <input 
              type="text" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              onFocus={() => setActiveInput('from')}
              placeholder="e.g. JFK or New York"
            />
            {activeInput === 'from' && getFilteredAirports(from).length > 0 && (
              <div className={styles.autocompleteDropdown}>
                {getFilteredAirports(from).map((airport) => (
                  <div 
                    key={airport.iata} 
                    className={styles.autocompleteItem}
                    onClick={() => handleSelectAirport('from', airport)}
                  >
                    <div className={styles.acCity}>
                      <span>{airport.city}</span>
                      <span className={styles.acIata}>{airport.iata}</span>
                    </div>
                    <span className={styles.acName}>{airport.name} • {airport.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.swapIcon} onClick={handleSwap} style={{ cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10h14l-4-4M17 14H3l4 4"/>
            </svg>
          </div>
          
          <div className={styles.inputGroup} style={{ flex: 1.2 }}>
            <label>To</label>
            <input 
              type="text" 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setActiveInput('to')}
              placeholder="e.g. LHR or London" 
            />
            {activeInput === 'to' && getFilteredAirports(to).length > 0 && (
              <div className={styles.autocompleteDropdown}>
                {getFilteredAirports(to).map((airport) => (
                  <div 
                    key={airport.iata} 
                    className={styles.autocompleteItem}
                    onClick={() => handleSelectAirport('to', airport)}
                  >
                    <div className={styles.acCity}>
                      <span>{airport.city}</span>
                      <span className={styles.acIata}>{airport.iata}</span>
                    </div>
                    <span className={styles.acName}>{airport.name} • {airport.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.inputGroup} style={{ flex: 1.2 }}>
            <label>&nbsp;</label>
            <div className={styles.dateInputWrapper} ref={calendarRef}>
              <input 
                type="text" 
                placeholder="Departure - Return" 
                value={selectedDateRange}
                readOnly
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              />
              <svg className={styles.calendarIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>

              {isCalendarOpen && (
                <div className={styles.calendarPopup}>
                  <div className={styles.calendarMonth}>
                    <button>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <span>August 2026</span>
                    <button>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                  <div className={styles.calendarWeekdays}>
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div className={styles.calendarDays}>
                    <div className={`${styles.calendarDay} ${styles.disabled}`}>29</div>
                    <div className={`${styles.calendarDay} ${styles.disabled}`}>30</div>
                    <div className={`${styles.calendarDay} ${styles.disabled}`}>31</div>
                    
                    {daysInMonth.map(day => {
                      const isSelected = selectedDateRange.includes(`Aug ${day}`);
                      return (
                        <div 
                          key={day} 
                          className={`${styles.calendarDay} ${isSelected ? styles.selected : ''}`}
                          onClick={() => {
                            // Simple logic to mock a range selection for demonstration
                            const endDay = day + 5 <= 31 ? day + 5 : 31;
                            setSelectedDateRange(`Aug ${day} - Aug ${endDay}`);
                            setTimeout(() => setIsCalendarOpen(false), 300); // close after slight delay
                          }}
                        >
                          {day}
                        </div>
                      );
                    })}
                    
                    <div className={`${styles.calendarDay} ${styles.disabled}`}>1</div>
                    <div className={`${styles.calendarDay} ${styles.disabled}`}>2</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button className={styles.submitBtn} onClick={handleSearch}>Find flights</button>
        </div>
      </div>
    </section>
  );
}
