# VoltEdge Data Center Analysis - Database Documentation

This directory contains comprehensive documentation for transitioning from mock data to a real database-backed API.

---

## Documentation Files

### 1. **database-schema.sql**
Complete PostgreSQL schema definition with:
- ✅ 16 core tables covering all aspects of datacenter analysis
- ✅ Proper foreign key relationships and indexes
- ✅ Reference data for datacenter sizes and equipment
- ✅ Financial projections tables (NPV, IRR, TCO, Returns)
- ✅ Risk assessment tables
- ✅ Infrastructure and utility data
- ✅ Water sources and availability tracking
- ✅ Permitting authorities and consultant firms
- ✅ User saved parcels ("My List" feature)
- ✅ Pre-populated reference data

**Key Tables:**
- `parcels` - Core land parcel data
- `parcel_substations` - Power infrastructure
- `parcel_water_sources` - Water availability
- `parcel_risk_scores` - Comprehensive risk assessments
- `parcel_financial_projections` - 10-year financial models
- `parcel_power_phases` - Phased power procurement
- `parcel_design_layouts` - Auto-generated layout images

### 2. **api-response-structure.md**
Detailed API response format showing:
- ✅ Complete JSON structure expected by frontend
- ✅ All nested objects and arrays
- ✅ Example values for each field
- ✅ SQL query patterns for efficient data retrieval
- ✅ Notes on caching and performance optimization

**Primary Endpoint:**
```
GET /api/parcels/{id}/datacenter-analysis?size={edge|enterprise|midscale|hyperscale}
```

### 3. **migration-guide.md**
Step-by-step migration plan including:
- ✅ Current vs. target architecture
- ✅ Database setup instructions
- ✅ Backend API implementation examples (Node.js + Python)
- ✅ Frontend service updates needed
- ✅ Data population strategies
- ✅ Testing approach
- ✅ Deployment checklist
- ✅ Rollback plan with feature flags
- ✅ Timeline estimates (5-8 weeks)
- ✅ Cost projections ($230-1,500/month)

---

## Quick Start

### 1. Create Database
```bash
createdb voltedge_datacenter
psql voltedge_datacenter < docs/database-schema.sql
```

### 2. Verify Schema
```sql
\dt  -- List all tables (should see 16+ tables)
SELECT * FROM datacenter_sizes;  -- Should show 4 pre-populated sizes
SELECT * FROM equipment_categories;  -- Should show 8 equipment types
```

### 3. Import Test Data
```sql
-- Import the 40 mock parcels from utils/mockParcelData.js
INSERT INTO parcels (parcel_number, latitude, longitude, site_address, site_city, site_state, gis_acres, ...)
VALUES (...);
```

---

## Database Schema Overview

```
parcels (core table)
  ├── parcel_substations (1:many)
  ├── parcel_transmission_lines (1:many)
  ├── parcel_utility_info (1:1)
  ├── parcel_risk_scores (1:1)
  ├── parcel_risk_details (1:many)
  ├── parcel_water_sources (1:many)
  ├── water_availability_history (1:many)
  ├── parcel_cost_estimates (1:1)
  ├── parcel_terrain (1:1)
  ├── parcel_permitting_requirements (many:many via authorities)
  ├── parcel_consultant_assignments (many:many via consultants)
  ├── parcel_power_phases (1:many)
  ├── parcel_financial_projections (1:many, one per DC size)
  │   ├── npv_projections (1:many, 10 years)
  │   ├── irr_analysis (1:many, 10 years)
  │   ├── tco_analysis (1:many, 10 years)
  │   └── returns_analysis (1:many, 10 years)
  ├── parcel_market_risks (1:many, one per DC size)
  │   ├── market_risk_factors (1:many)
  │   └── market_risk_key_drivers (1:many)
  ├── parcel_comparison_metrics (1:many, one per DC size)
  └── parcel_design_layouts (1:many, one per DC size)
```

---

## Data Relationships

### Infrastructure Data
Each parcel can have:
- Multiple substations with distances and capacities
- Multiple transmission lines
- One utility provider with ISO/RTO region

### Risk Assessments
Each parcel has scores for:
- Political risk (permitting, tax incentives, local support)
- Seismic risk (earthquake zones, soil stability)
- Environmental risk (wetlands, endangered species, flood zones)
- Transport access (highway, rail, airport, port distances)
- Water availability (with 6 years of historical data)
- Climate risk

### Financial Projections
Each parcel × datacenter size combination has:
- 10-year NPV projection
- 10-year IRR analysis
- 10-year TCO analysis
- 10-year returns analysis (revenue, opex, profit)

