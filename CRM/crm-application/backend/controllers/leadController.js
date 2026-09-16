const Lead = require("../models/Lead");
const { createActivity } = require("./activityController");

// CREATE LEAD
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    await createActivity(
      req.user.id,
      `Lead "${lead.name}" was added`,
      "lead",
    );

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL LEADS
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE LEAD
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      lead,
    });
  } catch (error) {
    console.error("Get Lead Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE LEAD
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
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

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await createActivity(
      req.user.id,
      `Lead "${lead.name}" was updated`,
      "lead_update",
    );

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE LEAD
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await createActivity(
      req.user.id,
      `Lead "${lead.name}" was deleted`,
      "lead_delete",
    );

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
};