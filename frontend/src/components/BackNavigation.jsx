
import { useLocation, useNavigate } from "react-router-dom";
import "./BackNavigation.css";

function BackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isDashboard =
    location.pathname === "/dashboard" ||
    location.pathname === "/admin";

  if (isDashboard) {
    return null;
  }

  const target = isAdmin ? "/admin" : "/dashboard";
  const label = isAdmin
    ? "Back to Admin Dashboard"
    : "Back to Dashboard";

  return (
    <div className="global-back-navigation">
      <button
        type="button"
        className="global-back-button"
        onClick={() => navigate(target)}
        aria-label={label}
      >
        <span className="global-back-arrow" aria-hidden="true">
          ←
        </span>
        <span>{label}</span>
      </button>
    </div>
  );
}

export default BackNavigation;
