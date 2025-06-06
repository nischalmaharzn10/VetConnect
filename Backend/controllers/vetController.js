import Vet from "../models/Veterinarian.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

// ✅ API to Register Veterinarian
export const registerVet = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Construct image URL if file uploaded
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "http://localhost:5555/uploads/default-avatar.png";

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${JSON.stringify(req.body)}`
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    let vetExists = await Vet.findOne({ email });
    if (vetExists) {
      return res.status(400).json({ success: false, message: "Veterinarian already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newVet = new Vet({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      image // Save image URL
    });

    const savedVet = await newVet.save();

    const token = jwt.sign({ id: savedVet._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

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

// @desc    Get all vets
// @route   GET /api/vets/allvets
// @access  Private/Admin
export const getAllVets = async (req, res) => {
  try {
    console.log("📥 Request to GET /api/vets/allvets received");
    console.log("👤 Authenticated Admin:", req.user); // Assuming you're using protect middleware

    const vets = await Vet.find();
    console.log("✅ Total vets found:", vets.length);

    vets.forEach((vet, i) => {
      console.log(`🔹 Vet ${i + 1}:`, {
        id: vet._id,
        name: vet.name,
        email: vet.email,
        phone: vet.phoneNumber,
        approved: vet.isApproved
      });
    });

    res.status(200).json({ vets });
  } catch (error) {
    console.error('❌ Error fetching vets:', error.message);
    res.status(500).json({ message: 'Server error fetching vets' });
  }
};


// @desc    Approve a vet
// @route   PUT /api/vets/:id/approve
// @access  Private/Admin
export const approveVet = async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }

    vet.isApproved = true;
    await vet.save();

    res.status(200).json({ vet });
  } catch (error) {
    console.error('❌ Error approving vet:', error);
    res.status(500).json({ message: 'Failed to approve vet' });
  }
};

// @desc    Delete a vet
// @route   DELETE /api/vets/:id
// @access  Private/Admin
export const deleteVet = async (req, res) => {
  try {
    const vet = await Vet.findByIdAndDelete(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }

    res.status(200).json({ message: 'Vet removed successfully' });
  } catch (error) {
    console.error('❌ Error deleting vet:', error);
    res.status(500).json({ message: 'Failed to delete vet' });
  }
};

import Appointment from '../models/Appointment.js'; // adjust path as needed

// @desc    Get total appointments for a vet
// @route   GET /api/vets/:id/appointments/count
// @access  Private/Admin (or adjust based on your auth)
export const getAppointmentCountByVet = async (req, res) => {
  try {
    const vetId = req.params.id;
    console.log(`📥 Received request to get appointment count for vet ID: ${vetId}`);

    const totalAppointments = await Appointment.countDocuments({ vetId: vetId });
    console.log(`✅ Total appointments found for vet ${vetId}: ${totalAppointments}`);

    res.status(200).json({ totalAppointments });
  } catch (error) {
    console.error('❌ Error fetching appointment count:', error);
    res.status(500).json({ message: 'Server error fetching appointment count' });
  }
};

//vet name using the id of the vet
export const getVetNameById = async (req, res) => {
  try {
    let { vetId } = req.params;

    // Handle if vetId comes as an object accidentally
    if (typeof vetId === 'object' && vetId.$oid) {
      vetId = vetId.$oid;
    }



    if (!vetId || vetId.length !== 24) {
      return res.status(400).json({ message: 'Invalid vet ID' });
    }

    const vet = await Vet.findById(vetId).select('name');
    if (!vet) return res.status(404).json({ message: 'Vet not found' });

    res.json({ name: vet.name });
  } catch (err) {
    console.error('Error fetching vet name:', err);
    res.status(500).json({ message: 'Server error fetching vet name' });
  }
};



export const getVetPersonalInfo = async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    res.status(200).json(vet);
  } catch (error) {
    console.error("Error fetching vet personal info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVetProfile = async (req, res) => {
  try {
    const vetId = req.params.id;

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      specialization: req.body.specialization,
      experience: req.body.experience,
      qualifications: req.body.qualifications,
      state: req.body.state,
      district: req.body.district,
    };

    if (req.body.image) {
      updateData.image = req.body.image;  // base64 string from frontend
    }

    const updatedVet = await Vet.findByIdAndUpdate(vetId, updateData, { new: true });

    if (!updatedVet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    res.json(updatedVet);
  } catch (error) {
    console.error('Error updating vet profile:', error);
    res.status(500).json({ message: 'Server error while updating vet profile' });
  }
};



// PUT /api/vets/:id/certificate
export const uploadCertificate = async (req, res) => {
  const vetId = req.params.id;
  const { certificateImage } = req.body;

  if (!certificateImage) {
    return res.status(400).json({ message: "Certificate image is required." });
  }

  try {
    const vet = await Vet.findByIdAndUpdate(
      vetId,
      { certificateImage },
      { new: true }
    );

    if (!vet) return res.status(404).json({ message: "Vet not found." });

    res.json({ message: "Certificate uploaded successfully", vet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
