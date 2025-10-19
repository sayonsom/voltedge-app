import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const offset = (page - 1) * limit;

    const pool = getPool();

    let query = `
      SELECT
        id,
        parcel_number,
        site_address,
        site_city,
        site_state,
        latitude,
        longitude,
        gis_acres,
        total_price,
        zoning,
        status,
        overall_score,
        power_score,
        connectivity_score,
        location_score
      FROM parcels
    `;

    const params = [];
    if (city) {
      query += ' WHERE site_city = $1';
      params.push(city);
      query += ` ORDER BY id LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      query += ` ORDER BY id LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const result = await pool.query(query, params);

    // Get total count
    const countQuery = city
      ? 'SELECT COUNT(*) FROM parcels WHERE site_city = $1'
      : 'SELECT COUNT(*) FROM parcels';
    const countParams = city ? [city] : [];
    const countResult = await pool.query(countQuery, countParams);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: page,
        limit: limit,
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
