
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

import { University } from "@/types/university";
import { getUniversities } from "@/services/universityService";

import UniversitySearch from "@/components/university/UniversitySearch";
import UniversityFilter from "@/components/university/UniversityFilter";
import UniversityCard from "@/components/university/UniversityCard";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function fetchUniversities() {
      try {
        setLoading(true);
        setError("");

        const result = await getUniversities({
          search: searchQuery,
          page,
          limit: 12,
        });

        if (isMounted) {
          setUniversities(result.universities);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load universities"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUniversities();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, page]);

  function handleSearch(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-12 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[1440px]"
      >
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#142B4A] md:text-4xl">
            University Directory
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
            Explore and discover universities across Indonesia.
            Find the right institution for your academic journey.
          </p>
        </div>

        {/* Search and Recommendation */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <UniversitySearch
              variant="catalogue"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <Link
            href="/recommendations"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#07368F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#142B4A] hover:shadow-md"
          >
            <Sparkles size={17} className="text-[#D7AD68]" />
            Find My Recommendation
          </Link>
        </div>

        {/* Catalogue Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar Filter */}
          <motion.aside
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UniversityFilter />
          </motion.aside>

          {/* University Results */}
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-5 flex items-center justify-between"
            >
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-[#142B4A]">
                  {total}
                </span>{" "}
                universities
              </p>
            </motion.div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                Loading universities...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-white px-6 py-16 text-center">
                <h3 className="text-lg font-semibold text-red-600">
                  Failed to load universities
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {error}
                </p>
              </div>
            ) : universities.length > 0 ? (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {universities.map((university) => (
                    <motion.div
                      key={university.id}
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <UniversityCard university={university} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#142B4A] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#142B4A] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                <h3 className="text-lg font-semibold text-[#142B4A]">
                  No universities found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try searching with another university name.
                </p>

                <button
                  onClick={() => handleSearch("")}
                  className="mt-5 text-sm font-semibold text-[#07368F] hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </main>
  );
}
