import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Box,
  Alert,
  Typography,
  LinearProgress
} from '@mui/material';
import Webcam from 'react-webcam';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { ethers } from 'ethers';

const steps = ['License Verification', 'ID Upload', 'Live Photo', 'Blockchain Verification'];

export default function DoctorVerification({ open, onClose, onVerified, patientAadhaar }) {
  const [activeStep, setActiveStep] = useState(0);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const uploadToMongoDB = async (photo) => {
    const formData = new FormData();
    formData.append('image', photo);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading to MongoDB:', error);
      throw error;
    }
  };

  const handleVerification = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Upload photos to MongoDB
      const idPhotoUrl = await uploadToMongoDB(idPhoto);
      const livePhotoUrl = await uploadToMongoDB(livePhoto);

      // 2. Connect to smart contract
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      //const provider = new ethers.providers.Web3Provider(window.ethereum);

      // 3. Save verification data to backend
      const response = await fetch('/api/doctors/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseNumber,
          idPhotoUrl,
          livePhotoUrl,
          patientAadhaar
        })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      onVerified(true);
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = () => {
    const photo = webcamRef.current.getScreenshot();
    setLivePhoto(photo);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleVerification();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Secure Doctor Verification</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, minHeight: '200px' }}>
          {activeStep === 0 && (
            <TextField
              fullWidth
              label="Medical License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              error={!licenseNumber}
              helperText={!licenseNumber ? 'License number is required' : ''}
            />
          )}

          {activeStep === 1 && (
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdPhoto(e.target.files[0])}
                style={{ display: 'none' }}
                id="id-photo-upload"
              />
              <label htmlFor="id-photo-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CameraIcon />}
                >
                  Upload ID Photo
                </Button>
              </label>
              {idPhoto && (
                <Typography sx={{ mt: 1 }}>
                  Selected: {idPhoto.name}
                </Typography>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
              />
              <Button
                onClick={handleCapture}
                variant="contained"
                startIcon={<CameraIcon />}
                sx={{ mt: 2 }}
              >
                Capture
              </Button>
              {livePhoto && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={livePhoto}
                    alt="Captured"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Box>
          )}

          {activeStep === 3 && loading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
              <Typography sx={{ mt: 2 }}>
                Verifying credentials...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading || 
            (activeStep === 0 && !licenseNumber) ||
            (activeStep === 1 && !idPhoto) ||
            (activeStep === 2 && !livePhoto)
          }
        >
          {activeStep === steps.length - 1 ? 'Verify' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}