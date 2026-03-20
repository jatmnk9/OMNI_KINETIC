'use server';
/**
 * @fileOverview This file provides a Genkit flow for analyzing historical biometric data and scent usage
 * to generate concise summaries and insights about how different fragrance profiles have influenced a user's well-being.
 *
 * - biometricScentInsightSummaries - A function that orchestrates the analysis of biometric and scent data.
 * - BiometricScentInsightSummariesInput - The input type for the biometricScentInsightSummaries function.
 * - BiometricScentInsightSummariesOutput - The return type for the biometricScentInsightSummaries function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BiometricScentInsightSummariesInputSchema = z.object({
  biometricData: z.array(
    z.object({
      timestamp: z
        .string()
        .datetime()
        .describe('Timestamp of the biometric reading in ISO 8601 format.'),
      type: z
        .enum([
          'stress',
          'activity',
          'focus',
          'heart_rate',
          'gsr',
          'temperature',
          'aquatic_metrics',
        ])
        .describe('Type of biometric data (e.g., stress, activity, focus, GSR).'),
      value: z.number().describe('The numeric value of the biometric data.'),
    })
  ).describe('Historical biometric readings for the user.'),
  scentUsage: z.array(
    z.object({
      timestamp: z
        .string()
        .datetime()
        .describe('Timestamp when the fragrance was applied in ISO 8601 format.'),
      fragranceProfile: z.string().describe('Name or profile of the fragrance used.'),
      applicationNotes: z.string().optional().describe('Optional notes about the fragrance application.'),
    })
  ).describe('Historical record of fragrance application.'),
});
export type BiometricScentInsightSummariesInput = z.infer<
  typeof BiometricScentInsightSummariesInputSchema
>;

const BiometricScentInsightSummariesOutputSchema = z.object({
  overallSummary: z
    .string()
    .describe(
      "A comprehensive summary of the user's scent regimen and its general impact on well-being based on the provided data."
    ),
  insights: z.array(
    z.object({
      fragranceProfile: z.string().describe('The name of the fragrance profile.'),
      biometricType: z
        .enum([
          'stress',
          'activity',
          'focus',
          'heart_rate',
          'gsr',
          'temperature',
          'aquatic_metrics',
        ])
        .describe('The biometric type influenced by this fragrance.'),
      insight: z
        .string()
        .describe(
          'A specific insight about how this fragrance influenced the particular biometric type. Provide actionable advice or observations.'
        ),
    })
  ).describe('A list of specific insights about how different fragrances influenced various biometric types.'),
});
export type BiometricScentInsightSummariesOutput = z.infer<
  typeof BiometricScentInsightSummariesOutputSchema
>;

export async function biometricScentInsightSummaries(
  input: BiometricScentInsightSummariesInput
): Promise<BiometricScentInsightSummariesOutput> {
  return biometricScentInsightSummariesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'biometricScentInsightSummariesPrompt',
  input: { schema: BiometricScentInsightSummariesInputSchema },
  output: { schema: BiometricScentInsightSummariesOutputSchema },
  prompt: `You are an AI assistant specialized in analyzing human biometric data and fragrance usage to provide insights into well-being.

Analyze the provided historical biometric data and scent usage logs. Your goal is to identify correlations between fragrance applications and changes in biometric states (stress, activity, focus, heart rate, GSR, temperature, aquatic metrics).

Based on this analysis, generate a comprehensive overall summary of the user's scent regimen and its general impact. Then, provide specific insights for each fragrance profile, detailing how it influenced particular biometric types. Each insight should be concise and potentially actionable.

Historical Biometric Data:
{{#each biometricData}}
- Timestamp: {{{timestamp}}}, Type: {{{type}}}, Value: {{{value}}}
{{/each}}

Scent Usage Log:
{{#each scentUsage}}
- Timestamp: {{{timestamp}}}, Fragrance: {{{fragranceProfile}}}, Notes: {{{applicationNotes}}}
{{/each}}

Provide the output in a structured JSON format as described by the output schema.`,
});

const biometricScentInsightSummariesFlow = ai.defineFlow(
  {
    name: 'biometricScentInsightSummariesFlow',
    inputSchema: BiometricScentInsightSummariesInputSchema,
    outputSchema: BiometricScentInsightSummariesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
