import { University } from "@/types/university";

export const universities: University[] = [
  {
    id: 1,
    name: "Universitas Tarumanagara",
    location: "West Jakarta",
    province: "DKI Jakarta",
    image: "/images/campus-untar.jpg",
    tuitionFee: "10 - 25 Million",
    fieldOfStudy: ["Engineering", "Business", "Technology"],
    accreditation: "Excellent",
  },
  {
    id: 2,
    name: "Binus University",
    location: "West Jakarta",
    province: "DKI Jakarta",
    image: "/images/campus-binus.jpg",
    tuitionFee: "15 - 35 Million",
    fieldOfStudy: ["Computer Science", "Business", "Design"],
    accreditation: "Excellent",
  },
  {
    id: 3,
    name: "Institut Teknologi Sepuluh Nopember",
    location: "Surabaya",
    province: "East Java",
    image: "/images/campus-its.jpg",
    tuitionFee: "5 - 20 Million",
    fieldOfStudy: ["Engineering", "Technology", "Science"],
    accreditation: "Excellent",
  },
];