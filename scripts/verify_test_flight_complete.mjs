import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9320',
  '--user-data-dir=C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_test_flight_full',
  '--headless=new',
  '--window-size=1440,920',
  'http://localhost:5173/build'
]);

await new Promise(r => setTimeout(r, 4000));

http.get('http://localhost:9320/json', (res) => {
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
      console.log('Connected to CDP for complete flight verification');
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

      await new Promise(r => setTimeout(r, 2000));

      // 1. Click Test Flight
      console.log('Step 1: Opening Test Flight Modal...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Test Flight'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      // Capture Prelaunch Pad
      const shotPrelaunch = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_test_flight_01_prelaunch.png', Buffer.from(shotPrelaunch.data, 'base64'));
      console.log('Screenshot 1: Prelaunch saved');

      // 2. Click INITIATE LAUNCH SEQUENCE
      console.log('Step 2: Initiating Launch Sequence...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('INITIATE LAUNCH SEQUENCE'));
          if (btn) btn.click();
        })()`
      });

      // Wait 3.5s for countdown to complete
      await new Promise(r => setTimeout(r, 3800));

      // 3. Rocket is now ascending! Capture liftoff
      const shotLiftoff = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_test_flight_02_liftoff.png', Buffer.from(shotLiftoff.data, 'base64'));
      console.log('Screenshot 2: Liftoff saved');

      // 4. Test Camera Switcher to Pad Cam
      console.log('Step 4: Switching to Pad Cam view...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pad View') || b.textContent.includes('Pad Cam'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      const shotPadCam = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_test_flight_03_pad_cam.png', Buffer.from(shotPadCam.data, 'base64'));
      console.log('Screenshot 3: Pad Cam view saved');

      // 5. Test Camera Switcher to Cockpit Cam
      console.log('Step 5: Switching to Cockpit Cam view...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cockpit Cam'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      const shotCockpit = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_test_flight_04_cockpit_cam.png', Buffer.from(shotCockpit.data, 'base64'));
      console.log('Screenshot 4: Cockpit Cam saved');

      // 6. Switch back to Chase Cam
      console.log('Step 6: Switching back to Chase Cam...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Chase Cam'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 2500));

      // Read current telemetry
      const tel = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            telemetryNodes: Array.from(document.querySelectorAll('span')).map(s => s.textContent.trim()).filter(t => t.includes('km') || t.includes('m/s') || t.includes('G') || t.includes('T+') || t.includes('Mach')),
            isAbortPresent: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ABORT FLIGHT'))
          };
        })()`,
        returnByValue: true
      });
      console.log('Live Telemetry during ascent:', tel.result.value);

      const shotAscent = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_test_flight_05_high_altitude_ascent.png', Buffer.from(shotAscent.data, 'base64'));
      console.log('Screenshot 5: High Altitude Ascent saved');

      // 7. Test Abort Flight & Mission Debrief
      console.log('Step 7: Testing Abort Flight...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ABORT FLIGHT'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      const shotDebrief = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage04_test_flight_06_mission_debrief.png', Buffer.from(shotDebrief.data, 'base64'));
      console.log('Screenshot 6: Mission Debrief saved');

      // Check debrief contents
      const debriefCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            title: document.querySelector('h3')?.textContent,
            hasResetBtn: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset') || b.textContent.includes('Fly Again')),
            hasReturnBtn: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Return to Shipyard'))
          };
        })()`,
        returnByValue: true
      });
      console.log('Debrief check:', debriefCheck.result.value);

      console.log('Total exceptions thrown:', exceptions.length);

      ws.close();
      chromeProc.kill();
      process.exit(exceptions.length === 0 ? 0 : 1);
    };
  });
});
