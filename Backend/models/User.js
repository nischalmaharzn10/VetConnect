import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "User" },
});

const User = mongoose.model("User", UserSchema, "users");

export default User;  // ✅ Use ES module export
