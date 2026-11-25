"use client";

const filters = [
  "Location",
  "Tuition Fee",
  "Field Of Study",
  "Accreditation",
];

export default function UniversityFilter() {
  return (
    <aside className="w-full shrink-0 md:w-[205px]">
      <h2 className="border-b border-[#07368F] pb-3 text-lg font-bold text-[#07368F]">
        Filter
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="border border-gray-200 bg-white px-3 py-3 text-left text-sm font-semibold text-[#07368F] transition hover:border-[#07368F] hover:bg-blue-50"
          >
            {filter}
          </button>
        ))}
      </div>
    </aside>
  );
}