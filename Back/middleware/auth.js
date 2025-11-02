import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("🔐 Auth Header:", authHeader); // ✅ Debugging
    
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7, authHeader.length) : null;
    console.log("🔐 Token extracted:", token); // ✅ Debugging

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded - User ID:", decoded.userId); // ✅ Debugging
    req.user = decoded.userId; 
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message); // ✅ Debugging
    res.status(401).json({ error: "Invalid or expired token" });
  }
};