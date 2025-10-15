# Getting Started with @fareplay/sdk

This guide will help you get started with the FarePlay SDK.

## Installation

Install the SDK using your preferred package manager:

```bash
# npm
npm install @fareplay/sdk

# yarn
yarn add @fareplay/sdk

# bun
bun add @fareplay/sdk

# pnpm
pnpm add @fareplay/sdk
```

## Quick Start

### 1. Generate a Keypair

First, generate a keypair for your casino:

```typescript
import { generateKeypair } from '@fareplay/sdk';

const keypair = generateKeypair();
console.log('Public Key:', keypair.publicKey);
console.log('Private Key:', keypair.privateKey);

// IMPORTANT: Save your private key securely!
```

### 2. Register Your Casino

Use the Discovery Client to register your casino:

```typescript
import { FareDiscoveryClient, createSignedPayload } from '@fareplay/sdk';

const client = new FareDiscoveryClient({
  baseUrl: 'https://api.discover.fareplay.io',
});

// Prepare registration data
const registrationData = {
  name: 'My Casino',
  url: 'https://mycasino.com',
  publicKey: keypair.publicKey,
  metadata: {
    description: 'A fun and fair casino',
    games: ['slots', 'roulette', 'dice'],
    logo: 'https://mycasino.com/logo.png',
    supportedTokens: ['SOL', 'USDC'],
  },
};

// Sign the registration
const signedRegistration = createSignedPayload(
  registrationData,
  keypair.privateKey
);

// Register
const casino = await client.registerCasino(signedRegistration);
console.log('Casino registered with ID:', casino.id);
```

### 3. Send Heartbeats

Use the Casino Client to send heartbeats and keep your casino's status updated:

```typescript
import { FareCasinoClient } from '@fareplay/sdk';

const casinoClient = new FareCasinoClient({
  baseUrl: 'https://api.discover.fareplay.io',
  casinoId: casino.id,
  privateKey: keypair.privateKey,
});

// Send a heartbeat
await casinoClient.sendHeartbeat({
  status: 'online',
  timestamp: Date.now(),
  metrics: {
    activePlayers: 10,
    totalBets24h: 500,
  },
});

// Or use convenience methods
await casinoClient.goOnline();
await casinoClient.goOffline();
await casinoClient.goMaintenance();
```

### 4. Automatic Heartbeats

Start an automatic heartbeat to continuously update your casino's status:

```typescript
// Start heartbeat (sends every 60 seconds)
const stopHeartbeat = casinoClient.startHeartbeat(60000, 'online');

// When you want to stop
stopHeartbeat();
```

## Common Use Cases

### Fetching Casinos

```typescript
// Get all online casinos
const onlineCasinos = await client.getCasinos({
  status: 'online',
  limit: 50,
});

// Get casinos with specific games
const slotCasinos = await client.getCasinos({
  games: ['slots'],
});

// Get a specific casino
const specificCasino = await client.getCasino('casino-id');

// Get casino by public key
const casinoByKey = await client.getCasinoByPublicKey('public-key');
```

### Updating Casino Information

```typescript
const updateData = {
  status: 'maintenance',
  metadata: {
    description: 'Updated description',
  },
};

const signedUpdate = createSignedPayload(updateData, privateKey);
const updated = await client.updateCasino(casino.id, signedUpdate);
```

### Signature Verification

```typescript
import {
  signMessage,
  verifySolanaSignature,
  createSignedPayload,
  verifySignedPayload,
} from '@fareplay/sdk';

// Sign a message
const message = 'Hello, World!';
const signature = signMessage(message, privateKey);

// Verify signature
const isValid = verifySolanaSignature(message, signature, publicKey);

// Sign and verify payloads
const payload = { data: 'some data' };
const signedPayload = createSignedPayload(payload, privateKey);
const isPayloadValid = verifySignedPayload(signedPayload, publicKey);
```

## Error Handling

The SDK throws `HttpClientError` for API errors:

```typescript
import { HttpClientError } from '@fareplay/sdk';

try {
  const casino = await client.getCasino('invalid-id');
} catch (error) {
  if (error instanceof HttpClientError) {
    console.error('Status:', error.statusCode);
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
  }
}
```

## TypeScript Support

The SDK is fully typed. Your IDE will provide autocomplete and type checking:

```typescript
import type {
  CasinoMetadata,
  CasinoStatus,
  GameType,
  HeartbeatPayload,
} from '@fareplay/sdk';

// All types are available for import
const status: CasinoStatus = 'online';
const games: GameType[] = ['slots', 'poker'];
```

## Environment Variables

For production use, store sensitive data in environment variables:

```typescript
const client = new FareCasinoClient({
  baseUrl: process.env.DISCOVERY_URL || 'https://api.discover.fareplay.io',
  casinoId: process.env.CASINO_ID!,
  privateKey: process.env.CASINO_PRIVATE_KEY!,
});
```

## Next Steps

- Check out the [API Reference](./API.md) for detailed documentation
- See [Examples](../examples/) for more use cases
- Read the [Contributing Guide](../CONTRIBUTING.md) to contribute
- Review the [Changelog](../CHANGELOG.md) for updates

## Support

- [Documentation](https://docs.fareplay.io)
- [GitHub Issues](https://github.com/fareplay/sdk/issues)
- [Discord Community](https://discord.gg/fareplay)

