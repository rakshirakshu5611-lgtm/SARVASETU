const Scheme = require("../models/Scheme");
 
// =====================================================
// SAFE URL VALIDATION
// =====================================================

const isSafeUrl = (value) => {
    if (!value) {
        return true;
    }

    try {
        const url = new URL(value);

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

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

    return String(value)
        .trim()
        .toLowerCase();
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

// =====================================================
// COMPARE SCHEMES
// =====================================================

const compareSchemes = async (req, res) => {
    try {
        const { schemeIds } = req.body;

        if (!Array.isArray(schemeIds)) {
            return res.status(400).json({
                success: false,
                message: "schemeIds must be an array",
            });
        }

        if (schemeIds.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Select at least 2 schemes to compare",
            });
        }

        if (schemeIds.length > 3) {
            return res.status(400).json({
                success: false,
                message: "You can compare a maximum of 3 schemes",
            });
        }

        const mongoose = require("mongoose");

        const invalidIds = schemeIds.some(
            (id) => !mongoose.Types.ObjectId.isValid(id)
        );

        if (invalidIds) {
            return res.status(400).json({
                success: false,
                message: "Invalid scheme ID",
            });
        }

        const schemes = await Scheme.find({
            _id: { $in: schemeIds },
        });

        if (schemes.length !== schemeIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more schemes not found",
            });
        }

        const comparison = schemes.map((scheme) => ({
            _id: scheme._id,
            schemeName: scheme.schemeName,
            description: scheme.description,
            category: scheme.category,
            state: scheme.state,
            occupation: scheme.occupation,
            gender: scheme.gender,
            minimumAge: scheme.minimumAge,
            maximumAge: scheme.maximumAge,
            minimumIncome: scheme.minimumIncome,
            maximumIncome: scheme.maximumIncome,
            requiresLandOwnership:
                scheme.requiresLandOwnership,

            socialCategories:
                scheme.socialCategories || [],

            requiresStudent:
                scheme.requiresStudent || false,

            requiresDisability:
                scheme.requiresDisability || false,

            requiresMinority:
                scheme.requiresMinority || false,

            requiresSeniorCitizen:
                scheme.requiresSeniorCitizen || false,

            requiresFarmer:
                scheme.requiresFarmer || false,

            requiresArtisan:
                scheme.requiresArtisan || false,

            requiresFisherman:
                scheme.requiresFisherman || false,

            requiresConstructionWorker:
                scheme.requiresConstructionWorker || false,

            requiresSanitationWorker:
                scheme.requiresSanitationWorker || false,

            requiresWidow:
                scheme.requiresWidow || false,

            requiresSingleWoman:
                scheme.requiresSingleWoman || false,

            requiresTransgender:
                scheme.requiresTransgender || false,

            sourceName: scheme.sourceName,
            sourceUrl: scheme.sourceUrl,
            applyLink: scheme.applyLink,
        }));

        res.status(200).json({
            success: true,
            total: comparison.length,
            schemes: comparison,
        });
    } catch (error) {
        console.error(
            "COMPARE SCHEMES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to compare schemes",
        });
    }
};

// =====================================================
// ADD SCHEME
// =====================================================

