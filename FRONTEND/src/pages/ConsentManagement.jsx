import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  History as HistoryIcon,
  Verified as VerifiedIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data for access requests
const MOCK_ACCESS_REQUESTS = [
  {
    id: 'REQ-001',
    provider: 'Dr. Sanjay Reddy',
    hospital: 'City Memorial Hospital',
    recordType: 'Blood Test Results',
    requestDate: '2023-06-25',
    reason: 'Follow-up consultation for hypertension medication',
    status: 'pending',
    accessDuration: '24 hours',
  },
  {
    id: 'REQ-002',
    provider: 'Dr. Meera Nair',
    hospital: 'Metro Healthcare',
    recordType: 'Allergy Reports',
    requestDate: '2023-06-24',
    reason: 'Checking allergy history for new prescription',
    status: 'pending',
    accessDuration: '48 hours',
  },
];

// Mock data for active permissions
const MOCK_ACTIVE_PERMISSIONS = [
  {
    id: 'PER-001',
    provider: 'Dr. Vikram Desai',
    hospital: 'Apollo Hospitals',
    recordType: 'Cardiac Evaluation',
    grantedDate: '2023-06-20',
    expiryDate: '2023-06-27',
    status: 'active',
  },
  {
    id: 'PER-002',
    provider: 'Dr. Ananya Patel',
    hospital: 'Metro Healthcare',
    recordType: 'All Medical Records',
    grantedDate: '2023-06-15',
    expiryDate: '2023-06-29',
    status: 'active',
  },
];

// Mock data for access history
const MOCK_ACCESS_HISTORY = [
  {
    id: 'ACC-001',
    provider: 'Dr. Rahul Verma',
    hospital: 'City Memorial Hospital',
    recordType: 'MRI Scan Reports',
    accessDate: '2023-06-15 10:30 AM',
    reason: 'Evaluation of lower back pain',
    verified: true,
  },
  {
    id: 'ACC-002',
    provider: 'Dr. Priya Sharma',
    hospital: 'City Memorial Hospital',
    recordType: 'Blood Test Results',
    accessDate: '2023-06-10 02:15 PM',
    reason: 'Routine checkup analysis',
    verified: true,
  },
  {
    id: 'ACC-003',
    provider: 'Dr. Sanjay Reddy',
    hospital: 'City Memorial Hospital',
    recordType: 'Prescription History',
    accessDate: '2023-05-22 11:45 AM',
    reason: 'Medication adjustment',
    verified: true,
  },
];