### Phased Power Procurement
Each parcel has 3 phases:
- Phase 1: Existing distribution (30-50 MW)
- Phase 2: BESS + DERMS (65-75 MW)
- Phase 3: New transmission (200-300 MW)

---

## Reference Data (Pre-populated)

### Datacenter Sizes
- Edge (1-5 MW, 10K sqft, 5-10 acres)
- Enterprise (5-20 MW, 50K sqft, 15-30 acres)
- Midscale (20-100 MW, 200K sqft, 40-80 acres)
- Hyperscale (100-500 MW, 500K sqft, 100-200 acres)

### Equipment Categories (8 types)
- Diesel Generators (Caterpillar, Cummins, MTU)
- Cooling Systems (Vertiv, Schneider, Stulz)
- UPS Systems (Eaton, Schneider, Vertiv)
- Power Transformers (ABB, Siemens, Schneider)
- Switchgear & Distribution (ABB, Eaton, GE)
- Backup Battery Systems (Tesla, Fluence, AES)
- Fire Suppression (Kidde, Fike, Tyco)
- Security Systems (Honeywell, Siemens, Johnson Controls)

---

## Data Sources for Population

### Infrastructure
- **FERC Form 715** - Transmission line data
- **EIA Form 860** - Power plant & substation data
- **OpenStreetMap** - Geographic infrastructure data
- **Utility company GIS portals** - Real-time capacity

### Risk Assessment
- **USGS** - Seismic zone mapping
- **FEMA** - Flood zone maps (FIRM)
- **EPA** - Environmental databases (wetlands, endangered species)
- **NOAA** - Climate and weather data
- **State DOT** - Highway and transport infrastructure

### Cost Data
- **RSMeans** - Construction cost database
- **Local government websites** - Permit fee schedules
- **Engineering firms** - Rate sheets and estimates
- **Equipment manufacturers** - MSRP and lead times

### Water Resources
- **USGS Water Data** - Groundwater and surface water
- **Municipal water utilities** - Capacity and pricing
- **State water boards** - Water rights and restrictions

---

## API Performance Optimization

### Caching Strategy
```
Level 1: CDN (CloudFront)
  └─ Static responses (30 min TTL)

Level 2: Redis
  └─ Dynamic responses (5 min TTL)
  └─ Key: parcel:{id}:size:{size}

Level 3: PostgreSQL
  └─ Indexed queries with materialized views
```

### Query Optimization
- Use materialized views for complex aggregations
- Index all foreign keys and commonly filtered columns
- Denormalize frequently accessed data (scores, ratings)
- Pre-calculate financial projections (update monthly)

### Expected Performance
- **Database query time**: 50-150ms
- **Total API response time**: <500ms (with caching)
- **Frontend render time**: <1s (initial load)

---

## Security Considerations

1. **Row-Level Security (RLS)**
   ```sql
   ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;

   CREATE POLICY parcels_available_policy ON parcels
   FOR SELECT USING (status = 'available' OR owner_id = current_user_id());
   ```

2. **API Authentication**
   - JWT tokens from Firebase Auth
   - Rate limiting (100 requests/min per user)
   - API key for server-to-server calls

3. **Data Privacy**
   - Mask owner information for public listings
   - Redact sensitive cost data until purchase
   - Audit log for all data access

---

## Monitoring & Maintenance

### Database Health Checks
```sql
-- Monitor query performance
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Analyze query plans
EXPLAIN ANALYZE
SELECT * FROM v_datacenter_analysis WHERE id = 1;
```

### Automated Maintenance
- **Daily**: Vacuum and analyze tables
- **Weekly**: Update statistics, reindex if needed
- **Monthly**: Recalculate financial projections
- **Quarterly**: Update equipment costs and lead times

---

## Support & Questions

For implementation questions or issues:

1. Review the migration guide for step-by-step instructions
2. Check the API response structure for data format requirements
3. Examine the SQL schema for table relationships
4. Test queries against sample data before production

---

## Next Steps

1. ✅ Review database schema and understand table relationships
2. ✅ Set up PostgreSQL database locally for development
3. ✅ Import test data (40 mock parcels)
4. ✅ Implement backend API (Node.js or Python)
5. ✅ Update frontend service to call real API
6. ✅ Test end-to-end flow with real data
7. ✅ Deploy to staging environment
8. ✅ Performance test and optimize
9. ✅ Deploy to production with feature flag
10. ✅ Gradually roll out to users

**Estimated Timeline: 5-8 weeks from start to production**

Good luck with the implementation! 🚀
