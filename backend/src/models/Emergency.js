import mongoose from "mongoose";

const emergencySchema =
  new mongoose.Schema(
    {
      emergencyId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "fire",
          "structural",
          "chemical",
          "flood",
          "other",
        ],
        default: "other",
      },

      description: {
        type: String,
        default: "",
      },

      position: {
        lat: {
          type: Number,
          required: true,
        },

        lng: {
          type: Number,
          required: true,
        },
      },

      severity: {
        type: String,
        enum: [
          "critical",
          "high",
          "medium",
          "low",
        ],
        default: "medium",
      },

      status: {
        type: String,
        enum: [
          "active",
          "contained",
          "resolved",
        ],
        default: "active",
      },
    },
    {
      timestamps: true,
    }
  );

const Emergency =
  mongoose.model(
    "Emergency",
    emergencySchema
  );

export default Emergency;