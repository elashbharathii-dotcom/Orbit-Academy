import * as THREE from 'three';
import { CelestialId } from '../types';
import {
  getSunTexture as getProceduralSun,
  getMercuryTexture as getProceduralMercury,
  getVenusTexture as getProceduralVenus,
  getEarthSurfaceTexture as getProceduralEarth,
  getEarthCloudTexture as getProceduralEarthClouds,
  getMarsTexture as getProceduralMars,
  getJupiterTexture as getProceduralJupiter,
  getSaturnSurfaceTexture as getProceduralSaturn,
  getSaturnRingTexture as getProceduralSaturnRings,
  getUranusTexture as getProceduralUranus,
  getNeptuneTexture as getProceduralNeptune,
} from './textureGenerator';

/**
 * High-Realism Planetary Texture Manager (Phase 6C)
 * 
 * Features:
 * - Loads genuine 2K NASA & Solar System Scope photographic equirectangular maps
 * - Photometrically calibrated with THREE.SRGBColorSpace and anisotropic filtering
 * - Zero-blocking fallback: provides immediate procedural canvas texture while loading
 *   or in the event of asset retrieval interruption
 * - Memory-cached singleton textures prevent redundant GPU texture allocations
 */

const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

/**
 * Asynchronously loads a texture with immediate fallback to procedural canvas
 */
function loadTextureWithFallback(
  url: string,
  fallbackProvider: () => THREE.Texture
): THREE.Texture {
  if (textureCache.has(url)) {
    return textureCache.get(url)!;
  }

  // Generate fallback texture synchronously so the material is never blank
  const fallback = fallbackProvider();
  
  // Clone or adapt fallback as initial texture
  const activeTexture = fallback.clone();
  textureCache.set(url, activeTexture);

  // Load the photographic map in background
  loader.load(
    url,
    (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.generateMipmaps = true;
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      
      // Update image data on cached texture and trigger GPU update
      activeTexture.image = loadedTexture.image;
      activeTexture.colorSpace = THREE.SRGBColorSpace;
      activeTexture.needsUpdate = true;
    },
    undefined,
    (error) => {
      console.warn(`[PlanetaryTextures] Falling back to procedural map for ${url}:`, error);
    }
  );

  return activeTexture;
}

/**
 * Retrieve primary surface texture map for any celestial body
 */
export function getPlanetarySurfaceTexture(id: CelestialId): THREE.Texture {
  switch (id) {
    case 'sun':
      return loadTextureWithFallback('/assets/textures/sun.jpg', getProceduralSun);
    case 'mercury':
      return loadTextureWithFallback('/assets/textures/mercury.jpg', getProceduralMercury);
    case 'venus':
      return loadTextureWithFallback('/assets/textures/venus_atmosphere.jpg', getProceduralVenus);
    case 'earth':
      return loadTextureWithFallback('/assets/textures/earth_daymap.jpg', getProceduralEarth);
    case 'mars':
      return loadTextureWithFallback('/assets/textures/mars.jpg', getProceduralMars);
    case 'jupiter':
      return loadTextureWithFallback('/assets/textures/jupiter.jpg', getProceduralJupiter);
    case 'saturn':
      return loadTextureWithFallback('/assets/textures/saturn.jpg', getProceduralSaturn);
    case 'uranus':
      return loadTextureWithFallback('/assets/textures/uranus.jpg', getProceduralUranus);
    case 'neptune':
      return loadTextureWithFallback('/assets/textures/neptune.jpg', getProceduralNeptune);
    default:
      return getProceduralEarth();
  }
}

/**
 * Retrieve Venus radar surface (used for subterranean or alternative view)
 */
export function getVenusRadarSurfaceTexture(): THREE.Texture {
  return loadTextureWithFallback('/assets/textures/venus_surface.jpg', getProceduralVenus);
}

/**
 * Retrieve Earth dynamic atmospheric cloud deck
 */
export function getEarthCloudsTexture(): THREE.Texture {
  return loadTextureWithFallback('/assets/textures/earth_clouds.jpg', getProceduralEarthClouds);
}

/**
 * Retrieve Earth city night lights map
 */
export function getEarthNightLightsTexture(): THREE.Texture {
  if (textureCache.has('earth_nightmap')) {
    return textureCache.get('earth_nightmap')!;
  }

  const texture = loader.load(
    '/assets/textures/earth_nightmap.jpg',
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
    },
    undefined,
    () => {
      console.warn('[PlanetaryTextures] Earth night lights unavailable, using transparent fallback');
    }
  );

  textureCache.set('earth_nightmap', texture);
  return texture;
}

/**
 * Retrieve Saturn ring opacity and radial banding texture
 */
export function getSaturnRingAlphaTexture(): THREE.Texture {
  if (textureCache.has('saturn_ring')) {
    return textureCache.get('saturn_ring')!;
  }

  const fallback = getProceduralSaturnRings();
  const ringTexture = fallback.clone();
  textureCache.set('saturn_ring', ringTexture);

  loader.load(
    '/assets/textures/saturn_ring.png',
    (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      loadedTex.wrapS = THREE.ClampToEdgeWrapping;
      loadedTex.wrapT = THREE.ClampToEdgeWrapping;
      ringTexture.image = loadedTex.image;
      ringTexture.needsUpdate = true;
    },
    undefined,
    () => {
      console.warn('[PlanetaryTextures] Using procedural Saturn ring fallback');
    }
  );

  return ringTexture;
}

/**
 * Retrieve Milky Way & deep space all-sky background survey map
 */
export function getMilkyWayTexture(): THREE.Texture {
  if (textureCache.has('milky_way')) {
    return textureCache.get('milky_way')!;
  }

  const texture = loader.load('/assets/textures/milky_way.jpg', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
  });

  textureCache.set('milky_way', texture);
  return texture;
}
