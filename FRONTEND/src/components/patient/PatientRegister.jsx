import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/api';

export default function PatientRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await patientService.register(formData);
            setSuccess(true);
            login(formData.aadhaar);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Patient Registration
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful!</Alert>}

            <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
            />
            
            <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
            >
                Register
            </Button>
        </Box>
    );
}