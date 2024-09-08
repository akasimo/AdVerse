export interface HeliusTransaction {
    description: string;
    type: string;
    source: string;
    feePayer: string;
    signature: string;
    slot: number;
    timestamp: number;
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
    walletAddress: string;
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
    riskLevel: string;
    activityRecency: string;
    spendingBehavior: string;
    userTags: string[];
}