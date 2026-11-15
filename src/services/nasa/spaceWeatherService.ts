/**
 * ORBIT ACADEMY — NASA DONKI & SPACE WEATHER SERVICE
 * 
 * Specialized client module for:
 * - NASA DONKI (Space Weather Database of Notifications, Knowledge, Information)
 * - Solar Flares, Coronal Mass Ejections (CMEs), Geomagnetic Storms, SEP Events
 */

import { nasaClient } from './nasaClient';
import {
  NasaSpaceWeatherSummary,
  NasaComprehensiveSpaceWeather,
  NasaSolarFlare,
  NasaCmeEvent,
  NasaGeomagneticStorm,
  NasaSpaceWeatherNotification,
  NasaApiResponse,
} from './types';

export class NasaSpaceWeatherService {
  async getSummary(): Promise<NasaApiResponse<NasaSpaceWeatherSummary>> {
    return nasaClient.getSpaceWeather();
  }

  async getComprehensive(): Promise<NasaApiResponse<NasaComprehensiveSpaceWeather>> {
    return nasaClient.getComprehensiveSpaceWeather();
  }

  async getSolarFlares(startDate?: string, endDate?: string): Promise<NasaApiResponse<NasaSolarFlare[]>> {
    return nasaClient.getDonkiFlares(startDate, endDate);
  }

  async getCmes(startDate?: string, endDate?: string): Promise<NasaApiResponse<NasaCmeEvent[]>> {
    return nasaClient.getDonkiCmes(startDate, endDate);
  }

  async getGeomagneticStorms(startDate?: string, endDate?: string): Promise<NasaApiResponse<NasaGeomagneticStorm[]>> {
    return nasaClient.getDonkiGeomagneticStorms(startDate, endDate);
  }

  async getNotifications(): Promise<NasaApiResponse<NasaSpaceWeatherNotification[]>> {
    return nasaClient.getDonkiNotifications();
  }
}

export const spaceWeatherService = new NasaSpaceWeatherService();
