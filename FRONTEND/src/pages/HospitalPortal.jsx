import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Container,
  IconButton,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Person as PersonIcon, 
  Event as EventIcon,
  MedicalServices as MedicalIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HospitalPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    pendingAppointments: 0
  });
  const [hospitalInfo, setHospitalInfo] = useState({
    name: '',
    address: '',
    specializations: []
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('hospitalToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hospitalToken');
      const response = await fetch('/api/hospital/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hospital data');
      }

      const data = await response.json();
      setStats(data.stats);
      setHospitalInfo(data.hospitalInfo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hospitalToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 3, mb: 3 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              <HospitalIcon sx={{ mr: 1 }} />
              Hospital Dashboard
            </Typography>
            <IconButton onClick={handleLogout} color="primary">
              <LogoutIcon />
            </IconButton>
          </Stack>

          <Typography variant="h6" color="textSecondary" gutterBottom>
            {hospitalInfo.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {hospitalInfo.address}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.totalPatients}
                </Typography>
                <Typography color="textSecondary">
                  Total Patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.appointmentsToday}
                </Typography>
                <Typography color="textSecondary">
                  Today's Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <MedicalIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.pendingAppointments}
                </Typography>
                <Typography color="textSecondary">
                  Pending Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EventIcon />}
                onClick={() => navigate('/appointments')}
              >
                View Appointments
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/patients')}
              >
                Manage Patients
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<MedicalIcon />}
                onClick={() => navigate('/services')}
              >
                Update Services
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default HospitalPortal;