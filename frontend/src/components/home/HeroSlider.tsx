"use client";

import UniversitySearch from "@/components/university/UniversitySearch";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";


const slides = [
  {
    image: "/images/campus-1.jpg",
    title: "Welcome to EduFind",
    description:
      "Discover universities and explore opportunities for your future.",
  },
  {
    image: "/images/campus-2.jpg",
    title: "Explore Your Possibilities",
    description:
      "Find higher education institutions that match your aspirations.",
  },
  {
    image: "/images/campus-4.jpg",
    title: "Your Journey Starts Here",
    description:
      "Make informed decisions for your higher education journey.",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mx-auto w-full max-w-[1440px]">

      {/* IMAGE SLIDER */}
      <div className="group relative h-[420px] overflow-hidden md:h-[500px]">

        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index
                ? "z-10 opacity-100"
                : "z-0 opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={`University campus slide ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 z-20 bg-black/35" />

        {/* HERO CONTENT */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center text-white">

          <h1 className="text-4xl font-bold drop-shadow-lg md:text-6xl">
            {slides[currentSlide].title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed drop-shadow-md md:text-lg">
            {slides[currentSlide].description}
          </p>

          <Link
            href="/explore"
            className="mt-7 rounded-full bg-[#07368F] px-10 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#0B49B8]"
          >
            Explore Map
          </Link>
        </div>

        {/* PREVIOUS BUTTON */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition hover:bg-black/60 group-hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>

        {/* NEXT BUTTON */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition hover:bg-black/60 group-hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* SLIDE INDICATORS */}
        <div className="absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* SHARED SEARCH BAR */}
    <div className="relative z-40 mx-auto -mt-5 w-[90%] max-w-[600px]">
        <UniversitySearch variant="home" />
    </div>
      
    </section>
  );
}
