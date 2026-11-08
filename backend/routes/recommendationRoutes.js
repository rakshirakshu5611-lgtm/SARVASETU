const express = require("express");
const router = express.Router();

const { recommendSchemes } = require("../controllers/recommendationController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, recommendSchemes);

module.exports = router;