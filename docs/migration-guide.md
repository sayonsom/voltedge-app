# Migration Guide: From Mock Data to Real API

This guide explains how to transition from the current mock data generators to a real database-backed API.

---

## Current Architecture (Mock Data)

### Files Using Mock Data

1. **`utils/mockDataGenerators.js`** - Generates fake infrastructure, risks, costs, permitting data
2. **`utils/datacenterCalculations.js`** - Calculates financials, equipment costs, comparisons
3. **`services/datacenter-analysis.service.js`** - Orchestrates mock data generation
4. **`utils/mockParcelData.js`** - 40 hardcoded parcels for map search

### Current Flow
```
Frontend Component
    ↓
datacenter-analysis.service.js
    ↓
mockDataGenerators.js + datacenterCalculations.js
    ↓
Returns synthesized JSON to component
```

---

## Target Architecture (Real API)

### New Structure

```
Frontend Component
    ↓
datacenter-analysis.service.js (updated to call API)
    ↓
HTTP Request to Backend API
    ↓
Backend API Server
    ↓
PostgreSQL Database
    ↓
Returns real data to frontend
```

---

## Migration Steps

### Phase 1: Database Setup

1. **Create PostgreSQL database**
   ```bash
   createdb voltedge_datacenter
   ```

2. **Run schema creation**
   ```bash
   psql voltedge_datacenter < docs/database-schema.sql
   ```

3. **Seed reference data**
   - `datacenter_sizes` (already in schema)
   - `equipment_categories` (already in schema)
   - `permitting_authorities` (need to populate)
   - `consultant_firms` (need to populate)

4. **Import initial parcel data**
   - Import the 40 mock parcels from `mockParcelData.js` into `parcels` table
   - This gives you test data immediately

### Phase 2: Backend API Development

#### Option A: Node.js + Express
```javascript
// Example API endpoint structure
const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/parcels/:id/datacenter-analysis', async (req, res) => {
  const { id } = req.params;
  const { size = 'enterprise' } = req.query;

  try {
    // Execute comprehensive query joining all tables
    const result = await pool.query(`
      SELECT
        p.*,
        -- Site info
        json_build_object(
          'ulpin', p.parcel_number,
          'acreage', p.gis_acres,
          'latitude', p.latitude,
          'longitude', p.longitude,
          'coordinates', CONCAT(p.latitude, ', ', p.longitude)
        ) as site,

        -- Infrastructure
        (SELECT json_agg(s) FROM parcel_substations s WHERE s.parcel_id = p.id) as substations,
        (SELECT json_agg(t) FROM parcel_transmission_lines t WHERE t.parcel_id = p.id) as transmission_lines,

        -- Additional joins for all data...

      FROM parcels p
      WHERE p.id = $1
    `, [id]);

    // Transform database result to match frontend expectations
    const analysis = transformDatabaseResult(result.rows[0], size);

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Option B: Python + FastAPI
```python
from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
import os

app = FastAPI()
engine = create_engine(os.getenv('DATABASE_URL'))

@app.get("/api/parcels/{parcel_id}/datacenter-analysis")
async def get_datacenter_analysis(
    parcel_id: int,
    size: str = 'enterprise'
):
    with engine.connect() as conn:
        # Execute comprehensive query
        result = conn.execute("""
            SELECT ... FROM parcels p WHERE p.id = :id
        """, {"id": parcel_id})

        # Transform and return
        return transform_to_frontend_format(result.fetchone(), size)
