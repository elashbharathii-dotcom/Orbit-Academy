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
  throw new Error('No Chromium-based browser found on system');
}
console.log('Using browser binary:', BROWSER_PATH);

const PORT = 9226;
const USER_DATA = process.env.TEMP + '\\browser_quiz_test_' + Date.now();

mkdirSync('screenshots/quiz', { recursive: true });

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
    const filePath = resolve('screenshots/quiz', `${name}.png`);
    writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filePath} (${data.length} chars base64)`);
  };

  try {
    // 1. QUIZ Desktop Lobby
    console.log('Navigating to /quiz (Desktop Lobby)...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/quiz' });
    await waitForCondition(client, `document.body && document.body.innerText.includes('Space Science Quiz Arena')`, 12000);
    await capture('quiz-desktop-lobby', 1440, 900, false);

    // 2. Click "ENGAGE TOURNAMENT ARENA" to start gameplay
    console.log('Clicking "ENGAGE TOURNAMENT ARENA"...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('[data-testid="start-arena-btn"]');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('LIVE TOURNAMENT TELEMETRY')`, 8000);
    await capture('quiz-desktop-gameplay', 1440, 900, false);

    // 3. Select an option (e.g. option 1) and click "Confirm Solution"
    console.log('Selecting option and confirming solution...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const opt = document.querySelector('[data-testid="quiz-option-1"]') || document.querySelector('[data-testid="quiz-option-0"]');
          if (opt) {
            opt.click();
            return true;
          }
          return false;
        })()
      `,
    });
    await sleep(600);
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const submitBtn = document.querySelector('[data-testid="submit-solution-btn"]');
          if (submitBtn) { submitBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('NASA ASTROPHYSICS DEBRIEF')`, 8000);
    await capture('quiz-desktop-answered', 1440, 900, false);

    // 4. Test Blitz Mode from Lobby
    console.log('Returning to lobby to test 60s Blitz Mode...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const exitBtn = document.querySelector('[data-testid="exit-arena-btn"]');
          if (exitBtn) { exitBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('1. SELECT ASTROPHYSICS ARENA')`, 8000);
    
    // Toggle 60s Timed Blitz
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const blitzBtn = document.querySelector('[data-testid="blitz-mode-btn"]');
          if (blitzBtn) { blitzBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(500);
    // Engage tournament with blitz
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('[data-testid="start-arena-btn"]');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('REMAINING')`, 8000);
    await capture('quiz-desktop-blitz', 1440, 900, false);

    // 5. Simulate answering remaining questions or reaching results screen
    console.log('Progressing to results debrief screen...');
    await client.send('Runtime.evaluate', {
      expression: `
        (async () => {
          for (let i = 0; i < 25; i++) {
            if (document.body.innerText.includes('Astrophysics Arena Debrief') || document.body.innerText.includes('MISSION COMPLETE')) {
              break;
            }
            const opt = document.querySelector('[data-testid="quiz-option-1"]') || document.querySelector('[data-testid="quiz-option-0"]');
            if (opt) opt.click();
            await new Promise(r => setTimeout(r, 100));

            const submitBtn = document.querySelector('[data-testid="submit-solution-btn"]');
            if (submitBtn) submitBtn.click();
            await new Promise(r => setTimeout(r, 100));

            const nextBtn = document.querySelector('[data-testid="next-challenge-btn"]');
            if (nextBtn) nextBtn.click();
            await new Promise(r => setTimeout(r, 150));
          }
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('MISSION COMPLETE') || document.body.innerText.includes('Astrophysics Arena Debrief')`, 12000);
    
    // Expand question review explanations
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const reviewBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Review Question Explanations'));
          if (reviewBtn) { reviewBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await sleep(800);
    await capture('quiz-desktop-results', 1440, 900, false);

    // 6. Mobile Viewport Lobby
    console.log('Testing Mobile viewport lobby...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const lobbyBtn = document.querySelector('[data-testid="return-to-lobby-btn"]');
          if (lobbyBtn) { lobbyBtn.click(); return true; }
          return false;
        })()
      `,
    });
    await waitForCondition(client, `document.body.innerText.includes('Space Science Quiz Arena')`, 8000);
    await capture('quiz-mobile-lobby', 390, 844, true);

    console.log('ALL 6 QUIZ SCREENSHOTS SUCCESSFULLY CAPTURED!');
  } finally {
    client.close();
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Fatal error during quiz capture:', err);
  chromeProc.kill();
  process.exit(1);
});
