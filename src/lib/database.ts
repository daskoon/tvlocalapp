
// Data provided by the user

export const TV_DATA = {
  metadata: {
    description: 'TV box dimensions for Best Buy inventory (all locations)',
    version: '2.0',
    last_updated: '2025-07-12',
    measurement_unit: 'inches',
    notes: [
      'Box dimensions include packaging materials',
      'Measurements are Width x Height x Depth',
      'Data sourced from manufacturer specifications and Best Buy inventory',
      'Includes all major brands available at Best Buy stores',
    ],
  },
  tv_brands: {
    Samsung: {
      available_sizes: [
        '32',
        '40',
        '43',
        '50',
        '55',
        '60',
        '65',
        '70',
        '75',
        '77',
        '85',
      ],
      series: ['Crystal UHD', 'QLED', 'Neo QLED', 'The Frame', 'The Terrace'],
    },
    LG: {
      available_sizes: [
        '32',
        '40',
        '43',
        '48',
        '50',
        '55',
        '65',
        '70',
        '75',
        '77',
        '83',
        '86',
      ],
      series: ['UHD', 'OLED', 'QNED', 'NanoCell'],
    },
    Sony: {
      available_sizes: ['32', '43', '50', '55', '65', '75', '85'],
      series: ['BRAVIA', 'BRAVIA XR', 'X90L', 'A95L'],
    },
    TCL: {
      available_sizes: ['32', '40', '43', '50', '55', '65', '75', '85', '98'],
      series: ['C Series', 'P Series', 'QM Series', 'QD-Mini LED'],
    },
    Hisense: {
      available_sizes: ['32', '40', '43', '50', '55', '65', '75', '85'],
      series: ['A4', 'U6', 'U7', 'U8', 'QD7'],
    },
    Toshiba: {
      available_sizes: ['32', '43', '50', '55', '65', '75'],
      series: ['C350', 'V35'],
    },
    Insignia: {
      available_sizes: ['24', '32', '43', '50', '55', '65', '70', '75'],
      series: ['F20', 'F30', 'F50'],
    },
    Roku: {
      available_sizes: ['32', '40', '43', '50', '55', '65', '75'],
      series: ['Select Series', 'Plus Series', 'Pro Series'],
    },
  },
  tv_box_dimensions: {
    '24': {
      screen_diagonal: 24,
      screen_w: 21.0,
      screen_h: 11.8,
      box_w: 26.5,
      box_h: 17.5,
      box_d: 5.5,
      weight_lbs: 12,
      common_models: ['Insignia F20'],
    },
    '32': {
      screen_diagonal: 32,
      screen_w: 27.9,
      screen_h: 15.7,
      box_w: 33.0,
      box_h: 21.0,
      box_d: 6.0,
      weight_lbs: 18,
      common_models: [
        'Samsung Crystal UHD',
        'LG UHD',
        'TCL C Series',
        'Insignia F30',
      ],
    },
    '40': {
      screen_diagonal: 40,
      screen_w: 34.9,
      screen_h: 19.6,
      box_w: 41.0,
      box_h: 25.0,
      box_d: 6.5,
      weight_lbs: 25,
      common_models: ['Samsung Crystal UHD', 'TCL QM Series', 'Hisense A4'],
    },
    '43': {
      screen_diagonal: 43,
      screen_w: 37.5,
      screen_h: 21.1,
      box_w: 43.0,
      box_h: 27.0,
      box_d: 7.0,
      weight_lbs: 30,
      common_models: ['Samsung QLED', 'LG NanoCell', 'Sony BRAVIA', 'TCL QM Series'],
    },
    '48': {
      screen_diagonal: 48,
      screen_w: 41.9,
      screen_h: 23.6,
      box_w: 48.0,
      box_h: 29.5,
      box_d: 7.0,
      weight_lbs: 35,
      common_models: ['LG OLED B4'],
    },
    '50': {
      screen_diagonal: 50,
      screen_w: 43.6,
      screen_h: 24.5,
      box_w: 50.0,
      box_h: 31.0,
      box_d: 7.0,
      weight_lbs: 38,
      common_models: [
        'Samsung Crystal UHD',
        'LG UN7300',
        'TCL QM Series',
        'Hisense U7',
      ],
    },
    '55': {
      screen_diagonal: 55,
      screen_w: 47.9,
      screen_h: 27.0,
      box_w: 57.0,
      box_h: 33.0,
      box_d: 8.0,
      weight_lbs: 45,
      common_models: [
        'Samsung Frame Series',
        'LG C4 OLED',
        'Sony BRAVIA XR',
        'TCL QM7K',
      ],
    },
    '60': {
      screen_diagonal: 60,
      screen_w: 52.3,
      screen_h: 29.4,
      box_w: 60.0,
      box_h: 35.0,
      box_d: 8.0,
      weight_lbs: 52,
      common_models: ['Samsung Crystal UHD'],
    },
    '65': {
      screen_diagonal: 65,
      screen_w: 56.7,
      screen_h: 31.9,
      box_w: 63.2,
      box_h: 38.0,
      box_d: 8.0,
      weight_lbs: 58,
      common_models: [
        'Samsung Neo QLED',
        'LG G4 OLED',
        'Sony BRAVIA 9',
        'TCL QM8K',
      ],
    },
    '70': {
      screen_diagonal: 70,
      screen_w: 61.0,
      screen_h: 34.3,
      box_w: 68.0,
      box_h: 41.0,
      box_d: 8.5,
      weight_lbs: 68,
      common_models: ['Samsung Crystal UHD', 'Insignia F50'],
    },
    '75': {
      screen_diagonal: 75,
      screen_w: 65.4,
      screen_h: 36.8,
      box_w: 72.5,
      box_h: 44.0,
      box_d: 9.0,
      weight_lbs: 78,
      common_models: ['Samsung QN90D', 'LG UT75', 'Sony X90L', 'TCL QM7K'],
    },
    '77': {
      screen_diagonal: 77,
      screen_w: 67.2,
      screen_h: 37.8,
      box_w: 74.0,
      box_h: 45.0,
      box_d: 11.0,
      weight_lbs: 85,
      common_models: ['LG G4 OLED', 'Samsung S90D OLED'],
    },
    '83': {
      screen_diagonal: 83,
      screen_w: 72.4,
      screen_h: 40.7,
      box_w: 80.0,
      box_h: 47.0,
      box_d: 10.0,
      weight_lbs: 95,
      common_models: ['LG G4 OLED', 'Samsung Neo QLED'],
    },
    '85': {
      screen_diagonal: 85,
      screen_w: 74.1,
      screen_h: 41.7,
      box_w: 82.0,
      box_h: 52.0,
      box_d: 10.0,
      weight_lbs: 105,
      common_models: ['Samsung QN90D', 'Sony X900H', 'TCL QM8K', 'Hisense QD7'],
    },
    '86': {
      screen_diagonal: 86,
      screen_w: 75.0,
      screen_h: 42.2,
      box_w: 83.0,
      box_h: 53.0,
      box_d: 10.5,
      weight_lbs: 110,
      common_models: ['LG QNED'],
    },
    '98': {
      screen_diagonal: 98,
      screen_w: 85.5,
      screen_h: 48.1,
      box_w: 94.0,
      box_h: 55.0,
      box_d: 12.0,
      weight_lbs: 150,
      common_models: ['TCL QM7K', 'Samsung Neo QLED'],
    },
    'Insignia 75': {
      screen_diagonal: 75,
      screen_w: 66.1,
      screen_h: 37.8,
      box_w: 72.4,
      box_h: 43.7,
      box_d: 7.5,
      weight_lbs: 75,
      common_models: ['Insignia F50 Series'],
    },
  },
};

