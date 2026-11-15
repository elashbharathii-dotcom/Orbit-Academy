import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_s04_clean';
const stage04Dir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_verification';
const rootArtifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';

if (fs.existsSync(userDataDir)) {
  fs.rmSync(userDataDir, { recursive: true, force: true });
}
if (!fs.existsSync(stage04Dir)) {
  fs.mkdirSync(stage04Dir, { recursive: true });
}

console.log('Launching headless Edge on port 9300 with clean profile for Stage 04 Build Mode...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9300',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/build'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9300/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const page = json.find(t => t.type === 'page' && t.url.includes('/build')) ||
                     json.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
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
console.log('Connected to Chrome DevTools Protocol on /build page');

await sendCmd('Page.enable');
await sendCmd('Runtime.enable');
await sendCmd('DOM.enable');

async function evaluate(expression) {
  const res = await sendCmd('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res?.result?.result?.value;
}

async function captureScreenshot(name) {
  const res = await sendCmd('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(res.result.data, 'base64');
  const filename = `${name}.png`;
  
  const p1 = path.join(stage04Dir, filename);
  const p2 = path.join(rootArtifactDir, filename);
  fs.writeFileSync(p1, buf);
  fs.writeFileSync(p2, buf);
  console.log(`Saved screenshot: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
}

// Wait for initial render of 3D Canvas, lighting, materials, and hangar
console.log('Waiting for Build Mode workshop stage to stabilize...');
await new Promise(r => setTimeout(r, 4500));

// ============================================================================
// Shot 1: Hangar Workshop Overview
// ============================================================================
console.log('\n--- Capturing Shot 1: Hangar Workshop Overview ---');
await captureScreenshot('stage04-01-hangar-workshop-overview');

// ============================================================================
// Shot 2: Component Library Panel & 12 Category Tabs
// ============================================================================
console.log('\n--- Capturing Shot 2: Component Library Panel & 12 Categories ---');
await evaluate(`
  // Focus or click the "Fuselage" tab in Component Library
  const buttons = Array.from(document.querySelectorAll('button'));
  const fuseBtn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'fuselage');
  if (fuseBtn) fuseBtn.click();
`);
await new Promise(r => setTimeout(r, 1200));
await captureScreenshot('stage04-02-modular-component-categories');

// ============================================================================
// Shot 3: PBR Material Studio in Ship Inspector
// ============================================================================
console.log('\n--- Capturing Shot 3: 10 Physical PBR Material Finishes ---');
await evaluate(`
  // Click the "materials" tab in the Ship Inspector panel
  const buttons = Array.from(document.querySelectorAll('button'));
  const matTab = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'materials');
  if (matTab) matTab.click();
`);
await new Promise(r => setTimeout(r, 1200));
await captureScreenshot('stage04-03-pbr-material-studio');

// ============================================================================
// Shot 4: 3D Gizmo & Transform Mode
// ============================================================================
console.log('\n--- Capturing Shot 4: 3D Viewport Transform Mode & Gizmo ---');
await evaluate(`
  // Switch back to details tab in inspector
  const buttons = Array.from(document.querySelectorAll('button'));
  const detTab = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'details');
  if (detTab) detTab.click();

  // Click "Move [W]" transform button in bottom dock
  const moveBtn = buttons.find(b => b.textContent && b.textContent.includes('Move'));
  if (moveBtn) moveBtn.click();
`);
await new Promise(r => setTimeout(r, 1200));
await captureScreenshot('stage04-04-3d-gizmo-transform-controls');

// ============================================================================
// Shot 5: Test Flight Modal Countdown
// ============================================================================
console.log('\n--- Capturing Shot 5: Test Flight Modal Launch Countdown ---');
await evaluate(`
  // Click Test Flight button in toolbar or bottom dock
  const buttons = Array.from(document.querySelectorAll('button'));
  const testFlightBtn = buttons.find(b => b.textContent && b.textContent.includes('Test Flight'));
  if (testFlightBtn) testFlightBtn.click();
`);
await new Promise(r => setTimeout(r, 1500));

await evaluate(`
  // Click INITIATE LAUNCH SEQUENCE to start 3... 2... 1... countdown
  const buttons = Array.from(document.querySelectorAll('button'));
  const launchBtn = buttons.find(b => b.textContent && b.textContent.includes('INITIATE LAUNCH SEQUENCE'));
  if (launchBtn) launchBtn.click();
`);
await new Promise(r => setTimeout(r, 1200));
await captureScreenshot('stage04-05-test-flight-countdown');

// ============================================================================
// Shot 6: Test Flight Telemetry HUD & Ascension
// ============================================================================
console.log('\n--- Capturing Shot 6: Test Flight Telemetry HUD & Ascension ---');
// Wait for countdown to finish (3s) and spacecraft to climb into ascending flight state
await new Promise(r => setTimeout(r, 4500));
await captureScreenshot('stage04-06-test-flight-telemetry-hud');

// Close Test Flight Modal
await evaluate(`
  const closeBtns = Array.from(document.querySelectorAll('button'));
  const closeBtn = closeBtns.find(b => b.querySelector('svg.lucide-x') || b.querySelector('svg'));
  if (closeBtn) closeBtn.click();
`);
await new Promise(r => setTimeout(r, 1200));

// ============================================================================
// Shot 7: Responsive Mobile Workshop View
// ============================================================================
console.log('\n--- Capturing Shot 7: Responsive Mobile Workshop View (375x812) ---');
await sendCmd('Emulation.setDeviceMetricsOverride', {
  width: 375,
  height: 812,
  deviceScaleFactor: 2,
  mobile: true,
});
await new Promise(r => setTimeout(r, 1500));
await captureScreenshot('stage04-07-responsive-mobile-workshop');

console.log('\nAll 7 Stage 04 Verification Screenshots successfully captured!');
ws.close();
chromeProc.kill();
process.exit(0);
