import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

interface HeliusTransaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  // Add other fields as needed
}

interface SimplifiedTransaction {
  description: string;
  type: string;
  source: string;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
}

class SolanaIndexer {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api-mainnet.helius-rpc.com/v0';
    // this.baseUrl = 'https://api.helius.xyz/v0';
  }

  async getLastTransactions(walletAddress: string, limit: number = 100): Promise<HeliusTransaction[]> {
    try {
      const url = `${this.baseUrl}/addresses/${walletAddress}/transactions?api-key=${this.apiKey}&limit=${limit}`;
      console.log(url);
      // throw new Error('test'); 
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}

async function saveToJsonFile(data: HeliusTransaction[], filename: string): Promise<void> {
  const simplifiedData: SimplifiedTransaction[] = data.map(tx => ({
    description: tx.description,
    type: tx.type,
    source: tx.source,
    feePayer: tx.feePayer,
    signature: tx.signature,
    slot: tx.slot,
    timestamp: tx.timestamp,
  }));

  const filePath = path.join(__dirname, filename);
  await fs.writeFile(filePath, JSON.stringify(simplifiedData, null, 2));
  console.log(`Data saved to ${filePath}`);
}

async function processWalletTransactions(indexer: SolanaIndexer, walletAddress: string): Promise<void> {
  try {
    const transactions = await indexer.getLastTransactions(walletAddress);
    console.log(`Retrieved ${transactions.length} transactions for wallet ${walletAddress}`);
    
    // Save transactions to a JSON file
    await saveToJsonFile(transactions, `transactions_${walletAddress}.json`);
    
    // Process transactions as needed
    transactions.forEach((tx, index) => {
      console.log(`Transaction ${index + 1}:`, tx.signature);
    });
  } catch (error) {
    console.error(`Error processing transactions for wallet ${walletAddress}:`, error);
  }
}

async function main() {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    throw new Error('HELIUS_API_KEY is not defined in the .env file');
  }

  const indexer = new SolanaIndexer(apiKey);
  
  const walletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';
  
  await processWalletTransactions(indexer, walletAddress);
}

main();