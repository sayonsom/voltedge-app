/**
 * Data Center Calculations and Financial Projections
 * Industry-standard formulas and calculations
 */

// Data Center Size Configurations
export const DATA_CENTER_SIZES = {
  edge: {
    name: 'Edge Data Center',
    powerRange: { min: 1, max: 5 },
    sqft: 10000,
    acresRequired: { min: 5, max: 10 },
    description: 'Small-scale facilities for edge computing and local content delivery'
  },
  enterprise: {
    name: 'Enterprise Data Center',
    powerRange: { min: 5, max: 20 },
    sqft: 50000,
    acresRequired: { min: 15, max: 30 },
    description: 'Mid-sized facilities for corporate workloads and applications'
  },
  midscale: {
    name: 'Midscale Data Center',
    powerRange: { min: 20, max: 100 },
    sqft: 200000,
    acresRequired: { min: 40, max: 80 },
    description: 'Regional facilities for colocation and cloud services'
  },
  hyperscale: {
    name: 'Hyperscale Data Center',
    powerRange: { min: 100, max: 500 },
    sqft: 500000,
    acresRequired: { min: 100, max: 200 },
    description: 'Large-scale facilities for cloud providers and hyperscale operators'
  }
};

// Equipment lead times (in weeks)
export const EQUIPMENT_CATEGORIES = [
  {
    category: 'Diesel Generators',
    vendors: ['Caterpillar', 'Cummins', 'MTU'],
    industryAvg: 24,
    voltedge: 16,
    unitCost: { edge: 150000, enterprise: 250000, midscale: 450000, hyperscale: 800000 }
  },
  {
    category: 'Cooling Systems (CRAC/CRAH)',
    vendors: ['Vertiv', 'Schneider Electric', 'Stulz'],
    industryAvg: 32,
    voltedge: 20,
    unitCost: { edge: 200000, enterprise: 450000, midscale: 850000, hyperscale: 1500000 }
  },
  {
    category: 'UPS Systems',
    vendors: ['Eaton', 'Schneider Electric', 'Vertiv'],
    industryAvg: 28,
    voltedge: 18,
    unitCost: { edge: 180000, enterprise: 400000, midscale: 750000, hyperscale: 1300000 }
  },
  {
    category: 'Power Transformers',
    vendors: ['ABB', 'Siemens', 'Schneider Electric'],
    industryAvg: 40,
    voltedge: 26,
    unitCost: { edge: 120000, enterprise: 280000, midscale: 550000, hyperscale: 950000 }
  },
  {
    category: 'Switchgear & Distribution',
    vendors: ['ABB', 'Eaton', 'GE'],
    industryAvg: 36,
    voltedge: 22,
    unitCost: { edge: 100000, enterprise: 220000, midscale: 420000, hyperscale: 750000 }
  },
  {
    category: 'Backup Battery Systems',
    vendors: ['Tesla', 'Fluence', 'AES'],
    industryAvg: 20,
    voltedge: 14,
    unitCost: { edge: 90000, enterprise: 180000, midscale: 350000, hyperscale: 650000 }
  },
  {
    category: 'Fire Suppression Systems',
    vendors: ['Kidde', 'Fike', 'Tyco'],
    industryAvg: 16,
    voltedge: 12,
    unitCost: { edge: 75000, enterprise: 150000, midscale: 280000, hyperscale: 500000 }
  },
  {
    category: 'Security Systems',
    vendors: ['Honeywell', 'Siemens', 'Johnson Controls'],
    industryAvg: 14,
    voltedge: 10,
    unitCost: { edge: 50000, enterprise: 120000, midscale: 220000, hyperscale: 400000 }
  }
];

/**
 * Calculate total equipment cost for a data center size
 */
export function calculateEquipmentCost(dcSize) {
  return EQUIPMENT_CATEGORIES.reduce((total, eq) => {
    return total + (eq.unitCost[dcSize] || 0);
  }, 0);
}

