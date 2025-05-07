import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Fab,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  FileOpen as FileOpenIcon,
  MedicalInformation as MedicalIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  LocalHospital as HospitalIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function HospitalDashboard() {
  const [openRecordAccess, setOpenRecordAccess] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Mock data for active patients
  const activePatients = [
    {
      id: 'PT001',
      name: 'John Doe',
      aadhaar: '1234-5678-9012',
      admissionDate: '2024-04-25',
      treatment: 'Cardiac Surgery',
      status: 'Critical',
      pendingAmount: 45000,
      doctor: 'Dr. Sarah Johnson'
    },
    // Add more patient data
  ];

  const handleRequestAccess = (patient) => {
    setSelectedPatient(patient);
    setOpenRecordAccess(true);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Hospital Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card component={motion.div} whileHover={{ scale: 1.02 }}>
              <CardContent>
                <Typography variant="h3" color="primary">42</Typography>
                <Typography color="text.secondary">Active Patients</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card component={motion.div} whileHover={{ scale: 1.02 }}>
              <CardContent>
                <Typography variant="h3" color="secondary">12</Typography>
                <Typography color="text.secondary">New Admissions Today</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card component={motion.div} whileHover={{ scale: 1.02 }}>
              <CardContent>
                <Typography variant="h3" color="success.main">₹8.2L</Typography>
                <Typography color="text.secondary">Revenue This Month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card component={motion.div} whileHover={{ scale: 1.02 }}>
              <CardContent>
                <Typography variant="h3" color="error.main">15</Typography>
                <Typography color="text.secondary">Critical Cases</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Stack direction="row" spacing={2}>
            <Button startIcon={<PersonAddIcon />} variant="contained">
              New Admission
            </Button>
            <Button startIcon={<FileOpenIcon />} variant="contained" color="secondary">
              Access Records
            </Button>
            <Button startIcon={<MoneyIcon />} variant="contained" color="success">
              Billing
            </Button>
          </Stack>
        </Paper>

        {/* Active Patients Table */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Active Patients
            </Typography>
            <Fab color="primary" size="small" aria-label="add patient">
              <AddIcon />
            </Fab>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Admission Date</TableCell>
                  <TableCell>Treatment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Pending Amount</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activePatients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.admissionDate}</TableCell>
                    <TableCell>{patient.treatment}</TableCell>
                    <TableCell>
                      <Chip 
                        label={patient.status} 
                        color={patient.status === 'Critical' ? 'error' : 'success'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>₹{patient.pendingAmount}</TableCell>
                    <TableCell>{patient.doctor}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleRequestAccess(patient)}
                      >
                        <FileOpenIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Record Access Dialog */}
        <Dialog 
          open={openRecordAccess} 
          onClose={() => setOpenRecordAccess(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Request Record Access
          </DialogTitle>
          <DialogContent>
            {selectedPatient && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This request will be recorded on the blockchain for audit purposes
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Doctor Name"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Doctor ID"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Department"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Reason for Access"
                      fullWidth
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRecordAccess(false)}>Cancel</Button>
            <Button variant="contained" startIcon={<LockIcon />}>
              Request Access
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}