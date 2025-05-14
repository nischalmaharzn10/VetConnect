// src/pages/Appointments.jsx
const Appointments = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Appointments</h1>
      <div className="mt-4">
        {/* Example table of appointments */}
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Appointment ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Vet</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">1001</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">Dr. Smith</td>
              <td className="px-4 py-2">Scheduled</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
