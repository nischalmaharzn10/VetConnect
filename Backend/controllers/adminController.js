import bcrypt from "bcryptjs";
import User from "../models/User.js";  // Assuming this is the correct model

// ✅ Register User (Admin or other roles)
export const registerUser = async (req, res) => {
  const { name, email, phoneNumber, role, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phoneNumber,
      role,
      password: hashedPassword,  // Store hashed password
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Example Admin Function
export const adminControllerFunction = (req, res) => {
  res.status(200).json({ message: "Admin function executed successfully" });
};
