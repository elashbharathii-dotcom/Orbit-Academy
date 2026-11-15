import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_s02_solar';
const stage02Dir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage02_verification';
const rootArtifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';

if (!fs.existsSync(stage02Dir)) {
  fs.mkdirSync(stage02Dir, { recursive: true });
}

console.log('Launching headless Edge on port 9282 for Stage 02 Solar System & Milky Way Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9282',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/discovery'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9282/json', (res) => {
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
  if (msg.method === 'Runtime.exceptionThrown') {
    console.error('[EXCEPTION THROWN]', msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text);
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const text = msg.params.args.map(a => a.value || a.description).join(' ');
    if (msg.params.type === 'error') {
      console.error('[BROWSER ERROR]', text);
    }
  }
  if (msg.id && callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

await new Promise(r => ws.onopen = r);

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = idCounter++;
    callbacks.set(id, (msg) => {
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Runtime.enable');
await send('Page.enable');

async function capture(filename) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(res.data, 'base64');
  
  const destPath1 = path.join(stage02Dir, filename);
  const destPath2 = path.join(rootArtifactDir, filename);
  
  fs.writeFileSync(destPath1, buffer);
  fs.writeFileSync(destPath2, buffer);
  console.log(`[CAPTURED] Saved ${filename} (${buffer.length} bytes) to stage02_verification/ and artifact root.`);
}

console.log('Waiting 5s for Solar System 3D textures and WebGL shaders to warm up...');
await new Promise(r => setTimeout(r, 5000));

// 1. Cinematic Solar System Overview
console.log('Capturing stage02-01-cinematic-solar-system.png...');
await capture('stage02-01-cinematic-solar-system.png');

// 2. Scientific Mode (Proportional AU spacing)
console.log('Switching to Scientific Mode...');
await send('Runtime.evaluate', {
  expression: `(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sciBtn = btns.find(b => b.textContent && b.textContent.includes('SCIENTIFIC'));
    if (sciBtn) sciBtn.click();
    return !!sciBtn;
  })()`
});
await new Promise(r => setTimeout(r, 3000));
console.log('Capturing stage02-02-scientific-mode.png...');
await capture('stage02-02-scientific-mode.png');

// Switch back to Cinematic for detailed planet close-ups
await send('Runtime.evaluate', {
  expression: `(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cinBtn = btns.find(b => b.textContent && b.textContent.includes('CINEMATIC'));
    if (cinBtn) cinBtn.click();
  })()`
});
await new Promise(r => setTimeout(r, 1500));

// 3. Jupiter with Galilean Moons (Io, Europa, Ganymede, Callisto)
console.log('Navigating to Jupiter focus...');
await send('Page.navigate', { url: 'http://localhost:5173/discovery?planet=jupiter' });
await new Promise(r => setTimeout(r, 4500));
console.log('Capturing stage02-03-jupiter-galilean-moons.png...');
await capture('stage02-03-jupiter-galilean-moons.png');

// 4. Saturn with Radial Cassini Ring System and Satellites
console.log('Navigating to Saturn focus...');
await send('Page.navigate', { url: 'http://localhost:5173/discovery?planet=saturn' });
await new Promise(r => setTimeout(r, 4500));
console.log('Capturing stage02-04-saturn-rings-moons.png...');
await capture('stage02-04-saturn-rings-moons.png');

// 5. Uranus with Tilted Rings (97.8 deg) and Satellites
console.log('Navigating to Uranus focus...');
await send('Page.navigate', { url: 'http://localhost:5173/discovery?planet=uranus' });
await new Promise(r => setTimeout(r, 4500));
console.log('Capturing stage02-05-uranus-tilted-rings.png...');
await capture('stage02-05-uranus-tilted-rings.png');

// 6. Dedicated 3D Milky Way Galaxy View (Sagittarius A* & Spiral Arms)
console.log('Switching to Dedicated 3D Milky Way Galaxy...');
await send('Runtime.evaluate', {
  expression: `(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const mwBtn = btns.find(b => b.textContent && (b.textContent.includes('MILKY WAY 3D') || b.textContent.includes('GALAXY')));
    if (mwBtn) mwBtn.click();
    return !!mwBtn;
  })()`
});
await new Promise(r => setTimeout(r, 4500));
console.log('Capturing stage02-06-milky-way-galactic-disk.png...');
await capture('stage02-06-milky-way-galactic-disk.png');

// 7. Responsive Mobile View (390 x 844)
console.log('Setting mobile device viewport (390 x 844)...');
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true
});
await send('Page.navigate', { url: 'http://localhost:5173/discovery?planet=mars' });
await new Promise(r => setTimeout(r, 4500));
console.log('Capturing stage02-07-responsive-mobile-view.png...');
await capture('stage02-07-responsive-mobile-view.png');

// Reset emulation
await send('Emulation.clearDeviceMetricsOverride');

console.log('All 7 Stage 02 screenshots successfully captured!');
ws.close();
chromeProc.kill();
process.exit(0);
