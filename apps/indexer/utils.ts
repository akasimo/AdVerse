import { WalletAnalysis } from "./defines";

export function printAnalysis(analysis: WalletAnalysis) {
    console.log('Program List:', analysis.programList);
    console.log('Program Usage:', analysis.programUsage);
    console.log('Interaction Types:', analysis.interactionTypes);
    console.log('Categories:', analysis.categories);
    console.log('NFT Activity:', analysis.nftActivity);
    console.log('Last Activity:', new Date(analysis.lastActivityTimestamp * 1000).toISOString());
    console.log('Total Transactions:', analysis.totalTransactions);
    console.log('Most Used Program:', analysis.mostUsedProgram);
    console.log('Most Frequent Interaction:', analysis.mostFrequentInteraction);
    console.log('Activity Period:', {
      start: new Date(analysis.activityPeriod.start * 1000).toISOString(),
      end: new Date(analysis.activityPeriod.end * 1000).toISOString()
    });
    
    console.log('Average Transactions per Day:', analysis.averageTransactionsPerDay);
    
    console.log('Program Frequency (average uses per day):');
    for (const [program, frequency] of Object.entries(analysis.programFrequency)) {
      console.log(`  ${program}: ${frequency} times per day`);
    }
  }