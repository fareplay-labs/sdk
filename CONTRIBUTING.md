# Contributing to @fareplay/sdk

Thank you for your interest in contributing to the FarePlay SDK! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) v1.0.0 or higher
- Node.js v18.0.0 or higher (for compatibility testing)
- Git

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/sdk.git
   cd sdk
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Build the SDK**
   ```bash
   bun run build
   ```

4. **Type Check**
   ```bash
   bun run typecheck
   ```

## Project Structure

```
src/
├── client/           # API clients
│   ├── discoveryClient.ts
│   └── casinoClient.ts
├── crypto/          # Cryptographic utilities
│   ├── sign.ts
│   └── verify.ts
├── schema/          # Zod schemas
│   ├── casino.ts
│   ├── heartbeat.ts
│   └── protocol.ts
├── utils/           # Utilities
│   └── http.ts
├── constants.ts     # Constants
└── index.ts         # Main exports
```

## Development Workflow

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Add/update TypeScript types as needed
   - Update documentation if necessary

3. **Type Check**
   ```bash
   bun run typecheck
   ```

4. **Build**
   ```bash
   bun run build
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or tooling changes

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md following the existing format
3. Ensure all type checks pass
4. Update examples if you've changed APIs
5. Submit a pull request to the `main` branch

## Code Style

- Use TypeScript for all code
- Follow the existing code formatting (enforced by Prettier)
- Write clear, descriptive variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Adding New Features

### Adding a New API Endpoint

1. Add the schema in `src/schema/`
2. Add the method to the appropriate client
3. Update the TypeScript types
4. Add an example in `examples/`
5. Update the README.md

### Adding Crypto Utilities

1. Add the utility in `src/crypto/`
2. Export from `src/crypto/index.ts`
3. Export from main `src/index.ts`
4. Add an example demonstrating usage
5. Update documentation

## Testing

While we currently don't have automated tests, when adding features:

1. Test manually with examples
2. Verify type safety
3. Check error handling
4. Validate against the Fare Protocol spec

## Documentation

- Keep the README.md up to date
- Update JSDoc comments for public APIs
- Add examples for new features
- Update CHANGELOG.md for all changes

## Protocol Compliance

All changes must comply with the Fare Protocol Spec v1.0.0:

- Maintain schema compatibility
- Follow signature verification standards
- Preserve API contract with Discovery Service
- Ensure backward compatibility

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord for discussions
- Check existing issues and PRs before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

