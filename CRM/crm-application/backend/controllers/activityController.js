const Activity = require("../models/Activity");

// CREATE ACTIVITY
const createActivity = async (createdBy, message, type) => {
  try {
    if (!createdBy || !message || !type) {
      console.error("Missing activity data:", {
        createdBy,
        message,
        type,
      });
      return null;
    }

    const activity = await Activity.create({
      createdBy,
      message,
      type,
    });

    console.log("Activity created:", activity.message);

    return activity;
  } catch (error) {
    console.error("CREATE ACTIVITY ERROR:", error);
    return null;
  }
};

// GET RECENT ACTIVITIES
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      createdBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("GET ACTIVITIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

module.exports = {
  createActivity,
  getRecentActivities,
};
