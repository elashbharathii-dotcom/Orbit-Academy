import http from 'http';
import { spawn } from 'child_process';

const chromeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--remote-debugging-port=9298',
  '--user-data-dir=C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_test_btns',
  '--headless=new',
  '--window-size=1440,920',
  'http://localhost:5173/build'
]);

await new Promise(r => setTimeout(r, 4500));

http.get('http://localhost:9298/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    const json = JSON.parse(data);
    const page = json.find(t => t.type === 'page' && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: 'Array.from(document.querySelectorAll("button")).map((b, i) => i + ": " + b.textContent.trim()).filter(t => t.length > 2)',
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 1) {
        console.log('Buttons:', msg.result.result.value);
        ws.close();
        chromeProc.kill();
        process.exit(0);
      }
    };
  });
});
