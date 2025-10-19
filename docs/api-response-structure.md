# API Response Structure for Data Center Analysis

This document defines the expected JSON response structure from the real API that would replace the current mock data generators.

## Primary Endpoint

### GET /api/parcels/{id}/datacenter-analysis?size={edge|enterprise|midscale|hyperscale}

Returns comprehensive data center development analysis for a specific parcel.

---

## Response Structure

```json
{
  "parcelId": 123,
  "ulpin": "VA-LOUDOUN-12345",
  "generatedAt": "2024-01-15T10:30:00Z",

  "site": {
    "ulpin": "VA-LOUDOUN-12345",
    "acreage": 85.5,
    "latitude": 38.9517,
    "longitude": -77.4481,
    "coordinates": "38.951700, -77.448100",
    "address": "123 Data Center Drive",
    "city": "Ashburn",
    "state": "VA",
    "county": "Loudoun"
  },

  "comparison": {
    "traditional": {
      "developmentTime": 36,
      "riskScore": 65,
      "irr": 12.5,
      "timeToOperation": 42,
      "totalCost": 85000000
    },
    "voltedge": {
      "developmentTime": 24,
      "riskScore": 82,
      "irr": 16.8,
      "timeToOperation": 28,
      "totalCost": 78000000
    }
  },

  "infrastructure": {
    "substations": [
      {
        "id": 1,
        "name": "Ashburn Main Substation",
        "distance": 4.2,
        "voltage": "345kV",
        "capacity": "1200 MVA",
        "lat": 38.9617,
        "lng": -77.4581,
        "operator": "Dominion Energy"
      },
      {
        "id": 2,
        "name": "Ashburn South Substation",
        "distance": 12.8,
        "voltage": "138kV",
        "capacity": "600 MVA",
        "lat": 38.9417,
        "lng": -77.4381,
        "operator": "Dominion Energy"
      }
    ],
    "transmissionLines": [
      {
        "id": 1,
        "name": "Main Grid Corridor",
        "voltage": "345kV",
        "distance": 2.1,
        "operator": "Dominion Energy"
      }
    ],
    "nearestSubstation": {
      "id": 1,
      "name": "Ashburn Main Substation",
      "distance": 4.2,
      "voltage": "345kV",
      "capacity": "1200 MVA",
      "lat": 38.9617,
      "lng": -77.4581,
      "operator": "Dominion Energy"
    },
    "utilityProvider": "Dominion Energy",
    "isoRto": "PJM"
  },

  "risks": {
    "politicalRisk": {
      "score": 88,
      "rating": "Low to Moderate",
      "factors": {
        "permittingClimate": 92,
        "taxIncentives": 85,
        "localSupport": 80,
        "regulatoryStability": 88
      },
      "details": [
        "Pro-business local government",
        "Streamlined permitting process established",
        "Tax incentives available for data center development",
        "Local workforce development programs in place"
      ]
    },
    "seismicRisk": {
      "score": 92,
      "rating": "Seismic Zone 2A",
      "factors": {
        "earthquakeFrequency": 95,
        "soilStability": 88,
        "faultLineProximity": 90
      },
      "details": [
        "Seismic Zone 2",
        "No major fault lines within 100km",
        "Stable bedrock conditions",
        "Low liquefaction risk"
      ]
    },
    "environmentalRisk": {
      "score": 78,
      "rating": "Moderate",
      "factors": {
        "wetlands": 90,
        "endangeredSpecies": 82,
        "floodZones": 85,
        "airQuality": 95
      },
      "details": [
        "No federally protected wetlands on site",
        "Environmental Phase I assessment recommended",
        "Outside 100-year flood zone",
        "No endangered species habitat identified"
      ]
    },
    "transportAccessScore": {
      "score": 85,
      "rating": "Good",
      "factors": {
        "highwayProximity": 3.5,
        "railAccess": 15.2,
        "airportDistance": 28,
        "portAccess": 120
      },
      "details": [
        "Interstate highway within 5 miles",
        "Heavy load road access available",
        "Commercial airport within 50 miles",
        "Rail siding can be extended to site"
      ]
    },
    "waterAvailability": {
      "score": 88,
      "rating": "Excellent",
      "factors": {
        "municipalSupply": 92,
        "groundwater": 85,
        "surfaceWater": 78,
        "waterRights": 88
      },
      "historicalData": [
        {"year": 2019, "availability": 95},
        {"year": 2020, "availability": 93},
        {"year": 2021, "availability": 97},
        {"year": 2022, "availability": 91},
        {"year": 2023, "availability": 94},
        {"year": 2024, "availability": 96}
      ],
      "details": [
        "Municipal water line within 2 miles",
        "High water table (30-50 feet)",
        "No water usage restrictions",
        "Backup well drilling feasible"
      ]
    },
    "climateRisk": {
      "score": 86,
      "rating": "Low",
      "details": [
        "Moderate climate conditions",
        "Low extreme weather frequency",
        "Minimal wildfire risk",
        "Good air cooling potential"
      ]
    }
  },

  "water": {
    "sources": [
      {
        "name": "Municipal Water Supply",
        "distance": 1.8,
        "capacity": "High",
        "reliability": 95,
        "type": "Primary",
        "connection": "Direct",
        "cost": "$2.50/1000 gal",
        "description": "City water main with adequate pressure and flow"
      },
      {
        "name": "Ashburn Reservoir",
        "distance": 5.2,
        "capacity": "Medium-High",
        "reliability": 88,
        "type": "Secondary",
        "connection": "Feasible",
        "cost": "$1.80/1000 gal",
        "description": "Surface water with treatment requirements"
      },
      {
        "name": "Groundwater Wells",
        "distance": 0,
        "capacity": "Medium",
        "reliability": 90,
        "type": "Backup",
        "connection": "On-site drilling",
        "cost": "$0.50/1000 gal",
        "description": "Deep aquifer access for redundancy"
      },
      {
        "name": "Reclaimed Water Facility",
        "distance": 8.5,
        "capacity": "Medium",
        "reliability": 85,
        "type": "Supplemental",
        "connection": "Pipeline required",
        "cost": "$1.20/1000 gal",
        "description": "Recycled water for cooling tower makeup"
      }
    ],
    "historicalAvailability": [
      {"year": 2019, "availability": 95},
      {"year": 2020, "availability": 93},
      {"year": 2021, "availability": 97},
      {"year": 2022, "availability": 91},
      {"year": 2023, "availability": 94},
      {"year": 2024, "availability": 96}
    ]
  },

  "powerPhases": [
    {
      "phase": "Phase 1",
      "name": "Existing Distribution Substation",
      "capacity": "50 MW",
      "startYear": 0,
      "endYear": 2,
      "duration": 2,
      "description": "Leverage existing grid infrastructure",
      "lowMW": 30,
      "highMW": 50
    },
    {
      "phase": "Phase 2",
      "name": "DERMS, BESS, NatGas/Hydrogen Distribution",
      "capacity": "65-75 MW",
      "startYear": 1,
      "endYear": 3,
      "duration": 2,
      "description": "Battery energy storage + distributed energy resources",
      "lowMW": 65,
      "highMW": 75
    },
    {
      "phase": "Phase 3",
      "name": "New Transmission + Phase 1 and 2",
      "capacity": "Up to 300 MW",
      "startYear": 3,
      "endYear": 5,
      "duration": 2,
      "description": "Major transmission expansion for hyperscale capacity",
      "lowMW": 200,
      "highMW": 300
    }
  ],

  "costs": {
    "landAcquisition": {
      "totalAcres": 85.5,
      "pricePerAcre": 28500,
      "totalCost": 2436750,
      "closingCosts": 73103,
      "legalFees": 48735
    },
    "sitePreparation": {
      "grading": 684000,
      "clearing": 299250,
      "drainage": 384750,
      "roads": 1026000,
      "utilities": 1282500
    },
    "permitting": {
      "landUse": 35000,
      "environmental": 68000,
      "building": 125000,
      "electrical": 95000,
      "waterSewer": 48000
    },
    "environmental": {
      "phaseIAssessment": 8500,
      "phaseIIAssessment": 35000,
      "wetlandDelineation": 12000,
      "habitatSurvey": 18000,
      "stormwaterPlan": 22000
    },
    "engineering": {
      "civilEngineering": 215000,
      "electricalEngineering": 285000,
      "structuralEngineering": 168000,
      "geotechnical": 68000
    }
  },

  "permitting": {
    "authorities": [
      {
        "name": "Loudoun County Planning Commission",
        "requirement": "Conditional Use Permit",
        "estimatedTime": "8-12 weeks",
        "voltedgeTime": "6-8 weeks",
        "cost": "$25,000 - $40,000",
        "contact": "planning@loudoun.gov"
      },
      {
        "name": "Virginia Environmental Protection Agency",
        "requirement": "Environmental Impact Assessment",
        "estimatedTime": "12-16 weeks",
        "voltedgeTime": "8-12 weeks",
        "cost": "$45,000 - $80,000",
        "contact": "permits@va.epa.gov"
      }
    ],
    "consultants": [
      {
        "name": "TerraConsult Engineering",
        "specialty": "Civil & Site Engineering",
        "industryAvgTime": "18 weeks",
        "voltedgeNegotiatedTime": "12 weeks",
        "estimatedCost": "$180,000 - $250,000",
        "experience": "25+ data center projects",
        "rating": 4.8
      },
      {
        "name": "GreenPath Environmental Services",
        "specialty": "Environmental Compliance & Permitting",
        "industryAvgTime": "14 weeks",
        "voltedgeNegotiatedTime": "8 weeks",
        "estimatedCost": "$120,000 - $175,000",
        "experience": "40+ EIA reports",
        "rating": 4.9
      }
    ]
  },

  "dcSizes": {
    "edge": {
      "name": "Edge Data Center",
      "powerRange": {"min": 1, "max": 5},
      "sqft": 10000,
      "acresRequired": {"min": 5, "max": 10},
      "description": "Small-scale facilities for edge computing and local content delivery"
    },
    "enterprise": {
      "name": "Enterprise Data Center",
      "powerRange": {"min": 5, "max": 20},
      "sqft": 50000,
      "acresRequired": {"min": 15, "max": 30},
      "description": "Mid-sized facilities for corporate workloads and applications"
    },
    "midscale": {
      "name": "Midscale Data Center",
      "powerRange": {"min": 20, "max": 100},
      "sqft": 200000,
      "acresRequired": {"min": 40, "max": 80},
      "description": "Regional facilities for colocation and cloud services"
    },
    "hyperscale": {
      "name": "Hyperscale Data Center",
      "powerRange": {"min": 100, "max": 500},
      "sqft": 500000,
      "acresRequired": {"min": 100, "max": 200},
      "description": "Large-scale facilities for cloud providers and hyperscale operators"
    }
  },

  "selectedSize": "enterprise",

  "equipment": [
    {
      "category": "Diesel Generators",
      "vendors": ["Caterpillar", "Cummins", "MTU"],
      "industryAvg": 24,
      "voltedge": 16,
      "unitCost": {
        "edge": 150000,
        "enterprise": 250000,
        "midscale": 450000,
        "hyperscale": 800000
      }
    },
    {
      "category": "Cooling Systems (CRAC/CRAH)",
      "vendors": ["Vertiv", "Schneider Electric", "Stulz"],
      "industryAvg": 32,
      "voltedge": 20,
      "unitCost": {
        "edge": 200000,
        "enterprise": 450000,
        "midscale": 850000,
        "hyperscale": 1500000
      }
    }
  ],

  "financials": {
    "initialInvestment": 12500000,
    "annualRevenue": 3125000,
    "npvProjection": [
      {"year": 1, "npv": -9375000},
      {"year": 2, "npv": -6712963},
      {"year": 3, "npv": -4348112},
      {"year": 4, "npv": -2248519},
      {"year": 5, "npv": -395592},
      {"year": 6, "npv": 1218888},
      {"year": 7, "npv": 2618757},
      {"year": 8, "npv": 3827453},
      {"year": 9, "npv": 4870842},
      {"year": 10, "npv": 5770175}
    ],
    "irrAnalysis": [
      {"year": 1, "irr": -25.0},
      {"year": 2, "irr": -15.3},
      {"year": 3, "irr": -8.7},
      {"year": 4, "irr": -3.2},
      {"year": 5, "irr": 2.8},
      {"year": 6, "irr": 8.5},
      {"year": 7, "irr": 12.8},
      {"year": 8, "irr": 15.6},
      {"year": 9, "irr": 17.2},
      {"year": 10, "irr": 18.3}
    ],
    "tcoAnalysis": {
      "years": [
        {"year": 1, "cumulativeTCO": 14000000, "annualOpex": 1500000},
        {"year": 2, "cumulativeTCO": 15500000, "annualOpex": 1500000},
        {"year": 3, "cumulativeTCO": 17000000, "annualOpex": 1500000},
        {"year": 10, "cumulativeTCO": 27500000, "annualOpex": 1500000}
      ]
    },
    "returnsAnalysis": [
      {"year": 1, "revenue": 3125000, "opex": 1500000, "profit": 1625000},
      {"year": 2, "revenue": 3281250, "opex": 1545000, "profit": 1736250},
      {"year": 10, "revenue": 4687500, "opex": 1815000, "profit": 2872500}
    ]
  },

  "marketRisk": {
    "marketRisks": {
      "demandDecline": {
        "score": 72,
        "probability": "Low (10-30%)",
        "impact": "High",
        "mitigation": "Phased development approach with modular design allows scaling based on actual demand",
        "successProbability": 85
      },
      "competitionIntensity": {
        "score": 68,
        "probability": "Medium (30-60%)",
        "impact": "Moderate",
        "mitigation": "Strategic location in high-demand region with pre-secured power and connectivity",
        "successProbability": 78
      }
    },
    "powerRequirements": {
      "gridReliability": {
        "score": 88,
        "probability": "Low (10-30%)",
        "impact": "Critical",
        "mitigation": "Multiple substation connections, on-site generation, and BESS backup",
        "successProbability": 92
      }
    },
    "integrationRisks": {
      "vendorDelays": {
        "score": 70,
        "probability": "Medium (30-60%)",
        "impact": "Moderate",
        "mitigation": "Pre-negotiated lead times with multiple vendor options and backup suppliers",
        "successProbability": 80
      }
    },
    "overallSuccess": {
      "probability": 85,
      "confidenceLevel": "High",
      "keyDrivers": [
        "Strong market fundamentals",
        "Excellent infrastructure access",
        "Proven vendor relationships",
        "Phased risk mitigation approach"
      ]
    }
  },

  "terrain": {
    "slopeAnalysis": "Preliminary analysis shows favorable terrain conditions",
    "averageSlope": "3.2°",
    "maxSlope": "11.5°",
    "suitability": "Excellent for hyperscale development"
  },

  "designLayout": {
    "imageUrl": "/sample_landanalysis.png",
    "version": 1,
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Database Query Pattern

The API endpoint would execute queries similar to:

```sql
-- Main query aggregating all parcel data
SELECT
    p.id as "parcelId",
    p.parcel_number as ulpin,
    NOW() as "generatedAt",

    -- Site information
    json_build_object(
        'ulpin', p.parcel_number,
        'acreage', p.gis_acres,
        'latitude', p.latitude,
        'longitude', p.longitude,
        'coordinates', CONCAT(p.latitude, ', ', p.longitude),
        'address', p.site_address,
        'city', p.site_city,
        'state', p.site_state,
        'county', p.county
    ) as site,

    -- Infrastructure (from subqueries)
    (SELECT json_build_object(
        'substations', json_agg(s),
        'transmissionLines', json_agg(t),
        'utilityProvider', pui.utility_provider,
        'isoRto', pui.iso_rto
    ) FROM parcel_substations s, parcel_transmission_lines t, parcel_utility_info pui
    WHERE s.parcel_id = p.id AND t.parcel_id = p.id AND pui.parcel_id = p.id
    ) as infrastructure,

    -- Risks, costs, financials, etc. (similar patterns)
    ...

FROM parcels p
WHERE p.id = $1;
```

---

## Notes for Implementation

1. **Single API Call**: The frontend expects all data in one response, so the API should pre-join and aggregate data efficiently

2. **Caching**: Since analysis data doesn't change frequently, implement aggressive caching (Redis/CDN) keyed by parcelId + size

3. **Async Generation**: For expensive calculations (financials, risk analysis), consider:
   - Pre-calculating and storing results
   - Background jobs that update analysis periodically
   - Only recalculate on-demand when data changes

4. **Design Layouts**: Store generated PNG images in S3/CDN and return URLs rather than generating on-the-fly

5. **Size Recalculation**: When size parameter changes, only financial projections and comparison metrics need recalculation - infrastructure and risks remain the same

6. **XLSX Export**: Implement separate endpoint for financial model export that reads from same database tables
