import { useEffect, useState } from "react";
import axios from "axios";
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

  // ==========================================
  // FETCH USERS
  // ==========================================

  useEffect(() => {
    fetchUsers();
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

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADMIN USERS RESPONSE:", res.data);

      setUsers(res.data.users || []);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToLoadUsers")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      t("confirmDeleteUser")
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
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(t("userDeletedSuccessfully"));

      await fetchUsers();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      setError(
        error.response?.data?.message ||
          t("failedToDeleteUser")
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH USERS
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText) ||
      user.collegeName?.toLowerCase().includes(searchText)
    );
  });

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
          fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "24px",
            padding: "48px 32px",
            textAlign: "center",
            boxShadow:
              "0 12px 35px rgba(89, 107, 90, 0.10)",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "4px",
              background: "#C496A1",
              margin: "0 auto 28px",
              borderRadius: "4px",
            }}
          />

          <h2
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {t("loadingUsers")}
          </h2>

          <p
            style={{
              marginTop: "10px",
              color: "#81785A",
              fontSize: "15px",
            }}
          >
            {t("fetchingRegisteredUsers")}
          </p>
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
        padding: "32px 20px 60px",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
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
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "24px",
            boxShadow:
              "0 12px 30px rgba(89, 107, 90, 0.16)",
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
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#DDE3D7",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                SARVASETU ADMIN
              </p>

              <h1
                style={{
                  margin: "8px 0 0",
                  color: "#F7F1E3",
                  fontSize: "36px",
                  lineHeight: 1.15,
                  fontWeight: 700,
                }}
              >
                {t("manageUsers")}
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#E1E5DB",
                  fontSize: "15px",
                }}
              >
                {t("viewManageRegisteredUsers")}
              </p>
            </div>

            <Link
              to="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "#EBE1C6",
                color: "#596B5A",
                padding: "12px 18px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                border: "1px solid #D7CEB4",
              }}
            >
              {t("adminDashboard")}
            </Link>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div
            style={{
              background: "#E5E9DE",
              border: "1px solid #B9C3B0",
              color: "#596B5A",
              padding: "14px 18px",
              borderRadius: "14px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div
            style={{
              background: "#F0E1E3",
              border: "1px solid #D8B8BE",
              color: "#79515A",
              padding: "14px 18px",
              borderRadius: "14px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* SEARCH */}

        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow:
              "0 8px 24px rgba(89, 107, 90, 0.07)",
          }}
        >
          <div
            style={{
              marginBottom: "14px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#81785A",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              {t("userDirectory")}
            </p>

            <h2
              style={{
                margin: "5px 0 0",
                color: "#3E4435",
                fontSize: "21px",
                fontWeight: 700,
              }}
            >
              {t("searchUsers")}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder={t("searchUsersPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: "1 1 300px",
                minWidth: 0,
                padding: "13px 15px",
                borderRadius: "11px",
                border: "1px solid #C8C1AA",
                background: "#F7F1E3",
                color: "#3E4435",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={() => setSearch("")}
              style={{
                border: "1px solid #81785A",
                background: "#81785A",
                color: "#F7F1E3",
                padding: "13px 22px",
                borderRadius: "11px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t("clear")}
            </button>
          </div>
        </div>

        {/* USER COUNT */}

        <div
          style={{
            background: "#EBE1C6",
            border: "1px solid #C8C1AA",
            borderRadius: "20px",
            padding: "22px 24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("usersFound")}
              </p>

              <h2
                style={{
                  margin: "5px 0 0",
                  color: "#596B5A",
                  fontSize: "36px",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {filteredUsers.length}
              </h2>
            </div>

            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "16px",
                background: "#C496A1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F7F1E3",
                fontWeight: 800,
                fontSize: "14px",
                letterSpacing: "1px",
              }}
            >
              {t("users")}
            </div>
          </div>
        </div>

        {/* USER LIST */}

        {filteredUsers.length === 0 ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "20px",
              padding: "60px 24px",
              textAlign: "center",
              boxShadow:
                "0 8px 24px rgba(89, 107, 90, 0.07)",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#3E4435",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {t("noUsersFound")}
            </h2>

            <p
              style={{
                marginTop: "10px",
                color: "#81785A",
                fontSize: "14px",
              }}
            >
              {t("tryAnotherSearch")}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "18px",
            }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                style={{
                  background: "#F2EEE1",
                  border: "1px solid #C8C1AA",
                  borderRadius: "20px",
                  padding: "22px",
                  boxShadow:
                    "0 8px 24px rgba(89, 107, 90, 0.07)",
                }}
              >
                {/* USER HEADER */}

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
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "#C496A1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#F7F1E3",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {t("user")}
                  </div>

                  <span
                    style={{
                      background:
                        user.role === "admin"
                          ? "#E4D6D9"
                          : "#E1E5DB",
                      color:
                        user.role === "admin"
                          ? "#79515A"
                          : "#596B5A",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {user.role || t("user")}
                  </span>
                </div>

                {/* NAME */}

                <h2
                  style={{
                    margin: 0,
                    color: "#3E4435",
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.name || t("unknownUser")}
                </h2>

                {/* DETAILS */}

                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "11px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#81785A",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      {t("email")}
                    </p>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#3E4435",
                        fontSize: "14px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {user.email || t("noEmail")}
                    </p>
                  </div>

                  {user.age !== undefined && (
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#81785A",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        {t("age")}
                      </p>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#3E4435",
                          fontSize: "14px",
                        }}
                      >
                        {user.age}
                      </p>
                    </div>
                  )}

                  {user.gender && (
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#81785A",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        {t("gender")}
                      </p>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#3E4435",
                          fontSize: "14px",
                        }}
                      >
                        {user.gender}
                      </p>
                    </div>
                  )}

                  {user.collegeName && (
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#81785A",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        {t("college")}
                      </p>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#3E4435",
                          fontSize: "14px",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {user.collegeName}
                      </p>
                    </div>
                  )}

                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#81785A",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      {t("joined")}
                    </p>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#3E4435",
                        fontSize: "14px",
                      }}
                    >
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : t("unknown")}
                    </p>
                  </div>
                </div>

                {/* DELETE */}

                <div
                  style={{
                    borderTop: "1px solid #C8C1AA",
                    marginTop: "20px",
                    paddingTop: "18px",
                  }}
                >
                  <button
                    onClick={() => deleteUser(user._id)}
                    disabled={deletingId === user._id}
                    style={{
                      width: "100%",
                      border:
                        deletingId === user._id
                          ? "1px solid #B5B0A0"
                          : "1px solid #A87D86",
                      background:
                        deletingId === user._id
                          ? "#B5B0A0"
                          : "#C496A1",
                      color: "#F7F1E3",
                      padding: "11px 16px",
                      borderRadius: "11px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor:
                        deletingId === user._id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {deletingId === user._id
                      ? t("deleting")
                      : t("deleteUser")}
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

export default ManageUsers;