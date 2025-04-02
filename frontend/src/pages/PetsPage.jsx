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
  const [newPet, setNewPet] = useState({
    name: "", image: "", breed: "", gender: "", color: "", description: ""
  });

  
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
  
    try {
      // Decode JWT token manually (without external libraries)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
  
      console.log("Current time:", now, "Token expires:", payload.exp);
  
      if (now >= payload.exp) {
        alert("Session expired. Please log in again."); // ✅ Alert user instead of console.log
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      alert("Invalid session. Please log in again."); // ✅ Show alert on decoding error
      navigate("/login");
      return;
    }
  
    // Get user from local storage
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
  
      if (!storedUser || !storedUser.id) {
        console.error("User not found in local storage:", storedUser,storedUser.id); // ✅ Print to console
        alert("User not found. Please log in again."); // ✅ Show alert
        navigate("/login");
        return;
      }
      
  
      console.log("Stored User:", storedUser, "User ID:", storedUser.id);
      setUser(storedUser);
  
      // Fetch pets if user ID is valid
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
      console.log("Token:", token);
  
      if (!userId) {
        console.error("❌ User ID is missing");
        return;
      }
  
      const res = await axios.get(`http://localhost:5555/api/pets/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Response:", res.data);
      setPets(res.data);
    } catch (error) {
      console.error("Error fetching pets:", error.response?.data || error.message);
    }
  };
  
  

  const handleChange = (e) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPet({ ...newPet, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPet = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
  
    console.log("User info and token:", user, token);
    console.log("Current time (seconds):", Math.floor(Date.now() / 1000));
  
    if (!user || !token) {
      alert("User not authenticated. Please log in again.");
      navigate("/login");
      return;
    }
  
    try {
      console.log("Token being sent:", token ? token.substring(0, 15) + "..." : "No token found");
      console.log("User ID:", user?.id);
      console.log("New Pet Data:", newPet);  // Debugging log // Debug the new pet data
  
      // Ensure newPet has all required fields before sending the request
      if (!newPet.name || !newPet.breed || !newPet.gender || !newPet.color || !newPet.description) {
        alert("Please fill in all the fields to add a new pet.");
        return;
      }
  
      const res = await axios.post(
        "http://localhost:5555/api/pets", // Correct endpoint
        {
          userId: user.id, // Ensure pet is linked to the user
          name: newPet.name,
          image: newPet.image,
          breed: newPet.breed,
          gender: newPet.gender,
          color: newPet.color,
          description: newPet.description,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      console.log("API Response:", res); // Debug the full response
  
      // Check if the pet was returned and added to state
      if (res.data?.pet) {
        setPets((prevPets) => [...prevPets, res.data.pet]); // Safely update state based on previous state
        setIsModalOpen(false);
        setNewPet({ name: "", image: "", breed: "", gender: "", color: "", description: "" });
      } else {
        console.error("Invalid response from server:", res);
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      if (error.response) {
        alert(error.response?.data?.message || "Failed to add pet");
      } else {
        alert("Unexpected error occurred while adding pet.");
      }
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
      console.log(`Attempting to delete pet with ID: ${deletePetId}`);
  
      await axios.delete(`http://localhost:5555/api/pets/${deletePetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== deletePetId));
      setDeletePetId(null);
      console.log(`Pet with ID: ${deletePetId} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete pet:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete pet. Please try again.");
    }
  };
  


  

  return user ? (
    <div className="flex h-screen">
      
      <Sidebar />
      <div className="p-6 flex-1">
      <p className="text-lg">Welcome, {user.name}! (User ID: {user.id})</p>

        <h2 className="text-2xl font-bold mb-4">My Pets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet._id} className="bg-white p-4 rounded-lg shadow-md relative">
              <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => setDeletePetId(pet._id)}>
                <FaTrash size={18} />
              </button>
              {pet.image && <img src={pet.image} alt={pet.name} className="w-full h-32 object-cover rounded-lg mb-2" />}
              <h3 className="text-lg font-semibold">{pet.name}</h3>
              <p className="text-gray-600">{pet.breed}</p>
              <p className="text-gray-500">Gender: {pet.gender}</p>
              <p className="text-gray-500">Color: {pet.color}</p>
              <p className="text-gray-500">{pet.description}</p>
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
