const express = require("express");
const router = express.Router();

const University = require("../models/University");

// GET /api/universities
// Mengambil daftar kampus + pencarian dan filter
router.get("/", async (req, res) => {
  try {
    const {
      search,
      province,
      accreditation,
      ownership,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};

    if (search) {
      filter.nama_pt = {
        $regex: search,
        $options: "i"
      };
    }

    if (province) {
      filter.provinsi_pt = province;
    }

    if (accreditation) {
      filter.akred_pt = accreditation;
    }

    if (ownership) {
      filter.status_kepemilikan = ownership;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(
      100,
      Math.max(1, Number(limit) || 12)
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [universities, total] = await Promise.all([
      University.find(filter)
        .sort({ nama_pt: 1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      University.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      message: "Universities retrieved successfully",
      data: universities,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve universities",
      error: error.message
    });
  }
});

// GET /api/universities/provinces
router.get("/provinces", async (req, res) => {
  try {
    const provinces = await University.distinct("provinsi_pt");

    res.status(200).json({
      success: true,
      data: provinces.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve provinces",
      error: error.message
    });
  }
});

// GET /api/universities/accreditations
router.get("/accreditations", async (req, res) => {
  try {
    const accreditations = await University.distinct("akred_pt");

    res.status(200).json({
      success: true,
      data: accreditations.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve accreditations",
      error: error.message
    });
  }
});

// GET /api/universities/:id
// id dapat berupa kode_pt, slug, atau MongoDB _id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const conditions = [
      { slug: id }
    ];

    if (/^\d+$/.test(id)) {
      conditions.push({ kode_pt: Number(id) });
    }

    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      conditions.push({ _id: id });
    }

    const university = await University.findOne({
      $or: conditions
    }).lean();

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found"
      });
    }

    res.status(200).json({
      success: true,
      data: university
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve university",
      error: error.message
    });
  }
});

module.exports = router;
