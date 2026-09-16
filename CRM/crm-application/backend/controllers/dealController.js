const Deal = require("../models/Deal");
const { createActivity } = require("./activityController");

// CREATE DEAL
const createDeal = async (req, res) => {
  try {
    const {
      title,
      dealName,
      customer,
      amount,
      stage,
      expectedCloseDate,
      notes,
    } = req.body;

    // Accept both title and dealName
    const finalTitle = title || dealName;

    if (!finalTitle || !customer || amount === undefined || amount === "") {
      return res.status(400).json({
        message: "Deal name, customer name and amount are required",
      });
    }

    const deal = await Deal.create({
      title: finalTitle.trim(),
      customer: customer.trim(),
      amount: Number(amount),
      stage: stage || "New",
      expectedCloseDate: expectedCloseDate || null,
      notes: notes || "",
      createdBy: req.user.id,
    });

    // Create recent activity
    await createActivity(
      req.user.id,
      `Deal "${deal.title}" was created for ${deal.customer}`,
      "deal",
    );

    res.status(201).json({
      message: "Deal created successfully",
      deal,
    });
  } catch (error) {
    console.error("CREATE DEAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL DEALS
const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      deals,
    });
  } catch (error) {
    console.error("GET DEALS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE DEAL
const getDeal = async (req, res) => {
  try {
    const deal = await Deal.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    res.status(200).json({
      deal,
    });
  } catch (error) {
    console.error("GET DEAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE DEAL
const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    await createActivity(
      req.user.id,
      `Deal "${deal.title}" was updated`,
      "deal_update",
    );

    res.status(200).json({
      message: "Deal updated successfully",
      deal,
    });
  } catch (error) {
    console.error("UPDATE DEAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE DEAL
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    await createActivity(
      req.user.id,
      `Deal "${deal.title}" was deleted`,
      "deal_delete",
    );

    res.status(200).json({
      message: "Deal deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DEAL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
};