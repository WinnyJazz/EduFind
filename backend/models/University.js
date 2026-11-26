const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    provinsi_pt: { type: String, required: true },
    kab_kota_pt: { type: String, required: true },
    nama_pt: { type: String, required: true },
    akred_pt: { type: String, required: true },
    kode_pt: { type: Number, required: true, unique: true },

    status_kepemilikan: String,
    range_biaya_kuliah: String,
    tahun_berdiri: Number,

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    website_resmi: String,
    coord_status: String,
    coord_source: String,

    biaya_per_semester: Number,
    biaya_status: String,
    sumber_biaya: String,

    bentuk_pt: String,
    website_url: String,
    website_status: String,

    logo_url: String,
    gambar_url: String,
    slug: String,
    deskripsi_singkat: String
  },
  {
    timestamps: true,
    collection: "universities"
  }
);

module.exports = mongoose.model("University", universitySchema);
