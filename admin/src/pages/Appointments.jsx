import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterVet, setFilterVet] = useState('');
  const [filterPet, setFilterPet] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [vetNames, setVetNames] = useState({});
  const [ownerNames, setOwnerNames] = useState({});
  const [petNames, setPetNames] = useState({});

  const fetchVetName = async (vetId) => {
    if (!vetId) return 'Unknown Vet';
    const id = typeof vetId === 'object' ? vetId._id || vetId?.$oid : vetId;
    if (vetNames[id]) return vetNames[id];

    try {
      const { data } = await axios.get(`http://localhost:5555/api/vets/findvetsname/all/${id}`);
      return data.name;
    } catch (err) {
      console.error('Error fetching vet name:', err);
      return 'Unknown Vet';
    }
  };

  const fetchOwnerName = async (ownerId) => {
    if (!ownerId) return 'Unknown Owner';
    const id = typeof ownerId === 'object' ? ownerId._id : ownerId;
    if (ownerNames[id]) return ownerNames[id];

    try {
      const { data } = await axios.get(`http://localhost:5555/api/users/findownersname/all/${id}`);
      return data.user.name;
    } catch {
      return 'Unknown Owner';
    }
  };

  const fetchPetName = async (petId) => {
    if (!petId) return 'Unknown Pet';
    const id = typeof petId === 'object' ? petId._id : petId;
    if (petNames[id]) return petNames[id];

    try {
      const { data } = await axios.get(`http://localhost:5555/api/pets/findpetsname/all/${id}`);
      return data.pet.name;
    } catch {
      return 'Unknown Pet';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, please login.');

        const { data } = await axios.get('http://localhost:5555/api/appointments/allappointments/fetching', {
          headers: { Authorization: `Bearer ${token}` },
        });

        let appointments = data.appointments;

        // Sort appointments by date (descending)
        appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

        const getId = (item) => typeof item === 'object' ? item._id : item;

        const uniqueVetIds = [...new Set(appointments.map(a => getId(a.vetId)))];
        const uniqueOwnerIds = [...new Set(appointments.map(a => getId(a.userId)))];
        const uniquePetIds = [...new Set(appointments.map(a => getId(a.petId)))];

        const vets = {};
        for (const id of uniqueVetIds) {
          vets[id] = await fetchVetName(id);
        }
        const owners = {};
        for (const id of uniqueOwnerIds) {
          owners[id] = await fetchOwnerName(id);
        }
        const pets = {};
        for (const id of uniquePetIds) {
          pets[id] = await fetchPetName(id);
        }

        setVetNames(vets);
        setOwnerNames(owners);
        setPetNames(pets);
        setAppointments(appointments);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load appointments');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter(app => {
    const vetName = vetNames[app.vetId?._id || app.vetId] || '';
    const ownerName = ownerNames[app.userId?._id || app.userId] || '';
    const petName = petNames[app.petId?._id || app.petId] || '';

    const matchesVet = vetName.toLowerCase().includes(filterVet.toLowerCase());
    const matchesOwner = ownerName.toLowerCase().includes(filterOwner.toLowerCase());
    const matchesPet = petName.toLowerCase().includes(filterPet.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

    return matchesVet && matchesOwner && matchesPet && matchesStatus;
  });

  if (loading) return <div className="p-4">Loading appointments...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Appointments</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="text"
          placeholder="Filter by Vet Name"
          value={filterVet}
          onChange={e => setFilterVet(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Filter by Pet Name"
          value={filterPet}
          onChange={e => setFilterPet(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Filter by Owner Name"
          value={filterOwner}
          onChange={e => setFilterOwner(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => {
            setFilterVet('');
            setFilterPet('');
            setFilterOwner('');
            setFilterStatus('all');
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div>No appointments found matching your filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3 border-b">Vet</th>
                <th className="p-3 border-b">Owner</th>
                <th className="p-3 border-b">Pet</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(app => {
                const vetId = app.vetId?._id || app.vetId;
                const userId = app.userId?._id || app.userId;
                const petId = app.petId?._id || app.petId;

                return (
                  <tr key={app._id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-3">{vetNames[vetId] || 'Loading...'}</td>
                    <td className="p-3">{ownerNames[userId] || 'Loading...'}</td>
                    <td className="p-3">{petNames[petId] || 'Loading...'}</td>
                    <td className="p-3">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                    <td className="p-3">{app.scheduledTime}</td>
                    <td className="p-3">{app.appointmentType}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold
                          ${
                            app.status === 'completed' ? 'bg-green-600' :
                            app.status === 'pending' ? 'bg-yellow-500' :
                            app.status === 'cancelled' ? 'bg-red-600' :
                            'bg-gray-400'
                          }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
