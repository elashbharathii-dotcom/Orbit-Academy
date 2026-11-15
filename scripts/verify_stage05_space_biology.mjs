import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_s05_clean';
const stage05Dir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage05_verification';
const rootArtifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';

if (fs.existsSync(userDataDir)) {
  fs.rmSync(userDataDir, { recursive: true, force: true });
}
if (!fs.existsSync(stage05Dir)) {
  fs.mkdirSync(stage05Dir, { recursive: true });
}

console.log('Launching headless Edge on port 9310 with clean profile for Stage 05 Space Biology Lab...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9310',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,940',
  'http://localhost:5173/research'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9310/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page' && t.url.includes('/research')) ||
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
  const filePath1 = path.join(stage05Dir, filename);
  const filePath2 = path.join(rootArtifactDir, filename);
  fs.writeFileSync(filePath1, buffer);
  fs.writeFileSync(filePath2, buffer);
  console.log(`Captured: ${filename} (${buffer.length} bytes)`);
}

async function evalCode(expression) {
  return send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
}

console.log('Waiting for initial /research page render...');
await new Promise(r => setTimeout(r, 3500));

// 1. Screenshot 1: OSDR Research Dashboard
console.log('1. Capturing stage05-01-osdr-research-dashboard.png...');
await captureShot('stage05-01-osdr-research-dashboard.png');

// 2. Screenshot 2: Open Study Inspector Modal
console.log('2. Clicking first "Inspect Study Details" button...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const inspectBtn = buttons.find(b => b.textContent && b.textContent.includes('Inspect Study Details'));
    if (inspectBtn) inspectBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1500));
console.log('Capturing stage05-02-study-inspector-modal.png...');
await captureShot('stage05-02-study-inspector-modal.png');

// Close modal
console.log('Closing modal and switching to 3D Biology Visualizer...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const doneBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'Done') ||
                    buttons.find(b => b.getAttribute('aria-label') === 'Close study details');
    if (doneBtn) doneBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1000));

// 3. Screenshot 3: Switch to 3D Biology Visualizer (Human Cell)
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('3D Biology Visualizer'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2500));
console.log('3. Capturing stage05-03-3d-human-cell-model.png...');
await captureShot('stage05-03-3d-human-cell-model.png');

// 4. Screenshot 4: Select DNA Double Helix & Explode Factor
console.log('Selecting DNA Double Helix...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dnaBtn = buttons.find(b => b.textContent && b.textContent.includes('DNA Double Helix'));
    if (dnaBtn) dnaBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2500));
console.log('4. Capturing stage05-04-3d-dna-double-helix.png...');
await captureShot('stage05-04-3d-dna-double-helix.png');

// 5. Screenshot 5: Switch to Spaceflight Hallmarks Explorer
console.log('Switching to Spaceflight Hallmarks tab...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('Spaceflight Hallmarks'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
console.log('5. Capturing stage05-05-spaceflight-hallmarks-explorer.png...');
await captureShot('stage05-05-spaceflight-hallmarks-explorer.png');

// 6. Screenshot 6: Switch to Multi-Omics & Biomarkers (Heatmap)
console.log('Switching to Multi-Omics Data tab...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('Multi-Omics & Biomarkers'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
console.log('6. Capturing stage05-06-multiomics-heatmap-charts.png...');
await captureShot('stage05-06-multiomics-heatmap-charts.png');

// 7. Screenshot 7: Switch to Countermeasure Simulation Lab
console.log('Switching to Countermeasure Lab tab...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tabBtn = buttons.find(b => b.textContent && b.textContent.includes('Countermeasure Lab'));
    if (tabBtn) tabBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
console.log('7. Capturing stage05-07-countermeasure-simulation-chambers.png...');
await captureShot('stage05-07-countermeasure-simulation-chambers.png');

console.log('All 7 verification screenshots captured successfully!');
ws.close();
chromeProc.kill();
process.exit(0);
