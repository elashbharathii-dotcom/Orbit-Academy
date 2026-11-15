import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_climate_lab';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\climate_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Chromium for Climate Lab AAA Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9240',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,920',
  'http://localhost:5173/climate'
]);

await new Promise(r => setTimeout(r, 3000));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9240/json', (res) => {
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
console.log('Connected to CDP websocket');

async function evalCode(expression) {
  const res = await sendCommand('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.result?.value;
}

async function captureScreenshot(name) {
  const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(res.result.data, 'base64');
  const filepath = path.join(artifactDir, name);
  fs.writeFileSync(filepath, buf);
  console.log(`Saved screenshot: ${filepath}`);
}

// 1. Wait for page load and WebGL initialization
console.log('Waiting for Earth canvas initialization...');
await new Promise(r => setTimeout(r, 4000));

// Screenshot 1: Phase 1 3D Earth Hero View
await captureScreenshot('climate-01-3d-earth-hero.png');

// Screenshot 2: Continent Focus (Focus on Amazon Basin)
console.log('Selecting Amazon Basin continent target...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const amazonBtn = buttons.find(b => b.textContent && b.textContent.includes('Amazon'));
    if (amazonBtn) amazonBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2500));
await captureScreenshot('climate-02-continent-focus-amazon.png');

// Screenshot 3: Phase 2 Dynamic Weather Simulation (Category 5 Hurricane Vortex)
console.log('Switching to Dynamic Weather Mode...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const weatherBtn = buttons.find(b => b.textContent && b.textContent.includes('Dynamic Weather'));
    if (weatherBtn) weatherBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
await captureScreenshot('climate-03-weather-hurricane-vortex.png');

// Screenshot 4: Phase 3 Climate Change Simulator (Keeling Curve & IPCC Scenarios)
console.log('Switching to Climate Change Simulator...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const simBtn = buttons.find(b => b.textContent && b.textContent.includes('Climate Simulator'));
    if (simBtn) simBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
await captureScreenshot('climate-04-climate-change-simulator.png');

// Screenshot 5: Phase 4 Dedicated Ecosystem Labs (Glacier Lab)
console.log('Switching to Dedicated Ecosystem Labs...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const ecoBtn = buttons.find(b => b.textContent && b.textContent.includes('Ecosystem Labs'));
    if (ecoBtn) ecoBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
await captureScreenshot('climate-05-ecosystem-glacier-lab.png');

// Screenshot 6: Phase 5 Six Scientific Experiments
console.log('Switching to Science Experiments...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const expBtn = buttons.find(b => b.textContent && b.textContent.includes('Science Experiments'));
    if (expBtn) expBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 2000));
await captureScreenshot('climate-06-climate-experiments.png');

// Screenshot 7: Laura AI Climate Guide Glossary & Q&A
console.log('Opening Laura AI Glossary...');
await evalCode(`
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bookBtn = buttons.find(b => b.title && b.title.includes('Glossary'));
    if (bookBtn) bookBtn.click();
  })()
`);
await new Promise(r => setTimeout(r, 1500));
await captureScreenshot('climate-07-laura-ai-instructor.png');

console.log('All Climate Lab verification screenshots successfully captured!');
ws.close();
chromeProc.kill();
process.exit(0);
