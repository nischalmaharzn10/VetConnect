import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role as user
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setRole(role); // Ensure role is set when selected
  };

const handleSubmit = (e) => {
  e.preventDefault();
  setError(null); // Clear any previous errors

  if (!selectedRole) {
    setError("Please select a role.");
    return; // Prevent form submission if no role is selected
  }

  fetch("http://localhost:5555/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role}),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        // If vet and NOT approved, redirect to waiting page
        if (selectedRole === "vet" && data.approved === false) {
          // Store user info (optional) without token
          localStorage.setItem("user", JSON.stringify(data.user));
          // Redirect to waiting page
          window.location.href = "/waitingpage";
          return;
        }

        if (data.token) {
          // Store token and user data in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect vets or users to their dashboards
          if (selectedRole === "vet") {
            window.location.href = "/vet-dashboard";
          } else {
            window.location.href = "/user-dashboard";
          }
        } else {
          setError(data.message || "Invalid credentials");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    })
    .catch(() => setError("An error occurred. Please try again."));
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-6 py-4 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-600 text-center mb-4">Login</h2>

        {/* Role Selection Section */}
        <div className="flex justify-center items-center gap-8 mb-6">
          {/* Vet Role Selection */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`relative w-20 h-20 rounded-full ${
                selectedRole === "vet" ? "border-4 border-blue-500" : "border-none"
              } shadow-md cursor-pointer`}
              onClick={() => handleRoleSelection("vet")}
            >
              <img
                src="/veterinarian.png"
                alt="Vet"
                className="w-14 h-14 rounded-full object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
              {selectedRole === "vet" && (
                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1 text-xs">
                  ✓
                </div>
              )}
            </div>
            <p className={`mt-2 ${selectedRole === "vet" ? "font-bold" : "text-gray-600"}`}>Vet</p>
          </div>

          {/* User Role Selection */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`relative w-20 h-20 rounded-full ${
                selectedRole === "user" ? "border-4 border-blue-500" : "border-none"
              } shadow-md cursor-pointer`}
              onClick={() => handleRoleSelection("user")}
            >
              <img
                src="/owner.png"
                alt="User"
                className="w-14 h-14 rounded-full object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
              {selectedRole === "user" && (
                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1 text-xs">
                  ✓
                </div>
              )}
            </div>
            <p className={`mt-2 ${selectedRole === "user" ? "font-bold" : "text-gray-600"}`}>User</p>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-3">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
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

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition"
        >
          Login
        </button>

        {/* Error Message */}
        {error && <p className="text-center text-red-500 mt-3">{error}</p>}

        <div className="mt-3 text-center">
          <span className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600">Sign up</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
