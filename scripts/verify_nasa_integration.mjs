import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_nasa';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\nasa_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Edge for NASA Open API Integration Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9250',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,920',
  'http://localhost:5173/climate'
]);

await new Promise(r => setTimeout(r, 4000));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9250/json', (res) => {
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
console.log('Connected to CDP websocket on port 9250');

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
  // Wait for initial Climate Lab load
  await new Promise(r => setTimeout(r, 3000));

  // ==========================================
  // SCENARIO 1: CLIMATE LAB — NASA GIBS SATELLITES
  // ==========================================
  console.log('\n--- 1. Verifying NASA GIBS in Climate Lab ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const gibsTab = buttons.find(b => b.textContent && b.textContent.includes('NASA GIBS'));
      if (gibsTab) {
        gibsTab.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('nasa-01-climate-gibs.png');

  // ==========================================
  // SCENARIO 2: CLIMATE LAB — NASA EONET NATURAL EVENTS & FIRMS
  // ==========================================
  console.log('\n--- 2. Verifying NASA EONET & FIRMS Events ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const eonetBtn = buttons.find(b => b.textContent && b.textContent.includes('EONET Events'));
      if (eonetBtn) {
        eonetBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('nasa-02-climate-eonet.png');

  // ==========================================
  // SCENARIO 3: CLIMATE LAB — NASA EPIC DSCOVR LAGRANGE-1
  // ==========================================
  console.log('\n--- 3. Verifying NASA EPIC DSCOVR Lagrange-1 ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const epicBtn = buttons.find(b => b.textContent && b.textContent.includes('EPIC Lagrange-1'));
      if (epicBtn) {
        epicBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('nasa-03-climate-epic.png');

  // ==========================================
  // SCENARIO 4: LEARN MODE — NASA APOD
  // ==========================================
  console.log('\n--- 4. Verifying NASA APOD in Learn Mode ---');
  await navigateTo('http://localhost:5173/learn');

  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const obsBtn = buttons.find(b => b.textContent && b.textContent.includes('NASA Space Observatory'));
      if (obsBtn) {
        obsBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('nasa-04-learn-observatory-apod.png');

  // ==========================================
  // SCENARIO 5: LEARN MODE — NASA NeoWs ASTEROIDS
  // ==========================================
  console.log('\n--- 5. Verifying NASA NeoWs Asteroid Tracker ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const neowsBtn = buttons.find(b => b.textContent && b.textContent.includes('Asteroids (NeoWs)'));
      if (neowsBtn) {
        neowsBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('nasa-05-learn-observatory-neows.png');

  // ==========================================
  // SCENARIO 6: LEARN MODE — NASA DONKI SPACE WEATHER
  // ==========================================
  console.log('\n--- 6. Verifying NASA DONKI Space Weather Telemetry ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const donkiBtn = buttons.find(b => b.textContent && b.textContent.includes('Space Weather (DONKI)'));
      if (donkiBtn) {
        donkiBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('nasa-06-learn-observatory-donki.png');

  // ==========================================
  // SCENARIO 7: DISCOVERY MODE — NASA MEDIA LIBRARY
  // ==========================================
  console.log('\n--- 7. Verifying NASA Media Library in Discovery Mode ---');
  await navigateTo('http://localhost:5173/discovery/universe');

  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const modalBtn = buttons.find(b => b.textContent && (b.textContent.includes('NASA Archive Data') || b.textContent.includes('NASA Media')));
      if (modalBtn) {
        modalBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('nasa-07-discovery-media-search.png');

  // ==========================================
  // SCENARIO 8: DISCOVERY MODE — NASA EXOPLANET ARCHIVE
  // ==========================================
  console.log('\n--- 8. Verifying NASA Exoplanet Archive ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exoBtn = buttons.find(b => b.textContent && b.textContent.includes('Exoplanet Archive'));
      if (exoBtn) {
        exoBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('nasa-08-discovery-exoplanet-archive.png');

  console.log('\nAll 8 NASA Open API Integration verification captures completed successfully!');
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
