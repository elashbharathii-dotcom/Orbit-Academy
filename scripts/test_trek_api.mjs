import https from 'https';

https.get('https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars', { headers: { 'User-Agent': 'OrbitAcademy/2.0' } }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Doc Status:', res.statusCode, 'Length:', body.length);
    const matches = body.match(/https?:\/\/[^\s"'<>]+/g) || [];
    console.log('Unique URLs in doc (sample):', [...new Set(matches)].slice(0, 20));
    
    // Look for endpoints and API paths
    const lines = body.split('\n').filter(l => 
      l.toLowerCase().includes('wmts') || 
      l.toLowerCase().includes('/api') || 
      l.toLowerCase().includes('layer') ||
      l.toLowerCase().includes('trek')
    );
    console.log(`\nFound ${lines.length} matching lines. Sample:`);
    lines.slice(0, 25).forEach(l => console.log('  ', l.trim().slice(0, 140)));
  });
}).on('error', err => console.error(err));
