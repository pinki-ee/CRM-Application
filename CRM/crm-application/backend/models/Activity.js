const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "customer",
        "lead",
        "deal",
        "customer_update",
        "lead_update",
        "deal_update",
        "customer_delete",
        "lead_delete",
        "deal_delete",
      ],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Activity", activitySchema);
