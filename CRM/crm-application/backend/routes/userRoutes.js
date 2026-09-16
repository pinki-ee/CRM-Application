const express = require("express");

const { getProfile, updateProfile } = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get my profile
router.get("/profile", authMiddleware, getProfile);

// Update my profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
