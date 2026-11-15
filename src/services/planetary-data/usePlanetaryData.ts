import { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import {
  NasaTrekBody,
  NasaTrekLayer,
  NasaTrekNomenclature,
  NasaTrekBookmark,
} from '../nasa/types';
import { nasaClient } from '../nasa/nasaClient';
import { planetaryDataEngine } from './planetaryDataEngine';
import { PlanetaryTextureProgress } from './types';

export interface UsePlanetaryDataOptions {
  initialBody?: NasaTrekBody;
  initialLayerId?: string;
  autoLoadTexture?: boolean;
}

export function usePlanetaryData({
  initialBody = 'mars',
  initialLayerId,
  autoLoadTexture = true,
}: UsePlanetaryDataOptions = {}) {
  const [body, setBody] = useState<NasaTrekBody>(initialBody);
  const [layers, setLayers] = useState<NasaTrekLayer[]>([]);
  const [activeLayer, setActiveLayer] = useState<NasaTrekLayer | null>(null);
  const [nomenclature, setNomenclature] = useState<NasaTrekNomenclature[]>([]);
  const [bookmarks, setBookmarks] = useState<NasaTrekBookmark[]>([]);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(true);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [progress, setProgress] = useState<PlanetaryTextureProgress>({
    stage: 'idle',
    percent: 0,
    tilesLoaded: 0,
    totalTiles: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef<boolean>(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 1. Fetch metadata (layers, nomenclature, bookmarks) when body changes
  useEffect(() => {
    let cancelled = false;
    setIsLoadingMetadata(true);
    setError(null);

    async function loadMetadata() {
      try {
        const [layersRes, nomRes, bookRes] = await Promise.all([
          nasaClient.getTrekLayers(body),
          nasaClient.getTrekNomenclature(body, undefined, 30),
          nasaClient.getTrekBookmarks(body),
        ]);

        if (cancelled) return;

        const fetchedLayers = layersRes.data?.layers || [];
        setLayers(fetchedLayers);
        setNomenclature(nomRes.data?.features || []);
        setBookmarks(bookRes.data?.bookmarks || []);
        setIsUsingFallback(layersRes.fallback || nomRes.fallback);

        // Pick initial or default layer
        const targetLayer =
          (initialLayerId && fetchedLayers.find((l) => l.id === initialLayerId)) ||
          fetchedLayers[0] ||
          null;

        setActiveLayer(targetLayer);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMetadata(false);
        }
      }
    }

    loadMetadata();

    return () => {
      cancelled = true;
    };
  }, [body, initialLayerId]);

  // 2. Stitch and load 3D texture when activeLayer changes
  const loadTextureForLayer = useCallback(
    async (layer: NasaTrekLayer) => {
      if (!autoLoadTexture) return;
      setError(null);

      try {
        const tex = await planetaryDataEngine.stitchEquirectangularTexture(
          layer,
          0,
          (p) => {
            if (isMounted.current) {
              setProgress(p);
            }
          }
        );

        if (isMounted.current) {
          setTexture(tex);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    },
    [autoLoadTexture]
  );

  useEffect(() => {
    if (activeLayer) {
      loadTextureForLayer(activeLayer);
    }
  }, [activeLayer, loadTextureForLayer]);

  // Public methods
  const selectLayerById = useCallback(
    (layerId: string) => {
      const match = layers.find((l) => l.id === layerId);
      if (match) {
        setActiveLayer(match);
      }
    },
    [layers]
  );

  const selectBody = useCallback((newBody: NasaTrekBody) => {
    setBody(newBody);
    setTexture(null);
  }, []);

  return {
    body,
    selectBody,
    layers,
    activeLayer,
    selectLayerById,
    nomenclature,
    bookmarks,
    texture,
    isLoadingMetadata,
    progress,
    isUsingFallback,
    error,
    reloadTexture: () => activeLayer && loadTextureForLayer(activeLayer),
  };
}
