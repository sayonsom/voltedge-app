import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const pool = getPool();

    // Get parcel details
    const parcelQuery = 'SELECT * FROM parcels WHERE id = $1';
    const parcelResult = await pool.query(parcelQuery, [id]);

    if (parcelResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Parcel not found' },
        { status: 404 }
      );
    }

    // Get related data
    const [substations, waterSources, terrain, costs, financials] = await Promise.all([
      pool.query('SELECT * FROM parcel_substations WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_water_sources WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_terrain WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_cost_estimates WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_financial_projections WHERE parcel_id = $1', [id])
    ]);

    return NextResponse.json({
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
  } catch (error) {
    console.error('Error fetching parcel details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
