import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

// Set up the server URL for Socket.IO
const socket = io("http://localhost:5555"); // Update with your deployed server URL if needed

const ClientVideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const userVideoRef = useRef(null);
  const peerVideoRef = useRef(null);

  const loggedInVetId = localStorage.getItem("vetId"); // Add this to determine current logged-in vet

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

      socket.emit("join-room", appointmentId, appointment?.userId?._id);
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

    socket.on("user-accepted-call", () => {
      setCallAccepted(true);
    });

    return () => {
      socket.off("receive-ice-candidate");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("user-accepted-call");
    };
  }, [peerConnection]);

  const handleAcceptCall = () => {
    socket.emit("accept-call", appointmentId);
    setCallAccepted(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Video Layout */}
      <div className="flex flex-col w-2/3 gap-4 p-4">
        <h2 className="text-2xl font-bold mb-2">Video Consultation</h2>

        <div className="flex flex-col gap-4">
          {/* Vet Screen */}
          <div className="w-[720px] h-[405px] border border-gray-300 rounded-lg overflow-hidden bg-black text-white flex justify-center items-center relative">
            <span className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 px-2 py-1 text-sm rounded">Vet Screen</span>
            <video
              ref={peerVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!callAccepted && (
              <div className="absolute bottom-4 flex justify-center w-full">
                <button
                  onClick={handleAcceptCall}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  Accept Call
                </button>
              </div>
            )}
          </div>

          {/* Pet Owner Screen */}
          <div className="w-[720px] h-[405px] border border-gray-300 rounded-lg overflow-hidden bg-black text-white flex justify-center items-center relative">
            <span className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 px-2 py-1 text-sm rounded">Pet Owner Screen</span>
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Side: Prescription (Visible only to Vet) */}
      {appointment?.vetId?._id === loggedInVetId && (
        <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Prescription</h2>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Pet: {appointment?.petId?.name}</h3>
            <h3 className="text-sm font-medium text-gray-700">Owner: {appointment?.userId?.name}</h3>
            <h3 className="text-sm font-medium text-gray-700">Vet: {appointment?.vetId?.name}</h3>
          </div>
          {/* Form and submission button will go here */}
        </div>
      )}
    </div>
  );
};

export default ClientVideoCall;
