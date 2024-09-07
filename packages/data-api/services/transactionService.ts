import prisma from '../models/prismaClient';

export async function createTransaction(
	description: string,
	type: string,
	source: string,
	feePayer: string,
	walletAddress: string,
	signature: string,
	slot: number,
	timestamp: number
) {
	return await prisma.transactionDetail.create({
		data: {
			description,
			type,
			source,
			walletAddress,
			feePayer,
			signature,
			slot,
			timestamp,
		},
	});
}
