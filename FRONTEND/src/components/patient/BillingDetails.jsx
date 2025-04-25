import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Alert,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
  VerifiedUser as VerifiedIcon,
  ErrorOutline as ErrorIcon,
  DownloadForOffline as DownloadIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';

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
    fraud_risk: 'low'
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
    fraud_risk: 'medium'
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
    fraud_risk: 'low'
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
    fraud_risk: 'high'
  },
];

const BillingDetails = () => {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [selectedBill, setSelectedBill] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [fraudAlertOpen, setFraudAlertOpen] = useState(false);

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

  const openFraudAlert = (bill) => {
    setSelectedBill(bill);
    setFraudAlertOpen(true);
  };

  const closeFraudAlert = () => {
    setFraudAlertOpen(false);
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

  const getFraudRiskChip = (risk) => {
    switch (risk) {
      case 'low':
        return <Chip label="Low Risk" color="success" size="small" />;
      case 'medium':
        return <Chip label="Medium Risk" color="warning" size="small" />;
      case 'high':
        return <Chip label="High Risk" color="error" size="small" icon={<ErrorIcon />} />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ mr: 1 }} />
            Recent Billing Activities
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            All bills are secured with blockchain verification to prevent fraud.
          </Alert>
          
          <TableContainer component={Box}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Hospital</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Fraud Risk</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow 
                    key={bill.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: bill.fraud_risk === 'high' ? 'error.light' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {bill.id}
                        {bill.verified && (
                          <Tooltip title="Blockchain Verified">
                            <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>{bill.hospital}</TableCell>
                    <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusChip(bill.status)}</TableCell>
                    <TableCell>
                      {getFraudRiskChip(bill.fraud_risk)}
                      {bill.fraud_risk === 'high' && (
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => openFraudAlert(bill)}
                        >
                          <ErrorIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => openDetailDialog(bill)}
                          color="primary"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="secondary"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ mr: 1 }}
              startIcon={<HospitalIcon />}
            >
              View All Bills
            </Button>
            <Button 
              variant="contained" 
              size="small"
              startIcon={<VerifiedIcon />}
              onClick={openVerifyDialog}
            >
              Verify Bills
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Bill Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={closeDetailDialog} maxWidth="sm" fullWidth>
        {selectedBill && (
          <>
            <DialogTitle>
              Bill Details: {selectedBill.id}
              {selectedBill.verified && (
                <Tooltip title="Verified on Blockchain">
                  <VerifiedIcon color="primary" sx={{ ml: 1 }} />
                </Tooltip>
              )}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Hospital</strong></TableCell>
                      <TableCell>{selectedBill.hospital}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell>{selectedBill.date}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell>{selectedBill.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total Amount</strong></TableCell>
                      <TableCell>₹{selectedBill.amount.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Insurance Covered</strong></TableCell>
                      <TableCell>₹{selectedBill.insuranceCovered.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Out of Pocket</strong></TableCell>
                      <TableCell>₹{selectedBill.outOfPocket.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell>{getStatusChip(selectedBill.status)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Fraud Risk</strong></TableCell>
                      <TableCell>{getFraudRiskChip(selectedBill.fraud_risk)}</TableCell>
                    </TableRow>
                    {selectedBill.transactionHash && (
                      <TableRow>
                        <TableCell><strong>Blockchain Transaction</strong></TableCell>
                        <TableCell>{selectedBill.transactionHash}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {selectedBill.status === 'disputed' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This bill is currently under dispute. Our team is reviewing the charges.
                </Alert>
              )}
              
              {selectedBill.fraud_risk === 'high' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  This bill has been flagged for potential fraudulent activity. Please contact support.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDetailDialog}>Close</Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>
                Download
              </Button>
              {!selectedBill.verified && (
                <Button 
                  variant="contained" 
                  startIcon={<VerifiedIcon />}
                  onClick={openVerifyDialog}
                >
                  Verify on Blockchain
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onClose={closeVerifyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Blockchain Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Verifying bill authenticity on the blockchain...
          </DialogContentText>
          <Box sx={{ mt: 2, mb: 2 }}>
            <LinearProgress variant="determinate" value={verificationProgress} />
          </Box>
          {verificationComplete && (
            <Alert severity="success">
              Verification complete! This bill has been authenticated on the blockchain.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeVerifyDialog} disabled={!verificationComplete}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fraud Alert Dialog */}
      <Dialog open={fraudAlertOpen} onClose={closeFraudAlert}>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ErrorIcon sx={{ mr: 1 }} />
            Potential Fraud Detected
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 2 }}>
            This bill has been flagged for potential fraudulent activity:
          </DialogContentText>
          {selectedBill && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Bill ID:</strong> {selectedBill.id}
              </Typography>
              <Typography variant="body2">
                <strong>Hospital:</strong> {selectedBill.hospital}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> ₹{selectedBill.amount.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {selectedBill.date}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            The system has detected unusual charges or patterns that may indicate fraud.
            We recommend contacting your healthcare provider and insurance company.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFraudAlert}>Close</Button>
          <Button variant="contained" color="primary">
            Report Issue
          </Button>
          <Button variant="contained" color="error">
            Dispute Bill
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BillingDetails; 