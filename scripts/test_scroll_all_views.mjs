import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const CHROME_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223;
const USER_DATA = process.env.TEMP + '\\chrome_scroll_test_' + Date.now();

mkdirSync('screenshots/scrolled', { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Launch Chrome
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

  const results = [];

  async function testView({ name, url, width, height, isMobile, prepareAction }) {
    console.log(`\n========================================`);
    console.log(`Testing View: ${name} (${width}x${height}${isMobile ? ' Mobile' : ''})`);
    console.log(`URL: ${url}`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile,
    });

    await client.send('Page.navigate', { url });
    await sleep(2500);

    if (prepareAction) {
      console.log('Executing prepareAction...');
      await client.send('Runtime.evaluate', { expression: prepareAction });
      await sleep(2000);
    }

    // 1. Measure initial dimensions
    const initialDims = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const doc = document.documentElement;
          const body = document.body;
          return {
            scrollHeight: Math.max(doc.scrollHeight, body.scrollHeight),
            clientHeight: doc.clientHeight,
            scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
            clientWidth: doc.clientWidth,
            initialScrollY: window.scrollY
          };
        })()
      `,
      returnByValue: true,
    });

    const dims = initialDims.result.value;
    console.log(`Dimensions:`, dims);

    const canScroll = dims.scrollHeight > dims.clientHeight;
    const hasHorizontalOverflow = dims.scrollWidth > dims.clientWidth;

    // 2. Perform actual vertical scroll to bottom
    const scrollResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
          return {
            scrolledY: window.scrollY,
            maxScrollY: document.documentElement.scrollHeight - window.innerHeight
          };
        })()
      `,
      returnByValue: true,
    });

    await sleep(800);

    // 3. Check scroll position after scroll
    const finalScrollCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            finalY: window.scrollY,
            atBottom: (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50)
          };
        })()
      `,
      returnByValue: true,
    });

    const scrollCheck = finalScrollCheck.result.value;
    console.log(`Scroll Check:`, scrollCheck);

    // 4. Capture screenshot at bottom
    const { data: bottomScreenshot } = await client.send('Page.captureScreenshot', { format: 'png' });
    const bottomPath = resolve('screenshots/scrolled', `${name}-bottom.png`);
    writeFileSync(bottomPath, Buffer.from(bottomScreenshot, 'base64'));

    // 5. Scroll back to top
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await sleep(500);
    const { data: topScreenshot } = await client.send('Page.captureScreenshot', { format: 'png' });
    const topPath = resolve('screenshots/scrolled', `${name}-top.png`);
    writeFileSync(topPath, Buffer.from(topScreenshot, 'base64'));

    const testPassed = canScroll ? scrollCheck.finalY > 0 : dims.scrollHeight <= dims.clientHeight;

    const res = {
      name,
      viewport: `${width}x${height}`,
      isMobile,
      scrollHeight: dims.scrollHeight,
      clientHeight: dims.clientHeight,
      canScroll,
      scrollWidth: dims.scrollWidth,
      clientWidth: dims.clientWidth,
      noHorizontalOverflow: !hasHorizontalOverflow,
      scrolledAmount: scrollCheck.finalY,
      reachedBottom: scrollCheck.atBottom,
      testPassed,
    };

    results.push(res);
    console.log(`Result for ${name}: PASSED = ${testPassed && !hasHorizontalOverflow}`);
    return res;
  }

  try {
    // 1. Learn Desktop Portal
    await testView({
      name: '1-learn-desktop-portal',
      url: 'http://localhost:5173/learn',
      width: 1440,
      height: 900,
      isMobile: false,
    });

    // 2. Learn Lesson Reader
    await testView({
      name: '2-learn-lesson-reader',
      url: 'http://localhost:5173/learn',
      width: 1440,
      height: 900,
      isMobile: false,
      prepareAction: `
        (() => {
          const cards = document.querySelectorAll('.cursor-pointer');
          for (const card of cards) {
            if (card.innerText.includes('Solar') || card.innerText.includes('Sun')) {
              card.click();
              return true;
            }
          }
          if (cards.length > 0) { cards[0].click(); return true; }
          return false;
        })()
      `,
    });

    // 3. Learn Mobile Portal
    await testView({
      name: '3-learn-mobile-portal',
      url: 'http://localhost:5173/learn',
      width: 390,
      height: 844,
      isMobile: true,
    });

    // 4. Draw Artwork Gallery
    await testView({
      name: '4-draw-artwork-gallery',
      url: 'http://localhost:5173/draw',
      width: 1440,
      height: 900,
      isMobile: false,
    });

    // 5. Draw Studio Workspace
    await testView({
      name: '5-draw-studio-workspace',
      url: 'http://localhost:5173/draw',
      width: 1440,
      height: 900,
      isMobile: false,
      prepareAction: `
        (() => {
          const cards = document.querySelectorAll('.cursor-pointer');
          if (cards.length > 0) { cards[0].click(); return true; }
          return false;
        })()
      `,
    });

    // 6. Draw Mobile Workspace
    await testView({
      name: '6-draw-mobile-workspace',
      url: 'http://localhost:5173/draw',
      width: 390,
      height: 844,
      isMobile: true,
      prepareAction: `
        (() => {
          const cards = document.querySelectorAll('.cursor-pointer');
          if (cards.length > 0) { cards[0].click(); return true; }
          return false;
        })()
      `,
    });

    // Bonus: Tablet 768x1024 Learn & Draw verification
    await testView({
      name: 'bonus-learn-tablet',
      url: 'http://localhost:5173/learn',
      width: 768,
      height: 1024,
      isMobile: false,
    });

    await testView({
      name: 'bonus-draw-tablet',
      url: 'http://localhost:5173/draw',
      width: 768,
      height: 1024,
      isMobile: false,
    });

    console.log('\n========================================');
    console.log('SUMMARY OF ALL VIEWS:');
    console.table(results);

    writeFileSync('screenshots/scroll_results.json', JSON.stringify(results, null, 2));
  } finally {
    client.close();
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Error during test:', err);
  chromeProc.kill();
  process.exit(1);
});

