import mongoose from "mongoose";

const roadSchema =
  new mongoose.Schema(
    {
      roadId: {
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

      points: {
        type: [
          {
            lat: Number,
            lng: Number,
          },
        ],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "open",
          "blocked",
          "caution",
        ],
        default: "open",
      },

      reason: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const Road =
  mongoose.model(
    "Road",
    roadSchema
  );

export default Road;