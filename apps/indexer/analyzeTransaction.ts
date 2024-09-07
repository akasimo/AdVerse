import fs from 'fs/promises';
import path from 'path';
import { SimplifiedTransaction, WalletAnalysis } from './defines';

async function loadJsonFile(filename: string): Promise<SimplifiedTransaction[]> {
  const filePath = path.join(__dirname, filename);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

function analyzeTransactions(transactions: SimplifiedTransaction[], ownerWalletAddress: string): WalletAnalysis {
  const filteredTransactions = transactions.filter(tx => tx.feePayer === ownerWalletAddress);
  
  const analysis: WalletAnalysis = {
    programList: [],
    programUsage: {},
    interactionTypes: {},
    categories: {},
    nftActivity: { listings: 0, purchases: 0 },
    lastActivityTimestamp: 0
  };

  filteredTransactions.forEach(tx => {
    // Program List and Usage
    if (!analysis.programList.includes(tx.source)) {
      analysis.programList.push(tx.source);
    }
    analysis.programUsage[tx.source] = (analysis.programUsage[tx.source] || 0) + 1;

    // Interaction Types
    analysis.interactionTypes[tx.type] = (analysis.interactionTypes[tx.type] || 0) + 1;

    // Categories (simplified, based on type)
    let category = 'Other';
    if (tx.type.includes('NFT')) category = 'NFT';
    else if (tx.type.includes('SWAP')) category = 'DeFi';
    analysis.categories[category] = (analysis.categories[category] || 0) + 1;

    // NFT Activity
    if (tx.type === 'NFT_LISTING') analysis.nftActivity.listings++;
    if (tx.type === 'NFT_SALE') analysis.nftActivity.purchases++;

    // Last Activity Timestamp
    analysis.lastActivityTimestamp = Math.max(analysis.lastActivityTimestamp, tx.timestamp);
  });

  return analysis;
}

function printAnalysis(analysis: WalletAnalysis) {
  console.log('Program List:', analysis.programList);
  console.log('Program Usage:', analysis.programUsage);
  console.log('Interaction Types:', analysis.interactionTypes);
  console.log('Categories:', analysis.categories);
  console.log('NFT Activity:', analysis.nftActivity);
  console.log('Last Activity:', new Date(analysis.lastActivityTimestamp * 1000).toISOString());
}

async function main() {
  const jsonFilename = 'transactions_8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh.json';
  const ownerWalletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';

  try {
    const transactions = await loadJsonFile(jsonFilename);
    console.log(`Total transactions in JSON: ${transactions.length}`);

    const analysis = analyzeTransactions(transactions, ownerWalletAddress);
    printAnalysis(analysis);
  } catch (error) {
    console.error('Error analyzing transactions:', error);
  }
}

main();