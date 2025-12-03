import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {get} from 'env-var';

const geminiApiKey = get('GEMINI_API_KEY').asString();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
