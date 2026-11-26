
import type { University, UniversityAPI } from "@/types/university";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface RecommendationWeights {
  tuition: number;
  distance: number;
  accreditation: number;
}

export interface RecommendationInput {
  latitude: number;
  longitude: number;
  weights: RecommendationWeights;
  budget?: number;
  minimumAccreditation?: string;
}

export interface RecommendationDetails {
  rank: number;
  score: number;
  tuition: number;
  distanceKm: number;
  accreditationScore: number;
  normalized: {
    tuition: number;
    distance: number;
    accreditation: number;
  };
}

export interface RecommendationResult extends University {
  recommendation: RecommendationDetails;
}

type RecommendationAPI = UniversityAPI & {
  recommendation: RecommendationDetails;
};

function mapRecommendationUniversity(
  data: RecommendationAPI
): RecommendationResult {
  return {
    id: data.kode_pt,
    kodePT: data.kode_pt,

    name: data.nama_pt,
    location: data.kab_kota_pt,
    province: data.provinsi_pt,

    image: data.gambar_url?.trim() || "/universitybackup.png",
    logo: data.logo_url || "",

    description:
      data.deskripsi_singkat || "Informasi kampus belum tersedia.",

    tuitionFee:
      data.range_biaya_kuliah || "Informasi biaya belum tersedia",

    tuitionAmount: data.biaya_per_semester ?? null,
    tuitionStatus: data.biaya_status || "unknown",

    fieldOfStudy: [],
    establishedYear: data.tahun_berdiri || 0,

    institutionType: ["negeri", "ptn"].includes(
      data.status_kepemilikan?.toLowerCase()
    )
      ? "PTN"
      : "PTS",

    accreditation: data.akred_pt || "Belum tersedia",

    website: data.website_url || data.website_resmi || "",

    latitude: data.latitude,
    longitude: data.longitude,

    slug: data.slug || "",
    coordinateStatus: data.coord_status || "unknown",
    form: data.bentuk_pt || "",

    recommendation: data.recommendation,
  };
}

export async function getRecommendations(
  input: RecommendationInput
): Promise<RecommendationResult[]> {
  const response = await fetch(`${API_URL}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to generate recommendations"
    );
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid recommendation data received from server");
  }

  return result.data.map((university: RecommendationAPI) =>
    mapRecommendationUniversity(university)
  );
}
