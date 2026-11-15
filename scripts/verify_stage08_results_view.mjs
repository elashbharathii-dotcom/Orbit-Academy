import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21';
const SCRATCH_DIR = `${ARTIFACT_DIR}\\scratch\\chrome_stage08_results_verify`;

try {
  fs.rmSync(SCRATCH_DIR, { recursive: true, force: true });
} catch (e) {}

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9329',
  `--user-data-dir=${SCRATCH_DIR}`,
  '--headless=new',
  '--window-size=1440,940',
  'http://localhost:5173/quiz'
]);

await new Promise(r => setTimeout(r, 4000));

http.get('http://localhost:9329/json', (res) => {
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
      console.log('Connected to CDP for Results View & Mistakes Review Verification');
      await send('Runtime.enable');
      await send('Page.enable');

      await new Promise(r => setTimeout(r, 3500));

      // Click "Mission Scenarios" tab, launch single scenario
      console.log('=== Step 1: Launch single mission scenario to complete run ===');
      await evaluate(`(() => {
        const scenTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Mission Scenarios'));
        if (scenTab) scenTab.click();
      })()`);

      await new Promise(r => setTimeout(r, 1500));

      // Click "Authorize Protocol" on first scenario
      await evaluate(`(() => {
        const authBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Authorize Protocol'));
        if (authBtn) authBtn.click();
      })()`);

      await new Promise(r => setTimeout(r, 2000));

      // Select an option
      await evaluate(`(() => {
        const option = document.querySelector('button[class*="w-full p-4 rounded-xl border text-left"]');
        if (option) option.click();
      })()`);

      await new Promise(r => setTimeout(r, 1000));

      // Authorize Command
      await evaluate(`(() => {
        const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Authorize Telemetry') || b.textContent.includes('Authorize Protocol'));
        if (submitBtn) submitBtn.click();
      })()`);

      await new Promise(r => setTimeout(r, 1500));

      // Click "Review Flight Report"
      await evaluate(`(() => {
        const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Review Flight Report') || b.textContent.includes('Next Question'));
        if (nextBtn) nextBtn.click();
      })()`);

      await new Promise(r => setTimeout(r, 2000));

      // Capture Results Summary
      console.log('=== Step 2: Capture Quiz Results View ===');
      await captureScreenshot('stage08-06-quiz-results-summary.png');

      // Expand first item in debrief review
      console.log('=== Step 3: Expand Mistake Review in Results View ===');
      await evaluate(`(() => {
        const itemBtn = document.querySelector('button[class*="w-full p-4 flex items-center justify-between"]');
        if (itemBtn) itemBtn.click();
      })()`);

      await new Promise(r => setTimeout(r, 1500));
      await captureScreenshot('stage08-07-quiz-mistake-review.png');

      console.log('Results verification complete!');
      chromeProc.kill();
      process.exit(0);
    };
  });
}).on('error', (err) => {
  console.error('Failed to connect:', err);
  chromeProc.kill();
  process.exit(1);
});
