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
    // ✅ TYPE FIELD ADD KORCHI BUT OPTIONAL KORE
    type: {
      type: String,
      enum: ["Card", "Cash", "Savings"],
      // required: false // Optional rakhi apnar existing code er sathe compatible korar jonne
    },
    initialBalance: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);