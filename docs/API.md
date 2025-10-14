# API Reference

Complete API documentation for @fareplay/sdk

## Table of Contents

- [Clients](#clients)
  - [FareDiscoveryClient](#farediscoveryclient)
  - [FareCasinoClient](#farecasinoclient)
- [Crypto Utilities](#crypto-utilities)
- [Schemas](#schemas)
- [Types](#types)

## Clients

### FareDiscoveryClient

Client for interacting with the Discovery Service API.

#### Constructor

```typescript
new FareDiscoveryClient(config: DiscoveryClientConfig)
```

**Parameters:**
- `config.baseUrl` (string): Base URL of the Discovery Service
- `config.timeout` (number, optional): Request timeout in milliseconds (default: 30000)
- `config.retries` (number, optional): Number of retry attempts (default: 3)
- `config.retryDelay` (number, optional): Delay between retries in milliseconds (default: 1000)
- `config.apiKey` (string, optional): API key for authentication

#### Methods

##### `registerCasino(request: RegistrationRequest): Promise<CasinoMetadata>`

Register a new casino with the Discovery Service.

**Example:**
```typescript
const casino = await client.registerCasino({
  name: 'My Casino',
  url: 'https://mycasino.com',
  publicKey: 'your-public-key',
  signature: 'signature-of-registration-data',
  metadata: {
    description: 'A fun casino',
    games: ['slots', 'poker'],
  }
});
```

##### `updateCasino(id: string, request: CasinoUpdateRequest): Promise<CasinoMetadata>`

Update an existing casino's information.

##### `getCasinos(filters?: CasinoFilters): Promise<CasinoMetadata[]>`

Get a list of casinos with optional filters.

**Filters:**
- `status`: Filter by casino status
- `games`: Filter by game types
- `limit`: Maximum number of results (max: 100, default: 20)
- `offset`: Offset for pagination (default: 0)

##### `getCasino(id: string): Promise<CasinoMetadata>`

Get a single casino by ID.

##### `getCasinoByPublicKey(publicKey: string): Promise<CasinoMetadata>`

Get a casino by its public key.

##### `deleteCasino(id: string): Promise<void>`

Delete a casino.

##### `casinoExists(id: string): Promise<boolean>`

Check if a casino exists.

##### `getStats(): Promise<CasinoStats>`

Get statistics about casinos in the network.

---

### FareCasinoClient

Client for casino-side operations including heartbeats and status updates.

#### Constructor

```typescript
new FareCasinoClient(config: CasinoClientConfig)
```

**Parameters:**
- `config.baseUrl` (string): Base URL of the Discovery Service
- `config.casinoId` (string): Your casino's ID
- `config.privateKey` (string): Your casino's private key for signing
- `config.timeout` (number, optional): Request timeout in milliseconds
- `config.retries` (number, optional): Number of retry attempts
- `config.retryDelay` (number, optional): Delay between retries in milliseconds

#### Methods

##### `sendHeartbeat(payload: HeartbeatPayload): Promise<HeartbeatResponse>`

Send a heartbeat to the Discovery Service.

**Example:**
```typescript
await client.sendHeartbeat({
  status: 'online',
  timestamp: Date.now(),
  metrics: {
    activePlayers: 42,
    totalBets24h: 1250,
  }
});
```

##### `updateStatus(status: CasinoStatus): Promise<HeartbeatResponse>`

Update casino status.

##### `sendHeartbeatWithMetrics(status: CasinoStatus, metrics?: HeartbeatMetrics): Promise<HeartbeatResponse>`

Send heartbeat with optional metrics.

##### `goOnline(): Promise<HeartbeatResponse>`

Mark casino as online.

##### `goOffline(): Promise<HeartbeatResponse>`

Mark casino as offline.

##### `goMaintenance(): Promise<HeartbeatResponse>`

Mark casino as in maintenance.

##### `startHeartbeat(intervalMs?: number, status?: CasinoStatus): () => void`

Start automatic heartbeat interval. Returns a function to stop the interval.

**Example:**
```typescript
const stopHeartbeat = client.startHeartbeat(60000, 'online');
// Later...
stopHeartbeat();
```

---

## Crypto Utilities

### Signing

#### `signMessage(message: string | Uint8Array, privateKey: string): string`

Sign a message with a Solana private key.

**Example:**
```typescript
const signature = signMessage('Hello, World!', privateKey);
```

#### `createSignedPayload<T>(payload: T, privateKey: string): T & { signature: string }`

Create a signed payload for API requests.

**Example:**
```typescript
const signedData = createSignedPayload({
  name: 'My Casino',
  url: 'https://mycasino.com'
}, privateKey);
```

#### `generateKeypair(): { publicKey: string; privateKey: string }`

Generate a new Solana keypair.

#### `getKeypairFromPrivateKey(privateKey: string): { publicKey: string; privateKey: string }`

Extract a keypair from a private key.

### Verification

#### `verifySolanaSignature(message: string | Uint8Array, signature: string, publicKey: string): boolean`

Verify a Solana signature.

**Example:**
```typescript
const isValid = verifySolanaSignature(message, signature, publicKey);
```

#### `verifySignedPayload<T>(payload: T & { signature: string }, publicKey: string): boolean`

Verify a signed payload.

#### `isValidPublicKey(publicKey: string): boolean`

Validate a Solana public key format.

#### `isValidSignature(signature: string): boolean`

Validate a signature format.

---

## Schemas

All schemas are built with Zod for runtime validation.

### CasinoMetadata

```typescript
{
  id: string;              // UUID
  name: string;            // 1-100 characters
  url: string;             // Valid URL
  publicKey: string;       // Solana public key (base58)
  status: CasinoStatus;
  metadata: {
    description?: string;
    games: GameType[];
    logo?: string;
    banner?: string;
    socialLinks?: {
      twitter?: string;
      discord?: string;
      telegram?: string;
      website?: string;
    };
    maxBetAmount?: number;
    minBetAmount?: number;
    supportedTokens: string[];
  };
  createdAt: number;
  updatedAt: number;
  lastHeartbeat?: number;
  version: string;
}
```

### HeartbeatPayload

```typescript
{
  casinoId: string;
  status: CasinoStatus;
  timestamp: number;
  metrics?: {
    activePlayers?: number;
    totalBets24h?: number;
    uptime?: number;
    responseTime?: number;
  };
  signature: string;
}
```

### RegistrationRequest

```typescript
{
  name: string;
  url: string;
  publicKey: string;
  signature: string;
  metadata: {
    description?: string;
    games: GameType[];
    logo?: string;
    banner?: string;
    socialLinks?: {
      twitter?: string;
      discord?: string;
      telegram?: string;
      website?: string;
    };
    maxBetAmount?: number;
    minBetAmount?: number;
    supportedTokens: string[];
  };
}
```

---

## Types

### CasinoStatus

```typescript
type CasinoStatus = 'online' | 'offline' | 'maintenance' | 'suspended';
```

### GameType

```typescript
type GameType = 
  | 'slots'
  | 'poker'
  | 'blackjack'
  | 'roulette'
  | 'dice'
  | 'crash'
  | 'coinflip'
  | 'sports'
  | 'other';
```

### ErrorCode

```typescript
type ErrorCode =
  | 'INVALID_SIGNATURE'
  | 'CASINO_NOT_FOUND'
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'CASINO_ALREADY_EXISTS'
  | 'VALIDATION_ERROR';
```

### ApiResponse

```typescript
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
};
```

---

## Constants

```typescript
// Protocol version
FARE_PROTOCOL_VERSION = '1.0.0'
FARE_PROTOCOL_SPEC = 'fare_protocol_v1.0.0'

// Default values
DEFAULT_DISCOVERY_URL = 'https://discovery.fareplay.io'
DEFAULT_HEARTBEAT_INTERVAL = 60000 // 1 minute
DEFAULT_HTTP_TIMEOUT = 30000 // 30 seconds
DEFAULT_RETRIES = 3
DEFAULT_RETRY_DELAY = 1000 // 1 second

// API version
API_VERSION = 'v1'
```

