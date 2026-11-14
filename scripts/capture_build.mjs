import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const BROWSER_CANDIDATES = [
  'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => existsSync(p));
if (!BROWSER_PATH) {
  throw new Error('No Chromium browser found');
}
console.log('Using browser binary:', BROWSER_PATH);

const PORT = 9227;
const USER_DATA = process.env.TEMP + '\\browser_build_test_' + Date.now();

mkdirSync('screenshots/build', { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const chromeProc = spawn(
  BROWSER_PATH,
  [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

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
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
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
    this.ws.close();
  }
}

async function waitForCondition(client, expr, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const res = await client.send('Runtime.evaluate', {
      expression: `(() => { try { return Boolean(${expr}); } catch (e) { return false; } })()`,
      returnByValue: true,
    });
    if (res.result && res.result.value) return true;
    await sleep(250);
  }
  throw new Error(`Timeout waiting for expression: ${expr}`);
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
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  const capture = async (name, width, height, isMobile = false) => {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile,
    });
    await sleep(1500);
    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const filePath = resolve('screenshots/build', `${name}.png`);
    writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filePath} (${data.length} chars base64)`);
  };

  try {
    // 1. BUILD Desktop Overview
    console.log('Navigating to /build (Desktop Overview)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/build' });
    await waitForCondition(client, `document.body && document.body.innerText.includes('Spacecraft Creation Studio')`, 12000);
    // Allow R3F 3D canvas to render meshes
    await sleep(2000);
    await capture('build-desktop-overview', 1440, 900, false);

    // 2. Trigger Engine Hot-Fire Test
    console.log('Clicking "Engine Hot-Fire Test"...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('[data-testid="toggle-sim-btn"]');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('Abort Test Burn')`, 6000);
    await sleep(1200); // allow hot-fire plume and vibration to animate
    await capture('build-desktop-hotfire', 1440, 900, false);

    // Stop burn
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('[data-testid="toggle-sim-btn"]');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(500);

    // 3. Filter Catalog by Propulsion
    console.log('Filtering Catalog by Propulsion...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const filterBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'propulsion');
          if (filterBtn) { filterBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(600);
    await capture('build-desktop-catalog-filter', 1440, 900, false);

    // 4. Add Solid Rocket Booster Component
    console.log('Adding Solid Rocket Booster to stack...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const addBtn = document.querySelector('[data-testid="add-part-c-engine-booster"]');
          if (addBtn) { addBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(800);
    await capture('build-desktop-add-booster', 1440, 900, false);

    // 5. Mobile Viewport Workshop
    console.log('Testing Mobile viewport workshop...');
    await capture('build-mobile-workshop', 390, 844, true);

    console.log('ALL 5 BUILD SCREENSHOTS SUCCESSFULLY CAPTURED!');
  } finally {
    client.close();
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Fatal error during build capture:', err);
  chromeProc.kill();
  process.exit(1);
});

