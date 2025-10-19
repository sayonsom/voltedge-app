"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trash2, Edit3, CheckCircle } from 'lucide-react';
import * as turf from '@turf/turf';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = 'mapbox://styles/sayonmapbox/cmgr8win100e301pcg23mewx4';

const defaultCenter = {
  lat: 28.6139, // New Delhi, India
  lng: 77.2090,
};

/**
 * DrawableMap Component
 * Allows users to draw polygons on a map and export as GeoJSON
 */
export default function DrawableMap({
  onPolygonComplete,
  center = defaultCenter,
  zoom = 12,
  readOnly = false
}) {
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [viewState, setViewState] = useState({
    longitude: center.lng,
    latitude: center.lat,
    zoom: zoom,
  });
  const [polygon, setPolygon] = useState(null);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [drawingMode, setDrawingMode] = useState(false);
  const [area, setArea] = useState(0);

  // Update center when prop changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center.lng, center.lat],
        duration: 1000,
      });
    }
  }, [center]);

  // Initialize Mapbox Draw
  useEffect(() => {
    if (!mapRef.current || readOnly) return;

    const map = mapRef.current.getMap();

    if (!drawRef.current) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        styles: [
          // Polygon fill
          {
            'id': 'gl-draw-polygon-fill',
            'type': 'fill',
            'filter': ['all', ['==', '$type', 'Polygon']],
            'paint': {
              'fill-color': '#0078d4',
              'fill-opacity': 0.3
            }
          },
          // Polygon outline
          {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'Polygon']],
            'paint': {
              'line-color': '#0078d4',
              'line-width': 2
            }
          },
          // Vertex points
          {
            'id': 'gl-draw-polygon-and-line-vertex-active',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            'paint': {
              'circle-radius': 5,
              'circle-color': '#fff',
              'circle-stroke-color': '#0078d4',
              'circle-stroke-width': 2
            }
          }
        ]
      });

      map.addControl(draw);
      drawRef.current = draw;

      // Listen for polygon creation
      map.on('draw.create', handleDrawCreate);
      map.on('draw.update', handleDrawUpdate);
      map.on('draw.delete', handleDrawDelete);
    }

    return () => {
      if (drawRef.current) {
        map.off('draw.create', handleDrawCreate);
        map.off('draw.update', handleDrawUpdate);
        map.off('draw.delete', handleDrawDelete);
      }
    };
  }, [readOnly]);

  // Calculate area in acres using Turf.js
  const calculateArea = useCallback((coords) => {
    if (coords.length < 3) return 0;

    try {
      // Create a polygon feature
      const polygonFeature = turf.polygon([[...coords.map(c => [c.lng, c.lat]), [coords[0].lng, coords[0].lat]]]);
      const areaInSquareMeters = turf.area(polygonFeature);
      const areaInAcres = areaInSquareMeters * 0.000247105;
      return areaInAcres;
    } catch (error) {
      console.error('Error calculating area:', error);
      return 0;
    }
  }, []);

  // Convert polygon to GeoJSON
  const polygonToGeoJSON = useCallback((coords) => {
    const coordinates = [...coords.map(c => [c.lng, c.lat]), [coords[0].lng, coords[0].lat]];

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      properties: {
        area_acres: calculateArea(coords),
      },
    };
  }, [calculateArea]);

  const handleDrawCreate = useCallback((e) => {
    const data = e.features[0];
    processPolygon(data);
  }, []);

  const handleDrawUpdate = useCallback((e) => {
    const data = e.features[0];
    processPolygon(data);
  }, []);

  const handleDrawDelete = useCallback(() => {
    setPolygon(null);
    setPolygonCoords([]);
    setArea(0);
    setDrawingMode(false);
    onPolygonComplete?.(null, []);
  }, [onPolygonComplete]);

  const processPolygon = useCallback((feature) => {
    if (!feature || feature.geometry.type !== 'Polygon') return;

    const coordinates = feature.geometry.coordinates[0];
    const coords = coordinates.slice(0, -1).map(([lng, lat]) => ({ lat, lng }));

    setPolygon(feature);
    setPolygonCoords(coords);
    setDrawingMode(false);

    const calculatedArea = calculateArea(coords);
    setArea(calculatedArea);

    const geojson = polygonToGeoJSON(coords);
    onPolygonComplete?.(geojson, coords);
  }, [calculateArea, polygonToGeoJSON, onPolygonComplete]);

  const handleDeletePolygon = useCallback(() => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
      setPolygon(null);
      setPolygonCoords([]);
      setArea(0);
      setDrawingMode(false);
      onPolygonComplete?.(null, []);
    }
  }, [onPolygonComplete]);

  const handleStartDrawing = useCallback(() => {
    if (drawRef.current) {
      // Delete existing polygon if any
      drawRef.current.deleteAll();
      // Start drawing mode
      drawRef.current.changeMode('draw_polygon');
      setDrawingMode(true);
    }
  }, []);

  const handleCancelDrawing = useCallback(() => {
    if (drawRef.current) {
      drawRef.current.changeMode('simple_select');
      setDrawingMode(false);
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
      </Map>

      {/* Drawing Controls */}
      {!readOnly && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {!polygon && !drawingMode && (
            <button
              onClick={handleStartDrawing}
              className="bg-white shadow-lg rounded-lg px-4 py-3 hover:shadow-xl transition-all flex items-center gap-2 text-sm font-medium text-gray-900"
            >
              <Edit3 size={18} className="text-[#0078d4]" />
              Draw Area
            </button>
          )}

          {drawingMode && (
            <button
              onClick={handleCancelDrawing}
              className="bg-white shadow-lg rounded-lg px-4 py-3 hover:shadow-xl transition-all flex items-center gap-2 text-sm font-medium text-gray-900"
            >
              Cancel Drawing
            </button>
          )}

          {polygon && (
            <button
              onClick={handleDeletePolygon}
              className="bg-white shadow-lg rounded-lg px-4 py-3 hover:shadow-xl transition-all flex items-center gap-2 text-sm font-medium text-red-600"
            >
              <Trash2 size={18} />
              Delete Area
            </button>
          )}
        </div>
      )}

      {/* Area Info Badge */}
      {polygon && polygonCoords.length > 0 && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-900">Area Selected</span>
            </div>
            <div className="text-xs text-gray-600">
              {area.toFixed(2)} acres ({polygonCoords.length} points)
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!polygon && !drawingMode && !readOnly && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2 border border-gray-200">
            <p className="text-xs text-gray-600">
              Click "Draw Area" to select the region for analysis
            </p>
          </div>
        </div>
      )}

      {drawingMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-[#0078d4] text-white shadow-lg rounded-lg px-4 py-2">
            <p className="text-xs font-medium">
              Click on the map to draw polygon corners. Double-click to finish.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
