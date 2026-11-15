import * as THREE from 'three';
import { MARS_WORLD_REGIONS, WorldRegionDefinition } from '../types/worldGenTypes';

/**
 * High-performance deterministic 2D noise generator for Martian terrain
 */
class DeterministicNoise2D {
  private perm: Uint8Array = new Uint8Array(512);

  constructor(seed = 42) {
    this.reseed(seed);
  }

  public reseed(seed: number) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Fisher-Yates shuffle with seed
    let s = Math.abs(seed) + 1;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = (s % (i + 1));
      const temp = p[i];
      p[i] = p[j];
      p[j] = temp;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * 2D Perlin Noise in range [-1, 1]
   */
  public noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    // Quintic fade curve
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);

    const a = this.perm[X] + Y;
    const aa = this.perm[a];
    const ab = this.perm[a + 1];
    const b = this.perm[X + 1] + Y;
    const ba = this.perm[b];
    const bb = this.perm[b + 1];

    const g00 = this.grad(this.perm[aa], xf, yf);
    const g10 = this.grad(this.perm[ba], xf - 1, yf);
    const g01 = this.grad(this.perm[ab], xf, yf - 1);
    const g11 = this.grad(this.perm[bb], xf - 1, yf - 1);

    const x1 = g00 + u * (g10 - g00);
    const x2 = g01 + u * (g11 - g01);

    return x1 + v * (x2 - x1);
  }

  /**
   * Fractal Brownian Motion (fBm) with octaves
   */
  public fbm(x: number, y: number, octaves = 3, lacunarity = 2.0, gain = 0.5): number {
    let sum = 0;
    let amp = 1.0;
    let freq = 1.0;
    let max = 0;

    for (let i = 0; i < octaves; i++) {
      sum += this.noise(x * freq, y * freq) * amp;
      max += amp;
      freq *= lacunarity;
      amp *= gain;
    }

    return sum / max;
  }
}

/**
 * Singleton Procedural Planetary Terrain System
 */
export class ProceduralTerrainSystem {
  private static instance: ProceduralTerrainSystem;
  private noiseGen: DeterministicNoise2D;
  private currentSeed = 42;

  // Cached vector for normal calculations to avoid GC allocations
  private tempNormal = new THREE.Vector3();

  private constructor(seed = 42) {
    this.currentSeed = seed;
    this.noiseGen = new DeterministicNoise2D(seed);
  }

  public static getInstance(): ProceduralTerrainSystem {
    if (!ProceduralTerrainSystem.instance) {
      ProceduralTerrainSystem.instance = new ProceduralTerrainSystem();
    }
    return ProceduralTerrainSystem.instance;
  }

  public setSeed(seed: number) {
    if (this.currentSeed !== seed) {
      this.currentSeed = seed;
      this.noiseGen.reseed(seed);
    }
  }

  public getSeed(): number {
    return this.currentSeed;
  }

  /**
   * Evaluates if a point is within the explorable subterranean cave system
   */
  public isPointInCave(x: number, z: number): boolean {
    // Cave 1: Entrance corridor connecting surface at [-35, -42] to [-35, -50]
    if (x >= -41 && x <= -29 && z >= -52 && z <= -38) {
      return true;
    }
    // Cave 2: Subterranean Antechamber at [-35, -50]
    const dAntechamber = Math.hypot(x - (-35), z - (-50));
    if (dAntechamber <= 9.0) {
      return true;
    }
    // Cave 3: Deep Geothermal Cavern Vault at [-30, -68]
    const dVault = Math.hypot(x - (-30), z - (-68));
    if (dVault <= 13.5) {
      return true;
    }
    // Connecting lava tube tunnel between chamber 1 and 2
    if (x >= -36 && x <= -26 && z >= -68 && z <= -50) {
      return true;
    }
    return false;
  }

  /**
   * Returns exact walkable subterranean floor elevation inside the cave
   */
  public getCaveFloorHeight(x: number, z: number): number {
    // Entrance ramp: descends from surface height down to -3.8m
    if (z >= -48) {
      const surfaceH = this.getSurfaceTerrainHeight(x, z);
      const t = THREE.MathUtils.clamp((z - (-40)) / (-8), 0, 1);
      return THREE.MathUtils.lerp(surfaceH, -3.8, t);
    }

    // Tunnel to deep vault: descends from -3.8m down to -5.2m
    if (z >= -60) {
      const t = (z - (-48)) / (-12);
      const bump = Math.sin(x * 0.4) * 0.25;
      return THREE.MathUtils.lerp(-3.8, -5.2, t) + bump;
    }

    // Deep Cavern Vault floor with natural rocky basalt unevenness
    const rVault = Math.hypot(x - (-30), z - (-68));
    const basinBowl = Math.sin((rVault / 13.5) * Math.PI) * -0.6;
    const microBasalt = Math.sin(x * 0.6) * Math.cos(z * 0.5) * 0.2;
    return -5.2 + basinBowl + microBasalt;
  }

