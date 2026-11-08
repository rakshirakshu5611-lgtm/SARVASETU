import { useLanguage } from "../i18n/LanguageContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function GovUpdateDetails() {
  const { id } = useParams();
  const { t } = useLanguage();

  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH GOVERNMENT UPDATE
  // ==========================================

  useEffect(() => {
    fetchUpdate();
  }, [id]);

  const fetchUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/updates/${id}`
      );

      console.log("GOVERNMENT UPDATE:", res.data);

      setUpdate(res.data.update);

      // ==========================================
      // MARK UPDATE AS SEEN FOR CURRENT USER
      // ==========================================

      const token = localStorage.getItem("token");

      if (token) {
        try {
          const seenRes = await axios.put(
            `http://localhost:5000/api/user-updates/seen/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(
            "UPDATE MARKED AS SEEN:",
            seenRes.data
          );
        } catch (seenError) {
          console.log(
            "MARK UPDATE AS SEEN ERROR:",
            seenError
          );
        }
      }
    } catch (error) {
      console.log(
        "FETCH GOVERNMENT UPDATE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          t("failedToLoadGovernmentUpdate")
      );
    } finally {
      setLoading(false);
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
            borderRadius: "20px",
            padding: "42px 32px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "5px",
              background: "#C8C1AA",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "45%",
                height: "100%",
                background: "#596B5A",
                borderRadius: "10px",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {t("loadingGovernmentUpdate")}
          </h2>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#81785A",
              fontSize: "15px",
            }}
          >
            {t("pleaseWait")}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          padding: "50px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "22px",
            padding: "50px 32px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "4px",
              background: "#C496A1",
              margin: "0 auto 24px",
              borderRadius: "10px",
            }}
          />

          <h2
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "25px",
              fontWeight: 700,
            }}
          >
            {error}
          </h2>

          <Link
            to="/government-updates"
            style={{
              display: "inline-block",
              marginTop: "28px",
              background: "#596B5A",
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "13px 24px",
              borderRadius: "10px",
              fontWeight: 600,
              border: "1px solid #596B5A",
            }}
          >
            {t("backToGovernmentUpdates")}
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO UPDATE
  // ==========================================

  if (!update) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F1E3",
          padding: "50px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "22px",
            padding: "50px 32px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(62, 68, 53, 0.08)",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "4px",
              background: "#8E88A3",
              margin: "0 auto 24px",
              borderRadius: "10px",
            }}
          />

          <h2
            style={{
              margin: 0,
              color: "#3E4435",
              fontSize: "25px",
              fontWeight: 700,
            }}
          >
            {t("governmentUpdateNotFound")}
          </h2>

          <Link
            to="/government-updates"
            style={{
              display: "inline-block",
              marginTop: "28px",
              background: "#596B5A",
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "13px 24px",
              borderRadius: "10px",
              fontWeight: 600,
              border: "1px solid #596B5A",
            }}
          >
            {t("backToGovernmentUpdates")}
          </Link>
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
        padding: "28px 20px 60px",
        color: "#3E4435",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* TOP NAVIGATION */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <Link
            to="/government-updates"
            style={{
              color: "#596B5A",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            {t("backToGovernmentUpdates")}
          </Link>
        </div>

        {/* MAIN UPDATE PANEL */}

        <div
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 14px 35px rgba(62, 68, 53, 0.09)",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              background: "#596B5A",
              padding: "34px 34px 32px",
              color: "#FFFFFF",
            }}
          >
            {update.isNew && (
              <div
                style={{
                  display: "inline-block",
                  background: "#C496A1",
                  color: "#3E4435",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  marginBottom: "18px",
                }}
              >
                {t("newUpdate")}
              </div>
            )}

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(28px, 5vw, 42px)",
                lineHeight: 1.2,
                fontWeight: 750,
                letterSpacing: "-0.5px",
              }}
            >
              {update.title}
            </h1>

            {update.category && (
              <div
                style={{
                  display: "inline-block",
                  marginTop: "18px",
                  background: "#EBE1C6",
                  color: "#596B5A",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {update.category}
              </div>
            )}
          </div>

          {/* CONTENT */}

          <div
            style={{
              padding: "34px",
            }}
          >
            {/* DESCRIPTION */}

            <section>
              <div
                style={{
                  borderLeft: "4px solid #C496A1",
                  paddingLeft: "16px",
                  marginBottom: "18px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "21px",
                    fontWeight: 750,
                    color: "#3E4435",
                  }}
                >
                  {t("updateDetails")}
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#596B5A",
                  fontSize: "17px",
                  lineHeight: 1.9,
                  whiteSpace: "pre-line",
                }}
              >
                {update.description}
              </p>
            </section>

            {/* OFFICIAL SOURCE */}

            <section
              style={{
                marginTop: "34px",
                paddingTop: "28px",
                borderTop: "1px solid #C8C1AA",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("officialSource")}
              </p>

              <h3
                style={{
                  margin: "9px 0 0",
                  color: "#3E4435",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {update.sourceName}
              </h3>

              {update.sourceUrl && (
                <a
                  href={update.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "18px",
                    background: "#C496A1",
                    color: "#3E4435",
                    textDecoration: "none",
                    padding: "13px 20px",
                    borderRadius: "10px",
                    fontWeight: 750,
                    border: "1px solid #C496A1",
                  }}
                >
                  {t("visitOfficialSource")}
                </a>
              )}
            </section>

            {/* DATE */}

            {update.publishedDate && (
              <section
                style={{
                  marginTop: "28px",
                  paddingTop: "22px",
                  borderTop: "1px solid #C8C1AA",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#81785A",
                    fontSize: "14px",
                    fontWeight: 650,
                  }}
                >
                  Published
                </p>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#596B5A",
                    fontSize: "15px",
                  }}
                >
                  {new Date(
                    update.publishedDate
                  ).toLocaleDateString()}
                </p>
              </section>
            )}

            {/* SEEN STATUS */}

            <div
              style={{
                marginTop: "30px",
                background: "#E1E5DB",
                border: "1px solid #C8C1AA",
                borderRadius: "12px",
                padding: "15px 18px",
                color: "#596B5A",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {t("updateViewedSuccessfully")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovUpdateDetails;