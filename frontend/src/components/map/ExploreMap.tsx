
"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { University } from "@/types/university";

interface ExploreMapProps {
  universities: University[];
  selectedUniversity: University | null;
  onSelectUniversity: (university: University) => void;
}

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
      map.flyTo(
        [
          selectedUniversity.latitude,
          selectedUniversity.longitude,
        ],
        15,
        { duration: 1 }
      );

      return;
    }

    if (universities.length === 1) {
      map.flyTo(
        [universities[0].latitude, universities[0].longitude],
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
        ])
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

      {universities.map((university) => (
        <Marker
          key={university.kodePT}
          position={[
            university.latitude,
            university.longitude,
          ]}
          icon={createMarkerIcon(
            selectedUniversity?.kodePT === university.kodePT
          )}
          eventHandlers={{
            click: () => onSelectUniversity(university),
          }}
        />
      ))}
    </MapContainer>
  );
}
