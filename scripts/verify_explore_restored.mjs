import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9600 + Math.floor(Math.random() * 300);
const USER_DATA = process.env.TEMP + '\\chrome_explore_verify_' + Date.now();
const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\explore_restored';

mkdirSync('screenshots/explore_restored', { recursive: true });
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

  const capture = async (name, width, height, isMobile = false) => {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile,
    });
    await sleep(1500);
    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const localPath = resolve('screenshots/explore_restored', `${name}.png`);
    const artifactPath = resolve(ARTIFACT_DIR, `${name}.png`);
    const buffer = Buffer.from(data, 'base64');
    writeFileSync(localPath, buffer);
    writeFileSync(artifactPath, buffer);
    console.log(`Saved screenshot: ${name}.png (${buffer.length} bytes)`);
  };

  try {
    // 1. Desktop Macro Overview (1440 x 900)
    console.log('1. Navigating to / (Explore Overview)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(3500);
    await capture('explore-desktop-overview', 1440, 900, false);

    // 2. Select Earth in PlanetDock to test focus, camera zoom & PlanetDossier
    console.log('2. Selecting Earth in PlanetDock...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const dockBtns = Array.from(document.querySelectorAll('button'));
          const earthBtn = dockBtns.find(b => b.innerText && b.innerText.includes('Earth'));
          if (earthBtn) { earthBtn.click(); return true; }
          return false;
        })()
      `,
    });
    // Wait for camera flight interpolation and dossier slide-in
    await sleep(2500);
    await capture('explore-desktop-earth-focused', 1440, 900, false);

    // 3. Select Saturn to test rings, Cassini division & dossier
    console.log('3. Selecting Saturn in PlanetDock...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const dockBtns = Array.from(document.querySelectorAll('button'));
          const saturnBtn = dockBtns.find(b => b.innerText && b.innerText.includes('Saturn'));
          if (saturnBtn) { saturnBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2500);
    await capture('explore-desktop-saturn-focused', 1440, 900, false);

    // Return to Macro Overview
    console.log('Returning to Macro Overview...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const dockBtns = Array.from(document.querySelectorAll('button'));
          const solBtn = dockBtns.find(b => b.innerText && b.innerText.includes('Sun'));
          if (solBtn) { solBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2000);

    // 4. Tablet Responsive View (768 x 1024)
    console.log('4. Capturing Tablet View (768 x 1024)...');
    await capture('explore-tablet-view', 768, 1024, false);

    // 5. Mobile Responsive View (390 x 844)
    console.log('5. Capturing Mobile View (390 x 844)...');
    await capture('explore-mobile-view', 390, 844, true);

    console.log('ALL EXPLORE VERIFICATION SCREENSHOTS CAPTURED SUCCESSFULLY!');
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

