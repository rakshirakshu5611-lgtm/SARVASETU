
import { useState } from "react";
import API from "../api";
import "./Login.css";

import sarvasetuLogo from "../assets/sarvasetu-logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

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

      // Verify the actual role returned by the backend.
      const actualRole = String(user.role || "").toLowerCase();

      if (
        (loginType === "admin" && actualRole !== "admin") ||
        (loginType === "user" && actualRole !== "user")
      ) {
        alert(
          `This account is not registered for ${loginType} login.`
        );
        return;
      }

      // Save credentials only after role verification.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", userId.toString());

      if (actualRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response) {
        alert(err.response.data?.message || "Login failed.");
      } else if (err.request) {
        alert(
          "Cannot connect to backend. Please check your connection."
        );
      } else {
        alert(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sarvasetu-login">
      <div className="login-shell">
        <section className="login-card">

          {/* SARVASETU logo */}
          <div className="login-logo-container">
            <img
              src={sarvasetuLogo}
              alt="SARVASETU Logo"
              className="login-main-logo"
            />
          </div>

          {/* Login heading */}
          <div className="login-heading">
            <span className="login-eyebrow">
              SECURE ACCESS
            </span>

            <h1>Welcome back</h1>

            <p>
              Sign in to continue to your SARVASETU account.
            </p>
          </div>

          {/* Login role selection */}
          <div
            className="login-role-selection"
            aria-label="Choose login type"
          >
            <button
              type="button"
              className={`login-role-option ${
                loginType === "user" ? "active" : ""
              }`}
              onClick={() => setLoginType("user")}
              aria-pressed={loginType === "user"}
              disabled={loading}
            >
              <span className="role-icon" aria-hidden="true">
                ♙
              </span>

              <span>User Login</span>
            </button>

            <button
              type="button"
              className={`login-role-option ${
                loginType === "admin" ? "active" : ""
              }`}
              onClick={() => setLoginType("admin")}
              aria-pressed={loginType === "admin"}
              disabled={loading}
            >
              <span className="role-icon" aria-hidden="true">
                ♜
              </span>

              <span>Admin Login</span>
            </button>
          </div>

          {/* Login form */}
          <form onSubmit={loginUser}>
            <div className="login-field">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : loginType === "admin"
                  ? "Sign in as Admin"
                  : "Sign in as User"}

              {!loading && (
                <span aria-hidden="true"> →</span>
              )}
            </button>
          </form>

          {/* Security information */}
          <div className="login-security-note">
            Your credentials are used to authenticate
            your SARVASETU account securely.
            <br />
            <span className="login-selected-role">
              Selected access:{" "}
              {loginType === "admin" ? "Administrator" : "Citizen"}
            </span>
          </div>

        </section>
      </div>
    </main>
  );
}

export default Login;
