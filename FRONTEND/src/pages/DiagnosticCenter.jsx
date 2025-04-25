import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Alert,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Rating,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Search as SearchIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  MedicalServices as MedicalIcon,
  DateRange as DateIcon,
  Verified as VerifiedIcon,
  FilterAlt as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data for diagnostic centers
const DIAGNOSTIC_CENTERS = [
  {
    id: 1,
    name: 'Vijaya Diagnostic Centre',
    location: 'Himayatnagar, Hyderabad',
    rating: 4.7,
    distance: '2.5 km',
    services: ['MRI Scan', 'CT Scan', 'Ultrasound', 'Blood Tests', 'X-Ray'],
    image: 'https://example.com/vijaya.jpg',
    verified: true,
  },
  {
    id: 2,
    name: 'Apollo Diagnostics',
    location: 'Banjara Hills, Hyderabad',
    rating: 4.5,
    distance: '4.2 km',
    services: ['Full Body Checkup', 'Blood Tests', 'X-Ray', 'ECG'],
    image: 'https://example.com/apollo.jpg',
    verified: true,
  },
  {
    id: 3,
    name: 'Lucid Medical Diagnostics',
    location: 'Jubilee Hills, Hyderabad',
    rating: 4.2,
    distance: '5.8 km',
    services: ['MRI Scan', 'Ultrasound', 'Blood Tests', 'Health Packages'],
    image: 'https://example.com/lucid.jpg',
    verified: false,
  },
  {
    id: 4,
    name: 'City Care Diagnostics',
    location: 'Ameerpet, Hyderabad',
    rating: 4.3,
    distance: '3.1 km',
    services: ['CT Scan', 'X-Ray', 'Blood Tests', 'Ultrasound'],
    image: 'https://example.com/citycare.jpg',
    verified: true,
  },
];

// Mock test packages
const TEST_PACKAGES = [
  {
    id: 101,
    name: 'Complete Blood Count (CBC)',
    description: 'Comprehensive analysis of blood components',
    centerIds: [1, 2, 3, 4],
    price: 500,
    time: '24 hours',
    reportOnBlockchain: true,
  },
  {
    id: 102,
    name: 'Liver Function Test',
    description: 'Evaluation of liver health and function',
    centerIds: [1, 2, 4],
    price: 800,
    time: '24 hours',
    reportOnBlockchain: true,
  },
  {
    id: 103,
    name: 'Lipid Profile',
    description: 'Assessment of cholesterol and triglycerides',
    centerIds: [1, 2, 3, 4],
    price: 600,
    time: '24 hours',
    reportOnBlockchain: true,
  },
  {
    id: 104,
    name: 'Thyroid Profile',
    description: 'Measures thyroid hormone levels',
    centerIds: [1, 3, 4],
    price: 750,
    time: '24 hours',
    reportOnBlockchain: true,
  },
  {
    id: 105,
    name: 'COVID-19 RTPCR Test',
    description: 'Detection of SARS-CoV-2 virus',
    centerIds: [1, 2],
    price: 1200,
    time: '12-24 hours',
    reportOnBlockchain: true,
  },
  {
    id: 106,
    name: 'Full Body Checkup',
    description: 'Comprehensive health assessment with over 50 tests',
    centerIds: [1, 2],
    price: 5000,
    time: '48 hours',
    reportOnBlockchain: true,
  },
  {
    id: 107,
    name: 'MRI Scan - Brain',
    description: 'Detailed imaging of brain structure',
    centerIds: [1, 3],
    price: 8000,
    time: 'Same day',
    reportOnBlockchain: true,
  },
  {
    id: 108,
    name: 'CT Scan - Chest',
    description: 'Cross-sectional imaging of chest area',
    centerIds: [1, 2, 4],
    price: 7500,
    time: 'Same day',
    reportOnBlockchain: true,
  },
];

const DiagnosticCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
    setTabValue(1);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setBookingDialogOpen(true);
  };

  const handleCloseBooking = () => {
    if (!processingBooking) {
      setBookingDialogOpen(false);
      if (bookingComplete) {
        setBookingComplete(false);
        setSelectedPackage(null);
      }
    }
  };

  const handleConfirmBooking = () => {
    setProcessingBooking(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setProcessingBooking(false);
      setBookingComplete(true);
      setTransactionHash('0x' + Math.random().toString(16).substr(2, 20) + '...');
    }, 3000);
  };

  // Filter centers based on search query
  const filteredCenters = DIAGNOSTIC_CENTERS.filter(center => 
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter tests based on selected center
  const filteredTests = selectedCenter 
    ? TEST_PACKAGES.filter(pkg => pkg.centerIds.includes(selectedCenter.id))
    : TEST_PACKAGES;

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
        Diagnostic Centers
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Book diagnostic tests and receive your results securely on the blockchain. All test results are encrypted and only accessible to you and healthcare providers you authorize.
      </Alert>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="diagnostic center tabs">
          <Tab label="Find Centers" icon={<LocationIcon />} iconPosition="start" />
          <Tab 
            label="Book Tests" 
            icon={<BiotechIcon />} 
            iconPosition="start" 
            disabled={!selectedCenter}
          />
        </Tabs>
      </Box>

      {/* Find Centers Tab */}
      {tabValue === 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by center name, location, or test"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {filteredCenters.map((center) => (
              <Grid item xs={12} md={6} key={center.id}>
                <motion.div variants={itemVariants}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      }
                    }}
                    onClick={() => handleCenterSelect(center)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <HospitalIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6">
                              {center.name}
                            </Typography>
                            {center.verified && (
                              <VerifiedIcon 
                                sx={{ ml: 1, color: 'primary.main' }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {center.location} • {center.distance}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Rating value={center.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            {center.rating} / 5
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Available Services:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {center.services.map((service, index) => (
                          <Chip 
                            key={index} 
                            label={service} 
                            size="small"
                            icon={<ScienceIcon />}
                          />
                        ))}
                      </Box>

                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ mt: 2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCenterSelect(center);
                        }}
                      >
                        View Tests & Packages
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Book Tests Tab */}
      {tabValue === 1 && selectedCenter && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <HospitalIcon />
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {selectedCenter.name}
                  </Typography>
                  {selectedCenter.verified && (
                    <VerifiedIcon 
                      sx={{ ml: 1, color: 'primary.main' }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {selectedCenter.location} • {selectedCenter.distance}
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                sx={{ ml: 'auto' }}
                onClick={() => setTabValue(0)}
              >
                Change Center
              </Button>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Available Tests & Packages
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Select a test or package to book an appointment. All results will be securely stored on the blockchain.
          </Typography>

          <List>
            {filteredTests.map((pkg) => (
              <motion.div key={pkg.id} variants={itemVariants}>
                <Paper sx={{ mb: 2 }}>
                  <ListItem 
                    button
                    onClick={() => handlePackageSelect(pkg)}
                    secondaryAction={
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePackageSelect(pkg);
                        }}
                      >
                        Book Now
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <BiotechIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {pkg.name}
                          {pkg.reportOnBlockchain && (
                            <Chip 
                              size="small" 
                              label="Blockchain Secured" 
                              color="success"
                              icon={<VerifiedIcon />} 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {pkg.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="subtitle1" color="primary.main" sx={{ mr: 2 }}>
                              ₹{pkg.price}
                            </Typography>
                            <Chip 
                              size="small" 
                              icon={<DateIcon />}
                              label={`Results in: ${pkg.time}`}
                              variant="outlined"
                            />
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              </motion.div>
            ))}
          </List>
        </motion.div>
      )}

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={handleCloseBooking}
        aria-labelledby="test-booking-dialog"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="test-booking-dialog">
          Book Diagnostic Test
        </DialogTitle>
        <DialogContent dividers>
          {bookingComplete ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <VerifiedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Booking Confirmed!
              </Typography>
              <Typography variant="body1" paragraph>
                Your test has been successfully booked and secured on the blockchain.
              </Typography>
              <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Booking Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Test:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{selectedPackage?.name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Center:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{selectedCenter?.name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Price:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">₹{selectedPackage?.price}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Transaction:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{transactionHash}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Alert severity="info">
                You will receive instructions for your test via SMS and email. Results will be securely stored on the blockchain.
              </Alert>
            </Box>
          ) : (
            <>
              {selectedPackage && selectedCenter && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Test Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Center</Typography>
                      <Typography variant="body1" gutterBottom>{selectedCenter.name}</Typography>
                      
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1" gutterBottom>{selectedCenter.location}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Test Name</Typography>
                      <Typography variant="body1" gutterBottom>{selectedPackage.name}</Typography>
                      
                      <Typography variant="body2" color="text.secondary">Price</Typography>
                      <Typography variant="body1" color="primary.main" gutterBottom>₹{selectedPackage.price}</Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>Patient Information</Typography>
                  <TextField
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    defaultValue="John Doe"
                  />
                  <TextField
                    label="Age"
                    type="number"
                    margin="normal"
                    defaultValue="32"
                    sx={{ mr: 2, width: '120px' }}
                  />
                  <TextField
                    label="Gender"
                    margin="normal"
                    defaultValue="Male"
                    sx={{ width: '120px' }}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    margin="normal"
                    defaultValue="+91 9876543210"
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>Preferred Date & Time</Typography>
                  <TextField
                    label="Date"
                    type="date"
                    defaultValue="2023-07-15"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mr: 2, width: '150px' }}
                  />
                  <TextField
                    label="Time"
                    type="time"
                    defaultValue="10:30"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: '150px' }}
                  />
                  
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      Your test results will be securely stored on blockchain, ensuring privacy and tamper-proof records.
                      Only you can grant access to healthcare providers.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </>
          )}
          
          {processingBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
              <CircularProgress size={60} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Processing your booking on the blockchain...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {bookingComplete ? (
            <Button onClick={handleCloseBooking}>Close</Button>
          ) : (
            <>
              <Button onClick={handleCloseBooking} disabled={processingBooking}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleConfirmBooking}
                disabled={processingBooking}
              >
                {processingBooking ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiagnosticCenter; 