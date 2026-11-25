import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { University } from "@/types/university";

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({
  university,
}: UniversityCardProps) {
  return (
    <Link
      href={`/universities/${university.id}`}
      className="block"
    >
      <article className="group overflow-hidden border border-gray-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-[150px] w-full overflow-hidden bg-gray-100">
          <Image
            src={university.image}
            alt={university.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="py-3 text-center">
          <h3 className="line-clamp-1 text-base font-bold text-[#142B4A]">
            {university.name}
          </h3>

          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            {university.location}
          </p>
        </div>
      </article>
    </Link>
  );
}
