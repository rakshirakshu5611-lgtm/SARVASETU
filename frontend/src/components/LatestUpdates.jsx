import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const updates = [
  {
    id: 1,
    title: "pmInternshipScheme",
    date: "applicationsOpen",
    deadline: "30 Aug 2026",
    isDeadlineTranslation: false,
  },
  {
    id: 2,
    title: "nationalScholarshipPortal",
    date: "scholarshipRegistration",
    deadline: "15 Sept 2026",
    isDeadlineTranslation: false,
  },
  {
    id: 3,
    title: "pmAwasYojana",
    date: "newBeneficiaryListReleased",
    deadline: "checkNow",
    isDeadlineTranslation: true,
  },
];

function LatestUpdates() {
  const { t } = useLanguage();

  const [seenUpdates, setSeenUpdates] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("seenGovernmentUpdates") || "[]"
      );
    } catch {
      return [];
    }
  });

  const handleReadMore = (id) => {
    let updatedSeen = seenUpdates;

    if (!seenUpdates.includes(id)) {
      updatedSeen = [...seenUpdates, id];

      try {
        localStorage.setItem(
          "seenGovernmentUpdates",
          JSON.stringify(updatedSeen)
        );
      } catch (error) {
        console.error("Unable to save seen updates:", error);
      }

      setSeenUpdates(updatedSeen);
    }

    alert(t("governmentUpdateMarkedSeen"));
  };

  return (
    <section
      className="w-full min-w-0 px-4 py-12 sm:px-8 sm:py-16 lg:py-20"
      style={{ background: "#F7F1E3" }}
    >
      <div className="w-full max-w-6xl mx-auto min-w-0">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <p
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#81785A" }}
          >
            SARVASETU
          </p>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words"
            style={{ color: "#3E4435" }}
          >
            {t("latestGovernmentUpdates")}
          </h2>

          <div
            className="w-14 sm:w-16 h-1 rounded-full mx-auto mt-4 sm:mt-5"
            style={{ background: "#C496A1" }}
          />
        </div>

        {/* Responsive Update Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {updates.map((item) => {
            const isSeen = seenUpdates.includes(item.id);

            return (
              <article
                key={item.id}
                className="
                  group
                  min-w-0
                  flex
                  flex-col
                  rounded-xl
                  sm:rounded-2xl
                  p-4
                  sm:p-5
                  lg:p-6
                  transition-all
                  duration-300
                "
                style={{
                  background: "#F2EEE1",
                  border: isSeen
                    ? "1px solid #C8C1AA"
                    : "1px solid #919D85",
                }}
                onMouseEnter={(e) => {
                  if (window.matchMedia("(hover: hover)").matches) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 32px rgba(62, 68, 53, 0.10)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Update Status */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <span
                    className="inline-flex max-w-full rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      background: isSeen ? "#E5E3DA" : "#E1E5DB",
                      color: isSeen ? "#777A6E" : "#596B5A",
                    }}
                  >
                    {isSeen ? t("seen") : t("new")}
                  </span>
                </div>

                {/* Update Title */}
                <h3
                  className="text-lg sm:text-xl font-bold leading-snug break-words"
                  style={{ color: "#3E4435" }}
                >
                  {t(item.title)}
                </h3>

                <div
                  className="w-9 sm:w-10 h-px my-4 sm:my-5"
                  style={{ background: "#C496A1" }}
                />

                {/* Update Description */}
                <p
                  className="text-sm leading-relaxed break-words"
                  style={{ color: "#777A6E" }}
                >
                  {t(item.date)}
                </p>

                {/* Deadline */}
                <p
                  className="mt-4 sm:mt-5 text-sm font-semibold leading-relaxed break-words"
                  style={{ color: "#81785A" }}
                >
                  {item.isDeadlineTranslation
                    ? t(item.deadline)
                    : item.deadline}
                </p>

                {/* Action */}
                <div className="mt-auto pt-5 sm:pt-6">
                  <button
                    type="button"
                    onClick={() => handleReadMore(item.id)}
                    className="
                      w-full
                      rounded-lg
                      sm:rounded-xl
                      px-4
                      py-3
                      text-sm
                      sm:text-base
                      font-semibold
                      transition-colors
                      duration-200
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-offset-2
                    "
                    style={{
                      background: isSeen ? "#E1E5DB" : "#596B5A",
                      color: isSeen ? "#596B5A" : "#FFFFFF",
                      border: isSeen
                        ? "1px solid #C8CFC1"
                        : "1px solid #596B5A",
                    }}
                    onMouseEnter={(e) => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        e.currentTarget.style.background = isSeen
                          ? "#D9DED2"
                          : "#4C5D4D";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSeen
                        ? "#E1E5DB"
                        : "#596B5A";
                    }}
                  >
                    {isSeen ? t("seen") : t("readMore")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LatestUpdates;
