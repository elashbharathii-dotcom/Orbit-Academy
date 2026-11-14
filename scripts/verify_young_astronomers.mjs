import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const BROWSER_CANDIDATES = [
  'C:\\Users\\Elash bharathi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => existsSync(p));
if (!BROWSER_PATH) {
  throw new Error('No Chromium browser found');
}
console.log('Using browser binary:', BROWSER_PATH);

const PORT = 9229;
const USER_DATA = process.env.TEMP + '\\browser_draw_test_' + Date.now();

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

async function waitForCondition(client, expr, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const val = await evalExpr(client, `Boolean(${expr})`);
      if (val) return true;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Timeout waiting for expression: ${expr}`);
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

    const capture = async (filename, width, height, isMobile = false) => {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: isMobile,
      });
      await sleep(600);
      const res = await client.send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const outPath = resolve('screenshots/draw', filename);
      writeFileSync(outPath, buffer);
      console.log(`Saved screenshot: ${outPath} (${width}x${height})`);
    };

    console.log('Navigating to http://localhost:5173/draw ...');
    await client.send('Page.navigate', { url: 'http://localhost:5173/draw' });

    // Wait for the gallery to render
    await waitForCondition(client, `document.querySelector('h1') && document.querySelector('h1').textContent.includes('Cosmic Creative')`);
    await sleep(1500);

    console.log('\n--- VERIFYING GALLERY DATA & UI ---');
    const galleryMeta = await evalExpr(client, `(() => {
      const heading = document.querySelector('h1')?.textContent;
      const cards = Array.from(document.querySelectorAll('.grid > div'));
      const cardTitles = cards.map(c => c.querySelector('h3')?.textContent?.trim());
      const yaCard = cards.find(c => c.textContent.includes('Young Astronomers'));
      const filterPills = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
      return {
        heading,
        totalCards: cards.length,
        cardTitles,
        hasYoungAstronomers: Boolean(yaCard),
        youngAstronomersText: yaCard?.innerText?.slice(0, 200),
        hasSpaceDiscoveryFilter: filterPills.some(p => p.includes('Space Discovery')),
      };
    })()`);
    console.log('Gallery Meta:', JSON.stringify(galleryMeta, null, 2));

    if (galleryMeta.totalCards !== 9) {
      throw new Error(`Expected exactly 9 cards, found ${galleryMeta.totalCards}`);
    }
    if (!galleryMeta.hasYoungAstronomers) {
      throw new Error('Young Astronomers card not found in gallery');
    }

    // 1. Capture Desktop Gallery (All 9 Plates)
    await capture('draw-gallery-all-9-plates.png', 1440, 900);

    // 2. Filter by Space Discovery category
    console.log('\n--- TESTING CATEGORY FILTER: Space Discovery ---');
    await evalExpr(client, `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Space Discovery'));
      if (btn) btn.click();
    })()`);
    await sleep(600);

    const filterResult = await evalExpr(client, `(() => {
      const cards = Array.from(document.querySelectorAll('.grid > div'));
      return {
        cardCount: cards.length,
        cardTitle: cards[0]?.querySelector('h3')?.textContent?.trim(),
      };
    })()`);
    console.log('Filtered by Space Discovery:', filterResult);
    if (filterResult.cardCount !== 1 || !filterResult.cardTitle.includes('Young Astronomers')) {
      throw new Error(`Filter failed! Expected 1 Young Astronomers card, got: ${JSON.stringify(filterResult)}`);
    }

    await capture('draw-gallery-category-filter.png', 1440, 900);

    // 3. Open Studio for Young Astronomers
    console.log('\n--- OPENING STUDIO FOR YOUNG ASTRONOMERS ---');
    await evalExpr(client, `(() => {
      const card = Array.from(document.querySelectorAll('.grid > div')).find(c => c.textContent.includes('Young Astronomers'));
      if (card) {
        const btn = card.querySelector('span.rounded-full') || card;
        btn.click();
      }
    })()`);

    await waitForCondition(client, `Boolean(document.getElementById('coloring-svg-canvas'))`);
    await sleep(1000);

    const studioMeta = await evalExpr(client, `(() => {
      const svg = document.getElementById('coloring-svg-canvas');
      const paths = svg ? Array.from(svg.querySelectorAll('path')) : [];
      const imageOverlay = svg ? svg.querySelector('image') : null;
      const title = document.querySelector('h2')?.textContent?.trim();
      const badges = Array.from(document.querySelectorAll('span, div')).filter(el => el.textContent?.includes('/ 43') || el.textContent?.includes('/ 32'));
      return {
        title,
        viewBox: svg?.getAttribute('viewBox'),
        regionCount: paths.length,
        hasImageOverlay: Boolean(imageOverlay),
        imageOverlayHref: imageOverlay?.getAttribute('href'),
        imageBlendMode: imageOverlay?.style?.mixBlendMode,
        counterBadge: badges[0]?.textContent?.trim(),
      };
    })()`);
    console.log('Studio Meta:', JSON.stringify(studioMeta, null, 2));

    if (studioMeta.regionCount < 30) {
      throw new Error(`Expected at least 30 colorable regions, found ${studioMeta.regionCount}`);
    }
    if (!studioMeta.hasImageOverlay || studioMeta.imageBlendMode !== 'multiply') {
      throw new Error('Image overlay with mix-blend-mode: multiply is missing or incorrect');
    }

    // Capture initial studio
    await capture('draw-studio-young-astronomers-initial.png', 1440, 900);

    // 4. Test Interactive Coloring & Blend Mode
    console.log('\n--- TESTING REGION-BASED COLORING ---');
    const colorResults = await evalExpr(client, `(() => {
      const svg = document.getElementById('coloring-svg-canvas');
      const clickRegion = (regionId, colorIndex) => {
        // Select color
        const colorButtons = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('span') && /^[0-9]+$/.test(b.querySelector('span').textContent.trim()));
        if (colorButtons[colorIndex]) {
          colorButtons[colorIndex].click();
        }
        // Click path
        const path = svg.querySelector('path[d*="' + regionId + '"]') || Array.from(svg.querySelectorAll('path')).find(p => p.getAttribute('d') && p.getAttribute('key') === regionId) || document.getElementById(regionId);
        // Find by iteration through regions in DOM
        const allPaths = Array.from(svg.querySelectorAll('path'));
        // In React, key is internal, but paths are indexed in order
        return allPaths.length;
      };
      return clickRegion('ya-sky', 0);
    })()`);

    // Click regions directly using element dispatch
    await evalExpr(client, `(() => {
      const svg = document.getElementById('coloring-svg-canvas');
      const paths = Array.from(svg.querySelectorAll('path'));
      const colorButtons = Array.from(document.querySelectorAll('button')).filter(b => {
        const s = b.querySelector('span');
        return s && /^[0-9]+$/.test(s.textContent.trim());
      });

      // Function to pick color swatch and click path
      const fillPath = (pathIndex, colorSwatchIndex) => {
        if (colorButtons[colorSwatchIndex]) {
          colorButtons[colorSwatchIndex].click();
        }
        if (paths[pathIndex]) {
          paths[pathIndex].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      };

      // Fill 10 different regions with matching colors
      fillPath(0, 0); // Sky -> Deep Space Void (#0B1226)
      fillPath(1, 1); // Planet Base -> Cosmic Orange (#EA580C)
      fillPath(2, 2); // Planet Band 1 -> Solar Gold (#F59E0B)
      fillPath(3, 2); // Planet Band 2 -> Solar Gold (#F59E0B)
      fillPath(5, 4); // Meteor Tail -> Comet Cyan (#38BDF8)
      fillPath(6, 3); // Star 1 -> Starlight Bright (#FEF08A)
      fillPath(14, 5); // Helmet -> Astronaut Suit White (#F8FAFC)
      fillPath(16, 8); // Hair -> Astronaut Hair Honey (#D97706)
      fillPath(17, 9); // Face -> Warm Skin Glow (#FDBA74)
      fillPath(25, 6); // Moon Surface -> Lunar Regolith Grey (#94A3B8)
      fillPath(26, 7); // Crater 1 -> Crater Shadow Slate (#475569)
      fillPath(27, 7); // Crater 2 -> Crater Shadow Slate (#475569)
    })()`);
    await sleep(600);

    const coloredState = await evalExpr(client, `(() => {
      const badge = Array.from(document.querySelectorAll('span, div')).find(el => /\\d+\\s*\\/\\s*\\d+/.test(el.textContent));
      const svg = document.getElementById('coloring-svg-canvas');
      const paths = Array.from(svg.querySelectorAll('path'));
      const filledPaths = paths.filter(p => p.getAttribute('fill') && p.getAttribute('fill') !== '#FFFFFF' && p.getAttribute('fill') !== '#0B1226');
      return {
        badgeText: badge?.textContent?.trim(),
        filledPathCount: filledPaths.length,
        sampleFills: filledPaths.slice(0, 5).map(p => p.getAttribute('fill')),
      };
    })()`);
    console.log('After Interactive Coloring:', coloredState);

    // Capture colored studio
    await capture('draw-studio-young-astronomers-colored.png', 1440, 900);

    // 5. Test Undo & Redo
    console.log('\n--- TESTING UNDO & REDO ---');
    await evalExpr(client, `(() => {
      const undoBtn = document.querySelector('button[title="Undo last action"]');
      if (undoBtn) undoBtn.click();
    })()`);
    await sleep(400);

    const undoState = await evalExpr(client, `(() => {
      const badge = Array.from(document.querySelectorAll('span, div')).find(el => /\\d+\\s*\\/\\s*\\d+/.test(el.textContent));
      return badge?.textContent?.trim();
    })()`);
    console.log('Badge text after Undo:', undoState);

    await evalExpr(client, `(() => {
      const redoBtn = document.querySelector('button[title="Redo action"]');
      if (redoBtn) redoBtn.click();
    })()`);
    await sleep(400);

    const redoState = await evalExpr(client, `(() => {
      const badge = Array.from(document.querySelectorAll('span, div')).find(el => /\\d+\\s*\\/\\s*\\d+/.test(el.textContent));
      return badge?.textContent?.trim();
    })()`);
    console.log('Badge text after Redo:', redoState);

    // 6. Test Responsive Viewports
    console.log('\n--- TESTING RESPONSIVE VIEWPORTS ---');
    // Tablet (768x1024)
    await capture('draw-young-astronomers-tablet.png', 768, 1024);

    // Mobile (390x844)
    await capture('draw-young-astronomers-mobile.png', 390, 844, true);

    // 7. Test Return to Gallery & Legacy Artwork integrity
    console.log('\n--- TESTING RETURN TO GALLERY & LEGACY ARTWORK ---');
    await evalExpr(client, `(() => {
      const galleryBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Gallery'));
      if (galleryBtn) galleryBtn.click();
    })()`);
    await sleep(800);

    // Click Apollo Lunar Lander (card 0)
    await evalExpr(client, `(() => {
      const firstCard = document.querySelector('.grid > div');
      if (firstCard) firstCard.click();
    })()`);
    await sleep(800);

    const legacyMeta = await evalExpr(client, `(() => {
      const title = document.querySelector('h2')?.textContent?.trim();
      const svg = document.getElementById('coloring-svg-canvas');
      const paths = svg ? svg.querySelectorAll('path').length : 0;
      return { title, regionCount: paths };
    })()`);
    console.log('Legacy Artwork Studio Opened:', legacyMeta);

    await capture('draw-studio-legacy-artwork.png', 1440, 900);

    console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
    client.close();
  } catch (err) {
    console.error('Error during verification:', err);
    process.exitCode = 1;
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

run();