const addScheme = async (req, res) => {
    try {
        const {
            schemeName,
            department,
            description,
            eligibility,
            benefits,
            documents,
            sourceName,
            sourceUrl,
            applyLink,
            serviceName,
            serviceUrl,
            serviceDescription,
            category,
            state,
            occupation,
            gender,
            minimumAge,
            maximumAge,
            minimumIncome,
            maximumIncome,

            // NEW ELIGIBILITY FIELDS
            socialCategories,
            requiresStudent,
            requiresDisability,
            requiresMinority,
            requiresSeniorCitizen,
            requiresFarmer,
            requiresArtisan,
            requiresFisherman,
            requiresConstructionWorker,
            requiresSanitationWorker,
            requiresWidow,
            requiresSingleWoman,
            requiresTransgender,
        } = req.body;

        // =================================================
        // URL VALIDATION
        // =================================================

        if (sourceUrl && !isSafeUrl(sourceUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid official source URL",
            });
        }

        if (applyLink && !isSafeUrl(applyLink)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application URL",
            });
        }

        if (serviceUrl && !isSafeUrl(serviceUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid government service URL",
            });
        }

        // =================================================
        // CREATE SCHEME
        // =================================================

        const scheme = await Scheme.create({
            schemeName,
            department,
            description,
            eligibility,
            benefits,
            documents,
            sourceName,
            sourceUrl,
            applyLink,

            serviceName,
            serviceUrl,
            serviceDescription,

            category,
            state,
            occupation,
            gender,

            minimumAge:
                minimumAge === "" ||
                minimumAge === undefined
                    ? null
                    : Number(minimumAge),

            maximumAge:
                maximumAge === "" ||
                maximumAge === undefined
                    ? null
                    : Number(maximumAge),

            minimumIncome:
                minimumIncome === "" ||
                minimumIncome === undefined
                    ? null
                    : Number(minimumIncome),

            maximumIncome:
                maximumIncome === "" ||
                maximumIncome === undefined
                    ? null
                    : Number(maximumIncome),

            // NEW STRUCTURED ELIGIBILITY
            socialCategories:
                Array.isArray(socialCategories)
                    ? socialCategories
                    : [],

            requiresStudent:
                toBoolean(requiresStudent),

            requiresDisability:
                toBoolean(requiresDisability),

            requiresMinority:
                toBoolean(requiresMinority),

            requiresSeniorCitizen:
                toBoolean(requiresSeniorCitizen),

            requiresFarmer:
                toBoolean(requiresFarmer),

            requiresArtisan:
                toBoolean(requiresArtisan),

            requiresFisherman:
                toBoolean(requiresFisherman),

            requiresConstructionWorker:
                toBoolean(requiresConstructionWorker),

            requiresSanitationWorker:
                toBoolean(requiresSanitationWorker),

            requiresWidow:
                toBoolean(requiresWidow),

            requiresSingleWoman:
                toBoolean(requiresSingleWoman),

            requiresTransgender:
                toBoolean(requiresTransgender),
        });

        res.status(201).json({
            success: true,
            message: "Scheme Added Successfully",
            scheme,
        });
    } catch (error) {
        console.error(
            "ADD SCHEME ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to add scheme",
        });
    }
};

// =====================================================
// GET ALL SCHEMES
// =====================================================

const getSchemes = async (req, res) => {
    try {
        const mongoose = require("mongoose");

        // Use the existing MongoDB connection
        // and read the actual SARVASETU database.
        const db = mongoose.connection
            .getClient()
            .db("sarvasetu");

        const schemesCollection = db.collection("schemes");

        const schemes = await schemesCollection
            .find({})
            .toArray();

        const schemesWithDeadline =
            schemes.map((scheme) => {

                // ======================================
                // FRESHNESS STATUS
                // ======================================

                const updatedDate =
                    scheme.updatedAt
                        ? new Date(scheme.updatedAt)
                        : new Date();

                const today = new Date();

                const differenceInMs =
                    today - updatedDate;

                const differenceInDays =
                    Math.floor(
                        differenceInMs /
                            (1000 * 60 * 60 * 24)
                    );

                let freshnessStatus;

                if (differenceInDays <= 90) {
                    freshnessStatus =
                        "Recently Updated";
                } else if (differenceInDays <= 180) {
                    freshnessStatus =
                        "Needs Review";
                } else {
                    freshnessStatus =
                        "Outdated";
                }

                // ======================================
                // DEADLINE STATUS
                // ======================================

                let deadlineStatus =
                    "No Deadline";

                let daysRemaining = null;

                if (scheme.deadline) {

                    const deadlineDate =
                        new Date(scheme.deadline);

                    const todayDate =
                        new Date();

                    deadlineDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    todayDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    const differenceInMs =
                        deadlineDate -
                        todayDate;

                    daysRemaining =
                        Math.ceil(
                            differenceInMs /
                                (1000 *
                                    60 *
                                    60 *
                                    24)
                        );

                    if (daysRemaining < 0) {

                        deadlineStatus =
                            "Expired";

                    } else if (
                        daysRemaining <= 30
                    ) {

                        deadlineStatus =
                            "Closing Soon";

                    } else {

                        deadlineStatus =
                            "Open";
                    }
                }

                return {
                    ...scheme,

                    freshnessStatus,

                    freshnessDays:
                        differenceInDays,

                    deadlineStatus,

                    daysRemaining,
                };
            });

        console.log(
            "SARVASETU SCHEMES LOADED:",
            schemesWithDeadline.length
        );

        res.json({
            success: true,
            total: schemesWithDeadline.length,
            schemes: schemesWithDeadline,
        });

    } catch (error) {

        console.error(
            "GET SCHEMES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to load schemes",
        });
    }
};

// =====================================================
// SEARCH SCHEMES
// =====================================================

