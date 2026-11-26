
"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { University } from "@/types/university";

interface ExploreMapProps {
  universities: University[];
  selectedUniversity: University | null;
  onSelectUniversity: (university: University) => void;
}

// ==========================================
// CUSTOM MARKER ICON
// ==========================================

const createMarkerIcon = (selected: boolean) =>
  L.divIcon({
    className: "university-map-marker",
    html: `
      <div class="map-marker-pin ${selected ? "selected" : ""}">
        <div class="map-marker-dot"></div>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
  });

// ==========================================
// MAP CONTROLLER
// ==========================================

function MapController({
  universities,
  selectedUniversity,
}: {
  universities: University[];
  selectedUniversity: University | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedUniversity) {
      const lat = Number(selectedUniversity.latitude);
      const lng = Number(selectedUniversity.longitude);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      map.flyTo([lat, lng], 16, {
        duration: 1.5,
      });

      return;
    }

    if (universities.length === 1) {
      const university = universities[0];

      map.flyTo(
        [
          university.latitude,
          university.longitude,
        ],
        14,
        { duration: 1 }
      );

      return;
    }

    if (universities.length > 1) {
      const bounds = L.latLngBounds(
        universities.map((university) => [
          university.latitude,
          university.longitude,
        ] as [number, number])
      );

      map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13,
        duration: 1,
      });
    }
  }, [map, universities, selectedUniversity]);

  return null;
}

// ==========================================
// EXPLORE MAP
// ==========================================

export default function ExploreMap({
  universities,
  selectedUniversity,
  onSelectUniversity,
}: ExploreMapProps) {
  return (
    <MapContainer
      center={[-6.2, 106.816666]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        universities={universities}
        selectedUniversity={selectedUniversity}
      />

      {universities.map((university) => {
        const isSelected =
          selectedUniversity?.kodePT === university.kodePT;

        return (
          <Marker
            key={university.kodePT}
            position={[
              university.latitude,
              university.longitude,
            ]}
            icon={createMarkerIcon(isSelected)}
            eventHandlers={{
              click: () => onSelectUniversity(university),
            }}
          >
            {isSelected && (
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-semibold text-[#142B4A]">
                    {university.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {university.location}, {university.province}
                  </p>

                  <Link
                    href={`/universities/${university.slug || university.id}`}
                    className="mt-2 inline-block text-xs font-semibold text-blue-700 hover:underline"
                  >
                    View University Details
                  </Link>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
}
