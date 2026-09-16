const express = require("express");

const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all customers
router.get("/", authMiddleware, getCustomers);

// Get single customer
router.get("/:id", authMiddleware, getCustomer);

// Create customer
router.post("/", authMiddleware, createCustomer);

// Update customer
router.put("/:id", authMiddleware, updateCustomer);

// Delete customer
router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;
