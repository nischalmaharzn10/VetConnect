// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VetPage from './pages/VetPage';
import AppointmentPage from './pages/AppointmentPage';
import UserDashboard from './pages/UserDashboard';
import VetDashboard from './pages/VetDashboard';
import PetsPage from './pages/PetsPage';


const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-[64px] text-black">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vets" element={<VetPage />} />
          <Route path="/appointment/:id" element={<AppointmentPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />
          <Route path="/mypets" element={<PetsPage/>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};
export default App;
