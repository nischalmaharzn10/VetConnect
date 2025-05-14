// src/components/Header.jsx

import React from "react";

const Header = () => {
  const userName = "Admin"; // Placeholder for now

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
      <div className="text-2xl font-semibold text-blue-600">🐾 VetConnect</div>
      <div className="flex items-center gap-3">
        <img
          src="https://via.placeholder.com/32"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-800 font-medium">{userName}</span>
      </div>
    </div>
  );
};

export default Header;
