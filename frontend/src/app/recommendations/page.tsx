
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
  MapPin,
  LoaderCircle,
  Navigation,
  Trophy,
  AlertCircle,
} from "lucide-react";

import { getRecommendations } from "@/services/recommendationService";
import type {
  RecommendationResult,
} from "@/services/recommendationService";

const LocationPickerMap = dynamic(
  () => import("@/components/recommendation/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[350px] items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
        Loading map...
      </div>
    ),
  }
);

export default function RecommendationPage() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationMode, setLocationMode] = useState<"gps" | "map">("gps");

  const [locationStatus, setLocationStatus] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [error, setError] = useState("");

  const [budget, setBudget] = useState("");
  const [minimumAccreditation, setMinimumAccreditation] = useState("any");

  const [tuition, setTuition] = useState(40);
  const [distance, setDistance] = useState(35);
  const [accreditation, setAccreditation] = useState(25);

  const totalWeight = tuition + distance + accreditation;

  // Get current GPS location
  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Browser tidak mendukung GPS.");
      return;
    }

    setLoadingLocation(true);
    setLocationStatus("");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationStatus("Lokasi berhasil ditemukan.");
        setLoadingLocation(false);
      },
      (gpsError) => {
        const messages: Record<number, string> = {
          1: "Izin lokasi ditolak. Aktifkan izin lokasi browser.",
          2: "Lokasi tidak tersedia. Coba lagi.",
          3: "Permintaan lokasi timeout. Coba lagi.",
        };

        setLocationStatus(
          messages[gpsError.code] || "Gagal mendapatkan lokasi."
        );

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  // Select a point on the map
  function handleMapLocationSelect(selectedLocation: {
    latitude: number;
    longitude: number;
  }) {
    setLocation(selectedLocation);
    setLocationStatus("Lokasi berhasil dipilih dari peta.");
    setError("");
  }

  // Change location mode
  function handleLocationModeChange(mode: "gps" | "map") {
    setLocationMode(mode);
    setLocation(null);
    setLocationStatus("");
    setError("");
    setResults([]);
  }

  // Generate SAW recommendations
  async function handleRecommendation() {
    if (!location) {
      setError("Silakan tentukan lokasi terlebih dahulu.");
      return;
    }

    if (totalWeight !== 100) {
      setError("Total bobot harus tepat 100%.");
      return;
    }

    if (budget && (!Number.isFinite(Number(budget)) || Number(budget) <= 0)) {
      setError("Budget harus lebih besar dari 0.");
      return;
    }

    try {
      setLoadingResults(true);
      setError("");
      setResults([]);

      const data = await getRecommendations({
        latitude: location.latitude,
        longitude: location.longitude,

        weights: {
          tuition,
          distance,
          accreditation,
        },

        budget: budget ? Number(budget) : undefined,
        minimumAccreditation,
      });

      setResults(data);

      if (data.length === 0) {
        setError(
          "Tidak ada universitas yang memenuhi preferensi dan data yang tersedia. Coba ubah filter akreditasi atau budget."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat rekomendasi."
      );
    } finally {
      setLoadingResults(false);
    }
  }

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#07368F]">
            EDUFIND RECOMMENDATION
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#142B4A] md:text-4xl">
            Find Your Best University
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Temukan perguruan tinggi yang sesuai dengan preferensi
            biaya, lokasi, dan akreditasi menggunakan metode
            Simple Additive Weighting.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">

          {/* Preference Form */}
          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#142B4A]">
              Your Preferences
            </h2>

            {/* Location */}
            <div className="mt-6 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-[#07368F]" size={20} />
                <h3 className="font-semibold text-gray-800">
                  Location Preference
                </h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Pilih lokasi sebagai titik awal perhitungan jarak
                ke setiap universitas.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLocationModeChange("gps")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                    locationMode === "gps"
                      ? "border-[#07368F] bg-blue-50 text-[#07368F]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Navigation size={16} />
                  Current Location
                </button>

                <button
                  type="button"
                  onClick={() => handleLocationModeChange("map")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                    locationMode === "map"
                      ? "border-[#07368F] bg-blue-50 text-[#07368F]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <MapPin size={16} />
                  Select on Map
                </button>
              </div>

              {locationMode === "gps" && (
                <div className="mt-4">
                  <p className="text-xs leading-5 text-gray-500">
                    Gunakan GPS perangkat untuk mendeteksi lokasimu.
                  </p>

                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={loadingLocation}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#07368F] text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                  >
                    {loadingLocation ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Navigation size={17} />
                    )}

                    {loadingLocation
                      ? "Detecting Location..."
                      : location
                        ? "Refresh My Location"
                        : "Use My Current Location"}
                  </button>
                </div>
              )}

              {locationMode === "map" && (
                <div className="mt-4">
                  <p className="mb-3 text-xs leading-5 text-gray-500">
                    Geser dan zoom peta, lalu klik titik yang
                    ingin kamu gunakan sebagai lokasi acuan.
                  </p>

                  <LocationPickerMap
                    onLocationSelect={handleMapLocationSelect}
                    selectedLocation={location}
                  />
                </div>
              )}

              {locationStatus && (
                <p className="mt-3 text-xs text-gray-600">
                  {locationStatus}
                </p>
              )}

              {location && (
                <div className="mt-3 rounded-lg bg-green-50 p-3">
                  <p className="text-xs font-semibold text-green-800">
                    <MapPin size={14} className="mr-1 inline" />
                    Selected Location
                  </p>

                  <p className="mt-1 text-xs text-green-700">
                    Latitude: {location.latitude.toFixed(6)}
                  </p>

                  <p className="text-xs text-green-700">
                    Longitude: {location.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-800">
                Maximum Tuition Fee per Semester
              </label>

              <input
                type="number"
                min="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Contoh: 5000000"
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#07368F]"
              />

              <p className="mt-1 text-xs text-gray-400">
                Kosongkan jika tidak ingin membatasi biaya.
              </p>
            </div>

            {/* Minimum Accreditation Filter */}
            <div className="mt-6">
              <label
                htmlFor="minimumAccreditation"
                className="text-sm font-semibold text-gray-800"
              >
                Minimum Accreditation
              </label>

              <select
                id="minimumAccreditation"
                value={minimumAccreditation}
                onChange={(e) =>
                  setMinimumAccreditation(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-[#07368F]"
              >
                <option value="any">Any Accreditation</option>
                <option value="unggul">Unggul</option>
                <option value="baik-sekali">Baik Sekali</option>
                <option value="baik">Baik</option>
              </select>

              <p className="mt-1 text-xs text-gray-400">
                Pilih standar akreditasi minimum kampus yang kamu inginkan.
              </p>
            </div>

            {/* Criteria Weights */}
            <div className="mt-7">
              <h3 className="font-semibold text-gray-800">
                Criteria Importance
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Atur bobot sesuai tingkat kepentinganmu. Total harus 100%.
              </p>

              {[
                {
                  label: "Tuition Fee",
                  value: tuition,
                  setValue: setTuition,
                },
                {
                  label: "Distance",
                  value: distance,
                  setValue: setDistance,
                },
                {
                  label: "Accreditation",
                  value: accreditation,
                  setValue: setAccreditation,
                },
              ].map((item) => (
                <div key={item.label} className="mt-5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>

                    <span className="font-bold text-[#07368F]">
                      {item.value}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={item.value}
                    onChange={(e) =>
                      item.setValue(Number(e.target.value))
                    }
                    className="mt-2 w-full accent-[#07368F]"
                  />
                </div>
              ))}

              <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-semibold text-gray-700">
                  Total Weight
                </span>

                <span
                  className={`text-lg font-bold ${
                    totalWeight === 100
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {totalWeight}%
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleRecommendation}
              disabled={
                loadingResults ||
                !location ||
                totalWeight !== 100
              }
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#07368F] text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingResults && (
                <LoaderCircle size={18} className="animate-spin" />
              )}

              {loadingResults
                ? "Calculating..."
                : "Generate Recommendations"}
            </button>
          </section>

          {/* Results */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#142B4A]">
                Recommendation Results
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Universities ranked based on your preferences.
              </p>
            </div>

            {results.length === 0 && !loadingResults && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <Trophy size={36} className="text-gray-300" />

                <h3 className="mt-4 font-semibold text-gray-700">
                  No Recommendations Yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-400">
                  Atur preferensimu dan tekan Generate Recommendations
                  untuk melihat hasil peringkat universitas.
                </p>
              </div>
            )}

            {loadingResults && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
                <LoaderCircle
                  size={36}
                  className="animate-spin text-[#07368F]"
                />

                <p className="mt-4 text-sm font-medium text-gray-600">
                  Calculating recommendations...
                </p>
              </div>
            )}

            {!loadingResults && results.length > 0 && (
              <div className="space-y-4">
                {results.map((university) => (
                  <article
                    key={university.kodePT}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#07368F]">
                          RANK #{university.recommendation.rank}
                        </p>

                        <h3 className="mt-2 font-bold text-[#142B4A]">
                          {university.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {university.location}, {university.province}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {university.recommendation.score.toFixed(4)}
                        </p>

                        <p className="text-xs text-gray-400">
                          SAW Score
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600 md:grid-cols-3">
                      <div>
                        <p className="text-gray-400">
                          Tuition / Semester
                        </p>

                        <p className="mt-1 font-semibold">
                          {formatRupiah(
                            university.recommendation.tuition
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Distance</p>

                        <p className="mt-1 font-semibold">
                          {university.recommendation.distanceKm.toFixed(2)} km
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Accreditation</p>

                        <p className="mt-1 font-semibold">
                          {university.accreditation}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/universities/${university.slug || university.id}`}
                        className="flex-1 rounded-full bg-[#07368F] px-4 py-3 text-center text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        More Details
                      </Link>

                      <Link
                        href={`/explore?university=${university.slug || university.id}`}
                        className="flex-1 rounded-full border border-[#07368F] px-4 py-3 text-center text-xs font-semibold text-[#07368F] hover:bg-blue-50"
                      >
                        View on Map
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
