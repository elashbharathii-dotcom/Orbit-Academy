import http from 'http';
import { spawn } from 'child_process';

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9261',
  '--user-data-dir=C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\cdp_test',
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-fre',
  '--disable-sync',
  '--window-size=1440,920',
  'http://localhost:5173/space-weather'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://localhost:9261/json');
    const targets = await res.json();
    console.log('Targets:', targets.map(t => ({ title: t.title, url: t.url, type: t.type })));
    const page = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
    if (!page) { console.log('No page found'); chromeProc.kill(); return; }
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify({
            title: document.title,
            url: window.location.href,
            bodySnippet: document.body.innerText.slice(0, 300)
          })`
        }
      }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Page eval:', data.result?.result?.value);
      ws.close();
      chromeProc.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    chromeProc.kill();
    process.exit(1);
  }
}, 4500);
