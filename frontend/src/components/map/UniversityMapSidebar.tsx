
"use client";

import Link from "next/link";
import { MapPin, X } from "lucide-react";
import { University } from "@/types/university";
import SafeImage from "@/components/common/SafeImage";

interface Props {
  universities: University[];
  selectedUniversity: University | null;
  onSelectUniversity: (university: University) => void;
  onClearSelection: () => void;
}

export default function UniversityMapSidebar({
  universities,
  selectedUniversity,
  onSelectUniversity,
  onClearSelection,
}: Props) {
  const displayedUniversities = selectedUniversity
    ? [selectedUniversity]
    : universities;

  return (
    <aside className="flex h-full w-full flex-col bg-[#17469B] text-white">
      <div className="flex items-center justify-between border-b border-white/20 px-5 py-4">
        <div>
          <p className="text-sm font-semibold">
            {selectedUniversity
              ? "Selected University"
              : "University Results"}
          </p>

          <p className="mt-1 text-xs text-blue-100">
            {selectedUniversity
              ? "1 university selected"
              : `${universities.length} universities found`}
          </p>
        </div>

        {selectedUniversity && (
          <button
            onClick={onClearSelection}
            className="rounded-full p-2 transition hover:bg-white/15"
            aria-label="Clear selection"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {displayedUniversities.length > 0 ? (
          displayedUniversities.map((university) => (
            <article
              key={university.kodePT}
              onClick={() => onSelectUniversity(university)}
              className={`cursor-pointer bg-white p-3 text-[#142B4A] shadow-sm transition hover:shadow-lg ${
                selectedUniversity?.kodePT === university.kodePT
                  ? "ring-2 ring-blue-300"
                  : ""
              }`}
            >
              <p className="mb-3 text-xs font-semibold text-gray-500">
                University Details
              </p>

              <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                <SafeImage
                  src={university.image || "/universitybackup.png"}
                  alt={university.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              <h3 className="mt-3 line-clamp-2 text-center text-sm font-bold">
                {university.name}
              </h3>

              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                {university.location}, {university.province}
              </p>

              <Link
                href={`/universities/${university.slug || university.id}`}
                onClick={(event) => event.stopPropagation()}
                className="mt-4 flex h-11 items-center justify-center rounded-full bg-[#07368F] text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                More Details
              </Link>
            </article>
          ))
        ) : (
          <div className="py-12 text-center">
            <MapPin size={30} className="mx-auto text-blue-200" />

            <p className="mt-3 text-sm font-semibold">
              No universities found
            </p>

            <p className="mt-1 text-xs text-blue-100">
              Try another university name or location.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
