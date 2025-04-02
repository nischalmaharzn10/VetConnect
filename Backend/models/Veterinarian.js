import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

const VetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Vet" },
});

// Pre-save middleware to hash the password before saving the vet
VetSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
  }
  next();
});

const Vet = mongoose.model("Vet", VetSchema, "veterinarians");

export default Vet;