export const VEHICLE_DATA = {
  metadata: {
    description: 'Vehicle cargo space dimensions for TV fitment analysis',
    version: '3.0',
    last_updated: '2025-07-15',
    measurement_unit: 'inches',
    notes: [
      'Dimensions represent usable space and account for minor obstructions.',
      'door_w/h: Dimensions of the main cargo opening (e.g., trunk lid, rear hatch).',
      'cargo_w/h/l: Standard cargo area with seats in their normal position.',
      'passthrough_w/h: Smallest opening between trunk and cabin, if available.',
      'seats_down_w/h/l: Full cargo area with back seats folded down.',
      'flatbed dimensions are for pickup trucks.',
    ],
  },
  vehicle_categories: {
    'Compact Cars': {
      description: 'Small passenger cars with limited cargo space',
      typical_cargo_volume: '13-16 cubic feet',
    },
    Sedans: {
      description: 'Traditional 4-door passenger cars with trunk',
      typical_cargo_volume: '14-20 cubic feet',
    },
    'SUVs - Compact': {
      description: 'Small utility vehicles with higher seating position',
      typical_cargo_volume: '25-35 cubic feet',
    },
    'SUVs - Midsize': {
      description: 'Family-sized SUVs with 3-row seating options',
      typical_cargo_volume: '35-50 cubic feet',
    },
    'SUVs - Large': {
      description: 'Full-size SUVs with maximum passenger and cargo capacity',
      typical_cargo_volume: '50-85 cubic feet',
    },
    Minivans: {
      description: 'Purpose-built family vehicles with sliding doors',
      typical_cargo_volume: '85-150 cubic feet',
    },
    'Pickup Trucks': {
      description: 'Utility vehicles with open cargo beds',
      typical_cargo_volume: '50-80 cubic feet',
    },
    Electric: {
      description: 'Electric vehicles including Tesla models',
      typical_cargo_volume: '15-85 cubic feet',
    },
    Hatchbacks: {
      description: 'Compact cars with rear hatch opening',
      typical_cargo_volume: '20-35 cubic feet',
    },
    Vans: {
      description: 'Commercial and passenger vans with large cargo capacity',
      typical_cargo_volume: '100-250 cubic feet',
    },
    Wagons: {
      description: 'Station wagons with extended cargo areas',
      typical_cargo_volume: '30-75 cubic feet',
    },
  },
  vehicle_models: {
    'Compact Cars': {
       'Honda Fit': {
        year_range: '2015-2020',
        door_w: 38, door_h: 28, 
        cargo_w: 40, cargo_h: 30, cargo_l: 28,
        seats_down_w: 40, seats_down_h: 30, seats_down_l: 65,
      },
      'Toyota Corolla': {
        year_range: '2020-2025',
        door_w: 40, door_h: 19,
        cargo_w: 38, cargo_h: 15, cargo_l: 42,
        passthrough_w: 35, passthrough_h: 14, seats_down_l: 68
      },
       'Nissan Sentra': {
        year_range: '2020-2025',
        door_w: 39.0, door_h: 18.0,
        cargo_w: 37, cargo_h: 14, cargo_l: 41,
        passthrough_w: 34, passthrough_h: 13, seats_down_l: 67
      },
       'Honda Civic': {
        year_range: '2022-2025',
        door_w: 40.0, door_h: 18.5,
        cargo_w: 39, cargo_h: 15, cargo_l: 43,
        passthrough_w: 36, passthrough_h: 14, seats_down_l: 70
      },
       'Hyundai Elantra': {
        year_range: '2021-2025',
        door_w: 38.5, door_h: 18.0,
        cargo_w: 38, cargo_h: 14.5, cargo_l: 44,
        passthrough_w: 35, passthrough_h: 13.5, seats_down_l: 69.0
      },
    },
    Sedans: {
      'Honda Accord': {
        year_range: '2018-2025',
        door_w: 42.0, door_h: 20.0,
        cargo_w: 41, cargo_h: 16, cargo_l: 45,
        passthrough_w: 38, passthrough_h: 15, seats_down_l: 72
      },
      'Toyota Camry': {
        year_range: '2018-2025',
        door_w: 42.5, door_h: 19.5,
        cargo_w: 40, cargo_h: 15, cargo_l: 44,
        passthrough_w: 37, passthrough_h: 14, seats_down_l: 71
      },
    },
    'SUVs - Compact': {
      'Honda CR-V': {
        year_range: '2017-2025',
        door_w: 42.0, door_h: 31.0,
        cargo_w: 45, cargo_h: 33, cargo_l: 39,
        seats_down_w: 45, seats_down_h: 33, seats_down_l: 68
      },
      'Toyota RAV4': {
        year_range: '2019-2025',
        door_w: 43.0, door_h: 30.0,
        cargo_w: 46, cargo_h: 32, cargo_l: 40,
        seats_down_w: 46, seats_down_h: 32, seats_down_l: 70
      },
      'Subaru Forester': {
        year_range: '2019-2025',
        door_w: 49.0, door_h: 32.0,
        cargo_w: 51, cargo_h: 34, cargo_l: 35,
        seats_down_w: 51, seats_down_h: 34, seats_down_l: 69
      },
    },
    'SUVs - Midsize': {
      'Honda Pilot': {
        year_range: '2016-2025',
        door_w: 46.0, door_h: 33.0,
        cargo_w: 48, cargo_h: 35, cargo_l: 46,
        seats_down_w: 48, seats_down_h: 35, seats_down_l: 83
      },
      'Toyota Highlander': {
        year_range: '2020-2025',
        door_w: 47.0, door_h: 34.0,
        cargo_w: 49, cargo_h: 36, cargo_l: 48,
        seats_down_w: 49, seats_down_h: 36, seats_down_l: 84
      },
      'Kia Telluride': {
        year_range: '2020-2025',
        door_w: 47.0, door_h: 32.0,
        cargo_w: 49, cargo_h: 34, cargo_l: 46,
        seats_down_w: 49, seats_down_h: 34, seats_down_l: 87
      },
    },
    'SUVs - Large': {
       'Toyota 4Runner': {
        year_range: '2010-2025',
        door_w: 49.0, door_h: 36.0,
        cargo_w: 52, cargo_h: 38, cargo_l: 47,
        seats_down_w: 52, seats_down_h: 38, seats_down_l: 73
      },
       'Chevrolet Suburban': {
        year_range: '2021-2025',
        door_w: 52.0, door_h: 36.0,
        cargo_w: 54, cargo_h: 38, cargo_l: 41,
        seats_down_w: 54, seats_down_h: 38, seats_down_l: 96
      },
      'Ford Expedition': {
        year_range: '2018-2025',
        door_w: 50.0, door_h: 35.0,
        cargo_w: 52, cargo_h: 37, cargo_l: 43,
        seats_down_w: 52, seats_down_h: 37, seats_down_l: 93
      },
       'Subaru Outback': {
        year_range: '2020-2025',
        door_w: 45.0, door_h: 29.0,
        cargo_w: 47, cargo_h: 31, cargo_l: 43,
        seats_down_w: 47, seats_down_h: 31, seats_down_l: 75
      },
    },
    Minivans: {
       'Honda Odyssey': {
        year_range: '2018-2025',
        door_w: 54.0, door_h: 38.0,
        cargo_w: 56, cargo_h: 40, cargo_l: 38,
        seats_down_w: 56, seats_down_h: 40, seats_down_l: 98
      },
       'Toyota Sienna': {
        year_range: '2021-2025',
        door_w: 53.0, door_h: 37.0,
        cargo_w: 55, cargo_h: 39, cargo_l: 33,
        seats_down_w: 55, seats_down_h: 39, seats_down_l: 95
      },
       'Chrysler Pacifica': {
        year_range: '2017-2025',
        door_w: 52.0, door_h: 36.0,
        cargo_w: 54, cargo_h: 38, cargo_l: 32,
        seats_down_w: 54, seats_down_h: 38, seats_down_l: 94
      },
    },
    'Pickup Trucks': {
      'Ford F-150': {
        year_range: '2021-2025',
        flatbed: { w: 50.6, l: 97.6, h: 21.4 }
      },
      'Chevrolet Silverado': {
        year_range: '2019-2025',
        flatbed: { w: 71.4, l: 98.2, h: 22.4 }
      },
      'Toyota Tacoma': {
        year_range: '2016-2025',
        flatbed: { w: 50.0, l: 73.7, h: 19.1 }
      },
    },
    Electric: {
      'Tesla Model Y': {
        year_range: '2020-2025',
        door_w: 39.5, door_h: 27.0,
        cargo_w: 42, cargo_h: 29, cargo_l: 42,
        seats_down_w: 42, seats_down_h: 29, seats_down_l: 75
      },
      'Tesla Cybertruck': {
        year_range: '2024-2025',
        flatbed: { w: 51.0, l: 72.9, h: 19.9 }
      },
       'Ford Mustang Mach-E': {
        year_range: '2021-2025',
        door_w: 42.0, door_h: 30.0,
        cargo_w: 44, cargo_h: 32, cargo_l: 36,
        seats_down_w: 44, seats_down_h: 32, seats_down_l: 65
      },
    },
  },
};
