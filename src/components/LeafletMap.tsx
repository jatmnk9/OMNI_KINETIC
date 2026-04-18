"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  name: string;
  status: string;
  color: string;
}

interface LeafletMapProps {
  markers: MapMarker[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({
  markers,
  selectedId,
  onMarkerClick,
  center = [48.8566, 2.3522],
  zoom = 13,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // CartoDB Dark Matter tiles — elegant dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create / update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    markers.forEach((m) => {
      const isSelected = selectedId === m.id;
      const size = isSelected ? 44 : 36;
      const glowColor = m.status === 'Limited' ? '#F97316' : '#C8A97E';
      const bgColor = isSelected ? glowColor : '#1a1a1a';
      const borderColor = isSelected ? '#fff' : 'rgba(255,255,255,0.15)';

      const icon = L.divIcon({
        className: 'omni-marker',
        html: `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              background: ${glowColor};
              opacity: ${isSelected ? 0.25 : 0.12};
              animation: pulse 2s ease-in-out infinite;
            "></div>
            <div style="
              width: ${size}px;
              height: ${size}px;
              border-radius: 14px;
              background: ${bgColor};
              border: 2px solid ${borderColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 ${isSelected ? 20 : 10}px ${glowColor}40, 0 4px 20px rgba(0,0,0,0.6);
              transition: all 0.5s ease;
              position: relative;
              z-index: 10;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#1a1a1a' : glowColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [size + 16, size + 16],
        iconAnchor: [(size + 16) / 2, size + 16],
      });

      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
      marker.on('click', () => onMarkerClick(m.id));
      markersRef.current.push(marker);
    });
  }, [markers, selectedId, onMarkerClick]);

  // Fly to selected marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;

    const target = markers.find(m => m.id === selectedId);
    if (target) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
    }
  }, [selectedId, markers]);

  return (
    <>
      {/* Global marker pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.12; }
          50% { transform: scale(1.5); opacity: 0.25; }
        }
        .omni-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(20,20,20,0.9) !important;
          color: rgba(255,255,255,0.6) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(12px);
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(40,40,40,0.95) !important;
          color: rgba(255,255,255,0.9) !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 12px 12px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 12px 12px !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ background: '#050505' }}
      />
    </>
  );
}
