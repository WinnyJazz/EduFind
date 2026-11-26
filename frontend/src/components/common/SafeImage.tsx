"use client";

import { useEffect, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";

const FALLBACK_IMAGE = "/universitybackup.jpg";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

function normalize(src?: string | null) {
  if (!src) return FALLBACK_IMAGE;

  const value = src.trim();
  const lower = value.toLowerCase();

  if (!value || lower === "not_found" || lower === "not found") {
    return FALLBACK_IMAGE;
  }

  return value;
}

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(normalize(src));
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset kalau src berubah
  useEffect(() => {
    setCurrentSrc(normalize(src));
  }, [src]);

  // Tangkap gambar yang sudah gagal sebelum hydration
  useEffect(() => {
    const img = imgRef.current;

    if (
      img &&
      img.complete &&
      img.naturalWidth === 0 &&
      currentSrc !== FALLBACK_IMAGE
    ) {
      setCurrentSrc(FALLBACK_IMAGE);
    }
  }, [currentSrc]);

  return (
    <Image
      {...props}
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) setCurrentSrc(FALLBACK_IMAGE);
      }}
      unoptimized
    />
  );
}