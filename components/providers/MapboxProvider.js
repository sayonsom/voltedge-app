'use client';

/**
 * MapboxProvider
 * Simple provider that ensures Mapbox token is available
 * Mapbox components will handle their own loading
 */
export default function MapboxProvider({ children }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!token) {
    console.error('Mapbox access token is missing');
    return <div className="p-4 text-red-600">Mapbox access token is not configured</div>;
  }

  return <>{children}</>;
}
