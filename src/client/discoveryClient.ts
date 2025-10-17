import { HttpClient, createHttpClient } from '../utils/http';
import {
  CasinoMetadata,
  CasinoMetadataSchema,
  RegistrationRequest,
  RegistrationRequestSchema,
  CasinoUpdateRequest,
  CasinoUpdateRequestSchema,
  CasinoFilters,
  CasinoFiltersSchema,
  ApiResponseSchema,
} from '../schema';
import { z } from 'zod';

/**
 * Configuration for FareDiscoveryClient
 */
export interface DiscoveryClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  apiKey?: string;
}

/**
 * FareDiscoveryClient
 * 
 * Client for interacting with the Discovery Service API.
 * Handles casino registration, updates, and queries.
 */
export class FareDiscoveryClient {
  private http: HttpClient;

  constructor(config: DiscoveryClientConfig) {
    const headers: Record<string, string> = {};
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    this.http = createHttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout,
      retries: config.retries,
      retryDelay: config.retryDelay,
      headers,
    });
  }

  /**
   * Register a new casino with the Discovery Service
   * 
   * @param request - Casino registration request
   * @returns The registered casino metadata
   */
  async registerCasino(
    request: RegistrationRequest
  ): Promise<CasinoMetadata> {
    // Validate the request
    const validatedRequest = RegistrationRequestSchema.parse(request);

    // Make the API call
    const response = await this.http.post(
      '/api/casinos/register',
      {
        body: validatedRequest,
        schema: ApiResponseSchema(CasinoMetadataSchema),
      }
    );

    if (!response.data) {
      throw new Error('No data returned from registration');
    }

    return response.data as CasinoMetadata;
  }

  /**
   * Update an existing casino
   * 
   * @param request - Casino update request (casinoId is included in the request body)
   * @returns The updated casino metadata
   */
  async updateCasino(
    request: CasinoUpdateRequest
  ): Promise<CasinoMetadata> {
    // Validate the request
    const validatedRequest = CasinoUpdateRequestSchema.parse(request);

    // Make the API call
    const response = await this.http.patch(
      `/api/casinos`,
      {
        body: validatedRequest,
        schema: ApiResponseSchema(CasinoMetadataSchema),
      }
    );

    if (!response.data) {
      throw new Error('No data returned from update');
    }

    return response.data as CasinoMetadata;
  }

  /**
   * Get a list of casinos with optional filters
   * 
   * @param filters - Optional filters for the query
   * @returns Array of casino metadata
   */
  async getCasinos(filters?: CasinoFilters): Promise<CasinoMetadata[]> {
    // Validate filters if provided
    const validatedFilters = filters
      ? CasinoFiltersSchema.parse(filters)
      : undefined;

    // Convert filters to query params
    const params: Record<string, string | number | boolean> = {};
    if (validatedFilters) {
      if (validatedFilters.status) params.status = validatedFilters.status;
      if (validatedFilters.games) params.games = validatedFilters.games.join(',');
      params.limit = validatedFilters.limit;
      params.offset = validatedFilters.offset;
    }

    // Make the API call
    const response = await this.http.get(
      '/api/casinos',
      {
        params: Object.keys(params).length > 0 ? params : undefined,
        schema: ApiResponseSchema(z.object({
          casinos: z.array(CasinoMetadataSchema),
          total: z.number(),
          limit: z.number(),
          offset: z.number(),
        })),
      }
    );

    return (response.data?.casinos ?? []) as CasinoMetadata[];
  }

  /**
   * Get a single casino by ID
   * 
   * @param id - Casino ID
   * @returns The casino metadata
   */
  async getCasino(id: string): Promise<CasinoMetadata> {
    const response = await this.http.get(
      `/api/casinos/${id}`,
      {
        schema: ApiResponseSchema(CasinoMetadataSchema),
      }
    );

    if (!response.data) {
      throw new Error(`Casino ${id} not found`);
    }

    return response.data as CasinoMetadata;
  }

  /**
   * Delete a casino
   * 
   * @param id - Casino ID
   */
  async deleteCasino(id: string): Promise<void> {
    await this.http.delete(`/api/casinos/${id}`);
  }

  /**
   * Get casino by public key
   * 
   * @param publicKey - Solana public key
   * @returns The casino metadata
   */
  async getCasinoByPublicKey(publicKey: string): Promise<CasinoMetadata> {
    const response = await this.http.get(
      `/api/casinos/by-key/${publicKey}`,
      {
        schema: ApiResponseSchema(CasinoMetadataSchema),
      }
    );

    if (!response.data) {
      throw new Error(`Casino with public key ${publicKey} not found`);
    }

    return response.data as CasinoMetadata;
  }

  /**
   * Check if a casino exists
   * 
   * @param id - Casino ID
   * @returns True if the casino exists
   */
  async casinoExists(id: string): Promise<boolean> {
    try {
      await this.getCasino(id);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get casino statistics
   * 
   * @returns Statistics about casinos in the network
   */
  async getStats(): Promise<{
    totalCasinos: number;
    onlineCasinos: number;
    heartbeatsLast24h: number;
  }> {
    const response = await this.http.get('/api/casinos/stats', {
      schema: ApiResponseSchema(
        z.object({
          totalCasinos: z.number(),
          onlineCasinos: z.number(),
          heartbeatsLast24h: z.number(),
        })
      ),
    });

    if (!response.data) {
      throw new Error('No stats data returned');
    }

    return response.data;
  }
}

