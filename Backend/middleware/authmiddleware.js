import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token if available
  
  // Log the headers to see if the token is coming through
  console.log("Request Headers:", req.headers);

  if (!token) {
    console.log("No token provided."); // Debugging log
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging log

    if (!decoded || !decoded.id) {
      console.log("Invalid token structure"); // Debugging log
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("User not found for ID:", decoded.id); // Debugging log
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message); // Debugging log
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};



// Middleware to check if the user is authenticated
export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token properly
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    req.user = decoded.user; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// Middleware to check if the user has the correct role
export const authorize = (roles = []) => {
  return (req, res, next) => {
    // roles is an array of allowed roles
    if (!roles.includes(req.user.role)) {
      console.error("Access forbidden: insufficient rights"); // Log the error
      return res.status(403).json({ message: "Access forbidden: insufficient rights" });
    }
    next();
  };
};
