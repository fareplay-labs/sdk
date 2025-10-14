import { z } from 'zod';

/**
 * HTTP Client configuration
 */
export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

/**
 * HTTP Client error
 */
export class HttpClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

/**
 * Typed HTTP client wrapper around fetch
 */
export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.endsWith('/')
      ? config.baseUrl.slice(0, -1)
      : config.baseUrl;
    this.timeout = config.timeout ?? 30000;
    this.retries = config.retries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': '@fareplay/sdk',
      ...config.headers,
    };
  }

  /**
   * Execute a fetch request with timeout and retries
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt = 0
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on network errors or 5xx errors
      if (attempt < this.retries) {
        await this.sleep(this.retryDelay * (attempt + 1));
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      throw new HttpClientError(
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  /**
   * Sleep utility for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Build full URL from path
   */
  private buildUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  /**
   * Parse and validate response
   */
  private async parseResponse<T>(
    response: Response,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;
      let errorDetails: any;

      try {
        if (contentType?.includes('application/json')) {
          const errorBody = await response.json();
          errorMessage = errorBody.error?.message || errorBody.message || errorMessage;
          errorCode = errorBody.error?.code || errorBody.code;
          errorDetails = errorBody.error?.details || errorBody.details;
        } else {
          errorMessage = await response.text();
        }
      } catch {
        // Use default error message
      }

      throw new HttpClientError(
        errorMessage,
        response.status,
        errorCode,
        errorDetails
      );
    }

    if (!contentType?.includes('application/json')) {
      throw new HttpClientError('Expected JSON response');
    }

    const data = await response.json();

    // Validate with schema if provided
    if (schema) {
      const result = schema.safeParse(data);
      if (!result.success) {
        throw new HttpClientError(
          'Response validation failed',
          undefined,
          'VALIDATION_ERROR',
          result.error.format()
        );
      }
      return result.data;
    }

    return data as T;
  }

  /**
   * GET request
   */
  async get<T>(
    path: string,
    options?: {
      params?: Record<string, string | number | boolean>;
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
    }
  ): Promise<T> {
    const url = new URL(this.buildUrl(path));
    
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await this.fetchWithRetry(url.toString(), {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
    });

    return this.parseResponse(response, options?.schema);
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    options?: {
      body?: any;
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
    }
  ): Promise<T> {
    const response = await this.fetchWithRetry(this.buildUrl(path), {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    return this.parseResponse(response, options?.schema);
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    options?: {
      body?: any;
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
    }
  ): Promise<T> {
    const response = await this.fetchWithRetry(this.buildUrl(path), {
      method: 'PUT',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    return this.parseResponse(response, options?.schema);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    options?: {
      body?: any;
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
    }
  ): Promise<T> {
    const response = await this.fetchWithRetry(this.buildUrl(path), {
      method: 'PATCH',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    return this.parseResponse(response, options?.schema);
  }

  /**
   * DELETE request
   */
  async delete<T>(
    path: string,
    options?: {
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
    }
  ): Promise<T> {
    const response = await this.fetchWithRetry(this.buildUrl(path), {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
    });

    return this.parseResponse(response, options?.schema);
  }
}

/**
 * Create an HTTP client instance
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}

