import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/NavBar';  
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VetPage from './pages/VetPage'; // Make sure to import VetPage

const App = () => {
  return (
    <Router>
      <Navbar />
      {/* Add padding-top to prevent content from being hidden behind navbar */}
      <div className="pt-[64px] text-black">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vets" element={<VetPage />} /> {/* Route for Vet Page */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
