import mongoose from "mongoose";

const VetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Vet" }, 
  specialization: { type: String }, // Optional field for vets
});

const Veterinarian = mongoose.model("Veterinarian", VetSchema, "veterinarians");

export default Veterinarian;
