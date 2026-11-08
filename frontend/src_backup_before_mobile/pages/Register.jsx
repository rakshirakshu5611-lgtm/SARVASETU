import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import nationalEmblem from "../assets/national-emblem.png";
import sarvasetuLogo from "../assets/sarvasetu-logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.age ||
      !formData.gender
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      console.log("REGISTER RESPONSE:", res.data);

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F1E3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "#3E4435",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          MAIN REGISTER CARD
      ====================================================== */}

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          minHeight: "720px",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 0.9fr) minmax(0, 1.1fr)",
          background: "#F2EEE1",
          border: "1px solid #C8C1AA",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 18px 45px rgba(62, 68, 53, 0.12)",
        }}
      >

        {/* =====================================================
            LEFT BRANDING PANEL
        ====================================================== */}

        <div
          style={{
            background: "#596B5A",
            padding: "55px 46px 42px",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "720px",
            boxSizing: "border-box",
          }}
        >
          <div>

            {/* =================================================
                NATIONAL EMBLEM
            ================================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "42px",
              }}
            >
              <img
                src={nationalEmblem}
                alt="National Emblem of India"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            {/* =================================================
                LARGE SARVASETU LOGO
            ================================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "44px",
              }}
            >
              <img
                src={sarvasetuLogo}
                alt="SARVASETU"
                style={{
                  width: "345px",
                  height: "345px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            {/* =================================================
                ACCENT LINE
            ================================================== */}

            <div
              style={{
                width: "92px",
                height: "5px",
                background: "#C496A1",
                borderRadius: "10px",
                marginBottom: "48px",
              }}
            />

            {/* =================================================
                MAIN HEADING
            ================================================== */}

            <h1
              style={{
                margin: 0,
                color: "#FFFFFF",
                fontSize:
                  "clamp(38px, 4.5vw, 52px)",
                lineHeight: 1.08,
                fontWeight: 750,
                letterSpacing: "-1.5px",
              }}
            >
              Create your
              <br />
              account
            </h1>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <p
              style={{
                margin: "24px 0 0",
                color: "#EBE1C6",
                fontSize: "16px",
                lineHeight: 1.75,
                maxWidth: "450px",
              }}
            >
              Register with SARVASETU to discover
              government schemes, opportunities and
              public benefits relevant to you.
            </p>
          </div>

          {/* =================================================
              PROFILE INFORMATION
          ================================================== */}

          <div
            style={{
              marginTop: "45px",
              paddingTop: "22px",
              borderTop:
                "1px solid rgba(235, 225, 198, 0.35)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#EBE1C6",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Your profile
            </p>

            <p
              style={{
                margin: "8px 0 0",
                color: "#FFFFFF",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "400px",
              }}
            >
              Your information helps SARVASETU
              provide more relevant public-benefit
              recommendations.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT REGISTRATION FORM
        ====================================================== */}

        <div
          style={{
            padding: "45px",
            background: "#F2EEE1",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >

            {/* =================================================
                FORM HEADER
            ================================================== */}

            <div
              style={{
                marginBottom: "28px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                New Account
              </p>

              <h2
                style={{
                  margin: "9px 0 7px",
                  color: "#3E4435",
                  fontSize: "30px",
                  fontWeight: 750,
                }}
              >
                Register
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#81785A",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Enter your details to create your
                SARVASETU account.
              </p>
            </div>

            {/* =================================================
                REGISTRATION FORM
            ================================================== */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div
                style={{
                  marginBottom: "17px",
                }}
              >
                <label
                  htmlFor="name"
                  style={labelStyle}
                >
                  Full Name *
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={inputStyle}
                />
              </div>

              {/* EMAIL */}
              <div
                style={{
                  marginBottom: "17px",
                }}
              >
                <label
                  htmlFor="email"
                  style={labelStyle}
                >
                  Email *
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={inputStyle}
                />
              </div>

              {/* PASSWORD */}
              <div
                style={{
                  marginBottom: "17px",
                }}
              >
                <label
                  htmlFor="password"
                  style={labelStyle}
                >
                  Password *
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  style={inputStyle}
                />
              </div>

              {/* PHONE + AGE */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 1fr) minmax(0, 0.55fr)",
                  gap: "14px",
                  marginBottom: "17px",
                }}
              >
                <div>
                  <label
                    htmlFor="phone"
                    style={labelStyle}
                  >
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    style={labelStyle}
                  >
                    Age *
                  </label>

                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* GENDER */}
              <div
                style={{
                  marginBottom: "17px",
                }}
              >
                <label
                  htmlFor="gender"
                  style={labelStyle}
                >
                  Gender *
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* COLLEGE */}
              <div
                style={{
                  marginBottom: "24px",
                }}
              >
                <label
                  htmlFor="college"
                  style={labelStyle}
                >
                  College Name
                </label>

                <input
                  id="college"
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  style={inputStyle}
                />
              </div>

              {/* =================================================
                  CREATE ACCOUNT BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: loading
                    ? "#C8C1AA"
                    : "#C496A1",
                  color: "#3E4435",
                  fontSize: "15px",
                  fontWeight: 800,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  transition:
                    "transform 0.2s ease, opacity 0.2s ease",
                }}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {/* =================================================
                LOGIN LINK
            ================================================== */}

            <p
              style={{
                marginTop: "22px",
                marginBottom: 0,
                textAlign: "center",
                color: "#81785A",
                fontSize: "14px",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#596B5A",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESPONSIVE
      ====================================================== */}

      <style>
        {`
          @media (max-width: 900px) {
            div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }

            div[style*="min-height: 720px"] {
              min-height: auto !important;
            }
          }

          @media (max-width: 520px) {
            input,
            select {
              font-size: 16px !important;
            }

            div[style*="grid-template-columns: minmax(0, 1fr) minmax(0, 0.55fr)"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#3E4435",
  fontSize: "13px",
  fontWeight: 750,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #C8C1AA",
  borderRadius: "10px",
  background: "#EBE1C6",
  color: "#3E4435",
  fontSize: "14px",
  outline: "none",
};

export default Register;