```

### Phase 3: Frontend Service Update

Update `services/datacenter-analysis.service.js`:

**Before (Mock):**
```javascript
export async function getDataCenterAnalysis(parcelId, parcelData) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const infrastructure = generateInfrastructureData(lat, lng, acreage);
  const risks = generateRiskScores(lat, lng, acreage);
  // ... more mock generation

  return { /* mock data */ };
}
```

**After (Real API):**
```javascript
export async function getDataCenterAnalysis(parcelId, parcelData) {
  try {
    const response = await fetch(
      `/api/parcels/${parcelId}/datacenter-analysis?size=enterprise`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch datacenter analysis:', error);
    throw error;
  }
}

export async function recalculateForSize(analysisData, newSize) {
  const parcelId = analysisData.parcelId;

  try {
    const response = await fetch(
      `/api/parcels/${parcelId}/datacenter-analysis?size=${newSize}`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to recalculate for size:', error);
    throw error;
  }
}
```

### Phase 4: Data Population Strategy

#### Automated Data Collection

1. **Infrastructure Data Sources**
   - Use public utility GIS data (e.g., EIA Form 860)
   - Scrape/API from utility companies
   - OpenStreetMap for transmission lines
   - EPA databases for environmental data

2. **Risk Scoring**
   - USGS for seismic data
   - FEMA flood zone maps
   - State/local permitting databases
   - Historical weather data (NOAA)

3. **Cost Estimates**
   - RSMeans construction cost database
   - Local permit fee schedules
   - Engineering firm rate sheets
   - Equipment manufacturer MSRPs

4. **Financial Projections**
   - Pre-calculate and store in database
   - Recalculate periodically (monthly) via background jobs
   - Use industry benchmark data (Uptime Institute, etc.)

#### Data Import Scripts

```python
# Example: Import parcel infrastructure data
import pandas as pd
import psycopg2

conn = psycopg2.connect(database_url)
cursor = conn.cursor()

# Read substations from CSV/API
substations_df = pd.read_csv('substations_data.csv')

for _, row in substations_df.iterrows():
    cursor.execute("""
        INSERT INTO parcel_substations
        (parcel_id, name, distance_km, voltage, capacity, operator, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        row['parcel_id'],
        row['name'],
        row['distance'],
        row['voltage'],
        row['capacity'],
        row['operator'],
        row['lat'],
        row['lng']
    ))

conn.commit()
```

---

## Component Changes Required

### No Changes Needed

These components will work without modification because they only consume the data structure:

- ✅ All datacenter report components (ComparisonSummaryCards, PowerPhaseGantt, etc.)
- ✅ Map and search components (they already expect array of parcels)
- ✅ UI components (Card, Button, etc.)

### Minor Changes Needed

**`app/parcels/[id]/datacenter-report/page.js`**
- Add error handling for API failures
- Add retry logic
- Consider adding skeleton loaders

```javascript
const [error, setError] = useState('');

useEffect(() => {
  async function fetchData() {
    try {
      const parcelData = await getParcelById(id);
      const analysisData = await getDataCenterAnalysis(id, parcelData);
      setAnalysis(analysisData);
    } catch (e) {
      setError('Failed to load analysis data. Please try again.');
      console.error(e);
    }
  }
  fetchData();
}, [id]);

if (error) {
  return <ErrorDisplay message={error} onRetry={fetchData} />;
}
```

---

## Testing Strategy

### 1. Unit Tests for API Endpoints
```javascript
describe('GET /api/parcels/:id/datacenter-analysis', () => {
  it('should return complete analysis data', async () => {
    const response = await request(app)
      .get('/api/parcels/1/datacenter-analysis')
      .expect(200);

    expect(response.body).toHaveProperty('site');
    expect(response.body).toHaveProperty('infrastructure');
    expect(response.body).toHaveProperty('financials');
  });

  it('should recalculate for different size', async () => {
    const enterprise = await request(app)
      .get('/api/parcels/1/datacenter-analysis?size=enterprise')
      .expect(200);

    const hyperscale = await request(app)
      .get('/api/parcels/1/datacenter-analysis?size=hyperscale')
      .expect(200);

    expect(hyperscale.body.financials.initialInvestment)
      .toBeGreaterThan(enterprise.body.financials.initialInvestment);
  });
});
```

### 2. Integration Tests
- Test full flow from database → API → frontend
- Verify data transformations match expected format
- Test error scenarios (missing data, DB connection failure)

### 3. Performance Tests
- Measure API response times (target: <500ms)
- Load test with concurrent requests
- Verify caching effectiveness

---

## Deployment Checklist

- [ ] Database created and schema applied
- [ ] Reference data seeded (datacenter_sizes, equipment_categories)
- [ ] Initial parcel data imported
- [ ] Backend API deployed and accessible
- [ ] Environment variables configured (DATABASE_URL, API_URL)
- [ ] Frontend service updated to call real API
- [ ] Authentication middleware configured
- [ ] Caching layer implemented (Redis recommended)
- [ ] Monitoring and logging set up
- [ ] Load balancer configured for API
- [ ] Database backups automated
- [ ] API documentation published (Swagger/OpenAPI)

---

## Rollback Plan

Keep mock data files in place during initial rollout:

```javascript
// Feature flag for gradual rollout
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

export async function getDataCenterAnalysis(parcelId, parcelData) {
  if (USE_REAL_API) {
    return await getDataCenterAnalysisFromAPI(parcelId);
  } else {
    return await getDataCenterAnalysisFromMock(parcelId, parcelData);
  }
}
```

This allows instant rollback by changing environment variable if issues arise.

---

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| **Phase 1: DB Setup** | Create schema, seed reference data | 1-2 days |
| **Phase 2: Backend API** | Implement endpoints, data transformation | 1-2 weeks |
| **Phase 3: Frontend Update** | Update services, error handling | 2-3 days |
| **Phase 4: Data Population** | Import real parcel/infrastructure data | 2-4 weeks |
| **Testing & QA** | Unit tests, integration tests, load tests | 1 week |
| **Deployment** | Setup prod infrastructure, monitoring | 3-5 days |

**Total: 5-8 weeks** for full production deployment

---

## Cost Considerations

1. **Database Hosting**
   - AWS RDS PostgreSQL: ~$100-500/month depending on size
   - Managed backups, high availability

2. **API Hosting**
   - AWS ECS/Fargate or App Runner: ~$50-200/month
   - Auto-scaling based on load

3. **Caching Layer**
   - AWS ElastiCache (Redis): ~$50-150/month
   - Reduces database load significantly

4. **Data Storage**
   - S3 for design layout PNGs: ~$10-30/month
   - CloudFront CDN: ~$20-100/month

5. **Data Acquisition**
   - GIS data subscriptions: $0-500/month (many sources are free/public)
   - API costs for external data sources: varies

**Estimated Monthly Cost: $230-1,500** depending on scale and traffic
