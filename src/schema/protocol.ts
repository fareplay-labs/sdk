import { z } from 'zod';

/**
 * Protocol version constants
 */
export const FARE_PROTOCOL_VERSION = '1.0.0';
export const FARE_PROTOCOL_SPEC = 'fare_protocol_v1.0.0';

/**
 * API Response wrapper schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional(),
      })
      .optional(),
    timestamp: z.number().int().positive(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
};

/**
 * Error codes used across the protocol
 */
export const ErrorCodes = {
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  CASINO_NOT_FOUND: 'CASINO_NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CASINO_ALREADY_EXISTS: 'CASINO_ALREADY_EXISTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * SDK Configuration schema
 */
export const SdkConfigSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().positive().default(30000), // 30 seconds
  retries: z.number().int().nonnegative().default(3),
  retryDelay: z.number().positive().default(1000), // 1 second
});

export type SdkConfig = z.infer<typeof SdkConfigSchema>;

