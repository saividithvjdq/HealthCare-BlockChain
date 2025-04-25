import { Box, Typography, Button, Grid, Container, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useState } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <Box sx={{ 
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#ffffff',
            overflowX: 'hidden'
        }}>
            {/* Header/Navigation */}
            <Box sx={{ 
                p: 2, 
                background: 'transparent',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'background 0.3s',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 800,
                                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/')}
                        >
                    HealthChain
                </Typography>
                        <Box>
                            <Button 
                                variant="text" 
                                onClick={() => navigate('/login')}
                                sx={{ 
                                    mr: 2,
                                    color: '#2196F3',
                                    '&:hover': {
                                        background: 'rgba(33, 150, 243, 0.1)'
                                    }
                                }}
                            >
                        Login
                    </Button>
                            <Button 
                                variant="contained"
                                onClick={handleGetStarted}
                                sx={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    color: 'white',
                                    px: 3,
                                    py: 1,
                                    borderRadius: '25px',
                                    boxShadow: '0 3px 15px rgba(33, 150, 243, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                                        boxShadow: '0 5px 20px rgba(33, 150, 243, 0.5)'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box sx={{ 
                pt: { xs: 15, md: 20 },
                pb: { xs: 10, md: 15 },
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', zIndex: 2 }}>
                                <Typography 
                                    variant="h2" 
                                    component="h2" 
                                    sx={{ 
                                        fontWeight: 800,
                                        mb: 3,
                                        background: 'linear-gradient(45deg, #1a237e, #0d47a1)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Secure Healthcare Reimagined
                        </Typography>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 4,
                                        color: '#546e7a',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Transform your healthcare experience with blockchain security and seamless Aadhaar authentication.
                        </Typography>
                                <Button 
                                    variant="contained"
                                    size="large"
                                    onClick={handleGetStarted}
                                    sx={{ 
                                        py: 2,
                                        px: 6,
                                        borderRadius: '30px',
                                        fontSize: '1.1rem',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 5px 20px rgba(33, 150, 243, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                                            boxShadow: '0 8px 25px rgba(33, 150, 243, 0.5)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Get Started Now
                                </Button>
                    </Box>
                </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ 
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '500px',
                                    height: '500px',
                                    background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0) 70%)',
                                    borderRadius: '50%',
                                    zIndex: 1
                                }
                            }}>
                                <img 
                                    src="/healthcare-hero.svg" 
                                    alt="Healthcare Illustration"
                                    style={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        height: 'auto',
                                        position: 'relative',
                                        zIndex: 2
                                    }}
                                />
                    </Box>
                </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Typography 
                    variant="h3" 
                    component="h2" 
                    align="center"
                    sx={{ 
                        mb: 2,
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1a237e, #0d47a1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Why Choose HealthChain?
                </Typography>
                <Typography 
                    variant="h6" 
                    align="center" 
                    color="text.secondary" 
                    sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}
                >
                    Experience the future of healthcare record management with cutting-edge blockchain technology
                </Typography>
                
                <Grid container spacing={7}>
                    {[
                        {
                            icon: <SecurityIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
                            title: "Military-Grade Security",
                            description: "Your health records are encrypted and secured with blockchain technology"
                        },
                        {
                            icon: <SpeedIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
                            title: "Instant Access",
                            description: "Access your records instantly with secure Aadhaar verification"
                        },
                        {
                            icon: <StorageIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
                            title: "Immutable Records",
                            description: "Blockchain ensures your records cannot be tampered with"
                        },
                        {
                            icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
                            title: "Emergency Access",
                            description: "Provide emergency access to healthcare providers when needed"
                        },
                        {
                            icon: <LocalHospitalIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
                            title: "Healthcare Integration",
                            description: "Seamlessly connect with healthcare providers and institutions"
                        }
                    ].map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 4, 
                                    height: '100%',
                                    textAlign: 'center',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        borderColor: '#2196F3'
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    mb: 3,
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '15px',
                                    background: 'rgba(33, 150, 243, 0.1)'
                                }}>
                                    {feature.icon}
                                </Box>
                                <Typography 
                                    variant="h6" 
                                    gutterBottom 
                                    sx={{ 
                                        fontWeight: 600,
                                        color: '#1976D2'
                                    }}
                                >
                                    {feature.title}
                        </Typography>
                        <Typography color="text.secondary">
                                    {feature.description}
                        </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
