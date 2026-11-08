
import { useLanguage } from "../i18n/LanguageContext";
import { useState } from "react";
import axios from "axios";
import "./Login.css";

import nationalEmblem from "../assets/national-emblem.png";
import sarvasetuLogo from "../assets/sarvasetu-logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useLanguage();

  const loginUser = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        alert("Login response is incomplete. Please try again.");
        return;
      }

      const userId = user._id || user.id || user.userId;

      if (!userId) {
        alert("User ID was not found in the login response.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", userId.toString());

      if (user.role === "Admin" || user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response) {
        alert(err.response.data?.message || "Login failed.");
      } else {
        alert("Cannot connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sarvasetu-login">
      <div className="login-background" aria-hidden="true" />

      <div className="login-shell">
        <section className="login-brand-panel">
          <img
            src={sarvasetuLogo}
            alt="SARVASETU"
            className="login-main-logo"
          />

          <div className="login-brand-copy">
            <span className="login-eyebrow">
              PUBLIC BENEFIT ACCESS
            </span>

            <h1>
              One platform.
              <br />
              Many possibilities.
            </h1>

            <p>
              Discover government schemes, understand
              eligibility, prepare documents and stay
              informed through one secure platform.
            </p>
          </div>

          <div className="login-brand-footer">
            <img
              src={nationalEmblem}
              alt="National Emblem of India"
              className="login-national-emblem"
            />

            <span>
              SARVASETU
              <small>INTELLIGENT PUBLIC BENEFIT DELIVERY</small>
            </span>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-inner">
            <div className="login-mobile-brand">
              <img src={sarvasetuLogo} alt="SARVASETU" />
            </div>

            <span className="login-eyebrow">SECURE ACCESS</span>

            <h2>Welcome back</h2>

            <p className="login-subtitle">
              Sign in to continue to your SARVASETU account.
            </p>

            <form onSubmit={loginUser}>
              <div className="login-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <span aria-hidden="true"> →</span>}
              </button>
            </form>

            <div className="login-security-note">
              Your credentials are used to authenticate
              your SARVASETU account securely.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