const searchSchemes = async (req, res) => {
    try {
        const keyword =
            req.query.keyword?.trim();

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message:
                    "Search keyword is required",
            });
        }

        const schemes =
            await Scheme.find({
                schemeName: {
                    $regex: keyword,
                    $options: "i",
                },
            });

        res.json({
            success: true,
            schemes,
        });
    } catch (error) {
        console.error(
            "SEARCH SCHEMES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to search schemes",
        });
    }
};

// =====================================================
// FILTER SCHEMES BY CATEGORY
// =====================================================

const filterSchemes = async (req, res) => {
    try {
        const category =
            req.params.category?.trim();

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        const schemes =
            await Scheme.find({
                category: {
                    $regex: category,
                    $options: "i",
                },
            });

        res.json({
            success: true,
            total: schemes.length,
            schemes,
        });
    } catch (error) {
        console.error(
            "FILTER SCHEMES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to filter schemes",
        });
    }
};

// =====================================================
// GET SINGLE SCHEME BY ID
// =====================================================

const getSchemeById = async (req, res) => {
    try {
        const scheme =
            await Scheme.findById(
                req.params.id
            );

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: "Scheme not found",
            });
        }

        res.status(200).json({
            success: true,
            scheme,
        });
    } catch (error) {
        console.error(
            "GET SCHEME ERROR:",
            error
        );

        res.status(400).json({
            success: false,
            message: "Invalid scheme ID",
        });
    }
};

// =====================================================
// UPDATE SCHEME — ADMIN
// =====================================================

const updateScheme = async (req, res) => {
    try {
        const { id } = req.params;

        // =================================================
        // URL VALIDATION
        // =================================================

        if (
            req.body.sourceUrl &&
            !isSafeUrl(req.body.sourceUrl)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid official source URL",
            });
        }

        if (
            req.body.applyLink &&
            !isSafeUrl(req.body.applyLink)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid application URL",
            });
        }

        if (
            req.body.serviceUrl &&
            !isSafeUrl(req.body.serviceUrl)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid government service URL",
            });
        }

        // =================================================
        // CLEAN NUMERIC VALUES
        // =================================================

        const updateData = {
            ...req.body,
        };

        if (
            updateData.minimumAge === "" ||
            updateData.minimumAge === undefined
        ) {
            updateData.minimumAge = null;
        } else if (
            updateData.minimumAge !== null
        ) {
            updateData.minimumAge =
                Number(updateData.minimumAge);
        }

        if (
            updateData.maximumAge === "" ||
            updateData.maximumAge === undefined
        ) {
            updateData.maximumAge = null;
        } else if (
            updateData.maximumAge !== null
        ) {
            updateData.maximumAge =
                Number(updateData.maximumAge);
        }

        if (
            updateData.minimumIncome === "" ||
            updateData.minimumIncome === undefined
        ) {
            updateData.minimumIncome = null;
        } else if (
            updateData.minimumIncome !== null
        ) {
            updateData.minimumIncome =
                Number(updateData.minimumIncome);
        }

        if (
            updateData.maximumIncome === "" ||
            updateData.maximumIncome === undefined
        ) {
            updateData.maximumIncome = null;
        } else if (
            updateData.maximumIncome !== null
        ) {
            updateData.maximumIncome =
                Number(updateData.maximumIncome);
        }

        // =================================================
        // CLEAN NEW ELIGIBILITY FIELDS
        // =================================================

        if (
            updateData.socialCategories !==
            undefined
        ) {
            updateData.socialCategories =
                Array.isArray(
                    updateData.socialCategories
                )
                    ? updateData.socialCategories
                    : [];
        }

        const booleanFields = [
            "requiresStudent",
            "requiresDisability",
            "requiresMinority",
            "requiresSeniorCitizen",
            "requiresFarmer",
            "requiresArtisan",
            "requiresFisherman",
            "requiresConstructionWorker",
            "requiresSanitationWorker",
            "requiresWidow",
            "requiresSingleWoman",
            "requiresTransgender",
        ];

        booleanFields.forEach((field) => {
            if (
                updateData[field] !== undefined
            ) {
                updateData[field] =
                    toBoolean(
                        updateData[field]
                    );
            }
        });

        // =================================================
        // UPDATE
        // =================================================

        const scheme =
            await Scheme.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: "Scheme not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Scheme updated successfully",
            scheme,
        });
    } catch (error) {
        console.error(
            "UPDATE SCHEME ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update scheme",
        });
    }
};

// =====================================================
// DELETE SCHEME — ADMIN
// =====================================================

const deleteScheme = async (req, res) => {
    try {
        const { id } = req.params;

        const scheme =
            await Scheme.findByIdAndDelete(id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: "Scheme not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Scheme deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE SCHEME ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete scheme",
        });
    }
};

