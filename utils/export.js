/**
 * Export Utilities
 * Functions to export parcel data to various formats
 */

/**
 * Export parcels to CSV
 * @param {Array} parcels - Array of parcel objects
 * @param {string} filename - Output filename (without extension)
 */
export function exportToCSV(parcels, filename = 'parcels') {
  if (!parcels || parcels.length === 0) {
    console.warn('No parcels to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Parcel Number',
    'Owner Name',
    'Site Address',
    'City',
    'State',
    'ZIP',
    'Latitude',
    'Longitude',
    'Acres',
    'Square Feet',
    'Use Type',
    'Use Description',
    'Zoning',
    'Land Value',
    'Improvement Value',
    'Total Value',
    'Sale Price',
    'Sale Date',
    'Year Built',
    'QOZ',
    'County',
  ];

  // Convert parcels to CSV rows
  const rows = parcels.map(p => [
    p.parcel_number || '',
    p.owner_name || '',
    p.site_address || '',
    p.site_city || '',
    p.site_state || '',
    p.site_zip || '',
    p.latitude || '',
    p.longitude || '',
    p.gis_acres || '',
    p.calculated_sqft || '',
    p.use_code || '',
    p.use_description || '',
    p.zoning || '',
    p.land_value || '',
    p.improvement_value || '',
    p.total_value || '',
    p.sale_price || '',
    p.sale_date || '',
    p.year_built || '',
    p.qualified_opportunity_zone ? 'Yes' : 'No',
    p.county_name || '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape cells with commas or quotes
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export parcels to PDF (simplified version)
 * Creates a printable HTML page that can be printed to PDF
 * @param {Array} parcels - Array of parcel objects
 * @param {string} title - Document title
 */
export function exportToPDF(parcels, title = 'Parcel Report') {
  if (!parcels || parcels.length === 0) {
    console.warn('No parcels to export');
    return;
  }

  const formatCurrency = (val) => val ? `$${val.toLocaleString()}` : 'N/A';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 20px;
          font-size: 12px;
        }
        h1 {
          color: #0078d4;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .meta {
          color: #666;
          margin-bottom: 20px;
          font-size: 11px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background: #0078d4;
          color: white;
          padding: 8px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
        }
        td {
          padding: 6px 8px;
          border-bottom: 1px solid #e5e5e5;
        }
        tr:hover {
          background: #f3f2f1;
        }
        .qoz {
          color: #f59e0b;
          font-weight: bold;
        }
        .page-break {
          page-break-after: always;
        }
        @media print {
          body { margin: 10mm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">
        Generated on ${new Date().toLocaleString()}<br>
        Total Parcels: ${parcels.length}
      </div>
      
      <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px;">
        Print / Save as PDF
      </button>
      
      <table>
        <thead>
          <tr>
            <th>APN</th>
            <th>Owner</th>
            <th>Address</th>
            <th>Acres</th>
            <th>Use</th>
            <th>Value</th>
            <th>QOZ</th>
          </tr>
        </thead>
        <tbody>
          ${parcels.map(p => `
            <tr>
              <td style="font-family: monospace; font-weight: 600;">${p.parcel_number}</td>
              <td>${p.owner_name || 'N/A'}</td>
              <td>
                ${p.site_address || 'N/A'}
                ${p.site_city ? `<br><small style="color: #666;">${p.site_city}, ${p.site_state}</small>` : ''}
              </td>
              <td style="text-align: right;">${p.gis_acres?.toFixed(2) || 'N/A'}</td>
              <td>${p.use_description || p.use_code || 'N/A'}</td>
              <td style="text-align: right;">${formatCurrency(p.total_value)}</td>
              <td style="text-align: center;">${p.qualified_opportunity_zone ? '<span class="qoz">⭐</span>' : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #0078d4; color: #666; font-size: 10px;">
        <strong>VoltEdge</strong> | Parcel Analysis Report | Confidential
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Export single parcel to JSON
 * @param {Object} parcel - Parcel object
 * @param {string} filename - Output filename
 */
export function exportToJSON(parcel, filename) {
  const blob = new Blob([JSON.stringify(parcel, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `parcel_${parcel.parcel_number}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
