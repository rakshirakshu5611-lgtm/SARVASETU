"use strict";

const toBoolean = (value) => {
    return (
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1"
    );
};

const normalize = (value) => {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value).trim().toLowerCase();
};

const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item) =>
                item !== undefined &&
                item !== null &&
                String(item).trim() !== ""
        )
        .map((item) => normalize(item));
};

const arrayContains = (array, value) => {
    const normalizedArray = normalizeArray(array);
    const normalizedValue = normalize(value);

    if (!normalizedArray.length) {
        return false;
    }

    return normalizedArray.includes(normalizedValue);
};

const isAllValue = (value) => {
    const normalized = normalize(value);

    return (
        normalized === "" ||
        normalized === "all" ||
        normalized === "any"
    );
};

const isAllArray = (value) => {
    const array = normalizeArray(value);

    return (
        array.length === 0 ||
        array.includes("all") ||
        array.includes("any")
    );
};

module.exports = {
    toBoolean,
    normalize,
    normalizeArray,
    arrayContains,
    isAllValue,
    isAllArray,
};