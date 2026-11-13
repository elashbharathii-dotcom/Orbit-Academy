import { useState, useEffect } from 'react';
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
 * Astronomical Planetary Texture Manager (Phase 6C Visual Correction)
 * 
 * Features:
 * - Reactive texture loading with automatic React state re-rendering
 * - Binds genuine 2K NASA & USGS equirectangular maps directly to GPU materials
 * - Sets THREE.SRGBColorSpace, proper wrapping, and anisotropic filtering
 * - Instantaneous procedural canvas fallback ensures zero blank frames
 * - Memory-cached singletons prevent duplicate network requests or VRAM allocations
 */

const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

const PLANET_TEXTURE_URLS: Record<CelestialId, string> = {
  sun: '/assets/textures/sun.jpg',
  mercury: '/assets/textures/mercury.jpg',
  venus: '/assets/textures/venus_atmosphere.jpg',
  earth: '/assets/textures/earth_daymap.jpg',
  mars: '/assets/textures/mars.jpg',
  jupiter: '/assets/textures/jupiter.jpg',
  saturn: '/assets/textures/saturn.jpg',
  uranus: '/assets/textures/uranus.jpg',
  neptune: '/assets/textures/neptune.jpg',
};

const PROCEDURAL_FALLBACKS: Record<CelestialId, () => THREE.Texture> = {
  sun: getProceduralSun,
  mercury: getProceduralMercury,
  venus: getProceduralVenus,
  earth: getProceduralEarth,
  mars: getProceduralMars,
  jupiter: getProceduralJupiter,
  saturn: getProceduralSaturn,
  uranus: getProceduralUranus,
  neptune: getProceduralNeptune,
};

/**
 * Configure texture parameters for photometrically accurate astronomical rendering
 */
function configureTexture(tex: THREE.Texture): THREE.Texture {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * React Hook that synchronously returns a fallback texture and reactively swaps in
 * the real 2K photographic map as soon as it is decoded by the browser.
 */
export function usePlanetaryTexture(id: CelestialId): THREE.Texture {
  const url = PLANET_TEXTURE_URLS[id];
  const fallbackProvider = PROCEDURAL_FALLBACKS[id];

  const [texture, setTexture] = useState<THREE.Texture>(() => {
    if (textureCache.has(url)) {
      return textureCache.get(url)!;
    }
    return fallbackProvider();
  });

  useEffect(() => {
    if (textureCache.has(url)) {
      setTexture(textureCache.get(url)!);
      return;
    }

    let isMounted = true;

    loader.load(
      url,
      (loadedTexture) => {
        if (!isMounted) return;
        const configured = configureTexture(loadedTexture);
        textureCache.set(url, configured);
        setTexture(configured);
        console.log(`[PlanetaryTextures] Loaded real photographic map: ${id} (${url})`);
      },
      undefined,
      (err) => {
        console.warn(`[PlanetaryTextures] Failed to load ${url}, keeping procedural fallback:`, err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [id, url]);

  return texture;
}

/**
 * React Hook for Earth Clouds Texture
 */
export function useEarthCloudsTexture(): THREE.Texture {
  const url = '/assets/textures/earth_clouds.jpg';
  const [texture, setTexture] = useState<THREE.Texture>(() => {
    if (textureCache.has(url)) return textureCache.get(url)!;
    return getProceduralEarthClouds();
  });

  useEffect(() => {
    if (textureCache.has(url)) {
      setTexture(textureCache.get(url)!);
      return;
    }

    let isMounted = true;
    loader.load(url, (loaded) => {
      if (!isMounted) return;
      const configured = configureTexture(loaded);
      textureCache.set(url, configured);
      setTexture(configured);
    });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

/**
 * React Hook for Earth Night Lights Texture
 */
export function useEarthNightLightsTexture(): THREE.Texture | null {
  const url = '/assets/textures/earth_nightmap.jpg';
  const [texture, setTexture] = useState<THREE.Texture | null>(() => {
    return textureCache.get(url) || null;
  });

  useEffect(() => {
    if (textureCache.has(url)) {
      setTexture(textureCache.get(url)!);
      return;
    }

    let isMounted = true;
    loader.load(url, (loaded) => {
      if (!isMounted) return;
      const configured = configureTexture(loaded);
      textureCache.set(url, configured);
      setTexture(configured);
    });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

/**
 * React Hook for Saturn Ring Radial Texture
 */
export function useSaturnRingTexture(): THREE.Texture {
  const url = '/assets/textures/saturn_ring.png';
  const [texture, setTexture] = useState<THREE.Texture>(() => {
    if (textureCache.has(url)) return textureCache.get(url)!;
    return getProceduralSaturnRings();
  });

  useEffect(() => {
    if (textureCache.has(url)) {
      setTexture(textureCache.get(url)!);
      return;
    }

    let isMounted = true;
    loader.load(url, (loaded) => {
      if (!isMounted) return;
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.wrapS = THREE.ClampToEdgeWrapping;
      loaded.wrapT = THREE.ClampToEdgeWrapping;
      loaded.generateMipmaps = true;
      loaded.minFilter = THREE.LinearMipmapLinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      loaded.needsUpdate = true;
      textureCache.set(url, loaded);
      setTexture(loaded);
    });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
}

/**
 * Synchronous accessor for Milky Way background map
 */
export function getMilkyWayTexture(): THREE.Texture {
  const url = '/assets/textures/milky_way.jpg';
  if (textureCache.has(url)) return textureCache.get(url)!;

  const texture = loader.load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
  });

  textureCache.set(url, texture);
  return texture;
}
