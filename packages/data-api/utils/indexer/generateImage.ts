import dotenv from 'dotenv';
import Replicate from "replicate";

dotenv.config();

export async function generateImageViaDiffusion(prompt: string): Promise<string | null> {
    console.log('auth key:', process.env.REPLICATE_API_TOKEN);
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN
    });

    // https://replicate.delivery/yhqm/hHfoJusiwaRwdSwlZhI9Oas9ZePVFGAr3oZNVc4cLugqctaTA/R8_SD3_00001_.webp
    const REPLICATE_ENDPOINT = "stability-ai/stable-diffusion-3";

    // https://replicate.delivery/pbxt/ilGN8zahi84VKRgse2uxmTk13c7RpnfJ1FfSi2GXNq4Uf1qNB/out-0.png
    // const REPLICATE_ENDPOINT = "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc";

    const input = {
        prompt,
        scheduler: "K_EULER"
    };
    
    const output = await replicate.run(REPLICATE_ENDPOINT, { input });
    console.log(output)
    return null;
}


// async function main() {
//     try {
//         // You would typically get this from command line arguments or environment variables
//         const prompt = "A vast, surreal landscape representing the Solana ecosystem, filled with abstract structures and floating symbols. A shimmering, ethereal path fades in and out of existence, bearing traces of past movement. Abstract, morphing elements represent different platforms and activities, with rippling portals for TENSOR and gently pulsating streams. Ethereal color schemes shift based on the most used platforms, with traces of fading hues representing past activities. The passage of time is depicted through suspended, frozen moments and gently decaying structures that hint at past events. The landscape's terrain reflects high risk and spending behavior, with eroded cliffs and serene pools with spreading ripples. Abstract glyphs or symbols representing the user's tags slowly dissolve and reform in the dreamscape. Subtle elements suggest a recent presence, with floating particles, gentle distortions, and fading echoes. Style: Surrealism, digital art, dreamscape with a touch of melancholy or nostalgia. High detail, sharp focus, volumetric lighting, subtle motion blur. Artists";
//         const response = await generateImageViaDiffusion(prompt);
//         console.log(response);
//     } catch (error) {
//         console.error('Error generating LLM prompt:', error);
//     }
//     console.log("done");
// }

// main();

