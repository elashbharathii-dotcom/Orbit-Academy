import http from 'http';
import { spawn } from 'child_process';

const chromePath = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_test_mobile_build';

const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9227',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=390,844',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));

const wsUrl = await new Promise((resolve, reject) => {
  http.get('http://localhost:9227/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      const page = json.find(t => t.type === 'page');
      resolve(page.webSocketDebuggerUrl);
    });
  }).on('error', reject);
});

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

async function evalCode(code) {
  const res = await send('Runtime.evaluate', {
    expression: code,
    returnByValue: true
  });
  return res?.result?.value;
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true
});

console.log('Navigating directly to Build...');
await evalCode(`(() => {
  // Try nav button or pushState
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === 'build');
  if (btn) {
    btn.click();
    return 'clicked nav button';
  }
  return 'not found';
})()`);

await new Promise(r => setTimeout(r, 3000));

const domInfo = await evalCode(`(() => {
  return {
    url: window.location.href,
    htmlScrollHeight: document.documentElement.scrollHeight,
    bodyScrollHeight: document.body.scrollHeight,
    windowScrollY: window.scrollY,
    htmlClasses: document.documentElement.className,
    bodyClasses: document.body.className,
    rootChildCount: document.getElementById('root')?.childElementCount,
    hasBuildStudio: !!document.querySelector('div[class*="min-h-screen"]'),
    hasCanvas: !!document.querySelector('canvas'),
    firstH1orH2: document.querySelector('h1, h2, h3, span[class*="font-extrabold"]')?.textContent
  };
})()`);
console.log('Mobile Build DOM Info:', domInfo);

ws.close();
chromeProc.kill();
