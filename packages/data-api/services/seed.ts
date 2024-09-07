import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Create Wallets
	const wallet1 = await prisma.wallet.create({
		data: {
			address: '3DRvEtH5zZcU5c6dUS8Yf93Z9bJ3vHR5trMnP7TYFvY7',
		},
	});

	const wallet2 = await prisma.wallet.create({
		data: {
			address: '2AhkPz3sXjJ9zY3N4Vb9eL3k8c7M4Jz6xQ8Tf6RG5n8H',
		},
	});

	// Create Transaction Details
	await prisma.transactionDetail.createMany({
		data: [
			{
				description: 'Payment for services',
				type: 'Payment',
				source: 'Contract',
				feePayer: wallet1.address,
				walletAddress: wallet1.address,
				signature: 'sig1',
				slot: 1,
				timestamp: 1672531200,
			},
			{
				description: 'Refund',
				type: 'Refund',
				source: 'Contract',
				feePayer: wallet2.address,
				walletAddress: wallet2.address,
				signature: 'sig2',
				slot: 2,
				timestamp: 1672617600,
			},
		],
	});

	// Create Analyzed Transactions
	await prisma.analyzedTransaction.createMany({
		data: [
			{
				walletAddress: wallet1.address,
				programList: ['TENSOR', 'SYSTEM_PROGRAM'],
				programUsage: { TENSOR: 260, SYSTEM_PROGRAM: 62 },
				interactionTypes: { NFT_LISTING: 115, TRANSFER: 62 },
				categories: { NFT: 117, Other: 224 },
				nftActivity: { listings: 115, purchases: 1 },
				lastActivityTimestamp: 1672617600,
				totalTransactions: 10,
				mostUsedProgram: 'TENSOR',
				mostFrequentInteraction: 'NFT_LISTING',
				activityPeriod: { start: 1672531200, end: 1672617600 },
				programFrequency: { TENSOR: 6.529, SYSTEM_PROGRAM: 1.595 },
				averageTransactionsPerDay: 1.5,
				riskLevel: 'Low',
				activityRecency: 'Recent',
				spendingBehavior: 'Frequent',
				userTags: ['Active', 'High Value'],
			},
			{
				walletAddress: wallet2.address,
				programList: ['SYSTEM_PROGRAM'],
				programUsage: { SYSTEM_PROGRAM: 62 },
				interactionTypes: { TRANSFER: 62 },
				categories: { Other: 224 },
				nftActivity: { listings: 0, purchases: 0 },
				lastActivityTimestamp: 1672617600,
				totalTransactions: 5,
				mostUsedProgram: 'SYSTEM_PROGRAM',
				mostFrequentInteraction: 'TRANSFER',
				activityPeriod: { start: 1672531200, end: 1672617600 },
				programFrequency: { SYSTEM_PROGRAM: 2.5 },
				averageTransactionsPerDay: 1.0,
				riskLevel: 'Medium',
				activityRecency: 'Moderate',
				spendingBehavior: 'Occasional',
				userTags: ['Moderate', 'Low Value'],
			},
		],
	});

	console.log('Seeding completed');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
