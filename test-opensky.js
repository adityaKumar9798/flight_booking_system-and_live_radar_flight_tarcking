async function test() {
  try {
    const res = await fetch('https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.4921');
    const json = await res.json();
    console.log("Status:", res.status);
    console.log("Response states count:", json.states ? json.states.length : 0);
    if(json.states && json.states.length > 0) {
      console.log("First state:", json.states[0]);
    }
  } catch (e) {
    console.error(e);
  }
}
test();
