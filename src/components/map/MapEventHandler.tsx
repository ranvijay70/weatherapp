/**
 * Map Event Handler Component
 * Handles map click, zoom, and move events
 */

'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapEventHandlerProps {
  onMapClick: (lat: number, lon: number) => void;
  onZoomChange: (zoom: number) => void;
  onMoveEnd: (lat: number, lon: number) => void;
}

export const MapEventHandler: React.FC<MapEventHandlerProps> = ({
  onMapClick,
  onZoomChange,
  onMoveEnd,
}) => {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    const handleZoomEnd = () => {
      onZoomChange(map.getZoom());
    };

    const handleMoveEnd = () => {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng);
    };

    map.on('click', handleClick);
    map.on('zoomend', handleZoomEnd);
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('click', handleClick);
      map.off('zoomend', handleZoomEnd);
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onMapClick, onZoomChange, onMoveEnd]);

  return null;
};

