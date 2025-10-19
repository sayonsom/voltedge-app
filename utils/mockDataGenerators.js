/**
 * Mock Data Generators for Data Center Land Analysis
 * Generates realistic data based on parcel characteristics
 */

export function generateInfrastructureData(latitude, longitude, acreage) {
  // Generate substations within 50km radius
  const substations = [
    {
      id: 1,
      name: `${getRegionName(latitude, longitude)} Main Substation`,
      distance: 4.2 + Math.random() * 10,
      voltage: '345kV',
      capacity: '1200 MVA',
      lat: latitude + (Math.random() - 0.5) * 0.1,
      lng: longitude + (Math.random() - 0.5) * 0.1,
      operator: getUtilityName(latitude, longitude)
    },
    {
      id: 2,
      name: `${getRegionName(latitude, longitude)} South Substation`,
      distance: 12.8 + Math.random() * 15,
      voltage: '138kV',
      capacity: '600 MVA',
      lat: latitude + (Math.random() - 0.5) * 0.2,
      lng: longitude + (Math.random() - 0.5) * 0.2,
      operator: getUtilityName(latitude, longitude)
    },
    {
      id: 3,
      name: `Regional Transfer Station`,
      distance: 22.5 + Math.random() * 20,
      voltage: '230kV',
      capacity: '800 MVA',
      lat: latitude + (Math.random() - 0.5) * 0.3,
      lng: longitude + (Math.random() - 0.5) * 0.3,
      operator: getUtilityName(latitude, longitude)
    }
  ];

  // Generate transmission lines
  const transmissionLines = [
    {
      id: 1,
      name: 'Main Grid Corridor',
      voltage: '345kV',
      distance: 2.1 + Math.random() * 5,
      operator: getUtilityName(latitude, longitude)
    },
    {
      id: 2,
      name: 'Regional Interconnect',
      voltage: '138kV',
      distance: 8.3 + Math.random() * 10,
      operator: getUtilityName(latitude, longitude)
    }
  ];

  return {
    substations,
    transmissionLines,
    nearestSubstation: substations[0],
    utilityProvider: getUtilityName(latitude, longitude),
    isoRto: getISORegion(latitude, longitude)
  };
}

export function generateRiskScores(latitude, longitude, acreage) {
  const baseRiskFactor = Math.random() * 0.2 + 0.8; // 0.8-1.0

  return {
    politicalRisk: {
      score: Math.round((75 + Math.random() * 20) * baseRiskFactor),
      rating: 'Low to Moderate',
      factors: {
        permittingClimate: Math.round(80 + Math.random() * 15),
        taxIncentives: Math.round(70 + Math.random() * 25),
        localSupport: Math.round(65 + Math.random() * 30),
        regulatoryStability: Math.round(75 + Math.random() * 20)
      },
      details: [
        'Pro-business local government',
        'Streamlined permitting process established',
        'Tax incentives available for data center development',
        'Local workforce development programs in place'
      ]
    },
    seismicRisk: {
      score: Math.round((85 + Math.random() * 10) * baseRiskFactor),
      rating: getSeismicZone(latitude, longitude),
      factors: {
        earthquakeFrequency: Math.round(90 + Math.random() * 10),
        soilStability: Math.round(80 + Math.random() * 15),
        faultLineProximity: Math.round(85 + Math.random() * 10)
      },
      details: [
        `Seismic Zone ${Math.floor(Math.random() * 3) + 1}`,
        'No major fault lines within 100km',
        'Stable bedrock conditions',
        'Low liquefaction risk'
      ]
    },
    environmentalRisk: {
      score: Math.round((70 + Math.random() * 25) * baseRiskFactor),
      rating: 'Moderate',
      factors: {
        wetlands: Math.round(85 + Math.random() * 10),
        endangeredSpecies: Math.round(75 + Math.random() * 20),
        floodZones: Math.round(80 + Math.random() * 15),
        airQuality: Math.round(90 + Math.random() * 5)
      },
      details: [
        'No federally protected wetlands on site',
        'Environmental Phase I assessment recommended',
        'Outside 100-year flood zone',
        'No endangered species habitat identified'
      ]
    },
    transportAccessScore: {
      score: Math.round((75 + Math.random() * 20) * baseRiskFactor),
      rating: 'Good',
      factors: {
        highwayProximity: 3.2 + Math.random() * 5,
        railAccess: 12.5 + Math.random() * 15,
        airportDistance: 25 + Math.random() * 30,
        portAccess: 85 + Math.random() * 100
      },
      details: [
        'Interstate highway within 5 miles',
        'Heavy load road access available',
        'Commercial airport within 50 miles',
        'Rail siding can be extended to site'
      ]
    },
    waterAvailability: {
      score: Math.round((80 + Math.random() * 15) * baseRiskFactor),
      rating: 'Excellent',
      factors: {
        municipalSupply: Math.round(85 + Math.random() * 10),
        groundwater: Math.round(75 + Math.random() * 20),
        surfaceWater: Math.round(70 + Math.random() * 25),
        waterRights: Math.round(80 + Math.random() * 15)
      },
      historicalData: [
        { year: 2019, availability: 95 },
        { year: 2020, availability: 93 },
        { year: 2021, availability: 97 },
        { year: 2022, availability: 91 },
        { year: 2023, availability: 94 },
        { year: 2024, availability: 96 }
      ],
      details: [
        'Municipal water line within 2 miles',
        'High water table (30-50 feet)',
        'No water usage restrictions',
        'Backup well drilling feasible'
      ]
    },
    climateRisk: {
      score: Math.round((82 + Math.random() * 13) * baseRiskFactor),
      rating: 'Low',
      details: [
        'Moderate climate conditions',
        'Low extreme weather frequency',
        'Minimal wildfire risk',
        'Good air cooling potential'
      ]
    }
  };
}

