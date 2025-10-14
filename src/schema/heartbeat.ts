import { z } from 'zod';
import { CasinoStatusSchema } from './casino';

/**
 * Heartbeat payload schema
 * Sent by casinos to indicate they are alive and operational
 */
export const HeartbeatPayloadSchema = z.object({
  casinoId: z.string().uuid(),
  status: CasinoStatusSchema,
  timestamp: z.number().int().positive(),
  metrics: z
    .object({
      activePlayers: z.number().int().nonnegative().optional(),
      totalBets24h: z.number().nonnegative().optional(),
      uptime: z.number().nonnegative().optional(), // In seconds
      responseTime: z.number().positive().optional(), // In milliseconds
    })
    .optional(),
  signature: z.string(), // Signature of the heartbeat data
});

export type HeartbeatPayload = z.infer<typeof HeartbeatPayloadSchema>;

/**
 * Heartbeat response schema
 */
export const HeartbeatResponseSchema = z.object({
  success: z.boolean(),
  timestamp: z.number().int().positive(),
  nextHeartbeatIn: z.number().int().positive().optional(), // In seconds
});

export type HeartbeatResponse = z.infer<typeof HeartbeatResponseSchema>;

