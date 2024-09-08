import OpenAI from "openai";
import dotenv from 'dotenv';
import { ChatCompletion } from "openai/resources";
import { generatePromptFromAnalysis, loadAnalysisFile } from "./generatePromptFromAnalysis";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey});

// const openai = new OpenAIApi(configuration);

export async function generatePromptFromGpt(initialPrompt: string): Promise<string | null> {
  try {
    const response: ChatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant tasked with creating a Stable Diffusion image generation prompt that visualizes an ethereal Solana ecosystem as a surreal dreamscape, bearing the subtle imprints of a profound journey that has already transpired. This prompt should evoke a sense of lingering presence, echoes of past interactions, and the residual energy of completed transactions, all without depicting human figures. Use the following data and guidelines to craft your prompt:"
        },
        {
          role: "user",
          content: `Improve this prompt for Stable Diffusion: "${initialPrompt}"`
        }
      ],
      max_tokens: 200,
      n: 1,
      temperature: 0.7,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message?.content?.trim() || null;
    } else {
      console.error("No response from GPT-4");
      return null;
    }
  } catch (error) {
    console.error("Error in promptToGpt:", error);
    return null;
  }
}

// async function main() {
//     try {
//         // You would typically get this from command line arguments or environment variables
//         const walletAddress = '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh';

//         const analysis = await loadAnalysisFile(walletAddress);
//         const promptText = generatePromptFromAnalysis(analysis);

//         const response = await generatePromptFromGpt(promptText);
//         console.log(response);

//     } catch (error) {
//         console.error('Error generating LLM prompt:', error);
//     }
// }

// main();


