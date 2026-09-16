const User = require("../models/User");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Activity = require("../models/Activity");


// GET ADMIN DASHBOARD

const getAdminDashboard = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // Total users
    const totalUsers = users.length;

    // Active users
    const activeUsers = users.filter((user) => user.status === "active").length;

    // Inactive users
    const inactiveUsers = users.filter(
      (user) => user.status === "inactive",
    ).length;

    res.status(200).json({
      success: true,

      totalUsers,
      activeUsers,
      inactiveUsers,

      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },

      users,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL USERS

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE USER

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ADD USER

const addUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || "user",
      status: status || "active",
    });

    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("ADD USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER

const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (name !== undefined) {
      user.name = name.trim();
    }

    // Update email
    if (email !== undefined) {
      const cleanEmail = email.toLowerCase().trim();

      const emailExists = await User.findOne({
        email: cleanEmail,
        _id: { $ne: req.params.id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already belongs to another user",
        });
      }

      user.email = cleanEmail;
    }

    // Update role
    if (role !== undefined) {
      user.role = role;
    }

    // Update status
    if (status !== undefined) {
      user.status = status;
    }

    await user.save();

    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// DELETE USER

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's CRM data
    await Customer.deleteMany({
      createdBy: req.params.id,
    });

    await Lead.deleteMany({
      createdBy: req.params.id,
    });

    await Deal.deleteMany({
      createdBy: req.params.id,
    });

    await Activity.deleteMany({
      createdBy: req.params.id,
    });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User and related CRM data deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET INDIVIDUAL USER DASHBOARD

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user information
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Total customers
    const customers = await Customer.countDocuments({
      createdBy: userId,
    });

    // Total leads
    const leads = await Lead.countDocuments({
      createdBy: userId,
    });

    // Total deals
    const deals = await Deal.countDocuments({
      createdBy: userId,
    });

    // Recent activities
    const recentActivity = await Activity.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Deal pipeline
    const dealStages = await Deal.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $group: {
          _id: "$stage",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      user,

      customers,

      leads,

      deals,

      recentActivity,

      dealStages,
    });
  } catch (error) {
    console.error("GET USER DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EXPORTS

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getUserDashboard,
};
