const mongoose = require("mongoose");

const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Activity = require("../models/Activity");

// GET DASHBOARD DATA
const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // TOTAL CUSTOMERS
    const customers = await Customer.countDocuments({
      createdBy: userId,
    });

    // TOTAL LEADS
    const leads = await Lead.countDocuments({
      createdBy: userId,
    });

    // TOTAL DEALS
    const deals = await Deal.countDocuments({
      createdBy: userId,
    });

    // RECENT ACTIVITY
    const recentActivity = await Activity.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // DEAL PIPELINE
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
      {
        $sort: {
          value: -1,
        },
      },
    ]);

    // SEND DASHBOARD DAT
    res.status(200).json({
      success: true,

      customers,
      leads,
      deals,

      recentActivity,

      dealStages,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
