export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  connectorTypes: string[];
  powerKw: number;
  chargingSpeed: string;
  pricingPerKwh: number;
  operator: string;
  totalPorts: number;
  isDemo?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterPreferences {
  searchQuery: string;
  connectorType: string;
  powerCategory: string;
  sortBy: 'name' | 'power_desc' | 'price_asc';
  onlyFavorites: boolean;
}

export interface CalculationInput {
  batteryCapacity: number | null;
  currentPercentage: number | null;
  targetPercentage: number | null;
  pricePerKwh: number | null;
}

export interface CalculationResult {
  energyRequiredKwh: number;
  estimatedCost: number;
  chargingDelta: number;
  isValid: boolean;
  errorMessage?: string;
}

export const CONNECTOR_OPTIONS = [
  'CCS-2',
  'Type 2',
  'Bharat DC-001',
  'CHAdeMO',
  'Tesla/NACS'
];

export const OPERATOR_OPTIONS = [
  'Tata Power EZ Charge',
  'Jio-bp pulse',
  'Ather Grid',
  'Statiq',
  'Zeon Charging',
  'Fortum Charge & Drive',
  'ChargeZone',
  'TSSPDCL / Municipal',
  'Other'
];

export const DEMO_STATIONS: Station[] = [
  {
    id: 'hyd-01',
    name: 'Tata Power EZ Charge - Cyber Towers Hub',
    address: 'Hitec City Main Rd, Patrika Nagar',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500081',
    latitude: 17.4474,
    longitude: 78.3762,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 150,
    chargingSpeed: 'DC Ultra-Fast (150 kW)',
    pricingPerKwh: 18.50,
    operator: 'Tata Power EZ Charge',
    totalPorts: 8,
    isDemo: true,
    notes: 'Adjacent to Cyber Towers and Mindspace IT Park with 24/7 cafe access.',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'hyd-02',
    name: 'Jio-bp pulse - Gachibowli Financial District',
    address: 'ISB Road, Financial District, Nanakramguda',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500032',
    latitude: 17.4184,
    longitude: 78.3432,
    connectorTypes: ['CCS-2', 'Bharat DC-001'],
    powerKw: 120,
    chargingSpeed: 'DC Fast (120 kW)',
    pricingPerKwh: 17.00,
    operator: 'Jio-bp pulse',
    totalPorts: 6,
    isDemo: true,
    notes: 'Near WaveRock and Amazon Hyderabad campus with dedicated EV bays.',
    createdAt: '2026-01-16T09:30:00.000Z'
  },
  {
    id: 'hyd-03',
    name: 'Statiq Ultra-Fast Station - Sarath City Mall',
    address: 'Gachibowli - Miyapur Rd, Whitefields, Kondapur',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500084',
    latitude: 17.4615,
    longitude: 78.3662,
    connectorTypes: ['CCS-2', 'Type 2', 'CHAdeMO'],
    powerKw: 150,
    chargingSpeed: 'DC Ultra-Fast (150 kW)',
    pricingPerKwh: 19.00,
    operator: 'Statiq',
    totalPorts: 10,
    isDemo: true,
    notes: 'Located inside Sarath City Capital Mall parking (Basement 2, Pillar B12).',
    createdAt: '2026-01-18T10:15:00.000Z'
  },
  {
    id: 'hyd-04',
    name: 'Zeon Charging - Jubilee Hills Road No. 36',
    address: 'Road No. 36, CBI Colony, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500033',
    latitude: 17.4319,
    longitude: 78.4073,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 18.00,
    operator: 'Zeon Charging',
    totalPorts: 4,
    isDemo: true,
    notes: 'Walking distance from Peddamma Temple Metro Station and premium retail outlets.',
    createdAt: '2026-01-20T11:45:00.000Z'
  },
  {
    id: 'hyd-05',
    name: 'Fortum Charge & Drive - Banjara Hills GVK One',
    address: 'Road No. 1, Balapur Basheerbagh Rd, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500034',
    latitude: 17.4195,
    longitude: 78.4485,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 17.50,
    operator: 'Fortum Charge & Drive',
    totalPorts: 6,
    isDemo: true,
    notes: 'At GVK One Mall visitor parking. Multiple dining and entertainment options.',
    createdAt: '2026-01-22T14:20:00.000Z'
  },
  {
    id: 'hyd-06',
    name: 'ChargeZone Supercharger - RGIA Airport Hub',
    address: 'Airport Approach Road, Shamshabad',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500409',
    latitude: 17.2403,
    longitude: 78.4294,
    connectorTypes: ['CCS-2', 'Type 2', 'CHAdeMO'],
    powerKw: 180,
    chargingSpeed: 'DC Ultra-Fast (180 kW)',
    pricingPerKwh: 21.00,
    operator: 'ChargeZone',
    totalPorts: 12,
    isDemo: true,
    notes: 'Located at Rajiv Gandhi International Airport long-term parking. Ideal for highway drivers.',
    createdAt: '2026-01-25T16:00:00.000Z'
  },
  {
    id: 'hyd-07',
    name: 'Tata Power - Begumpet Lifestyle Center',
    address: 'Kundhanbagh Colony, Begumpet',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500016',
    latitude: 17.4447,
    longitude: 78.4664,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 16.50,
    operator: 'Tata Power EZ Charge',
    totalPorts: 4,
    isDemo: true,
    notes: 'Near Begumpet flyover and Lifestyle shopping center with quick snack joints.',
    createdAt: '2026-01-28T09:00:00.000Z'
  },
  {
    id: 'hyd-08',
    name: 'Ather Grid - Madhapur Durgam Cheruvu Hub',
    address: 'Hitech City Rd, CBI Colony, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500081',
    latitude: 17.4435,
    longitude: 78.3888,
    connectorTypes: ['Type 2', 'CCS-2'],
    powerKw: 30,
    chargingSpeed: 'Fast AC/DC (30 kW)',
    pricingPerKwh: 14.50,
    operator: 'Ather Grid',
    totalPorts: 6,
    isDemo: true,
    notes: 'Next to Inorbit Mall and the Durgam Cheruvu Cable Bridge walkway.',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'hyd-09',
    name: 'Jio-bp pulse - Kukatpally KPHB Colony',
    address: 'KPHB Phase 1, Near Forum Nexus Mall, Kukatpally',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500072',
    latitude: 17.4938,
    longitude: 78.3965,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 17.00,
    operator: 'Jio-bp pulse',
    totalPorts: 6,
    isDemo: true,
    notes: 'Close to JNTU Metro Station and Nexus Hyderabad Mall with food court.',
    createdAt: '2026-02-03T15:30:00.000Z'
  },
  {
    id: 'hyd-10',
    name: 'TSSPDCL EcoCharge - Secunderabad Railway Hub',
    address: 'Station Rd, Railway Officer Colony, Secunderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500003',
    latitude: 17.4399,
    longitude: 78.4983,
    connectorTypes: ['CCS-2', 'Bharat DC-001', 'Type 2'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 15.00,
    operator: 'TSSPDCL / Municipal',
    totalPorts: 8,
    isDemo: true,
    notes: 'Right opposite Secunderabad Junction Main Exit. 24/7 security and shaded parking.',
    createdAt: '2026-02-05T10:00:00.000Z'
  },
  {
    id: 'hyd-11',
    name: 'Statiq EV Station - Somajiguda Raj Bhavan',
    address: 'Raj Bhavan Rd, Somajiguda',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500082',
    latitude: 17.4256,
    longitude: 78.4583,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 17.50,
    operator: 'Statiq',
    totalPorts: 4,
    isDemo: true,
    notes: 'Centrally located hub near Yashoda Hospital and Raj Bhavan Road hotels.',
    createdAt: '2026-02-08T11:15:00.000Z'
  },
  {
    id: 'hyd-12',
    name: 'Tata Power - Uppal Stadium Metro Hub',
    address: 'Inner Ring Rd, Uppal',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500039',
    latitude: 17.4018,
    longitude: 78.5593,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 16.00,
    operator: 'Tata Power EZ Charge',
    totalPorts: 6,
    isDemo: true,
    notes: 'Convenient charging near Rajiv Gandhi International Cricket Stadium and Uppal Metro.',
    createdAt: '2026-02-10T14:40:00.000Z'
  },
  {
    id: 'hyd-13',
    name: 'Zeon Charging - Miyapur Allwyn X Roads',
    address: 'NH 65, Allwyn Colony, Miyapur',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500049',
    latitude: 17.4968,
    longitude: 78.3553,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 120,
    chargingSpeed: 'DC Fast (120 kW)',
    pricingPerKwh: 18.00,
    operator: 'Zeon Charging',
    totalPorts: 6,
    isDemo: true,
    notes: 'Directly accessible from Mumbai Highway (NH65). Miyapur Metro terminus nearby.',
    createdAt: '2026-02-12T08:20:00.000Z'
  },
  {
    id: 'hyd-14',
    name: 'ChargeZone - Ameerpet Metro Interchange',
    address: 'Ameerpet Metro Station Parking, Ameerpet',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500016',
    latitude: 17.4375,
    longitude: 78.4482,
    connectorTypes: ['CCS-2', 'Bharat DC-001'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 16.00,
    operator: 'ChargeZone',
    totalPorts: 6,
    isDemo: true,
    notes: 'Hub station under Ameerpet Metro concourse with CCTV surveillance.',
    createdAt: '2026-02-15T13:10:00.000Z'
  },
  {
    id: 'hyd-15',
    name: 'TSSPDCL GreenCharge - Charminar Heritage Zone',
    address: 'High Court Rd, Ghansi Bazaar, Old City',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500002',
    latitude: 17.3616,
    longitude: 78.4747,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 15.00,
    operator: 'TSSPDCL / Municipal',
    totalPorts: 4,
    isDemo: true,
    notes: 'Located close to Salar Jung Museum and Telangana High Court riverside parking.',
    createdAt: '2026-02-18T17:05:00.000Z'
  },
  {
    id: 'hyd-16',
    name: 'Jio-bp pulse - Gachibowli Stadium Hub',
    address: 'Old Mumbai Highway, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500032',
    latitude: 17.4401,
    longitude: 78.3489,
    connectorTypes: ['CCS-2', 'Type 2'],
    powerKw: 150,
    chargingSpeed: 'DC Ultra-Fast (150 kW)',
    pricingPerKwh: 18.00,
    operator: 'Jio-bp pulse',
    totalPorts: 8,
    isDemo: true,
    notes: 'Near G. M. C. Balayogi Athletic Stadium, University of Hyderabad, and outer ring road.',
    createdAt: '2026-02-20T10:45:00.000Z'
  }
];
