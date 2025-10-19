import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const pool = getPool();

    const [substations, lines, phases] = await Promise.all([
      pool.query('SELECT * FROM parcel_substations WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_transmission_lines WHERE parcel_id = $1', [id]),
      pool.query('SELECT * FROM parcel_power_phases WHERE parcel_id = $1 ORDER BY phase_number', [id])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        substations: substations.rows,
        transmissionLines: lines.rows,
        powerPhases: phases.rows
      }
    });
  } catch (error) {
    console.error('Error fetching power infrastructure:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
