import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PetsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePetId, setDeletePetId] = useState(null);
  const [newPet, setNewPet] = useState({ name: "", image: "", breed: "", gender: "", color: "", description: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      if (now >= payload.exp) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      alert("Invalid session. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        console.error("User not found in local storage:", storedUser, storedUser?.id);
        alert("User not found. Please log in again.");
        navigate("/login");
        return;
      }
      setUser(storedUser);
      fetchPets(storedUser.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      alert("Error retrieving user data. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchPets = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!userId) {
        console.error("❌ User ID is missing");
        return;
      }
      const res = await axios.get(`http://localhost:5555/api/pets/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPets(res.data);
    } catch (error) {
      console.error("Error fetching pets:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => setNewPet({ ...newPet, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPet({ ...newPet, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddPet = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("User not authenticated. Please log in again.");
      navigate("/login");
      return;
    }

    if (!newPet.name || !newPet.breed || !newPet.gender || !newPet.color || !newPet.description) {
      alert("Please fill in all the fields to add a new pet.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5555/api/pets",
        { userId: user.id, ...newPet },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.data?.pet) {
        setPets((prevPets) => [...prevPets, res.data.pet]);
        setIsModalOpen(false);
        setNewPet({ name: "", image: "", breed: "", gender: "", color: "", description: "" });
      } else {
        console.error("Invalid response from server:", res);
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      alert(error.response?.data?.message || "Failed to add pet.");
    }
  };

  const handleDeletePet = async () => {
    if (!deletePetId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5555/api/pets/${deletePetId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== deletePetId));
      setDeletePetId(null);
    } catch (error) {
      console.error("Failed to delete pet:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete pet. Please try again.");
    }
  };

  return user ? (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1 overflow-y-auto">
        <p className="text-lg">Welcome, {user.name}! (User ID: {user.id})</p>
        <h2 className="text-2xl font-bold mb-4">My Pets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-gray-100 px-4 py-5 rounded-lg shadow-md relative w-full max-w-[220px] mx-auto flex flex-col items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => navigate("/pet-details", { state: { pet } })}
            >
              <button className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10" onClick={(e) => { e.stopPropagation(); setDeletePetId(pet._id); }}>
                <FaTrash size={18} />
              </button>
              <div className="w-28 h-28 mb-3 overflow-hidden rounded-full border border-black">
                <img src={pet.image || "/default-pet.jpg"} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-center">{pet.name}</h3>
              <p className="text-gray-600 text-center">{pet.breed}</p>
              <p className="text-gray-500 text-center">Gender: {pet.gender}</p>
              <p className="text-gray-500 text-center">Color: {pet.color}</p>
              <div className="absolute bottom-0 right-2 text-blue-600 text-xs pointer-events-none">View Details &gt;&gt;&gt;</div>
            </div>
          ))}
        </div>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500" onClick={() => setIsModalOpen(true)}>Add New Pet</button>
      </div>

      {deletePetId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to remove this pet?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setDeletePetId(null)}>Cancel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={handleDeletePet}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Pet</h3>
            <input type="text" name="name" placeholder="Pet Name" value={newPet.name} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded mb-3" />
            <input type="text" name="breed" placeholder="Breed" value={newPet.breed} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            <input type="text" name="gender" placeholder="Gender" value={newPet.gender} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            <input type="text" name="color" placeholder="Color" value={newPet.color} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            <textarea name="description" placeholder="Description" value={newPet.description} onChange={handleChange} className="w-full p-2 border rounded mb-3"></textarea>
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleAddPet}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default PetsPage;
