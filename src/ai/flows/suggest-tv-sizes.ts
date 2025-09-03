// 'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting alternative TV sizes that might fit in a vehicle.
 *
 * - suggestTvSizes - A function that suggests alternative TV sizes.
 * - SuggestTvSizesInput - The input type for the suggestTvSizes function.
 * - SuggestTvSizesOutput - The return type for the suggestTvSizes function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTvSizesInputSchema = z.object({
  vehicleLength: z.number().describe('The length of the vehicle cargo area in inches.'),
  vehicleWidth: z.number().describe('The width of the vehicle cargo area in inches.'),
  vehicleHeight: z.number().describe('The height of the vehicle cargo area in inches.'),
  tvWidth: z.number().describe('The width of the TV box in inches.'),
  tvHeight: z.number().describe('The height of the TV box in inches.'),
  tvDepth: z.number().describe('The depth of the TV box in inches.'),
});
export type SuggestTvSizesInput = z.infer<typeof SuggestTvSizesInputSchema>;

const SuggestTvSizesOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      tvWidth: z.number().describe('Suggested TV width in inches.'),
      tvHeight: z.number().describe('Suggested TV height in inches.'),
      tvDepth: z.number().describe('Suggested TV depth in inches.'),
      reason: z.string().describe('Why this TV size is suggested.'),
    })
  ).describe('A list of suggested TV sizes that might fit.'),
});
export type SuggestTvSizesOutput = z.infer<typeof SuggestTvSizesOutputSchema>;

export async function suggestTvSizes(input: SuggestTvSizesInput): Promise<SuggestTvSizesOutput> {
  return suggestTvSizesFlow(input);
}

const suggestTvSizesPrompt = ai.definePrompt({
  name: 'suggestTvSizesPrompt',
  input: {schema: SuggestTvSizesInputSchema},
  output: {schema: SuggestTvSizesOutputSchema},
  prompt: `You are a helpful assistant that suggests alternative TV sizes that might fit in a vehicle, given the vehicle's cargo dimensions and the original TV's dimensions.

  Vehicle Cargo Area Dimensions:
  - Length: {{vehicleLength}} inches
  - Width: {{vehicleWidth}} inches
  - Height: {{vehicleHeight}} inches

  Original TV Dimensions:
  - Width: {{tvWidth}} inches
  - Height: {{tvHeight}} inches
  - Depth: {{tvDepth}} inches

  Suggest three alternative TV sizes (width, height, depth) that are likely to fit in the vehicle, along with a brief reason for each suggestion.  Consider TVs with smaller widths, heights, and/or depths. The smaller the better. Prioritize reducing the largest dimension first. Return your answer as a JSON object.
  `,
});

const suggestTvSizesFlow = ai.defineFlow(
  {
    name: 'suggestTvSizesFlow',
    inputSchema: SuggestTvSizesInputSchema,
    outputSchema: SuggestTvSizesOutputSchema,
  },
  async input => {
    const {output} = await suggestTvSizesPrompt(input);
    return output!;
  }
);
