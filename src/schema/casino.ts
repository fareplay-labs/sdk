import { z } from 'zod';

/**
 * Casino status enum
 */
export const CasinoStatusSchema = z.enum([
  'online',
  'offline',
  'maintenance',
  'suspended',
]);

export type CasinoStatus = z.infer<typeof CasinoStatusSchema>;

/**
 * Game type schema
 */
export const GameTypeSchema = z.enum([
  'slots',
  'roulette',
  'dice',
  'crash',
  'coinflip',
  'rps',
  'bombs',
  'cards',
]);

export type GameType = z.infer<typeof GameTypeSchema>;

/**
 * Casino metadata schema
 * Core data structure representing a casino in the Fare Protocol
 */
export const CasinoMetadataSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  url: z.string().url(),
  publicKey: z.string().min(32).max(44), // Solana public key in base58
  status: CasinoStatusSchema,
  metadata: z.object({
    description: z.string().max(500).optional(),
    games: z.array(GameTypeSchema).default([]),
    logo: z.string().url().optional(),
    banner: z.string().url().optional(),
    socialLinks: z
      .object({
        twitter: z.string().url().optional(),
        discord: z.string().url().optional(),
        telegram: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .optional(),
    maxBetAmount: z.number().positive().optional(),
    minBetAmount: z.number().positive().optional(),
    supportedTokens: z.array(z.string()).default(['SOL']),
  }),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
  lastHeartbeat: z.number().int().positive().optional(),
  version: z.string().default('1.0.0'), // Protocol version
});

export type CasinoMetadata = z.infer<typeof CasinoMetadataSchema>;

/**
 * Registration request schema
 * Used when a casino first registers with the Discovery Service
 */
export const RegistrationRequestSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  publicKey: z.string().min(32).max(44),
  signature: z.string(), // Signature of the registration data
  metadata: z.object({
    description: z.string().max(500).optional(),
    games: z.array(GameTypeSchema).default([]),
    logo: z.string().url().optional(),
    banner: z.string().url().optional(),
    socialLinks: z
      .object({
        twitter: z.string().url().optional(),
        discord: z.string().url().optional(),
        telegram: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .optional(),
    maxBetAmount: z.number().positive().optional(),
    minBetAmount: z.number().positive().optional(),
    supportedTokens: z.array(z.string()).default(['SOL']),
  }),
});

export type RegistrationRequest = z.infer<typeof RegistrationRequestSchema>;

/**
 * Casino update request schema
 */
export const CasinoUpdateRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  status: CasinoStatusSchema.optional(),
  metadata: z
    .object({
      description: z.string().max(500).optional(),
      games: z.array(GameTypeSchema).optional(),
      logo: z.string().url().optional(),
      banner: z.string().url().optional(),
      socialLinks: z
        .object({
          twitter: z.string().url().optional(),
          discord: z.string().url().optional(),
          telegram: z.string().url().optional(),
          website: z.string().url().optional(),
        })
        .optional(),
      maxBetAmount: z.number().positive().optional(),
      minBetAmount: z.number().positive().optional(),
      supportedTokens: z.array(z.string()).optional(),
    })
    .optional(),
  signature: z.string(), // Signature of the update data
});

export type CasinoUpdateRequest = z.infer<typeof CasinoUpdateRequestSchema>;

/**
 * Casino filters for querying
 */
export const CasinoFiltersSchema = z.object({
  status: CasinoStatusSchema.optional(),
  games: z.array(GameTypeSchema).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export type CasinoFilters = z.infer<typeof CasinoFiltersSchema>;

