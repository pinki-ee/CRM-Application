const express = require("express");

const {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all deals
router.get("/", authMiddleware, getDeals);

// Get single deal
router.get("/:id", authMiddleware, getDeal);

// Create deal
router.post("/", authMiddleware, createDeal);

// Update deal
router.put("/:id", authMiddleware, updateDeal);

// Delete deal
router.delete("/:id", authMiddleware, deleteDeal);

module.exports = router;
