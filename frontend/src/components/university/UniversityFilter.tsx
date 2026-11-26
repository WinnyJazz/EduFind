
"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

export interface UniversityFilters {
  location: string;
  maxTuition: string;
  ownership: string;
  accreditation: string;
}

interface UniversityFilterProps {
  onFilterChange: (filters: UniversityFilters) => void;
}

const jabodetabekLocations = [
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Selatan",
  "Jakarta Timur",
  "Kabupaten Bogor",
  "Kota Bogor",
  "Depok",
  "Kabupaten Tangerang",
  "Kota Tangerang",
  "Kota Tangerang Selatan",
  "Kabupaten Bekasi",
  "Kota Bekasi",
];

export default function UniversityFilter({
  onFilterChange,
}: UniversityFilterProps) {
  const [filters, setFilters] = useState<UniversityFilters>({
    location: "",
    maxTuition: "",
    ownership: "",
    accreditation: "",
  });

  const updateFilter = (
    key: keyof UniversityFilters,
    value: string
  ) => {
    const updatedFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const emptyFilters: UniversityFilters = {
      location: "",
      maxTuition: "",
      ownership: "",
      accreditation: "",
    };

    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <aside className="w-full shrink-0 rounded-xl border border-gray-200 bg-white p-5 md:w-[235px]">
      <div className="flex items-center justify-between border-b border-[#07368F] pb-3">
        <h2 className="text-lg font-bold text-[#07368F]">
          Filter
        </h2>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-[#07368F]"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-6">

        {/* LOCATION */}
        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-semibold text-[#142B4A]"
          >
            Location
          </label>

          <input
            id="location"
            type="text"
            list="jabodetabek-locations"
            value={filters.location}
            onChange={(e) =>
              updateFilter("location", e.target.value)
            }
            placeholder="Search city or district..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#07368F] focus:ring-1 focus:ring-[#07368F]"
          />

          <datalist id="jabodetabek-locations">
            {jabodetabekLocations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>

          <p className="mt-2 text-xs text-gray-400">
            Search or select a Jabodetabek location.
          </p>
        </div>

        {/* TUITION FEE */}
        <div>
          <label
            htmlFor="maxTuition"
            className="mb-2 block text-sm font-semibold text-[#142B4A]"
          >
            Maximum Tuition Fee
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              Rp
            </span>

            <input
              id="maxTuition"
              type="number"
              min="0"
              value={filters.maxTuition}
              onChange={(e) =>
                updateFilter("maxTuition", e.target.value)
              }
              placeholder="No limit"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#07368F] focus:ring-1 focus:ring-[#07368F]"
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Maximum fee per semester.
          </p>
        </div>

        {/* INSTITUTION TYPE */}
        <div>
          <label
            htmlFor="ownership"
            className="mb-2 block text-sm font-semibold text-[#142B4A]"
          >
            Institution Type
          </label>

          <select
            id="ownership"
            value={filters.ownership}
            onChange={(e) =>
              updateFilter("ownership", e.target.value)
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#07368F] focus:ring-1 focus:ring-[#07368F]"
          >
            <option value="">All Institutions</option>
            <option value="PTN">Public University (PTN)</option>
            <option value="PTS">Private University (PTS)</option>
          </select>
        </div>

        {/* ACCREDITATION */}
        <div>
          <label
            htmlFor="accreditation"
            className="mb-2 block text-sm font-semibold text-[#142B4A]"
          >
            Accreditation
          </label>

          <select
            id="accreditation"
            value={filters.accreditation}
            onChange={(e) =>
              updateFilter("accreditation", e.target.value)
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#07368F] focus:ring-1 focus:ring-[#07368F]"
          >
            <option value="">All Accreditations</option>
            <option value="Unggul">Unggul</option>
            <option value="Baik Sekali">Baik Sekali</option>
            <option value="Baik">Baik</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

      </div>
    </aside>
  );
}
