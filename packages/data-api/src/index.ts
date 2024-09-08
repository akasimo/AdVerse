import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import createHttpError from 'http-errors';

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a GET route that takes a wallet address as a URL parameter
app.get('/wallet/:address', async (req: Request, res: Response) => {
	try {
		console.log(req.params);
		// Extract the wallet address from the URL parameters
		const { address } = req.params;

		// Call the external API (indexer) with Axios
		console.log(`Hello from ${address}`);

		// Process the response from the indexer API
		// const indexerData = indexerResponse.data;

		// Custom logic to handle the indexer data

		// Send back the processed data
		res.json({
			success: true,
			data: 'hello',
		});
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

app.post(
	'/wallet/transactions',
	async (req: Request, res: Response) => {
		try {
			// Data will be an array of TransactionDetail objects
			const transactions = req.body;

			const result = await prisma.transactionDetail.createMany({
				data: transactions,
			});

			res.send({
				result,
			});
		} catch (error) {
			throw createHttpError[500]('Error while creating transactions');
		}
	}
);

app.post(
	'/wallet/analyzed-transaction',
	async (req: Request, res: Response) => {
		try {
			// Data will be an array of TransactionDetail objects
			const analyzed_transaction = req.body;

			const result = await prisma.transactionDetail.create({
				data: analyzed_transaction,
			});

			res.send({
				result,
			});
		} catch (error) {
			throw createHttpError[500]('Error while creating transactions');
		}
	}
);

app.listen(port, () => {
	console.log(`API server listening on port ${port}`);
});
