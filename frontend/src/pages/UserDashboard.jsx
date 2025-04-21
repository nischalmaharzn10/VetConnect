import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect to login if user is not found
    }
  }, [navigate]);

  return user ? (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <p className="text-lg">Welcome, {user.name}!</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
          onClick={() => navigate("/vets")}
        >
          Book Appointment
        </button>
      </div>
    </div>
  ) : null;
};

export default UserDashboard;
