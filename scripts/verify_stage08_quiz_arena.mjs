import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';
const SCRATCH_DIR = `${ARTIFACT_DIR}\\scratch\\chrome_stage08_quiz_verify`;

// Clean scratch dir if needed
try {
  fs.rmSync(SCRATCH_DIR, { recursive: true, force: true });
} catch (e) {}

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9328',
  `--user-data-dir=${SCRATCH_DIR}`,
  '--headless=new',
  '--window-size=1440,940',
  'http://localhost:5173/quiz'
]);

await new Promise(r => setTimeout(r, 4000));

http.get('http://localhost:9328/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    const json = JSON.parse(data);
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
            resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result?.value;
    }

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const outPath = `${ARTIFACT_DIR}\\${filename}`;
      fs.writeFileSync(outPath, buffer);
      console.log(`[SCREENSHOT CAPTURED] ${filename} (${buffer.length} bytes)`);
    }

    ws.onopen = async () => {
      console.log('Connected to CDP for Stage 08 Quiz Arena verification');
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
      console.log('=== Step 1: Capture Quiz Arena Lobby ===');
      const title = await evaluate('document.title');
      const headline = await evaluate('document.querySelector("h1")?.textContent');
      console.log('Page Title:', title, '| Headline:', headline);
      await captureScreenshot('stage08-01-quiz-lobby.png');

      // 2. ENGAGE GRAND TOURNAMENT
      console.log('=== Step 2: Engage Grand Tournament ===');
      const launched = await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const launchBtn = btns.find(b => b.textContent.includes('Launch Grand Tournament')) ||
                          btns.find(b => b.textContent.includes('Start Track'));
        if (launchBtn) {
          launchBtn.click();
          return true;
        }
        return false;
      })()`);
      console.log('Grand Tournament launched:', launched);

      await new Promise(r => setTimeout(r, 3000));
      const questionText = await evaluate('document.querySelector("h2")?.textContent');
      console.log('Active Question:', questionText);
      await captureScreenshot('stage08-02-active-question.png');

      // 3. SELECT ANSWER AND AUTHORIZE TELEMETRY
      console.log('=== Step 3: Select Answer and Authorize Telemetry ===');
      const selected = await evaluate(`(() => {
        // Look for buttons that represent options or true/false or zones
        const buttons = Array.from(document.querySelectorAll('button'));
        // Try multiple choice option A or first selectable option
        const choiceBtn = buttons.find(b => b.querySelector('span[class*="rounded-lg"]') || b.textContent.includes('True') || b.textContent.includes('Affirmative'));
        if (choiceBtn) {
          choiceBtn.click();
          return true;
        }
        return false;
      })()`);
      console.log('Option clicked:', selected);

      await new Promise(r => setTimeout(r, 1000));

      const authorized = await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const authBtn = btns.find(b => b.textContent.includes('Authorize Telemetry') || b.textContent.includes('Authorize Command') || b.textContent.includes('Next Question'));
        if (authBtn && !authBtn.disabled) {
          authBtn.click();
          return true;
        }
        return false;
      })()`);
      console.log('Authorize Telemetry clicked:', authorized);

      await new Promise(r => setTimeout(r, 2500));
      await captureScreenshot('stage08-03-scientific-debrief.png');

      // 4. ABORT RUN AND VISIT MISSION SCENARIOS
      console.log('=== Step 4: Visit Mission Scenarios ===');
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const abortBtn = btns.find(b => b.textContent.includes('Abort Run') || b.textContent.includes('Return to Lobby'));
        if (abortBtn) abortBtn.click();
      })()`);
      await new Promise(r => setTimeout(r, 1500));

      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const scenTab = btns.find(b => b.textContent.includes('Mission Scenarios'));
        if (scenTab) scenTab.click();
      })()`);
      await new Promise(r => setTimeout(r, 2000));
      await captureScreenshot('stage08-04-mission-scenarios.png');

      // 5. VISIT CADET TELEMETRY & ANALYTICS
      console.log('=== Step 5: Visit Cadet Telemetry & Analytics ===');
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const backBtn = btns.find(b => b.textContent.includes('Back to Arena'));
        if (backBtn) backBtn.click();
      })()`);
      await new Promise(r => setTimeout(r, 1500));

      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const analyticsTab = btns.find(b => b.textContent.includes('Cadet Telemetry'));
        if (analyticsTab) analyticsTab.click();
      })()`);
      await new Promise(r => setTimeout(r, 2000));
      await captureScreenshot('stage08-05-cadet-analytics.png');

      console.log('Verification finished successfully! Total exceptions:', exceptions.length);
      chromeProc.kill();
      process.exit(0);
    };
  });
}).on('error', (err) => {
  console.error('Failed to connect to browser:', err);
  chromeProc.kill();
  process.exit(1);
});
