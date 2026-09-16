const express = require("express");
const router = express.Router();

const {
  getRecentActivities,
} = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");

// Get recent activities of logged-in user
router.get("/", authMiddleware, getRecentActivities);

module.exports = router;