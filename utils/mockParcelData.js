/**
 * Mock Parcel Data Generator
 * Generates 40 realistic land parcels across various US locations
 */

// US regions with coordinates
const US_LOCATIONS = [
  // Virginia (Northern VA - Data center alley)
  { state: 'VA', city: 'Ashburn', county: 'Loudoun County', lat: 39.0438, lng: -77.4874, region: 'Northern Virginia' },
  { state: 'VA', city: 'Manassas', county: 'Prince William County', lat: 38.7509, lng: -77.4753, region: 'Northern Virginia' },
  { state: 'VA', city: 'Sterling', county: 'Loudoun County', lat: 39.0062, lng: -77.4286, region: 'Northern Virginia' },

  // North Carolina
  { state: 'NC', city: 'Raleigh', county: 'Wake County', lat: 35.7796, lng: -78.6382, region: 'Research Triangle' },
  { state: 'NC', city: 'Durham', county: 'Durham County', lat: 35.9940, lng: -78.8986, region: 'Research Triangle' },
  { state: 'NC', city: 'Charlotte', county: 'Mecklenburg County', lat: 35.2271, lng: -80.8431, region: 'Piedmont' },

  // Texas
  { state: 'TX', city: 'Dallas', county: 'Dallas County', lat: 32.7767, lng: -96.7970, region: 'North Texas' },
  { state: 'TX', city: 'Austin', county: 'Travis County', lat: 30.2672, lng: -97.7431, region: 'Central Texas' },
  { state: 'TX', city: 'San Antonio', county: 'Bexar County', lat: 29.4241, lng: -98.4936, region: 'South Texas' },
  { state: 'TX', city: 'Houston', county: 'Harris County', lat: 29.7604, lng: -95.3698, region: 'Gulf Coast' },

  // Illinois
  { state: 'IL', city: 'Chicago', county: 'Cook County', lat: 41.8781, lng: -87.6298, region: 'Chicagoland' },
  { state: 'IL', city: 'Aurora', county: 'Kane County', lat: 41.7606, lng: -88.3201, region: 'Chicagoland' },

  // California
  { state: 'CA', city: 'San Jose', county: 'Santa Clara County', lat: 37.3382, lng: -121.8863, region: 'Silicon Valley' },
  { state: 'CA', city: 'Sacramento', county: 'Sacramento County', lat: 38.5816, lng: -121.4944, region: 'Central Valley' },
  { state: 'CA', city: 'Los Angeles', county: 'Los Angeles County', lat: 34.0522, lng: -118.2437, region: 'Southern California' },

  // Georgia
  { state: 'GA', city: 'Atlanta', county: 'Fulton County', lat: 33.7490, lng: -84.3880, region: 'Metro Atlanta' },
  { state: 'GA', city: 'Marietta', county: 'Cobb County', lat: 33.9526, lng: -84.5499, region: 'Metro Atlanta' },

  // Ohio
  { state: 'OH', city: 'Columbus', county: 'Franklin County', lat: 39.9612, lng: -82.9988, region: 'Central Ohio' },
  { state: 'OH', city: 'Cincinnati', county: 'Hamilton County', lat: 39.1031, lng: -84.5120, region: 'Southwest Ohio' },

  // Arizona
  { state: 'AZ', city: 'Phoenix', county: 'Maricopa County', lat: 33.4484, lng: -112.0740, region: 'Valley of the Sun' },
  { state: 'AZ', city: 'Mesa', county: 'Maricopa County', lat: 33.4152, lng: -111.8315, region: 'Valley of the Sun' },

  // Oregon
  { state: 'OR', city: 'Portland', county: 'Multnomah County', lat: 45.5152, lng: -122.6784, region: 'Willamette Valley' },
  { state: 'OR', city: 'Hillsboro', county: 'Washington County', lat: 45.5229, lng: -122.9898, region: 'Portland Metro' },

  // Washington
  { state: 'WA', city: 'Seattle', county: 'King County', lat: 47.6062, lng: -122.3321, region: 'Puget Sound' },
  { state: 'WA', city: 'Quincy', county: 'Grant County', lat: 47.2340, lng: -119.8528, region: 'Central Washington' },

  // Nevada
  { state: 'NV', city: 'Reno', county: 'Washoe County', lat: 39.5296, lng: -119.8138, region: 'Northern Nevada' },
  { state: 'NV', city: 'Las Vegas', county: 'Clark County', lat: 36.1699, lng: -115.1398, region: 'Southern Nevada' },

  // Colorado
  { state: 'CO', city: 'Denver', county: 'Denver County', lat: 39.7392, lng: -104.9903, region: 'Front Range' },
  { state: 'CO', city: 'Aurora', county: 'Arapahoe County', lat: 39.7294, lng: -104.8319, region: 'Front Range' },

  // Pennsylvania
  { state: 'PA', city: 'Philadelphia', county: 'Philadelphia County', lat: 39.9526, lng: -75.1652, region: 'Southeast Pennsylvania' },

  // Maryland
  { state: 'MD', city: 'Baltimore', county: 'Baltimore County', lat: 39.2904, lng: -76.6122, region: 'Central Maryland' },
];

