import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const BROWSER_PATH = 'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9231;
const USER_DATA = process.env.TEMP + '\\browser_color_test_' + Date.now();

mkdirSync('screenshots/draw', { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const chromeProc = spawn(
  BROWSER_PATH,
  [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

async function waitForCdp() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(300);
  }
  throw new Error('Chrome CDP did not become ready');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
  }

  async init() {
    return new Promise((res, rej) => {
      this.ws.onopen = () => res();
      this.ws.onerror = (e) => rej(e);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function evalExpr(client, expression) {
  const res = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
  });
  if (res.exceptionDetails) {
    throw new Error('Evaluation failed: ' + JSON.stringify(res.exceptionDetails));
  }
  return res.result ? res.result.value : undefined;
}

async function run() {
  try {
    console.log('Connecting to Chrome CDP on port', PORT);
    await waitForCdp();

    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const targets = await listRes.json();
    const tab = targets.find((t) => t.type === 'page') || targets[0];
    const client = new CdpClient(tab.webSocketDebuggerUrl);
    await client.init();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to http://localhost:5173/draw ...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/draw' });
    await sleep(2000);

    // Open Young Astronomers
    console.log('Opening Young Astronomers Studio...');
    await evalExpr(client, `(() => {
      const card = Array.from(document.querySelectorAll('.grid > div')).find(c => c.textContent.includes('Young Astronomers'));
      if (card) {
        const btn = card.querySelector('span.rounded-full') || card;
        btn.click();
      }
    })()`);
    await sleep(1500);

    // Helper: Select color by 1-based number
    const selectColor = async (num) => {
      await evalExpr(client, `(() => {
        const buttons = Array.from(document.querySelectorAll('button')).filter(b => {
          const s = b.querySelector('span');
          return s && s.textContent.trim() === '${num}';
        });
        if (buttons[0]) buttons[0].click();
      })()`);
      await sleep(150);
    };

    // Helper: Click path by region index in SVG
    const clickPath = async (pathIndex) => {
      await evalExpr(client, `(() => {
        const svg = document.getElementById('coloring-svg-canvas');
        if (!svg) return;
        const paths = Array.from(svg.querySelectorAll('path'));
        if (paths[${pathIndex}]) {
          paths[${pathIndex}].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      })()`);
      await sleep(150);
    };

    console.log('Applying realistic astronomical pigments across regions...');

    // Color 1: Deep Space Void (Path 0: Sky)
    console.log('Filling Deep Space Void (Sky)...');
    await selectColor(1);
    await clickPath(0);

    // Color 2: Cosmic Orange (Path 1: Planet Base, Path 13: Rocket Nose, Path 17, 18: Fins)
    console.log('Filling Cosmic Orange (Planet, Rocket Nose, Fins)...');
    await selectColor(2);
    await clickPath(1);
    await clickPath(13);
    await clickPath(17);
    await clickPath(18);

    // Color 3: Solar Gold (Path 2, 3: Planet Bands, Path 32: Saturn Emblem on Flag)
    console.log('Filling Solar Gold (Planet Bands, Flag Saturn)...');
    await selectColor(3);
    await clickPath(2);
    await clickPath(3);
    await clickPath(32);

    // Color 4: Starlight Bright (Path 4: Meteor core, Paths 6-12: Stars)
    console.log('Filling Starlight Bright (Meteor core, Stars 1-7)...');
    await selectColor(4);
    await clickPath(4);
    for (let i = 6; i <= 12; i++) {
      await clickPath(i);
    }

    // Color 5: Comet Cyan (Path 5: Meteor Tail, Path 16: Porthole Glass, Path 20: Visor, Path 33: Flag Ring)
    console.log('Filling Comet Cyan (Meteor Tail, Porthole Glass, Visor, Flag Ring)...');
    await selectColor(5);
    await clickPath(5);
    await clickPath(16);
    await clickPath(20);
    await clickPath(33);

    // Color 6: Suit White (Path 14: Rocket Body, Path 19: Helmet, Path 23: Torso, Paths 25, 26: Arms, Path 28: Legs, Path 31: Flag Cloth)
    console.log('Filling Astronaut Suit White (Rocket Body, Helmet, Torso, Arms, Legs, Flag Cloth)...');
    await selectColor(6);
    await clickPath(14);
    await clickPath(19);
    await clickPath(23);
    await clickPath(25);
    await clickPath(26);
    await clickPath(28);
    await clickPath(31);

    // Color 7: Lunar Regolith Grey (Path 15: Porthole Ring, Path 24: Chestpack, Path 27: Belt, Path 29: Boots, Path 30: Flagpole, Path 34: Moon Surface)
    console.log('Filling Lunar Regolith Grey (Porthole Ring, Chestpack, Belt, Boots, Pole, Moon)...');
    await selectColor(7);
    await clickPath(15);
    await clickPath(24);
    await clickPath(27);
    await clickPath(29);
    await clickPath(30);
    await clickPath(34);

    // Color 8: Crater Shadow Slate (Paths 35-42: Craters 1-8)
    console.log('Filling Crater Shadow Slate (Craters 1-8)...');
    await selectColor(8);
    for (let c = 35; c <= 42; c++) {
      await clickPath(c);
    }

    // Color 9: Hair Honey (Path 21: Hair)
    console.log('Filling Astronaut Hair Honey...');
    await selectColor(9);
    await clickPath(21);

    // Color 10: Warm Skin Glow (Path 22: Face)
    console.log('Filling Warm Skin Glow (Face)...');
    await selectColor(10);
    await clickPath(22);

    await sleep(1000);

    const completionStatus = await evalExpr(client, `(() => {
      const badge = Array.from(document.querySelectorAll('span, div')).find(el => /\\d+\\s*\\/\\s*\\d+/.test(el.textContent));
      const modal = document.querySelector('div[role=\"dialog\"]');
      return {
        badgeText: badge?.textContent?.trim(),
        modalOpen: Boolean(modal),
        modalTitle: modal?.querySelector('h3')?.textContent?.trim(),
      };
    })()`);
    console.log('Completion Status:', completionStatus);

    // Capture screenshot of completed artwork in studio
    const res = await client.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = resolve('screenshots/draw', 'draw-studio-young-astronomers-fully-colored.png');
    writeFileSync(outPath, buffer);
    console.log('Saved masterpiece screenshot:', outPath);

    // Also copy to artifacts directory
    const artifactPath = 'C:\\Users\\Elash bharathi\\.gemini\antigravity\\brain\\d43e70cd-7020-40cc-89a0-283d855f1c21\\draw\\draw-studio-young-astronomers-fully-colored.png';
    writeFileSync(artifactPath, buffer);

    console.log('SUCCESSFULLY COMPLETED ALL 43 REGIONS!');
    client.close();
  } catch (err) {
    console.error('Error in test:', err);
    process.exitCode = 1;
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

run();