  /**
   * Returns cave interior ceiling height (for collision & camera occlusion)
   */
  public getCaveCeilingHeight(x: number, z: number): number {
    const floor = this.getCaveFloorHeight(x, z);
    // Ceiling arches 3.8m to 5.5m above the cave floor
    const dCenter = Math.hypot(x - (-32), z - (-58));
    const archFactor = Math.max(0, 1.0 - (dCenter / 15.0));
    return floor + 3.8 + archFactor * 2.2;
  }

  /**
   * Analytical Surface Terrain Heightfield across all 8 Planetary Regions
   */
  public getSurfaceTerrainHeight(x: number, z: number): number {
    const r = Math.hypot(x, z);

    // 1. Base Station Apron & Core Landing Zone (Preserved 100% Flat)
    // r < 14m: Outpost Alpha geodesic domes, airlock, garage, and solar array
    if (r < 13.5) {
      return 0.0;
    }

    // Smooth transition buffer between Station Apron (r=13.5) and Jezero Alluvial Basin (r=26)
    const apronBlend = THREE.MathUtils.clamp((r - 13.5) / 12.5, 0.0, 1.0);

    // 2. Multi-Octave Dune Wave Harmonics (Matches original wave ripples for landmarks)
    const duneWave1 = Math.sin(x * 0.12) * Math.cos(z * 0.08) * 0.8;
    const duneWave2 = Math.sin(x * 0.04 + z * 0.05) * 1.5;
    const baseElevation = (duneWave1 + duneWave2) * apronBlend;

    // 3. Regional Modifiers based on Planetary Coordinates
    let regionalElevation = 0;

    // (A) Eastern Mawrth Canyon Pass (x > 45, |z| < 45)
    // Features sheer stepped cliff walls flanking a wide, flat navigable sandy wadi floor!
    if (x > 35) {
      const canyonProgress = THREE.MathUtils.clamp((x - 35) / 40, 0, 1);
      const distFromWadiCenter = Math.abs(z); // Wadi center is along z = 0

      if (distFromWadiCenter < 14) {
        // Navigable Sandy Canyon Wadi Floor: flat, gently sloping for rover passage
        const wadiFloor = Math.sin(x * 0.06) * 0.6 + 1.2;
        regionalElevation += wadiFloor * canyonProgress;
      } else {
        // Steep stepped canyon escarpment walls
        const wallFactor = THREE.MathUtils.clamp((distFromWadiCenter - 14) / 18, 0, 1);
        const steppedCliff = Math.floor(wallFactor * 3.5) * 2.4 + Math.sin(x * 0.15) * 0.8;
        regionalElevation += (1.8 + steppedCliff) * canyonProgress;
      }
    }

    // (B) North-East Crater Borealis Field (z > 35, x in [-30, 45])
    // Impact crater with raised ejecta rim and central depression at [0, 52]
    const dCraterBorealis = Math.hypot(x - 0, z - 52);
    if (dCraterBorealis < 28) {
      const rimRadius = 13.0;
      const rimWidth = 6.0;
      // Parabolic raised rim
      const rimFactor = Math.exp(-Math.pow(dCraterBorealis - rimRadius, 2) / (2 * rimWidth * rimWidth));
      // Central depression
      const bowlFactor = dCraterBorealis < rimRadius ? (1.0 - dCraterBorealis / rimRadius) * -1.2 : 0;
      regionalElevation += rimFactor * 2.6 + bowlFactor;
    }

    // Secondary smaller crater at [28, 85]
    const dSecCrater = Math.hypot(x - 28, z - 85);
    if (dSecCrater < 16) {
      const rim = Math.exp(-Math.pow(dSecCrater - 7.5, 2) / 12) * 1.8;
      const bowl = dSecCrater < 7.5 ? (1.0 - dSecCrater / 7.5) * -1.0 : 0;
      regionalElevation += rim + bowl;
    }

    // (C) South Noctis Valley / Rift Depression (|x| < 65, z > 65)
    if (z > 55 && Math.abs(x) < 70) {
      const valleyProgress = THREE.MathUtils.clamp((z - 55) / 45, 0, 1);
      const valleyTrough = -3.2 * valleyProgress * (1.0 - Math.pow(x / 70, 2));
      regionalElevation += valleyTrough;
    }

    // (D) West Jezero Delta Escarpment (x < -35, |z| < 60)
    // Tiered sedimentary mudstone shelves
    if (x < -30) {
      const deltaProgress = THREE.MathUtils.clamp((Math.abs(x) - 30) / 45, 0, 1);
      const strataBeds = Math.sin(x * 0.18 + z * 0.06) * 0.6 + (Math.abs(x) - 30) * 0.08;
      regionalElevation += Math.min(8.5, strataBeds * deltaProgress);
    }

    // (E) South-West Syrtis Volcanic Basalt Field & Cave Approach (x < -20, z < -30)
    if (x < -18 && z < -25) {
      const volcanicFactor = THREE.MathUtils.clamp((Math.hypot(x + 18, z + 25)) / 45, 0, 1);
      const basaltJoints = Math.sin(x * 0.22) * Math.sin(z * 0.22) * 0.9;
      // Provide smooth walkable surface leading directly into cave mouth at [-35, -42]
      const distToCaveMouth = Math.hypot(x - (-35), z - (-42));
      if (distToCaveMouth < 9.0) {
        regionalElevation += 1.4; // Stable terrace level at cave entrance
      } else {
        regionalElevation += (1.2 + basaltJoints) * volcanicFactor;
      }
    }

    // (F) North-West Elysium Barchan Dunes (x < -20, z < -40)
    if (x < -15 && z < -35) {
      const duneProgress = THREE.MathUtils.clamp((Math.abs(z) - 35) / 50, 0, 1);
      const barchanWave = Math.sin(x * 0.08 + z * 0.14) * 2.2 * duneProgress;
      regionalElevation += barchanWave;
    }

    // (G) North-East Ares Mountain Ridge (x > 50, z < -35)
    if (x > 45 && z < -30) {
      const ridgeProgress = THREE.MathUtils.clamp((Math.hypot(x - 45, z + 30)) / 50, 0, 1);
      const ridgeCrest = (x * 0.06 - z * 0.05) * 1.5 + Math.sin(x * 0.12 - z * 0.08) * 1.6;
      regionalElevation += ridgeCrest * ridgeProgress;
    }

    // (H) Deterministic Procedural Micro-Relief Noise
    const microNoise = this.noiseGen.fbm(x * 0.035, z * 0.035, 2) * 1.2 * apronBlend;

    // (I) Planetary Crater Rim Horizon Barrier (r > 145m)
    // Creates towering natural mountain silhouettes at world boundary that prevent falling off
    const perimeterBarrier = Math.max(0, Math.pow(Math.max(0, r - 145) * 0.45, 1.4));

    return baseElevation + regionalElevation + microNoise + perimeterBarrier;
  }

