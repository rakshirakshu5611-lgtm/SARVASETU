
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
    toBoolean,
    normalize,
    normalizeArray,
    arrayContains,
    isAllValue,
    isAllArray,
} = require("../utils/eligibilityHelpers");

test("toBoolean converts supported true values", () => {
    assert.equal(toBoolean(true), true);
    assert.equal(toBoolean("true"), true);
    assert.equal(toBoolean(1), true);
    assert.equal(toBoolean("1"), true);
});

test("toBoolean rejects unsupported values", () => {
    assert.equal(toBoolean(false), false);
    assert.equal(toBoolean("false"), false);
    assert.equal(toBoolean(0), false);
    assert.equal(toBoolean(undefined), false);
});

test("normalize handles case and whitespace", () => {
    assert.equal(normalize("  STUDENT "), "student");
    assert.equal(normalize(null), "");
    assert.equal(normalize(undefined), "");
    assert.equal(normalize(22), "22");
});

test("normalizeArray filters empty values and normalizes text", () => {
    assert.deepEqual(
        normalizeArray([" Student ", "", null, "FARMER"]),
        ["student", "farmer"]
    );

    assert.deepEqual(normalizeArray("student"), []);
});

test("arrayContains performs case-insensitive matching", () => {
    assert.equal(arrayContains(["Student", "Farmer"], "STUDENT"), true);
    assert.equal(arrayContains(["Student", "Farmer"], "Officer"), false);
    assert.equal(arrayContains([], "Student"), false);
});

test("isAllValue recognizes empty, all and any values", () => {
    assert.equal(isAllValue(""), true);
    assert.equal(isAllValue(" ALL "), true);
    assert.equal(isAllValue("Any"), true);
    assert.equal(isAllValue("Student"), false);
});

test("isAllArray recognizes empty arrays and all/any entries", () => {
    assert.equal(isAllArray([]), true);
    assert.equal(isAllArray(["ALL"]), true);
    assert.equal(isAllArray(["any"]), true);
    assert.equal(isAllArray(["Student"]), false);
});
