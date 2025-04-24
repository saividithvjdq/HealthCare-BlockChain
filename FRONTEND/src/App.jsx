import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PatientRegister from './components/patient/PatientRegister';
import PatientProfile from './components/patient/PatientProfile';
import RecordUpload from './components/records/RecordUpload';
import RecordList from './components/records/RecordList';

function App() {
    return (
        <AuthProvider>
            <Router>
                <CssBaseline />
                <Navbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<PatientRegister />} />
                        <Route path="/profile" element={<PatientProfile />} />
                        <Route path="/records/upload" element={<RecordUpload />} />
                        <Route path="/records/list" element={<RecordList />} />
                    </Routes>
                </Container>
            </Router>
        </AuthProvider>
    );
}

export default App;
