import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = getPool();

    const query = `
      SELECT
        site_city,
        site_state,
        COUNT(*) as parcel_count,
        AVG(total_price) as avg_land_cost,
        AVG(gis_acres) as avg_area
      FROM parcels
      WHERE site_city IS NOT NULL
      GROUP BY site_city, site_state
      ORDER BY parcel_count DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
