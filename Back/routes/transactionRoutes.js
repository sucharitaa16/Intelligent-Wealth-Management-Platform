// routes/transactionRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { 
  getUserTransactions, 
  getMonthlyIncomeVsExpense, 
  getDailySummary,
  createTransaction // 
} from "../controllers/transactionController.js";

const router = express.Router();

// Get all or filtered transactions
router.get("/", authMiddleware, getUserTransactions);
router.get("/summary", authMiddleware, getMonthlyIncomeVsExpense);
router.get("/daily-summary", authMiddleware, getDailySummary);

//  Create transaction (income/expense)
router.post("/", authMiddleware, createTransaction);

export default router;