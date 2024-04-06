import mongoose from "mongoose";
import Court from "./court.js";

const turfSchema = new mongoose.Schema(
  {
    court: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Court", 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    pricePerHour: { 
        type: Number, 
        required: true 
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    amenities: { 
      type: [String], 
      default: [] 
    },
    extraBalls: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Turf = mongoose.model("Turf", turfSchema);

export default Turf;
