// VideoCall.jsx (Vet side)
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5555');

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [pres, setPres] = useState({ symptoms: '', medication: '', dosage: '', instructions: '' });
  const [pc, setPc] = useState(null);
  const [started, setStarted] = useState(false);

  const userVid = useRef();
  const peerVid = useRef();

  // Load appointment
  useEffect(() => {
    axios.get(`/api/appointments/${appointmentId}`)
      .then(res => {
        console.log('📄 Loaded appointment:', res.data.appointment);
        setAppt(res.data.appointment);
      })
      .catch(err => {
        console.error('❌ Failed to load appointment:', err);
        alert('Failed to load appointment');
      });
  }, [appointmentId]);

  // Listen for user's acceptance
  useEffect(() => {
    socket.on('user-accepted-call', () => {
      console.log('✅ User accepted call. Starting WebRTC...');
      initWebRTC(true);
    });

    return () => {
      socket.off('user-accepted-call');
    };
  }, []);

  // Setup peer connection listeners
  useEffect(() => {
    if (!pc) return;

    socket.on('receive-answer', async answer => {
      console.log('📩 Received answer:', answer);
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("receive-ice-candidate", (candidate) => {
      console.log("❄️ Received ICE candidate:", candidate);
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("receive-offer", async (offer) => {
      console.log("📩 Received offer:", offer);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("send-answer", answer, appointmentId);
    });

    return () => {
      socket.off('receive-answer');
      socket.off('receive-ice-candidate');
      socket.off('receive-offer');
    };
  }, [pc]);

  const initWebRTC = async (createOffer = false) => {
    if (started) return;
    setStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    userVid.current.srcObject = stream;

    const peer = new RTCPeerConnection();
    setPc(peer);

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log('📤 Sending ICE candidate:', candidate);
        socket.emit('send-ice-candidate', candidate, appointmentId);
      }
    };

    peer.ontrack = (event) => {
      peerVid.current.srcObject = event.streams[0];
    };

    socket.emit('join-room', appointmentId);
    console.log('🔗 Joined room:', appointmentId);

    if (createOffer) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      console.log('📤 Sending offer:', offer);
      socket.emit('send-offer', offer, appointmentId);
    }
  };

  const invite = () => {
    if (!appt?.userId?._id) {
      console.warn('⚠️ User ID not found in appointment data');
      return;
    }

    const payload = { userId: appt.userId._id, appointmentId };
    console.log('📞 Inviting user:', payload);
    socket.emit('invite-call', payload); // ✅ this matches your backend
  };

  const finish = async () => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status: 'completed' });
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
