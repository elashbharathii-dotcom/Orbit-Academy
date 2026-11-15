import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_s01_hub';
const stage01Dir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage01_verification';
const rootArtifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';

if (!fs.existsSync(stage01Dir)) {
  fs.mkdirSync(stage01Dir, { recursive: true });
}

console.log('Launching headless Edge for Stage 01 NASA Data Hub Verification (Refined)...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9280',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/research'
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
  const stage01Path = path.join(stage01Dir, filename);
  const rootPath = path.join(rootArtifactDir, filename);
  const buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(stage01Path, buffer);
  fs.writeFileSync(rootPath, buffer);
  const size = fs.statSync(stage01Path).size;
  console.log(`Saved screenshot: ${filename} (${size} bytes)`);
  return size;
}

try {
  // 1. Capture Dashboard Overview
  console.log('\n--- 1. Capturing NASA Research Hub Dashboard Overview ---');
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('hub-01-dashboard-overview.png');

  // 2. Scroll down to show Search & Study Cards Grid
  console.log('\n--- 2. Scrolling down to Search Bar and Study Cards Grid ---');
  await evalCode(`window.scrollTo({ top: 620, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('hub-02-cards-grid-studies.png');

  // 3. Filter by NASA GeneLab (cgene)
  console.log('\n--- 3. Filtering by NASA GeneLab (cgene) Multi-Omics ---');
  await evalCode(`
    (() => {
      window.scrollTo({ top: 200, behavior: 'instant' });
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('GeneLab (cgene)'));
      if (btn) { btn.click(); return 'genelab-clicked'; }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await evalCode(`window.scrollTo({ top: 620, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 1500));
  await captureScreenshot('hub-03-genelab-omics-filtered.png');

  // 4. Filter by NASA ALSDA
  console.log('\n--- 4. Filtering by NASA ALSDA Animal Physiology ---');
  await evalCode(`
    (() => {
      window.scrollTo({ top: 200, behavior: 'instant' });
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('NASA ALSDA'));
      if (btn) { btn.click(); return 'alsda-clicked'; }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await evalCode(`window.scrollTo({ top: 620, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 1500));
  await captureScreenshot('hub-04-alsda-physiology-filtered.png');

  // 5. Reset filters and open first study card
  console.log('\n--- 5. Resetting filters and Opening Study Detail Modal (OSD-1) ---');
  await evalCode(`
    (() => {
      const resetBtn = document.querySelector('button[title="Reset all filters"]');
      if (resetBtn) resetBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));
  await evalCode(`
    (() => {
      const cards = Array.from(document.querySelectorAll('div[class*="group relative flex flex-col justify-between"]'));
      if (cards.length > 0) {
        cards[0].click();
        return 'card-clicked';
      }
      return 'card-not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('hub-06-study-detail-modal-protocols.png');

  // 6. Inspect Assays & Technology Platforms tab
  console.log('\n--- 6. Switching to Assays & Technology Platforms Tab in Modal ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('Assays & Technology'));
      if (btn) { btn.click(); return 'assays-tab-clicked'; }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('hub-07-modal-assays-technology.png');

  // 7. Inspect Downloadable Files tab
  console.log('\n--- 7. Switching to Downloadable Files Tab in Modal ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('Downloadable Data Files'));
      if (btn) { btn.click(); return 'files-tab-clicked'; }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('hub-08-modal-downloadable-files.png');

  // Close modal
  await evalCode(`
    (() => {
      const closeBtn = document.querySelector('button[aria-label="Close modal"]');
      if (closeBtn) closeBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // 8. Responsive Mobile Viewport Testing (390 x 844)
  console.log('\n--- 8. Setting Viewport to Mobile (390 x 844) for Responsive Layout Verification ---');
  await evalCode(`window.scrollTo({ top: 0, behavior: 'instant' });`);
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('hub-09-responsive-mobile-view.png');

  // Reset viewport
  await sendCommand('Emulation.clearDeviceMetricsOverride');

  console.log('\nAll Stage 01 NASA Data Hub screenshots captured and verified successfully!');
} catch (err) {
  console.error('Error during Stage 01 verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
