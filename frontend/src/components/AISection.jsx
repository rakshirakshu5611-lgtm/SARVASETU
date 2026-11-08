console.log("AISection.jsx loaded");
import { useLanguage } from "../i18n/LanguageContext";

function AISection() {
  const { t } = useLanguage();

  return (
    <section
      className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-10"
      style={{
        background: "#596B5A",
      }}
    >
      <div
        className="
          max-w-6xl
          mx-auto
          w-full
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
          sm:gap-10
          lg:gap-12
          items-center
        "
      >
        {/* Left Side */}
        <div className="w-full min-w-0">
          <div
            className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6"
            style={{
              background: "#E1E5DB",
              color: "#596B5A",
            }}
          >
            SARVASETU AI
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
            style={{
              color: "#FFFFFF",
            }}
          >
            {t("aiPoweredSchemeFinder")}
          </h2>

          <p
            className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl"
            style={{
              color: "#E7EBE2",
            }}
          >
            {t("aiSchemeFinderDescription")}
          </p>

          <button
            type="button"
            className="mt-6 sm:mt-8 w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: "#EBE1C6",
              color: "#596B5A",
              border: "1px solid #EBE1C6",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F2EEE1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#EBE1C6";
            }}
          >
            {t("startAIRecommendation")}
          </button>
        </div>

        {/* Right Side: Recommendation Form */}
        <div
          className="w-full min-w-0 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9"
          style={{
            background: "#F2EEE1",
            border: "1px solid #C8C1AA",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.14)",
          }}
        >
          <h3
            className="text-xl sm:text-2xl font-bold mb-5 sm:mb-7 leading-snug"
            style={{
              color: "#3E4435",
            }}
          >
            {t("findSchemesInSeconds")}
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <input
              type="number"
              min="1"
              max="120"
              aria-label={t("age")}
              placeholder={t("age")}
              className="w-full min-w-0 rounded-xl p-3.5 outline-none transition-all text-base"
              style={{
                background: "#FFFFFF",
                color: "#3E4435",
                border: "1px solid #C8C1AA",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#919D85";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#C8C1AA";
              }}
            />

            <input
              type="text"
              aria-label={t("state")}
              placeholder={t("state")}
              className="w-full min-w-0 rounded-xl p-3.5 outline-none transition-all text-base"
              style={{
                background: "#FFFFFF",
                color: "#3E4435",
                border: "1px solid #C8C1AA",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#919D85";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#C8C1AA";
              }}
            />

            <input
              type="text"
              aria-label={t("occupation")}
              placeholder={t("occupation")}
              className="w-full min-w-0 rounded-xl p-3.5 outline-none transition-all text-base"
              style={{
                background: "#FFFFFF",
                color: "#3E4435",
                border: "1px solid #C8C1AA",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#919D85";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#C8C1AA";
              }}
            />

            <select
              defaultValue=""
              aria-label={t("gender")}
              className="w-full min-w-0 rounded-xl p-3.5 outline-none transition-all text-base"
              style={{
                background: "#FFFFFF",
                color: "#3E4435",
                border: "1px solid #C8C1AA",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#919D85";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#C8C1AA";
              }}
            >
              <option value="" disabled>
                {t("gender")}
              </option>
              <option value="Male">{t("male")}</option>
              <option value="Female">{t("female")}</option>
              <option value="Other">{t("other")}</option>
            </select>

            <button
              type="button"
              className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200"
              style={{
                background: "#C496A1",
                color: "#FFFFFF",
                border: "1px solid #C496A1",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#B78692";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C496A1";
              }}
            >
              {t("recommendSchemes")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AISection;
