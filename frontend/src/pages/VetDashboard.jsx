import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const VetDashboard = () => {
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);

  useEffect(() => {
    const storedVet = localStorage.getItem("user");
    if (storedVet) {
      setVet(JSON.parse(storedVet));
    } else {
      navigate("/login"); // Redirect to login if vet is not found
    }
  }, [navigate]);

  return vet ? (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-bold">Vet Dashboard</h2>
        <p className="text-lg">Welcome, Dr. {vet.name}!</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
          onClick={() => navigate("/start-session")}
        >
          Start Online Session
        </button>
      </div>
    </div>
  ) : null;
};

export default VetDashboard;
