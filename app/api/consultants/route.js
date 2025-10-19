import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const pool = getPool();

    let query = 'SELECT * FROM consultant_firms';
    const params = [];

    if (specialty) {
      query += ' WHERE primary_specialty = $1';
      params.push(specialty);
    }

    query += ' ORDER BY firm_name';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching consultants:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
