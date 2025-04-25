import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tab,
  Tabs,
  Divider,
  Alert,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalHospital as HospitalIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  DownloadForOffline as DownloadIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';

// Mock billing data
const MOCK_BILLS = [
  {
    id: 'BL-42587',
    hospital: 'City Memorial Hospital',
    date: '2023-06-22',
    amount: 45000,
    description: 'Emergency room visit + CT Scan',
    status: 'paid',
    insuranceCovered: 36000,
    outOfPocket: 9000,
    transactionHash: '0xabc123...',
    verified: true,
  },
  {
    id: 'BL-67843',
    hospital: 'Metro Healthcare',
    date: '2023-08-15',
    amount: 22500,
    description: 'Annual physical + blood work',
    status: 'pending',
    insuranceCovered: 18000,
    outOfPocket: 4500,
    transactionHash: '',
    verified: false,
  },
  {
    id: 'BL-98732',
    hospital: 'Vijaya Diagnostic Center',
    date: '2023-10-05',
    amount: 15000,
    description: 'MRI Scan - lower back',
    status: 'processing',
    insuranceCovered: 12000,
    outOfPocket: 3000,
    transactionHash: '0xdef456...',
    verified: true,
  },
  {
    id: 'BL-11285',
    hospital: 'City Memorial Hospital',
    date: '2023-11-18',
    amount: 8500,
    description: 'Follow-up consultation',
    status: 'disputed',
    insuranceCovered: 6800,
    outOfPocket: 1700,
    transactionHash: '0xghi789...',
    verified: true,
  },
];

// Mock insurance claim data
const MOCK_CLAIMS = [
  {
    id: 'IC-78543',
    provider: 'National Health Insurance',
    policyNo: 'NHI-678954',
    billingId: 'BL-42587',
    amount: 36000,
    status: 'approved',
    submissionDate: '2023-06-23',
    settlementDate: '2023-07-10',
    transactionHash: '0xjkl012...',
  },
  {
    id: 'IC-89243',
    provider: 'National Health Insurance',
    policyNo: 'NHI-678954',
    billingId: 'BL-67843',
    amount: 18000,
    status: 'processing',
    submissionDate: '2023-08-16',
    settlementDate: '',
    transactionHash: '',
  },
  {
    id: 'IC-92385',
    provider: 'National Health Insurance',
    policyNo: 'NHI-678954',
    billingId: 'BL-98732',
    amount: 12000,
    status: 'approved',
    submissionDate: '2023-10-06',
    settlementDate: '2023-10-20',
    transactionHash: '0xmno345...',
  },
  {
    id: 'IC-10456',
    provider: 'National Health Insurance',
    policyNo: 'NHI-678954',
    billingId: 'BL-11285',
    amount: 6800,
    status: 'disputed',
    submissionDate: '2023-11-19',
    settlementDate: '',
    transactionHash: '',
  },
];

