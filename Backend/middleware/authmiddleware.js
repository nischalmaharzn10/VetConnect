import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token if available
  
  // Log the headers to see if the token is coming through
  // console.log("Request Headers:", req.headers);

  if (!token) {
    console.log("No token provided."); // Debugging log
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded); // Debugging log

    if (!decoded || !decoded.id) {
      console.log("Invalid token structure"); // Debugging log
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      // console.log("User not found for ID:", decoded.id); // Debugging log
      return res.status(401).json({ message: "User not found" });
    }

    // console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message); // Debugging log
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};



// Middleware to check if the user is authenticated
export const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  // console.log("🔐 Incoming Request - Auth Header:", authHeader);
  // console.log("🔐 Extracted Token:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("✅ Token Decoded:", decoded);

    req.user = decoded;         // 👈 Attach full user object including role
    req.userId = decoded.id || decoded._id;

    next();
  } catch (error) {
    console.error('❌ JWT Verification Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user has the correct role
export const authorize = (roles = []) => {
  return (req, res, next) => {
    // console.log("🔍 Checking Authorization...");
    // console.log("🔍 Required Roles:", roles);
    // console.log("🔍 User Info from Token:", req.user);

    if (!req.user || !roles.includes(req.user.role)) {
      console.error("🚫 Access forbidden: insufficient rights or role missing");
      return res.status(403).json({ message: "Access forbidden: insufficient rights" });
    }

    console.log("✅ Authorization passed");
    next();
  };
};
