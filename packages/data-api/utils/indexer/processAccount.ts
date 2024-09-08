import { processAnalysis } from "./analyzeTransaction";
import { WalletAnalysis } from "./defines";
import { generatePromptFromAnalysis } from "./generatePromptFromAnalysis";
import { processWalletTransactions } from "./getTransactions";
import { generatePromptFromGpt } from "./generatePromptFromGpt";
import { generateImageViaDiffusion } from "./generateImage";

export async function processAccount(walletAddress: string): Promise<WalletAnalysis | null> {
    const simplifiedTxData = await processWalletTransactions(walletAddress);
    if (!simplifiedTxData) {
        console.error(`No transactions found for wallet ${walletAddress}`);
        return null;
    }
    const analysis = await processAnalysis(simplifiedTxData, walletAddress);
    if (!analysis) {
        console.error(`No analysis found for wallet ${walletAddress}`);
        return null;
    }
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

// async function main() {
//     const wallet = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';
//     await processAccount(wallet);
// }

// main();