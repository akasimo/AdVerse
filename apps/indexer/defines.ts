export interface HeliusTransaction {
    description: string;
    type: string;
    source: string;
    feePayer: string;
    signature: string;
    slot: number;
    timestamp: number;
    // Add any other properties that might be in the full HeliusTransaction
}
  
export interface SimplifiedTransaction {
    description: string;
    type: string;
    source: string;
    feePayer: string;
    signature: string;
    slot: number;
    timestamp: number;
}
  
export interface WalletAnalysis {
    programList: string[];
    programUsage: { [program: string]: number };
    interactionTypes: { [type: string]: number };
    categories: { [category: string]: number };
    nftActivity: { listings: number, purchases: number };
    lastActivityTimestamp: number;
    totalTransactions: number;
    mostUsedProgram: string;
    mostFrequentInteraction: string;
    activityPeriod: { start: number; end: number };
    programFrequency: { [program: string]: number };
    averageTransactionsPerDay: number;
  }