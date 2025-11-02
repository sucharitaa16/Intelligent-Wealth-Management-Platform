import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"; //
import cron from "node-cron";
import Expense from "./models/Expense.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // 2 allowed origins
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Authentication route
app.use("/api/auth", userRoutes);

//  route 
app.use("/api/accounts", accountRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes); // 

cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("Resetting monthly expenses...");
    await Expense.updateMany({}, { $set: { monthlyExpenses: 0 } });
    console.log("Monthly expenses reset successfully");
  } catch (error) {
    console.error("Error resetting monthly expenses:", error);
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));