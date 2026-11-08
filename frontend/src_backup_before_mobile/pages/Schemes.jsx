import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../i18n/LanguageContext";
import "./Schemes.css";

function Schemes() {
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [governmentLevel, setGovernmentLevel] = useState("All");
  const [state, setState] = useState("All");
  const [beneficiary, setBeneficiary] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/schemes/all"
      );

      setSchemes(res.data.schemes || []);
    } catch (error) {
      console.error("FETCH SCHEMES ERROR:", error);
      alert("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NORMALIZE VALUE
  // =====================================================

  const normalize = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase();
  };

  // =====================================================
  // CATEGORY LIST
  // =====================================================

  const categories = useMemo(() => {
    const values = schemes
      .map((scheme) => scheme.category)
      .filter((item) => item && item !== "All");

    return [
      "All",
      ...Array.from(new Set(values)).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [schemes]);

  // =====================================================
  // GOVERNMENT LEVEL LIST
  // =====================================================

  const governmentLevels = useMemo(() => {
    const values = schemes
      .map((scheme) => scheme.governmentLevel)
      .filter(Boolean);

    const unique = Array.from(
      new Set(
        values.map((item) =>
          String(item).trim()
        )
      )
    );

    return [
      "All",
      ...unique.sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [schemes]);

  // =====================================================
  // STATE LIST
  // =====================================================

  const states = useMemo(() => {
    const values = schemes
      .map((scheme) => scheme.state)
      .filter(
        (item) =>
          item &&
          normalize(item) !== "all"
      );

    return [
      "All",
      ...Array.from(
        new Set(values)
      ).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [schemes]);

  // =====================================================
  // BENEFICIARY LIST
  // =====================================================

  const beneficiaries = useMemo(() => {
    const values = schemes
      .map((scheme) => scheme.occupation)
      .filter(
        (item) =>
          item &&
          normalize(item) !== "all"
      );

    return [
      "All",
      ...Array.from(
        new Set(values)
      ).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [schemes]);

  // =====================================================
  // SEARCH TEXT
  // =====================================================

  const searchText = search
    .trim()
    .toLowerCase();

  // =====================================================
  // FILTER SCHEMES
  // =====================================================

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesSearch =
        !searchText ||
        normalize(scheme.schemeName).includes(
          searchText
        ) ||
        normalize(scheme.description).includes(
          searchText
        ) ||
        normalize(scheme.category).includes(
          searchText
        ) ||
        normalize(scheme.department).includes(
          searchText
        ) ||
        normalize(scheme.occupation).includes(
          searchText
        ) ||
        normalize(scheme.state).includes(
          searchText
        );

      const matchesCategory =
        category === "All" ||
        scheme.category === category;

      const matchesGovernmentLevel =
        governmentLevel === "All" ||
        normalize(scheme.governmentLevel) ===
          normalize(governmentLevel);

      const matchesState =
        state === "All" ||
        normalize(scheme.state) ===
          normalize(state) ||
        normalize(scheme.state) === "all";

      const matchesBeneficiary =
        beneficiary === "All" ||
        normalize(scheme.occupation) ===
          normalize(beneficiary) ||
        normalize(scheme.occupation) === "all";

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGovernmentLevel &&
        matchesState &&
        matchesBeneficiary
      );
    });
  }, [
    schemes,
    searchText,
    category,
    governmentLevel,
    state,
    beneficiary,
  ]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setGovernmentLevel("All");
    setState("All");
    setBeneficiary("All");
  };

  const hasActiveFilters =
    search ||
    category !== "All" ||
    governmentLevel !== "All" ||
    state !== "All" ||
    beneficiary !== "All";

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="ss-schemes-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="ss-schemes-header">

        <div className="ss-eyebrow">
          SARVASETU • PUBLIC BENEFITS
        </div>

        <h1>
          {t("governmentSchemes")}
        </h1>

        <p>
          {t("findGovernmentSchemes")}
        </p>

      </header>

      {/* =================================================
          DISCOVERY TOOLBAR
      ================================================= */}

      <section className="ss-discovery-panel">

        {/* SEARCH */}

        <div className="ss-search-wrap">

          <input
            type="text"
            placeholder={t(
              "searchSchemesBySchemeCategoryDepartment"
            )}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="ss-clear-search"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

        {/* FILTERS */}

        <div className="ss-filter-grid">

          {/* CATEGORY */}

          <div className="ss-filter-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? t("all")
                    : item}
                </option>
              ))}
            </select>

          </div>

          {/* GOVERNMENT LEVEL */}

          <div className="ss-filter-group">

            <label>
              Government Level
            </label>

            <select
              value={governmentLevel}
              onChange={(e) =>
                setGovernmentLevel(
                  e.target.value
                )
              }
            >
              {governmentLevels.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? t("all")
                      : item}
                  </option>
                )
              )}
            </select>

          </div>

          {/* STATE */}

          <div className="ss-filter-group">

            <label>
              State
            </label>

            <select
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
            >
              {states.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? t("all")
                    : item}
                </option>
              ))}
            </select>

          </div>

          {/* BENEFICIARY */}

          <div className="ss-filter-group">

            <label>
              Beneficiary
            </label>

            <select
              value={beneficiary}
              onChange={(e) =>
                setBeneficiary(
                  e.target.value
                )
              }
            >
              {beneficiaries.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? t("all")
                      : item}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

        {/* FILTER ACTION */}

        {hasActiveFilters && (
          <div className="ss-filter-actions">

            <button
              type="button"
              className="ss-clear-btn"
              onClick={clearFilters}
            >
              {t("clear")}
            </button>

          </div>
        )}

      </section>

      {/* =================================================
          RESULT META
      ================================================= */}

      <section className="ss-scheme-meta">

        <div>

          {!loading && (
            <>
              <strong>
                {filteredSchemes.length}
              </strong>

              <span className="ss-result-label">
                {filteredSchemes.length === 1
                  ? ` ${t("scheme")}`
                  : ` ${t("schemes")}`}
                {" "}
                {t("found")}
              </span>
            </>
          )}

        </div>

        <p>
          {t("findSchemesUsefulForYou")}
        </p>

      </section>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="ss-empty-card">

          <div className="ss-loader-line">
            Loading schemes
          </div>

          <h2>
            {t("loadingSchemes")}
          </h2>

        </div>

      ) : filteredSchemes.length === 0 ? (

        /* =================================================
           NO RESULTS
        ================================================= */

        <div className="ss-empty-card">

          <div className="ss-empty-mark">
            No results
          </div>

          <h2>
            {t("noMatchingSchemes")}
          </h2>

          <p>
            {t(
              "tryAnotherSearchOrCategory"
            )}
          </p>

          <button
            type="button"
            className="ss-primary-btn"
            onClick={clearFilters}
          >
            {t("showAllSchemes")}
          </button>

        </div>

      ) : (

        /* =================================================
           SCHEME GRID
        ================================================= */

        <div className="ss-scheme-grid">

          {filteredSchemes.map(
            (scheme) => (

              <article
                className="ss-scheme-card"
                key={scheme._id}
              >

                {/* CARD HEADER */}

                <div className="ss-card-top">

                  <span className="ss-category-pill">
                    {scheme.category ||
                      t("other")}
                  </span>

                  <span className="ss-level-label">
                    {scheme.governmentLevel ||
                      "Government Scheme"}
                  </span>

                </div>

                {/* SCHEME NAME */}

                <h2>
                  {scheme.schemeName}
                </h2>

                {/* DEPARTMENT */}

                <div className="ss-detail-row">

                  <span>
                    Department
                  </span>

                  <strong>
                    {scheme.department ||
                      t("notSpecified")}
                  </strong>

                </div>

                {/* STATE / BENEFICIARY */}

                <div className="ss-card-facts">

                  <div>

                    <span>
                      State
                    </span>

                    <strong>
                      {scheme.state &&
                      normalize(
                        scheme.state
                      ) !== "all"
                        ? scheme.state
                        : "All States"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Beneficiary
                    </span>

                    <strong>
                      {scheme.occupation &&
                      normalize(
                        scheme.occupation
                      ) !== "all"
                        ? scheme.occupation
                        : "All"}
                    </strong>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="ss-description">

                  {scheme.description ||
                    t(
                      "noDescriptionAvailable"
                    )}

                </p>

                {/* STATUS */}

                <div className="ss-status-stack">

                  {/* FRESHNESS */}

                  <div
                    className={`ss-status ss-freshness ${
                      scheme.freshnessStatus ===
                      "Recently Updated"
                        ? "ss-positive"
                        : scheme.freshnessStatus ===
                          "Needs Review"
                        ? "ss-warning"
                        : "ss-danger"
                    }`}
                  >

                    <div className="ss-status-title">

                      {scheme.freshnessStatus ===
                      "Recently Updated"
                        ? "Recently Updated"
                        : scheme.freshnessStatus ===
                          "Needs Review"
                        ? "Needs Review"
                        : "Outdated"}

                    </div>

                    <div className="ss-status-subtitle">

                      {scheme.freshnessDays ===
                      0
                        ? "Updated today"
                        : `Updated ${scheme.freshnessDays} days ago`}

                    </div>

                  </div>

                  {/* DEADLINE */}

                  <div
                    className={`ss-status ${
                      scheme.deadlineStatus ===
                      "Open"
                        ? "ss-open"
                        : scheme.deadlineStatus ===
                          "Closing Soon"
                        ? "ss-warning"
                        : scheme.deadlineStatus ===
                          "Expired"
                        ? "ss-danger"
                        : "ss-neutral"
                    }`}
                  >

                    <div className="ss-status-title">

                      {scheme.deadlineStatus ===
                      "Open"
                        ? "Application Open"
                        : scheme.deadlineStatus ===
                          "Closing Soon"
                        ? "Closing Soon"
                        : scheme.deadlineStatus ===
                          "Expired"
                        ? "Application Closed"
                        : "No Fixed Deadline"}

                    </div>

                    {scheme.deadline && (
                      <>

                        <div className="ss-status-subtitle">

                          Deadline:{" "}

                          {formatDate(
                            scheme.deadline
                          )}

                        </div>

                        {scheme.daysRemaining >=
                          0 && (
                          <div className="ss-days">

                            {
                              scheme.daysRemaining
                            }{" "}
                            days remaining

                          </div>
                        )}

                        {scheme.daysRemaining <
                          0 && (
                          <div className="ss-days ss-days-danger">

                            Application deadline
                            has passed

                          </div>
                        )}

                      </>
                    )}

                  </div>

                </div>

                {/* VIEW DETAILS */}

                <Link
                  to={`/scheme/${scheme._id}`}
                  className="ss-view-link"
                >

                  <button
                    type="button"
                    className="ss-view-btn"
                  >
                    {t("viewDetails")}
                  </button>

                </Link>

              </article>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Schemes;