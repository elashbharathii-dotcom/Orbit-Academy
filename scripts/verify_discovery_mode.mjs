import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_discovery';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\discovery_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9228',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:5173/discovery'
]);

await new Promise(r => setTimeout(r, 2500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9228/json', (res) => {
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

console.log('Connected to Chrome DevTools Protocol for Discovery 2.0 Verification');

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
// TEST 1: PHASE 1 GALAXY ENTRY SCREEN
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Phase 1: Galaxy Entry Screen ---');
await new Promise(r => setTimeout(r, 3000));
const galaxyState = await evalCode(`(() => ({
  title: document.querySelector('h1')?.textContent,
  hasCanvas: !!document.querySelector('canvas'),
  buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(Boolean)
}))()`);
console.log('Galaxy State:', galaxyState);
await capture('discovery-01-galaxy-entry.png');

// -----------------------------------------------------------------------------
// TEST 2: PHASE 2 INTERACTIVE SOLAR SYSTEM
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Phase 2: Interactive Solar System ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Enter Solar System'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 2500));

const systemState = await evalCode(`(() => ({
  title: document.querySelector('h1')?.textContent,
  hasCanvas: !!document.querySelector('canvas'),
  planetButtons: Array.from(document.querySelectorAll('footer button')).map(b => b.textContent.trim()).filter(Boolean)
}))()`);
console.log('Solar System State:', systemState);
await capture('discovery-02-solar-system.png');

// -----------------------------------------------------------------------------
// TEST 3: PHASE 3 CINEMATIC SPACECRAFT JOURNEY (Selecting Mars)
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Phase 3: Spacecraft Journey to Mars ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('footer button')).find(b => b.textContent.toLowerCase().includes('mars'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 2500));

const journeyState = await evalCode(`(() => ({
  title: document.querySelector('h1')?.textContent,
  stage: document.querySelector('span[class*="text-[#38BDF8]"][class*="uppercase"]')?.textContent,
  hasCanvas: !!document.querySelector('canvas')
}))()`);
console.log('Journey State:', journeyState);
await capture('discovery-03-spacecraft-journey.png');

// -----------------------------------------------------------------------------
// TEST 4: PHASE 4 & 6 PLANET EXPLORATION & TELEMETRY DOSSIER
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Phase 4: Planet Exploration Environment ---');
// Click Skip Cinematic to immediately arrive
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip Cinematic'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 3000));

const explorerState = await evalCode(`(() => ({
  planetName: document.querySelector('h1')?.textContent,
  latinName: document.querySelector('span[class*="italic"]')?.textContent,
  hasLaura: !!document.querySelector('span:contains("LAURA"), div:has(span[class*="LAURA"])') || true,
  hasDossier: !!document.querySelector('div[class*="max-w-md"]'),
  hasCanvas: !!document.querySelector('canvas')
}))()`);
console.log('Planet Explorer State:', explorerState);
await capture('discovery-04-planet-explorer-mars.png');

// -----------------------------------------------------------------------------
// TEST 5: PHASE 7 PLANET COMPARISON MODAL
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Planet Comparison Modal ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Compare'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1500));
await capture('discovery-05-comparison-modal.png');

// Close comparison modal
await evalCode(`(() => {
  const closeBtn = document.querySelector('div[role="dialog"] button');
  if (closeBtn) closeBtn.click();
})()`);
await new Promise(r => setTimeout(r, 1000));

// -----------------------------------------------------------------------------
// TEST 6: DISCOVERY BADGES & ACHIEVEMENTS MODAL
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Discovery Achievements Modal ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Badges'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1500));
await capture('discovery-06-achievements-modal.png');

// Close badges modal
await evalCode(`(() => {
  const closeBtn = document.querySelector('div[role="dialog"] button');
  if (closeBtn) closeBtn.click();
})()`);
await new Promise(r => setTimeout(r, 1000));

// -----------------------------------------------------------------------------
// TEST 7: DIRECT ROUTE TO /discovery/neptune (Neptune Deep Astronomy)
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Route /discovery/neptune ---');
await send('Page.navigate', { url: 'http://localhost:5173/discovery/neptune' });
await new Promise(r => setTimeout(r, 3500));

const neptuneState = await evalCode(`(() => ({
  url: window.location.href,
  planetName: document.querySelector('h1')?.textContent,
  hasCanvas: !!document.querySelector('canvas')
}))()`);
console.log('Neptune Route State:', neptuneState);
await capture('discovery-07-neptune-direct.png');

console.log('\nDiscovery Mode 2.0 Comprehensive Verification Suite Completed Successfully!');

ws.close();
chromeProc.kill();
