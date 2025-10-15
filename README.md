# @fareplay/sdk

Official developer toolkit for the Fare Protocol ecosystem. Standardizes communication between the Discovery Service API, Casino Backends, and other services through shared schemas, client classes, and crypto utilities.

## Features

- 🎯 **Typed API Clients** - Fully typed clients for Discovery and Casino services
- 🔒 **Cryptographic Utilities** - Solana signature signing and verification
- 📝 **Protocol Schemas** - Zod-based validation for Fare Protocol v1.0.0
- 🚀 **Modern Build** - ESM + CJS support with TypeScript declarations
- 🛠️ **Developer Friendly** - Built with TypeScript for excellent IDE support

## Installation

```bash
npm install @fareplay/sdk
# or
yarn add @fareplay/sdk
# or
bun add @fareplay/sdk
```

## Quick Start

### Discovery Client

```typescript
import { FareDiscoveryClient } from '@fareplay/sdk';

const client = new FareDiscoveryClient({
  baseUrl: 'https://api.discover.fareplay.io',
});

// Register a casino
await client.registerCasino({
  name: 'My Casino',
  url: 'https://mycasino.com',
  publicKey: 'your-solana-public-key',
  metadata: {
    description: 'A fun casino',
    games: ['slots', 'dice', 'rps'],
  },
});

// Fetch all casinos
const casinos = await client.getCasinos();
```

### Casino Client

```typescript
import { FareCasinoClient } from '@fareplay/sdk';

const client = new FareCasinoClient({
  baseUrl: 'https://api.discover.fareplay.io',
  casinoId: 'your-casino-id',
  privateKey: 'your-private-key',
});

// Send heartbeat
await client.sendHeartbeat({
  status: 'online',
  timestamp: Date.now(),
});
```

### Signature Verification

```typescript
import { verifySolanaSignature, signMessage } from '@fareplay/sdk';

// Sign a message
const signature = await signMessage(message, privateKey);

// Verify a signature
const isValid = verifySolanaSignature(message, signature, publicKey);
```

## Core Modules

### Client

- **FareDiscoveryClient** - Register, update, and fetch casinos from Discovery
- **FareCasinoClient** - Manage casino-side heartbeats and protocol compliance

### Crypto

- **signMessage()** - Sign messages with Solana wallet
- **verifySolanaSignature()** - Verify Solana signatures

### Schema

Zod schemas for protocol objects:
- `CasinoMetadataSchema`
- `HeartbeatPayloadSchema`
- `RegistrationRequestSchema`
- And more...

### Utils

- **http** - Typed HTTP wrapper around fetch()

## API Reference

### FareDiscoveryClient

```typescript
class FareDiscoveryClient {
  constructor(config: { baseUrl: string });
  
  registerCasino(data: RegistrationRequest): Promise<CasinoMetadata>;
  updateCasino(id: string, data: Partial<CasinoMetadata>): Promise<CasinoMetadata>;
  getCasinos(filters?: CasinoFilters): Promise<CasinoMetadata[]>;
  getCasino(id: string): Promise<CasinoMetadata>;
  deleteCasino(id: string): Promise<void>;
}
```

### FareCasinoClient

```typescript
class FareCasinoClient {
  constructor(config: {
    baseUrl: string;
    casinoId: string;
    privateKey: string;
  });
  
  sendHeartbeat(payload: HeartbeatPayload): Promise<void>;
  updateStatus(status: CasinoStatus): Promise<void>;
}
```

## Protocol Version

This SDK implements **Fare Protocol Spec v1.0.0**.

## Development

```bash
# Install dependencies
bun install

# Build the SDK
bun run build

# Type check
bun run typecheck

# Development mode
bun run dev
```

## License

MIT © FarePlay

## Documentation

- 📖 [Getting Started Guide](./docs/GETTING_STARTED.md)
- 📚 [API Reference](./docs/API.md)
- 🏗️ [Architecture](./docs/ARCHITECTURE.md)
- ⚡ [Quick Reference](./QUICK_REFERENCE.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 📝 [Changelog](./CHANGELOG.md)

## Examples

Check out the [examples](./examples/) directory for complete code samples:

- [Discovery Client Example](./examples/discovery-example.ts) - Casino registration and management
- [Casino Client Example](./examples/casino-example.ts) - Heartbeat and status updates
- [Crypto Example](./examples/crypto-example.ts) - Signing and verification

## Support

- [Documentation](https://docs.fareplay.io)
- [GitHub Issues](https://github.com/fareplay/sdk/issues)
- [Discord](https://discord.gg/fareplay)

