import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box sx={{ pt: 8, pb: 6, width: '100%', px: 3 }}>
            {/* Header Section - Full Width */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" component="h1" color="text.primary">
                    HealthChain
                </Typography>
                <Typography variant="h5" color="text.secondary">
                    Secure your health records with blockchain technology. <br />
                    Access your medical history anytime, anywhere with Aadhaar authentication.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" sx={{ mx: 1 }} onClick={() => navigate('/register')}>
                        Register Now
                    </Button>
                    <Button variant="outlined" sx={{ mx: 1 }} onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </Box>
            </Box>

            {/* Features Section - Full Width Grid */}
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                        <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                        <Typography variant="h6" gutterBottom>
                            Secure Storage
                        </Typography>
                        <Typography color="text.secondary">
                            Your health records are encrypted and stored securely on blockchain
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                        <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                        <Typography variant="h6" gutterBottom>
                            Quick Access
                        </Typography>
                        <Typography color="text.secondary">
                            Access your records instantly with Aadhaar verification
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                        <StorageIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                        <Typography variant="h6" gutterBottom>
                            Immutable Records
                        </Typography>
                        <Typography color="text.secondary">
                            Tamper-proof health records ensuring data integrity
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
