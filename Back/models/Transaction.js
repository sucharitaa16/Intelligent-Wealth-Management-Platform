// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account" 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: {  
    type: String,
    required: true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["income", "expense", "transfer"], 
    required: true 
  },
  category: {  
    type: String,
    required: true
  },
  account: {  
    type: String,
    enum: ["CARD", "CASH", "SAVINGS"],
    required: true
  },
  sourceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Income" 
  },
  destinationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Expense" 
  },
  fromAccountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account" 
  },
  toAccountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account" 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

export default mongoose.model("Transaction", transactionSchema);