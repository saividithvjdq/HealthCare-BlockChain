import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  Rating,
  Button,
  Alert
} from '@mui/material';
import { 
  LocalHospital as HospitalIcon, 
  Science as LabIcon,
  DirectionsWalk as WalkIcon, 
  DirectionsCar as CarIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Mock data for nearby facilities
const NEARBY_HOSPITALS = [
  {
    id: 1,
    name: 'City Memorial Hospital',
    distance: 1.2,
    rating: 4.5,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    address: '123 Health Avenue, Medical District',
    walkingTime: '15 min',
    drivingTime: '5 min',
    type: 'hospital'
  },
  {
    id: 2,
    name: 'Metro Healthcare Center',
    distance: 2.5,
    rating: 4.2,
    specialties: ['General Medicine', 'Pediatrics', 'Dermatology'],
    address: '456 Care Street, Wellness Zone',
    walkingTime: '30 min',
    drivingTime: '8 min',
    type: 'hospital'
  },
  {
    id: 3,
    name: 'Vijaya Diagnostic Center',
    distance: 0.8,
    rating: 4.7,
    specialties: ['Pathology', 'Radiology', 'Clinical Laboratory'],
    address: '789 Test Road, Health Park',
    walkingTime: '10 min',
    drivingTime: '3 min',
    type: 'diagnostic'
  },
  {
    id: 4,
    name: 'Modern Imaging & Diagnostics',
    distance: 1.5,
    rating: 4.3,
    specialties: ['MRI', 'CT Scan', 'Ultrasound'],
    address: '321 Scan Boulevard, Medical Complex',
    walkingTime: '18 min',
    drivingTime: '6 min',
    type: 'diagnostic'
  }
];

const NearbyFacilitiesMap = () => {
  const [facilities, setFacilities] = useState(NEARBY_HOSPITALS);
  const [filter, setFilter] = useState('all');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  useEffect(() => {
    // Simulate getting user location
    setIsLocationEnabled(true);
    
    // Filter facilities based on selection
    if (filter === 'all') {
      setFacilities(NEARBY_HOSPITALS);
    } else {
      setFacilities(NEARBY_HOSPITALS.filter(facility => facility.type === filter));
    }
  }, [filter]);

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <HospitalIcon sx={{ mr: 1 }} />
          Nearby Healthcare Facilities
        </Typography>
        
        {!isLocationEnabled && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Enable location services to see nearby facilities
          </Alert>
        )}
        
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button 
            variant={filter === 'all' ? 'contained' : 'outlined'} 
            size="small"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'hospital' ? 'contained' : 'outlined'} 
            size="small"
            onClick={() => setFilter('hospital')}
          >
            Hospitals
          </Button>
          <Button 
            variant={filter === 'diagnostic' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilter('diagnostic')}
          >
            Diagnostic Centers
          </Button>
        </Box>
        
        <List>
          {facilities.map((facility) => (
            <ListItem 
              key={facility.id} 
              alignItems="flex-start"
              sx={{ 
                mb: 1, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: facility.type === 'hospital' ? 'primary.main' : 'secondary.main' }}>
                  {facility.type === 'hospital' ? <HospitalIcon /> : <LabIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">{facility.name}</Typography>
                    <Chip 
                      label={`${facility.distance} km`} 
                      size="small" 
                      color={facility.distance < 1 ? 'success' : 'primary'}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Rating 
                      value={facility.rating} 
                      precision={0.5} 
                      size="small" 
                      readOnly 
                      icon={<StarIcon fontSize="inherit" />}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {facility.address}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <WalkIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {facility.walkingTime}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <CarIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {facility.drivingTime}
                      </Box>
                      <Button size="small" variant="outlined">Directions</Button>
                      <Button size="small" variant="contained">Book</Button>
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NearbyFacilitiesMap; 