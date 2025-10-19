/**
 * Data Center Analysis Service
 * Provides comprehensive land analysis for data center development
 */

import {
  generateInfrastructureData,
  generateRiskScores,
  generateCostBreakdown,
  generatePermittingRequirements
} from '@/utils/mockDataGenerators';

import {
  DATA_CENTER_SIZES,
  EQUIPMENT_CATEGORIES,
  calculateEquipmentCost,
  calculateDevelopmentTimeline,
  generateNPVProjection,
  generateIRRAnalysis,
  generateTCOAnalysis,
  generateReturnsAnalysis,
  calculateComparisonMetrics,
  generateMarketRiskAnalysis
} from '@/utils/datacenterCalculations';

/**
 * Get comprehensive data center analysis for a parcel
 */
export async function getDataCenterAnalysis(parcelId, parcelData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const { latitude, longitude, gis_acres, parcel_number } = parcelData;
  const acreage = gis_acres || 50;

  // Default to enterprise size for initial calculations
  const defaultSize = 'enterprise';

  // Generate all analysis data
  const infrastructure = generateInfrastructureData(latitude, longitude, acreage);
  const risks = generateRiskScores(latitude, longitude, acreage);
  const costs = generateCostBreakdown(acreage, defaultSize);
  const permitting = generatePermittingRequirements(latitude, longitude);
  const comparison = calculateComparisonMetrics(defaultSize, acreage);
  const marketRisk = generateMarketRiskAnalysis(defaultSize);

  // Calculate initial investment for financial projections
  const landCost = costs.landAcquisition.totalCost + costs.landAcquisition.closingCosts;
  const sitePrepTotal = Object.values(costs.sitePreparation).reduce((sum, cost) => sum + cost, 0);
  const permittingTotal = Object.values(costs.permitting).reduce((sum, cost) => sum + cost, 0);
  const environmentalTotal = Object.values(costs.environmental).reduce((sum, cost) => sum + cost, 0);
  const engineeringTotal = Object.values(costs.engineering).reduce((sum, cost) => sum + cost, 0);
  const equipmentCost = calculateEquipmentCost(defaultSize);

  const initialInvestment = landCost + sitePrepTotal + permittingTotal + environmentalTotal + engineeringTotal + equipmentCost;
  const annualRevenue = initialInvestment * 0.25; // Rough estimate: 25% of investment as annual revenue

  // Generate financial projections
  const npvProjection = generateNPVProjection(initialInvestment, annualRevenue);
  const irrAnalysis = generateIRRAnalysis(initialInvestment, annualRevenue);
  const tcoAnalysis = generateTCOAnalysis(defaultSize, acreage);
  const returnsAnalysis = generateReturnsAnalysis(initialInvestment, defaultSize);

  return {
    parcelId,
    ulpin: parcel_number,
    generatedAt: new Date().toISOString(),

    // Site information
    site: {
      ulpin: parcel_number,
      acreage,
      latitude,
      longitude,
      coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    },

    // Comparison metrics
    comparison,

    // Infrastructure analysis
    infrastructure,

    // Risk scores
    risks,

    // Cost breakdown
    costs,

    // Permitting
    permitting,

    // Data center size options
    dcSizes: DATA_CENTER_SIZES,
    selectedSize: defaultSize,

    // Equipment and vendors
    equipment: EQUIPMENT_CATEGORIES,

    // Financial projections
    financials: {
      initialInvestment: Math.round(initialInvestment),
      annualRevenue: Math.round(annualRevenue),
      npvProjection,
      irrAnalysis,
      tcoAnalysis,
      returnsAnalysis
    },

    // Market and risk analysis
    marketRisk,

    // Slope and terrain (simplified for mock)
    terrain: {
      slopeAnalysis: 'Preliminary analysis shows favorable terrain conditions',
      averageSlope: (2 + Math.random() * 4).toFixed(1) + '°',
      maxSlope: (8 + Math.random() * 7).toFixed(1) + '°',
      suitability: acreage > 80 ? 'Excellent for hyperscale development' : 'Good for enterprise/midscale development'
    }
  };
}

/**
 * Recalculate analysis for a different data center size
 */
export async function recalculateForSize(analysisData, newSize) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const { site, costs: existingCosts } = analysisData;
  const acreage = site.acreage;

  // Recalculate key metrics
  const comparison = calculateComparisonMetrics(newSize, acreage);
  const equipmentCost = calculateEquipmentCost(newSize);

  // Recalculate initial investment
  const landCost = existingCosts.landAcquisition.totalCost + existingCosts.landAcquisition.closingCosts;
  const sitePrepTotal = Object.values(existingCosts.sitePreparation).reduce((sum, cost) => sum + cost, 0);
  const permittingTotal = Object.values(existingCosts.permitting).reduce((sum, cost) => sum + cost, 0);
  const environmentalTotal = Object.values(existingCosts.environmental).reduce((sum, cost) => sum + cost, 0);
  const engineeringTotal = Object.values(existingCosts.engineering).reduce((sum, cost) => sum + cost, 0);

  const initialInvestment = landCost + sitePrepTotal + permittingTotal + environmentalTotal + engineeringTotal + equipmentCost;
  const annualRevenue = initialInvestment * 0.25;

  // Regenerate financial projections
  const npvProjection = generateNPVProjection(initialInvestment, annualRevenue);
  const irrAnalysis = generateIRRAnalysis(initialInvestment, annualRevenue);
  const tcoAnalysis = generateTCOAnalysis(newSize, acreage);
  const returnsAnalysis = generateReturnsAnalysis(initialInvestment, newSize);
  const marketRisk = generateMarketRiskAnalysis(newSize);

  return {
    ...analysisData,
    selectedSize: newSize,
    comparison,
    financials: {
      initialInvestment: Math.round(initialInvestment),
      annualRevenue: Math.round(annualRevenue),
      npvProjection,
      irrAnalysis,
      tcoAnalysis,
      returnsAnalysis
    },
    marketRisk
  };
}

/**
 * Get data center size recommendations based on parcel characteristics
 */
export function getRecommendedSizes(acreage, powerAvailability = 'medium') {
  const recommendations = [];

  Object.entries(DATA_CENTER_SIZES).forEach(([key, config]) => {
    const { acresRequired } = config;
    if (acreage >= acresRequired.min) {
      const score = calculateSuitabilityScore(acreage, acresRequired, powerAvailability);
      recommendations.push({
        size: key,
        ...config,
        suitabilityScore: score,
        reasoning: generateReasoning(acreage, acresRequired, score)
      });
    }
  });

  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

function calculateSuitabilityScore(acreage, required, powerAvailability) {
  let score = 50;

  // Acreage score
  if (acreage >= required.max * 1.5) {
    score += 25;
  } else if (acreage >= required.max) {
    score += 20;
  } else if (acreage >= required.min * 1.2) {
    score += 15;
  } else {
    score += 10;
  }

  // Power availability score
  const powerScores = { high: 25, medium: 15, low: 5 };
  score += powerScores[powerAvailability] || 15;

  return Math.min(score, 100);
}

function generateReasoning(acreage, required, score) {
  if (score >= 85) {
    return `Excellent fit: ${acreage} acres exceeds requirements with room for expansion`;
  } else if (score >= 70) {
    return `Good fit: Adequate space with ${acreage} acres`;
  } else if (score >= 60) {
    return `Viable: Meets minimum requirements at ${acreage} acres`;
  } else {
    return `Possible: ${acreage} acres is at lower bound of requirements`;
  }
}
