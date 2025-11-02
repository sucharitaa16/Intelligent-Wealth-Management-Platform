// controllers/transactionController.js
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Account from "../models/Account.js";


// 
export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, account, date } = req.body;
    const userId = req.user; // from JWT middleware

    // Validate required fields
    if (!description || !amount || !type || !category || !account) {
      return res.status(400).json({ 
        message: 'All fields are required: description, amount, type, category, account' 
      });
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be a positive number' 
      });
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ 
        message: 'Type must be either income or expense' 
      });
    }

    // Find user account by name (CARD, CASH, SAVINGS)
    const userAccount = await Account.findOne({ 
      userId: userId, 
      name: account 
    });

    if (!userAccount) {
      return res.status(404).json({ 
        message: 'Account not found' 
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: userId,
      accountId: userAccount._id,
      title: description,
      description,
      amount: amountNum,
      type,
      category,
      account,
      date: date ? new Date(date) : new Date()
    });

    // Update account balance
    if (type === 'income') {
      userAccount.balance += amountNum;
    } else if (type === 'expense') {
      userAccount.balance -= amountNum;
    }
    await userAccount.save();

    // Update user's overall balance
    const user = await User.findById(userId);
    if (user) {
      if (type === 'income') {
        user.overallBalance += amountNum;
      } else if (type === 'expense') {
        user.overallBalance -= amountNum;
      }
      await user.save();
    }

    res.status(201).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`,
      transaction
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ 
      message: 'Error creating transaction', 
      error: error.message 
    });
  }
};

// Existing functions...
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user; // from JWT middleware
    const { accountId, type, startDate, endDate } = req.query;

    const query = { userId };

    if (accountId) query.accountId = accountId;
    if (type) query.type = type; // income / expense / transfer
    if (startDate && endDate)
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.find(query)
      .populate("accountId", "name")
      .populate("sourceId", "name")
      .populate("destinationId", "name")
      .populate("fromAccountId", "name")
      .populate("toAccountId", "name")
      .sort({ date: -1 }); // latest first

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMonthlyIncomeVsExpense = async (req, res) => {
  try {
    const userId = req.user; // from JWT middleware
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        message: "Month query is required (e.g., ?month=2025-10)",
      });
    }

    const [year, monthNumber] = month.split("-").map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    }).lean();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") totalIncome += tx.amount;
      else if (tx.type === "expense") totalExpense += tx.amount;
    });

    res.status(200).json({
      month,
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
    });
  } catch (error) {
    console.error("Error fetching monthly income vs expense:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDailySummary = async (req, res) => {
  try {
    const userId = req.user; // from JWT middleware
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        message: "Month query is required (e.g., ?month=2025-10)",
      });
    }

    const [year, monthNumber] = month.split("-").map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    }).lean();

    if (transactions.length === 0) {
      return res.status(200).json({
        month,
        data: [],
        message: "No transactions found for this month.",
      });
    }

    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const dailyData = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dailyData[dateKey] = { totalIncome: 0, totalExpense: 0 };
    }

    transactions.forEach((tx) => {
      const dateKey = tx.date.toISOString().split("T")[0];
      if (!dailyData[dateKey]) return;
      if (tx.type === "income") dailyData[dateKey].totalIncome += tx.amount;
      if (tx.type === "expense") dailyData[dateKey].totalExpense += tx.amount;
    });

    const dailySummary = Object.keys(dailyData)
      .sort()
      .map((date) => ({
        date,
        totalIncome: dailyData[date].totalIncome,
        totalExpense: dailyData[date].totalExpense,
      }));

    res.status(200).json({
      month,
      data: dailySummary,
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    res.status(500).json({ message: "Server error", error });
  }
};