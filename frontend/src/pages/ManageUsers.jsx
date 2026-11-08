import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function ManageUsers() {
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch registered users.
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        return;
      }

      const response = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          t("failedToLoadUsers")
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a user and display the actual backend response.
  const deleteUser = async (id) => {
    const confirmed = window.confirm(t("confirmDeleteUser"));

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("adminLoginRequired"));
        return;
      }

      const response = await API.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(
        response.data?.message ||
          t("userDeletedSuccessfully")
      );

      await fetchUsers();
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      setError(
        err.response?.data?.message ||
          t("failedToDeleteUser")
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Search by name, email, role, or college.
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText) ||
      user.collegeName?.toLowerCase().includes(searchText)
    );
  });

  const colors = {
    page: "#F7F1E3",
    surface: "#F2EEE1",
    cream: "#EBE1C6",
    green: "#596B5A",
    dark: "#3E4435",
    muted: "#81785A",
    border: "#C8C1AA",
    pink: "#C496A1",
    successBg: "#E5E9DE",
    successBorder: "#B9C3B0",
    errorBg: "#F0E1E3",
    errorText: "#79515A",
  };

  const styles = {
    page: {
      minHeight: "100vh",
      boxSizing: "border-box",
      background: colors.page,
      padding: "clamp(16px, 4vw, 32px) 16px 60px",
      fontFamily: "Inter, Arial, Helvetica, sans-serif",
      color: colors.dark,
    },
    container: {
      width: "100%",
      maxWidth: "1250px",
      margin: "0 auto",
    },
    panel: {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: "20px",
      padding: "clamp(18px, 3vw, 24px)",
      marginBottom: "20px",
      boxSizing: "border-box",
      minWidth: 0,
      boxShadow: "0 8px 24px rgba(89, 107, 90, 0.07)",
    },
    label: {
      margin: 0,
      color: colors.muted,
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    heading: {
      margin: "8px 0 0",
      fontSize: "clamp(25px, 4vw, 36px)",
      lineHeight: 1.2,
      overflowWrap: "anywhere",
    },
    button: {
      minHeight: "44px",
      borderRadius: "11px",
      padding: "11px 18px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      boxSizing: "border-box",
    },
  };

  if (loading) {
    return (
      <main
        style={{
          ...styles.page,
          display: "grid",
          placeItems: "center",
        }}
      >
        <section
          style={{
            ...styles.panel,
            width: "100%",
            maxWidth: "520px",
            padding: "clamp(24px, 5vw, 48px) 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "4px",
              background: colors.pink,
              margin: "0 auto 28px",
              borderRadius: "4px",
            }}
          />

          <h2 style={{ margin: 0, fontSize: "26px" }}>
            {t("loadingUsers")}
          </h2>

          <p style={{ color: colors.muted, lineHeight: 1.6 }}>
            {t("fetchingRegisteredUsers")}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header
          style={{
            background: colors.green,
            borderRadius: "24px",
            padding: "clamp(20px, 4vw, 30px)",
            marginBottom: "24px",
            color: colors.page,
            boxShadow: "0 12px 30px rgba(89, 107, 90, 0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div style={{ minWidth: 0, flex: "1 1 240px" }}>
              <p
                style={{
                  ...styles.label,
                  color: "#DDE3D7",
                  letterSpacing: "2px",
                }}
              >
                SARVASETU ADMIN
              </p>

              <h1 style={styles.heading}>
                {t("manageUsers")}
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#E1E5DB",
                  lineHeight: 1.6,
                }}
              >
                {t("viewManageRegisteredUsers")}
              </p>
            </div>

            <Link
              to="/admin"
              style={{
                ...styles.button,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: colors.cream,
                color: colors.green,
                border: `1px solid #D7CEB4`,
                maxWidth: "100%",
              }}
            >
              {t("adminDashboard")}
            </Link>
          </div>
        </header>

        {/* Success response */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            style={{
              background: colors.successBg,
              border: `1px solid ${colors.successBorder}`,
              color: colors.green,
              padding: "14px 18px",
              borderRadius: "14px",
              marginBottom: "20px",
              fontSize: "14px",
              lineHeight: 1.6,
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </div>
        )}

        {/* Error response */}
        {error && (
          <div
            role="alert"
            style={{
              background: colors.errorBg,
              border: "1px solid #D8B8BE",
              color: colors.errorText,
              padding: "14px 18px",
              borderRadius: "14px",
              marginBottom: "20px",
              fontSize: "14px",
              lineHeight: 1.6,
              overflowWrap: "anywhere",
            }}
          >
            {error}
          </div>
        )}

        {/* Search */}
        <section style={styles.panel}>
          <p style={styles.label}>{t("userDirectory")}</p>

          <h2 style={{ margin: "5px 0 16px", fontSize: "21px" }}>
            {t("searchUsers")}
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <input
              type="search"
              aria-label={t("searchUsers")}
              placeholder={t("searchUsersPlaceholder")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{
                flex: "1 1 260px",
                minWidth: 0,
                maxWidth: "100%",
                padding: "13px 15px",
                borderRadius: "11px",
                border: `1px solid ${colors.border}`,
                background: colors.page,
                color: colors.dark,
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                ...styles.button,
                border: `1px solid ${colors.muted}`,
                background: colors.muted,
                color: colors.page,
              }}
            >
              {t("clear")}
            </button>
          </div>
        </section>

        {/* User count */}
        <section
          style={{
            ...styles.panel,
            background: colors.cream,
          }}
        >
          <p style={styles.label}>{t("usersFound")}</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <h2
              style={{
                margin: "8px 0 0",
                fontSize: "36px",
                lineHeight: 1,
                color: colors.green,
              }}
            >
              {filteredUsers.length}
            </h2>

            <span
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                background: colors.pink,
                color: colors.page,
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              {t("users")}
            </span>
          </div>
        </section>

        {/* User list */}
        {filteredUsers.length === 0 ? (
          <section
            style={{
              ...styles.panel,
              padding: "clamp(32px, 6vw, 60px) 24px",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "24px" }}>
              {t("noUsersFound")}
            </h2>

            <p style={{ color: colors.muted, lineHeight: 1.6 }}>
              {t("tryAnotherSearch")}
            </p>
          </section>
        ) : (
          <section
            aria-label={t("userDirectory")}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
              gap: "18px",
            }}
          >
            {filteredUsers.map((user) => (
              <article
                key={user._id}
                style={{
                  ...styles.panel,
                  marginBottom: 0,
                  overflow: "hidden",
                }}
              >
                {/* User header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: "48px",
                      height: "48px",
                      flexShrink: 0,
                      borderRadius: "14px",
                      background: colors.pink,
                      display: "grid",
                      placeItems: "center",
                      color: colors.page,
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {t("user")}
                  </div>

                  <span
                    style={{
                      background:
                        user.role === "admin" ? "#E4D6D9" : "#E1E5DB",
                      color:
                        user.role === "admin"
                          ? colors.errorText
                          : colors.green,
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {user.role || t("user")}
                  </span>
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: colors.dark,
                    fontSize: "20px",
                    lineHeight: 1.35,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.name || t("unknownUser")}
                </h2>

                {/* User details */}
                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {[
                    [t("email"), user.email || t("noEmail")],
                    ...(user.age !== undefined
                      ? [[t("age"), String(user.age)]]
                      : []),
                    ...(user.gender
                      ? [[t("gender"), user.gender]]
                      : []),
                    ...(user.collegeName
                      ? [[t("college"), user.collegeName]]
                      : []),
                    [
                      t("joined"),
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : t("unknown"),
                    ],
                  ].map(([label, value]) => (
                    <div key={label} style={{ minWidth: 0 }}>
                      <p style={styles.label}>{label}</p>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: colors.dark,
                          fontSize: "14px",
                          lineHeight: 1.6,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delete user */}
                <div
                  style={{
                    borderTop: `1px solid ${colors.border}`,
                    marginTop: "20px",
                    paddingTop: "18px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => deleteUser(user._id)}
                    disabled={deletingId === user._id}
                    style={{
                      ...styles.button,
                      width: "100%",
                      border:
                        deletingId === user._id
                          ? "1px solid #B5B0A0"
                          : "1px solid #A87D86",
                      background:
                        deletingId === user._id
                          ? "#B5B0A0"
                          : colors.pink,
                      color: colors.page,
                      cursor:
                        deletingId === user._id
                          ? "not-allowed"
                          : "pointer",
                      opacity: deletingId === user._id ? 0.8 : 1,
                    }}
                  >
                    {deletingId === user._id
                      ? t("deleting")
                      : t("deleteUser")}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default ManageUsers;