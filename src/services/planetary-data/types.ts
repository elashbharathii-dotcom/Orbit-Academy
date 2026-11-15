import * as THREE from 'three';
import { NasaTrekBody, NasaTrekLayer, NasaTrekNomenclature, NasaTrekBookmark } from '../nasa/types';

export interface PlanetaryTileCoordinate {
  zoom: number; // TileMatrix
  row: number;  // TileRow
  col: number;  // TileCol
}

export interface PlanetaryTextureProgress {
  stage: 'idle' | 'fetching-metadata' | 'downloading-tiles' | 'stitching-texture' | 'ready' | 'error';
  percent: number;
  tilesLoaded: number;
  totalTiles: number;
  message?: string;
}

export interface PlanetaryLayerState {
  body: NasaTrekBody;
  activeLayer: NasaTrekLayer | null;
  availableLayers: NasaTrekLayer[];
  texture: THREE.CanvasTexture | null;
  loadingProgress: PlanetaryTextureProgress;
  isUsingFallback: boolean;
  error: string | null;
}

export interface PlanetaryCoordinateInfo {
  lat: number;
  lon: number;
  vector: THREE.Vector3;
  elevationMeters?: number;
  landmark?: NasaTrekNomenclature | NasaTrekBookmark;
}
