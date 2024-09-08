import path from 'path';
import { WalletAnalysis } from './defines';
import fs from 'fs/promises';

const platformInfo = {
    TENSOR: "A decentralized NFT marketplace on Solana, known for its sleek interface and focus on digital art collections.",
    JUPITER: "A key DeFi aggregator in the Solana ecosystem, offering efficient token swaps and liquidity provision.",
    RAYDIUM: "A leading automated market maker (AMM) and decentralized exchange (DEX) on Solana, known for its yield farming opportunities."
};

function reformatAnalysis(analysis: WalletAnalysis): any {
    const now = new Date();
    const lastActivityDate = new Date(analysis.lastActivityTimestamp);
    const firstActivityDate = new Date(analysis.activityPeriod.start);
    
    const daysSinceLastActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 3600 * 24));
    const daysSinceFirstActivity = Math.floor((now.getTime() - firstActivityDate.getTime()) / (1000 * 3600 * 24));

    const lastActivityString = daysSinceLastActivity === 1 ? "1 day ago" : `${daysSinceLastActivity} days ago`;

    return {
        programUsage: analysis.programUsage,
        interactionTypes: analysis.interactionTypes,
        categories: analysis.categories,
        nftActivity: analysis.nftActivity,
        lastActivity: lastActivityString,
        totalTransactions: analysis.totalTransactions,
        mostUsedProgram: analysis.mostUsedProgram,
        mostFrequentInteraction: analysis.mostFrequentInteraction,
        firstActivityDate,
        programFrequency: analysis.programFrequency,
        averageTransactionsPerDay: analysis.averageTransactionsPerDay,
        riskLevel: analysis.riskLevel,
        activityRecency: analysis.activityRecency,
        spendingBehavior: analysis.spendingBehavior,
        userTags: analysis.userTags,
    };
}

export function generatePromptFromAnalysis(analysis: WalletAnalysis): string {
    const processedAnalysis = reformatAnalysis(analysis);
    const relevantPlatforms = Object.entries(platformInfo)
        .filter(([platform]) => analysis.programUsage.hasOwnProperty(platform))
        .map(([platform, info]) => `- ${platform}: ${info}`)
        .join('\n');

    const promptText = `
    User Data: ${JSON.stringify(processedAnalysis, null, 2)}

    Platform Information:
    ${relevantPlatforms}

    Prompt Creation Guidelines:
    - Begin with a vast, surreal landscape representing the Solana ecosystem, filled with abstract structures and floating symbols
    - Incorporate a shimmering, ethereal path that seems to fade in and out of existence, bearing traces of past movement
    - Create abstract, morphing elements that represent different platforms and activities, showing signs of recent interaction (e.g., rippling portals for TENSOR, gently pulsating streams for JUPITER)
    - Use ethereal color schemes that shift based on the most used platforms, with traces of fading hues representing past activities
    - Depict the passage of time through suspended, frozen moments or gently decaying structures that hint at past events
    - Reflect the user's risk level and spending behavior through the landscape's terrain, showing evidence of past decisions (e.g., eroded cliffs for high risk, serene pools with spreading ripples for conservative behavior)
    - Incorporate the user's tags as abstract glyphs or symbols that appear to be slowly dissolving or reforming in the dreamscape
    - Add subtle elements that suggest a recent presence, like floating particles, gentle distortions, or fading echoes

    Style and Technical Considerations:
    - Style: Surrealism, digital art, dreamscape with a touch of melancholy or nostalgia
    - Artists: Salvador Dali, Yves Tanguy, Android Jones, with influences from Remedios Varo
    - Parameters: High detail, sharp focus, volumetric lighting, subtle motion blur
    - Use specific Stable Diffusion syntax for better results (e.g., weights, emphasis)
    - Ensure the image conveys a sense of a journey completed, with lingering energy and fading memories

    IMPORTANT: Your response must ONLY contain the Stable Diffusion prompt. Do not include any explanations, introductions, or additional text. The entire response should be the prompt itself, ready to be used directly in a Stable Diffusion model. Any text that is not part of the prompt will be considered an error.`;

    return promptText;
}

export async function loadAnalysisFile(walletAddress: string): Promise<WalletAnalysis> {
    const fileName = `analysis_${walletAddress}.json`;
    const filePath = path.join(__dirname, fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as WalletAnalysis;
}

// async function main() {
//     try {
//         // You would typically get this from command line arguments or environment variables
//         const walletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';

//         const analysis = await loadAnalysisFile(walletAddress);
//         const promptText = generatePromptFromAnalysis(analysis);

//         console.log('Generated LLM Prompt:');
//         console.log(promptText);

//         // Here you would pass the promptText to your LLM of choice
//         // For example:
//         // const llmResponse = await sendToLLM(promptText);
//         // console.log('LLM Response:', llmResponse);

//     } catch (error) {
//         console.error('Error generating LLM prompt:', error);
//     }
// }

// main();