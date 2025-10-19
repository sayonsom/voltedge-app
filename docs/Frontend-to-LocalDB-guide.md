# Frontend Database Connection Guide

This guide explains how to connect your frontend application to the PostgreSQL database populated with datacenter parcel data.

## Database Connection Details

```
Host: localhost
Port: 5432
Database: voltedge_datacenter
Username: sayon
Password: (no password set)
```

## Architecture Options

### Option 1: Backend API (Recommended)

**DO NOT connect directly from frontend to PostgreSQL** for security reasons. Instead, create a backend API layer.

#### Why Use a Backend API?
- Prevents exposing database credentials to the browser
- Provides authentication and authorization
- Allows data validation and business logic
- Enables caching and rate limiting
- Better security practices

#### Recommended Stack

**Node.js + Express + PostgreSQL**

1. **Install Dependencies**
```bash
npm init -y
npm install express pg cors dotenv
npm install --save-dev nodemon
```

2. **Create Backend API** (`server.js`)
```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// PostgreSQL connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voltedge_datacenter',
  user: 'sayon',
  // No password needed for local development
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// ============================================================
// API ENDPOINTS
// ============================================================

// 1. Get all parcels with pagination
app.get('/api/parcels', async (req, res) => {
  try {
    const { page = 1, limit = 10, city } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        parcel_id,
        parcel_number,
        site_name,
        site_city,
        site_state,
        latitude,
        longitude,
        parcel_area_sqm,
        land_cost_usd,
        zoning_status,
        environmental_clearance,
        ownership_type,
        availability_date
      FROM parcels
    `;

    const params = [];
    if (city) {
      query += ' WHERE site_city = $1';
      params.push(city);
      query += ` ORDER BY parcel_id LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      query += ` ORDER BY parcel_id LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const result = await pool.query(query, params);

    // Get total count
    const countQuery = city
      ? 'SELECT COUNT(*) FROM parcels WHERE site_city = $1'
      : 'SELECT COUNT(*) FROM parcels';
    const countParams = city ? [city] : [];
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching parcels:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get single parcel with all details
app.get('/api/parcels/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get parcel details
    const parcelQuery = 'SELECT * FROM parcels WHERE parcel_id = $1';
    const parcelResult = await pool.query(parcelQuery, [id]);

    if (parcelResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Parcel not found' });
    }

    // Get related data
    const [substations, waterSources, terrain, costs, financials] = await Promise.all([
      pool.query('SELECT * FROM parcel_substations WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_water_sources WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_terrain WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_cost_estimates WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_financial_projections WHERE parcel_id = $1', [id])
    ]);

    res.json({
      success: true,
      data: {
        parcel: parcelResult.rows[0],
        substations: substations.rows,
        waterSources: waterSources.rows,
        terrain: terrain.rows[0],
        costs: costs.rows[0],
        financials: financials.rows
      }
    });
  } catch (err) {
    console.error('Error fetching parcel details:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get all cities with parcel counts
app.get('/api/cities', async (req, res) => {
  try {
    const query = `
      SELECT
        site_city,
        site_state,
        COUNT(*) as parcel_count,
        AVG(land_cost_usd) as avg_land_cost,
        AVG(parcel_area_sqm) as avg_area
      FROM parcels
      GROUP BY site_city, site_state
      ORDER BY parcel_count DESC
    `;

    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get financial projections for a parcel
app.get('/api/parcels/:id/financials', async (req, res) => {
  try {
    const { id } = req.params;
    const { datacenter_size } = req.query;

    let query = `
      SELECT
        datacenter_size_mw,
        total_capex_usd,
        total_opex_10yr_usd,
        total_revenue_10yr_usd,
        npv_10yr_usd,
        irr_10yr_percent,
        tco_10yr_usd
      FROM parcel_financial_projections
      WHERE parcel_id = $1
    `;

    const params = [id];
    if (datacenter_size) {
      query += ' AND datacenter_size_mw = $2';
      params.push(datacenter_size);
    }

    query += ' ORDER BY datacenter_size_mw';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching financials:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Get power infrastructure for a parcel
app.get('/api/parcels/:id/power', async (req, res) => {
  try {
    const { id } = req.params;

    const [substations, lines, phases] = await Promise.all([
      pool.query('SELECT * FROM parcel_substations WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_transmission_lines WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_power_phases WHERE parcel_id = $1 ORDER BY phase_number', [id])
    ]);

    res.json({
      success: true,
      data: {
        substations: substations.rows,
        transmissionLines: lines.rows,
        powerPhases: phases.rows
      }
    });
  } catch (err) {
    console.error('Error fetching power infrastructure:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Get consultant firms
app.get('/api/consultants', async (req, res) => {
  try {
    const { specialty } = req.query;

    let query = 'SELECT * FROM consultant_firms';
    const params = [];

    if (specialty) {
      query += ' WHERE primary_specialty = $1';
      params.push(specialty);
    }

    query += ' ORDER BY firm_name';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching consultants:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Search parcels
app.get('/api/parcels/search', async (req, res) => {
  try {
    const {
      city,
      minArea,
      maxArea,
      minCost,
      maxCost,
      zoningStatus,
      environmentalClearance
    } = req.query;

    let query = 'SELECT * FROM parcels WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND site_city = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }

    if (minArea) {
      query += ` AND parcel_area_sqm >= $${paramIndex}`;
      params.push(minArea);
      paramIndex++;
    }

    if (maxArea) {
      query += ` AND parcel_area_sqm <= $${paramIndex}`;
      params.push(maxArea);
      paramIndex++;
    }

    if (minCost) {
      query += ` AND land_cost_usd >= $${paramIndex}`;
      params.push(minCost);
      paramIndex++;
    }

    if (maxCost) {
      query += ` AND land_cost_usd <= $${paramIndex}`;
      params.push(maxCost);
      paramIndex++;
    }

    if (zoningStatus) {
      query += ` AND zoning_status = $${paramIndex}`;
      params.push(zoningStatus);
      paramIndex++;
    }

    if (environmentalClearance) {
      query += ` AND environmental_clearance = $${paramIndex}`;
      params.push(environmentalClearance === 'true');
      paramIndex++;
    }

    query += ' ORDER BY parcel_id';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error searching parcels:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT parcel_id) as total_parcels,
        COUNT(DISTINCT site_city) as total_cities,
        SUM(parcel_area_sqm) as total_area_sqm,
        AVG(land_cost_usd) as avg_land_cost,
        SUM(land_cost_usd) as total_land_value
      FROM parcels
    `);

    const substationCount = await pool.query('SELECT COUNT(*) FROM parcel_substations');
    const waterSourceCount = await pool.query('SELECT COUNT(*) FROM parcel_water_sources');

    res.json({
      success: true,
      data: {
        ...stats.rows[0],
        total_substations: parseInt(substationCount.rows[0].count),
        total_water_sources: parseInt(waterSourceCount.rows[0].count)
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
  console.log(`
Available endpoints:
  GET  /api/parcels              - Get all parcels (with pagination)
  GET  /api/parcels/:id          - Get parcel details
  GET  /api/parcels/:id/financials - Get financial projections
  GET  /api/parcels/:id/power    - Get power infrastructure
  GET  /api/cities               - Get all cities
  GET  /api/consultants          - Get consultant firms
  GET  /api/parcels/search       - Search parcels
  GET  /api/dashboard/stats      - Get dashboard statistics
  GET  /health                   - Health check
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
  });
});
```

3. **Create .env file**
```bash
PORT=3001
DATABASE_URL=postgresql://sayon@localhost:5432/voltedge_datacenter
```

4. **Update package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

5. **Run the API**
```bash
npm run dev
```

---

## Frontend Integration Examples

### React Example

**Install Axios**
```bash
npm install axios
```

**Create API Service** (`src/services/api.js`)
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parcelService = {
  // Get all parcels
  getAllParcels: (page = 1, limit = 10, city = null) => {
    const params = { page, limit };
    if (city) params.city = city;
    return api.get('/parcels', { params });
  },

  // Get single parcel
  getParcelById: (id) => {
    return api.get(`/parcels/${id}`);
  },

  // Get financials
  getParcelFinancials: (id, datacenterSize = null) => {
    const params = {};
    if (datacenterSize) params.datacenter_size = datacenterSize;
    return api.get(`/parcels/${id}/financials`, { params });
  },

  // Get power infrastructure
  getParcelPower: (id) => {
    return api.get(`/parcels/${id}/power`);
  },

  // Search parcels
  searchParcels: (filters) => {
    return api.get('/parcels/search', { params: filters });
  },
};

export const cityService = {
  getAllCities: () => api.get('/cities'),
};

export const consultantService = {
  getAllConsultants: (specialty = null) => {
    const params = {};
    if (specialty) params.specialty = specialty;
    return api.get('/consultants', { params });
  },
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
```

**React Component Example** (`src/components/ParcelList.jsx`)
```javascript
import React, { useState, useEffect } from 'react';
import { parcelService } from '../services/api';

function ParcelList() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchParcels();
  }, [page]);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const response = await parcelService.getAllParcels(page, 10);
      setParcels(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="parcel-list">
      <h2>Datacenter Parcels</h2>
      <table>
        <thead>
          <tr>
            <th>Parcel Number</th>
            <th>Site Name</th>
            <th>City</th>
            <th>Area (sqm)</th>
            <th>Cost (USD)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel) => (
            <tr key={parcel.parcel_id}>
              <td>{parcel.parcel_number}</td>
              <td>{parcel.site_name}</td>
              <td>{parcel.site_city}</td>
              <td>{parcel.parcel_area_sqm.toLocaleString()}</td>
              <td>${parcel.land_cost_usd.toLocaleString()}</td>
              <td>
                <button onClick={() => viewDetails(parcel.parcel_id)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ParcelList;
```

---

### Next.js Example (App Router)

**API Route** (`app/api/parcels/route.js`)
```javascript
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voltedge_datacenter',
  user: 'sayon',
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM parcels ORDER BY parcel_id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM parcels');

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(countResult.rows[0].count / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### Vue.js Example

**API Service** (`src/services/parcelService.js`)
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export default {
  async getParcels(page = 1, limit = 10) {
    const response = await axios.get(`${API_URL}/parcels`, {
      params: { page, limit }
    });
    return response.data;
  },

  async getParcelById(id) {
    const response = await axios.get(`${API_URL}/parcels/${id}`);
    return response.data;
  },

  async getCities() {
    const response = await axios.get(`${API_URL}/cities`);
    return response.data;
  }
};
```

---

## Option 2: GraphQL API (Advanced)

For more complex queries, consider using GraphQL with PostGraphile or Hasura.

**PostGraphile Example**
```bash
npm install postgraphile
npx postgraphile -c postgresql://sayon@localhost:5432/voltedge_datacenter --watch --enhance-graphiql
```

---

## Option 3: Supabase (Cloud Alternative)

If you want to deploy this to production, consider using Supabase which provides:
- Automatic REST and GraphQL APIs
- Real-time subscriptions
- Built-in authentication
- Row-level security

---

## Security Best Practices

1. **Never expose database credentials in frontend code**
2. **Use environment variables** for sensitive data
3. **Implement authentication** (JWT, OAuth, etc.)
4. **Add rate limiting** to prevent abuse
5. **Validate all inputs** on the backend
6. **Use HTTPS** in production
7. **Implement CORS** properly
8. **Add database connection pooling**

---

## Testing the API

**Using curl**
```bash
# Get all parcels
curl http://localhost:3001/api/parcels

# Get specific parcel
curl http://localhost:3001/api/parcels/1

# Get cities
curl http://localhost:3001/api/cities

# Get dashboard stats
curl http://localhost:3001/api/dashboard/stats
```

**Using Postman or Thunder Client**
- Import the endpoints listed above
- Test with different parameters
- Check response formats

---

## Next Steps

1. Clone or create the backend API using the code above
2. Install dependencies
3. Start the server
4. Test endpoints using curl or Postman
5. Integrate with your frontend application
6. Add authentication as needed
7. Deploy to production (Vercel, Railway, Render, etc.)

---

## Need Help?

- Check the PostgreSQL connection using: `psql voltedge_datacenter`
- View database tables: `\dt` in psql
- Test queries: `SELECT * FROM parcels LIMIT 5;`
