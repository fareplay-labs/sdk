# Quick Reference

Quick reference guide for the most common @fareplay/sdk operations.

## Installation

```bash
npm install @fareplay/sdk
```

## Import

```typescript
import {
  FareDiscoveryClient,
  FareCasinoClient,
  generateKeypair,
  signMessage,
  verifySolanaSignature,
  createSignedPayload,
} from '@fareplay/sdk';
```

## Keypair Generation

```typescript
// Generate new keypair
const { publicKey, privateKey } = generateKeypair();

// Extract from existing private key
const keypair = getKeypairFromPrivateKey(existingPrivateKey);
```

## Discovery Client

```typescript
const client = new FareDiscoveryClient({
  baseUrl: 'https://api.discover.fareplay.io',
});
```

### Register Casino

```typescript
const data = createSignedPayload({
  name: 'My Casino',
  url: 'https://mycasino.com',
  publicKey: publicKey,
  metadata: {
    description: 'A fun casino',
    games: ['slots', 'poker'],
  },
}, privateKey);

const casino = await client.registerCasino(data);
```

### Get Casinos

```typescript
// All casinos
const all = await client.getCasinos();

// With filters
const online = await client.getCasinos({
  status: 'online',
  games: ['slots'],
  limit: 20,
});

// By ID
const casino = await client.getCasino('casino-id');

// By public key
const casino = await client.getCasinoByPublicKey(publicKey);
```

### Update Casino

```typescript
const update = createSignedPayload({
  status: 'maintenance',
  metadata: { description: 'New description' },
}, privateKey);

await client.updateCasino(casino.id, update);
```

### Get Statistics

```typescript
const stats = await client.getStats();
// { totalCasinos, onlineCasinos, offlineCasinos, maintenanceCasinos }
```

## Casino Client

```typescript
const client = new FareCasinoClient({
  baseUrl: 'https://api.discover.fareplay.io',
  casinoId: 'your-casino-id',
  privateKey: privateKey,
});
```

### Send Heartbeat

```typescript
// Simple heartbeat
await client.sendHeartbeat({
  status: 'online',
  timestamp: Date.now(),
});

// With metrics
await client.sendHeartbeatWithMetrics('online', {
  activePlayers: 42,
  totalBets24h: 1250,
  uptime: 86400,
  responseTime: 45,
});
```

### Update Status

```typescript
await client.updateStatus('online');

// Or use convenience methods
await client.goOnline();
await client.goOffline();
await client.goMaintenance();
```

### Automatic Heartbeat

```typescript
// Start (sends every 60 seconds)
const stop = client.startHeartbeat(60000, 'online');

// Stop when needed
stop();
```

## Signing & Verification

### Sign Message

```typescript
const signature = signMessage('Hello, World!', privateKey);
```

### Verify Signature

```typescript
const isValid = verifySolanaSignature(
  'Hello, World!',
  signature,
  publicKey
);
```

### Sign Payload

```typescript
const signed = createSignedPayload({
  data: 'some data',
  timestamp: Date.now(),
}, privateKey);
```

### Verify Payload

```typescript
const isValid = verifySignedPayload(signedPayload, publicKey);
```

### Validate Formats

```typescript
isValidPublicKey(publicKey);  // true/false
isValidSignature(signature);  // true/false
```

## Error Handling

```typescript
import { HttpClientError } from '@fareplay/sdk';

try {
  await client.getCasino('invalid-id');
} catch (error) {
  if (error instanceof HttpClientError) {
    console.log(error.statusCode);  // HTTP status
    console.log(error.code);        // Error code
    console.log(error.message);     // Error message
  }
}
```

## Types

```typescript
import type {
  CasinoMetadata,
  CasinoStatus,
  GameType,
  HeartbeatPayload,
  RegistrationRequest,
  ApiResponse,
} from '@fareplay/sdk';
```

## Common Patterns

### Casino Registration Flow

```typescript
// 1. Generate keypair
const keypair = generateKeypair();

// 2. Prepare data
const data = {
  name: 'My Casino',
  url: 'https://mycasino.com',
  publicKey: keypair.publicKey,
  metadata: { games: ['slots'] },
};

// 3. Sign and register
const signed = createSignedPayload(data, keypair.privateKey);
const casino = await discoveryClient.registerCasino(signed);

// 4. Start heartbeat
const casinoClient = new FareCasinoClient({
  baseUrl: 'https://api.discover.fareplay.io',
  casinoId: casino.id,
  privateKey: keypair.privateKey,
});
const stop = casinoClient.startHeartbeat();
```

### Query and Filter

```typescript
// Get online slot casinos
const casinos = await client.getCasinos({
  status: 'online',
  games: ['slots'],
  limit: 50,
  offset: 0,
});

// Process results
casinos.forEach(casino => {
  console.log(`${casino.name}: ${casino.url}`);
});
```

### Status Management

```typescript
// Startup
await client.goOnline();

// Maintenance window
await client.goMaintenance();
// ... perform maintenance ...
await client.goOnline();

// Shutdown
await client.goOffline();
```

## Constants

```typescript
import {
  FARE_PROTOCOL_VERSION,      // '1.0.0'
  FARE_PROTOCOL_SPEC,          // 'fare_protocol_v1.0.0'
  SDK_VERSION,                 // '1.0.0'
} from '@fareplay/sdk';
```

## Configuration

```typescript
// Custom configuration
const client = new FareDiscoveryClient({
  baseUrl: 'https://api.discover.fareplay.io',
  timeout: 30000,     // 30 seconds
  retries: 3,         // 3 retry attempts
  retryDelay: 1000,   // 1 second between retries
  apiKey: 'optional-api-key',
});
```

## Environment Variables

```typescript
const client = new FareCasinoClient({
  baseUrl: process.env.DISCOVERY_URL!,
  casinoId: process.env.CASINO_ID!,
  privateKey: process.env.CASINO_PRIVATE_KEY!,
});
```

## Links

- [Full Documentation](./docs/API.md)
- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Examples](./examples/)
- [GitHub](https://github.com/fareplay/sdk)

