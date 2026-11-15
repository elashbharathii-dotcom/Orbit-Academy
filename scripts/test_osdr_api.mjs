import fetch from 'node-fetch';

async function testEndpoints() {
  const urls = [
    'https://visualization.osdr.nasa.gov/biodata/api/',
    'https://visualization.osdr.nasa.gov/biodata/api/v1/',
    'https://visualization.osdr.nasa.gov/biodata/api/v2/',
    'https://visualization.osdr.nasa.gov/biodata/api/schema/',
    'https://visualization.osdr.nasa.gov/biodata/api/swagger/',
    'https://osdr.nasa.gov/osdr/data/search',
    'https://osdr.nasa.gov/geode-py/ws/api/tabular/search',
    'https://osdr.nasa.gov/geode-py/ws/api/study',
  ];

  for (const url of urls) {
    try {
      console.log(`\nTesting: ${url}`);
      const res = await fetch(url, { headers: { 'User-Agent': 'OrbitAcademy/1.0' } });
      console.log(`Status: ${res.status} ${res.statusText}, Content-Type: ${res.headers.get('content-type')}`);
      const text = await res.text();
      console.log(`Body (first 300 chars): ${text.slice(0, 300).replace(/\r?\n|\r/g, ' ')}`);
    } catch (e) {
      console.log(`Error testing ${url}: ${e.message}`);
    }
  }
}

testEndpoints();
