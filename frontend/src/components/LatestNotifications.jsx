
import { useEffect, useState } from "react";
import API from "../api";
import { useLanguage } from "../i18n/LanguageContext";

function LatestNotifications() {
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/all");

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  return (
    <section
      className="w-full min-w-0 px-4 py-12 sm:px-8 sm:py-16 lg:py-20"
      style={{ background: "#EBE1C6" }}
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

        {/* Responsive Notifications */}
        {notifications.length === 0 ? (
          <div
            className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
            style={{
              background: "#F7F1E3",
              border: "1px solid #C8C1AA",
            }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "#6F7268" }}
            >
              {t("noNotificationsAvailable")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {notifications.map((item) => (
              <article
                key={item._id}
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
                  background: "#F7F1E3",
                  border: "1px solid #C8C1AA",
                }}
                onMouseEnter={(e) => {
                  if (window.matchMedia("(hover: hover)").matches) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 14px 30px rgba(62, 68, 53, 0.10)";
                    e.currentTarget.style.borderColor = "#919D85";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#C8C1AA";
                }}
              >
                {/* Notification Type */}
                {item.type && (
                  <div className="mb-4">
                    <span
                      className="inline-block max-w-full px-3 py-1 rounded-full text-xs font-semibold break-words"
                      style={{
                        background: "#E1E5DB",
                        color: "#596B5A",
                        border: "1px solid #C8CFC1",
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3
                  className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug break-words"
                  style={{ color: "#3E4435" }}
                >
                  {item.title}
                </h3>

                <div
                  className="w-9 sm:w-10 h-px my-4"
                  style={{ background: "#C496A1" }}
                />

                {/* Message */}
                <p
                  className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-line"
                  style={{ color: "#6F7268" }}
                >
                  {item.message}
                </p>

                {/* Read More */}
                {item.link && (
                  <div className="mt-auto pt-5 sm:pt-6">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        w-full
                        sm:w-auto
                        items-center
                        justify-center
                        text-center
                        px-5
                        sm:px-6
                        py-3
                        rounded-lg
                        sm:rounded-xl
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
                        background: "#596B5A",
                        color: "#FFFFFF",
                        border: "1px solid #596B5A",
                      }}
                      onMouseEnter={(e) => {
                        if (window.matchMedia("(hover: hover)").matches) {
                          e.currentTarget.style.background = "#4C5D4D";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#596B5A";
                      }}
                    >
                      {t("readMore")}
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestNotifications;
