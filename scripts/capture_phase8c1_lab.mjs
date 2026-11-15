import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9300 + Math.floor(Math.random() * 500);
const USER_DATA = process.env.TEMP + '\\chrome_lab8c1_clean_' + Date.now();
const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\lab';

mkdirSync('screenshots/lab_phase8c1', { recursive: true });
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
          if (msg.id && this.pending.has(msg.id)) {
            const { resolve, reject } = this.pending.get(msg.id);
            this.pending.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
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
    try {
      this.ws.close();
    } catch {}
  }
}

async function dismissModalIfPresent(client) {
  await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue Experimentation'));
        if (modalBtn) { modalBtn.click(); return true; }
        return false;
      })()
    `,
  });
  await sleep(400);
}

async function run() {
  console.log('Connecting to Chrome CDP on dynamic port', PORT);
  await waitForCdp();

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const tab = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CdpClient(tab.webSocketDebuggerUrl);
  await client.init();

  await client.send('Page.enable');

  const capture = async (name, width, height, isMobile = false) => {
    await dismissModalIfPresent(client);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile,
    });
    await sleep(1500);
    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const localPath = resolve('screenshots/lab_phase8c1', `${name}.png`);
    const artifactPath = resolve(ARTIFACT_DIR, `${name}.png`);
    const buffer = Buffer.from(data, 'base64');
    writeFileSync(localPath, buffer);
    writeFileSync(artifactPath, buffer);
    console.log(`Saved screenshot: ${name}.png (${buffer.length} bytes)`);
  };

  try {
    // 1. LAB Desktop Overview
    console.log('1. Navigating to /lab (Desktop Overview)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/lab' });
    await sleep(3500);
    await capture('lab-overview-desktop', 1440, 900, false);

    // 2. Open Chamber 1: Orbital Mechanics Chamber
    console.log('2. Entering Orbital Mechanics Chamber...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-chamber-card="orbital"]');
          if (card) { card.click(); return true; }
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Enter Chamber'));
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2500);
    await capture('lab-orbital-mechanics-chamber', 1440, 900, false);

    // 3. Switch to Chamber 2: Solar Physics Chamber
    console.log('3. Switching to Solar Physics Chamber...');
    await dismissModalIfPresent(client);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const tab = document.querySelector('[data-chamber-tab="solar"]');
          if (tab) { tab.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2000);
    
    // Select Flare class X and Detonate
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const xBtn = buttons.find(b => b.innerText && b.innerText.includes('Class X'));
          if (xBtn) xBtn.click();
          const detonateBtn = buttons.find(b => b.innerText && (b.innerText.includes('DETONATE') || b.innerText.includes('TRIGGER')));
          if (detonateBtn) detonateBtn.click();
          return true;
        })()
      `,
    });
    await sleep(900); // Capture active CME blast wave
    await capture('lab-solar-physics-flare', 1440, 900, false);

    // 4. Switch to Chamber 3: Planetary Geology Chamber
    console.log('4. Switching to Planetary Geology Chamber...');
    await dismissModalIfPresent(client);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const tab = document.querySelector('[data-chamber-tab="geology"]');
          if (tab) { tab.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2000);
    
    // Switch to Mars using data-geology-planet attribute
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const marsBtn = document.querySelector('[data-geology-planet="mars"]');
          if (marsBtn) { marsBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(1000);
    await dismissModalIfPresent(client); // Dismiss the milestone popup so geology screen is visible!
    await capture('lab-planetary-geology-layers', 1440, 900, false);

    // 5. Switch to Chamber 4: Space Environment Chamber
    console.log('5. Switching to Space Environment Chamber...');
    await dismissModalIfPresent(client);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const tab = document.querySelector('[data-chamber-tab="environment"]');
          if (tab) { tab.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2000);

    // Launch asteroid impact test
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const impactBench = document.querySelector('[data-env-bench="impact"]');
          if (impactBench) impactBench.click();
          const buttons = Array.from(document.querySelectorAll('button'));
          const launchBtn = buttons.find(b => b.innerText && (b.innerText.includes('LAUNCH') || b.innerText.includes('Launch Asteroid')));
          if (launchBtn) launchBtn.click();
          return true;
        })()
      `,
    });
    await sleep(900);
    await capture('lab-space-environment-impact', 1440, 900, false);
    await dismissModalIfPresent(client);

    // Switch to Cosmic Radiation sub-experiment
    console.log('6. Testing Radiation Shielding sub-experiment...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const radBtn = document.querySelector('[data-env-bench="radiation"]');
          if (radBtn) { radBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(1500);
    await dismissModalIfPresent(client);
    await capture('lab-space-environment-radiation', 1440, 900, false);

    // 7. Test LabPad field terminal interaction (Theory Tab)
    console.log('7. Capturing LabPad Field Terminal...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const theoryTab = buttons.find(b => b.innerText && (b.innerText.includes('Theory') || b.innerText.includes('Formulas')));
          if (theoryTab) theoryTab.click();
          return true;
        })()
      `,
    });
    await sleep(1500);
    await capture('lab-labpad-terminal', 1440, 900, false);

    // 8. Responsive: Tablet View (768 x 1024)
    console.log('8. Capturing Tablet Responsive View...');
    await capture('lab-tablet-responsive', 768, 1024, false);

    // 9. Responsive: Mobile View (390 x 844)
    console.log('9. Capturing Mobile Responsive View...');
    // Return to overview for mobile
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const allBtn = buttons.find(b => b.innerText.includes('All Chambers'));
          if (allBtn) allBtn.click();
          return true;
        })()
      `,
    });
    await sleep(1500);
    await capture('lab-mobile-responsive', 390, 844, true);

    console.log('ALL PHASE 8C.1 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    client.close();
    killChrome();
  }
}

run().catch((err) => {
  console.error('Error during Lab Phase 8C.1 capture:', err);
  killChrome();
  process.exit(1);
});
