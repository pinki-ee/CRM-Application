const express = require("express");

const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all leads
router.get("/", authMiddleware, getLeads);

// Get single lead
router.get("/:id", authMiddleware, getLead);

// Create lead
router.post("/", authMiddleware, createLead);

// Update lead
router.put("/:id", authMiddleware, updateLead);

// Delete lead
router.delete("/:id", authMiddleware, deleteLead);

module.exports = router;
