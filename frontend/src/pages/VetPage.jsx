import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import Sidebar component

const VetPage = () => {
  const [vets, setVets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await axios.get("http://localhost:5555/api/vets");
        setVets(res.data);
      } catch (error) {
        console.error("Error fetching vets:", error);
      }
    };

    fetchVets();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="container mx-auto p-6 flex-1">
        <h2 className="text-3xl font-bold text-center mb-6">Our Veterinarians</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <div
              key={vet._id}
              className="bg-gradient-to-b from-gray-200 to-gray-400 shadow-lg rounded-lg p-5 cursor-pointer hover:scale-105 transition transform hover:shadow-xl"
              onClick={() => navigate(`/appointment/${vet._id}`)}
            >
              <h3 className="text-xl font-semibold">{vet.name}</h3>
              <p className="text-gray-700">{vet.email}</p>
              <p className="text-gray-700">{vet.phoneNumber}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VetPage;
