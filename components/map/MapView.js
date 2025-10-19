"use client";

import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { Map, Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import supercluster from 'supercluster';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = 'mapbox://styles/sayonmapbox/cmgr8win100e301pcg23mewx4';

// Microsoft 365 aesthetic marker colors
const MARKER_COLORS = {
  project: '#0078d4',
  recent: '#525252',
  parcel: '#ea580b',
  location: '#dc2626',
};

// Custom marker component
function MarkerIcon({ type = 'parcel', size = 40, isLocation = false }) {
  const color = MARKER_COLORS[type] || MARKER_COLORS.parcel;
  const actualSize = isLocation ? 48 : size;

  return (
    <svg
      width={actualSize}
      height={actualSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
    >
      <path
        d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
      <circle
        cx="12"
        cy="9"
        r="3"
        fill="white"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
}

// Cluster marker component
function ClusterMarker({ pointCount, size }) {
  const clusterSize = 30 + Math.min(pointCount / 10, 20);

  return (
    <div
      style={{
        width: clusterSize,
        height: clusterSize,
        borderRadius: '50%',
        backgroundColor: '#0078d4',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }}
    >
      {pointCount}
    </div>
  );
}

export default function MapView({
  center = { lat: 20.5937, lng: 78.9629 }, // India center
  markers = [],
  selectedId,
  onSelect,
  onCloseInfo,
  renderInfoContent,
  fitToMarkers = true,
  onMapIdle,
  animateToLocation = null,
}) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: center.lng,
    latitude: center.lat,
    zoom: 4.5,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clusters, setClusters] = useState([]);
  const clusterIndexRef = useRef(null);

  // Initialize cluster index
  useEffect(() => {
    if (!clusterIndexRef.current) {
      clusterIndexRef.current = new supercluster({
        radius: 60,
        maxZoom: 16,
      });
    }
  }, []);

  // Update clusters when markers or viewport changes
  useEffect(() => {
    if (!clusterIndexRef.current || markers.length === 0) {
      setClusters([]);
      return;
    }

    const points = markers.map(marker => ({
      type: 'Feature',
      properties: {
        cluster: false,
        markerId: marker.id,
        markerData: marker
      },
      geometry: {
        type: 'Point',
        coordinates: [marker.lng, marker.lat],
      },
    }));

    clusterIndexRef.current.load(points);

    const bounds = mapRef.current?.getMap().getBounds();
    if (!bounds) {
      setClusters([]);
      return;
    }

    const zoom = Math.floor(viewState.zoom);
    const clustersData = clusterIndexRef.current.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    setClusters(clustersData);
  }, [markers, viewState]);

  // Handle selected marker update
  useEffect(() => {
    if (selectedId) {
      const marker = markers.find(m => m.id === selectedId);
      setSelectedMarker(marker);
    } else {
      setSelectedMarker(null);
    }
  }, [selectedId, markers]);

  // Smooth zoom animation
  useEffect(() => {
    if (!animateToLocation || !mapRef.current) return;

    const { lat, lng, zoom: targetZoom = 18 } = animateToLocation;

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: targetZoom,
      duration: 2000,
      essential: true,
    });
  }, [animateToLocation]);

  // Fit bounds when markers change
  useEffect(() => {
    if (!fitToMarkers || !mapRef.current || markers.length === 0) return;

    const validMarkers = markers.filter(
      m => typeof m.lat === 'number' && typeof m.lng === 'number'
    );

    if (validMarkers.length === 0) return;

    const bounds = validMarkers.reduce(
      (acc, m) => {
        return {
          minLng: Math.min(acc.minLng, m.lng),
          maxLng: Math.max(acc.maxLng, m.lng),
          minLat: Math.min(acc.minLat, m.lat),
          maxLat: Math.max(acc.maxLat, m.lat),
        };
      },
      {
        minLng: validMarkers[0].lng,
        maxLng: validMarkers[0].lng,
        minLat: validMarkers[0].lat,
        maxLat: validMarkers[0].lat,
      }
    );

    mapRef.current.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      {
        padding: 80,
        duration: 1000,
      }
    );
  }, [markers, fitToMarkers]);

  const handleClusterClick = useCallback((cluster) => {
    const expansionZoom = Math.min(
      clusterIndexRef.current.getClusterExpansionZoom(cluster.id),
      20
    );

    mapRef.current.easeTo({
      center: cluster.geometry.coordinates,
      zoom: expansionZoom,
      duration: 500,
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onMoveEnd={() => {
          if (onMapIdle && mapRef.current) {
            onMapIdle(mapRef.current.getMap());
          }
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {/* Render clusters and markers */}
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount, markerId, markerData } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="center"
              >
                <div onClick={() => handleClusterClick(cluster)}>
                  <ClusterMarker pointCount={pointCount} />
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={markerId}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelect?.(markerData);
              }}
            >
              <MarkerIcon
                type={markerData.type}
                isLocation={markerData.type === 'location'}
              />
            </Marker>
          );
        })}

        {/* Info popup */}
        {selectedMarker && (
          <Popup
            longitude={selectedMarker.lng}
            latitude={selectedMarker.lat}
            anchor="bottom"
            onClose={() => {
              onCloseInfo?.();
              setSelectedMarker(null);
            }}
            closeButton={true}
            closeOnClick={false}
            offset={selectedMarker.type === 'location' ? 48 : 28}
          >
            <div className="min-w-[260px] max-w-[320px]">
              {renderInfoContent?.(selectedMarker)}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
