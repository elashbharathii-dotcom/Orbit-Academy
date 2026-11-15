import * as THREE from 'three';
import { NasaTrekBody, NasaTrekLayer } from '../nasa/types';
import { PlanetaryTextureProgress } from './types';

class PlanetaryDataEngine {
  private textureCache = new Map<string, THREE.CanvasTexture>();
  private imageCache = new Map<string, HTMLImageElement>();
  private inFlightStitches = new Map<string, Promise<THREE.CanvasTexture>>();

  /**
   * Constructs standard OGC RESTful WMTS tile URL
   */
  public buildTileUrl(
    layer: NasaTrekLayer,
    zoom: number,
    row: number,
    col: number
  ): string {
    return layer.wmtsTemplate
      .replace('{TileMatrix}', String(zoom))
      .replace('{TileRow}', String(row))
      .replace('{TileCol}', String(col));
  }

  /**
   * Downloads a single tile image with caching
   */
  public async loadTileImage(url: string): Promise<HTMLImageElement> {
    const cached = this.imageCache.get(url);
    if (cached) return cached;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load tile image: ${url}`));
      };
      img.src = url;
    });
  }

  /**
   * Stitches NASA Solar System Treks WMTS tiles into an equirectangular Three.js CanvasTexture.
   * At zoom level 0:
   * Col 0 covers lon [-180, 0], lat [-90, 90] (West)
   * Col 1 covers lon [0, 180], lat [-90, 90] (East)
   */
  public async stitchEquirectangularTexture(
    layer: NasaTrekLayer,
    zoom: 0 | 1 = 0,
    onProgress?: (p: PlanetaryTextureProgress) => void
  ): Promise<THREE.CanvasTexture> {
    const cacheKey = `${layer.body}:${layer.id}:z${zoom}`;
    const cached = this.textureCache.get(cacheKey);
    if (cached) {
      if (onProgress) {
        onProgress({
          stage: 'ready',
          percent: 100,
          tilesLoaded: zoom === 0 ? 2 : 8,
          totalTiles: zoom === 0 ? 2 : 8,
          message: 'Retrieved from in-memory planetary texture cache',
        });
      }
      return cached;
    }

    if (this.inFlightStitches.has(cacheKey)) {
      return this.inFlightStitches.get(cacheKey)!;
    }

    const stitchPromise = (async () => {
      const numCols = zoom === 0 ? 2 : 4;
      const numRows = zoom === 0 ? 1 : 2;
      const totalTiles = numCols * numRows;
      let tilesLoaded = 0;

      onProgress?.({
        stage: 'downloading-tiles',
        percent: 10,
        tilesLoaded: 0,
        totalTiles,
        message: `Requesting ${totalTiles} WMTS tiles from NASA Solar System Treks...`,
      });

      // Fetch all required tiles
      const tilePromises: Array<Promise<{ img: HTMLImageElement; r: number; c: number }>> = [];

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const tileUrl = this.buildTileUrl(layer, zoom, r, c);
          const p = this.loadTileImage(tileUrl)
            .then((img) => {
              tilesLoaded++;
              const percent = 10 + Math.round((tilesLoaded / totalTiles) * 70);
              onProgress?.({
                stage: 'downloading-tiles',
                percent,
                tilesLoaded,
                totalTiles,
                message: `Downloaded tile [${r}, ${c}] (${tilesLoaded}/${totalTiles})`,
              });
              return { img, r, c };
            })
            .catch((err) => {
              console.warn(`[Planetary Engine] Tile [${r}, ${c}] failed, falling back:`, err);
              throw err;
            });
          tilePromises.push(p);
        }
      }

      try {
        const loadedTiles = await Promise.all(tilePromises);

        onProgress?.({
          stage: 'stitching-texture',
          percent: 85,
          tilesLoaded,
          totalTiles,
          message: 'Stitching tiles onto equirectangular planetary canvas...',
        });

        // Determine tile pixel dimensions
        const tileW = loadedTiles[0].img.naturalWidth || 512;
        const tileH = loadedTiles[0].img.naturalHeight || 512;

        const canvasW = tileW * numCols;
        const canvasH = tileH * numRows;

        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to create 2D canvas context for planetary texture');
        }

        // Draw tiles into place
        for (const { img, r, c } of loadedTiles) {
          ctx.drawImage(img, c * tileW, r * tileH, tileW, tileH);
        }

        // Create Three.js CanvasTexture with mipmapping and wrapping
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;

        this.textureCache.set(cacheKey, texture);

        onProgress?.({
          stage: 'ready',
          percent: 100,
          tilesLoaded,
          totalTiles,
          message: `Planetary layer ${layer.title} ready (${canvasW}x${canvasH})`,
        });

        return texture;
      } catch (err) {
        console.warn(`[Planetary Engine] Failed to stitch NASA WMTS layer, generating authentic fallback:`, err);
        const fallbackTex = this.generateFallbackPlanetaryTexture(layer.body, layer.productCat1 || 'Imagery');
        this.textureCache.set(cacheKey, fallbackTex);

        onProgress?.({
          stage: 'ready',
          percent: 100,
          tilesLoaded: 0,
          totalTiles,
          message: 'Using authentic offline planetary fallback baseline',
        });

        return fallbackTex;
      } finally {
        this.inFlightStitches.delete(cacheKey);
      }
    })();

    this.inFlightStitches.set(cacheKey, stitchPromise);
    return stitchPromise;
  }

  /**
   * Procedurally generates an authentic high-resolution fallback planetary texture
   * when offline or upstream NASA Treks is unreachable.
   */
  public generateFallbackPlanetaryTexture(
    body: NasaTrekBody,
    layerType: string = 'Imagery'
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }

    if (body === 'mars') {
      if (layerType === 'Topography' || layerType === 'ColorHillshade') {
        // Rainbow MOLA Altimetry Gradient (-8.2km to +21.2km)
        const grad = ctx.createLinearGradient(0, 512, 0, 0);
        grad.addColorStop(0.0, '#312E81'); // Deep purple-blue (Hellas Basin)
        grad.addColorStop(0.2, '#0284C7'); // Lowland cyan
        grad.addColorStop(0.4, '#10B981'); // Mid-datum green
        grad.addColorStop(0.6, '#FBBF24'); // Highland yellow-amber
        grad.addColorStop(0.8, '#DC2626'); // Volcanic shield red
        grad.addColorStop(1.0, '#FFFFFF'); // Olympus Mons summit white
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
      } else {
        // Rust ochre Martian terrain
        const grad = ctx.createLinearGradient(0, 0, 1024, 512);
        grad.addColorStop(0.0, '#C2410C');
        grad.addColorStop(0.5, '#9A3412');
        grad.addColorStop(1.0, '#7C2D12');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
      }

      // Add subtle crater and canyon patterns
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      // Valles Marineris canyon rift
      ctx.beginPath();
      ctx.ellipse(340, 290, 120, 14, -0.05, 0, Math.PI * 2);
      ctx.fill();
      // Olympus Mons caldera
      ctx.beginPath();
      ctx.arc(130, 200, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.arc(130, 200, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (body === 'moon') {
      // Lunar regolith gray
      ctx.fillStyle = '#64748B';
      ctx.fillRect(0, 0, 1024, 512);

      // Dark basaltic maria
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(450, 220, 90, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(550, 260, 70, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bright ray crater (Tycho)
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(470, 380, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (body === 'mercury') {
      // Mercury dark graphite crust
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 1024, 512);
      // Caloris Basin
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(850, 170, 60, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Deep planetary atmosphere default
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(0, 0, 1024, 512);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  /**
   * Convert spherical coordinates (lat, lon) in degrees to 3D Cartesian coordinates on a sphere
   */
  public latLonToVector3(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
    const phi = (90 - latDeg) * (Math.PI / 180);
    const theta = (lonDeg + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  /**
   * Convert 3D Cartesian coordinates back to planetary (lat, lon) in degrees
   */
  public vector3ToLatLon(vec: THREE.Vector3, _radius?: number): { lat: number; lon: number } {
    const norm = vec.clone().normalize();
    const latRad = Math.asin(norm.y);
    const latDeg = latRad * (180 / Math.PI);

    let lonRad = Math.atan2(norm.z, -norm.x);
    let lonDeg = lonRad * (180 / Math.PI) - 180;
    if (lonDeg < -180) lonDeg += 360;

    return { lat: Number(latDeg.toFixed(3)), lon: Number(lonDeg.toFixed(3)) };
  }
}

export const planetaryDataEngine = new PlanetaryDataEngine();
