
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
} from "lucide-react";

import { University } from "@/types/university";
import { getUniversityById } from "@/services/universityService";
import SafeImage from "@/components/common/SafeImage";

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const universityId = params.id;

  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchUniversity() {
      try {
        setLoading(true);
        setError("");

        const result = await getUniversityById(universityId);

        if (isMounted) {
          setUniversity(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load university"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (universityId) {
      fetchUniversity();
    }

    return () => {
      isMounted = false;
    };
  }, [universityId]);

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC]">
        <p className="text-sm text-gray-500">
          Loading university information...
        </p>
      </main>
    );
  }

  // Error / Not Found State
  if (error || !university) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F8FAFC] px-6">
        <h1 className="text-2xl font-bold text-[#142B4A]">
          University Not Found
        </h1>

        <p className="mt-2 text-center text-gray-500">
          {error || "The university you are looking for does not exist."}
        </p>

        <Link
          href="/universities"
          className="mt-6 rounded-full bg-[#07368F] px-6 py-3 text-white transition hover:bg-[#142B4A]"
        >
          Back to Catalogue
        </Link>
      </main>
    );
  }

  const universityInfo = [
    {
      label: "Location",
      value: `${university.location}, ${university.province}`,
    },
    {
      label: "Established Year",
      value: university.establishedYear || "Not available",
    },
    {
      label: "Tuition Fee",
      value: university.tuitionFee,
    },
    {
      label: "Institution Type",
      value: university.institutionType,
    },
    {
      label: "Accreditation",
      value: university.accreditation,
    },
    {
      label: "Website",
      value: university.website,
    },
  ];

  // Open in Map URL
  const mapUrl = `/explore?university=${encodeURIComponent(
    String(university.kodePT || university.id)
  )}&lat=${university.latitude}&lng=${university.longitude}`;

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
        <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-gray-100 md:h-[380px]">
          <SafeImage
            src={university.image || "/universitybackup.png"}
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

                  {item.label === "Website" && university.website ? (
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
                      {item.value || "Not available"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Open in Map */}
          <div className="mt-8 flex justify-center">
            {Number.isFinite(university.latitude) &&
            Number.isFinite(university.longitude) &&
            (university.latitude !== 0 || university.longitude !== 0) ? (
              <Link
                href={mapUrl}
                className="inline-flex items-center gap-2 rounded-full bg-[#07368F] px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#142B4A] hover:shadow-md"
              >
                <MapPin size={18} />
                Open in Map
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                University coordinates are not available.
              </p>
            )}
          </div>

        </section>
      </div>
    </main>
  );
}
