// VideoCall.jsx (Vet side)

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from "../utils/socket"; // Adjust the path according to folder structure



export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [appt, setAppt] = useState(null); // Appointment details
  const [pres, setPres] = useState({ symptoms: '', medication: '', dosage: '', instructions: '' }); // Prescription
  const [pc, setPc] = useState(null); // Peer connection for WebRTC
  const [started, setStarted] = useState(false); // Track WebRTC session status
  
  // Video elements
  const userVid = useRef();
  const peerVid = useRef();
  
  // Load appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`/api/appointments/${appointmentId}`);
        console.log('📄 Loaded appointment:', res.data.appointment);
        setAppt(res.data.appointment);
  
        if (res.data.appointment?.vetId?._id) {
          console.log("vetId exists:", res.data.appointment.vetId._id);
        } else {
          console.error('❌ vetId not found in appointment data');
        }
  
        // Connect socket only once after loading appointment
        if (!socket.connected) {
          socket.connect();
          console.log("🔌 Socket connected from vet side");
        }
  
      } catch (err) {
        console.error('❌ Failed to load appointment:', err);
        alert('Failed to load appointment');
      }
    };
  
    fetchAppointment();
  
    // Cleanup: disconnect socket and remove listeners
    return () => {
      socket.off('user-accepted-call');
      socket.disconnect();
      console.log("❌ Socket disconnected on cleanup");
    };
  }, [appointmentId]);
  

// Listen for user acceptance and initiate WebRTC only after appt is loaded
useEffect(() => {
  if (appt?.vetId?._id) {
    // Listen for user acceptance and initiate WebRTC
    socket.on('user-accepted-call', () => {
      console.log('✅ User accepted call. Starting WebRTC...');
      initWebRTC(true);
    });

    // Cleanup socket listener on unmount or when appt changes
    return () => {
      socket.off('user-accepted-call');
    };
  }
}, [appt]);  // Only run when appt is available
  
  
  // Setup peer connection listeners (answer, ICE candidate, offer)
  useEffect(() => {
    if (!pc) return;
  
    socket.on('receive-answer', async (answer) => {
      console.log('📩 Received answer:', answer);
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
  
    socket.on('receive-ice-candidate', (candidate) => {
      console.log('❄️ Received ICE candidate:', candidate);
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  
    socket.on('receive-offer', async (offer) => {
      console.log('📩 Received offer:', offer);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('send-answer', answer, appointmentId); // <- uses appointmentId
    });
  
    return () => {
      socket.off('receive-answer');
      socket.off('receive-ice-candidate');
      socket.off('receive-offer');
    };
  }, [pc, appointmentId]); // ✅ include appointmentId
  

// Initialize WebRTC connection
const initWebRTC = async (createOffer = false) => {
  if (!appt) {
    console.error("❌ appt data is not available yet");
    return;
  }

  console.log("📄 Full appointment object:", appt);

  const userId = appt.vetId?._id;
  console.log("🧑‍⚕️ Vet ID supposed to be:", userId);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  userVid.current.srcObject = stream;

  const peer = new RTCPeerConnection();

  // 🔗 Setup listeners on THIS peer
  peer.onicecandidate = ({ candidate }) => {
    if (candidate) {
      console.log('📤 Sending ICE candidate:', candidate);
      socket.emit('send-ice-candidate', candidate, appointmentId);
    }
  };

  peer.ontrack = (event) => {
    peerVid.current.srcObject = event.streams[0];
  };

  // 🔁 Setup socket listeners here too
  socket.on('receive-answer', async (answer) => {
    console.log('📩 Received answer:', answer);
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('receive-ice-candidate', (candidate) => {
    console.log('❄️ Received ICE candidate:', candidate);
    peer.addIceCandidate(new RTCIceCandidate(candidate));
  });

  socket.on('receive-offer', async (offer) => {
    console.log('📩 Received offer:', offer);
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    socket.emit('send-answer', answer, appointmentId);
  });

  stream.getTracks().forEach(track => peer.addTrack(track, stream));

  socket.emit('join-room', { actualApptId: appointmentId, userId });
  console.log('🔗 Joined room:', appointmentId);

  if (createOffer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log('📤 Sending offer:', offer);
    socket.emit('send-offer', { offer, appointmentId });
  }

  // ✅ Set peer AFTER all handlers are attached
  setPc(peer);
};



const invite = () => {
  const userId = appt?.userId?._id;
  const apptId = appointmentId;

  if (!userId || !apptId) {
    console.warn("⚠️ Missing userId or appointmentId");
    return;
  }

  console.log("➡️ Emitting join-room with:", { actualApptId: apptId, userId });
  socket.emit("join-room", { actualApptId: apptId, userId });

  console.log("🧑‍⚕️ Vet joined room:", `${apptId}`);

  const payload = { userId, appointmentId: apptId };
  console.log("📞 Inviting user to call with payload:", payload);
  socket.emit("invite-call", payload);
};


  
  
  

  // Finish the appointment (complete the session and save prescription)
  const finish = async () => {
    try {
      // Update appointment status to 'completed'
      await axios.put(`/api/appointments/${appointmentId}/status`, { status: 'completed' });

      // Save prescription details
      await axios.put(`/api/appointments/${appointmentId}/prescription`, {
        ...pres,
        petId: appt.petId._id,
        userId: appt.userId._id,
        vetId: appt.vetId._id,
        appointmentDate: appt.appointmentDate,
        scheduledTime: appt.scheduledTime
      });

      alert('✅ Appointment completed.');
      navigate('/vet-dashboard');
    } catch (err) {
      console.error('❌ Error completing appointment:', err);
      alert('Error completing appointment.');
    }
  };

  if (!appt) return <p>Loading…</p>;


  return (
    <div className="flex min-h-screen">
      <div className="w-2/3 p-4 space-y-4">
        <h2 className="text-2xl">Video Consultation</h2>
  
        {/* Moved Invite Button Here */}
        {!started && (
          <button
            onClick={invite}
            className="w-48 h-14 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-lg rounded shadow hover:scale-105 transition-transform"
            title="Send call invitation to pet owner"
          >
            📞 Invite Owner
          </button>
        )}
  
        <div className="space-y-4">
          <div className="relative w-[720px] h-[405px] bg-black rounded overflow-hidden">
            <video ref={userVid} autoPlay muted className="w-full h-full object-cover" />
          </div>
          <div className="w-[720px] h-[405px] bg-black rounded overflow-hidden">
            <video ref={peerVid} autoPlay className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
  
      <div className="w-1/3 p-6 bg-white overflow-auto">
        <h2 className="text-lg mb-4">Prescription</h2>
        <p>Pet: {appt.petId.name}</p>
        <form className="space-y-3">
          {['symptoms', 'medication', 'dosage', 'instructions'].map((f) => (
            <div key={f}>
              <label className="block">{f}</label>
              <textarea
                rows="3"
                className="w-full border p-1"
                value={pres[f]}
                onChange={(e) => setPres({ ...pres, [f]: e.target.value })}
              />
            </div>
          ))}
        </form>
        <button
          onClick={finish}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Finish
        </button>
      </div>
    </div>
  );
  
}
