import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

// Set up the server URL for Socket.IO
const socket = io("http://localhost:5555"); // Update with your deployed server URL if needed

const VideoCall = () => {
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
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

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
    startWebRTC();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [appointmentId]);

  const startWebRTC = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(userStream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = userStream;
      }

      const peer = new RTCPeerConnection();
      setPeerConnection(peer);

      userStream.getTracks().forEach((track) => peer.addTrack(track, userStream));

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", event.candidate, appointmentId);
        }
      };

      peer.ontrack = (event) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = event.streams[0];
        }
      };

      socket.emit("join-room", appointmentId);
    } catch (error) {
      console.error("❌ Error setting up WebRTC:", error);
    }
  };

  useEffect(() => {
    if (!peerConnection) return;

    socket.on("receive-ice-candidate", (candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("receive-offer", async (offer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("send-answer", answer, appointmentId);
    });

    socket.on("receive-answer", async (answer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    return () => {
      socket.off("receive-ice-candidate");
      socket.off("receive-offer");
      socket.off("receive-answer");
    };
  }, [peerConnection]);

  useEffect(() => {
    socket.on("user-accepted-call", () => {
      setCallAccepted(true);
      startWebRTC(); // Start stream when user joins
    });

    return () => {
      socket.off("user-accepted-call");
    };
  }, []);

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

      await axios.put(`/api/appointments/${appointmentId}/status`, {
        appointmentId,
        status: "completed",
      });

      await axios.put(`/api/appointments/${appointmentId}/prescription`, {
        symptoms,
        medication,
        dosage,
        instructions,
        petId: appointment.petId?._id,
        userId: appointment.userId?._id,
        vetId: appointment.vetId?._id,
        appointmentDate: appointment.appointmentDate,
        scheduledTime: appointment.scheduledTime,
      });

      alert("✅ Appointment completed successfully.");
      navigate("/vet-dashboard");
    } catch (err) {
      console.error("❌ Error finishing appointment:", err.response?.data || err.message);
      alert("Failed to complete appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Video Layout */}
      <div className="flex flex-col w-2/3 gap-4 p-4">
        <h2 className="text-2xl font-bold mb-2">Video Consultation</h2>

        {/* Video containers */}
        <div className="flex flex-col gap-4">
          {/* Vet Screen */}
          <div className="w-[720px] h-[405px] border border-gray-300 rounded-lg overflow-hidden bg-black text-white flex justify-center items-center relative">
            <span className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 px-2 py-1 text-sm rounded">Vet Screen</span>
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Pet Owner Screen */}
          <div className="w-[720px] h-[405px] border border-gray-300 rounded-lg overflow-hidden bg-black text-white flex justify-center items-center relative">
            <span className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 px-2 py-1 text-sm rounded">Pet Owner Screen</span>
            <video
              ref={peerVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!callAccepted && (
              <div className="absolute bottom-4 flex justify-center w-full">
                <button
                  onClick={() => socket.emit("invite-user", appointment?.userId?._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  Invite Pet Owner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Prescription Form */}
      <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Prescription</h2>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Pet: {appointment?.petId?.name}</h3>
          <h3 className="text-sm font-medium text-gray-700">Owner: {appointment?.userId?.name}</h3>
          <h3 className="text-sm font-medium text-gray-700">Vet: {appointment?.vetId?.name}</h3>
        </div>
        <form className="space-y-4">
          {["symptoms", "medication", "dosage", "instructions"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-1 capitalize">{field}</label>
              <textarea
                name={field}
                rows="4"
                value={prescription[field]}
                onChange={handleChange}
                className="w-full border p-2 rounded resize-none text-sm bg-gray-50"
              />
            </div>
          ))}
        </form>
        <div className="text-right mt-4">
          <button
            onClick={handleFinishAppointment}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Finishing..." : "Finish Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
