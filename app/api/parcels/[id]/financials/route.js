import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const datacenterSize = searchParams.get('datacenter_size');
    const pool = getPool();

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

    const queryParams = [id];
    if (datacenterSize) {
      query += ' AND datacenter_size_mw = $2';
      queryParams.push(datacenterSize);
    }

    query += ' ORDER BY datacenter_size_mw';

    const result = await pool.query(query, queryParams);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching financials:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
