import path from 'path';
import { WalletAnalysis } from './defines';
import fs from 'fs/promises';

const platformInfo = {
  TENSOR: "A decentralized NFT marketplace on Solana, known for its sleek interface and focus on digital art collections.",
  JUPITER: "A key DeFi aggregator in the Solana ecosystem, offering efficient token swaps and liquidity provision.",
  RAYDIUM: "A leading automated market maker (AMM) and decentralized exchange (DEX) on Solana, known for its yield farming opportunities."
};

export function generateLLMPrompt(analysis: WalletAnalysis): string {
    const promptText = `
  You are an AI assistant tasked with creating a Stable Diffusion image generation prompt that visualizes a user's journey through the Solana ecosystem. Use the following structure to craft your prompt:
  
  1. User Data:
  ${JSON.stringify(analysis, null, 2)}
  
  2. Platform Information:
  - TENSOR: ${platformInfo.TENSOR}
  - JUPITER: ${platformInfo.JUPITER}
  - RAYDIUM: ${platformInfo.RAYDIUM}
  
  3. Prompt Creation Guidelines:
  - Start with a base scene description that represents the Solana ecosystem
  - Incorporate visual elements that represent the user's most frequent activities
  - Use metaphors or symbols to represent different interaction types
  - Include color schemes or visual styles associated with the most used platforms
  - Represent the user's journey chronologically or by activity frequency
  - Add elements that reflect the user's risk level and spending behavior
  - Incorporate visual representations of the user tags
  
  4. Technical Considerations:
  - Use specific Stable Diffusion syntax for better results (e.g., weights, emphasis)
  - Include style cues (e.g., digital art, abstract, photorealistic)
  - Specify any particular artists or art styles to emulate
  - Add parameters for image quality and detail level
  
  Based on the above information, create a detailed and evocative Stable Diffusion prompt that will generate an image representing this user's unique journey through the Solana ecosystem. The prompt should be engaging, specific, and structured to produce a high-quality, coherent image that accurately reflects the user's activity and the nature of the platforms they interact with.
  `;
  
    return promptText;
  }

async function loadAnalysisFile(walletAddress: string): Promise<WalletAnalysis> {
const fileName = `analysis_${walletAddress}.json`;
const filePath = path.join(__dirname, fileName);
const fileContent = await fs.readFile(filePath, 'utf-8');
return JSON.parse(fileContent) as WalletAnalysis;
}

async function main() {
try {
    // You would typically get this from command line arguments or environment variables
    const walletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';
    
    const analysis = await loadAnalysisFile(walletAddress);
    const promptText = generateLLMPrompt(analysis);
    
    console.log('Generated LLM Prompt:');
    console.log(promptText);

    // Here you would pass the promptText to your LLM of choice
    // For example:
    // const llmResponse = await sendToLLM(promptText);
    // console.log('LLM Response:', llmResponse);

} catch (error) {
    console.error('Error generating LLM prompt:', error);
}
}

main();