
export interface University {
  id: number;
  name: string;
  location: string;
  province: string;
  image: string;
  description: string;
  tuitionFee: string;
  fieldOfStudy: string[];
  establishedYear: number;
  institutionType: "PTN" | "PTS";
  accreditation: string;
  website: string;
  latitude: number;
  longitude: number;

  // Additional database information
  slug: string;
  kodePT: number;
  tuitionAmount: number | null;
  tuitionStatus: string;
  coordinateStatus: string;
  logo: string;
  form: string;
}

// Original MongoDB document
export interface UniversityAPI {
  _id: string;
  kode_pt: number;
  nama_pt: string;
  provinsi_pt: string;
  kab_kota_pt: string;
  akred_pt: string;
  status_kepemilikan: string;
  range_biaya_kuliah: string;
  biaya_per_semester: number;
  biaya_status: string;
  tahun_berdiri: number;
  latitude: number;
  longitude: number;
  website_resmi: string;
  website_url: string;
  website_status: string;
  coord_status: string;
  coord_source: string;
  bentuk_pt: string;
  logo_url: string;
  gambar_url: string;
  slug: string;
  deskripsi_singkat: string;
}

export interface UniversityResponse {
  success: boolean;
  message?: string;
  data: UniversityAPI[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
