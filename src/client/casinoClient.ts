import { HttpClient, createHttpClient } from '../utils/http';
import {
  HeartbeatPayload,
  HeartbeatPayloadSchema,
  HeartbeatResponse,
  HeartbeatResponseSchema,
  CasinoStatus,
  CasinoStatusSchema,
  ApiResponseSchema,
} from '../schema';
import { createSignedPayload } from '../crypto';

/**
 * Configuration for FareCasinoClient
 */
export interface CasinoClientConfig {
  baseUrl: string;
  casinoId: string;
  privateKey: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * FareCasinoClient
 * 
 * Client for casino-side operations.
 * Handles heartbeats and status updates with the Discovery Service.
 */
export class FareCasinoClient {
  private http: HttpClient;
  private casinoId: string;
  private privateKey: string;

  constructor(config: CasinoClientConfig) {
    this.http = createHttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout,
      retries: config.retries,
      retryDelay: config.retryDelay,
    });

    this.casinoId = config.casinoId;
    this.privateKey = config.privateKey;
  }

  /**
   * Send a heartbeat to the Discovery Service
   * 
   * @param payload - Heartbeat payload (casinoId and signature will be added automatically)
   * @returns Heartbeat response
   */
  async sendHeartbeat(
    payload: Omit<HeartbeatPayload, 'casinoId' | 'signature'>
  ): Promise<HeartbeatResponse> {
    // Add casinoId to payload
    const fullPayload = {
      ...payload,
      casinoId: this.casinoId,
    };

    // Sign the payload
    const signedPayload = createSignedPayload(fullPayload, this.privateKey);

    // Validate the payload
    const validatedPayload = HeartbeatPayloadSchema.parse(signedPayload);

    // Make the API call
    const response = await this.http.post(
      '/v1/casinos/heartbeat',
      {
        body: validatedPayload,
        schema: ApiResponseSchema(HeartbeatResponseSchema),
      }
    );

    if (!response.data) {
      throw new Error('No heartbeat response data returned');
    }

    return response.data;
  }

  /**
   * Update casino status
   * 
   * @param status - New casino status
   * @returns Heartbeat response
   */
  async updateStatus(status: CasinoStatus): Promise<HeartbeatResponse> {
    // Validate status
    CasinoStatusSchema.parse(status);

    // Send heartbeat with new status
    return this.sendHeartbeat({
      status,
      timestamp: Date.now(),
    });
  }

  /**
   * Send heartbeat with metrics
   * 
   * @param status - Casino status
   * @param metrics - Optional metrics
   * @returns Heartbeat response
   */
  async sendHeartbeatWithMetrics(
    status: CasinoStatus,
    metrics?: {
      activePlayers?: number;
      totalBets24h?: number;
      uptime?: number;
      responseTime?: number;
    }
  ): Promise<HeartbeatResponse> {
    return this.sendHeartbeat({
      status,
      timestamp: Date.now(),
      metrics,
    });
  }

  /**
   * Mark casino as online
   */
  async goOnline(): Promise<HeartbeatResponse> {
    return this.updateStatus('online');
  }

  /**
   * Mark casino as offline
   */
  async goOffline(): Promise<HeartbeatResponse> {
    return this.updateStatus('offline');
  }

  /**
   * Mark casino as in maintenance
   */
  async goMaintenance(): Promise<HeartbeatResponse> {
    return this.updateStatus('maintenance');
  }

  /**
   * Start automatic heartbeat interval
   * 
   * @param intervalMs - Interval in milliseconds (default: 60000 - 1 minute)
   * @param status - Initial status (default: 'online')
   * @returns Function to stop the heartbeat interval
   */
  startHeartbeat(
    intervalMs: number = 60000,
    status: CasinoStatus = 'online'
  ): () => void {
    const intervalId = setInterval(async () => {
      try {
        await this.sendHeartbeat({
          status,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, intervalMs);

    // Return a function to stop the interval
    return () => {
      clearInterval(intervalId);
    };
  }
}

