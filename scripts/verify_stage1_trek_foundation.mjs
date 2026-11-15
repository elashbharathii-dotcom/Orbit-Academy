import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_nasa';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\trek_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Edge for Stage 1 NASA Trek Data Foundation Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9270',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/trek-preview'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9270/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
        resolve(page ? page.webSocketDebuggerUrl : json[0].webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);

let idCounter = 1;
const callbacks = new Map();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Runtime.consoleAPICalled') {
    const text = msg.params.args.map(a => a.value || a.description).join(' ');
    if (msg.params.type === 'error') {
      console.error('[BROWSER ERROR]', text);
    }
  }
  if (msg.id && callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

function sendCommand(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
console.log('Connected to CDP websocket on port 9270');

await sendCommand('Runtime.enable');

async function evalCode(expression) {
  const res = await sendCommand('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.result?.value;
}

async function captureScreenshot(filename) {
  const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
  const filePath = path.join(artifactDir, filename);
  fs.writeFileSync(filePath, Buffer.from(res.result.data, 'base64'));
  const size = fs.statSync(filePath).size;
  console.log(`Saved screenshot: ${filename} (${size} bytes)`);
  return size;
}

try {
  // 1. Initial Mars 3D view with MOLA Topography and nomenclature hotspots
  console.log('\n--- 1. Capturing Mars 3D Planetary Sphere with NASA MOLA Layer ---');
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('trek-01-mars-3d-mola.png');

  // 2. Switch to Moon Destination
  console.log('\n--- 2. Switching to Moon and Capturing LRO WAC Mosaic ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const moonBtn = buttons.find(b => b.textContent && b.textContent.includes('Moon'));
      if (moonBtn) moonBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('trek-02-moon-3d-lro.png');

  // 3. Switch back to Mars and click a landmark (e.g. Olympus Mons)
  console.log('\n--- 3. Inspecting Olympus Mons Nomenclature Feature ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const marsBtn = buttons.find(b => b.textContent && b.textContent.includes('Mars'));
      if (marsBtn) marsBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await evalCode(`
    (() => {
      const items = Array.from(document.querySelectorAll('div'));
      const olympusItem = items.find(d => d.textContent && d.textContent.includes('Olympus Mons') && d.textContent.includes('Mons'));
      if (olympusItem) olympusItem.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('trek-03-mars-olympus-mons-inspected.png');

  // 4. Switch to 2D Stitched Equirectangular Map tab
  console.log('\n--- 4. Switching to 2D Stitched Equirectangular Map ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mapBtn = buttons.find(b => b.textContent && b.textContent.includes('2D Stitched Map'));
      if (mapBtn) mapBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('trek-04-mars-2d-stitched-map.png');

  // 5. Switch to WMTS Tile Matrix Inspector tab
  console.log('\n--- 5. Switching to WMTS Tile Matrix Inspector ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tileBtn = buttons.find(b => b.textContent && b.textContent.includes('WMTS Tiles'));
      if (tileBtn) tileBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('trek-05-wmts-tiles-inspector.png');

  console.log('\nAll Stage 1 NASA Trek Data Foundation verification captures completed successfully!');
} catch (err) {
  console.error('Error during Stage 1 verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
