/**
 * Constants used across the SDK
 */

/**
 * Default Discovery Service URL
 */
export const DEFAULT_DISCOVERY_URL = 'https://discovery.fareplay.io';

/**
 * Default heartbeat interval (in milliseconds)
 */
export const DEFAULT_HEARTBEAT_INTERVAL = 60000; // 1 minute

/**
 * Default HTTP timeout (in milliseconds)
 */
export const DEFAULT_HTTP_TIMEOUT = 30000; // 30 seconds

/**
 * Default retry configuration
 */
export const DEFAULT_RETRIES = 3;
export const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * API version
 */
export const API_VERSION = 'v1';

/**
 * Rate limit headers
 */
export const RATE_LIMIT_HEADERS = {
  LIMIT: 'X-RateLimit-Limit',
  REMAINING: 'X-RateLimit-Remaining',
  RESET: 'X-RateLimit-Reset',
} as const;

