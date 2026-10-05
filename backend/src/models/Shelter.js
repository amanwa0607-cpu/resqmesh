import mongoose from "mongoose";

const shelterSchema =
  new mongoose.Schema(
    {
      shelterId: {
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

      capacity: {
        type: Number,
        required: true,
        min: 0,
      },

      occupied: {
        type: Number,
        default: 0,
        min: 0,
      },

      medicalSupport: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          "available",
          "limited",
          "full",
          "closed",
        ],
        default: "available",
      },
    },
    {
      timestamps: true,
    }
  );

const Shelter =
  mongoose.model(
    "Shelter",
    shelterSchema
  );

export default Shelter;