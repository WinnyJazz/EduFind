
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, LoaderCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { University } from "@/types/university";
import { getAllUniversitiesForMap } from "@/services/universityService";
import UniversityMapSidebar from "@/components/map/UniversityMapSidebar";

const ExploreMap = dynamic(
  () => import("@/components/map/ExploreMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <LoaderCircle className="animate-spin text-blue-700" />
        <span className="ml-2 text-sm text-gray-500">
          Loading map...
        </span>
      </div>
    ),
  }
);

export default function ExplorePage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function loadUniversities() {
      try {
        setLoading(true);
        setError("");

        const data = await getAllUniversitiesForMap();
        setUniversities(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load universities"
        );
      } finally {
        setLoading(false);
      }
    }

    loadUniversities();
  }, []);

  const filteredUniversities = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return universities;

    return universities.filter((university) => {
      return (
        university.name.toLowerCase().includes(keyword) ||
        university.location.toLowerCase().includes(keyword) ||
        university.province.toLowerCase().includes(keyword)
      );
    });
  }, [universities, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setSelectedUniversity(null);
  };

  const handleSelectUniversity = (university: University) => {
    setSelectedUniversity(university);
  };

  const handleClearSelection = () => {
    setSelectedUniversity(null);
  };

  const visibleUniversities = selectedUniversity
    ? [selectedUniversity]
    : filteredUniversities;

  return (
    <main className="flex h-[calc(100vh-80px)] min-h-[600px] flex-col overflow-hidden bg-white">
      {/* Search bar */}
      <div className="z-[500] flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:px-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>

        <div className="relative ml-auto w-full max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search university or location..."
            className="h-11 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#07368F] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Map and sidebar */}
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && (
          <div className="z-[400] w-[300px] shrink-0 md:w-[340px]">
            {loading ? (
              <div className="flex h-full items-center justify-center bg-[#17469B] text-white">
                <LoaderCircle className="animate-spin" />
                <span className="ml-2 text-sm">Loading universities...</span>
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center bg-[#17469B] p-5 text-center text-white">
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <UniversityMapSidebar
                universities={visibleUniversities}
                selectedUniversity={selectedUniversity}
                onSelectUniversity={handleSelectUniversity}
                onClearSelection={handleClearSelection}
              />
            )}
          </div>
        )}

        <div className="relative min-w-0 flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <LoaderCircle className="animate-spin text-blue-700" />
              <span className="ml-2 text-sm text-gray-500">
                Preparing university locations...
              </span>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center bg-gray-100 p-6 text-center text-sm text-red-600">
              {error}
            </div>
          ) : (
            <>
              <ExploreMap
                universities={visibleUniversities}
                selectedUniversity={selectedUniversity}
                onSelectUniversity={handleSelectUniversity}
              />

              <div className="absolute bottom-5 left-4 z-[500] rounded-lg bg-white/95 px-4 py-2 text-xs text-gray-600 shadow-md">
                <span className="font-semibold text-[#07368F]">
                  {visibleUniversities.length}
                </span>{" "}
                universities displayed
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
