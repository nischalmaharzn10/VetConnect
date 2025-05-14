// src/pages/Vets.jsx
const Vets = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Vets</h1>
      <div className="mt-4">
        {/* Example table of vets */}
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Vet ID</th>
              <th className="px-4 py-2">Vet Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">Dr. Smith</td>
              <td className="px-4 py-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vets;
