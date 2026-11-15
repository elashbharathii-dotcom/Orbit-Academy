import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9325',
  '--user-data-dir=C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_stage07_verify',
  '--headless=new',
  '--window-size=1440,940',
  'http://localhost:5173/learn'
]);

await new Promise(r => setTimeout(r, 4500));

http.get('http://localhost:9325/json', (res) => {
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
      console.log('Connected to CDP for Stage 07 Learning Portal 2.0 verification');
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

      // 1. Verify 12-Discipline Filter Carousel and Dashboard
      console.log('Step 1: Checking Dashboard and 12-Discipline Category Filter...');
      const dashCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const pills = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(t => t.length > 2);
          const hasAstronomy = pills.some(p => p.includes('Astronomy'));
          const hasBiology = pills.some(p => p.includes('Space Biology'));
          const hasGeology = pills.some(p => p.includes('Planetary Geology'));
          const hasWeather = pills.some(p => p.includes('Space Weather'));
          const hasFlight = pills.some(p => p.includes('Human Spaceflight'));
          return { hasAstronomy, hasBiology, hasGeology, hasWeather, hasFlight };
        })()`,
        returnByValue: true
      });
      console.log('Dashboard disciplines:', dashCheck.result.value);

      // Open Subject Mastery Drawer
      console.log('Opening Subject Mastery Matrix Drawer...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('12-Subject Mastery'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1000));

      const shotDashboard = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-01-learning-portal-dashboard.png', Buffer.from(shotDashboard.data, 'base64'));
      console.log('Screenshot 1: Dashboard & Mastery Matrix saved');

      // 2. Select Space Biology Course
      console.log('Step 2: Entering NASA Space Biology Course...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const cards = Array.from(document.querySelectorAll('h3'));
          const bioCard = cards.find(h => h.textContent.includes('Space Biology'));
          if (bioCard) {
            bioCard.closest('div[class*="group"]')?.click();
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      // Capture Lesson Reading View
      const shotLessonTheory = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-02-lesson-reading-theory.png', Buffer.from(shotLessonTheory.data, 'base64'));
      console.log('Screenshot 2: Lesson Reading Theory saved');

      // 3. Switch to 3D Model Tab
      console.log('Step 3: Switching to 3D Model Viewport Tab...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('3D Model'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      // Click a 3D annotation pin
      await send('Runtime.evaluate', {
        expression: `(() => {
          const pin = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Double-Strand Break') || b.textContent.includes('Landmarks'));
          if (pin) pin.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1000));

      const shot3D = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-03-interactive-3d-model.png', Buffer.from(shot3D.data, 'base64'));
      console.log('Screenshot 3: Interactive 3D Model saved');

      // 4. Switch to Scientific Diagram Tab
      console.log('Step 4: Switching to Diagram Tab...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Diagram'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      const shotDiagram = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-04-scientific-diagram.png', Buffer.from(shotDiagram.data, 'base64'));
      console.log('Screenshot 4: Scientific Diagram saved');

      // 5. Switch to NASA Data Tab (OSDR Card)
      console.log('Step 5: Switching to NASA Data Tab (OSDR Card)...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('NASA Trek') || b.textContent.includes('NASA Data'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      const shotOsdr = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-05-nasa-open-science-osdr.png', Buffer.from(shotOsdr.data, 'base64'));
      console.log('Screenshot 5: NASA Open Science OSDR Card saved');

      // 6. Switch to Laura AI Teacher Tab
      console.log('Step 6: Switching to Laura Teacher Tab...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Laura Teacher'));
          if (btn) btn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      // Click a curated inquiry
      await send('Runtime.evaluate', {
        expression: `(() => {
          const qBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('microgravity affect'));
          if (qBtn) qBtn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1000));

      const shotLaura = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-06-laura-ai-teacher.png', Buffer.from(shotLaura.data, 'base64'));
      console.log('Screenshot 6: Laura AI Teacher saved');

      // 7. Test Checkpoint & Bookmark
      console.log('Step 7: Testing Knowledge Checkpoint and Bookmarks...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const theoryBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Lesson Reading'));
          if (theoryBtn) theoryBtn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      // Bookmark lesson
      await send('Runtime.evaluate', {
        expression: `(() => {
          const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save'));
          if (saveBtn) saveBtn.click();
        })()`
      });

      // Select Checkpoint Option A & Submit
      await send('Runtime.evaluate', {
        expression: `(() => {
          const optA = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Mitochondrial function'));
          if (optA) optA.click();
          const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Checkpoint'));
          if (submitBtn) submitBtn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      const shotCheckpoint = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-07-knowledge-checkpoint.png', Buffer.from(shotCheckpoint.data, 'base64'));
      console.log('Screenshot 7: Knowledge Checkpoint Solved saved');

      // 8. Return to Directory & Switch to NASA Deep-Space Observatory Tab
      console.log('Step 8: Checking NASA Space Observatory Tab (APOD / NeoWs / DONKI)...');
      await send('Runtime.evaluate', {
        expression: `(() => {
          const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('All Disciplines'));
          if (backBtn) backBtn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      await send('Runtime.evaluate', {
        expression: `(() => {
          const obsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('NASA Deep-Space Observatory'));
          if (obsBtn) obsBtn.click();
        })()`
      });
      await new Promise(r => setTimeout(r, 2500));

      const shotObservatory = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\stage07-08-nasa-observatory.png', Buffer.from(shotObservatory.data, 'base64'));
      console.log('Screenshot 8: NASA Deep-Space Observatory saved');

      console.log('Total browser exceptions thrown:', exceptions.length);

      ws.close();
      chromeProc.kill();
      process.exit(exceptions.length === 0 ? 0 : 1);
    };
  });
});
