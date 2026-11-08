
import LanguageSelector from "./LanguageSelector";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

import nationalEmblem from "../assets/national-emblem.png";
import sarvasetuLogo from "../assets/sarvasetu-logo.png";

function Navbar() {
  const [dark, setDark] = useState(
    () => document.documentElement.dataset.theme === "dark"
  );

  const { t } = useLanguage();

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <nav
      className="w-full px-4 sm:px-6 lg:px-8 py-3"
      style={{
        background: dark ? "#252B25" : "#F2EEE1",
        color: dark ? "#F7F1E3" : "#3E4435",
        borderBottom: `1px solid ${dark ? "#596B5A" : "#C8C1AA"}`,
      }}
    >
      <div
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4"
        style={{ minHeight: "72px" }}
      >
        <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            style={{ textDecoration: "none", gap: "10px" }}
          >
            <div
              style={{
                width: "38px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={nationalEmblem}
                alt="National Emblem of India"
                style={{
                  width: "36px",
                  height: "46px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <div
              style={{
                width: "1px",
                height: "42px",
                background: dark ? "#596B5A" : "#C8C1AA",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                width: "125px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                src={sarvasetuLogo}
                alt="SARVASETU"
                style={{
                  width: "125px",
                  height: "56px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </Link>

          <div className="lg:hidden flex-shrink-0">
            <LanguageSelector />
          </div>
        </div>

        <div
          className="flex items-center rounded-xl px-4 py-2.5 w-full lg:flex-1 lg:max-w-[390px] order-3 lg:order-none"
          style={{
            background: dark ? "#343C34" : "#F7F1E3",
            border: `1px solid ${dark ? "#596B5A" : "#C8C1AA"}`,
          }}
        >
          <input
            type="text"
            placeholder={t("searchSchemes")}
            className="bg-transparent outline-none w-full text-sm"
            style={{
              color: dark ? "#F7F1E3" : "#3E4435",
              border: "none",
            }}
          />
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 w-full lg:w-auto order-2 lg:order-none">
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>

          <button
            onClick={() => setDark((current) => !current)}
            className="rounded-lg px-3 py-2 transition-all duration-200 flex-1 lg:flex-none"
            style={{
              background: dark ? "#596B5A" : "#E1E5DB",
              color: dark ? "#FFFFFF" : "#596B5A",
              border: "1px solid #C8C1AA",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            aria-label="Toggle dark mode"
            aria-pressed={dark}
          >
            {dark ? "Light" : "Dark"}
          </button>

          <Link
            to="/login"
            className="flex-1 lg:flex-none"
            style={{ textDecoration: "none" }}
          >
            <button
              className="w-full px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition-all duration-200"
              style={{
                background: "transparent",
                color: dark ? "#F7F1E3" : "#596B5A",
                border: `1px solid ${dark ? "#C8C1AA" : "#596B5A"}`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t("login")}
            </button>
          </Link>

          <Link
            to="/register"
            className="flex-1 lg:flex-none"
            style={{ textDecoration: "none" }}
          >
            <button
              className="w-full px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition-all duration-200"
              style={{
                background: "#C496A1",
                color: "#FFFFFF",
                border: "1px solid #C496A1",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t("register")}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
