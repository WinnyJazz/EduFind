import { Sparkles } from "lucide-react";

export default function RecommendationHero() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07368F]/10">
        <Sparkles size={28} className="text-[#07368F]" />
      </div>
      <h1 className="text-3xl font-bold text-[#142B4A] md:text-4xl">Find My Recommendation</h1>
      <p className="mt-4 text-base leading-7 text-gray-500">
        Isi lokasi, anggaran, dan akreditasi minimum, lalu atur seberapa penting tiap kriteria.
        EduFind mengurutkan perguruan tinggi dengan metode Simple Additive Weighting (SAW),
        dan menunjukkan dari mana skor tiap kampus berasal.
      </p>
    </div>
  );
}