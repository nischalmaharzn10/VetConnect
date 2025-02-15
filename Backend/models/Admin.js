import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Admin" }, 
});

const Admin = mongoose.model("Admin", AdminSchema, "admins");

export default Admin;  // ✅ Use ES module export
