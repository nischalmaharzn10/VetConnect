import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AppointmentPage = () => {
  const { id } = useParams(); // Get the vet ID from the URL
  const [vet, setVet] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [user, setUser] = useState(null); // Added user state to store user data
  const [status, setStatus] = useState(""); // State for status messages

  useEffect(() => {
    // Fetching the vet details
    const fetchVet = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("Please log in to view this vet's details.");
          return; // Prevent fetching if not logged in
        }

        // Include token in the request headers
        const res = await axios.get(`http://localhost:5555/api/vets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setVet(res.data);
      } catch (error) {
        console.error("Error fetching vet details:", error);
      }
    };

    // Fetch user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("vets")); // Assuming user data is stored as a JSON string
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("Retrieved User Data:", parsedUser); // Debugging
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.warn("No user found in localStorage");
    }

    //trying to retrieve user correctly

    fetchVet();
  }, [id]);

  if (!vet) {
    return <p className="text-center text-gray-500">Loading vet details...</p>;
  }

  // Generate time slots for 10 AM to 1 PM and 2 PM to 4 PM with 30-minute intervals
  const generateTimeSlots = () => {
    const timeSlots = [];

    // Morning (10 AM to 1 PM)
    for (let hour = 10; hour < 13; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push(timeString);
      }
    }

    // Afternoon (2 PM to 4 PM)
    for (let hour = 14; hour < 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push(timeString);
      }
    }

    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (e, time) => {
    e.preventDefault(); // Prevent the form submission or page refresh
    setAppointmentTime(time);
  };

  // Function to handle booking when "Book Now" is clicked
const handleBookNowClick = async (e) => {
  e.preventDefault(); // Prevent form submission or page refresh

  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log("Stored User from localStorage:", storedUser);
  
  if (storedUser) {
    setUser(storedUser); // Set user if found
  }// Debug localStorage retrieval
  
  console.log("User Data:", user); // Debug full user object
  console.log("User ID:", user?.id); // Debug user.id to see if it's null

  if (!appointmentDate || !appointmentTime) {
    setStatus("Error 400: Please select both a date and a time.");
    return;
  }

  if (!user || !user.id) {
    setStatus("Error 401: Please log in to book an appointment.");
    return;
  }

  try {
    const response = await axios.post(
      "/api/appointments/create",
      {
        userId: user.id, // Use user._id from the user data
        vetId: id, // The selected veterinarian's ID

        appointmentDate, // The selected date
        appointmentTime, // The selected time
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the JWT token for authentication

        },
      }
    );
    console.log("Booking successful:", response.data);
    setStatus("Your appointment has been booked successfully!"); // Success message
  } catch (error) {
    console.error("Error booking appointment:", error);

    // Extract error number from response (if available)
    // const errorCode = error.response?.status || 500; // Default to 500 if no response status

    setStatus(`Error ${user.id}: There was an issue while booking your appointment.`);
  }
};

return (
  <div className="flex">
    {/* Sidebar */}

    <Sidebar />

    {/* Main Content */}
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-8 md:w-3/4">
      
      {/* Left Side - Vet Profile */}
      <div className="bg-white shadow-md rounded-lg p-6 md:w-2/3 relative">
        {/* Vet Image */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center p-0 shadow-md">
          <img 
            src="/default-vet-image.jpg" 
            alt="Vet Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Vet Details */}
        <h2 className="text-3xl font-bold mb-2">{vet.name}</h2>
        <p className="text-gray-600">{vet.email}</p>
        <p className="text-gray-500">{vet.phoneNumber}</p>
      </div>

      {/* Right Side - Booking Section */}
      <div className="bg-white shadow-md rounded-lg p-6 md:w-1/3">
        <h3 className="text-xl font-semibold mb-4">Book an Appointment</h3>

        {/* Display User Name */}
        {user && (
          <p className="mb-4 text-gray-600">Hello, <span className="font-medium">{user.name}</span></p>
        )}

        {/* Form with autocomplete off */}
        <form autoComplete="off">
          {/* Date Selection */}
          <input
            type="date"
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            onChange={(e) => setAppointmentDate(e.target.value)}
            value={appointmentDate}
            autoComplete="off" // Prevent autofill
          />

          {/* Time Slot Selection */}
          <h4 className="text-lg font-semibold mb-2">Select Appointment Time</h4>
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={(e) => handleTimeSelect(e, time)} // Prevent form submit and select time
                className={`p-2 rounded-md border ${appointmentTime === time ? "bg-blue-500 text-white" : "bg-white text-black"}`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Selected Time Display */}
          {appointmentTime && (
            <p className="mt-3 text-center text-blue-600">Selected time: {appointmentTime}</p>
          )}

          {/* Book Appointment Button */}
          <button
            type="button" // Use "button" type to prevent the form from submitting automatically
            onClick={handleBookNowClick} // Trigger booking logic
            className="mt-4 w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition"
          >
            Book Now
          </button>
        </form>

        {/* Status Message */}
        {status && (
          <p className={`mt-4 text-center ${status.includes("error") ? "text-red-500" : "text-green-500"}`}>
            {status}
          </p>
        )}
      </div>
      
    </div>
  </div>
);
};

export default AppointmentPage;