const BillingDashboard = () => {
  const [billData, setBillData] = useState(MOCK_BILLS);
  const [claimData, setClaimData] = useState(MOCK_CLAIMS);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBill, setSelectedBill] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openDetailDialog = (bill) => {
    setSelectedBill(bill);
    setDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  const openVerifyDialog = () => {
    setVerifyDialogOpen(true);
    simulateVerification();
  };

  const closeVerifyDialog = () => {
    setVerifyDialogOpen(false);
    setVerificationProgress(0);
    setVerificationComplete(false);
  };

  const simulateVerification = () => {
    setVerificationProgress(0);
    const interval = setInterval(() => {
      setVerificationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setVerificationComplete(true);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'paid':
        return <Chip label="Paid" color="success" size="small" icon={<CheckCircleIcon />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<WarningIcon />} />;
      case 'processing':
        return <Chip label="Processing" color="info" size="small" icon={<InfoIcon />} />;
      case 'disputed':
        return <Chip label="Disputed" color="error" size="small" icon={<WarningIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
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
        Billing Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="billing tabs">
          <Tab label="Medical Bills" icon={<ReceiptIcon />} iconPosition="start" />
          <Tab label="Insurance Claims" icon={<HospitalIcon />} iconPosition="start" />
          <Tab label="Payment History" icon={<PaymentIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Medical Bills Tab */}
      {tabValue === 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ mb: 3 }}>
            <Alert severity="info">
              All bills are securely stored on the blockchain for verification and fraud prevention.
            </Alert>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="billing table">
              <TableHead>
                <TableRow>
                  <TableCell>Bill ID</TableCell>
                  <TableCell>Hospital</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billData.map((bill) => (
                  <TableRow
                    key={bill.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    component={motion.tr}
                    variants={itemVariants}
                  >
                    <TableCell component="th" scope="row">
                      {bill.id}
                    </TableCell>
                    <TableCell>{bill.hospital}</TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell align="right">₹{bill.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusChip(bill.status)}</TableCell>
                    <TableCell>
                      {bill.verified ? (
                        <Chip 
                          icon={<VerifiedIcon />} 
                          label="Verified" 
                          size="small" 
                          color="success" 
                        />
                      ) : (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          onClick={openVerifyDialog}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => openDetailDialog(bill)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="secondary">
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* Insurance Claims Tab */}
      {tabValue === 1 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ mb: 3 }}>
            <Alert severity="info">
              Insurance claims are automatically processed through smart contracts for faster settlements.
            </Alert>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="claims table">
              <TableHead>
                <TableRow>
                  <TableCell>Claim ID</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Related Bill</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Settlement Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claimData.map((claim) => (
                  <TableRow
                    key={claim.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    component={motion.tr}
                    variants={itemVariants}
                  >
                    <TableCell component="th" scope="row">
                      {claim.id}
                    </TableCell>
                    <TableCell>{claim.provider}</TableCell>
                    <TableCell>{claim.billingId}</TableCell>
                    <TableCell>{claim.submissionDate}</TableCell>
                    <TableCell align="right">₹{claim.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusChip(claim.status)}</TableCell>
                    <TableCell>{claim.settlementDate || 'Pending'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary">
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="secondary">
                        <HistoryIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* Payment History Tab */}
      {tabValue === 2 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ mb: 3 }}>
            <Alert severity="info">
              All payment transactions are recorded on the blockchain for transparent audit trail.
            </Alert>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Summary
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Typography variant="body2" color="text.secondary">
                            Total Billed Amount
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1" align="right">
                            ₹91,000
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2" color="text.secondary">
                            Insurance Covered
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1" align="right">
                            ₹72,800
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2" color="text.secondary">
                            Out-of-Pocket
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1" align="right">
                            ₹18,200
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2" color="text.secondary">
                            Paid Amount
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1" align="right" color="success.main">
                            ₹9,000
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2" color="error.main" fontWeight="bold">
                            Outstanding Balance
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1" align="right" color="error.main" fontWeight="bold">
                            ₹9,200
                          </Typography>
                        </Grid>
                      </Grid>
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
                      Payment Methods
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<PaymentIcon />}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Pay with UPI
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<WalletIcon />}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Pay with Crypto Wallet
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        startIcon={<PaymentIcon />}
                        fullWidth
                      >
                        Other Payment Methods
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Bill Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={closeDetailDialog}
        aria-labelledby="bill-detail-dialog"
        maxWidth="md"
        fullWidth
      >
        {selectedBill && (
          <>
            <DialogTitle id="bill-detail-dialog">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1 }} />
                Bill Details: {selectedBill.id}
                {selectedBill.verified && (
                  <Chip 
                    icon={<VerifiedIcon />} 
                    label="Blockchain Verified" 
                    size="small" 
                    color="success" 
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Hospital</Typography>
                  <Typography variant="body1" gutterBottom>{selectedBill.hospital}</Typography>
                  
                  <Typography variant="subtitle1">Date</Typography>
                  <Typography variant="body1" gutterBottom>{selectedBill.date}</Typography>
                  
                  <Typography variant="subtitle1">Description</Typography>
                  <Typography variant="body1" gutterBottom>{selectedBill.description}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Total Amount</Typography>
                  <Typography variant="body1" gutterBottom>₹{selectedBill.amount.toLocaleString()}</Typography>
                  
                  <Typography variant="subtitle1">Insurance Covered</Typography>
                  <Typography variant="body1" gutterBottom>₹{selectedBill.insuranceCovered.toLocaleString()}</Typography>
                  
                  <Typography variant="subtitle1">Out of Pocket</Typography>
                  <Typography variant="body1" gutterBottom>₹{selectedBill.outOfPocket.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Status</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusChip(selectedBill.status)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {selectedBill.status === 'paid' && 'Payment completed and verified'}
                      {selectedBill.status === 'pending' && 'Awaiting payment'}
                      {selectedBill.status === 'processing' && 'Payment is being processed'}
                      {selectedBill.status === 'disputed' && 'Bill has been disputed - under review'}
                    </Typography>
                  </Box>
                </Grid>
                {selectedBill.verified && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Blockchain Verification</Typography>
                    <Typography variant="body2" gutterBottom>
                      Transaction Hash: {selectedBill.transactionHash}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VerifiedIcon />}
                      onClick={() => {}}
                      sx={{ mt: 1 }}
                    >
                      View on Blockchain Explorer
                    </Button>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button startIcon={<DownloadIcon />}>Download Invoice</Button>
              {selectedBill.status === 'pending' && (
                <Button variant="contained" color="primary" startIcon={<PaymentIcon />}>
                  Pay Now
                </Button>
              )}
              {selectedBill.status === 'disputed' && (
                <Button variant="contained" color="warning">
                  View Dispute Details
                </Button>
              )}
              <Button onClick={closeDetailDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verifyDialogOpen}
        onClose={verificationComplete ? closeVerifyDialog : undefined}
        aria-labelledby="verification-dialog"
      >
        <DialogTitle id="verification-dialog">
          Blockchain Verification
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress variant="determinate" value={verificationProgress} />
          </Box>
          <Typography variant="body1" gutterBottom>
            {!verificationComplete 
              ? "Verifying bill authenticity on the blockchain..." 
              : "Verification complete! The bill has been confirmed as authentic on the blockchain."}
          </Typography>
          {verificationComplete && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Bill verified successfully! This bill is authentic and has not been tampered with.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeVerifyDialog} 
            disabled={!verificationComplete}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingDashboard; 