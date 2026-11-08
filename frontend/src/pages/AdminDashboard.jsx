
import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function AdminDashboard() {
  const { t } = useLanguage();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [categories, setCategories] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);

  const [loginActivities, setLoginActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        return;
      }

      const response = await API.get(
        "/admin/stats",
        getAuthConfig()
      );

      const stats = response.data.stats || response.data;

      setTotalUsers(stats.totalUsers || 0);
      setTotalSchemes(stats.totalSchemes || 0);
      setCategories(stats.categories || 0);

      setTotalAnnouncements(
        stats.totalAnnouncements ||
          stats.totalNotifications ||
          0
      );
    } catch (err) {
      console.error("ADMIN STATS ERROR:", err);

      setError(
        err.response?.data?.message ||
          t("failedToLoadAdminStatistics")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginActivity = async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setActivityError("Admin login required.");
        return;
      }

      const response = await API.get(
        "/admin/login-activity",
        getAuthConfig()
      );

      setLoginActivities(response.data.activities || []);
    } catch (err) {
      console.error("LOGIN ACTIVITY ERROR:", err);

      setActivityError(
        err.response?.data?.message ||
          "Unable to load citizen login activity."
      );
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchLoginActivity();
  }, []);

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
            textAlign: "center",
            padding: "40px",
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
                  "sarvasetuLoading 1.3s ease-in-out infinite",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: "#3E4435",
            }}
          >
            {t("preparingAdminConsole")}
          </h2>

          <p
            style={{
              marginTop: "9px",
              color: "#81785A",
              fontSize: "14px",
            }}
          >
            {t("fetchingLivePlatformStatistics")}
          </p>

          <style>
            {`
              @keyframes sarvasetuLoading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(230%); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

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
        {/* TOP BAR */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "34px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                letterSpacing: "2.5px",
                color: "#596B5A",
              }}
            >
              SARVASETU
            </div>

            <div
              style={{
                marginTop: "5px",
                fontSize: "12px",
                color: "#81785A",
                letterSpacing: "0.3px",
              }}
            >
              {t("publicBenefitPlatform")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "#E1E5DB",
                color: "#596B5A",
                padding: "9px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "0.5px",
              }}
            >
              {t("systemOnline")}
            </span>

            <button
              onClick={() => {
                fetchAdminStats();
                fetchLoginActivity();
              }}
              style={{
                border: "1px solid #C8C1AA",
                background: "#F2EEE1",
                color: "#3E4435",
                padding: "10px 16px",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              {t("refresh")}
            </button>

            <button
              onClick={handleLogout}
              style={{
                border: "1px solid #C496A1",
                background: "#C496A1",
                color: "#FFFFFF",
                padding: "10px 17px",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              {t("logout")}
            </button>
          </div>
        </div>

        {/* INTRODUCTION */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              background: "#596B5A",
              color: "#F7F1E3",
              borderRadius: "22px",
              padding: "clamp(24px, 4vw, 38px)",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(62,68,53,0.08)",
            }}
          >
            <div>
              <span
                style={{
                  color: "#EBE1C6",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                {t("administrationConsole")}
              </span>

              <h1
                style={{
                  fontSize: "clamp(30px, 5vw, 42px)",
                  lineHeight: "1.08",
                  margin: "14px 0 13px",
                  maxWidth: "650px",
                  fontWeight: "750",
                  letterSpacing: "-1px",
                }}
              >
                {t("keepEveryPublicBenefitMoving")}
              </h1>

              <p
                style={{
                  color: "#E1E5DB",
                  lineHeight: "1.65",
                  maxWidth: "650px",
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                {t("monitorSchemesUsersUpdates")}
              </p>
            </div>

            <div
              style={{
                marginTop: "25px",
                fontSize: "11px",
                color: "#C8C1AA",
                letterSpacing: "1px",
                fontWeight: "700",
              }}
            >
              {t("sarvasetuAdminLiveData")}
            </div>
          </div>

          <div
            style={{
              background: "#C496A1",
              color: "#FFFFFF",
              borderRadius: "22px",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(62,68,53,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1.8px",
                opacity: 0.9,
              }}
            >
              {t("platformStatus")}
            </div>

            <div>
              <h2
                style={{
                  fontSize: "29px",
                  margin: 0,
                  fontWeight: "750",
                }}
              >
                {t("operational")}
              </h2>

              <p
                style={{
                  marginTop: "9px",
                  lineHeight: "1.55",
                  opacity: 0.9,
                  fontSize: "14px",
                  marginBottom: 0,
                }}
              >
                {t("coreAdministrationServicesAvailable")}
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            style={{
              background: "#F7E5E0",
              border: "1px solid #D8B2A8",
              color: "#8D5145",
              padding: "15px 18px",
              borderRadius: "12px",
              marginBottom: "25px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {/* STATISTICS HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#81785A",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1.7px",
              }}
            >
              {t("platformOverview")}
            </p>

            <h2
              style={{
                margin: "6px 0 0",
                fontSize: "24px",
                fontWeight: "750",
                color: "#3E4435",
              }}
            >
              {t("liveStatistics")}
            </h2>
          </div>

          <span
            style={{
              color: "#81785A",
              fontSize: "12px",
            }}
          >
            {t("updatedFromServer")}
          </span>
        </div>

        {/* STATISTICS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "14px",
            marginBottom: "38px",
          }}
        >
          <StatCard
            number={totalUsers}
            label={t("registeredUsers")}
            numberLabel="01"
          />

          <StatCard
            number={totalSchemes}
            label={t("governmentSchemes")}
            numberLabel="02"
          />

          <StatCard
            number={categories}
            label={t("schemeCategories")}
            numberLabel="03"
          />

          <StatCard
            number={totalAnnouncements}
            label={t("governmentUpdates")}
            numberLabel="04"
          />
        </div>

        {/* ADMINISTRATION */}

        <div style={{ marginBottom: "16px" }}>
          <p
            style={{
              margin: 0,
              color: "#81785A",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "1.7px",
            }}
          >
            {t("administration")}
          </p>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "24px",
              fontWeight: "750",
            }}
          >
            {t("platformOperations")}
          </h2>
        </div>

        {/* ADMIN ACTIONS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "14px",
          }}
        >
          <AdminAction
            number="01"
            title={t("addScheme")}
            description={t("publishNewGovernmentScheme")}
            to="/admin/add-scheme"
            primary
            openText={t("open")}
          />

          <AdminAction
            number="02"
            title={t("manageSchemes")}
            description={t("reviewEditRemoveExistingSchemes")}
            to="/admin/manage-schemes"
            openText={t("open")}
          />

          <AdminAction
            number="03"
            title={t("governmentUpdate")}
            description={t("publishNewPublicNotification")}
            to="/admin/add-update"
            primary
            openText={t("open")}
          />

          <AdminAction
            number="04"
            title={t("manageUpdates")}
            description={t("reviewManageAnnouncements")}
            to="/admin/manage-updates"
            openText={t("open")}
          />

          <AdminAction
            number="05"
            title={t("manageUsers")}
            description={t("viewManageRegisteredUsers")}
            to="/admin/manage-users"
            openText={t("open")}
          />

          <AdminAction
            number="06"
            title={t("userDashboard")}
            description={t("returnToPublicDashboard")}
            to="/dashboard"
            openText={t("open")}
          />
        </div>

        {/* RECENT CITIZEN LOGINS */}

        <section
          aria-labelledby="login-activity-heading"
          style={{
            marginTop: "38px",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "18px",
            padding: "clamp(18px, 3vw, 24px)",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "1.7px",
                  color: "#81785A",
                }}
              >
                SECURITY &amp; ACTIVITY
              </p>

              <h2
                id="login-activity-heading"
                style={{
                  margin: "6px 0 0",
                  fontSize: "22px",
                  color: "#3E4435",
                }}
              >
                Recent Citizen Logins
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "#81785A",
                }}
              >
                View the latest recorded citizen sign-ins.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLoginActivity}
              disabled={activityLoading}
              style={{
                border: "1px solid #C8C1AA",
                background: activityLoading ? "#DDD6C5" : "#EBE1C6",
                color: "#3E4435",
                padding: "10px 14px",
                borderRadius: "9px",
                cursor: activityLoading ? "wait" : "pointer",
                fontWeight: "700",
                fontSize: "13px",
                opacity: activityLoading ? 0.75 : 1,
              }}
            >
              {activityLoading ? "Refreshing..." : "Refresh activity"}
            </button>
          </div>

          {activityError && (
            <div
              role="alert"
              style={{
                padding: "12px 14px",
                marginBottom: "14px",
                borderRadius: "10px",
                background: "#F7E5E0",
                border: "1px solid #D8B2A8",
                color: "#8D5145",
                fontSize: "13px",
              }}
            >
              {activityError}
            </div>
          )}

          {activityLoading && loginActivities.length === 0 && (
            <p style={{ color: "#81785A", fontSize: "14px" }}>
              Loading login activity...
            </p>
          )}

          {!activityLoading &&
            !activityError &&
            loginActivities.length === 0 && (
              <div
                style={{
                  padding: "25px 15px",
                  textAlign: "center",
                  border: "1px dashed #C8C1AA",
                  borderRadius: "12px",
                  color: "#81785A",
                  fontSize: "14px",
                }}
              >
                No citizen login activity recorded yet.
              </div>
            )}

          {loginActivities.length > 0 && (
            <table
              style={{
                width: "100%",
                minWidth: "570px",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #C8C1AA" }}>
                  {["Citizen", "Email", "Login time"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      style={{
                        padding: "12px 10px",
                        color: "#81785A",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loginActivities.map((activity) => (
                  <tr
                    key={activity._id}
                    style={{ borderBottom: "1px solid #DDD6C5" }}
                  >
                    <td
                      style={{
                        padding: "14px 10px",
                        fontWeight: "700",
                        color: "#3E4435",
                      }}
                    >
                      {activity.name || "Citizen"}
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        color: "#596B5A",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {activity.email || "Unavailable"}
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        color: "#81785A",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                      }}
                    >
                      {activity.loggedInAt
                        ? new Date(activity.loggedInAt).toLocaleString()
                        : "Unavailable"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {loginActivities.length > 0 && (
            <p
              style={{
                margin: "14px 0 0",
                fontSize: "11px",
                color: "#81785A",
              }}
            >
              Showing up to {loginActivities.length} recorded login events.
            </p>
          )}
        </section>

        {/* FOOTER */}

        <div
          style={{
            marginTop: "45px",
            paddingTop: "20px",
            borderTop: "1px solid #C8C1AA",
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
            color: "#81785A",
            fontSize: "11px",
            letterSpacing: "0.3px",
          }}
        >
          <span>{t("sarvasetuGovernmentBenefitPlatform")}</span>
          <span>{t("adminConsole")}</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ number, label, numberLabel }) {
  return (
    <div
      style={{
        background: "#F2EEE1",
        border: "1px solid #C8C1AA",
        borderRadius: "17px",
        padding: "23px",
        minHeight: "145px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow =
          "0 10px 22px rgba(62,68,53,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: "800",
            color: "#81785A",
            letterSpacing: "1px",
          }}
        >
          {numberLabel}
        </span>

        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#C496A1",
          }}
        />
      </div>

      <div>
        <div
          style={{
            fontSize: "38px",
            fontWeight: "800",
            lineHeight: "1",
            marginBottom: "9px",
            color: "#3E4435",
          }}
        >
          {number}
        </div>

        <div
          style={{
            color: "#81785A",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN ACTION CARD
// ==========================================

function AdminAction({
  number,
  title,
  description,
  to,
  primary = false,
  openText,
}) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: primary ? "#EBE1C6" : "#F2EEE1",
          border: "1px solid #C8C1AA",
          borderRadius: "17px",
          padding: "24px",
          minHeight: "165px",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            "0 12px 28px rgba(62,68,53,0.10)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#81785A",
              letterSpacing: "1px",
            }}
          >
            {number}
          </span>

          <span
            style={{
              fontSize: "10px",
              color: "#8E88A3",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
          >
            {openText}
          </span>
        </div>

        <div
          style={{
            marginTop: "34px",
            paddingRight: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: "750",
              color: "#3E4435",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#81785A",
              lineHeight: "1.5",
              fontSize: "13px",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default AdminDashboard;
