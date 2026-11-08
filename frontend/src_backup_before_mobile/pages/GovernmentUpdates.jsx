import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function GovernmentUpdates() {
  const { t } = useLanguage();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const markUpdateAsSeen = async (updateId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await axios.put(
        `http://localhost:5000/api/user-updates/seen/${updateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update marked as seen:", updateId);
    } catch (error) {
      console.log(
        "MARK UPDATE SEEN ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const fetchUpdates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/updates/latest"
      );

      setUpdates(res.data.updates || []);
    } catch (error) {
      console.log("FETCH UPDATES ERROR:", error);
      alert(t("failedToLoadGovernmentUpdates"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F7F1E3",
        color: "#3E4435",
        fontFamily: "Inter, Arial, sans-serif",
        padding: "35px 20px 70px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* PAGE HEADER */}

        <section
          style={{
            background: "#596B5A",
            color: "#F7F1E3",
            borderRadius: "24px",
            padding: "38px",
            marginBottom: "28px",
            border: "1px solid #4F604F",
            boxShadow:
              "0 12px 30px rgba(62,68,53,0.12)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#EBE1C6",
              color: "#596B5A",
              padding: "7px 13px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.4px",
              marginBottom: "16px",
            }}
          >
            SARVASETU
          </div>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(30px, 5vw, 42px)",
              lineHeight: "1.15",
              letterSpacing: "-0.8px",
            }}
          >
            {t("governmentUpdates")}
          </h1>

          <p
            style={{
              margin:
                "12px 0 0",
              color: "#E4E7DE",
              maxWidth: "700px",
              fontSize: "15px",
              lineHeight: "1.7",
            }}
          >
            {t(
              "latestGovernmentSchemesScholarshipsJobs"
            )}
          </p>

          <div
            style={{
              width: "70px",
              height: "3px",
              background: "#C496A1",
              marginTop: "22px",
              borderRadius: "10px",
            }}
          />
        </section>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "20px",
              padding: "50px 25px",
              textAlign: "center",
              boxShadow:
                "0 8px 24px rgba(62,68,53,0.06)",
            }}
          >
            <div
              style={{
                width: "180px",
                height: "4px",
                background: "#DCD6C6",
                borderRadius: "10px",
                overflow: "hidden",
                margin:
                  "0 auto 20px",
              }}
            >
              <div
                style={{
                  width: "55%",
                  height: "100%",
                  background: "#C496A1",
                  borderRadius: "10px",
                  animation:
                    "updatesLoading 1.2s ease-in-out infinite",
                }}
              />
            </div>

            <p
              style={{
                margin: 0,
                color: "#6D7467",
                fontSize: "15px",
              }}
            >
              {t("loadingUpdates")}
            </p>

            <style>
              {`
                @keyframes updatesLoading {
                  0% {
                    transform: translateX(-180px);
                  }
                  100% {
                    transform: translateX(330px);
                  }
                }
              `}
            </style>
          </div>
        ) : updates.length === 0 ? (
          /* EMPTY STATE */

          <div
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              borderRadius: "20px",
              padding: "55px 25px",
              textAlign: "center",
              boxShadow:
                "0 8px 24px rgba(62,68,53,0.06)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                color: "#3E4435",
              }}
            >
              {t(
                "noGovernmentUpdatesAvailable"
              )}
            </h2>

            <p
              style={{
                margin:
                  "9px 0 0",
                color: "#6D7467",
              }}
            >
              {t(
                "latestGovernmentSchemesScholarshipsJobs"
              )}
            </p>
          </div>
        ) : (
          /* UPDATES */

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {updates.map((update) => (
              <article
                key={update._id}
                style={{
                  background: "#F2EEE1",
                  border:
                    "1px solid #C8C1AA",
                  borderRadius: "20px",
                  padding: "25px",
                  boxShadow:
                    "0 7px 22px rgba(62,68,53,0.06)",
                }}
              >
                {/* TOP */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 500px",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize:
                          "clamp(20px, 3vw, 25px)",
                        lineHeight: "1.35",
                        color: "#3E4435",
                      }}
                    >
                      {update.title}
                    </h2>

                    {update.category && (
                      <span
                        style={{
                          display:
                            "inline-block",
                          marginTop: "11px",
                          background:
                            "#E1E5DB",
                          color:
                            "#596B5A",
                          padding:
                            "6px 11px",
                          borderRadius:
                            "7px",
                          fontSize: "11px",
                          fontWeight:
                            "800",
                          letterSpacing:
                            "0.2px",
                        }}
                      >
                        {update.category}
                      </span>
                    )}
                  </div>

                  {update.publishedDate && (
                    <div
                      style={{
                        color:
                          "#81785A",
                        fontSize:
                          "12px",
                        fontWeight:
                          "700",
                        background:
                          "#EBE1C6",
                        border:
                          "1px solid #D5C8A9",
                        padding:
                          "7px 10px",
                        borderRadius:
                          "7px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {new Date(
                        update.publishedDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}

                <p
                  style={{
                    color:
                      "#5F665A",
                    margin:
                      "18px 0 0",
                    lineHeight:
                      "1.75",
                    fontSize: "15px",
                  }}
                >
                  {update.description}
                </p>

                {/* SOURCE */}

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop:
                      "1px solid #D8D1C0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color:
                        "#81785A",
                      fontSize:
                        "13px",
                    }}
                  >
                    {t("source")}:{" "}
                    <strong
                      style={{
                        color:
                          "#596B5A",
                      }}
                    >
                      {update.sourceName}
                    </strong>
                  </p>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      flexWrap: "wrap",
                      marginTop: "15px",
                    }}
                  >
                    <a
                      href={
                        update.sourceUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display:
                          "inline-block",
                        background:
                          "#596B5A",
                        color:
                          "#FFFFFF",
                        padding:
                          "10px 17px",
                        borderRadius:
                          "9px",
                        textDecoration:
                          "none",
                        fontSize:
                          "13px",
                        fontWeight:
                          "700",
                      }}
                    >
                      {t(
                        "viewOfficialSource"
                      )}
                    </a>

                    <Link
                      to={`/government-update/${update._id}`}
                      onClick={() =>
                        markUpdateAsSeen(
                          update._id
                        )
                      }
                      style={{
                        display:
                          "inline-block",
                        background:
                          "#C496A1",
                        color:
                          "#FFFFFF",
                        padding:
                          "10px 17px",
                        borderRadius:
                          "9px",
                        textDecoration:
                          "none",
                        fontSize:
                          "13px",
                        fontWeight:
                          "800",
                      }}
                    >
                      {t(
                        "viewDetails"
                      )}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GovernmentUpdates;