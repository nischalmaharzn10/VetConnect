import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

// ✅ API to Register User
export const registerUser = async (req, res) => {
    try {
        console.log("Received Data:", req.body);  // Debugging request body

        const { name, email, phoneNumber, password } = req.body;

        // ✅ Check if all required fields are provided
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                message: `Missing fields: ${JSON.stringify(req.body)}` 
            });
        }

        // ✅ Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // ✅ Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // ✅ Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new user
        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        // ✅ Save new user to database and handle potential errors
        let savedUser;
        try {
            console.log("Saving User to Database...");
            savedUser = await newUser.save();
            console.log("User Saved Successfully:", savedUser);
        } catch (error) {
            console.error("Error Saving User:", error);
            return res.status(500).json({ success: false, message: "Database Error", error: error.message });
        }
        
        // ✅ Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // ✅ Respond with success message and JWT token
        res.status(201).json({ success: true, message: "User registered successfully", token });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
