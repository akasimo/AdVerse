import fs from 'fs/promises';
import path from 'path';
import { SimplifiedTransaction, WalletAnalysis } from './defines';
import { printAnalysis } from './utils';
import { createAnalyzedData } from "../../packages/data-api/utils";
import dotenv from 'dotenv';

dotenv.config();

async function loadJsonFile(filename: string): Promise<SimplifiedTransaction[]> {
  const filePath = path.join(__dirname, filename);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

function analyzeTransactions(transactions: SimplifiedTransaction[], ownerWalletAddress: string): [WalletAnalysis, string] {
  const filteredTransactions = transactions.filter(tx => tx.feePayer === ownerWalletAddress);
  
  const analysis: WalletAnalysis = {
    walletAddress: ownerWalletAddress,
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
    riskLevel: 'Unknown',
    activityRecency: 'Unknown',
    spendingBehavior: 'Unknown',
    userTags: [],
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

  // Risk Level and Spending Behavior
  const tradeFrequency = analysis.totalTransactions / totalDaysBetween;
  if (tradeFrequency > 5) {
    analysis.riskLevel = 'High';
    analysis.spendingBehavior = 'High Spender';
    analysis.userTags.push('Degen');
  } else if (tradeFrequency > 1) {
    analysis.riskLevel = 'Medium';
    analysis.spendingBehavior = 'Moderate Spender';
  } else {
    analysis.riskLevel = 'Low';
    analysis.spendingBehavior = 'Low Spender';
    analysis.userTags.push('Normie');
  }

  // Activity Recency
  const daysSinceLastActivity = (Date.now() / 1000 - analysis.lastActivityTimestamp) / (24 * 60 * 60);
  if (daysSinceLastActivity < 1) {
    analysis.activityRecency = 'Very Recent (Last 24 hours)';
  } else if (daysSinceLastActivity < 7) {
    analysis.activityRecency = 'Recent (Last Week)';
  } else if (daysSinceLastActivity < 30) {
    analysis.activityRecency = 'Moderate (Last Month)';
  } else {
    analysis.activityRecency = 'Inactive (Over a Month)';
  }

  // User Tags
  if (analysis.categories['NFT'] && analysis.categories['NFT'] > 10) {
    analysis.userTags.push('NFT Trader');
  }
  if (analysis.categories['DeFi'] && analysis.categories['DeFi'] > 5) {
    analysis.userTags.push('DeFi Participant');
  }
  if (analysis.totalTransactions < 10 && totalDaysBetween > 30) {
    analysis.userTags.push('Low Activity');
  }

  // New code for description analysis
  const descriptionMap: { [key: string]: number } = {};
  transactions.forEach(tx => {
    const description = tx.description.split(' ').slice(1).join(' ');
    descriptionMap[description] = (descriptionMap[description] || 0) + 1;
  });

  const combinedDescriptions = Object.entries(descriptionMap)
    .map(([desc, count]) => `${desc}${count > 1 ? ` (done ${count} times)` : ''}`)
    .join('\n');

  return [analysis, combinedDescriptions];
}

async function writeAnalysisToFile(analysis: WalletAnalysis, walletAddress: string) {
    const fileName = `analysis_${walletAddress}.json`;
    const filePath = path.join(__dirname, fileName);
    await fs.writeFile(filePath, JSON.stringify(analysis, null, 2));
    console.log(`Analysis written to ${fileName}`);
}

async function writeDescriptionsToFile(descriptions: string, walletAddress: string) {
  const fileName = `descriptions_${walletAddress}.txt`;
  const filePath = path.join(__dirname, fileName);
  await fs.writeFile(filePath, descriptions);
  console.log(`Descriptions written to ${fileName}`);
}

async function main() {
//   const jsonFilename = 'transactions_D3HaM2LdkdRGZUQcFvVeaEvgC3NTPFyFXRdSeFmsT52G.json';
//   const ownerWalletAddress = 'D3HaM2LdkdRGZUQcFvVeaEvgC3NTPFyFXRdSeFmsT52G';
  const jsonFilename = 'transactions_8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh.json';
  const ownerWalletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';

  try {
    const transactions = await loadJsonFile(jsonFilename);
    console.log(`Total transactions in JSON: ${transactions.length}`);

    const [analysis, combinedDescriptions] = analyzeTransactions(transactions, ownerWalletAddress);
    printAnalysis(analysis);
    await createAnalyzedData(analysis);
    await writeAnalysisToFile(analysis, ownerWalletAddress);
    await writeDescriptionsToFile(combinedDescriptions, ownerWalletAddress);

  } catch (error) {
    console.error('Error analyzing transactions:', error);
  }
}

main();