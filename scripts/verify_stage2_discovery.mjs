import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_nasa';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\discovery_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Edge for Stage 2 Discovery Mode Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9280',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/discovery'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9280/json', (res) => {
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
console.log('Connected to CDP websocket on port 9280');

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
  // 1. Enter Solar System / Planetary Overview
  console.log('\n--- 1. Navigating into Solar System and opening Destination Deck ---');
  await evalCode(`
    (() => {
      const enterBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Enter Solar System'));
      if (enterBtn) enterBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));

  // If in planet-explorer or solar system, click Switch Destination (11)
  await evalCode(`
    (() => {
      const deckBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Switch Destination'));
      if (deckBtn) deckBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('discovery-01-destination-deck.png');

  // 2. Select Mars to initiate Cinematic Spacecraft Journey
  console.log('\n--- 2. Selecting Mars to Launch 3D Spacecraft Journey ---');
  await evalCode(`
    (() => {
      // Find Mars launch button in the modal or solar system
      const buttons = Array.from(document.querySelectorAll('button'));
      const marsLaunch = buttons.find(b => {
        const parentText = b.closest('div')?.textContent || '';
        return parentText.includes('Mars') && (b.textContent.includes('LAUNCH') || b.textContent.includes('ACTIVE'));
      });
      if (marsLaunch) {
        marsLaunch.click();
        return 'mars-clicked';
      }
      return 'not-found';
    })()
  `);
  // Capture mid-flight spacecraft journey
  await new Promise(r => setTimeout(r, 3500));
  await captureScreenshot('discovery-02-spacecraft-launch.png');

  // 3. Wait for journey completion or skip to enter Mars Surface Explorer
  console.log('\n--- 3. Entering Mars Surface Exploration with NASA MOLA Topography ---');
  await evalCode(`
    (() => {
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Skip'));
      if (skipBtn) skipBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('discovery-03-mars-surface-mola.png');

  // 4. Inspect Olympus Mons Surface Landmark and trigger low-altitude flyover
  console.log('\n--- 4. Triggering Cinematic Flyover to Olympus Mons ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const olympusBtn = buttons.find(b => b.textContent && b.textContent.includes('Olympus Mons'));
      if (olympusBtn) {
        olympusBtn.click();
        return 'olympus-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 3500));
  await captureScreenshot('discovery-04-olympus-mons-flyover.png');

  // 5. Open Destination Deck again and switch to The Moon
  console.log('\n--- 5. Switching Destination to The Moon ---');
  await evalCode(`
    (() => {
      const deckBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Switch Destination'));
      if (deckBtn) deckBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const moonLaunch = buttons.find(b => {
        const parentText = b.closest('div')?.textContent || '';
        return parentText.includes('The Moon') && (b.textContent.includes('LAUNCH') || b.textContent.includes('ACTIVE'));
      });
      if (moonLaunch) {
        moonLaunch.click();
        return 'moon-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));
  // Skip journey to see Moon surface directly
  await evalCode(`
    (() => {
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Skip'));
      if (skipBtn) skipBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('discovery-05-moon-lro-mosaic.png');

  console.log('\nAll Stage 2 Discovery Mode verification captures completed successfully!');
} catch (err) {
  console.error('Error during Stage 2 verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
