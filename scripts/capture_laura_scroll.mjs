import { spawn } from 'child_process';
import fs from 'fs';

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9248',
  '--user-data-dir=C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_climate_lab',
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,920',
  'http://localhost:5173/climate'
]);

await new Promise(r => setTimeout(r, 2500));
const res = await fetch('http://localhost:9248/json');
const json = await res.json();
const page = json.find(t => t.type === 'page');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let idCounter = 1;
const callbacks = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => setTimeout(r, 2000));

// Scroll window so bottom right panel is in view and click Glossary
await send('Runtime.evaluate', {
  expression: `(() => {
    window.scrollTo({ top: 380, behavior: 'instant' });
    const b = document.querySelector('button[title*="Glossary"]');
    if (b) b.click();
  })()`
});

await new Promise(r => setTimeout(r, 1500));

const shot = await send('Page.captureScreenshot', { format: 'png' });
const buf = Buffer.from(shot.result.data, 'base64');
fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\climate_verification\\climate-07-laura-glossary-scrolled.png', buf);
console.log('Saved climate-07-laura-glossary-scrolled.png');

ws.close();
chromeProc.kill();
process.exit(0);
