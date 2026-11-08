
import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import "./SchemeDetails.css";

// =====================================================
// SAFE URL VALIDATION
// =====================================================

const isSafeHttpUrl = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

function SchemeDetails() {
  const { t } = useLanguage();

  const { id } = useParams();
  const location = useLocation();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] =
    useState(false);

  // =====================================================
  // FETCH SCHEME
  // =====================================================

  useEffect(() => {
    fetchScheme();
  }, [id]);

  const fetchScheme = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/schemes/${id}`);

      if (res.data.success === false) {
        setError(
          res.data.message ||
            t("failedToLoadScheme")
        );
        return;
      }

      setScheme(res.data.scheme);
    } catch (err) {
      console.error(
        "SCHEME DETAILS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("failedToLoadScheme")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BOOKMARK
  // =====================================================

  const handleBookmark = async () => {
    try {
      setBookmarkLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login to save a scheme."
        );
        return;
      }

      await API.post(
        `/saved-schemes/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookmarked(true);
    } catch (err) {
      console.error(
        "SAVE SCHEME ERROR:",
        err
      );

      if (
        err.response?.data?.message ===
        "Scheme already saved"
      ) {
        setBookmarked(true);
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to save scheme"
        );
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  // =====================================================
  // BACK NAVIGATION
  // =====================================================

  const backLink =
    location.state?.from === "schemes"
      ? "/schemes"
      : "/recommend";

  const backText =
    location.state?.from === "schemes"
      ? t("backToGovernmentSchemes")
      : t("backToRecommendations");

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="sd-page">
        <div className="sd-centered-card">
          <div className="sd-loading-line" />

          <h2>
            {t("loadingSchemeDetails")}
          </h2>

          <p>
            {t(
              "pleaseWaitFetchingInformation"
            )}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="sd-page">
        <div className="sd-container">

          <Link
            to={backLink}
            className="sd-back-link"
          >
            {backText}
          </Link>

          <div className="sd-centered-card sd-error-card">

            <div className="sd-state-label">
              Unable to load
            </div>

            <h1>
              {t("unableToLoadScheme")}
            </h1>

            <p>{error}</p>

            <button
              type="button"
              className="sd-primary-button"
              onClick={fetchScheme}
            >
              {t("tryAgain")}
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!scheme) {
    return (
      <div className="sd-page">
        <div className="sd-centered-card">

          <div className="sd-state-label">
            Scheme
          </div>

          <h2>
            {t("schemeNotFound")}
          </h2>

          <Link
            to={backLink}
            className="sd-primary-button sd-button-link"
          >
            {backText}
          </Link>

        </div>
      </div>
    );
  }

  // =====================================================
  // SAFE URLS
  // =====================================================

  const safeSourceUrl =
    isSafeHttpUrl(scheme.sourceUrl)
      ? scheme.sourceUrl
      : "";

  const safeServiceUrl =
    isSafeHttpUrl(scheme.serviceUrl)
      ? scheme.serviceUrl
      : "";

  const safeApplyLink =
    isSafeHttpUrl(scheme.applyLink)
      ? scheme.applyLink
      : "";

  // =====================================================
  // NORMALIZED VALUES
  // =====================================================

  const stateValue =
    scheme.state &&
    String(scheme.state).toLowerCase() !==
      "all"
      ? scheme.state
      : "All States";

  const occupationValue =
    scheme.occupation &&
    String(scheme.occupation).toLowerCase() !==
      "all"
      ? scheme.occupation
      : "All";

  const genderValue =
    scheme.gender &&
    String(scheme.gender).toLowerCase() !==
      "all"
      ? scheme.gender
      : "All";

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="sd-page">

      <div className="sd-container">

        {/* BACK */}

        <Link
          to={backLink}
          className="sd-back-link"
        >
          {backText}
        </Link>

        {/* HERO */}

        <section className="sd-hero">

          <div className="sd-hero-content">

            <div className="sd-hero-top">

              <span className="sd-category">
                {scheme.category ||
                  t("governmentScheme")}
              </span>

              <span className="sd-government-level">
                {scheme.governmentLevel ||
                  "Government Scheme"}
              </span>

            </div>

            <h1>
              {scheme.schemeName}
            </h1>

            <p className="sd-department">
              {scheme.department ||
                t("governmentDepartment")}
            </p>

            <div className="sd-hero-facts">

              <div>
                <span>Government Level</span>
                <strong>
                  {scheme.governmentLevel ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>State</span>
                <strong>
                  {stateValue}
                </strong>
              </div>

              <div>
                <span>Beneficiary</span>
                <strong>
                  {occupationValue}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className={`sd-bookmark-button ${
                bookmarked
                  ? "sd-bookmarked"
                  : ""
              }`}
              onClick={handleBookmark}
              disabled={
                bookmarkLoading ||
                bookmarked
              }
            >
              {bookmarkLoading
                ? "Saving..."
                : bookmarked
                ? "Scheme Saved"
                : "Save Scheme"}
            </button>

          </div>

        </section>

        {/* CONTENT */}

        <main className="sd-content">

          {/* AI RECOMMENDATION */}

          <section className="sd-recommendation">

            <div className="sd-section-kicker">
              SARVASETU RECOMMENDATION
            </div>

            <h2>
              {t("aiRecommendation")}
            </h2>

            <p>
              {t("schemeMatchesProfile")}
            </p>

          </section>

          {/* ABOUT */}

          <Section title={t("aboutThisScheme")}>

            <div className="sd-highlight sd-about">

              <p>
                {scheme.description ||
                  t(
                    "noDescriptionAvailable"
                  )}
              </p>

            </div>

          </Section>

          {/* ELIGIBILITY */}

          <Section title={t("eligibility")}>

            <div className="sd-highlight sd-eligibility">

              <p>
                {scheme.eligibility ||
                  t(
                    "eligibilityInformationUnavailable"
                  )}
              </p>

            </div>

          </Section>

          {/* ELIGIBILITY CRITERIA */}

          <Section
            title={t(
              "eligibilityCriteria"
            )}
          >

            <div className="sd-info-grid">

              <InfoCard
                title={t("state")}
                value={stateValue}
              />

              <InfoCard
                title={t("occupation")}
                value={occupationValue}
              />

              <InfoCard
                title={t("gender")}
                value={genderValue}
              />

              <InfoCard
                title={t("age")}
                value={
                  scheme.minimumAge != null ||
                  scheme.maximumAge != null
                    ? `${scheme.minimumAge ?? 0} - ${
                        scheme.maximumAge ?? 100
                      } ${t("years")}`
                    : "Not specified"
                }
              />

              <InfoCard
                title={t(
                  "maximumIncome"
                )}
                value={
                  scheme.maximumIncome !=
                    null &&
                  Number(
                    scheme.maximumIncome
                  ) <
                    99999999
                    ? `₹${Number(
                        scheme.maximumIncome
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    : t("noIncomeLimit")
                }
              />

              <InfoCard
                title="Land Ownership"
                value={
                  scheme.requiresLandOwnership
                    ? "Required"
                    : "Not Required"
                }
              />

            </div>

          </Section>

          {/* BENEFITS */}

          <Section title={t("benefits")}>

            <div className="sd-highlight sd-benefits">

              <p>
                {scheme.benefits ||
                  t(
                    "benefitInformationUnavailable"
                  )}
              </p>

            </div>

          </Section>

          {/* DOCUMENTS */}

          <Section
            title={t(
              "documentsRequired"
            )}
          >

            {Array.isArray(
              scheme.documents
            ) &&
            scheme.documents.length > 0 ? (

              <div className="sd-document-grid">

                {scheme.documents.map(
                  (doc, index) => (
                    <div
                      className="sd-document"
                      key={index}
                    >
                      {doc}
                    </div>
                  )
                )}

              </div>

            ) : (

              <div className="sd-muted-box">

                <p>
                  {t(
                    "noDocumentsSpecified"
                  )}
                </p>

              </div>

            )}

          </Section>

          {/* OFFICIAL SOURCE */}

          <Section
            title={t(
              "officialGovernmentSource"
            )}
          >

            <div className="sd-source-card">

              <div>

                <span className="sd-card-label">
                  Official Source
                </span>

                <h3>
                  {scheme.sourceName ||
                    "Government source"}
                </h3>

                <p>
                  Information is linked to
                  the official source provided
                  for this scheme.
                </p>

              </div>

              {safeSourceUrl ? (

                <a
                  href={safeSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sd-outline-button"
                >
                  Visit Official Website
                </a>

              ) : (

                <div className="sd-unavailable">
                  Official source link is
                  unavailable.
                </div>

              )}

            </div>

          </Section>

          {/* GOVERNMENT SERVICE */}

          {scheme.serviceUrl && (

            <Section title="Government Service">

              <div className="sd-service-card">

                <div>

                  <span className="sd-card-label">
                    Official Service
                  </span>

                  <h3>
                    {scheme.serviceName ||
                      "Government Service"}
                  </h3>

                  <p>
                    {scheme.serviceDescription ||
                      "Access the official government service related to this scheme."}
                  </p>

                </div>

                {safeServiceUrl ? (

                  <a
                    href={safeServiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sd-service-button"
                  >
                    Access Government Service
                  </a>

                ) : (

                  <div className="sd-unavailable">
                    Government service link is
                    unavailable.
                  </div>

                )}

              </div>

            </Section>

          )}

          {/* APPLICATION */}

          <section className="sd-apply-section">

            <div>

              <div className="sd-section-kicker">
                ACCESS
              </div>

              <h2>
                {t("applyForThisScheme")}
              </h2>

              <p>
                {t(
                  "useOfficialApplicationWebsite"
                )}
              </p>

            </div>

            {safeApplyLink ? (

              <a
                href={safeApplyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="sd-apply-button"
              >
                {t("applyNow")}
              </a>

            ) : (

              <div className="sd-unavailable">
                {t(
                  "applicationLinkUnavailable"
                )}
              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
}

// =====================================================
// SECTION COMPONENT
// =====================================================

function Section({
  title,
  children,
}) {
  return (
    <section className="sd-section">

      <h2 className="sd-section-title">
        {title}
      </h2>

      {children}

    </section>
  );
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
  title,
  value,
}) {
  return (
    <div className="sd-info-card">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default SchemeDetails;
