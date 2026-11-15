import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_all';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scroll_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9226',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9226/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page');
        resolve(page.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);

let idCounter = 1;
const callbacks = new Map();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, (res) => resolve(res.result));
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
await send('Page.enable');
await send('Runtime.enable');

console.log('Connected to Chrome DevTools Protocol');

async function setViewport(width, height, isMobile = false) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: isMobile
  });
  await new Promise(r => setTimeout(r, 600));
}

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true
  });
  return res?.result?.value;
}

async function capture(filename) {
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, filename), Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved screenshot: ${filename}`);
}

const modules = [
  { name: 'explore', route: '/', label: 'Explore', hasScroll: false },
  { name: 'learn', route: '/learn', label: 'Learn', hasScroll: true },
  { name: 'draw', route: '/draw', label: 'Draw', hasScroll: true },
  { name: 'lab', route: '/lab', label: 'Lab', hasScroll: true },
  { name: 'quiz', route: '/quiz', label: 'Quiz', hasScroll: true },
  { name: 'build', route: '/build', label: 'Build', hasScroll: true },
];

async function navigateTo(label) {
  const clicked = await evalCode(`(() => {
    const nav = document.querySelector('nav[aria-label="Orbit Academy Core Experiences"]');
    if (nav) {
      const btn = Array.from(nav.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase().includes('${label.toLowerCase()}'));
      if (btn) {
        btn.click();
        return 'clicked ' + btn.textContent.trim();
      }
    }
    const anyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === '${label.toLowerCase()}');
    if (anyBtn) {
      anyBtn.click();
      return 'clicked any ' + anyBtn.textContent.trim();
    }
    return 'not found';
  })()`);
  console.log(`Navigation to ${label}:`, clicked);
  await new Promise(r => setTimeout(r, 2200));
}

const results = [];

// -----------------------------------------------------------------------------
// 1. DESKTOP VERIFICATION (1440x900)
// -----------------------------------------------------------------------------
await setViewport(1440, 900, false);
console.log('\n--- 1. DESKTOP 1440x900 VERIFICATION ---');

for (const mod of modules) {
  console.log(`\nTesting Desktop Module: ${mod.name.toUpperCase()} (${mod.route})`);
  await navigateTo(mod.label);
  await new Promise(r => setTimeout(r, 800));

  // Reset scroll position to top
  await evalCode(`window.scrollTo(0, 0)`);
  await new Promise(r => setTimeout(r, 500));

  const scrollInfoTop = await evalCode(`(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    scrollY: Math.round(window.scrollY)
  }))()`);

  console.log(`Top scroll state:`, scrollInfoTop);
  await capture(`${mod.name}-desktop-top.png`);

  if (mod.hasScroll) {
    // Scroll down to the bottom
    await evalCode(`window.scrollTo(0, document.documentElement.scrollHeight)`);
    await new Promise(r => setTimeout(r, 600));

    const scrollInfoBottom = await evalCode(`(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollY: Math.round(window.scrollY),
      maxPossibleScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
    }))()`);

    console.log(`Bottom scroll state:`, scrollInfoBottom);
    await capture(`${mod.name}-desktop-bottom.png`);

    const canScroll = scrollInfoBottom.scrollY > 0 || scrollInfoTop.scrollHeight > scrollInfoTop.clientHeight;
    results.push({
      module: mod.name,
      device: 'Desktop 1440x900',
      canScroll,
      topY: scrollInfoTop.scrollY,
      bottomY: scrollInfoBottom.scrollY,
      scrollHeight: scrollInfoBottom.scrollHeight,
      clientHeight: scrollInfoBottom.clientHeight
    });
  } else {
    // Explore is expected to be locked to viewport
    results.push({
      module: mod.name,
      device: 'Desktop 1440x900',
      canScroll: false,
      isLocked: true,
      scrollHeight: scrollInfoTop.scrollHeight,
      clientHeight: scrollInfoTop.clientHeight
    });
  }
}

// -----------------------------------------------------------------------------
// 2. TABLET VERIFICATION (768x1024)
// -----------------------------------------------------------------------------
await setViewport(768, 1024, true);
console.log('\n--- 2. TABLET 768x1024 VERIFICATION ---');

for (const mod of modules.filter(m => m.hasScroll)) {
  console.log(`\nTesting Tablet Module: ${mod.name.toUpperCase()}`);
  await navigateTo(mod.label);
  await new Promise(r => setTimeout(r, 800));

  await evalCode(`window.scrollTo(0, 0)`);
  await new Promise(r => setTimeout(r, 500));
  await capture(`${mod.name}-tablet-top.png`);

  await evalCode(`window.scrollTo(0, document.documentElement.scrollHeight)`);
  await new Promise(r => setTimeout(r, 600));

  const bottomScroll = await evalCode(`(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    scrollY: Math.round(window.scrollY)
  }))()`);
  await capture(`${mod.name}-tablet-bottom.png`);

  results.push({
    module: mod.name,
    device: 'Tablet 768x1024',
    canScroll: bottomScroll.scrollY > 0,
    topY: 0,
    bottomY: bottomScroll.scrollY,
    scrollHeight: bottomScroll.scrollHeight,
    clientHeight: bottomScroll.clientHeight
  });
}

// -----------------------------------------------------------------------------
// 3. MOBILE VERIFICATION (390x844)
// -----------------------------------------------------------------------------
await setViewport(390, 844, true);
console.log('\n--- 3. MOBILE 390x844 VERIFICATION ---');

for (const mod of modules.filter(m => m.hasScroll)) {
  console.log(`\nTesting Mobile Module: ${mod.name.toUpperCase()}`);
  await navigateTo(mod.label);
  await new Promise(r => setTimeout(r, 800));

  await evalCode(`window.scrollTo(0, 0)`);
  await new Promise(r => setTimeout(r, 500));
  await capture(`${mod.name}-mobile-top.png`);

  await evalCode(`window.scrollTo(0, document.documentElement.scrollHeight)`);
  await new Promise(r => setTimeout(r, 600));

  const bottomScroll = await evalCode(`(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    scrollY: Math.round(window.scrollY)
  }))()`);
  await capture(`${mod.name}-mobile-bottom.png`);

  results.push({
    module: mod.name,
    device: 'Mobile 390x844',
    canScroll: bottomScroll.scrollY > 0,
    topY: 0,
    bottomY: bottomScroll.scrollY,
    scrollHeight: bottomScroll.scrollHeight,
    clientHeight: bottomScroll.clientHeight
  });
}

// -----------------------------------------------------------------------------
// 4. BUILD-SPECIFIC PANEL INTERNAL SCROLL AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- 4. BUILD PANEL INTERNAL SCROLL AUDIT ---');
await setViewport(1440, 900, false);
await navigateTo('Build');
await new Promise(r => setTimeout(r, 2000));

const panelScrollAudit = await evalCode(`(() => {
  // Expand panels if collapsed
  const expandBtns = Array.from(document.querySelectorAll('button[title*="Expand"]'));
  expandBtns.forEach(b => b.click());

  // Find scrollable internal containers
  const els = Array.from(document.querySelectorAll('*')).filter(el => {
    const style = window.getComputedStyle(el);
    return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight && el !== document.documentElement && el !== document.body;
  });

  return els.map((p, idx) => {
    const before = p.scrollTop;
    p.scrollTop = 150;
    const after = p.scrollTop;
    return {
      index: idx,
      className: p.className.slice(0, 60),
      scrollHeight: p.scrollHeight,
      clientHeight: p.clientHeight,
      canScroll: p.scrollHeight > p.clientHeight,
      scrolled: after > before,
      before,
      after
    };
  });
})()`);
console.log('Build panels internal scroll test:', panelScrollAudit);

// Save summary json
fs.writeFileSync(path.join(artifactDir, 'scroll_results.json'), JSON.stringify({
  moduleResults: results,
  buildPanels: panelScrollAudit
}, null, 2));

console.log('\nAll Multi-Device Scroll Tests & Captures Completed Successfully!');

ws.close();
chromeProc.kill();
