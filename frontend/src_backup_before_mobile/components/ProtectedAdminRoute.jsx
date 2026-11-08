import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // User is not logged in
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    const isAdmin =
      user.role === "Admin" ||
      user.role === "admin";

    // Logged-in normal user
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    // Admin
    return <Outlet />;

  } catch (error) {
    console.log("PROTECTED ADMIN ROUTE ERROR:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedAdminRoute;