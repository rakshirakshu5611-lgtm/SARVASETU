
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function AccountDeletionNotice() {
  const { token } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadNotice = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/account-deletion-notices/${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load this account notice."
          );
        }

        setNotice(data.notice);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Unable to connect to SARVASETU. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadNotice();

    return () => controller.abort();
  }, [token]);

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Not available"
      : date.toLocaleString();
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.logoMark} aria-hidden="true">
          S
        </div>

        <p style={styles.eyebrow}>SARVASETU · ACCOUNT NOTICE</p>
        <h1 style={styles.heading}>Account deletion notice</h1>

        <p style={styles.intro}>
          This page provides information about an account action taken on
          SARVASETU.
        </p>

        {loading && (
          <div style={styles.status} role="status">
            Loading your notice…
          </div>
        )}

        {!loading && error && (
          <div style={styles.error} role="alert">
            <h2 style={styles.sectionHeading}>Notice unavailable</h2>
            <p>{error}</p>
            <p>
              The link may be invalid or expired. If you need assistance,
              contact the SARVASETU support team.
            </p>
          </div>
        )}

        {!loading && notice && (
          <>
            <div style={styles.noticeBox}>
              <p style={styles.label}>Notice for</p>
              <p style={styles.value}>{notice.name}</p>

              <p style={styles.label}>Registered email</p>
              <p style={styles.value}>{notice.email}</p>

              <p style={styles.label}>Notice date</p>
              <p style={styles.value}>{formatDate(notice.createdAt)}</p>

              <div style={styles.divider} />

              <h2 style={styles.sectionHeading}>Details</h2>
              <p style={styles.message}>{notice.message}</p>

              <p style={styles.expiry}>
                This secure notice link expires on{" "}
                {formatDate(notice.expiresAt)}.
              </p>
            </div>

            <p style={styles.privacy}>
              Keep this link private. Anyone who has access to it may be able
              to view this notice until it expires.
            </p>
          </>
        )}

        <Link to="/" style={styles.homeLink}>
          Return to SARVASETU
        </Link>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} SARVASETU
        </footer>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background: "#f5f3ed",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    color: "#292d27",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    boxSizing: "border-box",
    padding: "clamp(24px, 5vw, 44px)",
    background: "#ffffff",
    border: "1px solid #e8e5dc",
    borderRadius: "20px",
    boxShadow: "0 18px 60px rgba(40, 45, 35, 0.08)",
  },
  logoMark: {
    width: "44px",
    height: "44px",
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",
    background: "#e8eee4",
    color: "#365b43",
    fontSize: "23px",
    fontWeight: 800,
  },
  eyebrow: {
    marginTop: "24px",
    color: "#61745f",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.8px",
  },
  heading: {
    margin: "10px 0 12px",
    fontSize: "clamp(27px, 5vw, 36px)",
    lineHeight: 1.2,
    letterSpacing: "-1px",
  },
  intro: {
    color: "#686b64",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  status: {
    padding: "18px 0",
    color: "#596653",
  },
  error: {
    marginTop: "24px",
    padding: "18px",
    background: "#fff4f1",
    border: "1px solid #f0d3cc",
    borderRadius: "12px",
    color: "#853c30",
    lineHeight: 1.6,
  },
  noticeBox: {
    marginTop: "24px",
    padding: "22px",
    background: "#fafaf7",
    border: "1px solid #e8e8df",
    borderRadius: "14px",
  },
  label: {
    margin: "14px 0 4px",
    color: "#74786e",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },
  value: {
    margin: "0",
    overflowWrap: "anywhere",
    fontSize: "15px",
    fontWeight: 600,
  },
  divider: {
    height: "1px",
    margin: "22px 0",
    background: "#e5e5dc",
  },
  sectionHeading: {
    margin: "0 0 10px",
    fontSize: "18px",
  },
  message: {
    margin: "0",
    lineHeight: 1.8,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },
  expiry: {
    marginTop: "22px",
    color: "#74786e",
    fontSize: "12px",
    lineHeight: 1.6,
  },
  privacy: {
    marginTop: "18px",
    color: "#74786e",
    fontSize: "12px",
    lineHeight: 1.7,
  },
  homeLink: {
    display: "inline-block",
    marginTop: "22px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#365b43",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
  },
  footer: {
    marginTop: "32px",
    paddingTop: "18px",
    borderTop: "1px solid #efeee8",
    color: "#898b82",
    fontSize: "12px",
  },
};

export default AccountDeletionNotice;
