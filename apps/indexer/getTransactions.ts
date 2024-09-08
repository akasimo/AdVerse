import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { HeliusTransaction, SimplifiedTransaction } from './defines';
import { createTransactions } from "../../packages/data-api/utils";

// Load environment variables from .env file
dotenv.config();

const MAX_BATCHES = 8; // Define the maximum number of batches to fetch

class SolanaIndexer {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api-mainnet.helius-rpc.com/v0';
    // this.baseUrl = 'https://api.helius.xyz/v0';
  }

  async getAllTransactions(walletAddress: string, limit: number = 100): Promise<HeliusTransaction[]> {
    let allTransactions: HeliusTransaction[] = [];
    let lastSignature: string | null = null;
    let batchCount = 0;

    while (batchCount < MAX_BATCHES) {
      try {
        let url = `${this.baseUrl}/addresses/${walletAddress}/transactions?api-key=${this.apiKey}&limit=${limit}`;
        if (lastSignature) {
          url += `&before=${lastSignature}`;
        }

        const response = await axios.get(url);
        const transactions: HeliusTransaction[] = response.data;

        if (transactions.length === 0) {
          console.log("No more transactions available.");
          break;
        }

        allTransactions = allTransactions.concat(transactions);
        lastSignature = transactions[transactions.length - 1].signature;
        batchCount++;

        console.log(`Fetched batch ${batchCount} (${transactions.length} transactions)`);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
    }

    return allTransactions;
  }
}

async function saveToJsonFile(simplifiedData: SimplifiedTransaction[], filename: string): Promise<void> {

  const filePath = path.join(__dirname, filename);
  await fs.writeFile(filePath, JSON.stringify(simplifiedData, null, 2));
  console.log(`Data saved to ${filePath}`);
}

async function processWalletTransactions(indexer: SolanaIndexer, walletAddress: string): Promise<void> {
  try {
    const transactions = await indexer.getAllTransactions(walletAddress);
    // console.log(`Retrieved ${transactions.length} transactions for wallet ${walletAddress}`);
    
    // Save transactions to a JSON file
    const simplifiedData: SimplifiedTransaction[] = transactions.map(tx => ({
      description: tx.description,
      type: tx.type,
      source: tx.source,
      feePayer: tx.feePayer,
      signature: tx.signature,
      slot: tx.slot,
      timestamp: tx.timestamp,
    }));

    await saveToJsonFile(simplifiedData, `transactions_${walletAddress}.json`);
    await createTransactions(simplifiedData);
    
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