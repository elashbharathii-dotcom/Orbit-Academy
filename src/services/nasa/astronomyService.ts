/**
 * ORBIT ACADEMY — NASA ASTRONOMY & MEDIA SERVICE
 * 
 * Specialized client module for:
 * - NASA APOD (Astronomy Picture of the Day)
 * - NASA NeoWs (Near-Earth Object Asteroid Tracking)
 * - NASA Image and Video Library
 * - NASA Exoplanet Archive
 */

import { nasaClient } from './nasaClient';
import {
  NasaApod,
  NasaNeoAsteroid,
  NasaMediaAsset,
  NasaExoplanet,
  NasaApiResponse,
} from './types';

export class NasaAstronomyService {
  async getApod(date?: string): Promise<NasaApiResponse<NasaApod>> {
    return nasaClient.getApod(date);
  }

  async getNeoWsFeed(startDate?: string, endDate?: string): Promise<NasaApiResponse<NasaNeoAsteroid[]>> {
    return nasaClient.getNeoWsFeed(startDate, endDate);
  }

  async searchMedia(query: string, mediaType = 'image'): Promise<NasaApiResponse<NasaMediaAsset[]>> {
    return nasaClient.searchMedia(query, mediaType);
  }

  async getExoplanets(limit = 40): Promise<NasaApiResponse<NasaExoplanet[]>> {
    return nasaClient.getExoplanets(limit);
  }
}

export const astronomyService = new NasaAstronomyService();
