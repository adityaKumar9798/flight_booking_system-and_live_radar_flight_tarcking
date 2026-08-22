async function test() {
  try {
    const res = await fetch('https://api.airplanes.live/v2/callsign/UAL', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}
test();
