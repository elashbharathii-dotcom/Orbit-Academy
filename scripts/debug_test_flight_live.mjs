import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9315',
  '--user-data-dir=C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_test_flight_debug',
  '--headless=new',
  '--window-size=1440,920',
  'http://localhost:5173/build'
]);

await new Promise(r => setTimeout(r, 4000));

http.get('http://localhost:9315/json', (res) => {
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

    ws.onopen = async () => {
      console.log('Connected to CDP');
      ws.addEventListener('message', (ev) => {
        const parsed = JSON.parse(ev.data);
        if (parsed.method === 'Runtime.consoleAPICalled') {
          console.log('[BROWSER CONSOLE]', parsed.params.type, parsed.params.args.map(a => a.value || a.description).join(' '));
        }
        if (parsed.method === 'Runtime.exceptionThrown') {
          console.error('[BROWSER EXCEPTION]', JSON.stringify(parsed.params.exceptionDetails));
        }
      });

      await send('Runtime.enable');
      await send('Page.enable');

      // Wait a moment for build mode to mount
      await new Promise(r => setTimeout(r, 2000));

      // Check for Test Flight buttons
      const checkBtn = await send('Runtime.evaluate', {
        expression: `(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const tfBtns = btns.filter(b => b.textContent.includes('Test Flight'));
          return {
            count: tfBtns.length,
            texts: tfBtns.map(b => b.textContent.trim())
          };
        })()`,
        returnByValue: true
      });
      console.log('Test Flight buttons found:', checkBtn.result.value);

      // Click Test Flight button
      console.log('Clicking Test Flight button...');
      const clickRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('Test Flight'));
          if (btn) {
            btn.click();
            return 'CLICKED';
          }
          return 'NOT FOUND';
        })()`,
        returnByValue: true
      });
      console.log('Click result:', clickRes.result.value);

      // Wait 1.5s and check if modal is open
      await new Promise(r => setTimeout(r, 1500));

      const modalCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const modalTitle = document.querySelector('span[class*="font-extrabold"]')?.textContent;
          const initiateBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('INITIATE LAUNCH SEQUENCE') || b.textContent.includes('LAUNCH'));
          return {
            modalTitle,
            hasInitiateBtn: !!initiateBtn,
            initiateBtnText: initiateBtn ? initiateBtn.textContent.trim() : null,
            bodyTextSnippet: document.body.innerText.substring(0, 500)
          };
        })()`,
        returnByValue: true
      });
      console.log('Modal check:', modalCheck.result.value);

      // Take a screenshot of the opened modal
      const shot1 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\test_flight_debug_modal.png', Buffer.from(shot1.data, 'base64'));
      console.log('Screenshot 1 saved');

      // Click INITIATE LAUNCH SEQUENCE if present
      const launchClick = await send('Runtime.evaluate', {
        expression: `(() => {
          const initiateBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('INITIATE LAUNCH SEQUENCE'));
          if (initiateBtn) {
            initiateBtn.click();
            return 'LAUNCH CLICKED';
          }
          return 'INITIATE BTN NOT FOUND';
        })()`,
        returnByValue: true
      });
      console.log('Launch click result:', launchClick.result.value);

      // Wait 4 seconds for countdown and liftoff
      await new Promise(r => setTimeout(r, 4500));

      const flightStatus = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            telemetry: Array.from(document.querySelectorAll('span')).map(s => s.textContent.trim()).filter(t => t.includes('km') || t.includes('m/s') || t.includes('G') || t.includes('T+')),
            stateBadge: Array.from(document.querySelectorAll('span')).map(s => s.textContent.trim()).filter(t => ['PRELAUNCH', 'COUNTDOWN', 'ASCENDING', 'MECO', 'ORBITAL', 'ABORTED'].includes(t))
          };
        })()`,
        returnByValue: true
      });
      console.log('Flight status after 4.5s:', flightStatus.result.value);

      const shot2 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\test_flight_debug_flying.png', Buffer.from(shot2.data, 'base64'));
      console.log('Screenshot 2 saved');

      ws.close();
      chromeProc.kill();
      process.exit(0);
    };
  });
});
