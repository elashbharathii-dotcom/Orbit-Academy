/**
 * ORBIT ACADEMY — NASA SOLAR SYSTEM TREKS SERVICE
 * 
 * Specialized client module for:
 * - NASA Solar System Treks WMTS Cartography
 * - Planetary bodies (Mars, Moon, Mercury, Titan, Ceres, Vesta)
 * - IAU Nomenclature features (craters, montes, valles)
 * - Spacecraft and rover landing sites
 */

import { nasaClient } from './nasaClient';
import {
  NasaTrekBody,
  NasaTrekBodyCatalog,
  NasaTrekLayersResult,
  NasaTrekNomenclatureResult,
  NasaTrekBookmarksResult,
  NasaApiResponse,
} from './types';

export class NasaTrekService {
  async getCatalog(): Promise<NasaApiResponse<NasaTrekBodyCatalog[]>> {
    return nasaClient.getTrekCatalog();
  }

  async getLayers(body: NasaTrekBody = 'mars', start = 0, rows = 50): Promise<NasaApiResponse<NasaTrekLayersResult>> {
    return nasaClient.getTrekLayers(body, start, rows);
  }

  async getNomenclature(body: NasaTrekBody = 'mars', category?: string, limit = 30): Promise<NasaApiResponse<NasaTrekNomenclatureResult>> {
    return nasaClient.getTrekNomenclature(body, category, limit);
  }

  async getBookmarks(body: NasaTrekBody = 'mars'): Promise<NasaApiResponse<NasaTrekBookmarksResult>> {
    return nasaClient.getTrekBookmarks(body);
  }
}

export const trekService = new NasaTrekService();
