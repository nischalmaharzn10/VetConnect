import React from 'react';
import { Link } from 'react-router-dom'; // For navigation

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-800 text-white shadow-md">
      <div className="p-6 text-2xl font-semibold text-center text-gray-100">
        VetConnect
      </div>
      <div className="flex flex-col p-4 space-y-4">
        <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
        <Link to="/appointments" className="text-gray-300 hover:text-white">My Appointments</Link>
        <Link to="/pets" className="text-gray-300 hover:text-white">My Pets</Link>
        <Link to="/settings" className="text-gray-300 hover:text-white">Settings</Link>
      </div>
    </div>
  );
};

export default Sidebar;
