import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9800 + Math.floor(Math.random() * 150);
const USER_DATA = process.env.TEMP + '\\chrome_phase8d_' + Date.now();
const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\build';

mkdirSync(ARTIFACT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const chromeProc = spawn(
  CHROME_PATH,
  [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

function killChrome() {
  try {
    if (chromeProc && chromeProc.pid) {
      spawn('taskkill', ['/pid', String(chromeProc.pid), '/f', '/t'], { stdio: 'ignore' });
    }
  } catch {}
}

async function waitForCdp() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(300);
  }
  throw new Error('Chrome CDP did not become ready');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
  }

  async init() {
    return new Promise((res, rej) => {
      this.ws.onopen = () => res();
      this.ws.onerror = (e) => rej(e);
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' '));
          }
          if (msg.method === 'Runtime.exceptionThrown') {
            console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
          }
          if (msg.id && this.pending.has(msg.id)) {
            const { resolve, reject } = this.pending.get(msg.id);
            this.pending.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch (e) {}
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

async function captureScreenshot(client, filename, width = 1440, height = 900) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await sleep(1000);
  const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
  const localPath = resolve(ARTIFACT_DIR, filename);
  writeFileSync(localPath, Buffer.from(data, 'base64'));
  console.log(`Saved screenshot: ${filename} (${width}x${height})`);
}

async function run() {
  console.log('Connecting to Chrome CDP on port', PORT);
  await waitForCdp();

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const tab = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CdpClient(tab.webSocketDebuggerUrl);
  await client.init();

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  try {
    console.log('Navigating to http://localhost:5173/ ...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(4000);

    // Click "Build" in MasterHeader
    console.log('Clicking "Build" in MasterHeader...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const buildBtn = btns.find(b => b.textContent.includes('Build'));
          if (buildBtn) {
            buildBtn.click();
            return 'Clicked Build';
          }
          return 'Build button not found';
        })()
      `,
    });
    await sleep(3500);

    // 1. Capture Desktop Overview
    await captureScreenshot(client, 'build-desktop-overview.png', 1440, 900);

    // 2. Click "Staging" tab
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const stagingBtn = btns.find(b => b.textContent.includes('Staging'));
          if (stagingBtn) stagingBtn.click();
        })()
      `,
    });
    await sleep(1000);
    await captureScreenshot(client, 'build-staging-hierarchy.png', 1440, 900);

    // 3. Click "Livery" tab and set exploded view to 60%
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const liveryBtn = btns.find(b => b.textContent.includes('Livery'));
          if (liveryBtn) liveryBtn.click();

          // Move exploded slider
          const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
          if (sliders.length > 0) {
            sliders[0].value = 65;
            sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
            sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `,
    });
    await sleep(1500);
    await captureScreenshot(client, 'build-exploded-cad-view.png', 1440, 900);

    // 4. Trigger Static Hot-Fire Test
    console.log('Triggering Static Test Fire simulation...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const simBtn = document.querySelector('[data-testid="toggle-sim-btn"]');
          if (simBtn) simBtn.click();
        })()
      `,
    });
    await sleep(2000);
    await captureScreenshot(client, 'build-hotfire-simulation.png', 1440, 900);

    // 5. Open Mission Profiles Assessment Modal
    console.log('Opening Mission Profiles Modal...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const mBtn = document.querySelector('[data-testid="mission-readiness-btn"]');
          if (mBtn) mBtn.click();
        })()
      `,
    });
    await sleep(1500);
    await captureScreenshot(client, 'build-mission-profiles-modal.png', 1440, 900);

    // Close Mission Modal and Open Blueprints Hangar Modal
    console.log('Opening Blueprints Hangar Modal...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          // Close modal
          const closeBtns = Array.from(document.querySelectorAll('button'));
          const closeBtn = closeBtns.find(b => b.textContent.includes('Close Assessment'));
          if (closeBtn) closeBtn.click();

          // Open blueprints
          setTimeout(() => {
            const bpBtn = document.querySelector('[data-testid="blueprint-hangar-btn"]');
            if (bpBtn) bpBtn.click();
          }, 300);
        })()
      `,
    });
    await sleep(2000);
    await captureScreenshot(client, 'build-blueprints-hangar-modal.png', 1440, 900);

    // Close Blueprint Modal
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = document.querySelector('button[title="Close dialog"]') || document.querySelector('button[aria-label="Close dialog"]');
          if (closeBtn) closeBtn.click();
        })()
      `,
    });
    await sleep(1000);

    // 6. Responsive Tablet View (768x1024)
    await captureScreenshot(client, 'build-tablet-responsive.png', 768, 1024);

    // 7. Responsive Mobile View (390x844)
    await captureScreenshot(client, 'build-mobile-responsive.png', 390, 844);

    console.log('All Phase 8D Build verification screenshots captured successfully!');
  } finally {
    client.close();
    killChrome();
  }
}

run().catch((err) => {
  console.error(err);
  killChrome();
  process.exit(1);
});
