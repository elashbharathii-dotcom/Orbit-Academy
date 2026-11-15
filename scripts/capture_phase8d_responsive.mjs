import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9890;
const USER_DATA = process.env.TEMP + '\\chrome_resp_' + Date.now();
const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\build';

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

async function capture(client, filename, width, height) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await sleep(1500);
  const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
  const localPath = resolve(ARTIFACT_DIR, filename);
  writeFileSync(localPath, Buffer.from(data, 'base64'));
  console.log(`Saved screenshot: ${filename} (${width}x${height})`);
}

async function run() {
  await waitForCdp();
  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const tab = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CdpClient(tab.webSocketDebuggerUrl);
  await client.init();

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  try {
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(3500);

    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const buildBtn = btns.find(b => b.textContent.includes('Build'));
          if (buildBtn) buildBtn.click();
        })()
      `,
    });
    await sleep(2500);

    // Tablet
    await capture(client, 'build-tablet-responsive.png', 768, 1024);

    // Mobile
    await capture(client, 'build-mobile-responsive.png', 390, 844);
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
