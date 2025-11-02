// routes/categoryRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Income from '../models/Income.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get income categories for logged in user
router.get('/income', verifyToken, async (req, res) => {
  try {
    const categories = await Income.find({ userId: req.userId });
    
    // If no categories found, return default categories
    if (!categories || categories.length === 0) {
      const defaultCategories = ["Awards", "Coupons", "Grants", "Lottery", "Refunds", "Rental", "Salary", "Sell"];
      return res.json({ 
        categories: defaultCategories 
      });
    }

    const categoryNames = categories.map(cat => cat.name);
    res.json({ categories: categoryNames });
    
  } catch (error) {
    console.error('Error fetching income categories:', error);
    res.status(500).json({ 
      message: 'Error fetching income categories', 
      error: error.message 
    });
  }
});

// Get expense categories for logged in user
router.get('/expense', verifyToken, async (req, res) => {
  try {
    const categories = await Expense.find({ userId: req.userId });
    
    // If no categories found, return default categories
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        "Baby", "Beauty", "Bills", "Car", "Clothing", "Education",
        "Electronics", "Entertainment", "Food", "Health", "Home",
        "Insurance", "Shopping", "Social", "Sport", "Tax", 
        "Telephone", "Transportation"
      ];
      return res.json({ 
        categories: defaultCategories 
      });
    }

    const categoryNames = categories.map(cat => cat.name);
    res.json({ categories: categoryNames });
    
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    res.status(500).json({ 
      message: 'Error fetching expense categories', 
      error: error.message 
    });
  }
});

export default router;