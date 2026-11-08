const express = require("express");
const router = express.Router();

const {
  getUnseenUpdates,
  markUpdateSeen,
} = require("../controllers/userUpdateController");

const protect = require("../middleware/authMiddleware");

router.get(
  "/unseen",
  protect,
  getUnseenUpdates
);

router.put(
  "/seen/:id",
  protect,
  markUpdateSeen
);

module.exports = router;