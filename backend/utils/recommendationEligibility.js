
"use strict";

const evaluateEligibility = (user, scheme) => {
    const issues = [];

    const userAge = Number(user.age || 0);
    const userGender = String(user.gender || "").trim().toLowerCase();
    const userOccupation = String(user.occupation || "").trim().toLowerCase();
    const userState = String(user.state || "").trim().toLowerCase();
    const userIncome = Number(user.income || 0);

    const schemeOccupation = String(scheme.occupation || "").trim().toLowerCase();
    const schemeGender = String(scheme.gender || "").trim().toLowerCase();
    const schemeState = String(scheme.state || "").trim().toLowerCase();

    const hasLand =
        user.hasLandOwnership === true ||
        user.landOwnership === true;

    if (
        schemeOccupation &&
        schemeOccupation !== "all" &&
        schemeOccupation !== userOccupation
    ) {
        issues.push("Occupation does not match the scheme requirements.");
    }

    if (
        schemeGender &&
        schemeGender !== "all" &&
        schemeGender !== userGender
    ) {
        issues.push("Gender does not match the scheme requirements.");
    }

    const minimumAge = Number(scheme.minimumAge || 0);
    const maximumAge = Number(scheme.maximumAge || 100);

    if (userAge < minimumAge) {
        issues.push(`Minimum age requirement is ${minimumAge} years.`);
    } else if (userAge > maximumAge) {
        issues.push(`Maximum age requirement is ${maximumAge} years.`);
    }

    const maximumIncome = Number(scheme.maximumIncome || 99999999);

    if (userIncome > maximumIncome) {
        issues.push(`Maximum income allowed is ₹${maximumIncome}.`);
    }

    if (
        schemeState &&
        schemeState !== "all" &&
        userState &&
        schemeState !== userState
    ) {
        issues.push("This scheme is not available in your state.");
    }

    if (scheme.requiresLandOwnership === true && !hasLand) {
        issues.push("Land ownership is required for this scheme.");
    }

    return {
        eligibilityStatus: issues.length === 0 ? "Eligible" : "Not Eligible",
        eligibilityIssues: issues
    };
};

module.exports = { evaluateEligibility };

