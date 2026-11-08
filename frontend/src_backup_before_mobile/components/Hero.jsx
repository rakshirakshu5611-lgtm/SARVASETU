
import { useLanguage } from "../i18n/LanguageContext";
import { useNavigate } from "react-router-dom";

function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section
      className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
      style={{ background: "#F7F1E3" }}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: Hero Content */}
        <div>
          <div
            className="mb-7 inline-block rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: "#E1E5DB",
              color: "#596B5A",
              border: "1px solid #C8C1AA",
            }}
          >
            SARVASETU
          </div>

          <h1
            className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            style={{ color: "#3E4435" }}
          >
            {t("oneNation")}
            <br />
            <span style={{ color: "#596B5A" }}>
              {t("endlessOpportunities")}
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: "#6B6F63" }}
          >
            {t("heroDescription")}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/schemes")}
              className="rounded-xl px-7 py-4 font-semibold text-white transition-colors"
              style={{
                background: "#596B5A",
                border: "1px solid #596B5A",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#465647";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#596B5A";
              }}
            >
              {t("findMySchemes")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/schemes")}
              className="rounded-xl px-7 py-4 font-semibold transition-colors"
              style={{
                background: "transparent",
                color: "#596B5A",
                border: "1px solid #596B5A",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E1E5DB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {t("exploreServices")}
            </button>
          </div>

          <div
            className="mt-10 h-1 w-20 rounded-full"
            style={{ background: "#C496A1" }}
          />
        </div>

        {/* RIGHT: SARVASETU Landscape Image */}
        <div className="flex w-full items-center justify-center">
          <div
            className="w-full overflow-hidden rounded-3xl"
            style={{
              background: "#F2EEE1",
              border: "1px solid #C8C1AA",
              boxShadow: "0 18px 45px rgba(62, 68, 53, 0.10)",
            }}
          >
            <img
              src="/images/sarvasetu-landscape.png"
              alt="SARVASETU — connecting people across India with opportunities"
              className="block h-auto w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;