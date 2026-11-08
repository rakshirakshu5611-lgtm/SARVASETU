import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function ManageUpdates() {
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

      const res = await API.get("/updates/latest");

      console.log("GOVERNMENT UPDATES:", res.data);

      setUpdates(res.data.updates || []);
    } catch (error) {
      console.error(
        "FETCH UPDATES ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load government updates."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE UPDATE
  // ==========================================

  const deleteUpdate = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this government update?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      await API.delete(`/updates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Government update deleted successfully.");

      await fetchUpdates();
    } catch (error) {
      console.error(
        "DELETE UPDATE ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete government update."
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
            maxWidth: "520px",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "18px",
            padding: "42px",
            textAlign: "center",
            boxShadow: "0 8px 25px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              height: "4px",
              width: "100%",
              background: "#C8C1AA",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                background: "#919D85",
                borderRadius: "10px",
                animation: "sarvasetuLoading 1.2s infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              color: "#596B5A",
              fontSize: "25px",
              fontWeight: "700",
            }}
          >
            Loading Government Updates
          </h2>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#81785A",
              fontSize: "15px",
            }}
          >
            Fetching the latest government announcements.
          </p>

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
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "#596B5A",
            color: "#F7F1E3",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "24px",
            boxShadow: "0 8px 25px rgba(62, 68, 53, 0.12)",
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
                  fontSize: "12px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#EBE1C6",
                  fontWeight: "700",
                }}
              >
                SARVASETU ADMIN
              </p>

              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: "700",
                  lineHeight: "1.15",
                }}
              >
                Manage Government Updates
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#E1E5DB",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  maxWidth: "650px",
                }}
              >
                View, update and manage government announcements
                published through SARVASETU.
              </p>
            </div>

            <Link
              to="/admin/add-update"
              style={{
                textDecoration: "none",
                background: "#C496A1",
                color: "#3E4435",
                padding: "13px 20px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                whiteSpace: "nowrap",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Add Update
            </Link>
          </div>
        </div>

        {/* MESSAGES */}

        {message && (
          <div
            style={{
              background: "#E1E5DB",
              border: "1px solid #919D85",
              color: "#596B5A",
              padding: "15px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#F2E2E2",
              border: "1px solid #C496A1",
              color: "#7A4F59",
              padding: "15px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 5px 18px rgba(62, 68, 53, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Active Government Updates
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#596B5A",
                  fontSize: "38px",
                  fontWeight: "700",
                  lineHeight: "1",
                }}
              >
                {updates.length}
              </p>
            </div>

            <div
              style={{
                padding: "10px 16px",
                background: "#EBE1C6",
                border: "1px solid #C8C1AA",
                borderRadius: "10px",
                color: "#81785A",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              UPDATE CENTER
            </div>
          </div>
        </div>

        {/* NO UPDATES */}

        {updates.length === 0 ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "16px",
              padding: "60px 25px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(62, 68, 53, 0.06)",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#596B5A",
                fontSize: "25px",
                fontWeight: "700",
              }}
            >
              No Government Updates Found
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                color: "#81785A",
                fontSize: "15px",
              }}
            >
              Add your first government update to publish
              information for citizens.
            </p>

            <Link
              to="/admin/add-update"
              style={{
                display: "inline-block",
                marginTop: "24px",
                background: "#C496A1",
                color: "#3E4435",
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              Add Government Update
            </Link>
          </div>
        ) : (
          /* UPDATE LIST */

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
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
                  boxShadow: "0 5px 18px rgba(62, 68, 53, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                {/* TITLE + CATEGORY */}

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
                      fontWeight: "700",
                      lineHeight: "1.35",
                      wordBreak: "break-word",
                    }}
                  >
                    {update.title}
                  </h2>

                  <span
                    style={{
                      background: "#E1E5DB",
                      color: "#596B5A",
                      border: "1px solid #C8C1AA",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {update.category || "Other"}
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
                  {update.description || "No description available."}
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
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                    }}
                  >
                    Source
                  </p>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#3E4435",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {update.sourceName || "Government Source"}
                  </p>
                </div>

                {/* OFFICIAL LINK */}

                {update.sourceUrl && (
                  <a
                    href={update.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      marginTop: "14px",
                      color: "#596B5A",
                      fontSize: "13px",
                      fontWeight: "700",
                      textDecoration: "none",
                      wordBreak: "break-all",
                    }}
                  >
                    Open Official Source
                  </a>
                )}

                {/* PUBLISHED DATE */}

                <p
                  style={{
                    margin: "14px 0 0",
                    color: "#81785A",
                    fontSize: "12px",
                  }}
                >
                  Published:{" "}
                  {update.publishedDate
                    ? new Date(update.publishedDate).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>

                {/* STATUS */}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "14px",
                  }}
                >
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background: update.isNew ? "#EBE1C6" : "#E8E8E2",
                      color: update.isNew ? "#81785A" : "#6D7067",
                      border: "1px solid #C8C1AA",
                    }}
                  >
                    {update.isNew ? "New" : "Read"}
                  </span>

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background: update.isActive ? "#E1E5DB" : "#E8E8E2",
                      color: update.isActive ? "#596B5A" : "#6D7067",
                      border: "1px solid #C8C1AA",
                    }}
                  >
                    {update.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* ACTIONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "20px",
                    paddingTop: "18px",
                    borderTop: "1px solid #C8C1AA",
                  }}
                >
                  <Link
                    to={`/admin/edit-update/${update._id}`}
                    style={{
                      flex: "1 1 110px",
                      textAlign: "center",
                      textDecoration: "none",
                      background: "#8E88A3",
                      color: "#F7F1E3",
                      padding: "10px 14px",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteUpdate(update._id)}
                    disabled={deletingId === update._id}
                    style={{
                      flex: "1 1 110px",
                      border: "none",
                      background:
                        deletingId === update._id ? "#B8B8B0" : "#C496A1",
                      color: "#3E4435",
                      padding: "10px 14px",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor:
                        deletingId === update._id ? "not-allowed" : "pointer",
                    }}
                  >
                    {deletingId === update._id ? "Deleting..." : "Delete"}
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

export default ManageUpdates;