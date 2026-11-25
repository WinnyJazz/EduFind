"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import UniversitySearch from "@/components/university/UniversitySearch";
import UniversityFilter from "@/components/university/UniversityFilter";
import UniversityCard from "@/components/university/UniversityCard";

import { universities } from "@/data/universities";

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = useMemo(() => {
    return universities.filter((university) =>
      university.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-10">

        {/* BACK BUTTON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#07368F] transition hover:text-blue-500"
          >
            <ArrowLeft size={17} />
            Back
          </Link>
        </motion.div>

        {/* CATALOGUE CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-[205px_minmax(0,1fr)]"
        >

          {/* FILTER SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.35,
              ease: "easeOut",
            }}
            className="md:border-r md:border-[#A8BCE1] md:pr-7"
          >
            <UniversityFilter />
          </motion.div>

          {/* UNIVERSITY LIST */}
          <section className="min-w-0">

            {/* SEARCH BAR */}
            <div className="mb-7 max-w-[460px]">
              <UniversitySearch
                variant="catalogue"
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* RESULTS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.45,
              }}
              className="mb-5 flex items-center justify-between"
            >
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-[#142B4A]">
                  {filteredUniversities.length}
                </span>{" "}
                universities
              </p>
            </motion.div>

            {/* UNIVERSITY GRID */}
            {filteredUniversities.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.4,
                    },
                  },
                }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filteredUniversities.map((university) => (
                  <motion.div
                    key={university.id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 18,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                  >
                    <UniversityCard university={university} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-xl border border-dashed border-gray-300 py-16 text-center"
              >
                <p className="font-semibold text-[#142B4A]">
                  No universities found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try searching with another university name.
                </p>
              </motion.div>
            )}
          </section>
        </motion.div>
      </div>
    </main>
  );
}