const ZONING_TYPES = ['I-1', 'I-2', 'M-1', 'M-2', 'C-2', 'PD', 'MXD', 'AG-1'];
const USE_TYPES = ['Industrial', 'Commercial', 'Mixed Use', 'Agricultural', 'Planned Development'];

/**
 * Generate 40 mock land parcels with realistic data
 */
export function generateMockParcels() {
  const parcels = [];

  for (let i = 0; i < 40; i++) {
    const location = US_LOCATIONS[i % US_LOCATIONS.length];

    // Add some randomness to coordinates (within ~5 miles)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    const acreage = generateAcreage();
    const pricePerAcre = generatePricePerAcre(location.state, acreage);
    const powerProximity = Math.random() * 15; // km
    const fiberProximity = Math.random() * 10; // km
    const zoning = ZONING_TYPES[Math.floor(Math.random() * ZONING_TYPES.length)];
    const waterAvailable = Math.random() > 0.3; // 70% have water
    const opportunityZone = Math.random() > 0.7; // 30% are opportunity zones

    parcels.push({
      id: `PARCEL-${String(i + 1).padStart(3, '0')}`,
      ulpin: generateULPIN(location.state, location.county, i),
      parcel_number: `${location.state}-${String(i + 1).padStart(6, '0')}`,

      // Location
      state: location.state,
      city: location.city,
      county: location.county,
      region: location.region,
      latitude: location.lat + latOffset,
      longitude: location.lng + lngOffset,
      site_address: `${Math.floor(Math.random() * 9000) + 1000} Industrial Pkwy`,
      site_city: location.city,
      site_state: location.state,
      site_zip: generateZipCode(location.state),

      // Land details
      gis_acres: acreage,
      calculated_sqft: Math.round(acreage * 43560),
      zoning: zoning,
      use_description: USE_TYPES[Math.floor(Math.random() * USE_TYPES.length)],
      use_code: zoning,

      // Valuation
      land_value: Math.round(acreage * pricePerAcre),
      price_per_acre: pricePerAcre,
      improvement_value: Math.random() > 0.7 ? Math.round(Math.random() * 500000) : 0,
      total_value: Math.round(acreage * pricePerAcre + (Math.random() > 0.7 ? Math.random() * 500000 : 0)),

      // Infrastructure
      power_proximity_km: powerProximity,
      power_proximity_miles: powerProximity * 0.621371,
      fiber_proximity_km: fiberProximity,
      fiber_proximity_miles: fiberProximity * 0.621371,
      water_available: waterAvailable,
      sewer_available: Math.random() > 0.4,
      gas_available: Math.random() > 0.5,

      // Special designations
      qualified_opportunity_zone: opportunityZone,
      enterprise_zone: Math.random() > 0.8,

      // Data center suitability scores
      power_score: calculatePowerScore(powerProximity),
      connectivity_score: calculateConnectivityScore(fiberProximity),
      location_score: calculateLocationScore(location.state),
      overall_score: 0, // Will be calculated below

      // Terrain
      terrain_type: generateTerrainType(),
      slope_category: generateSlopeCategory(),
      flood_zone: Math.random() > 0.85 ? 'Zone A' : 'Zone X',

      // Ownership
      owner_name: generateOwnerName(i),

      // Metadata
      last_sale_date: generateSaleDate(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Calculate overall scores
  parcels.forEach(parcel => {
    parcel.overall_score = Math.round(
      (parcel.power_score + parcel.connectivity_score + parcel.location_score) / 3
    );
  });

  return parcels;
}

/**
 * Generate realistic acreage (biased towards data center-suitable sizes)
 */
function generateAcreage() {
  const rand = Math.random();

  if (rand < 0.15) return Math.round((5 + Math.random() * 10) * 10) / 10; // 5-15 acres (edge)
  if (rand < 0.35) return Math.round((15 + Math.random() * 25) * 10) / 10; // 15-40 acres (enterprise)
  if (rand < 0.65) return Math.round((40 + Math.random() * 60) * 10) / 10; // 40-100 acres (midscale)
  return Math.round((100 + Math.random() * 200) * 10) / 10; // 100-300 acres (hyperscale)
}

/**
 * Generate realistic price per acre based on location and size
 */
function generatePricePerAcre(state, acreage) {
  const basePrice = {
    'VA': 45000, 'NC': 25000, 'TX': 20000, 'IL': 35000,
    'CA': 80000, 'GA': 22000, 'OH': 28000, 'AZ': 30000,
    'OR': 35000, 'WA': 40000, 'NV': 25000, 'CO': 38000,
    'PA': 32000, 'MD': 42000
  };

  const base = basePrice[state] || 30000;

  // Larger parcels have lower per-acre cost
  const sizeMultiplier = acreage < 20 ? 1.3 : acreage < 50 ? 1.1 : acreage < 100 ? 1.0 : 0.85;

  return Math.round(base * sizeMultiplier * (0.8 + Math.random() * 0.4));
}

/**
 * Generate ULPIN (Unique Land Parcel Identification Number)
 */
function generateULPIN(state, county, index) {
  const stateCode = state.charCodeAt(0) + state.charCodeAt(1);
  const countyCode = county.split(' ')[0].substring(0, 3).toUpperCase();
  const parcelNum = String(index + 1).padStart(8, '0');
  return `${stateCode}-${countyCode}-${parcelNum}`;
}

/**
 * Generate zip code by state
 */
function generateZipCode(state) {
  const zipRanges = {
    'VA': [20000, 24999], 'NC': [27000, 28999], 'TX': [75000, 79999],
    'IL': [60000, 62999], 'CA': [90000, 96199], 'GA': [30000, 31999],
    'OH': [43000, 45999], 'AZ': [85000, 86599], 'OR': [97000, 97999],
    'WA': [98000, 99499], 'NV': [89000, 89999], 'CO': [80000, 81699],
    'PA': [15000, 19699], 'MD': [20600, 21999]
  };

  const range = zipRanges[state] || [10000, 99999];
  return Math.floor(range[0] + Math.random() * (range[1] - range[0]));
}

/**
 * Calculate power infrastructure score
 */
function calculatePowerScore(proximityKm) {
  if (proximityKm < 2) return 95 + Math.random() * 5;
  if (proximityKm < 5) return 85 + Math.random() * 10;
  if (proximityKm < 10) return 70 + Math.random() * 15;
  return 50 + Math.random() * 20;
}

/**
 * Calculate connectivity score
 */
function calculateConnectivityScore(fiberKm) {
  if (fiberKm < 1) return 90 + Math.random() * 10;
  if (fiberKm < 3) return 80 + Math.random() * 10;
  if (fiberKm < 7) return 65 + Math.random() * 15;
  return 45 + Math.random() * 20;
}

/**
 * Calculate location score based on state (data center market maturity)
 */
function calculateLocationScore(state) {
  const tier1 = ['VA', 'TX', 'IL', 'GA', 'CA', 'WA'];
  const tier2 = ['NC', 'OH', 'AZ', 'OR', 'CO', 'NV'];

  if (tier1.includes(state)) return 85 + Math.random() * 15;
  if (tier2.includes(state)) return 70 + Math.random() * 15;
  return 60 + Math.random() * 15;
}

/**
 * Generate terrain type
 */
function generateTerrainType() {
  const types = ['Flat', 'Gently Rolling', 'Rolling', 'Hilly', 'Mixed'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Generate slope category
 */
function generateSlopeCategory() {
  const rand = Math.random();
  if (rand < 0.5) return '0-5% (Ideal)';
  if (rand < 0.8) return '5-10% (Good)';
  if (rand < 0.95) return '10-15% (Fair)';
  return '15%+ (Challenging)';
}

/**
 * Generate owner name
 */
function generateOwnerName(index) {
  const companies = [
    'Smith Family Trust', 'Johnson Properties LLC', 'Williams Investment Group',
    'Brown Land Holdings', 'Davis Development Corp', 'Miller Real Estate Trust',
    'Wilson Family Partners', 'Moore Industrial Properties', 'Taylor Land Co',
    'Anderson Holdings LLC', 'Thomas Property Group', 'Jackson Investments',
    'White Oak Properties', 'Harris Land Trust', 'Martin Development LLC',
    'Thompson Real Estate', 'Garcia Properties Inc', 'Martinez Holdings',
    'Robinson Land Group', 'Clark Investment Trust', 'Rodriguez Properties',
    'Lewis Development Co', 'Lee Family Holdings', 'Walker Properties LLC',
    'Hall Investment Group', 'Allen Land Trust', 'Young Properties Inc',
    'Hernandez Holdings', 'King Development LLC', 'Wright Real Estate',
    'Lopez Properties', 'Hill Land Holdings', 'Scott Investment Trust',
    'Green Valley Properties', 'Adams Development Co', 'Baker Holdings LLC',
    'Gonzalez Properties', 'Nelson Land Group', 'Carter Investment Trust',
    'Mitchell Real Estate'
  ];

  return companies[index % companies.length];
}

/**
 * Generate sale date (within last 5 years)
 */
function generateSaleDate() {
  const yearsAgo = Math.floor(Math.random() * 5);
  const monthsAgo = Math.floor(Math.random() * 12);
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  date.setMonth(date.getMonth() - monthsAgo);
  return date.toISOString().split('T')[0];
}

// Generate and export the parcels
export const MOCK_PARCELS = generateMockParcels();

/**
 * Get parcel by ID
 */
export function getParcelById(id) {
  return MOCK_PARCELS.find(p => p.id === id || p.parcel_number === id);
}

/**
 * Filter parcels by criteria
 */
export function filterParcels(criteria = {}) {
  let filtered = [...MOCK_PARCELS];

  // State filter
  if (criteria.state && criteria.state.length > 0) {
    filtered = filtered.filter(p => criteria.state.includes(p.state));
  }

  // Acreage filter
  if (criteria.minAcreage) {
    filtered = filtered.filter(p => p.gis_acres >= criteria.minAcreage);
  }
  if (criteria.maxAcreage) {
    filtered = filtered.filter(p => p.gis_acres <= criteria.maxAcreage);
  }

  // Price filter
  if (criteria.maxPricePerAcre) {
    filtered = filtered.filter(p => p.price_per_acre <= criteria.maxPricePerAcre);
  }

  // Power proximity filter
  if (criteria.maxPowerDistance) {
    filtered = filtered.filter(p => p.power_proximity_km <= criteria.maxPowerDistance);
  }

  // Fiber proximity filter
  if (criteria.maxFiberDistance) {
    filtered = filtered.filter(p => p.fiber_proximity_km <= criteria.maxFiberDistance);
  }

  // Water availability
  if (criteria.waterRequired) {
    filtered = filtered.filter(p => p.water_available === true);
  }

  // Opportunity zone
  if (criteria.opportunityZoneOnly) {
    filtered = filtered.filter(p => p.qualified_opportunity_zone === true);
  }

  // Minimum overall score
  if (criteria.minOverallScore) {
    filtered = filtered.filter(p => p.overall_score >= criteria.minOverallScore);
  }

  // Zoning types
  if (criteria.zoning && criteria.zoning.length > 0) {
    filtered = filtered.filter(p => criteria.zoning.includes(p.zoning));
  }

  // Sort by score (highest first) by default
  filtered.sort((a, b) => b.overall_score - a.overall_score);

  return filtered;
}

/**
 * Get statistics for all parcels
 */
export function getParcelStats() {
  return {
    total: MOCK_PARCELS.length,
    avgAcreage: Math.round(MOCK_PARCELS.reduce((sum, p) => sum + p.gis_acres, 0) / MOCK_PARCELS.length),
    avgPricePerAcre: Math.round(MOCK_PARCELS.reduce((sum, p) => sum + p.price_per_acre, 0) / MOCK_PARCELS.length),
    avgOverallScore: Math.round(MOCK_PARCELS.reduce((sum, p) => sum + p.overall_score, 0) / MOCK_PARCELS.length),
    opportunityZones: MOCK_PARCELS.filter(p => p.qualified_opportunity_zone).length,
    byState: MOCK_PARCELS.reduce((acc, p) => {
      acc[p.state] = (acc[p.state] || 0) + 1;
      return acc;
    }, {}),
    bySize: {
      edge: MOCK_PARCELS.filter(p => p.gis_acres >= 5 && p.gis_acres < 15).length,
      enterprise: MOCK_PARCELS.filter(p => p.gis_acres >= 15 && p.gis_acres < 40).length,
      midscale: MOCK_PARCELS.filter(p => p.gis_acres >= 40 && p.gis_acres < 100).length,
      hyperscale: MOCK_PARCELS.filter(p => p.gis_acres >= 100).length
    }
  };
}
