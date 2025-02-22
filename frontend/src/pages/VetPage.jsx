import { useEffect, useState } from "react";
import axios from "axios";

const VetPage = () => {
  const [vets, setVets] = useState([]);

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
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Our Veterinarians</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {vets.map((vet) => (
          <div key={vet._id} className="bg-white shadow-lg rounded-lg p-5">
            <h3 className="text-xl font-semibold">{vet.name}</h3>
            <p className="text-gray-600">{vet.specialization}</p>
            <p className="text-gray-500">{vet.email}</p>
            <p className="text-gray-500">{vet.phoneNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetPage;
