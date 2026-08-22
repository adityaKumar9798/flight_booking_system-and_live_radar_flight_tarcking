async function getActive() {
  try {
    const res = await fetch('https://opensky-network.org/api/states/all?lamin=20&lomin=-130&lamax=50&lomax=-60'); // US area roughly
    const data = await res.json();
    if (data.states && data.states.length > 0) {
      // Find 5 random callsigns
      const callsigns = data.states
        .filter((s) => s[1] && s[1].trim().length > 2)
        .slice(0, 5)
        .map((s) => s[1].trim());
      console.log("Active callsigns:", callsigns.join(', '));
    } else {
      console.log("No states found.");
    }
  } catch (e) {
    console.error(e);
  }
}
getActive();
