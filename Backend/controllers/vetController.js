import Veterinarian from "../models/Veterinarian.js";  // Assuming you have a Veterinarian model

// Register Vet
export const registerVet = async (req, res) => {
  const { name, email, phoneNumber, role, password, specialization } = req.body;

  try {
    // Check if the email already exists
    const existingVet = await Veterinarian.findOne({ email });
    if (existingVet) {
      return res.status(400).json({ message: "Veterinarian already exists" });
    }

    // Create new veterinarian
    const newVet = new Veterinarian({
      name,
      email,
      phoneNumber,
      role,
      password,  // Hash the password
      specialization,
    });

    await newVet.save();
    res.status(201).json({ message: "Veterinarian registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
