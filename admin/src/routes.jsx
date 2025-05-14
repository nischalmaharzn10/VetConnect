// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Vets from './pages/Vets';
import Appointments from './pages/Appointments';
import Revenue from './pages/Revenue';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/vets" element={<Vets />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/revenue" element={<Revenue />} />
    </Routes>
  );
};

export default AppRoutes;
