import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VetSidebar from "../components/VetSidebar";

const states = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const districtsByState = {
  Koshi: [
    "Bhojpur",
    "Dhankuta",
    "Ilam",
    "Jhapa",
    "Khotang",
    "Morang",
    "Okhaldhunga",
    "Panchthar",
    "Sankhuwasabha",
    "Solukhumbu",
    "Sunsari",
    "Taplejung",
    "Terhathum",
    "Udayapur",
  ],
  Madhesh: [
    "Parsa",
    "Bara",
    "Rautahat",
    "Sarlahi",
    "Dhanusha",
    "Siraha",
    "Mahottari",
    "Saptari",
  ],
  Bagmati: [
    "Sindhuli",
    "Ramechhap",
    "Dolakha",
    "Bhaktapur",
    "Dhading",
    "Kathmandu",
    "Kavrepalanchok",
    "Lalitpur",
    "Nuwakot",
    "Rasuwa",
    "Sindhupalchok",
    "Chitwan",
    "Makwanpur",
  ],
  Gandaki: [
    "Baglung",
    "Gorkha",
    "Kaski",
    "Lamjung",
    "Manang",
    "Mustang",
    "Myagdi",
    "Nawalparasi",
    "Parbat",
    "Syangja",
    "Tanahun",
  ],
  Lumbini: [
    "Kapilvastu",
    "Nawalparasi",
    "Rupandehi",
    "Arghakhanchi",
    "Gulmi",
    "Palpa",
    "Dang",
    "Pyuthan",
    "Rolpa",
    "Eastern Rukum",
    "Banke",
    "Bardiya",
  ],
  Karnali: [
    "Western Rukum",
    "Salyan",
    "Dolpa",
    "Humla",
    "Jumla",
    "Kalikot",
    "Mugu",
    "Surkhet",
    "Dailekh",
    "Jajarkot",
  ],
  Sudurpashchim: [
    "Kailali",
    "Achham",
    "Doti",
    "Bajhang",
    "Bajura",
    "Kanchanpur",
    "Dadeldhura",
    "Baitadi",
    "Darchula",
  ],
};

const VetUpdateProfile = () => {
  const navigate = useNavigate();
  const [vet, setVet] = useState({
    _id: "",
    name: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    experience: "",
    qualifications: "",
    state: "",
    district: "",
    profileImage: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const { id } = JSON.parse(storedUser);

    axios
      .get(`http://localhost:5555/api/vets/personalinfo/${id}`)
      .then((res) => {
        setVet(res.data);
        setPreview(res.data.profileImage || "");
      })
      .catch((err) => {
        console.error("Failed to fetch vet info:", err);
        alert("Failed to fetch your profile. Please try again.");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset district if state changes
    if (name === "state") {
      setVet((prev) => ({ ...prev, state: value, district: "" }));
    } else {
      setVet((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in vet) {
        if (key !== "profileImage") formData.append(key, vet[key]);
      }
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      await axios.put(
        `http://localhost:5555/api/vets/update/${vet._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile updated successfully!");
      navigate("/vet-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <VetSidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8">Update Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-md p-8 rounded-lg max-w-3xl mx-auto"
        >
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-40 h-40 object-cover rounded-full mx-auto"
            />
          )}

          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="block mx-auto"
          />

          <input
            type="text"
            name="name"
            value={vet.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            name="email"
            value={vet.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            value={vet.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="specialization"
            value={vet.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            name="experience"
            value={vet.experience}
            onChange={handleChange}
            placeholder="Experience (years)"
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="qualifications"
            value={vet.qualifications}
            onChange={handleChange}
            placeholder="Qualifications"
            className="w-full p-3 border rounded"
          />

          <select
            name="state"
            value={vet.state}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            name="district"
            value={vet.district}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
            disabled={!vet.state}
          >
            <option value="">Select District</option>
            {vet.state &&
              districtsByState[vet.state].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default VetUpdateProfile;
