import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active styling

const VetSidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-800 text-white shadow-md flex flex-col">
      {/* Logo / Branding */}


      {/* Sidebar Links */}
      <nav className="flex flex-col p-4 space-y-4">
        <NavLink
          to="/vet-dashboard"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/vet-appointments"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
          }
        >
          My Appointments
        </NavLink>

        <NavLink
          to="/vet/history"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
          }
        >
          Appointment History
        </NavLink>

        <NavLink
          to="/vet/update-profile"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
          }
        >
          Settings
        </NavLink>

      </nav>
    </div>
  );
};

export default VetSidebar;
