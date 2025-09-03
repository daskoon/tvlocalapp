
'use server';

import { vehicleDimensionLookup } from '@/ai/flows/vehicle-dimension-lookup';
import { suggestLoadingConfigurations } from '@/ai/flows/suggest-loading-configurations';
import { suggestTvSizes } from '@/ai/flows/suggest-tv-sizes';
import { z } from 'zod';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Valid year is required').max(4),
});

export async function findVehicleDimensionsAction(values: z.infer<typeof vehicleSchema>) {
  const parsed = vehicleSchema.safeParse(values);
  if (!parsed.success) {
    const error = parsed.error.format()._errors.join(', ');
    throw new Error(error);
  }
  return await vehicleDimensionLookup(parsed.data);
}

const suggestionsSchema = z.object({
  vehicleDimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  tvDimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }),
});

export async function getFitSuggestionsAction(values: z.infer<typeof suggestionsSchema>) {
  const parsed = suggestionsSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error('Invalid input for suggestions.');
  }
  const { vehicleDimensions, tvDimensions } = parsed.data;

  const loadingSuggestionsPromise = suggestLoadingConfigurations({
    vehicleCargoLength: vehicleDimensions.length,
    vehicleCargoWidth: vehicleDimensions.width,
    vehicleCargoHeight: vehicleDimensions.height,
    tvWidth: tvDimensions.width,
    tvHeight: tvDimensions.height,
    tvDepth: tvDimensions.depth,
  });
  
  const tvSizeSuggestionsPromise = suggestTvSizes({
    vehicleLength: vehicleDimensions.length,
    vehicleWidth: vehicleDimensions.width,
    vehicleHeight: vehicleDimensions.height,
    tvWidth: tvDimensions.width,
    tvHeight: tvDimensions.height,
    tvDepth: tvDimensions.depth,
  });

  const [loadingSuggestions, tvSizeSuggestions] = await Promise.all([
    loadingSuggestionsPromise,
    tvSizeSuggestionsPromise,
  ]);

  return { loadingSuggestions, tvSizeSuggestions };
}
