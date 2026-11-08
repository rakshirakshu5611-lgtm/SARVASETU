
import { useLanguage } from "../i18n/LanguageContext";

const categoryStyles = [
  {
    icon: "graduation-cap",
    background: "#E5EADF",
    accent: "#596B5A",
    border: "#C4CEBE",
    description: "Scholarships and student support",
  },
  {
    icon: "briefcase-business",
    background: "#F2E3E7",
    accent: "#A86E7D",
    border: "#DCC0C7",
    description: "Jobs, skills and employment",
  },
  {
    icon: "sprout",
    background: "#F3EAD0",
    accent: "#81785A",
    border: "#D9CBA8",
    description: "Farmer and rural welfare",
  },
  {
    icon: "heart-pulse",
    background: "#E8E5EF",
    accent: "#77718F",
    border: "#CEC9D9",
    description: "Healthcare and medical support",
  },
  {
    icon: "house",
    background: "#EAE6D9",
    accent: "#81785A",
    border: "#D5CCB5",
    description: "Housing and shelter assistance",
  },
  {
    icon: "users-round",
    background: "#F2E3E7",
    accent: "#A86E7D",
    border: "#DCC0C7",
    description: "Women and child welfare",
  },
  {
    icon: "landmark",
    background: "#E5EADF",
    accent: "#596B5A",
    border: "#C4CEBE",
    description: "Public services and citizen benefits",
  },
  {
    icon: "laptop",
    background: "#E8E5EF",
    accent: "#77718F",
    border: "#CEC9D9",
    description: "Digital access and online services",
  },
];

function CategoryIcon({ name }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    "graduation-cap": (
      <>
        <path d="m2 10 10-5 10 5-10 5-10-5Z" />
        <path d="M6 12v5c4 3 8 3 12 0v-5" />
        <path d="M22 10v6" />
      </>
    ),
    "briefcase-business": (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
      </>
    ),
    sprout: (
      <>
        <path d="M12 21v-9" />
        <path d="M12 13C5 13 4 8 4 4c5 0 10 2 8 9Z" />
        <path d="M12 17c0-6 3-9 8-9 0 5-2 9-8 9Z" />
      </>
    ),
    "heart-pulse": (
      <>
        <path d="M20.8 8.6c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />
        <path d="M3.5 12h4l2-4 3.2 8 2-4h5.8" />
      </>
    ),
    house: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9M9 21v-7h6v7" />
      </>
    ),
    "users-round": (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2Z" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.5V20h-4" />
      </>
    ),
    landmark: (
      <>
        <path d="M3 10h18M4 10v9M8 10v9M16 10v9M20 10v9M2 21h20M12 3 2 8h20L12 3Z" />
      </>
    ),
    laptop: (
      <>
        <rect x="4" y="4" width="16" height="12" rx="1.5" />
        <path d="M2 20h20l-2-4H4l-2 4Z" />
      </>
    ),
  };

  return (
    <svg {...common}>
      {paths[name]}
    </svg>
  );
}

function Categories() {
  const { t } = useLanguage();

  const categories = [
    { title: t("education"), code: "01", route: "/schemes" },
    { title: t("jobsEmployment"), code: "02", route: "/schemes" },
    { title: t("agriculture"), code: "03", route: "/schemes" },
    { title: t("healthcare"), code: "04", route: "/schemes" },
    { title: t("housing"), code: "05", route: "/schemes" },
    { title: t("womenChild"), code: "06", route: "/schemes" },
    { title: t("governmentServices"), code: "07", route: "/schemes" },
    { title: t("digitalIndia"), code: "08", route: "/schemes" },
  ];

  return (
    <section className="w-full bg-[#F7F1E3] px-4 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-9 text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#81785A] sm:text-sm">
            SARVASETU
          </p>

          <h2 className="text-3xl font-bold leading-tight text-[#3E4435] sm:text-4xl">
            {t("exploreByCategory")}
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#C496A1]" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6B6F63] sm:text-base">
            Discover benefits and services designed for different needs across India.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {categories.map((cat, index) => {
            const style = categoryStyles[index];

            return (
              <a
                key={cat.code}
                href={cat.route}
                className="group flex min-h-[190px] flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#919D85] focus:ring-offset-2 sm:min-h-[205px] sm:p-6"
                style={{
                  background: "#F2EEE1",
                  borderColor: "#D8D0BB",
                  textDecoration: "none",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = style.accent;
                  event.currentTarget.style.background = style.background;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = "#D8D0BB";
                  event.currentTarget.style.background = "#F2EEE1";
                }}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: style.background,
                      color: style.accent,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    <CategoryIcon name={style.icon} />
                  </div>

                  <span
                    className="pt-1 text-xs font-medium tracking-widest"
                    style={{ color: style.accent }}
                  >
                    {cat.code}
                  </span>
                </div>

                <h3 className="text-lg font-semibold leading-snug text-[#3E4435]">
                  {cat.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-[#6B6F63]">
                  {style.description}
                </p>

                <div
                  className="mt-auto pt-4"
                  style={{ color: style.accent }}
                >
                  <div className="h-px w-10 transition-all duration-300 group-hover:w-full" style={{ background: style.border }} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;