/**
 * Calculate development timeline comparison
 */
export function calculateDevelopmentTimeline(dcSize) {
  const baseTimelines = {
    edge: { traditional: 24, voltedge: 14 },
    enterprise: { traditional: 36, voltedge: 20 },
    midscale: { traditional: 48, voltedge: 28 },
    hyperscale: { traditional: 60, voltedge: 34 }
  };

  return baseTimelines[dcSize] || baseTimelines.enterprise;
}

/**
 * Generate 10-year NPV projections
 */
export function generateNPVProjection(initialInvestment, annualRevenue, opexRate = 0.35, discountRate = 0.08) {
  const years = [];
  let cumulativeNPV = -initialInvestment;

  for (let year = 1; year <= 10; year++) {
    const revenue = annualRevenue * Math.pow(1.03, year - 1); // 3% annual growth
    const opex = revenue * opexRate;
    const cashFlow = revenue - opex;
    const discountFactor = Math.pow(1 + discountRate, year);
    const npv = cashFlow / discountFactor;
    cumulativeNPV += npv;

    years.push({
      year,
      npv: Math.round(cumulativeNPV),
      revenue: Math.round(revenue),
      cashFlow: Math.round(cashFlow)
    });
  }

  return years;
}

/**
 * Generate IRR analysis over 10 years
 */
export function generateIRRAnalysis(initialInvestment, annualRevenue, opexRate = 0.35) {
  const years = [];
  const cashFlows = [-initialInvestment];

  for (let year = 1; year <= 10; year++) {
    const revenue = annualRevenue * Math.pow(1.03, year - 1);
    const opex = revenue * opexRate;
    const cashFlow = revenue - opex;
    cashFlows.push(cashFlow);

    // Calculate approximate IRR up to this year
    const irr = calculateIRR(cashFlows.slice(0, year + 1));

    years.push({
      year,
      irr: Math.round(irr * 100) / 100,
      cumulativeCashFlow: Math.round(cashFlows.slice(1, year + 1).reduce((sum, cf) => sum + cf, 0))
    });
  }

  return years;
}

/**
 * Generate TCO (Total Cost of Ownership) breakdown
 */
export function generateTCOAnalysis(dcSize, acreage) {
  const sizes = DATA_CENTER_SIZES[dcSize];
  const powerMW = (sizes.powerRange.min + sizes.powerRange.max) / 2;

  const costs = {
    capex: {
      land: acreage * 25000,
      building: sizes.sqft * 400,
      power: powerMW * 2000000,
      cooling: powerMW * 1500000,
      networking: powerMW * 800000
    },
    opex: {
      power: powerMW * 1000 * 8760 * 0.08, // Annual at $0.08/kWh
      cooling: powerMW * 500000,
      maintenance: powerMW * 300000,
      staffing: sizes.powerRange.max * 50000,
      insurance: sizes.sqft * 5
    }
  };

  const years = [];
  let cumulativeCost = Object.values(costs.capex).reduce((sum, cost) => sum + cost, 0);
  const annualOpex = Object.values(costs.opex).reduce((sum, cost) => sum + cost, 0);

  for (let year = 1; year <= 10; year++) {
    cumulativeCost += annualOpex * Math.pow(1.025, year - 1); // 2.5% annual increase
    years.push({
      year,
      cumulativeTCO: Math.round(cumulativeCost),
      annualOpex: Math.round(annualOpex * Math.pow(1.025, year - 1))
    });
  }

  return { years, breakdown: costs };
}

/**
 * Generate annual returns projection
 */
