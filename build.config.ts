/**
 * Build configuration for Bun
 * 
 * This file defines the build configuration for creating
 * both ESM and CJS outputs with proper TypeScript declarations.
 */

export default {
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  format: ['esm', 'cjs'],
  minify: true,
  sourcemap: 'external',
  splitting: false,
  external: [
    '@solana/web3.js',
    'tweetnacl',
    'bs58',
    'zod',
  ],
};

