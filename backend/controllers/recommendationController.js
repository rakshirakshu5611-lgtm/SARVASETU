const User = require("../models/User");
const Scheme = require("../models/Scheme");

const recommendSchemes = async (req, res) => {
  try {
    // ==========================================
    // 1. GET LOGGED-IN USER
    // ==========================================

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==========================================
    // 2. GET ALL ACTIVE SCHEMES
    // ==========================================

    const schemes = await Scheme.find({ isActive: { $ne: false } });

    // ==========================================
    // 3. PERSONALIZED RECOMMENDATION
    // ==========================================

    const recommendations = schemes.map((scheme) => {
      let score = 0;

      let eligibilityStatus = "Eligible";
      let eligibilityIssues = [];

      let benefitRelevanceScore = 0;
      let benefitReasons = [];

      // ------------------------------------------
      // USER DATA
      // ------------------------------------------

      const userAge = Number(user.age || 0);

      const userGender = String(user.gender || "")
        .trim()
        .toLowerCase();

      const userOccupation = String(user.occupation || "")
        .trim()
        .toLowerCase();

      const userState = String(user.state || "")
        .trim()
        .toLowerCase();

      const userIncome = Number(user.income || 0);

      const hasLand =
        user.hasLandOwnership === true ||
        user.landOwnership === true;

      // ------------------------------------------
      // SCHEME DATA
      // ------------------------------------------

      const schemeOccupation = String(scheme.occupation || "")
        .trim()
        .toLowerCase();

      const schemeGender = String(scheme.gender || "")
        .trim()
        .toLowerCase();

      const schemeState = String(scheme.state || "")
        .trim()
        .toLowerCase();

      const schemeCategory = String(scheme.category || "")
        .trim()
        .toLowerCase();

      // ==========================================
      // 4. OCCUPATION MATCH
      // ==========================================

      if (
        schemeOccupation &&
        schemeOccupation !== "all" &&
        schemeOccupation !== userOccupation
      ) {
        eligibilityStatus = "Not Eligible";

        eligibilityIssues.push(
          "Occupation does not match the scheme requirements."
        );
      } else if (
        schemeOccupation === "all" ||
        schemeOccupation === userOccupation
      ) {
        score += 20;
      }

      // ==========================================
      // 5. GENDER ELIGIBILITY
      // ==========================================

      if (
        schemeGender &&
        schemeGender !== "all" &&
        schemeGender !== userGender
      ) {
        eligibilityStatus = "Not Eligible";

        eligibilityIssues.push(
          "Gender does not match the scheme requirements."
        );
      } else {
        score += 10;
      }

      // ==========================================
      // 6. AGE ELIGIBILITY
      // ==========================================

      const minimumAge = Number(scheme.minimumAge || 0);
      const maximumAge = Number(scheme.maximumAge || 100);

      if (userAge < minimumAge) {
        eligibilityStatus = "Not Eligible";

        eligibilityIssues.push(
          `Minimum age requirement is ${minimumAge} years.`
        );
      } else if (userAge > maximumAge) {
        eligibilityStatus = "Not Eligible";

        eligibilityIssues.push(
          `Maximum age requirement is ${maximumAge} years.`
        );
      } else {
        score += 15;
      }

      // ==========================================
      // 7. INCOME ELIGIBILITY
      // ==========================================

      const maximumIncome = Number(
        scheme.maximumIncome || 99999999
      );

      if (userIncome > maximumIncome) {
        eligibilityStatus = "Not Eligible";

        eligibilityIssues.push(
          `Maximum income allowed is ₹${maximumIncome}.`
        );
      } else {
        score += 15;
      }

      // ==========================================
      // 8. STATE ELIGIBILITY
      // ==========================================

      if (
        schemeState &&
        schemeState !== "all" &&
        userState &&
        schemeState !== userState
      ) {
        eligibilityStatus = "Not Eligible";

        eligibilityIssues.push(
          "This scheme is not available in your state."
        );
      } else {
        score += 10;
      }

      // ==========================================
      // 9. LAND OWNERSHIP
      // ==========================================

      if (scheme.requiresLandOwnership === true) {
        if (!hasLand) {
          eligibilityStatus = "Not Eligible";

          eligibilityIssues.push(
            "Land ownership is required for this scheme."
          );
        } else {
          score += 10;
        }
      } else {
        score += 5;
      }

      // ==========================================
      // 10. BENEFIT RELEVANCE SCORE
      // ==========================================

      // Student
      if (userOccupation === "student") {
        if (
          schemeCategory.includes("scholarship") ||
          schemeCategory.includes("skill") ||
          schemeCategory.includes("internship")
        ) {
          benefitRelevanceScore += 20;

          benefitReasons.push(
            "Relevant to students and education."
          );
        }
      }

      // Farmer
      if (userOccupation === "farmer") {
        if (
          schemeCategory.includes("agriculture") ||
          schemeCategory.includes("loan")
        ) {
          benefitRelevanceScore += 20;

          benefitReasons.push(
            "Relevant to farmers and agriculture."
          );
        }
      }

      // Employee
      if (userOccupation === "employee") {
        if (
          schemeCategory.includes("job") ||
          schemeCategory.includes("skill") ||
          schemeCategory.includes("loan")
        ) {
          benefitRelevanceScore += 20;

          benefitReasons.push(
            "Relevant to employees and career development."
          );
        }
      }

      // Female
      if (userGender === "female") {
        if (schemeCategory.includes("women")) {
          benefitRelevanceScore += 20;

          benefitReasons.push(
            "Relevant to women beneficiaries."
          );
        }
      }

      // Healthcare
      if (schemeCategory.includes("healthcare")) {
        benefitRelevanceScore += 10;

        benefitReasons.push(
          "Provides healthcare-related benefits."
        );
      }

      // Pension
      if (
        schemeCategory.includes("pension") &&
        userAge >= 60
      ) {
        benefitRelevanceScore += 20;

        benefitReasons.push(
          "Relevant to senior citizens and pension benefits."
        );
      }

      // ==========================================
      // 11. NORMALIZED BENEFIT SCORE
      // ==========================================

      const normalizedBenefitScore = Math.min(
        benefitRelevanceScore * 5,
        100
      );

      // ==========================================
      // 12. FINAL RECOMMENDATION SCORE
      // ==========================================

      const recommendationScore = Math.round(
        score * 0.7 +
          normalizedBenefitScore * 0.3
      );

      // ==========================================
      // 13. RECOMMENDATION EXPLANATION
      // ==========================================

      let recommendationExplanation = "";

      if (
        eligibilityStatus === "Eligible" &&
        recommendationScore >= 80
      ) {
        recommendationExplanation =
          "This scheme strongly matches your profile and eligibility.";
      } else if (
        eligibilityStatus === "Eligible" &&
        recommendationScore >= 60
      ) {
        recommendationExplanation =
          "This scheme is a good match based on your profile and benefits.";
      } else if (
        eligibilityStatus === "Eligible"
      ) {
        recommendationExplanation =
          "You may be eligible, but the overall relevance is moderate.";
      } else if (
        recommendationScore >= 60
      ) {
        recommendationExplanation =
          "The scheme has relevant benefits, but some eligibility requirements are not satisfied.";
      } else {
        recommendationExplanation =
          "This scheme currently has limited relevance to your profile.";
      }

      // ==========================================
      // 14. DEADLINE STATUS
      // ==========================================

      let deadlineStatus = "No Deadline";
      let daysRemaining = null;
      let deadlinePriority = 0;

      if (scheme.deadline) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const deadlineDate = new Date(
          scheme.deadline
        );

        deadlineDate.setHours(0, 0, 0, 0);

        const difference =
          deadlineDate.getTime() -
          today.getTime();

        daysRemaining = Math.ceil(
          difference /
            (1000 * 60 * 60 * 24)
        );

        if (daysRemaining < 0) {
          deadlineStatus = "Expired";

          deadlinePriority = 0;
        } else if (daysRemaining <= 30) {
          deadlineStatus = "Closing Soon";

          deadlinePriority = 3;
        } else {
          deadlineStatus = "Open";

          deadlinePriority = 1;
        }
      }

      // ==========================================
      // 15. FRESHNESS STATUS
      // ==========================================

      let freshnessStatus = "Recently Updated";
      let freshnessDays = 0;

      if (scheme.updatedAt) {
        const today = new Date();

        const updatedDate = new Date(
          scheme.updatedAt
        );

        const difference =
          today.getTime() -
          updatedDate.getTime();

        freshnessDays = Math.floor(
          difference /
            (1000 * 60 * 60 * 24)
        );

        if (freshnessDays <= 90) {
          freshnessStatus =
            "Recently Updated";
        } else if (freshnessDays <= 180) {
          freshnessStatus =
            "Needs Review";
        } else {
          freshnessStatus =
            "Outdated";
        }
      }

      // ==========================================
      // 16. GOVERNMENT SERVICE NAVIGATION
      // ==========================================

      const serviceName =
        scheme.serviceName || "";

      const serviceUrl =
        scheme.serviceUrl || "";

      const serviceDescription =
        scheme.serviceDescription || "";

      // ==========================================
      // 17. RETURN PERSONALIZED SCHEME
      // ==========================================

      return {
        ...scheme.toObject(),

        // Eligibility
        eligibilityStatus,
        eligibilityIssues,

        // AI Matching
        score,

        // Benefit relevance
        benefitRelevanceScore,
        benefitReasons,

        // Combined recommendation
        normalizedBenefitScore,
        recommendationScore,

        // Explanation
        recommendationExplanation,

        // Deadline
        deadlineStatus,
        daysRemaining,
        deadlinePriority,

        // Freshness
        freshnessStatus,
        freshnessDays,

        // Government Service Navigation
        serviceName,
        serviceUrl,
        serviceDescription,
      };
    });

    // ==========================================
    // 18. SORT RECOMMENDATIONS
    // ==========================================

    recommendations.sort((a, b) => {
      // Eligible schemes first
      if (
        a.eligibilityStatus === "Eligible" &&
        b.eligibilityStatus !== "Eligible"
      ) {
        return -1;
      }

      if (
        a.eligibilityStatus !== "Eligible" &&
        b.eligibilityStatus === "Eligible"
      ) {
        return 1;
      }

      // Higher recommendation score first
      if (
        b.recommendationScore !==
        a.recommendationScore
      ) {
        return (
          b.recommendationScore -
          a.recommendationScore
        );
      }

      // Closing deadlines first
      return (
        b.deadlinePriority -
        a.deadlinePriority
      );
    });

    // ==========================================
    // 19. RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Recommendation Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate recommendations.",
    });
  }
};

module.exports = {
  recommendSchemes,
};