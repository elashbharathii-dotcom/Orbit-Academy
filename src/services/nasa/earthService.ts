/**
 * ORBIT ACADEMY — NASA EARTH OBSERVATION & CLIMATE SERVICE
 * 
 * Specialized client module for:
 * - NASA GIBS Satellite Layers & WMS Imagery
 * - NASA POWER Solar Irradiance & Meteorology Fluxes
 * - NASA EONET Active Natural Event Tracker
 * - NASA EPIC DSCOVR Full-Disc Earth Imagery
 */

import { nasaClient } from './nasaClient';
import {
  NasaGibsLayer,
  NasaPowerPointData,
  NasaEonetEvent,
  NasaEpicImage,
  NasaApiResponse,
} from './types';

export class NasaEarthService {
  async getGibsLayers(): Promise<NasaApiResponse<{ layers: NasaGibsLayer[] }>> {
    return nasaClient.getGibsLayers();
  }

  getGibsWmsUrl(layerId: string, date: string, bbox = '-90,-180,90,180', width = 2048, height = 1024): string {
    return nasaClient.getGibsWmsUrl(layerId, date, bbox, width, height);
  }

  async getPowerData(lat = 0, lon = 0): Promise<NasaApiResponse<NasaPowerPointData>> {
    return nasaClient.getNasaPower(lat, lon);
  }

  async getEonetEvents(category?: string): Promise<NasaApiResponse<NasaEonetEvent[]>> {
    return nasaClient.getEonetEvents(category);
  }

  async getEpicImages(): Promise<NasaApiResponse<NasaEpicImage[]>> {
    return nasaClient.getEpicImages();
  }
}

export const earthService = new NasaEarthService();
