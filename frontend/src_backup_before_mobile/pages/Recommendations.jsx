import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function Recommendations() {
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("match");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOccupation, setSelectedOccupation] =
    useState("All");

  const [selectedForComparison, setSelectedForComparison] =
    useState([]);

  const MAX_COMPARE = 3;

  const [comparisonResults, setComparisonResults] =
    useState([]);

  const [comparing, setComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState("");

  /*
    SARVASETU DESIGN PALETTE
  */
  const COLORS = {
    cream: "#F7F1E3",
    panel: "#F2EEE1",
    white: "#FCF9F0",

    rose: "#C496A1",
    sage: "#919D85",
    lavender: "#8E88A3",
    bronze: "#81785A",

    darkSage: "#596B5A",
    ink: "#3E4435",
    muted: "#686C5A",
    border: "#C8C1AA",

    lightSage: "#E5EBDD",
    lightRose: "#F4E7E8",
    lightLavender: "#E8E3EE",
    lightBronze: "#EEE9D9",
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  /*
    LOAD RECOMMENDATIONS
  */
  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/recommend",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "AI RECOMMENDATION RESPONSE:",
        res.data
      );

      setSchemes(res.data.recommendations || []);
    } catch (err) {
      console.error(
        "RECOMMENDATION ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("failedToLoadRecommendations")
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    COMPARISON SELECTION
  */
  const toggleComparison = (schemeId) => {
    setSelectedForComparison((current) => {
      if (current.includes(schemeId)) {
        return current.filter(
          (id) => id !== schemeId
        );
      }

      if (current.length >= MAX_COMPARE) {
        alert(
          "You can compare a maximum of 3 schemes."
        );

        return current;
      }

      return [...current, schemeId];
    });
  };

  /*
    CLEAR COMPARISON
  */
  const clearComparison = () => {
    setSelectedForComparison([]);
    setComparisonResults([]);
    setComparisonError("");
  };

  /*
    COMPARE SELECTED
  */
  const handleCompareSelected = async () => {
    if (selectedForComparison.length < 2) {
      alert(
        "Please select at least 2 schemes to compare."
      );
      return;
    }

    try {
      setComparing(true);
      setComparisonError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setComparisonError("Please login first.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/schemes/compare",
        {
          schemeIds: selectedForComparison,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "COMPARISON RESPONSE:",
        res.data
      );

      setComparisonResults(
        res.data.schemes || []
      );
    } catch (err) {
      console.error(
        "COMPARISON ERROR:",
        err
      );

      setComparisonError(
        err.response?.data?.message ||
          "Failed to compare schemes."
      );
    } finally {
      setComparing(false);
    }
  };

  /*
    PERSONALIZED DATA
  */
  const getPersonalizedScheme = (schemeId) => {
    return schemes.find(
      (scheme) =>
        String(scheme._id) ===
        String(schemeId)
    );
  };

  /*
    UNIQUE CATEGORIES
  */
  const categories = [
    "All",
    ...new Set(
      schemes
        .map((scheme) => scheme.category)
        .filter(
          (category) =>
            category &&
            category !== "All"
        )
    ),
  ];

  /*
    UNIQUE OCCUPATIONS
  */
  const occupations = [
    "All",
    ...new Set(
      schemes
        .map((scheme) => scheme.occupation)
        .filter(
          (occupation) =>
            occupation &&
            occupation !== "All"
        )
    ),
  ];

  /*
    FILTER
  */
  const filteredSchemes = schemes.filter(
    (scheme) => {
      const categoryMatch =
        selectedCategory === "All" ||
        scheme.category ===
          selectedCategory;

      const occupationMatch =
        selectedOccupation === "All" ||
        scheme.occupation ===
          selectedOccupation;

      return (
        categoryMatch &&
        occupationMatch
      );
    }
  );

  /*
    SORT
  */
  const sortedSchemes = [
    ...filteredSchemes,
  ].sort((a, b) => {
    if (sortBy === "match") {
      const aEligible =
        a.eligibilityStatus ===
        "Eligible"
          ? 1
          : 0;

      const bEligible =
        b.eligibilityStatus ===
        "Eligible"
          ? 1
          : 0;

      if (
        aEligible !== bEligible
      ) {
        return (
          bEligible - aEligible
        );
      }

      return (
        (b.recommendationScore ||
          0) -
        (a.recommendationScore ||
          0)
      );
    }

    if (sortBy === "name") {
      return (
        (a.schemeName || "").localeCompare(
          b.schemeName || ""
        )
      );
    }

    return 0;
  });

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedOccupation("All");
  };

  const percentage = (value) => {
    return `${Math.min(
      Math.max(Number(value) || 0, 0),
      100
    )}%`;
  };

  /*
    LOADING
  */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          backgroundColor:
            COLORS.cream,
        }}
      >
        <div
          className="w-full max-w-md text-center rounded-3xl border p-10"
          style={{
            backgroundColor:
              COLORS.white,
            borderColor:
              COLORS.border,
          }}
        >
          <div
            className="w-24 h-1 mx-auto rounded-full overflow-hidden mb-6"
            style={{
              backgroundColor:
                COLORS.border,
            }}
          >
            <div
              className="h-full w-1/2 animate-pulse"
              style={{
                backgroundColor:
                  COLORS.sage,
              }}
            />
          </div>

          <h2
            className="text-2xl font-bold"
            style={{
              color: COLORS.ink,
            }}
          >
            {t("findingBestSchemes")}
          </h2>

          <p
            className="mt-2 text-sm"
            style={{
              color: COLORS.muted,
            }}
          >
            {t("aiCheckingEligibility")}
          </p>
        </div>
      </div>
    );
  }

  /*
    ERROR
  */
  if (error) {
    return (
      <div
        className="min-h-screen px-5 py-12"
        style={{
          backgroundColor:
            COLORS.cream,
        }}
      >
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold"
              style={{
                color: COLORS.bronze,
              }}
            >
              SARVASETU
            </p>

            <h1
              className="text-3xl font-bold mt-3"
              style={{
                color: COLORS.ink,
              }}
            >
              {t("aiRecommendedSchemes")}
            </h1>
          </div>

          <div
            className="rounded-3xl border p-8 text-center"
            style={{
              backgroundColor:
                COLORS.white,
              borderColor:
                COLORS.border,
            }}
          >
            <h2
              className="text-xl font-bold"
              style={{
                color: COLORS.rose,
              }}
            >
              {t(
                "unableToLoadRecommendations"
              )}
            </h2>

            <p
              className="mt-3 text-sm"
              style={{
                color: COLORS.muted,
              }}
            >
              {error}
            </p>

            <button
              onClick={() => {
                setError("");
                setLoading(true);
                loadRecommendations();
              }}
              className="mt-6 px-6 py-3 rounded-xl font-semibold"
              style={{
                backgroundColor:
                  COLORS.darkSage,
                color: "#FFFFFF",
              }}
            >
              {t("tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      style={{
        backgroundColor:
          COLORS.cream,
        color: COLORS.ink,
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* =================================
            PAGE HEADER
        ================================= */}

        <header className="mb-9">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{
              color: COLORS.bronze,
            }}
          >
            SARVASETU
          </p>

          <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-3xl">
              <h1
                className="text-3xl md:text-5xl font-bold tracking-tight"
                style={{
                  color: COLORS.ink,
                }}
              >
                {t(
                  "aiRecommendedSchemes"
                )}
              </h1>

              <p
                className="mt-3 text-sm md:text-base leading-relaxed"
                style={{
                  color: COLORS.muted,
                }}
              >
                {t(
                  "personalizedGovernmentSchemes"
                )}
              </p>
            </div>

            <div
              className="rounded-2xl border px-6 py-4 min-w-[190px]"
              style={{
                backgroundColor:
                  COLORS.panel,
                borderColor:
                  COLORS.border,
              }}
            >
              <p
                className="text-xs uppercase tracking-wider font-semibold"
                style={{
                  color: COLORS.bronze,
                }}
              >
                Recommendations
              </p>

              <p
                className="text-3xl font-bold mt-1"
                style={{
                  color:
                    COLORS.darkSage,
                }}
              >
                {schemes.length}
              </p>
            </div>
          </div>

          <div
            className="mt-7 h-px"
            style={{
              backgroundColor:
                COLORS.border,
            }}
          />
        </header>

        {/* =================================
            COMPARISON CONTROL
        ================================= */}

        {schemes.length > 0 && (
          <section
            className="rounded-3xl border p-5 md:p-6 mb-7"
            style={{
              backgroundColor:
                COLORS.white,
              borderColor:
                COLORS.border,
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em] font-semibold"
                  style={{
                    color:
                      COLORS.bronze,
                  }}
                >
                  Scheme Comparison
                </p>

                <h2
                  className="text-xl font-bold mt-1"
                  style={{
                    color:
                      COLORS.ink,
                  }}
                >
                  Compare government schemes
                </h2>

                <p
                  className="text-sm mt-1"
                  style={{
                    color:
                      COLORS.muted,
                  }}
                >
                  Select up to three schemes
                  to compare their eligibility,
                  relevance and details.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">

                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold border"
                  style={{
                    backgroundColor:
                      selectedForComparison.length >=
                      2
                        ? COLORS.lightSage
                        : COLORS.panel,
                    color:
                      selectedForComparison.length >=
                      2
                        ? COLORS.darkSage
                        : COLORS.bronze,
                    borderColor:
                      COLORS.border,
                  }}
                >
                  {
                    selectedForComparison.length
                  }
                  /{MAX_COMPARE} Selected
                </span>

                {selectedForComparison.length >
                  0 && (
                  <button
                    onClick={
                      clearComparison
                    }
                    className="px-4 py-2 rounded-xl border font-semibold text-sm"
                    style={{
                      backgroundColor:
                        "#FFFFFF",
                      borderColor:
                        COLORS.border,
                      color:
                        COLORS.ink,
                    }}
                  >
                    Clear
                  </button>
                )}

                <button
                  onClick={
                    handleCompareSelected
                  }
                  disabled={
                    selectedForComparison.length <
                      2 ||
                    comparing
                  }
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border"
                  style={{
                    backgroundColor:
                      selectedForComparison.length >=
                        2 &&
                      !comparing
                        ? COLORS.darkSage
                        : "#D8D4C7",
                    borderColor:
                      selectedForComparison.length >=
                        2 &&
                      !comparing
                        ? COLORS.darkSage
                        : "#D8D4C7",
                    color:
                      selectedForComparison.length >=
                        2 &&
                      !comparing
                        ? "#FFFFFF"
                        : "#777866",
                  }}
                >
                  {comparing
                    ? "Comparing..."
                    : "Compare Selected"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =================================
            COMPARISON ERROR
        ================================= */}

        {comparisonError && (
          <div
            className="rounded-2xl border p-4 mb-7"
            style={{
              backgroundColor:
                COLORS.lightRose,
              borderColor:
                COLORS.rose,
              color: "#704E55",
            }}
          >
            <p className="font-semibold">
              Comparison could not be completed
            </p>

            <p className="text-sm mt-1">
              {comparisonError}
            </p>
          </div>
        )}

        {/* =================================
            FILTERS
        ================================= */}

        {schemes.length > 0 && (
          <section
            className="rounded-3xl border p-5 md:p-6 mb-7"
            style={{
              backgroundColor:
                COLORS.panel,
              borderColor:
                COLORS.border,
            }}
          >
            <div className="grid md:grid-cols-3 gap-4">

              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{
                    color:
                      COLORS.bronze,
                  }}
                >
                  {t("category")}
                </label>

                <select
                  value={
                    selectedCategory
                  }
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    backgroundColor:
                      "#FFFFFF",
                    borderColor:
                      COLORS.border,
                    color:
                      COLORS.ink,
                  }}
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category ===
                        "All"
                          ? t("all")
                          : category}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{
                    color:
                      COLORS.bronze,
                  }}
                >
                  {t("occupation")}
                </label>

                <select
                  value={
                    selectedOccupation
                  }
                  onChange={(e) =>
                    setSelectedOccupation(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    backgroundColor:
                      "#FFFFFF",
                    borderColor:
                      COLORS.border,
                    color:
                      COLORS.ink,
                  }}
                >
                  {occupations.map(
                    (occupation) => (
                      <option
                        key={occupation}
                        value={occupation}
                      >
                        {occupation ===
                        "All"
                          ? t("all")
                          : occupation}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  className="block text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{
                    color:
                      COLORS.bronze,
                  }}
                >
                  {t("sortBy")}
                </label>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{
                    backgroundColor:
                      "#FFFFFF",
                    borderColor:
                      COLORS.border,
                    color:
                      COLORS.ink,
                  }}
                >
                  <option value="match">
                    {t("highestMatch")}
                  </option>

                  <option value="name">
                    {t("schemeName")}
                  </option>
                </select>
              </div>
            </div>

            {(selectedCategory !==
              "All" ||
              selectedOccupation !==
                "All") && (
              <div
                className="mt-5 pt-4 border-t text-center"
                style={{
                  borderColor:
                    COLORS.border,
                }}
              >
                <button
                  onClick={
                    resetFilters
                  }
                  className="text-sm font-semibold underline underline-offset-4"
                  style={{
                    color:
                      COLORS.darkSage,
                  }}
                >
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </section>
        )}

        {/* =================================
            RESULT COUNT
        ================================= */}

        <div className="mb-6">
          <p
            className="text-sm"
            style={{
              color: COLORS.muted,
            }}
          >
            {t("showing")}{" "}
            <span
              className="font-bold"
              style={{
                color:
                  COLORS.ink,
              }}
            >
              {sortedSchemes.length}
            </span>{" "}
            {t("of")}{" "}
            <span
              className="font-bold"
              style={{
                color:
                  COLORS.ink,
              }}
            >
              {schemes.length}
            </span>{" "}
            {t(
              "recommendedSchemes"
            )}
          </p>
        </div>

        {/* =================================
            COMPARISON TABLE
        ================================= */}

        {comparisonResults.length >
          0 && (
          <section
            className="rounded-3xl border overflow-hidden mb-10"
            style={{
              backgroundColor:
                COLORS.white,
              borderColor:
                COLORS.border,
            }}
          >
            <div
              className="p-5 md:p-6 border-b"
              style={{
                backgroundColor:
                  COLORS.darkSage,
                borderColor:
                  COLORS.darkSage,
                color: "#FFFFFF",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                    Comparison
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Scheme comparison
                  </h2>

                  <p className="text-sm mt-1 opacity-90">
                    Compare eligibility,
                    relevance and scheme
                    details side by side.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setComparisonResults(
                      []
                    )
                  }
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm"
                  style={{
                    backgroundColor:
                      "#FFFFFF",
                    color:
                      COLORS.darkSage,
                  }}
                >
                  Close Comparison
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">

                <thead>
                  <tr
                    style={{
                      backgroundColor:
                        COLORS.panel,
                    }}
                  >
                    <th
                      className="text-left p-4 border-b w-52"
                      style={{
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      Feature
                    </th>

                    {comparisonResults.map(
                      (scheme) => {
                        const personalized =
                          getPersonalizedScheme(
                            scheme._id
                          );

                        const score =
                          personalized?.recommendationScore ??
                          0;

                        return (
                          <th
                            key={
                              scheme._id
                            }
                            className="text-left p-4 border-b"
                            style={{
                              borderColor:
                                COLORS.border,
                            }}
                          >
                            <p
                              className="font-bold text-lg"
                              style={{
                                color:
                                  COLORS.darkSage,
                              }}
                            >
                              {
                                scheme.schemeName
                              }
                            </p>

                            <span
                              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border"
                              style={{
                                backgroundColor:
                                  COLORS.lightLavender,
                                color:
                                  COLORS.lavender,
                                borderColor:
                                  "#CFC8D8",
                              }}
                            >
                              {score}/100
                              {" "}
                              Recommendation
                            </span>
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>

                <tbody>

                  {/* ELIGIBILITY */}

                  <tr>
                    <td
                      className="p-4 border-b font-semibold align-top"
                      style={{
                        backgroundColor:
                          "#F6F2E7",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      Eligibility
                    </td>

                    {comparisonResults.map(
                      (scheme) => {
                        const personalized =
                          getPersonalizedScheme(
                            scheme._id
                          );

                        const eligible =
                          personalized?.eligibilityStatus ===
                          "Eligible";

                        return (
                          <td
                            key={
                              scheme._id
                            }
                            className="p-4 border-b align-top"
                            style={{
                              borderColor:
                                COLORS.border,
                            }}
                          >
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-bold border"
                              style={{
                                backgroundColor:
                                  eligible
                                    ? COLORS.lightSage
                                    : COLORS.lightRose,
                                color:
                                  eligible
                                    ? COLORS.darkSage
                                    : "#704E55",
                                borderColor:
                                  eligible
                                    ? "#B8C5AD"
                                    : COLORS.rose,
                              }}
                            >
                              {eligible
                                ? "Eligible"
                                : "Not Eligible"}
                            </span>

                            {eligible ? (
                              <p
                                className="text-xs mt-2"
                                style={{
                                  color:
                                    COLORS.darkSage,
                                }}
                              >
                                You currently meet the
                                eligibility requirements.
                              </p>
                            ) : (
                              personalized
                                ?.eligibilityIssues
                                ?.length >
                                0 && (
                                <ul
                                  className="mt-3 list-disc list-inside space-y-1"
                                  style={{
                                    color:
                                      "#704E55",
                                  }}
                                >
                                  {personalized.eligibilityIssues.map(
                                    (
                                      issue,
                                      index
                                    ) => (
                                      <li
                                        key={
                                          index
                                        }
                                        className="text-xs"
                                      >
                                        {issue}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )
                            )}
                          </td>
                        );
                      }
                    )}
                  </tr>

                  {/* RECOMMENDATION SCORE */}

                  <tr>
                    <td
                      className="p-4 border-b font-semibold"
                      style={{
                        backgroundColor:
                          "#F6F2E7",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      Recommendation Score
                    </td>

                    {comparisonResults.map(
                      (scheme) => {
                        const personalized =
                          getPersonalizedScheme(
                            scheme._id
                          );

                        const score =
                          personalized?.recommendationScore ??
                          0;

                        const maxScore =
                          Math.max(
                            ...comparisonResults.map(
                              (item) =>
                                getPersonalizedScheme(
                                  item._id
                                )
                                  ?.recommendationScore ??
                                0
                            )
                          );

                        const best =
                          score ===
                          maxScore;

                        return (
                          <td
                            key={
                              scheme._id
                            }
                            className="p-4 border-b align-top"
                            style={{
                              borderColor:
                                COLORS.border,
                            }}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="text-2xl font-bold"
                                style={{
                                  color:
                                    best
                                      ? COLORS.bronze
                                      : COLORS.ink,
                                }}
                              >
                                {score}
                              </span>

                              <span
                                className="text-sm"
                                style={{
                                  color:
                                    COLORS.muted,
                                }}
                              >
                                /100
                              </span>

                              {best && (
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-semibold"
                                  style={{
                                    backgroundColor:
                                      COLORS.lightBronze,
                                    color:
                                      COLORS.bronze,
                                  }}
                                >
                                  Best
                                </span>
                              )}
                            </div>

                            <div
                              className="mt-3 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  "#DDD8CA",
                              }}
                            >
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width:
                                    percentage(
                                      score
                                    ),
                                  backgroundColor:
                                    COLORS.bronze,
                                }}
                              />
                            </div>
                          </td>
                        );
                      }
                    )}
                  </tr>

                  {/* AI MATCH */}

                  <tr>
                    <td
                      className="p-4 border-b font-semibold"
                      style={{
                        backgroundColor:
                          "#F6F2E7",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      AI Match Score
                    </td>

                    {comparisonResults.map(
                      (scheme) => {
                        const personalized =
                          getPersonalizedScheme(
                            scheme._id
                          );

                        const score =
                          personalized?.matchScore ??
                          0;

                        return (
                          <td
                            key={
                              scheme._id
                            }
                            className="p-4 border-b"
                            style={{
                              borderColor:
                                COLORS.border,
                            }}
                          >
                            <span
                              className="font-bold text-lg"
                              style={{
                                color:
                                  COLORS.darkSage,
                              }}
                            >
                              {score}/100
                            </span>

                            <div
                              className="mt-3 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  "#DDD8CA",
                              }}
                            >
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width:
                                    percentage(
                                      score
                                    ),
                                  backgroundColor:
                                    COLORS.sage,
                                }}
                              />
                            </div>
                          </td>
                        );
                      }
                    )}
                  </tr>

                  {/* BENEFIT RELEVANCE */}

                  <tr>
                    <td
                      className="p-4 border-b font-semibold"
                      style={{
                        backgroundColor:
                          "#F6F2E7",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      Benefit Relevance
                    </td>

                    {comparisonResults.map(
                      (scheme) => {
                        const personalized =
                          getPersonalizedScheme(
                            scheme._id
                          );

                        const score =
                          personalized?.normalizedBenefitScore ??
                          personalized?.benefitRelevanceScore ??
                          0;

                        return (
                          <td
                            key={
                              scheme._id
                            }
                            className="p-4 border-b"
                            style={{
                              borderColor:
                                COLORS.border,
                            }}
                          >
                            <span
                              className="font-bold text-lg"
                              style={{
                                color:
                                  COLORS.lavender,
                              }}
                            >
                              {score}/100
                            </span>

                            <div
                              className="mt-3 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  "#D6D0DF",
                              }}
                            >
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width:
                                    percentage(
                                      score
                                    ),
                                  backgroundColor:
                                    COLORS.lavender,
                                }}
                              />
                            </div>
                          </td>
                        );
                      }
                    )}
                  </tr>

                  {/* BASIC INFORMATION */}

                  {[
                    [
                      "Category",
                      (s) =>
                        s.category ||
                        "Not specified",
                    ],
                    [
                      "Description",
                      (s) =>
                        s.description ||
                        "No description available",
                    ],
                    [
                      "State",
                      (s) =>
                        s.state ||
                        "All States",
                    ],
                    [
                      "Occupation",
                      (s) =>
                        s.occupation ||
                        "All",
                    ],
                    [
                      "Gender",
                      (s) =>
                        s.gender ||
                        "All",
                    ],
                    [
                      "Age Requirement",
                      (s) =>
                        `${s.minimumAge ?? 0} - ${
                          s.maximumAge ?? 100
                        } years`,
                    ],
                    [
                      "Maximum Income",
                      (s) =>
                        s.maximumIncome
                          ? `₹${s.maximumIncome}`
                          : "No income limit",
                    ],
                    [
                      "Land Ownership",
                      (s) =>
                        s.requiresLandOwnership
                          ? "Required"
                          : "Not Required",
                    ],
                    [
                      "Official Source",
                      (s) =>
                        s.sourceName ||
                        "Government Source",
                    ],
                  ].map(
                    ([label, getter]) => (
                      <tr key={label}>
                        <td
                          className="p-4 border-b font-semibold"
                          style={{
                            backgroundColor:
                              "#F6F2E7",
                            borderColor:
                              COLORS.border,
                          }}
                        >
                          {label}
                        </td>

                        {comparisonResults.map(
                          (scheme) => (
                            <td
                              key={`${label}-${scheme._id}`}
                              className="p-4 border-b text-sm align-top"
                              style={{
                                borderColor:
                                  COLORS.border,
                                color:
                                  COLORS.muted,
                              }}
                            >
                              {getter(
                                scheme
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}

                  {/* OFFICIAL WEBSITE */}

                  <tr>
                    <td
                      className="p-4 border-b font-semibold"
                      style={{
                        backgroundColor:
                          "#F6F2E7",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      Official Website
                    </td>

                    {comparisonResults.map(
                      (scheme) => (
                        <td
                          key={
                            scheme._id
                          }
                          className="p-4 border-b"
                          style={{
                            borderColor:
                              COLORS.border,
                          }}
                        >
                          {scheme.sourceUrl ? (
                            <a
                              href={
                                scheme.sourceUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold underline underline-offset-4"
                              style={{
                                color:
                                  COLORS.darkSage,
                              }}
                            >
                              Visit Official Website
                            </a>
                          ) : (
                            "Not available"
                          )}
                        </td>
                      )
                    )}
                  </tr>

                  {/* APPLY */}

                  <tr>
                    <td
                      className="p-4 font-semibold"
                      style={{
                        backgroundColor:
                          "#F6F2E7",
                      }}
                    >
                      Application
                    </td>

                    {comparisonResults.map(
                      (scheme) => (
                        <td
                          key={
                            scheme._id
                          }
                          className="p-4"
                        >
                          {scheme.applyLink ? (
                            <a
                              href={
                                scheme.applyLink
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 rounded-xl font-semibold text-sm"
                              style={{
                                backgroundColor:
                                  COLORS.darkSage,
                                color:
                                  "#FFFFFF",
                              }}
                            >
                              Apply Now
                            </a>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#999989",
                              }}
                            >
                              Not available
                            </span>
                          )}
                        </td>
                      )
                    )}
                  </tr>

                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =================================
            NO RESULTS
        ================================= */}

        {sortedSchemes.length === 0 ? (
          <div
            className="max-w-2xl mx-auto rounded-3xl border p-10 text-center"
            style={{
              backgroundColor:
                COLORS.white,
              borderColor:
                COLORS.border,
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.25em] font-semibold"
              style={{
                color:
                  COLORS.bronze,
              }}
            >
              No Results
            </p>

            <h2
              className="text-2xl font-bold mt-3"
              style={{
                color:
                  COLORS.ink,
              }}
            >
              {t(
                "noMatchingSchemes"
              )}
            </h2>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{
                color:
                  COLORS.muted,
              }}
            >
              {t(
                "noRecommendedSchemesMatchFilters"
              )}
            </p>

            <button
              onClick={
                resetFilters
              }
              className="mt-6 px-6 py-3 rounded-xl font-semibold"
              style={{
                backgroundColor:
                  COLORS.darkSage,
                color:
                  "#FFFFFF",
              }}
            >
              {t("clearFilters")}
            </button>
          </div>
        ) : (

          /* =================================
             RECOMMENDATION CARDS
          ================================= */

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {sortedSchemes.map(
              (scheme, index) => {
                const matchScore =
                  scheme.matchScore || 0;

                const recommendationScore =
                  scheme.recommendationScore ||
                  0;

                const benefitScore =
                  scheme.normalizedBenefitScore ??
                  scheme.benefitRelevanceScore ??
                  0;

                const reasons =
                  scheme.reasons || [];

                const benefitReasons =
                  scheme.benefitReasons || [];

                const explanation =
                  scheme.recommendationExplanation ||
                  "This recommendation is based on your profile, eligibility and benefit relevance.";

                const topRecommendation =
                  index === 0 &&
                  recommendationScore >= 80 &&
                  scheme.eligibilityStatus ===
                    "Eligible";

                const selected =
                  selectedForComparison.includes(
                    scheme._id
                  );

                return (
                  <article
                    key={
                      scheme._id
                    }
                    className="rounded-3xl border p-5 md:p-6 transition-all"
                    style={{
                      backgroundColor:
                        COLORS.white,

                      borderColor:
                        selected
                          ? COLORS.lavender
                          : topRecommendation
                          ? COLORS.bronze
                          : COLORS.border,

                      boxShadow:
                        selected
                          ? "0 12px 32px rgba(142,136,163,0.14)"
                          : topRecommendation
                          ? "0 12px 32px rgba(129,120,90,0.12)"
                          : "0 6px 20px rgba(62,68,53,0.05)",
                    }}
                  >

                    {/* COMPARISON CHECKBOX */}

                    <div
                      className="flex items-center justify-between gap-3 rounded-2xl border p-3 mb-5"
                      style={{
                        backgroundColor:
                          "#F4F0E4",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          onChange={() =>
                            toggleComparison(
                              scheme._id
                            )
                          }
                          className="w-4 h-4 cursor-pointer"
                          style={{
                            accentColor:
                              COLORS.darkSage,
                          }}
                        />

                        <span
                          className="text-sm font-semibold"
                          style={{
                            color:
                              COLORS.ink,
                          }}
                        >
                          Compare this scheme
                        </span>
                      </label>

                      {selected && (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{
                            backgroundColor:
                              COLORS.lightLavender,
                            color:
                              COLORS.lavender,
                          }}
                        >
                          Selected
                        </span>
                      )}
                    </div>

                    {/* TOP RECOMMENDATION */}

                    {topRecommendation && (
                      <div className="mb-4">
                        <span
                          className="inline-block px-3 py-1.5 rounded-full text-xs font-bold border"
                          style={{
                            backgroundColor:
                              COLORS.lightBronze,
                            color:
                              COLORS.bronze,
                            borderColor:
                              "#D8CEAA",
                          }}
                        >
                          {t(
                            "topRecommendation"
                          )}
                        </span>
                      </div>
                    )}

                    {/* FINAL SCORE */}

                    <div
                      className="rounded-2xl p-4 mb-5"
                      style={{
                        backgroundColor:
                          COLORS.darkSage,
                        color:
                          "#FFFFFF",
                      }}
                    >
                      <div className="flex justify-between items-center gap-4">

                        <div>
                          <p className="text-sm font-semibold">
                            Final Recommendation
                          </p>

                          <p className="text-xs opacity-75 mt-1">
                            Overall suitability
                            for you
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-3xl font-bold">
                            {
                              recommendationScore
                            }
                          </p>

                          <p className="text-xs opacity-75">
                            /100
                          </p>
                        </div>
                      </div>

                      <div
                        className="mt-4 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            "rgba(255,255,255,0.2)",
                        }}
                      >
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width:
                              percentage(
                                recommendationScore
                              ),
                            backgroundColor:
                              "#FFFFFF",
                          }}
                        />
                      </div>
                    </div>

                    {/* MATCH */}

                    <div className="flex justify-between items-center mb-4">
                      <span
                        className="text-xs uppercase tracking-wider font-semibold"
                        style={{
                          color:
                            COLORS.bronze,
                        }}
                      >
                        {t(
                          "aiMatch"
                        )}
                      </span>

                      <span
                        className="px-3 py-1 rounded-full text-sm font-bold border"
                        style={{
                          backgroundColor:
                            COLORS.lightSage,
                          color:
                            COLORS.darkSage,
                          borderColor:
                            "#B8C5AD",
                        }}
                      >
                        {matchScore}%{" "}
                        {t("match")}
                      </span>
                    </div>

                    {/* EXPLANATION */}

                    <div
                      className="rounded-2xl border p-4 mb-5"
                      style={{
                        backgroundColor:
                          COLORS.lightBronze,
                        borderColor:
                          "#D8CEAA",
                      }}
                    >
                      <p
                        className="text-sm font-bold"
                        style={{
                          color:
                            COLORS.bronze,
                        }}
                      >
                        Why this recommendation?
                      </p>

                      <p
                        className="text-sm mt-2 leading-relaxed"
                        style={{
                          color:
                            "#68624E",
                        }}
                      >
                        {explanation}
                      </p>
                    </div>

                    {/* TITLE */}

                    <h2
                      className="text-2xl font-bold leading-tight"
                      style={{
                        color:
                          COLORS.ink,
                      }}
                    >
                      {scheme.schemeName}
                    </h2>

                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{
                        color:
                          COLORS.lavender,
                      }}
                    >
                      {scheme.category ||
                        t(
                          "governmentScheme"
                        )}
                    </p>

                    <p
                      className="mt-4 text-sm leading-relaxed"
                      style={{
                        color:
                          COLORS.muted,
                      }}
                    >
                      {scheme.description ||
                        t(
                          "noDescriptionAvailable"
                        )}
                    </p>

                    {/* FRESHNESS */}

                    {scheme.updatedAt && (
                      <div
                        className="mt-5 rounded-2xl border p-4"
                        style={{
                          backgroundColor:
                            scheme.freshnessStatus ===
                            "Recently Updated"
                              ? COLORS.lightSage
                              : scheme.freshnessStatus ===
                                "Needs Review"
                              ? COLORS.lightBronze
                              : COLORS.lightRose,

                          borderColor:
                            scheme.freshnessStatus ===
                            "Recently Updated"
                              ? "#B8C5AD"
                              : scheme.freshnessStatus ===
                                "Needs Review"
                              ? "#D8CEAA"
                              : COLORS.rose,
                        }}
                      >
                        <p
                          className="font-bold text-sm"
                          style={{
                            color:
                              scheme.freshnessStatus ===
                              "Recently Updated"
                                ? COLORS.darkSage
                                : scheme.freshnessStatus ===
                                  "Needs Review"
                                ? COLORS.bronze
                                : "#704E55",
                          }}
                        >
                          {scheme.freshnessStatus ===
                          "Recently Updated"
                            ? "Recently Updated"
                            : scheme.freshnessStatus ===
                              "Needs Review"
                            ? "Needs Review"
                            : "Outdated"}
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{
                            color:
                              COLORS.muted,
                          }}
                        >
                          {scheme.freshnessDays ===
                          0
                            ? "Updated today"
                            : scheme.freshnessDays !==
                              undefined
                            ? `Updated ${scheme.freshnessDays} days ago`
                            : "Update date available"}
                        </p>
                      </div>
                    )}

                    {/* OFFICIAL SOURCE */}

                    {scheme.sourceUrl && (
                      <div
                        className="mt-5 rounded-2xl border p-4"
                        style={{
                          backgroundColor:
                            COLORS.lightLavender,
                          borderColor:
                            "#CFC8D8",
                        }}
                      >
                        <p
                          className="font-bold text-sm"
                          style={{
                            color:
                              COLORS.lavender,
                          }}
                        >
                          Official Government Source
                        </p>

                        {scheme.sourceName && (
                          <p
                            className="text-sm mt-2"
                            style={{
                              color:
                                COLORS.ink,
                            }}
                          >
                            <b>Source:</b>{" "}
                            {
                              scheme.sourceName
                            }
                          </p>
                        )}

                        <a
                          href={
                            scheme.sourceUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-sm font-bold underline underline-offset-4 break-all"
                          style={{
                            color:
                              COLORS.lavender,
                          }}
                        >
                          Visit Official Website
                        </a>
                      </div>
                    )}

                    {/* AI MATCH BAR */}

                    <div className="mt-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">
                          {t(
                            "aiMatchScore"
                          )}
                        </span>

                        <span
                          className="font-bold"
                          style={{
                            color:
                              COLORS.darkSage,
                          }}
                        >
                          {matchScore}/100
                        </span>
                      </div>

                      <div
                        className="w-full h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            "#DDD8CA",
                        }}
                      >
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width:
                              percentage(
                                matchScore
                              ),
                            backgroundColor:
                              COLORS.sage,
                          }}
                        />
                      </div>
                    </div>

                    {/* BENEFIT RELEVANCE */}

                    <div
                      className="mt-5 rounded-2xl border p-4"
                      style={{
                        backgroundColor:
                          COLORS.lightLavender,
                        borderColor:
                          "#CFC8D8",
                      }}
                    >
                      <div className="flex justify-between items-center gap-3 mb-3">

                        <div>
                          <h3
                            className="font-bold"
                            style={{
                              color:
                                COLORS.lavender,
                            }}
                          >
                            Benefit Relevance
                          </h3>

                          <p
                            className="text-xs mt-1"
                            style={{
                              color:
                                "#716B78",
                            }}
                          >
                            How useful this scheme may be for you
                          </p>
                        </div>

                        <span
                          className="px-3 py-1 rounded-full font-bold text-sm"
                          style={{
                            backgroundColor:
                              "#F4F1F7",
                            color:
                              COLORS.lavender,
                          }}
                        >
                          {benefitScore}/100
                        </span>
                      </div>

                      <div
                        className="w-full h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            "#D6D0DF",
                        }}
                      >
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width:
                              percentage(
                                benefitScore
                              ),
                            backgroundColor:
                              COLORS.lavender,
                          }}
                        />
                      </div>

                      {benefitReasons.length >
                      0 ? (
                        <div className="mt-4">
                          <p
                            className="font-semibold text-sm mb-2"
                            style={{
                              color:
                                COLORS.lavender,
                            }}
                          >
                            Why this may benefit you:
                          </p>

                          <ul className="list-disc list-inside space-y-2">
                            {benefitReasons.map(
                              (
                                reason,
                                reasonIndex
                              ) => (
                                <li
                                  key={
                                    reasonIndex
                                  }
                                  className="text-sm leading-relaxed"
                                  style={{
                                    color:
                                      "#5F6060",
                                  }}
                                >
                                  {reason}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p
                          className="text-sm mt-3"
                          style={{
                            color:
                              "#74717A",
                          }}
                        >
                          Benefit relevance information is currently limited for your profile.
                        </p>
                      )}
                    </div>

                    {/* WHY RECOMMENDED */}

                    <div
                      className="mt-5 rounded-2xl border p-4"
                      style={{
                        backgroundColor:
                          "#F4F0E4",
                        borderColor:
                          COLORS.border,
                      }}
                    >
                      <h3
                        className="font-bold mb-3"
                        style={{
                          color:
                            COLORS.darkSage,
                        }}
                      >
                        {t(
                          "whyRecommended"
                        )}
                      </h3>

                      {reasons.length ===
                      0 ? (
                        <p
                          className="text-sm"
                          style={{
                            color:
                              COLORS.muted,
                          }}
                        >
                          {t(
                            "schemeMatchesEligibilityProfile"
                          )}
                        </p>
                      ) : (
                        <ul className="list-disc list-inside space-y-2">
                          {reasons.map(
                            (
                              reason,
                              reasonIndex
                            ) => (
                              <li
                                key={
                                  reasonIndex
                                }
                                className="text-sm leading-relaxed"
                                style={{
                                  color:
                                    COLORS.muted,
                                }}
                              >
                                {reason}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>

                    {/* ELIGIBILITY */}

                    <div className="mt-5">

                      {scheme.eligibilityStatus ===
                      "Eligible" ? (
                        <div
                          className="rounded-2xl border p-4"
                          style={{
                            backgroundColor:
                              COLORS.lightSage,
                            borderColor:
                              "#B8C5AD",
                          }}
                        >
                          <p
                            className="font-bold"
                            style={{
                              color:
                                COLORS.darkSage,
                            }}
                          >
                            Eligible
                          </p>

                          <p
                            className="text-sm mt-1"
                            style={{
                              color:
                                "#5F6B5B",
                            }}
                          >
                            You currently meet the eligibility requirements for this scheme.
                          </p>
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl border p-4"
                          style={{
                            backgroundColor:
                              COLORS.lightRose,
                            borderColor:
                              COLORS.rose,
                          }}
                        >
                          <p
                            className="font-bold"
                            style={{
                              color:
                                "#704E55",
                            }}
                          >
                            Not Eligible
                          </p>

                          <p
                            className="text-sm mt-1"
                            style={{
                              color:
                                "#805D63",
                            }}
                          >
                            You do not currently meet all eligibility requirements.
                          </p>

                          {scheme.eligibilityIssues?.length >
                            0 && (
                            <div className="mt-3">
                              <p
                                className="font-semibold text-sm mb-2"
                                style={{
                                  color:
                                    "#704E55",
                                }}
                              >
                                Why you are not eligible:
                              </p>

                              <ul className="list-disc list-inside space-y-2">
                                {scheme.eligibilityIssues.map(
                                  (
                                    issue,
                                    issueIndex
                                  ) => (
                                    <li
                                      key={
                                        issueIndex
                                      }
                                      className="text-sm"
                                      style={{
                                        color:
                                          "#805D63",
                                      }}
                                    >
                                      {issue}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ELIGIBILITY INFORMATION */}

                    <div
                      className="mt-5 pt-5 border-t space-y-2 text-sm"
                      style={{
                        borderColor:
                          COLORS.border,
                        color:
                          COLORS.muted,
                      }}
                    >
                      <p>
                        <b>
                          {t("state")}:
                        </b>{" "}
                        {scheme.state ||
                          t(
                            "allStates"
                          )}
                      </p>

                      <p>
                        <b>
                          {t(
                            "occupation"
                          )}
                          :
                        </b>{" "}
                        {scheme.occupation ||
                          t("all")}
                      </p>

                      <p>
                        <b>
                          {t("gender")}:
                        </b>{" "}
                        {scheme.gender ||
                          t("all")}
                      </p>

                      <p>
                        <b>
                          {t("age")}:
                        </b>{" "}
                        {scheme.minimumAge ??
                          0}{" "}
                        -{" "}
                        {scheme.maximumAge ??
                          100}
                      </p>

                      <p>
                        <b>
                          {t(
                            "maximumIncome"
                          )}
                          :
                        </b>{" "}
                        {scheme.maximumIncome
                          ? `₹${scheme.maximumIncome}`
                          : t(
                              "noIncomeLimit"
                            )}
                      </p>
                    </div>

                    {/* VIEW DETAILS */}

                    <Link
                      to={`/scheme/${scheme._id}`}
                      className="block mt-6"
                    >
                      <span
                        className="block w-full text-center px-5 py-3 rounded-xl font-semibold text-sm"
                        style={{
                          backgroundColor:
                            COLORS.darkSage,
                          color:
                            "#FFFFFF",
                        }}
                      >
                        {t(
                          "viewSchemeDetails"
                        )}
                      </span>
                    </Link>

                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;