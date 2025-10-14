/**
 * @fareplay/sdk
 * 
 * Official FarePlay SDK for the Fare Protocol ecosystem
 * 
 * @version 1.0.0
 * @license MIT
 */

// Client exports
export {
  FareDiscoveryClient,
  type DiscoveryClientConfig,
} from './client/discoveryClient';

export {
  FareCasinoClient,
  type CasinoClientConfig,
} from './client/casinoClient';

// Schema exports
export {
  // Casino schemas
  CasinoStatusSchema,
  type CasinoStatus,
  GameTypeSchema,
  type GameType,
  CasinoMetadataSchema,
  type CasinoMetadata,
  RegistrationRequestSchema,
  type RegistrationRequest,
  CasinoUpdateRequestSchema,
  type CasinoUpdateRequest,
  CasinoFiltersSchema,
  type CasinoFilters,
  
  // Heartbeat schemas
  HeartbeatPayloadSchema,
  type HeartbeatPayload,
  HeartbeatResponseSchema,
  type HeartbeatResponse,
  
  // Protocol schemas
  FARE_PROTOCOL_VERSION,
  FARE_PROTOCOL_SPEC,
  ApiResponseSchema,
  type ApiResponse,
  ErrorCodes,
  type ErrorCode,
  SdkConfigSchema,
  type SdkConfig,
} from './schema';

// Crypto exports
export {
  signMessage,
  createSignedPayload,
  getKeypairFromPrivateKey,
  generateKeypair,
} from './crypto/sign';

export {
  verifySolanaSignature,
  verifySignedPayload,
  isValidPublicKey,
  isValidSignature,
} from './crypto/verify';

// Utility exports
export {
  HttpClient,
  createHttpClient,
  HttpClientError,
  type HttpClientConfig,
} from './utils/http';

// Version export
export const SDK_VERSION = '1.0.0';

