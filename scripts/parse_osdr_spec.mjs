import fetch from 'node-fetch';
import fs from 'fs';

async function parseOpenApi() {
  const res = await fetch('https://visualization.osdr.nasa.gov/biodata/api/');
  const openapi = await res.json();
  
  console.log('API Title:', openapi.info?.title);
  console.log('API Version:', openapi.info?.version);
  console.log('Description:', openapi.info?.description?.slice(0, 200));

  console.log('\nPaths:');
  for (const [pathKey, pathObj] of Object.entries(openapi.paths || {})) {
    const methods = Object.keys(pathObj).join(', ').toUpperCase();
    const summary = pathObj.get?.summary || pathObj.post?.summary || '';
    const desc = pathObj.get?.description || pathObj.post?.description || '';
    console.log(`- ${pathKey} [${methods}]: ${summary || desc.slice(0, 80)}`);
  }

  // Save the full spec to scratch for deep analysis
  fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\osdr_openapi.json', JSON.stringify(openapi, null, 2));
  console.log('\nWrote osdr_openapi.json to scratch.');
}

parseOpenApi();
