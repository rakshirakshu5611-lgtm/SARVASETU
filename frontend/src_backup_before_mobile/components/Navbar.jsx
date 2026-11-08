import LanguageSelector from "./LanguageSelector";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

import nationalEmblem from "../assets/national-emblem.png";
import sarvasetuLogo from "../assets/sarvasetu-logo.png";

function Navbar() {
  const [dark, setDark] = useState(false);

  const { t } = useLanguage();

  return (
    <nav
      className="w-full px-4 sm:px-6 lg:px-8 py-3"
      style={{
        background: "#F2EEE1",
        borderBottom: "1px solid #C8C1AA",
      }}
    >
      <div
        className="
          max-w-7xl mx-auto
          flex flex-col lg:flex-row
          items-stretch lg:items-center
          justify-between
          gap-4
        "
        style={{
          minHeight: "72px",
        }}
      >

        {/* =====================================================
            TOP / BRANDING
        ====================================================== */}

        <div className="flex items-center justify-between gap-3 w-full lg:w-auto">

          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            style={{
              textDecoration: "none",
              gap: "10px",
            }}
          >

            {/* NATIONAL EMBLEM */}

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

            {/* VERTICAL DIVIDER */}

            <div
              style={{
                width: "1px",
                height: "42px",
                background: "#C8C1AA",
                flexShrink: 0,
              }}
            />

            {/* SARVASETU LOGO */}

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

          {/* MOBILE LANGUAGE */}

          <div className="lg:hidden flex-shrink-0">
            <LanguageSelector />
          </div>
        </div>


        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div
          className="
            flex items-center
            rounded-xl
            px-4 py-2.5
            w-full
            lg:flex-1
            lg:max-w-[390px]
            order-3 lg:order-none
          "
          style={{
            background: "#F7F1E3",
            border: "1px solid #C8C1AA",
          }}
        >
          <input
            type="text"
            placeholder={t("searchSchemes")}
            className="bg-transparent outline-none w-full text-sm"
            style={{
              color: "#3E4435",
              background: "transparent",
              border: "none",
            }}
          />
        </div>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div
          className="
            flex items-center
            justify-between
            lg:justify-end
            gap-2 sm:gap-3
            w-full lg:w-auto
            order-2 lg:order-none
          "
          style={{
            flexShrink: 0,
          }}
        >

          {/* DESKTOP LANGUAGE */}

          <div className="hidden lg:block">
            <LanguageSelector />
          </div>


          {/* DARK MODE */}

          <button
            onClick={() => setDark(!dark)}
            className="
              rounded-lg
              px-3 py-2
              transition-all duration-200
              flex-1 lg:flex-none
            "
            style={{
              background: dark
                ? "#596B5A"
                : "#E1E5DB",
              color: dark
                ? "#FFFFFF"
                : "#596B5A",
              border: "1px solid #C8C1AA",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            aria-label="Toggle dark mode"
          >
            {dark ? "Light" : "Dark"}
          </button>


          {/* LOGIN */}

          <Link
            to="/login"
            className="flex-1 lg:flex-none"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              className="
                w-full
                px-4 sm:px-5
                py-2.5
                rounded-lg
                font-semibold
                transition-all duration-200
              "
              style={{
                background: "transparent",
                color: "#596B5A",
                border: "1px solid #596B5A",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E1E5DB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {t("login")}
            </button>
          </Link>


          {/* REGISTER */}

          <Link
            to="/register"
            className="flex-1 lg:flex-none"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              className="
                w-full
                px-4 sm:px-5
                py-2.5
                rounded-lg
                font-semibold
                transition-all duration-200
              "
              style={{
                background: "#C496A1",
                color: "#FFFFFF",
                border: "1px solid #C496A1",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#B78692";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C496A1";
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