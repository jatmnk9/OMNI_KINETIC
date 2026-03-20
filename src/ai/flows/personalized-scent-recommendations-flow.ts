'use server';
/**
 * @fileOverview Provides personalized fragrance recommendations based on device type and past scent usage.
 *
 * - personalizedScentRecommendations - A function that handles the scent recommendation process.
 * - PersonalizedScentRecommendationsInput - The input type for the personalizedScentRecommendations function.
 * - PersonalizedScentRecommendationsOutput - The return type for the personalizedScentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedScentRecommendationsInputSchema = z.object({
  deviceType: z
    .enum(['Prada', 'YSL', 'Biotherm'])
    .describe(
      "The type of the user's connected device, influencing scent recommendations."
    ),
  pastScentUsage: z
    .array(z.string())
    .describe(
      'A list of scents the user has previously used or indicated a preference for.'
    )
    .optional(),
});
export type PersonalizedScentRecommendationsInput = z.infer<
  typeof PersonalizedScentRecommendationsInputSchema
>;

const PersonalizedScentRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        scentName: z.string().describe('The name of the recommended fragrance.'),
        description: z
          .string()
          .describe('A brief description of the fragrance profile.'),
        reasoning: z
          .string()
          .describe(
            'The reason for this recommendation, based on device type and past usage.'
          ),
        cartridgeId: z
          .string()
          .describe('A unique identifier for purchasing this fragrance cartridge.'),
      })
    )
    .describe('An array of personalized fragrance recommendations.'),
});
export type PersonalizedScentRecommendationsOutput = z.infer<
  typeof PersonalizedScentRecommendationsOutputSchema
>;

export async function personalizedScentRecommendations(
  input: PersonalizedScentRecommendationsInput
): Promise<PersonalizedScentRecommendationsOutput> {
  return personalizedScentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedScentRecommendationsPrompt',
  input: {schema: PersonalizedScentRecommendationsInputSchema},
  output: {schema: PersonalizedScentRecommendationsOutputSchema},
  prompt: `You are an expert perfumer and a personalized scent recommendation AI.
Your goal is to provide fragrance recommendations tailored to the user's device type and past scent preferences.

Consider the following characteristics for each device type:
- Prada (Apex): Technical, active, performance-oriented, associated with HRV and acceleration metrics.
- YSL (Synapse): Sophisticated, emotional, reflective, associated with GSR and stress/emotion metrics, nocturnal and elegant design.
- Biotherm (Kinetic): Refreshing, wellness-oriented, associated with aquatic metrics and recovery.

Based on the user's device type and past scent usage, suggest 3-5 unique fragrance recommendations. For each recommendation, provide a scent name, a short description, a clear reasoning for the recommendation, and a placeholder cartridge ID.

User's Device Type: {{{deviceType}}}
Past Scent Usage: {{#if pastScentUsage}}{{{pastScentUsage}}}{{else}}None provided.{{/if}}`,
});

const personalizedScentRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedScentRecommendationsFlow',
    inputSchema: PersonalizedScentRecommendationsInputSchema,
    outputSchema: PersonalizedScentRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
