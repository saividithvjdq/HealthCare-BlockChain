import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import PatientRecordsUpload from '../components/patient/PatientRecordsUpload';
import { useAuth } from '../context/AuthContext';

export default function PatientRecords() {
  const { aadhaar } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Health Records Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Securely store and manage your medical records with blockchain verification
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: 'primary.light', 
                color: 'primary.contrastText',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                Blockchain Verification Status
              </Typography>
              <Typography variant="body1" paragraph>
                Your records are secured with Aadhaar: {aadhaar}
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                sx={{ mr: 2 }}
              >
                Verify All Records
              </Button>
              <Button variant="outlined" sx={{ bgcolor: 'white' }}>
                View Blockchain History
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <PatientRecordsUpload />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 Tip: Keep your medical records up to date for better healthcare coordination
          </Alert>
        </Box>
      </motion.div>
    </Container>
  );
}