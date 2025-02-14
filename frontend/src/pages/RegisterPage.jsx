import React, { useState } from "react";
import axios from "axios"; // Import axios for making API calls

const RegisterPage = () => {
  const [name, setName] = useState("");  // State for name
  const [email, setEmail] = useState("");  // State for email
  const [phoneNumber, setPhoneNumber] = useState("");  // State for phone number
  const [role, setRole] = useState("");  // State for selected role (only one role can be selected)
  const [password, setPassword] = useState("");  // State for password
  const [confirmPassword, setConfirmPassword] = useState("");  // State for confirm password
  const [loading, setLoading] = useState(false);  // Loading state for the submit button
  const [error, setError] = useState("");  // Error message state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare form data to send
    const formData = { name, email, phoneNumber, role, password };

    setLoading(true); // Show loading spinner or disable submit button

    try {
      // Send POST request to your backend API
      const response = await axios.post("http://your-backend-api.com/register", formData);

      console.log("User registered successfully:", response.data);
      // You can redirect the user to another page or show a success message
      alert("Registration successful!");

      // Optionally, you can redirect the user to the login page after registration
      // window.location.href = "/login"; 
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Error during registration:", err);
    } finally {
      setLoading(false); // Reset loading state after the request completes
    }
  };

  // Handle changes in role selection (only one role at a time)
  const handleRoleChange = (e) => {
    setRole(e.target.value);  // Update state to the clicked role
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-600 text-center mb-4">Sign Up</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Display error message */}

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}  // Bind value to the state
            onChange={(e) => setName(e.target.value)}  // Handle changes
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}  // Bind value to the state
            onChange={(e) => setEmail(e.target.value)}  // Handle changes
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your email"
            required
          />
        </div>
        
        {/* Phone Number Input */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}  // Bind value to the state
            onChange={(e) => setPhoneNumber(e.target.value)}  // Handle changes
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Role Selection (Radio Buttons for Customer, Vet, Admin) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="roleCustomer"
                name="role"
                value="Customer"
                checked={role === "Customer"}
                onChange={handleRoleChange}
                className="text-black"
              />
              <label htmlFor="roleCustomer" className="text-black">Customer</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="roleVet"
                name="role"
                value="Vet"
                checked={role === "Vet"}
                onChange={handleRoleChange}
                className="text-black"
              />
              <label htmlFor="roleVet" className="text-black">Vet</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="roleAdmin"
                name="role"
                value="Admin"
                checked={role === "Admin"}
                onChange={handleRoleChange}
                className="text-black"
              />
              <label htmlFor="roleAdmin" className="text-black">Admin</label>
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}  // Bind value to the state
            onChange={(e) => setPassword(e.target.value)}  // Handle changes
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}  // Bind value to the state
            onChange={(e) => setConfirmPassword(e.target.value)}  // Handle changes
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500"
          disabled={loading} // Disable button when loading
        >
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
