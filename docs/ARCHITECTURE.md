# Architecture

This document describes the architecture of the @fareplay/sdk.

## Overview

The FarePlay SDK is designed as a modular, type-safe toolkit for interacting with the Fare Protocol ecosystem. It provides a clean abstraction layer over the Discovery Service API and implements the protocol's cryptographic requirements.

```
┌─────────────────────────────────────────────────────┐
│                  @fareplay/sdk                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │   Clients    │  │    Crypto    │  │ Schemas  │  │
│  │              │  │              │  │          │  │
│  │ - Discovery  │  │ - Sign       │  │ - Casino │  │
│  │ - Casino     │  │ - Verify     │  │ - Heart  │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Utils      │  │  Constants   │                │
│  │              │  │              │                │
│  │ - HTTP       │  │ - Protocol   │                │
│  │              │  │ - Defaults   │                │
│  └──────────────┘  └──────────────┘                │
│                                                      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │    Fare Protocol Ecosystem     │
        ├────────────────────────────────┤
        │  - Discovery Service           │
        │  - Casino Backends             │
        │  - CLI Tools                   │
        └────────────────────────────────┘
```

## Core Modules

### Clients (`src/client/`)

The client modules provide high-level abstractions for API interactions.

#### FareDiscoveryClient

**Purpose**: Interact with the Discovery Service API

**Responsibilities**:
- Casino registration
- Casino queries and filters
- Casino updates and deletion
- Statistics retrieval

**Design Patterns**:
- Dependency injection for HTTP client
- Schema validation on all requests/responses
- Error handling with typed exceptions

#### FareCasinoClient

**Purpose**: Casino-side operations

**Responsibilities**:
- Heartbeat transmission
- Status updates
- Automatic heartbeat intervals
- Request signing

**Design Patterns**:
- Automatic signature injection
- Convenience methods for common operations
- Interval management for heartbeats

### Crypto (`src/crypto/`)

Cryptographic utilities for Solana signature operations.

#### Sign Module

**Purpose**: Message and payload signing

**Functions**:
- `signMessage()`: Sign arbitrary messages
- `createSignedPayload()`: Sign JSON payloads
- `generateKeypair()`: Generate new keypairs
- `getKeypairFromPrivateKey()`: Extract keypair from private key

**Implementation**:
- Uses TweetNaCl for Ed25519 signatures
- Base58 encoding for keys and signatures
- Deterministic JSON serialization

#### Verify Module

**Purpose**: Signature verification

**Functions**:
- `verifySolanaSignature()`: Verify message signatures
- `verifySignedPayload()`: Verify payload signatures
- `isValidPublicKey()`: Validate key format
- `isValidSignature()`: Validate signature format

**Security**:
- Constant-time verification
- Safe error handling (returns false instead of throwing)
- Format validation before verification

### Schemas (`src/schema/`)

Zod-based runtime validation schemas.

#### Casino Schema

**Defines**:
- `CasinoMetadata`: Complete casino data
- `RegistrationRequest`: New casino registration
- `CasinoUpdateRequest`: Casino updates
- `CasinoFilters`: Query filters
- `CasinoStatus`: Status enum
- `GameType`: Game type enum

**Validation Rules**:
- UUID format for IDs
- URL validation
- String length constraints
- Enum validation
- Nested object validation

#### Heartbeat Schema

**Defines**:
- `HeartbeatPayload`: Heartbeat data
- `HeartbeatResponse`: Server response
- Optional metrics structure

#### Protocol Schema

**Defines**:
- `ApiResponse`: Generic API response wrapper
- Error codes
- SDK configuration
- Protocol version constants

### Utils (`src/utils/`)

#### HTTP Client

**Purpose**: Typed HTTP wrapper around fetch

**Features**:
- Automatic retries with exponential backoff
- Request timeout handling
- Response validation with Zod
- Typed request/response handling
- Error normalization

**Design**:
- Promise-based async API
- Configurable via dependency injection
- RESTful method helpers (GET, POST, PUT, PATCH, DELETE)
- Query parameter serialization

## Data Flow

### Registration Flow

