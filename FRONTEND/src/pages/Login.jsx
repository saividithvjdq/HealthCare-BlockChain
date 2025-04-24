import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [aadhaar, setAadhaar] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (aadhaar.length === 12) {
            login(aadhaar);
            navigate('/profile');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login with Aadhaar
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Aadhaar Number"
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value)}
                        margin="normal"
                        required
                        inputProps={{ 
                            pattern: "^[0-9]{12}$",
                            title: "Please enter valid 12-digit Aadhaar number"
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={aadhaar.length !== 12}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}