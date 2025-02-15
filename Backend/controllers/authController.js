const User = require("../models/User");
const Vet = require("../models/Veterinarian");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    let role = "User";

    if (!user) {
      user = await Vet.findOne({ email });
      role = "Vet";
    }
    if (!user) {
      user = await Admin.findOne({ email });
      role = "Admin";
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
