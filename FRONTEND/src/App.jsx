import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedDashboard from './pages/EnhancedDashboard';
import EmergencyAccess from './pages/EmergencyAccess';
import BillingDashboard from './pages/BillingDashboard';
import PatientRecords from './pages/PatientRecords';
import HospitalDashboard from './pages/HospitalDashboard';
import DoctorVerification from './components/doctor/DoctorVerification';
import AccessRecords from './pages/AccessRecords';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<EnhancedDashboard />} />
                <Route path="/emergency-access" element={<EmergencyAccess />} />
                <Route path="/billing" element={<BillingDashboard />} />
                <Route path="/records" element={<PatientRecords />} />
                <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
                <Route path="/access-records" element={<AccessRecords />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

