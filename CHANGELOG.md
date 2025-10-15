# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-10-15

### Changed
- Updated default Discovery Service API endpoint to `https://api.discover.fareplay.io`
- Updated all documentation and examples to use new API endpoint

## [1.0.0] - 2025-10-14

### Added
- Initial release of @fareplay/sdk
- `FareDiscoveryClient` for Discovery Service API integration
- `FareCasinoClient` for casino-side heartbeat and status management
- Solana signature signing and verification utilities
- Zod schemas for Fare Protocol v1.0.0 data structures
  - `CasinoMetadata`
  - `HeartbeatPayload`
  - `RegistrationRequest`
  - `CasinoUpdateRequest`
  - `CasinoFilters`
- HTTP client wrapper with timeout and retry support
- TypeScript declarations for full type safety
- ESM and CJS build outputs
- Comprehensive documentation and examples

### Features
- Type-safe API clients with Zod validation
- Automatic request signing with Solana keypairs
- Configurable retry logic for network requests
- Heartbeat automation for casinos
- Protocol compliance checking
- Full TypeScript support

[1.0.0]: https://github.com/fareplay/sdk/releases/tag/v1.0.0

