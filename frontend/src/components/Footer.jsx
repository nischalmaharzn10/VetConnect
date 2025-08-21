import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div id="footer" className="mt-auto w-full bg-gray-200 pt-8 px-10"> {/* Added side paddings here */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">

        {/* Left Section */}
        <div>
          <img
            className="mb-5 w-40"
            src="Logo.png" // Replace with your logo image
            alt="VetConnect Logo"
          />
          <p className="w-full md:w-2/3 text-gray-700 leading-6">
            VetConnect is here to help you connect with trusted veterinarians for your pet and livestock needs. 
            Book appointments and get professional care through our platform.
          </p>
        </div>

        {/* Company Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-700">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              className="cursor-pointer hover:text-blue-500"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:text-blue-500"
              onClick={() => navigate("/about")}
            >
              About Us
            </li>
            <li
              className="cursor-pointer hover:text-blue-500"
              onClick={() => navigate("/privacy-policy")}
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-700">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+9779862971796</li>
            <li>vetconnectsupport@gmail.com</li> {/* Replace with your support email */}
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-700">
          Copyright 2025 @ VetConnect - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
