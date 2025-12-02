'use server';

/**
 * @fileOverview Generates personalized initial content (news headlines or suggested topics)
 * based on user profile data (interests, location) to provide immediate value to new users.
 *
 * - generatePersonalizedInitialContent - A function that generates personalized initial content.
 * - PersonalizedInitialContentInput - The input type for the generatePersonalizedInitialContent function.
 * - PersonalizedInitialContentOutput - The return type for the generatePersonalizedInitialContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedInitialContentInputSchema = z.object({
  interests: z.string().describe('A comma-separated list of the user\'s interests.'),
  location: z.string().describe('The user\'s general location (e.g., city, state).'),
});

export type PersonalizedInitialContentInput = z.infer<typeof PersonalizedInitialContentInputSchema>;

const PersonalizedInitialContentOutputSchema = z.object({
  contentSnippet: z.string().describe('A short snippet of personalized content (news headlines or suggested topics).'),
});

export type PersonalizedInitialContentOutput = z.infer<typeof PersonalizedInitialContentOutputSchema>;

export async function generatePersonalizedInitialContent(
  input: PersonalizedInitialContentInput
): Promise<PersonalizedInitialContentOutput> {
  return personalizedInitialContentFlow(input);
}

const personalizedInitialContentPrompt = ai.definePrompt({
  name: 'personalizedInitialContentPrompt',
  input: {schema: PersonalizedInitialContentInputSchema},
  output: {schema: PersonalizedInitialContentOutputSchema},
  prompt: `As a personalized news curator, generate a short snippet of trending news headlines or suggested topics tailored to a new user based on their interests and location.\n\nUser Interests: {{{interests}}}\nUser Location: {{{location}}}\n\nPersonalized Content Snippet:`, // Use a single line break for clarity
});

const personalizedInitialContentFlow = ai.defineFlow(
  {
    name: 'personalizedInitialContentFlow',
    inputSchema: PersonalizedInitialContentInputSchema,
    outputSchema: PersonalizedInitialContentOutputSchema,
  },
  async input => {
    const {output} = await personalizedInitialContentPrompt(input);
    return output!;
  }
);
