import Replicate from "replicate";

const replicate = new Replicate();
const REPLICATE_ENDPOINT = "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";

const replicateInput = {
    "width": 768,
    "height": 768,
    "prompt": "an astronaut riding a horse on mars, hd, dramatic lighting",
    "scheduler": "K_EULER",
    "num_outputs": 1,
    "guidance_scale": 7.5,
    "num_inference_steps": 50
};

const output = await replicate.run(REPLICATE_ENDPOINT, { replicateInput });
console.log(output)