export function generateReturnsAnalysis(initialInvestment, dcSize) {
  const sizes = DATA_CENTER_SIZES[dcSize];
  const powerMW = (sizes.powerRange.min + sizes.powerRange.max) / 2;
  const baseRevenue = powerMW * 12000000; // $12M per MW annually (industry avg)

  const years = [];
  for (let year = 1; year <= 10; year++) {
    const revenue = baseRevenue * Math.pow(1.03, year - 1);
    const opex = revenue * 0.35;
    const profit = revenue - opex;
    const roi = (profit / initialInvestment) * 100;

    years.push({
      year,
      revenue: Math.round(revenue),
      opex: Math.round(opex),
      profit: Math.round(profit),
      roi: Math.round(roi * 10) / 10
    });
  }

  return years;
}

/**
 * Calculate comparison metrics (Traditional vs VoltEdge)
 */
export function calculateComparisonMetrics(dcSize, acreage) {
  const sizes = DATA_CENTER_SIZES[dcSize];
  const powerMW = (sizes.powerRange.min + sizes.powerRange.max) / 2;
  const timeline = calculateDevelopmentTimeline(dcSize);

  const baseInvestment = acreage * 25000 + sizes.sqft * 400 + powerMW * 5000000;

  return {
    traditional: {
      developmentTime: timeline.traditional,
      riskScore: 72,
      irr: 8.5,
      timeToOperation: timeline.traditional + 8,
      totalCost: Math.round(baseInvestment * 1.15)
    },
    voltedge: {
      developmentTime: timeline.voltedge,
      riskScore: 85,
      irr: 12.3,
      timeToOperation: timeline.voltedge + 4,
      totalCost: Math.round(baseInvestment * 0.95)
    }
  };
}

/**
 * Calculate approximate IRR using Newton's method
 */
function calculateIRR(cashFlows, guess = 0.1) {
  const maxIterations = 100;
  const tolerance = 0.0001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dnpv += (-t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }

    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // Return as percentage
    }
    rate = newRate;
  }

  return rate * 100;
}

/**
 * Generate market risk analysis data
 */
export function generateMarketRiskAnalysis(dcSize) {
  return {
    marketRisks: {
      demandVolatility: {
        score: 75,
        probability: 'Medium',
        impact: 'Moderate',
        mitigation: 'Diversified tenant mix, flexible power allocations',
        successProbability: 82
      },
      competition: {
        score: 68,
        probability: 'Medium-High',
        impact: 'Moderate',
        mitigation: 'Strategic location advantage, premium connectivity',
        successProbability: 78
      },
      pricingPressure: {
        score: 70,
        probability: 'Medium',
        impact: 'Moderate-High',
        mitigation: 'Value-added services, operational efficiency',
        successProbability: 75
      }
    },
    powerRequirements: {
      gridReliability: {
        score: 88,
        probability: 'Low',
        impact: 'Critical',
        mitigation: 'On-site generation, battery storage, dual feeds',
        successProbability: 95
      },
      capacityConstraints: {
        score: 72,
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Phased development, utility partnership agreements',
        successProbability: 85
      },
      futureExpansion: {
        score: 80,
        probability: 'Medium',
        impact: 'Moderate',
        mitigation: 'Reserved transmission capacity, modular design',
        successProbability: 88
      }
    },
    integrationRisks: {
      vendorCoordination: {
        score: 65,
        probability: 'Medium-High',
        impact: 'Moderate',
        mitigation: 'Pre-qualified vendors, master service agreements',
        successProbability: 80
      },
      constructionDelays: {
        score: 60,
        probability: 'High',
        impact: 'High',
        mitigation: 'Fast-track permitting, prefab components, weather buffers',
        successProbability: 75
      },
      techObsolescence: {
        score: 70,
        probability: 'Medium',
        impact: 'Moderate',
        mitigation: 'Flexible infrastructure, upgrade paths, modular systems',
        successProbability: 82
      }
    },
    overallSuccess: {
      probability: 83,
      confidenceLevel: 'High',
      keyDrivers: [
        'Strong location fundamentals',
        'Proven development approach',
        'Experienced team and partners',
        'Solid financial backing'
      ]
    }
  };
}
