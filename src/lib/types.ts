

export interface VehicleDimensions {
  length: number;
  width: number;
  height: number;
}

export interface TvDimensions {
  width: number;
  height: number;
  depth: number;
}

export type LoadingScenario = 'passthrough' | 'seats_down' | 'flatbed' | 'cargo' | 'manual';

export interface Vehicle {
  name?: string; // Added for vehicle finder display
  year_range?: string;
  door_w?: number;
  door_h?: number;
  cargo_w?: number;
  cargo_h?: number;
  cargo_l?: number;
  seats_down_w?: number;
  seats_down_h?: number;
  seats_down_l?: number;
  passthrough_w?: number;
  passthrough_h?: number;
  flatbed?: { w: number, l: number, h: number };
  manual_dimensions?: VehicleDimensions; // For manual entry
}

export interface FitResult {
    fits: boolean;
    tight: boolean;
    scenario: LoadingScenario | undefined;
    dimensions: VehicleDimensions | undefined;
}
