import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

// Set up the server URL for Socket.IO
const socket = io("http://localhost:5555");

const ClientVideoCall = () => {
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
  const [showNotification, setShowNotification] = useState(false);
  const [isVet, setIsVet] = useState(false);

  const userVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  // Fetch appointment details and handle user authentication
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser ? currentUser.id : null;
    console.log("👤 Current user ID:", currentUserId);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Token not found, user is not authenticated!");
      alert("User is not authenticated. Please login.");
      return;
    }
    console.log("🔑 Token found:", token);

    const fetchAppointment = async () => {
      try {
        console.log("📅 Searching for appointments...");
        const res = await axios.get(`/api/appointments/users/${currentUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedAppointments = res.data.appointments || res.data;
        console.log("📄 Loaded appointments:", fetchedAppointments);
    
        // Filter appointments to find online consultations and sort them by appointment date
        const onlineAppointments = fetchedAppointments
          .filter((appt) => appt.appointmentType === 'online consultation' && appt.status === 'scheduled')
          .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    
        console.log("🔍 Filtered online consultation appointments:", onlineAppointments);
    
        // Find the next online consultation appointment
        const nextAppointment = onlineAppointments.find((appt) => new Date(appt.appointmentDate) > new Date());
        console.log("📅 Next online consultation appointment:", nextAppointment);
    
        if (nextAppointment) {
          setAppointment(nextAppointment);
          console.log("📄 Next online consultation appointment:", nextAppointment);
    
          if (nextAppointment?.vetId?._id === currentUserId) {
            console.log("👨‍⚕️ This appointment belongs to the current vet.");
            setIsVet(true);
          } else {
            console.log("👩‍⚕️ This appointment does not belong to the current vet.");
          }
        } else {
          console.log("📅 No upcoming online consultation appointment found.");
          setAppointment(null);
        }
    
      } catch (err) {
        console.error("❌ Failed to fetch appointments:", err);
        alert("Failed to load appointments.");
      } finally {
        console.log("✅ Fetching appointments completed.");
        setLoading(false);
      }
    };
    
    fetchAppointment();
    
  }, []);

  // Cleanup function when component unmounts or changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [appointmentId]);

  // Start WebRTC connection
  const startWebRTC = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("📹 Got user media");
      setStream(userStream);

      if (userVideoRef.current) {
        userVideoRef.current.srcObject = userStream;
      }

      const peer = new RTCPeerConnection();
      setPeerConnection(peer);
      userStream.getTracks().forEach((track) => peer.addTrack(track, userStream));

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("📤 Sending ICE candidate:", event.candidate);
          socket.emit("send-ice-candidate", event.candidate, appointmentId);
        }
      };

      peer.ontrack = (event) => {
        console.log("📥 Received peer track");
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = event.streams[0];
        }
      };

      const currentUserId = localStorage.getItem("userId");
      socket.emit("join-room", appointmentId);
      console.log("🔗 Joined room:", appointmentId);

      if (!isVet) {
        console.log("📞 Accepting call, notifying vet...");
        socket.emit("accept-call", null, appointmentId);
      }
    } catch (error) {
      console.error("❌ WebRTC error:", error);
    }
  };

  // Handle WebRTC signaling (offer, answer, ice candidates)
  useEffect(() => {
    if (!peerConnection) return;

    socket.on("receive-ice-candidate", (candidate) => {
      console.log("❄️ Received ICE candidate:", candidate);
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("receive-offer", async (offer) => {
      console.log("📩 Received offer:", offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("send-answer", answer, appointmentId);
      console.log("📤 Sent answer:", answer);
    });

    socket.on("receive-answer", async (answer) => {
      console.log("📩 Received answer:", answer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    return () => {
      socket.off("receive-ice-candidate");
      socket.off("receive-offer");
      socket.off("receive-answer");
    };
  }, [peerConnection, appointmentId]);

  // Call invitation and acceptance
  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");

    socket.on("call-invitation", ({ userId: invitedUserId, appointmentId: invitedApptId }) => {
      console.log("📨 Received call invitation:", invitedUserId, invitedApptId);
      if (currentUserId === invitedUserId && invitedApptId === appointmentId) {
        setShowNotification(true);
      }
    });

    socket.on("user-accepted-call", () => {
      console.log("✅ Call accepted. Starting WebRTC...");
      setCallAccepted(true);
      if (isVet) startWebRTC(); // Only vet starts on accept
    });

    return () => {
      socket.off("call-invitation");
      socket.off("user-accepted-call");
    };
  }, [isVet, appointmentId]);

  // Accept the call
  const acceptCall = () => {
    console.log("👍 User accepted call.");
    setShowNotification(false);
    setCallAccepted(true);
    startWebRTC();
  };

  // Decline the call
  const declineCall = () => {
    console.log("👎 User declined call.");
    setShowNotification(false);
    socket.emit("decline-call", appointmentId);
    navigate("/user-dashboard");
  };

  // Handle prescription changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  // Finish appointment
  const handleFinishAppointment = async () => {
    const { medication, dosage, instructions, symptoms } = prescription;
    if (!medication || !dosage || !instructions || !symptoms) {
      return alert("Please fill all fields.");
    }

    try {
      setSubmitting(true);
      console.log("📝 Submitting appointment & prescription...");

      await axios.put(`/api/appointments/${appointmentId}/status`, {
        status: "completed",
      });

      await axios.put(`/api/appointments/${appointmentId}/prescription`, {
        ...prescription,
        petId: appointment.petId?._id,
        userId: appointment.userId?._id,
        vetId: appointment.vetId?._id,
        appointmentDate: appointment.appointmentDate,
        scheduledTime: appointment.scheduledTime,
      });

      alert("✅ Appointment completed.");
      navigate("/vet-dashboard");
    } catch (err) {
      console.error("❌ Error finishing appointment:", err);
      alert("Error finishing appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Call popup */}
      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Incoming Video Call</h2>
            <p className="mb-4">Dr. {appointment?.vetId?.name} is calling you for a consultation.</p>
            <div className="flex justify-around">
              <button
                onClick={declineCall}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Decline
              </button>
              <button
                onClick={acceptCall}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Area */}
      <div className="flex flex-col w-2/3 gap-4 p-4">
        <h2 className="text-2xl font-bold mb-2">Video Consultation</h2>

        <div className="flex flex-col gap-4">
          <div className="w-[720px] h-[405px] bg-black rounded-lg overflow-hidden relative">
            <span className="absolute top-2 left-2 bg-white bg-opacity-60 px-2 py-1 text-sm rounded">
              {isVet ? "Vet" : "You"}
            </span>
            <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </div>

          <div className="w-[720px] h-[405px] bg-black rounded-lg overflow-hidden relative">
            <span className="absolute top-2 left-2 bg-white bg-opacity-60 px-2 py-1 text-sm rounded">
              {isVet ? "Client" : "Vet"}
            </span>
            <video ref={peerVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Prescription/Details */}
      <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg overflow-y-auto">
        {isVet ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Prescription</h2>
            {["symptoms", "medication", "dosage", "instructions"].map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={prescription[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
            <button
              onClick={handleFinishAppointment}
              disabled={submitting}
              className="w-full bg-blue-500 text-white py-2 rounded mt-4"
            >
              {submitting ? "Submitting..." : "Finish Appointment"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold">Waiting for consultation...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientVideoCall;
