import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Tooltip,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Share as ShareIcon,
  InsertDriveFile as DocumentIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadBox = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Mock data for patient records
const MOCK_RECORDS = [
  {
    id: 'REC-001',
    name: 'Blood Test Results.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2023-10-15',
    hospital: 'City Memorial Hospital',
    category: 'Laboratory',
    shared: false,
    verified: true,
    transactionHash: '0xabc123...'
  },
  {
    id: 'REC-002',
    name: 'X-Ray Image.jpg',
    type: 'image',
    size: '3.1 MB',
    uploadDate: '2023-09-22',
    hospital: 'Metro Healthcare',
    category: 'Radiology',
    shared: true,
    verified: true,
    transactionHash: '0xdef456...'
  },
  {
    id: 'REC-003',
    name: 'Prescription.pdf',
    type: 'pdf',
    size: '0.8 MB',
    uploadDate: '2023-11-05',
    hospital: 'City Memorial Hospital',
    category: 'Medication',
    shared: false,
    verified: false,
    transactionHash: ''
  }
];

const RECORD_CATEGORIES = [
  'Laboratory',
  'Radiology',
  'Medication',
  'Surgery',
  'Consultation',
  'Vaccination',
  'Allergy',
  'Other'
];

const PatientRecordsUpload = () => {
  const [records, setRecords] = useState(MOCK_RECORDS);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [recordDetailsDialogOpen, setRecordDetailsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecordData, setNewRecordData] = useState({
    name: '',
    category: '',
    hospital: '',
    description: ''
  });
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewRecordData({
        ...newRecordData,
        name: file.name
      });
      setUploadDialogOpen(true);
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      setNewRecordData({
        ...newRecordData,
        name: file.name
      });
      setUploadDialogOpen(true);
    }
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRecordData({
      ...newRecordData,
      [name]: value
    });
  };

  // Submit record upload
  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Add new record to the list
            const newRecord = {
              id: `REC-00${records.length + 1}`,
              name: selectedFile.name,
              type: selectedFile.name.split('.').pop().toLowerCase(),
              size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split('T')[0],
              hospital: newRecordData.hospital,
              category: newRecordData.category,
              shared: false,
              verified: false,
              transactionHash: ''
            };
            
            setRecords([newRecord, ...records]);
            setIsUploading(false);
            setUploadDialogOpen(false);
            setSelectedFile(null);
            setNewRecordData({
              name: '',
              category: '',
              hospital: '',
              description: ''
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // View record details
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setRecordDetailsDialogOpen(true);
  };

  // Delete record
  const handleDeleteRecord = (recordId) => {
    setRecords(records.filter(record => record.id !== recordId));
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon color="primary" />;
      default:
        return <DocumentIcon color="action" />;
    }
  };

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FileIcon sx={{ mr: 1 }} />
            Patient Records
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            All records are securely stored and encrypted on the blockchain for privacy.
          </Alert>
          
          {/* Upload area */}
          <UploadBox
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            component={Box}
            sx={{ mb: 3 }}
          >
            <UploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop Files Here
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<UploadIcon />}
            >
              Browse Files
              <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supported formats: PDF, JPG, PNG (max 10MB)
            </Typography>
          </UploadBox>
          
          {/* Records list */}
          <List sx={{ mt: 2 }}>
            {records.map((record) => (
              <ListItem
                key={record.id}
                sx={{ 
                  mb: 1, 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  {getFileIcon(record.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {record.name}
                      {record.verified && (
                        <Tooltip title="Verified on Blockchain">
                          <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" component="span">
                        {record.uploadDate} • {record.size} • {record.hospital}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={record.category} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 1 }}
                        />
                        {record.shared && (
                          <Chip 
                            icon={<ShareIcon />} 
                            label="Shared" 
                            size="small"
                            color="info"
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="view"
                    onClick={() => handleViewRecord(record)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => !isUploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Medical Record</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">
                Selected File: {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Record Category</InputLabel>
            <Select
              name="category"
              value={newRecordData.category}
              label="Record Category"
              onChange={handleInputChange}
              disabled={isUploading}
            >
              {RECORD_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            label="Healthcare Facility"
            name="hospital"
            value={newRecordData.hospital}
            onChange={handleInputChange}
            fullWidth
            disabled={isUploading}
          />
          
          <TextField
            margin="normal"
            label="Description (Optional)"
            name="description"
            value={newRecordData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={2}
            disabled={isUploading}
          />
          
          {isUploading && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                Uploading and encrypting record... {uploadProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LockIcon fontSize="small" sx={{ mr: 0.5 }} />
                Your data is being encrypted and secured on the blockchain
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUploadDialogOpen(false)} 
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            disabled={isUploading || !newRecordData.category || !newRecordData.hospital}
            startIcon={<UploadIcon />}
          >
            Upload Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Details Dialog */}
      <Dialog
        open={recordDetailsDialogOpen}
        onClose={() => setRecordDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedRecord && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
              {getFileIcon(selectedRecord.type)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedRecord.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Upload Date" 
                    secondary={selectedRecord.uploadDate} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="File Size" 
                    secondary={selectedRecord.size} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Category" 
                    secondary={selectedRecord.category} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Healthcare Facility" 
                    secondary={selectedRecord.hospital} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Blockchain Verification" 
                    secondary={
                      selectedRecord.verified 
                        ? `Verified (TX: ${selectedRecord.transactionHash})` 
                        : "Not verified yet"
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Sharing Status" 
                    secondary={
                      <Chip 
                        icon={selectedRecord.shared ? <ShareIcon /> : <LockIcon />}
                        label={selectedRecord.shared ? "Shared with doctors" : "Private"}
                        color={selectedRecord.shared ? "primary" : "default"}
                        size="small"
                      />
                    } 
                  />
                </ListItem>
              </List>
              
              {!selectedRecord.verified && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This record is not yet verified on the blockchain. Verification adds an extra layer of security and authenticity.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRecordDetailsDialogOpen(false)}>
                Close
              </Button>
              {!selectedRecord.verified && (
                <Button variant="outlined" startIcon={<VerifiedIcon />}>
                  Verify on Blockchain
                </Button>
              )}
              <Button 
                variant="contained" 
                startIcon={selectedRecord.shared ? <LockIcon /> : <ShareIcon />}
                color={selectedRecord.shared ? "secondary" : "primary"}
              >
                {selectedRecord.shared ? "Make Private" : "Share Record"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PatientRecordsUpload; 