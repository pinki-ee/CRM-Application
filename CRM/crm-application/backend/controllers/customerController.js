const Customer = require("../models/Customer");
const { createActivity } = require("./activityController");

// CREATE CUSTOMER
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Create recent activity
    await createActivity(
      req.user.id,
      `New customer "${customer.name || "Customer"}" was added`,
      "customer",
    );

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE CUSTOMER
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
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

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Create recent activity
    await createActivity(
      req.user.id,
      `Customer "${customer.name || "Customer"}" was updated`,
      "customer_update",
    );

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Create recent activity
    await createActivity(
      req.user.id,
      `Customer "${customer.name || "Customer"}" was deleted`,
      "customer_delete",
    );

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// EXPORTS
module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};