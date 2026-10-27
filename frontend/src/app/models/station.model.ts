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
  'CCS',
  'Tesla/NACS',
  'CHAdeMO',
  'Type 2'
];

export const OPERATOR_OPTIONS = [
  'ChargePoint',
  'Electrify America',
  'EVgo',
  'Tesla Supercharger',
  'Volta',
  'Blink',
  'Greenlots',
  'Other / Municipal'
];

export const DEMO_STATIONS: Station[] = [
  {
    id: 'demo-01',
    name: 'Downtown Green Charge Superhub',
    address: '450 Mission St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    latitude: 37.7891,
    longitude: -122.4014,
    connectorTypes: ['CCS', 'Tesla/NACS'],
    powerKw: 150,
    chargingSpeed: 'DC Fast (150 kW)',
    pricingPerKwh: 0.38,
    operator: 'ChargePoint',
    totalPorts: 8,
    isDemo: true,
    notes: 'Conveniently located near Salesforce Tower and transit centers.',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'demo-02',
    name: 'Embarcadero Fast Charger',
    address: '1 Ferry Building',
    city: 'San Francisco',
    state: 'CA',
    zip: '94111',
    latitude: 37.7955,
    longitude: -122.3937,
    connectorTypes: ['CCS', 'CHAdeMO'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 0.35,
    operator: 'EVgo',
    totalPorts: 4,
    isDemo: true,
    notes: 'Scenic spot right on the Embarcadero waterfront with dining nearby.',
    createdAt: '2026-01-16T09:30:00.000Z'
  },
  {
    id: 'demo-03',
    name: 'Silicon Valley Ultra-Charger',
    address: '250 University Ave',
    city: 'Palo Alto',
    state: 'CA',
    zip: '94301',
    latitude: 37.4445,
    longitude: -122.1612,
    connectorTypes: ['CCS', 'Tesla/NACS'],
    powerKw: 350,
    chargingSpeed: 'DC Ultra-Fast (350 kW)',
    pricingPerKwh: 0.42,
    operator: 'Electrify America',
    totalPorts: 12,
    isDemo: true,
    notes: 'Ultra-high power dispensing units suitable for 800V vehicle architectures.',
    createdAt: '2026-01-18T10:15:00.000Z'
  },
  {
    id: 'demo-04',
    name: 'Oakland Uptown ChargePort',
    address: '1955 Broadway',
    city: 'Oakland',
    state: 'CA',
    zip: '94612',
    latitude: 37.8082,
    longitude: -122.2691,
    connectorTypes: ['CCS', 'Type 2'],
    powerKw: 62,
    chargingSpeed: 'DC Fast (62 kW)',
    pricingPerKwh: 0.32,
    operator: 'Volta',
    totalPorts: 6,
    isDemo: true,
    notes: 'Located close to Fox Theater and Uptown dining hub.',
    createdAt: '2026-01-20T11:45:00.000Z'
  },
  {
    id: 'demo-05',
    name: 'Berkeley Marina EcoVolt Hub',
    address: '201 University Ave',
    city: 'Berkeley',
    state: 'CA',
    zip: '94710',
    latitude: 37.8688,
    longitude: -122.3110,
    connectorTypes: ['Type 2', 'CCS'],
    powerKw: 22,
    chargingSpeed: 'Level 2 (22 kW)',
    pricingPerKwh: 0.28,
    operator: 'Greenlots',
    totalPorts: 4,
    isDemo: true,
    notes: 'Powered by onsite solar canopy and Bay views.',
    createdAt: '2026-01-22T14:20:00.000Z'
  },
  {
    id: 'demo-06',
    name: 'San Jose Civic Center Hub',
    address: '200 E Santa Clara St',
    city: 'San Jose',
    state: 'CA',
    zip: '95113',
    latitude: 37.3382,
    longitude: -121.8863,
    connectorTypes: ['CCS', 'CHAdeMO', 'Tesla/NACS'],
    powerKw: 175,
    chargingSpeed: 'DC Ultra-Fast (175 kW)',
    pricingPerKwh: 0.39,
    operator: 'EVgo',
    totalPorts: 10,
    isDemo: true,
    notes: 'Underground parking hub with well-lit dedicated charging bays.',
    createdAt: '2026-01-25T16:00:00.000Z'
  },
  {
    id: 'demo-07',
    name: 'Santa Cruz Boardwalk FastVolt',
    address: '400 Beach St',
    city: 'Santa Cruz',
    state: 'CA',
    zip: '95060',
    latitude: 36.9641,
    longitude: -122.0178,
    connectorTypes: ['Type 2', 'CCS'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 0.31,
    operator: 'ChargePoint',
    totalPorts: 6,
    isDemo: true,
    notes: 'Beachside parking with quick access to boardwalk and wharf.',
    createdAt: '2026-01-28T09:00:00.000Z'
  },
  {
    id: 'demo-08',
    name: 'Los Angeles Downtown HyperCharge',
    address: '800 W Olympic Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90015',
    latitude: 34.0450,
    longitude: -118.2635,
    connectorTypes: ['CCS', 'Tesla/NACS'],
    powerKw: 350,
    chargingSpeed: 'DC Ultra-Fast (350 kW)',
    pricingPerKwh: 0.44,
    operator: 'Electrify America',
    totalPorts: 16,
    isDemo: true,
    notes: 'Adjacent to Crypto.com Arena and LA Live.',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'demo-09',
    name: 'Santa Monica Pier GreenPower',
    address: '1550 Ocean Ave',
    city: 'Santa Monica',
    state: 'CA',
    zip: '90401',
    latitude: 34.0125,
    longitude: -118.4945,
    connectorTypes: ['CCS', 'Type 2'],
    powerKw: 50,
    chargingSpeed: 'DC Fast (50 kW)',
    pricingPerKwh: 0.34,
    operator: 'EVgo',
    totalPorts: 8,
    isDemo: true,
    notes: 'Steps away from Palisades Park and Santa Monica State Beach.',
    createdAt: '2026-02-03T15:30:00.000Z'
  },
  {
    id: 'demo-10',
    name: 'Seattle Waterfront Voltaic Hub',
    address: '1301 Alaskan Way',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    latitude: 47.6062,
    longitude: -122.3385,
    connectorTypes: ['CCS', 'Tesla/NACS'],
    powerKw: 150,
    chargingSpeed: 'DC Fast (150 kW)',
    pricingPerKwh: 0.36,
    operator: 'ChargePoint',
    totalPorts: 8,
    isDemo: true,
    notes: 'Overlooking Elliott Bay with quick walk to Pike Place Market.',
    createdAt: '2026-02-05T10:00:00.000Z'
  },
  {
    id: 'demo-11',
    name: 'Portland Pearl District EcoCharge',
    address: '1025 NW Couch St',
    city: 'Portland',
    state: 'OR',
    zip: '97209',
    latitude: 45.5235,
    longitude: -122.6820,
    connectorTypes: ['CCS', 'Type 2'],
    powerKw: 75,
    chargingSpeed: 'DC Fast (75 kW)',
    pricingPerKwh: 0.30,
    operator: 'Blink',
    totalPorts: 6,
    isDemo: true,
    notes: 'Surrounded by indie coffee roasters, art galleries, and Powells Books.',
    createdAt: '2026-02-08T11:15:00.000Z'
  },
  {
    id: 'demo-12',
    name: 'Denver Mile-High FastVolt',
    address: '1600 California St',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    latitude: 39.7460,
    longitude: -104.9912,
    connectorTypes: ['CCS', 'CHAdeMO'],
    powerKw: 150,
    chargingSpeed: 'DC Fast (150 kW)',
    pricingPerKwh: 0.35,
    operator: 'Electrify America',
    totalPorts: 8,
    isDemo: true,
    notes: 'Convenient charging depot right along the 16th Street pedestrian mall.',
    createdAt: '2026-02-10T14:40:00.000Z'
  },
  {
    id: 'demo-13',
    name: 'Austin Tech Ridge Supercharger',
    address: '12901 I-35 N',
    city: 'Austin',
    state: 'TX',
    zip: '78753',
    latitude: 30.4021,
    longitude: -97.6710,
    connectorTypes: ['Tesla/NACS', 'CCS'],
    powerKw: 250,
    chargingSpeed: 'DC Ultra-Fast (250 kW)',
    pricingPerKwh: 0.37,
    operator: 'Tesla Supercharger',
    totalPorts: 16,
    isDemo: true,
    notes: 'High capacity station with pull-through trailer charging spots.',
    createdAt: '2026-02-12T08:20:00.000Z'
  },
  {
    id: 'demo-14',
    name: 'Chicago Loop Power Station',
    address: '111 N State St',
    city: 'Chicago',
    state: 'IL',
    zip: '60602',
    latitude: 41.8837,
    longitude: -87.6278,
    connectorTypes: ['CCS', 'CHAdeMO', 'Type 2'],
    powerKw: 100,
    chargingSpeed: 'DC Fast (100 kW)',
    pricingPerKwh: 0.39,
    operator: 'EVgo',
    totalPorts: 8,
    isDemo: true,
    notes: 'Heart of the Loop theater district and Millennium Park access.',
    createdAt: '2026-02-15T13:10:00.000Z'
  },
  {
    id: 'demo-15',
    name: 'New York Midtown MegaWatt',
    address: '770 8th Ave',
    city: 'New York',
    state: 'NY',
    zip: '10036',
    latitude: 40.7605,
    longitude: -73.9875,
    connectorTypes: ['CCS', 'Tesla/NACS'],
    powerKw: 350,
    chargingSpeed: 'DC Ultra-Fast (350 kW)',
    pricingPerKwh: 0.49,
    operator: 'Electrify America',
    totalPorts: 12,
    isDemo: true,
    notes: 'Prime Midtown Manhattan location near Broadway and Times Square.',
    createdAt: '2026-02-18T17:05:00.000Z'
  },
  {
    id: 'demo-16',
    name: 'Boston Back Bay EV Hub',
    address: '100 Huntington Ave',
    city: 'Boston',
    state: 'MA',
    zip: '02116',
    latitude: 42.3470,
    longitude: -71.0792,
    connectorTypes: ['CCS', 'Type 2'],
    powerKw: 60,
    chargingSpeed: 'DC Fast (60 kW)',
    pricingPerKwh: 0.38,
    operator: 'ChargePoint',
    totalPorts: 6,
    isDemo: true,
    notes: 'Located at Copley Place with convenient garage charging.',
    createdAt: '2026-02-20T10:45:00.000Z'
  }
];
