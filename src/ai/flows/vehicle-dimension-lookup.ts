'use server';

/**
 * @fileOverview Vehicle dimension lookup AI agent.
 *
 * - vehicleDimensionLookup - A function that handles the vehicle dimension lookup process.
 * - VehicleDimensionLookupInput - The input type for the vehicleDimensionLookup function.
 * - VehicleDimensionLookupOutput - The return type for the vehicleDimensionLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VehicleDimensionLookupInputSchema = z.object({
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  year: z.string().describe('The year of the vehicle.'),
});
export type VehicleDimensionLookupInput = z.infer<typeof VehicleDimensionLookupInputSchema>;

const VehicleDimensionLookupOutputSchema = z.object({
  length: z
    .number()
    .describe('The length of the cargo area in inches, if available.'),
  width: z
    .number()
    .describe('The width of the cargo area in inches, if available.'),
  height: z
    .number()
    .describe('The height of the cargo area in inches, if available.'),
  error: z.string().optional().describe('Error message if dimensions cannot be found'),
});
export type VehicleDimensionLookupOutput = z.infer<typeof VehicleDimensionLookupOutputSchema>;

export async function vehicleDimensionLookup(input: VehicleDimensionLookupInput): Promise<VehicleDimensionLookupOutput> {
  return vehicleDimensionLookupFlow(input);
}

const vehicleDimensionLookupPrompt = ai.definePrompt({
  name: 'vehicleDimensionLookupPrompt',
  input: {schema: VehicleDimensionLookupInputSchema},
  output: {schema: VehicleDimensionLookupOutputSchema},
  prompt: `You are an expert in vehicle dimensions. A user is asking for the dimensions of their car.
  If you cannot find the dimensions, return an error message in the error field.
  Make: {{{make}}}
  Model: {{{model}}}
  Year: {{{year}}}

  Return a JSON object with the length, width, and height of the cargo area in inches.
  `,
});

const vehicleDimensionLookupFlow = ai.defineFlow(
  {
    name: 'vehicleDimensionLookupFlow',
    inputSchema: VehicleDimensionLookupInputSchema,
    outputSchema: VehicleDimensionLookupOutputSchema,
  },
  async input => {
    const {output} = await vehicleDimensionLookupPrompt(input);
    return output!;
  }
);
