'use client';

import { LoadScript } from '@react-google-maps/api';

const libraries = ['drawing', 'geometry', 'places'];

export default function GoogleMapsProvider({ children }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return <div className="p-4 text-red-600">Google Maps API key is not configured</div>;
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      loadingElement={<div>Loading Maps...</div>}
    >
      {children}
    </LoadScript>
  );
}