const ConsentManagement = () => {
  const [accessRequests, setAccessRequests] = useState(MOCK_ACCESS_REQUESTS);
  const [activePermissions, setActivePermissions] = useState(MOCK_ACTIVE_PERMISSIONS);
  const [accessHistory] = useState(MOCK_ACCESS_HISTORY);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [emergencyAccessEnabled, setEmergencyAccessEnabled] = useState(false);

  const handleRequestView = (request) => {
    setSelectedRequest(request);
    setRequestDialogOpen(true);
  };

  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
  };

  const handleApproveRequest = () => {
    // Process approval
    const updatedRequests = accessRequests.filter(req => req.id !== selectedRequest.id);
    setAccessRequests(updatedRequests);
    
    // Add to active permissions
    const newPermission = {
      id: 'PER-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      provider: selectedRequest.provider,
      hospital: selectedRequest.hospital,
      recordType: selectedRequest.recordType,
      grantedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setHours(new Date().getHours() + parseInt(selectedRequest.accessDuration))).toISOString().split('T')[0],
      status: 'active',
    };
    
    setActivePermissions([...activePermissions, newPermission]);
    setRequestDialogOpen(false);
  };

  const handleDenyRequest = () => {
    // Process denial
    const updatedRequests = accessRequests.filter(req => req.id !== selectedRequest.id);
    setAccessRequests(updatedRequests);
    setRequestDialogOpen(false);
  };

  const handleRevokePermission = (permission) => {
    setSelectedPermission(permission);
    setRevokeDialogOpen(true);
  };

  const handleConfirmRevoke = () => {
    const updatedPermissions = activePermissions.filter(perm => perm.id !== selectedPermission.id);
    setActivePermissions(updatedPermissions);
    setRevokeDialogOpen(false);
  };

  const handleCancelRevoke = () => {
    setRevokeDialogOpen(false);
  };

  const handleEmergencyAccessToggle = () => {
    setEmergencyAccessEnabled(!emergencyAccessEnabled);
  };

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
        Consent Management
      </Typography>
      
      <Typography variant="body1" paragraph>
        Control who has access to your medical records. All access permissions are secured on the blockchain for transparency and security.
      </Typography>

      <Grid container spacing={3}>
        {/* Emergency Access Control */}
        <Grid item xs={12}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                      <SecurityIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">Emergency Access</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Allow emergency medical providers to access critical medical information in emergencies
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Switch
                      checked={emergencyAccessEnabled}
                      onChange={handleEmergencyAccessToggle}
                      color="error"
                    />
                    <Typography variant="body2" color={emergencyAccessEnabled ? 'error.main' : 'text.secondary'}>
                      {emergencyAccessEnabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                  </Box>
                </Box>
                
                {emergencyAccessEnabled && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Emergency access is enabled. In a medical emergency, healthcare providers can access your critical medical information without prior consent. All emergency access is logged and verified on the blockchain.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Pending Access Requests */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Access Requests
                </Typography>
                
                {accessRequests.length === 0 ? (
                  <Alert severity="info">
                    No pending access requests at this time.
                  </Alert>
                ) : (
                  <List>
                    {accessRequests.map((request) => (
                      <motion.div key={request.id} variants={itemVariants}>
                        <Paper sx={{ mb: 2, p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                              <HospitalIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                {request.provider}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {request.hospital}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  size="small" 
                                  label={request.recordType} 
                                  variant="outlined" 
                                  sx={{ mr: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {request.accessDuration} access
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button 
                              size="small" 
                              onClick={() => handleRequestView(request)}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => {
                                setSelectedRequest(request);
                                handleDenyRequest();
                              }}
                              sx={{ ml: 1 }}
                            >
                              Deny
                            </Button>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="primary"
                              onClick={() => {
                                setSelectedRequest(request);
                                handleApproveRequest();
                              }}
                              sx={{ ml: 1 }}
                            >
                              Approve
                            </Button>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Active Permissions */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Permissions
                </Typography>
                
                {activePermissions.length === 0 ? (
                  <Alert severity="info">
                    No active permissions at this time.
                  </Alert>
                ) : (
                  <List>
                    {activePermissions.map((permission) => (
                      <motion.div key={permission.id} variants={itemVariants}>
                        <Paper sx={{ mb: 2, p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1">
                                {permission.provider}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {permission.hospital}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  size="small" 
                                  label={permission.recordType} 
                                  color="primary"
                                  variant="outlined" 
                                  sx={{ mr: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Expires: {permission.expiryDate}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRevokePermission(permission)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <VerifiedIcon fontSize="small" sx={{ color: 'success.main', mr: 0.5 }} />
                            <Typography variant="caption" color="success.main">
                              Permission secured on blockchain
                            </Typography>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Access History */}
        <Grid item xs={12}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1 }} />
                  Access History
                </Typography>
                
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Provider</TableCell>
                        <TableCell>Hospital</TableCell>
                        <TableCell>Record Type</TableCell>
                        <TableCell>Access Date</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell align="center">Verification</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accessHistory.map((access) => (
                        <TableRow key={access.id}>
                          <TableCell>{access.provider}</TableCell>
                          <TableCell>{access.hospital}</TableCell>
                          <TableCell>{access.recordType}</TableCell>
                          <TableCell>{access.accessDate}</TableCell>
                          <TableCell>{access.reason}</TableCell>
                          <TableCell align="center">
                            {access.verified && (
                              <Chip 
                                icon={<VerifiedIcon />} 
                                label="Verified" 
                                size="small" 
                                color="success" 
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  All access actions are permanently recorded on the blockchain and cannot be altered.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Request Details Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={handleCloseRequestDialog}
        aria-labelledby="request-details-dialog"
        fullWidth
        maxWidth="sm"
      >
        {selectedRequest && (
          <>
            <DialogTitle id="request-details-dialog">
              Access Request Details
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Provider</Typography>
                  <Typography variant="body1" gutterBottom>{selectedRequest.provider}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Hospital</Typography>
                  <Typography variant="body1" gutterBottom>{selectedRequest.hospital}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Record Type</Typography>
                  <Typography variant="body1" gutterBottom>{selectedRequest.recordType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Request Date</Typography>
                  <Typography variant="body1" gutterBottom>{selectedRequest.requestDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Access Duration</Typography>
                  <Typography variant="body1" gutterBottom>{selectedRequest.accessDuration}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Reason for Access</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                    <Typography variant="body1">{selectedRequest.reason}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" icon={<InfoIcon />}>
                    <Typography variant="body2">
                      Approving this request will grant the provider temporary access to the specified medical record.
                      You can revoke access at any time. All access activities will be recorded on the blockchain.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button startIcon={<CloseIcon />} color="error" onClick={handleDenyRequest}>
                Deny Access
              </Button>
              <Button startIcon={<CheckIcon />} variant="contained" color="primary" onClick={handleApproveRequest}>
                Approve Access
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Revoke Permission Dialog */}
      <Dialog
        open={revokeDialogOpen}
        onClose={handleCancelRevoke}
        aria-labelledby="revoke-permission-dialog"
      >
        {selectedPermission && (
          <>
            <DialogTitle id="revoke-permission-dialog">
              Revoke Access Permission
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                Are you sure you want to revoke access for:
              </Typography>
              <Typography variant="subtitle1">
                {selectedPermission.provider}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedPermission.hospital}
              </Typography>
              <Typography variant="body2">
                For access to: <strong>{selectedPermission.recordType}</strong>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelRevoke}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmRevoke}
              >
                Revoke Access
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ConsentManagement; 