import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  FormHelperText,
  Divider,
  Avatar,
  Rating,
  Stack,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  CalendarMonth as CalendarIcon,
  LocalHospital as HospitalIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  MedicalServices as MedicalIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import format from 'date-fns/format';
import { ethers } from 'ethers';

// Mock data for hospitals
const HOSPITALS = [
  {
    id: 1,
    name: 'City Memorial Hospital',
    location: 'Jubilee Hills, Hyderabad',
    rating: 4.8,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine'],
    image: 'https://example.com/city-memorial.jpg',
    verified: true,
  },
  {
    id: 2,
    name: 'Metro Healthcare',
    location: 'Banjara Hills, Hyderabad',
    rating: 4.6,
    specialties: ['Pediatrics', 'Gynecology', 'Dermatology', 'ENT'],
    image: 'https://example.com/metro-healthcare.jpg',
    verified: true,
  },
  {
    id: 3,
    name: 'Apollo Hospitals',
    location: 'Somajiguda, Hyderabad',
    rating: 4.9,
    specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Gastroenterology'],
    image: 'https://example.com/apollo.jpg',
    verified: true,
  },
  {
    id: 4,
    name: 'Vijaya Diagnostic Centre',
    location: 'Himayatnagar, Hyderabad',
    rating: 4.7,
    specialties: ['Radiology', 'Pathology', 'Laboratory Services', 'Preventive Health Checkups'],
    image: 'https://example.com/vijaya.jpg',
    verified: true,
  },
];

// Mock data for doctors
const DOCTORS = [
  {
    id: 101,
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiology',
    hospitalId: 1,
    rating: 4.9,
    experience: '15 years',
    image: 'https://example.com/dr-sharma.jpg',
    fees: 1500,
    available: true,
    verified: true,
  },
  {
    id: 102,
    name: 'Dr. Rahul Verma',
    specialty: 'Neurology',
    hospitalId: 1,
    rating: 4.7,
    experience: '12 years',
    image: 'https://example.com/dr-verma.jpg',
    fees: 1800,
    available: true,
    verified: true,
  },
  {
    id: 103,
    name: 'Dr. Ananya Patel',
    specialty: 'Pediatrics',
    hospitalId: 2,
    rating: 4.8,
    experience: '10 years',
    image: 'https://example.com/dr-patel.jpg',
    fees: 1200,
    available: true,
    verified: true,
  },
  {
    id: 104,
    name: 'Dr. Sanjay Reddy',
    specialty: 'Orthopedics',
    hospitalId: 1,
    rating: 4.6,
    experience: '14 years',
    image: 'https://example.com/dr-reddy.jpg',
    fees: 1600,
    available: false,
    verified: true,
  },
  {
    id: 105,
    name: 'Dr. Meera Nair',
    specialty: 'Dermatology',
    hospitalId: 2,
    rating: 4.9,
    experience: '8 years',
    image: 'https://example.com/dr-nair.jpg',
    fees: 1400,
    available: true,
    verified: true,
  },
  {
    id: 106,
    name: 'Dr. Vikram Desai',
    specialty: 'Cardiology',
    hospitalId: 3,
    rating: 4.8,
    experience: '20 years',
    image: 'https://example.com/dr-desai.jpg',
    fees: 2000,
    available: true,
    verified: true,
  },
];

// Mock available time slots
const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
];

// Mock specialties
const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Dermatology',
  'ENT',
  'Ophthalmology',
  'Gastroenterology',
  'Oncology',
  'Urology',
  'Nephrology',
  'General Medicine',
];

const AppointmentBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  // Filter doctors based on hospital and specialty
  useEffect(() => {
    if (selectedHospital && specialty) {
      const filtered = DOCTORS.filter(
        doctor => doctor.hospitalId === selectedHospital.id && doctor.specialty === specialty && doctor.available
      );
      setAvailableDoctors(filtered);
    } else {
      setAvailableDoctors([]);
    }
  }, [selectedHospital, specialty]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime('');
    setReason('');
    setSpecialty('');
    setAvailableDoctors([]);
    setBookingSuccess(false);
    setTransactionHash('');
  };

  const handleConfirmAppointment = () => {
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsProcessing(false);
      setBookingSuccess(true);
      setTransactionHash('0x' + Math.random().toString(16).substr(2, 20) + '...');
      setConfirmationOpen(false);
      handleNext();
    }, 3000);
  };

  // Define step content
  const steps = ['Select Hospital & Doctor', 'Choose Date & Time', 'Confirm Appointment'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Book an Appointment
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Select Hospital & Doctor */}
      {activeStep === 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <HospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Select Hospital
                    </Typography>
                    
                    <Autocomplete
                      options={HOSPITALS}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Hospital"
                          variant="outlined"
                          fullWidth
                          helperText="Select a hospital from the list"
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <Typography variant="body1">
                                {option.name}
                                {option.verified && (
                                  <VerifiedIcon
                                    sx={{ ml: 1, fontSize: 16, color: 'primary.main', verticalAlign: 'middle' }}
                                  />
                                )}
                              </Typography>
                              <Rating value={option.rating} readOnly size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                              <Typography variant="body2" color="text.secondary">
                                {option.location}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      value={selectedHospital}
                      onChange={(event, newValue) => {
                        setSelectedHospital(newValue);
                      }}
                    />

                    {selectedHospital && (
                      <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel id="specialty-select-label">Specialty</InputLabel>
                          <Select
                            labelId="specialty-select-label"
                            id="specialty-select"
                            value={specialty}
                            label="Specialty"
                            onChange={(e) => setSpecialty(e.target.value)}
                          >
                            {selectedHospital.specialties.map((spec) => (
                              <MenuItem key={spec} value={spec}>
                                {spec}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>Select the type of medical specialty you need</FormHelperText>
                        </FormControl>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LocationIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {selectedHospital.location}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Select Doctor
                    </Typography>

                    {!selectedHospital || !specialty ? (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Please select a hospital and specialty first to see available doctors.
                      </Alert>
                    ) : availableDoctors.length === 0 ? (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        No doctors available for the selected specialty at this hospital.
                      </Alert>
                    ) : (
                      <Box>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          {availableDoctors.map((doctor) => (
                            <Paper
                              key={doctor.id}
                              elevation={selectedDoctor?.id === doctor.id ? 3 : 1}
                              sx={{
                                p: 2,
                                border: selectedDoctor?.id === doctor.id ? '2px solid' : '1px solid',
                                borderColor: selectedDoctor?.id === doctor.id ? 'primary.main' : 'divider',
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                  borderColor: 'primary.light',
                                  bgcolor: 'action.hover',
                                },
                              }}
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                  <PersonIcon />
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">
                                      {doctor.name}
                                      {doctor.verified && (
                                        <VerifiedIcon
                                          sx={{ ml: 1, fontSize: 16, color: 'primary.main', verticalAlign: 'middle' }}
                                        />
                                      )}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {doctor.specialty} • {doctor.experience} experience
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <Rating value={doctor.rating} readOnly size="small" />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                      {doctor.rating}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="subtitle1" color="primary.main">
                                  ₹{doctor.fees}
                                </Typography>
                              </Box>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedHospital || !selectedDoctor}
            >
              Next
            </Button>
          </Box>
        </motion.div>
      )}

      {/* Step 2: Choose Date & Time */}
      {activeStep === 1 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Select Date
                    </Typography>
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Appointment Date"
                        value={selectedDate}
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                        }}
                        disablePast
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>

                    <Box sx={{ mt: 3 }}>
                      <TextField
                        fullWidth
                        label="Reason for Visit"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Briefly describe your symptoms or reason for the appointment"
                        helperText="This information will be securely shared with the doctor"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Select Time
                    </Typography>

                    {!selectedDate ? (
                      <Alert severity="info">
                        Please select a date first to see available time slots.
                      </Alert>
                    ) : (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Available slots for {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {TIME_SLOTS.map((time) => (
                            <Grid item xs={4} sm={3} key={time}>
                              <Button
                                variant={selectedTime === time ? "contained" : "outlined"}
                                color="primary"
                                fullWidth
                                onClick={() => setSelectedTime(time)}
                                sx={{ mb: 1 }}
                              >
                                {time}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime || !reason}
            >
              Next
            </Button>
          </Box>
        </motion.div>
      )}

      {/* Step 3: Confirm Appointment */}
      {activeStep === 2 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Summary
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Hospital
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedHospital?.name}</Typography>
                      {selectedHospital?.verified && (
                        <VerifiedIcon
                          sx={{ ml: 1, fontSize: 16, color: 'primary.main' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      {selectedHospital?.location}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Doctor
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedDoctor?.name}</Typography>
                      {selectedDoctor?.verified && (
                        <VerifiedIcon
                          sx={{ ml: 1, fontSize: 16, color: 'primary.main' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      <MedicalIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      {selectedDoctor?.specialty} • {selectedDoctor?.experience} experience
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Consultation Fee
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      ₹{selectedDoctor?.fees}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment will be processed securely on the blockchain
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedTime}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Reason for Visit
                    </Typography>
                    <Typography variant="body1">{reason}</Typography>
                  </Box>

                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Your appointment will be secured on the blockchain with a smart contract
                        for tamper-proof record keeping.
                      </Typography>
                    </Box>
                  </Alert>
                </motion.div>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmAppointment}
                startIcon={<EventIcon />}
              >
                Confirm Appointment
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Step 4: Success */}
      {activeStep === 3 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <motion.div variants={itemVariants}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Appointment Confirmed!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your appointment has been successfully booked and secured on the blockchain.
              </Typography>

              <Box sx={{ my: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Appointment ID
                    </Typography>
                    <Typography variant="body1">
                      APPT-{Math.floor(Math.random() * 100000)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Blockchain Transaction
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {transactionHash}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="body2" paragraph>
                We've sent the appointment details to your registered email and phone number.
                You can also view this appointment in your dashboard.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                sx={{ mr: 2 }}
              >
                Book Another Appointment
              </Button>
              <Button variant="outlined">
                View in Dashboard
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirm-appointment-dialog"
      >
        <DialogTitle id="confirm-appointment-dialog">
          Confirm and Pay
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to confirm an appointment with {selectedDoctor?.name} at {selectedHospital?.name} on {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Consultation fee: ₹{selectedDoctor?.fees}
          </DialogContentText>
          
          {isProcessing ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              By proceeding, a smart contract will be created on the blockchain to secure your appointment slot.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={isProcessing ? null : <PaymentIcon />}
            onClick={handleProcessPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm & Pay'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentBooking; 