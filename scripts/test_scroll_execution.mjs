import http from 'http';
import { spawn } from 'child_process';

const chromePath = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Elash bharathi\\.gemini\\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\scratch\\chrome_test_scroll';

const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9225',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2000));

const wsUrl = await new Promise((resolve, reject) => {
  http.get('http://localhost:9225/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      const page = json.find(t => t.type === 'page');
      resolve(page.webSocketDebuggerUrl);
    });
  }).on('error', reject);
});

const ws = new WebSocket(wsUrl);
let idCounter = 1;
const callbacks = new Map();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (callbacks.has(msg.id)) {
    const cb = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    cb(msg);
  }
};

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = idCounter++;
    callbacks.set(id, (res) => resolve(res.result));
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);
await send('Page.enable');
await send('Runtime.enable');

async function evalCode(code) {
  const res = await send('Runtime.evaluate', {
    expression: code,
    returnByValue: true
  });
  return res?.result?.value;
}

// 1. Navigate to /learn
console.log('Navigating to Learn...');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === 'learn');
  if (btn) btn.click();
})()`);

await new Promise(r => setTimeout(r, 2000));

const state1 = await evalCode(`(() => ({
  url: window.location.href,
  htmlScrollHeight: document.documentElement.scrollHeight,
  htmlClientHeight: document.documentElement.clientHeight,
  htmlScrollTop: document.documentElement.scrollTop,
  bodyScrollHeight: document.body.scrollHeight,
  windowScrollY: window.scrollY,
  classesHtml: document.documentElement.className,
  classesBody: document.body.className
}))()`);
console.log('Learn initial state:', state1);

// Perform scroll
console.log('Scrolling down 600px...');
await evalCode(`window.scrollTo(0, 600)`);
await new Promise(r => setTimeout(r, 500));

const state2 = await evalCode(`(() => ({
  windowScrollY: window.scrollY,
  htmlScrollTop: document.documentElement.scrollTop,
  bodyScrollTop: document.body.scrollTop
}))()`);
console.log('Learn after scroll(0, 600):', state2);

// Perform scroll to bottom
console.log('Scrolling to bottom...');
await evalCode(`window.scrollTo(0, document.documentElement.scrollHeight)`);
await new Promise(r => setTimeout(r, 500));

const state3 = await evalCode(`(() => ({
  windowScrollY: window.scrollY,
  htmlScrollTop: document.documentElement.scrollTop,
  maxScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
}))()`);
console.log('Learn after scroll to bottom:', state3);

// 2. Navigate to /build
console.log('\nNavigating to Build...');
await evalCode(`(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === 'build');
  if (btn) btn.click();
})()`);

await new Promise(r => setTimeout(r, 2500));

const stateBuild1 = await evalCode(`(() => ({
  url: window.location.href,
  htmlScrollHeight: document.documentElement.scrollHeight,
  htmlClientHeight: document.documentElement.clientHeight,
  windowScrollY: window.scrollY,
  classesHtml: document.documentElement.className,
  classesBody: document.body.className
}))()`);
console.log('Build initial state:', stateBuild1);

// Scroll Build page to bottom
await evalCode(`window.scrollTo(0, document.documentElement.scrollHeight)`);
await new Promise(r => setTimeout(r, 500));

const stateBuild2 = await evalCode(`(() => ({
  windowScrollY: window.scrollY,
  htmlScrollTop: document.documentElement.scrollTop,
  maxScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
}))()`);
console.log('Build after scroll to bottom:', stateBuild2);

// Expand panels if collapsed and test their internal scrolling
const panelTest = await evalCode(`(() => {
  // Check buttons to expand if collapsed
  const expandBtns = Array.from(document.querySelectorAll('button[title*="Expand"]'));
  expandBtns.forEach(b => b.click());
  
  // Find scrollable containers
  const els = Array.from(document.querySelectorAll('*')).filter(el => {
    const style = window.getComputedStyle(el);
    return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
  });

  return els.map((el, i) => {
    const before = el.scrollTop;
    el.scrollTop = 150;
    const after = el.scrollTop;
    return {
      tag: el.tagName,
      className: el.className.slice(0, 50),
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      before,
      after,
      scrolled: after > before
    };
  });
})()`);
console.log('Internal scrollable elements:', panelTest);

ws.close();
chromeProc.kill();
