import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSendToken = async () => {
    try {
      await axios.post("http://localhost:5555/api/send-token/toemail", { email });
      alert("Verification code sent to your email.");
    } catch (err) {
      alert("Failed to send verification code.");
      console.error(err);
    }
  };

  const handleVerifyToken = async () => {
    try {
      const res = await axios.post("http://localhost:5555/api/send-token/verify-token", {
        email,
        token,
      });

      if (res.data?.success) {
        setIsTokenVerified(true);
        alert("Token verified successfully!");
      } else {
        setIsTokenVerified(false);
        alert("Invalid or expired token.");
      }
    } catch (err) {
      setIsTokenVerified(false);
      alert("Token verification failed.");
      console.error(err);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) return alert("Passwords do not match");
  if (!isTokenVerified) return alert("Please verify your email before registering.");
  if (!role) return alert("Please select a role.");

  setLoading(true);
  setError("");

  try {
    const url = role === "User"
      ? "http://localhost:5555/api/users/"
      : "http://localhost:5555/api/vets/";

    // Send plain JSON, no FormData
    const response = await axios.post(url, {
      name,
      email,
      phoneNumber,
      password,
      role,
      token // if your backend expects this, otherwise remove it
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    alert("Registration successful!");
    console.log("Registered:", response.data);
    window.location.href = "/login"; // redirect using plain JS


  } catch (err) {
    setError(err.response?.data?.message || "Registration failed.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Image Upload */}


        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        {/* Email + Get Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 p-2 border border-gray-300 rounded-md text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button
              type="button"
              onClick={handleSendToken}
              className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700"
            >
              Get Code
            </button>
          </div>
        </div>

        {/* Token + Verify */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Verification Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md text-black"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter the token sent to email"
              required
            />
            <button
              type="button"
              onClick={handleVerifyToken}
              className="bg-green-600 text-white px-3 rounded-md hover:bg-green-700"
            >
              Verify
            </button>
          </div>
          {isTokenVerified && (
            <p className="text-green-600 text-sm mt-1">Token verified!</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Your phone number"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <div className="flex gap-4">
            {["User", "Vet"].map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={r}
                  checked={role === r}
                  onChange={(e) => setRole(e.target.value)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 disabled:opacity-50"
          disabled={loading || !isTokenVerified}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
