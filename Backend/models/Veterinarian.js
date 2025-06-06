import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // For password hashing

const VetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Vet" },
  isApproved: { type: Boolean, default: false },

  image: {
    type: String,
    default: "http://localhost:5555/uploads/default-avatar.png"
  },

  specialization: { type: String },
  experience: { type: Number },
  qualifications: { type: String },
  state: { type: String },
  district: { type: String },

  // ✅ Certificate field (e.g. URL or file path)
  certificate: {
    type: String,
    default: null,
  },
});


// Hash password before saving
VetSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Vet = mongoose.model("Vet", VetSchema, "veterinarians");

export default Vet;
