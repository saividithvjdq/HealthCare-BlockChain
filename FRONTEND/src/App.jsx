import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EnhancedDashboard from './pages/EnhancedDashboard';
import BillingDashboard from './pages/BillingDashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import DiagnosticCenter from './pages/DiagnosticCenter';
import HospitalPortal from './pages/HospitalPortal';
import ConsentManagement from './pages/ConsentManagement';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<EnhancedDashboard />} />
                <Route path="/billing" element={<BillingDashboard />} />
                <Route path="/appointments" element={<AppointmentBooking />} />
                <Route path="/diagnostics" element={<DiagnosticCenter />} />
                <Route path="/hospital-portal" element={<HospitalPortal />} />
                <Route path="/consent" element={<ConsentManagement />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
