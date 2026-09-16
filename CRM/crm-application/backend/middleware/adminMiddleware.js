
// ADMIN MIDDLEWARE
// Checks whether the logged-in user is an admin

const adminMiddleware = (req, res, next) => {
  try {
    // authMiddleware should already have added the user
    // information to req.user

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // User is admin
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = adminMiddleware;