export function generateCostBreakdown(acreage, selectedDCSize) {
  const pricePerAcre = 15000 + Math.random() * 20000; // $15k-$35k per acre
  const landCost = acreage * pricePerAcre;

  return {
    landAcquisition: {
      totalAcres: acreage,
      pricePerAcre: Math.round(pricePerAcre),
      totalCost: Math.round(landCost),
      closingCosts: Math.round(landCost * 0.03),
      legalFees: Math.round(landCost * 0.02)
    },
    sitePreparation: {
      grading: Math.round(acreage * 8000),
      clearing: Math.round(acreage * 3500),
      drainage: Math.round(acreage * 4500),
      roads: Math.round(acreage * 12000),
      utilities: Math.round(acreage * 15000)
    },
    permitting: {
      landUse: 25000 + Math.round(Math.random() * 15000),
      environmental: 45000 + Math.round(Math.random() * 35000),
      building: 85000 + Math.round(Math.random() * 65000),
      electrical: 65000 + Math.round(Math.random() * 45000),
      waterSewer: 35000 + Math.round(Math.random() * 25000)
    },
    environmental: {
      phaseIAssessment: 8500,
      phaseIIAssessment: 35000,
      wetlandDelineation: 12000,
      habitatSurvey: 18000,
      stormwaterPlan: 22000
    },
    engineering: {
      civilEngineering: 150000 + Math.round(Math.random() * 100000),
      electricalEngineering: 200000 + Math.round(Math.random() * 150000),
      structuralEngineering: 125000 + Math.round(Math.random() * 75000),
      geotechnical: 45000 + Math.round(Math.random() * 35000)
    }
  };
}

