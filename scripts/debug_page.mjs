import http from 'http';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_debug';

const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9270',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,920',
  'http://localhost:5173/space-weather'
]);

await new Promise(r => setTimeout(r, 3000));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9270/json', (res) => {
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
  if (msg.method === 'Runtime.consoleAPICalled') {
    console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
  }
  if (msg.id && callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

function sendCommand(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
await sendCommand('Runtime.enable');
await sendCommand('Log.enable');

await new Promise(r => setTimeout(r, 4000));

const res = await sendCommand('Runtime.evaluate', {
  expression: 'document.body.innerText',
  returnByValue: true
});
console.log('PAGE TEXT:', res.result?.result?.value);

ws.close();
chromeProc.kill();
process.exit(0);
