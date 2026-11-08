
import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../i18n/LanguageContext";
import { useToast } from "../components/ToastContext";
import { useNavigate } from "react-router-dom";

function FeaturedSchemes() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSchemes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/schemes/all"
        );

        if (isMounted) {
          setSchemes(response.data.schemes || []);
        }
      } catch (error) {
        console.error("Failed to load schemes:", error);

        if (isMounted) {
          showToast(
            t("failedToLoadSchemes"),
            "error"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSchemes();

    return () => {
      isMounted = false;
    };
  }, [showToast, t]);

  // SAVE SCHEME WITH DEBUGGING
  const saveScheme = async (schemeId) => {
    console.log("1. SAVE BUTTON CLICKED:", schemeId);

    try {
      const token = localStorage.getItem("token");

      console.log("2. TOKEN EXISTS:", Boolean(token));

      if (!token) {
        console.log("3. LOGIN REQUIRED");

        showToast(
          t("loginRequired"),
          "info"
        );

        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/bookmarks/save",
        { schemeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("4. SAVE API SUCCESS:", response.data);

      showToast(
        "Scheme saved successfully!",
        "success"
      );

      console.log("5. TOAST CALLED");
    } catch (error) {
      console.error("SAVE ERROR:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to save scheme.",
        "error"
      );
    }
  };

  const hasValue = (value) =>
    value !== undefined &&
    value !== null &&
    String(value).trim() !== "";

  const featuredSchemes = schemes.slice(0, 3);

  return (
    <section className="w-full bg-[#F7F1E3] px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#81785A] sm:text-sm">
              SARVASETU
            </p>

            <h2 className="text-2xl font-bold leading-tight text-[#3E4435] sm:text-3xl lg:text-4xl">
              {t("featuredSchemes")}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#596B5A] sm:text-base">
              {t("featuredSchemesDescription")}
            </p>
          </div>
        </div>

        {/* LOADING AND EMPTY STATES */}
        {loading ? (
          <div className="rounded-2xl border border-[#C8C1AA] bg-[#F2EEE1] px-4 py-10 text-center sm:py-14">
            <p className="text-sm text-[#596B5A] sm:text-base">
              {t("loading")}
            </p>
          </div>
        ) : schemes.length === 0 ? (
          <div className="rounded-2xl border border-[#C8C1AA] bg-[#F2EEE1] px-4 py-10 text-center sm:py-14">
            <p className="text-sm text-[#596B5A] sm:text-base">
              {t("noSchemesFound")}
            </p>
          </div>
        ) : (
          <>
            {/* FEATURED SCHEME CARDS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {featuredSchemes.map((scheme) => (
                <article
                  key={scheme._id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#C8C1AA] bg-[#F2EEE1] shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="h-1.5 w-full bg-[#919D85]" />

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* CATEGORY */}
                    {hasValue(scheme.category) && (
                      <div className="mb-4">
                        <span className="inline-block max-w-full break-words rounded-full border border-[#C8C1AA] bg-[#EBE1C6] px-3 py-1 text-xs font-medium text-[#596B5A]">
                          {scheme.category}
                        </span>
                      </div>
                    )}

                    {/* SCHEME NAME */}
                    {hasValue(scheme.name) && (
                      <h3 className="break-words text-lg font-semibold leading-snug text-[#3E4435] sm:text-xl">
                        {scheme.name}
                      </h3>
                    )}

                    {/* DESCRIPTION */}
                    {hasValue(scheme.description) && (
                      <p className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-6 text-[#596B5A]">
                        {scheme.description}
                      </p>
                    )}

                    {/* BENEFITS AND ELIGIBILITY */}
                    {(hasValue(scheme.benefits) ||
                      hasValue(scheme.eligibility)) && (
                      <div className="mt-5 space-y-3 border-t border-[#C8C1AA] pt-4">
                        {hasValue(scheme.benefits) && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#81785A]">
                              {t("benefits")}
                            </p>

                            <p className="mt-1 break-words text-sm leading-5 text-[#3E4435]">
                              {scheme.benefits}
                            </p>
                          </div>
                        )}

                        {hasValue(scheme.eligibility) && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#81785A]">
                              {t("eligibility")}
                            </p>

                            <p className="mt-1 break-words text-sm leading-5 text-[#3E4435]">
                              {scheme.eligibility}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="mt-6 flex flex-col gap-3">
                      {hasValue(scheme.applicationLink) && (
                        <a
                          href={scheme.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#596B5A] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#465647] focus:outline-none focus:ring-2 focus:ring-[#919D85] focus:ring-offset-2"
                        >
                          {t("applyNow")}
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => saveScheme(scheme._id)}
                        className="min-h-11 w-full rounded-xl border border-[#919D85] bg-transparent px-4 py-3 text-sm font-semibold text-[#3E4435] transition-colors hover:bg-[#EBE1C6] focus:outline-none focus:ring-2 focus:ring-[#919D85] focus:ring-offset-2"
                      >
                        {t("saveScheme")}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* VIEW ALL SCHEMES */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/schemes")}
                className="rounded-xl border border-[#919D85] px-6 py-3 font-semibold text-[#3E4435] transition-colors hover:bg-[#EBE1C6] focus:outline-none focus:ring-2 focus:ring-[#919D85] focus:ring-offset-2"
              >
                View All Schemes
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedSchemes;
