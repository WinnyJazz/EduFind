
"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

// Custom marker agar tidak bergantung pada gambar default Leaflet
const selectedIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #07368F;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: LocationPickerMapProps["onLocationSelect"];
}) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function LocationPickerMap({
  onLocationSelect,
  selectedLocation,
}: LocationPickerMapProps) {
  const defaultCenter: [number, number] = [-2.5, 118];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[350px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />

        {selectedLocation && (
          <Marker
            position={[
              selectedLocation.latitude,
              selectedLocation.longitude,
            ]}
            icon={selectedIcon}
          />
        )}
      </MapContainer>

      <div className="bg-blue-50 px-4 py-3">
        <p className="text-xs text-blue-800">
          Klik pada peta untuk menentukan titik lokasi yang
          ingin kamu gunakan sebagai acuan perhitungan jarak.
        </p>
      </div>
    </div>
  );
}
