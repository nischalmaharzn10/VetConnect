import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="relative flex flex-col md:flex-row flex-wrap w-full h-[500px] border-[1px] border-solid border-black">
      {/* --------- Background Image --------- */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/header-bg.jpg")', // Set your image path here
          zIndex: -1, // Ensure background stays behind content
        }}
      ></div>

      {/* --------- Header Left --------- */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[5vw]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <p>
            Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block" />
            schedule your appointment hassle-free.
          </p>
        </div>
        {/* Button to navigate to VetPage */}
        <button
          onClick={() => navigate('/vets')}
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-blue-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book appointment <img className="w-3" src="rightarrow.png" alt="Arrow" />
        </button>
      </div>
    </div>
  );
};

export default Header;
