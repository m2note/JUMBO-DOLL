
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile, AspectRatio } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const POSES_PROMPTS = [
  "hugging the doll tightly while standing, full body shot.",
  "sitting on a fluffy rug on the floor, joyfully embracing the doll.",
  "in a close-up shot, smiling warmly while hugging the doll.",
  "playfully trying to lift the oversized doll off the ground while hugging it.",
  "peeking over the top of the jumbo doll while hugging it from behind.",
  "lying on a cozy bed, cuddling with the jumbo doll.",
];

async function generateSingleImage(modelImage: ImageFile, dollImage: ImageFile, posePrompt: string, background: string, aspectRatio: AspectRatio): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    
    const getRatioDescription = (ratio: AspectRatio) => {
        switch (ratio) {
            case '16:9': return 'horizontal 16:9 landscape';
            case '1:1': return 'square 1:1';
            case '9:16':
            default: return 'vertical 9:16 portrait';
        }
    }

    const textPrompt = `Generate a single, photorealistic, promotional-quality image.

**Primary Directive: The output image's aspect ratio MUST BE a ${getRatioDescription(aspectRatio)}. This is a strict, non-negotiable requirement.**

**Image Content:**
- **Person:** Must be the *exact same person* from the first input image.
- **Doll:** Must be the *exact same jumbo doll* from the second input image.
- **Action:** The person is ${posePrompt}.
- **Background:** The setting is a **${background}**.

**Artistic Style & Constraints:**
- **Realism:** The doll must appear very large and plush. The lighting should be soft and warm, creating a cozy and inviting atmosphere.
- **Consistency:** Maintain the precise appearance of the person and the doll from the source images.
- **Quality:** The final image must be high-resolution and suitable for professional promotional use.
- **Format:** Output only the image data.`;

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: modelImage.base64, mimeType: modelImage.mimeType } },
                { inlineData: { data: dollImage.base64, mimeType: dollImage.mimeType } },
                { text: textPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error('Image generation failed, no image data returned.');
}

export async function generatePromotionalImages(
  modelImage: ImageFile, 
  dollImage: ImageFile, 
  background: string, 
  aspectRatio: AspectRatio,
  onProgress: (imageUrl: string) => void
): Promise<string[]> {
  const allGeneratedImages: string[] = [];
  for (const prompt of POSES_PROMPTS) {
    const imageUrl = await generateSingleImage(modelImage, dollImage, prompt, background, aspectRatio);
    onProgress(imageUrl);
    allGeneratedImages.push(imageUrl);
  }
  return allGeneratedImages;
}
