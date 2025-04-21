import Vet from "../models/Veterinarian.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

// ✅ API to Register Veterinarian
export const registerVet = async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging request body

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

        // ✅ Check if veterinarian already exists
        let vetExists = await Vet.findOne({ email });
        if (vetExists) {
            return res.status(400).json({ success: false, message: "Veterinarian already exists" });
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new vet
        const newVet = new Vet({
            name,
            email,
            phoneNumber,
            password: hashedPassword
        });

        // ✅ Save new vet to database
        const savedVet = await newVet.save();
        
        // ✅ Generate JWT token
        const token = jwt.sign({ id: savedVet._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        // ✅ Respond with success message and JWT token
        res.status(201).json({ success: true, message: "Veterinarian registered successfully", token });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Get all veterinarians
export const getVets = async (req, res) => {
    try {
        const vets = await Vet.find().select("-password"); // Exclude password
        res.status(200).json(vets);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching veterinarians", error: error.message });
    }
};

// ✅ Get veterinarian by ID
export const getVetById = async (req, res) => {
    try {
        const vet = await Vet.findById(req.params.id).select("-password");
        if (!vet) {
            return res.status(404).json({ success: false, message: "Veterinarian not found" });
        }
        res.status(200).json(vet);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching veterinarian", error: error.message });
    }
};