
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluateEligibility } = require("../utils/recommendationEligibility");

const baseUser = {
    age: 22,
    gender: "Female",
    occupation: "Student",
    state: "Karnataka",
    income: 0,
    landOwnership: false
};

const baseScheme = {
    occupation: "Student",
    gender: "Female",
    state: "Karnataka",
    minimumAge: 18,
    maximumAge: 30,
    maximumIncome: 100000,
    requiresLandOwnership: false
};

test("eligible student passes all matching requirements", () => {
    const result = evaluateEligibility(baseUser, baseScheme);

    assert.equal(result.eligibilityStatus, "Eligible");
    assert.deepEqual(result.eligibilityIssues, []);
});

test("applicant below minimum age is rejected", () => {
    const result = evaluateEligibility(
        { ...baseUser, age: 16 },
        baseScheme
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("Minimum age")));
});

test("applicant above maximum age is rejected", () => {
    const result = evaluateEligibility(
        { ...baseUser, age: 35 },
        baseScheme
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("Maximum age")));
});

test("occupation mismatch is rejected", () => {
    const result = evaluateEligibility(
        { ...baseUser, occupation: "Employee" },
        baseScheme
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("Occupation")));
});

test("gender mismatch is rejected", () => {
    const result = evaluateEligibility(
        { ...baseUser, gender: "Male" },
        baseScheme
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("Gender")));
});

test("income above scheme limit is rejected", () => {
    const result = evaluateEligibility(
        { ...baseUser, income: 150000 },
        baseScheme
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("Maximum income")));
});

test("land ownership requirement is enforced", () => {
    const result = evaluateEligibility(
        baseUser,
        { ...baseScheme, requiresLandOwnership: true }
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("Land ownership")));
});

test("occupation set to all accepts any occupation", () => {
    const result = evaluateEligibility(
        { ...baseUser, occupation: "Employee" },
        { ...baseScheme, occupation: "all" }
    );

    assert.equal(result.eligibilityStatus, "Eligible");
});

test("comparison ignores case and surrounding whitespace", () => {
    const result = evaluateEligibility(
        { ...baseUser, occupation: " student ", gender: "FEMALE" },
        { ...baseScheme, occupation: "STUDENT", gender: "female" }
    );

    assert.equal(result.eligibilityStatus, "Eligible");
});

test("state mismatch is rejected when both states are provided", () => {
    const result = evaluateEligibility(
        { ...baseUser, state: "Tamil Nadu" },
        baseScheme
    );

    assert.equal(result.eligibilityStatus, "Not Eligible");
    assert.ok(result.eligibilityIssues.some(issue => issue.includes("state")));
});
