"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Search } from "lucide-react";

interface UniversitySearchProps {
  variant: "home" | "catalogue";
  value?: string;
  onChange?: (value: string) => void;
}

export default function UniversitySearch({
  variant,
  value = "",
  onChange,
}: UniversitySearchProps) {
  const router = useRouter();


  const sharedProps = {
    layoutId: "university-search-bar",
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      layout: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
      opacity: {
        duration: 0.4,
      },
      y: {
        duration: 0.4,
      },
    },
  };


  if (variant === "home") {
    return (
      <motion.button
        {...sharedProps}
        type="button"
        onClick={() => router.push("/universities")}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 text-gray-400 shadow-sm transition hover:border-[#07368F] hover:shadow-md"
      >
        <Search size={19} />
        <span className="text-sm md:text-base">
          Search University Name
        </span>
      </motion.button>
    );
  }

  return (
    <motion.form
      {...sharedProps}
      onSubmit={(event) => event.preventDefault()}
      className="flex h-12 w-full items-center gap-3 rounded-full border border-gray-300 bg-white px-5 shadow-sm"
    >
      <Search size={19} className="shrink-0 text-gray-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Search University Name"
        className="h-full w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />
    </motion.form>
  );
}
