const https = require('http');

const apiKey = "10a6a481c1f5af8ead43ceda48d9b819"; // from .env.local
const flightIata = 'BA138';

const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightIata}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(`Found ${parsed.data ? parsed.data.length : 0} flights.`);
      if (parsed.data && parsed.data.length > 0) {
        console.log(JSON.stringify(parsed.data[0], null, 2));
      } else {
        console.log(parsed);
      }
    } catch(e) {
      console.log(data);
    }
  });
}).on('error', (err) => console.log(err));
