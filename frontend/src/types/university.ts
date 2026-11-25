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
}