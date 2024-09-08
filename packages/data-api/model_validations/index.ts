import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const TransactionDetailSchema = z.object({
	description: z.string(),
	type: z.string(),
	source: z.string(),
	feePayer: z.string(),
	walletAddress: z.string().length(44), // Solana wallet addresses are 44 characters long
	signature: z.string(),
	slot: z.number(),
	timestamp: z.number(),
});

export { TransactionDetailSchema };