```
Casino App
    │
    ├─► generateKeypair()
    │       │
    │       └─► Keypair
    │
    ├─► createSignedPayload(data, privateKey)
    │       │
    │       └─► Signed Data
    │
    ├─► client.registerCasino(signedData)
    │       │
    │       ├─► Validate (Zod)
    │       ├─► HTTP POST /api/v1/casinos
    │       ├─► Verify Signature (Discovery Service)
    │       └─► Store Casino
    │
    └─► CasinoMetadata
```

### Heartbeat Flow

```
Casino App
    │
    ├─► client.sendHeartbeat({ status, metrics })
    │       │
    │       ├─► Add casinoId
    │       ├─► createSignedPayload()
    │       ├─► Validate (Zod)
    │       ├─► HTTP POST /api/v1/heartbeat
    │       ├─► Verify Signature (Discovery Service)
    │       └─► Update Status
    │
    └─► HeartbeatResponse
```

## Security Model

### Request Signing

1. **Deterministic Serialization**: JSON payloads are serialized with sorted keys
2. **Ed25519 Signatures**: All signatures use Solana's Ed25519 scheme
3. **Signature Verification**: Server verifies signatures before processing
4. **Public Key Association**: Casinos are identified by their public keys

### Key Management

- **Private Keys**: Never transmitted, used only for signing
- **Public Keys**: Stored in Discovery Service, used for verification
- **Keypair Generation**: Uses cryptographically secure random number generator

### Error Handling

- **No Leakage**: Error messages don't reveal internal state
- **Safe Defaults**: Verification failures return false, not exceptions
- **Type Safety**: TypeScript ensures proper error handling

## Extension Points

### Adding New Clients

1. Create new client in `src/client/`
2. Extend `HttpClient` for API calls
3. Add schemas in `src/schema/`
4. Export from `src/index.ts`

### Adding New Schemas

1. Define Zod schema in appropriate file
2. Export type and schema
3. Re-export from `src/schema/index.ts`
4. Use in client methods

### Adding Crypto Functions

1. Add function in `src/crypto/sign.ts` or `verify.ts`
2. Use TweetNaCl for cryptographic operations
3. Export from `src/crypto/index.ts`
4. Add tests/examples

## Performance Considerations

### HTTP Client

- **Connection Pooling**: Uses fetch's built-in pooling
- **Retry Logic**: Exponential backoff to avoid thundering herd
- **Timeout**: Prevents hanging requests

### Schema Validation

- **Parse Once**: Validate at API boundaries
- **Type Inference**: Zero runtime overhead for TypeScript types
- **Lazy Validation**: Only validate when needed

### Crypto Operations

- **Efficient Algorithms**: Ed25519 is fast and secure
- **Minimal Allocations**: Reuse buffers where possible
- **Base58 Encoding**: Efficient encoding for keys

## Testing Strategy

### Unit Tests (Future)

- Schema validation
- Crypto operations
- HTTP client error handling

### Integration Tests (Future)

- End-to-end registration flow
- Heartbeat transmission
- Error scenarios

### Type Tests

- TypeScript compilation ensures type safety
- Zod provides runtime validation

## Dependencies

### Production

- `zod`: Runtime validation
- `@solana/web3.js`: Solana types (peer dependency)
- `tweetnacl`: Cryptography
- `bs58`: Base58 encoding

### Development

- `typescript`: Type checking
- `bun`: Build tool and runtime

## Build Process

### Compilation

1. TypeScript → JavaScript (ESM + CJS)
2. Type declarations generation
3. Source maps generation
4. Minification

### Outputs

- `dist/index.js`: ESM build
- `dist/index.cjs`: CommonJS build
- `dist/index.d.ts`: TypeScript declarations
- `dist/*.map`: Source maps

## Version Management

### Protocol Version

- SDK follows Fare Protocol Spec v1.0.0
- Breaking changes require major version bump
- Backward compatibility maintained within major versions

### Semantic Versioning

- **Major**: Breaking API changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes

## Future Enhancements

### Planned Features

- [ ] WebSocket support for real-time updates
- [ ] Caching layer for frequently accessed data
- [ ] Rate limit handling with automatic backoff
- [ ] Batch operations for multiple casinos
- [ ] Plugin system for custom validators

### Optimization Opportunities

- [ ] Request deduplication
- [ ] Response caching
- [ ] Parallel request execution
- [ ] Streaming for large datasets

