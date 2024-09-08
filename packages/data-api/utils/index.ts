import { PrismaClient } from '@prisma/client';

interface TransactionDetail {
	description: string;
	type: string;
	source: string;
	feePayer: string;
	signature: string;
	slot: number;
	timestamp: number;
}

const prisma = new PrismaClient();

export const createTransactions = async (
	transactions: TransactionDetail[]
) => {
	try {
		const walletAddress = transactions[0].feePayer;
		const wallet = await prisma.wallet.findUnique({
			where: {
				address: walletAddress,
			},
		});

		if (!wallet) {
			await prisma.wallet.create({
				data: {
					address: walletAddress,
				},
			});
		}

		const result = await prisma.transactionDetail.createMany({
			data: transactions,
		});

		return result;
	} catch (error) {
		console.log(error);
	}
};

export const createAnalyzedData = async (analyzedData: any) => {
	try {
		const result = await prisma.analyzedTransaction.create({
			data: analyzedData,
		});

		return result;
	} catch (error) {
		console.log(error);
	}
};
