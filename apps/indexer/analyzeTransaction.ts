import fs from 'fs/promises';
import path from 'path';
import { SimplifiedTransaction, WalletAnalysis } from './defines';
import { printAnalysis } from './utils';

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
    lastActivityTimestamp: 0,
    totalTransactions: filteredTransactions.length,
    mostUsedProgram: '',
    mostFrequentInteraction: '',
    activityPeriod: { start: Infinity, end: 0 },
    programFrequency: {},
    averageTransactionsPerDay: 0,
  };

  const programFirstLast: { [program: string]: { first: number, last: number } } = {};

  filteredTransactions.forEach(tx => {
    // Program List and Usage
    if (!analysis.programList.includes(tx.source)) {
      analysis.programList.push(tx.source);
      programFirstLast[tx.source] = { first: tx.timestamp, last: tx.timestamp };
    } else {
      programFirstLast[tx.source].first = Math.min(programFirstLast[tx.source].first, tx.timestamp);
      programFirstLast[tx.source].last = Math.max(programFirstLast[tx.source].last, tx.timestamp);
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

    // Activity period
    analysis.activityPeriod.start = Math.min(analysis.activityPeriod.start, tx.timestamp);
    analysis.activityPeriod.end = Math.max(analysis.activityPeriod.end, tx.timestamp);
  });

  // Calculate program frequency (uses per day)
  for (const program of analysis.programList) {
    const usage = analysis.programUsage[program];
    const timeSpan = programFirstLast[program].last - programFirstLast[program].first;
    const daysBetween = timeSpan / (24 * 60 * 60) + 1; // Add 1 to include both first and last day
    analysis.programFrequency[program] = Number((usage / daysBetween).toFixed(3));
  }

  // Calculate average transactions per day
  const totalDaysBetween = (analysis.activityPeriod.end - analysis.activityPeriod.start) / (24 * 60 * 60) + 1;
  analysis.averageTransactionsPerDay = Number((analysis.totalTransactions / totalDaysBetween).toFixed(3));

  // Determine most used program and most frequent interaction
  analysis.mostUsedProgram = Object.entries(analysis.programUsage).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  analysis.mostFrequentInteraction = Object.entries(analysis.interactionTypes)
    .filter(([key]) => key !== 'UNKNOWN')
    .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0];

  return analysis;
}

async function main() {
  const jsonFilename = 'transactions_8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh.json';
  const ownerWalletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';

  try {
    const transactions = await loadJsonFile(jsonFilename);
    console.log(`Total transactions in JSON: ${transactions.length}`);

    const analysis = analyzeTransactions(transactions, ownerWalletAddress);
    // console.log(analysis);
    printAnalysis(analysis);
  } catch (error) {
    console.error('Error analyzing transactions:', error);
  }
}

main();