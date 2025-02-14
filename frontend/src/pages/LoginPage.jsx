import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");  // State for email
  const [password, setPassword] = useState("");  // State for password

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic (you can add validation here)
    console.log("Login submitted with:", email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-600 text-center mb-4">Login</h2>
        
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
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500"
        >
          Login
        </button>
        
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600">Sign up</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