// =====================================================
// GET ELIGIBLE SCHEMES
// =====================================================

const getEligibleSchemes = async (req, res) => {
    try {
        const {
            age,
            gender,
            state,
            district,

            socialCategory,
            category,
            bpl,

            income,

            isStudent,
            educationLevel,

            occupation,
            employmentStatus,

            isDisabled,
            isMinority,
            isSeniorCitizen,
            isTransgender,

            isWidow,
            isSingleWoman,

            isConstructionWorker,
            isSanitationWorker,
            isArtisan,
            isFisherman,

            isFarmer,
            landOwnership,
        } = req.body;

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            age === undefined ||
            age === null ||
            !gender ||
            !state ||
            income === undefined ||
            income === null
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Age, gender, state and income are required",
            });
        }

        const userAge = Number(age);

        const userIncome =
            Number(income);

        if (
            Number.isNaN(userAge) ||
            userAge < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid age",
            });
        }

        if (
            Number.isNaN(userIncome) ||
            userIncome < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid income",
            });
        }

        // =================================================
        // NORMALIZE USER DATA
        // =================================================

        const userGender =
            normalize(gender);

        const userState =
            normalize(state);

        const userDistrict =
            normalize(district);

        const userSocialCategory =
            normalize(
                socialCategory ||
                    category
            );

        const userOccupation =
            normalize(occupation);

        const userEducation =
            normalize(educationLevel);

        const userEmploymentStatus =
            normalize(
                employmentStatus
            );

        const userBpl =
            toBoolean(bpl);

        const userIsStudent =
            toBoolean(isStudent);

        const userIsDisabled =
            toBoolean(isDisabled);

        const userIsMinority =
            toBoolean(isMinority);

        const userIsSeniorCitizen =
            toBoolean(
                isSeniorCitizen
            );

        const userIsTransgender =
            toBoolean(
                isTransgender
            );

        const userIsWidow =
            toBoolean(isWidow);

        const userIsSingleWoman =
            toBoolean(
                isSingleWoman
            );

        const userIsConstructionWorker =
            toBoolean(
                isConstructionWorker
            );

        const userIsSanitationWorker =
            toBoolean(
                isSanitationWorker
            );

        const userIsArtisan =
            toBoolean(isArtisan);

        const userIsFisherman =
            toBoolean(isFisherman);

        const userIsFarmer =
            toBoolean(isFarmer);

        const userLandOwnership =
            toBoolean(
                landOwnership
            );

        // =================================================
        // GET ALL SCHEMES
        // =================================================

        const schemes =
            await Scheme.find();

        // =================================================
        // MATCH SCHEMES
        // =================================================

        const eligibleSchemes =
            schemes.filter((scheme) => {

                // =========================================
                // 1. AGE
                // =========================================

                const ageMatch =
                    (
                        scheme.minimumAge ===
                            null ||
                        scheme.minimumAge ===
                            undefined ||
                        userAge >=
                            Number(
                                scheme.minimumAge
                            )
                    ) &&
                    (
                        scheme.maximumAge ===
                            null ||
                        scheme.maximumAge ===
                            undefined ||
                        userAge <=
                            Number(
                                scheme.maximumAge
                            )
                    );

                // =========================================
                // 2. GENDER
                // =========================================

                const schemeGender =
                    normalize(
                        scheme.gender
                    );

                const genderMatch =
                    isAllValue(
                        schemeGender
                    ) ||
                    schemeGender ===
                        userGender;

                // =========================================
                // 3. STATE
                // =========================================

                const schemeState =
                    normalize(
                        scheme.state
                    );

                const stateMatch =
                    isAllValue(
                        schemeState
                    ) ||
                    schemeState ===
                        userState;

                // =========================================
                // 4. OCCUPATION
                // =========================================

                const schemeOccupation =
                    normalize(
                        scheme.occupation
                    );

                const occupationMatch =
    isAllValue(schemeOccupation) ||
    schemeOccupation === userOccupation;

                // =========================================
                // 5. MINIMUM INCOME
                // =========================================

                const minimumIncome =
                    scheme.minimumIncome;

                const minimumIncomeMatch =
                    minimumIncome ===
                        null ||
                    minimumIncome ===
                        undefined ||
                    userIncome >=
                        Number(
                            minimumIncome
                        );

                // =========================================
                // 6. MAXIMUM INCOME
                // =========================================

                const maximumIncome =
                    scheme.maximumIncome;

                const maximumIncomeMatch =
                    maximumIncome ===
                        null ||
                    maximumIncome ===
                        undefined ||
                    userIncome <=
                        Number(
                            maximumIncome
                        );

                // =========================================
                // 7. LAND OWNERSHIP
                // =========================================

                const landMatch =
                    !toBoolean(
                        scheme.requiresLandOwnership
                    ) ||
                    userLandOwnership === true;

                // =========================================
                // 8. SOCIAL CATEGORY
                // =========================================

                const schemeCategories =
                    normalizeArray(
                        scheme.socialCategories
                    );

                let socialCategoryMatch =
                    true;

                if (
                    schemeCategories.length > 0 &&
                    !isAllArray(
                        schemeCategories
                    )
                ) {
                    socialCategoryMatch =
                        arrayContains(
                            schemeCategories,
                            userSocialCategory
                        );
                }

                // =========================================
                // 9. STUDENT
                // =========================================

                const studentMatch =
                    !toBoolean(
                        scheme.requiresStudent
                    ) ||
                    userIsStudent === true;

                // =========================================
                // 10. DISABILITY
                // =========================================

                const disabilityMatch =
                    !toBoolean(
                        scheme.requiresDisability
                    ) ||
                    userIsDisabled === true;

                // =========================================
                // 11. MINORITY
                // =========================================

                const minorityMatch =
                    !toBoolean(
                        scheme.requiresMinority
                    ) ||
                    userIsMinority === true;

                // =========================================
                // 12. SENIOR CITIZEN
                // =========================================

                const seniorCitizenMatch =
                    !toBoolean(
                        scheme.requiresSeniorCitizen
                    ) ||
                    userIsSeniorCitizen === true;

                // =========================================
                // 13. FARMER
                // =========================================

                const farmerMatch =
                    !toBoolean(
                        scheme.requiresFarmer
                    ) ||
                    userIsFarmer === true;

                // =========================================
                // 14. ARTISAN
                // =========================================

                const artisanMatch =
                    !toBoolean(
                        scheme.requiresArtisan
                    ) ||
                    userIsArtisan === true;

                // =========================================
                // 15. FISHERMAN
                // =========================================

                const fishermanMatch =
                    !toBoolean(
                        scheme.requiresFisherman
                    ) ||
                    userIsFisherman === true;

                // =========================================
                // 16. CONSTRUCTION WORKER
                // =========================================

                const constructionWorkerMatch =
                    !toBoolean(
                        scheme.requiresConstructionWorker
                    ) ||
                    userIsConstructionWorker ===
                        true;

                // =========================================
                // 17. SANITATION WORKER
                // =========================================

                const sanitationWorkerMatch =
                    !toBoolean(
                        scheme.requiresSanitationWorker
                    ) ||
                    userIsSanitationWorker ===
                        true;

                // =========================================
                // 18. WIDOW
                // =========================================

                const widowMatch =
                    !toBoolean(
                        scheme.requiresWidow
                    ) ||
                    userIsWidow === true;

                // =========================================
                // 19. SINGLE WOMAN
                // =========================================

                const singleWomanMatch =
                    !toBoolean(
                        scheme.requiresSingleWoman
                    ) ||
                    userIsSingleWoman ===
                        true;

                // =========================================
                // 20. TRANSGENDER
                // =========================================

                const transgenderMatch =
                    !toBoolean(
                        scheme.requiresTransgender
                    ) ||
                    userIsTransgender ===
                        true;

                // =========================================
                // FINAL MATCH
                // =========================================

                return (
                    ageMatch &&
                    genderMatch &&
                    stateMatch &&
                    occupationMatch &&
                    minimumIncomeMatch &&
                    maximumIncomeMatch &&
                    landMatch &&
                    socialCategoryMatch &&
                    studentMatch &&
                    disabilityMatch &&
                    minorityMatch &&
                    seniorCitizenMatch &&
                    farmerMatch &&
                    artisanMatch &&
                    fishermanMatch &&
                    constructionWorkerMatch &&
                    sanitationWorkerMatch &&
                    widowMatch &&
                    singleWomanMatch &&
                    transgenderMatch
                );
            });

        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({
            success: true,
            total:
                eligibleSchemes.length,
            schemes:
                eligibleSchemes,
        });

    } catch (error) {
        console.error(
            "GET ELIGIBLE SCHEMES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to find eligible schemes",
        });
    }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
    addScheme,
    getSchemes,
    searchSchemes,
    filterSchemes,
    getSchemeById,
    compareSchemes,
    getEligibleSchemes,
    updateScheme,
    deleteScheme,
};