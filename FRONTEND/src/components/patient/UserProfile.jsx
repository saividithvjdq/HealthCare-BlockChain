import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  AccessTime as TimeIcon,
  VerifiedUser as VerifiedIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';

// Mock user data
const USER_DATA = {
  name: 'Rajesh Kumar',
  avatar: null, // Will use initials
  email: 'rajesh.kumar@example.com',
  phone: '+91 98765 43210',
  dob: '1985-05-15',
  gender: 'Male',
  bloodType: 'B+',
  address: '24-7-95, Lakshmi Nagar, Visakhapatnam, Andhra Pradesh, 530016',
  aadharVerified: true,
  aadharNumber: 'XXXX-XXXX-7890',
  emergencyContact: 'Priya Kumar (Wife) - +91 98765 12345',
  lastLogin: '2023-11-22 09:45 AM',
  registeredDate: '2022-03-18',
  primaryHospital: 'City Memorial Hospital',
  insuranceProvider: 'National Health Insurance',
  policyNumber: 'NHI-678954'
};

const UserProfile = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userData, setUserData] = useState(USER_DATA);
  const [editData, setEditData] = useState({...USER_DATA});

  const handleEditOpen = () => {
    setEditDialogOpen(true);
    setEditData({...userData});
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSaveChanges = () => {
    setUserData({...editData});
    setEditDialogOpen(false);
  };

  // Function to get user initials for Avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 2
                }}
              >
                {getInitials(userData.name)}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" component="h2">
                    {userData.name}
                  </Typography>
                  {userData.aadharVerified && (
                    <Chip 
                      icon={<VerifiedIcon />} 
                      label="Aadhaar Verified" 
                      color="success" 
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {userData.bloodType} • {userData.gender} • {new Date().getFullYear() - new Date(userData.dob).getFullYear()} years
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Registered since {userData.registeredDate}
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={handleEditOpen}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={userData.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={userData.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Address" secondary={userData.address} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Emergency Contact" 
                    secondary={userData.emergencyContact} 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <HospitalIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Primary Healthcare Provider" 
                    secondary={userData.primaryHospital} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Aadhaar Number" 
                    secondary={userData.aadharNumber} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Insurance Provider" 
                    secondary={`${userData.insuranceProvider} (Policy: ${userData.policyNumber})`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Login" 
                    secondary={userData.lastLogin} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Alert severity="info">
              Your medical data is securely stored on the blockchain. 
              Only healthcare providers with your consent can access your records.
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={editData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={editData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={editData.emergencyContact}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primary Hospital"
                name="primaryHospital"
                value={editData.primaryHospital}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Insurance Provider"
                name="insuranceProvider"
                value={editData.insuranceProvider}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Number"
                name="policyNumber"
                value={editData.policyNumber}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Some information like Aadhaar details and medical records can only be updated through proper verification channels.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile; 