import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function ManageSchemes() {
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH ALL SCHEMES
  // ==========================================

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/schemes/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADMIN SCHEMES:", res.data);

      setSchemes(res.data.schemes || []);
    } catch (error) {
      console.error("FETCH SCHEMES ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToLoadSchemes")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const searchSchemes = async () => {
    if (!search.trim()) {
      fetchSchemes();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/schemes/search?keyword=${encodeURIComponent(
          search.trim()
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SEARCH SCHEMES:", res.data);

      setSchemes(res.data.schemes || []);
    } catch (error) {
      console.error("SEARCH ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToSearchSchemes")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filterSchemes = async (
    selectedCategory = category
  ) => {
    if (!selectedCategory) {
      fetchSchemes();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/schemes/category/${encodeURIComponent(
          selectedCategory
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("FILTER SCHEMES:", res.data);

      setSchemes(res.data.schemes || []);
    } catch (error) {
      console.error("FILTER ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToFilterSchemes")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE SCHEME
  // ==========================================

  const deleteScheme = async (id) => {
    const confirmDelete = window.confirm(
      t("confirmDeleteScheme")
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        setDeletingId(null);
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/schemes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        t("schemeDeletedSuccessfully")
      );

      fetchSchemes();
    } catch (error) {
      console.error(
        "DELETE SCHEME ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          t("failedToDeleteScheme")
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#3E4435",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "#DDD6C5",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                width: "45%",
                height: "100%",
                background: "#596B5A",
                borderRadius: "10px",
                animation:
                  "schemeLoading 1.3s ease-in-out infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "750",
            }}
          >
            {t("loadingSchemes")}
          </h2>

          <p
            style={{
              color: "#81785A",
              marginTop: "8px",
              fontSize: "14px",
            }}
          >
            {t("fetchingGovernmentSchemeRecords")}
          </p>

          <style>
            {`
              @keyframes schemeLoading {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(230%);
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          padding: "28px 22px 60px",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            background: "#596B5A",
            color: "#F7F1E3",
            borderRadius: "22px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow:
              "0 10px 25px rgba(62,68,53,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#EBE1C6",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                }}
              >
                {t("sarvasetuAdmin")}
              </p>

              <h1
                style={{
                  fontSize: "34px",
                  margin: "10px 0 8px",
                  lineHeight: "1.15",
                  fontWeight: "750",
                  letterSpacing: "-0.5px",
                }}
              >
                {t("manageGovernmentSchemes")}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#E1E5DB",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {t(
                  "searchFilterEditManageGovernmentSchemes"
                )}
              </p>
            </div>

            <Link
              to="/admin/add-scheme"
              style={{
                textDecoration: "none",
                background: "#C496A1",
                color: "#FFFFFF",
                padding: "12px 20px",
                borderRadius: "9px",
                fontWeight: "750",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {t("addScheme")}
            </Link>
          </div>
        </div>

        {/* SUCCESS */}

        {message && (
          <div
            style={{
              background: "#E1E5DB",
              border: "1px solid #B8C1AC",
              color: "#596B5A",
              padding: "14px 17px",
              borderRadius: "11px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "650",
            }}
          >
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#F7E5E0",
              border: "1px solid #D8B2A8",
              color: "#8D5145",
              padding: "14px 17px",
              borderRadius: "11px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "650",
            }}
          >
            {error}
          </div>
        )}

        {/* SEARCH + FILTER */}

        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "18px",
            padding: "23px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "1.6px",
                }}
              >
                {t("schemeDirectory")}
              </p>

              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: "21px",
                  fontWeight: "750",
                }}
              >
                {t("findSchemes")}
              </h2>
            </div>

            <span
              style={{
                fontSize: "12px",
                color: "#81785A",
              }}
            >
              {t("searchOrFilterRecords")}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder={t("searchSchemePlaceholder")}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchSchemes();
                }
              }}
              style={{
                flex: "1 1 300px",
                minWidth: "220px",
                border: "1px solid #C8C1AA",
                background: "#F7F1E3",
                color: "#3E4435",
                padding: "12px 14px",
                borderRadius: "9px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              onClick={searchSchemes}
              style={{
                background: "#596B5A",
                color: "#FFFFFF",
                border: "none",
                padding: "12px 21px",
                borderRadius: "9px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {t("search")}
            </button>

            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value;

                setCategory(value);

                if (!value) {
                  fetchSchemes();
                } else {
                  filterSchemes(value);
                }
              }}
              style={{
                border: "1px solid #C8C1AA",
                background: "#F7F1E3",
                color: "#3E4435",
                padding: "12px 14px",
                borderRadius: "9px",
                outline: "none",
                minWidth: "180px",
                fontSize: "13px",
              }}
            >
              <option value="">
                {t("allCategories")}
              </option>

              <option value="Education">
                {t("education")}
              </option>

              <option value="Agriculture">
                {t("agriculture")}
              </option>

              <option value="Healthcare">
                {t("healthcare")}
              </option>

              <option value="Finance">
                {t("finance")}
              </option>

              <option value="Women">
                {t("women")}
              </option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              fetchSchemes();
            }}
            style={{
              marginTop: "13px",
              background: "transparent",
              border: "none",
              color: "#8E88A3",
              fontWeight: "700",
              cursor: "pointer",
              padding: "0",
              fontSize: "12px",
            }}
          >
            {t("clearSearchFilter")}
          </button>
        </div>

        {/* COUNT */}

        <div
          style={{
            background: "#EBE1C6",
            border: "1px solid #C8C1AA",
            borderRadius: "17px",
            padding: "20px 23px",
            marginBottom: "22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#81785A",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1.4px",
              }}
            >
              {t("results")}
            </p>

            <h2
              style={{
                margin: "5px 0 0",
                fontSize: "13px",
                color: "#596B5A",
                fontWeight: "700",
              }}
            >
              {t("schemesFound")}
            </h2>
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: "800",
              color: "#596B5A",
              lineHeight: 1,
            }}
          >
            {schemes.length}
          </div>
        </div>

        {/* NO SCHEMES */}

        {schemes.length === 0 ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "18px",
              padding: "60px 30px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "23px",
                fontWeight: "750",
                color: "#3E4435",
              }}
            >
              {t("noSchemesFound")}
            </h2>

            <p
              style={{
                color: "#81785A",
                marginTop: "9px",
                fontSize: "14px",
              }}
            >
              {t("tryAnotherSearchCategory")}
            </p>
          </div>
        ) : (

          /* SCHEME LIST */

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                style={{
                  background: "#F2EEE1",
                  border: "1px solid #C8C1AA",
                  borderRadius: "18px",
                  padding: "23px",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 24px rgba(62,68,53,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "25px",
                    flexWrap: "wrap",
                  }}
                >

                  {/* DETAILS */}

                  <div
                    style={{
                      flex: "1 1 550px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "13px",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "21px",
                          fontWeight: "750",
                          color: "#3E4435",
                        }}
                      >
                        {scheme.schemeName}
                      </h2>

                      <span
                        style={{
                          background: "#E1E5DB",
                          color: "#596B5A",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "750",
                        }}
                      >
                        {scheme.category ||
                          t("other")}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#81785A",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        <strong
                          style={{
                            color: "#596B5A",
                          }}
                        >
                          {t("department")}:
                        </strong>{" "}
                        {scheme.department ||
                          t("notAvailable")}
                      </p>

                      {scheme.description && (
                        <p
                          style={{
                            margin: 0,
                            lineHeight: "1.55",
                          }}
                        >
                          <strong
                            style={{
                              color: "#596B5A",
                            }}
                          >
                            {t("description")}:
                          </strong>{" "}
                          {scheme.description}
                        </p>
                      )}

                      {scheme.eligibility && (
                        <p
                          style={{
                            margin: 0,
                            lineHeight: "1.55",
                          }}
                        >
                          <strong
                            style={{
                              color: "#596B5A",
                            }}
                          >
                            {t("eligibility")}:
                          </strong>{" "}
                          {scheme.eligibility}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      to={`/admin/edit-scheme/${scheme._id}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <button
                        style={{
                          background: "#8E88A3",
                          color: "#FFFFFF",
                          border: "none",
                          padding: "10px 17px",
                          borderRadius: "8px",
                          fontWeight: "700",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                      >
                        {t("edit")}
                      </button>
                    </Link>

                    <button
                      onClick={() =>
                        deleteScheme(
                          scheme._id
                        )
                      }
                      disabled={
                        deletingId ===
                        scheme._id
                      }
                      style={{
                        background:
                          deletingId ===
                          scheme._id
                            ? "#B9B4AA"
                            : "#C496A1",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "10px 17px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor:
                          deletingId ===
                          scheme._id
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "13px",
                      }}
                    >
                      {deletingId ===
                      scheme._id
                        ? t("deleting")
                        : t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSchemes;