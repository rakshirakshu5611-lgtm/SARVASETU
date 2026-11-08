
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();

// Database
const connectDB = require("./config/db");

// Routes
const recommendationRoutes = require("./routes/recommendationRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const opportunityBookmarkRoutes = require("./routes/opportunityBookmarkRoutes");
const govUpdateRoutes = require("./routes/govUpdateRoutes");
const userUpdateRoutes = require("./routes/userUpdateRoutes");
const profileRoutes = require("./routes/profileRoutes");
const documentRoutes = require("./routes/documentRoutes");
const accountDeletionRoutes = require("./routes/accountDeletionRoutes");

console.log("✅ Scheme routes loaded");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://172.20.40.101:5173",
    "https://localhost",
    "capacitor://localhost",
    process.env.FRONTEND_URL,
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);

// Request body middleware
app.use(express.json({ limit: "1mb" }));

// Health / welcome route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to SARVASETU");
});

// API routes
app.use("/api/recommend", recommendationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/opportunity-bookmarks", opportunityBookmarkRoutes);
app.use("/api/updates", govUpdateRoutes);
app.use("/api/user-updates", userUpdateRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/account-deletion-notices", accountDeletionRoutes);

// Start database and server only when this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  Promise.resolve(connectDB())
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error);
      process.exitCode = 1;
    });
}

// Export Express app for automated testing
module.exports = app;
