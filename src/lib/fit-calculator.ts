
import type { Vehicle, VehicleDimensions, TvDimensions, LoadingScenario, FitResult } from './types';

function checkPermutations(vehicleDims: VehicleDimensions, tvDims: TvDimensions): { fits: boolean, tight: boolean } {
  if (!vehicleDims || !tvDims) return { fits: false, tight: false };
  if (Object.values(vehicleDims).some(v => !v || v <= 0) || Object.values(tvDims).some(v => v <= 0)) {
    return { fits: false, tight: false };
  }

  const tvPermutations = [
    [tvDims.width, tvDims.height, tvDims.depth],
    [tvDims.width, tvDims.depth, tvDims.height],
    [tvDims.height, tvDims.width, tvDims.depth],
    [tvDims.height, tvDims.depth, tvDims.width],
    [tvDims.depth, tvDims.width, tvDims.height],
    [tvDims.depth, tvDims.height, tvDims.width],
  ];

  const v = [vehicleDims.width, vehicleDims.height, vehicleDims.length];
  const TIGHT_FIT_MARGIN = 2; // inches

  let fits = false;
  let tight = false;

  for (const p of tvPermutations) {
    if (p[0] <= v[0] && p[1] <= v[1] && p[2] <= v[2]) {
      fits = true;
      const isTight = (v[0] - p[0] < TIGHT_FIT_MARGIN) ||
                      (v[1] - p[1] < TIGHT_FIT_MARGIN) ||
                      (v[2] - p[2] < TIGHT_FIT_MARGIN);

      if (isTight) {
        tight = true;
      } else {
        // If it fits and is not tight, we found our best fit.
        return { fits: true, tight: false };
      }
    }
  }

  return { fits, tight };
}

export function checkFit(vehicle: Vehicle, tvDims: TvDimensions): FitResult {
  const scenarios: { scenario: LoadingScenario, dimensions: VehicleDimensions | undefined }[] = [];

  // Manual dimensions override everything else
  if (vehicle.manual_dimensions) {
    scenarios.push({ scenario: 'manual', dimensions: vehicle.manual_dimensions });
  } else {
    // Add scenarios in order of preference (most space to least, generally)
    if (vehicle.flatbed) {
      scenarios.push({ scenario: 'flatbed', dimensions: { width: vehicle.flatbed.w, height: 999, length: vehicle.flatbed.l }});
    }
    if (vehicle.seats_down_l && vehicle.seats_down_w && vehicle.seats_down_h) {
      scenarios.push({ scenario: 'seats_down', dimensions: { length: vehicle.seats_down_l, width: vehicle.seats_down_w, height: vehicle.seats_down_h }});
    }
    if (vehicle.passthrough_w && vehicle.passthrough_h && vehicle.seats_down_l) {
      scenarios.push({ scenario: 'passthrough', dimensions: { length: vehicle.seats_down_l, width: vehicle.passthrough_w, height: vehicle.passthrough_h }});
    }
    if (vehicle.cargo_l && vehicle.cargo_w && vehicle.cargo_h) {
        scenarios.push({ scenario: 'cargo', dimensions: { length: vehicle.cargo_l, width: vehicle.cargo_w, height: vehicle.cargo_h } });
    }
  }

  for (const { scenario, dimensions } of scenarios) {
    if (dimensions) {
      const result = checkPermutations(dimensions, tvDims);
      if (result.fits) {
        return { fits: true, tight: result.tight, scenario, dimensions };
      }
    }
  }

  // If no scenario fits, return the first one's dimensions for comparison display
  const firstScenario = scenarios[0];
  return { 
    fits: false, 
    tight: false, 
    scenario: firstScenario?.scenario, 
    dimensions: firstScenario?.dimensions 
  };
}
