import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightId = searchParams.get('flightId');
  const callsign = searchParams.get('callsign');

  if (!flightId && !callsign) {
    return NextResponse.json({ error: 'Missing flight identifier' }, { status: 400 });
  }

  // The user requested to use airplanes.live as primary and opensky as fallback.
  // The provided credentials: {"clientId":"hsks-api-client","clientSecret":"epkhzGUOKQXp5tXPRVER8ra8jWtde4Re"}
  
  try {
    // We try airplanes.live first
    // Note: Due to 403 Forbidden on public endpoint, we pass the provided credentials as headers
    const reqHeaders = new Headers({
      'Content-Type': 'application/json',
      'Client-ID': 'hsks-api-client',
      'Client-Secret': 'epkhzGUOKQXp5tXPRVER8ra8jWtde4Re',
      'User-Agent': 'AeroSky/1.0'
    });

    // Try to get flight by callsign (e.g. ASKY615 -> ASKY615)
    const activeCallsign = callsign || flightId;
    
    // Note: If this fails or returns empty, the UI will correctly show "Unavailable".
    // We do NOT fake the aircraft coordinates.
    
    const airplanesRes = await fetch(`https://api.airplanes.live/v2/callsign/${activeCallsign}`, {
      headers: reqHeaders,
      // short timeout so it fails fast to fallback
      signal: AbortSignal.timeout(4000)
    });

    if (airplanesRes.ok) {
      const data = await airplanesRes.json();
      if (data && data.ac && data.ac.length > 0) {
        // airplanes.live format
        const ac = data.ac[0];
        return NextResponse.json({
          data: {
            lat: ac.lat,
            lon: ac.lon,
            altitude: ac.alt_baro === 'ground' ? 0 : (ac.alt_baro || 0),
            speed: ac.gs || 0, // ground speed in knots
            heading: ac.track || 0,
            callsign: ac.flight ? ac.flight.trim() : activeCallsign,
            status: ac.alt_baro === 'ground' ? 'On Ground' : 'In Air',
            updated: ac.seen_pos ? Math.floor(Date.now() / 1000) - ac.seen_pos : 0 // seconds ago
          }
        });
      }
    }

    // Fallback to OpenSky Network
    const authHeader = 'Basic ' + Buffer.from(`hsks-api-client:epkhzGUOKQXp5tXPRVER8ra8jWtde4Re`).toString('base64');
    const openSkyRes = await fetch(`https://opensky-network.org/api/states/all`, {
      headers: {
        'Authorization': authHeader
      },
      signal: AbortSignal.timeout(5000)
    });

    if (openSkyRes.ok) {
      const data = await openSkyRes.json();
      
      if (data.states && data.states.length > 0) {
        // OpenSky doesn't easily filter by callsign on the API side without an exact match padded to 8 chars.
        // We will filter it manually here.
        const searchStr = (activeCallsign || '').toLowerCase().replace(/\s/g, '');
        const match = data.states.find((state: any[]) => {
          const cs = (state[1] || '').toLowerCase().replace(/\s/g, '');
          return cs === searchStr;
        });

        if (match) {
          return NextResponse.json({
            data: {
              lat: match[6],
              lon: match[5],
              altitude: (match[7] || 0) * 3.28084, // meters to ft
              speed: (match[9] || 0) * 3.6, // m/s to km/h
              heading: match[10] || 0,
              callsign: match[1] ? match[1].trim() : activeCallsign,
              status: match[8] ? 'On Ground' : 'In Air',
              updated: Math.floor(Date.now() / 1000) - match[3]
            }
          });
        }
      }
    }

    // Aircraft not found on any network (which is expected for our mock flights)
    // We return a specific error that the frontend will catch to show "Live tracking is currently unavailable"
    return NextResponse.json({ error: 'Aircraft not found on live radar' }, { status: 404 });
    
  } catch (err: any) {
    console.error("Tracking API Error:", err);
    return NextResponse.json({ error: 'Tracking service unavailable' }, { status: 503 });
  }
}
