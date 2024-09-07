import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

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
		const processedData = processIndexerData('hello');

		// Send back the processed data
		res.json({
			success: true,
			data: processedData,
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

// Function to process the data you get from the indexer
function processIndexerData(data: any) {
	// Example: Modify or filter the indexer data here
	return data; // Modify as needed
}

app.listen(port, () => {
	console.log(`API server listening on port ${port}`);
});
