// src/pages/Dashboard.jsx
const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-4">
        {/* Your summary stats go here */}
        <p>Total Users: 500</p>
        <p>Total Vets: 20</p>
        <p>Total Appointments: 350</p>
        <p>Total Revenue: $5000</p>
      </div>
    </div>
  );
};

export default Dashboard;
