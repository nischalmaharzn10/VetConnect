import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true,
    trim: true,
  },
  animalType: {
    type: String,
    required: true,
    enum: ["Dog", "Cat", "Bird", "Reptile", "Livestock", "Other"], // Example types
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field to calculate age dynamically
clientSchema.virtual("age").get(function () {
  if (!this.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

// Ensure virtuals are included in JSON output
clientSchema.set("toJSON", { virtuals: true });
clientSchema.set("toObject", { virtuals: true });

const Client = mongoose.model("Client", clientSchema);

export default Client;
