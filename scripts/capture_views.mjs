import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const USER_DATA = process.env.TEMP + '\\chrome_cdp_profile_' + Date.now();

mkdirSync('screenshots', { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 1. Launch headless Chrome with remote debugging
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

async function run() {
  console.log('Connecting to Chrome CDP...');
  await waitForCdp();

  // Open a new tab or use existing page target
  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const tab = targets.find((t) => t.type === 'page') || targets[0];
  console.log('Connecting to target:', tab.title, tab.webSocketDebuggerUrl);
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
    await sleep(1500); // Wait for animations & rendering
    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const filePath = resolve('screenshots', `${name}.png`);
    writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filePath} (${data.length} chars base64)`);
  };

  try {
    // 1. LEARN Desktop
    console.log('Navigating to /learn (Desktop)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/learn' });
    await sleep(3500);
    await capture('learn-desktop', 1440, 900, false);

    // 2. LEARN Lesson Detail Reader (click first course card)
    console.log('Clicking first course card on /learn...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('.cursor-pointer');
          for (const card of cards) {
            if (card.innerText.includes('Solar') || card.innerText.includes('Sun') || card.innerText.includes('Earth')) {
              card.click();
              return true;
            }
          }
          if (cards.length > 0) { cards[0].click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2500);
    await capture('learn-lesson', 1440, 900, false);

    // 3. LEARN Mobile
    console.log('Navigating to /learn (Mobile)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/learn' });
    await sleep(3000);
    await capture('learn-mobile', 390, 844, true);

    // 4. DRAW Gallery Desktop
    console.log('Navigating to /draw (Desktop)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/draw' });
    await sleep(3500);
    await capture('draw-gallery', 1440, 900, false);

    // 5. DRAW Studio Canvas Workspace (click first artwork card)
    console.log('Clicking first plate on /draw...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('.cursor-pointer');
          if (cards.length > 0) { cards[0].click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(2500);
    await capture('draw-studio', 1440, 900, false);

    // 6. DRAW Mobile
    console.log('Navigating to /draw (Mobile)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/draw' });
    await sleep(3000);
    await capture('draw-mobile', 390, 844, true);

    console.log('All 6 screenshots captured successfully!');
  } finally {
    client.close();
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Error during capture:', err);
  chromeProc.kill();
  process.exit(1);
});
