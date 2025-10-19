/**
 * GeoJSON Utility Functions
 * Validation and manipulation of GeoJSON polygons
 */

/**
 * Validate a GeoJSON polygon
 * @param {Object} geojson - GeoJSON feature to validate
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
export function validateGeoJSON(geojson) {
  const errors = [];

  if (!geojson) {
    errors.push('GeoJSON is required');
    return { valid: false, errors };
  }

  if (geojson.type !== 'Feature') {
    errors.push('GeoJSON must be a Feature');
  }

  if (!geojson.geometry) {
    errors.push('GeoJSON must have a geometry');
    return { valid: false, errors };
  }

  if (geojson.geometry.type !== 'Polygon') {
    errors.push('Geometry must be a Polygon');
  }

  if (!geojson.geometry.coordinates || !Array.isArray(geojson.geometry.coordinates)) {
    errors.push('Polygon must have coordinates array');
    return { valid: false, errors };
  }

  const coordinates = geojson.geometry.coordinates[0];
  
  if (!Array.isArray(coordinates) || coordinates.length < 4) {
    errors.push('Polygon must have at least 4 coordinate pairs (3 unique points + closing point)');
  }

  // Validate each coordinate
  coordinates.forEach((coord, index) => {
    if (!Array.isArray(coord) || coord.length !== 2) {
      errors.push(`Invalid coordinate at index ${index}`);
      return;
    }

    const [lng, lat] = coord;
    
    if (typeof lng !== 'number' || typeof lat !== 'number') {
      errors.push(`Coordinate at index ${index} must be numbers`);
    }

    if (lng < -180 || lng > 180) {
      errors.push(`Longitude at index ${index} must be between -180 and 180`);
    }

    if (lat < -90 || lat > 90) {
      errors.push(`Latitude at index ${index} must be between -90 and 90`);
    }
  });

  // Check if polygon is closed (first and last coordinates match)
  if (coordinates.length >= 4) {
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    
    if (first[0] !== last[0] || first[1] !== last[1]) {
      errors.push('Polygon must be closed (first and last coordinates must match)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate the area of a GeoJSON polygon in acres
 * @param {Object} geojson - GeoJSON feature
 * @returns {number} Area in acres
 */
export function calculatePolygonArea(geojson) {
  if (!geojson?.geometry?.coordinates?.[0]) return 0;
  
  const coordinates = geojson.geometry.coordinates[0];
  
  // Convert to square meters using Shoelace formula (approximate)
  let area = 0;
  const R = 6371000; // Earth's radius in meters
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[i + 1];
    
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lngDiff = (lng2 - lng1) * Math.PI / 180;
    
    area += lngDiff * (Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }
  
  area = Math.abs(area * R * R / 2);
  
  // Convert to acres
  return area * 0.000247105;
}

/**
 * Get the center (centroid) of a GeoJSON polygon
 * @param {Object} geojson - GeoJSON feature
 * @returns {Object} { lat, lng }
 */
export function getPolygonCenter(geojson) {
  if (!geojson?.geometry?.coordinates?.[0]) {
    return null;
  }
  
  const coordinates = geojson.geometry.coordinates[0];
  let latSum = 0;
  let lngSum = 0;
  const count = coordinates.length - 1; // Exclude last point (it's the same as first)
  
  for (let i = 0; i < count; i++) {
    const [lng, lat] = coordinates[i];
    latSum += lat;
    lngSum += lng;
  }
  
  return {
    lat: latSum / count,
    lng: lngSum / count,
  };
}

/**
 * Get the bounding box of a GeoJSON polygon
 * @param {Object} geojson - GeoJSON feature
 * @returns {Object} { minLat, maxLat, minLng, maxLng }
 */
export function getPolygonBounds(geojson) {
  if (!geojson?.geometry?.coordinates?.[0]) {
    return null;
  }
  
  const coordinates = geojson.geometry.coordinates[0];
  
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  
  coordinates.forEach(([lng, lat]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });
  
  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
  };
}

/**
 * Convert lat/lng coordinates array to GeoJSON
 * @param {Array} coords - Array of {lat, lng} objects
 * @param {Object} properties - Additional properties
 * @returns {Object} GeoJSON Feature
 */
export function coordsToGeoJSON(coords, properties = {}) {
  if (!coords || coords.length < 3) {
    throw new Error('At least 3 coordinates required for a polygon');
  }
  
  // Convert to [lng, lat] format and close the polygon
  const coordinates = [
    ...coords.map(c => [c.lng, c.lat]),
    [coords[0].lng, coords[0].lat], // Close the polygon
  ];
  
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
    properties,
  };
}

/**
 * Simplify a polygon by removing unnecessary points
 * @param {Object} geojson - GeoJSON feature
 * @param {number} tolerance - Simplification tolerance (0-1)
 * @returns {Object} Simplified GeoJSON Feature
 */
export function simplifyPolygon(geojson, tolerance = 0.1) {
  // This is a basic implementation
  // For production, consider using a library like Turf.js
  
  if (!geojson?.geometry?.coordinates?.[0]) {
    return geojson;
  }
  
  const coordinates = geojson.geometry.coordinates[0];
  
  if (coordinates.length <= 4) {
    return geojson; // Already minimal
  }
  
  // Keep every nth point based on tolerance
  const step = Math.max(1, Math.floor(tolerance * 10));
  const simplified = [];
  
  for (let i = 0; i < coordinates.length - 1; i += step) {
    simplified.push(coordinates[i]);
  }
  
  // Always include the last point (which closes the polygon)
  simplified.push(coordinates[coordinates.length - 1]);
  
  return {
    ...geojson,
    geometry: {
      ...geojson.geometry,
      coordinates: [simplified],
    },
  };
}
