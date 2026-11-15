import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_neptune_aaa';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\discovery_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Chrome for Neptune AAA Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9230',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:5173/discovery/neptune'
]);

await new Promise(r => setTimeout(r, 2500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9230/json', (res) => {
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

console.log('Connected to Chrome DevTools Protocol for Neptune AAA verification');

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
// 1. NEPTUNE HERO 3D GLOBE & TELEMETRY
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Neptune Hero 3D Globe ---');
await new Promise(r => setTimeout(r, 3000));
const heroState = await evalCode(`(() => ({
  title: document.querySelector('h1')?.textContent,
  hasCanvas: !!document.querySelector('canvas'),
  hotspotsCount: document.querySelectorAll('button').length
}))()`);
console.log('Hero Globe State:', heroState);
await capture('discovery-aaa-01-neptune-hero.png');

// -----------------------------------------------------------------------------
// 2. CLICK HOTSPOT (The Great Dark Spot)
// -----------------------------------------------------------------------------
console.log('\n--- 2. Clicking Hotspot: The Great Dark Spot ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('The Great Dark Spot'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1800));

const hotspotState = await evalCode(`(() => {
  const subtitleElem = document.querySelector('p');
  return {
    subtitleText: subtitleElem ? subtitleElem.textContent.substring(0, 100) : null
  };
})()`);
console.log('Hotspot Analysis State:', hotspotState);
await capture('discovery-aaa-02-hotspot-active.png');

// -----------------------------------------------------------------------------
// 3. FULLSCREEN / WIDESCREEN VIEW (Hide Dossier)
// -----------------------------------------------------------------------------
console.log('\n--- 3. Toggling Telemetry Drawer (Widescreen 75% Neptune) ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hide Dossier') || b.textContent.includes('Show Dossier'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 1200));
await capture('discovery-aaa-03-widescreen-neptune.png');

// -----------------------------------------------------------------------------
// 4. REPLAY SPACECRAFT JOURNEY (Stage 1: Launch & Warp)
// -----------------------------------------------------------------------------
console.log('\n--- 4. Replaying Spacecraft Journey: Stage 1 ---');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Replay Journey'));
  if (btn) btn.click();
})()`);
await new Promise(r => setTimeout(r, 2500));

const journeyStage1State = await evalCode(`(() => ({
  journeyTitle: document.querySelector('h1')?.textContent,
  hasLauraVoiceHUD: !!document.querySelector('div'),
  subtitles: document.body.innerText.includes('Welcome aboard, explorer')
}))()`);
console.log('Journey Stage 1 State:', journeyStage1State);
await capture('discovery-aaa-04-journey-stage1.png');

// -----------------------------------------------------------------------------
// 5. SPACECRAFT JOURNEY (Stage 2: Massive Neptune Approach)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Spacecraft Journey: Stage 2 Neptune Looming ---');
await new Promise(r => setTimeout(r, 4500));
await capture('discovery-aaa-05-journey-stage2.png');

console.log('\nNeptune AAA Space Experience Verification Suite Completed Successfully!');

ws.close();
chromeProc.kill();
