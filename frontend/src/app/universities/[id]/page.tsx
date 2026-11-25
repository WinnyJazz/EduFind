"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { universities } from "@/data/universities";

export default function UniversityDetailPage() {
  const params = useParams();
  const universityId = Number(params.id);

  const university = universities.find(
    (item) => item.id === universityId
  );

  if (!university) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-[#142B4A]">
          University Not Found
        </h1>
        <p className="mt-2 text-gray-500">
          The university you are looking for does not exist.
        </p>
        <Link
          href="/universities"
          className="mt-6 rounded-full bg-[#07368F] px-6 py-3 text-white"
        >
          Back to Catalogue
        </Link>
      </main>
    );
  }

  const universityInfo = [
    { label: "Location", value: `${university.location}, ${university.province}` },
    { label: "Established Year", value: university.establishedYear },
    { label: "Tuition Fee", value: university.tuitionFee },
    { label: "Institution Type", value: university.institutionType },
    { label: "Accreditation", value: university.accreditation },
    { label: "Website", value: university.website },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <Link
          href="/universities"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#315B83] transition hover:text-[#07368F]"
        >
          <ArrowLeft size={18} />
          Back to Catalogue
        </Link>

        {/* University Image */}
        <div className="relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[380px]">
          <Image
            src={university.image}
            alt={university.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </div>

        {/* University Information */}
        <section className="mx-auto mt-8 max-w-3xl">

          {/* University Name */}
          <h1 className="text-center text-3xl font-bold text-[#142B4A] md:text-4xl">
            {university.name}
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-gray-600">
            {university.description}
          </p>

          {/* Details Table */}
          <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-[#07368F] px-6 py-4">
              <h2 className="font-semibold text-white">
                University Information
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {universityInfo.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[200px_1fr] sm:gap-6"
                >
                  <span className="text-sm font-semibold text-[#315B83]">
                    {item.label}
                  </span>

                  {item.label === "Website" ? (
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm font-medium text-[#07368F] hover:underline"
                    >
                      {university.website}
                      <ExternalLink className="ml-1 inline" size={14} />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-700">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Open in Map */}
          <div className="mt-8 flex justify-center">
            <Link
              href={`/explore?university=${university.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#07368F] px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#142B4A] hover:shadow-md"
            >
              <MapPin size={18} />
              Open in Map
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
}
