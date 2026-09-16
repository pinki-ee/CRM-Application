const express = require("express");

const {
  getAdminDashboard,
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getUserDashboard,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ADMIN AUTHENTICATION + ADMIN PERMISSION

router.use(authMiddleware);
router.use(adminMiddleware);


// ADMIN DASHBOARD

router.get("/dashboard", getAdminDashboard);

// USERS

// Get all users
router.get("/users", getAllUsers);

// Get single user
router.get("/users/:id", getUser);

// Add user
router.post("/users", addUser);

// Update user
router.put("/users/:id", updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

// INDIVIDUAL USER DASHBOARD

router.get("/users/:id/dashboard", getUserDashboard);


// EXPORT ROUTER

module.exports = router;