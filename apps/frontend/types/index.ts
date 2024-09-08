interface UserActivity {
  id: string; // Unique identifier for the activity record
  walletAddress: string; // Address of the wallet
  programList: string[]; // List of programs
  programUsage: { [key: string]: number }; // Usage statistics of programs
  interactionTypes: { [key: string]: number }; // Interaction types and their counts
  categories: { [key: string]: number }; // Categories and their counts
  nftActivity: {
    listings: number; // Number of NFT listings
    purchases: number; // Number of NFT purchases
  };
  lastActivityTimestamp: number; // Unix timestamp of the last activity
  totalTransactions: number; // Total number of transactions
  mostUsedProgram: string; // Most used program
  mostFrequentInteraction: string; // Most frequent interaction type
  activityPeriod: {
    start: number; // Unix timestamp for the start of the activity period
    end: number; // Unix timestamp for the end of the activity period
  };
  programFrequency: { [key: string]: number }; // Frequency of programs
  averageTransactionsPerDay: number; // Average number of transactions per day
  riskLevel: string; // Risk level description
  activityRecency: string; // Recency of activity
  spendingBehavior: string; // Spending behavior description
  userTags: string[]; // Tags associated with the user
}
