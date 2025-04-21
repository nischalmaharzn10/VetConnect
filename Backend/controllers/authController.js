import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vet from "../models/Veterinarian.js";
import Admin from "../models/Admin.js";

// ------------------ LOGIN FUNCTION ------------------
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("🔵 Login Attempt - Email:", email, "Role:", role);

  try {
    let user;

    // Role-based user fetching
    if (role === "user") {
      console.log("🟢 Searching for user...");
      user = await User.findOne({ email });
    } else if (role === "vet") {
      console.log("🟢 Searching for vet...");
      user = await Vet.findOne({ email });
    } else if (role === "admin") {
      console.log("🟢 Searching for admin...");
      user = await Admin.findOne({ email });
    } else {
      console.log("🔴 Invalid Role:", role);
      return res.status(400).json({ message: "Invalid role. Please select a valid role." });
    }

    // Check if user exists
    if (!user) {
      console.log("🔴 User Not Found - Email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User Found:", user.email);

    // Validate password
    if (!user.password || typeof user.password !== "string") {
      console.log("🔴 Password is missing or not a string in the database");
      return res.status(500).json({ message: "Server error: Password issue" });
    }

    // Compare the password from login request with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔵 Password Match Status:", isMatch);

    if (!isMatch) {
      console.log("🔴 Password Mismatch - Email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

// Generate JWT token
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET, // Use the environment variable for JWT_SECRET
  { expiresIn: "3d" } // Token valid for 3 days
);


    console.log("🟢 Login Successful - Email:", email, "Role:", role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
