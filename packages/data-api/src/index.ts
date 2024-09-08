import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import {
	processAccount,
	generateImage,
} from '../utils/indexer/processAccount';
import { WalletAnalysis } from '../utils/indexer/defines';

const app = express();
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();
dotenv.config();

app.use(express.json());
app.use(cors());
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
			console.log('Starting indexing logic');
			const result = await processAccount(walletAddress);
			console.log('result received');
			res.send(result);
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

app.post('/generate-image', async (req: Request, res: Response) => {
	try {
		const { analysis } = req.body;
		console.log(analysis);

		if (!analysis || typeof analysis !== 'object') {
			throw createHttpError(400, 'Invalid or missing analysis data');
		}

		const image = await generateImage(analysis as WalletAnalysis);

		if (!image) {
			throw createHttpError(500, 'Failed to generate image');
		}

		res.json({ success: true, image });
	} catch (error: any) {
		console.error('Error generating image', error);
		res.status(error.status || 500).json({
			success: false,
			message: 'Error generating image',
			error: error.message,
		});
	}
});

app.listen(port, () => {
	console.log(`API server listening on port ${port}`);
});
