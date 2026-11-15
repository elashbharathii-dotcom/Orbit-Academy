import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9400 + Math.floor(Math.random() * 500);
const USER_DATA = process.env.TEMP + '\\chrome_labpad_test_' + Date.now();
const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\lab';

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
  console.log('Capturing LabPad expanded whiteboard on port', PORT);
  await waitForCdp();

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const tab = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CdpClient(tab.webSocketDebuggerUrl);
  await client.init();

  await client.send('Page.enable');

  try {
    await client.send('Page.navigate', { url: 'http://localhost:5173/lab' });
    await sleep(3000);

    // Enter Orbital chamber
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-chamber-card="orbital"]');
          if (card) card.click();
        })()
      `,
    });
    await sleep(2000);

    // Scroll directly to LabPad
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const labpad = document.querySelector('.terminal-labpad, [title="Minimize LabPad"], [title="Expand LabPad"]')?.closest('div.glass-panel-elevated');
          if (labpad) {
            labpad.scrollIntoView({ behavior: 'instant', block: 'center' });
          } else {
            window.scrollTo(0, document.body.scrollHeight);
          }
        })()
      `,
    });
    await sleep(1000);

    // Click Theory & Formulas tab
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const theoryBtn = btns.find(b => b.innerText && b.innerText.includes('Whiteboard'));
          if (theoryBtn) theoryBtn.click();
        })()
      `,
    });
    await sleep(1000);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(1000);

    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const localPath = resolve('screenshots/lab_phase8c1', 'lab-labpad-expanded.png');
    const artifactPath = resolve(ARTIFACT_DIR, 'lab-labpad-expanded.png');
    const buffer = Buffer.from(data, 'base64');
    writeFileSync(localPath, buffer);
    writeFileSync(artifactPath, buffer);
    console.log(`Saved screenshot: lab-labpad-expanded.png (${buffer.length} bytes)`);
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

