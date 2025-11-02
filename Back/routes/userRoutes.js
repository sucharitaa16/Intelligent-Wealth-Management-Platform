// routes/userRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

import { generateOTP } from '../utils/otpGenerator.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { initDefaultAccounts } from "../controllers/accountController.js";

const router = express.Router();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (password will be automatically hashed by the pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    const defaultIncomes = [
      "Awards",
      "Coupons",
      "Grants",
      "Lottery",
      "Refunds",
      "Rental",
      "Salary",
      "Sell",
    ];

    const defaultExpenses = [
      "Baby",
      "Beauty",
      "Bills",
      "Car",
      "Clothing",
      "Education",
      "Electronics",
      "Entertainment",
      "Food",
      "Health",
      "Home",
      "Insurance",
      "Shopping",
      "Social",
      "Sport",
      "Tax",
      "Telephone",
      "Transportation",
    ];

    // ✅ Convert strings to objects before insert
    const incomeDocs = defaultIncomes.map((name) => ({
      userId: user._id,
      name,
      isDefault: true,
    }));

    const expenseDocs = defaultExpenses.map((name) => ({
      userId: user._id,
      name,
      isDefault: true,
    }));

    await Income.insertMany(incomeDocs);

    console.log("Incomes created");
    await Expense.insertMany(expenseDocs);
    console.log("Expenses created");

    await initDefaultAccounts(user._id);
    console.log("Accounts initialized");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );


    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        overallBalance: user.overallBalance
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password using the model method
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        overallBalance: user.overallBalance
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        overallBalance: user.overallBalance
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
});

// ==========================================
// OTP & PASSWORD RESET ROUTES
// ==========================================

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('📧 Forgot password request for:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ 
        success: false,
        message: 'User not found with this email' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log('🔑 Generated OTP:', otp, 'for email:', email);

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email });

    // Save OTP to database
    await Otp.create({
      email,
      otp,
      expiresAt
    });

    // Send OTP via email
    console.log('📤 Attempting to send email...');
    const emailSent = await sendOtpEmail(email, otp);
    console.log('✅ Email sent status:', emailSent);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent to your email successfully'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('🔍 Verifying OTP:', otp, 'for email:', email);

    // Find the OTP
    const otpRecord = await Otp.findOne({ 
      email, 
      otp 
    });

    if (!otpRecord) {
      console.log('❌ Invalid OTP');
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      console.log('❌ OTP expired');
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // OTP is valid
    console.log('✅ OTP verified successfully');
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('❌ OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log('🔄 Reset password request for:', email);

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify OTP first
    const otpRecord = await Otp.findOne({ 
      email, 
      otp 
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    console.log('✅ Password reset successfully for:', email);
    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('🔄 Resend OTP request for:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log('🔑 New OTP generated:', otp);

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      expiresAt
    });

    // Send new OTP via email
    const emailSent = await sendOtpEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    console.log('✅ New OTP sent successfully');
    res.json({
      success: true,
      message: 'New OTP sent to your email'
    });

  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending OTP'
    });
  }
});

// Test Email Route
router.get('/test-email', async (req, res) => {
  try {
    const { testEmailService } = await import('../utils/sendEmail.js');
    const result = await testEmailService();
    
    res.json({
      success: result,
      message: result ? 
        'Test email sent successfully - check your inbox and console' : 
        'Test email failed - check backend console for errors'
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test error: ' + error.message 
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user; // from JWT middleware


    // Delete all accounts related to this user
    await Account.deleteMany({ userId });



    await Transaction.deleteMany({ userId });
    await Income.deleteMany({ userId });
    await Expense.deleteMany({ userId });


    // Delete the user
    await User.findByIdAndDelete(userId);


    res.json({ message: "User and all associated accounts deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


export default router;