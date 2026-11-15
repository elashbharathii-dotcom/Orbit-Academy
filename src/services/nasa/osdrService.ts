/**
 * ORBIT ACADEMY — NASA OSDR & SPACE BIOLOGY SERVICE
 * 
 * Specialized client module for:
 * - NASA Open Science Data Repository (OSDR)
 * - NASA GeneLab Spaceflight Multi-Omics
 * - NASA Ames Life Sciences Data Archive (ALSDA)
 * - ESA Spaceflight Biology Collaborations
 */

import { nasaClient } from './nasaClient';
import {
  NasaOsdrResearchStats,
  NasaOsdrStudyMetadata,
  NasaOsdrDatasetBrief,
  NasaOsdrAssayItem,
  NasaOsdrFileItem,
  NasaOsdrSearchResult,
  NasaApiResponse,
} from './types';

export class NasaOsdrService {
  /**
   * Retrieve high-level statistics across all NASA space biology repositories
   */
  async getResearchStats(): Promise<NasaApiResponse<NasaOsdrResearchStats>> {
    return nasaClient.getOsdrStats();
  }

  /**
   * Retrieve all registered OSDR datasets from Biological Data API v2
   */
  async getDatasets(): Promise<NasaApiResponse<{ datasets: NasaOsdrDatasetBrief[]; total: number; source: string }>> {
    return nasaClient.getOsdrDatasets();
  }

  /**
   * Retrieve full study metadata and experimental parameters
   */
  async getStudy(accessionId: string): Promise<NasaApiResponse<NasaOsdrStudyMetadata>> {
    return nasaClient.getOsdrStudy(accessionId);
  }

  /**
   * Retrieve assays and technology platforms for a study
   */
  async getAssays(accessionId: string): Promise<NasaApiResponse<{ accession: string; assays: NasaOsdrAssayItem[] }>> {
    return nasaClient.getOsdrAssays(accessionId);
  }

  /**
   * Retrieve downloadable raw and processed scientific files
   */
  async getFiles(accessionId: string): Promise<NasaApiResponse<{ accession: string; files: NasaOsdrFileItem[] }>> {
    return nasaClient.getOsdrFiles(accessionId);
  }

  /**
   * Search OSDR, GeneLab, ALSDA, and ESA studies
   */
  async search(params: {
    term?: string;
    type?: 'cgene' | 'alsda';
    size?: number;
    from?: number;
  }): Promise<NasaApiResponse<NasaOsdrSearchResult>> {
    return nasaClient.searchOsdr(params);
  }
}

export const osdrService = new NasaOsdrService();
