import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
    ANTHROPIC_API_KEY: z.string(),
    MCP_VERSION: z.string().default("1.0")
});
export const config = envSchema.parse(process.env);
