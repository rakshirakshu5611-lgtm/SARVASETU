
import { useState } from "react";
import API from "../api";
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
  });

  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendAvailable, setResendAvailable] = useState(false);
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.phone.trim() ||
      !formData.age ||
      !formData.gender
    ) {
      setNotice("Please fill all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setNotice("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", formData);

      setOtpMode(true);
      setOtp("");
      setResendAvailable(false);
      setNotice(res.data.message || "OTP sent to your email.");

      window.setTimeout(() => setResendAvailable(true), 60000);
    } catch (error) {
      setNotice(
        error.response?.data?.message || "Could not start registration."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setNotice("");

    if (!/^\d{6}$/.test(otp)) {
      setNotice("Enter the six-digit OTP sent to your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-registration-otp", {
        email: formData.email.trim().toLowerCase(),
        otp,
      });

      setNotice(res.data.message || "Registration successful.");

      navigate("/login", {
        state: {
          registeredEmail: formData.email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      setNotice(
        error.response?.data?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setNotice("");

    try {
      setLoading(true);

      const res = await API.post("/auth/resend-registration-otp", {
        email: formData.email.trim().toLowerCase(),
      });

      setOtp("");
      setResendAvailable(false);
      setNotice(res.data.message || "A new OTP has been sent.");

      window.setTimeout(() => setResendAvailable(true), 60000);
    } catch (error) {
      setNotice(
        error.response?.data?.message || "Could not resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div className="sarvasetu-register-card" style={cardStyle}>
        {/* Branding panel */}
        <section style={brandStyle}>
          <div>
            <img
              src={nationalEmblem}
              alt="National Emblem of India"
              style={emblemStyle}
            />

            <img
              src={sarvasetuLogo}
              alt="SARVASETU"
              style={logoStyle}
            />

            <div style={accentStyle} />

            <h1 style={brandHeading}>
              {otpMode ? (
                <>Verify your<br />email</>
              ) : (
                <>Create your<br />account</>
              )}
            </h1>

            <p style={brandDescription}>
              {otpMode
                ? "Verify your email to complete your SARVASETU registration securely."
                : "Register with SARVASETU to discover government schemes, opportunities and public benefits relevant to you."}
            </p>
          </div>

          <div style={brandFooter}>
            <strong>Your profile</strong>
            <p>
              Your information helps SARVASETU provide more relevant
              public-benefit recommendations.
            </p>
          </div>
        </section>

        {/* Registration / OTP panel */}
        <section style={formPanelStyle}>
          <div style={formContainerStyle}>
            <p style={eyebrowStyle}>
              {otpMode ? "Email verification" : "New account"}
            </p>

            <h2 style={formHeading}>
              {otpMode ? "Enter your OTP" : "Register"}
            </h2>

            <p style={subheadingStyle}>
              {otpMode
                ? `Enter the six-digit code sent to ${formData.email}.`
                : "Enter your details to create your SARVASETU account."}
            </p>

            {notice && (
              <div role="status" aria-live="polite" style={noticeStyle}>
                {notice}
              </div>
            )}

            {!otpMode ? (
              <form onSubmit={handleSubmit}>
                <div style={fieldStyle}>
                  <label htmlFor="name" style={labelStyle}>
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={fieldStyle}>
                  <label htmlFor="email" style={labelStyle}>
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={150}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={fieldStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (8+ characters)"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={twoColumnStyle}>
                  <div>
                    <label htmlFor="phone" style={labelStyle}>
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={20}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="age" style={labelStyle}>
                      Age *
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Age"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ ...fieldStyle, marginBottom: 24 }}>
                  <label htmlFor="gender" style={labelStyle}>
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
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={buttonStyle(loading)}
                >
                  {loading
                    ? "Sending OTP..."
                    : "Continue to Email Verification"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ ...fieldStyle, marginTop: 28 }}>
                  <label htmlFor="otp" style={labelStyle}>
                    Six-digit OTP *
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    required
                    style={otpInputStyle}
                  />
                </div>

                <p style={{ ...subheadingStyle, marginBottom: 22 }}>
                  The code expires after five minutes. Check your inbox and
                  spam folder.
                </p>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  style={buttonStyle(loading || otp.length !== 6)}
                >
                  {loading ? "Verifying..." : "Verify OTP & Create Account"}
                </button>

                <button
                  type="button"
                  disabled={loading || !resendAvailable}
                  onClick={handleResendOtp}
                  style={secondaryButtonStyle(loading || !resendAvailable)}
                >
                  {resendAvailable
                    ? "Resend OTP"
                    : "Resend available in 60 seconds"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setOtpMode(false);
                    setOtp("");
                    setNotice("");
                  }}
                  style={backButtonStyle}
                >
                  Back to registration
                </button>
              </form>
            )}

            <p style={loginTextStyle}>
              Already have an account?{" "}
              <Link to="/login" style={loginLinkStyle}>
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sarvasetu-register-card {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .sarvasetu-register-page {
            padding: 10px !important;
          }

          .sarvasetu-register-card {
            border-radius: 18px !important;
          }

          .sarvasetu-register-brand {
            padding: 24px 20px !important;
          }

          .sarvasetu-register-form {
            padding: 25px 18px !important;
          }

          .sarvasetu-register-columns {
            grid-template-columns: 1fr !important;
          }

          .sarvasetu-register-emblem {
            width: 58px !important;
            height: 58px !important;
            margin-bottom: 12px !important;
          }

          .sarvasetu-register-logo {
            height: 100px !important;
            max-width: 220px !important;
            margin-bottom: 14px !important;
          }

          .sarvasetu-register-footer {
            margin-top: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#F7F1E3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  color: "#3E4435",
  boxSizing: "border-box",
};

const cardStyle = {
  width: "100%",
  maxWidth: 1100,
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
  background: "#F2EEE1",
  border: "1px solid #C8C1AA",
  borderRadius: 28,
  overflow: "hidden",
  boxShadow: "0 18px 45px rgba(62, 68, 53, 0.12)",
};

const brandStyle = {
  background: "#596B5A",
  padding: "45px 38px",
  color: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
};

const emblemStyle = {
  width: 90,
  height: 90,
  objectFit: "contain",
  display: "block",
  margin: "0 auto 25px",
};

const logoStyle = {
  width: "100%",
  maxWidth: 300,
  height: 150,
  objectFit: "contain",
  display: "block",
  margin: "0 auto 25px",
};

const accentStyle = {
  width: 92,
  height: 5,
  background: "#C496A1",
  borderRadius: 10,
  marginBottom: 30,
};

const brandHeading = {
  margin: 0,
  color: "#FFFFFF",
  fontSize: "clamp(36px, 4vw, 50px)",
  lineHeight: 1.08,
  fontWeight: 750,
  letterSpacing: "-1.5px",
};

const brandDescription = {
  margin: "20px 0 0",
  color: "#EBE1C6",
  fontSize: 15,
  lineHeight: 1.75,
  maxWidth: 450,
};

const brandFooter = {
  marginTop: 40,
  paddingTop: 20,
  borderTop: "1px solid rgba(235, 225, 198, 0.35)",
  fontSize: 13,
  lineHeight: 1.7,
};

const formPanelStyle = {
  padding: "40px clamp(22px, 4vw, 45px)",
  background: "#F2EEE1",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
};

const formContainerStyle = {
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
};

const eyebrowStyle = {
  margin: 0,
  color: "#81785A",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.5,
  textTransform: "uppercase",
};

const formHeading = {
  margin: "9px 0 7px",
  color: "#3E4435",
  fontSize: 30,
  fontWeight: 750,
};

const subheadingStyle = {
  margin: "0 0 24px",
  color: "#81785A",
  fontSize: 14,
  lineHeight: 1.6,
  overflowWrap: "anywhere",
};

const fieldStyle = { marginBottom: 16 };

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.55fr)",
  gap: 14,
  marginBottom: 16,
};

const labelStyle = {
  display: "block",
  marginBottom: 7,
  color: "#3E4435",
  fontSize: 13,
  fontWeight: 750,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #C8C1AA",
  borderRadius: 10,
  background: "#EBE1C6",
  color: "#3E4435",
  fontSize: 14,
  outline: "none",
};

const otpInputStyle = {
  ...inputStyle,
  textAlign: "center",
  letterSpacing: "10px",
  fontSize: 24,
  fontWeight: 800,
};

const buttonStyle = (disabled) => ({
  width: "100%",
  padding: "14px 18px",
  border: "none",
  borderRadius: 10,
  background: disabled ? "#C8C1AA" : "#C496A1",
  color: "#3E4435",
  fontSize: 14,
  fontWeight: 800,
  cursor: disabled ? "not-allowed" : "pointer",
});

const secondaryButtonStyle = (disabled) => ({
  ...buttonStyle(disabled),
  marginTop: 12,
  background: "#596B5A",
  color: "#FFFFFF",
});

const backButtonStyle = {
  display: "block",
  margin: "14px auto 0",
  padding: 8,
  border: "none",
  background: "transparent",
  color: "#596B5A",
  fontWeight: 700,
  cursor: "pointer",
};

const noticeStyle = {
  margin: "16px 0",
  padding: "12px 14px",
  border: "1px solid #C8C1AA",
  borderRadius: 10,
  background: "#EBE1C6",
  color: "#3E4435",
  fontSize: 13,
  lineHeight: 1.5,
  overflowWrap: "anywhere",
};

const loginTextStyle = {
  marginTop: 22,
  marginBottom: 0,
  textAlign: "center",
  color: "#81785A",
  fontSize: 14,
};

const loginLinkStyle = {
  color: "#596B5A",
  fontWeight: 800,
  textDecoration: "none",
};

export default Register;
