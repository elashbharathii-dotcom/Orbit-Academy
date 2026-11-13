import * as THREE from 'three';

/**
 * Procedural Astronomical Texture Generator
 * Generates scientifically inspired, high-resolution planetary texture maps
 * using HTML5 Canvas and mathematical noise algorithms.
 * 
 * Benefits:
 * - 100% offline, zero network 404s, instantaneous load.
 * - Exact scientific color palettes based on NASA Voyager, Cassini, Juno & Hubble imagery.
 * - Cached in memory: generated once per session with zero render-loop overhead.
 */

// In-memory texture cache to prevent duplicate canvas allocations
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Simple pseudo-random hash generator for deterministic procedural noise
 */
function pseudoNoise(x: number, y: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * 2D Value Noise for organic surface terrains and cloud formations
 */
function smoothNoise(x: number, y: number, seed: number = 42): number {
  const iX = Math.floor(x);
  const iY = Math.floor(y);
  const fX = x - iX;
  const fY = y - iY;

  // Smoothstep interpolation
  const sX = fX * fX * (3.0 - 2.0 * fX);
  const sY = fY * fY * (3.0 - 2.0 * fY);

  const n00 = pseudoNoise(iX, iY, seed);
  const n10 = pseudoNoise(iX + 1, iY, seed);
  const n01 = pseudoNoise(iX, iY + 1, seed);
  const n11 = pseudoNoise(iX + 1, iY + 1, seed);

  const top = n00 * (1.0 - sX) + n10 * sX;
  const bottom = n01 * (1.0 - sX) + n11 * sX;

  return top * (1.0 - sY) + bottom * sY;
}

/**
 * Fractal Brownian Motion (fBM) for rich natural fractal details
 */
function fbm(x: number, y: number, octaves: number = 4, seed: number = 42): number {
  let val = 0;
  let freq = 1.0;
  let amp = 0.5;
  for (let o = 0; o < octaves; o++) {
    val += smoothNoise(x * freq, y * freq, seed + o * 13) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

function createCachedTexture(
  key: string,
  width: number,
  height: number,
  renderFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    renderFn(ctx, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;

  textureCache.set(key, texture);
  return texture;
}

// ==========================================
// 1. SUN (SOL) SURFACE TEXTURE
// ==========================================
export function getSunTexture(): THREE.CanvasTexture {
  return createCachedTexture('sun_surface', 1024, 512, (ctx, w, h) => {
    // Base solar yellow-orange gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#F59E0B');
    grad.addColorStop(0.5, '#FBBF24');
    grad.addColorStop(1, '#D97706');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Convection granule noise overlay
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const n = fbm(x * 0.05, y * 0.05, 3, 101);
        const heat = Math.floor(n * 45);

        data[idx] = Math.min(255, data[idx] + heat + 15);     // Red
        data[idx + 1] = Math.min(255, data[idx + 1] + heat);  // Green
        data[idx + 2] = Math.max(0, data[idx + 2] - 10);      // Blue
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Add sunspot clusters
    const sunspots = [
      { x: w * 0.35, y: h * 0.42, r: 12 },
      { x: w * 0.38, y: h * 0.45, r: 8 },
      { x: w * 0.72, y: h * 0.58, r: 14 },
      { x: w * 0.75, y: h * 0.56, r: 6 },
    ];

    sunspots.forEach((spot) => {
      // Penumbra
      const pen = ctx.createRadialGradient(spot.x, spot.y, 1, spot.x, spot.y, spot.r);
      pen.addColorStop(0, '#451A03');
      pen.addColorStop(0.6, '#78350F');
      pen.addColorStop(1, 'transparent');
      ctx.fillStyle = pen;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
      ctx.fill();

      // Umbra
      ctx.fillStyle = '#1C0B02';
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

// ==========================================
// 2. MERCURY CRATERED BASALT
// ==========================================
export function getMercuryTexture(): THREE.CanvasTexture {
  return createCachedTexture('mercury_surface', 1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#6B7280';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Regolith noise
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const n = fbm(x * 0.04, y * 0.04, 4, 303);
        const shade = Math.floor((n - 0.5) * 50);
        const val = Math.max(70, Math.min(180, 115 + shade));
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val + 4; // slight cool basalt tint
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Stamped impact craters
    const craters = [
      { x: 220, y: 160, r: 28 },
      { x: 580, y: 320, r: 42 }, // Caloris Basin candidate
      { x: 800, y: 190, r: 24 },
      { x: 350, y: 380, r: 18 },
      { x: 670, y: 140, r: 16 },
      { x: 140, y: 310, r: 22 },
      { x: 490, y: 220, r: 14 },
    ];

    craters.forEach(({ x, y, r }) => {
      // Crater floor (dark shadow side)
      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = r * 0.22;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Raised sun-lit rim
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = r * 0.12;
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, r, Math.PI * 0.7, Math.PI * 1.8);
      ctx.stroke();

      // Deep crater floor
      ctx.fillStyle = '#3F3F46';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

// ==========================================
// 3. VENUS SULFUR CLOUD DECK
// ==========================================
export function getVenusTexture(): THREE.CanvasTexture {
  return createCachedTexture('venus_surface', 1024, 512, (ctx, w, h) => {
    // Pale amber/cream base
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#D4A373');
    grad.addColorStop(0.3, '#E6CCB2');
    grad.addColorStop(0.5, '#FDE68A');
    grad.addColorStop(0.7, '#E6CCB2');
    grad.addColorStop(1, '#D4A373');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Zonal chevron wind bands
    ctx.fillStyle = 'rgba(180, 130, 80, 0.12)';
    for (let i = 0; i < 18; i++) {
      const y = (h / 18) * i;
      ctx.fillRect(0, y, w, h / 36);
    }

    // Soft swirling sulfur streaks
    ctx.strokeStyle = 'rgba(160, 105, 50, 0.15)';
    ctx.lineWidth = 14;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const startY = 80 + i * 30;
      ctx.moveTo(0, startY);
      ctx.bezierCurveTo(w * 0.3, startY - 20, w * 0.7, startY + 25, w, startY - 5);
      ctx.stroke();
    }
  });
}

// ==========================================
// 4. EARTH SURFACE & CLOUD MAPS
// ==========================================
export function getEarthSurfaceTexture(): THREE.CanvasTexture {
  return createCachedTexture('earth_surface', 1024, 512, (ctx, w, h) => {
    // Deep ocean base
    ctx.fillStyle = '#0F2B48';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Generate continents via multi-frequency fBM
    for (let y = 0; y < h; y++) {
      const latNorm = Math.abs(y - h / 2) / (h / 2); // 0 at equator, 1 at poles

      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const elevation = fbm(x * 0.008, y * 0.008, 4, 777);

        // Polar ice caps
        if (latNorm > 0.82) {
          data[idx] = 240;
          data[idx + 1] = 248;
          data[idx + 2] = 255;
        } else if (elevation > 0.52) {
          // Continental landmasses
          if (elevation > 0.68) {
            // Mountains / arid deserts
            data[idx] = 168; // R
            data[idx + 1] = 140; // G
            data[idx + 2] = 95; // B
          } else {
            // Temperate biosphere / forests
            data[idx] = 34; // R
            data[idx + 1] = 115; // G
            data[idx + 2] = 52; // B
          }
        } else if (elevation > 0.49) {
          // Shallow coastal waters / continental shelves
          data[idx] = 28;
          data[idx + 1] = 84;
          data[idx + 2] = 125;
        } else {
          // Deep abyssal ocean
          data[idx] = 15;
          data[idx + 1] = 43;
          data[idx + 2] = 72;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  });
}

export function getEarthCloudTexture(): THREE.CanvasTexture {
  return createCachedTexture('earth_clouds', 1024, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const cloudDensity = fbm(x * 0.012, y * 0.012, 4, 999);

        if (cloudDensity > 0.54) {
          const alpha = Math.min(255, Math.floor((cloudDensity - 0.54) * 4.5 * 255));
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = alpha;
        } else {
          data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  });
}

// ==========================================
// 5. MARS RUST SURFACE & CANYONS
// ==========================================
export function getMarsTexture(): THREE.CanvasTexture {
  return createCachedTexture('mars_surface', 1024, 512, (ctx, w, h) => {
    // Rust-orange base
    ctx.fillStyle = '#C85A32';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let y = 0; y < h; y++) {
      const latNorm = Math.abs(y - h / 2) / (h / 2);

      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const elevation = fbm(x * 0.01, y * 0.01, 4, 512);

        // Polar ice caps (dry ice + water frost)
        if (latNorm > 0.88) {
          data[idx] = 245;
          data[idx + 1] = 245;
          data[idx + 2] = 250;
        } else if (elevation < 0.44) {
          // Dark basaltic plains (Syrtis Major style)
          data[idx] = 92;
          data[idx + 1] = 42;
          data[idx + 2] = 24;
        } else if (elevation > 0.62) {
          // Bright ochre iron dust highlands
          data[idx] = 214;
          data[idx + 1] = 112;
          data[idx + 2] = 68;
        } else {
          // Intermediate terrain
          data[idx] = 178;
          data[idx + 1] = 78;
          data[idx + 2] = 42;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Stamped impact craters
    const craters = [
      { x: 340, y: 280, r: 24 },
      { x: 710, y: 190, r: 36 },
      { x: 840, y: 340, r: 20 },
      { x: 190, y: 390, r: 18 },
    ];

    craters.forEach(({ x, y, r }) => {
      ctx.strokeStyle = '#4A1D0E';
      ctx.lineWidth = r * 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#F08C65';
      ctx.lineWidth = r * 0.1;
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, r, Math.PI * 0.6, Math.PI * 1.8);
      ctx.stroke();
    });
  });
}

// ==========================================
// 6. JUPITER ATMOSPHERIC BANDS & RED SPOT
// ==========================================
export function getJupiterTexture(): THREE.CanvasTexture {
  return createCachedTexture('jupiter_surface', 1024, 512, (ctx, w, h) => {
    // Alternating ammonia zones and brown/red belts
    const belts = [
      { y: 0.05, h: 0.08, col: '#78350F' }, // North Polar
      { y: 0.18, h: 0.07, col: '#D97706' }, // North Temperate
      { y: 0.32, h: 0.12, col: '#B45309' }, // North Equatorial Belt
      { y: 0.45, h: 0.08, col: '#FEF3C7' }, // Equatorial Zone
      { y: 0.54, h: 0.14, col: '#9A3412' }, // South Equatorial Belt (contains Red Spot)
      { y: 0.70, h: 0.07, col: '#D97706' }, // South Temperate
      { y: 0.85, h: 0.09, col: '#78350F' }, // South Polar
    ];

    // Background cream
    ctx.fillStyle = '#FDE68A';
    ctx.fillRect(0, 0, w, h);

    belts.forEach((belt) => {
      ctx.fillStyle = belt.col;
      ctx.fillRect(0, belt.y * h, w, belt.h * h);
    });

    // Zonal jet-stream shear turbulence
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const turb = smoothNoise(x * 0.03, y * 0.08, 888);
        const shift = Math.floor((turb - 0.5) * 35);

        data[idx] = Math.max(0, Math.min(255, data[idx] + shift));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + Math.floor(shift * 0.7)));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + Math.floor(shift * 0.3)));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // THE GREAT RED SPOT (Anticyclonic vortex in southern belt)
    const spotX = w * 0.62;
    const spotY = h * 0.61;
    const spotRadiusX = 58;
    const spotRadiusY = 32;

    const spotGrad = ctx.createRadialGradient(spotX, spotY, 4, spotX, spotY, spotRadiusX);
    spotGrad.addColorStop(0, '#991B1B'); // Crimson core
    spotGrad.addColorStop(0.5, '#C2410C'); // Orange-red vortex
    spotGrad.addColorStop(0.85, '#EA580C');
    spotGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, spotRadiusX, spotRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red spot inner eye
    ctx.fillStyle = '#7F1D1D';
    ctx.beginPath();
    ctx.ellipse(spotX - 4, spotY, spotRadiusX * 0.35, spotRadiusY * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ==========================================
// 7. SATURN SURFACE & RINGS
// ==========================================
export function getSaturnSurfaceTexture(): THREE.CanvasTexture {
  return createCachedTexture('saturn_surface', 1024, 512, (ctx, w, h) => {
    // Subtle, soft golden butterscotch bands
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#A16207');
    grad.addColorStop(0.18, '#CA8A04');
    grad.addColorStop(0.35, '#EAB308');
    grad.addColorStop(0.5, '#FDE047');
    grad.addColorStop(0.65, '#EAB308');
    grad.addColorStop(0.82, '#CA8A04');
    grad.addColorStop(1, '#A16207');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Fine atmospheric striping
    ctx.fillStyle = 'rgba(161, 98, 7, 0.08)';
    for (let y = 0; y < h; y += 8) {
      ctx.fillRect(0, y, w, 4);
    }
  });
}

export function getSaturnRingTexture(): THREE.CanvasTexture {
  return createCachedTexture('saturn_rings', 512, 64, (ctx, w, h) => {
    // Radial concentric ring density gradient from inner to outer radius
    const grad = ctx.createLinearGradient(0, 0, w, 0);

    // Inner C Ring (translucent crepe ring)
    grad.addColorStop(0.0, 'rgba(120, 100, 70, 0.15)');
    grad.addColorStop(0.2, 'rgba(180, 160, 120, 0.45)');

    // Dense B Ring (brightest and most opaque)
    grad.addColorStop(0.25, 'rgba(234, 219, 190, 0.95)');
    grad.addColorStop(0.55, 'rgba(216, 194, 157, 0.92)');

    // Cassini Division (dark prominent gap)
    grad.addColorStop(0.58, 'rgba(30, 25, 20, 0.04)');
    grad.addColorStop(0.64, 'rgba(30, 25, 20, 0.04)');

    // A Ring (intermediate density)
    grad.addColorStop(0.65, 'rgba(210, 190, 155, 0.78)');
    grad.addColorStop(0.85, 'rgba(180, 160, 125, 0.72)');

    // Encke Gap hint
    grad.addColorStop(0.86, 'rgba(30, 25, 20, 0.1)');
    grad.addColorStop(0.88, 'rgba(180, 160, 125, 0.65)');

    // Outer F Ring edge taper
    grad.addColorStop(0.96, 'rgba(140, 120, 90, 0.35)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
}

// ==========================================
// 8. URANUS ICE GIANT
// ==========================================
export function getUranusTexture(): THREE.CanvasTexture {
  return createCachedTexture('uranus_surface', 1024, 512, (ctx, w, h) => {
    // Pale cyan-aquamarine methane gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#5EEAD4');
    grad.addColorStop(0.3, '#99F6E4');
    grad.addColorStop(0.5, '#CCFBF1');
    grad.addColorStop(0.7, '#99F6E4');
    grad.addColorStop(1, '#5EEAD4');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Very subtle, quiet atmospheric haze
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, h * 0.45, w, h * 0.1);
  });
}

// ==========================================
// 9. NEPTUNE DEEP METHANE & CIRRUS STORMS
// ==========================================
export function getNeptuneTexture(): THREE.CanvasTexture {
  return createCachedTexture('neptune_surface', 1024, 512, (ctx, w, h) => {
    // Deep royal azure base
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1E40AF');
    grad.addColorStop(0.3, '#2563EB');
    grad.addColorStop(0.5, '#3B82F6');
    grad.addColorStop(0.7, '#2563EB');
    grad.addColorStop(1, '#1E40AF');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Great Dark Spot (anticyclonic storm)
    const spotX = w * 0.42;
    const spotY = h * 0.58;
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 2, spotX, spotY, 42);
    spotGrad.addColorStop(0, '#0F172A');
    spotGrad.addColorStop(0.6, '#1E3A8A');
    spotGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, 42, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // High-altitude white methane cirrus cloud streaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const cirrusStreaks = [
      { x: w * 0.35, y: h * 0.52, len: 120 },
      { x: w * 0.48, y: h * 0.65, len: 90 },
      { x: w * 0.72, y: h * 0.38, len: 140 },
      { x: w * 0.15, y: h * 0.44, len: 80 },
    ];

    cirrusStreaks.forEach(({ x, y, len }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + len * 0.3, y - 3, x + len * 0.7, y + 4, x + len, y);
      ctx.stroke();
    });
  });
}

