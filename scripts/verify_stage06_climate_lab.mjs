import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_s06_clean';
const stage06Dir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage06_verification';
const rootArtifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';

if (fs.existsSync(userDataDir)) {
  fs.rmSync(userDataDir, { recursive: true, force: true });
}
if (!fs.existsSync(stage06Dir)) {
  fs.mkdirSync(stage06Dir, { recursive: true });
}

console.log('Launching headless Edge on port 9320 with clean profile for Stage 06 Climate Lab...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9320',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,940',
  'http://localhost:5173/climate'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9320/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page' && t.url.includes('/climate')) ||
                     json.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
        resolve(page ? page.webSocketDebuggerUrl : json[0].webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

const wsUrl = await getWsUrl();
console.log('Connected to CDP at:', wsUrl);
const ws = new WebSocket(wsUrl);

let idCounter = 1;
const callbacks = new Map();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && callbacks.has(msg.id)) {
    callbacks.get(msg.id)(msg);
    callbacks.delete(msg.id);
  }
};

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = idCounter++;
    callbacks.set(id, (res) => {
      if (res.error) reject(res.error);
      else resolve(res.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);

// Enable required domains
await send('Page.enable');
await send('DOM.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 940,
  deviceScaleFactor: 1,
  mobile: false
});

async function captureShot(filename) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(res.data, 'base64');
  const filePath1 = path.join(stage06Dir, filename);
  const filePath2 = path.join(rootArtifactDir, filename);
  fs.writeFileSync(filePath1, buffer);
  fs.writeFileSync(filePath2, buffer);
  console.log(`Captured: ${filename} (${buffer.length} bytes)`);
}

async function evalCode(expression) {
  return send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
}

console.log('Waiting for initial /climate page render (3D Earth)...');
await new Promise(r => setTimeout(r, 4000));

// 1. Screenshot 1: 3D Global Earth Environment
console.log('1. Capturing stage06-01-3d-earth-environment.png...');
await captureShot('stage06-01-3d-earth-environment.png');

// 2. Screenshot 2: Switch to Climate Dashboard & 8 Layers
console.log('2. Switching to Climate Dashboard & 8 Layers tab...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('Climate Dashboard'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
console.log('Capturing stage06-02-climate-dashboard-layers.png...');
await captureShot('stage06-02-climate-dashboard-layers.png');

// 3. Screenshot 3: Surface Temperature Layer Selected
console.log('3. Selecting Surface Temp layer...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tempBtn = buttons.find(b => b.textContent && b.textContent.includes('Surface Temp'));
    if (tempBtn) tempBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1500));
console.log('Capturing stage06-03-surface-temperature-layer.png...');
await captureShot('stage06-03-surface-temperature-layer.png');

// 4. Screenshot 4: Active Fires (FIRMS) Layer Selected
console.log('4. Selecting Fires (FIRMS) layer...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const fireBtn = buttons.find(b => b.textContent && b.textContent.includes('Fires (FIRMS)'));
    if (fireBtn) fireBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1500));
console.log('Capturing stage06-04-active-fires-firms.png...');
await captureShot('stage06-04-active-fires-firms.png');

// 5. Screenshot 5: Switch to Earth vs. Mars Climate Comparison
console.log('5. Switching to Earth vs. Mars Climate tab...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('Earth vs. Mars Climate'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
console.log('Capturing stage06-05-earth-vs-mars-comparison.png...');
await captureShot('stage06-05-earth-vs-mars-comparison.png');

// 6. Screenshot 6: Switch to 5 Physical Experiments
console.log('6. Switching to 5 Physical Experiments tab...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('5 Physical Experiments'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
console.log('Capturing stage06-06-interactive-experiments.png...');
await captureShot('stage06-06-interactive-experiments.png');

// 7. Screenshot 7: Focus on Laura AI Climate Companion with Master Briefings
console.log('7. Switching back to 3D Global Earth and triggering Laura Master Briefing...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const earthBtn = buttons.find(b => b.textContent && b.textContent.includes('3D Global Earth'));
    if (earthBtn) earthBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1500));
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const briefingBtn = buttons.find(b => b.textContent && b.textContent.includes('Measured Data vs. Models'));
    if (briefingBtn) briefingBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1500));
console.log('Capturing stage06-07-laura-climate-guide.png...');
await captureShot('stage06-07-laura-climate-guide.png');

console.log('All 7 verification screenshots captured successfully!');
ws.close();
chromeProc.kill();
process.exit(0);
