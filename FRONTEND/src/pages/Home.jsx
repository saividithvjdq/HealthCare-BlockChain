import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box sx={{ pt: 8, pb: 6 }}>
            <Container maxWidth="sm">
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    HealthChain
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    Secure your health records with blockchain technology. 
                    Access your medical history anytime, anywhere with Aadhaar authentication.
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" onClick={() => navigate('/register')}>
                        Register Now
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </Box>
            </Container>

            <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
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
                        <Box sx={{ textAlign: 'center' }}>
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
                        <Box sx={{ textAlign: 'center' }}>
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
            </Container>
        </Box>
    );
}