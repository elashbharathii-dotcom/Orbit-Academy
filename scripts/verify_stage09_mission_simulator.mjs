import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';
const SCRATCH_DIR = `${ARTIFACT_DIR}\\scratch\\chrome_stage09_sim_verify`;

// Clean scratch dir if needed
try {
  fs.rmSync(SCRATCH_DIR, { recursive: true, force: true });
} catch (e) {}

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9330',
  `--user-data-dir=${SCRATCH_DIR}`,
  '--headless=new',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--window-size=1500,980',
  'http://localhost:5173/simulator'
]);

await new Promise(r => setTimeout(r, 4500));

http.get('http://localhost:9330/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    let json;
    try {
      json = JSON.parse(data);
    } catch (err) {
      console.error('Failed to parse CDP JSON:', err);
      chromeProc.kill();
      process.exit(1);
    }
    const page = json.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
    if (!page) {
      console.error('No page found');
      chromeProc.kill();
      process.exit(1);
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let msgId = 1;

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === id) {
            ws.removeEventListener('message', handler);
            if (resp.error) {
              console.error(`CDP error for ${method}:`, JSON.stringify(resp.error));
            }
            resolve(resp.result || resp);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      if (!res || !res.data) {
        console.error('No screenshot data returned for', filename, 'res:', JSON.stringify(res));
        return;
      }
      const buffer = Buffer.from(res.data, 'base64');
      const outPath = `${ARTIFACT_DIR}\\${filename}`;
      fs.writeFileSync(outPath, buffer);
      console.log(`[SCREENSHOT CAPTURED] ${filename} (${buffer.length} bytes)`);
    }

    ws.onopen = async () => {
      console.log('Connected to CDP for Stage 09 Space Mission Simulator verification');
      const exceptions = [];
      ws.addEventListener('message', (ev) => {
        const parsed = JSON.parse(ev.data);
        if (parsed.method === 'Runtime.exceptionThrown') {
          console.error('[BROWSER EXCEPTION]', JSON.stringify(parsed.params.exceptionDetails));
          exceptions.push(parsed.params.exceptionDetails);
        }
      });

      await send('Runtime.enable');
      await send('Page.enable');

      // Wait for page to initialize
      await new Promise(r => setTimeout(r, 4000));

      // 1. CAPTURE LOBBY VIEW
      console.log('=== Step 1: Capture Simulator Mission Selection Lobby ===');
      const title = await evaluate('document.title');
      const headline = await evaluate('document.querySelector("h1")?.textContent');
      console.log('Page Title:', title, '| Headline:', headline);
      await captureScreenshot('stage09-01-simulator-lobby.png');

      // 2. INITIALIZE FLIGHT & ENTER COCKPIT
      console.log('=== Step 2: Initialize Flight & Enter Cockpit ===');
      const launched = await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const launchBtn = btns.find(b => b.textContent.includes('INITIALIZE FLIGHT') || b.textContent.includes('ENTER COCKPIT'));
        if (launchBtn) {
          launchBtn.click();
          return true;
        }
        return false;
      })()`);
      console.log('Flight initialized:', launched);

      // Wait 3.5 seconds for 3D WebGL scene, cockpit, and instruments to mount
      await new Promise(r => setTimeout(r, 3500));

      // 3. CAPTURE COCKPIT VIEW
      console.log('=== Step 3: Capture 3D Cockpit View ===');
      const inCockpit = await evaluate(`(() => {
        return !!document.querySelector('canvas') && document.body.textContent.includes('PITCH');
      })()`);
      console.log('In Cockpit Mode:', inCockpit);
      await captureScreenshot('stage09-02-3d-cockpit-view.png');

      // 4. CAPTURE NAVBALL & INSTRUMENTS
      console.log('=== Step 4: Capture NavBall and Flight Instruments ===');
      await captureScreenshot('stage09-03-navball-hud.png');

      // 5. THROTTLE UP TO 85%, ENGAGE MAIN ENGINE & RECORD ORBITAL FLIGHT
      console.log('=== Step 5: Engage Throttle & Capture Flight Dynamics ===');
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const igniteBtn = btns.find(b => b.textContent.includes('IGNITION') || b.textContent.includes('START'));
        if (igniteBtn) igniteBtn.click();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', bubbles: true }));
        return true;
      })()`);

      // Let physics run for 4 seconds so speed increases, altitude changes, and engine trail renders
      await new Promise(r => setTimeout(r, 4000));
      await captureScreenshot('stage09-04-orbital-flight.png');

      // 6. TRIGGER FLIGHT DEBRIEF / ABORT TO INSPECT EVALUATION MODAL
      console.log('=== Step 6: Trigger Flight Debrief Modal ===');
      const debriefOpened = await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const abortBtn = btns.find(b => b.textContent.includes('Abort') || b.textContent.includes('ABORT') || b.title?.includes('Abort'));
        if (abortBtn) {
          abortBtn.click();
          return true;
        }
        return false;
      })()`);
      console.log('Abort/Debrief triggered:', debriefOpened);

      await new Promise(r => setTimeout(r, 2500));
      await captureScreenshot('stage09-05-mission-debrief.png');

      console.log('=== Stage 09 Verification Complete! ===');
      ws.close();
      chromeProc.kill();
      process.exit(0);
    };
  });
});
