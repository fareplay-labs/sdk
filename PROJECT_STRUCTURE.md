# Project Structure

```
@fareplay/sdk/
│
├── 📁 src/                          # Source code
│   ├── 📁 client/                   # API clients
│   │   ├── discoveryClient.ts       # Discovery Service client
│   │   ├── casinoClient.ts          # Casino operations client
│   │   └── index.ts                 # Client exports
│   │
│   ├── 📁 crypto/                   # Cryptographic utilities
│   │   ├── sign.ts                  # Message signing
│   │   ├── verify.ts                # Signature verification
│   │   └── index.ts                 # Crypto exports
│   │
│   ├── 📁 schema/                   # Zod validation schemas
│   │   ├── casino.ts                # Casino schemas
│   │   ├── heartbeat.ts             # Heartbeat schemas
│   │   ├── protocol.ts              # Protocol schemas
│   │   └── index.ts                 # Schema exports
│   │
│   ├── 📁 utils/                    # Utility functions
│   │   ├── http.ts                  # HTTP client wrapper
│   │   └── index.ts                 # Utils exports
│   │
│   ├── constants.ts                 # Constants and defaults
│   └── index.ts                     # Main SDK exports
│
├── 📁 examples/                     # Usage examples
│   ├── discovery-example.ts         # Discovery client usage
│   ├── casino-example.ts            # Casino client usage
│   └── crypto-example.ts            # Crypto utilities usage
│
├── 📁 docs/                         # Documentation
│   ├── API.md                       # API reference
│   ├── GETTING_STARTED.md           # Getting started guide
│   └── ARCHITECTURE.md              # Architecture docs
│
├── 📁 .github/                      # GitHub configuration
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline
│
├── 📁 dist/                         # Build output (generated)
│   ├── index.js                     # ESM build
│   ├── index.cjs                    # CommonJS build
│   ├── index.d.ts                   # TypeScript declarations
│   └── *.map                        # Source maps
│
├── 📄 package.json                  # Package configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 build.config.ts               # Build configuration
│
├── 📄 README.md                     # Main documentation
├── 📄 QUICK_REFERENCE.md            # Quick reference guide
├── 📄 CONTRIBUTING.md               # Contributing guide
├── 📄 CHANGELOG.md                  # Version history
├── 📄 PROJECT_SUMMARY.md            # Project summary
├── 📄 LICENSE                       # MIT license
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .npmignore                    # NPM ignore rules
├── 📄 .eslintrc.json                # ESLint configuration
├── 📄 .prettierrc.json              # Prettier configuration
└── 📄 .editorconfig                 # Editor configuration
```

## Directory Purpose

### `/src`
Contains all source code for the SDK. Organized into logical modules:
- **client/** - API client implementations
- **crypto/** - Cryptographic operations
- **schema/** - Data validation schemas
- **utils/** - Shared utilities

### `/examples`
Runnable examples demonstrating SDK usage for different scenarios.

### `/docs`
Comprehensive documentation including API reference, guides, and architecture.

### `/dist`
Build output directory (created during build process). Contains transpiled JavaScript and type definitions.

### `/.github`
GitHub-specific configuration including CI/CD workflows.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Main entry point, exports public API |
| `package.json` | NPM package configuration and scripts |
| `tsconfig.json` | TypeScript compiler options |
| `build.config.ts` | Build configuration for Bun |
| `README.md` | Primary documentation and overview |
| `LICENSE` | MIT license terms |

## Module Dependencies

```
index.ts
├── client/
│   ├── discoveryClient.ts
│   │   ├── utils/http.ts
│   │   └── schema/*
│   └── casinoClient.ts
│       ├── utils/http.ts
│       ├── schema/*
│       └── crypto/sign.ts
│
├── crypto/
│   ├── sign.ts
│   │   ├── tweetnacl
│   │   └── bs58
│   └── verify.ts
│       ├── tweetnacl
│       └── bs58
│
├── schema/
│   ├── casino.ts (zod)
│   ├── heartbeat.ts (zod)
│   └── protocol.ts (zod)
│
└── utils/
    └── http.ts
        └── zod
```

## Build Flow

```
Source (TypeScript)
    │
    ├──> TypeScript Compiler ──> Type Declarations (.d.ts)
    │
    └──> Bun Build
         ├──> ESM Output (index.js)
         └──> CJS Output (index.cjs)
```

## Import Paths

### For SDK Users
```typescript
// Main imports
import { FareDiscoveryClient, FareCasinoClient } from '@fareplay/sdk';

// Type imports
import type { CasinoMetadata, CasinoStatus } from '@fareplay/sdk';
```

### Internal (within SDK)
```typescript
// Relative imports
import { HttpClient } from '../utils/http';
import { CasinoMetadataSchema } from '../schema';
```

## Size Overview

### Source Files
- **Client**: ~400 lines (2 files)
- **Crypto**: ~250 lines (2 files)
- **Schema**: ~350 lines (3 files)
- **Utils**: ~250 lines (1 file)
- **Total**: ~1,250 lines of source code

### Documentation
- **Docs**: ~1,500 lines
- **Examples**: ~250 lines
- **README**: ~180 lines
- **Total**: ~1,930 lines of documentation

## File Naming Conventions

- **Source files**: camelCase (e.g., `discoveryClient.ts`)
- **Documentation**: UPPER_CASE (e.g., `README.md`)
- **Examples**: kebab-case-example.ts
- **Config files**: Lowercase with dots (e.g., `.eslintrc.json`)

## Development Workflow

1. **Edit source** in `/src`
2. **Type check** with `bun run typecheck`
3. **Build** with `bun run build`
4. **Test examples** in `/examples`
5. **Update docs** in `/docs`
6. **Commit changes** following conventions

