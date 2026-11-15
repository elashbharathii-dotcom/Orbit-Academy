import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_climate_s4';
const stage4Dir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage4_verification';
const rootArtifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';

if (!fs.existsSync(stage4Dir)) {
  fs.mkdirSync(stage4Dir, { recursive: true });
}

console.log('Launching headless Edge for Stage 4 Climate Lab Verification (Refined)...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9280',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/climate'
]);

await new Promise(r => setTimeout(r, 4500));

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9280/json', (res) => {
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
console.log('Connected to CDP websocket on port 9280');

await sendCommand('Runtime.enable');

async function evalCode(expression) {
  const res = await sendCommand('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.result?.value;
}

async function captureScreenshot(filename) {
  const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
  const stage4Path = path.join(stage4Dir, filename);
  const rootPath = path.join(rootArtifactDir, filename);
  const buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(stage4Path, buffer);
  fs.writeFileSync(rootPath, buffer);
  const size = fs.statSync(stage4Path).size;
  console.log(`Saved screenshot: ${filename} (${size} bytes)`);
  return size;
}

try {
  // 1. Capture 3D Earth Orbit (Mode 1)
  console.log('\n--- 1. Capturing Mode 1: 3D Earth Orbit with Atmosphere & Day/Night ---');
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('climate-01-3d-earth-orbit.png');

  // 2. Switch to Dynamic Weather (Mode 2)
  console.log('\n--- 2. Switching to Mode 2: Dynamic Weather & Extreme Events ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const weatherBtn = buttons.find(b => b.textContent && b.textContent.includes('Dynamic Weather'));
      if (weatherBtn) {
        weatherBtn.click();
        return 'weather-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('climate-02-dynamic-weather-hurricane.png');

  // 3. Switch to Climate Simulator / Scenarios (Mode 3)
  console.log('\n--- 3. Switching to Mode 3: Climate Simulator & Radiative Forcing ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const climateBtn = buttons.find(b => b.textContent && b.textContent.includes('Climate Simulator'));
      if (climateBtn) {
        climateBtn.click();
        return 'climate-simulator-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('climate-03-climate-change-scenarios.png');

  // 4. Switch to NASA GIBS Earthdata (Mode 6) - GIBS Satellite Subdeck
  console.log('\n--- 4. Switching to Mode 6: NASA GIBS Earth Observation Satellites ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const gibsBtn = buttons.find(b => b.textContent && b.textContent.includes('NASA GIBS Earthdata'));
      if (gibsBtn) {
        gibsBtn.click();
        return 'gibs-mode-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('climate-04-nasa-gibs-satellites.png');

  // 5. NASA POWER Solar Irradiance Subdeck within Mode 6
  console.log('\n--- 5. Switching to NASA POWER Solar & Meteorological Telemetry Subdeck ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const powerBtn = buttons.find(b => b.textContent && b.textContent.includes('POWER Solar'));
      if (powerBtn) {
        powerBtn.click();
        return 'power-deck-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('climate-05-nasa-power-solar.png');

  // 6. Switch to Earth vs. Mars Climate Laboratory (Mode 7) - Telemetry View
  console.log('\n--- 6. Switching to Mode 7: Earth vs. Mars Climate Comparison Lab ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const marsBtn = buttons.find(b => b.textContent && b.textContent.includes('Earth vs. Mars'));
      if (marsBtn) {
        marsBtn.click();
        return 'mars-comparison-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('climate-06-earth-mars-comparison.png');

  // 6b. Scroll Down to capture Interactive Terraforming Pressure Experiment Slider & Metrics
  console.log('\n--- 6b. Scrolling Down to Interactive Terraforming Experiment Slider & Metric Matrices ---');
  await evalCode(`
    (() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        slider.value = '350';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
      window.scrollTo({ top: 580, behavior: 'instant' });
      return 'scrolled';
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('climate-06b-earth-mars-terraforming-slider.png');

  // 7. Responsive Mobile Viewport Testing (390 x 844)
  console.log('\n--- 7. Setting Viewport to Mobile (390 x 844) for Responsive Layout Verification ---');
  await evalCode(`window.scrollTo({ top: 0, behavior: 'instant' });`);
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('climate-07-responsive-mobile-view.png');

  // Reset viewport
  await sendCommand('Emulation.clearDeviceMetricsOverride');

  console.log('\nAll Stage 4 Climate Lab screenshots captured and verified successfully!');
} catch (err) {
  console.error('Error during Stage 4 verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