  /**
   * Main Public API: Resolves exact terrain elevation at any (x, z)
   */
  public getHeight(x: number, z: number, checkCave = true): number {
    if (checkCave && this.isPointInCave(x, z)) {
      return this.getCaveFloorHeight(x, z);
    }
    return this.getSurfaceTerrainHeight(x, z);
  }

  /**
   * Evaluates surface normal with 4-point central difference
   */
  public getNormal(x: number, z: number, target = this.tempNormal): THREE.Vector3 {
    const eps = 0.08;
    const hL = this.getHeight(x - eps, z, false);
    const hR = this.getHeight(x + eps, z, false);
    const hD = this.getHeight(x, z - eps, false);
    const hU = this.getHeight(x, z + eps, false);

    target.set((hL - hR) / (2 * eps), 1.0, (hD - hU) / (2 * eps)).normalize();
    return target;
  }

  /**
   * Discovers which planetary biome region contains the coordinate (x, z)
   */
  public getRegionAt(x: number, z: number): WorldRegionDefinition {
    for (const region of MARS_WORLD_REGIONS) {
      if (
        x >= region.bounds.minX &&
        x <= region.bounds.maxX &&
        z >= region.bounds.minZ &&
        z <= region.bounds.maxZ
      ) {
        return region;
      }
    }
    return MARS_WORLD_REGIONS[0]; // Default to Central Jezero Basin
  }
}

// Global exported helpers matching existing codebase signatures
export function getTerrainHeight(x: number, z: number): number {
  return ProceduralTerrainSystem.getInstance().getHeight(x, z, true);
}

export function getTerrainNormal(x: number, z: number, target?: THREE.Vector3): THREE.Vector3 {
  return ProceduralTerrainSystem.getInstance().getNormal(x, z, target);
}
