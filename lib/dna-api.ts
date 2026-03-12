/**
 * DNA Racing API Client
 * Handles all API calls to the DNA Racing backend
 */

const API_BASE_URL = 'https://api.dnaracing.run/fbike';

export interface ApiResponse<T> {
  status: string;
  result: T;
}

export interface Core {
  hid: number;
  name: string;
  element: string;
  type: string;
  gender: string;
  [key: string]: any;
}

export interface PowerStats {
  hid: number;
  power: {
    bike?: { power?: { fill?: { per?: number } } };
    car?: { power?: { fill?: { per?: number } } };
    horse?: { power?: { fill?: { per?: number } } };
  };
}

export interface RacingStats {
  hid: number;
  hstats_bike?: any;
  hstats_car?: any;
  hstats_horse?: any;
}

/**
 * Generic API fetch with timeout and retry logic
 */
async function fetchAPI<T>(
  endpoint: string,
  data: Record<string, any>,
  timeout: number = 30000,
  retries: number = 3
): Promise<T | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (result.status === 'success') {
        return result.result;
      }

      return null;
    } catch (error) {
      if (attempt === retries - 1) {
        console.error(`API Error after ${retries} attempts:`, error);
        return null;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return null;
}

/**
 * Fetch vault cores
 */
export async function fetchVaultCores(vault: string): Promise<Core[] | null> {
  return fetchAPI<Core[]>('/vault/bikes_inf', { vault });
}

/**
 * Fetch core mini info (bulk)
 */
export async function fetchCoresMini(hids: number[]): Promise<Core[] | null> {
  return fetchAPI<Core[]>('/cores/mini_bulk', { hids }, 60000);
}

/**
 * Fetch core power stats (bulk)
 */
export async function fetchCoresPower(hids: number[]): Promise<PowerStats[] | null> {
  return fetchAPI<PowerStats[]>('/cores/power_bulk', { hids }, 60000);
}

/**
 * Fetch racing stats (bulk)
 */
export async function fetchRacingStats(hids: number[]): Promise<RacingStats[] | null> {
  return fetchAPI<RacingStats[]>('/racing_stats_bulk', { hids }, 120000);
}

/**
 * Fetch race history for a core
 */
export async function fetchRaceHistory(
  hid: number,
  mode: 'bike' | 'car' | 'horse' = 'bike',
  limit: number = 500
): Promise<any[] | null> {
  return fetchAPI<any[]>('/i/hraces', { hid, rvmode: mode, limit }, 60000);
}

/**
 * Fetch breeding/splicing info (bulk)
 */
export async function fetchBreedingInfo(hids: number[]): Promise<any[] | null> {
  return fetchAPI<any[]>('/splicing_info_bulk', { hids }, 120000);
}

/**
 * Batch fetcher - splits large arrays into smaller chunks
 */
export async function batchFetch<T>(
  fetcher: (hids: number[]) => Promise<T[] | null>,
  hids: number[],
  batchSize: number = 100
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < hids.length; i += batchSize) {
    const batch = hids.slice(i, i + batchSize);
    const batchResults = await fetcher(batch);
    
    if (batchResults) {
      results.push(...batchResults);
    }
    
    // Small delay to avoid rate limiting
    if (i + batchSize < hids.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}
