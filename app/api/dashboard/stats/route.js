import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = getPool();

    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT id) as total_parcels,
        COUNT(DISTINCT site_city) as total_cities,
        SUM(gis_acres) as total_area_acres,
        AVG(total_price) as avg_land_cost,
        SUM(total_price) as total_land_value
      FROM parcels
    `);

    const substationCount = await pool.query('SELECT COUNT(*) FROM parcel_substations');
    const waterSourceCount = await pool.query('SELECT COUNT(*) FROM parcel_water_sources');

    return NextResponse.json({
      success: true,
      data: {
        ...stats.rows[0],
        total_substations: parseInt(substationCount.rows[0].count),
        total_water_sources: parseInt(waterSourceCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
