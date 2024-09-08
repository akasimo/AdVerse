import dotenv from 'dotenv';
import Replicate from "replicate";

dotenv.config();

export async function generateImageViaDiffusion(prompt: string): Promise<string | null> {
    const replicate = new Replicate();
    const REPLICATE_ENDPOINT = "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";

    const input = {
        prompt,
        scheduler: "K_EULER"
    };
    
    const output = await replicate.run(REPLICATE_ENDPOINT, { input });
    console.log(output)
    return null;
}

