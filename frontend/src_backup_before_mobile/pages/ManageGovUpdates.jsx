import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function ManageGovUpdates() {
  const { t } = useLanguage();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH GOVERNMENT UPDATES
  // ==========================================

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/updates/latest"
      );

      setUpdates(res.data.updates || []);
    } catch (error) {
      console.log("FETCH UPDATES ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToLoadGovernmentUpdates")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE GOVERNMENT UPDATE
  // ==========================================

  const deleteUpdate = async (id) => {
    const confirmDelete = window.confirm(
      t("confirmDeleteGovernmentUpdate")
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/updates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        t("governmentUpdateDeletedSuccessfully")
      );

      await fetchUpdates();
    } catch (error) {
      console.log("DELETE UPDATE ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToDeleteGovernmentUpdate")
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
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "18px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
              "0 8px 25px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "#C8C1AA",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "100%",
                background: "#919D85",
                animation:
                  "sarvasetuLoading 1.2s infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              color: "#596B5A",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            {t("loadingGovernmentUpdates")}
          </h2>

          <p
            style={{
              marginTop: "10px",
              color: "#81785A",
              fontSize: "14px",
            }}
          >
            {t("fetchingLatestGovernmentAnnouncements")}
          </p>
        </div>

        <style>
          {`
            @keyframes sarvasetuLoading {
              0% {
                transform: translateX(-120%);
              }
              50% {
                transform: translateX(120%);
              }
              100% {
                transform: translateX(260%);
              }
            }
          `}
        </style>
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
        padding: "24px",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          style={{
            background: "#596B5A",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "24px",
            color: "#F7F1E3",
            boxShadow:
              "0 8px 25px rgba(62, 68, 53, 0.12)",
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
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                }}
              >
                SARVASETU ADMIN
              </p>

              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  lineHeight: "1.2",
                  fontWeight: "700",
                }}
              >
                {t("manageGovernmentUpdates")}
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#E1E5DB",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                {t("viewManageGovernmentAnnouncements")}
              </p>
            </div>

            <Link
              to="/admin/add-update"
              style={{
                background: "#C496A1",
                color: "#3E4435",
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              {t("addUpdate")}
            </Link>
          </div>
        </div>

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {message && (
          <div
            style={{
              background: "#E1E5DB",
              border: "1px solid #919D85",
              color: "#596B5A",
              padding: "14px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div
            style={{
              background: "#F2E2E2",
              border: "1px solid #C496A1",
              color: "#7A4F59",
              padding: "14px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow:
              "0 5px 18px rgba(62, 68, 53, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t("governmentUpdates")}
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  color: "#596B5A",
                  fontSize: "38px",
                  lineHeight: "1",
                  fontWeight: "700",
                }}
              >
                {updates.length}
              </h2>
            </div>

            <div
              style={{
                background: "#EBE1C6",
                border: "1px solid #C8C1AA",
                color: "#81785A",
                padding: "9px 14px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.6px",
              }}
            >
              {t("updateCenter")}
            </div>
          </div>
        </div>

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {updates.length === 0 ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "16px",
              padding: "60px 25px",
              textAlign: "center",
              boxShadow:
                "0 5px 18px rgba(62, 68, 53, 0.06)",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#596B5A",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              {t("noGovernmentUpdatesAvailable")}
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                color: "#81785A",
                fontSize: "14px",
              }}
            >
              {t("addFirstGovernmentUpdate")}
            </p>

            <Link
              to="/admin/add-update"
              style={{
                display: "inline-block",
                marginTop: "22px",
                background: "#C496A1",
                color: "#3E4435",
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {t("addGovernmentUpdate")}
            </Link>
          </div>
        ) : (
          /* ==========================================
             UPDATE CARDS
          ========================================== */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "20px",
            }}
          >
            {updates.map((update) => (
              <div
                key={update._id}
                style={{
                  background: "#F2EEE1",
                  border: "1px solid #C8C1AA",
                  borderRadius: "16px",
                  padding: "22px",
                  boxShadow:
                    "0 5px 18px rgba(62, 68, 53, 0.06)",
                }}
              >
                {/* TITLE */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: "#3E4435",
                      fontSize: "21px",
                      lineHeight: "1.35",
                      fontWeight: "700",
                      wordBreak: "break-word",
                    }}
                  >
                    {update.title}
                  </h2>

                  <span
                    style={{
                      background: "#E1E5DB",
                      border: "1px solid #C8C1AA",
                      color: "#596B5A",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {update.category || t("other")}
                  </span>
                </div>

                {/* DESCRIPTION */}

                <p
                  style={{
                    margin: "16px 0 0",
                    color: "#5F6456",
                    fontSize: "14px",
                    lineHeight: "1.7",
                  }}
                >
                  {update.description ||
                    t("noDescriptionAvailable")}
                </p>

                {/* SOURCE */}

                <div
                  style={{
                    marginTop: "18px",
                    paddingTop: "16px",
                    borderTop: "1px solid #C8C1AA",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#81785A",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {t("source")}
                  </p>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#3E4435",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {update.sourceName ||
                      t("governmentSource")}
                  </p>
                </div>

                {/* DATE */}

                <p
                  style={{
                    margin: "14px 0 0",
                    color: "#81785A",
                    fontSize: "12px",
                  }}
                >
                  {t("published")}:{" "}
                  {update.publishedDate
                    ? new Date(
                        update.publishedDate
                      ).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>

                {/* ACTIONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    paddingTop: "18px",
                    borderTop: "1px solid #C8C1AA",
                  }}
                >
                  <Link
                    to={`/admin/edit-update/${update._id}`}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "#8E88A3",
                      color: "#F7F1E3",
                      textDecoration: "none",
                      padding: "10px",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {t("edit")}
                  </Link>

                  <button
                    onClick={() =>
                      deleteUpdate(update._id)
                    }
                    disabled={
                      deletingId === update._id
                    }
                    style={{
                      flex: 1,
                      border: "none",
                      background:
                        deletingId === update._id
                          ? "#B8B8B0"
                          : "#C496A1",
                      color: "#3E4435",
                      padding: "10px",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor:
                        deletingId === update._id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {deletingId === update._id
                      ? t("deleting")
                      : t("delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageGovUpdates;
