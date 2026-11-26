
import {
  University,
  UniversityAPI,
  UniversityResponse,
} from "@/types/university";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function mapUniversity(data: UniversityAPI): University {
  return {
    id: data.kode_pt,
    kodePT: data.kode_pt,
    name: data.nama_pt,
    location: data.kab_kota_pt,
    province: data.provinsi_pt,

    image: data.gambar_url || "/images/default-universitas.jpg",
    logo: data.logo_url || "",

    description: data.deskripsi_singkat || "Informasi kampus belum tersedia.",

    tuitionFee:
      data.range_biaya_kuliah || "Informasi biaya belum tersedia",

    tuitionAmount: data.biaya_per_semester ?? null,
    tuitionStatus: data.biaya_status || "unknown",

    fieldOfStudy: [],

    establishedYear: data.tahun_berdiri || 0,

    institutionType:
      data.status_kepemilikan?.toLowerCase() === "negeri"
        ? "PTN"
        : "PTS",

    accreditation: data.akred_pt || "Belum tersedia",
    website: data.website_url || data.website_resmi || "",

    latitude: data.latitude,
    longitude: data.longitude,

    slug: data.slug || "",
    coordinateStatus: data.coord_status || "unknown",
    form: data.bentuk_pt || "",
  };
}

export async function getUniversities(
  params: {
    search?: string;
    province?: string;
    accreditation?: string;
    ownership?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{
  universities: University[];
  total: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const response = await fetch(
    `${API_URL}/universities?${query.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch universities");
  }

  const result: UniversityResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to load universities");
  }

  return {
    universities: result.data.map(mapUniversity),
    total: result.pagination.total,
    totalPages: result.pagination.totalPages,
  };
}

export async function getUniversityById(
  id: string | number
): Promise<University> {
  const response = await fetch(
    `${API_URL}/universities/${encodeURIComponent(String(id))}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("University not found");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "University not found");
  }

  return mapUniversity(result.data);
}
