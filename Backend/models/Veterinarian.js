import mongoose from "mongoose";

const VetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Vet" },
});

const Vet = mongoose.model("Vet", VetSchema, "veterinarians");

export default Vet; // ✅ Use ES module export
