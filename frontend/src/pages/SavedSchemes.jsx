
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function SavedSchemes() {
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedSchemes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/saved-schemes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedSchemes(res.data.savedSchemes || []);
    } catch (error) {
      console.error("FETCH SAVED SCHEMES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSchemes();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#3E4435",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
      >
        Loading saved schemes...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        padding: "50px 30px 70px",
        fontFamily: "Arial, sans-serif",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "35px",
            paddingBottom: "25px",
            borderBottom: "1px solid #C8C1AA",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: "#81785A",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Your Collection
          </p>

          <h1
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "38px",
              fontWeight: "600",
              letterSpacing: "-0.5px",
            }}
          >
            Saved Schemes
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "#6E7066",
              fontSize: "15px",
              lineHeight: "1.7",
              maxWidth: "650px",
            }}
          >
            Keep important government schemes in one place for
            quick access whenever you need them.
          </p>
        </div>

        {/* Empty State */}
        {savedSchemes.length === 0 ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "18px",
              padding: "65px 30px",
              textAlign: "center",
              maxWidth: "700px",
              margin: "50px auto 0",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "3px",
                background: "#C496A1",
                margin: "0 auto 25px",
              }}
            />

            <h3
              style={{
                margin: "0 0 12px",
                color: "#3E4435",
                fontSize: "23px",
                fontWeight: "600",
              }}
            >
              No saved schemes yet
            </h3>

            <p
              style={{
                margin: "0 auto 28px",
                color: "#6E7066",
                fontSize: "15px",
                lineHeight: "1.7",
                maxWidth: "470px",
              }}
            >
              Browse available schemes and save the ones that
              are relevant to you for easier access later.
            </p>

            <Link
              to="/schemes"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#596B5A",
                color: "#F7F1E3",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Browse Schemes
            </Link>
          </div>
        ) : (
          <>
            {/* Count */}
            <div
              style={{
                marginBottom: "20px",
                color: "#81785A",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {savedSchemes.length}{" "}
              {savedSchemes.length === 1
                ? "scheme saved"
                : "schemes saved"}
            </div>

            {/* Scheme Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "22px",
              }}
            >
              {savedSchemes.map((scheme) => (
                <div
                  key={scheme._id}
                  style={{
                    background: "#F2EEE1",
                    border: "1px solid #C8C1AA",
                    borderRadius: "16px",
                    padding: "26px",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "330px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Scheme Name */}
                  <h3
                    style={{
                      margin: "0 0 18px",
                      color: "#3E4435",
                      fontSize: "20px",
                      lineHeight: "1.4",
                      fontWeight: "600",
                    }}
                  >
                    {scheme.schemeName}
                  </h3>

                  {/* Information */}
                  <div
                    style={{
                      borderTop: "1px solid #D5CEB9",
                      borderBottom: "1px solid #D5CEB9",
                      padding: "15px 0",
                      marginBottom: "17px",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "9px",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          color: "#81785A",
                          fontWeight: "600",
                        }}
                      >
                        Department
                      </span>

                      <span
                        style={{
                          color: "#5F6259",
                          marginLeft: "8px",
                        }}
                      >
                        {scheme.department}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          color: "#81785A",
                          fontWeight: "600",
                        }}
                      >
                        Category
                      </span>

                      <span
                        style={{
                          color: "#5F6259",
                          marginLeft: "8px",
                        }}
                      >
                        {scheme.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      margin: "0",
                      color: "#6E7066",
                      fontSize: "14px",
                      lineHeight: "1.7",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {scheme.description}
                  </p>

                  {/* Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "auto",
                      paddingTop: "25px",
                    }}
                  >
                    <Link
                      to={`/schemes/${scheme._id}`}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "11px 14px",
                        background: "#596B5A",
                        color: "#F7F1E3",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        boxSizing: "border-box",
                      }}
                    >
                      View Scheme
                    </Link>

                    <button
                      onClick={async () => {
                        try {
                          const token =
                            localStorage.getItem("token");

                          await API.delete(
                            `/saved-schemes/${scheme._id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          setSavedSchemes((prev) =>
                            prev.filter(
                              (item) =>
                                item._id !== scheme._id
                            )
                          );
                        } catch (error) {
                          console.error(
                            "REMOVE SAVED SCHEME ERROR:",
                            error
                          );

                          alert(
                            error.response?.data?.message ||
                              "Failed to remove bookmark"
                          );
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "11px 14px",
                        background: "#E8D8DC",
                        color: "#596052",
                        border: "1px solid #C496A1",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SavedSchemes;
