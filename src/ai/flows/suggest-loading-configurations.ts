'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting alternative vehicle loading configurations if a TV doesn't fit.
 *
 * - suggestLoadingConfigurations - A function that suggests alternative loading configurations.
 * - SuggestLoadingConfigurationsInput - The input type for the suggestLoadingConfigurations function.
 * - SuggestLoadingConfigurationsOutput - The return type for the suggestLoadingConfigurations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLoadingConfigurationsInputSchema = z.object({
  tvWidth: z.number().describe('The width of the TV box in inches.'),
  tvHeight: z.number().describe('The height of the TV box in inches.'),
  tvDepth: z.number().describe('The depth of the TV box in inches.'),
  vehicleCargoLength: z.number().describe('The length of the vehicle cargo area in inches.'),
  vehicleCargoWidth: z.number().describe('The width of the vehicle cargo area in inches.'),
  vehicleCargoHeight: z.number().describe('The height of the vehicle cargo area in inches.'),
});
export type SuggestLoadingConfigurationsInput = z.infer<
  typeof SuggestLoadingConfigurationsInputSchema
>;

const SuggestLoadingConfigurationsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested alternative loading configurations.'),
});
export type SuggestLoadingConfigurationsOutput = z.infer<
  typeof SuggestLoadingConfigurationsOutputSchema
>;

export async function suggestLoadingConfigurations(
  input: SuggestLoadingConfigurationsInput
): Promise<SuggestLoadingConfigurationsOutput> {
  return suggestLoadingConfigurationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLoadingConfigurationsPrompt',
  input: {schema: SuggestLoadingConfigurationsInputSchema},
  output: {schema: SuggestLoadingConfigurationsOutputSchema},
  prompt: `You are a helpful assistant for a Best Buy employee, suggesting safe, alternative transportation options for a TV box that does not fit in a customer's vehicle.

  IMPORTANT RULE: You must NEVER suggest taking the TV out of its box. This would void the customer's return policy if the TV is damaged.

  Given the TV and vehicle dimensions, provide a few safe and practical suggestions. The suggestions should focus on alternative transportation methods.

  TV Box Dimensions: Width: {{tvWidth}}", Height: {{tvHeight}}", Depth: {{tvDepth}}"
  Vehicle Cargo Area Dimensions: Length: {{vehicleCargoLength}}", Width: {{vehicleCargoWidth}}", Height: {{vehicleCargoHeight}}"

  Provide a numbered list of 3-4 suggestions. Your suggestions should be limited to the following categories:
  1. Secure the load if it fits but might shift (e.g., using straps if the trunk won't close).
  2. Arrange for a larger vehicle (e.g., rent a U-Haul, ask a friend with a truck).
  3. Use a ride-sharing service that offers large vehicles (e.g., UberXL).
  4. Suggest Best Buy's delivery service as a convenient option, but note that it might not be available for same-day delivery.

  Do not suggest different orientations of the box, as the main calculator has already determined it will not fit in any orientation. Focus only on alternative transport.
`,
});

const suggestLoadingConfigurationsFlow = ai.defineFlow(
  {
    name: 'suggestLoadingConfigurationsFlow',
    inputSchema: SuggestLoadingConfigurationsInputSchema,
    outputSchema: SuggestLoadingConfigurationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
