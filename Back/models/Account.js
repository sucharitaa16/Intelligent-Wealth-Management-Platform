// models/Account.js
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: { // 
      type: String,
      enum: ["CARD", "CASH", "SAVINGS"],
      required: true
    },
    initialBalance: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0 // 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);