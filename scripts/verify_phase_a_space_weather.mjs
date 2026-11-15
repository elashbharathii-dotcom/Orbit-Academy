import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_nasa';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\space_weather_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Edge for Phase A Space Weather Command Center Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9260',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/space-weather'
]);

await new Promise(r => setTimeout(r, 4000));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9260/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page' && !t.url.startsWith('chrome://') && !t.url.startsWith('edge://'));
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
    console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
  } else if (msg.method === 'Runtime.exceptionThrown') {
    console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
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
console.log('Connected to CDP websocket on port 9260');

await sendCommand('Runtime.enable');
await sendCommand('Log.enable');

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
  console.log(`Saved screenshot: ${filename} (${fs.statSync(filePath).size} bytes)`);
}

async function navigateTo(url) {
  await sendCommand('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 4000));
}

try {
  // Wait for 3D canvas and initial telemetry load
  console.log('\n--- 1. Capturing 3D Solar Heliosphere View ---');
  await new Promise(r => setTimeout(r, 3500));
  await captureScreenshot('space-weather-01-heliosphere.png');

  // Switch to Earth Magnetosphere & Aurora View
  console.log('\n--- 2. Capturing 3D Earth Magnetosphere & Aurora View ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const magBtn = buttons.find(b => b.textContent && b.textContent.includes('Earth Magnetosphere'));
      if (magBtn) {
        magBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('space-weather-02-magnetosphere.png');

  // Select an event in the timeline
  console.log('\n--- 3. Capturing Event Inspection & Laura AI Dialogue ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const flareFilter = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'flares');
      if (flareFilter) flareFilter.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('space-weather-03-event-selected.png');

  // Navigate to Learn Mode to verify Space Observatory button
  console.log('\n--- 4. Verifying Learn Mode Space Weather Gateway ---');
  await navigateTo('http://localhost:5173/learn');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const obsBtn = buttons.find(b => b.textContent && b.textContent.includes('NASA Space Observatory'));
      if (obsBtn) obsBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const donkiTab = buttons.find(b => b.textContent && b.textContent.includes('Space Weather (DONKI)'));
      if (donkiTab) donkiTab.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('space-weather-04-learn-integration.png');

  console.log('\nAll Phase A Space Weather verification captures completed successfully!');
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
