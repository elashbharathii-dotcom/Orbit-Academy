import http from 'http';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_debug_build';

const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9286',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,920',
  'http://localhost:5173/build'
]);

await new Promise(r => setTimeout(r, 4000));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9286/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
        resolve(page ? page.webSocketDebuggerUrl : json[0].webSocketDebuggerUrl);
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
  if (msg.method === 'Runtime.consoleAPICalled') {
    console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
  }
  if (msg.id && callbacks.has(msg.id)) {
    callbacks.get(msg.id)(msg);
    callbacks.delete(msg.id);
  }
};

function sendCmd(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
await sendCmd('Page.enable');
await sendCmd('Runtime.enable');

await new Promise(r => setTimeout(r, 3000));

const res = await sendCmd('Runtime.evaluate', {
  expression: `
    (() => {
      const allButtons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(Boolean);
      const isCanvasPresent = !!document.querySelector('canvas');
      const libraryTitle = document.querySelector('.ComponentLibraryPanel') || document.body.innerText.includes('Component Library');
      return { allButtons, isCanvasPresent, hasLib: libraryTitle };
    })()
  `,
  returnByValue: true
});

console.log('Result:', JSON.stringify(res.result.value, null, 2));

ws.close();
chromeProc.kill();
process.exit(0);
