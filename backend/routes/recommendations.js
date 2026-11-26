
const express = require("express");
const router = express.Router();

const {
  generateRecommendations,
} = require("../services/sawService");

const allowedAccreditations = [
  "any",
  "baik",
  "baik-sekali",
  "unggul",
];

router.post("/", async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      weights,
      budget,
      minimumAccreditation = "any",
    } = req.body;

    // Validate coordinates
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    // Validate weights
    if (
      !weights ||
      typeof weights.tuition !== "number" ||
      typeof weights.distance !== "number" ||
      typeof weights.accreditation !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation weights.",
      });
    }

    const totalWeight =
      weights.tuition +
      weights.distance +
      weights.accreditation;

    const validWeights = Object.values(weights).every(
      (weight) =>
        Number.isFinite(weight) &&
        weight >= 0 &&
        weight <= 100
    );

    if (!validWeights || totalWeight !== 100) {
      return res.status(400).json({
        success: false,
        message: "Total weights must equal 100%.",
      });
    }

    // Validate optional budget
    if (
      budget !== undefined &&
      (
        typeof budget !== "number" ||
        !Number.isFinite(budget) ||
        budget <= 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a positive number.",
      });
    }

    // Validate minimum accreditation
    if (!allowedAccreditations.includes(minimumAccreditation)) {
      return res.status(400).json({
        success: false,
        message: "Invalid minimum accreditation selection.",
      });
    }

    const results = await generateRecommendations({
      latitude,
      longitude,
      weights,
      budget,
      minimumAccreditation,
    });

    return res.status(200).json({
      success: true,
      message: "Recommendations generated successfully.",
      criteria: {
        C1: "Tuition Fee",
        C2: "Distance",
        C3: "Accreditation",
      },
      weights,
      minimumAccreditation,
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations.",
    });
  }
});

module.exports = router;
