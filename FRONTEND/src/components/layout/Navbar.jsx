import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { aadhaar, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    HealthChain
                </Typography>
                <Box>
                    {aadhaar ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/profile')}>
                                Profile
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/records/upload')}>
                                Upload Record
                            </Button>
                            <Button color="inherit" onClick={() => {
                                logout();
                                navigate('/');
                            }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}