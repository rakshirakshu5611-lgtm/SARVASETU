const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  console.log("ADMIN CHECK");
console.log("User ID:", req.user._id);
console.log("User role:", req.user.role);

  if (
    req.user.role !== "Admin" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

module.exports = admin;