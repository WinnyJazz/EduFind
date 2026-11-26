"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

export default function RecommendationPage() {
  const [location, setLocation] = useState("");
  const [studyProgram, setStudyProgram] = useState("");

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-12 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl"
      >
        {/* Back Button */}
        <Link
          href="/universities"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#315B83] transition hover:text-[#07368F]"
        >
          <ArrowLeft size={18} />
          Back to Catalogue
        </Link>

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07368F]/10">
            <Sparkles size={28} className="text-[#07368F]" />
          </div>

          <h1 className="text-3xl font-bold text-[#142B4A] md:text-4xl">
            Find My Recommendation
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-500">
            Discover universities that match your location,
            academic interests, and personal preferences.
          </p>
        </div>

        {/* Form */}
        <section className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#142B4A]">
              Find Your Ideal University
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Tell us about your preferences to discover
              universities that suit your needs.
            </p>
          </div>

          <div className="space-y-6">

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-[#142B4A]"
              >
                Your Location
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#315B83]"
                />

                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-[#142B4A] outline-none transition focus:border-[#07368F] focus:ring-2 focus:ring-[#07368F]/10"
                >
                  <option value="">Select your location</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Study Program */}
            <div>
              <label
                htmlFor="studyProgram"
                className="mb-2 block text-sm font-semibold text-[#142B4A]"
              >
                Preferred Study Program
              </label>

              <div className="relative">
                <GraduationCap
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#315B83]"
                />

                <select
                  id="studyProgram"
                  value={studyProgram}
                  onChange={(e) => setStudyProgram(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-[#142B4A] outline-none transition focus:border-[#07368F] focus:ring-2 focus:ring-[#07368F]/10"
                >
                  <option value="">Select study program</option>
                  <option value="Informatics Engineering">
                    Informatics Engineering
                  </option>
                  <option value="Information Systems">
                    Information Systems
                  </option>
                  <option value="Computer Science">
                    Computer Science
                  </option>
                  <option value="Civil Engineering">
                    Civil Engineering
                  </option>
                  <option value="Management">Management</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Preferences Placeholder */}
            <div className="rounded-xl bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#07368F]" />

                <h3 className="text-sm font-bold text-[#142B4A]">
                  Recommendation Preferences
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Configure the importance of each criterion
                to personalize your university recommendations.
              </p>

              <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center">
                <p className="text-xs text-gray-400">
                  SAW criteria and weighting configuration
                  will be implemented in the next stage.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={!location || !studyProgram}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#07368F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#142B4A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={17} className="text-[#D7AD68]" />
              Find Recommendations
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Recommendations will be generated using the
            Simple Additive Weighting (SAW) method.
          </p>
        </section>
      </motion.div>
    </main>
  );
}
