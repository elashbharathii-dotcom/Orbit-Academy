import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9700 + Math.floor(Math.random() * 200);
const USER_DATA = process.env.TEMP + '\\chrome_gpu_test_' + Date.now();
const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\gpu_test';

mkdirSync(ARTIFACT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// NOTE: Running WITH GPU ENABLED (no --disable-gpu) to mimic real user browser exactly!
const chromeProc = spawn(
  CHROME_PATH,
  [
    '--headless=new',
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

async function run() {
  console.log('Connecting to Chrome CDP with GPU ENABLED on port', PORT);
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

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(1500);

    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const localPath = resolve(ARTIFACT_DIR, 'gpu-enabled-explore.png');
    writeFileSync(localPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot to: ${localPath}`);
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
