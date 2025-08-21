import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaPrescriptionBottle,
  FaHistory,
  FaPaw,
  FaUserMd,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with background image */}
      <section
        className="relative w-full h-[500px] flex flex-col justify-center px-8 md:px-20 text-white"
        style={{
          backgroundImage: 'url("/header-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Book Appointment <br /> With Trusted Doctors
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
          <button
            onClick={() => navigate("/vets")}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
          >
            Book Appointment{" "}
            <img className="w-4" src="rightarrow.png" alt="Arrow" />
          </button>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to VetConnect
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Connecting pet owners with qualified vets easily and efficiently.
        </p>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaCalendarCheck className="text-blue-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Online Appointment Booking</h3>
            <p className="text-gray-600">Book appointments with vets at your convenience.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaPrescriptionBottle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Digital Prescriptions</h3>
            <p className="text-gray-600">Access your prescriptions instantly and securely.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaHistory className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">History Retrieval</h3>
            <p className="text-gray-600">View past treatments, checkups, and pet history.</p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <FaPaw className="text-gray-500 text-4xl mb-2" />
            <p className="text-sm text-gray-700">Multiple Pets</p>
          </div>
          <div className="flex flex-col items-center">
            <FaUserMd className="text-gray-500 text-4xl mb-2" />
            <p className="text-sm text-gray-700">Qualified Doctors</p>
          </div>
          <div className="flex flex-col items-center">
            <FaHistory className="text-gray-500 text-4xl mb-2" />
            <p className="text-sm text-gray-700">Easy Tracking</p>
          </div>
          <div className="flex flex-col items-center">
            <FaCalendarCheck className="text-gray-500 text-4xl mb-2" />
            <p className="text-sm text-gray-700">Fast Scheduling</p>
          </div>
          <div className="flex flex-col items-center">
            <FaPrescriptionBottle className="text-gray-500 text-4xl mb-2" />
            <p className="text-sm text-gray-700">Instant Access</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
