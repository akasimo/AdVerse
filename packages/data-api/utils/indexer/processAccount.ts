import { processAnalysis } from "./analyzeTransaction";
import { WalletAnalysis } from "./defines";
import { generatePromptFromAnalysis } from "./generatePromptFromAnalysis";
import { processWalletTransactions } from "./getTransactions";
import { generatePromptFromGpt } from "./generatePromptFromGpt";
import { generateImageViaDiffusion } from "./generateImage";

export async function processAccount(walletAddress: string): Promise<WalletAnalysis | null> {
    console.log("Processing account", walletAddress);
    console.log("requesting and parsing each tx");
    const simplifiedTxData = await processWalletTransactions(walletAddress);
    if (!simplifiedTxData) {
        console.error(`No transactions found for wallet ${walletAddress}`);
        return null;
    }
    console.log("analyzing each tx");
    const analysis = await processAnalysis(simplifiedTxData, walletAddress);
    if (!analysis) {
        console.error(`No analysis found for wallet ${walletAddress}`);
        return null;
    }
    console.log("analyzed");
    return analysis;
}

export async function generateImage(analysis: WalletAnalysis): Promise<string | null> {
    const promptFromAnalysis = generatePromptFromAnalysis(analysis);
    if (!prompt) {
        console.error("No prompt found for wallet");
        return null;
    }
    const promptFromGpt = await generatePromptFromGpt(promptFromAnalysis);
    if (!promptFromGpt) {
        console.error("No prompt found for wallet");
        return null;
    }
    const image = await generateImageViaDiffusion(promptFromGpt);
    return image;
}

export function calculateDegenScore(analysis: WalletAnalysis): number {
    let score = 0;

    // High transaction volume
    score += Math.min(analysis.totalTransactions / 10, 20);

    // High average transactions per day
    score += Math.min(analysis.averageTransactionsPerDay * 2, 20);

    // NFT activity
    const nftActivityScore = (analysis.nftActivity.listings + analysis.nftActivity.purchases) / 5;
    score += Math.min(nftActivityScore, 20);

    // Risk level
    if (analysis.riskLevel === "High") score += 15;
    else if (analysis.riskLevel === "Medium") score += 7;

    // Activity recency
    if (analysis.activityRecency.includes("Last 24 hours")) score += 10;
    else if (analysis.activityRecency.includes("Last week")) score += 5;

    // Spending behavior
    if (analysis.spendingBehavior === "High Spender") score += 15;

    // User tags
    if (analysis.userTags.includes("Degen")) score += 10;
    if (analysis.userTags.includes("NFT Trader")) score += 5;

    // Normalize score to 0-100 range
    return Math.min(Math.round(score), 100);
}

// async function main() {
//     const wallet = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';
//     await processAccount(wallet);
// }

// main();