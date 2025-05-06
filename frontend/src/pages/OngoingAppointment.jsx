import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VetSidebar from "../components/VetSidebar";

const OngoingAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    symptoms: "",
    medication: "",
    dosage: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`/api/appointments/${appointmentId}`);
        setAppointment(res.data.appointment);
      } catch (err) {
        console.error("❌ Error fetching appointment:", err.response?.data || err.message);
        alert("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinishAppointment = async () => {
    const { medication, dosage, instructions, symptoms } = prescription;
  
    if (!medication || !dosage || !instructions || !symptoms) {
      alert("Please fill in all prescription fields.");
      return;
    }
  
    try {
      setSubmitting(true);
  
      // Step 1: Update appointment status
      console.log("📤 Updating appointment status...");
      const statusPayload = {
        appointmentId,
        status: "completed",
      };
      console.log("🔁 Status Payload:", statusPayload);
  
      const statusRes = await axios.put(`/api/appointments/${appointmentId}/status`, statusPayload);
      console.log("✅ Status update response:", statusRes.data);
  
      // Step 2: Prepare full prescription data
      const prescriptionPayload = {
        symptoms,
        medication,
        dosage,
        instructions,
        petId: appointment.petId?._id,
        userId: appointment.userId?._id,
        vetId: appointment.vetId?._id,
        appointmentDate: appointment.appointmentDate,
        scheduledTime: appointment.scheduledTime,
      };
  
      console.log("📦 Full Prescription Payload:", prescriptionPayload);
  
      // Step 3: Submit prescription
      const prescriptionRes = await axios.put(
        `/api/appointments/${appointmentId}/prescription`,
        prescriptionPayload
      );
      console.log("✅ Prescription update response:", prescriptionRes.data);
  
      alert("✅ Appointment completed successfully.");
      navigate("/vet-dashboard");
    } catch (err) {
      console.error("❌ Error finishing appointment:", err.response?.data || err.message);
      alert("Failed to complete appointment. Check logs for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <VetSidebar />

      <div className="flex-1 container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Ongoing Appointment</h1>

        {loading ? (
          <p className="text-gray-500">Loading appointment details...</p>
        ) : appointment ? (
          <div className="space-y-6" style={{ maxWidth: "60%" }}>
            <div className="bg-white p-4 rounded shadow-md flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
                <p><strong>Pet Name:</strong> {appointment.petId?.name || "N/A"}</p>
                <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.scheduledTime}</p>
              </div>
              <div className="ml-4">
                <img
                  src={appointment.petId?.image || "/default-pet.jpg"}
                  alt={appointment.petId?.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-4">Prescription</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Symptoms</label>
                  <textarea
                    name="symptoms"
                    value={prescription.symptoms}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border p-2 rounded resize-none text-sm bg-gray-50 leading-6 font-mono"
                    placeholder="e.g., Vomiting, diarrhea"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 21px, rgba(0,0,0,0.08) 22px)",
                      backgroundSize: "100% 22px",
                      overflow: "hidden"
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Medication</label>
                  <textarea
                    name="medication"
                    value={prescription.medication}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border p-2 rounded resize-none text-sm bg-gray-50 leading-6 font-mono"
                    placeholder="e.g., Amoxicillin"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 21px, rgba(0,0,0,0.08) 22px)",
                      backgroundSize: "100% 22px",
                      overflow: "hidden"
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Dosage</label>
                  <textarea
                    name="dosage"
                    value={prescription.dosage}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border p-2 rounded resize-none text-sm bg-gray-50 leading-6 font-mono"
                    placeholder="e.g., 250mg twice a day"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 21px, rgba(0,0,0,0.1) 22px)",
                      backgroundSize: "100% 22px",
                      overflow: "hidden"
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Instructions</label>
                  <textarea
                    name="instructions"
                    value={prescription.instructions}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border p-2 rounded resize-none text-sm bg-gray-50 leading-6 font-mono"
                    placeholder="e.g., Take after meals for 5 days"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 21px, rgba(0,0,0,0.08) 22px)",
                      backgroundSize: "100% 22px",
                      overflow: "hidden"
                    }}
                  />
                </div>
              </form>
            </div>

            <div className="text-right">
              <button
                onClick={handleFinishAppointment}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={submitting}
              >
                {submitting ? "Finishing..." : "Finish Appointment"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Appointment not found.</p>
        )}
      </div>
    </div>
  );
};

export default OngoingAppointment;
