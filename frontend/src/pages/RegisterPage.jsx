import React, { useState } from "react";
import axios from "axios"; // Import axios for making API calls

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState(""); // State for selected role
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = { name, email, phoneNumber, password };

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      let response;
    
      if (role === "User") {
        response = await axios.post("http://localhost:5555/api/users", formData, {
          headers: {
            "Content-Type": "application/json" // Ensure data is sent as JSON
          }
        });
      } else if (role === "Vet") {
        response = await axios.post("http://localhost:5555/api/vets", formData, {
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else {
        alert("Please select a valid role (User or Vet).");
        return;
      }
    
      console.log(`${role} registered successfully:`, response.data);
      alert("Registration successful!");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Error during registration:", err.response ? err.response.data : err);
      
      if (err.response) {
        // Show specific error from backend
        setError(err.response.data.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-600 text-center mb-4">Sign Up</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="roleUser"
                name="role"
                value="User"
                checked={role === "User"}
                onChange={(e) => setRole(e.target.value)}
                className="text-black"
              />
              <label htmlFor="roleUser" className="text-black">User</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="roleVet"
                name="role"
                value="Vet"
                checked={role === "Vet"}
                onChange={(e) => setRole(e.target.value)}
                className="text-black"
              />
              <label htmlFor="roleVet" className="text-black">Vet</label>
            </div>

          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600">Login</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
