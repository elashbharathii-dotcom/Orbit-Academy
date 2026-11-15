import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_phase1_neptune';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\discovery_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Chromium for Phase 1 Neptune AAA Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9235',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:5173/discovery/neptune'
]);

await new Promise(r => setTimeout(r, 2500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9235/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page');
        resolve(page.webSocketDebuggerUrl);
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
  if (callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, (res) => resolve(res.result));
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
await send('Page.enable');
await send('Runtime.enable');

console.log('Connected to Chromium CDP for Phase 1 Neptune AAA verification');

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true
  });
  return res?.result?.value;
}

async function capture(filename) {
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, filename), Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved screenshot: ${filename}`);
}

// -----------------------------------------------------------------------------
// 1. NEPTUNE AAA HERO 3D GLOBE (72% Viewport Presence)
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Neptune AAA Hero 3D Globe ---');
await new Promise(r => setTimeout(r, 3000));
const heroState = await evalCode(`(() => ({
  title: document.querySelector('h1')?.textContent,
  hasCanvas: !!document.querySelector('canvas'),
  hasLauraCard: document.body.innerText.includes('LAURA AI GUIDE')
}))()`);
console.log('Hero Globe State:', heroState);
await capture('phase1-01-neptune-aaa-hero.png');

// -----------------------------------------------------------------------------
// 2. CLOSE-UP ATMOSPHERE INSPECTION (Zoom In)
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Cinematic Zoom In on Atmosphere ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Zoom: Master'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1500));
await capture('phase1-02-neptune-closeup-atmosphere.png');

// -----------------------------------------------------------------------------
// 3. RESET VIEW
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Reset View ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset View'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1500));
await capture('phase1-03-neptune-reset-view.png');

// -----------------------------------------------------------------------------
// 4. WIDESCREEN UNOBSTRUCTED VIEW (Hide Dossier)
// -----------------------------------------------------------------------------
console.log('\n--- 4. Toggling Widescreen Unobstructed Mode ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hide Dossier'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1200));
await capture('phase1-04-neptune-widescreen-unobstructed.png');

// -----------------------------------------------------------------------------
// 5. CLICK HOTSPOT (The Great Dark Spot Storm Vortex)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Clicking Hotspot: The Great Dark Spot ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('The Great Dark Spot'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1800));

const hotspotState = await evalCode(`(() => {
  const p = document.querySelector('p');
  return {
    subtitleSnippet: p ? p.textContent.substring(0, 90) : null
  };
})()`);
console.log('Hotspot Vortex State:', hotspotState);
await capture('phase1-05-neptune-hotspot-vortex.png');

console.log('\nPhase 1 Neptune AAA 3D Rendering & Scale Verification Complete!');

ws.close();
chromeProc.kill();
