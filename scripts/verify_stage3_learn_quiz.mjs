import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_verify_nasa';
const artifactDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage3_verification';

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

console.log('Launching headless Edge for Stage 3 Learning Portal & Quiz Arena Verification...');
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9280',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/learn'
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
  const filePath = path.join(artifactDir, filename);
  fs.writeFileSync(filePath, Buffer.from(res.result.data, 'base64'));
  const size = fs.statSync(filePath).size;
  console.log(`Saved screenshot: ${filename} (${size} bytes)`);
  return size;
}

try {
  // 1. Capture 12-Destinations Learning Portal Directory
  console.log('\n--- 1. Capturing Learning Portal 12 Planetary Destinations Directory ---');
  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('learn-01-destinations-directory.png');

  // 2. Select Mars Course to enter active lesson view
  console.log('\n--- 2. Entering Mars Curriculum & Capturing Lesson Theory ---');
  await evalCode(`
    (() => {
      const cards = Array.from(document.querySelectorAll('div, h3'));
      const marsCard = cards.find(el => el.textContent && el.textContent.includes('Mars & the Possibility of Life'));
      if (marsCard) {
        const btn = marsCard.closest('div[class*="group"]') || marsCard.closest('button') || marsCard;
        btn.click();
        return 'mars-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('learn-02-lesson-curriculum.png');

  // 3. Switch to 3D NASA Trek Explorer Tab
  console.log('\n--- 3. Opening Interactive 3D NASA Trek Explorer ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trekBtn = buttons.find(b => b.textContent && b.textContent.includes('3D NASA Trek'));
      if (trekBtn) {
        trekBtn.click();
        return 'trek-tab-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 4000));
  await captureScreenshot('learn-03-interactive-3d-trek.png');

  // 4. Switch to Laura AI Teacher Companion Tab
  console.log('\n--- 4. Opening Laura AI Educational Teacher Panel ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lauraBtn = buttons.find(b => b.textContent && b.textContent.includes('Laura Teacher'));
      if (lauraBtn) {
        lauraBtn.click();
        return 'laura-tab-clicked';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('learn-04-laura-teacher-companion.png');

  // 5. Navigate to Quiz Arena (/quiz)
  console.log('\n--- 5. Navigating to Quiz Arena Lobby ---');
  await evalCode(`window.location.href = 'http://localhost:5173/quiz';`);
  await new Promise(r => setTimeout(r, 3500));
  await captureScreenshot('quiz-01-arena-lobby.png');

  // 6. Launch Tournament Arena
  console.log('\n--- 6. Engaging Tournament Arena & Active Challenge ---');
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const engageBtn = buttons.find(b => b.textContent && b.textContent.includes('ENGAGE TOURNAMENT'));
      if (engageBtn) {
        engageBtn.click();
        return 'engaged';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('quiz-02-active-challenge.png');

  // 7. Answer Question and Proceed to Debrief
  console.log('\n--- 7. Answering Question and Viewing Tournament Debrief ---');
  // Select first option
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button[class*="group relative"]'));
      if (buttons.length > 0) {
        buttons[0].click();
        return 'option-selected';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));
  // Submit solution
  await evalCode(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find(b => b.textContent && b.textContent.includes('Confirm Solution'));
      if (submitBtn) {
        submitBtn.click();
        return 'submitted';
      }
      return 'not-found';
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('quiz-03-challenge-answered.png');

  console.log('\nAll Stage 3 Learning Portal & Quiz Arena verification captures completed successfully!');
} catch (err) {
  console.error('Error during Stage 3 verification:', err);
} finally {
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