export function generatePermittingRequirements(latitude, longitude) {
  const county = getCountyName(latitude, longitude);
  const state = getStateName(latitude, longitude);

  return {
    authorities: [
      {
        name: `${county} Planning Commission`,
        requirement: 'Conditional Use Permit',
        estimatedTime: '8-12 weeks',
        voltedgeTime: '6-8 weeks',
        cost: '$25,000 - $40,000',
        contact: 'planning@county.gov'
      },
      {
        name: `${state} Environmental Protection Agency`,
        requirement: 'Environmental Impact Assessment',
        estimatedTime: '12-16 weeks',
        voltedgeTime: '8-12 weeks',
        cost: '$45,000 - $80,000',
        contact: 'permits@state.epa.gov'
      },
      {
        name: 'U.S. Army Corps of Engineers',
        requirement: 'Section 404 Wetlands Permit',
        estimatedTime: '16-24 weeks',
        voltedgeTime: '10-14 weeks',
        cost: '$30,000 - $50,000',
        contact: 'regulatory@usace.army.mil'
      },
      {
        name: 'Federal Aviation Administration',
        requirement: 'Form 7460-1 (if structures > 200ft)',
        estimatedTime: '6-8 weeks',
        voltedgeTime: '4-6 weeks',
        cost: '$5,000 - $10,000',
        contact: 'obstruction@faa.gov'
      },
      {
        name: `${state} Public Service Commission`,
        requirement: 'Certificate of Public Convenience',
        estimatedTime: '14-20 weeks',
        voltedgeTime: '10-14 weeks',
        cost: '$50,000 - $75,000',
        contact: 'applications@psc.state.gov'
      }
    ],
    consultants: [
      {
        name: 'TerraConsult Engineering',
        specialty: 'Civil & Site Engineering',
        industryAvgTime: '18 weeks',
        voltedgeNegotiatedTime: '12 weeks',
        estimatedCost: '$180,000 - $250,000',
        experience: '25+ data center projects',
        rating: 4.8
      },
      {
        name: 'GreenPath Environmental Services',
        specialty: 'Environmental Compliance & Permitting',
        industryAvgTime: '14 weeks',
        voltedgeNegotiatedTime: '8 weeks',
        estimatedCost: '$120,000 - $175,000',
        experience: '40+ EIA reports',
        rating: 4.9
      },
      {
        name: 'PowerGrid Solutions Inc.',
        specialty: 'Electrical & Grid Interconnection',
        industryAvgTime: '10 weeks',
        voltedgeNegotiatedTime: '6 weeks',
        estimatedCost: '$200,000 - $300,000',
        experience: '35+ utility interconnections',
        rating: 4.7
      },
      {
        name: 'AquaTech Water Resources',
        specialty: 'Water Rights & Infrastructure',
        industryAvgTime: '12 weeks',
        voltedgeNegotiatedTime: '7 weeks',
        estimatedCost: '$85,000 - $125,000',
        experience: '50+ water permit applications',
        rating: 4.6
      },
      {
        name: 'GeoStability Consulting',
        specialty: 'Geotechnical & Foundation Engineering',
        industryAvgTime: '8 weeks',
        voltedgeNegotiatedTime: '5 weeks',
        estimatedCost: '$95,000 - $140,000',
        experience: '60+ soil investigations',
        rating: 4.8
      }
    ]
  };
}

// Helper functions
function getRegionName(lat, lng) {
  const regions = ['Northern', 'Southern', 'Eastern', 'Western', 'Central'];
  return regions[Math.floor(Math.abs(lat + lng) % regions.length)];
}

function getUtilityName(lat, lng) {
  const utilities = [
    'Pacific Gas & Electric',
    'Duke Energy',
    'Southern Company',
    'Dominion Energy',
    'Xcel Energy',
    'Commonwealth Edison',
    'Baltimore Gas & Electric'
  ];
  return utilities[Math.floor(Math.abs(lat * lng * 100) % utilities.length)];
}

function getISORegion(lat, lng) {
  if (lng < -100) return 'CAISO';
  if (lng < -95 && lat > 35) return 'MISO';
  if (lat > 40 && lng > -80) return 'PJM';
  if (lat < 35) return 'ERCOT';
  return 'SPP';
}

function getSeismicZone(lat, lng) {
  // West coast = higher risk
  if (lng < -115) return 'Moderate to High';
  return 'Low to Moderate';
}

function getCountyName(lat, lng) {
  const counties = ['Jefferson', 'Madison', 'Washington', 'Franklin', 'Lincoln'];
  return counties[Math.floor(Math.abs(lat + lng) % counties.length)] + ' County';
}

function getStateName(lat, lng) {
  if (lng < -120) return 'California';
  if (lng < -105) return 'Colorado';
  if (lng < -95) return 'Texas';
  if (lng < -85) return 'Illinois';
  if (lat > 40) return 'Virginia';
  return 'North Carolina';
}
