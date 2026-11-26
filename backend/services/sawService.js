
const University = require("../models/University");

// ==========================================
// 1. CALCULATE DISTANCE USING HAVERSINE
// ==========================================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

// ==========================================
// 2. ACCREDITATION SCORE
// ==========================================

function getAccreditationScore(value) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const accreditation = String(value)
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

  // New accreditation system
  if (/\bunggul\b/.test(accreditation)) return 5;
  if (/\bbaik sekali\b/.test(accreditation)) return 4;
  if (/\bbaik\b/.test(accreditation)) return 3;

  // Old accreditation system
  if (/\ba\b/.test(accreditation)) return 5;
  if (/\bb\b/.test(accreditation)) return 4;
  if (/\bc\b/.test(accreditation)) return 3;

  // Not accredited
  if (
    accreditation.includes("tidak terakreditasi") ||
    accreditation.includes("belum terakreditasi")
  ) {
    return 1;
  }

  // Unknown accreditation
  return null;
}

// ==========================================
// 3. COST NORMALIZATION
// ==========================================

function normalizeCost(value, minimum, maximum) {
  if (minimum === maximum) {
    return 1;
  }

  if (minimum > 0) {
    return minimum / value;
  }

  return (maximum - value) / (maximum - minimum);
}

// ==========================================
// 4. GENERATE RECOMMENDATIONS USING SAW
// ==========================================

async function generateRecommendations({
  latitude,
  longitude,
  weights,
  budget,
  minimumAccreditation = "any",
}) {
  // Minimum accreditation mapping
  const minimumScores = {
    any: null,
    baik: 3,
    "baik-sekali": 4,
    unggul: 5,
  };

  const requiredScore =
    minimumScores[minimumAccreditation] ?? null;

  // Fetch all universities
  const universities = await University.find({}).lean();

  // ==========================================
  // 5. DIAGNOSTIC COUNTERS
  // ==========================================

  const diagnostics = {
    totalDatabase: universities.length,
    invalidTuition: 0,
    invalidCoordinates: 0,
    excludedByBudget: 0,
    excludedByAccreditation: 0,
    validAlternatives: 0,
  };

  const alternatives = [];

  // ==========================================
  // 6. FILTER ALTERNATIVES
  // ==========================================

  for (const university of universities) {
    const tuition = Number(university.biaya_per_semester);
    const lat = Number(university.latitude);
    const lng = Number(university.longitude);

    const accreditation = getAccreditationScore(
      university.akred_pt
    );

    // Validate tuition
    if (
      !Number.isFinite(tuition) ||
      tuition <= 0
    ) {
      diagnostics.invalidTuition++;
      continue;
    }

    // Validate coordinates
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180 ||
      (lat === 0 && lng === 0)
    ) {
      diagnostics.invalidCoordinates++;
      continue;
    }

    // Optional budget filter
    if (
      budget !== undefined &&
      budget !== null &&
      tuition > Number(budget)
    ) {
      diagnostics.excludedByBudget++;
      continue;
    }

    // Minimum accreditation filter
    if (
      requiredScore !== null &&
      (
        accreditation === null ||
        accreditation < requiredScore
      )
    ) {
      diagnostics.excludedByAccreditation++;
      continue;
    }

    // Calculate distance
    const distance = calculateDistance(
      latitude,
      longitude,
      lat,
      lng
    );

    alternatives.push({
      university,
      tuition,
      distance,
      accreditation: accreditation ?? 1,
    });
  }

  diagnostics.validAlternatives = alternatives.length;

  // ==========================================
  // 7. PRINT DIAGNOSTICS
  // ==========================================

  console.log("\n==========================================");
  console.log("EDUFIND RECOMMENDATION DIAGNOSTICS");
  console.log("==========================================");

  console.table(diagnostics);

  console.log("Minimum Accreditation:", minimumAccreditation);
  console.log("Budget:", budget ?? "No budget limit");

  console.log("==========================================\n");

  // No valid alternatives
  if (alternatives.length === 0) {
    return [];
  }

  // ==========================================
  // 8. FIND MINIMUM AND MAXIMUM VALUES
  // ==========================================

  const minTuition = Math.min(
    ...alternatives.map((item) => item.tuition)
  );

  const maxTuition = Math.max(
    ...alternatives.map((item) => item.tuition)
  );

  const minDistance = Math.min(
    ...alternatives.map((item) => item.distance)
  );

  const maxDistance = Math.max(
    ...alternatives.map((item) => item.distance)
  );

  const maxAccreditation = Math.max(
    ...alternatives.map((item) => item.accreditation)
  );

  // ==========================================
  // 9. SAW NORMALIZATION AND WEIGHTED SCORE
  // ==========================================

  const results = alternatives.map((item) => {
    const normalized = {
      // C1: Tuition Fee (Cost)
      tuition: normalizeCost(
        item.tuition,
        minTuition,
        maxTuition
      ),

      // C2: Distance (Cost)
      distance: normalizeCost(
        item.distance,
        minDistance,
        maxDistance
      ),

      // C3: Accreditation (Benefit)
      accreditation:
        item.accreditation / maxAccreditation,
    };

    // Calculate final SAW score
    const score =
      (weights.tuition / 100) * normalized.tuition +
      (weights.distance / 100) * normalized.distance +
      (weights.accreditation / 100) *
        normalized.accreditation;

    return {
      ...item.university,

      recommendation: {
        score: Number(score.toFixed(4)),

        tuition: item.tuition,

        distanceKm: Number(
          item.distance.toFixed(2)
        ),

        accreditationScore: item.accreditation,

        normalized: {
          tuition: Number(
            normalized.tuition.toFixed(4)
          ),

          distance: Number(
            normalized.distance.toFixed(4)
          ),

          accreditation: Number(
            normalized.accreditation.toFixed(4)
          ),
        },
      },
    };
  });

  // ==========================================
  // 10. SORT AND ASSIGN RANK
  // ==========================================

  results.sort(
    (a, b) =>
      b.recommendation.score - a.recommendation.score
  );

  const rankedResults = results.map((item, index) => ({
    ...item,

    recommendation: {
      ...item.recommendation,
      rank: index + 1,
    },
  }));

  console.log(
    `Successfully generated ${rankedResults.length} recommendations.`
  );

  return rankedResults;
}

// ==========================================
// 11. EXPORT FUNCTIONS
// ==========================================

module.exports = {
  generateRecommendations,
  calculateDistance,
  getAccreditationScore,
};
