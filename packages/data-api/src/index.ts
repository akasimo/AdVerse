import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a GET route that takes a wallet address as a URL parameter
app.post('/analyze-wallet', async (req: Request, res: Response) => {
	try {
		// Extract the wallet address from the URL parameters
		const { walletAddress } = req.body;
		console.log(walletAddress);

		const wallet = await prisma.wallet.findUnique({
			where: {
				address: walletAddress,
			},
		});

		if (!wallet) {
			// TODO:Start indexing logic
			await prisma.wallet.create({
				data: {
					address: walletAddress,
				},
			});
			// const result = await processAccount();
			// res.send(result);
			res.status(500).send('No wallet yet');
		} else {
			const result = await prisma.analyzedTransaction.findUnique({
				where: {
					walletAddress: wallet.address,
				},
			});

			res.send(result);
		}
	} catch (error: any) {
		console.error('Error calling indexer API', error);

		// Handle any errors that occur during the API call
		res.status(500).json({
			success: false,
			message: 'Error handling indexer logic',
			error: error.message,
		});
	}
});

app.listen(port, () => {
	console.log(`API server listening on port ${port}`);
});
