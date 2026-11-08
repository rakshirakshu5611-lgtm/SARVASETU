
const express = require("express");
const router = express.Router();

const {
  getAccountDeletionNotice,
} = require("../controllers/accountDeletionController");

router.get("/:token", getAccountDeletionNotice);

module.exports = router;
