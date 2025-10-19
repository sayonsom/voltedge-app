import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const minCost = searchParams.get('minCost');
    const maxCost = searchParams.get('maxCost');
    const zoningStatus = searchParams.get('zoningStatus');
    const environmentalClearance = searchParams.get('environmentalClearance');

    const pool = getPool();

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

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error searching parcels:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
