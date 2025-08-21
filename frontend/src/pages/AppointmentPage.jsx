import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const AppointmentPage = () => {
  const { id } = useParams();
  const [vet, setVet] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("clinic visit");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 5);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("Please log in to view this vet's details.");
          return;
        }

        const res = await axios.get(`http://localhost:5555/api/vets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVet(res.data);
      } catch (error) {
        console.error("Error fetching vet details:", error);
      }
    };

    const fetchUserAndPets = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) return;

      setUser(storedUser);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5555/api/pets/user/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPets(res.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchVet();
    fetchUserAndPets();
  }, [id]);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!appointmentDate) return;

      try {
        const res = await axios.get(`http://localhost:5555/api/appointments/booked-times/${id}/${appointmentDate}`);
        setBookedTimes(res.data);
      } catch (error) {
        console.error("Error fetching booked times:", error);
      }
    };

    fetchBookedTimes();
  }, [appointmentDate, id]);

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 10; hour < 13; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        timeSlots.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    }
    for (let hour = 14; hour < 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        timeSlots.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    }
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (e, time) => {
    e.preventDefault();
    if (!bookedTimes.includes(time)) {
      setAppointmentTime(time);
    }
  };

const handleBookNowClick = async (e) => {
  e.preventDefault();

  // 🔍 Basic form validations
  if (!appointmentDate || !appointmentTime) {
    setStatus("❌ Error 400: Please select both a date and a time.");
    return;
  }

  if (!user?.id) {
    setStatus("❌ Error 401: Please log in to book an appointment.");
    return;
  }

  if (!selectedPet) {
    setStatus("❌ Error 402: Please select a pet.");
    return;
  }

  try {
    // 📡 Send booking request to backend
    const response = await axios.post(
      "http://localhost:5555/api/appointments/create",
      {
        userId: user.id,
        vetId: id,
        petId: selectedPet._id,
        appointmentDate,
        scheduledTime: appointmentTime,
        appointmentType,
        isPaid: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const { appointment } = response.data;

    console.log("✅ Appointment created:", appointment);

    const bookingId = appointment?._id;

    if (!bookingId) {
      setStatus("❌ Error: Booking ID is missing from server response.");
      return;
    }

    // ⏳ Optional short delay before redirecting
    console.log("🔁 Redirecting to payment for booking ID:", bookingId);
    setTimeout(() => {
      window.location.href = `http://localhost:5555/api/payment/esewa/pay/${bookingId}`;
    }, 1000);

  } catch (error) {
    console.error("❌ Error booking appointment:", error);

    const message = error.response?.data?.message 
      || "There was an issue while booking your appointment.";
    
    setStatus(`Error: ${message}`);
  }
};



  if (!vet) return <p className="text-center text-gray-500">Loading vet details...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-8 md:w-3/4">
        <div className="bg-white shadow-md rounded-lg p-6 md:w-2/3 relative">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center p-0 shadow-md">
            <img src="/default-vet-image.jpg" alt="Vet Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{vet.name}</h2>
          <p className="text-gray-600">{vet.email}</p>
          <p className="text-gray-500">{vet.phoneNumber}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 md:w-1/3">
          <h3 className="text-xl font-semibold mb-4">Book an Appointment</h3>
          {user && <p className="mb-4 text-gray-600">Hello, <span className="font-medium">{user.name}</span></p>}

          <form autoComplete="off">
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            >
              <option value="clinic visit">Clinic Visit</option>
              <option value="online consultation">Online Consultation</option>
            </select>

            <input
              type="date"
              min={today}
              max={maxDateStr}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              onChange={(e) => setAppointmentDate(e.target.value)}
              value={appointmentDate}
            />

            <h4 className="text-lg font-semibold mb-2">Select Appointment Time</h4>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <button
                    key={time}
                    onClick={(e) => handleTimeSelect(e, time)}
                    disabled={isBooked}
                    className={`p-2 rounded-md border 
                      ${isBooked ? "bg-red-200 text-red-700 cursor-not-allowed" :
                        appointmentTime === time ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            {appointmentTime && <p className="mt-3 text-center text-blue-600">Selected time: {appointmentTime}</p>}

            <button
              type="button"
              onClick={() => setIsPetModalOpen(true)}
              className="mt-4 w-full bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
            >
              Select Pet
            </button>

            {selectedPet && (
              <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md w-full">
                <img src={selectedPet.image || "/default-pet.jpg"} alt={selectedPet.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                <div>
                  <p className="text-sm font-medium">{selectedPet.name}</p>
                  <p className="text-xs text-gray-500">{selectedPet.breed}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleBookNowClick}
              className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500 transition flex items-center justify-center gap-2"
            >
              <span>Continue to Pay</span>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/1/16/ESewa_Logo.png/320px-ESewa_Logo.png"
                alt="eSewa Logo"
                className="h-6 w-auto"
              />
            </button>


            {showDialog && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-lg font-semibold text-center">
                    Your appointment has been booked successfully!
                  </p>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => {
                        setShowDialog(false);
                        navigate('/appointments'); // Navigates to the /appointments route
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-sm"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          {status && <p className={`mt-4 text-center ${status.includes("Error") ? "text-red-500" : "text-green-500"}`}>{status}</p>}
        </div>
      </div>

      {/* Pet Modal */}
      {isPetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsPetModalOpen(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">Select a Pet</h3>
            <div className="grid grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  onClick={() => {
                    setSelectedPet(pet);
                    setIsPetModalOpen(false);
                  }}
                  className="cursor-pointer flex flex-col items-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                >
                  <img
                    src={pet.image || "/default-pet.jpg"}
                    alt={pet.name}
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                  <p className="text-sm font-medium">{pet.name}</p>
                  <p className="text-xs text-gray-500">{pet.breed}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;