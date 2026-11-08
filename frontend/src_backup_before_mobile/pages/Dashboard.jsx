import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import "./Dashboard.css";

/* =========================================================
   SARVASETU FEATURE SLIDER
========================================================= */

const sarvasetuSlides = [
  {
    key: "discover",
    className: "slider-discover",
  },
  {
    key: "understand",
    className: "slider-understand",
  },
  {
    key: "prepare",
    className: "slider-prepare",
  },
  {
    key: "access",
    className: "slider-access",
  },
  {
    key: "stayUpdated",
    className: "slider-updated",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [stateFilter, setStateFilter] =
    useState("All");

  const [occupationFilter, setOccupationFilter] =
    useState("All");

  const [beneficiaryFilter, setBeneficiaryFilter] =
    useState("All");

  const [exploreFilter, setExploreFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [currentSlide, setCurrentSlide] =
    useState(0);

  /* =========================================================
     AUTOMATIC SLIDER
     5 SECONDS
     NO DOTS
     NO PREVIOUS / NEXT BUTTONS
  ========================================================= */

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(
        (prevSlide) =>
          (prevSlide + 1) %
          sarvasetuSlides.length
      );
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  /* =========================================================
     FETCH SCHEMES
  ========================================================= */

  const fetchSchemes = async () => {
    try {
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/schemes/all"
      );

      console.log(
        "========== SARVASETU SCHEME DATA =========="
      );

      console.log(
        "Full response:",
        res.data
      );

      console.log(
        "Schemes:",
        res.data?.schemes
      );

      console.log(
        "Total schemes:",
        res.data?.schemes?.length
      );

      console.log(
        "============================================"
      );

      const schemeData =
        Array.isArray(
          res.data?.schemes
        )
          ? res.data.schemes
          : [];

      setSchemes(schemeData);

      if (schemeData.length === 0) {
        setError(
          t(
            "noSchemesCurrentlyAvailable"
          )
        );
      }
    } catch (err) {
      console.error(
        "FETCH SCHEMES ERROR:",
        err
      );

      setSchemes([]);

      setError(
        err?.response?.data?.message ||
          t("failedToLoadSchemes")
      );
    }
  };

  /* =========================================================
     FETCH GOVERNMENT UPDATES
  ========================================================= */

  const fetchUpdates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/updates/latest"
      );

      setUpdates(
        Array.isArray(
          res.data?.updates
        )
          ? res.data.updates
          : []
      );
    } catch (err) {
      console.error(
        "FETCH UPDATES ERROR:",
        err
      );

      setUpdates([]);
    }
  };

  /* =========================================================
     FETCH NOTIFICATIONS
  ========================================================= */

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/all"
      );

      setNotifications(
        Array.isArray(
          res.data?.notifications
        )
          ? res.data.notifications
          : []
      );
    } catch (err) {
      console.error(
        "FETCH NOTIFICATIONS ERROR:",
        err
      );

      setNotifications([]);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const loadDashboard =
      async () => {
        setLoading(true);

        await Promise.all([
          fetchSchemes(),
          fetchUpdates(),
          fetchNotifications(),
        ]);

        setLoading(false);
      };

    loadDashboard();
  }, []);

  /* =========================================================
     BENEFICIARY CATEGORIES
  ========================================================= */

  const beneficiaryCategories = [
    {
      key: "Student",
      label: t("student"),
      description: t(
        "studentBenefitsDescription"
      ),
    },
    {
      key: "Farmer",
      label: t("farmer"),
      description: t(
        "farmerBenefitsDescription"
      ),
    },
    {
      key: "Women",
      label: t("women"),
      description: t(
        "womenBenefitsDescription"
      ),
    },
    {
      key: "Job Seeker",
      label: t("jobSeeker"),
      description: t(
        "jobSeekerBenefitsDescription"
      ),
    },
    {
      key: "Senior Citizen",
      label: t("seniorCitizen"),
      description: t(
        "seniorCitizenBenefitsDescription"
      ),
    },
    {
      key: "Person with Disability",
      label: t(
        "personWithDisability"
      ),
      description: t(
        "disabilityBenefitsDescription"
      ),
    },
    {
      key: "Entrepreneur",
      label: t("entrepreneur"),
      description: t(
        "entrepreneurBenefitsDescription"
      ),
    },
    {
      key: "Artisan",
      label: t("artisan"),
      description: t(
        "artisanBenefitsDescription"
      ),
    },
  ];

  /* =========================================================
     NORMALIZE VALUES
  ========================================================= */

  const normalize = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase();
  };

  /* =========================================================
     BENEFICIARY MATCHING
  ========================================================= */

  const matchesBeneficiaryCategory = (
    scheme,
    beneficiary
  ) => {
    if (
      !scheme ||
      beneficiary === "All"
    ) {
      return false;
    }

    const occupation = normalize(
      scheme.occupation
    );

    const gender = normalize(
      scheme.gender
    );

    const category = normalize(
      scheme.category
    );

    const department = normalize(
      scheme.department
    );

    if (beneficiary === "Student") {
      return (
        occupation === "student" ||
        scheme.requiresStudent ===
          true ||
        (Array.isArray(
          scheme.educationLevels
        ) &&
          scheme.educationLevels
            .length > 0)
      );
    }

    if (beneficiary === "Farmer") {
      return (
        occupation === "farmer" ||
        scheme.requiresFarmer ===
          true ||
        scheme.requiresLandOwnership ===
          true
      );
    }

    if (beneficiary === "Women") {
      return (
        gender === "female" ||
        occupation === "women" ||
        scheme.requiresWidow ===
          true ||
        scheme.requiresSingleWoman ===
          true ||
        category.includes("women") ||
        department.includes("women")
      );
    }

    if (
      beneficiary ===
      "Job Seeker"
    ) {
      return (
        occupation ===
          "job seeker" ||
        occupation ===
          "unemployed" ||
        occupation ===
          "employee" ||
        (Array.isArray(
          scheme.employmentStatuses
        ) &&
          scheme.employmentStatuses
            .length > 0)
      );
    }

    if (
      beneficiary ===
      "Senior Citizen"
    ) {
      return (
        occupation ===
          "senior citizen" ||
        scheme.requiresSeniorCitizen ===
          true
      );
    }

    if (
      beneficiary ===
      "Person with Disability"
    ) {
      return (
        occupation ===
          "person with disability" ||
        occupation === "disabled" ||
        scheme.requiresDisability ===
          true ||
        category.includes(
          "disability"
        )
      );
    }

    if (
      beneficiary ===
      "Entrepreneur"
    ) {
      return (
        occupation ===
          "entrepreneur" ||
        occupation ===
          "business owner" ||
        occupation ===
          "self employed" ||
        category.includes(
          "entrepreneur"
        ) ||
        category.includes(
          "business"
        ) ||
        category.includes(
          "startup"
        )
      );
    }

    if (
      beneficiary ===
      "Artisan"
    ) {
      return (
        occupation === "artisan" ||
        occupation === "weaver" ||
        scheme.requiresArtisan ===
          true ||
        category.includes("artisan") ||
        category.includes(
          "handicraft"
        ) ||
        category.includes("weaver")
      );
    }

    return false;
  };

  /* =========================================================
     REAL BENEFICIARY COUNT
  ========================================================= */

  const getBeneficiaryCount = (
    beneficiary
  ) => {
    return schemes.filter(
      (scheme) =>
        matchesBeneficiaryCategory(
          scheme,
          beneficiary
        )
    ).length;
  };

  /* =========================================================
     BENEFICIARY FILTERED SCHEMES
  ========================================================= */

  const beneficiaryFilteredSchemes =
    beneficiaryFilter === "All"
      ? []
      : schemes.filter(
          (scheme) =>
            matchesBeneficiaryCategory(
              scheme,
              beneficiaryFilter
            )
        );

  /* =========================================================
     REAL GOVERNMENT LEVEL COUNTS
  ========================================================= */

  const centralGovernmentCount =
    useMemo(() => {
      return schemes.filter(
        (scheme) =>
          normalize(
            scheme.governmentLevel
          ) === "central"
      ).length;
    }, [schemes]);

  const karnatakaGovernmentCount =
    useMemo(() => {
      return schemes.filter(
        (scheme) =>
          normalize(
            scheme.governmentLevel
          ) === "state" &&
          normalize(
            scheme.state
          ) === "karnataka"
      ).length;
    }, [schemes]);

  const totalGovernmentSchemes =
    schemes.length;

  /* =========================================================
     EXPLORE PUBLIC BENEFITS
  ========================================================= */

  const exploreCards = [
    {
      key: "Central",

      label: t(
        "centralGovernmentSchemes"
      ),

      count:
        centralGovernmentCount,

      description: t(
        "centralGovernmentSchemesDescription"
      ),

      className:
        "service-central",
    },

    {
      key: "Karnataka",

      label: t(
        "karnatakaGovernmentSchemes"
      ),

      count:
        karnatakaGovernmentCount,

      description: t(
        "karnatakaGovernmentSchemesDescription"
      ),

      className:
        "service-karnataka",
    },

    {
      key: "All",

      label: t(
        "allGovernmentSchemes"
      ),

      count:
        totalGovernmentSchemes,

      description: t(
        "allGovernmentSchemesDescription"
      ),

      className:
        "service-all",
    },
  ];

  /* =========================================================
     EXPLORE FILTERED SCHEMES
  ========================================================= */

  const exploreFilteredSchemes =
    useMemo(() => {
      if (
        exploreFilter ===
        "Central"
      ) {
        return schemes.filter(
          (scheme) =>
            normalize(
              scheme.governmentLevel
            ) === "central"
        );
      }

      if (
        exploreFilter ===
        "Karnataka"
      ) {
        return schemes.filter(
          (scheme) =>
            normalize(
              scheme.governmentLevel
            ) === "state" &&
            normalize(
              scheme.state
            ) === "karnataka"
        );
      }

      if (
        exploreFilter ===
        "All"
      ) {
        return schemes;
      }

      return [];
    }, [
      schemes,
      exploreFilter,
    ]);

  /* =========================================================
     NORMAL DASHBOARD FILTER
  ========================================================= */

  const filteredSchemes =
    useMemo(() => {
      return schemes.filter(
        (scheme) => {
          const searchText =
            normalize(search);

          const schemeName =
            normalize(
              scheme.schemeName
            );

          const description =
            normalize(
              scheme.description
            );

          const department =
            normalize(
              scheme.department
            );

          const category =
            normalize(
              scheme.category
            );

          const matchesSearch =
            !searchText ||
            schemeName.includes(
              searchText
            ) ||
            description.includes(
              searchText
            ) ||
            department.includes(
              searchText
            ) ||
            category.includes(
              searchText
            );

          const matchesCategory =
            categoryFilter ===
              "All" ||
            scheme.category ===
              categoryFilter;

          const matchesDepartment =
            departmentFilter ===
              "All" ||
            scheme.department ===
              departmentFilter;

          const matchesState =
            stateFilter === "All" ||
            scheme.state ===
              stateFilter ||
            scheme.state === "All";

          const matchesOccupation =
            occupationFilter ===
              "All" ||
            scheme.occupation ===
              occupationFilter ||
            scheme.occupation ===
              "All";

          return (
            matchesSearch &&
            matchesCategory &&
            matchesDepartment &&
            matchesState &&
            matchesOccupation
          );
        }
      );
    }, [
      schemes,
      search,
      categoryFilter,
      departmentFilter,
      stateFilter,
      occupationFilter,
    ]);

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const categories = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map(
            (scheme) =>
              scheme.category
          )
          .filter(Boolean)
      ),
    ];
  }, [schemes]);

  const departments = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map(
            (scheme) =>
              scheme.department
          )
          .filter(Boolean)
      ),
    ];
  }, [schemes]);

  const states = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map(
            (scheme) =>
              scheme.state
          )
          .filter(
            (state) =>
              state &&
              normalize(state) !==
                "all"
          )
      ),
    ];
  }, [schemes]);

  const occupations = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map(
            (scheme) =>
              scheme.occupation
          )
          .filter(
            (occupation) =>
              occupation &&
              normalize(
                occupation
              ) !== "all"
          )
      ),
    ];
  }, [schemes]);

  /* =========================================================
     CATEGORY CLICK
  ========================================================= */

  const handleBeneficiaryClick = (
    category
  ) => {
    setExploreFilter("All");
    setBeneficiaryFilter(
      category
    );

    setTimeout(() => {
      document
        .getElementById(
          "beneficiary-results"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* =========================================================
     EXPLORE CARD CLICK
  ========================================================= */

  const handleExploreClick = (
    filter
  ) => {
    setBeneficiaryFilter("All");
    setExploreFilter(filter);

    setTimeout(() => {
      document
        .getElementById(
          "explore-results"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* =========================================================
     CLEAR BENEFICIARY FILTER
  ========================================================= */

  const clearBeneficiaryFilter =
    () => {
      setBeneficiaryFilter(
        "All"
      );
    };

  /* =========================================================
     CLEAR EXPLORE FILTER
  ========================================================= */

  const clearExploreFilter =
    () => {
      setExploreFilter("All");
    };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setDepartmentFilter("All");
    setStateFilter("All");
    setOccupationFilter("All");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userId"
    );

    navigate("/login");
  };

  /* =========================================================
     VIEW SCHEME
  ========================================================= */

  const handleViewScheme = (
    scheme
  ) => {
    if (!scheme?._id) {
      return;
    }

    navigate(
      `/scheme/${scheme._id}`
    );
  };

  /* =========================================================
     RENDER SCHEME CARD
  ========================================================= */

  const renderSchemeCard = (
    scheme
  ) => {
    return (
      <article
        className="scheme-card"
        key={scheme._id}
      >
        <div className="scheme-card-content">

          <p className="scheme-category">
            {scheme.category ||
              t("publicBenefit")}
          </p>

          <h3>
            {scheme.schemeName}
          </h3>

          <p className="scheme-department">
            {scheme.department ||
              t(
                "governmentDepartment"
              )}
          </p>

          <p className="scheme-description">
            {scheme.description ||
              t(
                "governmentSchemeInformation"
              )}
          </p>

          <div className="scheme-card-actions">

            <button
              type="button"
              onClick={() =>
                handleViewScheme(
                  scheme
                )
              }
            >
              {t("viewDetails")}
            </button>

          </div>

        </div>
      </article>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-header">

        <div
          className="dashboard-brand"
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
        >
          <h1>
            SARVASETU
          </h1>

          <p>
            {t(
              "intelligentPublicBenefitDeliveryPlatform"
            )}
          </p>
        </div>

        <nav className="dashboard-nav">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            {t("home")}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/schemes"
              )
            }
          >
            {t("schemes")}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/recommend"
              )
            }
          >
            {t(
              "aiRecommendation"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/documents"
              )
            }
          >
            {t(
              "documentVault"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >
            {t("profile")}
          </button>

          <button
            type="button"
            onClick={
              handleLogout
            }
          >
            {t("logout")}
          </button>

        </nav>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <p className="hero-label">
            {t("discover")} •{" "}
            {t("understand")} •{" "}
            {t("prepare")} •{" "}
            {t("access")}
          </p>

          <h2>
            {t(
              "findPublicBenefits"
            )}
          </h2>

          <p>
            {t(
              "discoverGovernmentSchemesDescription"
            )}
          </p>

          <div className="hero-search">

            <input
              type="text"
              placeholder={t(
                "searchSchemesBenefitsDepartments"
              )}
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    "scheme-discovery"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  })
              }
            >
              {t("search")}
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          SARVASETU FEATURE SLIDER
          AUTOMATIC EVERY 5 SECONDS
          NO DOTS
      ===================================================== */}

      <section className="sarvasetu-slider-section">

        <div className="sarvasetu-slider">

          {sarvasetuSlides.map(
            (
              slide,
              index
            ) => (
              <div
                key={
                  slide.key
                }
                className={`sarvasetu-slide ${
                  index ===
                  currentSlide
                    ? "active"
                    : ""
                } ${
                  slide.className
                }`}
              >

                <div className="sarvasetu-slide-content">

                  <p className="sarvasetu-slide-label">
                    {t(
                      `slider_${slide.key}_label`
                    )}
                  </p>

                  <h2>
                    {t(
                      `slider_${slide.key}_title`
                    )}
                  </h2>

                  <p className="sarvasetu-slide-description">
                    {t(
                      `slider_${slide.key}_description`
                    )}
                  </p>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {notifications.length >
        0 && (
        <section className="dashboard-notifications">

          <div className="section-heading">

            <div>

              <p className="section-kicker">
                {t(
                  "important"
                )}
              </p>

              <h2>
                {t(
                  "latestNotifications"
                )}
              </h2>

            </div>

          </div>

          <div className="notification-list">

            {notifications
              .slice(0, 5)
              .map(
                (
                  notification
                ) => (
                  <div
                    className="notification-item"
                    key={
                      notification._id ||
                      notification.id
                    }
                  >

                    <h3>
                      {
                        notification.title
                      }
                    </h3>

                    <p>
                      {
                        notification.message
                      }
                    </p>

                  </div>
                )
              )}

          </div>

        </section>
      )}

      {/* =====================================================
          BENEFICIARY CATEGORIES
      ===================================================== */}

      <section className="beneficiary-section">

        <div className="section-heading">

          <div>

            <p className="section-kicker">
              {t(
                "findBenefitsByNeed"
              )}
            </p>

            <h2>
              {t(
                "whatBestDescribesYou"
              )}
            </h2>

            <p>
              {t(
                "selectBeneficiaryCategory"
              )}
            </p>

          </div>

        </div>

        <div className="beneficiary-grid">

          {beneficiaryCategories.map(
            (
              category
            ) => {

              const count =
                getBeneficiaryCount(
                  category.key
                );

              const isActive =
                beneficiaryFilter ===
                category.key;

              return (
                <button
                  key={
                    category.key
                  }
                  type="button"
                  className={`beneficiary-card ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleBeneficiaryClick(
                      category.key
                    )
                  }
                >

                  <h3>
                    {
                      category.label
                    }
                  </h3>

                  <strong>
                    {count}
                  </strong>

                  <p>
                    {
                      category.description
                    }
                  </p>

                  <span>
                    {count === 1
                      ? t(
                          "schemeAvailable"
                        )
                      : t(
                          "schemesAvailable"
                        )}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          BENEFICIARY RESULTS
      ===================================================== */}

      {beneficiaryFilter !==
        "All" && (
        <section
          id="beneficiary-results"
          className="beneficiary-results"
        >

          <div className="section-heading beneficiary-results-heading">

            <div>

              <p className="section-kicker">
                {t(
                  "beneficiaryResults"
                )}
              </p>

              <h2>
                {
                  beneficiaryCategories.find(
                    (
                      item
                    ) =>
                      item.key ===
                      beneficiaryFilter
                  )?.label ||
                    beneficiaryFilter
                }{" "}
                {t("schemes")}
              </h2>

              <p>
                {
                  beneficiaryFilteredSchemes.length
                }{" "}
                {
                  beneficiaryFilteredSchemes.length ===
                  1
                    ? t(
                        "scheme"
                      )
                    : t(
                        "schemes"
                      )
                }{" "}
                {t(
                  "matchedWithThisCategory"
                )}
              </p>

            </div>

            <button
              type="button"
              className="clear-beneficiary"
              onClick={
                clearBeneficiaryFilter
              }
            >
              {t(
                "viewAllSchemes"
              )}
            </button>

          </div>

          {beneficiaryFilteredSchemes.length ===
          0 ? (
            <div className="no-beneficiary-results">

              <h3>
                {t(
                  "noSchemesFound"
                )}
              </h3>

              <p>
                {t(
                  "noSchemesMatchedBeneficiary"
                )}
              </p>

            </div>
          ) : (
            <div className="scheme-results-grid">

              {beneficiaryFilteredSchemes.map(
                renderSchemeCard
              )}

            </div>
          )}

        </section>
      )}

      {/* =====================================================
          QUICK ACCESS
      ===================================================== */}

      <section className="quick-access-section">

        <div className="section-heading">

          <div>

            <p className="section-kicker">
              {t(
                "quickAccess"
              )}
            </p>

            <h2>
              {t(
                "exploreSarvasetu"
              )}
            </h2>

          </div>

        </div>

        <div className="quick-access-grid">

          <button
            type="button"
            className="quick-card quick-schemes"
            onClick={() =>
              navigate(
                "/schemes"
              )
            }
          >

            <h3>
              {t(
                "governmentSchemes"
              )}
            </h3>

            <p>
              {t(
                "browsePublicBenefitSchemes"
              )}
            </p>

          </button>

          <button
            type="button"
            className="quick-card quick-ai"
            onClick={() =>
              navigate(
                "/recommend"
              )
            }
          >

            <h3>
              {t(
                "aiRecommendation"
              )}
            </h3>

            <p>
              {t(
                "findSchemesBasedOnProfile"
              )}
            </p>

          </button>

          <button
            type="button"
            className="quick-card quick-documents"
            onClick={() =>
              navigate(
                "/documents"
              )
            }
          >

            <h3>
              {t(
                "documentVault"
              )}
            </h3>

            <p>
              {t(
                "keepDocumentsOrganized"
              )}
            </p>

          </button>

          <button
            type="button"
            className="quick-card quick-profile"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >

            <h3>
              {t(
                "myProfile"
              )}
            </h3>

            <p>
              {t(
                "managePersonalInformation"
              )}
            </p>

          </button>

        </div>

      </section>

      {/* =====================================================
          SCHEME DISCOVERY
      ===================================================== */}

      <section
        id="scheme-discovery"
        className="scheme-discovery-section"
      >

        <div className="section-heading">

          <div>

            <p className="section-kicker">
              {t(
                "schemeDiscovery"
              )}
            </p>

            <h2>
              {t(
                "exploreGovernmentSchemes"
              )}
            </h2>

            <p>
              {t(
                "searchFilterSchemesDescription"
              )}
            </p>

          </div>

        </div>

        <div className="scheme-filter-panel">

          <input
            type="text"
            placeholder={t(
              "searchSchemes"
            )}
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            value={
              categoryFilter
            }
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              {t(
                "allCategories"
              )}
            </option>

            {categories.map(
              (
                category
              ) => (
                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {
                    category
                  }
                </option>
              )
            )}

          </select>

          <select
            value={
              occupationFilter
            }
            onChange={(e) =>
              setOccupationFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              {t(
                "allBeneficiaries"
              )}
            </option>

            {occupations.map(
              (
                occupation
              ) => (
                <option
                  key={
                    occupation
                  }
                  value={
                    occupation
                  }
                >
                  {
                    occupation
                  }
                </option>
              )
            )}

          </select>

          <button
            type="button"
            onClick={
              resetFilters
            }
          >
            {t(
              "resetFilters"
            )}
          </button>

        </div>

        <div className="scheme-discovery-count">

          <p>
            {
              filteredSchemes.length
            }{" "}
            {
              filteredSchemes.length ===
              1
                ? t(
                    "scheme"
                  )
                : t(
                    "schemes"
                  )
            }{" "}
            {t(
              "found"
            )}
          </p>

        </div>

        {filteredSchemes.length ===
        0 ? (
          <div className="no-beneficiary-results">

            <h3>
              {t(
                "noSchemesFound"
              )}
            </h3>

            <p>
              {t(
                "tryChangingSearchFilters"
              )}
            </p>

          </div>
        ) : (
          <div className="scheme-results-grid">

            {filteredSchemes
              .slice(0, 12)
              .map(
                renderSchemeCard
              )}

          </div>
        )}

        {filteredSchemes.length >
          12 && (
          <div className="view-all-schemes">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/schemes"
                )
              }
            >
              {t(
                "viewAllSchemes"
              )}
            </button>

          </div>
        )}

      </section>

      {/* =====================================================
          GOVERNMENT UPDATES
      ===================================================== */}

      <section className="government-updates-section">

        <div className="section-heading">

          <div>

            <p className="section-kicker">
              {t(
                "stayUpdated"
              )}
            </p>

            <h2>
              {t(
                "latestGovernmentUpdates"
              )}
            </h2>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/government-updates"
              )
            }
          >
            {t(
              "viewAllUpdates"
            )}
          </button>

        </div>

        {updates.length ===
        0 ? (
          <div className="empty-updates">

            <p>
              {t(
                "noGovernmentUpdatesAvailable"
              )}
            </p>

          </div>
        ) : (
          <div className="updates-grid">

            {updates
              .slice(0, 4)
              .map(
                (
                  update
                ) => (
                  <article
                    className="update-card"
                    key={
                      update._id ||
                      update.id
                    }
                  >

                    <p className="update-date">
                      {update.createdAt
                        ? new Date(
                            update.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>

                    <h3>
                      {
                        update.title
                      }
                    </h3>

                    <p>
                      {
                        update.description ||
                          update.content ||
                          ""
                      }
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/government-update/${update._id}`
                        )
                      }
                    >
                      {t(
                        "readMore"
                      )}
                    </button>

                  </article>
                )
              )}

          </div>
        )}

      </section>

      {/* =====================================================
          EXPLORE PUBLIC BENEFITS
      ===================================================== */}

      <section
        className="more-services-section explore-benefits-section"
      >

        <div className="section-heading">

          <div>

            <p className="section-kicker">
              {t(
                "explorePublicBenefits"
              )}
            </p>

            <h2>
              {t(
                "exploreGovernmentSchemes"
              )}
            </h2>

            <p>
              {t(
                "browseSchemesByGovernmentLevel"
              )}
            </p>

          </div>

        </div>

        <div className="services-grid">

          {exploreCards.map(
            (card) => {

              const isActive =
                exploreFilter ===
                card.key;

              return (
                <button
                  key={
                    card.key
                  }
                  type="button"
                  className={`service-card ${
                    card.className
                  } ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleExploreClick(
                      card.key
                    )
                  }
                >

                  <span className="service-label">

                    {card.key ===
                    "Central"
                      ? t(
                          "national"
                        )
                      : card.key ===
                        "Karnataka"
                      ? t(
                          "state"
                        )
                      : t(
                          "total"
                        )}

                  </span>

                  <h3>
                    {
                      card.label
                    }
                  </h3>

                  <strong>
                    {
                      card.count
                    }
                  </strong>

                  <p>
                    {
                      card.description
                    }
                  </p>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          EXPLORE RESULTS
      ===================================================== */}

      {exploreFilter !==
        "All" && (
        <section
          id="explore-results"
          className="beneficiary-results explore-results-section"
        >

          <div className="section-heading beneficiary-results-heading">

            <div>

              <p className="section-kicker">
                {t(
                  "governmentLevel"
                )}
              </p>

              <h2>

                {exploreFilter ===
                "Central"
                  ? t(
                      "centralGovernmentSchemes"
                    )
                  : exploreFilter ===
                    "Karnataka"
                  ? t(
                      "karnatakaGovernmentSchemes"
                    )
                  : t(
                      "allGovernmentSchemes"
                    )}

              </h2>

              <p>

                {
                  exploreFilteredSchemes.length
                }{" "}

                {
                  exploreFilteredSchemes.length ===
                  1
                    ? t(
                        "scheme"
                      )
                    : t(
                        "schemes"
                      )
                }{" "}

                {t(
                  "available"
                )}

                .

              </p>

            </div>

            <button
              type="button"
              className="clear-explore"
              onClick={
                clearExploreFilter
              }
            >
              {t(
                "closeResults"
              )}
            </button>

          </div>

          {exploreFilteredSchemes.length ===
          0 ? (
            <div className="no-beneficiary-results">

              <h3>
                {t(
                  "noSchemesFound"
                )}
              </h3>

              <p>
                {t(
                  "noSchemesGovernmentLevel"
                )}
              </p>

            </div>
          ) : (
            <div className="scheme-results-grid">

              {exploreFilteredSchemes.map(
                renderSchemeCard
              )}

            </div>
          )}

        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="dashboard-footer">

        <div>

          <h2>
            SARVASETU
          </h2>

          <p>
            {t(
              "intelligentPublicBenefitDeliveryPlatform"
            )}
          </p>

        </div>

        <div>

          <p>
            {t(
              "discover"
            )}.{" "}

            {t(
              "understand"
            )}.{" "}

            {t(
              "prepare"
            )}.{" "}

            {t(
              "access"
            )}.{" "}

            {t(
              "stayUpdated"
            )}
            .
          </p>

        </div>

      </footer>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="dashboard-loading">
          {t(
            "loadingSarvasetu"
          )}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error &&
        !loading && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

    </div>
  );
};

export default Dashboard;