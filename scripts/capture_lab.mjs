import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
const USER_DATA = process.env.TEMP + '\\chrome_lab_test_' + Date.now();

mkdirSync('screenshots/lab', { recursive: true });

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
    const filePath = resolve('screenshots/lab', `${name}.png`);
    writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filePath} (${data.length} chars base64)`);
  };

  try {
    // 1. LAB Desktop Landing
    console.log('Navigating to /lab (Desktop Landing)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/lab' });
    await waitForCondition(client, `document.body && document.body.innerText.includes('Aerospace Experimental Chambers')`, 12000);
    await capture('lab-desktop-landing', 1440, 900, false);

    // 2. Click Relativistic Black Hole Chamber (physics)
    console.log('Clicking Relativistic Black Hole chamber...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('.cursor-pointer'));
          const target = cards.find(c => c.innerText.includes('Relativistic') || c.innerText.includes('Black Hole'));
          if (target) { target.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('SPACETIME CURVATURE')`, 8000);
    await capture('lab-desktop-physics', 1440, 900, false);

    // 3. Switch to Planetary Gravity Chamber
    console.log('Switching to Planetary Gravity chamber...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find(b => b.innerText.includes('Planetary'));
          if (target) { target.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('VACUUM DROP SHAFT')`, 8000);
    await capture('lab-desktop-gravity', 1440, 900, false);

    // 4. Switch to Chemistry Chamber
    console.log('Switching to Chemistry chamber...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find(b => b.innerText.includes('Chemistry') || b.innerText.includes('Cosmic'));
          if (target) { target.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('PERIODIC ABUNDANCE MATRIX')`, 8000);
    await capture('lab-desktop-chemistry', 1440, 900, false);

    // 5. Switch to Astronomy Telescope Chamber
    console.log('Switching to Astronomy Telescope chamber...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find(b => b.innerText.includes('Observatory') || b.innerText.includes('Astronomy') || b.innerText.includes('Multi-Wavelength'));
          if (target) { target.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('CRAB NEBULA')`, 8000);
    await capture('lab-desktop-telescope', 1440, 900, false);

    // 6. Return to All Chambers for Mobile Landing
    console.log('Clicking All Chambers...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find(b => b.innerText.includes('All Chambers'));
          if (target) { target.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('Aerospace Experimental Chambers')`, 8000);
    await capture('lab-mobile-landing', 390, 844, true);

    console.log('All Lab screenshots captured successfully!');
  } finally {
    client.close();
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Error during Lab capture:', err);
  chromeProc.kill();
  process.exit(1);
});
