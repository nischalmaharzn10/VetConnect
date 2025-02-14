import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/NavBar';  // Make sure NavBar is correctly imported
import Sidebar from './components/Sidebar'; // Import Sidebar if you're using it, though it's not in use here
import Header from './components/Header'; // Import Header if you plan to use it in the layout
import Footer from './components/Footer'; // Import Footer for the page's footer

// Import the pages (make sure the paths are correct)
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <Router>

      <Navbar /> 

      {/* Main content */}
      <div className="text-black">
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Register" element={<RegisterPage />} />
        </Routes>
      </div>


      <Footer />
    </Router>
  );
};

export default App;
